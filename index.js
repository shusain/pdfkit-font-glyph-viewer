import PDFDocument from 'pdfkit'
import fontkit from 'fontkit'
import fs from 'fs'
let { page } = PDFDocument;

let files = fs.readdirSync('./fonts')
let woffFiles = files
  .filter((fileName)=>fileName.includes('woff') || fileName.includes('ttf'))
  .filter((fileName)=>!fileName.includes('woff2'))
  .filter((fileName)=>!fileName.includes('pdf'))
  .filter((fileName)=>!fileName.includes('Aleck'));


  
// Create a document
const _doc = new PDFDocument();
  
// Pipe its output somewhere, like to a file or HTTP response
// See below for browser usage
_doc.pipe(fs.createWriteStream(`combined.pdf`));

woffFiles.forEach((fileName) => {
  generateDocument(`fonts/${fileName}`, _doc)
})

function generateDocument(fontPath, doc) {
  if(doc instanceof PDFDocument) {
    
    var font = fontkit.openSync(fontPath);
    
    // Embed a font, set the font size, and render some text
    let startPoint = 0;
    
    const endpoint = startPoint+65535;
    let temp = [];
    for(let i = startPoint; i < endpoint; i++) {
      if(font.hasGlyphForCodePoint(i)) {
        temp.push({
          dispString: String.fromCharCode(i),
          charCode: i
        })
      }
    }

    // Add title to page with font name
    doc
      .font('fonts/Roboto-Regular.ttf')
      .fontSize(12)
      .text(fontPath, 20, 20)

    // Add some labels above where fonts will be shown
    let x = 20;
    let y = 40;
    for (let i = 0; i < temp.length; i++) {
      const elem = temp[i];
      doc.font('fonts/Roboto-Regular.ttf')
        .fontSize(10)
        .text(elem.charCode, x, y)
        .font(fontPath)
        .fontSize(28)
        .text(elem.dispString, x, y+20)
      if(x + 150 >= doc.page.width) {
        // Went off end of page to the right resetting
        // the x position and moving down one (carriage return)
        x = 20;
        y += 50;
      } else {
        // Keep shifting to the right
        x+=50;
      }
      if(y+150 >= doc.page.height || y>=690) {
        y = 20;
        // Need to explictly add another page since we went beyond
        // the end of the page while showing glyphs for the current
        // font.
        doc.addPage()
      }
    }

    // Load and show the demo of the actual font in question
    doc.addPage();
    
  }
}
_doc.font('fonts/Roboto-Regular.ttf').fontSize(12).text("This page left intentionally blank", 100, 100)

  // Finalize PDF file
  _doc.end();