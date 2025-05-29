import { Dispatch } from 'redux';
import { 
  SET_CURRENT_CHANNEL, 
  SET_PRIVATE_CHANNEL, 
  SET_USER_CHANNELS,
  SET_STARRED_CHANNELS,
  SET_ACTIVE_USERS
} from './types';
import { Channel, User } from '../../types';

export const setCurrentChannel = (channel: Channel) => {
  return {
    type: SET_CURRENT_CHANNEL,
    payload: {
      currentChannel: channel
    }
  };
};

export const setPrivateChannel = (isPrivate: boolean) => {
  return {
    type: SET_PRIVATE_CHANNEL,
    payload: {
      isPrivateChannel: isPrivate
    }
  };
};

export const setUserChannels = (channels: Channel[]) => {
  return {
    type: SET_USER_CHANNELS,
    payload: {
      channels
    }
  };
};

export const setStarredChannels = (channels: Channel[]) => {
  return {
    type: SET_STARRED_CHANNELS,
    payload: {
      starredChannels: channels
    }
  };
};

export const setActiveUsers = (users: User[]) => {
  return {
    type: SET_ACTIVE_USERS,
    payload: {
      activeUsers: users
    }
  };
};