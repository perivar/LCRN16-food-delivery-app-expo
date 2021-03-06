import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from '../store';

export interface ITabState {
  selectedTab: string;
}

const initialState: ITabState = {
  selectedTab: '',
};

const tabSlice = createSlice({
  name: 'tabs',
  initialState,
  reducers: {
    setSelectedTab: (state, action: PayloadAction<string>) => {
      state.selectedTab = action.payload;
    },
  },
});

// Actions generated from the slice
export const { setSelectedTab } = tabSlice.actions;

// export tab selector to get the slice in any component
export const tabSelector = (state: RootState) => state.tabs;

// export the reducer
const tabReducer = tabSlice.reducer;
export default tabReducer;
