import { Colors } from "util/defines";
import Image from "next/image";
export const InternalButton = ({
  title,
  action,
}: {
  title: string;
  action: () => void;
}) => (
  <button
    className="p-4 bg-gray-200 border rounded-md text-sm ease-in-out duration-30 w-48 hover:bg-transparent hover:text-brown-800 hover:border-brown-800"
    onClick={() => action()}
  >
    {title}
  </button>
);

export const DownloadLink = ({
  title,
  url,
  fileName,
}: {
  title: string;
  url: string;
  fileName: string;
}) => (
  <a
    className="p-4 bg-green-200 border rounded-md text-sm ease-in-out duration-30 w-48 hover:bg-transparent hover:text-green-800 hover:border-green-800 text-center uppercase"
    href={url}
    download={fileName}
  >
    {title}
  </a>
);

export const Button = ({
  label,
  color = Colors.ORANGE,
  onClick,
}: {
  label: string;
  color?: string;
  onClick?: () => void;
}) => {
  let colorStyle = "";
  switch (color) {
    case Colors.ORANGE:
      colorStyle = "bg-peachy hover:text-orange-600 hover:border-orange-600";
      break;
    case Colors.GRAY:
      colorStyle = "bg-gray-200 hover:text-brown-800 hover:border-brown-800";
      break;
    case Colors.RED:
      colorStyle =
        "bg-orange-500 hover:text-orange-800 hover:border-orange-800";
      break;
    case Colors.BLUE:
      colorStyle = "bg-blue-300 hover:text-blue-800 hover:border-blue-800";
      break;
    default:
      break;
  }
  return (
    <button
      className={`pr-4 pl-4 pt-2 pb-2 w-48 border rounded-md text-sm ease-in-out duration-300 hover:bg-transparent uppercase ${colorStyle}`}
      type="submit"
      onClick={() => (onClick ? onClick() : "")}
    >
      {label}
    </button>
  );
};

export const CustomLink = ({
  label,
  action,
  imageSrc,
}: {
  label: string;
  action: () => void;
  imageSrc?: string;
}) => (
  <button
    className="underline cursor-pointer text-sm flex align-center justify-self-center gap-3 hover:text-blue-500 transition-all"
    type="button"
    onClick={() => action()}
  >
    {imageSrc && <Image src={imageSrc} alt="buttonAlt" />}
    {label}
  </button>
);
