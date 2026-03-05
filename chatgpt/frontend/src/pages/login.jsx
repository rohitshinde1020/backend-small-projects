import React from 'react'
import { useState } from 'react'

const login = () => {

  const handlesubmit = async (e) => {
    e.preventDefault();
  }

  const [state, setState] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 px-4 py-8">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-40 h-40 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full blur-3xl opacity-20 dark:opacity-10" />
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full blur-3xl opacity-20 dark:opacity-10" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Card Container */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-3xl shadow-2xl ring-1 ring-slate-200 dark:ring-slate-700/60 p-8 md:p-10">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-2">
              <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 bg-clip-text text-transparent">
                Quick
              </span>
              <span className="text-slate-900 dark:text-white">GPT</span>
            </h1>
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              {state === "login" ? "Welcome back" : "Join us today"}
            </p>
          </div>

          <form onSubmit={handlesubmit} className="space-y-4">
            {/* Name Input - Register Only */}
            {state === "register" && (
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Full Name
                </label>
                <input
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 rounded-xl bg-slate-100/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  type="text"
                  required
                />
              </div>
            )}

            {/* Email Input */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Email Address
              </label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl bg-slate-100/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                type="email"
                required
              />
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Password
              </label>
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl bg-slate-100/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                type="password"
                required
              />
            </div>

            {/* Submit Button */}
            <button className="w-full mt-6 py-3 px-4 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed">
              {state === "register" ? "Create Account" : "Sign In"}
            </button>

            {/* Toggle Auth State */}
            <div className="mt-6 text-center">
              {state === "register" ? (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Already have an account?{" "}
                  <span
                    onClick={() => setState("login")}
                    className="font-semibold text-indigo-600 dark:text-indigo-400 cursor-pointer hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                  >
                    Sign In
                  </span>
                </p>
              ) : (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Don't have an account?{" "}
                  <span
                    onClick={() => setState("register")}
                    className="font-semibold text-indigo-600 dark:text-indigo-400 cursor-pointer hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                  >
                    Create one
                  </span>
                </p>
              )}
            </div>
          </form>

          {/* Footer Text */}
          <p className="text-center text-xs text-gray-500 dark:text-gray-500 mt-6">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  )
}

export default login
