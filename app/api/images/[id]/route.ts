import {ApiError,bucket,db,handle,owner} from "@/lib/server";
export async function GET(request:Request,{params}:{params:Promise<{id:string}>}){return handle(async()=>{
 const user=await owner(request),{id}=await params;
 const image=await db().prepare("SELECT mime FROM images WHERE id=? AND owner=?").bind(id,user).first<{mime:string}>();
 if(!image)throw new ApiError("图片不存在。",404);
 const object=await bucket().get(`${user}/${id}`);if(!object)throw new ApiError("图片暂时无法读取。",404);
 return new Response(object.body,{headers:{"Content-Type":image.mime,"Cache-Control":"private, no-store","X-Content-Type-Options":"nosniff"}});
});}
