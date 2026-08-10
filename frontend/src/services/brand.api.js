import { config } from "../config/config";
import axios from "axios";

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
export const fetchbrand = async () => {
  const response = await apiInstance.get("/brand");
  return response.data;
};
export const addBrand = async (data) => {
  const response = await apiInstance.post("/brand", data);
  return response.data;
};
export const updateBrand = async (data, id) => {
  const response = await apiInstance.put(`/brand/${id}`, data);
  return response.data;
};
export const deleteBrand = async (id) => {
  const response = await apiInstance.delete(`/brand/${id}`);
  return response.data;
};
