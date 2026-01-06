import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Human Operations - AI-Powered Habit Tracker & Life Operating System",
  description: "Build better habits, track what matters, and achieve your goals with AI-powered personalization. No subscriptions—pay once, use forever. Start your free trial today.",
  keywords: ["habit tracker", "productivity app", "goal tracking", "life operating system", "AI habits", "personal productivity", "metric tracking", "daily planner"],
  authors: [{ name: "Human Operations" }],
  creator: "Human Operations",
  publisher: "Human Operations",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://humanoperations.app",
    title: "Human Operations - AI-Powered Habit Tracker & Life Operating System",
    description: "Build better habits, track what matters, and achieve your goals with AI-powered personalization. No subscriptions—pay once, use forever.",
    siteName: "Human Operations",
  },
  twitter: {
    card: "summary_large_image",
    title: "Human Operations - AI-Powered Habit Tracker & Life Operating System",
    description: "Build better habits, track what matters, and achieve your goals with AI-powered personalization. No subscriptions—pay once, use forever.",
  },
  icons: {
    icon: [
      { url: '/mainlogo.svg', type: 'image/svg+xml' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "HumOps",
  },
  formatDetection: {
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
