import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kenil's German Roadmap | B1 Revision → B2",
  description:
    "A focused German learning roadmap for revising B1 and progressing to B2 in under one hour a day.",
  openGraph: {
    title: "Kenil's German Roadmap",
    description: "B1 auffrischen. B2 sicher beherrschen.",
    type: "website",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Kenil's German Roadmap — B1 Revision to B2",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kenil's German Roadmap",
    description: "B1 auffrischen. B2 sicher beherrschen.",
    images: ["/og.png"],
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "German Roadmap",
    statusBarStyle: "default",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/icon-192.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
