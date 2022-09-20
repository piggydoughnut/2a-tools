import { useRouter } from "next/router";

export default function Header({
  goTo,
  title,
}: {
  goTo: string;
  title: string;
}) {
  const router = useRouter();
  return (
    <div>
      <div className="flex flex-col">
        <h1 className="font-inriaSans uppercase text-sm mb-4">
          2A Design Studio
        </h1>
        {router.pathname !== "/" && (
          <button
            className="pt-2 pl-4 pr-4 pb-2 border rounded-sm text-sm hover:scale-110 ease-in-out duration-300 w-24"
            onClick={() => router.push(goTo)}
          >
            Go back
          </button>
        )}
      </div>

      <h1 className="font-inriaSans text-lg mb-4 text-center">{title}</h1>
    </div>
  );
}
