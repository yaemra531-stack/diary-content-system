import {ApiError,db,handle,owner,uuid} from "@/lib/server";
export async function GET(request:Request){return handle(async()=>{
 const user=await owner(request),rows=await db().prepare("SELECT * FROM drafts WHERE owner=? ORDER BY updated_at DESC").bind(user).all();
 return Response.json({drafts:rows.results},{headers:{"Cache-Control":"no-store"}});
});}
export async function POST(request:Request){return handle(async()=>{
 const user=await owner(request),body=await request.json() as {id:string;title:string;content:string;sourceIds:string[]};
 if(!uuid(body.id)||typeof body.title!=="string"||body.title.length>100||typeof body.content!=="string"||!body.content.trim()||body.content.length>20000||!Array.isArray(body.sourceIds)||body.sourceIds.length>30||body.sourceIds.some(id=>!uuid(id)))throw new ApiError("请填写日记内容，标题不超过 100 字，正文不超过 20000 字，最多选择 30 条素材。");
 for(const id of body.sourceIds)if(!await db().prepare("SELECT id FROM notes WHERE id=? AND owner=?").bind(id,user).first())throw new ApiError("有一条原始记录无法读取。",403);
 const now=new Date().toISOString(),existing=await db().prepare("SELECT owner FROM drafts WHERE id=?").bind(body.id).first<{owner:string}>();
 if(existing&&existing.owner!==user)throw new ApiError("无法保存这篇草稿。",403);
 await db().prepare("INSERT INTO drafts(id,owner,title,content,source_ids,created_at,updated_at) VALUES(?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET title=excluded.title,content=excluded.content,source_ids=excluded.source_ids,updated_at=excluded.updated_at WHERE drafts.owner=excluded.owner").bind(body.id,user,body.title.trim()||"未命名日记",body.content.trim(),JSON.stringify(body.sourceIds),now,now).run();
 return Response.json({id:body.id});
});}
