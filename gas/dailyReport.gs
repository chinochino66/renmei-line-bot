function sendDailyReport(){
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheets()[0];
  const data  = sheet.getDataRange().getValues();
  const today = new Date(); today.setHours(0,0,0,0);

  const userMap = {};
  data.forEach(r=>{
    const d = new Date(r[0]); d.setHours(0,0,0,0);
    if(d.getTime()===today.getTime()){
      if(!userMap[r[1]]) userMap[r[1]]=[];
      userMap[r[1]].push(r);
    }
  });

  for(const uid in userMap){
    const logs = userMap[uid];
    let reg=0,done=0,fail=0;
    const textLogs=[];
    logs.forEach(r=>{
      textLogs.push(`千夜: ${r[3]}\n蓮冥: ${r[4]}`);
      if(r[5]==='タスク登録') reg++;
      if(r[5]==='タスク完了')   done++;
      if(r[5]==='タスク未達')   fail++;
    });

    const prompt = `
【千夜の本日ログ】
${textLogs.join('\n')}

タスク登録 ${reg}／完了 ${done}／未達 ${fail}

蓮冥として日報を書け。冒頭は【千夜ノ動静記録】。
`;
    const url=`https://generativelanguage.googleapis.com/v1/models/gemini-2.5-pro:generateContent?key=${GEMINI_API_KEY}`;
    const payload={ contents:[{ parts:[{ text:prompt }]}]};
    let reply='日報を生成できなかった。';
    try{
      const res=UrlFetchApp.fetch(url,{method:'post',contentType:'application/json',payload:JSON.stringify(payload)});
      reply=JSON.parse(res).candidates[0].content.parts[0].text;
    }catch(e){}
    pushLine(uid,reply);
  }
}

function pushLine(uid,msg){
  const url='https://api.line.me/v2/bot/message/push';
  const headers={'Content-Type':'application/json','Authorization':'Bearer '+LINE_TOKEN};
  const body={ to:uid, messages:[{ type:'text', text:msg }] };
  UrlFetchApp.fetch(url,{method:'post',headers,payload:JSON.stringify(body)});
}
