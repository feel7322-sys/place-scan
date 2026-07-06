/**
 * place-scan 초안 자동 발송기 (Google Apps Script)
 *
 * Gmail 커넥터가 create_draft만 지원해 리포트가 임시보관함에 쌓이는 문제를
 * 구글 계정 안에서 해결한다: 시간 트리거로 주기 실행되며, 제목이
 * SUBJECT_PREFIX로 시작하는 초안을 찾아 자동 발송한다.
 *
 * 설치: script.google.com → 새 프로젝트 → 이 코드 붙여넣기 →
 *       sendPlaceScanDrafts 1회 수동 실행(권한 승인) →
 *       트리거 추가(시간 기반, 10분마다).
 */

var SUBJECT_PREFIX = '[Place-Based Scan]';
var ALLOWED_RECIPIENT = 'feel7322@gmail.com'; // 안전장치: 이 주소로 가는 초안만 발송
var MAX_AGE_HOURS = 48; // 이보다 오래된 초안은 건드리지 않음(과거 백로그 오발송 방지)

function sendPlaceScanDrafts() {
  var drafts = GmailApp.getDrafts();
  var now = new Date();
  var sent = 0;

  for (var i = 0; i < drafts.length; i++) {
    var draft = drafts[i];
    try {
      var msg = draft.getMessage();
      var subject = msg.getSubject() || '';
      if (subject.indexOf(SUBJECT_PREFIX) !== 0) continue;

      // 수신자 안전장치
      var to = (msg.getTo() || '').toLowerCase();
      if (to.indexOf(ALLOWED_RECIPIENT) === -1) {
        Logger.log('건너뜀(수신자 불일치): ' + subject + ' → ' + to);
        continue;
      }

      // 오래된 백로그 보호
      var ageHours = (now - msg.getDate()) / (1000 * 60 * 60);
      if (ageHours > MAX_AGE_HOURS) {
        Logger.log('건너뜀(오래된 초안 ' + Math.round(ageHours) + 'h): ' + subject);
        continue;
      }

      draft.send();
      sent++;
      Logger.log('발송: ' + subject);
    } catch (e) {
      // 초안 하나가 실패해도 나머지는 계속 처리
      Logger.log('오류: ' + e);
    }
  }

  if (sent > 0) Logger.log('총 ' + sent + '건 발송 완료');
}
