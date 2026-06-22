/**
 * SAMS v4.1 Google Apps Script 백엔드 코드
 * 이 코드를 Google Apps Script 프로젝트의 `코드.gs` 파일에 붙여넣고 배포하세요.
 */

function doPost(e) {
  try {
    // 요청 데이터 파싱
    var req = JSON.parse(e.postData.contents);
    var action = req.action;
    var data = req.data;
    
    // 데이터 저장을 위해 ScriptProperties 사용 (또는 SpreadsheetApp을 사용할 수 있습니다)
    // 여기서는 간단하고 빠른 JSON 저장을 위해 PropertiesService를 활용합니다.
    var prop = PropertiesService.getScriptProperties();
    var result = null;
    
    // Action 라우팅 (get / save)
    if (action.startsWith('get')) {
      var key = 'sams_' + action.replace('get', '').toLowerCase();
      var stored = prop.getProperty(key);
      result = stored ? JSON.parse(stored) : null;
    } 
    else if (action.startsWith('save')) {
      var key = 'sams_' + action.replace('save', '').toLowerCase();
      // 용량이 매우 클 경우 스프레드시트로 변경을 권장합니다.
      prop.setProperty(key, JSON.stringify(data));
      result = true;
    }
    else {
      throw new Error("Unknown action: " + action);
    }
    
    // 성공 응답 반환 (CORS 헤더는 웹앱 배포 시 구글이 자동으로 처리함)
    return ContentService.createTextOutput(JSON.stringify({success: true, data: result}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (err) {
    // 에러 발생 시 처리
    return ContentService.createTextOutput(JSON.stringify({success: false, error: err.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// 브라우저에서 URL을 직접 열었을 때 확인용
function doGet(e) {
  return ContentService.createTextOutput("SAMS v4.1 GAS Backend API is running successfully.");
}
