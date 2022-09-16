export const payableTo = {
  bankName: "Kiwi Bank",
  accountName: "2A Design",
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
