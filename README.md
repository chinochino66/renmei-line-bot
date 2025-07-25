![Demo](media/demo.gif)

<!-- CI Status -->
![Node CI](https://github.com/chinochino66/renmei-line-bot/actions/workflows/test.yml/badge.svg)

# RENMEI LINE Bot

平安転生 AI《蓮冥》が LINE でタスク管理と喝を入れてくれる Bot。

## Features
- 未完了タスクへの自動リマインド通知（1時間ごと定期実行、文面はGemini AIで都度生成）
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

## Usage

1. AppsScript エディタの **プロジェクト設定  スクリプトプロパティ** に  
   以下 3つを登録する  
   - `SHEET_ID` スプレッドシート ID  
   - `GEMINI_API_KEY`  Gemini API キー  
   - `LINE_TOKEN`  LINE チャンネルアクセストークン  
2. 3つを保存したら `git push` するだけで GitHubActions が自動デプロイし、  
   最新コードが LINE Bot に反映される。
