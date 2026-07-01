# 루틴(리모트/클라우드) 설정 가이드

이 파일은 **저장소에 둘 필요는 없는** 설정 메모다. 루틴 생성 시 아래 프롬프트를 사용한다.

## 1) 기본 설정
- **트리거**: schedule (cron)
- **cron**: `0 9 * * *`  → 매일 09:00. 시간은 **로컬 타임존(KST)** 으로 입력한다.
- **저장소**: `place-scan-agent` (읽기 전용 클론)
- **연결 커넥터**:
  - **Gmail** (리포트 발송)
  - **Google Drive** (`place-scan/seen.json` 읽기·쓰기, `place-scan/reports/` 저장)

## 2) 루틴 프롬프트 (그대로 붙여넣기)
> 받는사람은 `feel7322@gmail.com`으로 이미 설정됨.

```
당신은 place-scan-agent의 일일 실행기다. 클론된 저장소의 CLAUDE.md,
.claude/commands/place-scan.md, .claude/commands/yunmun.md, STYLE.md를 먼저 읽고 그 규칙을 그대로 따른다.

절차:
1. Google Drive place-scan/에서 seen 상태를 읽는다(최신본 읽기 방식):
   `seen`으로 시작하는 파일 중 날짜가 가장 최신인 것(예: seen-YYYY-MM-DD.json)을 읽고,
   없으면 시드 seen.json을, 그것도 없으면 빈 목록으로 시작한다.
2. place-scan.md 절차를 수행한다. 조사는 insane-search를 기본 사용(미가용 시 내장 웹검색 폴백).
   seen.json의 도시·기업은 제외한다.
   재무필터를 엄격히 적용한다 — 출처 URL 없는 재무근거는 불채택, [약]은 제외.
3. STYLE.md 문체로 쓴 뒤 /yunmun 윤문 교정 스킬을 적용해 한글 표현을 다듬어
   최종 한국어 리포트를 완성한다.
4. Gmail로 발송한다:
   - 받는사람: feel7322@gmail.com
   - 제목: [Place-Based Scan] {오늘 날짜} — {대상 도시/기업}
   - 본문: 완성된 리포트 전문
5. Google Drive place-scan/reports/{오늘 날짜}.md 로 리포트를 저장한다.
6. 이번에 다룬 도시·기업을 직전 목록에 병합해 place-scan/seen-{오늘 날짜}.json을
   **새로 생성**한다(기존 파일 덮어쓰기 아님 — Drive 커넥터에 update/delete 없음).
7. 재무필터를 통과한 기업이 0건이면: 메일 제목 끝에 "(검증 필요만)"을 붙여
   검증 필요 목록만 보내고, seen.json은 갱신하지 않는다.

제약: 사실만 쓴다. 미확인 수치·인물 생성 금지. 불확실은 "확인 불가"로 명시.
모든 핵심 사실에 출처 URL을 남긴다. 본국 출처를 우선한다.
```

## 3) 활성화 전 점검 (필수)
1. `state-seed/seen.json`을 Google Drive `place-scan/` 폴더에 업로드한다.
2. 루틴을 만들되, **먼저 "Run Now"(또는 `claude routines run <이름>`)로 1회 수동 실행**한다.
3. 확인 항목:
   - [ ] 메일이 도착하는가
   - [ ] insane-search가 실제로 호출되는가(안 되면 폴백 동작 확인)
   - [ ] /yunmun 교정이 적용돼 한글이 자연스러운가
   - [ ] 모든 재무 사실에 출처 URL이 붙는가
   - [ ] 재무필터가 동작하는가(근거 약한 기업이 본문에 안 들어가는가)
   - [ ] `seen.json`이 갱신되는가
   - [ ] 시드에 있는 4개 기업이 반복되지 않는가
4. 이상 없으면 스케줄을 활성화한다.

## 4) 주의
- 루틴은 **리서치 프리뷰**다 — 한도·동작이 바뀔 수 있다.
- **일일 실행 상한**은 plan별로 있으며 공식 수치는 비공개다. `claude.ai/settings/usage`에서 확인한다.
- 매 실행이 저장소를 **새로 클론**하므로, 상태는 반드시 Drive에 쓴다(저장소에 쓰지 않는다).
- **insane-search 가용성**: 로컬 플러그인이라 클라우드 루틴에서 인식 안 될 수 있다.
  "Run Now" 테스트 때 실제 호출 여부를 확인하고, 안 되면 내장 웹검색 폴백으로 동작한다.
  (`/yunmun`은 repo 커밋 스킬이라 클라우드에서도 동작한다.)
