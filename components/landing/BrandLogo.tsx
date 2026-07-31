import Link from "next/link";

export function BrandLogo({ href = "/#top" }: { href?: string }) {
  return (
    <Link className="wordmark" href={href} aria-label="VantageBrief home">
      <span className="wordmark__mark" aria-hidden="true">
        V
      </span>
      <span>VantageBrief</span>
    </Link>
  );
}
