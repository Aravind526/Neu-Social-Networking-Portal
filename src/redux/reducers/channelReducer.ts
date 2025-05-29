import { 
  SET_CURRENT_CHANNEL, 
  SET_PRIVATE_CHANNEL,
  SET_USER_CHANNELS,
  SET_STARRED_CHANNELS,
  SET_ACTIVE_USERS
} from '../actions/types';
import { ChannelState, ChannelAction } from '../../types';

const initialState: ChannelState = {
  currentChannel: null,
  isPrivateChannel: false,
  channels: [],
  starredChannels: [],
  activeUsers: []
};

const channelReducer = (state = initialState, action: ChannelAction): ChannelState => {
  switch (action.type) {
    case SET_CURRENT_CHANNEL:
      return {
        ...state,
        currentChannel: action.payload.currentChannel
      };
    case SET_PRIVATE_CHANNEL:
      return {
        ...state,
        isPrivateChannel: action.payload.isPrivateChannel
      };
    case SET_USER_CHANNELS:
      return {
        ...state,
        channels: action.payload.channels
      };
    case SET_STARRED_CHANNELS:
      return {
        ...state,
        starredChannels: action.payload.starredChannels
      };
    case SET_ACTIVE_USERS:
      return {
        ...state,
        activeUsers: action.payload.activeUsers
      };
    default:
      return state;
  }
};

export default channelReducer;