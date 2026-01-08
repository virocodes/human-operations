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
  title: "Human Operations - Your Life, Quantified",
  description: "Stop wondering if you're making progress. Track habits, measure what matters, and stay accountable with Human Operations - your personal life operating system.",
  keywords: "habit tracking, productivity, personal development, goal tracking, life metrics, quantified self",
  authors: [{ name: "Human Operations" }],
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
  openGraph: {
    title: "Human Operations - Your Life, Quantified",
    description: "Stop wondering if you're making progress. Track habits, measure what matters, and stay accountable.",
    url: "https://humanoperations.co",
    siteName: "Human Operations",
    type: "website",
    images: [
      {
        url: "/icon-512.png",
        width: 512,
        height: 512,
        alt: "Human Operations Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Human Operations - Your Life, Quantified",
    description: "Stop wondering if you're making progress. Track habits, measure what matters, and stay accountable.",
    images: ["/icon-512.png"],
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
