import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Workshop } from "@/components/workshop/workshop";
import { projects } from "@/lib/content";
export const metadata: Metadata = {
  title: "The workshop",
  description:
    "Explore Sukhmeet Singh’s coastal project workshop. Race a rover, bowl, collect project stamps and discover the island by day or night.",
};
export default function ExplorePage() {
  return (
    <main id="main" className="workshop-page">
      <div className="workshop-top">
        <div>
          <Link href="/" className="text-link">
            <ArrowLeft size={15} />
            Back to portfolio
          </Link>
          <h1>
            The workshop<span className="name-period">.</span>
          </h1>
        </div>
        <p>
          Three projects. An island of possibilities.
          <br />
          Go wherever your curiosity takes you.
        </p>
      </div>
      <Workshop />
      <noscript>
        <p>Browse the projects without JavaScript:</p>
        <ul>
          {projects.map((project) => (
            <li key={project.slug}>
              <Link href={`/projects/${project.slug}`}>{project.name}</Link>
            </li>
          ))}
        </ul>
      </noscript>
    </main>
  );
}
