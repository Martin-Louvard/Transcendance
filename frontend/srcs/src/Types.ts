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
}

export interface Friendships {
  id: number,
  user_id: number,
  friend_id: number,
  chat_id: number,
  createdAt: string,
  updatedAt: string
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
  messages: Message[];
}
