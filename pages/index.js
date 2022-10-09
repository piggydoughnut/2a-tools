import * as c from "../config";

import Footer from "../components/Footer";
import Image from "next/image";
import logo from "../public/logov2-1.svg";

export default function Home() {
  return (
    <div
      id="content"
      className="flex flex-col justify-center font-inriaSans text-midnight-black mx-4 xl:mx-40 mt-10 mb-10"
    >
      <Image
        alt="2aLogo"
        src={logo}
        onClick={() => router.push("/")}
        width="200px"
        className="hover:cursor-pointer"
      />

      {/* <h1 className="mx-auto mt-10 text-md">Coming soon...</h1> */}
      <div className="mx-auto">
        <h1 className="text-md mt-10 mb-4">
          Website is coming soon <br /> For now please contact us at
        </h1>
        {c.contact.map((val) => (
          <p className="text-sm" key={val}>
            {val}
          </p>
        ))}
      </div>
      {/* <Footer /> */}
    </div>
  );
}
