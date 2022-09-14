import { Field, FieldArray, Form, Formik } from "formik";

import Image from "next/image";
import { generatePDF } from "util/invoice";

const c = require("../config");

// const dotProp = require("dot-prop-immutable");

// const schema = Yup.object().shape({
//   price: Yup.number().required("Required"),
//   qty: Yup.number().required("Required"),
// });

type InvoiceTableProps = {
  setTotal?: () => any;
};
type valueType = {
  item: string;
  qty: number;
  price: number;
};
const newValue: valueType = {
  item: "item description",
  qty: 1,
  price: 0,
};

const getTotal = (items: Array<valueType>): number => {
  let a = items.reduce(
    (total: number, currentValue: valueType) =>
      total + currentValue.qty * currentValue.price,
    0
  );
  console.log("invoice total is ", a);
  return a;
};

export type InvoiceProps = {
  invoiceNumber: number;
  issueDate: Date;
  dueDate: Date;
  billto: string;
  items: Array<{
    item: string;
    qty: number;
    price: number;
  }>;
  paymentValues: Array<{
    label: string;
    value: string;
    number?: boolean;
  }>;
};
function InvoiceTable({}: InvoiceTableProps) {
  const initValues: InvoiceProps = {
    invoiceNumber: 12345,
    issueDate: new Date(),
    dueDate: new Date(),
    billto: "",
    items: [{ ...newValue }],
    paymentValues: [
      {
        label: "Bank",
        value: c.payableTo.bankName,
      },
      {
        label: "Account Name",
        value: c.payableTo.accountName,
      },
      {
        label: "Account Number",
        value: c.payableTo.accountNumber,
        number: true,
      },
      {
        label: "Gst",
        value: c.payableTo.gst,
        number: true,
      },
    ],
  };
  return (
    <div className="mx-10">
      <Formik
        initialValues={initValues}
        enableReinitialize
        onSubmit={async (vs) => {
          console.log(vs);
          const r = await generatePDF(vs);
          console.log("response", r);
        }}
        render={({ values }) => (
          <Form>
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
                      <label htmlFor={"issudate"}>{"Issue date"}</label>
                    </div>
                    <Field type="date" name="issueDate" />
                    <div className="w-44">
                      <label htmlFor={"duedate"}>{"Due date"}</label>
                    </div>
                    <Field name="duedate" type="date" />
                  </div>
                  <div>
                    <div className="w-44">
                      <label htmlFor={"billto"}>{"Bill to"}</label>
                    </div>
                    <Field name="billto" as="textarea" rows={4} />
                  </div>
                </div>
              </div>
              <div className="flex flex-row align-bottom mt-20">
                <h1 className="text-xl font-InriaSans tracking-widest">
                  INVOICE
                </h1>
                <h3 className="text-lg self-align-bottom">
                  <Field name="invoicenumber" type="text" />
                </h3>
              </div>
            </div>
            <FieldArray
              name="items"
              render={(arrayHelpers) => (
                <div>
                  <div className="grid gap-3 grid-cols-8 mb-4">
                    <div className="col-span-4 text-left uppercase max-w-4xl">
                      Item
                    </div>
                    <div className=" justify-self-end text-right uppercase w-8">
                      Price
                    </div>
                    <div className="justify-self-end text-right uppercase w-8 ">
                      Qty
                    </div>
                    <div className="justify-self-end text-right uppercase w-10 float-right">
                      Total
                    </div>
                  </div>
                  {values.items &&
                    values.items.length > 0 &&
                    values.items.map((val, idx) => (
                      <div key={idx} className="grid gap-3 grid-cols-8 mb-4">
                        <Field
                          key={idx}
                          className="bg-yellowy border-0 rounded-sm col-span-4"
                          name={`items[${idx}].item`}
                          type="text"
                          value={val.item}
                        />
                        <Field
                          className="w-20 bg-yellowy border-0 rounded-sm appearance-none justify-self-end p-1"
                          name={`items[${idx}].price`}
                          pattern="[0-9]*"
                          type="text"
                          value={val.price}
                        />
                        <Field
                          className="appearance-none w-12 bg-yellowy border-0 rounded-sm justify-self-end"
                          name={`items[${idx}].qty`}
                          type="number"
                          value={val.qty ? val.qty : 1}
                        />
                        <div className="flex-1  w-10  border-0  justify-self-end">
                          ${val.qty * val.price}
                        </div>
                        <div
                          className="underline cursor-pointer"
                          onClick={() => arrayHelpers.remove(idx)}
                        >
                          Remove item
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
                  x
                </div>
              )}
            ></FieldArray>
            <hr></hr>
            <p>{values.totalInvoice}</p>
            <div className="flex flex-col justify-end mx-14">
              <div className="flex flex-row justify-end">
                <h3 className="w-32">Subtotal</h3>
                <h3>${getTotal(values.items)}</h3>
              </div>
              <div className="flex flex-row justify-end">
                <h3 className="w-32">Discount</h3>
                <h3>$0.00</h3>
              </div>
              <div className="flex flex-row justify-end">
                <h3 className="w-32">GST (15%)</h3>
                <h3>${(getTotal(values.items) * 0.15).toFixed()}</h3>
              </div>
              <hr></hr>
              <div className="flex flex-row justify-end">
                <h1 className="w-32">Amount due</h1>
                <h1>${(getTotal(values.items) * 1.15).toFixed()}</h1>
              </div>
            </div>
            <h1 className="mt-20 text-lg">Thank you</h1>
            <hr />
            <div className="flex flex-row justify-between">
              <div className="flex flex-col">
                <h3>PAYABLE TO</h3>
                <div className="flex flex-row">
                  <p className="w-32">Bank</p>
                  <p>KiwiBank</p>
                </div>
                <div className="flex flex-row">
                  <p className="w-32">Account name</p>
                  <p>2A Design</p>
                </div>
                <div className="flex flex-row">
                  <p className="w-32">Account number</p>
                  <p>38-9023-0249205-00</p>
                </div>
                <div className="flex flex-row">
                  <p className="w-32">GST</p>
                  <p>134-555-726</p>
                </div>
              </div>
              <div className="flex flex-col">
                <h3 className="text-gray">CONTACT</h3>
                <p>2A Design Studio</p>
                <p>office@2adesign.co.nz</p>
                <p>0812-898-389</p>
              </div>
            </div>
            <button
              type="submit"
              className="font-inriaSans mt-20 border-0 bg-peachy w-44 h-12 mx-auto rounded-sm"
            >
              CREATE INVOICE
            </button>
          </Form>
        )}
      ></Formik>
    </div>
  );
}

export default InvoiceTable;