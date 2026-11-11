"use client";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);
export function Motion({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-hero]", {
          y: 35,
          duration: 1,
          stagger: 0.09,
          ease: "power3.out",
          clearProps: "transform",
        });
        gsap.utils
          .toArray<HTMLElement>("[data-reveal]", root.current)
          .forEach((element) => {
            gsap.from(element, {
              y: 40,
              duration: 0.85,
              ease: "power2.out",
              clearProps: "transform",
              scrollTrigger: { trigger: element, start: "top 92%", once: true },
            });
          });
      });
      return () => media.revert();
    },
    { scope: root },
  );
  return <div ref={root}>{children}</div>;
}
