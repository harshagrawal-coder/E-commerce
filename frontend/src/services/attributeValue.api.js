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

const fetchAttributeValues = async () => {
  const response = await apiInstance.get(`/attribute-value`);
  return response.data;
};
const addAttributeValue = async (data) => {
  const response = await apiInstance.post("/attribute-value", data);
  return response.data;
};
const updateAttributeValue = async (data, id) => {
  const response = await apiInstance.put(`/attribute-value/${id}`, data);
  return response.data;
};
const deleteAttributeValue = async (id) => {
  const response = await apiInstance.delete(`/attribute-value/${id}`);
  return response.data;
};

export {
  fetchAttributeValues,
  addAttributeValue,
  updateAttributeValue,
  deleteAttributeValue,
};
