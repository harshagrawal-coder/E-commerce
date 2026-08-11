import axios from "axios";
import { config } from "../config/config";
export const apiInstance = axios.create({
  baseURL: config.API_URI,
});
export const register = async (data) => {
  const response = await apiInstance.post("/auth/register", data);
  return response.data;
};
export const login = async (data) => {
  const response = await apiInstance.post("/auth/login", data);
  return response.data;
};
export const getCurrentUser = async () => {
  const token = localStorage.getItem(config.TOKEN_KEY);
  const axiosConfig = {};
  if (token) {
    axiosConfig.headers = {
      Authorization: `Bearer ${token}`,
    };
  }
  const response = await apiInstance.get("/auth/get-me", axiosConfig);
  return response.data;
};
