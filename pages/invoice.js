import { FieldArray, Form, Formik } from "formik";
import { Messages, paymentValues } from "../config";
import { getInvoiceNumber, getTotal, processNumber } from "../util/helpers";

import { Error } from "../components/Input";
import Header from "../components/Header";
import Image from "next/image";
import { Input } from "../components/Input";
import InvoicePreview from "../components/InvoicePreview";
import { InvoiceSchema } from "../util/invoiceValidationSchemas";
import { getPDF } from "../util/helpers";
import { useState } from "react";

const newValue = {
  item: "",
  qty: 1,
  price: 0,
};

const initValues = {
  invoiceNumber: "",
  projectNumber: "",
  projectName: "",
  jobTitle: "",
  issueDate: new Date(),
  dueDate: new Date(),
  billto: "",
  items: [{ ...newValue }],
  paymentValues,
};

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
      className="flex flex-col justify-center font-inriaSans text-midnight-black mx-4 xl:mx-40 mt-10 mb-10"
    >
      <Header goTo="/" title="Create New invoice" />

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
          {({ values, errors }) => (
            <Form>
              <div className="flex flex-col mt-12">
                <div className="flex flex-col mb-20">
                  <p className="text-sm uppercase mb-4">Project Details</p>
                  {[
                    {
                      fieldName: "projectNumber",
                      fieldLabel: "Project number",
                      fieldType: "text",
                      customstyle: "w-44",
                    },
                    {
                      fieldName: "projectName",
                      fieldLabel: "Project name",
                      fieldType: "text",
                      customstyle: "w-96",
                    },
                  ].map((val) => (
                    <Input
                      key={val.fieldName}
                      name={val.fieldName}
                      label={val.fieldLabel}
                      type={val.fieldType}
                      customstyle={val.customstyle}
                    />
                  ))}
                </div>
                <div>
                  <div className="bg-slate-100 p-14">
                    <div className="flex flex-col sm:flex-row justify-between">
                      <Image
                        src="/logo.svg"
                        width="250"
                        height="100"
                        alt="2aLogo"
                        className="-ml-3"
                      />
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex flex-col gap-2">
                          <Input
                            name="issueDate"
                            label="Issue date"
                            type="date"
                          />
                          <Input name="dueDate" label="Due date" type="date" />
                        </div>
                        <Input
                          name="billto"
                          label="Bill to"
                          type="textarea"
                          rows={4}
                          as="textarea"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-between align-baseline mt-20">
                      <h1 className="text-xl font-InriaSans tracking-widest">
                        INVOICE
                      </h1>
                      <div className="flex flex-row justify-start sm:justify-center align-baseline mt-6 sm:mt-0">
                        <p className="text-lg self-align-baseline pt-1 sm:pt-9 sm:ml-4">
                          #{new Date().getFullYear()}-
                          {values.projectNumber
                            ? values.projectNumber + "-"
                            : null}
                        </p>
                        <div className="text-lg self-align-baseline align-middle sm:pt-10 ml-4 w-44">
                          <Input
                            name="invoiceNumber"
                            type="text"
                            placeholder="invoice number"
                            customstyle="text-base"
                          />
                        </div>
                      </div>
                    </div>
                    <Input
                      name="jobTitle"
                      type="text"
                      placeholder="job title - optional"
                      customstyle="text-base w-64 sm:w-96"
                    />
                  </div>
                  <FieldArray
                    name="items"
                    render={(arrayHelpers) => (
                      <div className="pr-14 pl-14 pt-3">
                        <div className="sm:grid sm:gap-4 sm:grid-cols-8 mb-4 hidden">
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
                            className="flex flex-col sm:grid gap-3 sm:grid-cols-8 mb-4"
                          >
                            <div className="justify-self-end text-right uppercase w-10 sm:hidden">
                              Item
                            </div>
                            <div className="col-span-4">
                              <Input
                                key={`items[${idx}].item`}
                                name={`items[${idx}].item`}
                                type="text"
                                value={val.item}
                                placeholder={"sevice description"}
                              />
                            </div>
                            <div className="justify-self-end text-right uppercase w-10 sm:hidden">
                              Price
                            </div>
                            <Input
                              key={`items[${idx}].price`}
                              name={`items[${idx}].price`}
                              type="number"
                              customstyle="justify-self-end w-20"
                              value={val.price}
                            />
                            <div className="justify-self-end text-right uppercase w-10 sm:hidden">
                              Price
                            </div>
                            <Input
                              key={`items[${idx}].qty`}
                              name={`items[${idx}].qty`}
                              type="number"
                              customstyle="justify-self-end w-20"
                              value={val.qty ? val.qty : 1}
                            />
                            <div className="justify-self-end text-right uppercase w-10 sm:hidden">
                              Total
                            </div>
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
                  {Object.keys(errors).length > 0 && (
                    <div className="text-center mt-20 pb-2">
                      <Error>
                        {" "}
                        {Messages.VALIDATION_MSG(Object.keys(errors))}{" "}
                      </Error>
                    </div>
                  )}
                  <div className="flex justify-center">
                    <button
                      type="submit"
                      className="font-inriaSans mt-4 border-0 bg-peachy w-44 h-12 rounded-sm"
                    >
                      CREATE INVOICE
                    </button>
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
