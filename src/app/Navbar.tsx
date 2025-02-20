"use client";
import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <nav className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-white">
              BuW
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className=" hidden md:flex px-3 py-2 rounded-md text-sm font-medium ">
            {/* Virtual Trade Link with Ping Icon */}
            <div className="relative px-3 py-2 rounded-md">
              <div className="absolute -top-0 -right-0 w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
              <div className="absolute -top-0 -right-0 w-2 h-2 bg-red-500 rounded-full"></div>
              <Link
                href="trade"
                className="animate-pulse text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-pink-500 font-bold"
              >
                VIRTUAL TRADE
              </Link>
            </div>
            <Link
              href="about"
              className="px-3 py-2 rounded-md text-sm font-medium hover:text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-pink-500 font-bold"
            >
              ABOUT
            </Link>
            <Link
              href="/#scrollTo"
              className="px-3 py-2 rounded-md text-sm font-medium hover:text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-green-500 font-bold"
            >
              PROJECTS
            </Link>
            <Link
              href="contact"
              className="px-3 py-2 rounded-md text-sm font-medium hover:text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-500"
            >
              CONTACT
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <div className="relative px-3 py-2 rounded-md">
              <div className="absolute -top-0 -right-0 w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
              <div className="absolute -top-0 -right-0 w-2 h-2 bg-red-500 rounded-full"></div>
              <Link
                href="trade"
                className="animate-pulse text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-pink-500 font-bold"
              >
                VIRTUAL TRADE
              </Link>
            </div>
            <Link
              href="about"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700"
            >
              About
            </Link>
            <Link
              href="/#project"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700"
            >
              Projects
            </Link>
            <Link
              href="contact"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700"
            >
              Contact
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
