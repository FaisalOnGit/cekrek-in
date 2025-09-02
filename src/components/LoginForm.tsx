import React, { useState } from "react";
import { Eye, EyeOff, Mail, Lock, X } from "lucide-react";

export function LoginForm() {
  const [email, setEmail] = useState("domat@example.com");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login attempt:", { email, password, rememberMe });
  };

  return (
    <div className="flex-1 bg-white flex items-center justify-center p-8 relative">
      <button className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 transition-colors">
        <X size={24} />
      </button>

      <div className="w-full max-w-md">
        <div className="mb-8">
          <h1
            className="text-3xl font-bold text-gray-900 mb-2"
            style={{ fontFamily: '"Press Start 2P", monospace' }}
          >
            Welcome Back
          </h1>
          <p
            className="text-gray-600"
            style={{ fontFamily: '"Press Start 2P", monospace' }}
          >
            Sign in to your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none transition-all duration-200 hover:border-gray-400"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none transition-all duration-200 hover:border-gray-400"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-accent-600 focus:ring-accent-500 border-gray-300 rounded transition-colors"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-700"
              >
                Remember Me
              </label>
            </div>
            <button
              type="button"
              className="text-sm text-accent-600 hover:text-accent-500 transition-colors font-medium"
            >
              Forgot Password
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-accent-500 focus:ring-4 focus:ring-accent-200 transition-all duration-200 transform hover:scale-105 active:scale-95"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
