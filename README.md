# PDFKit Font Viewer
## Description
A node app that reads in any fonts in the fonts folder and generates a "combined.pdf" with all glyphs that exist in each font file as pages in a PDF (unicode values above the glyph, and font file used as page header)

After cloning install dependencies and run the script with

```
npm install && npm start
```

then 

```
open combined.pdf
# or 
xdg-open combined.pdf
```