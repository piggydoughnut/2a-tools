export const payableTo = {
  bankName: "Kiwi Bank",
  accountName: "SVA Design ltd",
  accountNumber: "38-9017-0659929-00",
  gst: "119-391-652",
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
  "SVA Design Studio",
  "PO Box 460, Thames. 3500",
  "office@svadesign.co.nz",
  "0276 933 040",
];

export const inputKeysMap = {
  projectNumber: "Project number",
  projectName: "Project name",
  client: "Client",
  issueDate: "Issue Date",
  dueDate: "Due date",
  invoiceNumber: "Invoice number",
  items: "Items",
  discount: "Discount",
  fees: "Fees",
  projectScope: "Project Scope",
  hourlyRate: "Hourly Rate",
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
