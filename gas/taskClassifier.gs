function classifyTask(message) {
  message = message.toLowerCase();
  const regRegister = /(タスク|task|やること|todo|目標|課題)/;
  const regDone     = /(完了|できた|done|達成|終わった|finished|終了|クリア)/;
  const regFail     = /(未達|未完|できなかった|失敗|サボった|断念|あきらめた)/;

  if (regRegister.test(message)) {
    if (regDone.test(message)) return 'タスク完了';
    if (regFail.test(message)) return 'タスク未達';
    return 'タスク登録';
  }
  if (regDone.test(message)) return 'タスク完了';
  if (regFail.test(message)) return 'タスク未達';
  return '通常発言';
}
