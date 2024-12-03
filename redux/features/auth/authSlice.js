import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const saveDataToStorage = (token, userId, expirationDate) => {
  AsyncStorage.setItem(
    "userData",
    JSON.stringify({
      token,
      userId,
      expiryDate: expirationDate.toISOString(),
    })
  );
};
const initialState = {
  token: "",
  userId: "",
  isLoggedIn: false,
  status: "idle", // Request status (idle, loading, succeeded, failed)
  error: null, // Error message when the request fails
};

export const signupAsync = createAsyncThunk(
  "auth/signup",
  async ({ email, password }) => {
    const response = await fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCWAF-pT9T61GbdwfpNpYqqzXH43X2QGRA",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error.message || "Could not sign up the user.");
    }

    const responseData = await response.json();
    return responseData;
  }
);

export const signinAsync = createAsyncThunk(
  "auth/sigin",
  async ({ email, password }) => {
    const response = await fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCWAF-pT9T61GbdwfpNpYqqzXH43X2QGRA",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error.message || "Could not sign up the user.");
    }

    const responseData = await response.json();
    return responseData;
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    autheticate: (state, action) => {
      state.status = "succeeded";
      state.error = null;
      state.isLoggedIn = true;
      state.token = action.payload.token;
      state.userId = action.payload.userId;
      setTimeout(() => {
        AsyncStorage.removeItem("userData");
        state.isLoggedIn = false;
        state.token = null;
        state.userId = null;
      }, action.payload.expirationTime);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signupAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.isLoggedIn = false;
        state.token = "";
        state.userId = "";
      })
      .addCase(signupAsync.fulfilled, (state, action) => {
        const token = action.payload.idToken;
        const userId = action.payload.localId;
        const expirationDate = new Date(
          new Date().getTime() + parseInt(action.payload.expiresIn * 1000)
        );
        state.status = "succeeded";
        state.error = null;
        state.isLoggedIn = true;
        state.token = token;
        state.userId = userId;
        saveDataToStorage(token, userId, expirationDate);
      })

      .addCase(signupAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        state.isLoggedIn = false;
        state.token = "";
        state.userId = "";
      })

      ////////////////////////////////////////Sign In//////////////////////////////////////////
      .addCase(signinAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.isLoggedIn = false;
        state.token = "";
        state.userId = "";
      })
      .addCase(signinAsync.fulfilled, (state, action) => {
        const token = action.payload.idToken;
        const userId = action.payload.localId;
        const expirationDate = new Date(
          new Date().getTime() + parseInt(action.payload.expiresIn * 1000)
        );
        state.status = "succeeded";
        state.error = null;
        state.isLoggedIn = true;
        state.token = token;
        state.userId = userId;
        saveDataToStorage(token, userId, expirationDate);
      })

      .addCase(signinAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        state.isLoggedIn = false;
        state.token = "";
        state.userId = "";
      });
  },
});

export const { autheticate, logout } = authSlice.actions;

export default authSlice.reducer;
