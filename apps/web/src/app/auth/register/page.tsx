"use client";

/**
 * User Registration Page Component
 *
 * Implements a split-panel registration form matching HireTrack AI UX guidelines:
 *   - Left Panel: Brand gradient and animated product feature pills.
 *   - Right Panel: Accessible form utilizing React Hook Form and Zod.
 *   - Real-time password strength meter and checklist indicator.
 *   - Toggleable password visibility.
 *   - Interactive success Toast notification.
 *   - Fully supports design tokens / dark mode from globals.css.
 */

import { useState, useMemo } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Eye, 
  EyeOff, 
  Check, 
  X, 
  Loader2, 
  Sparkles, 
  Network, 
  Users2, 
  AlertCircle,
  XCircle
} from "lucide-react";

import { registerSchema, type RegisterInput } from "@/lib/validations/auth";

// ---------------------------------------------------------------------------
// Toast Notification
// ---------------------------------------------------------------------------

interface ToastState {
  show: boolean;
  message: string;
  type: "success" | "error";
}

// ---------------------------------------------------------------------------
// Registration Screen Component
// ---------------------------------------------------------------------------

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState>({ show: false, message: "", type: "success" });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setError,
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const passwordValue = watch("password") || "";

  // Real-time password strength calculation
  const strengthChecklist = useMemo(() => {
    return {
      hasMinLength: passwordValue.length >= 8,
      hasUppercase: /[A-Z]/.test(passwordValue),
      hasNumberOrSpecial: /[0-9]/.test(passwordValue) || /[^A-Za-z0-9]/.test(passwordValue),
    };
  }, [passwordValue]);

  const passwordScore = useMemo(() => {
    if (!passwordValue) return 0;
    let score = 0;
    if (strengthChecklist.hasMinLength) score += 1;
    if (strengthChecklist.hasUppercase) score += 1;
    if (strengthChecklist.hasNumberOrSpecial) score += 1;
    
    // Additional criterion to reach maximum rating segment
    const hasSpecialAndNumber = /[0-9]/.test(passwordValue) && /[^A-Za-z0-9]/.test(passwordValue);
    if (score === 3 && (passwordValue.length >= 10 || hasSpecialAndNumber)) {
      score += 1;
    }
    return score;
  }, [passwordValue, strengthChecklist]);

  const strengthLabel = useMemo(() => {
    if (passwordScore === 0) return "";
    if (passwordScore === 1) return "Weak";
    if (passwordScore === 2) return "Fair";
    if (passwordScore === 3) return "Good";
    return "Strong";
  }, [passwordScore]);

  const strengthColor = useMemo(() => {
    if (passwordScore === 1) return "bg-[var(--danger-600)]";
    if (passwordScore === 2) return "bg-[var(--warning-600)]";
    if (passwordScore === 3) return "bg-amber-400";
    if (passwordScore === 4) return "bg-[var(--success-600)]";
    return "bg-[var(--neutral-200)] dark:bg-[var(--neutral-700)]";
  }, [passwordScore]);

  // Handle Form Submission
  const onSubmit = async (data: RegisterInput) => {
    setServerError(null);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.errors) {
          // Map Zod error arrays to React Hook Form field errors
          Object.entries(result.errors).forEach(([field, messages]) => {
            const fieldMessages = messages as string[];
            if (fieldMessages[0]) {
              setError(field as keyof RegisterInput, {
                type: "server",
                message: fieldMessages[0],
              });
            }
          });
        }
        setServerError(result.message || "Registration failed. Please check the fields.");
        showToast(result.message || "Registration failed.", "error");
        return;
      }

      // Success
      showToast("Account registered successfully! Redirecting...", "success");
      
      // Auto-redirect to login in 2 seconds (simulated)
      setTimeout(() => {
        window.location.href = "/auth/login";
      }, 2000);

    } catch (err: unknown) {
      console.error("Submission error:", err);
      setServerError("A network error occurred. Please try again.");
      showToast("A network error occurred.", "error");
    }
  };

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 4500);
  };

  return (
    <main className="min-h-screen flex flex-col md:flex-row bg-[var(--color-background)] text-[var(--color-text-primary)]">
      
      {/* Toast Notification */}
      {toast.show && (
        <div 
          role="status"
          aria-live="polite"
          className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border animate-slide-in max-w-sm transition-all duration-300 ${
            toast.type === "success" 
              ? "bg-[var(--success-50)] border-[var(--success-600)] text-[var(--success-600)] dark:bg-emerald-950/40" 
              : "bg-[var(--danger-50)] border-[var(--danger-600)] text-[var(--danger-600)] dark:bg-red-950/40"
          }`}
        >
          {toast.type === "success" ? (
            <Check className="h-5 w-5 shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 shrink-0" />
          )}
          <span className="text-sm font-medium">{toast.message}</span>
          <button 
            type="button" 
            onClick={() => setToast((prev) => ({ ...prev, show: false }))} 
            className="ml-auto text-current opacity-70 hover:opacity-100 transition-opacity"
            aria-label="Close notification"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Left Panel - Branding & Social Proof (Desktop only) */}
      <section 
        className="hidden md:flex md:w-1/2 relative flex-col justify-between p-12 text-white overflow-hidden bg-gradient-to-br from-[var(--brand-600)] to-[#7C3AED]"
        aria-label="Branding panel"
      >
        {/* Particle/Mesh Background Decoration */}
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <div className="absolute top-[-20%] left-[-25%] w-[80%] h-[80%] rounded-full bg-indigo-300 blur-[100px]" />
          <div className="absolute bottom-[-20%] right-[-25%] w-[80%] h-[80%] rounded-full bg-violet-400 blur-[100px]" />
        </div>

        {/* Top Branding Logo */}
        <div className="relative flex items-center gap-2.5 z-10">
          <div className="w-9 h-9 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center font-bold text-lg tracking-wider text-white shadow-brand">
            HT
          </div>
          <span className="text-xl font-bold tracking-tight">HireTrack AI</span>
        </div>

        {/* Value Proposition + Interactive Feature Cards */}
        <div className="relative my-auto py-12 space-y-8 z-10">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 backdrop-blur-md border border-white/20 text-indigo-100 shadow-sm animate-pulse">
              ✦ Built for High-Performance Teams
            </span>
            <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              Hire faster.<br />Hire smarter.
            </h2>
            <p className="text-indigo-100 text-base max-w-md">
              Unify candidate screening, interview pipelines, and team reviews in one intelligent dashboard.
            </p>
          </div>

          {/* Animated Feature Pills */}
          <div className="space-y-4 max-w-sm">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 shadow-sm hover:translate-x-1.5 transition-transform duration-300">
              <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-200">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-semibold text-sm">AI Resume Scoring</h4>
                <p className="text-xs text-indigo-200/90">Instantly rank and score top profiles</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 shadow-sm hover:translate-x-1.5 transition-transform duration-300">
              <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-200">
                <Network className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-semibold text-sm">Pipeline Automation</h4>
                <p className="text-xs text-indigo-200/90">Trigger updates and emails seamlessly</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 shadow-sm hover:translate-x-1.5 transition-transform duration-300">
              <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-200">
                <Users2 className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-semibold text-sm">Team Collaboration</h4>
                <p className="text-xs text-indigo-200/90">Share comments and vote in real-time</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Info / Social Proof */}
        <div className="relative border-t border-white/10 pt-6 z-10 flex items-center justify-between text-xs text-indigo-200">
          <span>Join 2,400+ companies worldwide</span>
          <span className="font-medium text-white">HireTrack AI v0.1.0</span>
        </div>
      </section>

      {/* Right Panel - Form Card */}
      <section className="flex-1 flex flex-col justify-center items-center px-6 py-12 md:px-12 lg:px-20 xl:px-24">
        
        {/* Form Container */}
        <div className="w-full max-w-[480px] space-y-8">
          
          {/* Header */}
          <div className="text-center md:text-left space-y-2">
            <div className="flex justify-center md:justify-start items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-[var(--brand-600)] flex items-center justify-center font-bold text-white tracking-wider text-sm shadow-sm md:hidden">
                HT
              </div>
              <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
            </div>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Start your free 14-day trial. No credit card required.
            </p>
          </div>

          {/* Server Error Alert Banner */}
          {serverError && (
            <div 
              className="flex items-start gap-3 p-4 rounded-lg bg-[var(--danger-50)] border border-[var(--danger-600)] text-[var(--danger-600)] dark:bg-red-950/20"
              role="alert"
            >
              <XCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <div className="text-sm font-medium">
                {serverError}
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
            
            {/* Full Name */}
            <div className="space-y-2">
              <label 
                htmlFor="name" 
                className="text-sm font-semibold text-[var(--color-text-primary)]"
              >
                Full Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="Alex Rivera"
                disabled={isSubmitting}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "name-error" : undefined}
                className={`w-full px-3.5 py-2.5 rounded-lg border bg-[var(--color-surface)] outline-none transition-all ${
                  errors.name 
                    ? "border-[var(--danger-600)] focus:border-[var(--danger-600)] focus:ring-1 focus:ring-[var(--danger-600)]" 
                    : "border-[var(--color-border)] focus:border-[var(--brand-500)] focus:ring-1 focus:ring-[var(--brand-500)]"
                }`}
                {...register("name")}
              />
              {errors.name && (
                <p id="name-error" className="text-xs text-[var(--danger-600)] font-medium flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Work Email */}
            <div className="space-y-2">
              <label 
                htmlFor="email" 
                className="text-sm font-semibold text-[var(--color-text-primary)]"
              >
                Work email
              </label>
              <input
                id="email"
                type="email"
                placeholder="name@company.com"
                disabled={isSubmitting}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
                className={`w-full px-3.5 py-2.5 rounded-lg border bg-[var(--color-surface)] outline-none transition-all ${
                  errors.email 
                    ? "border-[var(--danger-600)] focus:border-[var(--danger-600)] focus:ring-1 focus:ring-[var(--danger-600)]" 
                    : "border-[var(--color-border)] focus:border-[var(--brand-500)] focus:ring-1 focus:ring-[var(--brand-500)]"
                }`}
                {...register("email")}
              />
              {errors.email && (
                <p id="email-error" className="text-xs text-[var(--danger-600)] font-medium flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label 
                htmlFor="password" 
                className="text-sm font-semibold text-[var(--color-text-primary)]"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  disabled={isSubmitting}
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? "password-error" : undefined}
                  className={`w-full pl-3.5 pr-11 py-2.5 rounded-lg border bg-[var(--color-surface)] outline-none transition-all ${
                    errors.password 
                      ? "border-[var(--danger-600)] focus:border-[var(--danger-600)] focus:ring-1 focus:ring-[var(--danger-600)]" 
                      : "border-[var(--color-border)] focus:border-[var(--brand-500)] focus:ring-1 focus:ring-[var(--brand-500)]"
                  }`}
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  disabled={isSubmitting}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors focus-visible:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {passwordValue && (
                <div className="mt-2 space-y-2 animate-fade-in">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[var(--color-text-muted)]">Password strength</span>
                    <span className="font-semibold text-[var(--color-text-primary)]">{strengthLabel}</span>
                  </div>

                  {/* 4-Segment Bar */}
                  <div className="flex gap-1.5 h-1.5 w-full">
                    {[1, 2, 3, 4].map((index) => (
                      <div 
                        key={index} 
                        className={`h-full flex-1 rounded-full transition-all duration-300 ${
                          index <= passwordScore ? strengthColor : "bg-[var(--neutral-200)] dark:bg-[var(--neutral-700)]"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Requirements Checklist */}
                  <ul className="text-xs space-y-1 text-[var(--color-text-muted)]">
                    <li className="flex items-center gap-1.5">
                      {strengthChecklist.hasMinLength ? (
                        <Check className="h-3.5 w-3.5 text-[var(--success-600)] shrink-0" />
                      ) : (
                        <X className="h-3.5 w-3.5 text-[var(--color-text-muted)] shrink-0" />
                      )}
                      <span className={strengthChecklist.hasMinLength ? "text-[var(--color-text-primary)]" : ""}>
                        At least 8 characters
                      </span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      {strengthChecklist.hasUppercase ? (
                        <Check className="h-3.5 w-3.5 text-[var(--success-600)] shrink-0" />
                      ) : (
                        <X className="h-3.5 w-3.5 text-[var(--color-text-muted)] shrink-0" />
                      )}
                      <span className={strengthChecklist.hasUppercase ? "text-[var(--color-text-primary)]" : ""}>
                        At least 1 uppercase letter
                      </span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      {strengthChecklist.hasNumberOrSpecial ? (
                        <Check className="h-3.5 w-3.5 text-[var(--success-600)] shrink-0" />
                      ) : (
                        <X className="h-3.5 w-3.5 text-[var(--color-text-muted)] shrink-0" />
                      )}
                      <span className={strengthChecklist.hasNumberOrSpecial ? "text-[var(--color-text-primary)]" : ""}>
                        At least 1 number or special character
                      </span>
                    </li>
                  </ul>
                </div>
              )}

              {errors.password && (
                <p id="password-error" className="text-xs text-[var(--danger-600)] font-medium flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label 
                htmlFor="confirmPassword" 
                className="text-sm font-semibold text-[var(--color-text-primary)]"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  disabled={isSubmitting}
                  aria-invalid={!!errors.confirmPassword}
                  aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
                  className={`w-full pl-3.5 pr-11 py-2.5 rounded-lg border bg-[var(--color-surface)] outline-none transition-all ${
                    errors.confirmPassword 
                      ? "border-[var(--danger-600)] focus:border-[var(--danger-600)] focus:ring-1 focus:ring-[var(--danger-600)]" 
                      : "border-[var(--color-border)] focus:border-[var(--brand-500)] focus:ring-1 focus:ring-[var(--brand-500)]"
                  }`}
                  {...register("confirmPassword")}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  disabled={isSubmitting}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors focus-visible:outline-none"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p id="confirmPassword-error" className="text-xs text-[var(--danger-600)] font-medium flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Create Account Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-white bg-[var(--brand-600)] hover:bg-[var(--brand-700)] active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 transition-all cursor-pointer shadow-sm shadow-indigo-600/10 hover:shadow-indigo-600/20"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Creating account...</span>
                </>
              ) : (
                <span>Create account</span>
              )}
            </button>
          </form>

          {/* Already have an account? Sign in */}
          <div className="text-center pt-2">
            <span className="text-sm text-[var(--color-text-secondary)]">
              Already have an account?{" "}
            </span>
            <Link 
              href="/auth/login" 
              className="text-sm font-semibold text-[var(--brand-600)] hover:text-[var(--brand-700)] hover:underline"
            >
              Sign in
            </Link>
          </div>
          
        </div>
      </section>

    </main>
  );
}
