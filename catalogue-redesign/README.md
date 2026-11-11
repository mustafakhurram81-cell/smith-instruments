# The chapter catalogues in the current brand

`build.py` re-skins an old chapter catalogue: a new cover, header, footer and back cover around the old pages' products,
which stay exactly as printed. The page titles live in `chapters/<NN>.json`, read from the old headers by `extract.py`.

```bash
swiftc -O catalogue-redesign/ocr.swift -o catalogue-redesign/ocr   # once: the Mac's text recognition
python3 catalogue-redesign/extract.py 02                           # titles -> chapters/02.json ("check" lists pages to look at)
python3 catalogue-redesign/build.py 02                             # -> out/02-scissors.pdf
```

The finished PDFs are served from `public/catalogue-pdfs/` (thumbnails in `public/catalogue-thumbnails/`), and the ERP's
Settings → Website list (`website_catalogues`) links to them; the site's build reads that list. `old-catalogue-links.json`
holds the links to the old printed catalogues, which are still in R2.
