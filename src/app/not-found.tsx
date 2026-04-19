import Link from "next/link";

export default function NotFound() {
  return (
    <section className="hero">
      <div className="container" style={{ textAlign: "center", padding: "100px 20px" }}>
        <div className="hero-tag">404</div>
        <h1>Page Not Found</h1>
        <p className="hero-sub">
          This page doesn't exist. Head back home or explore delivery areas.
        </p>
        <div className="btn-group" style={{ justifyContent: "center" }}>
          <Link href="/" className="btn-primary">
            Back to Home
          </Link>
        </div>
      </div>
    </section>
  );
}
