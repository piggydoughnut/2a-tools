import { PDFDocument, StandardFonts, degrees, rgb } from "pdf-lib";
import React, { useState } from "react";

import DocumentRootLayout from "components/DocumentRootLayout";
import { DownloadLink } from "components/General/Button";
import { FileDrop } from "react-file-drop";

export default function paidInvoice() {
  const [file, setFile] = useState(null);
  const [pdfUrl, setPdfUrl] = useState("");

  const processFile = async (file: any) => {
    setFile(file);
    console.log(file);
    const f = await file.arrayBuffer();
    // Load a PDFDocument from the existing PDF bytes
    const pdfDoc = await PDFDocument.load(f);
    // Get the first page of the document
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    const { width, height } = firstPage.getSize();
    // Draw a string of text diagonally across the first page
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
    modified = "data:application/pdf;base64,".concat(modified);
    console.log(modified);

    setPdfUrl(modified);
  };

  function getBase64(file) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      console.log(reader.result);
    };
    reader.onerror = function (error) {
      console.log("Error: ", error);
    };
  }
  return (
    <DocumentRootLayout title="Coming soon...">
      {pdfUrl && (
        <DownloadLink
          title={"Download me"}
          url={pdfUrl}
          fileName={file?.name ? file.name : "aaa"}
        />
      )}
      <FileDrop
        // onFrameDragEnter={(event) => }
        // onFrameDragLeave={(event) => console.log("onFrameDragLeave", event)}
        // onFrameDrop={(event) => console.log("onFrameDrop", event)}
        // onDragOver={(event) => console.log("onDragOver", event)}
        // onDragLeave={(event) => console.log("onDragLeave", event)}
        onDrop={(files, event) => processFile(files[0])}
      >
        Drop some files here!
      </FileDrop>
    </DocumentRootLayout>
  );
}
