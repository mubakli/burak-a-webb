import Image from "next/image";
import { Code2, Cpu, Globe, GraduationCap, Laptop } from "lucide-react";

export default function About() {
  const skills = [
    "JavaScript", "TypeScript", "React.js", "Next.js", 
    "Node.js", "Java", "Python", "SQL",
    "Tailwind CSS", "Git"
  ];

  return (
    <div className="min-h-screen py-32 px-6 md:px-8 max-w-7xl mx-auto">
      {/* Header - Simple & Bold */}
      <h1 className="text-4xl md:text-5xl font-bold text-white mb-20 tracking-tight">
        About Me
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-24">
        {/* Left Column: Image & Quick Info */}
        <div className="md:col-span-4 lg:col-span-3 space-y-10">
          <div className="relative aspect-square overflow-hidden rounded-2xl group">
             {/* Vibrant Gradient Background/Border Effect */}
            <div className="absolute -inset-1 bg-gradient-to-tr from-purple-600 to-blue-500 blur opacity-40 group-hover:opacity-100 transition duration-1000"></div>
            <div className="relative h-full w-full bg-neutral-900 rounded-2xl border border-white/10 overflow-hidden">
              <Image
                src="/Myphoto.jpg"
                alt="Burak Asarcıklı"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center space-x-4 text-gray-400 group hover:text-white transition-colors">
              <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400 group-hover:text-purple-300">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium">Comp. Engineering Student</span>
            </div>
            <div className="flex items-center space-x-4 text-gray-400 group hover:text-white transition-colors">
              <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400 group-hover:text-blue-300">
                 <Globe className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium">Istanbul, Turkey</span>
            </div>
            <div className="flex items-center space-x-4 text-gray-400 group hover:text-white transition-colors">
               <div className="p-2 bg-pink-500/10 rounded-lg text-pink-400 group-hover:text-pink-300">
                <Laptop className="w-5 h-5" />
               </div>
              <span className="text-sm font-medium">Web Development Enthusiast</span>
            </div>
          </div>
        </div>

        {/* Right Column: Bio & Skills */}
        <div className="md:col-span-8 lg:col-span-9 space-y-16">
          {/* Bio - High Contrast Typography */}
          <div className="space-y-8 text-lg md:text-xl text-gray-400 leading-relaxed font-light">
            <p>
              Hi there! I&apos;m a second-year Computer Engineering student at <span className="text-white font-medium border-b border-purple-500/30">Istanbul Medeniyet University</span> with a strong passion for web development.
            </p>
            <p>
              My journey is defined by hands-on learning—I prefer building real projects over watching endless tutorials. Currently, I&apos;m focused on advancing my skills in the modern web stack while exploring exciting fields like mobile development, blockchain, and AI.
            </p>
            <p>
              As a member of <span className="text-white font-medium text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">MedeniyeTekno</span>, my university&apos;s tech club, I&apos;ve contributed to various initiatives, including developing the club&apos;s website. This experience has been instrumental in refining my full-stack capabilities and collaborative skills.
            </p>
          </div>

          {/* Tech Stack - Colored Chips */}
          <div className="space-y-8 border-t border-white/5 pt-12">
            <h3 className="text-xl font-semibold text-white flex items-center gap-3">
              <Code2 className="w-5 h-5 text-purple-400" />
              Tech Stack
            </h3>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span 
                  key={skill}
                  className="px-4 py-2 border border-white/5 bg-white/5 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/10 hover:border-purple-500/30 hover:shadow-[0_0_15px_rgba(168,85,247,0.15)] transition-all duration-300 cursor-default"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Current Focus - Minimal Card with Accent */}
          <div className="p-8 bg-gradient-to-br from-neutral-900 to-neutral-900/50 rounded-xl border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-colors"></div>
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2 relative z-10">
              <Cpu className="w-4 h-4 text-blue-400" />
              Current Focus
            </h3>
            <p className="text-gray-400 leading-relaxed relative z-10">
              I&apos;m currently building a personal website portfolio and deep-diving into <span className="text-white">Next.js 15</span> features. I&apos;m always open to new challenges that push my boundaries as a developer.
            </p>
          </div>

          {/* Beyond the Code - Gallery Grid */}
          <div className="space-y-8 border-t border-white/5 pt-12">
            <h3 className="text-xl font-semibold text-white">Beyond the Code</h3>
            <p className="text-gray-400 leading-relaxed">
              When I&apos;m not debugging or designing systems, I love to disconnect and recharge. Exploring new hobbies keeps my creativity flowing and gives me fresh perspectives.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Hobby 1 */}
              <div className="group relative overflow-hidden rounded-xl bg-neutral-900 border border-white/5 aspect-[4/3] hover:border-white/20 transition-all">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-blue-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute inset-0 bg-neutral-800/80 group-hover:bg-transparent transition-colors duration-500 flex items-center justify-center">
                  <span className="text-gray-500 group-hover:text-white text-xs font-mono uppercase tracking-widest z-10">Photography</span>
                </div>
              </div>

              {/* Hobby 2 */}
              <div className="group relative overflow-hidden rounded-xl bg-neutral-900 border border-white/5 aspect-[4/3] hover:border-white/20 transition-all">
                 <div className="absolute inset-0 bg-gradient-to-br from-orange-900/20 to-amber-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                 <div className="absolute inset-0 bg-neutral-800/80 group-hover:bg-transparent transition-colors duration-500 flex items-center justify-center">
                  <span className="text-gray-500 group-hover:text-white text-xs font-mono uppercase tracking-widest z-10">Coffee Culture</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
