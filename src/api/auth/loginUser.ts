import axios from "axios";

export const loginUser = async (email: string, password: string) => {
    try {
      const response = await axios.post('http://localhost:3000/api/v1/login', { email, password });
      console.log("login response is",response);
      
      return response;  // Return the response data directly
    } catch (error: any) {
      // Throw an error with more context
      if (error.response) {
        throw new Error(error.response.data.message || 'Login failed. Please check your credentials.');
      } else if (error.request) {
        throw new Error('No response from server. Please try again.');
      } else {
        throw new Error('An error occurred while logging in.');
      }
    }
  };