// import rootReducer from './reducer';
// import { configureStore } from '@reduxjs/toolkit';
// import { type } from 'os';

// const store = configureStore({
//   reducer: rootReducer,
// });
// export default store;

import { type } from 'os';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducer';
import { composeWithDevTools } from 'redux-devtools-extension';

const store = createStore(rootReducer, composeWithDevTools(
  applyMiddleware(thunk)));

export default store;


export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
