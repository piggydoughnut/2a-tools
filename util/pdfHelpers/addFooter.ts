import { Colors, FontSize, PageParams, REM } from "./pdfStyleConfig";

import PDFDocument from "pdfkit-table";
import { contact } from "config";

export const addFooter = (doc: PDFDocument): void => {
  try {
    // footer
    const FOOTER_Y = PageParams.A4_HEIGHT - 5 * PageParams.LINE_HEIGHT;
    doc
      .opacity(0.05)
      .rect(
        0,
        FOOTER_Y,
        PageParams.A4_HEIGHT - 2 * PageParams.MARGIN,
        6.5 * REM
      );
    doc.fill(Colors.BLACK).opacity(1);
    doc.fontSize(FontSize.H2);
    doc.text(
      "Thank you for choosing us.",
      PageParams.MARGIN,
      FOOTER_Y + PageParams.LINE_HEIGHT,
      {
        continued: true,
      }
    );
    doc.fontSize(FontSize.P);
    const COEF = 0.7;
    contact.map((val, index) => {
      let height =
        FOOTER_Y - 3 * REM + PageParams.LINE_HEIGHT * (index * COEF + 3);
      doc.text(val, 430, height);
    });
    doc.fontSize(FontSize.P);
    doc.text(
      "Please don’t hesitate to contact us should you require any further clarification on the process or fee structure.",
      PageParams.MARGIN,
      FOOTER_Y + PageParams.LINE_HEIGHT * 2.5,
      {
        width: PageParams.A4_WIDTH / 2,
      }
    );
  } catch (e: any) {
    console.log(e);
  }
};
