import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Github } from "lucide-react";
import Tags from "@/components/common/Tags";
import { caseStudies } from "@/data/portfolio";

type CaseStudyPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return caseStudies.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: CaseStudyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const caseStudy = caseStudies.find((item) => item.slug === slug);

  if (!caseStudy) return {};

  return {
    title: caseStudy.title,
    description: caseStudy.summary,
    alternates: { canonical: `/work/${caseStudy.slug}` },
    openGraph: {
      title: caseStudy.title,
      description: caseStudy.summary,
      type: "article",
    },
  };
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { slug } = await params;
  const caseStudy = caseStudies.find((item) => item.slug === slug);

  if (!caseStudy) notFound();

  return (
    <article className="identity-page case-study-page">
      <header className="case-header shell">
        <Link className="back-link" href="/#selected-work">
          <ArrowLeft aria-hidden="true" size={15} /> All engineering work
        </Link>
        <div className="case-header-grid">
          <div>
            <p className="eyebrow">{caseStudy.type} / {caseStudy.organization}</p>
            <h1>{caseStudy.title}</h1>
          </div>
          <div className="case-header-summary">
            <p>{caseStudy.summary}</p>
            <Tags items={caseStudy.technologies} />
            {caseStudy.repository && (
              <a
                className="text-link"
                href={caseStudy.repository}
                target="_blank"
                rel="noreferrer"
              >
                <Github aria-hidden="true" size={16} /> View repository
                <ArrowUpRight aria-hidden="true" size={14} />
              </a>
            )}
          </div>
        </div>
      </header>

      <div className="case-body shell">
        <aside>
          <p className="detail-label">Outcome</p>
          <p>{caseStudy.result}</p>
          <p className="confidentiality-note">
            No private source code, screenshots, or proprietary implementation
            details are included.
          </p>
        </aside>
        <div className="case-sections">
          {caseStudy.sections.map((section, index) => (
            <section key={section.title}>
              <div className="case-section-number" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </div>
              <div>
                <h2>{section.title}</h2>
                <p>{section.body}</p>
                {section.points && (
                  <ul>
                    {section.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          ))}
        </div>
      </div>

      <nav className="case-navigation shell" aria-label="Case studies">
        {caseStudies
          .filter((item) => item.slug !== caseStudy.slug)
          .map((item) => (
            <Link href={`/work/${item.slug}`} key={item.slug}>
              <span>Next case</span>
              {item.title} <ArrowUpRight aria-hidden="true" size={16} />
            </Link>
          ))}
      </nav>
    </article>
  );
}
