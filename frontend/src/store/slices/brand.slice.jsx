import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  fetchbrand,
  addBrand,
  updateBrand,
  deleteBrand,
} from "../../services/brand.api";

const initialState = {
  data: [],
  loading: false,
  error: null,
};
export const fetchbrandData = createAsyncThunk(
  "brand/fetchBrand",
  async (_, thunkAPI) => {
    try {
      const response = await fetchbrand();
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Something went wrong",
      );
    }
  },
);
export const createBrand = createAsyncThunk(
  "brand/createBrand",
  async (data, thunkAPI) => {
    try {
      const response = await addBrand(data);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Something went wrong",
      );
    }
  },
);
export const updateBranddata = createAsyncThunk(
  "brand/updateBrand",
  async ({ data, id }, thunkAPI) => {
    try {
      const response = await updateBrand(data, id);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Something went wrong",
      );
    }
  },
);
export const deleteBranddata = createAsyncThunk(
  "brand/deleteBrand",
  async (id, thunkAPI) => {
    try {
      const response = await deleteBrand(id);

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

const brandSlice = createSlice({
  name: "brand",

  initialState,

  reducers: {
    clearError(state) {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchbrandData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchbrandData.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.data = action.payload.data;
      })
      .addCase(fetchbrandData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })
      .addCase(createBrand.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBrand.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.data.push(action.payload.data);
      })
      .addCase(createBrand.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })
      .addCase(updateBranddata.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBranddata.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        const updatedBrand = action.payload.brand;
        const index = state.data.findIndex(
          (brand) => brand._id === updatedBrand._id,
        );

        if (index !== -1) {
          state.data[index] = updatedBrand;
        }
      })
      .addCase(updateBranddata.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })
      .addCase(deleteBranddata.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBranddata.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        state.data = state.data.filter(
          (brand) => brand._id !== action.payload.id,
        );
      })
      .addCase(deleteBranddata.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const { clearError } = brandSlice.actions;

export default brandSlice.reducer;
