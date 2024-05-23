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
      : "SVADesign-Proposal-"
  }${fileName}.pdf`;
  return (
    <div className="flex gap-10">
      {" "}
      <div>
        <div
          className="flex flex-col justify-center mt-8 mb-6 gap-4"
          // @ts-ignore
          ref={invoicePreviewRef}
        >
          <p className="font-bold">Invoice Preview</p>
          <div className="flex-col gap-2">
            <p className="opacity-70">Filename:</p>
            <p className="text-left">{invoiceFileName}</p>
          </div>
          <Button
            onClick={() => setPdfUrl("")}
            label={"Edit document"}
            color={Colors.GRAY}
          />
          <DownloadLink
            url={pdfUrl}
            fileName={invoiceFileName}
            title={"Download"}
          />
        </div>
      </div>
      <Iframe
        id="pdfPreviewFrame"
        url={pdfUrl}
        width="70%"
        height="500px"
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
