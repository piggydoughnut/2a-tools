export const Colors = {
  ORANGE: "orange",
  GRAY: "gray",
  BLUE: "blue",
  RED: "red",
};

export interface InvoiceEntryType {
  item: string;
  qty: number;
  price: number;
}

export interface ProcessedInvoiceEntryType extends InvoiceEntryType {
  priceFormatted?: string;
  total?: string;
}

export enum CustomPdfDocumentType {
  invoice = "invoice",
  proposal = "proposal",
}

export interface PdfDocumentData<T = CustomPdfDocumentType> {
  client: string;
  type: T;
  amountDue: string;
  gst: string;
  subtotal: string;
  discount?: string | null;
  discountVal?: string;
  projectName: string;
}

export interface ProposalItem {
  description: string;
  workInvolved: string;
  outcome: string;
  fees: number;
}

export interface InvoiceType extends PdfDocumentData {
  invoiceNumberFull: string;
  invoiceNumber: number;
  projectNumber: number;
  issueDate: string;
  dueDate: string;
  jobTitle: string;
  items: Array<ProcessedInvoiceEntryType>;
  total: string;
}

export interface ProposalType extends PdfDocumentData {
  items: Array<ProposalItem>;
  deliverablesNote: string;
  projectScope: string;
}

export type specs = {
  x: number;
  y: number;
  width: number;
  height: number;
};
