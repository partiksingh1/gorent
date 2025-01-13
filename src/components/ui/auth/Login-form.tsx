"use client"
import { loginUser } from "@/api/auth/loginUser";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"

export function LoginForm() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
      email: "",
      password: "",
    })

  // Form validation
  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError("Both fields are required");
      return false;
    }
    return true;
  };

  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      // Reset previous error
    setError(null);
    if (!validateForm()) {
        return;
      }
      setLoading(true);
      try {
        // Call the login API through the authService
        const data = await loginUser(formData.email, formData.password);

        console.log("login data is ", data);
        
  
        // Store JWT token if login is successful
        // localStorage.setItem("token", data.token);
  
        // Optionally, redirect or update user state
        alert("Login successful");
        // Redirect or update the application state (e.g., user context)
  
      } catch (error: any) {
        // Handle login error from the service
        setError(error.message || "An error occurred during login.");
      } finally {
        setLoading(false);
      }
    };
  
    return (
        <form onSubmit={handleSubmit} className="w-full max-w-sm mx-auto">
          {error && <div className="text-red-500 mb-4">{error}</div>}
    
          <Input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
    
          <Input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
    
          <Button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>
      );
    }