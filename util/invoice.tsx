import {
  Colors,
  DATE_FORMAT,
  FontSize,
  LOGO_IMAGE,
  Labels,
  PageParams,
  getNewDoc,
  writeBold,
  writeNumbers,
  writeText,
} from "./pdfStyleConfig";
import { InvoiceType, specs } from "./defines";
import { format, parseISO } from "date-fns";

import { contact } from "config";
import { pEvent } from "p-event";

export const generatePdf = async ({
  invoiceNumberFull,
  issueDate,
  dueDate,
  client,
  items,
  paymentValues,
  gst,
  subtotal,
  amountDue,
  discount = 0,
  discountVal = 0,
  jobTitle,
}: InvoiceType): Promise<Buffer | undefined | string> => {
  try {
    const doc = getNewDoc();
    let bufferChunks: any = [];
    doc.on("readable", function () {
      // Store buffer chunk to array
      bufferChunks.push(doc.read());
    });
    const Y_OFFSET_CONDITION = 17;
    doc
      .opacity(0.05)
      .rect(0, 0, PageParams.A4_WIDTH, 240 + Y_OFFSET_CONDITION)
      .fill(Colors.BLACK);
    doc.fill(Colors.BLACK).opacity(1);

    doc.image(LOGO_IMAGE, PageParams.MARGIN, PageParams.MARGIN, {
      width: 150,
    });

    const HEADER_X = 400;
    const HEADER_YY = PageParams.MARGIN + 2;
    const HEADER_Y = HEADER_YY + PageParams.LINE_HEIGHT * 0.75;

    writeBold(doc, 8);
    doc.opacity(0.7);
    doc.text("DUE DATE", HEADER_X, HEADER_YY);
    doc.opacity(1);
    writeText(doc, 8);
    doc.text(
      format(parseISO(dueDate.toString()), DATE_FORMAT),
      HEADER_X,
      HEADER_Y
    );

    writeBold(doc, 8);
    doc.opacity(0.7);
    doc.text("ISSUE DATE", HEADER_X, HEADER_YY + PageParams.LINE_HEIGHT * 1.75);
    doc.opacity(1);
    writeText(doc, 8);
    doc.text(
      format(parseISO(issueDate.toString()), DATE_FORMAT),
      HEADER_X,
      HEADER_YY + PageParams.LINE_HEIGHT * 2.5
    );

    writeBold(doc, 8);
    doc.opacity(0.7);
    doc.text("CLIENT", HEADER_X + 90, HEADER_YY, { align: "right" });
    doc.opacity(1);

    writeText(doc, 8);
    doc.text(client, HEADER_X, HEADER_Y, {
      align: "right",
      lineGap: 2,
    });

    writeBold(doc, FontSize.H1);
    doc.text("INVOICE", PageParams.MARGIN, 180, {
      align: "left",
      characterSpacing: 10,
    });
    //230
    writeText(doc, FontSize.P);
    doc.opacity(0.7);
    doc.text(`${invoiceNumberFull}`, PageParams.MARGIN, 230, {
      align: "left",
      continued: true,
    });
    if (jobTitle) {
      writeText(doc, FontSize.P);
      doc.text(` for ${jobTitle}`, PageParams.MARGIN, 230);
    }

    doc.opacity(1);
    writeText(doc);

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
      ["", Labels.SUBTOTAL, "", `$${subtotal}`]
    );

    if (discount && discountVal) {
      tableData.push([
        "",
        `${Labels.DISCOUNT} (${discount}%)`,
        "",
        `$${discountVal}`,
      ]);
    }

    tableData.push(
      ["", Labels.GST, "", `$${gst}`],
      ["", "", Labels.AMOUNT_DUE, `$${amountDue}`]
    );

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
      let align = "left";

      //// Amount Due label
      if (value == Labels.AMOUNT_DUE) {
        offset = -98;
        width = width * 2;
        padding = padding * 2;
      }
      //// Amount Due value
      if (indexRow === tableData.length - 1 && indexColumn === 3) {
        padding = padding * 2;
      }
      // align qty center
      if (indexColumn === 2) {
        align = "center";
      }
      // align total right
      if (indexColumn === 3) {
        align = "right";
      }

      doc.text(value, x + offset, y + padding, {
        align,
        width,
        height,
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
          align: "left",
          headerAlign: "left",
          headerColor: "white",
          renderer: renderCol,
        },
        {
          label: "Qty",
          name: "qty",
          align: "center",
          headerAlign: "center",
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
      columnsSize: [290, 90, 50, 85],
      columnSpacing: 5,
      prepareHeader: () => {
        writeBold(doc);
        return doc;
      },
      prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
        //regular text
        writeText(doc);

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
          const subtotalSectionRowIndex =
            allRows - Object.keys(Labels).length + (discount ? 0 : 1);
          const lastRowIndex = allRows - 1;
          // text
          if (
            indexRow &&
            indexRow >= subtotalSectionRowIndex &&
            indexRow < lastRowIndex &&
            indexColumn === 1
          ) {
            writeBold(doc);
          } else {
            writeNumbers(doc);
          }
          if (indexRow == lastRowIndex) {
            writeBold(doc, FontSize.H3);
          }
          if (
            indexRow === subtotalSectionRowIndex ||
            indexRow === lastRowIndex
          ) {
            let padding = 10;
            if (lastRowIndex) {
              padding = 15;
            }
            const y = rectCell ? rectCell.y + padding : 0;
            rectCell &&
              doc
                .lineCap("butt")
                .moveTo(rectCell.x, y)
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
    writeBold(doc, FontSize.H2);
    doc.text("Thank you", PageParams.MARGIN, PageParams.FOOTER_HEIGHT);
    doc
      .lineCap("butt")
      .moveTo(PageParams.MARGIN, PageParams.FOOTER_HEIGHT + 30)
      .lineTo(555, PageParams.FOOTER_HEIGHT + 30)
      .stroke();

    writeBold(doc);
    const COEF = 0.7;

    doc
      .fillColor(Colors.GRAY)
      .text(
        "PAYABLE TO",
        PageParams.MARGIN,
        PageParams.FOOTER_HEIGHT + PageParams.LINE_HEIGHT * 2
      );
    writeText(doc);
    doc.fillColor(Colors.BLACK);
    paymentValues.map((value, index) => {
      let height =
        PageParams.FOOTER_HEIGHT + PageParams.LINE_HEIGHT * (index * COEF + 3);
      doc.text(value.label, PageParams.MARGIN, height);
      doc.text(value.value, PageParams.MARGIN * 4, height);
    });

    writeBold(doc);

    doc
      .fillColor(Colors.GRAY)
      .text(
        "CONTACT",
        430,
        PageParams.FOOTER_HEIGHT + PageParams.LINE_HEIGHT * 2
      );
    writeText(doc);
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
