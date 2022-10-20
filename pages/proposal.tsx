import { FieldArray, Form, Formik } from "formik";
import { getPDF, processNumber } from "util/helpers";

import { Input } from "components/Input";
import InvoicePreview from "components/InvoicePreview";
import Layout from "components/Layout";
import { Rings } from "react-loader-spinner";
import { useState } from "react";

const proposalItem = {
  description: "",
  workInvolved: "",
  outcome: "",
  fees: "",
};

const predefined = [
  {
    description: "Preliminary and Concept Design",
    workInvolved: `- Confirmation of the scope & brief
- Preliminary research of TCDC compliance requirements
- Site visit / physical site research
- Design checks and evaluation in relation to the brief`,
    outcome: `- List of relevant building and planning requirements
- Site plan drawing
- Concept scheme/s for discussion and approval 
- Floor plans`,
    fees: "",
  },
  {
    description: "Developed Design",
    workInvolved: `- Incorporation of any additional client feedback into scheme
- Refinement of spatial planning and functional requirements
- Outline specification of materials and finishes`,
    outcome: `- Updated plans and details
- Developed proposal for discussion / approval`,
    fees: "",
  },
  {
    description: "Architectural Documentation",
    workInvolved: `- Architectural details & specifications in accordance with NZ Building code
- Materials - decisions relating to finishes and other aspects
- Producing and collating all necessary documentation including meetings with TA personnel, engineer or other consultants if required`,
    outcome: `- Site and services plans
- Architectural drawings, Plans, Elevations as required, Sections, Details
- Schedules
- Specification
- Integration of other consultants’
information as required
- Building Consent application
documents`,
    fees: "",
  },
  {
    description: "Contract Works Administration",
    workInvolved: `Site observations
- 5 site visits are allowed within quote (excluding site visit already made`,
    outcome: `Administration documents and record-keeping `,
    fees: "",
  },
];

const initialValues = {
  projectName: "",
  client: "",
  projectScope: "",
  items: predefined,
  deliverablesNote:
    "We propose to charge the as-built portion of the services as a fixed fee as it is easy to quantify. We propose an hourly rate for the BC and RC documentation phases as it is unclear just how much documentation work is involved. The estimated fees are based on a rate of $200 / hr and we consider they would be a maximum.",
};
export default function Proposal() {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [showSpinner, setShowSpinner] = useState(false);
  const [params, setParams] = useState(initialValues);

  return (
    <Layout title={"New Proposal"}>
      {pdfUrl ? (
        <InvoicePreview
          setPdfUrl={(s: string) => {
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
            vs.total = 0;
            const tot = vs.items.reduce(
              (t: number, curr: any) => t + curr.fees,
              0
            );
            const gst = tot * 0.15;
            vs.subtotal = processNumber(tot);
            vs.amountDue = processNumber(tot + gst);
            vs.gst = processNumber(gst);
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
                <div className="mt-12 w-3/5">
                  <h3 className="text-md uppercase">Notes on deliverables</h3>
                  <p className="mb-4">
                    Add any notes on the deliverable fees or processes here.
                    This text will be displayed under the table.
                  </p>
                  <Input
                    key={"deliverablesNote"}
                    name={"deliverablesNote"}
                    type={"textarea"}
                    rows={5}
                  />
                </div>

                <h3 className="text-md uppercase mt-10">deliverables table</h3>
                <FieldArray
                  name="items"
                  render={(arrayHelpers) => (
                    <div className="pt-3">
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
                            className="col-span-2 justify-self-start text-left uppercase"
                          >
                            {val}
                          </div>
                        ))}
                      </div>
                      {values.items?.map((val, idx) => (
                        <div
                          key={idx}
                          className="flex flex-col sm:grid gap-8 sm:grid-cols-9 mb-4"
                        >
                          {/* <div className="justify-self-end text-right uppercase w-10 sm:hidden">
                            Description
                          </div> */}
                          <div className="col-span-2">
                            <Input
                              key={`items[${idx}].description`}
                              name={`items[${idx}].description`}
                              type="textarea"
                              rows={3}
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
                              rows={8}
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
                              rows={8}
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
                            customstyle="h-12"
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
                        className="underline cursor-pointer mt-4 mb-4 text-md"
                        type="button"
                        onClick={() => arrayHelpers.push({ ...proposalItem })}
                      >
                        Add table item
                      </button>
                    </div>
                  )}
                ></FieldArray>
              </div>

              <div className="flex justify-center mt-16">
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
              </div>
            </Form>
          )}
        </Formik>
      )}
    </Layout>
  );
}
