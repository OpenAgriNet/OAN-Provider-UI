import axios from "axios";
import { create } from "../routes/links";
import {
  get,
  post,
  update as coreUpdate,
  patch,
  distory,
  handleResponseException,
} from "./index";
const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const userLoginApi = async (params = {}, header = {}) => {
  let headers = {
    "Content-Type": "application/json", // Ensure JSON content-type is set
    ...header,
  };
  try {
    const result = await post(`${baseUrl}auth/login`, params, { headers });
    if (result.data) {
      return result.data;
    } else {
      return {};
    }
  } catch ({ response, message }) {
    return {
      status: response?.status ? response?.status : 404,
      error: response?.data?.message ? response?.data?.message : message,
    };
  }
};
export const userRegisterApi = async (params = {}, header = {}) => {
  let headers = {
    ...header,
  };
  try {
    const result = await post(`${baseUrl}auth/registerUser`, params, {
      headers,
    });
    if (result.data) {
      return result.data;
    } else {
      return {};
    }
  } catch ({ response, message }) {
    return {
      status: response?.status ? response?.status : 404,
      error: response?.data?.message ? response?.data?.message : message,
    };
  }
};
