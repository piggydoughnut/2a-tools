import PDFDocument from "pdfkit";
import { contact } from "config";
import { pEvent } from "p-event";
import path from "path";
import { readFileSync } from "fs";
const MARGIN = 40;
// const A4_HEIGHT = 841.89;
const A4_WIDTH = 595.28;

const BLACK = "#000000";
const GRAY = "#6F6E70";
const LINE_HEIGHT = 20;

const FONT_TEXT = 10;
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

const drawLine = () => {};

export type InvoiceProps = {
  invoiceNumberFull: number;
  issueDate: Date;
  dueDate: Date;
  billto: string;
  totalInvoice?: number;
  items: Array<{
    item: string;
    qty: number;
    price: number;
  }>;
  paymentValues: Array<{
    label: string;
    value: string;
    number?: boolean;
  }>;
  subtotal?: number;
  gst?: number;
  amountDue?: number;
};

export const generatePdf = async ({
  invoiceNumberFull,
  issueDate,
  dueDate,
  billto,
  items,
  paymentValues,
  gst,
  subtotal,
  amountDue,
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

    const HEADER_X = 400;

    writeBold(FONT_TEXT);
    doc.text("ISSUE DATE", HEADER_X, MARGIN);
    writeText(FONT_TEXT);
    doc.text(issueDate.toString(), HEADER_X, MARGIN + LINE_HEIGHT * 0.75);

    writeBold(FONT_TEXT);
    doc.text("DUE DATE", HEADER_X, MARGIN + LINE_HEIGHT * 2);
    writeText(FONT_TEXT);
    doc.text(dueDate.toString(), HEADER_X, MARGIN + LINE_HEIGHT * 2.75);

    doc.text(billto, HEADER_X + 70, MARGIN, {
      align: "right",
    });

    writeBold(FONT_H1);
    doc.text("INVOICE", MARGIN, 180, {
      align: "left",
      characterSpacing: 8,
    });

    writeNumbers(FONT_H2);
    doc.text(`${invoiceNumberFull}`, MARGIN + 200, 200);

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

    let Y_START = 280;
    items.forEach((field, index) => {
      // if (y > 40 + 842) {
      //   // need new page
      // }
      const rowHeight = 20 * Math.ceil(field.item.length / 57);
      let y = Y_START + rowHeight * index;
      console.log("rowHeight ", rowHeight);
      console.log("y ", y);

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

    const SUBTOTAL_Y = 340 + (items.length - 1) * LINE_HEIGHT;
    const SUBTOTAL_X = 330;
    doc
      .lineCap("butt")
      .moveTo(SUBTOTAL_X, SUBTOTAL_Y - LINE_HEIGHT / 2)
      .lineTo(SUBTOTAL_X + 225, SUBTOTAL_Y - LINE_HEIGHT / 2)
      .stroke();

    writeBold(FONT_TEXT);
    doc.text("Subtotal", 330, SUBTOTAL_Y);

    writeNumbers(FONT_TEXT);
    doc.text(`$${subtotal}`, 505, SUBTOTAL_Y, { align: "right" });

    writeBold(FONT_TEXT);
    doc.text("GST (15%)", 330, SUBTOTAL_Y + LINE_HEIGHT);

    writeNumbers(FONT_TEXT);
    doc.text(`$${gst}`, 505, SUBTOTAL_Y + LINE_HEIGHT, { align: "right" });

    writeBold(FONT_TEXT);
    doc.text("Total", 330, SUBTOTAL_Y + LINE_HEIGHT * 2);

    writeNumbers(FONT_TEXT);
    doc.text(`$${amountDue}`, 505, SUBTOTAL_Y + LINE_HEIGHT * 2, {
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
      `$${amountDue}`, // ${CURRENCY}`,
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

    doc.fillColor(GRAY).text("CONTACT", 430, FOOTER_HEIGHT + LINE_HEIGHT * 2);
    writeText(FONT_TEXT);
    doc.fillColor(BLACK);
    contact.map((val, index) => {
      let height = FOOTER_HEIGHT + LINE_HEIGHT * (index * COEF + 3);
      doc.text(val, 430, height);
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
