import * as settings from './modules/settings';
import * as replySuggestions from './modules/reply-suggestions';
import * as assistant from './modules/assistant';

const global = {
  'global.assistant': '人工サービス',
  'global.reply_suggestions': '回答提案',
  'global.settings': '設定',
  'global.input': '入力してください',
  'global.cancel': 'キャンセル',
  'global.submit': '送信',
  'global.edit': '編集',
  'global.integrated': '統合済み',
  'global.unintegrated': '未統合',
  'global.webhook_placeholder': '統合後にアドレスを取得してください',
  'global.no_data': 'データがありません',
  'global.plugin_disconnected': 'ページの接続が切断されました。ページを更新してください',
};

export default {
  ...global,
  ...settings.ja_JP,
  ...replySuggestions.ja_JP,
  ...assistant.ja_JP,
};
