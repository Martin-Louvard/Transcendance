export interface User {
  id: number;
  username: string;
  email: string;
  avatar: string;
  twoFAEnabled: boolean;
  status: string;
  victoriesCount: number;
  defeatCount: number;
  rank: string;
  level: number;
  achievements: JSON | null;
  createdAt: string;
  access_token: string;
  friends: Array<Object>;
  isLoggedIn: boolean;
  JoinedChatChannels: ChatChannels[];
  BannedFromChatChannels: ChatChannels[];
  AdminOnChatChannels: ChatChannels[];
  OwnedChatChannels: ChatChannels[];
}

export interface Message {
  id: number;
  channelId: number;
  content: string;
  sender: User
}

export interface ChatChannels {
  id: number;
  Owner: User;
  Admins: User[];
  name?: string;
  password?: string;
  channelType?: string;
}

export interface ChatChannelsProps {
  chatchannel: ChatChannels[];
  onChatChannelClick: (channelID: number) => void;
  onCreateChat: (Owner: User, name?: string, password?: string) => void;
}
