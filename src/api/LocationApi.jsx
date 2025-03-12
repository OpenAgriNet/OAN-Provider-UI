import axios from "axios";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const getLocationsApi = async () => {
  try {
    const response = await axios.get(`${baseUrl}getLocations`);
    return response.data;
  } catch (error) {
    console.error("Error fetching locations:", error);
    throw error;
  }
};
