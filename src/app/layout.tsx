import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "@/lib/polyfills";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "InvoicePDF - Professional Invoice Generator",
  description: "Create professional invoices with ease. Generate PDF invoices, manage templates, and share with clients.",
  keywords: "invoice generator, PDF invoices, professional invoices, business invoices",
  authors: [{ name: "InvoicePDF Team" }],
  robots: "index, follow",
  openGraph: {
    title: "InvoicePDF - Professional Invoice Generator",
    description: "Create professional invoices with ease. Generate PDF invoices, manage templates, and share with clients.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "InvoicePDF - Professional Invoice Generator",
    description: "Create professional invoices with ease. Generate PDF invoices, manage templates, and share with clients.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
