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
  title: "Human Operations - Life Operating System & Habit Tracker",
  description: "AI-powered habit tracker, goal manager, and personal productivity system. Track metrics, build habits, achieve goals. $19 one-time payment, lifetime access. 5-minute setup with Claude AI.",
  keywords: ["habit tracker", "productivity", "goal tracking", "metrics", "personal operating system", "AI setup", "life management"],
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
    title: "Human Operations - Your Life Operating System",
    description: "Track habits, measure metrics, achieve goals. AI-powered setup in 5 minutes. $19 one-time payment.",
    type: "website",
    siteName: "Human Operations",
  },
  twitter: {
    card: "summary_large_image",
    title: "Human Operations - Life Operating System",
    description: "AI-powered habit tracker and productivity system. One dashboard for all your habits, metrics, and goals.",
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
