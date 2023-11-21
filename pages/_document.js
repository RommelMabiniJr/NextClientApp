import { Html, Head, Main, NextScript } from "next/document";
import Footer from "@/layout/webfooter";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@48,400,0,0"
      />
      <body>
        <Main />
        <NextScript />
      </body>
      <Footer />
    </Html>
  );
}
