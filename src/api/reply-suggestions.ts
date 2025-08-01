import { globalState } from '@/hooks/use-global-data';

/**
 * 质检评价类型，对应后端 MessageQualityTypeEnum
 */
export enum MessageQualityTypeEnum {
  NONE = 'NONE', // 无反馈
  UNRESOLVED = 'UNRESOLVED', // 未解决
  PARTIALLY_RESOLVED = 'PARTIALLY_RESOLVED', // 未完全解决
  FULLY_RESOLVED = 'FULLY_RESOLVED', // 完全解决
}

/**
 * 消息质检评价请求体，对应 DevMessageQualityParam
 */
export interface DevMessageQualityParam {
  /** 消息ID */
  answer_id: string;
  /** 质检评价类型 */
  quality: MessageQualityTypeEnum;
}

/**
 * 响应体 AffectCountVO
 */
export interface AffectCountVO {
  /** 影响的记录数 */
  affectCount?: number;
}

/**
 * 通用响应结构
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
 * 消息质检评价接口
 * @param body 请求体
 */
export async function messageQuality(body: DevMessageQualityParam) {
  const res = await fetch(`${process.env.PUBLIC_API_URL}/v1/message/quality`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${globalState.config.api_key}`,
    },
    body: JSON.stringify(body),
  });
  return res.json();
}

/** 生成会话id */
export async function generateConversationId(user_id: string) {
  const res = await fetch(`${process.env.PUBLIC_API_URL}/v1/conversation`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${globalState.config.api_key}`,
    },
    body: JSON.stringify({ user_id }),
  });
  return res.json();
}
