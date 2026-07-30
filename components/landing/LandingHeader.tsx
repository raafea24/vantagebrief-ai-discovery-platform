import { ArrowUpRight, Menu } from "lucide-react";
import Link from "next/link";

const navigationLinks = [
  { href: "#discovery-preview", label: "How It Works" },
  { href: "#capabilities", label: "Use Cases" },
  { href: "#about", label: "About" },
];

export function LandingHeader() {
  return (
    <header className="landing-header">
      <div className="landing-container landing-header__inner">
        <Link className="wordmark" href="/" aria-label="VantageBrief home">
          <span className="wordmark__mark" aria-hidden="true">
            V
          </span>
          <span>VantageBrief</span>
        </Link>

        <nav className="landing-nav" aria-label="Primary navigation">
          {navigationLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>

        <Link className="landing-header__cta" href="/workspace">
          Start a Brief
          <ArrowUpRight aria-hidden="true" size={17} strokeWidth={1.8} />
        </Link>

        <details className="mobile-navigation">
          <summary aria-label="Open navigation">
            <Menu aria-hidden="true" size={22} strokeWidth={1.7} />
          </summary>
          <nav aria-label="Mobile navigation">
            {navigationLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
            <Link href="/workspace">Start a Brief</Link>
          </nav>
        </details>
      </div>
    </header>
  );
}
