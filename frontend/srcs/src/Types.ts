export default interface User {
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
}

export default interface Message {
  id: number;
  channelId: number;
  content: string;
  sender: User
}

export default interface ChatChannels {
  id: number;
  ownerId: User;
  admins: User[];
  name?: string;
  password?: string;
  channelType?: string;
}
