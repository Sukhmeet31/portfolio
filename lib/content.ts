export type Project = {
  slug: string;
  number: string;
  name: string;
  shortName: string;
  category: string;
  summary: string;
  tags: string[];
  visual: "documents" | "terminal" | "pavilion";
  links: { label: string; href: string }[];
  sections: { title: string; text: string }[];
  station: { x: number; z: number; halfX: number; halfZ: number };
};

export const profile = {
  name: "Sukhmeet Singh",
  tagline: "Software, systems & AI evaluation.",
  location: "Delhi, India",
  identity: "B.Tech graduate · Delhi, India",
  email: "31sukhmeet@gmail.com",
  github: "https://github.com/Sukhmeet31",
  linkedin: "https://www.linkedin.com/in/sukhmeet-singh-060399227/",
  resume: "/sukhmeet-singh-resume.pdf",
  degree: "B.Tech in Information Technology",
  institution: "Guru Tegh Bahadur Institute of Technology",
  graduation: "2026",
  introduction:
    "I’m Sukhmeet, an Information Technology graduate based in Delhi. I build web applications and design tasks that help evaluate how AI agents work. I’m interested in the space between making something useful and understanding where it breaks.",
} as const;

// Evidence checked 2026-11-11: supplied resume, public repository READMEs, live landing pages.
// Landing pages loading does not validate authenticated workflows or AI output quality.
// Legal Simplifier has no confirmed repository. Do not substitute the GitHub profile.
// Resume's user/task/impact counts intentionally omitted. Node backend claims for the
// marketplace conflict with its Firebase-only README, so public copy follows the repository.
export const projects: Project[] = [
  {
    slug: "legal-document-simplifier",
    number: "01",
    name: "Legal Document Simplifier",
    shortName: "Legal Simplifier",
    category: "Document intelligence",
    visual: "documents",
    summary:
      "Making dense legal documents easier to read, question, and understand.",
    tags: ["React", "Node.js", "PostgreSQL", "RAG"],
    links: [
      {
        label: "Visit live project",
        href: "https://legal-simplifier-rho.vercel.app/",
      },
    ],
    sections: [
      {
        title: "From dense language to a clearer starting point.",
        text: "Legal Document Simplifier is an AI-assisted document review project. It brings document upload, plain-language explanations, clause review, and questions about a document into one workflow.",
      },
      {
        title: "What I built",
        text: "I worked on the full-stack application, connecting a React interface to document analysis services built with Node.js, PostgreSQL, Supabase, and the Groq API. The intended workflow starts with an uploaded document and moves into a review of its clauses and explanations.",
      },
      {
        title: "Keeping the source in the conversation",
        text: "The retrieval-augmented approach uses relevant source passages as context for questions about a document. The central concern is traceability: readers should be able to connect an explanation back to the original wording.",
      },
      {
        title: "Scope",
        text: "This is a software project for exploring document understanding. AI-generated summaries and clause flags need to be checked against the original document; they do not replace professional legal advice.",
      },
    ],
    station: { x: -5.6, z: -3.7, halfX: 1.1, halfZ: 1.0 },
  },
  {
    slug: "codemate-x",
    number: "02",
    name: "CodeMate-X",
    shortName: "CodeMate-X",
    category: "Developer tools",
    visual: "terminal",
    summary:
      "A coding workspace that brings an editor and AI assistance into the same conversation.",
    tags: ["React", "Monaco Editor", "Tailwind CSS", "Firebase"],
    links: [
      { label: "Visit live project", href: "https://code-mate-x.vercel.app/" },
      {
        label: "View source",
        href: "https://github.com/Sukhmeet31/CodeMate-x",
      },
    ],
    sections: [
      {
        title: "Less switching. More room to work.",
        text: "CodeMate-X explores a browser-based coding workspace with a code editor, an assistant panel, and a project dashboard. The idea is to keep writing code and asking questions close together.",
      },
      {
        title: "What I built",
        text: "I built the coding interface using React and Monaco Editor, with a responsive Tailwind CSS layout and Framer Motion transitions. The project includes email/password authentication and protected routes, with Firebase Authentication documented in the repository.",
      },
      {
        title: "The interface as a workspace",
        text: "An editor and a conversation have different space requirements. This project brings those two activities into one interface, alongside navigation for projects and documentation.",
      },
      {
        title: "Explore the implementation",
        text: "The public repository contains the client and server directories. The live project provides an entry point to the interface; the source is the best place to inspect how its pieces fit together.",
      },
    ],
    station: { x: 0, z: -4.5, halfX: 1.05, halfZ: 0.8 },
  },
  {
    slug: "event-services-marketplace",
    number: "03",
    name: "Event Services Marketplace",
    shortName: "Event Marketplace",
    category: "Web application",
    visual: "pavilion",
    summary:
      "Connecting event-service providers with people bringing an occasion to life.",
    tags: ["React", "JavaScript", "Tailwind CSS", "Firebase"],
    links: [
      {
        label: "View source",
        href: "https://github.com/Sukhmeet31/Event_Services_Marketplace",
      },
    ],
    sections: [
      {
        title: "One place for both sides of an event.",
        text: "This marketplace project connects customers looking for event services with vendors who provide them. It explores service discovery, vendor listings, and booking-related workflows.",
      },
      {
        title: "What I built",
        text: "I developed the web application around customer and vendor journeys. The public implementation uses React, Tailwind CSS, Firebase Authentication, and Firestore, with separate user, vendor, and administrator roles.",
      },
      {
        title: "Different roles, different responsibilities",
        text: "The repository documents vendor approval and collections for users, products, orders, and requests. These separate the service catalogue from the people and transactions around it.",
      },
      {
        title: "A project to inspect and run",
        text: "The source includes setup instructions and an example environment configuration. Running it requires a Firebase project with Authentication and Firestore enabled.",
      },
    ],
    station: { x: 5.5, z: -3.2, halfX: 1.15, halfZ: 1.1 },
  },
];

export const experience = [
  {
    organization: "Handshake AI",
    role: "AI Training Fellow · Agent Evaluation",
    kind: "Contract",
    period: "June 2026 — present",
    description:
      "Designing terminal and web-research tasks, defining success criteria and reference solutions, checking primary sources, and reviewing outputs against evaluation rubrics.",
  },
  {
    organization: "IBM SkillsBuild",
    role: "Frontend Developer Intern",
    kind: "Virtual internship",
    period: "July — August 2025",
    description:
      "Built responsive interfaces with HTML, CSS, and JavaScript, including DOM interactions and reusable UI components.",
  },
  {
    organization: "Cipher GTBIT",
    role: "Management Co-Lead",
    kind: "Student technical society",
    period: "February — September 2025",
    description:
      "Helped organise IoT workshops and technical sessions, coordinated delivery, and supported knowledge sharing with junior members.",
  },
] as const;
