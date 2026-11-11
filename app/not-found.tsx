import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
export default function NotFound() {
  return (
    <main id="main" className="not-found section-pad">
      <span className="mono">404 / UNCHARTED TERRITORY</span>
      <h1>
        Off the map<span>.</span>
      </h1>
      <p>There’s nothing built here yet. Let’s get you back to the workshop.</p>
      <Link href="/" className="button button-dark">
        Back to the portfolio <ArrowUpRight size={18} />
      </Link>
    </main>
  );
}
