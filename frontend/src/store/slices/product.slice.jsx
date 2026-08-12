import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  fetchProduct,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../../services/product.api";
const initialState = {
  data: [],
  loading: false,
  saving: false,
  error: null,
};
export const fetchProductData = createAsyncThunk(
  "product/fetchProduct",
  async (_, thunkAPI) => {
    try {
      const response = await fetchProduct();
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Something went wrong",
      );
    }
  },
);
export const createProduct = createAsyncThunk(
  "product/createProduct",
  async (data, thunkAPI) => {
    try {
      const response = await addProduct(data);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Something went wrong",
      );
    }
  },
);
export const updateProductData = createAsyncThunk(
  "product/updateProduct",
  async ({ data, id }, thunkAPI) => {
    try {
      const response = await updateProduct({ data, id });
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Something went wrong",
      );
    }
  },
);
export const deleteProductData = createAsyncThunk(
  "product/deleteProduct",
  async (id, thunkAPI) => {
    try {
      const response = await deleteProduct(id);

      // We need the ID because backend doesn't return it
      return {
        ...response,
        id,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Something went wrong",
      );
    }
  },
);
const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductData.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.data = action.payload.data;
      })
      .addCase(fetchProductData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })
      .addCase(createProduct.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.saving = false;
        state.error = null;
        state.data.unshift(action.payload.data.product);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload || "Something went wrong";
      })
      .addCase(updateProductData.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(updateProductData.fulfilled, (state, action) => {
        state.saving = false;
        state.error = null;
        const updatedProduct = action.payload.data;
        const index = state.data.findIndex(
          (product) => product._id === updatedProduct._id,
        );
        if (index !== -1) {
          state.data[index] = {
            ...state.data[index],
            ...updatedProduct,
          };
        }
      })
      .addCase(updateProductData.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload || "Something went wrong";
      })
      .addCase(deleteProductData.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(deleteProductData.fulfilled, (state, action) => {
        state.saving = false;
        state.error = null;

        state.data = state.data.filter(
          (product) => product._id !== action.payload.id,
        );
      })
      .addCase(deleteProductData.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});
export const { clearError } = productSlice.actions;
export default productSlice.reducer;
