"use client"

import { useState } from "react"
import { Mail, ArrowLeft, Loader2, KeyRound } from 'lucide-react'

export function ModernForgotPasswordEmail({ onSubmit, isLoading }) {
  const [email, setEmail] = useState("")
  const [errors, setErrors] = useState({})

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = {}

    if (!email) {
      newErrors.email = "Email is required"
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address"
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      onSubmit(email)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 bg-white rounded-3xl shadow-2xl overflow-hidden">
      <div className="hidden lg:block bg-gradient-to-br from-purple-600 to-indigo-800 p-12 relative">
        <div className="absolute inset-0 bg-black opacity-10 pattern-dots pattern-size-4 pattern-opacity-10"></div>
        <div className="relative z-10 h-full flex flex-col justify-between">
          <div>
            <h1 className="text-white text-4xl font-bold mb-6">Reset Your Password</h1>
            <p className="text-purple-100 text-lg mb-8">
              Don't worry, it happens to the best of us. Let's get you back on track with a new password.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mr-4">
                <KeyRound className="text-purple-600" size={24} />
              </div>
              <div>
                <h3 className="text-white text-lg font-semibold">Secure Process</h3>
                <p className="text-purple-100 text-sm">We'll verify your identity before resetting your password</p>
              </div>
            </div>
            <ul className="space-y-3">
              <li className="flex items-center text-purple-100">
                <div className="w-6 h-6 rounded-full bg-purple-400 flex items-center justify-center mr-3 text-xs font-bold text-white">1</div>
                <span>Enter your email address</span>
              </li>
              <li className="flex items-center text-purple-100 opacity-60">
                <div className="w-6 h-6 rounded-full bg-purple-400 flex items-center justify-center mr-3 text-xs font-bold text-white">2</div>
                <span>Verify with security code</span>
              </li>
              <li className="flex items-center text-purple-100 opacity-60">
                <div className="w-6 h-6 rounded-full bg-purple-400 flex items-center justify-center mr-3 text-xs font-bold text-white">3</div>
                <span>Create new password</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="p-8 lg:p-12">
        <div className="max-w-md mx-auto">
          <div className="flex items-center mb-8">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Mail className="text-purple-600" size={24} />
            </div>
            <div className="ml-4">
              <h2 className="text-2xl font-bold text-gray-900">Forgot Password?</h2>
              <p className="text-gray-600">We'll send you a verification code</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-0 focus:outline-none transition-colors ${
                    errors.email
                      ? "border-red-300 focus:border-red-500 bg-red-50"
                      : "border-gray-300 focus:border-purple-500"
                  }`}
                  placeholder="Enter your email address"
                  disabled={isLoading}
                />
              </div>
              {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-4 rounded-xl hover:from-purple-700 hover:to-indigo-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={20} />
                  Sending Code...
                </>
              ) : (
                "Continue"
              )}
            </button>

            <div className="relative flex items-center justify-center">
              <div className="border-t border-gray-200 flex-grow"></div>
              <span className="mx-4 text-sm text-gray-500">OR</span>
              <div className="border-t border-gray-200 flex-grow"></div>
            </div>

            <button
              type="button"
              onClick={() => window.history.back()}
              className="w-full bg-white border-2 border-gray-300 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-50 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all font-medium flex items-center justify-center"
            >
              <ArrowLeft size={18} className="mr-2" />
              Back to Login
            </button>
          </form>

          <div className="mt-8 bg-purple-50 rounded-xl p-4 border border-purple-100">
            <p className="text-sm text-purple-800">
              <span className="font-semibold">Need help?</span> If you're having trouble accessing your account, please contact our support team.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
