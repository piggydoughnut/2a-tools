import Layout from "../components/Layout";
import { useRouter } from "next/router";

export default function Tools() {
  const router = useRouter();
  return (
    <Layout>
      <h3 className="text-lg text-center mt-24">
        {" "}
        What would you like to do today?
      </h3>
      <div className="flex flex-col gap-8 mt-16 justify-center">
        <button
          className="p-4 bg-peachy border rounded-md text-md ease-in-out duration-300 w-64 mx-auto hover:bg-transparent hover:text-orange-600 hover:border-orange-600"
          onClick={() => router.push("invoice")}
        >
          Create an Invoice{" "}
        </button>
        <button
          className="p-4 bg-orange-500 border rounded-md text-md ease-in-out duration-30 w-64 mx-auto hover:bg-transparent hover:text-orange-800 hover:border-orange-800"
          onClick={() => router.push("paidInvoice")}
        >
          Mark Invoice Paid{" "}
        </button>
        <button
          className="p-4 bg-blue-300  border rounded-md text-md ease-in-out duration-300 w-64 mx-auto hover:bg-transparent hover:text-blue-800 hover:border-blue-800"
          onClick={() => router.push("proposal")}
        >
          Create a Proposal{" "}
        </button>
      </div>
    </Layout>
  );
}
