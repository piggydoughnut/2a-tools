// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import PDFDocument from "pdfkit";
import { generatePDF } from "../../util/invoice";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      console.log("****");
      console.log(req.body);
      const pdfData = await generatePDF(req.body);
      console.log("pdfData");
      console.log(pdfData);
      return res
        .writeHead(200, {
          "Content-Length": Buffer.byteLength(pdfData),
          "Content-Type": "application/pdf",
          "Content-disposition": "attachment;filename=invoice.pdf",
        })
        .end(pdfData);
    } catch (e) {
      console.log(e);
      return res.send({ err: e.message, stack: e.stack });
    }
  } else {
    return res.json({ what: "yo" });
  }
}
