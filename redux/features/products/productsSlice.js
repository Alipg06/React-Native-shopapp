import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import PRODUCTS from "../../../data/dummy-data";

const initialState = {
  availableProducts: [],
  userProducts: [],
  status: "idle", // Request status (idle, loading, succeeded, failed)
  error: null, // Error message when the request fails
};

export const fetchProductsAsync = createAsyncThunk(
  "products/fetchProducts", // Use a unique action type string
  async (_, { getState }) => {
    const currentState = getState();
    const response = await fetch(
      "https://rn-shopapplication-default-rtdb.firebaseio.com/products.json"
    );

    if (!response.ok) {
      // Handle the case where the request was not successful
      const errorData = await response.json();
      throw new Error(errorData.error || "Could not fetch the products.");
    }

    const responseData = await response.json();
    const loadedProducts = [];
    for (const key in responseData) {
      loadedProducts.push({
        id: key,
        title: responseData[key].title,
        description: responseData[key].description,
        ownerId: responseData[key].ownerId,
        imageUrl: responseData[key].imageUrl,
        price: responseData[key].price,
      });
    }

    const userProducts = loadedProducts.filter(
      (product) => product.ownerId === currentState.auth.userId
    );

    return { loadedProducts: loadedProducts, userProducts: userProducts };
  }
);

export const addProductAsync = createAsyncThunk(
  "products/addProduct",
  async (newProductData, { getState }) => {
    const currentState = getState();
    const response = await fetch(
      `https://rn-shopapplication-default-rtdb.firebaseio.com/products.json?auth=${currentState.auth.token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProductData),
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

export const updateProductAsync = createAsyncThunk(
  "products/updateProduct",
  async (editedProduct, { getState }) => {
    const currentState = getState();
    const response = await fetch(
      `https://rn-shopapplication-default-rtdb.firebaseio.com/products/${editedProduct.id}.json?auth=${currentState.auth.token}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedProduct),
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

export const deleteProductAsync = createAsyncThunk(
  "products/deleteProduct",
  async (deletingProduct, { getState }) => {
    const currentState = getState();
    const response = await fetch(
      `https://rn-shopapplication-default-rtdb.firebaseio.com/products/${deletingProduct.productId}.json?auth=${currentState.auth.token}`,
      {
        method: "DELETE",
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

export const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    addProduct: (state, action) => {
      const { title, description, imageUrl, price } = action.payload;
      const newProduct = {
        id: new Date().toString(),
        title,
        description,
        ownerId: "u1",
        imageUrl,
        price,
      };
      state.availableProducts.push(newProduct);
      state.userProducts.push(newProduct);
    },

    updateProduct: (state, action) => {
      const editedProduct = action.payload;
      const productIndex = state.availableProducts.findIndex(
        (product) => product.id === editedProduct.id
      );

      if (productIndex >= 0) {
        state.availableProducts[productIndex] = editedProduct;
      }

      const userProductIndex = state.userProducts.findIndex(
        (product) => product.id === editedProduct.id
      );

      if (userProductIndex >= 0) {
        state.userProducts[userProductIndex] = editedProduct;
      }
    },

    deleteProduct: (state, action) => {
      const { productId } = action.payload;
      state.availableProducts = state.availableProducts.filter(
        (product) => product.id !== productId
      );
      state.userProducts = state.userProducts.filter(
        (product) => product.id !== productId
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addProductAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(addProductAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;

        const editedProduct = action.payload;
        const productIndex = state.availableProducts.findIndex(
          (product) => product.id === editedProduct.id
        );

        if (productIndex >= 0) {
          state.availableProducts[productIndex] = editedProduct;
        }

        const userProductIndex = state.userProducts.findIndex(
          (product) => product.id === editedProduct.id
        );

        if (userProductIndex >= 0) {
          state.userProducts[userProductIndex] = editedProduct;
        }

        const { name } = action.payload;
        const { title, description, imageUrl, price } = action.meta.arg;

        const newProduct = {
          id: name, // Use the 'name' from Firebase as the id
          title,
          description,
          ownerId: "u1",
          imageUrl,
          price,
        };

        state.availableProducts.push(newProduct);
        state.userProducts.push(newProduct);
      })

      .addCase(addProductAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      ////////////////////////////Update Product//////////////////////////////////////
      .addCase(updateProductAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateProductAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;

        const editedProduct = action.payload;
        const productIndex = state.availableProducts.findIndex(
          (product) => product.id === editedProduct.id
        );

        if (productIndex >= 0) {
          state.availableProducts[productIndex] = editedProduct;
        }

        const userProductIndex = state.userProducts.findIndex(
          (product) => product.id === editedProduct.id
        );

        if (userProductIndex >= 0) {
          state.userProducts[userProductIndex] = editedProduct;
        }
      })

      .addCase(updateProductAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      ////////////////////////////////////////Delete Product//////////////////////////////////////////
      .addCase(deleteProductAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteProductAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;

        const { productId } = action.meta.arg;
        state.availableProducts = state.availableProducts.filter(
          (product) => product.id !== productId
        );
        state.userProducts = state.userProducts.filter(
          (product) => product.id !== productId
        );
      })

      .addCase(deleteProductAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      ////////////////////////////////////////Fetch Products//////////////////////////////////////////
      .addCase(fetchProductsAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProductsAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
        state.availableProducts = action.payload.loadedProducts;
        state.userProducts = action.payload.userProducts;
      })
      .addCase(fetchProductsAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { addProduct, updateProduct, deleteProduct } =
  productsSlice.actions;

export default productsSlice.reducer;
