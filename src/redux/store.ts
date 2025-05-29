import { createStore, applyMiddleware, combineReducers } from 'redux';
import { thunk } from 'redux-thunk';

// Reducers
import userReducer from './reducers/userReducer';
import channelReducer from './reducers/channelReducer';
import messageReducer from './reducers/messageReducer';
import uiReducer from './reducers/uiReducer';

const rootReducer = combineReducers({
  user: userReducer,
  channel: channelReducer,
  messages: messageReducer,
  ui: uiReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;