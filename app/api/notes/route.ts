import {ApiError,bucket,db,handle,owner,uuid} from "@/lib/server";
import {categories} from "@/lib/diary";
export async function GET(request:Request){return handle(async()=>{
 const user=await owner(request);
 const records=await db().prepare("SELECT * FROM notes WHERE owner=? ORDER BY created_at DESC").bind(user).all();
 const images=await db().prepare("SELECT id,note_id,name FROM images WHERE owner=?").bind(user).all();
 return Response.json({notes:records.results.map(n=>({...n,images:images.results.filter(i=>i.note_id===n.id)}))},{headers:{"Cache-Control":"no-store"}});
});}
export async function POST(request:Request){return handle(async()=>{
 const user=await owner(request);
 if(Number(request.headers.get("content-length"))>26*1024*1024)throw new ApiError("图片总大小不能超过 24 MB。");
 const form=await request.formData(),id=form.get("id"),category=form.get("category"),content=String(form.get("content")??"").trim();
 const files=form.getAll("images").filter((f):f is File=>f instanceof File&&f.size>0);
 if(!uuid(id)||!categories.some(c=>c.id===category))throw new ApiError("请选择一个板块后重试。");
 if((!content&&!files.length)||content.length>10000)throw new ApiError("写下一点想法或添加图片，文字不超过 10000 字。");
 if(files.length>6||files.reduce((s,f)=>s+f.size,0)>24*1024*1024||files.some(f=>f.size>8*1024*1024||!["image/jpeg","image/png","image/webp","image/gif"].includes(f.type)))throw new ApiError("最多 6 张 JPG、PNG、WebP 或 GIF，每张不超过 8 MB，总计不超过 24 MB。");
 if(await db().prepare("SELECT id FROM notes WHERE id=? AND owner=?").bind(id,user).first())return Response.json({id});
 const now=new Date().toISOString(),uploaded:string[]=[];
 try{
  const statements=[db().prepare("INSERT INTO notes(id,owner,category,content,created_at,updated_at) VALUES(?,?,?,?,?,?)").bind(id,user,category,content,now,now)];
  for(let i=0;i<files.length;i++){
   const file=files[i],imageId=`${id}-${i}`,bytes=new Uint8Array(await file.arrayBuffer());
   const valid=(file.type==="image/jpeg"&&bytes[0]===255&&bytes[1]===216)||(file.type==="image/png"&&bytes[0]===137&&bytes[1]===80&&bytes[2]===78&&bytes[3]===71)||(file.type==="image/gif"&&String.fromCharCode(...bytes.slice(0,3))==="GIF")||(file.type==="image/webp"&&String.fromCharCode(...bytes.slice(0,4))==="RIFF"&&String.fromCharCode(...bytes.slice(8,12))==="WEBP");
   if(!valid)throw new ApiError("有一张图片格式无法识别，请重新选择。");
   await bucket().put(`${user}/${imageId}`,bytes,{httpMetadata:{contentType:file.type}});uploaded.push(`${user}/${imageId}`);
   statements.push(db().prepare("INSERT INTO images(id,note_id,owner,mime,name) VALUES(?,?,?,?,?)").bind(imageId,id,user,file.type,file.name.slice(0,200)));
  }
  await db().batch(statements);
 }catch(e){
  if(await db().prepare("SELECT id FROM notes WHERE id=? AND owner=?").bind(id,user).first())return Response.json({id});
  if(uploaded.length)await bucket().delete(uploaded);throw e;
 }
 return Response.json({id},{status:201});
});}
export async function PATCH(request:Request){return handle(async()=>{
 const user=await owner(request),body=await request.json() as {id:string;starred?:boolean;content?:string};
 if(!uuid(body.id))throw new ApiError("记录不存在。");
 if(!await db().prepare("SELECT id FROM notes WHERE id=? AND owner=?").bind(body.id,user).first())throw new ApiError("记录不存在。",404);
 if(typeof body.starred==="boolean")await db().prepare("UPDATE notes SET starred=?,updated_at=? WHERE id=? AND owner=?").bind(body.starred?1:0,new Date().toISOString(),body.id,user).run();
 else if(typeof body.content==="string"&&body.content.trim()&&body.content.length<=10000)await db().prepare("UPDATE notes SET content=?,updated_at=? WHERE id=? AND owner=?").bind(body.content.trim(),new Date().toISOString(),body.id,user).run();
 else throw new ApiError("内容不能为空，且不能超过 10000 字。");
 return Response.json({ok:true});
});}
