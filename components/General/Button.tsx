export const InternalButton = ({
  title,
  action,
}: {
  title: string;
  action: () => void;
}) => (
  <button
    className="p-4 bg-gray-200 border rounded-md text-md ease-in-out duration-30 w-44 hover:bg-transparent hover:text-brown-800 hover:border-brown-800"
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
    className="p-4 h-14 bg-green-200 border rounded-md text-md ease-in-out duration-30 w-44 hover:bg-transparent hover:text-green-800 hover:border-green-800 text-center"
    href={url}
    download={fileName}
  >
    {title}
  </a>
);
