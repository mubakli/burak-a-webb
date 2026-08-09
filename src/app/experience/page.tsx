import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Download } from "lucide-react";
import ExperienceCard from "@/components/portfolio/ExperienceCard";
import SkillsGrid from "@/components/portfolio/SkillsGrid";
import { experiences, siteConfig } from "@/data/portfolio";

export const metadata: Metadata = {
  title: "Experience",
  description:
    "Burak Asarcikli's professional full-stack development experience at Fabrikod and Fuyabe Software.",
  alternates: { canonical: "/experience" },
};

const experienceFacts = [
  { label: "Professional roles", value: "02" },
  { label: "Working range", value: "UI to deployment" },
  { label: "Timeline", value: "2025 to now" },
];

export default function ExperiencePage() {
  return (
    <div className="identity-page experience-page">
      <header className="experience-journal-hero shell">
        <div className="experience-hero-heading">
          <p>Work / Experience</p>
          <h1>Learning by building real things.</h1>
        </div>

        <div className="experience-hero-intro">
          <p>
            My experience so far has come from contributing to production
            software, following features across layers, and learning to make
            decisions inside systems that already have users and constraints.
          </p>
          <div className="button-row">
            <a className="button-primary" href={siteConfig.cv.english} download>
              Download CV <Download aria-hidden="true" size={16} />
            </a>
            <Link className="button-secondary" href="/#selected-work">
              Selected work <ArrowRight aria-hidden="true" size={16} />
            </Link>
          </div>
        </div>

        <div className="experience-facts">
          {experienceFacts.map((fact) => (
            <article key={fact.label}>
              <span>{fact.label}</span>
              <strong>{fact.value}</strong>
            </article>
          ))}
        </div>
      </header>

      <section className="experience-roles">
        <div className="shell">
          <div className="experience-section-heading">
            <p>01 / The timeline</p>
            <div>
              <h2>The work, in context.</h2>
              <p>
                What I joined, what I contributed, and which parts of the stack
                I worked with along the way.
              </p>
            </div>
          </div>

          <div className="experience-story-list">
            {experiences.map((experience, index) => (
              <ExperienceCard
                experience={experience}
                index={index}
                key={experience.company}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="experience-toolkit">
        <div className="shell">
          <div className="experience-section-heading">
            <p>02 / Working range</p>
            <div>
              <h2>Tools I use to move through the system.</h2>
              <p>
                Not a wall of logos and not equal mastery in every category.
                This is the practical toolkit behind the work above.
              </p>
            </div>
          </div>
          <SkillsGrid />
        </div>
      </section>

      <section className="experience-next">
        <div className="shell">
          <p>03 / Continue exploring</p>
          <h2>See the decisions behind the work.</h2>
          <Link href="/#selected-work">
            Browse case studies <ArrowUpRight aria-hidden="true" size={22} />
          </Link>
        </div>
      </section>
    </div>
  );
}
