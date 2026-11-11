"use client";

import Link from "next/link";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { profile } from "@/lib/content";

gsap.registerPlugin(useGSAP);
const nav = [
  { label: "Work", href: "/#work" },
  { label: "Explore", href: "/explore" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      if (open && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.from("[data-menu-link]", {
          y: 16,
          opacity: 0,
          duration: 0.35,
          stagger: 0.045,
          ease: "power2.out",
        });
      }
    },
    { scope: root, dependencies: [open] },
  );
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    menu.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    const keydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
      if (event.key !== "Tab") return;
      const links = Array.from(
        menu.current?.querySelectorAll<HTMLAnchorElement>("a") ?? [],
      );
      const first = toggle.current;
      const last = links.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    const resize = () => {
      if (innerWidth > 760) setOpen(false);
    };
    document.addEventListener("keydown", keydown);
    window.addEventListener("resize", resize);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", keydown);
      window.removeEventListener("resize", resize);
    };
  }, [open]);
  function follow(href: string) {
    setOpen(false);
    if (href.startsWith("/#") && location.pathname === "/") {
      requestAnimationFrame(() =>
        document
          .querySelector<HTMLElement>(href.slice(1))
          ?.focus({ preventScroll: true }),
      );
    }
  }
  return (
    <header className={`site-header ${open ? "menu-is-open" : ""}`} ref={root}>
      <Link
        className="wordmark"
        href="/"
        aria-label="Sukhmeet Singh home"
        onClick={() => setOpen(false)}
      >
        <span className="brand-mark" aria-hidden="true">
          ✳
        </span>
        <span>Sukhmeet Singh</span>
      </Link>
      <nav className="desktop-nav" aria-label="Main navigation">
        {nav.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            prefetch={item.label === "Explore" ? false : undefined}
          >
            {item.label}
            {item.label === "Explore" && <span className="nav-dot" />}
          </Link>
        ))}
        <a
          href={profile.resume}
          target="_blank"
          rel="noreferrer"
          className="resume-link"
        >
          Résumé <ArrowUpRight size={14} />
        </a>
      </nav>
      <button
        ref={toggle}
        className="menu-toggle"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen(!open)}
      >
        {open ? <X /> : <Menu />}
      </button>
      {open && (
        <nav
          ref={menu}
          id="mobile-menu"
          className="mobile-nav"
          aria-label="Mobile navigation"
        >
          {nav.map((item, index) => (
            <Link
              data-menu-link
              key={item.label}
              href={item.href}
              prefetch={false}
              onClick={() => follow(item.href)}
            >
              <span className="mono">0{index + 1}</span>
              {item.label}
              <ArrowUpRight />
            </Link>
          ))}
          <a
            data-menu-link
            href={profile.resume}
            target="_blank"
            rel="noreferrer"
            onClick={() => setOpen(false)}
          >
            Résumé <ArrowUpRight />
          </a>
          <p className="mono">Delhi, India · Portfolio 2026</p>
        </nav>
      )}
    </header>
  );
}
