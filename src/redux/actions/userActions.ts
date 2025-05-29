import { Dispatch } from 'redux';
import { 
  CLEAR_USER, 
  SET_USER, 
  SET_USER_PROFILE 
} from './types';
import { User } from 'firebase/auth';
import { UserProfile } from '../../types';

export const setUser = (user: User) => {
  return {
    type: SET_USER,
    payload: {
      currentUser: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      }
    }
  };
};

export const clearUser = () => {
  return {
    type: CLEAR_USER
  };
};

export const setUserProfile = (profile: UserProfile) => {
  return {
    type: SET_USER_PROFILE,
    payload: {
      profile
    }
  };
};