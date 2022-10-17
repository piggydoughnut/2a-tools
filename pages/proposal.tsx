import { FieldArray, Form, Formik } from "formik";

import { Input } from "components/Input";
import Layout from "components/Layout";
import { useState } from "react";

const proposalItem = {};

const initialValues = {
  projectName: "",
  client: "",
  projectScope: "",
  items: [],
};
export default function paidInvoice() {
  // const [pdfUrl, setPdfUrl] = useState(null);
  return (
    <Layout title={"New Proposal"}>
      <Formik
        initialValues={initialValues}
        enableReinitialize
        // validationSchema={}
        onSubmit={() => console.log("a")}
      >
        {({ values, errors }) => (
          <Form>
            <div>
              <div className="flex flex-col mb-10">
                <h1 className="text-lg mb-4">Project</h1>
                {
                  <Input
                    key={"projectName"}
                    name={"projectName"}
                    label={"Project name"}
                    type={"text"}
                    customstyle={
                      "w-3/4 bg-white border-rounded-lg border-2 border-black"
                    }
                  />
                }
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
              <FieldArray name="items" render={() => {}}></FieldArray>
            </div>
          </Form>
        )}
      </Formik>
    </Layout>
  );
}
