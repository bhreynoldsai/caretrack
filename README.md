# CMS Comment Monitor

A public dashboard for comments submitted to **CMS-2026-2377-0002**, the CY 2027 Medicare Physician Fee Schedule proposed rule.

## What updates automatically

GitHub Actions polls the official Regulations.gov v4 API every three hours. The updater requests only records modified since the prior snapshot, merges by comment ID, and commits `data/dashboard.json` only when something changes. A connected Vercel project then rebuilds from `main`.

- Live census, daily velocity, and latest records: automatically refreshed.
- Theme estimates and top submitters: dated 456-record detail sample from August 3, 2026.
- Audit trail: every public-record change is visible in Git history.

## Local development

```bash
pnpm install
pnpm data:check
pnpm dev
```

## API quota

The workflow falls back to the public `DEMO_KEY`, which is adequate for small incremental polls but has a low hourly quota. For robust operation, create a free Regulations.gov API key and add it to the GitHub repository as an Actions secret named `REGULATIONS_API_KEY`.

## Deployment

The app is designed for Vercel with Git integration. No database or Vercel Cron job is required: the versioned JSON snapshot is the source of truth, and GitHub Actions supplies the three-hour schedule.

## Data limitations

Regulations.gov search responses contain IDs and posting metadata. Comment text, attachments, and public identity fields require rate-limited detail requests. For that reason, live counts are a full census while themes and named submitters remain clearly labeled sample analyses.
