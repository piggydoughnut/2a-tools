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
    tableData.push(
      ["", "", "", ""],
      ["", "", "", ""],
      ["", "", Labels.SUBTOTAL, `$${subtotal}`]
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
      ["", "", Labels.GST, `$${gst}`],
      ["", "", Labels.AMOUNT_DUE, `$${amountDue}`]
    );
    console.log(tableData);
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
    doc.fontSize(FontSize.H4);
    doc.text("", PageParams.MARGIN, 150);
    // @ts-ignore
    await doc.table(table, {
      columnsSize: [100, 170, 170, 60],
      columnSpacing: 5,
      // prepareHeader: () => {

      // doc
      //   .opacity(0.05)
      //   .rect(
      //     PageParams.MARGIN,
      //     150,
      //     PageParams.A4_WIDTH - 2 * PageParams.MARGIN,
      //     1 * REM
      //   )
      //   .fill(Colors.BLACK)
      //   .opacity(1);
      // return doc;
      // },
      // prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => doc,
      divider: {
        header: { disabled: false, width: 1, opacity: 0.5 },
        horizontal: { disabled: true },
      },
    });

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
