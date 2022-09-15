import Iframe from "react-iframe";

const InvoicePreview = ({ setUrll, urll }: { setUrll: any; urll: string }) => (
  <div>
    <div className="flex flex-row justify-between align-baseline mt-20 ">
      <button
        className="font-inriaSans border-0 w-44 h-12  rounded-sm mb-10 bg-gray-100"
        onClick={() => setUrll(null)}
      >
        Edit The Invoice
      </button>
      <h3>202212-projectName-12</h3>
      <button
        className="font-inriaSans border-0 w-44 h-12 rounded-sm mb-10 bg-green-100"
        onClick={() => setUrll(null)}
      >
        Save to Google Drive
      </button>
    </div>

    <Iframe
      url={urll}
      width="100%"
      height="800px"
      id="myId"
      className="myClassname"
      position="relative"
    />
  </div>
);

export default InvoicePreview;
