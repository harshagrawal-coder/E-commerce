import axios from "axios";
import { config } from "../config/config";
const apiInstance = axios.create({
  baseURL: config.API_URI,
});
apiInstance.interceptors.request.use((axiosConfig) => {
  const token = localStorage.getItem(config.TOKEN_KEY);
  if (token) {
    axiosConfig.headers.Authorization = `Bearer ${token}`;
  }
  return axiosConfig;
});
export const fetchProduct = async () => {
  const response = await apiInstance.get("/product");
  return response.data;
};
export const addProduct = async (data) => {
  const response = await apiInstance.post("/product", data);
  return response.data;
};
export const updateProduct = async ({ data, id }) => {
  const response = await apiInstance.put(`/product/${id}`, data);
  return response.data;
};
export const deleteProduct = async (id) => {
  const response = await apiInstance.delete(`/product/${id}`);
  return response.data;
};
