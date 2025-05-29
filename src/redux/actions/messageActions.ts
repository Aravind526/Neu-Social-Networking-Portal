import { Dispatch } from 'redux';
import {
  SET_MESSAGES,
  ADD_MESSAGE,
  SET_SEARCH_TERM,
  SET_SEARCH_RESULTS
} from './types';
import { Message } from '../../types';

export const setMessages = (messages: Message[]) => {
  return {
    type: SET_MESSAGES,
    payload: {
      messages
    }
  };
};

export const addMessage = (message: Message) => {
  return {
    type: ADD_MESSAGE,
    payload: {
      message
    }
  };
};

export const setSearchTerm = (term: string) => {
  return {
    type: SET_SEARCH_TERM,
    payload: {
      searchTerm: term
    }
  };
};

export const setSearchResults = (results: Message[]) => {
  return {
    type: SET_SEARCH_RESULTS,
    payload: {
      searchResults: results
    }
  };
};