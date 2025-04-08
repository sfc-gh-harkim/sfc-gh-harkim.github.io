import type { Metadata } from "next";
import { inter, plusJakartaSans } from "./styles/fonts";
import "./styles/globals.css";
import "./styles/balto.css";

export const metadata: Metadata = {
  title: "DesignLab",
  description: "A collection of reusable React components",
  robots: {
    index: false,
    follow: false,
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${plusJakartaSans.variable}`} data-theme="dark">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="robots" content="noindex,nofollow" />
        <meta name="googlebot" content="noindex,nofollow" />
      </head>
      <body className="font-plus-jakarta-sans">
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
