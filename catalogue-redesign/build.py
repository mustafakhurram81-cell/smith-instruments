#!/usr/bin/env python3
"""Re-skin a chapter catalogue in the current Smith Instruments brand.

Keeps each product page's photos, codes and sizes exactly as printed, and replaces
the cover, the old "Smith Surgical UK" header and the footer, then adds a back cover.

    python3 catalogue-redesign/build.py 01        # -> catalogue-redesign/out/01-scalpels.pdf

Needs: pip install pymupdf playwright && python3 -m playwright install chromium
The chapter's titles live in chapters/<NN>.json (read from the old headers).
"""
import html, json, re, subprocess, sys
from pathlib import Path

import fitz
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent
REPO = ROOT.parent
W, H = 630, 810                    # page size of the printed chapters, in points
CONTENT = fitz.Rect(1, 107.5, W - 1, 754)  # 1pt in from each side, so the old page edge never shows as a hairline; where the products sit: under the old header line (to 106pt), above its page number (756pt); some reach 110pt and 753pt

ORANGE, GREY, INK, MUTED, LINE = "#FE5102", "#585C5F", "#2B2D2F", "#8A8D90", "#E4E4E7"
ADDRESS = "13251 Overcup Oak Ct, Apt 201, Herndon, VA 20171, USA"
EDITION = "2026 Edition"


def logo_svg(white=False, mark_only=False):
    svg = (REPO / "letterhead/smith-logo.svg").read_text()
    if white:
        svg = svg.replace('fill="#585C5F"', 'fill="#FFFFFF"')
    if mark_only:
        svg = re.sub(r'viewBox="[^"]+"', 'viewBox="37.5 50.8 253 250.8"', svg, count=1)
    return svg


def esc(s):
    return html.escape(s)


CSS = f"""
@page {{ size: {W}pt {H}pt; margin: 0; }}
* {{ box-sizing: border-box; margin: 0; padding: 0; }}
body {{ font-family: Inter, "Helvetica Neue", Arial, sans-serif; color: {INK}; -webkit-font-smoothing: antialiased; }}
.page {{ position: relative; width: {W}pt; height: {H}pt; overflow: hidden; page-break-after: always; background: #fff; }}
.abs {{ position: absolute; }}
.logo svg {{ display: block; height: 100%; width: auto; }}
.eyebrow {{ font-size: 7pt; font-weight: 600; letter-spacing: .16em; text-transform: uppercase; color: {MUTED}; }}
.orange {{ color: {ORANGE}; }}

/* cover */
.cover .pattern {{ right: -190pt; top: 70pt; width: 560pt; height: 555pt; opacity: .055; }}
.cover .pattern svg {{ width: 100%; height: 100%; }}
.cover .num {{ left: 48pt; top: 176pt; font-size: 132pt; font-weight: 200; line-height: .8; letter-spacing: -.04em; color: {ORANGE}; }}
/* the name, its translations and the details row flow one under the other, so a long name can take two lines */
.cover .names {{ left: 48pt; right: 48pt; top: 300pt; }}
.cover .title {{ font-weight: 600; letter-spacing: -.025em; line-height: 1.02; }}
.cover .langs {{ margin: 12pt 0 0 2pt; font-size: 12.5pt; color: {MUTED}; letter-spacing: .01em; line-height: 1.35; }}
.cover .dash {{ left: 50pt; top: 160pt; width: 26pt; height: 2pt; background: {ORANGE}; }}
.meta {{ margin-top: 30pt; display: flex; gap: 40pt; border-top: .75pt solid {LINE}; padding-top: 12pt; }}
.meta div b {{ display: block; font-size: 6.5pt; font-weight: 600; letter-spacing: .16em; color: {MUTED}; text-transform: uppercase; margin-bottom: 4pt; }}
.meta div span {{ font-size: 9pt; font-weight: 600; }}
/* every photo fits the same box above the footer, whatever its shape */
.cover .hero {{ left: 0; top: 486pt; width: 470pt; height: 262pt; }}
.cover .hero img {{ width: 100%; height: 100%; object-fit: contain; object-position: left center; display: block; mix-blend-mode: multiply; }}
.cover .foot {{ left: 48pt; right: 48pt; bottom: 34pt; display: flex; justify-content: space-between; font-size: 7.5pt; color: {MUTED}; border-top: .75pt solid {LINE}; padding-top: 10pt; }}

/* inner pages */
.hdr-logo {{ left: 48pt; top: 28pt; height: 19pt; }}
.chap {{ right: 48pt; top: 33pt; font-size: 7.5pt; font-weight: 600; letter-spacing: .16em; text-transform: uppercase; color: {GREY}; }}
.chap .n {{ color: {ORANGE}; margin-right: 6pt; }}
.rule {{ left: 48pt; right: 48pt; height: .75pt; background: {LINE}; }}
.ptitle {{ left: 48pt; right: 48pt; top: 63pt; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size: 13.5pt; font-weight: 600; letter-spacing: -.01em; line-height: 1.15; }}
.ptitle:before {{ content: ""; display: inline-block; width: 3pt; height: 11pt; background: {ORANGE}; margin-right: 8pt; vertical-align: -1pt; }}
.trans {{ left: 48pt; right: 48pt; top: 82pt; display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14pt; font-size: 6.8pt; line-height: 1.3; color: {GREY}; }}
.trans div {{ display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }}
.trans b {{ color: {ORANGE}; font-weight: 600; letter-spacing: .08em; margin-right: 4pt; }}
.pfoot {{ left: 48pt; right: 48pt; top: 766pt; display: flex; justify-content: space-between; align-items: center; font-size: 7pt; color: {MUTED}; }}
.pfoot .pn {{ font-size: 10pt; font-weight: 700; color: {INK}; letter-spacing: .02em; }}
.pfoot .web {{ color: {ORANGE}; font-weight: 500; }}

/* back cover */
.back {{ background: {INK}; color: #fff; }}
.back .pattern {{ left: -160pt; bottom: -150pt; width: 520pt; height: 516pt; opacity: .07; }}
.back .pattern svg {{ width: 100%; height: 100%; }}
.back .blogo {{ left: 48pt; top: 60pt; height: 34pt; }}
.back .tag {{ left: 48pt; top: 300pt; right: 48pt; font-size: 26pt; font-weight: 300; line-height: 1.25; letter-spacing: -.01em; }}
.back .tag em {{ font-style: normal; color: {ORANGE}; font-weight: 500; }}
.back .contact {{ left: 48pt; right: 48pt; bottom: 64pt; display: flex; gap: 44pt; border-top: .75pt solid rgba(255,255,255,.18); padding-top: 14pt; }}
.back .contact b {{ display: block; font-size: 6.5pt; font-weight: 600; letter-spacing: .16em; text-transform: uppercase; color: rgba(255,255,255,.5); margin-bottom: 5pt; }}
.back .contact span {{ font-size: 8.5pt; line-height: 1.45; }}
"""


def hero_photo(cover_page, dest):
    """The product photo from the old cover, for the new cover. Some old covers hold it as its own image; others are
    one flat picture of the whole page, with the photo in the white band across the middle (between two thin lines),
    so that band is cut out and trimmed to the photo."""
    images = [(im, cover_page.get_image_bbox(im)) for im in cover_page.get_images(full=True)]
    images = [(im, r) for im, r in images if r.is_valid and not r.is_empty]
    page_area = cover_page.rect.width * cover_page.rect.height
    photo = max(images, key=lambda x: x[1].width * x[1].height, default=None)
    if photo and photo[1].width * photo[1].height < 0.6 * page_area:
        fitz.Pixmap(cover_page.parent, photo[0][0]).save(dest)
        return
    band = fitz.Rect(0, 0.53 * H, W, 0.835 * H)  # inside the two thin lines that frame it
    pm = cover_page.get_pixmap(dpi=220, clip=band)
    from PIL import Image, ImageChops
    im = Image.frombytes("RGB", (pm.width, pm.height), pm.samples)
    ink = ImageChops.difference(im, Image.new("RGB", im.size, "white")).convert("L").point(lambda v: 255 if v > 24 else 0)
    box = ink.getbbox()
    (im.crop(box) if box else im).save(dest)


def title_size(title):
    # 50pt fits about 14 letters on a line; longer names step down, the longest taking two lines
    return 50 if len(title) <= 14 else 40 if len(title) <= 22 else 32


def cover(ch, n_pages, hero_uri):
    langs = " · ".join(ch["translations"])
    return f"""
<section class="page cover">
  <div class="abs pattern">{logo_svg(mark_only=True)}</div>
  <div class="abs logo" style="left:48pt;top:44pt;height:28pt">{logo_svg()}</div>
  <div class="abs eyebrow" style="right:48pt;top:54pt">Surgical Instruments Catalogue · {EDITION}</div>
  <div class="abs dash"></div>
  <div class="abs num">{ch['chapter']}</div>
  <div class="abs names">
  <div class="title" style="font-size:{title_size(ch['title'])}pt">{esc(ch['title'])}</div>
  <div class="langs">{esc(langs)}</div>
  <div class="meta">
    <div><b>Chapter</b><span>{ch['chapter']}</span></div>
    <div><b>Pages</b><span>01 – {n_pages:02d}</span></div>
    <div><b>Manufacturer</b><span>Smith Instruments</span></div>
    <div><b>Certifications</b><span>ISO 13485 · CE Mark</span></div>
  </div>
  </div>
  <div class="abs hero"><img src="{hero_uri}"></div>
  <div class="abs foot"><span>Head Office: Herndon, Virginia, USA</span><span class="orange">www.smithinstruments.net</span></div>
</section>"""


def inner(ch, i, titles):
    en, de, pt, es = titles
    left = i % 2 == 0  # even pages are left-hand pages: number on the outside edge
    num = f'<span class="pn">{i:02d}</span>'
    side = f'<span>Smith Instruments — Surgical Catalogue {EDITION}</span>'
    web = '<span class="web">www.smithinstruments.net</span>'
    foot = f"{num}{side}{web}" if left else f"{web}{side}{num}"
    return f"""
<section class="page">
  <div class="abs logo hdr-logo">{logo_svg()}</div>
  <div class="abs chap"><span class="n">{ch['chapter']}</span>{esc(ch['title'])}</div>
  <div class="abs rule" style="top:55pt"></div>
  <div class="abs ptitle">{esc(en)}</div>
  <div class="abs trans"><div><b>DE</b>{esc(de)}</div><div><b>PT</b>{esc(pt)}</div><div><b>ES</b>{esc(es)}</div></div>
  <div class="abs rule" style="top:757pt"></div>
  <div class="abs pfoot">{foot}</div>
</section>"""


def back():
    return f"""
<section class="page back">
  <div class="abs pattern">{logo_svg(white=True, mark_only=True).replace(ORANGE, "#FFFFFF")}</div>
  <div class="abs logo blogo">{logo_svg(white=True)}</div>
  <div class="abs tag">Precision surgical and dental instruments,<br><em>made to last a career.</em></div>
  <div class="abs contact">
    <div><b>Head Office</b><span>Smith Instruments Inc.<br>{esc(ADDRESS)}</span></div>
    <div><b>Contact</b><span>info@smithinstruments.net<br>www.smithinstruments.net</span></div>
    <div><b>Certifications</b><span>ISO 9001:2015<br>ISO 13485:2016 · CE</span></div>
  </div>
</section>"""


def main(chapter):
    ch = json.loads((ROOT / f"chapters/{chapter}.json").read_text())
    slug = f"{chapter}-{re.sub(r'[^a-z0-9]+', '-', ch['title'].lower()).strip('-')}"  # as extract.py names it
    work = ROOT / "work" / slug
    work.mkdir(parents=True, exist_ok=True)

    src_path = work / "source.pdf"
    if not src_path.exists():
        subprocess.run(["curl", "-sfL", "-o", str(src_path), ch["source"]], check=True)
    src = fitz.open(src_path)
    n_inner = src.page_count - 1
    assert len(ch["pages"]) == n_inner, f"{len(ch['pages'])} titles for {n_inner} pages"

    hero = work / "hero.png"
    hero_photo(src[0], hero)

    pages = [cover(ch, n_inner, hero.as_uri())]
    pages += [inner(ch, i, ch["pages"][i - 1]) for i in range(1, n_inner + 1)]
    pages.append(back())
    doc = f"""<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500;600;700&display=swap" rel="stylesheet">
<style>{CSS}</style></head><body>{''.join(pages)}</body></html>"""
    html_path = work / "layout.html"
    html_path.write_text(doc)

    layout_pdf = work / "layout.pdf"
    with sync_playwright() as p:
        try:
            b = p.chromium.launch(channel="chrome")  # the installed Google Chrome
        except Exception:
            b = p.chromium.launch()
        pg = b.new_page()
        pg.goto(html_path.as_uri(), wait_until="networkidle")
        pg.evaluate("document.fonts.ready")
        pg.pdf(path=str(layout_pdf), print_background=True, prefer_css_page_size=True)
        b.close()

    layout = fitz.open(layout_pdf)
    assert layout.page_count == n_inner + 2, layout.page_count
    out = fitz.open()
    for i in range(layout.page_count):
        page = out.new_page(width=W, height=H)
        page.show_pdf_page(page.rect, layout, i)
        if 1 <= i <= n_inner:  # lay the original product content over the new frame
            page.show_pdf_page(CONTENT, src, i, clip=CONTENT)
    out.set_metadata({"title": f"Smith Instruments — {ch['title']} Catalogue", "author": "Smith Instruments Inc."})
    dest = ROOT / "out" / f"{slug}.pdf"
    dest.parent.mkdir(exist_ok=True)
    out.save(dest, garbage=4, deflate=True)
    print(dest, f"{dest.stat().st_size / 1e6:.1f} MB, {out.page_count} pages")


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "01")
