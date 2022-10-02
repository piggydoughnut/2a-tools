import Header from "../components/Header";
import Layout from "../components/Layout";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  return (
    <Layout>
      <h3 className="text-lg text-center mt-40">
        {" "}
        What would you like to do today?
      </h3>
      <div className="flex flex-col gap-8 mt-16 justify-center">
        <button
          className="pt-2 pl-4 pr-4 pb-2 bg-peachy border rounded-sm text-md hover:scale-110 ease-in-out duration-300 w-80 mx-auto"
          onClick={() => router.push("invoice")}
        >
          Create an Invoice{" "}
        </button>
        <button
          className="pt-2 pl-4 pr-4 pb-2 bg-orange-500 border rounded-sm text-md hover:scale-110 ease-in-out duration-300 w-80  mx-auto"
          onClick={() => router.push("paidInvoice")}
        >
          Mark Invoice Paid{" "}
        </button>
        <button
          className="pt-2 pl-4 pr-4 pb-2 bg-blue-300  border rounded-sm text-md hover:scale-110 ease-in-out duration-300 w-80  mx-auto"
          onClick={() => router.push("proposal")}
        >
          Create a Proposal{" "}
        </button>
      </div>
    </Layout>
  );
}
