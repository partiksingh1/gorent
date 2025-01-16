"use client";

import { loginUser } from "@/api/auth/loginUser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { userAtom,isAuthenticatedAtom,User} from "@/state/auth";
import { useAtom } from "jotai";

export function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [, setUser] = useAtom(userAtom); // Set the user state atom
  const [, setIsAuthenticated] = useAtom(isAuthenticatedAtom);

  // Form validation
  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError("Both fields are required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Reset previous error
    setError(null);
    if (!validateForm()) {
      return;
    }
    setLoading(true);
    try {
      // Call the login API through the authService
      const data = await loginUser(formData.email, formData.password);

      // Store JWT token if login is successful
      const { token, user } = data; // Destructure the token and user from response

      // Store the user and token in Jotai atoms and localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user)); // Store user as a string in localStorage

      setUser({ ...user, token }); // Store user data (including token) in userAtom
      setIsAuthenticated(true); // Set authentication state to true      
      
      // Optionally, redirect or update user state
      alert("Login successful");
      // Redirect or update the application state (e.g., user context)

      if(data!=null){
        router.push('/')
      }
    } catch (error: any) {
      // Handle login error from the service
      setError(error.message || "An error occurred during login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full sm:w-96">
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">Login</h2>

        {error && (
          <div className="text-red-500 text-sm mb-4">{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />

            <Input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full mt-6 p-3 bg-emerald-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
          >
            {loading ? (
              <span className="animate-ping">Loading...</span>
            ) : (
              "Login"
            )}
          </Button>
          <Button
            type="button"
            disabled={loading}
            className="w-full mt-2 p-3 bg-black text-white rounded-md hover:bg-black-700 focus:ring-2 focus:ring-blue-500"
            onClick={() => { // Initialize useRouter
              router.push("/"); // Navigate to the homepage
            }}
          >
            {loading ? (
              <span className="animate-ping">Loading...</span>
            ) : (
              "Back"
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <a href="/signup" className="text-blue-600 hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
