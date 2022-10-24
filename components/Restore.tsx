import { Button } from "./General/Button";
import { Colors } from "util/defines";

export default function Restore({ onClick }: { onClick: () => void }) {
  return (
    <div className="mt-4 mb-4 flex flex-col justify-end">
      <Button
        label="Restore from draft"
        type="button"
        color={Colors.GRAY}
        onClick={() => onClick()}
      />
      <p className="opacity-70 w-80 text-tiny mt-2">
        When clicking restore from draft the <br />
        latest draft will be restored.
      </p>
    </div>
  );
}
