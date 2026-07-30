import Link from "next/link";

export function BrandLogo() {
  return (
    <Link className="wordmark" href="/#top" aria-label="VantageBrief home">
      <span className="wordmark__mark" aria-hidden="true">
        V
      </span>
      <span>VantageBrief</span>
    </Link>
  );
}
