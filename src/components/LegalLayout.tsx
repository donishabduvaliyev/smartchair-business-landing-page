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
import { useSEO } from "../hooks/useSEO";
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

  useSEO({
    title: `${doc.title} | SmartChair`,
    description: `${doc.subtitle} — SmartChair platformasi. ${doc.complianceNote}`,
    canonicalPath: pathname,
  });

  const LEGAL_TABS = [
    { to: "/privacy", label: bundle.nav.privacy, icon: ShieldCheck },
    { to: "/terms", label: bundle.nav.terms, icon: FileText },
    { to: "/refund", label: bundle.nav.refund, icon: RefreshCcw },
    { to: "/delete-account", label: bundle.nav.deleteAccount, icon: Trash2 },
  ];

  return (
    <section className="mx-auto max-w-3xl px-6 pt-28 pb-24">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm text-text-muted transition-colors hover:text-text"
      >
        <ArrowLeft size={16} strokeWidth={1.5} />
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
                "inline-flex h-10 items-center gap-2 rounded-[10px] border px-3.5 text-xs font-medium transition-colors",
                active
                  ? "border-hairline-strong bg-surface-3 text-text"
                  : "border-hairline bg-surface-1 text-text-muted hover:bg-surface-2 hover:text-text"
              )}
            >
              <tab.icon size={14} strokeWidth={1.5} />
              {tab.label}
            </Link>
          );
        })}
      </div>

      {/* Document Header */}
      <div className="mt-10 border-b border-white/[0.06] pb-8">
        <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-text-muted">
          <ShieldCheck size={14} strokeWidth={1.5} />
          {doc.badge}
        </span>
        <h1 className="mt-2.5 text-[28px] font-medium leading-[1.12] tracking-[-0.025em] text-text [text-wrap:balance] sm:text-[36px]">
          {doc.title}
        </h1>
        <p className="mt-3 text-base leading-[1.6] text-text-secondary">{doc.subtitle}</p>
        <p className="mt-2 font-mono text-xs text-text-muted">{doc.lastUpdated}</p>
      </div>

      {/* Statutory Compliance Callout Box */}
      <div className="surface-card mt-8 rounded-2xl p-5 text-xs leading-[1.65] text-text-secondary">
        <strong className="font-medium text-text">{doc.badge}: </strong>
        {doc.complianceNote}
      </div>

      {/* Optional Interactive Portal (e.g. Delete Account Request Form) */}
      {children && <div className="mt-8">{children}</div>}

      {/* Structured Clauses */}
      <div className="mt-8 space-y-4">
        {doc.sections.map((sec, idx) => (
          <div key={idx} className="surface-card rounded-2xl p-6">
            <h2 className="text-lg font-medium leading-[1.35] tracking-[-0.015em] text-text">
              {sec.title}
            </h2>
            {sec.paragraphs?.map((p, pIdx) => (
              <p key={pIdx} className="mt-3 text-sm leading-[1.65] text-text-secondary">
                {p}
              </p>
            ))}
            {sec.bullets && sec.bullets.length > 0 && (
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-[1.65] text-text-secondary">
                {sec.bullets.map((b, bIdx) => (
                  <li key={bIdx}>{b}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      {/* Direct Legal & Data Protection Contact Box */}
      <div className="surface-card mt-10 rounded-2xl p-6 sm:p-8">
        <h3 className="text-lg font-medium text-text">{bundle.nav.questionsTitle}</h3>
        <p className="mt-1.5 text-sm leading-[1.6] text-text-secondary">
          {bundle.nav.questionsSubtitle}
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <a
            href={PHONE_HREF}
            className="btn-primary inline-flex h-10 items-center gap-2 rounded-[10px] px-4 text-xs font-medium whitespace-nowrap"
          >
            <Phone size={14} strokeWidth={1.5} />
            {bundle.nav.callDirect}
          </a>
          <a
            href={TELEGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary inline-flex h-10 items-center gap-2 rounded-[10px] px-4 text-xs font-medium whitespace-nowrap"
          >
            {TELEGRAM_HANDLE}
          </a>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary inline-flex h-10 items-center gap-2 rounded-[10px] px-4 text-xs font-medium whitespace-nowrap"
          >
            {INSTAGRAM_HANDLE}
          </a>
        </div>
      </div>
    </section>
  );
}
