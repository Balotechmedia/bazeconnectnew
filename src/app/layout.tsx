import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster as SonnerToaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0866FF" },
    { media: "(prefers-color-scheme: dark)", color: "#0866FF" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL("https://bazeconnect.com"),
  title: "BazeConnect - Baze University Social Media",
  description: "Connect with fellow students at Baze University Abuja. Share, chat, and stay updated with campus life.",
  keywords: ["BazeConnect", "Baze University", "Abuja", "Social Media", "Students", "University", "Nigeria"],
  authors: [{ name: "BazeConnect Team" }],
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "BazeConnect",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: "BazeConnect - Baze University Social Media",
    description: "Connect with fellow students at Baze University Abuja",
    url: "https://bazeconnect.com",
    siteName: "BazeConnect",
    type: "website",
    images: [
      {
        url: "/icons/icon-512x512.png",
        width: 512,
        height: 512,
        alt: "BazeConnect Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BazeConnect - Baze University Social Media",
    description: "Connect with fellow students at Baze University Abuja",
    images: ["/icons/icon-512x512.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="application-name" content="BazeConnect" />
        <meta name="apple-mobile-web-app-title" content="BazeConnect" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <SonnerToaster position="top-center" richColors />
      </body>
    </html>
  );
}
