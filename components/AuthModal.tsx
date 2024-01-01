"use client";
import { useState } from "react";
import Modal from "./Modal";
import useAuthModal from "@/hooks/useAuthModal";
import axios from "axios";
import uniqid from "uniqid";
import useUser from "@/hooks/useUser";
import { createNewUser, loginUser } from "@/services/songServices";

const AuthModal = () => {
  const { onClose, isOpen, name, setName } = useAuthModal();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const signupMode = useAuthModal().signupMode;
  const setSignupMode = useAuthModal().setSignupMode;
  const setLoggedIn = useAuthModal().setLoggedIn;
  const { setId } = useUser();

  const handleLogin = async (e: any) => {
    e.preventDefault();

    try {
      const response = await loginUser(email, password);
      console.log(response);
      
      if (response.data.length === 1) {
        setLoggedIn(true);
        setId(response.data[0].id);
        setName(response.data[0].name);
        alert("Login successful!");
        onClose();
      } else {
        alert("Invalid credentials. Please try again!");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred. Please try again later!");
    }
  };

  const handleSignup = async (e: any) => {
    e.preventDefault();

    try {
      const userId = uniqid();
      const response = await createNewUser(name, email, password, userId);

      if (response.status === 201) {
        setLoggedIn(true);
        setId(response.data.id);

        alert("Signup successful!");
        onClose();
      } else {
        alert("Signup failed. Please try again!");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred. Please try again later!");
    }
  };

  const onChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  const toggleSignupMode = () => {
    setSignupMode(!signupMode);
  };

  return (
    <Modal
      title={signupMode ? "Create an account" : "Welcome back"}
      description={
        signupMode ? "Sign up to create a new account" : "Login to your account"
      }
      onChange={onChange}
      isOpen={isOpen}
    >
      <div className="items-center justify-center px-6 py-8 mx-auto lg:py-0">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <form
            className="space-y-4 md:space-y-6"
            onSubmit={signupMode ? handleSignup : handleLogin}
          >
            {signupMode && (
              <div>
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your name
                </label>
                <input
                  type="text"
                  name="name"
                  value={name}
                  id="name"
                  onChange={(e) => setName(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Name"
                  required={true}
                />
              </div>
            )}
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Your email
              </label>
              <input
                type="email"
                name="email"
                value={email}
                id="email"
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="name@company.com"
                required={true}
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                value={password}
                id="password"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required={true}
              />
            </div>

            <button
              type="submit"
              className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            >
              {signupMode ? "Sign up" : "Sign in"}
            </button>
            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
              {signupMode
                ? "Already have an account?"
                : "Don’t have an account yet?"}{" "}
              <a
                href="#"
                className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                onClick={toggleSignupMode}
              >
                {signupMode ? "Sign in" : "Sign up"}
              </a>
            </p>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default AuthModal;
