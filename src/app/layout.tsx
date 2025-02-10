import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { RootLayout } from "@/components/root-layout";
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
  title: "Schedule Master",
  description: "A modern, beautiful, and intuitive college schedule management application",
  authors: [{ name: "nagetspesial", url: "https://github.com/nagetspesial" }],
  keywords: [
    "college schedule",
    "timetable",
    "class management",
    "academic planner",
    "student tools",
    "education",
    "schedule planner",
    "course management"
  ],
  creator: "nagetspesial",
  publisher: "nagetspesial",
  robots: "index, follow",
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    minimumScale: 1,
    viewportFit: 'cover',
    userScalable: true,
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" }
  ],
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: "Schedule Master",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
    other: {
      rel: "icon",
      url: "/favicon-32x32.png",
    },
  },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://schedule-master.vercel.app/",
    title: "Schedule Master",
    description: "A modern, beautiful, and intuitive college schedule management application",
    siteName: "Schedule Master",
  },
  twitter: {
    card: "summary_large_image",
    title: "Schedule Master",
    description: "A modern, beautiful, and intuitive college schedule management application",
    creator: "@nagetspesial",
  },
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="white" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#0a0a0a" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} h-screen bg-background font-sans antialiased overflow-hidden touch-pan-y selection:bg-primary/10 selection:text-primary tap-highlight-transparent`}>
        <RootLayout>{children}</RootLayout>
      </body>
    </html>
  );
}
