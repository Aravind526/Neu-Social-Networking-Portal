import { SET_COLORS, TOGGLE_SIDEBAR, SET_LOADING, SET_ERROR } from '../actions/types';
import { UIState, UIAction } from '../../types';

const initialState: UIState = {
  primaryColor: '#D41B2C',
  secondaryColor: '#000000',
  sidebarVisible: true,
  loading: false,
  error: null
};

const uiReducer = (state = initialState, action: UIAction): UIState => {
  switch (action.type) {
    case SET_COLORS:
      return {
        ...state,
        primaryColor: action.payload.primaryColor || state.primaryColor,
        secondaryColor: action.payload.secondaryColor || state.secondaryColor
      };
    case TOGGLE_SIDEBAR:
      return {
        ...state,
        sidebarVisible: !state.sidebarVisible
      };
    case SET_LOADING:
      return {
        ...state,
        loading: action.payload.loading
      };
    case SET_ERROR:
      return {
        ...state,
        error: action.payload.error
      };
    default:
      return state;
  }
};

export default uiReducer;