import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import Head from "next/head";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children, pageProps }) {
  return (
    <html lang="en">
      <head>
        <title>Telehub</title>
        <link rel="shortcut icon" href="/img/favicon.ico" />
      </head>
      <body className={inter.className}>
        <SessionProvider session={pageProps?.session}>
          {children}
          <Analytics />
        </SessionProvider>
      </body>
    </html>
  );
}
