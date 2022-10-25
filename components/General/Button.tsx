import { Colors } from "util/defines";
import Image from "next/image";

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
    className="pr-4 pl-4 pt-2 pb-2 bg-green-200 border rounded-md font-bold text-tiny ease-in-out duration-30 w-48 hover:bg-transparent hover:text-green-800 hover:border-green-800 text-center uppercase"
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
  type = "submit",
  customstyle = "",
  disabled = false,
}: {
  label: string;
  color?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  customstyle?: string;
  disabled?: boolean;
}) => {
  let colorStyle = "";
  if (disabled) {
    colorStyle = "bg-white border cursor-not-allowed";
  } else {
    switch (color) {
      case Colors.ORANGE:
        colorStyle = `bg-peachy hover:text-orange-600 hover:border-orange-600 ${customstyle}`;
        break;
      case Colors.GRAY:
        colorStyle = `bg-gray-200 hover:text-brown-800 hover:border-brown-800 ${customstyle}`;
        break;
      case Colors.RED:
        colorStyle = `bg-orange-500 hover:text-orange-800 hover:border-orange-800 ${customstyle}`;
        break;
      case Colors.BLUE:
        colorStyle = `bg-blue-300 hover:text-blue-800 hover:border-blue-800 ${customstyle}`;
        break;
      default:
        break;
    }
  }
  return (
    <button
      className={`pr-4 pl-4 pt-2 pb-2 w-48 border rounded-md text-tiny font-bold ease-in-out duration-300 hover:bg-transparent uppercase ${colorStyle} `}
      type={type}
      onClick={(e) => (onClick && !disabled ? onClick() : null)}
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
