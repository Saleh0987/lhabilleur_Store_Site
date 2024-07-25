import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cartItems: [],
  totalAmount: 0,
  totalQuantity: 0,
};

const loadCartItemsFromLocalStorage = () => {
  try {
    const cartItems = localStorage.getItem('cartItems');
    if (cartItems) {
      return JSON.parse(cartItems);
    }
  } catch (error) {
    console.error('Error loading cart items from localStorage:', error);
  }
  return [];
};

const saveCartItemsToLocalStorage = (cartItems) => {
  try {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  } catch (error) {
    console.error('Error saving cart items to localStorage:', error);
  }
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    ...initialState,
    cartItems: loadCartItemsFromLocalStorage(),
    totalQuantity: loadCartItemsFromLocalStorage().reduce((total, item) => total + item.quantity, 0),
    totalAmount: loadCartItemsFromLocalStorage().reduce((total, item) => total + item.totalPrice, 0),
  },
  reducers: {
    addItem: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.cartItems.find((item) => item.id === newItem.id);

      state.totalQuantity++;

      if (!existingItem) {
        state.cartItems.push({
          id: newItem.id,
          productName: newItem.productName,
          imgUrl: newItem.imgUrl,
          price: newItem.price,
          quantity: 1,
          totalPrice: newItem.price,
        });
      } else {
        existingItem.quantity++;
        existingItem.totalPrice = Number(existingItem.totalPrice) + Number(newItem.price);
      }

      state.totalAmount = state.cartItems.reduce(
        (total, item) => total + Number(item.totalPrice),
        0
      );

      saveCartItemsToLocalStorage(state.cartItems);
    },

    deleteItem: (state, action) => {
      const id = action.payload;
      const existingItem = state.cartItems.find((item) => item.id === id);

      if (existingItem) {
        if (existingItem.quantity === 1) {
          state.cartItems = state.cartItems.filter((item) => item.id !== id);
        } else {
          existingItem.quantity--;
          existingItem.totalPrice -= existingItem.price;
        }
        state.totalQuantity--;
      }

      state.totalAmount = state.cartItems.reduce(
        (total, item) => total + Number(item.totalPrice),
        0
      );

      saveCartItemsToLocalStorage(state.cartItems);
    },

    clearCart: (state) => {
      state.cartItems = [];
      state.totalAmount = 0;
      state.totalQuantity = 0;

      localStorage.removeItem('cartItems');
    },
  },
});

export const cartActions = cartSlice.actions;

export default cartSlice.reducer;
