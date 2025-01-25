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
      <div className=" pt-40 pl-5 sm:pl-20 font-bold text-mobile-size lg:text-custom-size tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-gray-500 to-white font-bold">
        <p>BACK-END</p>
        <p>DEVELOPER</p>
      </div>

      <div className="pl-5 sm:pl-20 pr-5 sm:pr-20 md:mr-20 pt-10 text-sm lg:text-2xl animate-slideIn">
        <p className="indent-4  ">
          Hi there! I&apos;m a second-year Computer Engineering student at
          Istanbul Medeniyet University, passionate about exploring the world of
          technology. Currently, I&apos;m learning web development with tools
          like JavaScript, React.js, and Next.js, while also expanding my
          knowledge into areas like mobile development, blockchain, and AI
          projects.
        </p>
      </div>
      <div className="mt-10 pt-5 flex items-center my-8">
        <div className="flex-grow border-t border-gray-300 mx-4"></div>
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-green-500 font-bold">
          My Projects
        </span>
        <div className="flex-grow border-t border-gray-300 mx-4"></div>
      </div>
      <div className="project-section flex flex-col md:flex-row items-center md:items-start">
        {/* Content Section */}
        <div className="content w-full md:w-1/2 lg:w-2/3 pl-10 pt-10 pr-10">
          <p className="text-3xl text-bold "> E-MAİL CLİENT</p>
          <p className="text-sm md:text-lg leading-relaxed mt-10 ">
            This Java-based email client offers a complete set of features for
            efficient email management. Users can reply to emails, forward
            messages, and create drafts for later use. It supports fetching and
            managing attachments, allowing users to download, open, and save
            files seamlessly. The client also enables navigation through
            standard folders like Inbox, Sent, and Drafts, while displaying
            email content, including metadata such as sender, recipient,
            subject, and date. With its ability to manage sent emails, save
            drafts, and handle attachments, this email client provides a robust
            and user-friendly solution for both sending and receiving emails.
          </p>
        </div>
        {/* Video Section */}
        <div className=" mx-4 md:mx-0 md:flex justify-end md:pr-10">
          <video
            src="EMAIL_CLIENT_TANITIM.mp4"
            controls
            loop
            muted
            className="w-[600px] h-[400px] "
          ></video>
        </div>
      </div>
    </div>
  );
}
