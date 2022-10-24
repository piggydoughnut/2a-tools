import { useRef, useState } from "react";

import { Button } from "components/General/Button";
import { Colors } from "util/defines";
import DocumentRootLayout from "components/DocumentRootLayout";
import { FileDrop } from "react-file-drop";
import { IconUpload } from "components/General/IconUpload";
import Image from "next/image";
import Spinner from "../components/General/Spinner";
import arrowRight from "../public/arrowRight.svg";
import { editPdf } from "util/pdfHelpers/editPdf";
import fileCheck from "../public/fileCheck.svg";
import fileIcon from "../public/fileIcon.svg";

const msg = "Drag an invoice that you want to mark as paid here";
export default function PaidInvoice() {
  const [file, setFile] = useState(null);
  const [pdfUrl, setPdfUrl] = useState("");
  const [showSpinner, setShowSpinner] = useState(true);
  const [message, setMessage] = useState(msg);
  const [error, setError] = useState(false);
  const fileInputRef = useRef(null);

  const onFileInputChange = (event) => {
    setError(false);
    const { files } = event.target;
    console.log(files);
    processFile(files[0]);
  };

  const processFile = async (file: File | null) => {
    setError(false);
    setShowSpinner(true);
    try {
      if (file) {
        setFile(file);
        const newPdfUrl = await editPdf(file);
        setTimeout(() => setShowSpinner(false), 1000);
        setPdfUrl(newPdfUrl);
      }
    } catch (e: unknown) {
      console.log(e);
      setError(true);
      setMessage(
        e?.message || "There was an error with upload, please try again later."
      );
      setShowSpinner(false);
    }
  };

  const onTargetClick = () => {
    setError(false);
    if (fileInputRef && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <DocumentRootLayout title="Mark invoice as paid">
      <div className="flex flex-col justify-center">
        <div className="flex flex-row justify-center gap-8">
          <div className="flex flex-row gap-3">
            <Image alt="file" src={fileIcon} width="40" height="40" />
            <Image alt="arrowRight" src={arrowRight} width="40" height="40" />
          </div>
          <div className="border w-80 text-center h-64 border-orange-600 shadow-orange-700">
            {pdfUrl ? (
              showSpinner ? (
                <div className="h-full flex align-middle justify-center">
                  <Spinner />
                </div>
              ) : (
                <div className="flex flex-col justify-center align-middle text-center mx-auto h-full">
                  <p className="text-orange-600"></p>
                  <div className="w-full mx-auto">
                    <a
                      className="font-bold text-sm ease-in-out duration-30 w-48 hover:bg-transparent text-orange-600 hover:text-orange-300 text-center uppercase underline"
                      href={pdfUrl}
                      download={file?.name ? file.name : "updatedInvoice.pdf"}
                    >
                      Download pdf
                    </a>
                  </div>
                </div>
              )
            ) : (
              <div className="flex justify-center align-center">
                <input
                  onChange={onFileInputChange}
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                />
                <IconUpload fill={"orange-600"} />
                <div
                  onMouseEnter={() =>
                    !error && setMessage("Click to choose a file")
                  }
                  onMouseLeave={() => !error && setMessage(msg)}
                >
                  <FileDrop
                    className="w-80 text-center h-64 flex justify-center align-middle"
                    onDragOver={(event) => setMessage("Release the file")}
                    onDragLeave={(event) => setMessage(msg)}
                    onDrop={(files, event) => processFile(files[0])}
                    onTargetClick={onTargetClick}
                  >
                    <div className="flex flex-col mx-auto">
                      {!error && <IconUpload fill={"orange-600"} />}
                      <p
                        className={`font-bold text-sm h-16 w-56 ${
                          error ? "text-red-800" : ""
                        }`}
                      >
                        {error && "Error: "}
                        {message}
                      </p>
                    </div>
                  </FileDrop>
                </div>
              </div>
            )}
            {((pdfUrl && !showSpinner) || error) && (
              <Button
                type="button"
                color={Colors.BLUE}
                label="Upload another PDF"
                onClick={() => setPdfUrl("")}
                customstyle={"mt-10"}
              />
            )}
          </div>

          <div className="flex flex-row gap-3">
            <Image alt="arrowRight" src={arrowRight} width="40" height="40" />
            <Image src={fileCheck} width="40" height="40" alt="fileCheck" />
          </div>
        </div>
      </div>
    </DocumentRootLayout>
  );
}
