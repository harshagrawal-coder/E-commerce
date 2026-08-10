import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  fetchSubCategory,
  addSubCategory,
  updateSubCategory,
  deleteSubCategory,
} from "../../services/subCategory";

const initialState = {
  data: [],
  loading: false,
  error: null,
};
export const fetchSubCategoryData = createAsyncThunk(
  "subCategory/fetchSubCategory",
  async (_, thunkAPI) => {
    try {
      const response = await fetchSubCategory();
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);
export const createSubCategory = createAsyncThunk(
  "subCategory/createSubCategory",
  async (data, thunkAPI) => {
    try {
      const response = await addSubCategory(data);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);
export const updateSubCategorydata = createAsyncThunk(
  "subCategory/updateSubCategory",
  async ({ data, id }, thunkAPI) => {
    try {
      const response = await updateSubCategory(data, id);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);
export const deleteSubCategorydata = createAsyncThunk(
  "subCategory/deleteSubCategory",
  async (id, thunkAPI) => {
    try {
      const response = await deleteSubCategory(id);

      // We need the ID because backend doesn't return it
      return {
        ...response,
        id,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

const subCategorySlice = createSlice({
  name: "subCategory",

  initialState,

  reducers: {
    clearError(state) {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchSubCategoryData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubCategoryData.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.data = action.payload.data;
      })
      .addCase(fetchSubCategoryData.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Something went wrong";
      })
      .addCase(createSubCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSubCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.data.push(action.payload.subCategory);
      })
      .addCase(createSubCategory.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Something went wrong";
      })
      .addCase(updateSubCategorydata.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSubCategorydata.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        const updatedSubCategory = action.payload.subCategory;
        const index = state.data.findIndex(
          (subCategory) => subCategory._id === updatedSubCategory._id
        );

        if (index !== -1) {
          state.data[index] = updatedSubCategory;
        }
      })
      .addCase(updateSubCategorydata.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Something went wrong";
      })
      .addCase(deleteSubCategorydata.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSubCategorydata.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        state.data = state.data.filter(
          (subCategory) => subCategory._id !== action.payload.id
        );
      })
      .addCase(deleteSubCategorydata.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Something went wrong";
      });
  },
});

export const { clearError } = subCategorySlice.actions;

export default subCategorySlice.reducer;