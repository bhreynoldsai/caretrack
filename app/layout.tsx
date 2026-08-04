import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "CMS Comment Monitor | CY 2027 PFS",
  description: "A three-hour monitor for public comments on CMS-2026-2377-0002.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <Link className="brand" href="/" aria-label="CMS Comment Monitor home">
            <span className="brand-mark" aria-hidden="true">C</span>
            <span><b>Comment Monitor</b><small>CMS-2026-2377</small></span>
          </Link>
          <nav aria-label="Primary navigation">
            <Link href="/">Overview</Link>
            <Link href="/submitters">Submitters</Link>
            <a href="https://www.regulations.gov/document/CMS-2026-2377-0002/comment" target="_blank" rel="noreferrer">Live docket ↗</a>
          </nav>
        </header>
        {children}
        <footer>
          <p>Independent public-record monitor. Not affiliated with CMS or Regulations.gov.</p>
          <p>Data refreshes from the official Regulations.gov API every three hours.</p>
        </footer>
      </body>
    </html>
  );
}
