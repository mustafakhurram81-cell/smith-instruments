#!/usr/bin/env python3
"""Read a chapter catalogue's titles from its old printed headers, into chapters/<NN>.json for build.py.

The old pages carry their titles as drawn shapes, not text, so the header strip of each page is rendered and read
with the Mac's own text recognition (ocr.swift, built once into ./ocr). Each inner page's header holds the title in
English, German, Portuguese and Spanish, one under the other; the old logo, the chapter name and number are left out.
A page that doesn't come out as exactly four lines is listed under "check" for a person to look at.

    swiftc -O catalogue-redesign/ocr.swift -o catalogue-redesign/ocr      # once
    python3 catalogue-redesign/extract.py 02                               # -> chapters/02.json
"""
import json, re, subprocess, sys
from pathlib import Path

import fitz

ROOT = Path(__file__).resolve().parent
REPO = ROOT.parent
HEADER = fitz.Rect(0, 0, 630, 125)
# What the old header shows besides the titles: the old company name and its tagline.
OLD_BRAND = re.compile(r"SMITH|SURG|UK\s*LIMITED|LIMITED", re.I)


def ocr(png):
    out = subprocess.run([str(ROOT / "ocr"), str(png)], capture_output=True, text=True, check=True).stdout
    rows = []
    for line in out.splitlines():
        y, x, h, text = line.split("\t", 3)
        rows.append((float(y), float(x), float(h), text.strip()))
    return rows


def slug_of(chapter, title):
    words = re.sub(r"[^a-z0-9]+", "-", title.lower()).strip("-")
    return f"{chapter}-{words}" if chapter else words


def titles_on(page, work, i, chapter_title):
    png = work / f"header-{i:02d}.png"
    page.get_pixmap(dpi=200, clip=HEADER).save(png)
    lines = []
    for y, x, h, text in ocr(png):
        letters = [c for c in text if c.isalpha()]
        # The titles are in mixed case; everything else in the header is in capitals (the chapter's name, the old
        # "SMITH SURGICAL UK LIMITED" logo, which the reader garbles) or a bare number.
        garbled = any(not ("a" <= c.lower() <= "z" or "À" <= c <= "ɏ") for c in letters)  # Cyrillic etc.
        mostly_capitals = sum(c.isupper() for c in letters) > 0.6 * len(letters)
        if not letters or garbled or mostly_capitals or OLD_BRAND.search(text):
            continue
        lines.append((y, x, text))
    lines.sort()
    return [t for _, _, t in lines]


def main(chapter):
    cats = json.loads((REPO / "lib/catalog/catalogues.json").read_text())
    cat = next(c for c in cats if (c.get("chapter") or "") == chapter)
    slug = slug_of(chapter, cat["title"])
    work = ROOT / "work" / slug
    work.mkdir(parents=True, exist_ok=True)
    src_path = work / "source.pdf"
    if not src_path.exists():
        subprocess.run(["curl", "-sfL", "-o", str(src_path), cat["pdf_url"]], check=True)
    src = fitz.open(src_path)

    pages, check = [], []
    for i in range(1, src.page_count):
        t = titles_on(src[i], work, i, cat["title"])
        if len(t) != 4:
            check.append({"page": i, "read": t})
            t = (t + ["", "", "", ""])[:4]
        pages.append(t)

    # The old cover prints the chapter's name, then its German, Portuguese and Spanish, one under the other.
    cover_png = work / "cover.png"
    src[0].get_pixmap(dpi=110).save(cover_png)
    names = [t for y, x, h, t in ocr(cover_png)
             if 0.18 < y < 0.42 and not re.match(r"(?i)page\b", t) and any(c.isalpha() for c in t) and len(t) > 1]
    translations = names[1:4] if len(names) == 4 else []
    if not translations:
        check.append({"page": 0, "read": names})

    out = {"chapter": chapter, "title": cat["title"], "translations": translations, "source": cat["pdf_url"], "pages": pages}
    if check:
        out["check"] = check
    dest = ROOT / "chapters" / f"{chapter}.json"
    dest.write_text(json.dumps(out, ensure_ascii=False, indent=1))
    print(f"{dest.name}: {len(pages)} pages, {len(check)} to check")


if __name__ == "__main__":
    main(sys.argv[1])
