export const categories = [
 {id:"vocabulary",name:"单词",en:"WORDS",hint:"哪个词，让你停了一下？",prompt:"记下一个词、一个语境，或刚才突然明白的意思。"},
 {id:"listening",name:"听力",en:"LISTENING",hint:"刚才哪里没听出来？",prompt:"一个反复听的句子，一次终于听懂的瞬间，都可以。"},
 {id:"reading",name:"阅读",en:"READING",hint:"今天读到什么，想留下来？",prompt:"一句有意思的话，一个定位过程，或还没想通的地方。"},
 {id:"speaking",name:"口语",en:"SPEAKING",hint:"刚才想说什么，又卡在了哪里？",prompt:"留下真实的表达，结巴和小进步都值得记。"},
 {id:"writing",name:"写作",en:"WRITING",hint:"今天写的时候，发现了什么？",prompt:"一个修改前后的句子，或一次组织思路的尝试。"},
 {id:"other",name:"其他心得",en:"MOMENTS",hint:"还有什么，想先放在这里？",prompt:"学习以外的小发现、工作中的卡点，或者此刻的想法。"},
] as const;
export type Category = typeof categories[number]["id"];
export type Note = {id:string;category:Category;content:string;starred:number;created_at:string;updated_at:string;images:{id:string;name:string}[]};
export type Draft = {id:string;title:string;content:string;source_ids:string;created_at:string;updated_at:string};
export const categoryName = (id:string)=>categories.find(c=>c.id===id)?.name??id;
export function diaryPrompt(notes:Note[]) { return `请帮我把下面的真实学习记录整理成一篇自然的日记型小红书草稿。先读原始记录，若缺少必要细节，先问我最多两个具体问题。不要编造经历、结果或感受，不要把暂时的发现夸大成方法论。用我和朋友聊天的语气，先写 3—5 句话，不强行升华。保留原始事实。\n\n${notes.map(n=>`【${categoryName(n.category)} · ${new Date(n.created_at).toLocaleDateString("zh-CN")}】\n${n.content}${n.images.length?"\n（本条附有图片，若需要请让我补充图片内容。）":""}`).join("\n\n")}`; }
