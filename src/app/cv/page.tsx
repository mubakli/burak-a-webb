import type { Metadata } from "next";
import { Download, Mail } from "lucide-react";
import {
  professionalSummary,
  siteConfig,
  skillGroups,
} from "@/data/portfolio";

export const metadata: Metadata = {
  title: "Curriculum Vitae",
  description: "English curriculum vitae for Full-Stack Developer Burak Asarcikli.",
  alternates: { canonical: "/cv" },
};

const cvExperiences = [
  {
    company: "Fabrikod",
    role: "Full-Stack Developer Intern",
    period: "June 2026 - Present",
    contributions: [
      "Developed and shipped an end-to-end analytics dashboard for an enterprise document-management platform, covering national, provincial, organizational, personnel, and time-period views.",
      "Implemented frontend interfaces and backend data flows for operational metrics, period comparisons, geographic breakdowns, and organizational performance views.",
      "Fixed a cross-table consistency bug where deleting an upload left its related document included in statistics, preventing stale records from affecting reported metrics.",
      "Extended permission-aware UI behavior, resolved production table and layout issues, and contributed within the product's established layered architecture.",
    ],
    technologies: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "HeroUI",
      ".NET",
      "ASP.NET Core",
      "PostgreSQL",
    ],
  },
  {
    company: "Fuyabe Software",
    role: "Full-Stack Developer",
    period: "May 2025 - May 2026",
    contributions: [
      "Delivered full-stack features for a production university-preference platform serving student, advisor, administrator, and partner workflows.",
      "Built authentication and access flows including Google Sign-In, OTP verification, role-based access, email/SMS integrations, filtering, pagination, and administrative interfaces.",
      "Developed a pipeline for annual ÖSYM Excel datasets that normalized records, connected programs across academic years, and surfaced renamed or discontinued programs for human review.",
      "Automated a previously manual annual data-preparation workflow, saving approximately two working days per update cycle.",
      "Containerized applications and maintained GitHub Actions pipelines for automated deployments to an Azure-hosted server.",
    ],
    technologies: [
      "TypeScript",
      "Next.js",
      "Bun",
      "Hono",
      "PostgreSQL",
      "Docker",
      "GitHub Actions",
      "Azure",
    ],
  },
];

const reviewerContributions = [
  "Developing a local-first developer tool that reviews staged Git changes before commit through a Go CLI and VS Code integration.",
  "Designed a diff-first workflow with separate correctness and security review paths, lightweight security triage, and selective repository context.",
  "Using the tool in personal development workflows and iterating on its behavior based on practical review results.",
];

export default function CvPage() {
  return (
    <div className="cv-page">
      <div className="cv-toolbar shell">
        <p>English CV · Web version</p>
        <a className="button-primary" href={siteConfig.cv.english} download>
          Download PDF <Download aria-hidden="true" size={15} />
        </a>
      </div>

      <article className="cv-document">
        <header className="cv-header">
          <div>
            <h1>Burak Asarcikli</h1>
            <p>Full-Stack Developer</p>
          </div>
          <address>
            Istanbul, Türkiye<br />
            <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a><br />
            <a href={siteConfig.linkedin}>linkedin.com/in/burak-asarcikli</a><br />
            <a href={siteConfig.github}>github.com/mubakli</a><br />
            <a href={siteConfig.url}>burak-asarcikli.vercel.app</a>
          </address>
        </header>

        <section className="cv-section">
          <h2>Professional Summary</h2>
          <p>{professionalSummary}</p>
        </section>

        <section className="cv-section">
          <h2>Technical Skills</h2>
          <div className="cv-skills">
            {skillGroups.map((group) => (
              <p key={group.title}>
                <strong>{group.title}:</strong> {group.items.join(", ")}
              </p>
            ))}
          </div>
        </section>

        <section className="cv-section">
          <h2>Professional Experience</h2>
          {cvExperiences.map((experience) => (
            <article className="cv-role" key={experience.company}>
              <header>
                <div>
                  <h3>{experience.role}</h3>
                  <p>{experience.company}</p>
                </div>
                <time>{experience.period}</time>
              </header>
              <ul>
                {experience.contributions.map((contribution) => (
                  <li key={contribution}>{contribution}</li>
                ))}
              </ul>
              <p className="cv-role-tech">
                <strong>Technology:</strong> {experience.technologies.join(", ")}
              </p>
            </article>
          ))}
        </section>

        <section className="cv-section cv-project">
          <h2>Selected Project</h2>
          <article className="cv-role">
            <header>
              <div>
                <h3>Local-First Code Reviewer</h3>
                <p>Personal developer tool</p>
              </div>
              <time>Go · TypeScript · Git · LLM APIs · VS Code</time>
            </header>
            <ul>
              {reviewerContributions.map((contribution) => (
                <li key={contribution}>{contribution}</li>
              ))}
            </ul>
          </article>
        </section>

        <section className="cv-section cv-two-column">
          <div>
            <h2>Education</h2>
            <h3>Istanbul Medeniyet University</h3>
            <p>B.Sc. in Computer Engineering</p>
            <p>2023 - 2027 (Expected) · GPA: 3.25 / 4.00</p>
          </div>
          <div>
            <h2>Languages</h2>
            <p>Turkish · Native</p>
            <p>English · Upper-Intermediate (B2)</p>
          </div>
        </section>

        <footer className="cv-contact">
          <Mail aria-hidden="true" size={14} /> {siteConfig.email}
        </footer>
      </article>
    </div>
  );
}
