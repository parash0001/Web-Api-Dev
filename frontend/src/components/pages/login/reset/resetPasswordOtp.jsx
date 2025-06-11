"use client"

import { useState, useEffect, useRef } from "react"
import { Shield, ArrowLeft, Loader2, RefreshCw, CheckCircle } from 'lucide-react'

export function ModernForgotPasswordOTP({ email, onVerify, onBack, onResend, isLoading }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [errors, setErrors] = useState({})
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes
  const [canResend, setCanResend] = useState(false)
  const inputRefs = useRef([])

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          setCanResend(true)
          return 0
        }
        return prevTime - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    // Clear errors when user starts typing
    if (errors.otp) {
      setErrors({})
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").slice(0, 6)
    const newOtp = [...otp]

    for (let i = 0; i < pastedData.length && i < 6; i++) {
      if (/^\d$/.test(pastedData[i])) {
        newOtp[i] = pastedData[i]
      }
    }

    setOtp(newOtp)

    // Focus the next empty input or the last input
    const nextEmptyIndex = newOtp.findIndex((digit) => digit === "")
    if (nextEmptyIndex !== -1) {
      inputRefs.current[nextEmptyIndex]?.focus()
    } else {
      inputRefs.current[5]?.focus()
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const otpString = otp.join("")

    if (otpString.length !== 6) {
      setErrors({ otp: "Please enter the complete 6-digit code" })
      return
    }

    if (!/^\d{6}$/.test(otpString)) {
      setErrors({ otp: "Please enter a valid 6-digit code" })
      return
    }

    setErrors({})
    onVerify(otpString)
  }

  const handleResend = () => {
    setTimeLeft(300)
    setCanResend(false)
    onResend()
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
            <h1 className="text-white text-4xl font-bold mb-6">Verify Your Identity</h1>
            <p className="text-purple-100 text-lg mb-8">
              We've sent a verification code to your email. Enter it below to continue with your password reset.
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mr-4">
                <Shield className="text-purple-600" size={24} />
              </div>
              <div>
                <h3 className="text-white text-lg font-semibold">Security Verification</h3>
                <p className="text-purple-100 text-sm">This extra step helps keep your account secure</p>
              </div>
            </div>
            
            <ul className="space-y-3">
              <li className="flex items-center text-purple-100">
                <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center mr-3">
                  <CheckCircle className="text-green-500" size={14} />
                </div>
                <span>Email address entered</span>
              </li>
              <li className="flex items-center text-white">
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

      {/* Right Column - Form */}
      <div className="p-8 lg:p-12">
        <div className="max-w-md mx-auto">
          <div className="flex items-center mb-8">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Shield className="text-purple-600" size={24} />
            </div>
            <div className="ml-4">
              <h2 className="text-2xl font-bold text-gray-900">Enter Verification Code</h2>
              <p className="text-gray-600">Sent to {maskEmail(email)}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <div className="flex justify-center space-x-3 mb-4">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className={`w-14 h-16 text-center text-2xl font-bold border-2 rounded-xl focus:ring-0 focus:outline-none transition-colors ${
                      errors.otp 
                        ? "border-red-300 focus:border-red-500 bg-red-50" 
                        : "border-gray-300 focus:border-purple-500"
                    }`}
                    disabled={isLoading}
                  />
                ))}
              </div>
              {errors.otp && <p className="text-sm text-red-600 text-center">{errors.otp}</p>}
            </div>

            {/* Timer and Resend */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-700 font-medium">Code expires in:</p>
                  <p className={`text-lg font-bold ${timeLeft > 60 ? 'text-gray-900' : 'text-red-600'}`}>
                    {formatTime(timeLeft)}
                  </p>
                </div>
                <div>
                  {canResend ? (
                    <button
                      type="button"
                      onClick={handleResend}
                      className="bg-purple-100 text-purple-700 px-4 py-2 rounded-lg hover:bg-purple-200 transition-colors flex items-center"
                      disabled={isLoading}
                    >
                      <RefreshCw size={16} className="mr-2" />
                      Resend Code
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="bg-gray-100 text-gray-400 px-4 py-2 rounded-lg cursor-not-allowed flex items-center"
                    >
                      <RefreshCw size={16} className="mr-2" />
                      Resend Code
                    </button>
                  )}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || otp.join("").length !== 6}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-4 rounded-xl hover:from-purple-700 hover:to-indigo-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={20} />
                  Verifying...
                </>
              ) : (
                "Verify & Continue"
              )}
            </button>

            <div className="relative flex items-center justify-center">
              <div className="border-t border-gray-200 flex-grow"></div>
              <span className="mx-4 text-sm text-gray-500">OR</span>
              <div className="border-t border-gray-200 flex-grow"></div>
            </div>

            <button
              type="button"
              onClick={onBack}
              className="w-full bg-white border-2 border-gray-300 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-50 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all font-medium flex items-center justify-center"
              disabled={isLoading}
            >
              <ArrowLeft size={18} className="mr-2" />
              Back to Email
            </button>
          </form>

          <div className="mt-8 bg-purple-50 rounded-xl p-4 border border-purple-100">
            <p className="text-sm text-purple-800">
              <span className="font-semibold">Didn't receive the code?</span> Check your spam folder or try resending the code when the timer expires.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
