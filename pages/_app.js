import "../styles/globals.css";

import { Theme } from "@radix-ui/themes";

function MyApp({ Component, pageProps }) {
  return (
    <Theme>
      {" "}
      <Component {...pageProps} />
    </Theme>
  );
}

export default MyApp;
