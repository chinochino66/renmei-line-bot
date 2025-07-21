function getRecentMessages(userId, n) {
  const sheet   = SpreadsheetApp.openById(SHEET_ID).getSheets()[0];
  const data    = sheet.getDataRange().getValues();
  const messages = [];
  for (let i = data.length - 1; i >= 0 && messages.length < n; i--) {
    if (data[i][1] === userId && data[i][3] && data[i][4]) {
      messages.unshift(`千夜: ${data[i][3]}\n蓮冥: ${data[i][4]}`);
    }
  }
  return messages.join('\n');
}
