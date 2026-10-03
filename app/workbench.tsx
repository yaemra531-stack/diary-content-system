"use client";
import {useEffect,useRef,useState,useCallback} from 'react';
import {BookOpen,Headphones,ScanText,Mic,PenLine,Lightbulb,Plus,ArrowUpRight,ArrowRight,ImagePlus,Bookmark,Check,NotebookPen,CloudCheck,X,LoaderCircle,Copy,RefreshCw,CalendarDays,LockKeyhole,Sun,Moon,Sparkles,Download,FileDown,Target,ChevronDown,ChevronUp} from 'lucide-react';
import {Tabs,TabsList,TabsTrigger,TabsContent} from '@/components/ui/tabs';
import {Dialog,DialogContent,DialogTitle,DialogDescription} from '@/components/ui/dialog';
import {Checkbox} from '@/components/ui/checkbox';
import {Select,SelectTrigger,SelectValue,SelectContent,SelectItem} from '@/components/ui/select';
import {Toaster} from '@/components/ui/sonner';
import {toast} from 'sonner';
import {categories,categoryName,diaryPrompt,exportNotesToMarkdown,challengeTopics,type Category,type Note,type Draft,type ChallengeEntry} from '@/lib/diary';
import {readPending,writePending,type PendingNotes} from '@/lib/pending';
import {marked} from 'marked';
const icons=[BookOpen,Headphones,ScanText,Mic,PenLine,Lightbulb];
type Editor={id:string;title:string;content:string;sourceIds:string[]};
async function api<T>(url:string,options?:RequestInit):Promise<T>{const res=await fetch(url,options);const data=await res.json() as T & {error?:string};if(!res.ok)throw new Error(data.error||'暂时无法保存，请重试。');return data;}
const errorText=(e:unknown)=>e instanceof Error?e.message:'暂时连接不上，请重试。';
const localDate=(s:string)=>{const d=new Date(s);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;};
function Attachment({file,remove}:{file:File;remove:()=>void}){const [url,setUrl]=useState('');useEffect(()=>{const u=URL.createObjectURL(file);setUrl(u);return()=>URL.revokeObjectURL(u);},[file]);return <div className="attachment">{url&&<img src={url} alt={file.name}/>}<button type="button" aria-label={`移除图片 ${file.name}`} onClick={remove}><X size={14}/></button></div>;}
export default function Workbench({userId}:{userId:string}){
 const [view,setView]=useState('capture'),[category,setCategory]=useState<Category>('vocabulary');
 const [pending,setPending]=useState<PendingNotes>({}),[hydrated,setHydrated]=useState(false),[tempSaved,setTempSaved]=useState(false),[storageError,setStorageError]=useState(false);
 const [notes,setNotes]=useState<Note[]>([]),[drafts,setDrafts]=useState<Draft[]>([]),[loading,setLoading]=useState(true),[loadError,setLoadError]=useState(''),[saving,setSaving]=useState(false);
 const [filter,setFilter]=useState('all'),[date,setDate]=useState(''),[reviewTab,setReviewTab]=useState('all'),[selected,setSelected]=useState<string[]>([]);
 const [editor,setEditor]=useState<Editor|null>(null),[editorOpen,setEditorOpen]=useState(false),[editorSaving,setEditorSaving]=useState(false),[editorSaved,setEditorSaved]=useState(false);
 const [editNote,setEditNote]=useState<Note|null>(null),[editText,setEditText]=useState(''),[editSaving,setEditSaving]=useState(false),[image,setImage]=useState<string|null>(null),[today,setToday]=useState('');
 const [pendingStars,setPendingStars]=useState<string[]>([]);
 const [theme,setTheme]=useState<'light'|'dark'>('light');
 const [exportOpen,setExportOpen]=useState(false),[exportScope,setExportScope]=useState<'today'|'yesterday'|'all'|'starred'|'custom'>('today');
 const [exportCustomDate,setExportCustomDate]=useState(()=>localDate(new Date().toISOString())),[includeAgentPrompt,setIncludeAgentPrompt]=useState(true);
 const [challengeDone,setChallengeDone]=useState<Record<number,string>>({}),[challengeExpanded,setChallengeExpanded]=useState<string|null>(null);
 const [challengeTitles,setChallengeTitles]=useState<Record<number,string>>({});
 const [challengePriorities,setChallengePriorities]=useState<Record<number,number>>({});
 const [challengePriority,setChallengePriority]=useState<number>(0);
 const [challengeTypes,setChallengeTypes]=useState<Record<number,'pain'|'discovery'|'thought'>>({});
 const [challengeType,setChallengeType]=useState<'pain'|'discovery'|'thought'>('pain');
 const [challengeFilter,setChallengeFilter]=useState<'all'|'p3'|'p2'|'p1'|'todo'>('all');
 const [sortByPriority,setSortByPriority]=useState<boolean>(false);
 const [challengeEditorOpen,setChallengeEditorOpen]=useState(false),[challengeDay,setChallengeDay]=useState<number|null>(null),[challengeTitle,setChallengeTitle]=useState(''),[challengeText,setChallengeText]=useState('');
 useEffect(()=>{
  try {
   const saved=localStorage.getItem('xuejian_theme');
   if(saved==='dark'||(!saved&&window.matchMedia('(prefers-color-scheme: dark)').matches)){
    setTheme('dark');
    document.documentElement.classList.add('dark');
   }else{
    setTheme('light');
    document.documentElement.classList.remove('dark');
   }
  }catch(e){}
 },[]);
 const toggleTheme=()=>{
  const next=theme==='dark'?'light':'dark';
  setTheme(next);
  try{localStorage.setItem('xuejian_theme',next);}catch(e){}
  if(next==='dark'){
   document.documentElement.classList.add('dark');
  }else{
   document.documentElement.classList.remove('dark');
  }
 };
 const fileInput=useRef<HTMLInputElement>(null),textInput=useRef<HTMLTextAreaElement>(null),requestLock=useRef(false);
 useEffect(()=>{
  try{
   const savedDone=localStorage.getItem(`challenge-done-${userId}`);
   if(savedDone)setChallengeDone(JSON.parse(savedDone));
   const savedTitles=localStorage.getItem(`challenge-titles-${userId}`);
   if(savedTitles)setChallengeTitles(JSON.parse(savedTitles));
   const savedPriorities=localStorage.getItem(`challenge-priorities-${userId}`);
   if(savedPriorities)setChallengePriorities(JSON.parse(savedPriorities));
   const savedTypes=localStorage.getItem(`challenge-types-${userId}`);
   if(savedTypes)setChallengeTypes(JSON.parse(savedTypes));
  }catch{}
 },[userId]);
 const setTopicPriority=(day:number,priority:number)=>{
  const next={...challengePriorities};
  if(priority===0){delete next[day];}else{next[day]=priority;}
  setChallengePriorities(next);
  try{localStorage.setItem(`challenge-priorities-${userId}`,JSON.stringify(next));}catch{}
 };
 const saveChallengeDay=(day:number,title:string,text:string)=>{
  const nextDone={...challengeDone,[day]:text};
  setChallengeDone(nextDone);
  try{localStorage.setItem(`challenge-done-${userId}`,JSON.stringify(nextDone));}catch{}
  if(title){
   const nextTitles={...challengeTitles,[day]:title};
   setChallengeTitles(nextTitles);
   try{localStorage.setItem(`challenge-titles-${userId}`,JSON.stringify(nextTitles));}catch{}
  }
 };
 const removeChallengeDay=(day:number)=>{const next={...challengeDone};delete next[day];setChallengeDone(next);try{localStorage.setItem(`challenge-done-${userId}`,JSON.stringify(next));}catch{}};
 const openChallengeEditor=(day:number)=>{
  setChallengeDay(day);
  setChallengeTitle(challengeTitles[day]||challengeTopics.find(t=>t.day===day)?.title||'');
  setChallengeText(challengeDone[day]||'');
  setChallengePriority(challengePriorities[day]||0);
  const defType = (challengeTopics.find(t=>t.day===day)?.type || 'pain') as 'pain'|'discovery'|'thought';
  setChallengeType(challengeTypes[day]||defType);
  setChallengeEditorOpen(true);
 };
 const doneCount=Object.keys(challengeDone).length;
 const weeks=[...new Set(challengeTopics.map(t=>t.week))];
 const cat=categories.find(c=>c.id===category)!,item=pending[category]??{id:'',content:'',files:[]};
 const reload=useCallback(async()=>{try{const [n,d]=await Promise.all([api<{notes:Note[]}>('/api/notes'),api<{drafts:Draft[]}>('/api/drafts')]);setNotes(n.notes);setDrafts(d.drafts);setLoadError('');}catch(e){setLoadError(errorText(e));}finally{setLoading(false);}},[]);
 useEffect(()=>{setToday(new Date().toISOString());let active=true;readPending(userId).then(data=>{if(active)setPending(data);}).catch(()=>setStorageError(true)).finally(()=>{if(active)setHydrated(true);});try{const last=localStorage.getItem(`diary-category-${userId}`);if(categories.some(c=>c.id===last))setCategory(last as Category);const saved=localStorage.getItem(`diary-editor-${userId}`);if(saved)setEditor(JSON.parse(saved));}catch{setStorageError(true);}reload();const focus=()=>{setToday(new Date().toISOString());reload();};window.addEventListener('focus',focus);return()=>{active=false;window.removeEventListener('focus',focus);};},[userId,reload]);
 useEffect(()=>{if(!hydrated)return;setTempSaved(false);let active=true;writePending(userId,pending).then(()=>{if(active)setTempSaved(true);}).catch(()=>setStorageError(true));return()=>{active=false;};},[pending,hydrated,userId]);
 useEffect(()=>{if(!hydrated)return;try{if(editor)localStorage.setItem(`diary-editor-${userId}`,JSON.stringify(editor));else localStorage.removeItem(`diary-editor-${userId}`);}catch{setStorageError(true);}},[editor,hydrated,userId]);
 const changeCategory=(id:string)=>{setCategory(id as Category);try{localStorage.setItem(`diary-category-${userId}`,id);}catch{setStorageError(true);}};
 const updateItem=(patch:Partial<typeof item>)=>{setTempSaved(false);setPending(p=>({...p,[category]:{id:crypto.randomUUID(),content:p[category]?.content??'',files:p[category]?.files??[],...patch}}));};
 function addFiles(files:File[]){const all=[...item.files,...files];if(all.length>6||all.reduce((n,f)=>n+f.size,0)>24*1024*1024||files.some(f=>f.size>8*1024*1024||!['image/jpeg','image/png','image/webp','image/gif'].includes(f.type))){toast.error('最多 6 张 JPG、PNG、WebP 或 GIF，每张不超过 8 MB，总计不超过 24 MB。');return;}updateItem({files:all});}
 async function saveNote(){if(requestLock.current||(!item.content.trim()&&!item.files.length))return;requestLock.current=true;setSaving(true);const savingCat=category;try{const body=new FormData();body.set('id',item.id||crypto.randomUUID());body.set('category',category);body.set('content',item.content);item.files.forEach(f=>body.append('images',f));await api('/api/notes',{method:'POST',body});setPending(p=>{const next={...p};delete next[savingCat];return next;});toast.success('这一刻，留下来了');await reload();textInput.current?.focus();}catch(e){toast.error(errorText(e));}finally{setSaving(false);requestLock.current=false;}}
 async function star(note:Note){setPendingStars(p=>[...p,note.id]);try{await api('/api/notes',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:note.id,starred:!note.starred})});setNotes(p=>p.map(n=>n.id===note.id?{...n,starred:note.starred?0:1}:n));}catch(e){toast.error(errorText(e));}finally{setPendingStars(p=>p.filter(id=>id!==note.id));}}
 const exportNotes = (()=>{
  const todayStr=today?localDate(today):localDate(new Date().toISOString());
  const yest=new Date();yest.setDate(yest.getDate()-1);const yestStr=localDate(yest.toISOString());
  if(exportScope==='today')return notes.filter(n=>localDate(n.created_at)===todayStr);
  if(exportScope==='yesterday')return notes.filter(n=>localDate(n.created_at)===yestStr);
  if(exportScope==='starred')return notes.filter(n=>n.starred);
  if(exportScope==='custom')return notes.filter(n=>!exportCustomDate||localDate(n.created_at)===exportCustomDate);
  return notes;
 })();
 const exportDateLabel = exportScope==='today'?(today?localDate(today):localDate(new Date().toISOString())):exportScope==='yesterday'?(()=>{const d=new Date();d.setDate(d.getDate()-1);return localDate(d.toISOString());})():exportScope==='custom'?exportCustomDate:'全部历史';
 const generatedMarkdown = exportNotesToMarkdown(exportNotes,{dateStr:exportDateLabel,includePrompt:includeAgentPrompt});
 function downloadMarkdown(){
  const blob=new Blob([generatedMarkdown],{type:'text/markdown;charset=utf-8'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  const filename=`${exportDateLabel}-雅思备考素材池.md`;
  a.href=url;a.download=filename;document.body.appendChild(a);a.click();document.body.removeChild(a);
  URL.revokeObjectURL(url);
  toast.success(`已下载 ${filename}`);
 }
 async function copyExportMarkdown(){
  try{await navigator.clipboard.writeText(generatedMarkdown);toast.success('已复制 Markdown 到剪贴板，可直接发给 Agent！');}
  catch{toast.error('浏览器未允许剪贴板权限，请在下方文本框中手动选择复制。');}
 }
 function startDiary(ids:string[]){if(ids.length>30){toast.error('一次最多整理 30 条记录。');return;}if(editor&&!editorSaved&&(editor.content||editor.title)){setEditorOpen(true);toast.info('先完成或保存正在写的这篇日记，再整理新的素材。');return;}setEditor({id:crypto.randomUUID(),title:'',content:'',sourceIds:ids});setEditorSaved(false);setEditorOpen(true);}
 async function saveDiary(){if(!editor||editorSaving)return;setEditorSaving(true);try{await api('/api/drafts',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(editor)});setEditorSaved(true);toast.success('日记草稿已保存，原始记录也还在');await reload();}catch(e){toast.error(errorText(e));}finally{setEditorSaving(false);}}
 const changeEditor=(patch:Partial<Editor>)=>{setEditor(e=>e?{...e,...patch}:e);setEditorSaved(false);};
 async function copy(text:string){try{await navigator.clipboard.writeText(text);toast.success('已复制');}catch{toast.error('浏览器未允许复制，请手动选择文字复制。');}}
 const recent=notes.filter(n=>n.category===category).slice(0,4),todayNotes=notes.filter(n=>today&&localDate(n.created_at)===localDate(today));
 const filtered=notes.filter(n=>(filter==='all'||n.category===filter)&&(!date||localDate(n.created_at)===date)&&(reviewTab!=='starred'||n.starred));
 const sourceNotes=editor?editor.sourceIds.map(id=>notes.find(n=>n.id===id)).filter((n):n is Note=>!!n):[];
 function noteCard(note:Note,selectable=false){return <article className={`note-card ${selected.includes(note.id)&&selectable?'is-selected':''}`} key={note.id}>
  <div className="note-meta"><div className="row">{selectable&&<Checkbox className="note-checkbox" checked={selected.includes(note.id)} onCheckedChange={checked=>setSelected(p=>checked?[...p,note.id]:p.filter(id=>id!==note.id))} aria-label={`选择记录：${note.content.slice(0,20)||'图片记录'}`}/>}<span className="category-label">{categoryName(note.category)}</span><time dateTime={note.created_at}>{new Date(note.created_at).toLocaleString('zh-CN',{month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit',hour12:false})}</time></div><button className={`icon-button ${note.starred?'bookmarked':''}`} disabled={pendingStars.includes(note.id)} onClick={()=>star(note)} title={note.starred?'取消留待展开':'留待展开'} aria-label={note.starred?'取消留待展开':'留待展开'}><Bookmark size={18} fill={note.starred?'currentColor':'none'}/></button></div>
  {note.content&&<p className="note-content">{note.content}</p>}{note.images.length>0&&<div className="note-images">{note.images.map(i=><button key={i.id} onClick={()=>setImage(`/api/images/${i.id}`)} aria-label={`查看图片 ${i.name}`}><img src={`/api/images/${i.id}`} alt={i.name} loading="lazy"/></button>)}</div>}
  <div className="note-bottom"><button className="text-button muted" onClick={()=>{setEditNote(note);setEditText(note.content);}}>编辑记录</button><button className="text-button" onClick={()=>startDiary([note.id])}>拿来写日记 <ArrowUpRight size={15}/></button></div>
 </article>;}
 return <div className="app-shell"><Toaster position="top-center" theme={theme} richColors/>
  <Tabs value={view} onValueChange={setView} className="site-tabs">
   <header className="topbar"><a className="brand" href="/" aria-label="雅思日记首页"><span className="brand-mark"><NotebookPen size={22} strokeWidth={1.6}/></span><span>雅思日记<span className="brand-description">备考手记</span></span></a><TabsList className="main-nav"><TabsTrigger value="capture"><PenLine size={16}/>随手记</TabsTrigger><TabsTrigger value="review"><BookOpen size={16}/>回看整理</TabsTrigger><TabsTrigger value="challenge"><Target size={16}/>写作挑战</TabsTrigger></TabsList><div className="topbar-actions">
    <button type="button" className="theme-toggle-btn" onClick={toggleTheme} title={theme==='dark'?'切换为日间模式':'切换为夜间模式'} aria-label="切换夜间模式">
     {theme==='dark'?<Sun size={15}/>:<Moon size={15}/>}
     <span className="theme-toggle-text">{theme==='dark'?'夜间':'日间'}</span>
    </button>
    <span className="privacy"><LockKeyhole size={14}/>只属于你的手记</span>
   </div></header>
   <main className="main-wrap">
   {storageError&&<div className="notice error">本机暂存不可用，请及时点击保存，并保持页面打开。</div>}
   <TabsContent value="capture">
    <div className="page-heading"><div><p className="eyebrow">A LITTLE, EVERY DAY</p><h1>把刚才的想法，留下来。</h1></div><div className="date-label"><CalendarDays size={16}/><span>{today?new Date(today).toLocaleDateString('zh-CN',{month:'long',day:'numeric',weekday:'long'}):'今天'}</span></div></div>
    <div className="capture-grid"><section className="writing-column" aria-label="记录学习想法">
     <Tabs value={category} onValueChange={changeCategory} className="category-tabs"><TabsList className="category-list" aria-label="学习板块">{categories.map((c,i)=>{const Icon=icons[i];return <TabsTrigger key={c.id} value={c.id} disabled={saving}><Icon size={19}/><span>{c.name}</span></TabsTrigger>;})}</TabsList></Tabs>
     <div className="composer"><div className="composer-top"><span className="small-label">{cat.en} / {cat.name}</span><span className="paper-index">{String(categories.indexOf(cat)+1).padStart(2,'0')}</span></div><label htmlFor="note-text" className="composer-title">{cat.hint}</label><textarea ref={textInput} id="note-text" value={item.content} maxLength={10000} disabled={!hydrated||saving} placeholder={cat.prompt} onChange={e=>updateItem({content:e.target.value})} onPaste={e=>{if(saving)return;const files=Array.from(e.clipboardData.files).filter(f=>f.type.startsWith('image/'));if(files.length){e.preventDefault();addFiles(files);}}} onKeyDown={e=>{if((e.metaKey||e.ctrlKey)&&e.key==='Enter'){e.preventDefault();saveNote();}}}/>
      {item.files.length>0&&<div className="attachments">{item.files.map((f,i)=><Attachment key={`${f.name}-${i}`} file={f} remove={()=>{if(!saving)updateItem({files:item.files.filter((_,j)=>i!==j)});}}/>)}</div>}
      <div className="composer-footer"><input ref={fileInput} className="sr-only" type="file" multiple accept="image/jpeg,image/png,image/webp,image/gif" aria-label="选择图片" onChange={e=>{addFiles(Array.from(e.target.files??[]));e.target.value='';}}/><button className="text-button attach-button" disabled={saving||!hydrated} onClick={()=>fileInput.current?.click()}><ImagePlus size={18}/>添加图片</button><div className="save-controls"><span className="draft-status">{item.content||item.files.length?tempSaved?'已暂存于本机':'暂存中…':'⌘ / Ctrl + Enter'}</span><button className="primary-button" onClick={saveNote} disabled={!hydrated||saving||(!item.content.trim()&&!item.files.length)}>{saving?<LoaderCircle size={16} className="spin"/>:<Plus size={17}/>} {saving?'保存中':'保存记录'}</button></div></div>
     </div><div className="under-composer"><span>一句话就好，不必现在想明白。</span><span>{item.content.length?`${item.content.length} 字`:''}</span></div>
     <div className="section-heading"><h2>最近的{cat.name}记录 <span>{notes.filter(n=>n.category===category).length}</span></h2><button className="text-button" onClick={()=>{setView('review');setFilter(category);setReviewTab('all');}}>查看全部 <ArrowRight size={15}/></button></div>
     {loading?<div className="empty-state"><LoaderCircle className="spin" size={22}/><p>正在翻开手记…</p></div>:loadError?<div className="notice error">{loadError}<button className="text-button" onClick={reload}>重新读取</button></div>:recent.length?recent.map(n=>noteCard(n)):<div className="empty-state"><BookOpen size={28} strokeWidth={1.3}/><h3>这一页，还等着你的第一笔</h3><p>一次困惑、一个发现，都可以从这里开始。</p></div>}
    </section><aside className="daily-aside"><div className="aside-heading"><span>今天的手记</span><span className="mini-rule"/></div><div className="today-number">{String(todayNotes.length).padStart(2,'0')}<span>条记录</span></div><p className="aside-copy">学到哪里，就记到哪里。</p><div className="today-categories">{categories.map((c,i)=>{const Icon=icons[i],count=todayNotes.filter(n=>n.category===c.id).length;return <button key={c.id} onClick={()=>changeCategory(c.id)} disabled={saving}><span><Icon size={16}/>{c.name}</span><span className={count?'has-count':'no-count'}>{count||'—'}</span></button>;})}</div><div className="aside-guide-card">
     <div className="guide-card-header"><Sparkles size={15}/><span>记录指南 · 二选一</span></div>
     <p className="guide-card-intro">不限字数，只记真实：</p>
     <div className="guide-item">
      <span className="guide-pill badge-error">A. 记一个卡点</span>
      <p className="guide-desc">今天具体在哪里卡住了？</p>
      <div className="guide-quote">“比如：看着眼熟，但一做题还是对不上意思。”</div>
     </div>
     <div className="guide-item">
      <span className="guide-pill badge-success">B. 记一个发现</span>
      <p className="guide-desc">今天用 AI 试了什么招数灵验了？</p>
      <div className="guide-quote">“比如：把难词 4 个一组让 AI 生成剧情图，脑海里一下有画面了。”</div>
     </div>
     <p className="guide-foot">配 1~2 句话或 1 张截图即可交卷。</p>
    </div>
    <div className="aside-note"><Bookmark size={18}/><p>有些想法，<br/>过几天再看会更有意思。</p><button className="text-button" onClick={()=>{setView('review');setReviewTab('starred');setFilter('all');setDate('');}}>看看留待展开的记录 <ArrowUpRight size={15}/></button></div></aside></div>
   </TabsContent>
   <TabsContent value="review">
    <div className="page-heading"><div><p className="eyebrow">FROM MOMENTS TO STORIES</p><h1>回头看看，哪些值得讲。</h1><p className="heading-sub">挑出一条，或者几条有关联的记录，慢慢写成日记。</p></div><button className="outline-button" onClick={()=>setView('capture')}><Plus size={17}/>记一条新的</button></div>
    {editor&&!editorOpen&&<div className="resume-banner"><span><PenLine size={16}/>有一篇日记可以接着写</span><button className="text-button" onClick={()=>setEditorOpen(true)}>继续整理 <ArrowRight size={15}/></button></div>}
    <div className="review-toolbar"><Tabs value={reviewTab} onValueChange={setReviewTab}><TabsList className="review-tabs"><TabsTrigger value="all">全部记录 <span>{notes.length}</span></TabsTrigger><TabsTrigger value="starred">留待展开 <span>{notes.filter(n=>n.starred).length}</span></TabsTrigger><TabsTrigger value="drafts">日记草稿 <span>{drafts.length}</span></TabsTrigger></TabsList></Tabs><div className="review-toolbar-actions"><button type="button" className="export-trigger-btn" onClick={()=>setExportOpen(true)} title="汇总并导出 Markdown 素材"><Download size={14}/><span>导出 Markdown</span></button><button className="icon-button" onClick={reload} aria-label="刷新记录" title="刷新记录"><RefreshCw size={17}/></button></div></div>
    {reviewTab!=='drafts'&&<div className="filters"><Select value={filter} onValueChange={setFilter}><SelectTrigger aria-label="筛选板块" className="filter-select"><SelectValue/></SelectTrigger><SelectContent><SelectItem value="all">全部板块</SelectItem>{categories.map(c=><SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent></Select><label className="date-filter"><CalendarDays size={16}/><input aria-label="筛选日期" type="date" value={date} onChange={e=>setDate(e.target.value)}/></label>{(date||filter!=='all')&&<button className="text-button muted" onClick={()=>{setDate('');setFilter('all');}}>清除筛选</button>}<span className="filter-count">{filtered.length} 条记录</span></div>}
    {loadError?<div className="notice error">{loadError}<button className="text-button" onClick={reload}>重新读取</button></div>:loading?<div className="empty-state">正在读取…</div>:reviewTab==='drafts'?drafts.length?<div className="review-grid">{drafts.map(d=><article className="note-card diary-card" key={d.id}><div className="note-meta"><span className="category-label">日记草稿</span><time>{new Date(d.updated_at).toLocaleDateString('zh-CN')}</time></div><h2>{d.title}</h2><p className="note-content">{d.content}</p><button className="text-button" onClick={()=>{if(editor&&!editorSaved&&editor.id!==d.id&&(editor.content||editor.title)){setEditorOpen(true);toast.info('先保存正在写的日记，再打开另一篇。');return;}setEditor({id:d.id,title:d.title,content:d.content,sourceIds:JSON.parse(d.source_ids)});setEditorSaved(true);setEditorOpen(true);}}>继续编辑 <ArrowUpRight size={15}/></button></article>)}</div>:<div className="empty-state"><NotebookPen size={30}/><h3>日记，从一条真实记录开始</h3><p>到「全部记录」里选一条，点击「拿来写日记」。</p></div>:filtered.length?<div className="review-grid">{filtered.map(n=>noteCard(n,true))}</div>:<div className="empty-state"><Bookmark size={28}/><h3>{reviewTab==='starred'?'还没有留待展开的记录':'这里还没有记录'}</h3><p>{reviewTab==='starred'?'遇到想多聊几句的记录，点一下右上角的书签。':'换个筛选条件，或先去记下今天的一个想法。'}</p></div>}
    {selected.length>0&&reviewTab!=='drafts'&&<div className="selection-bar"><span>已选 {selected.length} 条</span><button className="text-button" onClick={()=>setSelected([])}>取消选择</button><button className="primary-button" onClick={()=>startDiary(selected)}>一起写成日记 <ArrowRight size={16}/></button></div>}
   </TabsContent>
   <TabsContent value="challenge">
    <div className="page-heading"><div><p className="eyebrow">21-TOPIC WRITING CHALLENGE</p><h1>选一个想写的话题，写出你的身份。</h1><p className="heading-sub">30 个精选选题，自由挑选写满 21 篇。随时随地写下你的真实思考与经历。</p></div></div>
    <div className="challenge-progress-bar"><div className="challenge-progress-fill" style={{width:`${Math.min(doneCount/21*100,100)}%`}}/></div>
    <div className="challenge-stats">
     <span className="challenge-done-count">{doneCount}<small>/21</small></span>
     <div className="challenge-stats-right">
      <span className="challenge-stats-label">{doneCount>=21?'🎉 挑战达成！':'已完成'}</span>
      <button
       type="button"
       className={`challenge-minimal-sort-btn ${sortByPriority?'active':''}`}
       onClick={()=>setSortByPriority(p=>!p)}
       title="点击切换：按优先级或按默认周顺序排列"
      >
       {sortByPriority ? '🔥 优先级排序中' : '🔥 优先级排序'}
      </button>
     </div>
    </div>

    {sortByPriority ? (
     <div className="challenge-topic-list">
      {[...challengeTopics]
       .sort((a,b) => {
        const pa = challengePriorities[a.day]||0, pb = challengePriorities[b.day]||0;
        if (pb !== pa) return pb - pa;
        return a.day - b.day;
       })
       .map(topic => {
        const isDone = !!challengeDone[topic.day];
        const displayTitle = challengeTitles[topic.day] || topic.title;
        const p = challengePriorities[topic.day] || 0;
        return <article key={topic.day} className={`challenge-card ${isDone?'is-done':''}`}>
         <div className="challenge-card-left"><span className={`challenge-day-badge ${isDone?'done':''}`}>{isDone?<Check size={14}/>:`C${topic.day}`}</span></div>
         <div className="challenge-card-body" onClick={()=>openChallengeEditor(topic.day)} style={{cursor:'pointer'}} title="点击修改标题与正文">
          <div className="challenge-title-row">
           <span className={`challenge-type-pill ${challengeTypes[topic.day]||topic.type}`}>
             {(challengeTypes[topic.day]||topic.type)==='pain'?'卡点':(challengeTypes[topic.day]||topic.type)==='discovery'?'发现':'随笔'}
           </span>
           <h3 className="challenge-title">{displayTitle}</h3>
           {p > 0 && <span className="challenge-active-flame" title={`${p}级优先级`}>{'🔥'.repeat(p)}</span>}
          </div>
         </div>
         <div className="challenge-card-actions">
          <button
           type="button"
           className={`challenge-hover-flame-btn ${p > 0 ? 'has-flame' : ''}`}
           onClick={(e)=>{e.stopPropagation();setTopicPriority(topic.day, p >= 3 ? 0 : p + 1);}}
           title={p === 0 ? '标为 🔥 (点击标注优先级)' : `当前 ${p}火 · 点击切换`}
          >
           {p > 0 ? '🔥'.repeat(p) : '🔥'}
          </button>
          {isDone ? (
           <><button className="primary-button small outline-btn" onClick={()=>openChallengeEditor(topic.day)}>编辑</button><button className="text-button muted" onClick={()=>removeChallengeDay(topic.day)}>撤回</button></>
          ) : (
           <button className="primary-button small" onClick={()=>openChallengeEditor(topic.day)}>开始写</button>
          )}
         </div>
        </article>;
       })}
     </div>
    ) : (
     <div className="challenge-weeks">
      {weeks.map(week => {
       const weekTopics = challengeTopics.filter(t => t.week === week);
       const weekDone = weekTopics.filter(t => challengeDone[t.day]).length;
       const isExpanded = challengeExpanded === week || challengeExpanded === null;
       return <div key={week} className="challenge-week-group">
        <button className="challenge-week-header" onClick={()=>setChallengeExpanded(challengeExpanded===week?null:week)}>
         <div className="week-header-left"><span className="week-name">{week}</span><span className="week-progress">{weekDone}/{weekTopics.length}</span></div>
         {isExpanded ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
        </button>
        {isExpanded && (
         <div className="challenge-topic-list">
          {weekTopics.map(topic => {
           const isDone = !!challengeDone[topic.day];
           const displayTitle = challengeTitles[topic.day] || topic.title;
           const p = challengePriorities[topic.day] || 0;
           return <article key={topic.day} className={`challenge-card ${isDone?'is-done':''}`}>
            <div className="challenge-card-left"><span className={`challenge-day-badge ${isDone?'done':''}`}>{isDone?<Check size={14}/>:`C${topic.day}`}</span></div>
            <div className="challenge-card-body" onClick={()=>openChallengeEditor(topic.day)} style={{cursor:'pointer'}} title="点击修改标题与正文">
             <div className="challenge-title-row">
              <span className={`challenge-type-pill ${challengeTypes[topic.day]||topic.type}`}>
             {(challengeTypes[topic.day]||topic.type)==='pain'?'卡点':(challengeTypes[topic.day]||topic.type)==='discovery'?'发现':'随笔'}
           </span>
              <h3 className="challenge-title">{displayTitle}</h3>
              {p > 0 && <span className="challenge-active-flame" title={`${p}级优先级`}>{'🔥'.repeat(p)}</span>}
             </div>
            </div>
            <div className="challenge-card-actions">
             <button
              type="button"
              className={`challenge-hover-flame-btn ${p > 0 ? 'has-flame' : ''}`}
              onClick={(e)=>{e.stopPropagation();setTopicPriority(topic.day, p >= 3 ? 0 : p + 1);}}
              title={p === 0 ? '标为 🔥 (点击标注优先级)' : `当前 ${p}火 · 点击切换`}
             >
              {p > 0 ? '🔥'.repeat(p) : '🔥'}
             </button>
             {isDone ? (
              <><button className="primary-button small outline-btn" onClick={()=>openChallengeEditor(topic.day)}>编辑</button><button className="text-button muted" onClick={()=>removeChallengeDay(topic.day)}>撤回</button></>
             ) : (
              <button className="primary-button small" onClick={()=>openChallengeEditor(topic.day)}>开始写</button>
             )}
            </div>
           </article>;
          })}
         </div>
        )}
       </div>;
      })}
     </div>
    )}
   </TabsContent>
   </main><footer className="site-footer"><span>学间 · 留下真实发生的小事</span><span><CloudCheck size={14}/>保存的记录跟随账号</span></footer>
  </Tabs>
  <Dialog open={editorOpen} onOpenChange={setEditorOpen}><DialogContent className="diary-dialog"><DialogTitle>把这一刻，写成日记</DialogTitle><DialogDescription>原始记录会保留。可以自己写，也可以复制素材给 AI，聊完再把草稿放回来。</DialogDescription><div className="diary-columns"><section className="source-panel"><h3>原始记录 · {sourceNotes.length} 条</h3>{sourceNotes.map(n=><div className="source-note" key={n.id}><span className="small-label">{categoryName(n.category)}</span><p>{n.content||'一条图片记录'}</p>{n.images.map(i=><img key={i.id} src={`/api/images/${i.id}`} alt={i.name}/>)}</div>)}<button className="outline-button" onClick={()=>copy(diaryPrompt(sourceNotes))}><Copy size={16}/>复制素材和整理提示</button><p className="helper-text">粘贴到你正在使用的 AI 对话里；图片需要另行附上。</p></section><section className="diary-writing"><label htmlFor="diary-title">日记标题 <span className="muted">（可选）</span></label><input id="diary-title" placeholder="给这段经历起个名字" maxLength={100} value={editor?.title??''} onChange={e=>changeEditor({title:e.target.value})} disabled={editorSaving}/><label htmlFor="diary-content">日记正文</label><textarea id="diary-content" placeholder="当时发生了什么？你做了什么？后来有什么变化？\n\n像跟朋友聊天一样，先写几句话。" maxLength={20000} value={editor?.content??''} onChange={e=>changeEditor({content:e.target.value})} disabled={editorSaving}/><div className="diary-actions"><button className="text-button" disabled={!editor?.content} onClick={()=>copy([editor?.title,editor?.content].filter(Boolean).join('\n\n'))}><Copy size={16}/>复制正文</button><button className="primary-button" disabled={!editor?.content.trim()||editorSaving} onClick={saveDiary}>{editorSaving?<LoaderCircle size={16} className="spin"/>:<Check size={16}/>}保存日记草稿</button></div><p className="helper-text">{editorSaved?'已保存到账号，可在其他设备继续。':'未保存的输入会暂存于本机，关闭此窗口后可以继续。'}</p></section></div></DialogContent></Dialog>
  <Dialog open={!!editNote} onOpenChange={open=>{if(!open&&!editSaving)setEditNote(null);}}><DialogContent><DialogTitle>编辑记录</DialogTitle><DialogDescription>修改这条记录的文字，保留原有图片和记录时间。</DialogDescription><textarea className="edit-textarea" aria-label="记录内容" value={editText} maxLength={10000} onChange={e=>setEditText(e.target.value)}/><button className="primary-button" disabled={!editText.trim()||editSaving} onClick={async()=>{if(!editNote)return;setEditSaving(true);try{await api('/api/notes',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:editNote.id,content:editText})});setEditNote(null);await reload();toast.success('记录已更新');}catch(e){toast.error(errorText(e));}finally{setEditSaving(false);}}}>保存修改</button></DialogContent></Dialog>
  <Dialog open={!!image} onOpenChange={open=>{if(!open)setImage(null);}}><DialogContent className="image-dialog"><DialogTitle className="sr-only">查看记录图片</DialogTitle><DialogDescription className="sr-only">记录附带的原始图片</DialogDescription>{image&&<img src={image} alt="记录附图"/>}</DialogContent></Dialog>
  <Dialog open={exportOpen} onOpenChange={setExportOpen}><DialogContent className="export-dialog">
   <DialogTitle className="export-dialog-title"><div className="export-title-row"><span className="export-title-icon"><FileDown size={19}/></span><span>导出日记素材为 Markdown</span></div></DialogTitle>
   <DialogDescription>汇总原始记录并格式化为标准 Markdown。可一键复制发给 Agent 整理成型日记，也可下载存入素材池。</DialogDescription>
   <div className="export-body">
    <div className="export-scope-section">
     <div className="export-label">选择导出范围：</div>
     <div className="scope-pills">
      <button type="button" className={`scope-pill ${exportScope==='today'?'active':''}`} onClick={()=>setExportScope('today')}>今天 ({notes.filter(n=>localDate(n.created_at)===(today?localDate(today):localDate(new Date().toISOString()))).length})</button>
      <button type="button" className={`scope-pill ${exportScope==='yesterday'?'active':''}`} onClick={()=>setExportScope('yesterday')}>昨天 ({(()=>{const d=new Date();d.setDate(d.getDate()-1);const y=localDate(d.toISOString());return notes.filter(n=>localDate(n.created_at)===y).length;})()})</button>
      <button type="button" className={`scope-pill ${exportScope==='starred'?'active':''}`} onClick={()=>setExportScope('starred')}>⭐ 留待展开 ({notes.filter(n=>n.starred).length})</button>
      <button type="button" className={`scope-pill ${exportScope==='all'?'active':''}`} onClick={()=>setExportScope('all')}>全部历史 ({notes.length})</button>
      <button type="button" className={`scope-pill ${exportScope==='custom'?'active':''}`} onClick={()=>setExportScope('custom')}>指定日期</button>
     </div>
     {exportScope==='custom'&&<div className="custom-date-picker"><CalendarDays size={15}/><input type="date" value={exportCustomDate} onChange={e=>setExportCustomDate(e.target.value)}/></div>}
    </div>
    <div className="export-option-row">
     <label className="checkbox-label"><Checkbox checked={includeAgentPrompt} onCheckedChange={checked=>setIncludeAgentPrompt(Boolean(checked))}/><span>附带 Agent 一键整理提示词（含懂懂日记语气心法）</span></label>
     <span className="export-stats-badge">已选 {exportNotes.length} 条记录 · 约 {generatedMarkdown.length} 字</span>
    </div>
    <div className="export-preview-wrap"><textarea className="export-preview-textarea" readOnly value={generatedMarkdown} aria-label="Markdown 预览"/></div>
    <div className="export-actions">
     <button type="button" className="outline-button" onClick={copyExportMarkdown}><Copy size={15}/><span>复制 Markdown</span></button>
     <button type="button" className="primary-button" onClick={downloadMarkdown}><Download size={15}/><span>下载 .md 文件</span></button>
    </div>
   </div>
  </DialogContent></Dialog>
 <Dialog open={challengeEditorOpen} onOpenChange={setChallengeEditorOpen}><DialogContent className="challenge-editor-dialog">
   <DialogTitle>Challenge {challengeDay} · 自由写作</DialogTitle>
   <DialogDescription>想写哪个就写哪个。标题与正文均可自由修改，保存即计入挑战进度。</DialogDescription>
   <div className="challenge-split-layout">
    <section className="challenge-editor-pane">
     <div className="challenge-input-group">
       <label className="challenge-input-label">文章标题</label>
       <input type="text" className="challenge-title-input" placeholder="输入或修改文章标题..." maxLength={120} value={challengeTitle} onChange={e=>setChallengeTitle(e.target.value)}/>
     </div>
     <div className="challenge-priority-field">
        <label className="challenge-input-label">优先级设置</label>
        <div className="challenge-flame-dialog-picker">
          {[0, 1, 2, 3].map(lvl => (
            <button key={lvl} type="button" className={`flame-pill-btn ${challengePriority === lvl ? 'active' : ''}`} onClick={()=>setChallengePriority(lvl)}>
              {lvl === 0 ? '未标注' : lvl === 1 ? '🔥 常规' : lvl === 2 ? '🔥🔥 重点' : '🔥🔥🔥 核心'}
            </button>
          ))}
        </div>
      </div>
     <div className="challenge-input-group challenge-textarea-group">
       <div className="challenge-input-header">
         <label className="challenge-input-label">正文内容 (支持 Markdown)</label>
         <span className="challenge-char-count">{challengeText.length} 字</span>
       </div>
       <textarea className="challenge-textarea" placeholder="写下关于这个话题的真实经历、思考或心得... (支持 Markdown 语法)" value={challengeText} onChange={e=>setChallengeText(e.target.value)} maxLength={20000}/>
     </div>
    </section>

    <section className="challenge-preview-pane">
     <div className="challenge-input-group">
       <div className="challenge-input-header">
         <label className="challenge-input-label">排版标题预览</label>
         <span className="challenge-preview-badge">Live Preview</span>
       </div>
       <div className="preview-title-display">
         {challengeTitle.trim() ? challengeTitle : <span className="preview-title-muted">（左侧输入标题后实时呈现）</span>}
       </div>
     </div>
     <div className="challenge-priority-field">
        <label className="challenge-input-label">内容属性</label>
        <div className="challenge-type-dialog-picker">
          {[
            { id: 'pain', label: '卡点' },
            { id: 'discovery', label: '发现' },
            { id: 'thought', label: '随笔' }
          ].map(item => (
            <button
              key={item.id}
              type="button"
              className={`type-pill-btn ${challengeType === item.id ? 'active' : ''}`}
              onClick={()=>setChallengeType(item.id as 'pain'|'discovery'|'thought')}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
     <div className="challenge-input-group challenge-textarea-group">
       <div className="challenge-input-header">
         <label className="challenge-input-label">正文排版渲染</label>
         <span className="challenge-char-count">{challengeText.trim() ? `${Math.max(1, Math.ceil(challengeText.length/300))} 分钟阅读` : '0 字'}</span>
       </div>
       <div className="challenge-preview-scroll">
         {challengeText.trim() ? (
           <div
             className="markdown-rendered-body"
             dangerouslySetInnerHTML={{
               __html: marked.parse(challengeText, { breaks: true, gfm: true }) as string
             }}
           />
         ) : (
           <div className="markdown-preview-placeholder">
             <p>👈 在左侧输入正文</p>
             <small>支持 # 标题、**加粗**、- 列表、&gt; 引用、代码块等 Markdown 语法，此处将即时呈现排版效果。</small>
           </div>
         )}
       </div>
     </div>
    </section>
   </div>
   <div className="challenge-editor-actions">
     <button type="button" className="text-button muted" disabled={!challengeTitle.trim()&&!challengeText.trim()} onClick={()=>copy([challengeTitle,challengeText].filter(Boolean).join('\n\n'))}><Copy size={15}/> 复制文章</button>
     <div className="challenge-actions-right">
       <button type="button" className="text-button muted" onClick={()=>setChallengeEditorOpen(false)}>取消</button>
       <button className="primary-button" disabled={!challengeTitle.trim()&&!challengeText.trim()} onClick={()=>{if(challengeDay!==null){saveChallengeDay(challengeDay,challengeTitle.trim(),challengeText);setTopicPriority(challengeDay,challengePriority);
        const nextTypes = {...challengeTypes, [challengeDay]: challengeType};
        setChallengeTypes(nextTypes);
        try{localStorage.setItem(`challenge-types-${userId}`, JSON.stringify(nextTypes));}catch{}
        setChallengeEditorOpen(false);
        toast.success(`Challenge ${challengeDay} 已保存 ✅`);}}}>保存修改</button>
     </div>
   </div>
  </DialogContent></Dialog>
 </div>;
}
