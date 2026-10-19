// Windows equivalent of Sites package-site.sh; uses the same build preparer.
import fs from 'node:fs';import path from 'node:path';import os from 'node:os';import {execFileSync} from 'node:child_process';import {root} from './cli.mjs';
const archive=path.resolve(process.argv[2]||path.join(root,'../../work/construction-monitor.tar.gz'));
const plugin='C:/Users/regos/.codex/plugins/cache/openai-curated-remote/sites/1.0.2-remix-a.1';
const git='C:/Users/regos/.cache/codex-runtimes/codex-primary-runtime/dependencies/native/git/cmd/git.exe';
if(execFileSync(git,['status','--porcelain'],{cwd:root,encoding:'utf8'}).trim())throw Error('소스 변경이 남아 있습니다. 저장소 전송 후 다시 묶으세요.');
const commit=execFileSync(git,['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim();
const stage=fs.mkdtempSync(path.join(os.tmpdir(),'monitor-site-'));
try{execFileSync(process.execPath,[path.join(plugin,'skills/sites/scripts/prepare-site-build.cjs'),root,path.join(stage,'dist')],{stdio:'inherit'});fs.mkdirSync(path.dirname(archive),{recursive:true});execFileSync('C:/Windows/System32/tar.exe',['-C',stage,'-czf',archive,'dist']);const entries=execFileSync('C:/Windows/System32/tar.exe',['-tzf',archive],{encoding:'utf8'});if(!entries.includes('dist/.openai/hosting.json'))throw Error('배포 manifest 누락');console.log(JSON.stringify({commit_sha:commit,archive}));}finally{fs.rmSync(stage,{recursive:true});}
