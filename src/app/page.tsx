import HeroSection from "@/components/home/HeroSection";
import ProjectCard from "@/components/home/ProjectCard";

export default function Home() {
  return (
    <div>
      <HeroSection />

      {/* My Projects Section */}
      <div className="mt-20 mb-16">
        <div className="flex items-center mb-12">
          <div className="flex-grow border-t border-white/10 mx-4"></div>
          <h2
            id="scrollTo"
            className="text-white font-light text-3xl tracking-wider px-6"
          >
            MY PROJECTS
          </h2>
          <div className="flex-grow border-t border-white/10 mx-4"></div>
        </div>

        <ProjectCard
          title="SPLİTABLE"
          description={
            <>
              Splitable is a modern web application designed to manage shared expenses between friends, roommates, and groups. It solves the complexity of tracking who owes whom by providing a clear, transparent, and secure platform. Key features include creating groups, adding expenses with custom splits, tracking debts, and settling up. The application ensures security with JWT and partial payment support. It also features a sleek dashboard for financial overview, subscription tracking, and analytical reports using graphs to visualize spending habits.
              <br /><br />
              <span className="text-purple-300">
                Collaborated with <a href="https://github.com/keremy321" target="_blank" rel="noopener noreferrer" className="underline hover:text-purple-400 transition-colors">Kerem Yılmaz</a>.
              </span>
            </>
          }
          media={[
            { type: "image", src: "/splitable-dashboard.png", alt: "Splitable Dashboard" },
            { type: "image", src: "/splitable-landing.png", alt: "Splitable Landing Page" },
            { type: "image", src: "/splitable-login.png", alt: "Splitable Login" },
            { type: "image", src: "/splitable-groups.png", alt: "Splitable Groups" },
            { type: "image", src: "/splitable-debts.png", alt: "Splitable Debts" },
          ]}
        />

      <ProjectCard
        title="E-MAİL CLİENT"
        description="This Java-based email client offers a complete set of features for efficient email management. Users can reply to emails, forward messages, and create drafts for later use. It supports fetching and managing attachments, allowing users to download, open, and save files seamlessly. The client also enables navigation through standard folders like Inbox, Sent, and Drafts, while displaying email content, including metadata such as sender, recipient, subject, and date. With its ability to manage sent emails, save drafts, and handle attachments, this email client provides a robust and user-friendly solution for both sending and receiving emails."
        media={[
          { type: "video", src: "EMAIL_CLIENT_TANITIM.mp4" },
        ]}
      />

      <ProjectCard
        title="VİRTUAL TRADE"
        status="On Going..."
        description="My virtual trade project is a web-based application designed to simulate cryptocurrency trading. It allows users to buy and sell virtual assets using a simulated USD balance. The platform features real-time price updates for various cryptocurrencies, providing users with an immersive experience as they make decisions based on market fluctuations. The project includes a secure user authentication system, a dynamic portfolio tracking feature, and a seamless transaction process that updates both the user's balance and portfolio in real-time. By leveraging technologies such as Next.js, Node.js, and MongoDB, the application offers a smooth, intuitive interface while handling backend operations like data storage and retrieval efficiently. This project is a valuable learning experience in both front-end and back-end development, with a focus on building secure and scalable web applications."
        media={[
          { type: "image", src: "/trade-landing.png", alt: "Modern Landing Page" },
          { type: "image", src: "/trade-dashboard.png", alt: "Crypto Dashboard Grid" },
          { type: "image", src: "/trade-buysell.png", alt: "Trading Interface Detail" },
        ]}
      />

      <ProjectCard
        title="VİRTUAL TRADE IOS - MOBILE VERSION"
        status="On Going..."
        description="This page will provide an interactive and risk-free platform for users to experience virtual trading. Whether you're learning how trading works or just testing strategies, you'll have a virtual balance to practice buying and selling items. Stay tuned as we work to bring you features like real-time market data, portfolio tracking, and advanced trading tools."
        media={[
          { type: "image", src: "/ios-trade-mockup.png", alt: "iOS Trading App" },
        ]}
      />
      </div>
    </div>
  );
}
