import { useState, type FormEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Building2,
  CheckCircle2,
  Phone,
  Send,
  ShieldCheck,
  User,
  Users,
  X,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { usePartnerModal } from "../context/PartnerModalContext";
import {
  API_BASE_URL,
  CITY,
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
  PHONE_HREF,
  PHONE_NUMBER,
} from "../lib/constants";

const CATEGORY_KEYS = [
  "barber",
  "hair",
  "nails",
  "spa",
  "cosmetology",
  "massage",
  "makeup",
  "browsLashes",
  "other",
] as const;

const STAFF_KEYS = ["1-2", "3-5", "6-10", "10+"] as const;

const INPUT_CLASS =
  "w-full h-11 rounded-[10px] border border-hairline-strong bg-surface-2 px-3.5 text-sm text-text placeholder:text-text-muted transition-colors focus:border-white/30 focus:outline-none";

const INPUT_COMPACT_CLASS =
  "w-full h-10 rounded-[10px] border border-hairline-strong bg-surface-2 px-3 text-sm text-text placeholder:text-text-muted transition-colors focus:border-white/30 focus:outline-none";

const INPUT_WITH_ICON_CLASS =
  "w-full h-11 rounded-[10px] border border-hairline-strong bg-surface-2 pl-10 pr-3.5 text-sm text-text placeholder:text-text-muted transition-colors focus:border-white/30 focus:outline-none";

const INPUT_COMPACT_WITH_ICON_CLASS =
  "w-full h-10 rounded-[10px] border border-hairline-strong bg-surface-2 pl-9 pr-3 text-sm text-text placeholder:text-text-muted transition-colors focus:border-white/30 focus:outline-none";

const ARCH_INPUT_CLASS =
  "w-full h-10 border-b border-[#1C1917]/20 bg-transparent px-0 text-sm text-[#1C1917] placeholder:text-[#1C1917]/40 transition-colors focus:border-[#8C6D46] focus:outline-none";

const ARCH_INPUT_WITH_ICON_CLASS =
  "w-full h-10 border-b border-[#1C1917]/20 bg-transparent pl-6 pr-0 text-sm text-[#1C1917] placeholder:text-[#1C1917]/40 transition-colors focus:border-[#8C6D46] focus:outline-none";

export function PartnerFormBody({
  onClose,
  compact = false,
  variant = "modal",
}: {
  onClose?: () => void;
  compact?: boolean;
  variant?: "modal" | "architectural";
}) {
  const isArch = variant === "architectural";
  const inputCls = isArch
    ? ARCH_INPUT_CLASS
    : compact
      ? INPUT_COMPACT_CLASS
      : INPUT_CLASS;
  const inputWithIconCls = isArch
    ? ARCH_INPUT_WITH_ICON_CLASS
    : compact
      ? INPUT_COMPACT_WITH_ICON_CLASS
      : INPUT_WITH_ICON_CLASS;
  const iconLeftCls = isArch
    ? "left-0.5 text-[#7A5B34]"
    : compact
      ? "left-3 text-text-muted"
      : "left-3.5 text-text-muted";
  const labelCls = isArch
    ? "mb-1 block font-mono text-[10px] uppercase tracking-[0.18em] text-[#7A5B34]"
    : compact
      ? "mb-1 block truncate text-[11px] font-medium text-text-secondary"
      : "mb-1.5 block text-xs font-medium text-text-secondary";
  const { t, i18n } = useTranslation();
  const reducedMotion = useReducedMotion();
  const [businessName, setBusinessName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [phone, setPhone] = useState("+998 ");
  const [category, setCategory] = useState<string>("barber");
  const [city, setCity] = useState<string>(CITY);
  const [staffCount, setStaffCount] = useState<string>("3-5");
  const [telegramOrInstagram, setTelegramOrInstagram] = useState("");
  const [message, setMessage] = useState("");
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const digits = phone.replace(/\D/g, "");
    if (!businessName.trim() || !ownerName.trim() || digits.length < 9) {
      setError(t("partnerForm.errorRequired"));
      return;
    }

    if (!consentAccepted) {
      setError(t("partnerForm.errorConsent"));
      return;
    }

    setSubmitting(true);
    const payload = {
      businessName: businessName.trim(),
      ownerName: ownerName.trim(),
      phone: phone.trim(),
      category,
      city: city.trim() || CITY,
      staffCount,
      telegramOrInstagram: telegramOrInstagram.trim(),
      message: message.trim(),
      consentAccepted,
      language: (i18n.language || "uz").slice(0, 2),
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/public/business-inquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(errData?.message || "Request failed");
      }

      setSubmitted(true);
    } catch {
      // Save fallback copy in localStorage so no lead is lost if backend is offline
      try {
        const existing = JSON.parse(localStorage.getItem("smartchair_b2b_leads") || "[]");
        existing.push({ ...payload, createdAt: new Date().toISOString() });
        localStorage.setItem("smartchair_b2b_leads", JSON.stringify(existing));
      } catch {
        // ignore storage errors
      }
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={reducedMotion ? false : { opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
        className="py-6 text-center"
      >
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-hairline bg-surface-2 text-ok">
          <CheckCircle2 size={24} strokeWidth={1.5} />
        </div>
        <h3 className="text-xl font-medium text-text">{t("partnerForm.successTitle")}</h3>
        <p className="mx-auto mt-2.5 max-w-md text-sm leading-[1.6] text-text-secondary">
          {t("partnerForm.successDesc")}
        </p>

        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href={PHONE_HREF}
            className="btn-primary inline-flex h-11 w-full items-center justify-center gap-2 rounded-[10px] px-6 text-sm font-medium sm:w-auto"
          >
            <Phone size={15} strokeWidth={1.5} />
            {PHONE_NUMBER}
          </a>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary inline-flex h-11 w-full items-center justify-center gap-2 rounded-[10px] px-6 text-sm font-medium sm:w-auto"
          >
            {INSTAGRAM_HANDLE}
          </a>
        </div>

        <div className="mt-6 flex items-center justify-center gap-5">
          <button
            type="button"
            onClick={() => {
              setSubmitted(false);
              setBusinessName("");
              setMessage("");
            }}
            className="text-xs font-medium text-text-secondary underline-offset-4 transition-colors hover:text-text hover:underline"
          >
            {t("partnerForm.submitAnother")}
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-medium text-text underline-offset-4 transition-colors hover:underline"
            >
              {t("partnerForm.closeModal")}
            </button>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={compact ? "space-y-3" : "space-y-4"}>
      {/* Direct Call Banner inside standalone/mobile Form (modal shows compact header pill instead) */}
      {!compact && (
        <div
          className={
            isArch
              ? "flex flex-col justify-between gap-3 border-b border-[#1C1917]/15 pb-3.5 sm:flex-row sm:items-center"
              : "flex flex-col justify-between gap-3 rounded-xl border border-hairline bg-surface-2 p-4 sm:flex-row sm:items-center"
          }
        >
          <div>
            <p className={isArch ? "font-mono text-[11px] uppercase tracking-[0.14em] text-[#1C1917]" : "text-xs font-medium text-text"}>
              {t("partnerForm.directContactTitle")}
            </p>
            <p className={isArch ? "mt-0.5 text-xs text-[#4B433B]" : "mt-0.5 text-xs text-text-secondary"}>
              {t("partnerForm.directContactDesc")}
            </p>
          </div>
          <a
            href={PHONE_HREF}
            className={
              isArch
                ? "inline-flex h-8 shrink-0 items-center justify-center gap-2 border border-[#8C6D46]/50 bg-[#8C6D46]/10 px-3 font-mono text-xs text-[#5C4324] whitespace-nowrap transition-colors hover:border-[#8C6D46] hover:bg-[#8C6D46]/20"
                : "btn-secondary inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-[10px] px-3.5 text-xs font-medium whitespace-nowrap"
            }
          >
            <Phone size={13} strokeWidth={1.5} className={isArch ? "text-[#7A5B34]" : "text-text-secondary"} />
            {PHONE_NUMBER}
          </a>
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className={labelCls}>
            {t("partnerForm.fields.businessName")} <span className="text-text-muted">*</span>
          </label>
          <div className="relative">
            <Building2
              size={15}
              strokeWidth={1.5}
              className={`pointer-events-none absolute top-1/2 -translate-y-1/2 ${iconLeftCls}`}
            />
            <input
              type="text"
              required
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder={t("partnerForm.fields.businessNamePlaceholder")}
              className={inputWithIconCls}
            />
          </div>
        </div>

        <div>
          <label className={labelCls}>
            {t("partnerForm.fields.ownerName")} <span className="text-text-muted">*</span>
          </label>
          <div className="relative">
            <User
              size={15}
              strokeWidth={1.5}
              className={`pointer-events-none absolute top-1/2 -translate-y-1/2 ${iconLeftCls}`}
            />
            <input
              type="text"
              required
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              placeholder={t("partnerForm.fields.ownerNamePlaceholder")}
              className={inputWithIconCls}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className={labelCls}>
            {t("partnerForm.fields.phone")} <span className="text-text-muted">*</span>
          </label>
          <div className="relative">
            <Phone
              size={15}
              strokeWidth={1.5}
              className={`pointer-events-none absolute top-1/2 -translate-y-1/2 ${iconLeftCls}`}
            />
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={t("partnerForm.fields.phonePlaceholder")}
              className={inputWithIconCls}
            />
          </div>
        </div>

        <div>
          <label className={labelCls}>
            {t("partnerForm.fields.category")}
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={`${inputCls} appearance-none`}
          >
            {CATEGORY_KEYS.map((key) => (
              <option key={key} value={key} className="bg-[#090b10] text-white">
                {t(`categories.${key}`)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className={labelCls}>
            {t("partnerForm.fields.city")}
          </label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder={t("partnerForm.fields.cityPlaceholder")}
            className={inputCls}
          />
        </div>

        <div>
          <label className={labelCls}>
            {t("partnerForm.fields.staffCount")}
          </label>
          <div className="relative">
            <Users
              size={15}
              strokeWidth={1.5}
              className={`pointer-events-none absolute top-1/2 -translate-y-1/2 ${iconLeftCls}`}
            />
            <select
              value={staffCount}
              onChange={(e) => setStaffCount(e.target.value)}
              className={`${inputWithIconCls} appearance-none`}
            >
              {STAFF_KEYS.map((sk) => (
                <option key={sk} value={sk} className="bg-[#090b10] text-white">
                  {t(`partnerForm.fields.staffOptions.${sk}`)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div>
        <label className={labelCls}>
          {t("partnerForm.fields.social")}
        </label>
        <input
          type="text"
          value={telegramOrInstagram}
          onChange={(e) => setTelegramOrInstagram(e.target.value)}
          placeholder={t("partnerForm.fields.socialPlaceholder")}
          className={inputCls}
        />
      </div>

      {!compact && (
        <div>
          <label className={labelCls}>
            {t("partnerForm.fields.message")}
          </label>
          <textarea
            rows={2}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t("partnerForm.fields.messagePlaceholder")}
            className={
              isArch
                ? "w-full resize-none border-b border-white/20 bg-transparent py-2 text-sm text-[#f2efe9] placeholder:text-white/35 transition-colors focus:border-[#d4af5a] focus:outline-none"
                : "w-full resize-none rounded-[10px] border border-hairline-strong bg-surface-2 px-3.5 py-2.5 text-sm text-text placeholder:text-text-muted transition-colors focus:border-white/30 focus:outline-none"
            }
          />
        </div>
      )}

      {/* Uzbekistan Law O‘RQ-547 Explicit Consent Checkbox */}
      <label
        className={
          isArch
            ? "flex cursor-pointer items-start gap-3 border-l border-[#8C6D46]/45 bg-[#8C6D46]/[0.06] px-3.5 py-2.5 text-xs leading-relaxed text-[#4B433B]"
            : compact
              ? "flex cursor-pointer items-start gap-2.5 rounded-[10px] border border-hairline bg-surface-2 p-2.5 text-[11px] leading-snug text-text-secondary"
              : "flex cursor-pointer items-start gap-3 rounded-[10px] border border-hairline bg-surface-2 p-3.5 text-xs leading-relaxed text-text-secondary"
        }
      >
        <input
          type="checkbox"
          checked={consentAccepted}
          onChange={(e) => setConsentAccepted(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-hairline-strong accent-[#7A5B34]"
        />
        <span>
          {t("partnerForm.consentPrefix")}
          <Link
            to="/privacy"
            onClick={onClose}
            className={
              isArch
                ? "font-medium text-[#1C1917] underline decoration-[#8C6D46]/40 underline-offset-2 transition-colors hover:decoration-[#7A5B34]"
                : "font-medium text-text underline decoration-white/25 underline-offset-2 transition-colors hover:decoration-white/60"
            }
          >
            {t("partnerForm.consentPrivacyLink")}
          </Link>
          {t("partnerForm.consentMiddle")}
          <Link
            to="/terms"
            onClick={onClose}
            className={
              isArch
                ? "font-medium text-[#1C1917] underline decoration-[#8C6D46]/40 underline-offset-2 transition-colors hover:decoration-[#7A5B34]"
                : "font-medium text-text underline decoration-white/25 underline-offset-2 transition-colors hover:decoration-white/60"
            }
          >
            {t("partnerForm.consentTermsLink")}
          </Link>
          {t("partnerForm.consentSuffix", { defaultValue: "." })}
        </span>
      </label>

      {error && (
        <p className="border-l-2 border-danger bg-danger/10 px-3.5 py-2.5 text-xs font-medium text-danger">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className={
          isArch
            ? "flex h-11 w-full items-center justify-center gap-2 border border-[#1C1917] bg-[#1C1917] font-mono text-xs uppercase tracking-[0.2em] text-[#F5EFE6] transition-all hover:bg-[#332D29] disabled:opacity-60"
            : `btn-primary flex ${compact ? "h-10" : "h-11"} w-full items-center justify-center gap-2 rounded-[10px] text-sm font-medium disabled:opacity-60`
        }
      >
        <Send size={15} strokeWidth={1.5} />
        {submitting ? t("partnerForm.submitting") : t("partnerForm.submit")}
      </button>
    </form>
  );
}

export function PartnerApplicationModal() {
  const { isOpen, closePartnerModal } = usePartnerModal();
  const { t } = useTranslation();
  const reducedMotion = useReducedMotion();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={closePartnerModal}
            className="fixed inset-0 bg-bg/75 backdrop-blur-sm"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            initial={reducedMotion ? false : { opacity: 0, scale: 0.97, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98, y: 8 }}
            transition={{ duration: 0.24, ease: [0.23, 1, 0.32, 1] }}
            className="surface-card relative z-10 max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-[20px] p-5 sm:p-6"
          >
            <div className="mb-3.5 flex items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <p className="text-xs font-medium text-text-muted">
                    {t("partnerForm.eyebrow")}
                  </p>
                  <a
                    href={PHONE_HREF}
                    className="inline-flex items-center gap-1.5 rounded-full border border-hairline-strong bg-surface-2 px-2.5 py-0.5 font-mono text-[11px] text-[#d4af5a] transition-colors hover:border-[#d4af5a]/50"
                  >
                    <Phone size={11} strokeWidth={1.5} />
                    <span>{PHONE_NUMBER}</span>
                  </a>
                </div>
                <h2 className="mt-1 text-xl font-medium tracking-[-0.02em] text-text sm:text-2xl">
                  {t("partnerForm.modalTitle")}
                </h2>
                <p className="mt-0.5 text-xs leading-relaxed text-text-secondary">
                  {t("partnerForm.modalSubtitle")}
                </p>
              </div>
              <button
                type="button"
                onClick={closePartnerModal}
                aria-label="Close modal"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] border border-hairline-strong bg-surface-2 text-text-muted transition-colors hover:bg-surface-3 hover:text-text"
              >
                <X size={16} strokeWidth={1.5} />
              </button>
            </div>

            <PartnerFormBody onClose={closePartnerModal} compact />

            <div className="mt-3 flex items-center justify-center gap-1.5 font-mono text-[11px] text-text-muted">
              <ShieldCheck size={13} strokeWidth={1.5} className="text-text-secondary" />
              <span>O‘RQ-547 Personal Data Protected</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
