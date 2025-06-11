import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, Droplets, Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    age: "",
    bloodType: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match");
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        formData
      );

      if (response.data.success) {
        const { name, email } = response.data.user;
        localStorage.setItem("name", name);
        localStorage.setItem("email", email);
        toast.success("Registration successful");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        toast.error(response.data.message || "Registration failed");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Server error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center p-4">
      <ToastContainer />
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="bg-red-600 p-3 rounded-full">
              <Droplets className="h-8 w-8 text-white" />
            </div>
            <Heart className="h-6 w-6 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Blood Bridge</h1>
          <p className="text-gray-600">Connecting donors, saving lives</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold">Join Our Mission</h2>
            <p className="text-gray-600">
              Create your donor account and start saving lives
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium">First Name</label>
                <input id="firstName" type="text" required placeholder="John" onChange={handleChange} className="w-full mt-1 h-11 border border-gray-300 rounded px-3" />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium">Last Name</label>
                <input id="lastName" type="text" required placeholder="Doe" onChange={handleChange} className="w-full mt-1 h-11 border border-gray-300 rounded px-3" />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium">Email Address</label>
              <input id="email" type="email" required placeholder="your.email@example.com" onChange={handleChange} className="w-full mt-1 h-11 border border-gray-300 rounded px-3" />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium">Phone Number</label>
              <input id="phone" type="tel" required placeholder="+977 9823000007" onChange={handleChange} className="w-full mt-1 h-11 border border-gray-300 rounded px-3" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="bloodType" className="block text-sm font-medium">Blood Type</label>
                <select id="bloodType" required onChange={handleChange} className="w-full mt-1 h-11 border border-gray-300 rounded px-3">
                  <option value="">Select type</option>
                  <option>A+</option><option>A-</option><option>B+</option><option>B-</option>
                  <option>AB+</option><option>AB-</option><option>O+</option><option>O-</option>
                </select>
              </div>
              <div>
                <label htmlFor="age" className="block text-sm font-medium">Age</label>
                <input id="age" type="number" min="18" max="65" required placeholder="25" onChange={handleChange} className="w-full mt-1 h-11 border border-gray-300 rounded px-3" />
              </div>
            </div>

            {/* Password field with eye icon */}
            <div className="relative">
              <label htmlFor="password" className="block text-sm font-medium">Password</label>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                placeholder="Create a strong password"
                onChange={handleChange}
                className="w-full mt-1 h-11 border border-gray-300 rounded px-3 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-gray-500"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Confirm Password field with eye icon */}
            <div className="relative">
              <label htmlFor="confirmPassword" className="block text-sm font-medium">Confirm Password</label>
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                required
                placeholder="Confirm your password"
                onChange={handleChange}
                className="w-full mt-1 h-11 border border-gray-300 rounded px-3 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-9 text-gray-500"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <div className="flex items-start space-x-2">
              <input
                type="checkbox"
                id="terms"
                required
                checked={agreedToTerms}
                onChange={() => setAgreedToTerms(!agreedToTerms)}
                className="mt-1 rounded border-gray-300"
              />
              <label htmlFor="terms" className="text-sm leading-5">
                I agree to the <Link to="/terms" className="text-red-600 hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-red-600 hover:underline">Privacy Policy</Link>
              </label>
            </div>

            <div className="flex items-start space-x-2">
              <input type="checkbox" id="notifications" className="mt-1 rounded border-gray-300" />
              <label htmlFor="notifications" className="text-sm leading-5">
                I would like to receive notifications about donation opportunities and health tips
              </label>
            </div>

            <button
              type="submit"
              disabled={!agreedToTerms}
              className={`w-full h-11 font-semibold rounded transition ${
                agreedToTerms
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "bg-gray-300 text-gray-600 cursor-not-allowed"
              }`}
            >
              Create Account
            </button>
          </form>

          <div className="text-center pt-4 border-t mt-4">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-red-600 font-medium hover:underline">Sign in here</Link>
            </p>
          </div>
        </div>

        <div className="text-center mt-6 text-xs text-gray-500">
          <p>Your information is secure and will only be used for donation coordination</p>
        </div>
      </div>
    </div>
  );
}
