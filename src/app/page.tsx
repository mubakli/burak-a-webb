import HeroSection from "@/components/home/HeroSection";
import ProjectCard from "@/components/home/ProjectCard";

export default function Home() {
  return (
    <div>
      <HeroSection />

      {/* Projects Section - Clean Layout */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 pb-32" id="scrollTo">
        <div className="flex items-end justify-between mb-16 border-b border-white/10 pb-6 mt-24">
          <h2 className="text-3xl font-bold text-white tracking-tight">
            Selected Work
          </h2>
          <p className="text-sm text-gray-500 font-mono hidden sm:block">
            2023 — Present
          </p>
        </div>

        <div className="space-y-8">
            <ProjectCard
            title="VİRTUAL TRADE"
            status="Live"
            description={<>
            VTrade Protocol is a web-based platform designed to simulate cryptocurrency trading. It allows users to buy and sell virtual assets using a simulated USD balance. The platform features real-time price updates for various cryptocurrencies, providing an immersive experience for making decisions based on market fluctuations. It includes a secure user authentication system, dynamic portfolio tracking, and a seamless transaction process that updates balances and portfolios in real-time. Built with Next.js, Node.js, and **PostgreSQL (using Drizzle ORM)**, the application offers a smooth, intuitive interface while handling backend operations efficiently. This project demonstrates full-stack expertise in building secure and scalable financial applications.
            <br /><br />
            <a href="https://vtrade.bupropious.xyz/" target="_blank" rel="noopener noreferrer" className="text-white underline hover:text-gray-300 transition-colors">
              Visit Website
            </a>
            </>}
            media={[
              { type: "image", src: "/projects/vtrade/image-1.png", alt: "Virtual Trade - Image 1" },
              { type: "image", src: "/projects/vtrade/image-2.png", alt: "Virtual Trade - Image 2" },
              { type: "image", src: "/projects/vtrade/image-3.png", alt: "Virtual Trade - Image 3" },
              { type: "image", src: "/projects/vtrade/image-4.png", alt: "Virtual Trade - Image 4" },
              { type: "image", src: "/projects/vtrade/image-5.png", alt: "Virtual Trade - Image 5" },
            ]}
            techStack={["Next.js", "Node.js", "PostgreSQL", "Docker", "Drizzle ORM", "Tailwind CSS", "Nginx", "Cloudflare"]}
          />

          <ProjectCard
            title="SPLİTABLE"
            description={
              <>
                Splitable is a modern web application designed to manage shared expenses between friends, roommates, and groups. It solves the complexity of tracking who owes whom by providing a clear, transparent, and secure platform. Key features include creating groups, adding expenses with custom splits, tracking debts, and settling up. The application ensures security with JWT and partial payment support. It also features a sleek dashboard for financial overview, subscription tracking, and analytical reports using graphs to visualize spending habits.
                <br /><br />
                <span className="text-gray-400">
                  Collaborated with <a href="https://github.com/keremy321" target="_blank" rel="noopener noreferrer" className="underline hover:text-white transition-colors">Kerem Yılmaz</a>.
                </span>
              </>
            }
            media={[
              { type: "image", src: "/splitable-landing.png", alt: "Splitable Landing Page" },
              { type: "image", src: "/splitable-login.png", alt: "Splitable Login" },
              { type: "image", src: "/splitable-dashboard.png", alt: "Splitable Dashboard" },
              { type: "image", src: "/splitable-groups.png", alt: "Splitable Groups" },
              { type: "image", src: "/splitable-debts.png", alt: "Splitable Debts" },
            ]}
            techStack={["Node.js", "Express.js", "React", "Tailwind CSS", "PostgreSQL", "Docker", "JWT Auth"]}
          />

          <ProjectCard
            title="HOTEL SURVEY WEBSITE"
            status="Active"
            description="A live feedback management system developed for De' Manor Hotel. This application allows guests to rate their experience through a user-friendly interface available in 4 languages (English, German, Russian, Turkish). It features a dynamic form engine and a secure admin panel where hotel management can view, filter, and analyze guest feedback in real-time. The system has been actively deployed and collecting data to help improve hotel services."
            media={[
              { type: "image", src: "/survey-landing.png", alt: "Hotel Survey Landing Page" },
              { type: "image", src: "/survey-form-en.png", alt: "Survey Form (English)" },
              { type: "image", src: "/survey-form-ru.png", alt: "Survey Form (Russian)" },
              { type: "image", src: "/survey-form-submit.png", alt: "Survey Submission" },
            ]}
            techStack={["Next.js", "Nginx", "i18n", "Tailwind CSS", "MongoDB"]}
          />

          <ProjectCard
            title="MEDENİYETEKNO"
            status="Live"
            description={
              <>
                The official website for MedeniyeTekno, the technology club of Istanbul Medeniyet University. Designed and developed to showcase club events, team members, and mission. The platform serves as a hub for students to connect, learn about workshops, and stay updated with the latest tech activities on campus. Built with a focus on modern UI/UX principles to reflect the club&apos;s innovative spirit.

                <br /><br />
                <a href="https://medeniyetekno.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-white underline hover:text-gray-300 transition-colors">
                  Visit Website
                </a>
              </>
            }
            media={[
              { type: "image", src: "/medeniyetekno-1.png", alt: "MedeniyeTekno Homepage" },
              { type: "image", src: "/medeniyetekno-2.png", alt: "Events Section" },
              { type: "image", src: "/medeniyetekno-3.png", alt: "Team Page" },
              { type: "image", src: "/medeniyetekno-4.png", alt: "About Section" },
              { type: "image", src: "/medeniyetekno-5.png", alt: "Contact & Footer" },
            ]}
            techStack={["Next.js", "TypeScript", "Tailwind CSS", "MongoDB", "Vercel"]}
          />

          <ProjectCard
            title="E-MAİL CLİENT"
            description="This Java-based email client offers a complete set of features for efficient email management. Users can reply to emails, forward messages, and create drafts for later use. It supports fetching and managing attachments, allowing users to download, open, and save files seamlessly. The client also enables navigation through standard folders like Inbox, Sent, and Drafts, while displaying email content, including metadata such as sender, recipient, subject, and date. With its ability to manage sent emails, save drafts, and handle attachments, this email client provides a robust and user-friendly solution for both sending and receiving emails."
            media={[
              { type: "video", src: "EMAIL_CLIENT_TANITIM.mp4" },
            ]}
            techStack={["Java", "JavaFX", "JavaMail API", "IMAP/SMTP"]}
          />

          <ProjectCard
            title="VİRTUAL TRADE IOS - MOBILE VERSION"
            status="On Going..."
            description="This page will provide an interactive and risk-free platform for users to experience virtual trading. Whether you're learning how trading works or just testing strategies, you'll have a virtual balance to practice buying and selling items. Stay tuned as we work to bring you features like real-time market data, portfolio tracking, and advanced trading tools."
            media={[
              { type: "image", src: "/ios-trade-mockup.png", alt: "iOS Trading App" },
            ]}
            techStack={["Swift", "SwiftUI", "Combine", "iOS SDK"]}
          />
        </div>
      </div>
    </div>
  );
}
