"""Reads every page of the chapter PDF catalogues (01-29) into <work>/pages.jsonl.

Usage: python3 read-pdfs.py <work dir> [--dpi 400] [--only 22]
Downloads each PDF listed in lib/catalog/catalogues.json into <work>/pdfs, renders every page and reads its text
with ./ocr (built from ocr.swift on first run). Stopping and running again carries on where it stopped.
Needs PyMuPDF: python3 -m venv <work>/venv && <work>/venv/bin/pip install pymupdf
"""
import argparse, json, os, subprocess, sys, urllib.request

import fitz  # PyMuPDF

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..', '..'))

ap = argparse.ArgumentParser()
ap.add_argument('work')
ap.add_argument('--dpi', type=int, default=400)  # small codes in tables need 400
ap.add_argument('--only', help='one chapter, e.g. 22')
a = ap.parse_args()
os.makedirs(os.path.join(a.work, 'pdfs'), exist_ok=True)

ocr = os.path.join(a.work, 'ocr')
if not os.path.exists(ocr):
    subprocess.run(['swiftc', '-O', os.path.join(HERE, 'ocr.swift'), '-o', ocr], check=True)

out_path = os.path.join(a.work, 'pages.jsonl')
done = set()
if os.path.exists(out_path):
    done = {json.loads(l)['key'] for l in open(out_path)}

catalogues = json.load(open(os.path.join(ROOT, 'lib', 'catalog', 'catalogues.json')))
with open(out_path, 'a') as out:
    for c in sorted((c for c in catalogues if c.get('chapter')), key=lambda c: c['chapter']):
        if a.only and c['chapter'] != a.only:
            continue
        name = f"{c['chapter']}-{os.path.basename(c['pdf_url'])[:-4]}"
        pdf = os.path.join(a.work, 'pdfs', name + '.pdf')
        if not os.path.exists(pdf):
            # The PDF host refuses Python's default user agent (403).
            req = urllib.request.Request(c['pdf_url'], headers={'User-Agent': 'Mozilla/5.0 (catalogue reader)'})
            with urllib.request.urlopen(req) as res, open(pdf + '.part', 'wb') as f:
                f.write(res.read())
            os.rename(pdf + '.part', pdf)
        doc = fitz.open(pdf)
        for i, page in enumerate(doc):
            key = f'{name}#{i + 1}'
            if key in done:
                continue
            png = os.path.join(a.work, f'page-{os.getpid()}.png')
            page.get_pixmap(dpi=a.dpi).save(png)
            r = subprocess.run([ocr, png], capture_output=True, text=True)
            os.remove(png)
            lines = json.loads(r.stdout)['lines'] if r.stdout.strip() else []
            out.write(json.dumps({'key': key, 'pdf': name, 'page': i + 1, 'lines': lines}) + '\n')
            out.flush()
        print(name, len(doc), 'pages', flush=True)
