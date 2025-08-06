function doPost(e) {
  const json         = JSON.parse(e.postData.contents);
  const replyToken   = json.events[0].replyToken;
  const userMessage  = json.events[0].message.text;
  const userId       = json.events[0].source.userId;

  /* 二重投稿防止 */
  const prop = PropertiesService.getScriptProperties();
  const tokenKey = 'LINE_' + replyToken;
  if (prop.getProperty(tokenKey)) return;
  prop.setProperty(tokenKey, new Date().toString());

  const recent   = getRecentMessages(userId, 5);
  const taskType = classifyTask(userMessage);

  let specialPrompt = '';
  if (taskType === 'タスク完了') specialPrompt = '千夜がタスク達成。賞賛と次の喝を。';
  if (taskType === 'タスク未達') specialPrompt = '千夜がタスク未達。厳しい叱咤を。';
  if (taskType === 'タスク登録') specialPrompt = '千夜が新タスク登録。鼓舞せよ。';

  const prompt = `
【履歴】
${recent}

【新しい問い】
「${userMessage}」

${specialPrompt}

ここにキャラ設定などのプロンプトを入れる

`;

  const geminiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-pro:generateContent?key=${GEMINI_API_KEY}`;
  const payload   = { contents: [{ parts: [{ text: prompt }] }] };
  const options   = { method:'post', contentType:'application/json', payload:JSON.stringify(payload) };

  let replyText = '……';
  try {
    const res = UrlFetchApp.fetch(geminiUrl, options);
    replyText = JSON.parse(res).candidates[0].content.parts[0].text;
  } catch(err){}

  logToSheet(userId, userMessage, replyText, taskType);
  replyLine(replyToken, replyText);
}

function replyLine(token, text){
  const url = 'https://api.line.me/v2/bot/message/reply';
  const headers = { 'Content-Type':'application/json','Authorization':'Bearer '+LINE_TOKEN };
  const body = { replyToken:token, messages:[{ type:'text', text }] };
  UrlFetchApp.fetch(url,{ method:'post', headers, payload:JSON.stringify(body)});
}

function logToSheet(uid, userMsg, botMsg, taskType){
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheets()[0];
  sheet.appendRow([ new Date(), uid, '千夜', userMsg, botMsg, taskType ]);
}
