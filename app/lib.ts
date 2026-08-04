import dashboardData from "@/data/dashboard.json";

export type CommentRecord = {
  id: string;
  postedDate: string;
  lastModifiedDate: string;
  title: string;
  withdrawn: boolean;
};

export type Theme = {
  name: string;
  count: number;
  percent: number;
};

export type Submitter = {
  rank: number;
  name: string;
  type: string;
  observedCount: number;
  commentIds: string[];
};

export type RpmComment = {
  id: string;
  postedDate: string;
  submitter: string;
  submitterType: string;
  organization: string;
  category: string;
  state: string;
  wordCount: number;
  policySpecific: boolean;
  stance: string;
  subthemes: string[];
  excerpt: string;
  sourceUrl: string;
};

export const data = dashboardData as {
  docket: {
    id: string;
    documentId: string;
    title: string;
    commentDeadline: string;
    sourceUrl: string;
  };
  updatedAt: string;
  lastModifiedAt: string;
  comments: CommentRecord[];
  themes: Theme[];
  topSubmitters: Submitter[];
  analysis: {
    detailRecords: number;
    censusAtAnalysis: number;
    coveragePercent: number;
    analyzedAt: string;
    attachmentsAnalyzed: number;
    totalWords: number;
    duplicateClusters: number;
    rpmComments: number;
    rpmPolicySpecific: number;
    rpmOpposeOrNarrow: number;
    attachmentNote: string;
  };
};

export function dayKey(iso: string) {
  return iso.slice(0, 10);
}

export function easternDayKey(iso: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date(iso));
  const get = (type: string) => parts.find(part => part.type === type)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")}`;
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

export function formatDate(iso: string, withTime = false) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    ...(withTime ? { hour: "numeric", minute: "2-digit", timeZoneName: "short" } : {}),
  }).format(new Date(iso));
}

export function getDailyCounts(comments = data.comments) {
  const counts = new Map<string, number>();
  for (const comment of comments) {
    const key = dayKey(comment.postedDate);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return [...counts.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([date, count]) => ({ date, count }));
}
