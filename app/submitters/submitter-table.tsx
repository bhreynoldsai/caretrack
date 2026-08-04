"use client";

import { useMemo, useState } from "react";
import type { Submitter } from "../lib";

export default function SubmitterTable({ rows }: { rows: Submitter[] }) {
  const [query, setQuery] = useState("");
  const visible = useMemo(() => rows.filter(row => `${row.name} ${row.type} ${row.commentIds.join(" ")}`.toLowerCase().includes(query.toLowerCase())), [query, rows]);
  return <section className="panel submitter-panel">
    <div className="filter-row"><label htmlFor="submitter-search">Filter submitters</label><input id="submitter-search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Name, organization, or comment ID"/><span>{visible.length} results</span></div>
    <div className="table-shell"><table><thead><tr><th>Rank</th><th>Submitter</th><th>Type</th><th>Observed</th><th>Comment ID(s)</th></tr></thead><tbody>{visible.map(row => <tr key={`${row.rank}-${row.name}`}><td>{row.rank}</td><td><b>{row.name}</b></td><td><span className="type-pill">{row.type}</span></td><td>{row.observedCount}</td><td>{row.commentIds.map(id => <a className="id-link" key={id} href={`https://www.regulations.gov/comment/${id}`} target="_blank" rel="noreferrer">{id} ↗</a>)}</td></tr>)}</tbody></table></div>
  </section>;
}
