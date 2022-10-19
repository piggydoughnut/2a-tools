import {
  Colors,
  FontSize,
  LOGO_IMAGE,
  PageParams,
  getNewDoc,
  writeText,
} from "./pdfStyleConfig";
import { contact, paymentValues } from "config";

import { addTermsAndConditionsPage } from "./pdfHelpers/addTermsAndConditionsPage";
import { pEvent } from "p-event";

export type ProposalProps = {};
const smallLineHeight = 8;
const rem = 16;

export const generateProposal = async ({}: ProposalProps): Promise<
  Buffer | undefined | string
> => {
  try {
    const doc = getNewDoc();
    let bufferChunks: any = [];
    doc.on("readable", function () {
      // Store buffer chunk to array
      bufferChunks.push(doc.read());
    });

    // doc.addPage();
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
