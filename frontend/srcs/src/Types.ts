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

export interface Friend {
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
}

export enum Status {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  DECLINED = "DECLINED",
  CANCELED = "CANCELED",
}

export interface Friendships {
  id: number,
  user_id: number,
  friend_id: number,
  status: Status
  chat_id: number,
  createdAt: string,
  updatedAt: string,
  friend: Friend,
  user: Friend
}

export interface Message {
  id: number;
  channelId: number;
  senderId: number;
  content: string;
}

export interface ChatChannels {
  id: number;
  Owner: User;
  Admins: User[];
  name?: string;
  password?: string;
  channelType?: string;
  messages: Message[];
  participants: User[];
}
