import { combineReducers } from '@reduxjs/toolkit';
import auth from './auth';
import tabs from './tabs';

const rootReducer = combineReducers({
  tabs,
  auth,
});

export default rootReducer;
