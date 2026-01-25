import Image from "next/image";
import { Code2, Cpu, Globe, GraduationCap, Laptop } from "lucide-react";

export default function About() {
  const skills = [
    "JavaScript", "TypeScript", "React.js", "Next.js", 
    "Node.js", "Java", "Python", "SQL",
    "Tailwind CSS", "Git"
  ];

  return (
    <div className="min-h-screen py-20 px-6 md:px-20 max-w-7xl mx-auto">
      {/* Header */}
      <h1 className="text-4xl md:text-5xl font-bold text-white mb-16 tracking-tight animate-slideUp">
        About Me
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-20">
        {/* Left Column: Image & Quick Info */}
        <div className="md:col-span-4 lg:col-span-3 space-y-8 animate-slideUp" style={{ animationDelay: "0.1s" }}>
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000"></div>
            <div className="relative aspect-square overflow-hidden rounded-2xl">
              <Image
                src="/Myphoto.jpg"
                alt="Burak Asarcıklı"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-gray-300">
              <GraduationCap className="w-5 h-5 text-purple-400" />
              <span>Comp. Engineering Student</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-300">
              <Globe className="w-5 h-5 text-blue-400" />
              <span>Istanbul, Turkey</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-300">
              <Laptop className="w-5 h-5 text-pink-400" />
              <span>Web Development Enthusiast</span>
            </div>
          </div>
        </div>

        {/* Right Column: Bio & Skills */}
        <div className="md:col-span-8 lg:col-span-9 space-y-12 animate-slideUp" style={{ animationDelay: "0.2s" }}>
          {/* Bio */}
          <div className="space-y-6 text-lg text-gray-300 leading-relaxed font-light">
            <p>
              Hi there! I&apos;m a second-year Computer Engineering student at <span className="text-white font-medium">Istanbul Medeniyet University</span> with a strong passion for web development.
            </p>
            <p>
              My journey is defined by hands-on learning—I prefer building real projects over watching endless tutorials. Currently, I&apos;m focused on advancing my skills in the modern web stack while exploring exciting fields like mobile development, blockchain, and AI.
            </p>
            <p>
              As a member of <span className="text-purple-400">MedeniyeTekno</span>, my university&apos;s tech club, I&apos;ve contributed to various initiatives, including developing the club&apos;s website. This experience has been instrumental in refining my full-stack capabilities and collaborative skills.
            </p>
          </div>

          {/* Tech Stack */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-white flex items-center gap-2">
              <Code2 className="w-6 h-6 text-purple-500" />
              Tech Stack
            </h3>
            <div className="flex flex-wrap gap-3">
              {skills.map((skill) => (
                <span 
                  key={skill}
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-gray-300 hover:bg-white/10 hover:border-purple-500/50 hover:text-white transition-all duration-300 cursor-default"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Interests */}
          <div className="p-6 bg-gradient-to-br from-purple-900/20 to-blue-900/10 rounded-2xl border border-white/5">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-blue-400" />
              Current Focus
            </h3>
            <p className="text-gray-400">
              I&apos;m currently building a personal website portfolio and deep-diving into <span className="text-white">Next.js 15</span> features. I&apos;m always open to new challenges that push my boundaries as a developer.
            </p>
          </div>

          {/* Beyond the Code (New Section) */}
          <div className="space-y-8 pt-8 border-t border-white/10">
            <h3 className="text-2xl font-semibold text-white">Beyond the Code</h3>
            <p className="text-gray-400 leading-relaxed">
              When I&apos;m not debugging or designing systems, I love to disconnect and recharge. Exploring new hobbies keeps my creativity flowing and gives me fresh perspectives.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Hobby 1 */}
              <div className="group relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 aspect-[4/3]">
                {/* Image Placeholder - Replace src with your photo */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                  <span className="text-gray-600 text-sm font-medium">Photo: Photography / Travel</span>
                </div>
                {/* Content Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 flex flex-col justify-end">
                  <h4 className="text-white font-semibold text-lg">Photography</h4>
                  <p className="text-gray-300 text-sm mt-1">Capturing moments and exploring new perspectives through the lens.</p>
                </div>
              </div>

              {/* Hobby 2 */}
              <div className="group relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 aspect-[4/3]">
                 {/* Image Placeholder - Replace src with your photo */}
                 <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                  <span className="text-gray-600 text-sm font-medium">Photo: Coffee / Reading</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 flex flex-col justify-end">
                  <h4 className="text-white font-semibold text-lg">Coffee Culture</h4>
                  <p className="text-gray-300 text-sm mt-1">Exploring third-wave coffee shops and brewing the perfect cup.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
