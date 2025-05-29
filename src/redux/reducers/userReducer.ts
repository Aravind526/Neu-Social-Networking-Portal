import { SET_USER, CLEAR_USER, SET_USER_PROFILE } from '../actions/types';
import { UserState, UserAction } from '../../types';

const initialState: UserState = {
  currentUser: null,
  profile: null,
  isLoading: true
};

const userReducer = (state = initialState, action: UserAction): UserState => {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        currentUser: action.payload.currentUser,
        isLoading: false
      };
    case CLEAR_USER:
      return {
        ...state,
        currentUser: null,
        isLoading: false
      };
    case SET_USER_PROFILE:
      return {
        ...state,
        profile: action.payload.profile
      };
    default:
      return state;
  }
};

export default userReducer;