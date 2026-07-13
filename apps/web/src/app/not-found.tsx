import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The page you are looking for does not exist.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--color-background)] px-6 text-center">
      {/* 404 number */}
      <div
        aria-hidden="true"
        className="mb-6 bg-gradient-to-r from-[var(--brand-600)] to-[var(--brand-400)] bg-clip-text text-8xl font-extrabold tracking-tight text-transparent"
      >
        404
      </div>

      {/* Logo */}
      <div className="mb-8 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--brand-600)]">
          <span className="text-sm font-bold text-white">H</span>
        </div>
        <span className="text-base font-semibold text-[var(--color-text-secondary)]">
          HireTrack AI
        </span>
      </div>

      <h1 className="mb-3 text-2xl font-bold text-[var(--color-text-primary)]">
        Page not found
      </h1>
      <p className="mb-8 max-w-sm text-sm leading-relaxed text-[var(--color-text-secondary)]">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
        Double-check the URL or head back home.
      </p>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href="/"
          className="rounded-lg bg-[var(--brand-600)] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[var(--brand-700)]"
        >
          Go to home
        </Link>
        <Link
          href="/auth/login"
          className="rounded-lg border border-[var(--color-border)] px-6 py-2.5 text-sm font-semibold text-[var(--color-text-secondary)] transition-all hover:border-[var(--brand-600)] hover:text-[var(--brand-600)]"
        >
          Sign in
        </Link>
      </div>
    </div>
  );
}
