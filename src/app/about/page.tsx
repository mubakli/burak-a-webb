import Image from "next/image";
import { Briefcase, Code2, Cpu, Globe, GraduationCap } from "lucide-react";

export default function About() {
  const skills = [
    "C#", "TypeScript", "JavaScript", "Java", "Go", "SQL",
    "ASP.NET Core", "Spring Boot", "Node.js", "Bun", "Hono", "REST APIs",
    "Entity Framework Core", "Prisma", "Sequelize", "Zod", "React", "Next.js",
    "React Native", "Expo", "Tailwind CSS", "PostgreSQL", "MongoDB", "Docker",
    "Nginx", "PM2", "Linux", "Git"
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
                <Briefcase className="w-5 h-5 stroke-1" />
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
                 <GraduationCap className="w-5 h-5 stroke-1" />
               </div>
               <span className="text-xs font-bold uppercase tracking-widest text-[#666]">Education</span>
               <span className="text-sm font-medium text-[var(--foreground)]">B.Sc. Computer Engineering</span>
               <span className="text-xs text-neutral-500">Expected 2027</span>
            </div>
          </div>
        </div>

        {/* Right Column: Bio & Skills */}
        <div className="md:col-span-8 lg:col-span-9 space-y-20">
          {/* Bio - Editorial Layout */}
          <div className="space-y-8 text-xl md:text-2xl text-[var(--foreground)] leading-relaxed font-light">
            <p className="indent-12">
              Hi! The person on the left is me, and the old Macintosh I&apos;m pointing at is a small symbol of where curiosity and engineering meet.
            </p>
            <p className="text-neutral-500 text-lg md:text-xl">
              I&apos;m a Full Stack Developer and Computer Engineering student at <span className="text-[var(--primary)] border-b border-[var(--primary)] pb-0.5">Istanbul Medeniyet University</span> with more than one year of hands-on experience building and maintaining production web applications.
            </p>
            <p className="text-neutral-500 text-lg md:text-xl">
              My primary experience is in the C#/.NET and TypeScript ecosystems, with working knowledge of Java, Spring Boot, and Go. I work across REST APIs, relational data modeling, frontend-backend integration, production debugging, and Linux-based deployment.
            </p>
            <p className="text-neutral-500 text-lg md:text-xl">
              I enjoy delivering features end to end, from interface and API design to business rules, database operations, and deployment. My strongest interest is still on the backend, especially where reliable APIs, data consistency, and maintainable architecture come together.
            </p>
            <p className="text-neutral-500 text-lg md:text-xl">
              I aim to write software that remains clear as it grows, using SOLID principles, dependency injection, layered architecture, and service/repository patterns. I&apos;m most at home tracing difficult problems across the entire stack and turning them into practical, durable improvements.
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
              Current Focus
            </h3>
            <p className="text-neutral-400 leading-relaxed font-light text-lg">
              I&apos;m currently developing and maintaining production features at <span className="text-[var(--foreground)] border-b border-[#555]">Fabrikod</span> using C#, ASP.NET Core, Entity Framework Core, React, and relational databases. My work spans API, service, repository, database, and frontend layers, with a focus on dependable workflows, clear business rules, and root-cause debugging.
            </p>
          </div>

          {/* Career Journey */}
          <div className="space-y-8 border-t border-[#333] pt-12">
            <h3 className="text-sm font-bold uppercase tracking-widest text-[#666] flex items-center gap-3">
              <Briefcase className="w-4 h-4 text-[var(--primary)]" />
              Career Journey
            </h3>
            
            <div className="space-y-12">
              {/* Experience Item 1 - Fabrikod */}
              <div className="relative pl-8 border-l border-[#333] hover:border-[var(--primary)] transition-colors duration-300 group">
                 <div className="absolute -left-[5px] top-0 w-2.5 h-2.5 bg-[#1a1a1a] border border-[#333] group-hover:border-[var(--primary)] group-hover:bg-[var(--primary)] transition-all duration-300 rotate-45"></div>
                 
                 <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                     <h4 className="text-xl font-medium text-[var(--foreground)]">FULL STACK DEVELOPER INTERN</h4>
                    <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest mt-1 sm:mt-0">06.2026 - PRESENT</span>
                  </div>

                  <div className="text-[var(--primary)] text-sm font-bold uppercase tracking-wide mb-4">Fabrikod - Turkiye</div>

                  <ul className="text-neutral-400 leading-relaxed font-light text-lg list-disc pl-4 space-y-2 marker:text-[var(--primary)]">
                   <li>Develop and maintain production features for an enterprise web application across frontend, backend, and database layers.</li>
                   <li>Build REST API endpoints with validation, business rules, exception handling, and consistent HTTP responses.</li>
                   <li>Diagnose defects across controller, service, repository, database, and frontend layers by tracing root causes.</li>
                   <li>Contribute to document-management workflows, statistics endpoints, file lifecycle operations, and soft-delete behavior.</li>
                   <li>Refactor modules using SOLID principles, dependency injection, reusable services, and clear separation of concerns.</li>
                   <li>Tech stack: C#, ASP.NET Core, Entity Framework Core, React, and relational databases.</li>
                 </ul>
              </div>

               {/* Experience Item 2 - Fuyabe Software */}
               <div className="relative pl-8 border-l border-[#333] hover:border-[var(--primary)] transition-colors duration-300 group">
                 <div className="absolute -left-[5px] top-0 w-2.5 h-2.5 bg-[#1a1a1a] border border-[#333] group-hover:border-[var(--primary)] group-hover:bg-[var(--primary)] transition-all duration-300 rotate-45"></div>
                 
                 <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                     <h4 className="text-xl font-medium text-[var(--foreground)]">FULL STACK DEVELOPER</h4>
                    <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest mt-1 sm:mt-0">05.2025 - 05.2026</span>
                  </div>

                  <div className="text-[var(--primary)] text-sm font-bold uppercase tracking-wide mb-4">Fuyabe Software - Istanbul, Turkiye</div>

                  <ul className="text-neutral-400 leading-relaxed font-light text-lg list-disc pl-4 space-y-2 marker:text-[var(--primary)]">
                    <li>Contributed to a production university preference and advisor platform with role-based workflows.</li>
                    <li>Designed REST APIs for authentication, authorization, validation, filtering, pagination, and workflow management.</li>
                    <li>Built responsive interfaces, administrative dashboards, data tables, forms, and end-to-end user flows.</li>
                    <li>Implemented complex preference-list rules, large-dataset filtering, and Excel export workflows.</li>
                    <li>Integrated AI-assisted analysis, OTP, email, and SMS flows with request tracking, rate limiting, and error handling.</li>
                    <li>Deployed and troubleshot applications on Linux using Docker, PM2, Nginx, and VPS environments.</li>
                    <li>Tech stack: Bun, Hono, Next.js, React, PostgreSQL, Prisma, Sequelize, and Zod.</li>
                  </ul>
              </div>
            </div>
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
