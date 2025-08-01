import { onMounted, reactive } from 'vue';
import { ExtensionMessagteType } from '@/types/default';
import { currentTab, globalState, storageKey } from '@/hooks/use-global-data';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { message } from 'ant-design-vue';
import { useI18n } from 'vue-i18n';
import dayjs from 'dayjs';
import { useStorage } from '@/hooks/use-storage';
import { closeConversation, getConversationList, ConversationTypeEnum, ConversationOption } from '@/api/assistant';

const { setStorage, getStorage, removeStorage } = useStorage();

export type PendingUser = {
  avatar: string;
  user_name: string;
  user_id: string;
  email: string;
  phone: string;
  anonymous_id: string;
  message: string;
  time: string;
  conversation_id: string;
  conversation_type: string;
  channel_id: string;
  channel_name: string;
};

/** 待响应用户列表 */
export const pendingUsers = reactive({ loading: false, data: [] as PendingUser[], currentData: [] as PendingUser[] });

/** 服务信息类型 */
interface ServiceInfo {
  enabled: boolean;
  loading: boolean;
  conversationOptions: Array<{
    label: string;
    value: string;
    children: Array<{
      label: string;
      value: string;
    }>;
  }>;
  conversation: string[];
}

export default function useAssistant() {
  const { t } = useI18n();
  /** 人工服务状态 */
  const serviceInfo = reactive<ServiceInfo>({ 
    enabled: false, 
    loading: false, 
    conversationOptions: [], 
    conversation: [] 
  });

  onMounted(async () => {
    const pendingUsersData = await getStorage(storageKey.value + '-pendingUsers');
    if (pendingUsersData) pendingUsers.data = JSON.parse(pendingUsersData);
  });

  /** 获取显示名称 */
  function getShowName(user: PendingUser) {
    const { user_name, email, phone, user_id, anonymous_id } = user;
    return user_name || email || phone || user_id || anonymous_id || '--';
  }
  const ctrl = new AbortController();
  /** 启动人工服务 */
  function handleStart() {
    if (!globalState.config.api_key) {
      message.error(t('assistant.apiKeyNotConfigured'));
      return;
    }
    if (serviceInfo.loading) return;
    serviceInfo.loading = true;
    fetchEventSource(`${process.env.PUBLIC_API_URL}/v1/browser/extension/subscribe`, {
      openWhenHidden: true,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${globalState.config.api_key}`,
      },
      signal: ctrl.signal,
      onmessage(ev) {
        const resData = JSON.parse(ev.data);
        console.log(resData);
        if (resData.code === 100) {
          serviceInfo.enabled = true;
          serviceInfo.loading = false;
          return;
        }
        if (resData?.code === 0) {
          const payload = JSON.parse(resData.data);
          const body = payload.body || [];
          const userinfo = payload.user_info;
          pendingUsers.data.push({
            ...userinfo,
            avatar: '',
            message: body.findLast((i: any) => i.message_type === 'QUESTION')?.text || '--',
            time: dayjs(payload.timestamp).format('YYYY-MM-DD HH:mm:ss'),
            conversation_id: payload.conversation_id,
            conversation_type: payload.conversation_type,
            channel_id: payload.channel_id || '',
            channel_name: payload.channel_name || '',
          });
          handleChangeConversation();
          setStorage(storageKey.value + '-pendingUsers', JSON.stringify(pendingUsers.data));
        } else if (resData.message) {
          message.error(resData.message);
        }
      },
      onclose() {
        serviceInfo.enabled = false;
        serviceInfo.loading = false;
      },
      onerror(err) {
        console.warn('onerror', err);
        message.error(err.message || 'Error');
        serviceInfo.enabled = false;
        serviceInfo.loading = false;
        ctrl.abort();
        throw err; // rethrow to stop the operation
      },
    });
    // 获取会话列表选项
    getConversationList({ conversationTypeList: [ConversationTypeEnum.LINE] })
      .then(res => {
        if (res.code === 0 && res.data) {
          serviceInfo.conversationOptions = res.data.map((item: ConversationOption) => ({
            label: item.conversationType,
            value: item.conversationType,
            children: item.childrenList?.map(child => ({
              label: child.channelName,
              value: child.channelId,
            })) || [],
          }));
        } else {
          serviceInfo.conversationOptions = []
        }
      })
      .catch(() => {
        serviceInfo.conversationOptions = []
      });
  }

  /** 停止人工服务 */
  function handleStop() {
    serviceInfo.enabled = false;
    ctrl.abort();
  }

  /** 清空待响应用户列表 */
  function handleClearPendingUsers() {
    // 关闭连接
    pendingUsers.data.forEach((item) => closeConversation(item.conversation_id));
    pendingUsers.data = [];
    pendingUsers.currentData = [];
    removeStorage(storageKey.value + '-pendingUsers');
  }

  /** 复制用户名称 */
  function handleCopy(event: MouseEvent, name: string) {
    event.stopPropagation();
    event.preventDefault();
    navigator.clipboard
      .writeText(name)
      .then(() => message.success(t('assistant.copySuccess')))
      .catch(() => message.error(t('assistant.copyFailed')));
  }

  /** 移除待响应用户 */
  function handleRemove(event: MouseEvent, index: number) {
    event.stopPropagation();
    event.preventDefault();
    try {
      // 关闭连接
      closeConversation(pendingUsers.data[index].conversation_id);
      pendingUsers.data.splice(index, 1);
      handleChangeConversation();
      setStorage(storageKey.value + '-pendingUsers', JSON.stringify(pendingUsers.data));
    } catch (error: any) {
      console.error(error);
      message.error(error?.message || 'Error');
    }
  }

  /** 切换聊天 */
  function handleSwitchChat(name: string, channel_name?: string) {
    if (!currentTab.value?.id) return;
    chrome.tabs.sendMessage(currentTab.value.id, { type: ExtensionMessagteType.SwitchChat, data: name, channel: channel_name || '' });
  }

  const handleChangeConversation = () => {
    const result = serviceInfo.conversation || [];
    
    pendingUsers.currentData = result.length > 0 ? pendingUsers.data.filter((item) => {
      // 遍历每个子数组进行匹配
      for (const subArray of result) {
        if (subArray.length === 1) {
          // 如果子项只有一项，判断是否与conversation_type相等
          if (subArray[0] === item.conversation_type) {
            return true;
          }
        } else if (subArray.length > 1) {
          // 如果是多项，去掉第一项，剩下的判断channel_id
          const channelIds = subArray.slice(1);
          if (channelIds.includes(item.channel_id)) {
            return true;
          }
        }
      }
      return false;
    }) : pendingUsers.data;
  };

  return {
    serviceInfo,
    pendingUsers,
    getShowName,
    handleStart,
    handleStop,
    handleClearPendingUsers,
    handleCopy,
    handleRemove,
    handleSwitchChat,
    handleChangeConversation,
  };
}
