import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import SiteFrame from "@/components/common/SiteFrame";
import { siteConfig } from "@/data/portfolio";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Burak Asarcikli | Full-Stack Developer",
    template: "%s | Burak Asarcikli",
  },
  description: siteConfig.description,
  alternates: { canonical: "/" },
  keywords: [
    "Burak Asarcikli",
    "Full-Stack Developer",
    ".NET Developer",
    "TypeScript Developer",
    "Next.js Developer",
    "Istanbul",
  ],
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: "/icon.svg",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    siteName: `${siteConfig.name} — ${siteConfig.role}`,
    title: `${siteConfig.name} | ${siteConfig.role}`,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | ${siteConfig.role}`,
    description: siteConfig.description,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <SiteFrame>{children}</SiteFrame>
      </body>
    </html>
  );
}
