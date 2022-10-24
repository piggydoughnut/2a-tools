import {
  Colors,
  FontSize,
  Padding,
  PageParams,
  REM,
  writeBold,
  writeText,
} from "../pdfHelpers/pdfStyleConfig";

import PDFDocument from "pdfkit-table";
import { addFooter } from "../pdfHelpers/addFooter";
import { addHeader } from "../pdfHelpers/addHeader";
import { paymentValues } from "config";

export const addTermsAndConditionsPage = (
  doc: PDFDocument,
  projectName: string,
  hourlyRate: number
): void => {
  try {
    const columnWidth = 15 * REM;
    addHeader(doc, projectName);
    writeText(doc, FontSize.H2);
    const SUB_SECTION_Y = doc.y + Padding.big * 2;
    doc
      .opacity(0.05)
      .rect(
        PageParams.MARGIN,
        SUB_SECTION_Y - Padding.small,
        PageParams.A4_WIDTH - 2 * PageParams.MARGIN,
        2 * REM
      );
    doc.fill(Colors.BLACK).opacity(1);

    doc.fontSize(FontSize.H3);
    doc.text(
      "OTHER PROJECT COSTS",
      PageParams.MARGIN + Padding.small,
      SUB_SECTION_Y,
      {
        align: "left",
      }
    );

    doc.fontSize(FontSize.H4);
    doc.moveDown();
    const subHeaderLevel = doc.y + Padding.small;
    doc.text(
      "TERRITORIAL AUTHORITY FEES & SERVICES",
      PageParams.MARGIN,
      doc.y + Padding.small,
      {
        align: "left",
      }
    );

    doc.fontSize(FontSize.P);
    doc.moveDown();

    const textLevel = doc.y + Padding.small;
    doc.list(
      [
        "Building Consent lodgement and processing fees.",
        "Documents required by TCDC e.g. Certificate of Title.",
        "Resource Consent fees (if required.)",
        "Additional site visits over and above those allowed for in quote.",
      ],
      {
        bulletRadius: 1,
        width: columnWidth,
      }
    );

    doc.moveDown();
    doc.text(
      "Local TA application fees are not included in our fee.  It is preferred that the client pay this directly to the TA.  Invoices will be directed to the client.",

      {
        width: columnWidth,
      }
    );

    doc.fontSize(FontSize.H4);
    doc.text("CONSULTANTS", PageParams.MARGIN * 8, subHeaderLevel, {
      align: "left",
    });

    doc.fontSize(FontSize.P);
    doc.text(
      `Structural Engineer Design / Geotech. PS1 / PS4 fees (if required.)`,
      PageParams.MARGIN * 8,
      textLevel - Padding.small,
      {
        width: columnWidth,
      }
    );
    doc.text(
      `You will be advised of the need for any other consultants, as it arises, and fee proposals will be sought by us from them for your consideration before engagement by you.`,
      PageParams.MARGIN * 8,
      doc.y + Padding.medium,
      {
        width: columnWidth,
        indent: 1,
      }
    );

    doc.moveTo(PageParams.MARGIN, doc.y);
    doc.moveDown();
    doc.moveDown();
    doc.moveDown();
    doc.moveDown();
    doc.moveDown();
    const termsY = doc.y;
    doc.fontSize(FontSize.H3);
    doc.text("TERMS AND CONDITIONS", PageParams.MARGIN + Padding.small, doc.y, {
      align: "left",
    });

    doc
      .opacity(0.05)
      .rect(
        PageParams.MARGIN,
        termsY - Padding.small,
        PageParams.A4_WIDTH - 2 * PageParams.MARGIN,
        2 * REM
      )
      .fill(Colors.BLACK)
      .opacity(1);

    doc.fontSize(FontSize.P);
    doc.moveDown();
    const termsStartY = doc.y + Padding.medium;
    doc.text("1. Payment terms: ", PageParams.MARGIN, termsStartY, {
      continued: true,
    });
    writeBold(doc);
    doc.text("20% required upon acceptance. ");
    writeText(doc);
    doc.fontSize(FontSize.H4);
    doc.moveDown();
    paymentValues.map((value) => {
      const lineY = doc.y;
      doc.text(value.label, PageParams.MARGIN, lineY);
      doc.text(value.value, 9 * REM, lineY);
    });

    doc.fontSize(FontSize.P);
    doc.moveDown();
    doc.list(
      [
        "2. The balance of our fee is invoiced on stage completion and is payable on receipt of the invoice.",
        "",
        `3. Any additional design work as a result of a significant change of scope after concept and developed design stages have been signed off and any associated application work is charged at $${hourlyRate} + gst per hr.`,
        "",
        "4. This fee proposal has been prepared based on our previous experience with similar scale, design and documentation projects.",
      ],
      PageParams.MARGIN,
      doc.y,
      {
        bulletRadius: 0.1,
        textIndent: 0,
        bulletIndent: 0,
        width: columnWidth,
        continued: true,
      }
    );
    doc.list(
      [
        "5. Each project is broken down into 4 phases:",
        "",
        "Brief phase - definition of the brief, signing the contract. 5 revisions are allowed during this phase.",
        "",
        "Concept phase - 3 revisions are allowed during this phase.",
        "",
        "Development phase - 3 revisions are allowed during this phase. At this stage the design is agreed upon and the documentation phase will begin.",
        "",
        `Documentation phase - Any significant changes that modify the design will be charged per hour at $${hourlyRate} + gst per hr.`,
        "",
        `Additional revisions will be charged per hour at $${hourlyRate} + gst per hr`,
      ],
      PageParams.MARGIN * 8,
      termsStartY,
      {
        bulletRadius: 0.1,
        textIndent: 0,
        bulletIndent: 0,
        width: columnWidth,
      }
    );

    addFooter(doc);
  } catch (e: any) {
    console.log(e);
  }
};
