import {
  CustomPdfDocumentType,
  InvoiceEntryType,
  InvoiceType,
} from "../util/defines";
import { FieldArray, Form, Formik } from "formik";
import {
  getDateFormat,
  getDiscountValue,
  getGSTValue,
  getInvoiceNumber,
  getTotal,
  getTotalInvoiceValue,
  processNumber,
} from "../util/helpers";
import ls, { get, set } from "local-storage";

import { CustomLink } from "../components/General/Button";
import DocumentRootLayout from "../components/DocumentRootLayout";
import Image from "next/image";
import { Input } from "../components/Input";
import InvoicePreview from "../components/InvoicePreview";
import { InvoiceSchema } from "../util/invoiceValidationSchemas";
import Submission from "../components/Submission";
import add from "../public/icon-add.svg";
import { getPDF } from "../util/helpers";
import remove from "../public/icon-remove.svg";
import { useRouter } from "next/router";
import { useState } from "react";

const newValue: InvoiceEntryType = {
  item: "long tiring job",
  qty: 1,
  price: 1000,
};

const initValues: InvoiceType = {
  type: CustomPdfDocumentType.invoice,
  invoiceNumber: 100,
  invoiceNumberFull: "2024-100",
  projectNumber: 20,
  projectName: "New interesting project",
  jobTitle: "New Job",
  issueDate: getDateFormat(),
  dueDate: getDateFormat(),
  client: "Mikailo Smith",
  items: [{ ...newValue }],
  discount: "0",
  total: "",
  subtotal: "",
  amountDue: "",
  gst: "",
};

export default function InvoiceGeneratorPage() {
  const [pdfUrl, setPdfUrl] = useState("");
  const [params, setParams] = useState(initValues);
  const [gst, setGST] = useState(0);
  const [amountDue, setAmountDue] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [showSpinner, setShowSpinner] = useState(false);
  const [restored, setRestored] = useState(false);
  const router = useRouter();

  if (router.query.restore && !restored) {
    //@ts-ignore
    const draft: InvoiceType | null = get(
      router.query.draftName?.toString() || ""
    );
    if (draft) {
      setParams({ ...draft });
      setRestored(true);
      router.replace({
        pathname: router.pathname,
        query: {},
      });
    }
  }

  const setGSTValue = (items: Array<InvoiceEntryType>, discount: string) => {
    const gst = getGSTValue(items, discount);
    setGST(gst);
    return processNumber(gst);
  };

  const setAmountDueValue = (
    items: Array<InvoiceEntryType>,
    discount: string
  ) => {
    const due = getTotalInvoiceValue(items, discount);
    setAmountDue(due);
    return processNumber(due);
  };

  const setSubtotalValue = (items: Array<InvoiceEntryType>) => {
    const total = getTotal(items);
    setSubtotal(total);
    return processNumber(total);
  };
  const layoutTitle = pdfUrl && pdfUrl !== "" ? "" : "Create New Invoice2";

  return (
    <DocumentRootLayout title={layoutTitle}>
      {pdfUrl !== "" ? (
        <InvoicePreview
          setPdfUrl={(s: string) => {
            setShowSpinner(false);
            setPdfUrl(s);
          }}
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
            setShowSpinner(true);
            // @todo explore if you can make these fields Hidden form fields in Formik
            vs.type = CustomPdfDocumentType.invoice;
            vs.amountDue = processNumber(amountDue);
            vs.subtotal = processNumber(subtotal);
            vs.gst = processNumber(gst);
            if (vs.discount && vs.discount !== "0") {
              vs.discountVal = getDiscountValue(
                vs.items,
                vs.discount
              ).toString();
            } else {
              vs.discount = "0";
              vs.discountVal = "0";
            }
            vs.items = vs.items.map((item) => {
              item.priceFormatted = processNumber(item.price);
              item.total = processNumber(Math.ceil(item.qty * item.price));
              return item;
            });
            vs.invoiceNumberFull = getInvoiceNumber(
              vs.projectName,
              vs.projectNumber,
              vs.invoiceNumber
            );
            setParams(vs);
            const pdfData = await getPDF(vs);
            if (pdfData) {
              setPdfUrl(pdfData);
              // @todo add error handling
            }
          }}
        >
          {({ values, errors }) => (
            <Form>
              <div className="flex flex-col mt-12">
                <p className="text-sm uppercase">Project Details</p>

                <div className="flex gap-2">
                  {[
                    {
                      fieldName: "invoiceNumber",
                      fieldLabel: "Invoice number",
                      fieldType: "number",
                    },
                    {
                      fieldName: "projectNumber",
                      fieldLabel: "Project number",
                      fieldType: "number",
                    },
                  ].map((val) => (
                    <div key={val.fieldName}>
                      <Input
                        name={val.fieldName}
                        label={val.fieldLabel}
                        type={val.fieldType}
                      />
                    </div>
                  ))}
                </div>
                <Input
                  name="projectName"
                  label="Project name"
                  type="text"
                  placeholder=""
                  customstyle="text-base w-64 sm:w-96"
                />
                <Input
                  name="jobTitle"
                  label="Job title"
                  type="text"
                  placeholder="job title - optional"
                  customstyle="text-base w-64 sm:w-96"
                />
                <div className="flex gap-4 justify-start items-start">
                  <div className="flex flex-col">
                    <Input
                      name="issueDate"
                      label="Issue date"
                      type="date"
                      value={values.issueDate}
                      placeholder={values.issueDate}
                    />
                    <Input
                      name="dueDate"
                      label="Due date"
                      type="date"
                      value={values.dueDate}
                      placeholder={values.dueDate}
                    />
                  </div>

                  <Input
                    name="client"
                    label="Client"
                    type="textarea"
                    rows={5}
                    as="textarea"
                  />
                </div>

                <div className="pb-10 border">
                  <FieldArray
                    name="items"
                    render={(arrayHelpers) => (
                      <div className="pr-14 pl-14 pt-3">
                        <div className="sm:grid sm:gap-4 sm:grid-cols-8 mb-4 hidden">
                          <div className="col-span-4 text-left uppercase max-w-4xl">
                            Item
                          </div>
                          {["Price", "Qty", "Total"].map((val) => (
                            <div
                              key={val}
                              className="justify-self-end text-right uppercase w-10"
                            >
                              {val}
                            </div>
                          ))}
                          <div
                            key={"Action"}
                            className="col-span-1 justify-self-end text-left uppercase flex gap-2"
                          >
                            Action <Image src={remove} alt="remove row" />
                          </div>
                        </div>
                        {values.items?.map((val, idx) => (
                          <div
                            key={idx}
                            className={`flex flex-col sm:grid gap-3 sm:grid-cols-8 mb-4 ${
                              idx !== values.items.length - 1
                                ? "border-b-2"
                                : ""
                            }`}
                          >
                            <div className="justify-self-end text-right uppercase w-10 sm:hidden">
                              Item
                            </div>
                            <div className="col-span-4">
                              <Input
                                key={`items[${idx}].item`}
                                name={`items[${idx}].item`}
                                type="textarea"
                                rows={2}
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
                              customstyle="justify-self-end w-20 h-8"
                              value={val.price}
                            />
                            <div className="justify-self-end text-right uppercase w-10 sm:hidden">
                              Quantity
                            </div>
                            <Input
                              key={`items[${idx}].qty`}
                              name={`items[${idx}].qty`}
                              type="number"
                              customstyle="justify-self-end w-20 h-8"
                              value={val.qty ? val.qty : 1}
                            />
                            <div className="justify-self-end text-right uppercase w-10 sm:hidden">
                              Total
                            </div>
                            <div className="w-10 justify-self-end">
                              $
                              {processNumber(
                                Number(Math.ceil(val.qty * val.price))
                              )}
                            </div>
                            {values.items.length > 1 && (
                              <CustomLink
                                label="Remove"
                                action={() => arrayHelpers.remove(idx)}
                              />
                            )}
                          </div>
                        ))}
                        <CustomLink
                          label="Add new table item"
                          imageSrc={add}
                          action={() => arrayHelpers.push({ ...newValue })}
                        />
                      </div>
                    )}
                  ></FieldArray>
                  <hr />

                  <div className="grid grid-rows-[1fr 1fr 1fr 1fr] grid-cols-5 justify-items-end pr-14 mt-4 gap-4">
                    <h3 className="w-40 col-span-4 text-sm">Subtotal</h3>
                    <h3 className="col-span-1">
                      ${setSubtotalValue(values.items)}
                    </h3>

                    <div className="flex flex-row col-span-4 mt-2 w-40 gap-2">
                      <h3 className="mt-2">Discount</h3>
                      <div className="w-24">
                        <Input
                          key="discount"
                          name="discount"
                          type="number"
                          customstyle="justify-self-end text-left h-7 mt-1 w-full"
                          value={values.discount}
                          shownoerr={true}
                        />{" "}
                      </div>

                      <p className="mt-2">%</p>
                    </div>

                    <div className="flex align-middle gap-2 mt-3">
                      $
                      {getDiscountValue(
                        values.items,
                        values.discount ? values.discount : "0"
                      )}
                    </div>

                    <h3 className="w-40 col-span-4">GST (15%)</h3>
                    <h3 className="col-span-1">
                      $
                      {setGSTValue(
                        values.items,
                        values.discount ? values.discount : "0"
                      )}
                    </h3>

                    <h1 className="w-54 text-lg col-span-4 font-bold">
                      Amount due
                    </h1>
                    <h1 className="col-span-1 font-bold text-lg">
                      $
                      {setAmountDueValue(
                        values.items,
                        values.discount ? values.discount : "0"
                      )}
                    </h1>
                  </div>
                </div>
                <Submission
                  showSpinner={showSpinner}
                  buttonLabel="Create invoice"
                  errors={errors}
                  data={values}
                />
              </div>
            </Form>
          )}
        </Formik>
      )}
      <div className="flex flex-row justify-center"></div>
    </DocumentRootLayout>
  );
}
