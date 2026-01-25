import React, { useState } from "react";

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignIn: (email: string, password: string) => void;
  onSignUpClick: () => void;
  errorMessage?: string;
}

const SignInModal: React.FC<SignInModalProps> = ({
  isOpen,
  onClose,
  onSignIn,
  onSignUpClick,
  errorMessage,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSignIn(email, password);
  };

  return (
    <div className="fixed inset-0 text-white bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-8 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Sign In</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="signInEmail" className="block text-sm font-medium">
              Email
            </label>
            <input
              type="email"
              id="signInEmail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-600"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
              onClick={onClose}
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
              onClick={onSignUpClick}
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignInModal;
