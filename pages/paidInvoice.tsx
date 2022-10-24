import { PDFDocument, rgb } from "pdf-lib";
import React, { useRef, useState } from "react";

import DocumentRootLayout from "components/DocumentRootLayout";
import { DownloadLink } from "components/General/Button";
import { FileDrop } from "react-file-drop";
import { IconUpload } from "components/General/IconUpload";
import { getBase64String } from "util/helpers";

const editPdf = async (file: any) => {
  const f = await file.arrayBuffer();
  // Load a PDFDocument from the existing PDF bytes
  const pdfDoc = await PDFDocument.load(f);
  const pages = pdfDoc.getPages();
  const firstPage = pages[0];

  firstPage.drawText("PAID", {
    x: 350,
    y: 630,
    size: 50,
    color: rgb(0.95, 0.1, 0.1),
  });
  firstPage.drawRectangle({
    x: 330,
    y: 610,
    width: 160,
    height: 80,
    borderWidth: 3,
    borderColor: rgb(0.95, 0.1, 0.1),
  });

  // Serialize the PDFDocument to bytes (a Uint8Array)
  let pdfBytes = await pdfDoc.save();
  let modified = Buffer.from(pdfBytes).toString("base64");
  return getBase64String(modified);
};

const msg = "Drag an invoice that you want to mark as paid here";
export default function paidInvoice() {
  const [file, setFile] = useState(null);
  const [pdfUrl, setPdfUrl] = useState("");
  const [message, setMessage] = useState(msg);
  const fileInputRef = useRef(null);

  const onFileInputChange = (event) => {
    const { files } = event.target;
    console.log(files);
    processFile(files[0]);
  };

  const processFile = async (file: File | null) => {
    if (file) {
      setFile(file);
    }
    const newPdfUrl = await editPdf(file);
    setPdfUrl(newPdfUrl);
  };

  const onTargetClick = () => {
    if (fileInputRef) {
      fileInputRef.current.click();
    }
  };

  return (
    <DocumentRootLayout title="Mark pdf invoice as paid">
      {pdfUrl && (
        <DownloadLink
          title={"Download me"}
          url={pdfUrl}
          fileName={file?.name ? file.name : "aaa"}
        />
      )}
      <div className="flex justify-center align-center">
        <input
          onChange={onFileInputChange}
          ref={fileInputRef}
          type="file"
          className="hidden"
        />
        <div
          onMouseEnter={() => {
            console.log("ye");
            setMessage("Click to choose a file");
          }}
          onMouseLeave={() => {
            console.log("ye");
            setMessage(msg);
          }}
        >
          <FileDrop
            className=" border w-80 text-center h-64 flex justify-center align-middle border-orange-600"
            onDragOver={(event) => setMessage("Release the file")}
            onDragLeave={(event) => setMessage(msg)}
            onDrop={(files, event) => processFile(files[0])}
            onTargetClick={onTargetClick}
          >
            <div className="flex flex-col mx-auto">
              <IconUpload fill={"orange-600"} />
              <p className="font-bold text-sm h-16 w-56">{message}</p>
            </div>
          </FileDrop>
        </div>
      </div>
    </DocumentRootLayout>
  );
}
