import { FieldArray, Form, Formik } from "formik";

import { Input } from "components/Input";
import InvoicePreview from "components/InvoicePreview";
import Layout from "components/Layout";
import { Rings } from "react-loader-spinner";
import { getPDF } from "util/helpers";
import { useState } from "react";

const proposalItem = {
  description: "",
  workInvolved: "",
  outcome: "",
  fees: "",
};

const initialValues = {
  projectName: "",
  client: "",
  projectScope: "",
  items: [{ ...proposalItem }],
};
export default function Proposal() {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [showSpinner, setShowSpinner] = useState(false);
  const [params, setParams] = useState(initialValues);

  return (
    <Layout title={"New Proposal"}>
      {pdfUrl ? (
        <InvoicePreview
          setPdfUrl={(s) => {
            setShowSpinner(false);
            setPdfUrl(s);
          }}
          pdfUrl={pdfUrl}
          projectName={"asdad"}
          invoiceNumber={"123"}
        />
      ) : (
        <Formik
          initialValues={params}
          enableReinitialize
          // validationSchema={}
          onSubmit={async (vs) => {
            setShowSpinner(true);
            console.log(vs);
            setParams(vs);
            const pdfData = await getPDF(vs);
            setPdfUrl(pdfData);
          }}
        >
          {({ values, errors }) => (
            <Form>
              {console.log(values)}
              <div>
                <div className="flex flex-col mb-10">
                  <h1 className="text-lg mb-4">Project</h1>
                  <Input
                    key={"projectName"}
                    name={"projectName"}
                    label={"Project name"}
                    type={"text"}
                    customstyle={
                      "w-3/4 bg-white border-rounded-lg border-2 border-black"
                    }
                  />
                  <Input
                    name="client"
                    label="Client"
                    type="textarea"
                    rows={5}
                    as="textarea"
                    customstyle={
                      "w-3/4 bg-white border-rounded-lg border-2 border-black"
                    }
                  />
                  {
                    <Input
                      key={"projectScope"}
                      name={"projectScope"}
                      label="Scope"
                      type={"textarea"}
                      customstyle={
                        "w-full bg-white border-rounded-lg border-2 border-black"
                      }
                      rows={10}
                    />
                  }
                  <h1 className="text-lg">Project deliverables</h1>
                </div>
                <FieldArray
                  name="items"
                  render={(arrayHelpers) => (
                    <div className="pr-14 pl-14 pt-3">
                      <div className="sm:grid sm:gap-4 sm:grid-cols-8 mb-4 hidden">
                        {/* <div className="col-span-2 text-left uppercase max-w-4xl">
                          Item
                        </div> */}
                        {[
                          "DESCRIPTION",
                          "Work involved",
                          "OUTCOME",
                          "Fees",
                        ].map((val) => (
                          <div
                            key={val}
                            className="col-span-2 justify-self-start text-left uppercase "
                          >
                            {val}
                          </div>
                        ))}
                      </div>
                      {values.items?.map((val, idx) => (
                        <div
                          key={idx}
                          className="flex flex-col sm:grid gap-3 sm:grid-cols-9 mb-4"
                        >
                          {/* <div className="justify-self-end text-right uppercase w-10 sm:hidden">
                            Description
                          </div> */}
                          <div className="col-span-2">
                            <Input
                              key={`items[${idx}].description`}
                              name={`items[${idx}].description`}
                              type="textarea"
                              rows={2}
                              value={val.description}
                              placeholder={"sevice description"}
                            />
                          </div>
                          {/* <div className="justify-self-end text-right uppercase w-10 sm:hidden">
                            Work Involved
                          </div> */}
                          <div className="col-span-2">
                            <Input
                              key={`items[${idx}].workInvolved`}
                              name={`items[${idx}].workInvolved`}
                              type="textarea"
                              rows={2}
                              value={val.workInvolved}
                            />
                          </div>
                          {/* <div className="justify-self-end text-right uppercase w-10 sm:hidden">
                            Outcome
                          </div> */}
                          <div className="col-span-2">
                            <Input
                              key={`items[${idx}].outcome`}
                              name={`items[${idx}].outcome`}
                              type="textarea"
                              rows={2}
                              value={val.outcome}
                            />
                          </div>
                          {/* <div className="justify-self-end text-right uppercase w-10 sm:hidden">
                            Fees
                          </div> */}

                          <Input
                            key={`items[${idx}].fees`}
                            name={`items[${idx}].fees`}
                            type="number"
                            customstyle="col"
                            value={val.fees}
                          />
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
                        onClick={() => arrayHelpers.push({ ...proposalItem })}
                      >
                        Add item
                      </button>
                    </div>
                  )}
                ></FieldArray>
              </div>
              {!showSpinner ? (
                <button
                  className="p-4 bg-peachy border rounded-md text-md ease-in-out duration-300 w-64 mx-auto hover:bg-transparent hover:text-orange-600 hover:border-orange-600"
                  type="submit"
                >
                  Create a proposal{" "}
                </button>
              ) : (
                <div className="flex flex-col justify-center">
                  <p>Generating proposal. Please be patient.</p>
                  <Rings
                    height="80"
                    width="80"
                    color="#fabb92"
                    radius="6"
                    wrapperStyle={{ margin: "auto" }}
                    wrapperClass=""
                    visible={true}
                    ariaLabel="rings-loading"
                  />
                </div>
              )}
            </Form>
          )}
        </Formik>
      )}
    </Layout>
  );
}
