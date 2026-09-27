export type PendingNote = { id:string; content:string; files:File[] };
export type PendingNotes = Record<string,PendingNote>;
let queue:Promise<unknown>=Promise.resolve();
function open():Promise<IDBDatabase>{return new Promise((resolve,reject)=>{const r=indexedDB.open('learning-notes-pending',1);r.onupgradeneeded=()=>r.result.createObjectStore('pending');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});}
export async function readPending(user:string):Promise<PendingNotes>{const db=await open();return new Promise((resolve,reject)=>{const tx=db.transaction('pending','readonly'),r=tx.objectStore('pending').get(user);r.onsuccess=()=>resolve(r.result??{});r.onerror=()=>reject(r.error);tx.oncomplete=()=>db.close();});}
export function writePending(user:string,value:PendingNotes):Promise<void>{const task=async()=>{const db=await open();return new Promise<void>((resolve,reject)=>{const tx=db.transaction('pending','readwrite');tx.objectStore('pending').put(value,user);tx.oncomplete=()=>{db.close();resolve();};tx.onerror=()=>{db.close();reject(tx.error);};});};const result=queue.then(task,task);queue=result;return result;}
