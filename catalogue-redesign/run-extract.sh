#!/bin/bash
# Reads every chapter's titles (02–29); Scalpels (01) was checked by hand and is kept as it is.
cd "$(dirname "$0")"
for c in $(seq -w 2 29); do python3 extract.py $c || echo "$c failed"; done
