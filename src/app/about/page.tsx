import Image from "next/image";

export default function About() {
  return (
    <div className="  ">
      <div className="mx-3 my-3 md:mt-10 md:ml-10 md:flex animate-slideUp">
        <Image
          src="/Myphoto.jpg" // Image path from the public folder
          alt="Example Image" // Alt text for accessibility
          layout="intrinsic" // Allows size control
          width={1000} // Default width
          height={1000} // Default height
          className="rounded-lg lg:w-[250px] lg:h-[250px] mb-5 "
        />
      </div>
      <div className="lg:flex">
        <p className="md:mt-20 md:mx-20 text-sm md:text-xl">
          Hi there! I&apos;m a second-year Computer Engineering student at
          Istanbul Medeniyet University with a strong passion for web
          development. Currently, I&apos;m focused on advancing my skills in
          JavaScript, Next.js, React.js, and Node.js, while also exploring
          mobile development, blockchain, and AI projects. I believe in hands-on
          learning and prefer building projects to watching tutorials. As a
          member of my university&apos;s tech club, MedeniyeTekno, I&apos;ve had
          the chance to contribute to various tech-related initiatives,
          including developing a website for the club. This experience has been
          instrumental in refining my web development skills, from both the
          front-end to the back-end. I&apos;m also building a personal website
          to showcase my work and am always excited about taking on new
          challenges that help me grow as a developer. Feel free to explore my
          work and connect with me!
        </p>
      </div>
    </div>
  );
}
