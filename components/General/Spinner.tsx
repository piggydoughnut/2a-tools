import { Rings } from "react-loader-spinner";

const Spinner = ({ message }: { message?: string }) => (
  <div className="flex flex-col justify-center">
    {message && <p className="text-center">{message}</p>}
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

export default Spinner;
