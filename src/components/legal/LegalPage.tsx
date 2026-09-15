import type { ReactNode } from "react";
import { motion } from "framer-motion";

export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <section className="relative pb-28 pt-32">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-bg" />
        <div className="absolute left-1/2 top-[-10%] h-[400px] w-[500px] -translate-x-1/2 rounded-full bg-accent/10 blur-[140px]" />
      </div>

      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1 className="text-3xl font-extrabold tracking-tight text-text sm:text-4xl">
            {title}
          </h1>
          <p className="mt-3 text-sm text-text-faint">Last updated: {updated}</p>

          <div className="legal-prose mt-10 space-y-8 text-text-muted">
            {children}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function LegalSection({
  heading,
  children,
}: {
  heading: string;
  children: ReactNode;
}) {
  return (
    <div>
      <h2 className="text-lg font-bold text-text">{heading}</h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed">{children}</div>
    </div>
  );
}
