import { globalState } from '@/hooks/use-global-data';

/**
 * 会话类型枚举，对应后端 ConversationTypeEnum
 */
export enum ConversationTypeEnum {
  WEB = 'WEB',
  SHARE = 'SHARE',
  API = 'API',
  EMBED = 'EMBED',
  WIDGET = 'WIDGET',
  APP = 'APP',
  TRAIN = 'TRAIN',
  C = 'C',
  CHAT = 'CHAT',
  DINGTALK = 'DINGTALK',
  WHATSAPP_META = 'WHATSAPP_META',
  WHATSAPP_ENGAGELAB = 'WHATSAPP_ENGAGELAB',
  DISCORD = 'DISCORD',
  SLACK = 'SLACK',
  ZAPIER = 'ZAPIER',
  DATA_PARSE = 'DATA_PARSE',
  FLOW_COMPONENT = 'FLOW_COMPONENT',
  AI_SEARCH = 'AI_SEARCH',
  TELEGRAM = 'TELEGRAM',
  DATABASE_EXTRACT = 'DATABASE_EXTRACT',
  DATABASE_AI_CREATE_FIELDS = 'DATABASE_AI_CREATE_FIELDS',
  DATABASE_AI_GENERATE_RECORDS = 'DATABASE_AI_GENERATE_RECORDS',
  WXKF = 'WXKF',
  LIVECHAT = 'LIVECHAT',
  CHAT_QUESTION_TAG = 'CHAT_QUESTION_TAG',
  FACEBOOK = 'FACEBOOK',
  INSTAGRAM = 'INSTAGRAM',
  SO_BOT = 'SO_BOT',
  WORKFLOW_CHAT = 'WORKFLOW_CHAT',
  LINE = 'LINE',
  ZOHO_SALES_IQ = 'ZOHO_SALES_IQ',
}

/**
 * 入参类型，对应后端 ConversionTypeForm
 */
export interface ConversionTypeForm {
  /** 会话类型 */
  conversationType: ConversationTypeEnum;
}

/**
 * 通用响应对象，对应后端 RespObject<T>
 */
export interface RespObject<T> {
  /** 返回的数据 */
  data: T;
  /** 返回码 */
  code: number;
  /** 失败原因描述 */
  message: string;
}

/**
 * SSE订阅接口，客户端通过长连接获取消息
 * @param params 查询参数
 * @returns EventSource 实例
 */
export function subscribeBrowserExtension(params: ConversionTypeForm): EventSource {
  // 构建查询字符串
  const query = `conversationType=${params.conversationType}`;
  // 这里假设botId通过header传递，实际项目可根据后端要求调整
  const url = `${process.env.PUBLIC_API_URL}/v1/browser/extension/subscribe?${query}`;
  const eventSource = new EventSource(url, { withCredentials: true });
  // 你可以在外部监听 eventSource.onmessage、eventSource.onerror 等事件
  return eventSource;
}

/**
 * 关闭会话
 * @param params 查询参数
 */
export function closeConversation(conversation_id: string): Promise<RespObject<void>> {
  const url = `${process.env.PUBLIC_API_URL}/v1/human/close`;
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${globalState.config.api_key}`,
    },
    body: JSON.stringify({ conversation_id, timestamp: Date.now() }),
  }).then((res) => res.json());
}

/**
 * 会话选项类型
 */
export interface ConversationOption {
  conversationType: ConversationTypeEnum;
  childrenList: Array<{
    channelName: string;
    channelId: string;
  }>;
}

/**
 * 获取会话列表
 * @param params 查询参数
 */
export function getConversationList(params: { conversationTypeList: ConversationTypeEnum[] }): Promise<RespObject<ConversationOption[]>> {
  const url = `${process.env.PUBLIC_API_URL}/v1/conversation/option`;
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${globalState.config.api_key}`,
    },
    body: JSON.stringify(params),
  }).then((res) => res.json());
}

