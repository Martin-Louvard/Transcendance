import { ConeTwistConstraint } from "cannon-es";

export enum Status {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  DECLINED = "DECLINED",
  CANCELED = "CANCELED",
  BLOCKED = "BLOCKED"
}

export enum UserStatus {
  OFFLINE = "OFFLINE",
  ONLINE = "ONLINE",
  INGAME = "INGAME"
}

export enum ContentOptions{
  PROFILE = "profile",
  FRIENDS = "friends",
  HISTORY= "games",
  PLAY = "lobby",
  FRIENDPROFILE = "friendProfile"
}


export interface User {
  id: number;
  username: string;
  email: string;
  avatar: string;
  status: UserStatus;
  twoFAEnabled: boolean;
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
  status: UserStatus;
  twoFAEnabled: boolean;
  victoriesCount: number;
  defeatCount: number;
  rank: string;
  level: number;
  achievements: JSON | null;
  createdAt: string;
}

export interface Friendships {
  id: number,
  user_id: number,
  friend_id: number,
  status: Status,
  sender_id: number,
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
  sender: User;
  content: string;
  readersId: number[] | undefined;
  createdAt: string;
}

export interface ChatChannels {
  id: number;
  owner: User;
  admins: User[];
  name?: string;
  friendship? : Friendships;
  password?: string;
  channelType?: string;
  messages: Message[];
  participants: User[];
  bannedUsers: User[];
  isOpen: boolean;
  notifications: number ;
}


