/**
 * 消息类型
 */
export enum MessageType {
  QUESTION = 'QUESTION', // 问题
  ANSWER = 'ANSWER', // 答案
  HUMAN = 'HUMAN', // 人工客服
}

/**
 * 消息内容类型
 */
export enum BotMessageContentType {
  Text = 'Text',
  FlowFormText = 'FlowFormText',
  FlowTextText = 'FlowTextText',
  FlowJsonText = 'FlowJsonText',
  FlowCardText = 'FlowCardText',
  ReasoningProcess = 'ReasoningProcess',
  Image = 'Image',
  File = 'File',
  Audio = 'Audio',
  Video = 'Video',
  Document = 'Document',
}

/**
 * 用户信息
 */
export interface WebhookInitUserInfo {
  phone?: string;
  email?: string;
  user_id?: string;
  user_name?: string;
  anonymous_id?: string;
}

/**
 * 消息文件
 */
export interface ConversationInitMessageFile {
  content_type: BotMessageContentType;
  url: string;
}

/**
 * 会话初始化消息
 */
export interface ConversationInitMessage {
  message_type: MessageType;
  text?: string;
  files?: ConversationInitMessageFile[];
}

/**
 * 会话初始化请求体
 */
export interface WebhookConversationInitReq {
  conversation_id?: string;
  body?: ConversationInitMessage[];
  timestamp?: number;
  email?: string;
  bot_id?: string;
  user_info?: WebhookInitUserInfo;
}
