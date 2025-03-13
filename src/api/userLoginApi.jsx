import axios from "axios";
import {
  get,
  post,
  update as coreUpdate,
  patch,
  distory,
  handleResponseException,
} from "./index";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

// Login API
export const userLoginApi = async (params = {}, header = {}) => {
  let headers = {
    "Content-Type": "application/json",
    ...header,
  };
  try {
    console.log("Login params:", params);
    // Make POST request
    const result = await post(`${baseUrl}auth/login`, params, { headers });
    console.log("Full login response from Axios:", result);

    // If result.data exists, return it. Otherwise return empty object
    if (result.data) {
      console.log("Result data from server:", result.data);
      return result.data;
    } else {
      return {};
    }
  } catch ({ response, message }) {
    // On error, return status + error message
    return {
      status: response?.status || 404,
      error: response?.data?.message || message,
    };
  }
};

// Register API
export const userRegisterApi = async (params = {}, header = {}) => {
  let headers = {
    "Content-Type": "application/json",
    ...header,
  };
  try {
    // POST request to /auth/registerUser
    const result = await post(`${baseUrl}auth/registerUser`, params, { headers });
    if (result.data) {
      return result.data;
    } else {
      return {};
    }
  } catch ({ response, message }) {
    return {
      status: response?.status || 404,
      error: response?.data?.message || message,
    };
  }
};
