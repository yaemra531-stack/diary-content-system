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

export function diaryPrompt(notes:Note[]) {
  return `请帮我把下面的真实学习记录整理成一篇自然的日记型小红书草稿。先读原始记录，若缺少必要细节，先问我最多两个具体问题。不要编造经历、结果或感受，不要把暂时的发现夸大成方法论。用我和朋友聊天的语气，先写 3—5 句话，不强行升华。保留原始事实。\n\n${notes.map(n=>`【${categoryName(n.category)} · ${new Date(n.created_at).toLocaleDateString("zh-CN")}】\n${n.content}${n.images.length?"\n（本条附有图片，若需要请让我补充图片内容。）":""}`).join("\n\n")}`;
}

export function exportNotesToMarkdown(notes: Note[], options: { dateStr?: string; includePrompt?: boolean } = {}) {
  const { dateStr, includePrompt = true } = options;
  const now = new Date();
  const exportDate = dateStr || `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;

  const grouped: Record<string, Note[]> = {};
  categories.forEach(c => {
    grouped[c.id] = [];
  });

  notes.forEach(n => {
    if (!grouped[n.category]) grouped[n.category] = [];
    grouped[n.category].push(n);
  });

  const totalNotes = notes.length;
  const starredNotes = notes.filter(n => n.starred).length;
  const activeCategories = categories.filter(c => grouped[c.id].length > 0);
  const catSummary = activeCategories.map(c => `${c.name} (${grouped[c.id].length})`).join(' · ');

  let md = `# 雅思备考素材池 · ${exportDate}\n\n`;
  md += `> **数据统计**：共 ${totalNotes} 条记录 ｜ 涵盖板块：${catSummary || '无'} ｜ ⭐ 星标留待展开：${starredNotes} 条\n`;
  md += `> **导出时间**：${now.toLocaleString('zh-CN', { hour12: false })}\n\n`;
  md += `---\n\n`;

  if (totalNotes === 0) {
    md += `*（所选范围内暂无记录）*\n\n`;
  } else {
    activeCategories.forEach(c => {
      const cNotes = grouped[c.id];
      md += `## 【${c.name}】(${cNotes.length} 条)\n\n`;
      cNotes.forEach((n, idx) => {
        const time = new Date(n.created_at).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false });
        const star = n.starred ? ' ⭐ [留待展开]' : '';
        const img = n.images.length > 0 ? ` 📷 [附${n.images.length}张图片]` : '';
        md += `### ${idx + 1}. [${time}]${star}${img}\n`;
        md += `${n.content.trim()}\n\n`;
      });
    });
  }

  if (includePrompt) {
    md += `---\n\n`;
    md += `### 🤖 Agent 一键整理指令（可直接复制发给 AI）\n\n`;
    md += `> “请阅读以上我记录的雅思备考原始素材（重点参考带有 ⭐ 星标的条目），挑出 1~2 个最真实生动、有冲突感或有实用价值的卡点/发现，遵循我们的《日记型内容系统》与《瓦斯创作者标准》，以第一人称‘懂懂日记’式轻松拉家常的语气，整理为 3~5 句话的成型小红书日记草稿。保留原始经历与事实，不要过度编造，不要空洞升华。”\n`;
  }

  return md;
}

// --- 21天写作挑战 ---
export type ChallengeEntry = {
  day: number;
  title: string;
  type: 'pain' | 'discovery'; // pain=卡点, discovery=发现
  week: string;
};

export const challengeTopics: ChallengeEntry[] = [
  // 第一周：起步与规划
  { day:1,  title:'自学雅思第一周我只做3件事',         type:'discovery', week:'起步与规划' },
  { day:2,  title:'别再收藏攻略了先做这一件事',         type:'pain',      week:'起步与规划' },
  { day:3,  title:'自学雅思我买了7本书只用上2本',       type:'discovery', week:'起步与规划' },
  { day:4,  title:'雅思从0到出分一张图讲清',           type:'discovery', week:'起步与规划' },
  { day:5,  title:'我自学到6.5一共花了多少小时',       type:'pain',      week:'起步与规划' },
  { day:6,  title:'这份一周计划表我抄了3个月',         type:'discovery', week:'起步与规划' },
  { day:7,  title:'基础差的人要多久考到6.5',           type:'pain',      week:'起步与规划' },
  // 第二周：单词与记忆
  { day:8,  title:'很火的背单词法为什么对我没用',       type:'pain',      week:'单词与记忆' },
  { day:9,  title:'抄了一整本单词书我还是忘',           type:'pain',      week:'单词与记忆' },
  { day:10, title:'单词按字母背到一半全搅浑',           type:'pain',      week:'单词与记忆' },
  { day:11, title:'单词别零着背要按场景分',             type:'discovery', week:'单词与记忆' },
  { day:12, title:'一小时记不住10个单词不是不用心',     type:'pain',      week:'单词与记忆' },
  { day:13, title:'背单词背到上头那一刻怎么办',         type:'pain',      week:'单词与记忆' },
  { day:14, title:'底子差别再抄单词了试试这个',         type:'discovery', week:'单词与记忆' },
  // 第三周：AI 工具与方法
  { day:15, title:'用AI学英语30天哪些有用哪些没用',     type:'discovery', week:'AI 工具与方法' },
  { day:16, title:'学英语我会用的5条AI指令',           type:'discovery', week:'AI 工具与方法' },
  { day:17, title:'让AI把单词写进文章里背',             type:'discovery', week:'AI 工具与方法' },
  { day:18, title:'把单词丢给AI要派生词和易混词',       type:'discovery', week:'AI 工具与方法' },
  { day:19, title:'我让AI把作文改成能模仿的版本',       type:'discovery', week:'AI 工具与方法' },
  { day:20, title:'自学雅思没人问我把AI当老师',         type:'discovery', week:'AI 工具与方法' },
  { day:21, title:'用AI学雅思卡在了第一步',             type:'pain',      week:'AI 工具与方法' },
  // 第四周：听说读写与情绪
  { day:22, title:'雅思口语每天10分钟怎么练',           type:'discovery', week:'听说读写与情绪' },
  { day:23, title:'雅思听力听不懂其实分三种',           type:'discovery', week:'听说读写与情绪' },
  { day:24, title:'单词都认识但说不出为什么',           type:'pain',      week:'听说读写与情绪' },
  { day:25, title:'作文没人改我让AI逐句批',             type:'discovery', week:'听说读写与情绪' },
  { day:26, title:'坚持不下去那天我是怎么回来的',       type:'pain',      week:'听说读写与情绪' },
  { day:27, title:'想放弃雅思前先试这个最低方案',       type:'discovery', week:'听说读写与情绪' },
  { day:28, title:'不靠意志力我怎么坚持下来的',         type:'discovery', week:'听说读写与情绪' },
  // 收尾加餐
  { day:29, title:'在职备考碎片时间怎么背单词',         type:'pain',      week:'收尾加餐' },
  { day:30, title:'在阅读里背单词记得牢得多',           type:'discovery', week:'收尾加餐' },
];

// --- 用户自建选题（知乎 / 小红书）---
export type SourceTopicItem = {
  id: number;
  title: string;
  order: number;
};
