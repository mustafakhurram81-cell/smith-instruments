# Reading the PDF catalogues

The product page links each code to the page of its chapter's PDF catalogue where it is printed ("See it in the
Scissors catalogue, page 21"). Those pages come from `scripts/catalog/catalogue-pages.json`, which these tools build by
reading the printed catalogues. The PDFs are pictures of text, so the pages are read with macOS's built-in text
recognition. Redo this only when the catalogues are reprinted; a new code in the ERP uses another code's page on the
same product page until then.

Needs a Mac with the Xcode command line tools (`swiftc`) and Python 3. Keep the work folder outside the repo: the
PDFs are about 250 MB and the readings about 5 MB.

```bash
WORK=~/catalogue-reading
python3 -m venv $WORK/venv && $WORK/venv/bin/pip install pymupdf
npm run catalog                                                    # the codes to look for
$WORK/venv/bin/python scripts/catalog/read-catalogues/read-pdfs.py $WORK      # all 29 chapters, about an hour
node scripts/catalog/read-catalogues/build-page-map.mjs $WORK/pages.jsonl
npm run catalog                                                    # puts the pages into the website data
```

- `read-pdfs.py` downloads the chapter catalogues listed in `lib/catalog/catalogues.json`, reads every page at
  400 dpi and appends to `$WORK/pages.jsonl`. Stopped, it carries on where it stopped. `--only 22` reads one chapter.
- `build-page-map.mjs` prints how many codes it placed: printed on a page, inside a printed range
  ("02-100-12 – 02-100-25"), or on their model's page. On 28 October 2026: 8,298 printed, 196 in a range, 78 by model,
  78 not found, of 8,650.
- Check a few codes by opening their link on the website, then commit `scripts/catalog/catalogue-pages.json`.

The first reading (28 October 2026) also produced `Catalogue_vs_ERP_Check.xlsx`, the codes and sizes in the
catalogues that differ from the ERP.
