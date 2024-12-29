"use client";
import { useState } from "react";

export default function Trade() {
  // State for modal visibility and user credentials
  const [showModal, setShowModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Handle sign in button click
  const handleSignIn = () => {
    setShowModal(true);
  };

  // Handle close modal
  const closeModal = () => {
    setShowModal(false);
    setErrorMessage("");
  };

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Mock authentication logic (you can replace this with real authentication)
    if (username === "admin" && password === "password123") {
      alert("Successfully signed in!");
      closeModal();
    } else {
      setErrorMessage("Invalid username or password.");
    }
  };

  const handleSignUp = () => {
    setShowSignUpModal(true);
  };

  const closeSignUpModal = () => {
    setShowSignUpModal(false);
  };

  return (
    <div className="relative">
      {/* Sign In Button */}
      <button
        className="absolute shadow shadow-gray-500 border border-gray-700 top-1 right-4 mr-20 px-4 py-1 font-bold hover:scale-105 hover:shadow-gray-400"
        onClick={handleSignIn}
      >
        Sign In
      </button>

      {/* Main Content */}
      <div className="mx-3 my-3 text-xs lg:w-1/2 lg:mx-auto lg:mt-20 lg:text-xl animate-slideUp">
        <p className="text-sm font-bold lg:text-xl lg:mb-10">
          Coming Soon: Virtual Trade Page 🚀
        </p>
        <p>
          This page will provide an interactive and risk-free platform for users
          to experience virtual trading. Whether you&apos;re learning how
          trading works or just testing strategies, you&apos;ll have a virtual
          balance to practice buying and selling items. Stay tuned as we work to
          bring you features like:
        </p>
        <ul className="list-disc pl-5">
          <li>Virtual balance to simulate real trades</li>
          <li>Easy-to-use interface for buying and selling items</li>
          <li>Trade history and performance tracking</li>
        </ul>
        <p className="text-xs lg:mt-10">
          Get ready to trade, learn, and have fun—all virtually! 🎉
        </p>
      </div>

      {/* Sign In Modal */}
      {showModal && (
        <div className="fixed inset-0  text-white bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-8 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Sign In</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="username" className="block text-sm font-medium">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-600"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                Don't have account{" "}
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
      {showSignUpModal && (
        <div className="fixed inset-0 text-white bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-8 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Sign Up</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("Sign-Up functionality coming soon!");
              }}
            >
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
                  id="email"
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
    </div>
  );
}

// "use client";
// import React from "react";

// export default function Trade() {
//   return (
//     <div className="">
//       {/* Sign In Button */}
//       <button
//         className="absolute top-20 right-5 px-1 py-1 border-2 border-slate-300   text-white bg-black rounded-md hover:bg-gray-500"
//         onClick={() => alert("Sign-In functionality coming soon!")}
//       >
//         Sign In
//       </button>

//       {/* Main Content */}
//       <div className="mx-3 my-3 text-xs lg:w-1/2 lg:mx-auto lg:mt-20 lg:text-xl animate-slideUp">
//         <p className="text-sm font-bold lg:text-xl lg:mb-10">
//           Coming Soon: Virtual Trade Page 🚀
//         </p>
//         <p>
//           This page will provide an interactive and risk-free platform for users
//           to experience virtual trading. Whether you&apos;re learning how
//           trading works or just testing strategies, you&apos;ll have a virtual
//           balance to practice buying and selling items. Stay tuned as we work to
//           bring you features like:
//         </p>
//         <ul className="list-disc pl-5">
//           <li>Virtual balance to simulate real trades</li>
//           <li>Easy-to-use interface for buying and selling items</li>
//           <li>Trade history and performance tracking</li>
//         </ul>
//         <p className="text-xs lg:mt-10">
//           Get ready to trade, learn, and have fun—all virtually! 🎉
//         </p>
//       </div>
//     </div>
//   );
// }
