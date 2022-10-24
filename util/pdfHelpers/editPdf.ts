import { PDFDocument, rgb } from "pdf-lib";

import { getBase64String } from "util/helpers";

export const editPdf = async (file: any) => {
  const f = await file.arrayBuffer();
  // Load a PDFDocument from the existing PDF bytes
  const pdfDoc = await PDFDocument.load(f);
  const pages = pdfDoc.getPages();
  const firstPage = pages[0];

  firstPage.drawText("PAID", {
    x: 350,
    y: 630,
    size: 50,
    color: rgb(0.95, 0.1, 0.1),
  });
  firstPage.drawRectangle({
    x: 330,
    y: 610,
    width: 160,
    height: 80,
    borderWidth: 3,
    borderColor: rgb(0.95, 0.1, 0.1),
  });

  // Serialize the PDFDocument to bytes (a Uint8Array)
  let pdfBytes = await pdfDoc.save();
  let modified = Buffer.from(pdfBytes).toString("base64");
  return getBase64String(modified);
};
