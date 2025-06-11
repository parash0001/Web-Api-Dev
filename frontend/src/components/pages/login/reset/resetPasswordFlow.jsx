"use client"

import { useState } from "react"
import { ModernForgotPasswordEmail } from "./resetPasswordEmail"
import { ModernForgotPasswordOTP } from "./resetPasswordOtp"
import { ModernForgotPasswordReset } from "./resetPasswordLast"
import { ModernPasswordResetSuccess } from "./resetSuccess"

export function ModernForgotPasswordFlow() {
  const [currentStep, setCurrentStep] = useState(1)
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleEmailSubmit = async (emailValue) => {
    setIsLoading(true)
    setEmail(emailValue)

    // Simulate API call to send OTP
    setTimeout(() => {
      setIsLoading(false)
      setCurrentStep(2)
    }, 2000)
  }

  const handleOTPVerify = async (otp) => {
    setIsLoading(true)

    // Simulate API call to verify OTP
    setTimeout(() => {
      setIsLoading(false)
      setCurrentStep(3)
    }, 1500)
  }

  const handlePasswordReset = async (newPassword) => {
    setIsLoading(true)

    // Simulate API call to reset password
    setTimeout(() => {
      setIsLoading(false)
      setIsSuccess(true)
    }, 2000)
  }

  const handleBackToEmail = () => {
    setCurrentStep(1)
  }

  const handleResendOTP = async () => {
    setIsLoading(true)

    // Simulate API call to resend OTP
    setTimeout(() => {
      setIsLoading(false)
      console.log("OTP resent successfully")
    }, 1000)
  }

  const handleLoginRedirect = () => {
    // Redirect to login page
    console.log("Redirecting to login page")
  }

  if (isSuccess) {
    return <ModernPasswordResetSuccess onLoginRedirect={handleLoginRedirect} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-6xl">
        {currentStep === 1 && <ModernForgotPasswordEmail onSubmit={handleEmailSubmit} isLoading={isLoading} />}

        {currentStep === 2 && (
          <ModernForgotPasswordOTP
            email={email}
            onVerify={handleOTPVerify}
            onBack={handleBackToEmail}
            onResend={handleResendOTP}
            isLoading={isLoading}
          />
        )}

        {currentStep === 3 && (
          <ModernForgotPasswordReset email={email} onSubmit={handlePasswordReset} isLoading={isLoading} />
        )}
      </div>
    </div>
  )
}
