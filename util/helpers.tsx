import { DATE_FORMAT } from "util/pdfStyleConfig";
import { format } from "date-fns";
type newValueType = {
  item: string;
  qty: number;
  price: number;
};

export const processNumber = (n: string | number) =>
  n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

export const getTotal = (val: any) =>
  val.reduce((t: number, curr: newValueType) => t + curr.qty * curr.price, 0);

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
