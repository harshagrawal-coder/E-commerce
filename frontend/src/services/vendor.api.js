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

export const fetchVendor = async () => {
  const response = await apiInstance.get("/vendor/profile");
  return response.data;
};
export const createVendor = async (data) => {
  const response = await apiInstance.post("/vendor", data);
  return response.data;
};
export const updateVendor = async (data, id) => {
  const response = await apiInstance.put(`/vendor/${id}`, data);
  return response.data;
};
export const updateVendorStatus = async (data, id) => {
  const response = await apiInstance.patch(`/vendor/${id}/status`, data);
  return response.data;
};