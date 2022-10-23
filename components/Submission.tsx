import ls, { get, set } from "local-storage";

import { Button } from "./General/Button";
import { Colors } from "util/defines";
import { Error } from "../components/Input";
import { Messages } from "config";
import { Rings } from "react-loader-spinner";
import { useState } from "react";

export default function Submission({
  showSpinner,
  buttonLabel,
  errors,
  data,
}: {
  showSpinner: boolean;
  buttonLabel: string;
  errors: any;
  data: any;
}) {
  const [saving, setSaving] = useState(false);
  const saveDraft = () => {
    setSaving(true);
    console.log("saving as ", data.type + "-draft");
    set(data.type + "-draft", data);
    setTimeout(() => {
      setSaving(false);
    }, 2000);
  };
  const thereAreErrors = Object.keys(errors).length > 0;
  console.log(thereAreErrors);

  const Spinner = ({ message }: { message: string }) => (
    <div className="flex flex-col justify-center">
      <p className="text-center">{message}</p>
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
  );

  const Buttons = () => (
    <div className="flex flex-row gap-8 justify-center">
      <div>
        <Button
          type="button"
          label="Save as draft"
          color={Colors.GRAY}
          onClick={() => {
            saveDraft();
          }}
          disabled={thereAreErrors ? true : false}
        />
        <p className="text-tiny mt-2">Only one draft can be saved at a time.</p>
      </div>
      <div>
        <Button
          type="submit"
          label={buttonLabel}
          disabled={thereAreErrors ? true : false}
        />
        <div></div>
      </div>
    </div>
  );

  return (
    <div className="h-64 flex flex-col gap-8 justify-center">
      <div className="h-[40px]">
        {Object.keys(errors).length > 0 && (
          <div className="text-center pb-2">
            <Error> {Messages.VALIDATION_MSG(Object.keys(errors))} </Error>
          </div>
        )}
      </div>
      {saving && <Spinner message="Saving the draft" />}
      {showSpinner && (
        <Spinner message="Generating the document. Please be patient." />
      )}
      {!saving && !showSpinner && <Buttons />}
    </div>
  );
}
