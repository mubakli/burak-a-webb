import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Experience } from "@/data/portfolio";
import Tags from "@/components/common/Tags";

export default function ExperienceCard({
  experience,
  index,
}: {
  experience: Experience;
  index: number;
}) {
  return (
    <article className="experience-story">
      <header className="experience-story-meta">
        <div>
          <span>{String(index + 1).padStart(2, "0")}</span>
          <p>{experience.company}</p>
        </div>
        <time>{experience.period}</time>
      </header>

      <div className="experience-story-title">
        <h3>{experience.role}</h3>
        <p>{experience.context}</p>
      </div>

      <div className="experience-story-body">
        <div className="experience-contributions">
          <p className="experience-story-label">What I worked on</p>
          <ol>
            {experience.contributions.map((contribution, contributionIndex) => (
              <li key={contribution}>
                <span>{String(contributionIndex + 1).padStart(2, "0")}</span>
                <p>{contribution}</p>
              </li>
            ))}
          </ol>
        </div>

        <aside className="experience-story-aside">
          <p className="experience-story-label">Working with</p>
          <Tags items={experience.technologies} />
          <Link href={experience.featuredWork.href}>
            Read the related case
            <span>{experience.featuredWork.label}</span>
            <ArrowUpRight aria-hidden="true" size={18} />
          </Link>
        </aside>
      </div>
    </article>
  );
}
