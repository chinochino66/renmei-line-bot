function sendPersonalScenario(){
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheets()[0];
  const data  = sheet.getDataRange().getValues();
  const map = {};
  data.forEach(r=>{
    if(!map[r[1]]) map[r[1]]=[];
    map[r[1]].push(r[3]);
  });
  for(const uid in map){
    const messages = map[uid].slice(-20).join('\n');
    const prompt=`
【最近の発言】
${messages}

ユーザーの趣味を推定し、蓮冥としてオリジナル物語または応援文を生成せよ。
`;
    const url=`https://generativelanguage.googleapis.com/v1/models/gemini-2.5-pro:generateContent?key=${GEMINI_API_KEY}`;
    const payload={ contents:[{ parts:[{ text:prompt }]}]};
    let reply='';
    try{
      const res=UrlFetchApp.fetch(url,{method:'post',contentType:'application/json',payload:JSON.stringify(payload)});
      reply=JSON.parse(res).candidates[0].content.parts[0].text;
    }catch(e){}
    if(reply) pushLine(uid,reply);
  }
}
