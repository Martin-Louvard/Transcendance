export interface ChatBox {
  id: number;
  name: string;
  channelType: string;
  ownerId: number; 
}

export interface ChatBoxProps {
  chatBoxes: ChatBox[];
  onChatBoxClick: (ChatBoxId: number) => void;
}

export interface Message {
  senderName: string;
  senderId: number;
  id: number;
  content: string;
}

export interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
  chatBoxId: number;
  chatBoxName: string;
  messagesList: Message[];
}
