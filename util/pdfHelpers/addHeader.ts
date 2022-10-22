import {
  LOGO_IMAGE,
  Padding,
  PageParams,
  REM,
  writeText,
} from "./pdfStyleConfig";

import PDFDocument from "pdfkit-table";

export const addHeader = (doc: PDFDocument, projectName: string): void => {
  try {
    doc.image(LOGO_IMAGE, PageParams.MARGIN, PageParams.MARGIN, {
      width: 5 * REM,
    });

    writeText(doc);
    doc.text("DESIGN PROPOSAL", PageParams.MARGIN, PageParams.MARGIN, {
      align: "right",
    });
    doc.text(projectName, doc.x, doc.y + Padding.small, { align: "right" });

    const TOP_SEPARATOR_Y = 5 * REM;
    doc
      .lineCap("butt")
      .moveTo(PageParams.MARGIN, TOP_SEPARATOR_Y)
      .lineTo(PageParams.A4_WIDTH - PageParams.MARGIN, TOP_SEPARATOR_Y)
      .stroke();
  } catch (e) {
    console.log(e);
  }
};
