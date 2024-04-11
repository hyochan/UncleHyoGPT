import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import clsx from "clsx";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Uncle Hyo GPT",
  description: "A chatbot that helps you become the fun uncle who plays well with nieces and nephews.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="dark">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body
        className={clsx([
          "h-screen",
          "bg-slate-50 dark:bg-zinc-900",
          inter.className,
        ])}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
