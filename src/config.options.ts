import { Locale } from './types/default';
import { ConversationTypeEnum } from './api/assistant';

/** 插件名称 */
export const ExtensionName = 'GPTBots Assistant';

/** 语言选项 */
export const localeOptions: { label: string; value: Locale }[] = [
  { label: 'English', value: Locale.EN_US },
  { label: '简体中文', value: Locale.ZH_CN },
  { label: '繁體中文', value: Locale.ZH_TW },
  { label: '日本語', value: Locale.JA_JP },
  { label: 'Español', value: Locale.ES_ES },
  { label: 'ไทย', value: Locale.TH_TH },
];

/** 支持的平台 */
export const supportPlatforms: {
  label: string;
  host: string;
  icon: string;
  integration_icon: string;
  support: boolean;
  type: ConversationTypeEnum;
}[] = [
  {
    label: 'Line',
    host: 'chat.line.biz',
    icon: require('@/assets/images/support-line.png'),
    integration_icon: require('@/assets/images/integration-line.png'),
    support: true,
    type: ConversationTypeEnum.LINE,
  },
  {
    label: 'Telegram',
    host: 't.me',
    icon: require('@/assets/images/support-telegram.png'),
    integration_icon: require('@/assets/images/integration-telegram.png'),
    support: false,
    type: ConversationTypeEnum.TELEGRAM,
  },
  {
    label: 'WhatsApp',
    host: 'web.whatsapp.com',
    icon: '',
    integration_icon: require('@/assets/images/integration-whatsapp.png'),
    support: false,
    type: ConversationTypeEnum.WHATSAPP_META,
  },
  {
    label: 'Facebook',
    host: 'facebook.com',
    icon: '',
    integration_icon: require('@/assets/images/integration-facebook.png'),
    support: false,
    type: ConversationTypeEnum.FACEBOOK,
  },
  {
    label: 'DingTalk',
    host: 'dingtalk.com',
    icon: '',
    integration_icon: require('@/assets/images/integration-dingding.png'),
    support: false,
    type: ConversationTypeEnum.DINGTALK,
  },
  {
    label: 'Discord',
    host: 'discord.com',
    icon: '',
    integration_icon: require('@/assets/images/integration-discord.png'),
    support: false,
    type: ConversationTypeEnum.DISCORD,
  },
  {
    label: 'Instagram',
    host: 'instagram.com',
    icon: '',
    integration_icon: require('@/assets/images/integration-instagram.png'),
    support: false,
    type: ConversationTypeEnum.INSTAGRAM,
  },
  {
    label: 'Slack',
    host: 'slack.com',
    icon: '',
    integration_icon: require('@/assets/images/integration-slack.png'),
    support: false,
    type: ConversationTypeEnum.SLACK,
  },
  {
    label: 'soBot',
    host: 'sobot.com',
    icon: '',
    integration_icon: require('@/assets/images/integration-soBot.png'),
    support: false,
    type: ConversationTypeEnum.SO_BOT,
  },
  {
    label: 'Zapier',
    host: 'zapier.com',
    icon: '',
    integration_icon: require('@/assets/images/integration-zapier.png'),
    support: false,
    type: ConversationTypeEnum.ZAPIER,
  },
  {
    label: 'ZohosalesIQ',
    host: 'zohosales.com',
    icon: '',
    integration_icon: require('@/assets/images/integration-zohoSalesIQ.png'),
    support: false,
    type: ConversationTypeEnum.ZOHO_SALES_IQ,
  },
  {
    label: 'API',
    host: 'api.gptbots.com',
    icon: '',
    integration_icon: require('@/assets/images/integration-api.png'),
    support: false,
    type: ConversationTypeEnum.API,
  },
  {
    label: 'Embed',
    host: 'embed.gptbots.com',
    icon: '',
    integration_icon: require('@/assets/images/integration-embedded.png'),
    support: false,
    type: ConversationTypeEnum.EMBED,
  },
  {
    label: 'Share',
    host: 'share.gptbots.com',
    icon: '',
    integration_icon: require('@/assets/images/integration-share.png'),
    support: false,
    type: ConversationTypeEnum.SHARE,
  },
  {
    label: 'WXKF',
    host: 'wxkf.gptbots.com',
    icon: '',
    integration_icon: require('@/assets/images/integration-wxkf.png'),
    support: false,
    type: ConversationTypeEnum.WXKF,
  },
  {
    label: 'EngageLab',
    host: 'engage.whatsapp.com',
    icon: '',
    integration_icon: require('@/assets/images/integration-whatsApp-engageLab.png'),
    support: false,
    type: ConversationTypeEnum.WHATSAPP_ENGAGELAB,
  },
  {
    label: 'Widget',
    host: 'widget.gptbots.com',
    icon: '',
    integration_icon: require('@/assets/images/integration-widget.png'),
    support: false,
    type: ConversationTypeEnum.WIDGET,
  },
  {
    label: 'AiSearchShare',
    host: 'search.gptbots.com',
    icon: '',
    integration_icon: require('@/assets/images/integration-search-share.png'),
    support: false,
    type: ConversationTypeEnum.AI_SEARCH,
  },
  {
    label: 'AiSearchIframe',
    host: 'search.gptbots.com',
    icon: '',
    integration_icon: require('@/assets/images/integration-search-iframe.png'),
    support: false,
    type: ConversationTypeEnum.AI_SEARCH,
  },
  {
    label: 'LiveChat',
    host: 'livechat.com',
    icon: '',
    integration_icon: require('@/assets/images/integration-livechat.png'),
    support: false,
    type: ConversationTypeEnum.AI_SEARCH,
  },
];
