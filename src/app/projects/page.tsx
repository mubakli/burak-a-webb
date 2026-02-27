import ProjectCard from "@/components/home/ProjectCard";
import { projectsData } from "@/data/projectsData";
import Link from "next/link";

export default function ProjectsPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 md:px-8 pt-32 pb-32">
      {/* Page Header */}
      <div className="flex items-end justify-between mb-16 border-b border-white/10 pb-6">
        <div>
          <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[var(--primary)] mb-3">
            Portfolio
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Selected Work
          </h1>
        </div>
        <p className="text-sm text-gray-500 font-mono hidden sm:block">
          2023 — Present
        </p>
      </div>

      {/* Projects List */}
      <div className="space-y-8">
        {projectsData.map((project) => (
          <div key={project.id} id={project.id}>
            <ProjectCard
              title={project.title}
              status={project.status}
              description={
                <>
                  {project.description}
                  {project.liveUrl && (
                    <>
                      <br /><br />
                      <Link
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white underline hover:text-gray-300 transition-colors"
                      >
                        Visit Website
                      </Link>
                    </>
                  )}
                </>
              }
              media={project.media}
              techStack={project.techStack}
              aspectRatio={project.aspectRatio}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
