import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "Citadel - E-commerce Admin Dashboard",
    template: "%s | Citadel",
  },
  description: "Modern server-rendered e-commerce product management dashboard with real-time inventory tracking, analytics, and seamless admin experience.",
  keywords: ["e-commerce", "admin dashboard", "product management", "inventory", "Next.js", "React"],
  authors: [{ name: "Citadel Team" }],
  creator: "Citadel",
  publisher: "Citadel",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Citadel",
    title: "Citadel - E-commerce Admin Dashboard",
    description: "Modern server-rendered e-commerce product management dashboard",
  },
  twitter: {
    card: "summary_large_image",
    title: "Citadel - E-commerce Admin Dashboard",
    description: "Modern server-rendered e-commerce product management dashboard",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`} suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
