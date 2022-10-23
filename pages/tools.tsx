import { Button } from "../components/General/Button";
import { Colors } from "../util/defines";
import DocumentRootLayout from "../components/DocumentRootLayout";
import Restore from "components/Restore";
import { useRouter } from "next/router";

export default function Tools() {
  const router = useRouter();
  return (
    <DocumentRootLayout>
      <div>
        <h3 className="text-md text-left mb-4 ">2A design tools</h3>
        <div className="flex justify-start align-start gap-6">
          <div className="flex flex-col gap-4 mt-4">
            <p className="text-sm uppercase">Invoice</p>
            <Button
              label={"Create new"}
              onClick={() => router.push("invoice")}
              color={Colors.ORANGE}
            />
            <Button
              label={"Mark as Paid"}
              onClick={() => router.push("paidInvoice")}
              color={Colors.RED}
            />
            <Restore
              onClick={() =>
                router.push({
                  pathname: "invoice",
                  query: { restore: true, draftName: "invoice-draft" },
                })
              }
            />
          </div>
          <div>
            <p className="text-sm uppercase mt-4 mb-4">Proposal</p>
            <Button
              label={"Create new"}
              onClick={() => router.push("proposal")}
              color={Colors.BLUE}
            />
            <Restore
              onClick={() =>
                router.push({
                  pathname: "proposal",
                  query: { restore: true, draftName: "proposal-draft" },
                })
              }
            />
          </div>
        </div>
      </div>
    </DocumentRootLayout>
  );
}
