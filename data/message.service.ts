import { IChatPreview, IMessage } from '@/components/message/props';

// Simulate API fetching with delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data for chats - 5 individuals
const mockChats: IChatPreview[] = [
  {
    id: 1,
    name: 'Emma Wilson',
    avatar: '/avatars/emma.jpg',
    preview: 'Can we discuss the project timeline for the new feature?',
    time: '5m',
    unread: 2
  },
  {
    id: 2,
    name: 'John Cooper',
    avatar: '/avatars/john.jpg',
    preview: 'Following up on my application...',
    time: '1h',
    tag: 'Applicant'
  },
  {
    id: 3,
    name: 'Sarah Miller',
    avatar: '/avatars/sarah.jpg',
    preview: 'The latest designs are ready for review.',
    time: '2h'
  },
  {
    id: 4,
    name: 'Michael Brown',
    avatar: '/avatars/michael.jpg',
    preview: 'Thank you for considering my application.',
    time: '4h',
    tag: 'Applicant'
  },
  {
    id: 5,
    name: 'Jessica Taylor',
    avatar: '/avatars/jessica.jpg',
    preview: 'When would be a good time for an interview?',
    time: '6h',
    tag: 'Applicant'
  }
];

// Mock messages for each chat
const mockMessages: Record<number, IMessage[]> = {
  1: [
    {
      id: 1,
      sender: 'Emma Wilson',
      content: 'Can we discuss the project timeline for the new feature?',
      time: '10:30 AM',
      isMe: false
    },
    {
      id: 2,
      sender: 'You',
      content: 'Hi Emma, thanks for reaching out!',
      time: '10:32 AM',
      isMe: true
    },
    {
      id: 3,
      sender: 'Emma Wilson',
      content: "I was thinking we could review the timeline for the Q2 feature rollout. Do you have time this afternoon?",
      time: '10:33 AM',
      isMe: false
    }
  ],
  2: [
    {
      id: 1,
      sender: 'John Cooper',
      content: 'Following up on my application...',
      time: '10:30 AM',
      isMe: false
    },
    {
      id: 2,
      sender: 'You',
      content: 'Hi John, thanks for reaching out!',
      time: '10:32 AM',
      isMe: true
    },
    {
      id: 3,
      sender: 'John Cooper',
      content: "I'm very interested in the position and would love to discuss my qualifications further.",
      time: '10:35 AM',
      isMe: false
    }
  ],
  3: [
    {
      id: 1,
      sender: 'Sarah Miller',
      content: 'The latest designs are ready for review.',
      time: '10:30 AM',
      isMe: false
    },
    {
      id: 2,
      sender: 'You',
      content: "Great, I'll take a look at them right away.",
      time: '10:32 AM',
      isMe: true
    }
  ],
  4: [
    {
      id: 1,
      sender: 'Michael Brown',
      content: 'Thank you for considering my application.',
      time: '10:30 AM',
      isMe: false
    },
    {
      id: 2,
      sender: 'You',
      content: 'Thanks for applying. Your experience looks interesting!',
      time: '10:32 AM',
      isMe: true
    }
  ],
  5: [
    {
      id: 1,
      sender: 'Jessica Taylor',
      content: 'When would be a good time for an interview?',
      time: '10:30 AM',
      isMe: false
    },
    {
      id: 2,
      sender: 'You',
      content: 'How about Thursday at 2pm?',
      time: '10:32 AM',
      isMe: true
    }
  ]
};

// Fetch all chats
export const fetchChats = async (): Promise<IChatPreview[]> => {
  await delay(500);
  return mockChats;
};

// Fetch messages for a specific chat
export const fetchMessages = async (chatId: number): Promise<IMessage[]> => {
  await delay(300); 
  return mockMessages[chatId] || [];
};

// Send a new message
export const sendNewMessage = async (chatId: number, content: string): Promise<IMessage> => {
  await delay(300);
  
  const newMessage: IMessage = {
    id: Date.now(),
    sender: 'You',
    content,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    isMe: true
  };
  
  // Update our mock data
  if (!mockMessages[chatId]) {
    mockMessages[chatId] = [];
  }
  
  mockMessages[chatId].push(newMessage);
  
  return newMessage;
};