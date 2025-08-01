export enum Locale {
  ZH_CN = 'zh_CN',
  EN_US = 'en_US',
  ZH_TW = 'zh_TW',
  JA_JP = 'ja_JP',
  ES_ES = 'es_ES',
  TH_TH = 'th_TH',
}

export type ConfigSettings = {
  api_key: string;
  response_mode: 'streaming' | 'blocking';
};

export enum ExtensionMessagteType {
  Init = 'Init',
  UserReply = 'UserReply',
  BotReply1 = 'BotReply1',
  BotReply2 = 'BotReply2',
  SwitchChat = 'SwitchChat',
}
