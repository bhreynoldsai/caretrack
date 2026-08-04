import Link from "next/link";
import rpmData from "@/data/rpm-comments.json";
import { formatDate, formatNumber, type RpmComment } from "../lib";
import RpmTable from "./rpm-table";

export const metadata = {
  title: "RPM submissions | CMS Comment Monitor",
  description: "Tally and source links for every RPM/RTM-related submission identified in the CMS-2026-2377 comment census.",
};

export default function RpmSubmissionsPage() {
  const rows = rpmData.comments as RpmComment[];
  const direct = rows.filter(row => row.policySpecific).length;
  const organizations = rows.filter(row => row.submitterType === "Organization").length;
  const individuals = rows.filter(row => row.submitterType === "Individual").length;

  return <main className="inner-page">
    <div className="page-intro rpm-intro"><p className="eyebrow-text">Complete remote monitoring index</p><h1>RPM-related submissions</h1><p>A source-linked tally of every public comment identified as discussing remote physiologic monitoring, remote patient monitoring, or remote therapeutic monitoring in the complete analysis census.</p></div>
    <section className="rpm-summary" aria-label="RPM submission tally">
      <article><span>All related submissions</span><strong>{formatNumber(rows.length)}</strong><small>RPM, RTM, and related remote monitoring</small></article>
      <article><span>Direct policy comments</span><strong>{formatNumber(direct)}</strong><small>Address the proposed RPM/RTM staffing policy</small></article>
      <article><span>Named organizations</span><strong>{formatNumber(organizations)}</strong><small>Public records submitted as organizations</small></article>
      <article><span>Named individuals</span><strong>{formatNumber(individuals)}</strong><small>Public records submitted as individuals</small></article>
    </section>
    <div className="callout"><b>Analysis snapshot</b><span>Coverage reflects the {formatDate(rpmData.analyzedAt, true)} census. Coding is intentionally inclusive: {rpmData.definition} Every listed ID links to the official public record.</span></div>
    <RpmTable rows={rows} />
    <div className="page-actions"><a className="button primary" href="/rpm-submissions-full-census.csv">Download RPM index (CSV)</a><Link className="button secondary" href="/">Back to overview</Link></div>
  </main>;
}
