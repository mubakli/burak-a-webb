import React from "react";

export interface ProjectData {
  id: string;
  title: string;
  status?: string;
  description: string | React.ReactNode;
  shortDescription: string;
  media: { type: "video" | "image"; src: string; alt?: string }[];
  techStack: string[];
  aspectRatio?: "video" | "portrait";
  liveUrl?: string;
}

export const projectsData: ProjectData[] = [
  {
    id: "vtrade",
    title: "VİRTUAL TRADE",
    status: "Live",
    shortDescription:
      "A web-based platform to simulate cryptocurrency trading with real-time price updates and portfolio tracking.",
    description:
      "VTrade Protocol is a web-based platform designed to simulate cryptocurrency trading. It allows users to buy and sell virtual assets using a simulated USD balance. The platform features real-time price updates for various cryptocurrencies, providing an immersive experience for making decisions based on market fluctuations. It includes a secure user authentication system, dynamic portfolio tracking, and a seamless transaction process that updates balances and portfolios in real-time. Built with Next.js, Node.js, and PostgreSQL (using Drizzle ORM), the application offers a smooth, intuitive interface while handling backend operations efficiently. This project demonstrates full-stack expertise in building secure and scalable financial applications.",
    media: [
      { type: "image", src: "/projects/vtrade/image-1.png", alt: "Virtual Trade - Image 1" },
      { type: "image", src: "/projects/vtrade/image-2.png", alt: "Virtual Trade - Image 2" },
      { type: "image", src: "/projects/vtrade/image-3.png", alt: "Virtual Trade - Image 3" },
      { type: "image", src: "/projects/vtrade/image-4.png", alt: "Virtual Trade - Image 4" },
      { type: "image", src: "/projects/vtrade/image-5.png", alt: "Virtual Trade - Image 5" },
    ],
    techStack: ["Next.js", "Node.js", "PostgreSQL", "Docker", "Drizzle ORM", "Tailwind CSS", "Nginx", "Cloudflare"],
    liveUrl: "https://vtrade.bupropious.xyz/",
  },
  {
    id: "splitable",
    title: "SPLİTABLE",
    shortDescription:
      "A modern shared expense manager for friends and groups with custom splits, debt tracking, and analytics.",
    description:
      "Splitable is a modern web application designed to manage shared expenses between friends, roommates, and groups. It solves the complexity of tracking who owes whom by providing a clear, transparent, and secure platform. Key features include creating groups, adding expenses with custom splits, tracking debts, and settling up. The application ensures security with JWT and partial payment support. It also features a sleek dashboard for financial overview, subscription tracking, and analytical reports using graphs to visualize spending habits.",
    media: [
      { type: "image", src: "/splitable-landing.png", alt: "Splitable Landing Page" },
      { type: "image", src: "/splitable-login.png", alt: "Splitable Login" },
      { type: "image", src: "/splitable-dashboard.png", alt: "Splitable Dashboard" },
      { type: "image", src: "/splitable-groups.png", alt: "Splitable Groups" },
      { type: "image", src: "/splitable-debts.png", alt: "Splitable Debts" },
    ],
    techStack: ["Node.js", "Express.js", "React", "Tailwind CSS", "PostgreSQL", "Docker", "JWT Auth"],
  },
  {
    id: "hotel-survey",
    title: "HOTEL SURVEY WEBSITE",
    status: "Active",
    shortDescription:
      "A live multilingual feedback system for De' Manor Hotel with admin analytics panel.",
    description:
      "A live feedback management system developed for De' Manor Hotel. This application allows guests to rate their experience through a user-friendly interface available in 4 languages (English, German, Russian, Turkish). It features a dynamic form engine and a secure admin panel where hotel management can view, filter, and analyze guest feedback in real-time. The system has been actively deployed and collecting data to help improve hotel services.",
    media: [
      { type: "image", src: "/survey-landing.png", alt: "Hotel Survey Landing Page" },
      { type: "image", src: "/survey-form-en.png", alt: "Survey Form (English)" },
      { type: "image", src: "/survey-form-ru.png", alt: "Survey Form (Russian)" },
      { type: "image", src: "/survey-form-submit.png", alt: "Survey Submission" },
    ],
    techStack: ["Next.js", "Nginx", "i18n", "Tailwind CSS", "MongoDB"],
  },
  {
    id: "medeniyetekno",
    title: "MEDENİYETEKNO",
    status: "Live",
    shortDescription:
      "Official website for Istanbul Medeniyet University's technology club — events, team, and mission.",
    description:
      "The official website for MedeniyeTekno, the technology club of Istanbul Medeniyet University. Designed and developed to showcase club events, team members, and mission. The platform serves as a hub for students to connect, learn about workshops, and stay updated with the latest tech activities on campus. Built with a focus on modern UI/UX principles to reflect the club's innovative spirit.",
    media: [
      { type: "image", src: "/medeniyetekno-1.png", alt: "MedeniyeTekno Homepage" },
      { type: "image", src: "/medeniyetekno-2.png", alt: "Events Section" },
      { type: "image", src: "/medeniyetekno-3.png", alt: "Team Page" },
      { type: "image", src: "/medeniyetekno-4.png", alt: "About Section" },
      { type: "image", src: "/medeniyetekno-5.png", alt: "Contact & Footer" },
    ],
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "MongoDB", "Vercel"],
    liveUrl: "https://medeniyetekno.vercel.app/",
  },
  {
    id: "email-client",
    title: "E-MAİL CLİENT",
    shortDescription:
      "A Java-based desktop email client with full IMAP/SMTP support, attachments, and folder management.",
    description:
      "This Java-based email client offers a complete set of features for efficient email management. Users can reply to emails, forward messages, and create drafts for later use. It supports fetching and managing attachments, allowing users to download, open, and save files seamlessly. The client also enables navigation through standard folders like Inbox, Sent, and Drafts, while displaying email content, including metadata such as sender, recipient, subject, and date. With its ability to manage sent emails, save drafts, and handle attachments, this email client provides a robust and user-friendly solution for both sending and receiving emails.",
    media: [{ type: "video", src: "EMAIL_CLIENT_TANITIM.mp4" }],
    techStack: ["Java", "JavaFX", "JavaMail API", "IMAP/SMTP"],
  },
  {
    id: "vtrade-mobile",
    title: "VİRTUAL TRADE MOBILE",
    status: "Live",
    shortDescription:
      "The mobile companion for VTrade — React Native app with real-time portfolio and market tracking.",
    description:
      "The mobile version of the Virtual Trade platform, built with React Native and Expo.js. It shares the same robust backend as the web version, providing a seamless cross-platform experience. Users can track their portfolios, monitor real-time market data, and execute virtual trades on the go. The application features a premium dark UI with smooth transitions, biometric-ready authentication, and real-time balance updates.",
    media: [
      { type: "image", src: "/projects/vtrade-mobile/login.png", alt: "VTrade Mobile - Login" },
      { type: "image", src: "/projects/vtrade-mobile/home.png", alt: "VTrade Mobile - Dashboard" },
      { type: "image", src: "/projects/vtrade-mobile/market.png", alt: "VTrade Mobile - Market" },
      { type: "image", src: "/projects/vtrade-mobile/trade.png", alt: "VTrade Mobile - Trade" },
      { type: "image", src: "/projects/vtrade-mobile/profile.png", alt: "VTrade Mobile - Profile" },
    ],
    techStack: ["React Native", "Expo.js", "TypeScript", "Node.js", "PostgreSQL", "Drizzle ORM"],
    aspectRatio: "portrait",
  },
];
