# place-scan-agent

지역의 유형·무형 자원을 기술과 융합한 **place-based / 브리콜라주 / frugal 혁신 창업기업**을
매일 1~2건(재무성과 확인 기업만) 발굴해 이메일로 받는 Claude Code 리모트 에이전트.

## 확정된 설계
- **단일 루틴**, 매일 09:00(KST)에 *조사 → 윤문 → 본인 메일 발송 → 상태 갱신* 한 번에 처리.
- **조사는 insane-search 기본**(미가용 시 내장 웹검색 폴백).
- **한글 표현은 `/yunmun` 윤문 교정 스킬** 적용(repo 커밋 스킬).
- **코드는 repo(읽기 전용), 상태·아카이브는 Google Drive**(`seen.json`, `reports/`).
- **커넥터**: Gmail(발송) + Google Drive(상태/아카이브).

## 셋업 순서
1. 이 폴더를 Git 저장소로 푸시(루틴이 클론할 대상).
2. `state-seed/seen.json` → Google Drive `place-scan/` 폴더에 업로드.
3. (테스트) VS Code의 Claude Code에서 `/place-scan` 수동 실행해 출력·재무필터·윤문·출처규칙 확인.
4. 루틴 생성: `/schedule` 또는 claude.ai/code/routines 또는 Desktop → New remote task.
   cron `0 9 * * *`, 저장소 연결, Gmail·Drive 커넥터 포함, `ROUTINE_PROMPT.md`의 프롬프트 사용.
5. **활성화 전 "Run Now" 1회 수동 실행** → 메일 도착·insane-search·윤문·필터·중복제외 확인.
6. 이상 없으면 스케줄 활성화.

## 핵심 주의
- 품질 병목은 **재무필터** 한 곳. 출처 URL 없는 재무근거는 본문에 넣지 않는다.
- 상태는 **반드시 Drive에** 쓴다(매 실행이 repo를 새로 클론하므로 repo 쓰기는 유실됨).
- insane-search는 로컬 플러그인이라 클라우드 가용성을 "Run Now"로 확인할 것.
