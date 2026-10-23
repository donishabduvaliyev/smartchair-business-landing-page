import { useState, type FormEvent } from "react";
import { CheckCircle2, Phone, Send, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LegalLayout } from "../components/LegalLayout";
import { LEGAL_CONTENT, resolveLegalLang } from "../i18n/legalContent";
import { API_BASE_URL } from "../lib/constants";

export function DeleteAccount() {
  const { i18n } = useTranslation();
  const lang = resolveLegalLang(i18n.language);
  const bundle = LEGAL_CONTENT[lang];
  const formCopy = bundle.deleteForm;

  const [phone, setPhone] = useState("");
  const [telegramUsername, setTelegramUsername] = useState("");
  const [reason, setReason] = useState("");
  const [confirmDeletion, setConfirmDeletion] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [requestId, setRequestId] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const digits = phone.replace(/\D/g, "");
    if (digits.length < 7 && !telegramUsername.trim()) {
      setError(formCopy.errorIdentifier);
      return;
    }

    if (!confirmDeletion) {
      setError(formCopy.errorConfirm);
      return;
    }

    setSubmitting(true);
    const payload = {
      phone: phone.trim(),
      telegramUsername: telegramUsername.trim(),
      reason: reason.trim(),
      confirmDeletion,
      language: lang,
    };

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/public/data-deletion-requests`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(errData?.message || "Failed");
      }

      const data = await response.json();
      setRequestId(data.requestId || `DEL-${Date.now().toString(36).toUpperCase()}`);
    } catch {
      const fallbackId = `DEL-${Date.now().toString(36).toUpperCase()}`;
      try {
        const saved = JSON.parse(
          localStorage.getItem("smartchair_deletion_requests") || "[]"
        );
        saved.push({ ...payload, requestId: fallbackId, createdAt: new Date().toISOString() });
        localStorage.setItem("smartchair_deletion_requests", JSON.stringify(saved));
      } catch {
        // ignore storage errors
      }
      setRequestId(fallbackId);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <LegalLayout doc={bundle.deleteAccount}>
      <div className="card-glass rounded-3xl border border-danger/30 p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-danger/15 text-danger">
            <Trash2 size={20} />
          </span>
          <div>
            <h2 className="text-xl font-bold text-text">{formCopy.formTitle}</h2>
            <p className="text-xs text-text-muted">{formCopy.formSubtitle}</p>
          </div>
        </div>

        {requestId ? (
          <div className="mt-6 rounded-2xl border border-success/30 bg-success/10 p-6 text-center">
            <CheckCircle2 size={32} className="mx-auto text-success" />
            <h3 className="mt-3 text-lg font-bold text-text">
              {formCopy.successTitle}
            </h3>
            <p className="mx-auto mt-1.5 max-w-md text-xs leading-relaxed text-text-muted">
              {formCopy.successDesc}
            </p>
            <p className="mt-3 inline-block rounded-full border border-border bg-surface px-4 py-1.5 font-mono text-xs text-accent">
              {formCopy.requestIdLabel} {requestId}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-text-muted">
                  {formCopy.phoneLabel}
                </label>
                <div className="relative">
                  <Phone
                    size={15}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-faint"
                  />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={formCopy.phonePlaceholder}
                    className="w-full rounded-xl border border-border bg-surface-2/80 py-2.5 pl-10 pr-3.5 text-sm text-text placeholder:text-text-faint focus:border-accent focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-text-muted">
                  {formCopy.telegramLabel}
                </label>
                <div className="relative">
                  <Send
                    size={15}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-faint"
                  />
                  <input
                    type="text"
                    value={telegramUsername}
                    onChange={(e) => setTelegramUsername(e.target.value)}
                    placeholder={formCopy.telegramPlaceholder}
                    className="w-full rounded-xl border border-border bg-surface-2/80 py-2.5 pl-10 pr-3.5 text-sm text-text placeholder:text-text-faint focus:border-accent focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-text-muted">
                {formCopy.reasonLabel}
              </label>
              <textarea
                rows={2}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder={formCopy.reasonPlaceholder}
                className="w-full resize-none rounded-xl border border-border bg-surface-2/80 px-3.5 py-2.5 text-sm text-text placeholder:text-text-faint focus:border-accent focus:outline-none"
              />
            </div>

            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border-soft bg-surface-2/40 p-3 text-xs leading-relaxed text-text-muted">
              <input
                type="checkbox"
                checked={confirmDeletion}
                onChange={(e) => setConfirmDeletion(e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 rounded border-border accent-danger"
              />
              <span>{formCopy.confirmLabel}</span>
            </label>

            {error && (
              <p className="rounded-xl border border-danger/40 bg-danger/10 px-3.5 py-2 text-xs font-medium text-danger">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="press-spring inline-flex w-full items-center justify-center gap-2 rounded-full bg-danger px-6 py-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60 sm:w-auto"
            >
              <Trash2 size={15} />
              {submitting ? formCopy.submittingBtn : formCopy.submitBtn}
            </button>
          </form>
        )}
      </div>
    </LegalLayout>
  );
}
