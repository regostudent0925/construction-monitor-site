# Codespaces·GitHub Pages 운영

## 구조

GitHub 저장소를 원본으로 사용함. Codespaces는 수정·검증 환경이며 GitHub Pages가 정적 홈페이지를 상시 제공함. Codespace를 중지해도 마지막으로 배포된 홈페이지는 계속 열림.

`main`에 보고서 또는 홈페이지 변경이 반영되면 `.github/workflows/deploy-pages.yml`이 다음 순서로 실행됨.

1. 전체 자동시험 실행
2. `data/reports`에서 `dist/catalog.json` 재생성
3. `dist`를 GitHub Pages에 배포

시험이나 빌드가 실패하면 기존 홈페이지를 유지하고 새 버전을 배포하지 않음.

## Codespaces에서 확인

저장소의 **Code → Codespaces → Create codespace on main**을 선택함. 최초 생성 때 시험과 빌드가 자동 실행됨. 터미널에서 다음 명령으로 미리보기를 시작함.

```text
npm start
```

포트 `8792`가 자동 전달되며 미리보기 창이 열림.

## 브리핑 반영

Codex 예약 작업은 공개자료 조사 후 기존 절차대로 원고를 검증·보관함.

```text
node scripts/cli.mjs ingest work/inbox/원고.json
npm test
```

검증이 끝난 뒤 새 `data/reports/<보고서 ID>.json`과 관련 소스 변경을 GitHub `main`에 반영함. `dist/catalog.json`은 GitHub Actions가 다시 생성하므로 로컬 생성 여부에 의존하지 않음. Pages 배포 작업의 최종 상태가 `success`이고 배포 URL에서 새 보고서 ID가 확인된 경우에만 홈페이지 반영 완료로 보고함.

동일 보고서는 내용 지문으로 중복 저장을 차단하고 수정본은 `r2`, `r3`처럼 별도 보존함. 원문 링크·날짜·분류·확인 한계는 기존 형식을 유지함.

## 운영 경계

- GitHub 저장소와 Pages에는 `data/reports`, 홈페이지 소스, 공개 가능한 요약만 올림.
- `work`, `.env`, 토큰, 쿠키, 비공개 연구자료는 올리지 않음.
- GitHub Actions나 Codespaces 비밀값은 현재 구조에 필요하지 않음.
- GitHub Pages의 공개 범위는 저장소와 계정 요금제의 Pages 정책에 따름.
- 예약 실행이 중단되면 새 자료는 생성되지 않지만 마지막 성공 배포본은 유지됨.
