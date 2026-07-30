import { ArrowUpRight, Menu } from "lucide-react";
import Link from "next/link";
import { BrandLogo } from "@/components/landing/BrandLogo";

const navigationLinks = [
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/#use-cases", label: "Use Cases" },
];

export function LandingHeader() {
  return (
    <header className="landing-header">
      <div className="landing-container landing-header__inner">
        <BrandLogo />

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
