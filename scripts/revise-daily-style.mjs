import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const reportsDir=path.join(root,'data','reports'),outDir=path.join(root,'work','inbox');fs.mkdirSync(outDir,{recursive:true});
const nominal=s=>s
 .replace(/있습니다\./g,'있음.').replace(/없습니다\./g,'없음.').replace(/아닙니다\./g,'아님.').replace(/입니다\./g,'임.')
 .replace(/필요합니다\./g,'필요함.').replace(/해야 합니다\./g,'해야 함.').replace(/합니다\./g,'함.')
 .replace(/됐습니다\./g,'됐음.').replace(/되었습니다\./g,'되었음.').replace(/됩니다\./g,'됨.')
 .replace(/했습니다\./g,'했음.').replace(/보입니다\./g,'보임.').replace(/같습니다\./g,'같음.')
 .replace(/어렵습니다\./g,'어려움.').replace(/높습니다\./g,'높음.').replace(/낮습니다\./g,'낮음.').replace(/큽니다\./g,'큼.')
 .replace(/다릅니다\./g,'다름.').replace(/않습니다\./g,'않음.').replace(/습니다\./g,'음.')
 .replace(/보여줍니다\./g,'보여줌.').replace(/줍니다\./g,'줌.').replace(/봅니다\./g,'봄.').replace(/납니다\./g,'남.').replace(/집니다\./g,'짐.').replace(/립니다\./g,'림.');
function latest(date){return fs.readdirSync(reportsDir).filter(x=>x.startsWith(`daily-${date}-r`)).sort((a,b)=>Number(b.match(/-r(\d+)/)[1])-Number(a.match(/-r(\d+)/)[1]))[0];}
for(const date of ['2026-10-19','2026-10-20']){
 const source=JSON.parse(fs.readFileSync(path.join(reportsDir,latest(date)),'utf8'));
 const items=source.items.map(x=>{const y={...x,summary:nominal(x.summary),interpretation:nominal(x.interpretation),sources:x.sources.map(s=>({...s}))};for(const k of ['keys','key','alternatives','previousReports','commonCoverage'])delete y[k];return y;});
 const report={kind:'daily',date,cycle:date,editorialRevision:'nominal-style-v1',generatedAt:new Date().toISOString(),window:source.window,title:source.title,highlights:source.highlights.map(nominal),items,coverage:source.coverage,domainCoverage:source.domainCoverage||{},limitations:source.limitations.map(nominal)};
 let md=`# ${report.title}\n\n## 핵심 흐름\n${report.highlights.map(x=>'- '+x).join('\n')}\n`;
 for(const [i,x] of items.entries())md+=`\n## ${i+1}. ${x.title}\n\n${x.summary}\n\n시사점: ${x.interpretation}\n\n${x.sources.map(s=>`[${s.publisher} 원문](${s.url}) · 게시 ${s.publishedAt||s.publishedDate||'미확인'}`).join('\n')}\n`;
 report.markdown=md;const text=JSON.stringify(report,null,2)+'\n';const remnants=[...text.matchAll(/[^"\\]{0,30}[가-힣]니다\./g)].map(m=>m[0]);if(remnants.length)throw Error(`${date} 존댓말 어미 잔존: ${remnants.join(' | ')}`);
 fs.writeFileSync(path.join(outDir,`daily-${date}-nominal.json`),text);
}
console.log('daily nominal revisions prepared');
