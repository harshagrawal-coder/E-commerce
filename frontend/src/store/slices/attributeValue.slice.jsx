import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  fetchAttributeValues,
  addAttributeValue,
  updateAttributeValue,
  deleteAttributeValue,
} from "../../services/attributeValue.api";

const initialState = {
  data: [],
  loading: false,
  error: null,
};

export const fetchAttributeValueData = createAsyncThunk(
  "attributeValue/fetchAttributeValue",
  async (params, thunkAPI) => {
    try {
      const response = await fetchAttributeValues({
        params,
      });
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Something went wrong",
      );
    }
  },
);
export const createAttributeValue = createAsyncThunk(
  "attributeValue/createAttributeValue",
  async (data, thunkAPI) => {
    try {
      const response = await addAttributeValue(data);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Something went wrong",
      );
    }
  },
);
export const updateAttributeValuedata = createAsyncThunk(
  "attributeValue/updateAttributeValue",
  async ({ data, id }, thunkAPI) => {
    try {
      const response = await updateAttributeValue(data, id);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Something went wrong",
      );
    }
  },
);
export const deleteAttributeValuedata = createAsyncThunk(
  "attributeValue/deleteAttributeValue",
  async (id, thunkAPI) => {
    try {
      const response = await deleteAttributeValue(id);

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
const attributeValueSlice = createSlice({
  name: "attributeValue",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAttributeValueData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAttributeValueData.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.data = action.payload.data;
      })
      .addCase(fetchAttributeValueData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })
      .addCase(createAttributeValue.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAttributeValue.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.data.push(action.payload.data);
      })
      .addCase(createAttributeValue.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })
      .addCase(updateAttributeValuedata.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAttributeValuedata.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        const updatedAttributeValue = action.payload.data;
        const index = state.data.findIndex(
          (attributeValue) => attributeValue._id === updatedAttributeValue._id,
        );
        if (index !== -1) {
          state.data[index] = updatedAttributeValue;
        }
      })
      .addCase(updateAttributeValuedata.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })
      .addCase(deleteAttributeValuedata.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAttributeValuedata.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.data = state.data.filter(
          (attributeValue) => attributeValue._id !== action.payload.id,
        );
      })
      .addCase(deleteAttributeValuedata.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});
export const { clearError } = attributeValueSlice.actions;
export default attributeValueSlice.reducer;
