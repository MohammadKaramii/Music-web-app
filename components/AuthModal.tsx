import useAuthModal from "@/hooks/useAuthModal";
import { supabase } from "@/supabase";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { FiEye, FiEyeOff } from "react-icons/fi";

import Modal from "./Modal";

const AuthModal = () => {
  const { onClose, isOpen, name, setName } = useAuthModal();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signupMode, setSignupMode } = useAuthModal();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message || "Invalid credentials. Please try again!");
      } else {
        toast.success("Login successful!");
        onClose();
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred. Please try again later!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        toast.error(error.message || "Signup failed. Please try again!");
      } else {
        await supabase.auth.updateUser({
          data: { full_name: name },
        });

        toast.success("Signup successful! Check your email to confirm your account.");
        onClose();
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred. Please try again later!");
    } finally {
      setIsLoading(false);
    }
  };

  const onChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  const toggleSignupMode = () => {
    setSignupMode(!signupMode);
    setEmail("");
    setPassword("");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Modal
      title={signupMode ? "Create an account" : "Welcome back"}
      description={signupMode ? "Sign up to continue to Music Web App" : "Login to your account"}
      onChange={onChange}
      isOpen={isOpen}
    >
      <div className="flex items-center justify-center w-full overflow-y-auto">
        <div className="w-full p-2 space-y-4">
          <form className="space-y-4" onSubmit={signupMode ? handleSignup : handleLogin}>
            {signupMode && (
              <div>
                <label htmlFor="name" className="block mb-1 text-sm font-medium text-white">
                  Your name
                </label>
                <input
                  type="text"
                  name="name"
                  value={name}
                  id="name"
                  onChange={(e) => setName(e.target.value)}
                  className="w-full py-2 px-3 bg-neutral-700 border border-neutral-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                  placeholder="Enter your name"
                  required={true}
                />
              </div>
            )}
            <div>
              <label htmlFor="email" className="block mb-1 text-sm font-medium text-white">
                Email address
              </label>
              <input
                type="email"
                name="email"
                value={email}
                id="email"
                onChange={(e) => setEmail(e.target.value)}
                className="w-full py-2 px-3 bg-neutral-700 border border-neutral-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                placeholder="name@example.com"
                required={true}
              />
            </div>
            <div>
              <label htmlFor="password" className="block mb-1 text-sm font-medium text-white">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={password}
                  id="password"
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full py-2 px-3 bg-neutral-700 border border-neutral-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                  required={true}
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-1">{signupMode && "Password must be at least 6 characters"}</p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-800 font-medium rounded-lg py-2 px-4 transition duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? "Loading..." : signupMode ? "Create account" : "Sign in"}
            </button>

            <div className="text-sm font-medium text-center text-gray-300">
              {signupMode ? "Already have an account?" : "Don't have an account?"}{" "}
              <button type="button" className="text-blue-500 hover:underline font-semibold" onClick={toggleSignupMode}>
                {signupMode ? "Sign in" : "Sign up"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default AuthModal;
