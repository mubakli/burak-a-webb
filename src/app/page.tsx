// import Head from "next/head";
// import { useEffect, useRef, useState } from "react";

export default function Home() {
  // const divRef = useRef(null);
  // const [isVisible, setIsVisible] = useState(false);

  // useEffect(() => {
  //   const observer = new IntersectionObserver(
  //     ([entry]) => {
  //       if (entry.isIntersecting) {
  //         setIsVisible(true);
  //       }
  //     },
  //     { threshold: 0.1 }
  //   );

  //   if (divRef.current) {
  //     observer.observe(divRef.current);
  //   }

  //   return () => {
  //     if (divRef.current) {
  //       observer.unobserve(divRef.current);
  //     }
  //   };
  // }, []);

  // <div
  //     ref={divRef}
  //     className={`${
  //       isVisible ? 'animate-slideUp' : 'opacity-0'
  //     } bg-white shadow-lg p-8 rounded-md transition-opacity duration-300`}
  //   ></div>

  return (
    <div className="selection:bg-gray-500 selection:text-black animate-slideUp">
      <div className="sm:flex-col sm:justify-center pt-40 pl-200 font-bold sm:text-mobile-size lg:text-custom-size tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-gray-500 to-white font-bold">
        <p>BACK-END</p>
        <p>DEVELOPER</p>
      </div>
      <div className="pl-20 pr-20 mr-20 pt-10 text-2xl animate-slideIn">
        <p className="indent-4  ">
          Hi there! I&apos;m a second-year Computer Engineering student at
          Istanbul Medeniyet University, passionate about exploring the world of
          technology. Currently, I&apos;m learning web development with tools
          like JavaScript, React.js, and Next.js, while also expanding my
          knowledge into areas like mobile development, blockchain, and AI
          projects.
        </p>
      </div>
      <div className="mt-20 flex items-center my-8">
        <div className="flex-grow border-t border-gray-300 mx-4"></div>
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-green-500 font-bold">
          My Projects
        </span>
        <div className="flex-grow border-t border-gray-300 mx-4"></div>
      </div>
    </div>
  );
}
