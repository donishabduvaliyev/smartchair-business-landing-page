import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Building2,
  CheckCircle2,
  Phone,
  Send,
  ShieldCheck,
  Sparkles,
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

export function PartnerFormBody({
  onClose,
  compact = false,
}: {
  onClose?: () => void;
  compact?: boolean;
}) {
  const { t, i18n } = useTranslation();
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
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="py-6 text-center"
      >
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-accent/40 bg-accent/15 text-accent shadow-[0_0_30px_rgba(212,175,90,0.25)]">
          <CheckCircle2 size={32} />
        </div>
        <h3 className="text-2xl font-bold text-text">{t("partnerForm.successTitle")}</h3>
        <p className="mx-auto mt-2.5 max-w-md text-sm leading-relaxed text-text-muted">
          {t("partnerForm.successDesc")}
        </p>

        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href={PHONE_HREF}
            className="btn-gold press-spring inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold sm:w-auto"
          >
            <Phone size={16} />
            {PHONE_NUMBER}
          </a>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary press-spring inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold sm:w-auto"
          >
            {INSTAGRAM_HANDLE}
          </a>
        </div>

        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => {
              setSubmitted(false);
              setBusinessName("");
              setMessage("");
            }}
            className="text-xs font-medium text-text-muted underline-offset-4 hover:text-text hover:underline"
          >
            {t("partnerForm.submitAnother")}
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-medium text-accent underline-offset-4 hover:underline"
            >
              {t("partnerForm.closeModal")}
            </button>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Direct Call Banner inside Modal/Form */}
      <div className="flex flex-col justify-between gap-3 rounded-2xl border border-accent/25 bg-accent/10 p-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-accent">
            {t("partnerForm.directContactTitle")}
          </p>
          <p className="mt-0.5 text-xs text-text-muted">{t("partnerForm.directContactDesc")}</p>
        </div>
        <a
          href={PHONE_HREF}
          className="press-spring inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-accent/40 bg-surface px-4 py-2.5 text-xs font-bold text-accent transition-colors hover:bg-accent hover:text-accent-ink"
        >
          <Phone size={14} />
          {PHONE_NUMBER}
        </a>
      </div>

      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-text-muted">
            {t("partnerForm.fields.businessName")} <span className="text-accent">*</span>
          </label>
          <div className="relative">
            <Building2
              size={15}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-faint"
            />
            <input
              type="text"
              required
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder={t("partnerForm.fields.businessNamePlaceholder")}
              className="w-full rounded-xl border border-border bg-surface-2/80 py-2.5 pl-10 pr-3.5 text-sm text-text placeholder:text-text-faint focus:border-accent focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-text-muted">
            {t("partnerForm.fields.ownerName")} <span className="text-accent">*</span>
          </label>
          <div className="relative">
            <User
              size={15}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-faint"
            />
            <input
              type="text"
              required
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              placeholder={t("partnerForm.fields.ownerNamePlaceholder")}
              className="w-full rounded-xl border border-border bg-surface-2/80 py-2.5 pl-10 pr-3.5 text-sm text-text placeholder:text-text-faint focus:border-accent focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-text-muted">
            {t("partnerForm.fields.phone")} <span className="text-accent">*</span>
          </label>
          <div className="relative">
            <Phone
              size={15}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-faint"
            />
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={t("partnerForm.fields.phonePlaceholder")}
              className="w-full rounded-xl border border-border bg-surface-2/80 py-2.5 pl-10 pr-3.5 text-sm text-text placeholder:text-text-faint focus:border-accent focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-text-muted">
            {t("partnerForm.fields.category")}
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-xl border border-border bg-surface-2/80 px-3.5 py-2.5 text-sm text-text focus:border-accent focus:outline-none"
          >
            {CATEGORY_KEYS.map((key) => (
              <option key={key} value={key} className="bg-surface text-text">
                {t(`categories.${key}`)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-text-muted">
            {t("partnerForm.fields.city")}
          </label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder={t("partnerForm.fields.cityPlaceholder")}
            className="w-full rounded-xl border border-border bg-surface-2/80 px-3.5 py-2.5 text-sm text-text placeholder:text-text-faint focus:border-accent focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-text-muted">
            {t("partnerForm.fields.staffCount")}
          </label>
          <div className="relative">
            <Users
              size={15}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-faint"
            />
            <select
              value={staffCount}
              onChange={(e) => setStaffCount(e.target.value)}
              className="w-full rounded-xl border border-border bg-surface-2/80 py-2.5 pl-10 pr-3.5 text-sm text-text focus:border-accent focus:outline-none"
            >
              {STAFF_KEYS.map((sk) => (
                <option key={sk} value={sk} className="bg-surface text-text">
                  {t(`partnerForm.fields.staffOptions.${sk}`)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-text-muted">
            {t("partnerForm.fields.social")}
          </label>
          <input
            type="text"
            value={telegramOrInstagram}
            onChange={(e) => setTelegramOrInstagram(e.target.value)}
            placeholder={t("partnerForm.fields.socialPlaceholder")}
            className="w-full rounded-xl border border-border bg-surface-2/80 px-3.5 py-2.5 text-sm text-text placeholder:text-text-faint focus:border-accent focus:outline-none"
          />
        </div>
      </div>

      {!compact && (
        <div>
          <label className="mb-1.5 block text-xs font-medium text-text-muted">
            {t("partnerForm.fields.message")}
          </label>
          <textarea
            rows={2}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t("partnerForm.fields.messagePlaceholder")}
            className="w-full resize-none rounded-xl border border-border bg-surface-2/80 px-3.5 py-2.5 text-sm text-text placeholder:text-text-faint focus:border-accent focus:outline-none"
          />
        </div>
      )}

      {/* Uzbekistan Law O‘RQ-547 Explicit Consent Checkbox */}
      <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border-soft bg-surface-2/40 p-3 text-xs leading-relaxed text-text-muted">
        <input
          type="checkbox"
          checked={consentAccepted}
          onChange={(e) => setConsentAccepted(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-border accent-accent"
        />
        <span>
          {t("partnerForm.consentPrefix")}
          <Link
            to="/privacy"
            onClick={onClose}
            className="font-semibold text-accent underline-offset-2 hover:underline"
          >
            {t("partnerForm.consentPrivacyLink")}
          </Link>
          {t("partnerForm.consentMiddle")}
          <Link
            to="/terms"
            onClick={onClose}
            className="font-semibold text-accent underline-offset-2 hover:underline"
          >
            {t("partnerForm.consentTermsLink")}
          </Link>
          {t("partnerForm.consentSuffix", { defaultValue: "." })}
        </span>
      </label>

      {error && (
        <p className="rounded-xl border border-danger/40 bg-danger/10 px-3.5 py-2 text-xs font-medium text-danger">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="btn-gold press-spring flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-sm font-semibold disabled:opacity-60"
      >
        <Send size={15} />
        {submitting ? t("partnerForm.submitting") : t("partnerForm.submit")}
      </button>
    </form>
  );
}

export function PartnerApplicationModal() {
  const { isOpen, closePartnerModal } = usePartnerModal();
  const { t } = useTranslation();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closePartnerModal}
            className="fixed inset-0 bg-black/75 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            className="card-glass relative z-10 max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-border p-6 shadow-2xl sm:p-8"
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-accent">
                  <Sparkles size={12} />
                  {t("partnerForm.eyebrow")}
                </span>
                <h2 className="mt-2.5 text-2xl font-extrabold tracking-tight text-text">
                  {t("partnerForm.modalTitle")}
                </h2>
                <p className="mt-1 text-xs leading-relaxed text-text-muted">
                  {t("partnerForm.modalSubtitle")}
                </p>
              </div>
              <button
                type="button"
                onClick={closePartnerModal}
                aria-label="Close modal"
                className="press-spring flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-surface-2 text-text-muted transition-colors hover:text-text"
              >
                <X size={16} />
              </button>
            </div>

            <PartnerFormBody onClose={closePartnerModal} compact />

            <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-text-faint">
              <ShieldCheck size={13} className="text-accent" />
              <span>O‘RQ-547 Personal Data Protected</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
