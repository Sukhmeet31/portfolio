import { BookOpen, CalendarDays, Check, Code2, FileText } from "lucide-react";
import { projects } from "@/lib/content";

const icons = [FileText, Code2, CalendarDays];
const labels = ["CLARITY", "CREATION", "CONNECTION"];

export function ProjectPassport({ stamps }: { stamps: string[] }) {
  const complete = stamps.length === projects.length;
  return (
    <section className={`project-passport ${complete ? "complete" : ""}`} aria-labelledby="passport-title">
      <div className="passport-heading">
        <BookOpen size={17} aria-hidden="true" />
        <h3 id="passport-title">Project passport</h3>
        <span className="mono" aria-label="Passport progress" aria-live="polite">{stamps.length} / {projects.length} stamps</span>
      </div>
      <div className="passport-stamps">
        {projects.map((project, index) => {
          const collected = stamps.includes(project.slug);
          const Icon = icons[index];
          return (
            <div className={`passport-stamp ${collected ? "collected" : ""}`} key={project.slug} role="img" aria-label={`${project.name}: ${collected ? "stamp collected" : "not visited"}`}>
              <span className="stamp-number mono">{project.number}</span>
              <Icon size={23} aria-hidden="true" />
              <span className="stamp-label mono">{labels[index]}</span>
              {collected && <Check className="stamp-check" size={12} aria-hidden="true" />}
            </div>
          );
        })}
      </div>
      <p aria-live="polite">{complete ? "Every station, a story. Passport complete." : "Open a station or drive up to it. Keep a little proof of your curiosity."}</p>
      <span className="passport-footnote mono">A SOUVENIR OF YOUR VISIT</span>
    </section>
  );
}
