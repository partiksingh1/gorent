import { atom } from "jotai"

export interface Message {
    id: string
    text: string
    userId: string
    chatId: string
    createdAt: string
  }

  export interface User {
    user_id: string; // Ensure the correct field name matches your data
    first_name: string;
  }
  
  export interface Chat {
    id: string;
    users: {
      user: User;
    }[];
    messages: Message[];
  }
  
  
  // Atoms for state management
  export  const chatsAtom = atom<Chat[]>([])
  export  const currentChatAtom = atom<Chat | null>(null)
  export  const messagesAtom = atom<Message[]>([])