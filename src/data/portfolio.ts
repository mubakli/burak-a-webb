export const siteConfig = {
  name: "Burak Asarcikli",
  role: "Full-Stack Developer",
  location: "Istanbul, Türkiye",
  url: "https://burak-asarcikli.vercel.app",
  email: "brkasarcikli@outlook.com",
  github: "https://github.com/mubakli",
  linkedin: "https://www.linkedin.com/in/burak-asarcikli",
  cv: {
    english: "/burak-asarcikli-cv-en.pdf",
    turkish: null,
  },
  description:
    "The personal space of Burak Asarcikli, a Full-Stack Developer in Istanbul sharing his work, interests, and life beyond the screen.",
} as const;

export type Experience = {
  company: string;
  role: string;
  period: string;
  context: string;
  contributions: string[];
  technologies: string[];
  featuredWork: { label: string; href: string };
};

export const experiences: Experience[] = [
  {
    company: "Fabrikod",
    role: "Full-Stack Developer Intern",
    period: "June 2026 - Present",
    context:
      "Contributing to an established enterprise document-management application across its Next.js frontend and .NET backend.",
    contributions: [
      "Developed and shipped an end-to-end operational analytics dashboard spanning national, provincial, organizational, personnel, and time-period views.",
      "Worked through the existing layered architecture, authorization infrastructure, and service/repository patterns rather than replacing established conventions.",
      "Resolved a cross-table consistency issue where deleted uploads could leave related documents affecting reported statistics.",
      "Implemented permission-aware UI actions and corrected table overflow and layout issues.",
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
    featuredWork: {
      label: "Enterprise analytics dashboard",
      href: "/work/enterprise-analytics-dashboard",
    },
  },
  {
    company: "Fuyabe Software",
    role: "Full-Stack Developer",
    period: "May 2025 - May 2026",
    context:
      "Built and maintained a production university-preference platform used by students, advisors, administrators, and partner organizations.",
    contributions: [
      "Delivered frontend features, REST APIs, relational data models, authentication, role-based workflows, filtering, pagination, and administrative interfaces.",
      "Built an annual ÖSYM data-processing workflow that normalized Excel data, associated yearly records, and surfaced ambiguous cases for manual review.",
      "Integrated Google Sign-In, OTP verification, email, and SMS flows into role-aware user journeys.",
      "Containerized applications, maintained GitHub Actions pipelines, and supported deployment and troubleshooting on an Azure-hosted server.",
    ],
    technologies: [
      "TypeScript",
      "Next.js",
      "React",
      "Bun",
      "Hono",
      "PostgreSQL",
      "Docker",
      "GitHub Actions",
      "Azure",
    ],
    featuredWork: {
      label: "ÖSYM annual data pipeline",
      href: "/work/osym-data-pipeline",
    },
  },
];

export type CaseStudySection = {
  title: string;
  body: string;
  points?: string[];
};

export type CaseStudy = {
  slug: string;
  title: string;
  type: string;
  organization: string;
  summary: string;
  result: string;
  technologies: string[];
  repository?: string;
  sections: CaseStudySection[];
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "osym-data-pipeline",
    title: "ÖSYM Annual Data Pipeline",
    type: "Production work",
    organization: "Fuyabe Software",
    summary:
      "Turning annually published spreadsheet data into reliable, historically connected application records without hiding uncertain matches.",
    result:
      "Automated a previously manual annual workflow and saved approximately two working days during an update cycle.",
    technologies: ["TypeScript", "Excel processing", "PostgreSQL", "Relational data modeling"],
    sections: [
      {
        title: "Problem",
        body:
          "ÖSYM publishes yearly university and program information in Excel files whose structure does not map directly to the application's relational model. The application also needs to preserve history, not simply replace one year's data with the next.",
      },
      {
        title: "Constraints",
        body:
          "A program's identity is not always stable across years. Departments can be renamed, discontinued, introduced, or published with changed identifiers, so an apparently convenient automatic match can corrupt historical relationships.",
      },
      {
        title: "Approach",
        body:
          "I built a pipeline that reads and normalizes the incoming workbook, compares it with existing records, and associates yearly program data where the relationship is sufficiently clear.",
        points: [
          "Normalize the source into the application's expected structure.",
          "Compare current records with preserved historical data.",
          "Associate yearly program records rather than overwriting history.",
        ],
      },
      {
        title: "Edge cases",
        body:
          "Ambiguous or unusual records are surfaced in a human-readable review output. The workflow intentionally asks for a decision instead of silently making a risky assumption.",
      },
      {
        title: "Result",
        body:
          "The pipeline automated a previously manual process and saved approximately two working days in an annual update cycle while retaining a deliberate manual checkpoint for uncertain data.",
      },
    ],
  },
  {
    slug: "enterprise-analytics-dashboard",
    title: "Enterprise Analytics Dashboard",
    type: "Production work",
    organization: "Fabrikod",
    summary:
      "An end-to-end statistics experience for a document-management product, implemented within an established application architecture.",
    result:
      "Merged and used in production, with reporting corrected so stale document records no longer affect the relevant statistics.",
    technologies: ["Next.js", "TypeScript", "ASP.NET Core", "PostgreSQL", "HeroUI"],
    sections: [
      {
        title: "Problem",
        body:
          "The product needed operational statistics at several organizational levels, including national, provincial, directorate, and personnel views, along with time comparisons and document/upload metrics.",
      },
      {
        title: "My contribution",
        body:
          "As a full-stack developer intern, I implemented the feature across the frontend and backend data flow while adapting to the product's existing authorization and layered application structure.",
      },
      {
        title: "Frontend",
        body:
          "I built the dashboard views, handled data-heavy table and layout behavior, and used the existing permission model to control the visibility of relevant actions.",
      },
      {
        title: "Backend and data",
        body:
          "I worked on the APIs and statistical data flows that supplied the different scopes and reporting periods required by the interface.",
      },
      {
        title: "Consistency work",
        body:
          "Uploaded records and their documents were represented separately. Deleting an upload could leave its associated document in the statistical flow, so deleted data continued to influence metrics. I traced the issue across those relationships and corrected the deletion/statistics behavior.",
      },
      {
        title: "Production result",
        body:
          "The completed feature was merged and is used in production. This work was a contribution within the existing platform, not a redesign of its overall architecture.",
      },
    ],
  },
  {
    slug: "local-first-code-reviewer",
    title: "Local-First Code Reviewer",
    type: "Personal developer tool",
    organization: "Active experiment",
    summary:
      "Developing and iterating on a local-first tool that reviews staged Git changes before commit through a Go CLI and VS Code integration.",
    result:
      "A working, actively evolving review workflow shaped around pre-commit feedback, focused diffs, and selective use of deeper analysis.",
    technologies: ["Go", "TypeScript", "Git", "VS Code Extension APIs", "LLM APIs"],
    repository: "https://github.com/mubakli/code-review",
    sections: [
      {
        title: "Why I built it",
        body:
          "PR-only review tools provide feedback after code has already been pushed and assembled into a pull request. I wanted a shorter feedback loop: review the change while it is still staged locally and easy to revise.",
      },
      {
        title: "Workflow",
        body:
          "The tool starts with the staged Git diff rather than sending an entire repository. It can obtain surrounding context selectively when a focused review needs more information.",
      },
      {
        title: "Product decisions",
        body:
          "The current direction separates correctness review from security review and uses a cheaper security triage step before deciding whether more expensive analysis is warranted.",
        points: [
          "Diff-first analysis to keep reviews focused.",
          "Less unnecessary source-code exposure and token usage.",
          "Selective context gathering rather than whole-repository submission.",
          "Correctness and security treated as different review concerns.",
        ],
      },
      {
        title: "Current state",
        body:
          "The project currently includes a Go CLI and VS Code integration. It is new, in active iteration, and its workflow is changing based on actual use.",
      },
      {
        title: "How it is being built",
        body:
          "The implementation has been developed heavily with AI-assisted workflows. The problem framing and several product decisions are mine, while substantial architecture and implementation details were proposed or produced with AI assistance.",
      },
      {
        title: "What I am learning",
        body:
          "The project is helping me evaluate product tradeoffs around context, cost, privacy, and review timing while also building practical exposure to Go and extension development.",
      },
    ],
  },
];

export const skillGroups = [
  { title: "Core languages", items: ["TypeScript", "C#", "JavaScript", "SQL"] },
  {
    title: "Backend",
    items: ["ASP.NET Core", "Entity Framework Core", "Bun", "Hono", "REST APIs"],
  },
  { title: "Frontend", items: ["React", "Next.js", "Tailwind CSS", "HeroUI"] },
  { title: "Data", items: ["PostgreSQL", "Relational data modeling"] },
  {
    title: "Architecture & practices",
    items: [
      "Dependency Injection",
      "SOLID principles",
      "Layered architecture",
      "Service / Repository patterns",
    ],
  },
  {
    title: "Delivery & tools",
    items: ["Docker", "Docker Compose", "GitHub Actions", "Git", "Linux", "Nginx", "Azure"],
  },
  {
    title: "Additional exposure",
    items: ["Go", "LLM APIs", "VS Code Extension Development"],
    secondary: true,
  },
] as const;

type ArchiveProject = {
  title: string;
  description: string;
  technologies: readonly string[];
  href?: string;
  status?: string;
};

export const archiveProjects: readonly ArchiveProject[] = [
  {
    title: "Virtual Trade",
    description: "A simulated cryptocurrency trading platform with portfolio and market tracking.",
    technologies: ["Next.js", "PostgreSQL", "Docker"],
    href: "https://vtrade.bupropious.xyz/",
    status: "Live",
  },
  {
    title: "Hotel Survey",
    description: "A multilingual guest feedback system with an administrative analytics interface.",
    technologies: ["Next.js", "MongoDB", "Nginx", "i18n"],
    status: "Active",
  },
  {
    title: "MedeniyeTekno",
    description: "The public website for Istanbul Medeniyet University's technology club.",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS"],
    href: "https://medeniyetekno.vercel.app/",
    status: "Live",
  },
  {
    title: "Splitable",
    description: "A shared-expense application for groups, custom splits, and debt tracking.",
    technologies: ["React", "Node.js", "PostgreSQL"],
  },
] as const;

export const professionalSummary =
  "Full-Stack Developer and Computer Engineering student with 1+ year of professional experience shipping production web applications across frontend, backend, data, and deployment. Experienced with C#/.NET, TypeScript, React/Next.js, and PostgreSQL, with hands-on work in Docker, CI/CD, and Azure deployments. I follow problems end to end, from relational data models and backend behavior to user-facing features and delivery, while developing deeper judgment in software architecture.";
