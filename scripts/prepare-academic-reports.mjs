import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const config=JSON.parse(fs.readFileSync(path.join(root,'config/monitoring.json'),'utf8'));
const outDir=path.join(root,'work','inbox');fs.mkdirSync(outDir,{recursive:true});
const generatedAt=new Date().toISOString();
const nominal=s=>s.trim()
 .replace(/했습니다\.$/,'했음.').replace(/됐습니다\.$/,'됐음.').replace(/있습니다\.$/,'있음.')
 .replace(/없습니다\.$/,'없음.').replace(/않습니다\.$/,'않음.').replace(/필요합니다\.$/,'필요함.')
 .replace(/하였다\.$/,'했음.').replace(/했다\.$/,'했음.').replace(/됐다\.$/,'됐음.')
 .replace(/나타났다\.$/,'나타났음.').replace(/두드러졌다\.$/,'두드러졌음.')
 .replace(/수 있다\.$/,'수 있음.').replace(/필요하다\.$/,'필요함.').replace(/어렵다\.$/,'어려움.')
 .replace(/아니다\.$/,'아님.').replace(/있다\.$/,'있음.').replace(/없다\.$/,'없음.').replace(/않는다\.$/,'않음.');

const displayTitle=x=>x.originalLanguage==='ko'?x.originalTitle:`${x.originalTitle} (${x.translatedTitle})`;
function markdown(report,order){
 let s=`# ${report.title}\n\n## 핵심 요약\n\n${report.highlights.map(x=>'- '+x).join('\n')}\n`;
 for(const [id,name] of order){s+=`\n## ${name}\n\n`;const items=report.items.filter(x=>x.classification===id);if(!items.length){s+='해당 기간에 확인된 신규 논문 없음.\n';continue;}items.forEach((x,i)=>{s+=`${i+1}. **${displayTitle(x)}** / ${x.journalName} / ${x.publicationDateLabel}\n\n   : ${x.summary}\n\n   [원문](${x.sources[0].url})${x.doi?` · DOI ${x.doi}`:''}\n\n`;});}
 s+=`\n## 확인 한계\n\n${report.limitations.map(x=>'- '+x).join('\n')}\n`;return s;
}

const weeklyItems=[
 {classification:'E1-4',originalTitle:'Adaptive Expertise as a Missing Dimension in Construction Education: A Narrative Review',translatedTitle:'건설교육에서 누락된 차원으로서의 적응적 전문성: 서사적 문헌고찰',journalName:'AEI and IRD 2026: Hazard Resilience for an Integrated World—Buildings, Infrastructure, and People',publicationDateLabel:'2026-10-15',doi:'10.1061/9780784486955.009',summary:'건설교육이 정형 문제의 반복적 해결을 넘어 새로운 조건에서 지식을 전이하고 판단을 조정하는 적응적 전문성을 길러야 한다고 제안했음.',interpretation:'교육성과 평가에 조건변화 상황에서의 판단·전이·협업 능력을 포함할 필요가 있음.',url:'https://ascelibrary.org/doi/10.1061/9780784486955.009'},
 {classification:'E1-5',originalTitle:'Smart and Sustainable Construction: Evaluating Automation and Robotics Adoption using q-Rung Orthopair Fuzzy AHP Framework',translatedTitle:'스마트·지속가능 건설: q-Rung 직교쌍 퍼지 AHP를 활용한 자동화·로봇 도입 평가',journalName:'Results in Engineering',publicationDateLabel:'2026-10-12',doi:'10.1016/j.rineng.2026.113522',summary:'건설 자동화·로봇 도입의 장벽·동인·실행전략을 분석하고 인력개발 재원을 가장 우선적인 실행전략으로 제시했음.',interpretation:'로봇 도입을 장비 구매와 교육·직무 재설계·작업자 참여를 결합한 사업으로 설계할 필요가 있음.',url:'https://www.sciencedirect.com/science/article/pii/S2590123026045330'},
 {classification:'E1-5',originalTitle:'From construction site video to ergonomic risk reports: An evidence-chain workflow for pose-based risk screening',translatedTitle:'건설현장 영상에서 인체공학 위험보고서까지: 자세 기반 위험 선별을 위한 증거사슬 업무절차',journalName:'Engineering Applications of Artificial Intelligence',publicationDateLabel:'2026-10-15',doi:'10.1016/j.engappai.2026.116119',summary:'단일 RGB 영상의 3차원 자세 추정과 작업부담 지표를 결합해 근거를 추적할 수 있는 위험보고서를 생성하는 절차를 제안했음.',interpretation:'자동 제재보다 안전전문가가 위험 자세를 선별·검토하는 지원도구로 우선 적용할 필요가 있음.',url:'https://www.sciencedirect.com/science/article/pii/S0952197626024036'},
 {classification:'E1-6',originalTitle:'GenCrane: Generative Tower Crane Layout Planning through BIM-Driven Multi-Objective Optimization Using NSGA-II',translatedTitle:'GenCrane: BIM 기반 NSGA-II 다목적 최적화를 활용한 생성형 타워크레인 배치계획',journalName:'Results in Engineering',publicationDateLabel:'2026-10-14',doi:'10.1016/j.rineng.2026.113569',summary:'BIM과 NSGA-II를 결합해 타워크레인의 작업시간·비용·물류혼잡을 함께 고려하는 배치계획 방법을 제안했음.',interpretation:'단일 최적안을 자동 채택하기보다 공기·비용·혼잡의 상충관계를 제시하고 관리자가 대안을 선택하도록 지원할 필요가 있음.',url:'https://www.sciencedirect.com/science/article/pii/S2590123026045792'}
].map(x=>({...x,originalLanguage:'en',eventDate:x.publicationDateLabel,evidenceLevel:'abstract',aiUse:x.originalTitle.includes('Adaptive Expertise')?'no':'yes',sources:[{publisher:x.journalName,url:x.url,publishedDate:x.publicationDateLabel,accessedAt:generatedAt,readLevel:'body'}]}));

const weekly={kind:'weekly',date:'2026-10-16',cycle:'2026-10-16',generatedAt,window:{from:'2026-10-09T10:00:00+09:00',to:'2026-10-16T10:00:00+09:00'},title:'건설 인력 연구동향 · 2026-10-16',status:'draft',highlights:['건설인력의 양적 수급보다 자동화·로봇 도입에 필요한 인력 투자와 AI 기반 작업부담 측정 연구가 두드러졌음.','기술 도입 성과를 장비 정확도뿐 아니라 작업자 수용성·교육·신뢰·피로 지표와 함께 평가할 필요가 있음.','엄격한 조사기간 안에 최초 공개일을 확인한 국내 연구를 확보하지 못해 국내 연구의 부재로 해석해서는 안 됨.'],items:weeklyItems,coverage:Object.keys(config.topics).map(k=>({sourceId:k,status:weeklyItems.some(x=>x.classification===k)?'partial':'checked',note:weeklyItems.some(x=>x.classification===k)?'공개 원문과 초록을 확인했음.':'조사기간 내 최초 공개일이 확인된 채택 논문이 없었음.'})),limitations:['일부 국내 학술DB 검색결과에서 최초 온라인 공개일을 확인하기 어려웠음.','공개 본문 또는 초록에서 확인된 내용만 요약했으며 유료 원문 전체를 확인한 것으로 간주하지 않았음.','채택 논문 수가 적어 한 주의 건설인력 연구 전체를 대표한다고 일반화할 수 없음.']};
weekly.markdown=markdown(weekly,Object.entries(config.topics));

const monthlyText=fs.readFileSync(path.join(root,'work','samples','monthly-2026-10-05-sample-v2.md'),'utf8');
const monthlyItems=[];const sectionRe=/## (\d+)\. ([^\n]+)\n([\s\S]*?)(?=\n## (?:\d+\.|AI 활용|확인 한계)|$)/g;let sm;
while((sm=sectionRe.exec(monthlyText))){const category=sm[2].trim(),body=sm[3];const itemRe=/\d+\. \*\*(.+?)\*\* \/ (.+?) \/ ([^\n]+)\n\n\s+: (.+?) \[([^\]]+)\]\(([^)]+)\)/g;let m;while((m=itemRe.exec(body))){const shown=m[1].trim(),journalName=m[2].trim(),publicationDateLabel=m[3].trim(),summary=nominal(m[4]),url=m[6];const pair=shown.match(/^(.*) \(([^()]*)\)$/);if(!pair)throw Error('제목 번역 쌍 해석 실패: '+shown);const journal=config.journals.find(j=>j.name===journalName);if(!journal)throw Error('학술지 매핑 실패: '+journalName);const foreign=journal.region==='해외',originalLanguage=foreign?'en':'ko';const originalTitle=foreign?pair[2].trim():pair[1].trim(),translatedTitle=foreign?pair[1].trim():pair[2].trim();const fullDate=/^\d{4}-\d{2}-\d{2}/.exec(publicationDateLabel)?.[0]||null;const aiYes=!/AI 데이터센터/.test(shown)&&/머신러닝|딥러닝|인공지능|작업영역 인식|행동 의사결정/i.test(shown);monthlyItems.push({classification:category,journalId:journal.id,journalName,originalTitle,translatedTitle,originalLanguage,publicationDateLabel,title:displayTitle({originalTitle,translatedTitle,originalLanguage}),summary,interpretation:summary,eventDate:fullDate,evidenceLevel:/DocRdoc|science\/article\/pii|doi\//.test(url)?'abstract':'metadata',aiUse:aiYes?'yes':'no',sources:[{publisher:journalName,url,publishedDate:fullDate,accessedAt:generatedAt,readLevel:/DocRdoc|science\/article\/pii|doi\//.test(url)?'body':'index'}]});}}
if(monthlyItems.length!==34)throw Error(`월간 논문 34편 예상, 실제 ${monthlyItems.length}편`);
const monthly={kind:'monthly',date:'2026-10-05',cycle:'2026-10-05',editorialRevision:3,generatedAt,window:{from:'2026-09-01T00:00:00+09:00',to:'2026-10-01T00:00:00+09:00'},title:'주요 건설 학술지 동향 · 2026-10-05',status:'draft',highlights:['국내 연구가 공공 건설관리 제도·안전·품질·재료·구조·건축계획 분야에 넓게 분포했음.','해외 연구에서는 BIM 정보검증·머신러닝 기반 비용 및 사고 예측·로봇과 작업자 협업·순환경제 연구가 두드러졌음.','AI가 사업비 예측·사고보고서 분석·지반특성 예측·영상인식 등에 횡단적으로 활용됐음.'],items:monthlyItems,coverage:config.journals.map(j=>({sourceId:j.id,status:'partial',url:j.discoveryUrl,note:'검토용 대표 연구 목록을 확인했으나 해당 월의 완전한 전수목록으로 검증하지 않았음.'})),limitations:['일부 학술지는 권호 발행일과 최초 온라인 공개일이 달라 게재일자를 권호 발행월로만 확인한 항목이 있음.','이번 목록은 형식 검토용 대표 연구 목록이며 11개 학술지의 완전한 전수목록으로 볼 수 없음.','영문 논문은 영문 원제와 한글 편집 번역을 함께 제시하고 한글 논문은 한글 원제만 표시했음.']};
monthly.markdown=markdown(monthly,config.paperCategories.map(x=>[x,x]));

for(const r of [weekly,monthly])fs.writeFileSync(path.join(outDir,`${r.kind}-${r.date}.json`),JSON.stringify(r,null,2)+'\n');
console.log(JSON.stringify({weeklyItems:weeklyItems.length,monthlyItems:monthlyItems.length,outDir}));
