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
import { format, parseISO } from "date-fns";
import { payableTo, studioContact } from "config";

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
      // .opacity(0.05)
      .rect(0, 0, PageParams.A4_WIDTH, PageParams.A4_HEIGHT)
      //@ts-ignore
      .fill(Colors.LIGHT_GREEN)
      .rect(0, 0, 200, PageParams.A4_HEIGHT)
      .fill("white")
      .opacity(1)
      .fill("black");

    doc.image(LOGO_IMAGE, PageParams.MARGIN, PageParams.MARGIN, {
      width: 80,
    });

    const SECTION_2 = 200;
    writeBold(doc, 10);
    doc
      .opacity(0.7)
      .text("ISSUED", PageParams.MARGIN, SECTION_2 + Padding.big)
      .opacity(1);
    writeText(doc);
    doc.text(
      format(parseISO(issueDate.toString()), DATE_FORMAT),
      doc.x,
      doc.y + Padding.small
    );

    writeBold(doc, 10);
    doc.opacity(0.7);
    doc.text("DUE", PageParams.MARGIN, doc.y + Padding.big);
    doc.opacity(1);
    writeText(doc);
    doc.text(
      format(parseISO(dueDate.toString()), DATE_FORMAT),
      doc.x,
      doc.y + Padding.small
    );

    writeBold(doc, 10);
    doc
      .opacity(0.7)
      .text("CLIENT", PageParams.MARGIN, doc.y + Padding.big)
      .opacity(1);

    writeText(doc);
    doc.text(client, doc.x, doc.y + Padding.small, {
      lineGap: 3,
    });

    writeBold(doc, 10);
    doc.text("PAYABLE TO", PageParams.MARGIN, doc.y + Padding.big);
    writeText(doc);
    doc.fillColor(Colors.BLACK);
    doc.text(payableTo.accountName);
    doc.text(payableTo.accountNumber);
    doc.text("GST: " + payableTo.gst);
    writeBold(doc);

    doc
      .fillColor(Colors.GRAY)
      .text("CONTACT", PageParams.MARGIN, PageParams.FOOTER_HEIGHT);
    writeText(doc);
    doc.fillColor(Colors.BLACK);
    doc.text(studioContact.studioName);
    doc.text(studioContact.phone);
    doc.text(studioContact.email);
    doc.text(studioContact.address);

    writeBold(doc, FontSize.H1);
    doc.text(`INVOICE ${invoiceNumberFull}`, 200, PageParams.MARGIN, {
      align: "right",
      characterSpacing: 3,
    });

    if (jobTitle) {
      writeText(doc, FontSize.P);
      doc.opacity(0.8);
      doc.text(` for ${jobTitle}`, doc.x, doc.y, {
        align: "right",
      });
      doc.opacity(1);
    }
    const INVOICE_Y = 180;

    doc.opacity(1);

    writeText(doc);

    const tableData = [];

    items.forEach((field, index) => {
      tableData.push([field.item, `$${field.priceFormatted}`]);
    });

    tableData.push([Labels.SUBTOTAL, `$${subtotal}`]);
    tableData.push([Labels.GST, `$${gst}`], [Labels.TOTAL, `$${amountDue}`]);

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
        align: "right",
        width: width - Padding.big,
        height,
      });
    };

    const table = {
      headers: [
        {
          name: "item",
          headerColor: "white",
          renderer: renderItem,
        },
        {
          name: "price",
          headerColor: "white",
          renderer: renderPrice,
        },
      ],
      rows: tableData,
    };

    writeText(doc, FontSize.P);
    doc.text("", PageParams.MARGIN + Padding.small, INVOICE_Y + REM * 3.125);

    doc.text("", 205 + Padding.big, SECTION_2);
    // @ts-ignore
    await doc.table(table, {
      columnsSize: [240, 100],
      columnSpacing: 10,
      prepareHeader: () => {
        writeBold(doc);
        return doc;
      },
      prepareRow: (row, indexColumn, indexRow: unknown, rectRow, rectCell) => {
        //regular text
        writeText(doc);

        // if (indexRow === 0) {
        rectCell &&
          doc
            .lineCap("butt")
            .opacity(0.25)
            .moveTo(rectCell.x, rectCell.y + 5)
            .lineTo(rectCell.x + rectCell.width, rectCell.y + 5)
            .stroke()
            .opacity(1);
        // }

        // if (indexColumn !== 0) {
        // const subtotalSectionRowIndex =
        //   table.rows.length -
        //   Object.keys(Labels).length +
        //   (discountAdded ? -1 : 0);
        // const lastRowIndex = table.rows.length - 1;
        // const isLastRow = indexRow === lastRowIndex;
        // const isSubTotalRow = indexRow === subtotalSectionRowIndex;
        // const isInSubtotalSection = indexRow
        //   ? indexRow >= subtotalSectionRowIndex
        //   : false;
        // // text
        // if (
        //   indexRow &&
        //   isInSubtotalSection &&
        //   !isLastRow &&
        //   indexColumn === 1
        // ) {
        //   writeBold(doc);
        // } else {
        //   writeNumbers(doc);
        // }
        // draw the line above subtotal and above Amount Due
        // if (isLastRow || isSubTotalRow) {
        //   writeBold(doc, FontSize.H3);
        //   let padding = isLastRow
        //     ? Padding.big
        //     : Padding.big + Padding.medium;
        //   const y = rectCell ? rectCell.y + padding : 0;
        //   rectCell &&
        //     doc
        //       .lineCap("butt")
        //       .moveTo(rectCell.x, y)
        //       .lineTo(rectCell.x + rectCell.width, y)
        //       .stroke();
        // }
        // }
        return doc;
      },
      divider: {
        header: { disabled: true, width: 1, opacity: 0.5 },
        horizontal: { disabled: true },
      },
    });

    ////////// FOOTER /////////////
    writeBold(doc, FontSize.H2);
    doc.text("thank you for choosing us.", doc.x, PageParams.FOOTER_HEIGHT, {
      align: "right",
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
