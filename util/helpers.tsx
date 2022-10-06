import { DATE_FORMAT } from "util/pdfStyleConfig";
import axios from "axios";
import { format } from "date-fns";
type newValueType = {
  item: string;
  qty: number;
  price: number;
};

export const processNumber = (n: string | number) =>
  n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

export const getTotal = (val: any): number =>
  Math.ceil(
    val.reduce((t: number, curr: newValueType) => t + curr.qty * curr.price, 0)
  );

export const getTotalInvoiceValue = (items: any, discount: number = 0) =>
  Math.ceil(getSubtotal(items, discount) * 1.15);

export const getGSTValue = (items: any, discount: number) =>
  Math.ceil(getSubtotal(items, discount) * 0.15);

const getSubtotal = (items: any, discount: number) =>
  Math.ceil(Number(getTotal(items)) - getDiscountValue(items, discount));

export const getDiscountValue = (
  items: number | string,
  discount: number | string
) => {
  const total = getTotal(items);
  return Math.ceil(Number(total) * (Number(discount) / 100));
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
    return "data:application/pdf;base64," + data.data;
  } catch (e) {
    console.log(e);
  }
};
