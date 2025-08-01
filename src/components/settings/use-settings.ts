import { reactive } from 'vue';
import { message } from 'ant-design-vue';
import { useI18n } from 'vue-i18n';
import { useStorage } from '@/hooks/use-storage';
import { Locale } from '@/types/default';
import { globalState, storageKey, updateConfigSettings } from '@/hooks/use-global-data';
import { updateLocale } from '@/i18n';
import { replySuggestion } from '../reply-suggestions/use-reply';
import { pendingUsers } from '../assistant/use-assistant';

const { setStorage, removeStorage } = useStorage();

export function useSettings() {
  const { locale, t } = useI18n();

  setTimeout(() => {
    if (!globalState.config.api_key) integrateInfo.isEditing = true;
  }, 300);

  const integrateInfo = reactive({
    loading: false,
    api_key: globalState.config.api_key,
    response_mode: globalState.config.response_mode,
    status: { type: 'success' as 'success' | 'error' | '', text: '' },
    isEditing: false,
    web_hooks: process.env.PUBLIC_WEB_HOOKS || '',
  });

  const handleIntegrate = () => {
    integrateInfo.isEditing = false;
    const { api_key, response_mode } = integrateInfo;
    globalState.config = { ...globalState.config, api_key, response_mode };
    updateConfigSettings({ api_key, response_mode });
    removeStorage(`${storageKey.value}-conversation_id`);
  };

  const handleCancel = () => {
    integrateInfo.isEditing = false;
  };

  const handleEdit = () => {
    integrateInfo.api_key = globalState.config.api_key;
    integrateInfo.isEditing = true;
  };

  const handleCopyWebhooks = () => {
    navigator.clipboard
      .writeText(integrateInfo.web_hooks)
      .then(() => message.success(t('settings.copy_success')))
      .catch(() => message.error(t('settings.copy_error')));
  };

  const handleSetLocale = (value: Locale) => {
    setStorage('locale', value);
    updateLocale(value);
  };

  const handleClear = () => {
    updateConfigSettings({ api_key: '', response_mode: 'streaming' });
    integrateInfo.api_key = '';
    integrateInfo.response_mode = 'streaming';
    globalState.userReplyMessages = [];
    replySuggestion.messages = [];
    pendingUsers.data = [];
    pendingUsers.currentData = [];
    removeStorage(`${storageKey.value}-pendingUsers`);
    removeStorage(`${storageKey.value}-conversation_id`);
  };

  return {
    locale,
    integrateInfo,
    handleIntegrate,
    handleCancel,
    handleEdit,
    handleCopyWebhooks,
    handleSetLocale,
    handleClear,
  };
}
