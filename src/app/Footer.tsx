// components/Footer.tsx
import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="text-sm text-gray-400">
          © {new Date().getFullYear()} BuW All rights reserved.
        </div>
        <div className="mt-4 md:mt-0">
          <nav className="flex space-x-4">
            <a
              href="/about"
              className="text-gray-400 hover:text-white transition duration-300"
            >
              About
            </a>
            <a
              href="/contact"
              className="text-gray-400 hover:text-white transition duration-300"
            >
              Contact
            </a>
            <a
              href="/privacy-policy"
              className="text-gray-400 hover:text-white transition duration-300"
            >
              Privacy Policy
            </a>
          </nav>
        </div>
        <div className="flex mt-4 md:mt-0 space-x-4">
          <a
            href="https://github.com/mubakli"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 0C5.373 0 0 5.373 0 12c0 5.303 3.438 9.8 8.207 11.387.599.111.793-.26.793-.577v-2.165c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.744.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.493.996.108-.774.418-1.305.762-1.605-2.665-.304-5.466-1.333-5.466-5.93 0-1.31.469-2.381 1.236-3.221-.124-.304-.536-1.523.118-3.176 0 0 1.008-.323 3.301 1.23.958-.266 1.984-.399 3.005-.404 1.02.005 2.047.138 3.005.404 2.292-1.554 3.3-1.23 3.3-1.23.655 1.653.243 2.872.12 3.176.77.84 1.235 1.911 1.235 3.221 0 4.61-2.803 5.624-5.475 5.921.43.37.815 1.102.815 2.22v3.293c0 .32.193.694.801.576C20.565 21.796 24 17.303 24 12 24 5.373 18.627 0 12 0z" />
            </svg>
          </a>
          <a
            href="https://x.com/BurakAsarcikli"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M23.954 4.569c-.885.392-1.83.656-2.825.775 1.014-.607 1.794-1.566 2.163-2.723-.951.564-2.005.974-3.127 1.195-.897-.959-2.178-1.559-3.594-1.559-2.717 0-4.92 2.203-4.92 4.917 0 .386.045.763.127 1.124-4.087-.205-7.72-2.165-10.148-5.144-.423.724-.666 1.562-.666 2.475 0 1.709.869 3.213 2.19 4.096-.807-.026-1.566-.247-2.229-.616v.062c0 2.388 1.697 4.382 3.946 4.834-.413.112-.849.171-1.296.171-.317 0-.626-.03-.928-.086.627 1.956 2.444 3.379 4.6 3.419-1.68 1.318-3.797 2.102-6.104 2.102-.396 0-.788-.023-1.175-.067 2.179 1.397 4.768 2.213 7.548 2.213 9.049 0 13.998-7.497 13.998-13.986 0-.213-.005-.426-.014-.637.961-.695 1.8-1.562 2.46-2.549z" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
