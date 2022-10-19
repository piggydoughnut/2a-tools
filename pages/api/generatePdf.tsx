import { CustomPdfDocumentType, InvoiceType, ProposalType } from "util/defines";
import { NextApiRequest, NextApiResponse } from "next";

import { generatePdf } from "../../util/invoice";
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { generateProposal } from "util/proposal";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const data: InvoiceType | ProposalType | undefined = req.body;
    if (req.method === "POST") {
      try {
        let pdfData;
        if (data?.type === CustomPdfDocumentType.invoice) {
          pdfData = await generatePdf(req.body);
        } else {
          console.log("f", req.body);
          pdfData = await generateProposal(req.body);
        }
        return res.end(pdfData);
      } catch (e: unknown) {
        console.log(e);
        return res.send({ err: e.message, stack: e.stack });
      }
    } else {
      return res.json({ what: "yo" });
    }
  } catch (e) {
    return res.json({ err: e.message, stack: e.stack });
  }
}
