import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Bike,
  FlaskConical,
  Languages,
  MapPin,
} from "lucide-react";
import SectionHeading from "@/components/common/SectionHeading";

export const metadata: Metadata = {
  title: "About",
  description:
    "Meet Burak Asarcikli: full-stack developer, Computer Engineering student, cyclist, and curious mind based in Istanbul.",
  alternates: { canonical: "/about" },
};

const principles = [
  {
    title: "Follow the full path",
    copy: "A UI defect can begin in a query, business rule, or deployment setting. I trace the behavior through the system before deciding where the fix belongs.",
  },
  {
    title: "Respect what exists",
    copy: "Real software already has constraints, conventions, and users. Understanding those relationships comes before introducing a new pattern.",
  },
  {
    title: "Make claims inspectable",
    copy: "I would rather explain one real contribution, its constraints, and its outcome than hide behind a broad label.",
  },
  {
    title: "Stay a beginner",
    copy: "Breadth gives me context, not mastery. I try to keep the curiosity of a beginner while developing better engineering judgment through practice.",
  },
];

export default function AboutPage() {
  return (
    <div className="personal-about">
      <header className="about-personal-hero shell">
        <div className="about-personal-copy">
          <p className="about-personal-kicker">A little more context</p>
          <h1>I like knowing how things fit together.</h1>
          <div className="about-personal-intro">
            <p>
              I&apos;m Burak, a full-stack developer and Computer Engineering
              student in Istanbul. I am most at home somewhere between a useful
              question and a working answer.
            </p>
            <p>
              Software is where that curiosity becomes practical. It lets me
              move between the visible and invisible parts of a system, learn
              why each decision exists, and leave the whole thing a little more
              understandable.
            </p>
          </div>
          <Link className="ink-link" href="/experience">
            See what I have worked on <ArrowRight aria-hidden="true" size={16} />
          </Link>
        </div>

        <div className="about-personal-photo">
          <figure>
            <Image
              src="/Myphoto.webp"
              alt="Burak smiling beside a collection of vintage computers"
              fill
              priority
              sizes="(max-width: 820px) 100vw, 38vw"
            />
          </figure>
          <span className="about-photo-caption">Naturally, I found the old computers.</span>
        </div>
      </header>

      <section className="about-quick-facts">
        <div className="shell">
          <article>
            <MapPin aria-hidden="true" size={18} />
            <span>Based in</span>
            <strong>Istanbul, Türkiye</strong>
          </article>
          <article>
            <Languages aria-hidden="true" size={18} />
            <span>Speaks</span>
            <strong>Turkish / English</strong>
          </article>
          <article>
            <span className="fact-mark" aria-hidden="true">B.Sc.</span>
            <span>Studying</span>
            <strong>Computer Engineering</strong>
          </article>
        </div>
      </section>

      <section className="page-section shell about-principles">
        <SectionHeading
          eyebrow="01 / How I work"
          title="Curiosity, with some ground rules."
          description="These are not abstract values. They are habits shaped by following production problems across boundaries."
        />
        <div className="principles-grid">
          {principles.map((principle, index) => (
            <article key={principle.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h2>{principle.title}</h2>
              <p>{principle.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="about-beyond">
        <div className="shell">
          <div className="about-beyond-heading">
            <p>02 / Away from the keyboard</p>
            <h2>Different ways of paying attention.</h2>
          </div>

          <div className="about-beyond-grid">
            <article>
              <figure>
                <Image
                  src="/cycling-road.jpg"
                  alt="Two bicycles resting on a forest road"
                  fill
                  sizes="(max-width: 820px) 100vw, 58vw"
                />
              </figure>
              <div>
                <Bike aria-hidden="true" size={24} />
                <h3>On the road</h3>
                <p>
                  I cycle for distance, quiet, and the view that only arrives
                  after the climb. It is equal parts movement and reset.
                </p>
              </div>
            </article>
            <article>
              <figure>
                <Image
                  src="/perfume-mockup.jpg"
                  alt="A warm fragrance workshop scene"
                  fill
                  sizes="(max-width: 820px) 100vw, 35vw"
                />
              </figure>
              <div>
                <FlaskConical aria-hidden="true" size={23} />
                <h3>In the details</h3>
                <p>
                  Fragrance keeps me curious about memory, composition, and the
                  character created by details that are easy to overlook.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="about-next shell">
        <p>Enough about me.</p>
        <h2>What are you working on?</h2>
        <Link href="/contact">
          Start a conversation <ArrowUpRight aria-hidden="true" size={20} />
        </Link>
      </section>
    </div>
  );
}
