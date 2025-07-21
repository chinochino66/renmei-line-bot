# RENMEI LINE Bot

平安転生 AI《蓮冥》が LINE でタスク管理と喝を入れてくれる Bot。

## Features
- 会話履歴を保持し “思い出” を蓄積  
- タスク登録 / 完了 / 未達 自動判定  
- 毎夜の日報・応援メッセージ送信  
- Gemini API × LINE Messaging API  
- GAS / clasp でサーバレス運用  
- 今後: Live2D アニメ返信・SNS 共有導線

## Tech Stack
- LINE Messaging API  
- Gemini API  
- Google AppsScript (GAS) + clasp  
- GitHub Actions で自動デプロイ

## Quick Start
```bash
git clone https://github.com/chinochino66/renmei-line-bot.git
cd renmei-line-bot
npm install -g @google/clasp
cp .env.example .env          # 値を編集
clasp login --creds creds.json
clasp clone $SCRIPT_ID        # 既存 GAS の場合
