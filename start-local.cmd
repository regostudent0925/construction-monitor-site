@echo off
cd /d "%~dp0"
node scripts/cli.mjs build
start "" http://127.0.0.1:8792
node scripts/serve.mjs
pause
