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

export const fetchVendorProducts = async () => {
  const response = await apiInstance.get("/vendor/products");
  return response.data;
};
export const addVendorProduct = async (data) => {
  const response = await apiInstance.post("/vendor/products", data);
  return response.data;
};
export const updateVendorProduct = async ({ data, id }) => {
  const response = await apiInstance.put(`/vendor/products/${id}`, data);
  return response.data;
};
export const deleteVendorProduct = async (id) => {
  const response = await apiInstance.delete(`/vendor/products/${id}`);
  return response.data;
};