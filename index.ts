import PDFDocument from 'pdfkit'
import fontkit from 'fontkit'
import fs from 'fs'

let files = fs.readdirSync('./fonts')
let woffFiles = files.filter((a)=>a.includes('woff')||a.includes('ttf')).filter((a)=>!a.includes('woff2')).filter((a)=>!a.includes('pdf'));


  
// Create a document
const _doc = new PDFDocument();
  
// Pipe its output somewhere, like to a file or HTTP response
// See below for browser usage
_doc.pipe(fs.createWriteStream(`combined.pdf`));

woffFiles.forEach((fileName) => {
  generateDocument(`fonts/${fileName}`, _doc)
})

function generateDocument(fontPath, doc: typeof PDFDocument) {

  var font = fontkit.openSync(fontPath);
  
  // Embed a font, set the font size, and render some text
  let startPoint = 0;
  
  const endpoint = startPoint+65535;
  let temp = [];
  for(let i = startPoint; i < endpoint; i++) {
    if(font.hasGlyphForCodePoint(i)) {
      temp.push(String.fromCharCode(i) + ' ')
    }
  }
  doc
    .addPage()
    .font('fonts/ATTAleckSans_W_Rg.woff')
    .text('testing', 100, 100)
    .font(fontPath)
    .fontSize(12)
    .text(temp.join(' '), 100, 100);
  
}

  // Finalize PDF file
  _doc.end();