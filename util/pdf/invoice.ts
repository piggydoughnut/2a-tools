import {
  Colors,
  DATE_FORMAT,
  FontSize,
  LOGO_IMAGE,
  Labels,
  Padding,
  PageParams,
  REM,
  getNewDoc,
  writeBold,
  writeNumbers,
  writeText,
} from "../pdfHelpers/pdfStyleConfig";
import { InvoiceType, specs } from "../defines";
import { contact, paymentValues } from "config";
import { format, parseISO } from "date-fns";

import { pEvent } from "p-event";

export const generatePdf = async ({
  invoiceNumberFull,
  issueDate,
  dueDate,
  client,
  items,
  gst,
  subtotal,
  amountDue,
  discount = "0",
  discountVal = "0",
  jobTitle,
}: InvoiceType): Promise<Buffer | undefined | string> => {
  try {
    const doc = getNewDoc();
    let bufferChunks: any = [];
    const discountAdded = discount !== "0" && discountVal !== "0";
    doc.on("readable", function () {
      // Store buffer chunk to array
      bufferChunks.push(doc.read());
    });
    doc
      .opacity(0.05)
      .rect(0, 0, PageParams.A4_WIDTH, 240 + Padding.big)
      .fill(Colors.BLACK)
      .opacity(1);

    doc.image(LOGO_IMAGE, PageParams.MARGIN, PageParams.MARGIN, {
      width: 150,
    });

    const HEADER_X = 400;
    const HEADER_Y = PageParams.MARGIN + 2;

    writeBold(doc, 8);
    doc.opacity(0.7);
    doc.text("DUE DATE", HEADER_X, HEADER_Y);
    doc.opacity(1);
    writeText(doc, 8);
    doc.text(
      format(parseISO(dueDate.toString()), DATE_FORMAT),
      doc.x,
      doc.y + Padding.small
    );

    writeBold(doc, 8);
    doc
      .opacity(0.7)
      .text("ISSUE DATE", HEADER_X, doc.y + Padding.big)
      .opacity(1);
    writeText(doc, 8);
    doc.text(
      format(parseISO(issueDate.toString()), DATE_FORMAT),
      doc.x,
      doc.y + Padding.small
    );

    writeBold(doc, 8);
    doc
      .opacity(0.7)
      .text("CLIENT", HEADER_X + 4 * REM, HEADER_Y, {
        align: "right",
      })
      .opacity(1);

    writeText(doc, 8);
    doc.text(client, doc.x, doc.y + Padding.small, {
      align: "right",
      lineGap: 3,
    });

    const INVOICE_Y = 180;

    writeBold(doc, FontSize.H1);
    doc.text("INVOICE", PageParams.MARGIN, INVOICE_Y, {
      align: "left",
      characterSpacing: 10,
    });
    //230
    writeText(doc, FontSize.P);
    doc
      .opacity(0.7)
      .text(
        `${invoiceNumberFull}`,
        PageParams.MARGIN,
        INVOICE_Y + REM * 3.125,
        {
          align: "left",
          continued: true,
        }
      );
    if (jobTitle) {
      writeText(doc, FontSize.P);
      doc.text(
        ` for ${jobTitle}`,
        PageParams.MARGIN + Padding.small,
        INVOICE_Y + REM * 3.125
      );
    }

    doc.opacity(1);
    writeText(doc);

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

    if (discountAdded) {
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

    const renderItem = (
      value: string,
      indexColumn: number,
      indexRow: number,
      row: Array<string | number>,
      rectRow: specs,
      rectCell: specs
    ) => {
      let { x, y, width, height } = rectCell;
      doc.text(value, x, y + Padding.big, {
        align: "left",
        width: width - Padding.big,
        height,
      });
    };

    const renderPrice = (
      value: string,
      indexColumn: number,
      indexRow: number,
      row: Array<string | number>,
      rectRow: specs,
      rectCell: specs
    ) => {
      let { x, y, width, height } = rectCell;
      let padding = Padding.big;
      let offset = 0;
      doc.text(value, x + offset, y + padding, {
        align: "left",
        width: width - Padding.big,
        height,
      });
    };
    const renderQty = (
      value: string,
      indexColumn: number,
      indexRow: number,
      row: Array<string | number>,
      rectRow: specs,
      rectCell: specs
    ) => {
      let { x, y, width, height } = rectCell;
      let padding = Padding.big;
      let offset = Padding.small;
      let align = "center";
      //// Amount Due label
      if (value == Labels.AMOUNT_DUE) {
        offset = -REM * 6.5;
        width = width * 2.5;
        padding = padding * 2;
      }
      doc.text(value, x + offset, y + padding, {
        align,
        width: width - Padding.big,
        height,
      });
    };
    // @ts-ignore
    const renderLastCol = (
      value: string,
      indexColumn: number,
      indexRow: number,
      row: Array<string | number>,
      rectRow: specs,
      rectCell: specs
    ) => {
      let { x, y, width, height } = rectCell;
      let padding = Padding.big;
      let offset = 0;
      let align = "left";

      //// Amount Due value
      if (indexRow === tableData.length - 1 && indexColumn === 3) {
        padding = padding * 2;
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
          renderer: renderItem,
        },
        {
          label: "Price",
          name: "price",
          align: "left",
          headerAlign: "left",
          headerColor: "white",
          renderer: renderPrice,
        },
        {
          label: "Qty",
          name: "qty",
          align: "center",
          headerAlign: "center",
          headerColor: "white",
          renderer: renderQty,
        },
        {
          label: "Total",
          name: "total",
          align: "right",
          headerAlign: "right",
          headerColor: "white",
          renderer: renderLastCol,
        },
      ],
      rows: tableData,
    };

    doc.text("", PageParams.MARGIN, INVOICE_Y + REM * 5.5);
    // @ts-ignore
    await doc.table(table, {
      columnsSize: [290, 90, 50, 85],
      columnSpacing: 5,
      prepareHeader: () => {
        writeBold(doc);
        return doc;
      },
      prepareRow: (row, indexColumn, indexRow: unknown, rectRow, rectCell) => {
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
          const subtotalSectionRowIndex =
            table.rows.length -
            Object.keys(Labels).length +
            (discountAdded ? -1 : 0);
          const lastRowIndex = table.rows.length - 1;
          const isLastRow = indexRow === lastRowIndex;
          const isSubTotalRow = indexRow === subtotalSectionRowIndex;
          const isInSubtotalSection = indexRow
            ? indexRow >= subtotalSectionRowIndex
            : false;
          // text
          if (
            indexRow &&
            isInSubtotalSection &&
            !isLastRow &&
            indexColumn === 1
          ) {
            writeBold(doc);
          } else {
            writeNumbers(doc);
          }
          // draw the line above subtotal and above Amount Due
          if (isLastRow || isSubTotalRow) {
            writeBold(doc, FontSize.H3);
            let padding = isLastRow
              ? Padding.big
              : Padding.big + Padding.medium;
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
    doc.text(
      "Thank you for choosing us",
      PageParams.MARGIN,
      PageParams.FOOTER_HEIGHT
    );
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
  } catch (e: any) {
    console.log(e);
  }
};
