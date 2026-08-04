import Link from "next/link";
import { data, formatNumber } from "../lib";
import SubmitterTable from "./submitter-table";

export const metadata = { title: "Top submitters | CMS Comment Monitor" };

export default function SubmittersPage() {
  return <main className="inner-page">
    <div className="page-intro"><p className="eyebrow-text">Sampled identity analysis</p><h1>Top 100 named submitters</h1><p>Ranked by observed record count in the {formatNumber(data.sample.detailRecords)}-comment detail sample, then alphabetically. Anonymous or withheld records are excluded.</p><div className="callout"><b>Interpret carefully</b><span>Most named submitters appeared once, so ranks 3–100 are alphabetical tie-breaks—not a measure of influence or full-docket frequency.</span></div></div>
    <SubmitterTable rows={data.topSubmitters} />
    <div className="page-actions"><a className="button primary" href="/top-100-submitters.csv">Download CSV</a><Link className="button secondary" href="/">Back to overview</Link></div>
  </main>;
}
