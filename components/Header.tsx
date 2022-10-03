import { getTodayDate } from "util/helpers";
import { useRouter } from "next/router";

export default function Header({ title }: { title: string }) {
  const router = useRouter();
  const d = getTodayDate();
  return (
    <div>
      <div className="flex justify-between">
        <div className="flex flex-col">
          <h1
            className="font-inriaSans uppercase text-sm mb-4 cursor-pointer"
            onClick={() => router.push("/")}
          >
            2A Design Studio
          </h1>
          {router.pathname !== "/" && title !== "New Invoice Preview" && (
            <button
              className="underline rounded-sm text-sm hover:scale-110 ease-in-out duration-300 text-blue-400 text-left"
              onClick={() => router.back()}
            >
              Go back
            </button>
          )}
        </div>

        <div className="">Today is {d}</div>
      </div>

      <h1 className="font-inriaSans text-lg mb-4 text-center mt-24">{title}</h1>
    </div>
  );
}
