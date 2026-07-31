"use client";

import { ArrowUpRight, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { BrandLogo } from "@/components/landing/BrandLogo";

const navigationLinks = [
  { href: "/#top", label: "Overview" },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/#use-cases", label: "Use Cases" },
];

export function LandingHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

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
          Start Discovery
          <ArrowUpRight aria-hidden="true" size={17} strokeWidth={1.8} />
        </Link>

        <div className="mobile-navigation">
          <button
            type="button"
            aria-controls="mobile-navigation-menu"
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? "Close navigation" : "Open navigation"}
            onClick={() => setIsMenuOpen((current) => !current)}
          >
            {isMenuOpen ? (
              <X aria-hidden="true" size={22} strokeWidth={1.7} />
            ) : (
              <Menu aria-hidden="true" size={22} strokeWidth={1.7} />
            )}
          </button>
          {isMenuOpen ? (
            <nav id="mobile-navigation-menu" aria-label="Mobile navigation">
              {navigationLinks.map((link) => (
                <Link key={link.href} href={link.href} onClick={closeMenu}>
                  {link.label}
                </Link>
              ))}
              <Link href="/workspace" onClick={closeMenu}>Start Discovery</Link>
            </nav>
          ) : null}
        </div>
      </div>
    </header>
  );
}
