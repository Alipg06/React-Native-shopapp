import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import moment from "moment";

const initialState = {
  orders: [],
  status: "idle", // Request status (idle, loading, succeeded, failed)
  error: null, // Error message when the request fails
};

export const fetchOrdersAsync = createAsyncThunk(
  "products/fetchOrders", // Use a unique action type string
  async (_, { getState }) => {
    const currentState = getState();
    const response = await fetch(
      `https://rn-shopapplication-default-rtdb.firebaseio.com/order/${currentState.auth.userId}.json`
    );

    if (!response.ok) {
      // Handle the case where the request was not successful
      const errorData = await response.json();
      throw new Error(errorData.error || "Could not fetch the orders.");
    }

    const responseData = await response.json();
    const loadedOrders = [];
    for (const key in responseData) {
      loadedOrders.push({
        id: key,
        items: responseData[key].items,
        totalAmount: responseData[key].totalAmount,
        date: responseData[key].date,
      });
    }
    return loadedOrders;
  }
);

export const addOrderAsync = createAsyncThunk(
  "products/addOrder",
  async (addedOrder, { getState }) => {
    const currentState = getState();
    const response = await fetch(
      `https://rn-shopapplication-default-rtdb.firebaseio.com/order/${currentState.auth.userId}.json?auth=${currentState.auth.token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: addedOrder.items,
          totalAmount: addedOrder.totalAmount,
          date: moment(new Date()).format("MMMM Do YYYY, hh:mm"),
        }),
      }
    );

    if (!response.ok) {
      // Handle the case where the request was not successful
      const errorData = await response.json();
      throw new Error(errorData.error || "Could not create the product.");
    }

    const responseData = await response.json();
    return responseData;
  }
);

export const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    addOrder: (state, action) => {
      const { items, totalAmount } = action.payload;
      const newOrder = {
        id: new Date().toString(),
        items,
        totalAmount,
        date: moment(new Date()).format("MMMM Do YYYY, hh:mm"),
      };
      state.orders.push(newOrder);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addOrderAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(addOrderAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;

        const { name } = action.payload;
        const { items, totalAmount, date } = action.meta.arg;

        const newOrder = {
          id: name,
          items,
          totalAmount,
          date,
        };

        state.orders.push(newOrder);
      })

      .addCase(addOrderAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      ////////////////////////////////////////Fetch Orders//////////////////////////////////////////
      .addCase(fetchOrdersAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchOrdersAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
        state.orders = action.payload;
      })
      .addCase(fetchOrdersAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { addOrder } = ordersSlice.actions;

export default ordersSlice.reducer;
