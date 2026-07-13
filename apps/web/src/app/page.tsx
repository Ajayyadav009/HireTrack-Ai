import type { Metadata } from "next";
import Link from "next/link";

/* ─── Page Metadata ──────────────────────────────────────────────────────── */

export const metadata: Metadata = {
  title: "HireTrack AI — Intelligent Hiring Platform",
  description:
    "Hire faster, hire smarter. HireTrack AI combines AI screening, pipeline automation, and real-time collaboration to transform your talent acquisition.",
};

/* ─── Static Data ────────────────────────────────────────────────────────── */

const STATS = [
  { value: "60%", label: "Faster time-to-hire" },
  { value: "250+", label: "Applications handled per req" },
  { value: "87%", label: "AI screening accuracy" },
  { value: "2,400+", label: "Companies worldwide" },
] as const;

const FEATURES = [
  {
    icon: "✦",
    title: "AI Resume Screening",
    description:
      "Score every applicant against your job requirements in seconds. Surface the top 10% before your first coffee.",
  },
  {
    icon: "⬡",
    title: "Visual Pipeline Board",
    description:
      "Drag-and-drop Kanban view across every hiring stage. See your entire pipeline at a glance.",
  },
  {
    icon: "◈",
    title: "Structured Interviews",
    description:
      "Scorecard templates, async feedback, and consensus views — ensure every hire is a great hire.",
  },
  {
    icon: "◎",
    title: "Hiring Analytics",
    description:
      "Time-to-hire, source effectiveness, funnel conversion. Make every future hire data-informed.",
  },
  {
    icon: "⬡",
    title: "Team Collaboration",
    description:
      "@mentions, shared notes, and real-time notifications keep your entire hiring team aligned.",
  },
  {
    icon: "✦",
    title: "AI Job Descriptions",
    description:
      "Generate compelling, bias-aware job descriptions from a title and a handful of bullet points.",
  },
] as const;

/* ─── Component ──────────────────────────────────────────────────────────── */

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text-primary)]">
      {/* ── Navigation ─────────────────────────────────────────────── */}
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-surface)]/90 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div
              aria-hidden="true"
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--brand-600)]"
            >
              <span className="text-sm font-bold text-white">H</span>
            </div>
            <span className="text-base font-semibold tracking-tight text-[var(--color-text-primary)]">
              HireTrack{" "}
              <span className="text-[var(--brand-600)]">AI</span>
            </span>
          </div>

          {/* Nav links */}
          <div className="hidden items-center gap-8 md:flex">
            {["Features", "Pricing", "About", "Blog"].map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase()}`}
                className="text-sm text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
              >
                {item}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <Link
              href="/auth/login"
              className="hidden text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] md:block"
            >
              Sign in
            </Link>
            <Link
              href="/auth/register"
              className="rounded-lg bg-[var(--brand-600)] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[var(--brand-700)] hover:shadow-[var(--shadow-brand)]"
            >
              Start free trial
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────────────────── */}
      <section className="pt-32 pb-24 text-center">
        <div className="mx-auto max-w-4xl px-6">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--brand-400)]/30 bg-[var(--brand-50)] px-4 py-1.5 text-xs font-medium text-[var(--brand-600)]">
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 rounded-full bg-[var(--brand-600)]"
            />
            Now with GPT-4o powered resume screening
          </div>

          {/* Headline */}
          <h1 className="mb-6 text-5xl font-extrabold tracking-tight text-[var(--color-text-primary)] md:text-6xl">
            Hire faster.{" "}
            <span className="bg-gradient-to-r from-[var(--brand-600)] to-[var(--brand-400)] bg-clip-text text-transparent">
              Hire smarter.
            </span>
          </h1>

          {/* Subtext */}
          <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-[var(--color-text-secondary)]">
            HireTrack AI replaces fragmented spreadsheets, email chains, and
            disconnected tools with one intelligent platform — from first
            application to signed offer.
          </p>

          {/* CTAs */}
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/auth/register"
              id="hero-cta-primary"
              className="w-full rounded-xl bg-[var(--brand-600)] px-8 py-3.5 text-base font-semibold text-white shadow-md transition-all hover:bg-[var(--brand-700)] hover:shadow-[var(--shadow-brand)] sm:w-auto"
            >
              Start 14-day free trial
            </Link>
            <Link
              href="/auth/login"
              id="hero-cta-secondary"
              className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-8 py-3.5 text-base font-semibold text-[var(--color-text-primary)] shadow-sm transition-all hover:border-[var(--brand-600)] hover:text-[var(--brand-600)] sm:w-auto"
            >
              Sign in →
            </Link>
          </div>

          {/* Trust note */}
          <p className="mt-6 text-xs text-[var(--color-text-muted)]">
            No credit card required · Cancel anytime · GDPR compliant
          </p>
        </div>
      </section>

      {/* ── Stats bar ──────────────────────────────────────────────── */}
      <section
        aria-label="Key metrics"
        className="border-y border-[var(--color-border)] bg-[var(--color-surface)] py-10"
      >
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-8 px-6 md:grid-cols-4">
          {STATS.map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="text-3xl font-extrabold text-[var(--brand-600)]">
                {value}
              </div>
              <div className="mt-1 text-sm text-[var(--color-text-muted)]">
                {label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ───────────────────────────────────────────────── */}
      <section aria-labelledby="features-heading" className="py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-14 text-center">
            <h2
              id="features-heading"
              className="text-3xl font-bold tracking-tight text-[var(--color-text-primary)]"
            >
              Everything your hiring team needs
            </h2>
            <p className="mt-3 text-base text-[var(--color-text-secondary)]">
              One platform replaces five tools. Built for recruiters, hiring
              managers, and executives.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ icon, title, description }) => (
              <article
                key={title}
                className="group rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-sm)] transition-all hover:-translate-y-0.5 hover:border-[var(--brand-400)]/50 hover:shadow-[var(--shadow-md)]"
              >
                {/* Icon */}
                <div
                  aria-hidden="true"
                  className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--brand-50)] text-xl text-[var(--brand-600)]"
                >
                  {icon}
                </div>
                <h3 className="mb-2 text-base font-semibold text-[var(--color-text-primary)]">
                  {title}
                </h3>
                <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ─────────────────────────────────────────────── */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <div className="rounded-2xl bg-gradient-to-br from-[var(--brand-600)] to-[#7c3aed] p-12 shadow-[var(--shadow-xl)]">
            <h2 className="mb-4 text-3xl font-extrabold text-white">
              Ready to transform your hiring?
            </h2>
            <p className="mb-8 text-base text-white/80">
              Join 2,400+ companies using HireTrack AI to hire with confidence.
            </p>
            <Link
              href="/auth/register"
              id="bottom-cta"
              className="inline-block rounded-xl bg-white px-8 py-3.5 text-base font-semibold text-[var(--brand-600)] shadow-md transition-all hover:bg-[var(--neutral-50)] hover:shadow-lg"
            >
              Get started for free
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────── */}
      <footer className="border-t border-[var(--color-border)] py-10">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            {/* Brand */}
            <div className="flex items-center gap-2">
              <div
                aria-hidden="true"
                className="flex h-6 w-6 items-center justify-center rounded bg-[var(--brand-600)]"
              >
                <span className="text-xs font-bold text-white">H</span>
              </div>
              <span className="text-sm font-semibold text-[var(--color-text-secondary)]">
                HireTrack AI
              </span>
            </div>

            {/* Links */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-[var(--color-text-muted)]">
              {["Privacy Policy", "Terms of Service", "Security", "Status"].map(
                (link) => (
                  <Link
                    key={link}
                    href={`/${link.toLowerCase().replace(/ /g, "-")}`}
                    className="hover:text-[var(--color-text-secondary)]"
                  >
                    {link}
                  </Link>
                ),
              )}
            </div>

            {/* Copyright */}
            <p className="text-xs text-[var(--color-text-muted)]">
              © {new Date().getFullYear()} HireTrack AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
