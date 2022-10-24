import { Button, CustomLink } from "components/General/Button";
import {
  CustomPdfDocumentType,
  ProposalItem,
  ProposalType,
} from "util/defines";
import { FieldArray, Form, Formik } from "formik";
import { deliverablesNote, predefined } from "../util/data/termsAndConditions";
import { getPDF, getTotalProposal, processNumber } from "util/helpers";
import ls, { get, set } from "local-storage";

import { Colors } from "util/defines";
import DocumentRootLayout from "components/DocumentRootLayout";
import Image from "next/image";
import { Input } from "components/Input";
import InvoicePreview from "components/InvoicePreview";
import { ProposalSchema } from "util/invoiceValidationSchemas";
import Restore from "components/Restore";
import Submission from "components/Submission";
import add from "../public/icon-add.svg";
import remove from "../public/icon-remove.svg";
import { useRouter } from "next/router";
import { useState } from "react";

const proposalItem: ProposalItem = {
  description: "",
  workInvolved: "",
  outcome: "",
  fees: 0,
};

const initialValues: ProposalType = {
  type: CustomPdfDocumentType.proposal,
  projectName: "",
  client: "",
  projectScope: "",
  items: predefined,
  deliverablesNote: deliverablesNote,
  amountDue: "",
  gst: "",
  subtotal: "",
};

export default function Proposal() {
  const [pdfUrl, setPdfUrl] = useState("");
  const [showSpinner, setShowSpinner] = useState(false);
  const [params, setParams] = useState(initialValues);
  const [restored, setRestored] = useState(false);
  const [projectName, setProjectName] = useState("");
  const router = useRouter();

  if (router.query.restore && !restored) {
    const draft: ProposalType | null = get(
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
  return (
    <DocumentRootLayout title={"New Proposal"}>
      {pdfUrl ? (
        <InvoicePreview
          setPdfUrl={(s: string) => {
            setShowSpinner(false);
            setPdfUrl(s);
          }}
          pdfUrl={pdfUrl}
          projectName={projectName}
        />
      ) : (
        <Formik
          initialValues={params}
          enableReinitialize
          validationSchema={ProposalSchema}
          onSubmit={async (vs: ProposalType) => {
            setShowSpinner(true);
            console.log(vs);
            setProjectName(vs.projectName);
            setParams(vs);
            const tot = getTotalProposal(vs.items);
            const gst = Math.ceil(tot * 0.15);
            vs.subtotal = processNumber(tot);
            vs.amountDue = processNumber(tot + gst);
            vs.gst = processNumber(gst);
            const pdfData: string | undefined = await getPDF(vs);
            if (pdfData) {
              setPdfUrl(pdfData);
            } else {
              // @to-do add error handling
            }
          }}
        >
          {({ values, errors, validateForm }) => (
            <Form>
              <div className="">
                <div className=" gap-10 bg-orange-100 border-orange-400 border p-4 pl-10 shadow">
                  <h1 className="text-md  uppercase mb-4">
                    1. Project Information
                  </h1>
                  <div className="w-3/5">
                    <Input
                      key={"projectName"}
                      name={"projectName"}
                      label={"Project name"}
                      type={"text"}
                    />
                    <Input
                      name="client"
                      label="Client name"
                      type="textarea"
                      rows={5}
                      as="textarea"
                    />
                  </div>
                </div>

                <div className="mt-12 bg-orange-100 border-orange-400 border p-4 pl-10 shadow">
                  <h3 className="text-md uppercase">2. Project scope</h3>
                  <div className="w-3/5">
                    <p className="mb-4">Describe the project scope.</p>
                    <Input
                      key={"projectScope"}
                      name={"projectScope"}
                      type={"textarea"}
                      customstyle={""}
                      rows={10}
                    />
                  </div>
                </div>

                <div className="bg-orange-100 border-orange-400 border p-4 pl-10 shadow mt-12">
                  <h3 className="text-md uppercase mb-2 text-left">
                    3. project deliverables
                  </h3>
                  <p className="mb-4">
                    The table values are prefilled according to most commonly
                    used values. <br /> Feel free to modify wording or
                    remove/add new rows.
                  </p>
                  <FieldArray
                    name="items"
                    render={(arrayHelpers) => (
                      <div className="pt-3">
                        <div className="sm:grid sm:gap-8 sm:grid-cols-8 mb-4 hidden">
                          {/* <div className="col-span-2 text-left uppercase max-w-4xl">
                          Item
                        </div> */}
                          {["DESCRIPTION", "Work involved", "OUTCOME"].map(
                            (val) => (
                              <div
                                key={val}
                                className="col-span-2 justify-self-start text-left uppercase"
                              >
                                {val}
                              </div>
                            )
                          )}
                          <div
                            key={"Fees"}
                            className="col-span-1 justify-self-start text-left uppercase"
                          >
                            Fees
                          </div>
                          <div
                            key={"Action"}
                            className="col-span-1 justify-self-start text-left uppercase flex gap-2"
                          >
                            Action <Image src={remove} alt="remove row" />
                          </div>
                        </div>
                        {values.items?.map((val, idx) => (
                          <div
                            key={idx}
                            className="flex flex-col sm:grid gap-8 sm:grid-cols-8 mb-4"
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
                          action={() => arrayHelpers.push({ ...proposalItem })}
                        />
                      </div>
                    )}
                  ></FieldArray>
                </div>

                <div className="mt-12   bg-orange-100 border-orange-400 border p-4 pl-10 shadow">
                  <div className="w-3/5">
                    <h3 className="text-md uppercase">
                      4. Notes on deliverables
                    </h3>
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
                </div>
              </div>
              <Submission
                showSpinner={showSpinner}
                buttonLabel="Create proposal"
                errors={errors}
                data={values}
              />
            </Form>
          )}
        </Formik>
      )}
    </DocumentRootLayout>
  );
}
