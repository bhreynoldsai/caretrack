#!/usr/bin/env python3
"""Incrementally merge new Regulations.gov comment summaries into dashboard.json."""

import argparse
import json
import os
import time
from datetime import datetime, timedelta, timezone
from pathlib import Path
from urllib.error import HTTPError
from urllib.parse import urlencode
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[1]
DATA_PATH = ROOT / "data" / "dashboard.json"
API = "https://api.regulations.gov/v4/comments"

def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true", help="Validate the local snapshot without network access")
    return parser.parse_args()

def fetch_json(url: str, key: str, attempts: int = 4):
    request = Request(url, headers={"Accept": "application/vnd.api+json", "User-Agent": "cms-comments-dashboard/1.0"})
    for attempt in range(attempts):
        try:
            with urlopen(request, timeout=45) as response:
                return json.load(response)
        except HTTPError as error:
            if error.code != 429 or attempt == attempts - 1:
                raise
            delay = int(error.headers.get("Retry-After", "10"))
            time.sleep(min(delay + attempt * 3, 45))

def validate(data):
    required = {"docket", "updatedAt", "lastModifiedAt", "comments", "themes", "topSubmitters", "sample"}
    missing = required - set(data)
    if missing:
        raise ValueError(f"Missing keys: {sorted(missing)}")
    ids = [item["id"] for item in data["comments"]]
    if len(ids) != len(set(ids)):
        raise ValueError("Duplicate comment IDs in snapshot")
    if not data["docket"].get("objectId"):
        raise ValueError("Missing docket objectId")
    return data

def main():
    args = parse_args()
    data = validate(json.loads(DATA_PATH.read_text()))
    if args.check:
        print(f"Snapshot valid: {len(data['comments'])} unique comments")
        return

    api_key = os.environ.get("REGULATIONS_API_KEY") or "DEMO_KEY"
    last = datetime.fromisoformat(data["lastModifiedAt"].replace("Z", "+00:00"))
    since = (last - timedelta(hours=6)).astimezone(timezone.utc).strftime("%Y-%m-%d %H:%M:%S")
    page = 1
    incoming = []
    while True:
        query = urlencode({
            "filter[commentOnId]": data["docket"]["objectId"],
            "filter[lastModifiedDate][ge]": since,
            "page[size]": 250,
            "page[number]": page,
            "sort": "lastModifiedDate,documentId",
            "api_key": api_key,
        })
        payload = fetch_json(f"{API}?{query}", api_key)
        incoming.extend(payload.get("data", []))
        if not payload.get("meta", {}).get("hasNextPage"):
            break
        page += 1

    merged = {item["id"]: item for item in data["comments"]}
    for item in incoming:
        attrs = item.get("attributes", {})
        merged[item["id"]] = {
            "id": item["id"],
            "postedDate": attrs.get("postedDate") or "",
            "lastModifiedDate": attrs.get("lastModifiedDate") or attrs.get("modifyDate") or "",
            "title": attrs.get("title") or "Comment on CMS-2026-2377-0002",
            "withdrawn": bool(attrs.get("withdrawn")),
        }

    comments = sorted(merged.values(), key=lambda item: (item["postedDate"], item["id"]))
    last_modified_at = max((item["lastModifiedDate"] for item in comments if item["lastModifiedDate"]), default=data["lastModifiedAt"])
    if comments == data["comments"] and last_modified_at == data["lastModifiedAt"]:
        print(f"Checked {len(incoming)} API records; no public-record changes")
        return

    data["comments"] = comments
    data["updatedAt"] = datetime.now(timezone.utc).isoformat(timespec="seconds").replace("+00:00", "Z")
    data["lastModifiedAt"] = last_modified_at
    validate(data)
    DATA_PATH.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n")
    print(f"Merged {len(incoming)} API records; snapshot now has {len(comments)} comments")

if __name__ == "__main__":
    main()
