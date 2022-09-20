import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  return (
    <div
      id="content"
      className="flex flex-col justify-center font-inriaSans text-midnight-black mx-20 mt-10 mb-10"
    >
      <div className="flex flex-row">
        <h1 className="font-inriaSans uppercase text-lg">2A Design Studio</h1>
      </div>
      <h3 className="text-lg text-center mt-40">
        {" "}
        What would you like to do today?
      </h3>
      <div className="flex flex-col mx-auto gap-8 mt-16">
        <button
          className="pt-2 pl-4 pr-4 pb-2 bg-peachy border rounded-sm text-md hover:scale-110 ease-in-out duration-300"
          onClick={() => router.push("invoice")}
        >
          Create an Invoice{" "}
        </button>
        <button
          className="pt-2 pl-4 pr-4 pb-2 bg-orange-500 border rounded-sm text-md hover:scale-110 ease-in-out duration-300"
          onClick={() => router.push("paidInvoice")}
        >
          Mark Invoice as Paid{" "}
        </button>
        <button
          className="pt-2 pl-4 pr-4 pb-2 bg-blue-300  border rounded-sm text-md hover:scale-110 ease-in-out duration-300"
          onClick={() => router.push("invoice")}
        >
          Create a Proposal{" "}
        </button>
      </div>
    </div>
  );
}
