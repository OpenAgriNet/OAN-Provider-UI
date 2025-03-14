import axios from "axios";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const getFulfillmentsApi = async () => {
  try {
    const response = await axios.get(`${baseUrl}provider/getFulfillments`);
    return response.data;
  } catch (error) {
    console.error("Error fetching fulfillments:", error);
    throw error;
  }
};
