"use client";
import { ArrowUp, ArrowUpRight, Check, Copy } from "lucide-react";
import { useState } from "react";
import { profile } from "@/lib/content";

export function Contact() {
  const [status, setStatus] = useState("");
  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email);
      setStatus("Email copied");
    } catch {
      setStatus("Copy unavailable. Select the email address to copy it.");
    }
  }
  return (
    <footer id="contact" tabIndex={-1} className="contact-section section-pad">
      <div className="section-kicker">
        <span className="mono">04 / GET IN TOUCH</span>
        <span className="contact-note">Have something in mind?</span>
      </div>
      <a className="contact-title" href={`mailto:${profile.email}`}>
        <span>
          Let’s build
          <br />
          something.
        </span>
        <span className="contact-arrow">
          <ArrowUpRight strokeWidth={1} />
        </span>
      </a>
      <div className="contact-actions">
        <a className="email-link" href={`mailto:${profile.email}`}>
          {profile.email}
        </a>
        <button
          className="copy-button"
          aria-label="Copy email address"
          onClick={copyEmail}
        >
          {status === "Email copied" ? <Check size={16} /> : <Copy size={16} />}
          <span>Copy email</span>
        </button>
        <span className="copy-status" role="status" aria-live="polite">
          {status}
        </span>
      </div>
      <div className="footer-bottom">
        <span>© {profile.graduation} Sukhmeet Singh</span>
        <div>
          <a href={profile.github} target="_blank" rel="noreferrer">
            GitHub <ArrowUpRight size={14} />
          </a>
          <a href={profile.linkedin} target="_blank" rel="noreferrer">
            LinkedIn <ArrowUpRight size={14} />
          </a>
        </div>
        <a href="#top">
          Back to top <ArrowUp size={15} />
        </a>
      </div>
    </footer>
  );
}
