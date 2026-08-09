import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { CaseStudy } from "@/data/portfolio";
import Tags from "@/components/common/Tags";

export default function CaseStudyCard({
  caseStudy,
  index,
}: {
  caseStudy: CaseStudy;
  index: number;
}) {
  return (
    <article className="case-card">
      <div className="case-meta">
        <span>{String(index + 1).padStart(2, "0")}</span>
        <span>{caseStudy.type}</span>
      </div>
      <div className="case-copy">
        <p>{caseStudy.organization}</p>
        <h3>{caseStudy.title}</h3>
        <p>{caseStudy.summary}</p>
      </div>
      <div className="case-result">
        <p className="detail-label">Result</p>
        <p>{caseStudy.result}</p>
      </div>
      <Tags items={caseStudy.technologies} />
      <Link className="case-link" href={`/work/${caseStudy.slug}`} aria-label={`Read ${caseStudy.title} case study`}>
        View case study <ArrowUpRight aria-hidden="true" size={16} />
      </Link>
    </article>
  );
}
