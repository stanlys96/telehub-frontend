import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Telehub",
  description: "Directory for Telegram bots",
};

export default function RootLayout({ children, pageProps }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider session={pageProps?.session}>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
