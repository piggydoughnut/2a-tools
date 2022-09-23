import {
  Colors,
  FontSize,
  Fonts,
  LOGO_IMAGE,
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

    doc.opacity(0.05).rect(0, 0, PageParams.A4_WIDTH, 240).fill(Colors.BLACK);
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

    writeBold();
    doc.text("DUE DATE", HEADER_X, PageParams.MARGIN);
    writeText();
    doc.text(
      format(parseISO(dueDate.toString()), "yyyy-MM-dd"),
      HEADER_X,
      PageParams.MARGIN + PageParams.LINE_HEIGHT * 0.75
    );

    writeBold();
    doc.text(
      "ISSUE DATE",
      HEADER_X,
      PageParams.MARGIN + PageParams.LINE_HEIGHT * 2
    );
    writeText();
    doc.text(
      format(parseISO(issueDate.toString()), "yyyy-MM-dd"),
      HEADER_X,
      PageParams.MARGIN + PageParams.LINE_HEIGHT * 2.75
    );

    doc.text(billto, HEADER_X + 70, PageParams.MARGIN, {
      align: "right",
    });

    writeBold(FontSize.H1);
    doc.text("INVOICE", PageParams.MARGIN, 180, {
      align: "left",
      characterSpacing: 8,
    });

    writeNumbers(FontSize.H2);
    doc.text(`${invoiceNumberFull}`, PageParams.MARGIN + 200, 200);

    writeText();

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
      ["", "", "Amount Due", `$${amountDue}`]
    );

    const renderPriceCol = (
      value,
      indexColumn,
      indexRow,
      row,
      rectRow,
      rectCell
    ) => {
      const { x, y, width, height } = rectCell;
      const padding = 5;
      const labels = ["Subtotal", "GST", "Discount"];
      if (labels.includes(value)) {
        doc.text(value, x + 32, y + padding, {
          align: "left",
          width: width,
          continued: true,
        });
      } else {
        doc.text(value, x, y + padding, {
          width: width,
          align: "right",
          continued: true,
        });
      }
    };

    const renderAmountDue = (
      value,
      indexColumn,
      indexRow,
      row,
      rectRow,
      rectCell
    ) => {
      const { x, y, width, height } = rectCell;
      const padding = 5;
      if (value == "Amount Due") {
        doc.text(value, x - 70, y + padding, {
          width: width * 2,
          align: "right",
          continued: true,
        });
      }
    };

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
          renderer: renderPriceCol,
        },
        {
          label: "Qty",
          name: "qty",
          align: "right",
          headerAlign: "right",
          headerColor: "white",
          renderer: renderAmountDue,
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
      datas: [
        {
          price: {
            label: "price",
            options: { fontSize: 20, fontFamily: "Courier-Bold" },
          },
        },
      ],
      rows: tableData,
    };

    doc.text("", PageParams.MARGIN, HEADER_LINE_Y);
    await doc.table(table, {
      columnsSize: [270, 90, 50, 80],
      prepareHeader: () => {
        writeText();
        return doc;
      },
      prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
        //regular text
        writeText();
        // numbers
        if (indexColumn != 0) {
          writeNumbers();
        }
        // invoice subtotal block
        if (indexRow === table.rows.length - 1) {
          writeBold(FontSize.H3);
        }
        if (indexRow === table.rows.length - 4 && indexColumn !== 0) {
          let offset = 0;
          if (indexColumn === 1) {
            offset = 32;
          }
          doc
            .lineCap("butt")
            .moveTo(rectCell.x + offset, rectCell.y)
            .lineTo(rectCell.x + rectCell.width, rectCell.y)
            .stroke();
        }
        return doc;
      },
      divider: {
        header: { disabled: false, width: 1, opacity: 0.5 },
        horizontal: { disabled: true, width: 0.5, opacity: 0.5 },
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
      if (value.number) {
        writeNumbers();
      } else {
        writeText();
      }
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
