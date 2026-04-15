import Link from "next/link";
import { AuthCard } from "@/components/auth-card";

type AuthShellVariant = "login" | "register";

type AuthShellProps = {
  variant: AuthShellVariant;
};

export function AuthShell({ variant }: AuthShellProps) {
  const isLogin = variant === "login";
  const headline = isLogin ? "Welcome Back" : "Your Sound Starts Here";
  const description = isLogin
    ? "Sign in to continue your Murmur session."
    : "Create your account and enter the Murmur studio.";

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-murmur-base text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(56,189,248,0.11),transparent_36%),radial-gradient(circle_at_82%_18%,rgba(99,102,241,0.14),transparent_32%),radial-gradient(circle_at_50%_85%,rgba(14,165,233,0.08),transparent_42%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-40 [background:linear-gradient(180deg,rgba(255,255,255,0.05)_0%,rgba(255,255,255,0)_26%)]" />

      <header className="mx-auto flex w-full max-w-screen-2xl items-center justify-between px-6 py-5 sm:px-8 sm:py-6">
        <Link
          href="/"
          className="btn-secondary rounded-full px-5 py-2 text-xl font-black tracking-[0.26em] text-zinc-100 drop-shadow-[0_0_10px_rgba(89,13,242,0.4)] transition-all hover:bg-white/8 sm:text-2xl"
        >
          MURMUR
        </Link>
        <Link href={isLogin ? "/register" : "/login"} className="btn-secondary rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em]">
          {isLogin ? "Create Account" : "Sign In"}
        </Link>
      </header>

      <main className="mx-auto grid w-full max-w-screen-2xl items-start gap-10 px-6 pb-12 pt-8 sm:px-8 sm:pt-10 lg:grid-cols-[1.05fr,0.95fr] lg:gap-14">
        <section className="order-2 space-y-4 text-center sm:space-y-5 lg:order-1 lg:text-left">
          <h1 className="text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            {headline} <span className="hero-gradient-text">Studio Mode</span>
          </h1>
          <p className="mx-auto max-w-xl text-base leading-relaxed text-slate-300/88 lg:mx-0 lg:text-lg">{description}</p>
        </section>

        <div className="order-1 flex justify-center lg:order-2">
          <AuthCard variant={variant} />
        </div>
      </main>
    </div>
  );
}
