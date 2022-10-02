import Footer from "./Footer";
import Header from "./Header";

export default function Layout({
  children,
  goTo,
  title,
}: {
  children: any;
  goTo: string;
  title: string;
}) {
  return (
    <div
      id="content"
      className="flex flex-col justify-center font-inriaSans text-midnight-black mx-4 xl:mx-40 mt-10 mb-10"
    >
      <Header goTo={goTo} title={title} />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
