import Image from "next/image";
import Link from "next/link";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Bike,
  BriefcaseBusiness,
  Download,
  FlaskConical,
  Github,
  GraduationCap,
  Linkedin,
  MapPin,
} from "lucide-react";
import { caseStudies, siteConfig } from "@/data/portfolio";

const coordinates = [
  {
    icon: BriefcaseBusiness,
    label: "Right now",
    value: "Building full-stack products at Fabrikod",
  },
  {
    icon: GraduationCap,
    label: "In parallel",
    value: "Studying Computer Engineering",
  },
  {
    icon: MapPin,
    label: "Home base",
    value: "Istanbul, Türkiye",
  },
];

const interests = [
  "Full-stack engineering",
  "Long rides",
  "Fragrance",
  "Developer tools",
  "Old computers",
  "Good questions",
];

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.name,
    url: siteConfig.url,
    jobTitle: siteConfig.role,
    email: `mailto:${siteConfig.email}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Istanbul",
      addressCountry: "TR",
    },
    sameAs: [siteConfig.github, siteConfig.linkedin],
    affiliation: {
      "@type": "CollegeOrUniversity",
      name: "Istanbul Medeniyet University",
    },
  };

  return (
    <div className="home-dossier">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="home-hero shell" aria-labelledby="hero-title">
        <div className="home-hero-copy">
          <p className="home-kicker">
            <span className="status-dot" aria-hidden="true" />
            Hello, I&apos;m Burak
          </p>
          <h1 id="hero-title">
            Developer
            <span>by trade.</span>
            Curious <em>by nature.</em>
          </h1>
          <div className="home-hero-intro">
            <p>
              I build software, chase long roads on two wheels, and pay attention
              to the small details that make things memorable.
            </p>
            <div className="button-row">
              <Link className="button-primary" href="#selected-work">
                Explore my world <ArrowDownRight aria-hidden="true" size={17} />
              </Link>
              <a className="button-secondary" href={siteConfig.cv.english} download>
                CV <Download aria-hidden="true" size={16} />
              </a>
            </div>
          </div>
          <div className="home-social-rail" aria-label="Social links">
            <a href={siteConfig.github} target="_blank" rel="noreferrer">
              <Github aria-hidden="true" size={17} /> GitHub
            </a>
            <a href={siteConfig.linkedin} target="_blank" rel="noreferrer">
              <Linkedin aria-hidden="true" size={17} /> LinkedIn
            </a>
          </div>
        </div>

        <div className="home-hero-portrait">
          <figure>
            <Image
              src="/Myphoto.webp"
              alt="Burak smiling beside a collection of vintage computers"
              fill
              priority
              unoptimized
              sizes="(max-width: 820px) 90vw, 38vw"
            />
          </figure>
          <div className="portrait-note portrait-note-top" aria-hidden="true">
            <span>Based in</span>
            Istanbul
          </div>
          <div className="portrait-note portrait-note-bottom" aria-hidden="true">
            <span>Current mode</span>
            Learning / Building
          </div>
          <span className="portrait-orbit" aria-hidden="true">BA / IST</span>
        </div>

      </section>

      <div className="interest-ticker" aria-label="A few things I care about">
        <div className="ticker-track">
          {Array.from({ length: 12 }, (_, groupIndex) => (
            <div
              className="ticker-group"
              aria-hidden={groupIndex > 0 || undefined}
              key={groupIndex}
            >
              {interests.map((interest) => (
                <span key={interest}>
                  {interest} <i aria-hidden="true">✦</i>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <section className="home-intro shell" id="about-me">
        <div className="home-section-label">
          <span>01</span>
          <p>Behind the screen</p>
        </div>
        <div className="home-intro-copy">
          <p className="home-statement">
            I&apos;m a full-stack developer who likes understanding how a thing
            works <em>all the way through.</em>
          </p>
          <div className="home-intro-detail">
            <p>
              That instinct takes me from interface details to data models and
              deployment, and from a city street to the end of a mountain road.
              I enjoy the process of noticing, learning, and making something
              clearer than I found it.
            </p>
            <Link className="ink-link" href="/about">
              The longer version <ArrowUpRight aria-hidden="true" size={16} />
            </Link>
          </div>
        </div>
        <div className="coordinate-grid">
          {coordinates.map(({ icon: Icon, label, value }) => (
            <article key={label}>
              <Icon aria-hidden="true" size={20} />
              <span>{label}</span>
              <p>{value}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="home-work" id="selected-work">
        <div className="shell">
          <div className="home-work-heading">
            <div className="home-section-label home-section-label-light">
              <span>02</span>
              <p>Selected work</p>
            </div>
            <div>
              <h2>Problems I enjoyed getting lost in.</h2>
              <p>
                A few examples of how I think across product, code, data, and
                delivery. No inflated claims, just the decisions and outcomes.
              </p>
            </div>
          </div>

          <div className="home-work-list">
            {caseStudies.map((project, index) => (
              <Link
                className="home-work-card"
                href={`/work/${project.slug}`}
                key={project.slug}
              >
                <div className="home-work-number">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <small>{project.type}</small>
                </div>
                <div className="home-work-copy">
                  <p>{project.organization}</p>
                  <h3>{project.title}</h3>
                  <span>{project.summary}</span>
                </div>
                <div className="home-work-result">
                  <small>Outcome</small>
                  <p>{project.result}</p>
                </div>
                <ArrowUpRight className="home-work-arrow" aria-hidden="true" />
              </Link>
            ))}
          </div>

          <div className="home-work-footer">
            <p>There is more in the archive, including web, mobile, and university work.</p>
            <Link className="button-acid" href="/projects">
              Open project archive <ArrowRight aria-hidden="true" size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className="home-offscreen shell" id="off-screen">
        <div className="home-offscreen-heading">
          <div className="home-section-label">
            <span>03</span>
            <p>Off screen</p>
          </div>
          <div>
            <h2>The things that keep me moving and noticing.</h2>
            <p>There is a person behind the commits. This is some of the rest.</p>
          </div>
        </div>

        <div className="offscreen-collage">
          <article className="interest-card interest-card-cycling">
            <div className="interest-image">
              <Image
                src="/cycling-me.jpg"
                alt="Burak during a cycling trip among ancient ruins"
                fill
                sizes="(max-width: 820px) 100vw, 55vw"
              />
              <span className="image-coordinate">36.54° N / 31.99° E</span>
            </div>
            <div className="interest-copy">
              <Bike aria-hidden="true" size={24} />
              <p className="interest-index">01 / Cycling</p>
              <h3>A clear head starts with a long road.</h3>
              <p>
                Cycling is how I reset the noise, test my patience, and see what
                exists beyond the usual route. The climb is part of the point.
              </p>
            </div>
          </article>

          <article className="interest-card interest-card-fragrance">
            <div className="interest-image">
              <Image
                src="/perfume-mockup.jpg"
                alt="A warm fragrance workshop scene"
                fill
                sizes="(max-width: 820px) 100vw, 36vw"
              />
            </div>
            <div className="interest-copy">
              <FlaskConical aria-hidden="true" size={23} />
              <p className="interest-index">02 / Fragrance</p>
              <h3>Small notes, distinct character.</h3>
              <p>
                Fragrance taught me to notice composition: how separate notes
                can become an identity, and how tiny changes alter the whole.
              </p>
            </div>
          </article>

          <figure className="road-note">
            <Image
              src="/cycling-road.jpg"
              alt="Two bicycles resting on a quiet forest road"
              fill
              sizes="(max-width: 820px) 100vw, 70vw"
            />
            <figcaption>Take the scenic route when you can.</figcaption>
          </figure>
        </div>
      </section>

      <section className="home-now shell" id="experience">
        <div className="home-section-label">
          <span>04</span>
          <p>Where I am now</p>
        </div>
        <div className="home-now-main">
          <div>
            <p className="now-kicker">Currently</p>
            <h2>Working, studying, and sharpening my judgment.</h2>
          </div>
          <div className="now-timeline">
            <article>
              <time>2026 — now</time>
              <div>
                <h3>Full-Stack Developer Intern</h3>
                <p>Fabrikod · Enterprise document management</p>
              </div>
            </article>
            <article>
              <time>2025 — 2026</time>
              <div>
                <h3>Full-Stack Developer</h3>
                <p>Fuyabe Software · Production education platforms</p>
              </div>
            </article>
            <article>
              <time>2023 — 2027</time>
              <div>
                <h3>B.Sc. Computer Engineering</h3>
                <p>Istanbul Medeniyet University</p>
              </div>
            </article>
          </div>
          <Link className="ink-link" href="/experience">
            Read the complete experience <ArrowRight aria-hidden="true" size={16} />
          </Link>
        </div>
      </section>

      <section className="home-contact">
        <div className="shell">
          <p>05 / Say hello</p>
          <h2>Have a problem worth thinking about?</h2>
          <div>
            <p>
              I&apos;m always interested in a thoughtful project, a useful idea,
              or a genuinely good conversation.
            </p>
            <Link href="/contact">
              Let&apos;s talk <ArrowUpRight aria-hidden="true" size={26} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
