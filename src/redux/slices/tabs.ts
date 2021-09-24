import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

export interface IState {
  selectedTab: string;
}

const initialState: IState = {
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

// export user selector to get the slice in any component
export const tabSelector = (state: RootState) => state.tabs;

// export The reducer
const tabReducer = tabSlice.reducer;
export default tabReducer;
