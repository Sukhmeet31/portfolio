import type { Project } from "@/lib/content";

export function ProjectArt({ project }: { project: Project }) {
  return (
    <div className={`project-art art-${project.visual}`}>
      <span className="art-label mono">
        STUDY {project.number} / {project.category.toUpperCase()}
      </span>
      {project.visual === "documents" ? (
        <svg
          className="abstract-project-art"
          viewBox="0 0 900 500"
          role="img"
          aria-label="Abstract illustration of layered documents becoming clear"
        >
          <ellipse
            cx="465"
            cy="385"
            rx="205"
            ry="38"
            fill="#35432b"
            opacity="0.12"
          />
          <circle
            cx="450"
            cy="250"
            r="190"
            fill="none"
            stroke="#eeede8"
            strokeWidth="1"
            opacity="0.5"
          />
          <g transform="translate(310 70) rotate(-12 150 170)">
            <rect
              x="-25"
              y="56"
              width="280"
              height="312"
              rx="3"
              fill="#9ca58f"
            />
            <rect
              x="-12"
              y="35"
              width="280"
              height="312"
              rx="3"
              fill="#eeede8"
            />
            <rect x="4" y="17" width="280" height="312" rx="3" fill="#d5d9cc" />
            <path d="M20 0H235L300 65V312H20Z" fill="#4355f9" />
            <path d="M235 0V65H300" fill="#9daaff" />
            <path
              d="M62 104H244M62 137H244M62 170H200M62 203H244M62 236H165"
              stroke="#e9ecff"
              strokeWidth="8"
            />
            <circle cx="245" cy="271" r="22" fill="#eeede8" />
            <path
              d="m235 271 7 7 15-16"
              fill="none"
              stroke="#4355f9"
              strokeWidth="4"
            />
          </g>
          <path
            d="M190 220h48m-24-24v48M678 325h30m-15-15v30"
            stroke="#4355f9"
            strokeWidth="3"
          />
        </svg>
      ) : project.visual === "terminal" ? (
        <svg
          className="abstract-project-art"
          viewBox="0 0 900 500"
          role="img"
          aria-label="Abstract illustration of code brackets and connected ideas"
        >
          <ellipse
            cx="450"
            cy="392"
            rx="236"
            ry="32"
            fill="#263353"
            opacity="0.16"
          />
          <path d="M170 340 450 430 730 340 450 250Z" fill="#dce0e7" />
          <path
            d="M170 340v18l280 90v-18M450 430l280-90v18l-280 90"
            fill="#8797b3"
          />
          <g fill="none" strokeLinecap="square" strokeLinejoin="miter">
            <path
              d="m340 132-97 109 97 103"
              stroke="#2939b1"
              strokeWidth="45"
              transform="translate(13 16)"
            />
            <path
              d="m340 132-97 109 97 103"
              stroke="#4355f9"
              strokeWidth="45"
            />
            <path
              d="m560 132 97 109-97 103"
              stroke="#2939b1"
              strokeWidth="45"
              transform="translate(13 16)"
            />
            <path
              d="m560 132 97 109-97 103"
              stroke="#4355f9"
              strokeWidth="45"
            />
            <path d="m478 135-56 208" stroke="#eeede8" strokeWidth="31" />
          </g>
          <circle cx="695" cy="112" r="28" fill="#eeede8" />
          <path d="M682 112h26m-13-13v26" stroke="#4355f9" strokeWidth="3" />
          <path d="M187 135h57M204 118v34" stroke="#f0efe8" strokeWidth="2" />
        </svg>
      ) : (
        <div
          className="pavilion-art"
          role="img"
          aria-label="Abstract illustration of an event pavilion with a cobalt canopy"
        >
          <div className="pavilion-grid" />
          <div className="pavilion-shadow" />
          <div className="pavilion-platform" />
          <div className="pavilion-post post-one" />
          <div className="pavilion-post post-two" />
          <div className="pavilion-post post-three" />
          <div className="pavilion-roof" />
          <div className="pavilion-disc disc-one" />
          <div className="pavilion-disc disc-two" />
          <span className="pavilion-glyph">✳</span>
        </div>
      )}
      <span className="art-caption mono">
        CONCEPT ILLUSTRATION /{" "}
        {project.visual === "documents"
          ? "FINDING CLARITY"
          : project.visual === "terminal"
            ? "ROOM TO CREATE"
            : "THE GATHERING SPACE"}
      </span>
    </div>
  );
}
