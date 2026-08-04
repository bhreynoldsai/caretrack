import Link from "next/link";
import { data, formatDate, formatNumber, Theme } from "./lib";

export function StatCard({ label, value, detail, tone = "blue" }: { label: string; value: string; detail: string; tone?: "blue" | "mint" | "amber" | "violet" }) {
  return <article className={`stat-card tone-${tone}`}><p>{label}</p><strong>{value}</strong><span>{detail}</span></article>;
}

export function VelocityChart({ values }: { values: { date: string; count: number }[] }) {
  const width = 920, height = 310, padX = 48, padTop = 24, padBottom = 54;
  const max = Math.max(...values.map(v => v.count), 1);
  const x = (i: number) => padX + (i * (width - padX * 2)) / Math.max(values.length - 1, 1);
  const y = (v: number) => padTop + (height - padTop - padBottom) * (1 - v / max);
  const line = values.map((v, i) => `${x(i)},${y(v.count)}`).join(" ");
  const area = `${padX},${height - padBottom} ${line} ${x(values.length - 1)},${height - padBottom}`;
  return (
    <div className="chart-wrap" role="img" aria-label="Daily posted comment volume line chart">
      <svg viewBox={`0 0 ${width} ${height}`}>
        <defs><linearGradient id="area" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#68a6ff" stopOpacity=".4"/><stop offset="1" stopColor="#68a6ff" stopOpacity="0"/></linearGradient></defs>
        {[0, .25, .5, .75, 1].map(frac => <g key={frac}><line x1={padX} x2={width-padX} y1={y(max*frac)} y2={y(max*frac)} className="grid-line"/><text x={padX-12} y={y(max*frac)+5} textAnchor="end">{Math.round(max*frac)}</text></g>)}
        <polygon points={area} fill="url(#area)" />
        <polyline points={line} className="trend-line" />
        {values.map((v,i) => <g key={v.date}><circle cx={x(i)} cy={y(v.count)} r="5"/><text x={x(i)} y={height-22} textAnchor="middle">{new Date(`${v.date}T12:00:00Z`).toLocaleDateString("en-US", { month:"short", day:"numeric" })}</text></g>)}
      </svg>
    </div>
  );
}

export function ThemeBars({ themes }: { themes: Theme[] }) {
  const max = Math.max(...themes.map(t => t.samplePercent));
  return <div className="theme-list">{themes.slice(0, 9).map((theme, index) => <div className="theme-row" key={theme.name}>
    <div className="theme-label"><span>{String(index+1).padStart(2,"0")}</span><b>{theme.name}</b><em>{theme.samplePercent.toFixed(1)}%</em></div>
    <div className="bar-track"><span style={{ width: `${(theme.samplePercent/max)*100}%` }} /></div>
    <small>Estimated {formatNumber(theme.estimatedCount)} records · 95% range {formatNumber(theme.low)}–{formatNumber(theme.high)}</small>
  </div>)}</div>;
}

export function LatestComments() {
  const latest = [...data.comments].sort((a,b) => b.lastModifiedDate.localeCompare(a.lastModifiedDate)).slice(0, 10);
  return <div className="table-shell"><table><thead><tr><th>Comment ID</th><th>Posted</th><th>Status</th><th><span className="sr-only">Open</span></th></tr></thead><tbody>
    {latest.map(comment => <tr key={comment.id}><td><b>{comment.id}</b></td><td>{formatDate(comment.postedDate)}</td><td><span className={`status ${comment.withdrawn ? "withdrawn" : "posted"}`}>{comment.withdrawn ? "Withdrawn" : "Posted"}</span></td><td><a className="row-link" href={`https://www.regulations.gov/comment/${comment.id}`} target="_blank" rel="noreferrer" aria-label={`Open ${comment.id}`}>↗</a></td></tr>)}
  </tbody></table></div>;
}

export function SectionHeading({ eyebrow, title, detail, action }: { eyebrow: string; title: string; detail: string; action?: { href: string; label: string } }) {
  return <div className="section-heading"><div><p>{eyebrow}</p><h2>{title}</h2><span>{detail}</span></div>{action && <Link className="button secondary" href={action.href}>{action.label}</Link>}</div>;
}
