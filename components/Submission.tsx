import { Button } from "./General/Button";
import { Error } from "../components/Input";
import { Messages } from "config";
import { Rings } from "react-loader-spinner";

export default function Submission({
  showSpinner,
  buttonLabel,
  errors,
}: {
  showSpinner: boolean;
  buttonLabel: string;
  errors: any;
}) {
  return (
    <div className="h-24">
      <div className="h-12 mt-10">
        {Object.keys(errors).length > 0 && (
          <div className="text-center pb-2">
            <Error> {Messages.VALIDATION_MSG(Object.keys(errors))} </Error>
          </div>
        )}
      </div>
      <div className="flex justify-center">
        {!showSpinner ? (
          <Button label={buttonLabel} />
        ) : (
          <div className="flex flex-col justify-center">
            <p>Generating the document. Please be patient.</p>
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
    </div>
  );
}
