import { computed, reactive } from 'vue';
import { ExtensionMessagteType } from '@/types/default';
import { currentTab, updateConversationId, getConversationId, globalState } from '@/hooks/use-global-data';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { supportPlatforms } from '@/config.options';
import { generateConversationId, messageQuality, MessageQualityTypeEnum } from '@/api/reply-suggestions';
import { message } from 'ant-design-vue';
import { getUserId } from '@/utils';
import { useI18n } from 'vue-i18n';

/** 阻塞模式返回数据 */
type BlockingOutput = {
  content: {
    text: string;
    audio?: { audio: string; transcript: string }[];
    image: string;
    video: string;
    document: string;
  };
};

/** bot回复建议 */
export const replySuggestion = reactive({
  messages: [] as { code: number; data: string }[],
  loading: false,
  answer_id: '',
});

export function useReply() {
  const { t } = useI18n();

  const currentPlatform = computed(() => {
    const url = currentTab.value?.url || '';
    const { hostname } = new URL(url);
    const item = supportPlatforms.find((i) => i.support && hostname === i.host);
    return {
      ...item,
      icon: item?.icon || currentTab.value?.favIconUrl,
      label: item?.label || hostname,
    };
  });

  const actionDisabled = computed(() => !replySuggestion.messages.length);

  chrome.runtime.onMessage.addListener((message) => {
    const shouldReset =
      message.type === ExtensionMessagteType.Init || message.type === ExtensionMessagteType.SwitchChat;
    if (shouldReset) {
      replySuggestion.messages = [];
      replySuggestion.loading = false;
      if (timeoutId) clearTimeout(timeoutId);
    }
  });

  let timeoutId: ReturnType<typeof setTimeout>;
  /** 生成回复建议 */
  async function generateReplySuggestions() {
    replySuggestion.loading = true;
    try {
      if (!globalState.config.api_key) return;
      replySuggestion.messages = [];
      let conversation_id = await getConversationId(globalState.userInfo.name);
      if (!conversation_id) {
        // conversatio放到-生成回复建议前调用，不同客户区分conversation_id，生成后一直使用
        const res = await generateConversationId(getUserId(currentTab.value!)!);
        conversation_id = res.conversation_id;
        await updateConversationId(conversation_id);
      }

      const ctrl = new AbortController();
      // Set a timeout of 1 minute
      timeoutId = setTimeout(() => {
        ctrl.abort();
        replySuggestion.loading = false;
        message.error(t('reply-suggestions.generate_error'));
      }, 60000);

      const name = globalState.userInfo.name;
      await fetchEventSource(process.env.PUBLIC_API_URL + '/v2/conversation/message', {
        openWhenHidden: true,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${globalState.config.api_key}`,
        },
        body: JSON.stringify({
          response_mode: globalState.config.response_mode,
          conversation_id,
          messages: [{ role: 'user', content: globalState.userReplyMessages.join(' ') }],
        }),
        signal: ctrl.signal,
        onmessage(ev) {
          clearTimeout(timeoutId);
          if (name !== globalState.userInfo.name) return;
          const resData = JSON.parse(ev.data);
          console.log(resData);
          if (resData?.code < 0) {
            throw new Error(resData?.message);
          } else if (resData?.code >= 20000) {
            throw new Error(resData?.message);
          }
          // 流式处理
          if (globalState.config.response_mode === 'streaming') {
            const code = resData?.code;
            if ([3, 12, 13, 14, 15, 39].includes(code)) {
              setTimeout(() => (replySuggestion.loading = false), 300);
            }
            if ([3, 12, 13, 14, 15].includes(code)) {
              setTimeout(() => {
                if (name !== globalState.userInfo.name) return;
                const isSameCode = replySuggestion.messages[replySuggestion.messages.length - 1]?.code === code;
                if (isSameCode) {
                  replySuggestion.messages[replySuggestion.messages.length - 1].data += resData.data;
                } else {
                  replySuggestion.messages.push({ code, data: resData.data });
                }
              }, 300);
            } else if (code === 39) {
              // 音频转文字
              setTimeout(() => {
                if (name !== globalState.userInfo.name) return;
                const isSameCode = replySuggestion.messages[replySuggestion.messages.length - 1]?.code === code;
                if (isSameCode) {
                  replySuggestion.messages[replySuggestion.messages.length - 1].data += resData.data.transcript;
                } else {
                  replySuggestion.messages.push({ code, data: resData.data.transcript });
                }
              }, 300);
            } else if (code === 11) {
              replySuggestion.answer_id = resData.data?.message_id;
            }
          } else {
            // 阻塞式处理
            if (Array.isArray(resData?.output)) {
              const code = 0;
              const output = resData?.output as BlockingOutput[];
              output.forEach((item) => {
                if (item.content.text) replySuggestion.messages.push({ code, data: item.content.text });
                if (Array.isArray(item.content.audio)) {
                  item.content.audio.forEach((i) => {
                    if (i.audio) replySuggestion.messages.push({ code, data: i.audio });
                    if (i.transcript) replySuggestion.messages.push({ code, data: i.transcript });
                  });
                }
                if (item.content.image) replySuggestion.messages.push({ code, data: item.content.image });
                if (item.content.video) replySuggestion.messages.push({ code, data: item.content.video });
                if (item.content.document) replySuggestion.messages.push({ code, data: item.content.document });
              });
              replySuggestion.answer_id = resData?.message_id;
            }
          }
        },
        onerror(err) {
          console.warn(err);
          clearTimeout(timeoutId);
          replySuggestion.loading = false;
          message.error(err?.message || t('reply-suggestions.generate_error'));
          throw new Error(typeof err === 'string' ? err : err?.message);
        },
        onclose() {
          clearTimeout(timeoutId);
          replySuggestion.loading = false;
          console.log(replySuggestion.messages);
        },
      });
    } catch (error) {
      console.error(error);
    }
  }

  /** 处理回复建议 */
  async function handleReplySuggestions(type?: ExtensionMessagteType) {
    const quality =
      type === ExtensionMessagteType.BotReply1
        ? MessageQualityTypeEnum.FULLY_RESOLVED
        : type === ExtensionMessagteType.BotReply2
          ? MessageQualityTypeEnum.PARTIALLY_RESOLVED
          : MessageQualityTypeEnum.UNRESOLVED;
    messageQuality({ answer_id: replySuggestion.answer_id, quality });
    if (type === undefined) {
      replySuggestion.messages = [];
    } else {
      globalState.userReplyMessages = [];
      if (currentTab.value?.id) {
        chrome.tabs.sendMessage(currentTab.value.id, {
          type,
          data: replySuggestion.messages.map((i) => i.data).join('\n'),
        });
        // 清空回复建议
        replySuggestion.messages = [];
      } else {
        message.error('error');
        console.warn('currentTab.value?.id is undefined');
      }
    }
  }

  return {
    currentPlatform,
    actionDisabled,
    replySuggestion,
    generateReplySuggestions,
    handleReplySuggestions,
  };
}
