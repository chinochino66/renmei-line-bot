/**
 * シークレット類はスクリプトプロパティから取得
 * スクリプトエディタ > プロジェクトの設定 > プロパティ に登録すること
 */
const SHEET_ID       = PropertiesService.getScriptProperties().getProperty('SHEET_ID');
const GEMINI_API_KEY = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
const LINE_TOKEN     = PropertiesService.getScriptProperties().getProperty('LINE_TOKEN');
