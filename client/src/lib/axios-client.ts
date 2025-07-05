import { CustomError } from "@/types/custom-error.type";
import axios from "axios";

// Declare global variables from Vite define
declare global {
  const __BACKEND_PORT__: string;
}

// Dynamic base URL construction
const getBaseURL = () => {
  // First try environment variable
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }

  // Fallback to dynamic construction from port
  const backendPort = import.meta.env.VITE_BACKEND_PORT || __BACKEND_PORT__ || '5002';
  return `http://localhost:${backendPort}/api`;
};

const baseURL = getBaseURL();

const options = {
  baseURL,
  withCredentials: true,
  timeout: 10000,
};

const API = axios.create(options);

API.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const { data, status } = error.response;

    if (data === "Unauthorized" && status === 401) {
      window.location.href = "/";
    }

    const customError: CustomError = {
      ...error,
      errorCode: data?.errorCode || "UNKNOWN_ERROR",
    };

    return Promise.reject(customError);
  }
);

export default API;
