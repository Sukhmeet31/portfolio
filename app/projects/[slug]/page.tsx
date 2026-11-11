import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { projects } from "@/lib/content";
import { ProjectArt } from "@/components/project-art";
import { Contact } from "@/components/contact";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  return {
    title: project?.name ?? "Project not found",
    description: project?.summary,
  };
}
export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();
  const project = projects[index];
  const next = projects[(index + 1) % projects.length];
  return (
    <>
      <main id="main" className="project-page section-pad">
        <Link href="/#work" className="text-link">
          <ArrowLeft size={16} />
          Selected work
        </Link>
        <div className="project-page-heading">
          <span className="mono">
            PROJECT {project.number} / {project.category.toUpperCase()}
          </span>
          <h1>{project.name}</h1>
          <p>{project.summary}</p>
          <div className="project-page-tags">
            {project.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          <div className="project-page-links">
            {project.links.map((link) => (
              <a
                key={link.href}
                className="button button-dark"
                href={link.href}
                target="_blank"
                rel="noreferrer"
              >
                {link.label}
                <ArrowUpRight size={17} />
              </a>
            ))}
          </div>
        </div>
        <ProjectArt project={project} />
        <div className="case-study">
          <aside>
            <span className="mono">A CLOSER LOOK</span>
            <p>{project.category}</p>
            <Link href="/explore" prefetch={false} className="text-link">
              Find it in the workshop <ArrowUpRight size={16} />
            </Link>
          </aside>
          <div>
            {project.sections.map((section, i) => (
              <section key={section.title}>
                <span className="mono">0{i + 1}</span>
                <h2>{section.title}</h2>
                <p>{section.text}</p>
              </section>
            ))}
          </div>
        </div>
        <Link href={`/projects/${next.slug}`} className="next-project">
          <div>
            <span className="mono">NEXT PROJECT / {next.number}</span>
            <h2>{next.name}</h2>
          </div>
          <ArrowRight strokeWidth={1} />
        </Link>
      </main>
      <Contact />
    </>
  );
}
