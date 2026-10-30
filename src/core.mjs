import {createHash} from 'node:crypto';
export const digest=x=>createHash('sha256').update(JSON.stringify(x)).digest('hex');
const assert=(ok,msg)=>{if(!ok)throw Error(msg)};
export function date(v){assert(typeof v==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(v)&&Number.isFinite(Date.parse(v))&&new Date(v).toISOString().slice(0,10)===v,'유효한 날짜 필요');return v;}
export function instant(v){assert(typeof v==='string'&&/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})$/.test(v)&&Number.isFinite(Date.parse(v)),'시간대 포함 시각 필요');return v;}
export const kstDay=x=>new Date(Date.parse(x)+9*3600000).toISOString().slice(0,10);
export function canonical(v){const u=new URL(v);assert(['https:','http:'].includes(u.protocol)&&!u.username&&!u.password,'원문은 http/https만 허용');u.hash='';for(const k of [...u.searchParams.keys()])if(/^utm_|^(fbclid|gclid)$/i.test(k))u.searchParams.delete(k);u.searchParams.sort();return u.href;}
const str=(v,n)=>{assert(typeof v==='string'&&v.trim()&&v.length<=100000,n+' 필수');return v.trim();};
export const academicTitle=x=>x.originalLanguage==='ko'?x.originalTitle:`${x.originalTitle} (${x.translatedTitle})`;
const nominal=(v,n)=>{str(v,n);assert(/[음함됨임움]\.[\s\"'”’)]*$/.test(v),n+'은 음체(~음.)로 끝나야 함');return v.trim();};
export function validate(raw,cfg){
 const r=structuredClone(raw);assert(['daily','weekly','monthly'].includes(r.kind),'보고서 유형 오류');date(r.date);instant(r.generatedAt);assert(kstDay(r.generatedAt)>=r.date,'생성일이 보고일보다 빠름');
 str(r.title,'제목');assert(r.window&&Date.parse(instant(r.window.from))<Date.parse(instant(r.window.to)),'조사기간 오류');assert(Date.parse(r.window.to)<=Date.parse(r.generatedAt),'조사 마감이 생성시각 이후임');
 assert(r.status===undefined||r.status==='draft','자동 저장은 draft만 허용');r.status='draft';assert(r.isSample!==true,'샘플은 운영 아카이브 저장 금지');
 assert(Array.isArray(r.items)&&Array.isArray(r.highlights)&&Array.isArray(r.limitations),'항목·요약·한계 배열 필요');str(r.markdown,'전체 원고');
 r.highlights=r.highlights.map((v,i)=>nominal(v,`핵심 요약 ${i+1}`));r.limitations=r.limitations.map((v,i)=>nominal(v,`확인 한계 ${i+1}`));
 assert(Array.isArray(r.coverage),'출처별 조사 범위 필요');
 for(const c of r.coverage){str(c.sourceId,'출처 ID');assert(['checked','partial','blocked','not_checked'].includes(c.status),'출처 상태 오류');str(c.note,'확인 범위');if(c.url)canonical(c.url);}
 if(r.kind==='monthly')for(const j of cfg.journals)assert(r.coverage.some(c=>c.sourceId===j.id),'11개 학술지 확인 상태 누락: '+j.id);
 r.items=r.items.map(x=>{
  if(r.kind!=='daily'){str(x.originalTitle,'원문 제목');str(x.translatedTitle,'번역 제목');assert(['ko','en'].includes(x.originalLanguage),'원문 언어 오류');str(x.journalName,'학술지명');str(x.publicationDateLabel,'게재일자');x.title=academicTitle(x);}else str(x.title,'항목 제목');
  nominal(x.summary,'사실 요약');nominal(x.interpretation,'해석/한계');
  assert(Array.isArray(x.sources)&&x.sources.length,'원문 필요');
  if(r.kind==='daily')assert(Object.hasOwn(cfg.categories,x.classification),'A~D 분류 오류');
  if(r.kind==='weekly')assert(Object.hasOwn(cfg.topics,x.classification),'E-1 주제 오류');
  if(r.kind==='monthly'){assert(cfg.journals.some(j=>j.id===x.journalId),'학술지 ID 오류');assert(cfg.paperCategories.includes(x.classification),'12개 주제 분류 오류');assert(['yes','no','unknown'].includes(x.aiUse),'AI 태그 오류');}
  if(r.kind!=='daily')assert(['fulltext','abstract','metadata'].includes(x.evidenceLevel),'논문 확인 수준 필요');
  if(x.eventDate!==null&&x.eventDate!==undefined)date(x.eventDate);else x.eventDate=null;
  x.sources=x.sources.map(s=>{str(s.publisher,'발행처');if(s.readLevel!==undefined)assert(['body','abstract','index','legacy'].includes(s.readLevel),'출처 열람 수준 오류');if(s.sourceKind!==undefined)assert(['press','official'].includes(s.sourceKind),'출처 종류 오류');const url=canonical(s.url);assert(s.publishedDate===null||s.publishedDate!==undefined,'게시일 또는 null 필요');if(s.publishedDate){date(s.publishedDate);assert(s.publishedDate<=kstDay(r.window.to),'기준 이후 게시물');}if(s.publishedAt){instant(s.publishedAt);assert(Date.parse(s.publishedAt)<=Date.parse(r.window.to),'기준 이후 게시시각');assert(!s.publishedDate||s.publishedDate===kstDay(s.publishedAt),'게시일/시각 불일치');}if(s.accessedAt)instant(s.accessedAt);else s.accessedAt=null;return {...s,url};});
  if(x.doi){x.doi=x.doi.replace(/^https?:\/\/(dx\.)?doi.org\//i,'').toLowerCase().trim();assert(/^10\.\d{4,9}\/.+/.test(x.doi),'DOI 형식 오류');}
  return x;
 });return r;
}
export function consolidate(items,kind='daily'){
 const groups=[];
 for(const x of items){
  const keys=kind==='daily'?[...(x.eventKey?['event:'+x.eventKey]:[]),...(x.doi?['doi:'+x.doi]:[]),...x.sources.map(s=>'url:'+canonical(s.url))]:[...(x.doi?['doi:'+x.doi]:[]),'title:'+x.originalTitle.trim().toLowerCase()];
  const hits=groups.filter(g=>g.keys.some(k=>keys.includes(k)));let g=hits.shift();
  if(!g){g={...structuredClone(x),keys:[],alternatives:[]};groups.push(g);}else g.alternatives.push({title:x.title,summary:x.summary,interpretation:x.interpretation});
  for(const h of hits){g.keys.push(...h.keys);g.sources.push(...h.sources);g.alternatives.push({title:h.title,summary:h.summary,interpretation:h.interpretation},...h.alternatives);groups.splice(groups.indexOf(h),1);}
  g.keys=[...new Set([...g.keys,...keys])];g.sources=[...new Map([...g.sources,...x.sources].map(s=>[s.url,s])).values()];
 }
 return groups.map(g=>{g.key=digest([...g.keys].sort()).slice(0,24);g.commonCoverage=new Set(g.sources.map(s=>s.publisher)).size;return g;});
}
export function scheduleDue(kind,at){const d=new Date(Date.parse(at)+9*3600000),day=d.getUTCDay(),h=d.getUTCHours(),m=d.getUTCMinutes();return kind==='daily'?day>=1&&day<=5&&h===9&&m===0:kind==='weekly'?day===5&&h===10&&m===0:day===1&&d.getUTCDate()<=7&&h===10&&m===0;}
export function distribution(items){const counts={};let ai=0,known=0;for(const x of items){counts[x.classification]=(counts[x.classification]||0)+1;if(x.aiUse!=='unknown'){known++;if(x.aiUse==='yes')ai++;}}return {total:items.length,counts,ai,known,unknown:items.length-known,aiShareOfAll:items.length?ai/items.length:null};}
