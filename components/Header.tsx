import Image from "next/image";
import { getTodayDate } from "util/helpers";
import logo from "../public/logov2-1.svg";
import { useRouter } from "next/router";

export default function Header({ title }: { title: string }) {
  const router = useRouter();
  const d = getTodayDate();
  return (
    <div>
      <div className="flex justify-between">
        <div className="flex flex-col">
          <Image
            alt="2aLogo"
            src={logo}
            onClick={() => router.push("/")}
            width="200px"
            className="hover:cursor-pointer"
          />
          {router.pathname !== "/" &&
            router.pathname !== "/tools" &&
            title !== "New Invoice Preview" && (
              <button
                className="underline rounded-sm text-sm hover:text-blue-500 transition-all text-left ml-1"
                onClick={() => router.back()}
              >
                Go to Tools
              </button>
            )}
        </div>
        <div className="mt-2">Today is {d}</div>
      </div>

      <h1 className="font-inriaSans text-md mb-12 text-center mt-24">
        {title}
      </h1>
    </div>
  );
}
