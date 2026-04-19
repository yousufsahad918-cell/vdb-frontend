import Link from "next/link";
import { locations } from "@/lib/locations";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-inner">
          <div className="footer-logo">
            VAPE<span style={{color: "var(--orange)", fontSize: "0.5rem", margin: "0 3px"}}>●</span><span style={{color: "var(--orange)"}}>BANGALORE</span>
          </div>
          <div className="footer-links">
            <Link href="/">Home</Link>
            <a
              href="https://wa.me/916282878843?text=Hi%2C%20I%20want%20to%20order%20a%20vape"
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp
            </a>
          </div>
        </div>

        <div
          style={{
            marginTop: "28px",
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
          }}
        >
          {locations.map((loc) => (
            <Link
              key={loc.slug}
              href={`/vape-delivery/${loc.slug}`}
              style={{ fontSize: "0.78rem", color: "var(--muted)" }}
            >
              Vape in {loc.name}
            </Link>
          ))}
        </div>

        <p className="footer-copy">
          © {new Date().getFullYear()} VapeInBangalore.in — Fast, discreet vape
          delivery across Bangalore.
        </p>
      </div>
    </footer>
  );
}
