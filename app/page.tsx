import { LatestComments, SectionHeading, StatCard, ThemeBars, VelocityChart } from "./components";
import { data, easternDayKey, formatDate, formatNumber, getDailyCounts } from "./lib";
import rpmData from "@/data/rpm-comments.json";

export default function Home() {
  const daily = getDailyCounts();
  const todayKey = easternDayKey(data.updatedAt);
  const today = daily.find(d => d.date === todayKey)?.count ?? 0;
  const recentCutoff = new Date(data.updatedAt); recentCutoff.setUTCDate(recentCutoff.getUTCDate()-7);
  const last7 = data.comments.filter(c => new Date(c.postedDate) >= recentCutoff).length;
  const peak = daily.reduce((best, item) => item.count > best.count ? item : best, daily[0] ?? { date: todayKey, count: 0 });
  const deadlineDays = Math.max(0, Math.ceil((new Date(data.docket.commentDeadline).getTime()-new Date(data.updatedAt).getTime())/86400000));

  return <main>
    <section className="hero">
      <div className="hero-copy">
        <div className="eyebrow"><span className="live-dot"/> Three-hour public record monitor</div>
        <h1>The comment record,<br/><span>made legible.</span></h1>
        <p>Track submission velocity and the policy themes shaping CMS’s proposed CY 2027 Physician Fee Schedule.</p>
        <div className="hero-actions"><a className="button primary" href="#activity">Explore activity</a><a className="button secondary" href="/cms-2026-2377-comprehensive-report.pdf">Download report</a><a className="button secondary" href="/cms-2026-2377-evidence-package.zip">Evidence package</a></div>
      </div>
      <aside className="freshness-card"><div><span className="live-dot"/><b>Data current</b></div><strong>{formatDate(data.updatedAt, true)}</strong><p>Next automated check within three hours.</p><div className="freshness-meter"><span/></div><small>Official Regulations.gov API</small></aside>
    </section>

    <section className="stats-grid" aria-label="Docket summary">
      <StatCard label="Posted comments" value={formatNumber(data.comments.length)} detail={`Live census · ${today} posted today`} />
      <StatCard label="Last seven days" value={formatNumber(last7)} detail="Comments posted in rolling window" tone="mint" />
      <StatCard label="Peak posting day" value={formatNumber(peak.count)} detail={formatDate(`${peak.date}T12:00:00Z`)} tone="violet" />
      <StatCard label="RPM / RTM submissions" value={formatNumber(rpmData.comments.length)} detail={`${formatNumber(rpmData.comments.filter(comment => comment.policySpecific).length)} directly address RPM/RTM policy`} tone="amber" />
    </section>

    <section className="rpm-callout" aria-labelledby="rpm-callout-title">
      <div><p>Remote monitoring record</p><h2 id="rpm-callout-title">Every RPM-related submission, linked to its source.</h2><span>The audited census identifies {formatNumber(rpmData.comments.length)} RPM/RTM-related records. Review the complete list, filter direct policy comments, and open each filing on Regulations.gov.</span></div>
      <a className="button primary" href="/rpm-submissions">Explore all {formatNumber(rpmData.comments.length)}</a>
    </section>

    <section className="panel" id="activity">
      <SectionHeading eyebrow="Live record" title="Comment velocity" detail="Daily publicly posted submissions. The line updates after each successful three-hour poll." />
      <VelocityChart values={daily} />
    </section>

    <div className="two-column">
      <section className="panel themes-panel">
        <SectionHeading eyebrow="Complete census analysis" title="Themes in the record" detail={`Multi-label coding of all ${formatNumber(data.analysis.detailRecords)} detailed comments and ${formatNumber(data.analysis.attachmentsAnalyzed)} attachments reachable at the analysis snapshot.`} />
        <ThemeBars themes={data.themes} />
        <div className="note"><b>Snapshot versus live record</b><p>Theme and identity analysis covers 100% of the 1,595-record August 3 census. Live totals continue updating every three hours and may later exceed the analyzed snapshot.</p></div>
      </section>
      <section className="panel latest-panel">
        <SectionHeading eyebrow="Recently changed" title="Latest public records" detail="Newest records by last-modified timestamp." />
        <LatestComments />
      </section>
    </div>

    <section className="method-band">
      <div><p>Method & provenance</p><h2>Built for an auditable public record.</h2></div>
      <div className="method-grid"><article><span>01</span><b>Official source</b><p>Record IDs and dates come directly from the Regulations.gov v4 API.</p></article><article><span>02</span><b>Incremental refresh</b><p>GitHub Actions merges records modified since the last run every three hours.</p></article><article><span>03</span><b>Versioned history</b><p>Every data change is committed, preserving an inspectable update trail.</p></article></div>
    </section>
    <p className="deadline-note">The public comment window closes {formatDate(data.docket.commentDeadline)} ({deadlineDays} days from the latest dashboard refresh).</p>
  </main>;
}
