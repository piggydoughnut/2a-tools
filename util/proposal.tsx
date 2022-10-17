import Layout from "components/Layout";
import { useState } from "react";

export default function ProposalGeneratorPage() {
  const [pdfUrl, setPdfUrl] = useState(null);
  return <Layout title={"New Proposal"}>{!pdfUrl && <h1>hello</h1>}</Layout>;
}
