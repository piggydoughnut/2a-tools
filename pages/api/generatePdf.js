// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { generatePdf } from "../../util/invoice";

export default async function handler(req, res) {
  try {
    if (req.method === "POST") {
      try {
        const pdfData = await generatePdf(req.body);
        return res.end(pdfData);
      } catch (e) {
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
