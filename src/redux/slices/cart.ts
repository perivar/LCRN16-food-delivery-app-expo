import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ICartItem } from '../../constants/types';
import { RootState } from '../store';

const initialState: ICartItem[] = [];

const getItemIndex = (state: ICartItem[], idToFind: number) => {
  const ids = state.map(item => item.productId);
  return ids.indexOf(idToFind);
};

const getTotalCartItemPrice = (state: ICartItem[]) => {
  return state.length === 0
    ? 0
    : state.reduce((total, item) => total + item.price * item.quantity, 0);
};

const getTotalCartQuantity = (state: ICartItem[]) => {
  return state.length === 0
    ? 0
    : state.reduce((total, item) => total + item.quantity, 0);
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<ICartItem>) {
      const itemIndex = getItemIndex(state, action.payload.productId);
      if (itemIndex && itemIndex < 0) state.push(action.payload);
      else state[itemIndex].quantity += action.payload.quantity;
    },
    removeFromCart(state, action: PayloadAction<{ id: number }>) {
      return state.filter(item => item.productId !== action.payload.id);
    },
    incrementQuantity(state, action: PayloadAction<{ id: number }>) {
      const itemIndex = getItemIndex(state, action.payload.id);
      state[itemIndex].quantity += 1;
    },
    decrementQuantity(state, action: PayloadAction<{ id: number }>) {
      const itemIndex = getItemIndex(state, action.payload.id);

      if (state[itemIndex].quantity > 1) state[itemIndex].quantity -= 1;
      else return state.filter(item => item.productId !== action.payload.id);
    },
    batchRemove(state, action: PayloadAction<{ ids: number[] }>) {
      return state.filter(item => !action.payload.ids.includes(item.productId));
    },
  },
});

// Actions generated from the slice
export const {
  addToCart,
  removeFromCart,
  incrementQuantity,
  decrementQuantity,
  batchRemove,
} = cartSlice.actions;

// export cart selector to get the slice in any component
export const cartItemsSelector = (state: RootState) => state.cart;

export const totalPriceSelector = (state: RootState) =>
  getTotalCartItemPrice(state.cart);

export const totalQuantitySelector = (state: RootState) =>
  getTotalCartQuantity(state.cart);

// export the reducer
const cartReducer = cartSlice.reducer;
export default cartReducer;
