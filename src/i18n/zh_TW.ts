import * as settings from './modules/settings';
import * as replySuggestions from './modules/reply-suggestions';
import * as assistant from './modules/assistant';

const global = {
  'global.assistant': '人工服務',
  'global.reply_suggestions': '回復建議',
  'global.settings': '設定',
  'global.input': '請輸入',
  'global.cancel': '取消',
  'global.submit': '提交',
  'global.edit': '修改',
  'global.integrated': '已集成',
  'global.unintegrated': '未集成',
  'global.webhook_placeholder': '需集成成功后获取地址',
  'global.no_data': '暫無數據',
  'global.plugin_disconnected': '頁面連結已斷開，請刷新頁面',
};

export default {
  ...global,
  ...settings.zh_TW,
  ...replySuggestions.zh_TW,
  ...assistant.zh_TW,
};
