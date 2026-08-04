#!/usr/bin/env python3
"""Build the public RPM submission index from the audited census exhibit."""

import argparse
import csv
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("source", type=Path, help="Audited rpm_rtm_comments.csv exhibit")
    args = parser.parse_args()

    with args.source.open(newline="", encoding="utf-8-sig") as handle:
        source_rows = list(csv.DictReader(handle))

    rows = []
    for source in source_rows:
        comment_id = source["id"]
        rows.append({
            "id": comment_id,
            "postedDate": source["postedDate"],
            "submitter": source["submitter"],
            "submitterType": source["submitterType"],
            "organization": source["organization"],
            "category": source["category"],
            "state": source["state"],
            "wordCount": int(source["wordCount"]),
            "policySpecific": source["policySpecific"].lower() == "true",
            "stance": source["stance"],
            "subthemes": [item.strip() for item in source["subthemes"].split(";") if item.strip()],
            "excerpt": source["excerpt"],
            "sourceUrl": f"https://www.regulations.gov/comment/{comment_id}",
        })

    output = {
        "analyzedAt": "2026-08-03T20:13:00-04:00",
        "definition": "Records coded as related to remote physiologic monitoring (RPM), remote patient monitoring, or remote therapeutic monitoring (RTM), including direct policy comments and adjacent remote-monitoring discussion.",
        "comments": rows,
    }
    (ROOT / "data" / "rpm-comments.json").write_text(json.dumps(output, indent=2, ensure_ascii=False) + "\n")

    fieldnames = [
        "id", "postedDate", "submitter", "submitterType", "organization", "category", "state",
        "wordCount", "policySpecific", "stance", "subthemes", "sourceUrl",
    ]
    with (ROOT / "public" / "rpm-submissions-full-census.csv").open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames)
        writer.writeheader()
        for row in rows:
            export = {key: row[key] for key in fieldnames}
            export["policySpecific"] = "Yes" if row["policySpecific"] else "No"
            export["subthemes"] = "; ".join(row["subthemes"])
            writer.writerow(export)

    print(f"Built RPM index: {len(rows)} submissions, {sum(row['policySpecific'] for row in rows)} direct policy comments")


if __name__ == "__main__":
    main()
