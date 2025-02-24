import type React from "react";
import "../styles/globals.css";
import { Inter } from "next/font/google";
import Layout from "@/components/Layout";
import { Metadata, Viewport } from "next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Triunfo",
  description: "Triunfo Game App",
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { rel: "icon", url: "/favicon.ico", sizes: "any" },
      { rel: "icon", url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      { rel: "icon", url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180" },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <link
          rel="icon"
          href="/favicon.ico" // o '/favicon.png' si usas PNG
          sizes="any"
        />
      </head>
      <body className={inter.className}>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
