import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: {},
  totalAmount: 0,
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const addedProduct = action.payload;
      const productPrice = addedProduct.price;
      const productTitle = addedProduct.title;

      if (state.items[addedProduct.id]) {
        // The product is already in the cart
        const updatedCartItem = {
          quantity: state.items[addedProduct.id].quantity + 1,
          productPrice,
          productTitle,
          sum: Number(state.items[addedProduct.id].sum) + Number(productPrice),
        };
        state.items = {
          ...state.items,
          [addedProduct.id]: updatedCartItem,
        };
      } else {
        // The product is newly added to the cart
        const newCartItem = {
          quantity: 1,
          productPrice,
          productTitle,
          sum: productPrice,
        };

        state.items = {
          ...state.items,
          [addedProduct.id]: newCartItem,
        };
      }
      // Update the totalAmount by adding the productPrice
      state.totalAmount += Number(productPrice);
    },
    removeFromCart: (state, action) => {
      const { productId } = action.payload;
      const selectedCartItem = state.items[productId];
      if (selectedCartItem) {
        const currentQuantity = selectedCartItem.quantity;
        if (currentQuantity > 1) {
          // Decrease the quantity if it's greater than 1
          selectedCartItem.quantity -= 1;
          selectedCartItem.sum -= selectedCartItem.productPrice;
        } else {
          // Remove the item from the cart if the quantity is 1
          delete state.items[productId];
        }
        // Subtract the product price only if the cart is not empty
        if (Object.keys(state.items).length > 0) {
          state.totalAmount -= selectedCartItem.productPrice;
        } else {
          state.totalAmount = 0; // Set totalAmount to 0 when the cart is empty
        }
      }
    },
    deleteProductFromCart: (state, action) => {
      const { productId } = action.payload;
      const selectedCartItem = state.items[productId];
      if (selectedCartItem) {
        state.totalAmount -= selectedCartItem.productPrice;
        delete state.items[productId];
      }
    },
    clearCart: (state) => {
      state.items = {};
      state.totalAmount = 0;
    },
  },
});

export const { addToCart, removeFromCart, clearCart, deleteProductFromCart } =
  cartSlice.actions;

export default cartSlice.reducer;
