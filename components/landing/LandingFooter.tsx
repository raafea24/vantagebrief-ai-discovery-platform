import { ArrowUp } from "lucide-react";
import Link from "next/link";
import { BrandLogo } from "@/components/landing/BrandLogo";

const exploreLinks = [
  { href: "/#top", label: "Overview" },
  { href: "/#about", label: "About" },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/#use-cases", label: "Use Cases" },
];

const productLinks = [
  { href: "/#capabilities", label: "Capabilities" },
  { href: "/workspace", label: "Discovery Workspace" },
];

const audienceItems = [
  "Business teams",
  "Consultants",
  "Technology partners",
];

const policyItems = ["Privacy", "Terms", "Data handling"];

export function LandingFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="landing-footer">
      <div className="landing-container">
        <div className="landing-footer__grid">
          <div className="landing-footer__brand">
            <BrandLogo />
            <p>Turn business conversations into decision-ready briefs.</p>
          </div>

          <FooterLinks heading="Explore" label="Explore VantageBrief" links={exploreLinks} />

          <nav className="landing-footer__group" aria-label="Product">
            <h2>Product</h2>
            <ul>
              {productLinks.map((link) => (
                <li key={link.href}><Link href={link.href}>{link.label}</Link></li>
              ))}
              <li>
                <Link className="landing-footer__back-to-top" href="/#top">
                  Back to top <ArrowUp aria-hidden="true" size={15} strokeWidth={1.8} />
                </Link>
              </li>
            </ul>
          </nav>

          <FooterTextGroup heading="Designed for" items={audienceItems} />
          <FooterTextGroup heading="Policies" items={policyItems} />
        </div>

        <div className="landing-footer__bottom">
          <p>{"\u00A9"} {currentYear} VantageBrief. All rights reserved.</p>
          <p>Built for better business conversations.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterLinks({
  heading,
  label,
  links,
}: Readonly<{
  heading: string;
  label: string;
  links: ReadonlyArray<{ href: string; label: string }>;
}>) {
  return (
    <nav className="landing-footer__group" aria-label={label}>
      <h2>{heading}</h2>
      <ul>
        {links.map((link) => (
          <li key={link.href}><Link href={link.href}>{link.label}</Link></li>
        ))}
      </ul>
    </nav>
  );
}

function FooterTextGroup({
  heading,
  items,
}: Readonly<{ heading: string; items: ReadonlyArray<string> }>) {
  return (
    <div className="landing-footer__group">
      <h2>{heading}</h2>
      <ul>
        {items.map((item) => (
          <li key={item}><span className="landing-footer__text-item">{item}</span></li>
        ))}
      </ul>
    </div>
  );
}
