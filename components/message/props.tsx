export interface IMessage {
    id: number;
    sender: string;
    content: string;
    time: string;
    isMe: boolean;
  }
  
  export interface IChatPreview {
    id: number;
    name: string;
    avatar: string;
    preview: string;
    time: string;
    unread?: number;
    isGroup?: boolean;
    tag?: string;
  }