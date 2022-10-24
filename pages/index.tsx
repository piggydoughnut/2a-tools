import * as c from "../config";

import Image from "next/image";
import Router from "next/router";
import logo from "../public/logov2-1.svg";

export default function Home() {
  return (
    <div className="font-inriaSans flex flex-col justify-center text-midnight-black mx-4 xl:mx-40 mt-10 mb-10">
      <div className="mx-auto">
        <Image
          alt="2aLogo"
          src={logo}
          onClick={() => Router.push("/")}
          width="300"
        />
      </div>
      <div className="mx-auto">
        <h1 className="text-md mt-10 mb-4">
          Website is coming soon... <br /> For now please contact us at
        </h1>
        {c.contact.map(
          (val, idx) =>
            idx !== 0 && (
              <p className="text-sm" key={val}>
                {val}
              </p>
            )
        )}
      </div>
    </div>
  );
}
