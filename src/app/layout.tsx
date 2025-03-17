import type { Metadata } from "next";
import { inter } from "./styles/fonts";
import "./styles/globals.css";

export const metadata: Metadata = {
  title: "Design Lab",
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
    <html lang="en" className={`dark ${inter.variable}`}>
      <head>
        <meta name="robots" content="noindex,nofollow" />
        <meta name="googlebot" content="noindex,nofollow" />
      </head>
      <body className="bg-gray-900 text-gray-100">{children}</body>
    </html>
  );
}
