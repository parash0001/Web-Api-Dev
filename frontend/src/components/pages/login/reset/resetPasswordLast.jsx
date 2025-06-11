"use client"

import { useState } from "react"
import { Lock, Eye, EyeOff, CheckCircle, Loader2, X, ArrowRight, Shield } from 'lucide-react'

export function ModernForgotPasswordReset({ email, onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState({})

  const passwordRequirements = [
    { text: "At least 8 characters", test: (pwd) => pwd.length >= 8 },
    { text: "One uppercase letter", test: (pwd) => /[A-Z]/.test(pwd) },
    { text: "One lowercase letter", test: (pwd) => /[a-z]/.test(pwd) },
    { text: "One number", test: (pwd) => /\d/.test(pwd) },
    { text: "One special character", test: (pwd) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd) },
  ]

  const validatePassword = (password) => {
    return passwordRequirements.every((req) => req.test(password))
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = {}

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (!validatePassword(formData.password)) {
      newErrors.password = "Password does not meet requirements"
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      onSubmit(formData.password)
    }
  }

  const maskEmail = (email) => {
    const [username, domain] = email.split("@")
    const maskedUsername = username.charAt(0) + "*".repeat(username.length - 2) + username.charAt(username.length - 1)
    return `${maskedUsername}@${domain}`
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 bg-white rounded-3xl shadow-2xl overflow-hidden">
      {/* Left Column - Illustration */}
      <div className="hidden lg:block bg-gradient-to-br from-purple-600 to-indigo-800 p-12 relative">
        <div className="absolute inset-0 bg-black opacity-10 pattern-dots pattern-size-4 pattern-opacity-10"></div>
        <div className="relative z-10 h-full flex flex-col justify-between">
          <div>
            <h1 className="text-white text-4xl font-bold mb-6">Create New Password</h1>
            <p className="text-purple-100 text-lg mb-8">
              Choose a strong password that you haven't used before. A secure password helps protect your account.
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mr-4">
                <Lock className="text-purple-600" size={24} />
              </div>
              <div>
                <h3 className="text-white text-lg font-semibold">Final Step</h3>
                <p className="text-purple-100 text-sm">Create a new password to secure your account</p>
              </div>
            </div>
            
            <ul className="space-y-3">
              <li className="flex items-center text-purple-100">
                <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center mr-3">
                  <CheckCircle className="text-green-500" size={14} />
                </div>
                <span>Email address verified</span>
              </li>
              <li className="flex items-center text-purple-100">
                <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center mr-3">
                  <CheckCircle className="text-green-500" size={14} />
                </div>
                <span>Security code verified</span>
              </li>
              <li className="flex items-center text-white">
                <div className="w-6 h-6 rounded-full bg-purple-400 flex items-center justify-center mr-3 text-xs font-bold text-white">3</div>
                <span>Create new password</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Right Column - Form */}
      <div className="p-8 lg:p-12">
        <div className="max-w-md mx-auto">
          <div className="flex items-center mb-8">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Lock className="text-purple-600" size={24} />
            </div>
            <div className="ml-4">
              <h2 className="text-2xl font-bold text-gray-900">Create New Password</h2>
              <p className="text-gray-600">For account: {maskEmail(email)}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* New Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 pl-12 pr-12 border-2 rounded-xl focus:ring-0 focus:outline-none transition-colors ${
                    errors.password 
                      ? "border-red-300 focus:border-red-500 bg-red-50" 
                      : "border-gray-300 focus:border-purple-500"
                  }`}
                  placeholder="Enter your new password"
                  disabled={isLoading}
                />
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password}</p>}
            </div>

            {/* Password Requirements */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <p className="text-sm font-medium text-gray-700 mb-3">Password Requirements:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {passwordRequirements.map((req, index) => (
                  <div key={index} className="flex items-center">
                    {req.test(formData.password) ? (
                      <CheckCircle size={16} className="mr-2 text-green-500" />
                    ) : (
                      <X size={16} className="mr-2 text-gray-300" />
                    )}
                    <span className={`text-sm ${req.test(formData.password) ? "text-green-700" : "text-gray-600"}`}>
                      {req.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 pl-12 pr-12 border-2 rounded-xl focus:ring-0 focus:outline-none transition-colors ${
                    errors.confirmPassword 
                      ? "border-red-300 focus:border-red-500 bg-red-50" 
                      : "border-gray-300 focus:border-purple-500"
                  }`}
                  placeholder="Confirm your new password"
                  disabled={isLoading}
                />
                <Shield className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="mt-2 text-sm text-red-600">{errors.confirmPassword}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading || !validatePassword(formData.password) || formData.password !== formData.confirmPassword}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-4 rounded-xl hover:from-purple-700 hover:to-indigo-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={20} />
                  Updating Password...
                </>
              ) : (
                <>
                  Reset Password
                  <ArrowRight size={18} className="ml-2" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 bg-purple-50 rounded-xl p-4 border border-purple-100">
            <p className="text-sm text-purple-800">
              <span className="font-semibold">Security Tip:</span> After resetting your password, we recommend updating it on any other devices where you're signed in.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
