import { config } from "../config/config.js";

const getToken = () => {
  try {
    return localStorage.getItem(config.TOKEN_KEY);
  } catch {
    return null;
  }
};

export const api = async (path, { method = "GET", body, isFormData = false } = {}) => {
  const headers = {};
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (body !== undefined && !isFormData) headers["Content-Type"] = "application/json";

  const response = await fetch(`${config.API_URI}${path}`, {
    method,
    headers,
    body: isFormData ? body : body !== undefined ? JSON.stringify(body) : undefined,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      (data.errors && data.errors.length && data.errors[0].msg) ||
      data.message ||
      "Something went wrong";
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  return data;
};

export default api;
