import type { Metadata } from "next";
import localFont from "next/font/local";
import { Header } from "@/components/header";
import "./globals.css";

const manrope = localFont({
  src: "../public/fonts/manrope-variable.ttf",
  variable: "--font-manrope",
  display: "swap",
  weight: "200 800",
});
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl || "http://localhost:3000"),
  title: {
    default: "Sukhmeet Singh — Software, systems & AI evaluation",
    template: "%s — Sukhmeet Singh",
  },
  description:
    "The personal project workshop of Sukhmeet Singh. Software development, AI evaluation, and a few things built along the way. Based in Delhi, India.",
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Sukhmeet Singh",
    title: "Sukhmeet Singh — A personal project workshop",
    description:
      "Software, systems & AI evaluation. Step inside and explore the work.",
  },
  twitter: { card: "summary_large_image" },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={manrope.variable} data-scroll-behavior="smooth">
      <body id="top">
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Header />
        {children}
      </body>
    </html>
  );
}
