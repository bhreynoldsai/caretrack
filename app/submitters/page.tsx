import Link from "next/link";
import { data, formatNumber } from "../lib";
import SubmitterTable from "./submitter-table";

export const metadata = { title: "Top submitters | CMS Comment Monitor" };

export default function SubmittersPage() {
  return <main className="inner-page">
    <div className="page-intro"><p className="eyebrow-text">Complete census identity analysis</p><h1>Top 100 named submitters</h1><p>Ranked by observed record count across all {formatNumber(data.analysis.detailRecords)} detailed comments in the analysis census, then alphabetically. Anonymous or withheld records are excluded.</p><div className="callout"><b>Interpret carefully</b><span>Most named submitters appeared once, so tied ranks use alphabetical order. The ranking measures public record count, not influence, endorsement, or substantive quality.</span></div></div>
    <SubmitterTable rows={data.topSubmitters} />
    <div className="page-actions"><a className="button primary" href="/top-100-submitters-full-census.csv">Download CSV</a><Link className="button secondary" href="/">Back to overview</Link></div>
  </main>;
}
