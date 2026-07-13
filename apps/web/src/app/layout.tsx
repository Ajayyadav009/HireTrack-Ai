import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";

/* ─── Font ──────────────────────────────────────────────────────────────── */

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

/* ─── Metadata ───────────────────────────────────────────────────────────── */

export const metadata: Metadata = {
  title: {
    default: "HireTrack AI — Intelligent Hiring Platform",
    template: "%s | HireTrack AI",
  },
  description:
    "HireTrack AI is an AI-powered applicant tracking system that helps mid-market and enterprise companies hire faster, smarter, and more fairly.",
  keywords: [
    "applicant tracking system",
    "ATS",
    "hiring software",
    "AI recruiting",
    "talent acquisition",
    "HR software",
    "HireTrack AI",
  ],
  authors: [{ name: "HireTrack AI" }],
  creator: "HireTrack AI",
  publisher: "HireTrack AI",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  ),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "HireTrack AI",
    title: "HireTrack AI — Intelligent Hiring Platform",
    description:
      "Replace fragmented, manual hiring workflows with a unified AI-powered platform.",
  },
  twitter: {
    card: "summary_large_image",
    title: "HireTrack AI — Intelligent Hiring Platform",
    description:
      "Replace fragmented, manual hiring workflows with a unified AI-powered platform.",
    creator: "@hiretrack_ai",
  },
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
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
  width: "device-width",
  initialScale: 1,
};

/* ─── Root Layout ────────────────────────────────────────────────────────── */

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body>
        {/*
         * suppressHydrationWarning on <html> is intentional:
         * dark mode class is applied by a script before React hydrates,
         * which would otherwise cause a mismatch warning.
         *
         * Future milestones will add:
         * - ThemeProvider (dark mode)
         * - SessionProvider (auth)
         * - QueryClientProvider (TanStack Query)
         * - Toaster (notifications)
         */}
        {children}
      </body>
    </html>
  );
}
