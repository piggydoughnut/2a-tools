import { Button, DownloadLink } from "./General/Button";

import { Colors } from "util/defines";
import Iframe from "react-iframe";
import React from "react";
import format from "date-fns/format";

const InvoicePreview = ({
  projectName,
  invoiceNumber,
  projectNumber,
  setPdfUrl,
  pdfUrl,
  date,
}: {
  projectName: string;
  invoiceNumber?: string;
  setPdfUrl: any;
  pdfUrl: string;
  date?: string;
  projectNumber?: string;
}) => {
  const invoicePreviewRef = React.createRef();
  const projectNameEdited = projectName
    .replace(/\b\w/g, (l) => l.toUpperCase())
    .replaceAll(" ", "_");

  const dateToFormat = date ? new Date(date) : new Date();
  const isValidDate = !isNaN(dateToFormat.getTime());
  const formattedDate = format(
    isValidDate ? dateToFormat : new Date(),
    "dd-MM-yyyy"
  );
  
  const invoiceNumberEdited = invoiceNumber
    ? invoiceNumber.replace("#", "")
    : "";
  
  let invoiceFileName: string;
  if (invoiceNumberEdited && projectNumber) {
    // Invoice format: ProjectNo_INV<inv_number>_projectName_date
    invoiceFileName = `${projectNumber}_INV${invoiceNumberEdited}_${projectNameEdited}_${formattedDate}`;
  } else if (projectNumber) {
    // Proposal with project number: ProjectNo_projectName_date
    invoiceFileName = `${projectNumber}_${projectNameEdited}_${formattedDate}`;
  } else {
    // Proposal without project number: projectName_date
    invoiceFileName = `${projectNameEdited}_${formattedDate}`;
  }
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
