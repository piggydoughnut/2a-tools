import { Button, DownloadLink } from "./General/Button";

import { Colors } from "util/defines";
import Iframe from "react-iframe";
import React from "react";

const InvoicePreview = ({
  projectName,
  invoiceNumber,
  setPdfUrl,
  pdfUrl,
}: {
  projectName: string;
  invoiceNumber?: string;
  setPdfUrl: any;
  pdfUrl: string;
}) => {
  const invoicePreviewRef = React.createRef();
  const fileName = projectName
    .replace(/\b\w/g, (l) => l.toUpperCase())
    .replaceAll(" ", "-");
  const invoiceFileName = `${
    invoiceNumber
      ? invoiceNumber.replace("#", "").concat("-")
      : "2ADesign-Proposal-"
  }${fileName}.pdf`;
  return (
    <div>
      {" "}
      <h3 className="text-center">Document filename: {invoiceFileName}</h3>
      <div
        className="flex flex-row justify-center mt-8 mb-6 gap-4"
        // @ts-ignore
        ref={invoicePreviewRef}
      >
        <Button
          onClick={() => setPdfUrl(null)}
          label={"Edit document"}
          color={Colors.GRAY}
        />
        <DownloadLink
          url={pdfUrl}
          fileName={invoiceFileName}
          title={"Download"}
        />
      </div>
      <Iframe
        id="pdfPreviewFrame"
        url={pdfUrl}
        width="100%"
        height="800px"
        position="relative"
        // @ts-ignore
        onLoad={(e: any) => {
          document?.getElementById(e.target.id)?.blur();
          // @ts-ignore
          invoicePreviewRef?.current?.focus();
          scrollTo(0, 0);
        }}
      />
    </div>
  );
};

export default InvoicePreview;
