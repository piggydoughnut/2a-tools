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
          {router.pathname !== "/" && title !== "New Invoice Preview" && (
            <button
              className="underline rounded-sm text-sm hover:scale-110 ease-in-out duration-300 text-blue-400 text-left ml-1"
              onClick={() => router.back()}
            >
              Go back
            </button>
          )}
        </div>
        <div className="mt-2">Today is {d}</div>
      </div>

      <h1 className="font-inriaSans text-lg mb-4 text-center mt-24">{title}</h1>
    </div>
  );
}
