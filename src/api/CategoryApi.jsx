import axios from "axios";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const getCategoriesApi = async () => {
  try {
    const response = await axios.get(`${baseUrl}getCategories`);
    // response.data is expected to be an object with a "categories" array
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};
