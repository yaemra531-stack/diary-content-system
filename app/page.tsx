import {requireChatGPTUser} from "./chatgpt-auth";
import Workbench from "./workbench";
export const dynamic="force-dynamic";
export default async function Page(){const user=await requireChatGPTUser("/");return <Workbench userId={user.userId}/>;}
