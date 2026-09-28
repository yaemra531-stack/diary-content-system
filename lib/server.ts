import { env } from "cloudflare:workers";
import { getChatGPTUser } from "@/app/chatgpt-auth";
export function db() {if(!env.DB)throw new Error("Database unavailable");return env.DB;}
export function bucket() {return (env as any).BUCKET || null;}
export class ApiError extends Error {constructor(message:string,public status=400){super(message);}}
export async function owner(request:Request) {
 const user=await getChatGPTUser();
 if(!user)throw new ApiError("登录后才能读取和保存记录。",401);
 return user.userId;
}
export async function handle(fn:()=>Promise<Response>){try{return await fn();}catch(e){
 if(e instanceof ApiError)return Response.json({error:e.message},{status:e.status});
 console.error("Diary request failed",e);return Response.json({error:"暂时连接不上，请稍后重试。你的输入会保留。"},{status:503});
}}
export const uuid=(s:unknown):s is string=>typeof s==="string"&&/^[0-9a-f-]{36}$/i.test(s);
