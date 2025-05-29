import {
  SET_MESSAGES,
  ADD_MESSAGE,
  SET_SEARCH_TERM,
  SET_SEARCH_RESULTS
} from '../actions/types';
import { MessageState, MessageAction } from '../../types';

const initialState: MessageState = {
  messages: [],
  searchTerm: '',
  searchResults: []
};

const messageReducer = (state = initialState, action: MessageAction): MessageState => {
  switch (action.type) {
    case SET_MESSAGES:
      return {
        ...state,
        messages: action.payload.messages
      };
    case ADD_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, action.payload.message]
      };
    case SET_SEARCH_TERM:
      return {
        ...state,
        searchTerm: action.payload.searchTerm
      };
    case SET_SEARCH_RESULTS:
      return {
        ...state,
        searchResults: action.payload.searchResults
      };
    default:
      return state;
  }
};

export default messageReducer;