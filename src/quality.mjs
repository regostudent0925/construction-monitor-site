import {canonical} from './core.mjs';
// Collection checks never imply fact verification or editorial approval.
export function assessDaily(report,config){
 const all=new Map(),body=new Map(),categories={},publisherCounts={};
 for(const x of report.items){categories[x.classification]=(categories[x.classification]||0)+1;for(const s of x.sources){if(s.sourceKind==='official')continue;const key=canonical(s.url);all.set(key,s);if(s.readLevel==='body')body.set(key,s);}}
 for(const s of body.values())publisherCounts[s.publisher]=(publisherCounts[s.publisher]||0)+1;
 const registeredPublishers=[...new Set([...all.values()].map(s=>s.publisher))],publishers=Object.keys(publisherCounts),bodyArticles=body.size;
 const warnings=[];
 if(bodyArticles<all.size)warnings.push(`본문 확인 기록 없는 등록 출처 ${all.size-bodyArticles}건`);
 const domains=Object.keys(config.categories).map(id=>({id,count:categories[id]||0,...(report.domainCoverage?.[id]||{status:'not_checked',note:'영역별 조사 기록 없음'})}));
 if(domains.some(d=>d.status==='not_checked'))warnings.push('A~D 영역별 조사 기록 부족');
 const accessLimits=report.coverage.filter(c=>['blocked','not_checked'].includes(c.status)).map(c=>c.sourceId);
 return {issueCount:report.items.length,registeredArticles:all.size,registeredPublishers,bodyArticles,publisherCounts,publisherCount:publishers.length,domains,warnings,accessLimits,collectionStatus:accessLimits.length||warnings.length?'limitations_recorded':'scope_recorded',verificationStatus:'draft'};
}
