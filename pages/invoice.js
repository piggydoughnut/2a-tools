import * as Yup from "yup";

import { Field, FieldArray, Form, Formik, yupToFormErrors } from "formik";
import { getInvoiceNumber, getTotal, processNumber } from "../util/helpers";

import Header from "../components/Header";
import Image from "next/image";
import InvoicePreview from "../components/InvoicePreview";
import axios from "axios";
import { paymentValues } from "../config";
import router from "next/router";
import { useState } from "react";

const ItemSchema = Yup.object().shape({
  item: Yup.string()
    .required("Required")
    .max(500, "500 characters max.")
    .min(1),
  qty: Yup.number().required("Required").max(1000).min(1, "Minimum 1"),
  price: Yup.number().required("Required").min(1, "Minimum 1"),
});

const InvoiceSchema = Yup.object().shape({
  invoiceNumber: Yup.string().min(0).required("Required"),
  projectNumber: Yup.number("Must be a number").required("Required"),
  projectName: Yup.string().required("Required").max(100),
  jobTitle: Yup.string().max(200),
  issueDate: Yup.date().required("Required"),
  dueDate: Yup.date().required("Required"),
  billto: Yup.string().required("Required").max(300),
  items: Yup.array().of(ItemSchema).min(1).required("Required"),
});
const newValue = {
  item: "",
  qty: 1,
  price: 0,
};

const initValues = {
  invoiceNumber: "",
  projectNumber: "",
  projectName: "",
  jobTitle: "Architectural services",
  issueDate: new Date(),
  dueDate: new Date(),
  billto: "",
  items: [{ ...newValue }],
  paymentValues,
};

const getPDF = async (params) => {
  try {
    const data = await axios.post("/api/generatePdf", { ...params });
    return "data:application/pdf;base64," + data.data;
  } catch (e) {
    console.log(e);
  }
};

const Error = ({ children }) => (
  <p className="text-sm text-red-400">{children}</p>
);

const showErrors = (errors, touched, fieldName) =>
  errors[fieldName] && touched[fieldName] ? (
    <Error>{errors[fieldName]}</Error>
  ) : null;

const showItemErrors = (touched, errors, idx, fieldName) =>
  touched.items &&
  touched.items[idx]?.item &&
  errors &&
  errors.items &&
  errors.items[idx] && <Error>{errors.items[idx][fieldName]}</Error>;

export default function InvoiceGeneratorPage() {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [params, setParams] = useState(initValues);
  const [gst, setGST] = useState(0);
  const [amountDue, setAmountDue] = useState(initValues);
  const [subtotal, setSubtotal] = useState(initValues);

  const getGST = (items) => {
    const gst = Number((getTotal(items) * 0.15).toFixed(2));
    setGST(gst);
    return processNumber(gst);
  };

  const getAmountDue = (items) => {
    const due = Number((getTotal(items) * 1.15).toFixed(2));
    setAmountDue(due);
    return processNumber(due);
  };

  const getSubtotal = (items) => {
    const tot = Number(getTotal(items).toFixed(2));
    setSubtotal(tot);
    return processNumber(tot);
  };

  return (
    <div
      id="content"
      className="flex flex-col justify-center font-inriaSans text-midnight-black mx-20 mt-10 mb-10"
    >
      <Header goTo="/" title="New invoice" />

      {pdfUrl ? (
        <InvoicePreview
          setPdfUrl={(s) => setPdfUrl(s)}
          pdfUrl={pdfUrl}
          projectName={params.projectName}
          invoiceNumber={params.invoiceNumberFull}
        />
      ) : (
        <Formik
          initialValues={params}
          enableReinitialize
          validationSchema={InvoiceSchema}
          onSubmit={async (vs) => {
            // @todo explore if you can make these fields Hidden form fields in Formik
            vs.amountDue = amountDue;
            vs.subtotal = subtotal;
            vs.gst = gst;
            vs.invoiceNumberFull = getInvoiceNumber(
              vs.projectName,
              vs.projectNumber,
              vs.invoiceNumber
            );
            setParams(vs);
            const pdfData = await getPDF(vs);
            setPdfUrl(pdfData);
          }}
        >
          {({ values, errors, touched }) => (
            <Form>
              <div className="flex flex-col mt-12">
                <div className="flex flex-col mb-20">
                  <div className="flex flex-row">
                    <label className="w-36" htmlFor="projectNumber">
                      Project number
                    </label>
                    <Field
                      className="w-44 bg-yellowy mb-2 border-0 rounded-sm pt-1 pb-1 pl-2 focus:outline-none focus:ring focus:border-yellow-700 mr-6"
                      name="projectNumber"
                      type="text"
                    />
                    {showErrors(errors, touched, "projectNumber")}
                  </div>
                  <div className="flex flex-row">
                    <label className="w-36" htmlFor="projectName">
                      Project name
                    </label>
                    <Field
                      className="w-96 bg-yellowy mb-2 border-0 rounded-sm pt-1 pb-1 pl-2 mr-6"
                      name="projectName"
                      type="text"
                    />
                    {showErrors(errors, touched, "projectName")}
                  </div>
                </div>
                <div>
                  <div className="bg-slate-100 p-14">
                    <div className="flex flex-row justify-between">
                      <Image
                        src="/logo.svg"
                        width="250"
                        height="100"
                        alt="2aLogo"
                        className="-ml-3"
                      />
                      <div className="flex flex-row gap-4">
                        <div className="flex flex-col">
                          <div className="w-44">
                            <label htmlFor={"issueDate"}>{"Issue date"}</label>
                          </div>
                          <Field type="date" name="issueDate" />
                          <div className="w-44">
                            <label htmlFor={"dueDate"}>{"Due date"}</label>
                          </div>
                          <Field name="dueDate" type="date" />
                        </div>
                        <div>
                          <div className="w-44">
                            <label htmlFor={"billto"}>{"Bill to"}</label>
                          </div>
                          <Field name="billto" as="textarea" rows={4} />
                          {showErrors(errors, touched, "billto")}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-row align-baseline mt-20">
                      <h1 className="text-xl font-InriaSans tracking-widest">
                        INVOICE
                      </h1>
                      <div className="flex flex-row justify-center align-baseline">
                        <p className="text-lg self-align-baseline pt-8 ml-4">
                          #{new Date().getFullYear()}-
                          {values.projectNumber
                            ? values.projectNumber + "-"
                            : null}
                        </p>
                        <div className="text-lg self-align-baseline pt-8 ml-4 w-42">
                          <Field
                            name="invoiceNumber"
                            type="text"
                            placeholder="invoice number"
                            className="w-42"
                          />
                        </div>
                        <div className="self-align-baseline mt-10 ml-4">
                          {console.log(errors)}
                          {showErrors(errors, touched, "invoiceNumber")}
                        </div>
                      </div>
                    </div>
                    <Field
                      className="bg-yellowy border-0 rounded-sm w-96 pt-1 pb-1 pl-2"
                      name="jobTitle"
                      type="text"
                      placeholder="job title - optional"
                    />
                  </div>
                  <FieldArray
                    name="items"
                    render={(arrayHelpers) => (
                      <div className="pr-14 pl-14 pt-3">
                        <div className="grid gap-4 grid-cols-8 mb-4">
                          <div className="col-span-4 text-left uppercase max-w-4xl">
                            Item
                          </div>
                          {["Price", "Qty", "Total", "Action"].map((val) => (
                            <div
                              key={val}
                              className="justify-self-end text-right uppercase w-10"
                            >
                              {val}
                            </div>
                          ))}
                        </div>
                        {values.items?.map((val, idx) => (
                          <div
                            key={idx}
                            className="grid gap-3 grid-cols-8 mb-4"
                          >
                            <Field
                              className="bg-yellowy border-0 rounded-sm pt-1 pb-1 pl-2 col-span-4"
                              name={`items[${idx}].item`}
                              type="text"
                              value={val.item}
                              placeholder={"sevice description"}
                            />
                            <Field
                              className="bg-yellowy border-0 rounded-sm pt-1 pb-1 pl-2 w-20 justify-self-end"
                              name={`items[${idx}].price`}
                              // pattern="[0-9]*.?[0-9]*"
                              type="number"
                              value={val.price}
                            />
                            <Field
                              className="bg-yellowy border-0 rounded-sm pt-1 pb-1 pl-2 w-12 justify-self-end"
                              name={`items[${idx}].qty`}
                              type="number"
                              value={val.qty ? val.qty : 1}
                            />
                            <div className="w-10 justify-self-end">
                              ${Number((val.qty * val.price).toFixed(2))}
                            </div>
                            {values.items.length > 1 && (
                              <div
                                className="underline cursor-pointer justify-self-end text-right"
                                onClick={() => arrayHelpers.remove(idx)}
                              >
                                Remove
                              </div>
                            )}
                            <div className="col-span-4">
                              {showItemErrors(touched, errors, idx, "item")}
                            </div>
                            <div className="col-span-1 justify-self-end">
                              {showItemErrors(touched, errors, idx, "price")}
                            </div>
                            <div className="col-span-1 justify-self-end">
                              {showItemErrors(touched, errors, idx, "qty")}
                            </div>
                          </div>
                        ))}
                        <button
                          className="underline cursor-pointer mt-4 mb-4"
                          type="button"
                          onClick={() => arrayHelpers.push({ ...newValue })}
                        >
                          Add item
                        </button>
                      </div>
                    )}
                  ></FieldArray>
                  <hr />

                  <div className="grid grid-rows-5 grid-cols-5 justify-items-end pr-14 mt-4">
                    <h3 className="w-32 col-span-4">Subtotal</h3>
                    <h3 className="col-span-1">${getSubtotal(values.items)}</h3>
                    <h3 className="w-32 col-span-4">Discount</h3>
                    <h3 className="col-span-1">$0</h3>
                    <h3 className="w-32 col-span-4">GST (15%)</h3>
                    <h3 className="col-span-1">${getGST(values.items)}</h3>
                    <h1 className="w-44 text-lg col-span-4">Amount due</h1>
                    <h1 className="text-lg col-span-1">
                      ${getAmountDue(values.items)}
                    </h1>
                  </div>
                  <div className="float-right pr-14">
                    <button
                      type="submit"
                      className="font-inriaSans mt-20 border-0 bg-peachy w-44 h-12 mx-auto rounded-sm"
                    >
                      CREATE INVOICE
                    </button>
                    {/* {errors && (
                      <div>
                        Please check that all the required field have values
                      </div>
                    )} */}
                  </div>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      )}
      <div className="flex flex-row justify-center"></div>
    </div>
  );
}
