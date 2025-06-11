"use client"

import { CheckCircle, ArrowRight, ShieldCheck } from "lucide-react"

export function ModernPasswordResetSuccess({ onLoginRedirect }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 bg-white rounded-3xl shadow-2xl overflow-hidden">
      {/* Left Column - Illustration */}
      <div className="hidden lg:block bg-gradient-to-br from-purple-600 to-indigo-800 p-12 relative">
        <div className="absolute inset-0 bg-black opacity-10 pattern-dots pattern-size-4 pattern-opacity-10"></div>
        <div className="relative z-10 h-full flex flex-col justify-between">
          <div>
            <h1 className="text-white text-4xl font-bold mb-6">Password Reset Complete</h1>
            <p className="text-purple-100 text-lg mb-8">
              Your account is now secure with your new password. You can now log in and access all your account
              features.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mr-4">
                <ShieldCheck className="text-purple-600" size={24} />
              </div>
              <div>
                <h3 className="text-white text-lg font-semibold">Account Secured</h3>
                <p className="text-purple-100 text-sm">Your password has been successfully updated</p>
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
              <li className="flex items-center text-purple-100">
                <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center mr-3">
                  <CheckCircle className="text-green-500" size={14} />
                </div>
                <span>New password created</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Right Column - Success Message */}
      <div className="p-8 lg:p-12">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle className="text-green-600" size={48} />
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-4">Password Reset Successful!</h2>
          <p className="text-gray-600 mb-8 text-lg">
            Your password has been successfully updated. You can now log in with your new password.
          </p>

          <div className="space-y-4">
            <button
              onClick={onLoginRedirect}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 px-6 rounded-xl hover:from-purple-700 hover:to-indigo-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all font-medium flex items-center justify-center"
            >
              Continue to Login
              <ArrowRight size={20} className="ml-2" />
            </button>

            <div className="bg-blue-50 rounded-xl p-6 border border-blue-100 text-left">
              <h3 className="text-blue-800 font-semibold text-lg mb-2">What's Next?</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle size={18} className="text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-blue-800">Log in with your new password</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={18} className="text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-blue-800">Update your password on other devices</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={18} className="text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-blue-800">Consider enabling two-factor authentication for extra security</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 text-gray-500 text-sm">
            <p>
              Need help? Contact our support team at{" "}
              <a href="mailto:support@homeserve.com" className="text-purple-600 hover:text-purple-700">
                support@homeserve.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
