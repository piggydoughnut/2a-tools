import * as Yup from "yup";

const ItemSchema = Yup.object().shape({
  item: Yup.string()
    .required("Required")
    .max(500, "500 characters max.")
    .min(1),
  qty: Yup.number()
    .required("Required")
    .max(1000)
    .min(1, "Minimum 1")
    .typeError("A number is required"),
  price: Yup.number()
    .required("Required")
    .min(1, "Minimum 1")
    .typeError("A number is required"),
});

const ProposalItemSchema = Yup.object().shape({
  description: Yup.string().required("Required"),
  workInvolved: Yup.string().required("Required"),
  outcome: Yup.string().required("Required"),
  fees: Yup.number()
    .required("Required")
    .min(1, "Minimum 1")
    .typeError("A number is required"),
});

export const InvoiceSchema = Yup.object().shape({
  invoiceNumber: Yup.string().min(0).required("Required"),
  projectNumber: Yup.number()
    .required("Required")
    .typeError("A number is required"),
  projectName: Yup.string().required("Required").max(100),
  jobTitle: Yup.string().max(200),
  issueDate: Yup.date().required("Required"),
  dueDate: Yup.date().required("Required"),
  client: Yup.string().required("Required").max(300),
  items: Yup.array().of(ItemSchema).min(1).required("Required"),
  discount: Yup.number().max(100),
});

export const ProposalSchema = Yup.object().shape({
  projectName: Yup.string().required("Required").max(100),
  client: Yup.string().required("Required").max(300),
  projectScope: Yup.string().required("Required"),
  items: Yup.array().of(ProposalItemSchema).min(1).required("Required"),
  deliverablesNote: Yup.string(),
  hourlyRate: Yup.number().required("Required"),
});
