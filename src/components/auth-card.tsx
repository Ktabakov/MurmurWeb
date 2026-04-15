"use client";

import Link from "next/link";
import { motion } from "framer-motion";

type AuthCardVariant = "login" | "register";

type AuthCardProps = {
  variant: AuthCardVariant;
};

function AppleIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-current">
      <path d="M16.49 12.8c.02 2.12 1.87 2.83 1.89 2.84-.02.06-.3 1.02-.97 2.03-.58.86-1.18 1.72-2.12 1.73-.92.02-1.22-.54-2.28-.54-1.05 0-1.38.52-2.25.56-.9.03-1.58-.9-2.17-1.76-1.21-1.75-2.13-4.94-.9-7.08.61-1.06 1.7-1.73 2.88-1.75.9-.02 1.74.6 2.28.6.53 0 1.53-.73 2.57-.62.44.02 1.67.18 2.46 1.34-.06.04-1.47.87-1.45 2.6Zm-1.3-5.02c.48-.58.8-1.38.71-2.18-.69.03-1.53.46-2.03 1.04-.44.5-.83 1.31-.73 2.08.77.06 1.56-.39 2.05-.94Z" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
      <path fill="#EA4335" d="M12 10.2v3.93h5.46c-.24 1.26-.95 2.33-2.02 3.04l3.27 2.53c1.9-1.75 2.99-4.33 2.99-7.4 0-.7-.06-1.37-.18-2.01H12Z" />
      <path fill="#34A853" d="M12 22c2.7 0 4.96-.9 6.61-2.3l-3.27-2.53c-.91.61-2.07.97-3.34.97-2.57 0-4.75-1.73-5.53-4.06H3.08v2.6A10 10 0 0 0 12 22Z" />
      <path fill="#4A90E2" d="M6.47 14.08A5.99 5.99 0 0 1 6.16 12c0-.72.12-1.43.31-2.08v-2.6H3.08A10 10 0 0 0 2 12c0 1.61.39 3.13 1.08 4.4l3.39-2.32Z" />
      <path fill="#FBBC05" d="M12 5.86c1.47 0 2.79.51 3.83 1.5l2.87-2.87A9.59 9.59 0 0 0 12 2 10 10 0 0 0 3.08 7.32l3.39 2.6c.78-2.33 2.96-4.06 5.53-4.06Z" />
    </svg>
  );
}

export function AuthCard({ variant }: AuthCardProps) {
  const isLogin = variant === "login";
  const eyebrow = isLogin ? "Welcome Back" : "Create Account";
  const title = isLogin ? "Sign In to Murmur" : "Join Murmur";
  const description = isLogin
    ? "Continue your session and jump back into your latest sound explorations."
    : "Build your profile and start crafting immersive sound with Murmur.";
  const cta = isLogin ? "Sign In" : "Create Account";
  const footerPrefix = isLogin ? "New to Murmur?" : "Already have an account?";
  const footerHref = isLogin ? "/register" : "/login";
  const footerLinkLabel = isLogin ? "Create Account" : "Sign In";

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="glass-card w-full max-w-xl rounded-2xl p-5 sm:p-8"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200/70">{eyebrow}</p>
      <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">{title}</h2>
      <p className="mt-3 text-sm leading-relaxed text-slate-300/80">{description}</p>

      <form className="mt-7 space-y-4">
        {!isLogin && (
          <label className="block">
            <span className="mb-2 block text-xs font-medium text-slate-300">Name</span>
            <input
              type="text"
              placeholder="Your name"
              className="glass-input w-full rounded-xl px-4 py-3 text-sm text-white outline-none transition duration-300 placeholder:text-slate-400 focus:border-cyan-200/45 focus:bg-white/9"
            />
          </label>
        )}

        <label className="block">
          <span className="mb-2 block text-xs font-medium text-slate-300">Email</span>
          <input
            type="email"
            placeholder="you@studio.com"
            className="glass-input w-full rounded-xl px-4 py-3 text-sm text-white outline-none transition duration-300 placeholder:text-slate-400 focus:border-cyan-200/45 focus:bg-white/9"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-xs font-medium text-slate-300">Password</span>
          <input
            type="password"
            placeholder="********"
            className="glass-input w-full rounded-xl px-4 py-3 text-sm text-white outline-none transition duration-300 placeholder:text-slate-400 focus:border-cyan-200/45 focus:bg-white/9"
          />
        </label>

        {!isLogin && (
          <label className="block">
            <span className="mb-2 block text-xs font-medium text-slate-300">Confirm Password</span>
            <input
              type="password"
              placeholder="********"
              className="glass-input w-full rounded-xl px-4 py-3 text-sm text-white outline-none transition duration-300 placeholder:text-slate-400 focus:border-cyan-200/45 focus:bg-white/9"
            />
          </label>
        )}

        <button
          type="button"
          className="btn-primary mt-2 w-full rounded-xl px-5 py-3 text-sm font-semibold tracking-wide text-[#03111d] transition hover:scale-[1.01] active:scale-[0.99]"
        >
          {cta}
        </button>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            aria-label="Continue with Apple"
            className="btn-secondary flex items-center justify-center rounded-xl px-4 py-3 text-xs font-semibold tracking-wide"
          >
            <AppleIcon />
            {isLogin ? <span className="sr-only">Continue with Apple</span> : <span className="ml-2">Apple</span>}
          </button>
          <button
            type="button"
            aria-label="Continue with Google"
            className="btn-secondary flex items-center justify-center rounded-xl px-4 py-3 text-xs font-semibold tracking-wide"
          >
            <GoogleIcon />
            {isLogin ? <span className="sr-only">Continue with Google</span> : <span className="ml-2">Google</span>}
          </button>
        </div>
      </form>

      <p className="mt-6 text-center text-sm text-slate-300/80">
        {footerPrefix}{" "}
        <Link className="font-semibold text-cyan-200 transition hover:text-cyan-100" href={footerHref}>
          {footerLinkLabel}
        </Link>
      </p>
    </motion.section>
  );
}
