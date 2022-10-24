import Footer from "./Footer";
import Header from "./Header";
import React from "react";

export default function DocumentRootLayout({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <div
      id="content"
      className="flex flex-col flex-grow justify-center font-inriaSans text-midnight-black mx-4 xl:mx-40 mt-10 mb-10"
    >
      <Header title={title} />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
