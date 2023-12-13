import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "../store/reducers/rootReducer";
import { SessionProvider } from "next-auth/react";
import { PrimeReactProvider } from "primereact/api";
import { Work_Sans } from "next/font/google";

const work_sans = Work_Sans({
  weights: [300, 400, 500, 600, 700],
  subsets: ["latin", "latin-ext"],
  variable: "--font-work-sans",
});

// import "../kasamabahayko-theme/themes/mytheme/theme.scss"; // custom theme
import "../kasamabahayko-theme/themes/lara/lara-light/indigo/theme.scss"; // this is active theme
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import "../styles/layout/layout.scss";
import "../styles/adjustments.css";
import "../styles/globals.css";

import "../layout/demo/TimelineDemo.css"; // >>> remove after testing

function MyApp({ Component, pageProps }) {
  return (
    <>
      <style jsx global>{`
        * {
          font-family: ${work_sans.style.fontFamily};
        }
      `}</style>
      <SessionProvider session={pageProps.session}>
        <PrimeReactProvider
          // className={work_sans.className}
          value={{ unstyled: true, pt: {} }}
        >
          <Component {...pageProps} />
        </PrimeReactProvider>
      </SessionProvider>
    </>
  );
}

export default MyApp;
