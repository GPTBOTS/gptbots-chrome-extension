import { ref, computed, reactive } from 'vue';
import { useStorage } from './use-storage';
import { ConfigSettings, ExtensionMessagteType } from '../types/default';
import { message } from 'ant-design-vue';
import { createI18n } from 'vue-i18n';
import { supportPlatforms } from '@/config.options';
import { aesDecrypt, aesEncrypt } from '@/utils/crypto';

const { getStorage, updateStorage } = useStorage();

export const currentTab = ref<chrome.tabs.Tab>();
export const storageKey = computed(() => new URL(currentTab.value?.url || '').hostname);

/** config-缓存key */
const configCacheKey = 'config';

export const globalState = reactive({
  config: { api_key: '', response_mode: 'streaming' } as ConfigSettings,
  userInfo: { user_id: '', name: '', avatar: '' },
  userReplyMessages: [] as string[],
});

/** 是否支持平台 */
export const isSupport = computed(() => {
  const url = currentTab.value?.url || '';
  const { hostname } = new URL(url);
  return supportPlatforms.some((i) => i.support && hostname === i.host);
});

// 存到本地时api_key需要加密
export function updateConfigSettings(val: Partial<ConfigSettings>) {
  globalState.config.api_key = val.api_key || '';
  const configStr = JSON.stringify({ ...globalState.config, ...val });
  updateStorage(configCacheKey, aesEncrypt(configStr));
}

/** 获取用户会话id */
export async function getConversationId(name: string) {
  const cache = await getStorage(`${storageKey.value}-conversation_id`);
  try {
    const data = JSON.parse(cache);
    return data ? data[name] : '';
  } catch (error) {
    console.warn(error);
  }
  return '';
}
/** 更新用户会话id */
export async function updateConversationId(val: string) {
  const cache = await getStorage(`${storageKey.value}-conversation_id`);
  if (cache) {
    const data = JSON.parse(cache);
    data[globalState.userInfo.name] = val;
    await updateStorage(`${storageKey.value}-conversation_id`, JSON.stringify(data));
  } else {
    await updateStorage(`${storageKey.value}-conversation_id`, JSON.stringify({ [globalState.userInfo.name]: val }));
  }
}

export function useGlobalData(i18n: ReturnType<typeof createI18n>) {
  getStorage(configCacheKey).then((res) => {
    if (res) {
      // 获取api_key需要解密
      const config = aesDecrypt(res);
      globalState.config = JSON.parse(config) as ConfigSettings;
    }
  });

  async function init() {
    if (!chrome?.runtime) return;
    globalState.userInfo = { user_id: '', name: '', avatar: '' };
    // globalState.userReplyMessages = [];

    chrome.runtime.onMessage.addListener((message) => {
      console.log('[onMessage]', message);
      if (message.type === ExtensionMessagteType.Init) {
        if (message?.data?.userInfo) globalState.userInfo = message.data.userInfo;
      } else if (message.type === ExtensionMessagteType.UserReply) {
        if (Array.isArray(message.data)) {
          message.data.forEach((item: string) => {
            if (!globalState.userReplyMessages.includes(item)) {
              globalState.userReplyMessages.push(item);
            }
          });
        } else {
          if (!globalState.userReplyMessages.includes(message.data)) {
            globalState.userReplyMessages.push(message.data);
          }
        }
      } else if (message.type === ExtensionMessagteType.SwitchChat) {
        globalState.userReplyMessages = [];
      }
    });

    chrome.tabs.query({ active: true, currentWindow: true }, async function (tabs) {
      if (!tabs.length || !tabs[0].id) return;
      currentTab.value = tabs[0];
      chrome.tabs.sendMessage(tabs[0].id, { type: ExtensionMessagteType.Init }).catch((err) => {
        console.warn(err);
        if (isSupport.value) {
          message.error((i18n.global as any).t('global.plugin_disconnected'));
        }
      });
    });
  }

  if (chrome?.runtime) {
    init();
    chrome.tabs.onActivated.addListener(() => init());
  }
}
