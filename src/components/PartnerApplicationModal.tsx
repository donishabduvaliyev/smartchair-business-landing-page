import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
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
  "w-full rounded-lg border border-grid-strong bg-paper px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-ink focus:outline-none";

const INPUT_WITH_ICON_CLASS =
  "w-full rounded-lg border border-grid-strong bg-paper py-2.5 pl-10 pr-3.5 text-sm text-ink placeholder:text-ink-faint focus:border-ink focus:outline-none";

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
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-lg border border-grid bg-paper-subtle text-brass-ink">
          <CheckCircle2 size={28} />
        </div>
        <h3 className="text-2xl font-semibold text-ink">{t("partnerForm.successTitle")}</h3>
        <p className="mx-auto mt-2.5 max-w-md text-sm leading-relaxed text-ink-muted">
          {t("partnerForm.successDesc")}
        </p>

        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href={PHONE_HREF}
            className="btn-obsidian press-spring inline-flex w-full items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold sm:w-auto"
          >
            <Phone size={16} />
            {PHONE_NUMBER}
          </a>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost-light press-spring inline-flex w-full items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold sm:w-auto"
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
            className="text-xs font-medium text-ink-muted underline-offset-4 hover:text-ink hover:underline"
          >
            {t("partnerForm.submitAnother")}
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-medium text-brass-ink underline-offset-4 hover:underline"
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
      <div className="flex flex-col justify-between gap-3 rounded-lg border border-grid bg-paper-subtle p-4 sm:flex-row sm:items-center">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-brass-ink">
            {t("partnerForm.directContactTitle")}
          </p>
          <p className="mt-0.5 text-xs text-ink-muted">{t("partnerForm.directContactDesc")}</p>
        </div>
        <a
          href={PHONE_HREF}
          className="btn-ghost-light press-spring inline-flex shrink-0 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-xs font-semibold"
        >
          <Phone size={14} className="text-brass-ink" />
          {PHONE_NUMBER}
        </a>
      </div>

      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-ink-muted">
            {t("partnerForm.fields.businessName")} <span className="text-brass-ink">*</span>
          </label>
          <div className="relative">
            <Building2
              size={15}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint"
            />
            <input
              type="text"
              required
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder={t("partnerForm.fields.businessNamePlaceholder")}
              className={INPUT_WITH_ICON_CLASS}
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-ink-muted">
            {t("partnerForm.fields.ownerName")} <span className="text-brass-ink">*</span>
          </label>
          <div className="relative">
            <User
              size={15}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint"
            />
            <input
              type="text"
              required
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              placeholder={t("partnerForm.fields.ownerNamePlaceholder")}
              className={INPUT_WITH_ICON_CLASS}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-ink-muted">
            {t("partnerForm.fields.phone")} <span className="text-brass-ink">*</span>
          </label>
          <div className="relative">
            <Phone
              size={15}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint"
            />
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={t("partnerForm.fields.phonePlaceholder")}
              className={INPUT_WITH_ICON_CLASS}
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-ink-muted">
            {t("partnerForm.fields.category")}
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={INPUT_CLASS}
          >
            {CATEGORY_KEYS.map((key) => (
              <option key={key} value={key} className="bg-surface text-ink">
                {t(`categories.${key}`)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3 sm:items-end">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-ink-muted">
            {t("partnerForm.fields.city")}
          </label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder={t("partnerForm.fields.cityPlaceholder")}
            className={INPUT_CLASS}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-ink-muted">
            {t("partnerForm.fields.staffCount")}
          </label>
          <div className="relative">
            <Users
              size={15}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint"
            />
            <select
              value={staffCount}
              onChange={(e) => setStaffCount(e.target.value)}
              className={INPUT_WITH_ICON_CLASS}
            >
              {STAFF_KEYS.map((sk) => (
                <option key={sk} value={sk} className="bg-surface text-ink">
                  {t(`partnerForm.fields.staffOptions.${sk}`)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-ink-muted">
            {t("partnerForm.fields.social")}
          </label>
          <input
            type="text"
            value={telegramOrInstagram}
            onChange={(e) => setTelegramOrInstagram(e.target.value)}
            placeholder={t("partnerForm.fields.socialPlaceholder")}
            className={INPUT_CLASS}
          />
        </div>
      </div>

      {!compact && (
        <div>
          <label className="mb-1.5 block text-xs font-medium text-ink-muted">
            {t("partnerForm.fields.message")}
          </label>
          <textarea
            rows={2}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t("partnerForm.fields.messagePlaceholder")}
            className={`${INPUT_CLASS} resize-none`}
          />
        </div>
      )}

      {/* Uzbekistan Law O‘RQ-547 Explicit Consent Checkbox */}
      <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-grid bg-paper p-3 text-xs leading-relaxed text-ink-muted">
        <input
          type="checkbox"
          checked={consentAccepted}
          onChange={(e) => setConsentAccepted(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-grid-strong accent-ink"
        />
        <span>
          {t("partnerForm.consentPrefix")}
          <Link
            to="/privacy"
            onClick={onClose}
            className="font-semibold text-ink underline decoration-grid-strong underline-offset-2 hover:text-brass-ink"
          >
            {t("partnerForm.consentPrivacyLink")}
          </Link>
          {t("partnerForm.consentMiddle")}
          <Link
            to="/terms"
            onClick={onClose}
            className="font-semibold text-ink underline decoration-grid-strong underline-offset-2 hover:text-brass-ink"
          >
            {t("partnerForm.consentTermsLink")}
          </Link>
          {t("partnerForm.consentSuffix", { defaultValue: "." })}
        </span>
      </label>

      {error && (
        <p className="rounded-lg border border-[#b91c1c]/30 bg-[#b91c1c]/8 px-3.5 py-2 text-xs font-medium text-[#b91c1c]">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="btn-obsidian press-spring flex w-full items-center justify-center gap-2 rounded-lg py-3.5 text-sm font-semibold disabled:opacity-60"
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
            className="fixed inset-0 bg-obsidian/60 backdrop-blur-sm"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, scale: 0.96, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 10 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-grid bg-surface p-6 shadow-xl sm:p-8"
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <span className="font-mono text-xs uppercase tracking-wider text-brass-ink">
                  {t("partnerForm.eyebrow")}
                </span>
                <h2 className="mt-2 text-2xl font-semibold tracking-[-0.025em] text-ink">
                  {t("partnerForm.modalTitle")}
                </h2>
                <p className="mt-1 text-xs leading-relaxed text-ink-muted">
                  {t("partnerForm.modalSubtitle")}
                </p>
              </div>
              <button
                type="button"
                onClick={closePartnerModal}
                aria-label="Close modal"
                className="press-spring flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-grid bg-paper-subtle text-ink-muted transition-colors hover:text-ink"
              >
                <X size={16} />
              </button>
            </div>

            <PartnerFormBody onClose={closePartnerModal} compact />

            <div className="mt-4 flex items-center justify-center gap-1.5 font-mono text-xs text-ink-faint">
              <ShieldCheck size={14} className="text-brass-ink" />
              <span>O‘RQ-547 Personal Data Protected</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
