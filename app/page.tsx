import Link from "next/link";
import Image from "next/image";
import {
  ArrowDown,
  ArrowDownRight,
  ArrowUpRight,
  MoveUpRight,
} from "lucide-react";
import { profile, projects, experience } from "@/lib/content";
import { Contact } from "@/components/contact";
import { Motion } from "@/components/motion";
import { ProjectArt } from "@/components/project-art";

export default function Home() {
  return (
    <Motion>
      <main id="main">
        <section className="hero section-pad" aria-labelledby="hero-title">
          <div className="hero-eyebrow mono" data-hero>
            <span>
              <span className="signal-dot" />A PERSONAL PROJECT WORKSHOP
            </span>
            <span>DELHI, INDIA ↗</span>
          </div>
          <h1
            id="hero-title"
            className="hero-name"
            aria-label="Sukhmeet Singh"
            data-hero
          >
            <span>Sukhmeet</span>
            <span>
              Singh
              <span className="name-period" aria-hidden="true">
                .
              </span>
            </span>
          </h1>
          <Link
            className="hero-workshop"
            href="/explore"
            prefetch={false}
            aria-label="Explore the interactive 3D workshop"
            data-hero
          >
            <div className="hero-workshop-image">
              <Image
                src="/images/workshop-expanded.jpg"
                alt="An architectural courtyard with three project stations and a small cobalt rover"
                width={1062}
                height={570}
                priority
                sizes="(max-width: 760px) 95vw, 50vw"
              />
            </div>
            <div className="workshop-caption">
              <span className="mono">A SMALL WORLD OF IDEAS</span>
              <span className="round-arrow">
                <ArrowUpRight size={22} />
              </span>
            </div>
          </Link>
          <div className="hero-bottom">
            <div>
              <p className="hero-tagline">
                Software, systems
                <br />& AI evaluation.
              </p>
              <p className="identity">{profile.identity}</p>
            </div>
            <div className="hero-actions">
              <a href="#work" className="button button-dark">
                View my work <ArrowDown size={17} />
              </a>
              <Link className="text-link" href="/explore" prefetch={false}>
                Enter the workshop <ArrowUpRight size={18} />
              </Link>
            </div>
          </div>
          <div className="hero-foot mono">
            <span>BUILT WITH CURIOSITY. TESTED WITH INTENT.</span>
            <span>
              SCROLL TO DISCOVER <ArrowDown size={13} />
            </span>
          </div>
        </section>

        <section
          id="work"
          tabIndex={-1}
          className="work-section section-pad"
          aria-labelledby="work-title"
        >
          <div className="section-kicker">
            <span className="mono">01 / SELECTED WORK</span>
            <span className="mono">THREE EXPLORATIONS</span>
          </div>
          <div className="section-heading" data-reveal>
            <h2 id="work-title">
              Ideas, made
              <br />
              <span className="muted">into things.</span>
            </h2>
            <p>
              A few projects at the intersection of useful software, thoughtful
              interfaces, and AI.
            </p>
          </div>
          <div className="project-list">
            {projects.map((project) => (
              <article className="project-entry" key={project.slug} data-reveal>
                <Link
                  className="project-cover-link"
                  href={`/projects/${project.slug}`}
                  aria-label={`View ${project.name}`}
                >
                  <ProjectArt project={project} />
                  <span className="project-open">
                    <ArrowUpRight size={26} />
                  </span>
                </Link>
                <div className="project-info">
                  <span className="project-number mono">{project.number}</span>
                  <div>
                    <Link href={`/projects/${project.slug}`}>
                      <h3>{project.name}</h3>
                    </Link>
                    <p>{project.summary}</p>
                  </div>
                  <div className="project-meta">
                    <span>{project.category}</span>
                    <span className="mono">
                      {project.tags.slice(0, 3).join(" / ")}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section
          className="explore-invite section-pad"
          aria-labelledby="explore-title"
          data-reveal
        >
          <span className="mono">SAME PROJECTS. A DIFFERENT PERSPECTIVE.</span>
          <div>
            <h2 id="explore-title">
              Take the
              <br />
              <span>scenic route.</span>
            </h2>
            <div className="explore-invite-aside">
              <span className="large-star" aria-hidden="true">
                ✳
              </span>
              <p>
                A little courtyard for big ideas. Wander between projects, take
                the rover for a spin, or simply look around.
              </p>
              <Link
                href="/explore"
                prefetch={false}
                className="button button-blue"
              >
                Explore the workshop <ArrowUpRight size={18} />
              </Link>
            </div>
          </div>
        </section>

        <section
          className="experience-section section-pad"
          aria-labelledby="experience-title"
        >
          <div className="section-kicker">
            <span className="mono">02 / EXPERIENCE</span>
            <span className="mono">BUILD. QUESTION. REFINE.</span>
          </div>
          <div className="evaluation-intro" data-reveal>
            <h2 id="experience-title">
              Good systems
              <br />
              need good
              <br />
              <span>questions.</span>
            </h2>
            <div>
              <ArrowDownRight className="evaluation-arrow" strokeWidth={1} />
              <p>
                Building is one side of my work.
                <br />
                Understanding where AI fails is the other.
              </p>
              <p className="secondary-copy">
                I design tasks for agents, define what success looks like, and
                examine the gap between a convincing answer and a correct one.
              </p>
              <div className="evaluation-tags">
                <span>Task design</span>
                <span>Source verification</span>
                <span>Output evaluation</span>
              </div>
            </div>
          </div>
          <div className="experience-list">
            {experience.map((item, i) => (
              <article key={item.organization} data-reveal>
                <span className="mono experience-index">0{i + 1}</span>
                <div>
                  <h3>{item.organization}</h3>
                  <p>{item.role}</p>
                  <span className="mono">
                    {item.kind} · {item.period}
                  </span>
                </div>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section
          id="about"
          tabIndex={-1}
          className="about-section section-pad"
          aria-labelledby="about-title"
        >
          <div className="section-kicker">
            <span className="mono">03 / A LITTLE ABOUT ME</span>
            <span className="mono">ALWAYS A WORK IN PROGRESS</span>
          </div>
          <div className="about-grid" data-reveal>
            <div className="about-art" aria-hidden="true">
              <span className="about-cross">✳</span>
              <span className="mono">CURIOUS BY DEFAULT.</span>
            </div>
            <div>
              <h2 id="about-title">
                A builder.
                <br />A question asker.
                <br />
                <span className="muted">Still learning.</span>
              </h2>
              <p className="about-copy">{profile.introduction}</p>
              <div className="education">
                <span className="mono">EDUCATION / {profile.graduation}</span>
                <h3>{profile.degree}</h3>
                <p>
                  {profile.institution}
                  <br />
                  {profile.location}
                </p>
              </div>
            </div>
          </div>
          <div className="focus-list">
            <div>
              <span className="mono">01</span>
              <h3>Useful interfaces</h3>
              <p>
                From an in-browser code editor to the steps of a document
                review.
              </p>
            </div>
            <div>
              <span className="mono">02</span>
              <h3>Connected systems</h3>
              <p>
                Bringing interfaces, data, and application workflows together.
              </p>
            </div>
            <div>
              <span className="mono">03</span>
              <h3>Careful evaluation</h3>
              <p>
                Tasks with clear criteria, verifiable sources, and room to
                uncover failure.
              </p>
            </div>
          </div>
          <p className="built-with mono">
            THIS WORKSHOP IS BUILT WITH NEXT.JS, TYPESCRIPT, GSAP & THREE.JS{" "}
            <MoveUpRight size={12} />
          </p>
        </section>
      </main>
      <Contact />
    </Motion>
  );
}
