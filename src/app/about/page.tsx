import Image from "next/image";
import { Code2, Cpu, Globe, GraduationCap, Laptop } from "lucide-react";

export default function About() {
  const skills = [
    "JavaScript", "TypeScript", "React.js", "Next.js", 
    "Node.js", "Java", "Python", "SQL", "PostgreSQL", "Drizzle ORM",
    "Tailwind CSS", "Git", "Bun", "Hono", "Nginx", "Expo.js", "React Native"
  ];

  return (
    <div className="min-h-screen py-32 px-6 md:px-8 max-w-7xl mx-auto">
      {/* Header - Editorial Style */}
      <h1 className="text-5xl md:text-7xl font-bold text-[var(--foreground)] mb-20 tracking-tighter opacity-90">
        ABOUT
        <br />
        <span className="text-[var(--primary)] text-4xl md:text-6xl font-light italic">Me & The Craft</span>
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-24">
        {/* Left Column: Image & Quick Info */}
        <div className="md:col-span-4 lg:col-span-3 space-y-12">
          <div className="relative aspect-[3/4] overflow-hidden group">
             {/* Architectural Frame - No rounded corners, minimalist border */}
            <div className="relative h-full w-full bg-[#1a1a1a] border border-[#333] overflow-hidden group-hover:border-[var(--primary)] transition-all duration-500">
              <Image
                src="/Myphoto.webp"
                alt="Burak Asarcıklı"
                fill
                className="object-cover group-hover:grayscale-0 transition-transform duration-700"
              />
            </div>
          </div>

          <div className="space-y-8 border-l border-[#333] pl-6">
            <div className="flex flex-col space-y-1 group">
              <div className="text-[var(--primary)] mb-1">
                <GraduationCap className="w-5 h-5 stroke-1" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#666]">Role</span>
              <span className="text-sm font-medium text-[var(--foreground)]">Full-Stack Developer</span>
            </div>
            
            <div className="flex flex-col space-y-1 group">
               <div className="text-[var(--primary)] mb-1">
                 <Globe className="w-5 h-5 stroke-1" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#666]">Based In</span>
              <span className="text-sm font-medium text-[var(--foreground)]">Istanbul, Turkey</span>
            </div>

            <div className="flex flex-col space-y-1 group">
               <div className="text-[var(--primary)] mb-1">
                <Laptop className="w-5 h-5 stroke-1" />
               </div>
               <span className="text-xs font-bold uppercase tracking-widest text-[#666]">Focus</span>
               <span className="text-sm font-medium text-[var(--foreground)]">Web Development</span>
            </div>
          </div>
        </div>

        {/* Right Column: Bio & Skills */}
        <div className="md:col-span-8 lg:col-span-9 space-y-20">
          {/* Bio - Editorial Layout */}
          <div className="space-y-8 text-xl md:text-2xl text-[var(--foreground)] leading-relaxed font-light">
            <p className="indent-12">
              Hi! The person on the left is me — and the old Macintosh I&apos;m pointing at is a small symbol of where curiosity and engineering meet.
            </p>
            <p className="text-neutral-500 text-lg md:text-xl">
              I&apos;m a third-year Computer Engineering student at <span className="text-[var(--primary)] border-b border-[var(--primary)] pb-0.5">Istanbul Medeniyet University</span>, focused on backend-oriented web development. I enjoy building systems from the inside out — designing APIs, modeling data, handling authentication flows, thinking about performance, scalability, and how everything connects behind the scenes.
            </p>
            <p className="text-neutral-500 text-lg md:text-xl">
              I had the opportunity to work as a full-stack developer in a startup for about a year, which played a big role in my early growth. Instead of learning through endless tutorials, I learned by solving real problems, shipping features, breaking things, and fixing them again.
            </p>
            <p className="text-neutral-500 text-lg md:text-xl">
              While I&apos;ve worked on the frontend when needed, my heart is definitely on the backend — especially where system design, data, and AI integrations come together.
            </p>
            <p className="text-neutral-500 text-lg md:text-xl">
              I&apos;m someone who genuinely enjoys pushing limits, learning continuously, and exploring how modern systems work under the hood. If there&apos;s a problem to understand or a system to improve, I&apos;m usually excited to dive in.
            </p>
          </div>

          {/* Tech Stack - Minimalist Grid */}
          <div className="space-y-8 border-t border-[#333] pt-12">
            <h3 className="text-sm font-bold uppercase tracking-widest text-[#666] flex items-center gap-3">
              <Code2 className="w-4 h-4 text-[var(--primary)]" />
              Technology Stack
            </h3>
            <div className="flex flex-wrap gap-x-2 gap-y-2">
              {skills.map((skill) => (
                <span 
                  key={skill}
                  className="px-4 py-2 border border-[#333] bg-[#1a1a1a] text-sm text-[var(--foreground)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all duration-300 cursor-default"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Current Focus - Architectural Card */}
          <div className="p-8 bg-[#1a1a1a] border border-[#333] relative overflow-hidden group hover:border-[var(--primary)] transition-colors duration-500">
            <h3 className="text-lg font-medium text-[var(--foreground)] mb-4 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[var(--primary)]" />
              Current Object
            </h3>
            <p className="text-neutral-400 leading-relaxed font-light text-lg">
              I&apos;m currently working on multiple real-world projects in parallel.
              <br /><br />
              I&apos;m building a web platform for <span className="text-[var(--foreground)] border-b border-[#555]">Virtual Trade</span>, developing an <span className="text-[var(--foreground)] border-b border-[#555]">AI Orchestrator</span> focused on system-level coordination, and actively working on the mobile version of <span className="text-[var(--foreground)] border-b border-[#555]">Splitable</span>.
            </p>
          </div>

          {/* Beyond the Code */}
          <div className="space-y-12 border-t border-[#333] pt-12">
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-[#666]">Beyond the Code</h3>
              <h4 className="text-3xl font-light text-[var(--foreground)]">The Long Ride</h4>
              <p className="text-neutral-500 leading-relaxed text-lg max-w-2xl">
                 Cycling is my meditation. Whether it&apos;s climbing mountain passes or cruising along coastal roads, every long-distance ride clears my mind for the next challenge.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-1">
                {/* Image 1 - Vertical Slice */}
                <div className="relative aspect-[4/3] overflow-hidden grayscale hover:grayscale-0 transition-all duration-700">
                  <Image 
                    src="/cycling-me.jpg" 
                    alt="The Journey" 
                    fill 
                    className="object-cover"
                  />
                </div>
                {/* Image 2 - Vertical Slice */}
                <div className="relative aspect-[4/3] overflow-hidden grayscale hover:grayscale-0 transition-all duration-700">
                  <Image 
                    src="/cycling-road.jpg" 
                    alt="On the Road" 
                    fill 
                    className="object-cover"
                  />
                </div>
            </div>

            {/* Perfume Section */}
            <div className="flex flex-col gap-4 mt-12 border-t border-[#333] pt-12">
              <h4 className="text-3xl font-light text-[var(--foreground)]">Alchemy of Scent</h4>
              <p className="text-neutral-500 leading-relaxed text-lg max-w-2xl">
                 Beyond the screen, I experiment with notes and accords. Blending raw materials to create unique fragrances satisfies my desire for tangible, sensory creation.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-1">
                 {/* Image - Wide Panoramic Cinematic */}
                <div className="relative aspect-[21/9] overflow-hidden grayscale hover:grayscale-0 transition-all duration-700 border border-[#333]">
                  {/* Mockup Data Placeholder */}
                  <Image 
                    src="/perfume-mockup.jpg" 
                    alt="Perfume Creation" 
                    fill 
                    className="object-cover"
                  />
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
