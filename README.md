# 건설산업 모니터링 시스템 v1.0

공식 분류체계: 2026-10-19 사용자 확정 A~D·E-1 7주제·E-2 11학술지/12분류. 개인 연구자용 출처 아카이브. 개별 연구과제 자동 연결은 제외했습니다.

평일 09:00 A~D 통합, 금요일 10:00 E-1, 매월 첫째 월요일 10:00 E-2(한국시간). 운영 규칙은 [RUNBOOK](docs/RUNBOOK.md), 정확한 대상은 [설정](config/monitoring.json)입니다.

## 사용

Node.js 22 이상에서 별도 설치 없이 동작합니다. 프로젝트 폴더에서 다음을 실행합니다.

```
node --test tests/core.test.mjs
node scripts/cli.mjs build
node scripts/serve.mjs
```

로컬 홈페이지: http://127.0.0.1:8792 . 원고를 저장하면 홈페이지 자료가 함께 재생성됩니다.

```
node scripts/cli.mjs ingest work/inbox/실제원고.json
```

로컬 실행파일 `start-local.cmd`를 더블클릭해도 됩니다. 로컬 파일을 브라우저에서 직접 여는 대신 위 주소를 사용합니다.

## 구현

원문 URL, 게시 날짜/시각, 사건 발생일, 원문 조회시각, 사실/해석/한계, A~E 분류, 출처 접근 결과를 보관합니다. URL·DOI·사람이 검토한 사건 키로 중복을 통합하고 통합된 보도의 추가 요약을 보존합니다. 일/주/월 회차와 수정본을 남기며 날짜·분류·검색어로 열람하고 전체 원고를 내려받습니다. 학술지 일부 접근 실패를 논문 0편으로 표시하지 않습니다.

단일 작성 잠금과 내용 지문으로 중복 수신/동시 쓰기를 제어합니다. 원고를 덮어쓰지 않고 각 수정본을 별도 파일로 보존합니다. 잘못된 URL·날짜·분류·향후 기사·승인 상태 입력은 거부합니다. 조회 UI는 사용자 텍스트를 HTML로 실행하지 않습니다.

## 재활용·보존

기존 C:\CodexResearch\03_Business\construction-briefing-web의 도메인 설계·중복 수신 방식·출처 구분·초안 공개 통제·전문지 목록을 참고했습니다. 기존 파일과 비밀·Codespace 설정은 변경·복사하지 않았습니다. 기존 2026-10-19 미검증 보고서 1건(기사 3건)과 출처 기록을 새 형식으로 이관하고 이번 실행 미재검증임을 표시했습니다. 이관 근거는 docs/legacy-provenance.json입니다. 승인받지 않은 샘플을 실제 보고서로 사용하지 않았습니다.

홈페이지는 Sites의 소유자 전용 비공개 호스팅을 사용합니다. 자동화가 새 원고를 보관한 뒤 같은 Site를 재배포하는 방식입니다. 별도 쓰기 API나 DB 인증을 요구하지 않습니다. 세션별 Sites 쓰기 권한이 없으면 갱신 실패로 보고하고 로컬 원고를 보존합니다. PC/Codex 중지 시 자동 갱신은 중단될 수 있습니다. 공개 배포·상시 무인 수집·미래 예약회차 실행 성공은 초기 배포와 별개입니다.

외부 학술지는 기관 구독/접근 제한이 있을 수 있습니다. 등록된 URL은 발행기관·출판사의 탐색 시작점이며 전체 목차/전문 접근 검증을 대신하지 않습니다. 발행기관 안내는 [한국건설관리학회](https://www.kicem.or.kr/), [ASCE Construction Institute](https://www.asce.org/communities/institutes-and-technical-groups/construction-institute/publications), [Emerald ECAM](https://www.emeraldgrouppublishing.com/journal/ecam), [Taylor & Francis CME](https://www.tandfonline.com/journals/rcme20)를 참고했습니다(2026-10-19 조회).
