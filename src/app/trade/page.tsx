"use client";
import { useState, useEffect } from "react";
import UserUI from "./userTradeUIPage";

export default function Trade() {
  // State for modal visibility and user credentials
  const [showUsingInContent, setShowUsingInContent] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showUserModal, setShowUserModal] = useState(false);

  useEffect(() => {
    const storedUserId = sessionStorage.getItem("userId");
    if (storedUserId) {
      setShowUsingInContent(false);
      setShowUserModal(true);
    }
  }, []);

  // Handle sign in button click
  const handleSignIn = () => {
    setShowModal(true);
  };

  // Handle close modal
  const closeModal = () => {
    setShowModal(false);
    setErrorMessage("");
  };

  // Handle Sing-in submit
  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    //get elements
    const email = (document.getElementById("signInEmail") as HTMLInputElement)
      .value;
    const password = (document.getElementById("password") as HTMLInputElement)
      .value;

    try {
      const response = await fetch("/api/auth/user", {
        //signUP because this is folder name this need to fix!!!
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Sign-In successfull!!");
        sessionStorage.setItem("userId", result.userId);
        setShowUserModal(true);
        setShowModal(false);
        setShowUsingInContent(false);
      } else {
        setErrorMessage(result.message || "An error occurred.");
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("Failed to connect to the server.");
    }
  };

  const handleSignUp = () => {
    setShowSignUpModal(true);
  };

  const closeSignUpModal = () => {
    setShowSignUpModal(false);
  };

  //Handle Sing up with database
  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const email = (document.getElementById("signUpEmail") as HTMLInputElement)
      .value;
    const password = (
      document.getElementById("newPassword") as HTMLInputElement
    ).value;
    const username = (
      document.getElementById("newUsername") as HTMLInputElement
    ).value;

    //Send POST request to sign-up API
    try {
      const response = await fetch("/api/auth/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          email: email,
          password: password,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        //Successful sign-up
        alert("Sign-up successful!");
        sessionStorage.setItem("userId", result.userId);
        closeSignUpModal();
        setShowUserModal(true);
        setShowModal(false);
        setShowUsingInContent(false);
      } else {
        //Handle errors from the server
        setErrorMessage(result.message || "An error occured.");
      }
    } catch (error) {
      console.error("Error singing up: ", error);
      setErrorMessage("An error occured while signing up.");
    }
  };

  return (
    <div className="relative">
      {showUsingInContent && (
        <>
          {/* Sign In Button */}
          <button
            className="absolute shadow shadow-gray-500 border border-gray-700 top-1 right-1  md:right-4  md:mr-5 md:mr-20 px-4 py-1 font-bold hover:scale-105 hover:shadow-gray-400"
            onClick={handleSignIn}
          >
            Sign In
          </button>

          {/* UnSing-In Content */}
          <div className="mx-3 my-3 text-xs lg:w-1/2 lg:mx-auto lg:mt-20 lg:text-xl animate-slideUp">
            <p className="text-sm font-bold lg:text-xl lg:mb-10">
              Coming Soon: Virtual Trade Page 🚀
            </p>
            <p className=" max-w-[75%]">
              This page will provide an interactive and risk-free platform for
              users to experience virtual trading. Whether you&apos;re learning
              how trading works or just testing strategies, you&apos;ll have a
              virtual balance to practice buying and selling items. Stay tuned
              as we work to bring you features like:
            </p>
            <ul className=" list-disc pl-5">
              <li>Virtual balance to simulate real trades</li>
              <li>Easy-to-use interface for buying and selling items</li>
              <li>Trade history and performance tracking</li>
            </ul>
            <p className="text-xs lg:mt-10 lg:text-xl">
              Get ready to trade, learn, and have fun—all virtually! 🎉
            </p>
          </div>
          <UserUI />
          <div></div>
        </>
      )}

      {/* Sign In Modal */}
      {showModal && (
        <div className="fixed inset-0  text-white bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-8 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Sign In</h2>
            <form onSubmit={handleSignInSubmit}>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium">
                  Email
                </label>
                <input
                  type="email"
                  id="signInEmail"
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-600"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-medium">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-600"
                />
              </div>
              {errorMessage && (
                <p className="text-red-500 text-sm">{errorMessage}</p>
              )}
              <div className="flex justify-end mt-4">
                <button
                  type="button"
                  className="px-4 py-2 mr-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                  onClick={closeModal}
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800"
                >
                  Login
                </button>
              </div>
            </form>
            <div className="mt-5 flex-grow border-t border-gray-300 mx-2">
              <p className="flex justify-center">
                Don&apos;t have account{" "}
                <button
                  className="mx-2 text underline underline-offset-3 text-pink-500"
                  onClick={handleSignUp}
                >
                  Sign up
                </button>
              </p>
            </div>
          </div>
        </div>
      )}
      {/* Sign Up Modal */}
      {showSignUpModal && (
        <div className="fixed inset-0 text-white bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-8 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Sign Up</h2>
            <form onSubmit={handleSignUpSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="newUsername"
                  className="block text-sm font-medium"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="newUsername"
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-600"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium">
                  Email
                </label>
                <input
                  type="email"
                  id="signUpEmail"
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-600"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-600"
                  required
                />
              </div>
              {errorMessage && (
                <p className="text-red-500 text-sm">{errorMessage}</p>
              )}
              <div className="flex justify-end mt-4">
                <button
                  type="button"
                  className="px-4 py-2 mr-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                  onClick={closeSignUpModal}
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Sign Up
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* User Modal */}
      {showUserModal && (
        <div>
          <UserUI />
        </div>
      )}
    </div>
  );
}
