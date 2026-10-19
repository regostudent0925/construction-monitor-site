import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';
import {validate,consolidate,digest,distribution} from '../src/core.mjs';
export const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
export const config=JSON.parse(fs.readFileSync(path.join(root,'config/monitoring.json'),'utf8'));
const reportsDir=path.join(root,'data/reports');
export function readReports(base=reportsDir){fs.mkdirSync(base,{recursive:true});return fs.readdirSync(base).filter(f=>f.endsWith('.json')).map(f=>JSON.parse(fs.readFileSync(path.join(base,f),'utf8'))).sort((a,b)=>b.date.localeCompare(a.date)||b.revision-a.revision);}
export function ingest(raw,base=reportsDir){
 fs.mkdirSync(base,{recursive:true});const lock=path.join(base,'write.lock');const fd=fs.openSync(lock,'wx');try{
 const normalized=validate(raw,config);const hash=digest(normalized),reports=readReports(base);const prior=reports.find(r=>r.contentHash===hash);if(prior)return {duplicate:true,id:prior.id,revision:prior.revision};
 const cycle=normalized.cycle||normalized.date; if(!/^[\d-]+$/.test(cycle))throw Error('회차 ID 형식 오류');
 const same=reports.filter(r=>r.kind===normalized.kind&&r.cycle===cycle);const revision=Math.max(0,...same.map(r=>r.revision))+1;
 const items=consolidate(normalized.items);for(const item of items){item.previousReports=reports.filter(r=>r.items.some(p=>p.keys.some(k=>item.keys.includes(k)))).map(r=>r.id);}
 const id=normalized.kind+'-'+cycle+'-r'+revision;const doc={...normalized,cycle,id,revision,contentHash:hash,storedAt:new Date().toISOString(),items,statistics:normalized.kind==='monthly'?distribution(items):null};
 const dest=path.join(base,id+'.json');fs.writeFileSync(dest,JSON.stringify(doc,null,2)+'\n',{flag:'wx'});return {duplicate:false,id,revision};
 }finally{fs.closeSync(fd);fs.unlinkSync(lock);}
}
export function build(){const reports=readReports();const catalog={builtAt:new Date().toISOString(),config,reports};const temp=path.join(root,'dist/catalog.tmp');fs.mkdirSync(path.join(root,'dist'),{recursive:true});fs.writeFileSync(temp,JSON.stringify(catalog));fs.renameSync(temp,path.join(root,'dist/catalog.json'));for(const f of ['index.html','app.js','style.css'])fs.copyFileSync(path.join(root,'src',f),path.join(root,'dist',f));return {reports:reports.length,output:path.join(root,'dist')};}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){try{const cmd=process.argv[2];if(cmd==='ingest'){console.log(JSON.stringify(ingest(JSON.parse(fs.readFileSync(process.argv[3],'utf8')))));console.log(JSON.stringify(build()));}else if(cmd==='build')console.log(JSON.stringify(build()));else throw Error('사용: node scripts/cli.mjs ingest 원고.json | build');}catch(e){console.error(e.message);process.exitCode=1;}}
