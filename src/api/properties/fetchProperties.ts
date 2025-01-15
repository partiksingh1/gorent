// utils/api.js
import axios from "axios";

// Define the function to fetch properties based on filters
export const fetchPropertiesApi = async (filters: { location: string; propertyType: string; priceMin: { toString: () => string; }; priceMax: { toString: () => string; }; numBedrooms: string; status: string; }) => {
  const queryParams = new URLSearchParams();

  if (filters.location) queryParams.append("location", filters.location);
  if (filters.propertyType) queryParams.append("propertyType", filters.propertyType);
  if (filters.priceMin) queryParams.append("priceMin", filters.priceMin.toString());
  if (filters.priceMax) queryParams.append("priceMax", filters.priceMax.toString());
  if (filters.numBedrooms) queryParams.append("numBedrooms", filters.numBedrooms);
  if (filters.status) queryParams.append("status", filters.status);

  try {
    // Make the API request with axios and return the response data
    const response = await axios.get(`http://localhost:3000/api/v1/find-properties?${queryParams}`);
    return response.data;
    
  } catch (error) {
    console.error("Error fetching properties:", error);
    return [];  // Return an empty array on error
  }
};
