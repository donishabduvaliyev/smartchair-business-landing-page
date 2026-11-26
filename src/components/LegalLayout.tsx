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
import { BlueprintFrame } from "./BlueprintGrid";

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
    <section className="bg-paper border-b border-grid pt-28 pb-24">
      <BlueprintFrame className="px-6 py-8 sm:px-10 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-ink-muted transition-colors hover:text-ink"
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
                    "press-spring inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-xs font-semibold transition-colors",
                    active
                      ? "border-ink bg-ink text-paper"
                      : "border-grid bg-surface text-ink-muted hover:text-ink"
                  )}
                >
                  <tab.icon size={14} />
                  {tab.label}
                </Link>
              );
            })}
          </div>

          {/* Document Header */}
          <div className="mt-10 border-b border-grid pb-8">
            <span className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-brass-ink">
              <ShieldCheck size={13} />
              {doc.badge}
            </span>
            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.025em] text-ink sm:text-4xl lg:text-5xl">
              {doc.title}
            </h1>
            <p className="mt-3 text-base leading-relaxed text-ink-muted">{doc.subtitle}</p>
            <p className="mt-2 font-mono text-xs text-ink-faint">{doc.lastUpdated}</p>
          </div>

          {/* Statutory Compliance Callout Box */}
          <div className="mt-8 rounded-lg border border-grid bg-paper-subtle p-5 text-xs leading-relaxed text-ink-muted">
            <strong className="font-semibold text-brass-ink">{doc.badge}: </strong>
            {doc.complianceNote}
          </div>

          {/* Optional Interactive Portal (e.g. Delete Account Request Form) */}
          {children && <div className="mt-10">{children}</div>}

          {/* Structured Clauses */}
          <div className="mt-10 space-y-4 text-base leading-relaxed text-ink-muted">
            {doc.sections.map((sec, idx) => (
              <div key={idx} className="rounded-lg border border-grid bg-surface p-6">
                <h2 className="text-lg font-semibold text-ink">{sec.title}</h2>
                {sec.paragraphs?.map((p, pIdx) => (
                  <p key={pIdx} className="mt-3 text-sm leading-relaxed text-ink-muted">
                    {p}
                  </p>
                ))}
                {sec.bullets && sec.bullets.length > 0 && (
                  <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-ink-muted">
                    {sec.bullets.map((b, bIdx) => (
                      <li key={bIdx}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          {/* Direct Legal & Data Protection Contact Box */}
          <div className="mt-12 rounded-lg border border-grid bg-surface p-6 sm:p-8">
            <h3 className="text-lg font-semibold text-ink">{bundle.nav.questionsTitle}</h3>
            <p className="mt-1.5 text-sm text-ink-muted">{bundle.nav.questionsSubtitle}</p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <a
                href={PHONE_HREF}
                className="btn-obsidian press-spring inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-xs font-semibold"
              >
                <Phone size={14} />
                {bundle.nav.callDirect}
              </a>
              <a
                href={TELEGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost-light press-spring inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-xs font-semibold"
              >
                {TELEGRAM_HANDLE}
              </a>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost-light press-spring inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-xs font-semibold"
              >
                {INSTAGRAM_HANDLE}
              </a>
            </div>
          </div>
        </div>
      </BlueprintFrame>
    </section>
  );
}
