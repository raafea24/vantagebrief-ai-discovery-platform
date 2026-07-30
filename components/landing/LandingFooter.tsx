import Link from "next/link";
import { BrandLogo } from "@/components/landing/BrandLogo";

const productLinks = [
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/#use-cases", label: "Use Cases" },
  { href: "/workspace", label: "Start a Brief" },
];

const companyLinks = ["About", "Contact", "Support"];
const legalLinks = ["Privacy Policy", "Terms of Use", "Cookie Policy"];

function DeferredLink({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <span className="footer-deferred-link" role="link" aria-disabled="true">
      <span>{children}</span>
      <small>Coming soon</small>
    </span>
  );
}

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

          <nav className="landing-footer__group" aria-label="Product">
            <h2>Product</h2>
            <ul>
              {productLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="landing-footer__group">
            <h2>Company</h2>
            <ul>
              {companyLinks.map((label) => (
                <li key={label}>
                  <DeferredLink>{label}</DeferredLink>
                </li>
              ))}
              <li>
                <span
                  className="footer-deferred-link footer-deferred-link--social"
                  role="link"
                  aria-disabled="true"
                >
                  <span>
                    <span className="footer-linkedin-mark" aria-hidden="true">
                      in
                    </span>
                    LinkedIn
                  </span>
                  <small>Coming soon</small>
                </span>
              </li>
            </ul>
          </div>

          <div className="landing-footer__group">
            <h2>Legal</h2>
            <ul>
              {legalLinks.map((label) => (
                <li key={label}>
                  <DeferredLink>{label}</DeferredLink>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="landing-footer__bottom">
          <p>© {currentYear} VantageBrief. All rights reserved.</p>
          <p>Built for better business conversations.</p>
        </div>
      </div>
    </footer>
  );
}
