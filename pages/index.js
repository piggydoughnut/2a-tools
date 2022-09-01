import InvoiceTable from "../components/InvoiceTable";

export default function Home() {
  return (
    <div className="flex flex-col justify-center font-inriaSans text-midnight-black mx-60 mt-10 mb-10">
      <div className="flex flex-row">
        <h1 className="font-inriaSans uppercase text-lg">
          2A Design Invoice Generator
        </h1>
      </div>

      <div className="flex flex-col mt-12">
        <div className="flex flex-col mb-20">
          <div className="flex flex-row">
            <label className="w-36" htmlFor="projectnumber">
              Project number
            </label>
            <input
              className="w-20 bg-yellowy mb-2 border-0 rounded-sm"
              name="projectnumber"
              type="text"
            />
          </div>
          <div className="flex flex-row">
            <label className="w-36" htmlFor="projectname">
              Project name
            </label>
            <input
              className="w-44 bg-yellowy mb-2 border-0 rounded-sm"
              name="projectname"
              type="text"
            />
          </div>
        </div>
        <InvoiceTable />
      </div>
      <div className="flex flex-row justify-center"></div>
    </div>
  );
}
