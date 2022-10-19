import {
  Colors,
  FontSize,
  LOGO_IMAGE,
  PageParams,
  REM,
  writeText,
} from "../pdfStyleConfig";
import { contact, paymentValues } from "config";

import PDFDocument from "pdfkit-table";
import { addFooter } from "./addFooter";

export const addTermsAndConditionsPage = (doc: PDFDocument): void => {
  try {
    doc.image(LOGO_IMAGE, PageParams.MARGIN, PageParams.MARGIN, {
      width: 5 * REM,
    });

    writeText(doc);
    doc.text("DESIGN PROPOSAL", PageParams.MARGIN, PageParams.MARGIN, {
      align: "right",
    });

    const TOP_SEPARATOR_Y = 5 * REM;
    doc
      .lineCap("butt")
      .moveTo(PageParams.MARGIN, TOP_SEPARATOR_Y)
      .lineTo(PageParams.A4_WIDTH - PageParams.MARGIN, TOP_SEPARATOR_Y)
      .stroke();

    writeText(doc, FontSize.H2);

    doc.text(
      "ADDITIONAL COSTS AND FEES",
      PageParams.MARGIN,
      TOP_SEPARATOR_Y + PageParams.LINE_HEIGHT,
      {
        align: "left",
      }
    );

    const SUB_SECTION_Y = TOP_SEPARATOR_Y + PageParams.LINE_HEIGHT * 3.25;
    const HIGHLIGHT_PADDING = 4;
    doc
      .opacity(0.05)
      .rect(
        PageParams.MARGIN,
        SUB_SECTION_Y - HIGHLIGHT_PADDING,
        PageParams.A4_WIDTH - 2 * PageParams.MARGIN,
        2 * REM
      );
    doc.fill(Colors.BLACK).opacity(1);

    doc.fontSize(FontSize.H3);
    doc.text(
      "OTHER COSTS TO THE PROJECT",
      PageParams.MARGIN + HIGHLIGHT_PADDING,
      SUB_SECTION_Y,
      {
        align: "left",
      }
    );

    doc.fontSize(FontSize.H4);
    doc.text(
      "TERRITORIAL AUTHORITY FEES & SERVICES",
      PageParams.MARGIN,
      11.5 * REM,
      {
        align: "left",
      }
    );

    doc.list(
      [
        "Building Consent lodgement and processing fees.",
        "Documents required by TCDC e.g. Certificate of Title.",
        "Resource Consent fees (if required.)",
        "Additional site visits over and above those allowed for in quote.",
      ],
      PageParams.MARGIN,
      13 * REM,
      {
        bulletRadius: 2,
        width: 14.5 * REM,
      }
    );

    doc.text(
      "Local TA application fees are not included in our fee.  It is preferred that the client pay this directly to the TA.  Invoices will be directed to the client.",
      PageParams.MARGIN,
      20 * REM,
      {
        width: 14.5 * REM,
      }
    );

    doc.text("CONSULTANTS", PageParams.MARGIN * 8, 11.5 * REM, {
      align: "left",
    });

    doc.text(
      `Structural Engineer Design / Geotech. PS1 / PS4 fees (if required.)
  
      You will be advised of the need for any other consultants, as it arises, and fee proposals will be sought by us from them for your consideration before engagement by you.`,
      PageParams.MARGIN * 8,
      13 * REM,
      {
        width: 14.5 * REM,
        indent: 0,
      }
    );

    const SUB_SECTION_Y2 = SUB_SECTION_Y * 3;

    doc.fontSize(FontSize.H3);
    doc.text(
      "FEES AND TERMS",
      PageParams.MARGIN + HIGHLIGHT_PADDING,
      SUB_SECTION_Y2,
      {
        align: "left",
      }
    );

    doc
      .opacity(0.05)
      .rect(
        PageParams.MARGIN,
        SUB_SECTION_Y2 - HIGHLIGHT_PADDING,
        PageParams.A4_WIDTH - 2 * PageParams.MARGIN,
        2 * REM
      );
    doc.fill(Colors.BLACK).opacity(1);
    doc.fontSize(FontSize.H4);
    doc.text(
      "1. Payment terms: 20% required upon acceptance of this proposal. ",
      PageParams.MARGIN,
      SUB_SECTION_Y2 + PageParams.LINE_HEIGHT * 2
    );

    const COEF = 0.7;
    paymentValues.map((value, index) => {
      let height = SUB_SECTION_Y2 + PageParams.LINE_HEIGHT * (index * COEF + 3);
      doc.text(value.label, PageParams.MARGIN + 20, height);
      doc.text(value.value, PageParams.MARGIN * 4 + 20, height);
    });

    doc.list(
      [
        "2. The balance of our fee is invoiced on stage completion and is payable on receipt of the invoice.",
        "",
        "3. Any additional design work as a result of a significant change of scope after concept and developed design stages have been signed off and any associated application work is charged at $200 + gst per hr.",
        "",
        "4. This fee proposal has been prepared based on our previous experience with similar scale, design and documentation projects.",
      ],
      PageParams.MARGIN,
      SUB_SECTION_Y2 + PageParams.LINE_HEIGHT * 7,
      {
        bulletRadius: 0.1,
        textIndent: 0,
        bulletIndent: 0,
        width: 28 * REM,
      }
    );

    addFooter(doc);
  } catch (e) {
    console.log(e);
  }
};
