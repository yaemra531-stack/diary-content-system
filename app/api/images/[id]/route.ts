import {ApiError,bucket,db,handle,owner} from "@/lib/server";
export async function GET(request:Request,{params}:{params:Promise<{id:string}>}){return handle(async()=>{
 const user=await owner(request),{id}=await params;
 const image=await db().prepare("SELECT mime,data FROM images WHERE id=? AND owner=?").bind(id,user).first<{mime:string;data?:Uint8Array}>();
 if(!image)throw new ApiError("图片不存在。",404);
 if(image.data)return new Response(image.data,{headers:{"Content-Type":image.mime,"Cache-Control":"public, max-age=31536000","X-Content-Type-Options":"nosniff"}});
 if(bucket()){
  const object=await bucket().get(`${user}/${id}`);
  if(object)return new Response(object.body,{headers:{"Content-Type":image.mime,"Cache-Control":"private, no-store","X-Content-Type-Options":"nosniff"}});
 }
 throw new ApiError("图片暂时无法读取。",404);
});}
