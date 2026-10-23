import type { ReactNode } from "react";
import {
  ArrowLeft,
  FileText,
  Phone,
  RefreshCcw,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import {
  LEGAL_CONTENT,
  resolveLegalLang,
  type LegalDocContent,
} from "../i18n/legalContent";
import {
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
  PHONE_HREF,
  TELEGRAM_HANDLE,
  TELEGRAM_URL,
} from "../lib/constants";
import { cn } from "../lib/utils";

export function LegalLayout({
  doc,
  children,
}: {
  doc: LegalDocContent;
  children?: ReactNode;
}) {
  const { i18n } = useTranslation();
  const { pathname } = useLocation();
  const lang = resolveLegalLang(i18n.language);
  const bundle = LEGAL_CONTENT[lang];

  const LEGAL_TABS = [
    { to: "/privacy", label: bundle.nav.privacy, icon: ShieldCheck },
    { to: "/terms", label: bundle.nav.terms, icon: FileText },
    { to: "/refund", label: bundle.nav.refund, icon: RefreshCcw },
    { to: "/delete-account", label: bundle.nav.deleteAccount, icon: Trash2 },
  ];

  return (
    <section className="mx-auto max-w-4xl px-6 pt-32 pb-24 lg:px-8">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm text-text-muted transition-colors hover:text-text"
      >
        <ArrowLeft size={16} />
        {bundle.nav.backHome}
      </Link>

      {/* Legal Center Sub-Navigation Tabs */}
      <div className="mt-6 flex flex-wrap gap-2">
        {LEGAL_TABS.map((tab) => {
          const active = pathname === tab.to;
          return (
            <Link
              key={tab.to}
              to={tab.to}
              className={cn(
                "press-spring inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition-colors",
                active
                  ? "border-accent/50 bg-accent/15 text-accent shadow-[0_0_20px_rgba(212,175,90,0.18)]"
                  : "border-border bg-surface/60 text-text-muted hover:border-border hover:text-text"
              )}
            >
              <tab.icon size={14} />
              {tab.label}
            </Link>
          );
        })}
      </div>

      {/* Document Header */}
      <div className="mt-10">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-3.5 py-1 text-xs font-semibold text-accent">
          <ShieldCheck size={13} />
          {doc.badge}
        </span>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-text sm:text-4xl lg:text-5xl">
          {doc.title}
        </h1>
        <p className="mt-3 text-base leading-relaxed text-text-muted">
          {doc.subtitle}
        </p>
        <p className="mt-2 text-xs font-medium text-text-faint">{doc.lastUpdated}</p>
      </div>

      {/* Statutory Compliance Callout Box */}
      <div className="mt-8 rounded-2xl border border-accent/25 bg-accent/8 p-5 text-xs leading-relaxed text-text-muted">
        <strong className="font-semibold text-accent">{doc.badge}: </strong>
        {doc.complianceNote}
      </div>

      {/* Optional Interactive Portal (e.g. Delete Account Request Form) */}
      {children && <div className="mt-10">{children}</div>}

      {/* Structured Clauses */}
      <div className="mt-10 space-y-8 text-base leading-relaxed text-text-muted">
        {doc.sections.map((sec, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-border-soft bg-surface/40 p-6"
          >
            <h2 className="text-lg font-bold text-text">{sec.title}</h2>
            {sec.paragraphs?.map((p, pIdx) => (
              <p key={pIdx} className="mt-3 text-sm leading-relaxed text-text-muted">
                {p}
              </p>
            ))}
            {sec.bullets && sec.bullets.length > 0 && (
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-text-muted">
                {sec.bullets.map((b, bIdx) => (
                  <li key={bIdx}>{b}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      {/* Direct Legal & Data Protection Contact Box */}
      <div className="card-glass mt-12 rounded-3xl border border-border p-6 sm:p-8">
        <h3 className="text-lg font-bold text-text">{bundle.nav.questionsTitle}</h3>
        <p className="mt-1.5 text-sm text-text-muted">
          {bundle.nav.questionsSubtitle}
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <a
            href={PHONE_HREF}
            className="btn-gold press-spring inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold"
          >
            <Phone size={14} />
            {bundle.nav.callDirect}
          </a>
          <a
            href={TELEGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary press-spring inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold"
          >
            {TELEGRAM_HANDLE}
          </a>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary press-spring inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold"
          >
            {INSTAGRAM_HANDLE}
          </a>
        </div>
      </div>
    </section>
  );
}
