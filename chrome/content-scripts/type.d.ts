export enum ExtensionMessagteType {
  Init = 'Init',
  UserReply = 'UserReply',
  BotReply1 = 'BotReply1',
  BotReply2 = 'BotReply2',
  SwitchChat = 'SwitchChat',
}

export type Message = {
  type: ExtensionMessagteType;
  data: any;
};
