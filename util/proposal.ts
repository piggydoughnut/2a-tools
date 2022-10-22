import {
  Colors,
  FontSize,
  LOGO_IMAGE,
  Labels,
  Padding,
  PageParams,
  REM,
  SIDE_DECORATION,
  getNewDoc,
  writeBold,
  writeText,
} from "./pdfStyleConfig";
import { ProposalType, specs } from "./defines";

import { addFooter } from "./pdfHelpers/addFooter";
import { addHeader } from "./pdfHelpers/addHeader";
import { addTermsAndConditionsPage } from "./pdfHelpers/addTermsAndConditionsPage";
import { pEvent } from "p-event";

export const generateProposal = async ({
  items,
  deliverablesNote,
  subtotal,
  discount,
  discountVal,
  amountDue,
  gst,
  projectName,
  client,
  projectScope,
}: ProposalType): Promise<Buffer | undefined | string> => {
  try {
    const doc = getNewDoc();
    let bufferChunks: any = [];
    doc.on("readable", function () {
      // Store buffer chunk to array
      bufferChunks.push(doc.read());
    });

    const HEADER_X = 400;
    const HEADER_YY = PageParams.MARGIN + 2;
    const HEADER_Y = HEADER_YY + PageParams.LINE_HEIGHT * 0.75;

    doc.image(LOGO_IMAGE, PageParams.MARGIN, PageParams.MARGIN, {
      width: 150,
    });

    doc
      .image(
        SIDE_DECORATION,
        PageParams.A4_WIDTH - 2 * PageParams.MARGIN,
        PageParams.MARGIN * 7,
        {
          width: 70,
        }
      )
      .opacity(0.8);

    writeBold(doc, 10);
    doc.opacity(0.7);
    doc.text("CLIENT", HEADER_X + 90, HEADER_YY, { align: "right" });
    doc.opacity(1);

    writeText(doc, 10);
    doc.text(client, HEADER_X, HEADER_Y, {
      align: "right",
      lineGap: 2,
    });

    doc.rect(0, 170, PageParams.A4_WIDTH, 70).fill(Colors.LIGHT_ORANGE);
    doc.fill(Colors.BLACK);

    writeBold(doc, FontSize.H1);
    doc.text("DESIGN PROPOSAL", PageParams.MARGIN, 180, {
      align: "left",
      characterSpacing: 10,
    });

    writeBold(doc, FontSize.H4);
    doc
      .opacity(0.7)
      .text("THE PROJECT", PageParams.MARGIN, 17 * REM)
      .opacity(1);
    writeText(doc, FontSize.P);
    doc.text(projectName, doc.x, doc.y + Padding.small);

    writeBold(doc, FontSize.H4);
    doc
      .opacity(0.7)
      .text("THE SCOPE", doc.x, doc.y + Padding.big)
      .opacity(1);
    writeText(doc, FontSize.P);
    doc.text(projectScope, doc.x, doc.y + Padding.small, { width: 400 });

    doc.moveDown();
    doc.moveDown();
    doc.text("Refer to next page for Project Deliverables.");
    addFooter(doc);
    doc.addPage();
    addHeader(doc, projectName);
    addFooter(doc);
    const tableData = [];

    items.forEach((field: any, index: number) => {
      // @ts-ignore
      tableData.push([
        field.description,
        field.workInvolved,
        field.outcome,
        `$${field.fees}`,
      ]);
    });
    tableData.push(["", "", "", ""], ["", "", Labels.SUBTOTAL, `$${subtotal}`]);

    if (discount && discountVal) {
      tableData.push([
        "",
        `${Labels.DISCOUNT} (${discount}%)`,
        "",
        `$${discountVal}`,
      ]);
    }

    tableData.push(
      ["", "", Labels.GST, `$${gst}`],
      ["", "", Labels.TOTAL, `$${amountDue}`]
    );
    console.log(tableData);
    const renderFees = (
      value: string,
      indexColumn: number,
      indexRow: number,
      row: Array<string | number>,
      rectRow: specs,
      rectCell: specs
    ) => {
      let { x, y, width, height } = rectCell;
      let padding = 0;
      const indexes = [
        tableData.length - 1,
        tableData.length - 2,
        tableData.length - 3,
      ];
      if (indexes.indexOf(indexRow) !== -1) {
        padding = -10;
      }
      doc.text(value, x + padding, y + 5, {
        width,
        height,
      });
    };
    const table = {
      headers: [
        {
          label: "Description",
          name: "description",
          align: "left",
          headerAlign: "left",
          headerColor: "white",
        },
        {
          label: "Work Involved",
          name: "workInvolved",
          align: "left",
          headerAlign: "left",
          headerColor: "white",
        },
        {
          label: "Outcome",
          name: "outcome",
          align: "left",
          headerAlign: "left",
          headerColor: "white",
        },
        {
          label: "Fees",
          name: "fees",
          align: "right",
          headerAlign: "right",
          headerColor: "white",
          // renderer: renderFees,
        },
      ],
      rows: tableData,
    };

    const TOP_SEPARATOR_Y = 5 * REM;

    writeText(doc, FontSize.H2);
    doc.text(
      "PROJECT DELIVERABLES",
      PageParams.MARGIN,
      TOP_SEPARATOR_Y + PageParams.LINE_HEIGHT,
      {
        align: "left",
      }
    );
    doc.text("", PageParams.MARGIN, 140);
    // @ts-ignore
    await doc.table(table, {
      columnsSize: [100, 175, 180, 60],
      columnSpacing: 5,
      prepareHeader: () => {
        writeText(doc, FontSize.P);
        doc
          .opacity(0.05)
          .rect(
            PageParams.MARGIN,
            140,
            PageParams.A4_WIDTH - 2 * PageParams.MARGIN,
            1 * REM
          )
          .fill(Colors.BLACK)
          .opacity(1);
        return doc;
      },
      prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
        writeText(doc, FontSize.P);
        if (
          indexRow &&
          indexRow !== tableData.length - 1 &&
          indexRow !== tableData.length - 3 &&
          indexRow % 2 !== 0
        ) {
          doc
            .opacity(0.05)
            .rect(rectCell.x, rectCell.y, rectCell?.width, rectCell?.height)
            .fill(Colors.BLACK)
            .opacity(1);
        }
        // return doc;
      },
      divider: {
        header: { disabled: true, width: 1, opacity: 0.5 },
        horizontal: { disabled: true },
      },
      padding: [2, 2],
    });

    doc.moveDown();
    doc.fontSize(FontSize.P).opacity(0.7);
    doc.text("NOTE");
    doc.fontSize(FontSize.P);
    doc.text(deliverablesNote, { width: 400 }).opacity(1);
    doc.addPage();
    addTermsAndConditionsPage(doc, projectName);
    doc.end();

    await pEvent(doc, "end");
    bufferChunks = bufferChunks.filter((a: any) => a);
    var pdfBuffer = Buffer.concat(bufferChunks);
    return pdfBuffer.toString("base64");
  } catch (e) {
    console.log(e);
  }
};
