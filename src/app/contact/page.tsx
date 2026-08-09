import type { Metadata } from "next";
import { ArrowUpRight, Download, Github, Linkedin, Mail } from "lucide-react";
import ContactForm from "@/components/contact/ContactForm";
import { siteConfig } from "@/data/portfolio";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Full-Stack Developer Burak Asarcikli about software development roles and product engineering work.",
  alternates: { canonical: "/contact" },
};

const contactLinks = [
  { label: "Email", value: siteConfig.email, href: `mailto:${siteConfig.email}`, icon: Mail },
  { label: "LinkedIn", value: "burak-asarcikli", href: siteConfig.linkedin, icon: Linkedin },
  { label: "GitHub", value: "mubakli", href: siteConfig.github, icon: Github },
];

export default function ContactPage() {
  return (
    <div className="identity-page contact-page shell">
      <header>
        <p className="eyebrow">Contact</p>
        <h1>Let&apos;s talk about useful software.</h1>
        <p>
          I am open to full-stack development opportunities and conversations
          with teams building production web applications.
        </p>
      </header>

      <div className="contact-grid">
        <div className="contact-links">
          {contactLinks.map(({ label, value, href, icon: Icon }) => (
            <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noreferrer" : undefined} key={label}>
              <Icon aria-hidden="true" size={18} />
              <span>
                <small>{label}</small>
                {value}
              </span>
              <ArrowUpRight aria-hidden="true" size={16} />
            </a>
          ))}
          <a href={siteConfig.cv.english} download>
            <Download aria-hidden="true" size={18} />
            <span>
              <small>Curriculum vitae</small>
              English CV
            </span>
            <ArrowUpRight aria-hidden="true" size={16} />
          </a>
          <p className="cv-language-note">
            English is currently available. The CV interface is prepared for a
            Turkish version when it is added.
          </p>
        </div>
        <ContactForm />
      </div>
    </div>
  );
}
