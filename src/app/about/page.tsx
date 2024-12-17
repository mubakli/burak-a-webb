import Image from "next/image";

export default function about() {
  return (
    <div className="mt-10 ml-10 flex animate-slideUp">
      <Image
        src="/Myphoto.jpg" // Image path from the public folder
        alt="Example Image" // Alt text for accessibility
        width={250} // Width of the image
        height={200} // Height of the image
        className="rounded-lg" // Optional Tailwind class for styling
      />
      <p className="mt-20 mx-20 text-xl">
        Hi there! I&apos;m a second-year Computer Engineering student at
        Istanbul Medeniyet University with a strong passion for web development.
        Currently, I&apos;m focused on advancing my skills in JavaScript,
        Next.js, React.js, and Node.js, while also exploring mobile development,
        blockchain, and AI projects. I believe in hands-on learning and prefer
        building projects to watching tutorials. As a member of my
        university&apos;s tech club, MedeniyeTekno, I&apos;ve had the chance to
        contribute to various tech-related initiatives, including developing a
        website for the club. This experience has been instrumental in refining
        my web development skills, from both the front-end to the back-end.
        I&apos;m also building a personal website to showcase my work and am
        always excited about taking on new challenges that help me grow as a
        developer. Feel free to explore my work and connect with me!
      </p>
    </div>
  );
}
