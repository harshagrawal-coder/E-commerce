import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlices";
import categoryReducer from "../store/slices/categorySlice";
import subCategoryReducer from "../store/slices/subCategorySlice";
import brandReducer from "../store/slices/brand.slice";
import atttributeReducer from "../store/slices/attibute.slice";
import attributeValueReducer from "../store/slices/attributeValue.slice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    category: categoryReducer,
    subCategory: subCategoryReducer,
    brand: brandReducer,
    attribute: atttributeReducer,
    attributeValue: attributeValueReducer,
  },
});
