export interface InvoiceEntryType {
  item: string;
  qty: number;
  price: number;
}

export interface ProcesedInvoiceEntryType extends InvoiceEntryType {
  priceFormatted: string;
  total: number;
}

export enum CustomPdfDocumentType {
  invoice = "invoice",
  proposal = "proposal",
}

export interface PdfDocumentData<T = CustomPdfDocumentType> {
  client: string;
  jobTitle: string;
  type: T;
}

export interface InvoiceType extends PdfDocumentData {
  invoiceNumberFull: number;
  issueDate: Date;
  dueDate: Date;
  items: Array<ProcesedInvoiceEntryType>;
  paymentValues: Array<{
    label: string;
    value: string;
    number?: boolean;
  }>;
  amountDue: number;
  subtotal: number;
  gst: number;
  discount?: number;
  discountVal?: number;
}

export interface ProposalType extends PdfDocumentData {
  thescope: string;
}

export type specs = {
  x: number;
  y: number;
  width: number;
  height: number;
};
