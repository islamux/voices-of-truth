# Self-hosted fonts

All font files here are SIL Open Font License 1.1 — see [`OFL.txt`](./OFL.txt).
They are committed to the repo so the app builds fully offline with
`next/font/local` (no network at build or runtime).

## Provenance

Fonts downloaded from the `google/fonts` repository and re-encoded to
WOFF2. Latin variable fonts were subset to Latin + Latin-Extended ranges
(macrons like ā/ī are used in transliterated scholar names); Arabic fonts
were **not** subset, to preserve complex-script shaping.

| File | Family | Weights | Source | Version |
|------|--------|---------|--------|---------|
| `inter-var.woff2` | Inter | 100–900 (variable) | google/fonts, ofl/inter | 4.001 |
| `source-serif-var.woff2` | Source Serif 4 | 200–900 (variable) | google/fonts, ofl/sourceserif4 | 4.004 |
| `source-serif-italic-var.woff2` | Source Serif 4 Italic | 200–900 (variable) | google/fonts, ofl/sourceserif4 | 4.004 |
| `amiri-400.woff2` | Amiri | 400 | google/fonts, ofl/amiri | 1.002 |
| `amiri-700.woff2` | Amiri | 700 | google/fonts, ofl/amiri | 1.002 |
| `ruqaa-400.woff2` | Aref Ruqaa | 400 | google/fonts, ofl/arefruqaa | 1.003 |
| `ruqaa-700.woff2` | Aref Ruqaa | 700 | google/fonts, ofl/arefruqaa | 1.003 |

## Copyright notices (OFL §2/§4)

- **Amiri**: Copyright 2010-2022 The Amiri Project Authors (https://github.com/aliftype/amiri).
- **Aref Ruqaa**: Copyright 2015-2021 The Aref Ruqaa Project Authors (https://github.com/alif-type/aref-ruqaa), with Reserved Font Name EURM10.
- **Inter**: Copyright 2016 The Inter Project Authors (https://github.com/rsms/inter).
- **Source Serif 4**: © 2014 - 2021 Adobe Systems Incorporated (http://www.adobe.com/), with Reserved Font Name 'Source'.
