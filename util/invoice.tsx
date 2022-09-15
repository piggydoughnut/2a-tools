import { InvoiceProps } from "components/InvoiceTable";
import PDFDocument from "pdfkit";
import { pEvent } from "p-event";
import path from "path";
import { readFileSync } from "fs";
const MARGIN = 40;
// const A4_HEIGHT = 841.89;
const A4_WIDTH = 595.28;

const BLACK = "#000000";
const GRAY = "#6F6E70";
const LINE_HEIGHT = 20;

const FONT_TEXT = 12;
const FONT_H1 = 40;
const FONT_H2 = 18;
const FONT_H3 = 16;

const mainPath = path.join(process.cwd(), "public");
const fontsPath = path.join(mainPath, "fonts");
const INRIA_BOLD = path.join(fontsPath, "InriaSans-Bold.ttf");
const ROBOTO_MONO = path.join(fontsPath, "RobotoMono-VariableFont_wght.ttf");
const INRIA_REGULAR = path.join(fontsPath, "InriaSans-Regular.ttf");
const logoImage = path.join(process.cwd(), "/public", "logo.png");
const font1 = readFileSync(INRIA_BOLD);
const font2 = readFileSync(ROBOTO_MONO);
const font3 = readFileSync(INRIA_REGULAR);

export const generatePdf = async ({
  invoiceNumber,
  issueDate,
  dueDate,
  billto,
  items,
  paymentValues,
}: InvoiceProps): Promise<Buffer | undefined | string> => {
  try {
    const doc = new PDFDocument({
      bufferPages: true,
      size: "A4",
      margins: {
        top: MARGIN,
        bottom: MARGIN,
        left: MARGIN,
        right: MARGIN,
      },
    });
    let bufferChunks: any = [];
    doc.on("readable", function () {
      // Store buffer chunk to array
      bufferChunks.push(doc.read());
    });

    doc.opacity(0.02).rect(0, 0, A4_WIDTH, 240).fill(BLACK);
    doc.fill(BLACK).opacity(1);

    doc.image(logoImage, MARGIN, MARGIN, {
      width: 150,
    });
    const writeBold = (fontSize: number) => {
      try {
        doc.fontSize(fontSize);
        doc.font(font1);
      } catch (e) {
        console.log(e);
      }
    };

    const writeNumbers = (fontSize: number) => {
      doc.fontSize(fontSize);
      doc.font(font2);
    };

    const writeText = (fontSize: number) => {
      doc.fontSize(fontSize);
      doc.font(font3);
    };

    writeBold(FONT_H1);
    console.log("omg");
    doc.text("INVOICE", MARGIN, 180, {
      align: "left",
      characterSpacing: 6,
    });

    writeNumbers(FONT_H2);
    doc.text(`#${invoiceNumber}`, MARGIN + 200, 200);

    doc.lineWidth(1);
    const length = A4_WIDTH - 2 * MARGIN;
    doc
      .lineCap("butt")
      .moveTo(MARGIN, 265)
      .lineTo(length + MARGIN, 270)
      .stroke();

    writeText(FONT_TEXT);

    const HEADER_LINE_Y = 250;
    doc.text("Item", MARGIN, HEADER_LINE_Y, {
      width: 245,
      height: 20,
      align: "left",
    });

    doc.text("Price", 320, HEADER_LINE_Y, {
      width: 50,
      height: 20,
      align: "right",
    });
    doc.text("Qty", 370, HEADER_LINE_Y, {
      width: 50,
      height: 40,
      align: "right",
    });
    doc.text("Total", 505, HEADER_LINE_Y, {
      width: 50,
      height: 40,
      align: "right",
    });

    let y = 280;
    items.forEach((field, index) => {
      if (y > 40 + 842) {
        // need new page
      }
      const rowHeight = 20 * Math.ceil(field.item.length / 57);
      y += rowHeight * index;
      console.log(rowHeight);
      console.log(y);

      writeText(FONT_TEXT);
      doc.text(field.item, MARGIN, y, {
        width: 245,
        height: rowHeight,
        align: "left",
      });

      writeNumbers(FONT_TEXT);
      doc.text(`$${field.price}`, 320, y, {
        width: 50,
        height: rowHeight,
        align: "right",
      });
      doc.text(field.qty.toString(), 370, y, {
        width: 50,
        height: rowHeight,
        align: "right",
      });
      doc.text(`$${field.qty * field.price}`, 505, y, {
        width: 50,
        height: rowHeight,
        align: "right",
      });
    });

    doc
      .lineCap("butt")
      .moveTo(330, y + MARGIN)
      .lineTo(555, y + MARGIN)
      .stroke();

    const SUBTOTAL_Y = 330;

    writeBold(FONT_TEXT);
    doc.text("Subtotal", 330, SUBTOTAL_Y);
    const subtotal = items.reduce(
      (total, current) => total + current.qty * current.price,
      0
    );

    writeNumbers(FONT_TEXT);
    doc.text(`$${subtotal}`, 505, SUBTOTAL_Y, { align: "right" });

    writeBold(FONT_TEXT);
    doc.text("GST (15%)", 330, SUBTOTAL_Y + LINE_HEIGHT);
    const gst = subtotal * 0.15;

    writeNumbers(FONT_TEXT);
    doc.text(`$${gst}`, 505, SUBTOTAL_Y + LINE_HEIGHT, { align: "right" });

    writeBold(FONT_TEXT);
    doc.text("Total", 330, SUBTOTAL_Y + LINE_HEIGHT * 2);

    writeNumbers(FONT_TEXT);
    doc.text(`$${subtotal + gst}`, 505, SUBTOTAL_Y + LINE_HEIGHT * 2, {
      align: "right",
    });

    doc
      .lineCap("butt")
      .moveTo(330, SUBTOTAL_Y + LINE_HEIGHT * 3)
      .lineTo(555, SUBTOTAL_Y + LINE_HEIGHT * 3)
      .stroke();

    writeBold(FONT_H3);
    doc.text(`Amount due`, 330, SUBTOTAL_Y + LINE_HEIGHT * 3.5);

    writeNumbers(FONT_H3);
    doc.text(
      `$${subtotal + gst}`, // ${CURRENCY}`,
      400,
      SUBTOTAL_Y + LINE_HEIGHT * 3.5,
      {
        align: "right",
      }
    );

    ////////// FOOTER /////////////
    const FOOTER_HEIGHT = 680;
    writeBold(FONT_H2);
    doc.text("Thank you", MARGIN, FOOTER_HEIGHT);
    doc
      .lineCap("butt")
      .moveTo(MARGIN, FOOTER_HEIGHT + 30)
      .lineTo(555, FOOTER_HEIGHT + 30)
      .stroke();

    writeBold(FONT_TEXT);
    const COEF = 0.7;

    doc
      .fillColor(GRAY)
      .text("PAYABLE TO", MARGIN, FOOTER_HEIGHT + LINE_HEIGHT * 2);
    writeText(FONT_TEXT);
    doc.fillColor(BLACK);
    paymentValues.map((value, index) => {
      let height = FOOTER_HEIGHT + LINE_HEIGHT * (index * COEF + 3);
      doc.text(value.label, MARGIN, height);
      if (value.number) {
        writeNumbers(FONT_TEXT);
      } else {
        writeText(FONT_TEXT);
      }
      doc.text(value.value, MARGIN * 4, height);
    });

    writeBold(FONT_TEXT);
    const contact = [
      "2A Design Studio",
      "709 Rolleston St, Thames",
      "office@2adesign.co.nz",
      "0812-898-389",
    ];
    doc.fillColor(GRAY).text("CONTACT", 400, FOOTER_HEIGHT + LINE_HEIGHT * 2);
    writeText(FONT_TEXT);
    doc.fillColor(BLACK);
    contact.map((val, index) => {
      let height = FOOTER_HEIGHT + LINE_HEIGHT * (index * COEF + 3);
      doc.text(val, 400, height);
    });

    doc.end();

    await pEvent(doc, "end");
    bufferChunks = bufferChunks.filter((a: any) => a);
    var pdfBuffer = Buffer.concat(bufferChunks);
    return pdfBuffer.toString("base64");
  } catch (e) {
    console.log(e);
  }
};
