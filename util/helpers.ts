import {
  InvoiceEntryType,
  ProcessedInvoiceEntryType,
  ProposalItem,
} from "./defines";

import axios from "axios";
import { format } from "date-fns";

export const processNumber = (n: string | number) => {
  const num = typeof n === "string" ? parseFloat(n) : n;
  const formatted = num.toFixed(2);
  const parts = formatted.split(".");
  const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${integerPart}.${parts[1]}`;
};

export const getTotal = (val: any): number =>
  val.reduce(
    (t: number, curr: InvoiceEntryType) => t + curr.qty * curr.price,
    0
  );

export const getTotalProposal = (items: Array<ProposalItem>) =>
  items.reduce((t: number, curr: any) => t + curr.fees, 0);

export const getTotalInvoiceValue = (items: any, discount: string) =>
  getSubtotal(items, Number(discount)) * 1.15;

export const getGSTValue = (items: any, discount: string) =>
  getSubtotal(items, Number(discount)) * 0.15;

const getSubtotal = (items: any, discount: number) =>
  Number(getTotal(items)) - getDiscountValue(items, discount);

export const getDiscountValue = (
  items: Array<ProcessedInvoiceEntryType>,
  discount: number | string
) => {
  const total = getTotal(items);
  return Number(total) * (Number(discount) / 100);
};

export const getInvoiceNumber = (
  pName: string,
  pNumber: number,
  invoiceNumber: number
) =>
  `#${new Date().getFullYear()}-${
    pName ? pNumber + "-" : null
  }${invoiceNumber}`;

export const prepareTheTable = () => {};

export const getTodayDate = () => format(new Date(), "do MMM yyyy");

export const getDateFormat = () => format(new Date(), "yyyy-MM-dd");

export const getPDF = async (params: any) => {
  try {
    const data = await axios.post("/api/generatePdf", { ...params });
    return getBase64String(data.data);
  } catch (e: any) {
    console.log(e);
  }
};

export const getBase64String = (base64string: string) =>
  "data:application/pdf;base64,".concat(base64string);
