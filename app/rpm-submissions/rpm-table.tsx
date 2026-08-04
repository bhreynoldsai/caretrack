"use client";

import { useMemo, useState } from "react";
import type { RpmComment } from "../lib";

type Scope = "all" | "direct" | "adjacent";

export default function RpmTable({ rows }: { rows: RpmComment[] }) {
  const [query, setQuery] = useState("");
  const [scope, setScope] = useState<Scope>("all");
  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return rows.filter(row => {
      const inScope = scope === "all" || (scope === "direct" ? row.policySpecific : !row.policySpecific);
      const haystack = `${row.id} ${row.submitter} ${row.organization} ${row.category} ${row.state} ${row.stance} ${row.subthemes.join(" ")} ${row.excerpt}`.toLowerCase();
      return inScope && (!needle || haystack.includes(needle));
    });
  }, [query, rows, scope]);

  return <section className="panel rpm-panel">
    <div className="rpm-filter-row">
      <div><label htmlFor="rpm-search">Search submissions</label><input id="rpm-search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Submitter, organization, state, topic, or comment ID" /></div>
      <div className="scope-tabs" role="group" aria-label="Submission scope">
        <button className={scope === "all" ? "active" : ""} onClick={() => setScope("all")}>All</button>
        <button className={scope === "direct" ? "active" : ""} onClick={() => setScope("direct")}>Direct policy</button>
        <button className={scope === "adjacent" ? "active" : ""} onClick={() => setScope("adjacent")}>Adjacent</button>
      </div>
      <span aria-live="polite">{visible.length} submissions</span>
    </div>
    <div className="rpm-card-list">{visible.map(row => <article className="rpm-record" key={row.id}>
      <div className="rpm-record-head"><div><a href={row.sourceUrl} target="_blank" rel="noreferrer">{row.id} ↗</a><span>{row.postedDate}</span></div><span className={`policy-pill ${row.policySpecific ? "direct" : "adjacent"}`}>{row.policySpecific ? "Direct RPM/RTM policy" : "Related discussion"}</span></div>
      <div className="rpm-record-body"><div><h3>{row.submitter}</h3><p>{row.organization || row.submitterType} · {row.state}</p></div><span className="stance-label">{row.stance}</span></div>
      <p className="rpm-excerpt">{row.excerpt}</p>
      <div className="rpm-tags">{row.subthemes.slice(0, 5).map(theme => <span key={theme}>{theme}</span>)}</div>
      <a className="source-button" href={row.sourceUrl} target="_blank" rel="noreferrer" aria-label={`Open ${row.id} on Regulations.gov`}>View full submission on Regulations.gov ↗</a>
    </article>)}</div>
    {visible.length === 0 && <p className="empty-state">No RPM submissions match those filters.</p>}
  </section>;
}
