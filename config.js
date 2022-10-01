export const payableTo = {
  bankName: "Kiwi Bank",
  accountName: "2A Design ltd",
  accountNumber: "38-9023-0249205-00",
  gst: "134-555-726",
};

export const paymentValues = [
  {
    label: "Bank",
    value: payableTo.bankName,
  },
  {
    label: "Account Name",
    value: payableTo.accountName,
  },
  {
    label: "Account Number",
    value: payableTo.accountNumber,
    number: true,
  },
  {
    label: "Gst",
    value: payableTo.gst,
    number: true,
  },
];

export const contact = [
  "2A Design Studio",
  "709 Rolleston St, Thames",
  "office@2adesign.co.nz",
  "0812-898-389",
];

export const inputKeysMap = {
  projectNumber: "Project number",
  projectName: "Project name",
  billto: "Bill to",
  issueDate: "Issue Date",
  dueDate: "Due date",
  invoiceNumber: "Invoice number",
  items: "Items",
};

export const Messages = {
  VALIDATION_MSG: (errs) => {
    const res = errs.map((v) => `"${inputKeysMap[v]}"`).join(", ");
    return `Please check that fields: ${res.substring(
      0,
      res.length
    )} have correct values.`;
  },
};
