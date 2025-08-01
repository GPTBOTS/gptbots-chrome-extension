import * as settings from './modules/settings';
import * as replySuggestions from './modules/reply-suggestions';
import * as assistant from './modules/assistant';

const global = {
  'global.assistant': 'Human',
  'global.reply_suggestions': 'Suggestion',
  'global.settings': 'Setting',
  'global.input': 'Please enter',
  'global.cancel': 'Cancel',
  'global.submit': 'Submit',
  'global.edit': 'Edit',
  'global.integrated': 'Integrated',
  'global.unintegrated': 'Unintegrated',
  'global.webhook_placeholder': 'Need to get the address after integration',
  'global.no_data': 'No Data',
  'global.plugin_disconnected': 'Page connection disconnected, please refresh the page',
};

export default {
  ...global,
  ...settings.en_US,
  ...replySuggestions.en_US,
  ...assistant.en_US,
};
