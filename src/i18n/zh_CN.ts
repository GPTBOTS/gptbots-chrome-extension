import * as settings from './modules/settings';
import * as replySuggestions from './modules/reply-suggestions';
import * as assistant from './modules/assistant';

const global = {
  'global.assistant': '人工服务',
  'global.reply_suggestions': '回复建议',
  'global.settings': '设置',
  'global.input': '请输入',
  'global.cancel': '取消',
  'global.submit': '提交',
  'global.edit': '修改',
  'global.integrated': '已集成',
  'global.unintegrated': '未集成',
  'global.webhook_placeholder': '需集成成功后获取地址',
  'global.no_data': '暂无数据',
  'global.plugin_disconnected': '页面连接已断开，请刷新页面',
};

export default {
  ...global,
  ...settings.zh_CN,
  ...replySuggestions.zh_CN,
  ...assistant.zh_CN,
};
