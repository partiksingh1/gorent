import axios from "axios";

export const fetchFavoritesApi = async (userId: any) => {
  console.log("fav api is called", userId);

  try {
    // Make the API request with axios and return the response data
    const response = await axios.get(`http://localhost:3000/api/v1/favorites`, {
      headers: {
        "user-id": userId, // Set user-id in headers
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return []; // Return an empty array on error
  }
};