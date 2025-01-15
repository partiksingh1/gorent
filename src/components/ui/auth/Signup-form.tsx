"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signupUser } from "@/api/auth/signupUser";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export function SignupForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber:"",
    password:"",
    role: "BUYER"
  });

  // Form validation
  const validateForm = () => {
    if (!formData.fullName || !formData.email || !formData.phoneNumber || !formData.password ||!formData.role ) {
      setError("Enter the required fields");
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
      const data = await signupUser(formData.fullName,formData.email, formData.phoneNumber,formData.password,formData.role);

      console.log("signup data is ", data);

      // Optionally, redirect or update user state
      alert("signup successful");
      // Redirect or update the application state (e.g., user context)

      if(data!=null){
        router.push('/login')
      }
    } catch (error: any) {
      // Handle login error from the service
      setError(error.message || "An error occurred during signup.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full sm:w-96">
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">Sign Up</h2>

        {error && (
          <div className="text-red-500 text-sm mb-4">{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              type="string"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />

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
              type="text"
              placeholder="Phone"
              value={formData.phoneNumber}
              onChange={(e) =>
                setFormData({ ...formData, phoneNumber: e.target.value })
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
             <div className="w-full">
              <Select
                value={formData.role}
                onValueChange={(value) =>
                  setFormData({ ...formData, role: value })
                }
              >
                <SelectTrigger className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none">
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BUYER">Buyer</SelectItem>
                  <SelectItem value="SELLER">Seller</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full mt-6 p-3 bg-emerald-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
          >
            {loading ? (
               <i className="material-icons animate-spin">autorenew</i>
            ) : (
              "Sign up"
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
               <i className="material-icons animate-spin">autorenew</i>
            ) : (
              "Back"
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <a href="/login" className="text-blue-600 hover:underline">
              login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
