// 本日登録・未達成タスクを抽出
function getTodayPendingTasks(userId) {
  var sheet = SpreadsheetApp.openById(SHEET_ID).getSheets()[0];
  var data = sheet.getDataRange().getValues();
  var today = new Date();
  today.setHours(0,0,0,0);

  var tasks = [];
  var completedSet = new Set();

  // まず完了タスク文を全部セットに
  for (var i = 0; i < data.length; i++) {
    var row = data[i];
    var rowDate = new Date(row[0]);
    rowDate.setHours(0,0,0,0);
    if (row[1] == userId && row[5] == "タスク完了" && rowDate.getTime() === today.getTime()) {
      completedSet.add(row[3]);
    }
  }

  // 本日「タスク登録」され、まだ「完了報告」がないものだけ
  for (var i = 0; i < data.length; i++) {
    var row = data[i];
    var rowDate = new Date(row[0]);
    rowDate.setHours(0,0,0,0);
    if (row[1] == userId && row[5] == "タスク登録" && rowDate.getTime() === today.getTime()) {
      if (!completedSet.has(row[3])) {
        tasks.push(row[3]);
      }
    }
  }
  return tasks;
}

// 時刻を抽出する（"13:00", "13時", "13時30分"など）
function extractTime(taskText) {
  var match = taskText.match(/([01]?[0-9]|2[0-3])[:時]([0-5][0-9])?/);
  if (!match) return null;
  var hour = parseInt(match[1], 10);
  var minute = match[2] ? parseInt(match[2], 10) : 0;
  return {hour: hour, minute: minute};
}

// Gemini呼び出し関数
function getGeminiReply(prompt) {
  var geminiApiKey = GEMINI_API_KEY; // constants.gsなどで定義
  var geminiApiUrl = "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-pro:generateContent?key=" + geminiApiKey;
  var payload = { contents: [{ parts: [{ text: prompt }] }] };
  var geminiOptions = {
    "method": "POST",
    "contentType": "application/json",
    "payload": JSON.stringify(payload)
  };
  try {
    var response = UrlFetchApp.fetch(geminiApiUrl, geminiOptions);
    var result = JSON.parse(response.getContentText());
    if (result.candidates && result.candidates.length > 0) {
      return result.candidates[0].content.parts[0].text;
    }
  } catch (e) {
    Logger.log("Gemini生成失敗: " + e);
  }
  // 失敗時のテンプレ
  return "まだ終わらせていないタスクがあるようだ。";
}

// リマインド実行（1時間ごと等のトリガー推奨）
function remindPendingTasks() {
  var sheet = SpreadsheetApp.openById(SHEET_ID).getSheets()[0];
  var data = sheet.getDataRange().getValues();
  var users = new Set();
  for (var i = 0; i < data.length; i++) {
    users.add(data[i][1]);
  }
  var now = new Date();
  var nowHour = now.getHours();
  var nowMinute = now.getMinutes();

  users.forEach(function(userId) {
    var tasks = getTodayPendingTasks(userId);
    tasks.forEach(function(task) {
      var t = extractTime(task);
      var geminiPrompt = `
「${task}」というタスクを、ユーザーがまだ完了していない。
蓮冥として、その内容に沿った激励・喝・煽り・叱咤などのリマインドメッセージを一文で生成せよ。語尾は必ず「だ・である調」。上品で知的なキャラ性を保ち、たまに皮肉を交えてよい。`;

      var replyText = "まだ「" + task + "」が残っている。早く終わらせよ。"; // fallback

      if (t) {
        if (nowHour === ((t.hour + 23) % 24) && Math.abs(nowMinute - t.minute) < 10) {
          replyText = getGeminiReply(geminiPrompt);
          sendLinePush(userId, replyText);
        }
      } else {
        // いつ実行しても必ず通知する
        replyText = getGeminiReply(geminiPrompt);
        sendLinePush(userId, replyText);
      }
    });
  });
}
