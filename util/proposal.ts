import {
  Colors,
  FontSize,
  Labels,
  PageParams,
  REM,
  getNewDoc,
  writeText,
} from "./pdfStyleConfig";

import { addFooter } from "./pdfHelpers/addFooter";
import { addHeader } from "./pdfHelpers/addHeader";
import { addTermsAndConditionsPage } from "./pdfHelpers/addTermsAndConditionsPage";
import { pEvent } from "p-event";
import { specs } from "./defines";

export type ProposalProps = {
  items: any;
  deliverablesNote: string;
  subtotal: string;
  discount: string;
  discountVal: string;
  amountDue: string;
  gst: string;
};

export const generateProposal = async ({
  items,
  deliverablesNote,
  subtotal,
  discount,
  discountVal,
  amountDue,
  gst,
}: ProposalProps): Promise<Buffer | undefined | string> => {
  try {
    const doc = getNewDoc();
    let bufferChunks: any = [];
    doc.on("readable", function () {
      // Store buffer chunk to array
      bufferChunks.push(doc.read());
    });

    addHeader(doc);
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

    doc.fontSize(FontSize.P);
    doc.text("NOTE");
    doc.fontSize(FontSize.P);
    doc.text(deliverablesNote);
    doc.addPage();
    addTermsAndConditionsPage(doc);
    doc.end();

    await pEvent(doc, "end");
    bufferChunks = bufferChunks.filter((a: any) => a);
    var pdfBuffer = Buffer.concat(bufferChunks);
    return pdfBuffer.toString("base64");
  } catch (e) {
    console.log(e);
  }
};
