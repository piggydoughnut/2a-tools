import { format, parseISO } from "date-fns";
import { readFileSync, write } from "fs";

import PDFDocument from "pdfkit-table";
import { contact } from "config";
import { pEvent } from "p-event";
import path from "path";

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

    doc.opacity(0.05).rect(0, 0, A4_WIDTH, 240).fill(BLACK);
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
    doc.text("DUE DATE", HEADER_X, MARGIN);
    writeText(FONT_TEXT);
    doc.text(
      format(parseISO(dueDate.toString()), "yyyy-MM-dd"),
      HEADER_X,
      MARGIN + LINE_HEIGHT * 0.75
    );

    writeBold(FONT_TEXT);
    doc.text("ISSUE DATE", HEADER_X, MARGIN + LINE_HEIGHT * 2);
    writeText(FONT_TEXT);
    doc.text(
      format(parseISO(issueDate.toString()), "yyyy-MM-dd"),
      HEADER_X,
      MARGIN + LINE_HEIGHT * 2.75
    );

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

    writeText(FONT_TEXT);

    const HEADER_LINE_Y = 250;

    const tableData = [];

    items.forEach((field, index) => {
      tableData.push([
        field.item,
        `$${field.price}`,
        field.qty,
        `$${field.qty * field.price}`,
      ]);
    });
    tableData.push(
      ["", "", "", ""],
      ["", "", "", ""],
      ["", "Subtotal", "", `$${subtotal}`],
      ["", "GST", "", `$${gst}`],
      ["", "Amount Due", "", `$${amountDue}`]
    );
    const table = {
      columnSpacing: 10,
      headers: [
        {
          label: "Item",
          name: "item",
          align: "left",
          headerAlign: "left",
          headerColor: "white",
        },
        {
          label: "Price",
          name: "price",
          align: "right",
          headerAlign: "right",
          headerColor: "white",
        },
        {
          label: "Qty",
          name: "qty",
          align: "right",
          headerAlign: "right",
          headerColor: "white",
        },
        {
          label: "Total",
          name: "total",
          align: "right",
          headerAlign: "right",
          headerColor: "white",
        },
      ],
      padding: 2,
      rows: tableData,
    };

    doc.text("", MARGIN, HEADER_LINE_Y);
    await doc.table(table, {
      columnsSize: [260, 120, 50, 80],
      prepareHeader: () => {
        doc.font(font1);
        return doc;
      },
      prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
        doc.font(font3);
        if (indexColumn != 0) {
          doc.font(font2);
        }
        console.log("indexRow ", indexRow);
        console.log("rows ", table.rows.length - 1);
        if (indexRow === table.rows.length - 1) {
          writeBold(FONT_H3);
        }
        if (indexRow === table.rows.length - 4 && indexColumn !== 0) {
          if (indexColumn === 1) {
            doc.font(font2);
          } else {
            doc.font(font2);
          }
          const offset = 30;
          if (indexColumn === 1) {
            doc.text("", { align: "left" });
            doc
              .lineCap("butt")
              .moveTo(rectCell.x + offset, rectCell.y)
              .lineTo(rectCell.x + rectCell.width, rectCell.y)
              .stroke();
          } else {
            doc
              .lineCap("butt")
              .moveTo(rectCell.x, rectCell.y)
              .lineTo(rectCell.x + rectCell.width, rectCell.y)
              .stroke();
          }
        }
        return doc;
      },
      divider: {
        header: { disabled: false, width: 1, opacity: 0.5 },
        horizontal: { disabled: true, width: 0.5, opacity: 0.5 },
      },
    });

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
