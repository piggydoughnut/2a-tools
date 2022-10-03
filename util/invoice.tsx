import {
  Colors,
  DATE_FORMAT,
  FontSize,
  Fonts,
  LOGO_IMAGE,
  Labels,
  PageParams,
} from "./pdfStyleConfig";
import { format, parseISO } from "date-fns";

import PDFDocument from "pdfkit-table";
import { contact } from "config";
import { pEvent } from "p-event";

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
  discount?: number;
  jobTitle: string;
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
  discount = 0,
  jobTitle,
}: InvoiceProps): Promise<Buffer | undefined | string> => {
  try {
    const doc = new PDFDocument({
      bufferPages: true,
      size: "A4",
      margins: {
        top: PageParams.MARGIN,
        bottom: PageParams.MARGIN,
        left: PageParams.MARGIN,
        right: PageParams.MARGIN,
      },
    });

    let bufferChunks: any = [];
    doc.on("readable", function () {
      // Store buffer chunk to array
      bufferChunks.push(doc.read());
    });
    const Y_OFFSET_CONDITION = jobTitle ? 15 : 0;
    doc
      .opacity(0.05)
      .rect(0, 0, PageParams.A4_WIDTH, 240 + Y_OFFSET_CONDITION)
      .fill(Colors.BLACK);
    doc.fill(Colors.BLACK).opacity(1);

    doc.image(LOGO_IMAGE, PageParams.MARGIN, PageParams.MARGIN, {
      width: 150,
    });

    const writeBold = (fontSize?: number | null) => {
      if (!fontSize) {
        fontSize = FontSize.P;
      }
      doc.fontSize(fontSize);
      doc.font(Fonts.inriaBold);
    };

    const writeNumbers = (fontSize?: number | null) => {
      if (!fontSize) {
        fontSize = FontSize.P;
      }
      doc.fontSize(fontSize);
      doc.font(Fonts.robotoMono);
    };

    const writeText = (fontSize?: number | null) => {
      if (!fontSize) {
        fontSize = FontSize.P;
      }
      doc.fontSize(fontSize);
      doc.font(Fonts.inriaRegular);
    };

    const HEADER_X = 400;
    const HEADER_Y = PageParams.MARGIN + PageParams.LINE_HEIGHT * 0.75;

    writeBold(8);
    doc.text("DUE DATE", HEADER_X, PageParams.MARGIN);
    writeText(8);
    doc.text(
      format(parseISO(dueDate.toString()), DATE_FORMAT),
      HEADER_X,
      HEADER_Y
    );

    writeBold(8);
    doc.text(
      "ISSUE DATE",
      HEADER_X,
      PageParams.MARGIN + PageParams.LINE_HEIGHT * 1.5
    );
    writeText(8);
    doc.text(
      format(parseISO(issueDate.toString()), DATE_FORMAT),
      HEADER_X,
      PageParams.MARGIN + PageParams.LINE_HEIGHT * 2.1
    );

    writeBold(8);
    doc.text("BILL TO", HEADER_X + 90, PageParams.MARGIN, { align: "right" });

    writeText(8);
    doc.text(billto, HEADER_X, HEADER_Y, {
      align: "right",
      lineGap: 2,
    });

    //230
    writeNumbers(FontSize.H4);
    doc.text(`${invoiceNumberFull}`, PageParams.MARGIN + 230, 210, {
      align: "right",
    });

    writeBold(FontSize.H1);
    doc.text("INVOICE", PageParams.MARGIN, 180, {
      align: "left",
      characterSpacing: 10,
    });
    if (jobTitle) {
      writeNumbers(FontSize.P);
      doc.text(`for ${jobTitle}`, PageParams.MARGIN, 230);
    }

    writeText();

    const HEADER_LINE_Y = 250 + Y_OFFSET_CONDITION;

    const tableData = [];

    items.forEach((field, index) => {
      tableData.push([
        field.item,
        `$${field.priceFormatted}`,
        field.qty,
        `$${field.total}`,
      ]);
    });
    tableData.push(
      ["", "", "", ""],
      ["", "", "", ""],
      ["", Labels.SUBTOTAL, "", `$${subtotal}`],
      ["", Labels.GST, "", `$${gst}`],
      ["", Labels.DISCOUNT, "", `$${discount}`],
      ["", "", Labels.AMOUNT_DUE, `$${amountDue}`]
    );

    type specs = {
      x: number;
      y: number;
      width: number;
      height: number;
    };
    // @ts-ignore
    const renderCol = (
      value: string,
      indexColumn: number,
      indexRow: number,
      row: Array<string | number>,
      rectRow: specs,
      rectCell: specs
    ) => {
      let { x, y, width, height } = rectCell;
      let padding = 15;
      const labels = [
        Labels.SUBTOTAL,
        Labels.GST,
        Labels.DISCOUNT,
        Labels.TOTAL,
      ];
      let offset = 0;
      let align = "right";

      //// Amount Due and the value
      if (value == Labels.AMOUNT_DUE) {
        offset = -96;
        width = width * 2;
        padding = padding * 2;
      }
      if (indexRow === tableData.length - 1 && indexColumn === 3) {
        padding = padding * 2;
      }
      //// Item value aligned left
      if (indexColumn === 0) {
        align = "left";
      }
      //// Subtotal block alignment
      if (labels.includes(value)) {
        offset = 28;
        align = "left";
      }

      doc.text(value, x + offset, y + padding, {
        align: align,
        width: width,
        // continued: true,
      });
    };

    const table = {
      headers: [
        {
          label: "Item",
          name: "item",
          align: "left",
          headerAlign: "left",
          headerColor: "white",
          renderer: renderCol,
        },
        {
          label: "Price",
          name: "price",
          align: "right",
          headerAlign: "right",
          headerColor: "white",
          renderer: renderCol,
        },
        {
          label: "Qty",
          name: "qty",
          align: "right",
          headerAlign: "right",
          headerColor: "white",
          renderer: renderCol,
        },
        {
          label: "Total",
          name: "total",
          align: "right",
          headerAlign: "right",
          headerColor: "white",
          renderer: renderCol,
        },
      ],
      rows: tableData,
    };

    doc.text("", PageParams.MARGIN, HEADER_LINE_Y);
    // @ts-ignore
    await doc.table(table, {
      columnsSize: [290, 70, 70, 80],
      columnSpacing: 5,
      prepareHeader: () => {
        writeBold();
        return doc;
      },
      prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
        //regular text
        writeText();

        if (indexRow === 0) {
          rectCell &&
            doc
              .lineCap("butt")
              .moveTo(rectCell.x, rectCell.y + 5)
              .lineTo(rectCell.x + rectCell.width, rectCell.y + 5)
              .stroke();
        }

        if (indexColumn !== 0) {
          const allRows = table.rows.length;
          const subtotalSectionRowIndex = allRows - Object.keys(Labels).length;
          const lastRowIndex = allRows - 1;
          // text
          if (
            indexRow &&
            indexRow >= subtotalSectionRowIndex &&
            indexRow < lastRowIndex &&
            indexColumn === 1
          ) {
            writeBold();
          } else {
            writeNumbers();
          }
          if (indexRow == lastRowIndex) {
            writeBold(FontSize.H3);
          }
          if (
            indexRow === subtotalSectionRowIndex ||
            indexRow === lastRowIndex
          ) {
            const padding = 15;
            const y = rectCell ? rectCell.y + padding : 0;
            const lineOffset = 28;
            rectCell &&
              doc
                .lineCap("butt")
                .moveTo(rectCell.x + (indexColumn === 1 ? lineOffset : 0), y)
                .lineTo(rectCell.x + rectCell.width, y)
                .stroke();
          }
        }
        return doc;
      },
      divider: {
        header: { disabled: true, width: 1, opacity: 0.5 },
        horizontal: { disabled: true },
      },
    });

    ////////// FOOTER /////////////
    writeBold(FontSize.H2);
    doc.text("Thank you", PageParams.MARGIN, PageParams.FOOTER_HEIGHT);
    doc
      .lineCap("butt")
      .moveTo(PageParams.MARGIN, PageParams.FOOTER_HEIGHT + 30)
      .lineTo(555, PageParams.FOOTER_HEIGHT + 30)
      .stroke();

    writeBold();
    const COEF = 0.7;

    doc
      .fillColor(Colors.GRAY)
      .text(
        "PAYABLE TO",
        PageParams.MARGIN,
        PageParams.FOOTER_HEIGHT + PageParams.LINE_HEIGHT * 2
      );
    writeText();
    doc.fillColor(Colors.BLACK);
    paymentValues.map((value, index) => {
      let height =
        PageParams.FOOTER_HEIGHT + PageParams.LINE_HEIGHT * (index * COEF + 3);
      doc.text(value.label, PageParams.MARGIN, height);
      doc.text(value.value, PageParams.MARGIN * 4, height);
    });

    writeBold();

    doc
      .fillColor(Colors.GRAY)
      .text(
        "CONTACT",
        430,
        PageParams.FOOTER_HEIGHT + PageParams.LINE_HEIGHT * 2
      );
    writeText();
    doc.fillColor(Colors.BLACK);
    contact.map((val, index) => {
      let height =
        PageParams.FOOTER_HEIGHT + PageParams.LINE_HEIGHT * (index * COEF + 3);
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
