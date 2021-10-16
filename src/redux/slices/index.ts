import { combineReducers } from '@reduxjs/toolkit';

import auth from './auth';
import cart from './cart';
import news from './news';
import tabs from './tabs';

const rootReducer = combineReducers({
  tabs,
  auth,
  cart,
  news,
});

export default rootReducer;
