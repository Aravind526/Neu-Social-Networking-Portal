// User Types
export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  status: string;
  email: string;
  createdAt: number;
}

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface UserState {
  currentUser: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
}

// Channel Types
export interface Channel {
  id: string;
  name: string;
  description: string;
  createdBy: {
    name: string;
    avatar: string;
    id: string;
  };
  createdAt: number;
}

export interface ChannelState {
  currentChannel: Channel | null;
  isPrivateChannel: boolean;
  channels: Channel[];
  starredChannels: Channel[];
  activeUsers: User[];
}

// Message Types
export interface Message {
  id: string;
  content: string;
  timestamp: number;
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  image?: string;
  hasRead?: boolean;
}

export interface MessageState {
  messages: Message[];
  searchTerm: string;
  searchResults: Message[];
}

// UI Types
export interface UIState {
  primaryColor: string;
  secondaryColor: string;
  sidebarVisible: boolean;
  loading: boolean;
  error: string | null;
}

// Action Types
export interface UserAction {
  type: string;
  payload: {
    currentUser?: User;
    profile?: UserProfile;
  };
}

export interface ChannelAction {
  type: string;
  payload: {
    currentChannel?: Channel;
    isPrivateChannel?: boolean;
    channels?: Channel[];
    starredChannels?: Channel[];
    activeUsers?: User[];
  };
}

export interface MessageAction {
  type: string;
  payload: {
    messages?: Message[];
    message?: Message;
    searchTerm?: string;
    searchResults?: Message[];
  };
}

export interface UIAction {
  type: string;
  payload: {
    primaryColor?: string;
    secondaryColor?: string;
    loading?: boolean;
    error?: string | null;
  };
}