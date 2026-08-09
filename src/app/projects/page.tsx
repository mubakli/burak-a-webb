import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Github } from "lucide-react";
import Tags from "@/components/common/Tags";
import { archiveProjects, caseStudies } from "@/data/portfolio";

export const metadata: Metadata = {
  title: "Projects Archive",
  description:
    "Personal developer tools and selected earlier projects by Burak Asarcikli.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  const reviewer = caseStudies.find(
    (caseStudy) => caseStudy.slug === "local-first-code-reviewer",
  );

  if (!reviewer) return null;

  return (
    <div className="identity-page projects-page">
      <header className="page-header shell">
        <p className="eyebrow">Projects / Archive</p>
        <h1 className="page-title">Experiments and earlier product work.</h1>
        <div className="page-intro-grid">
          <p>
            Personal projects are useful places to test ideas and learn new tools,
            but they sit behind production experience in this portfolio&apos;s hierarchy.
          </p>
        </div>
      </header>

      <section className="page-section shell featured-project">
        <div className="featured-project-meta">
          <p className="eyebrow">Featured / Active</p>
          <p>Personal developer tool</p>
        </div>
        <div>
          <h2>{reviewer.title}</h2>
          <p>{reviewer.summary}</p>
          <Tags items={reviewer.technologies} />
          <div className="button-row">
            <Link className="button-primary" href={`/work/${reviewer.slug}`}>
              Read case study <ArrowUpRight aria-hidden="true" size={16} />
            </Link>
            <a
              className="button-secondary"
              href={reviewer.repository}
              target="_blank"
              rel="noreferrer"
            >
              <Github aria-hidden="true" size={16} /> Repository
            </a>
          </div>
        </div>
      </section>

      <section className="page-section shell">
        <div className="archive-heading">
          <p className="eyebrow">Earlier work</p>
          <p>
            Smaller products and learning projects are retained here without
            giving them the same prominence as professional contributions.
          </p>
        </div>
        <div className="archive-list">
          {archiveProjects.map((project, index) => (
            <article key={project.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div>
                <div className="archive-title-row">
                  <h2>{project.title}</h2>
                  {project.status && <small>{project.status}</small>}
                </div>
                <p>{project.description}</p>
                <Tags items={project.technologies} />
              </div>
              {project.href ? (
                <a href={project.href} target="_blank" rel="noreferrer" aria-label={`Visit ${project.title}`}>
                  <ArrowUpRight aria-hidden="true" />
                </a>
              ) : (
                <span aria-hidden="true" />
              )}
            </article>
          ))}
        </div>
        <p className="lab-note">
          Existing experimental routes such as the trading demo and challenge list
          remain available by direct URL but are intentionally excluded from the
          primary professional navigation.
        </p>
      </section>
    </div>
  );
}
