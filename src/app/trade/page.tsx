"use client";
import { useState } from "react";

export default function Trade() {
  // State for modal visibility and user credentials
  const [showModal, setShowModal] = useState(false);
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

  return (
    <div className="relative">
      {/* Sign In Button */}
      <button
        className="absolute top-4 right-4 px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
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
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Sign In</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="username" className="block text-sm font-medium">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
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
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
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
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Sign In
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
