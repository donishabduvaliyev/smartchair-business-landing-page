import { Phone, Send } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { usePartnerModal } from "../context/PartnerModalContext";
import {
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
  PHONE_HREF,
  PHONE_NUMBER,
  TELEGRAM_HANDLE,
  TELEGRAM_URL,
} from "../lib/constants";
import { Logo } from "./Logo";

function InstagramIcon({ size = 14, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export function Footer() {
  const { t } = useTranslation();
  const { openPartnerModal } = usePartnerModal();

  const PRODUCT_LINKS = [
    { label: t("footer.links.forBusiness"), href: "/#for-business" },
    { label: t("footer.links.features"), href: "/#features" },
    { label: t("footer.links.howItWorks"), href: "/#how-it-works" },
    { label: t("footer.links.reviews"), href: "/#reviews" },
    { label: t("footer.links.faq"), href: "/#faq" },
  ];

  const CONTACT_LINKS = [
    { label: PHONE_NUMBER, href: PHONE_HREF, icon: Phone },
    { label: TELEGRAM_HANDLE, href: TELEGRAM_URL, icon: Send, external: true },
    { label: INSTAGRAM_HANDLE, href: INSTAGRAM_URL, icon: InstagramIcon, external: true },
  ];

  return (
    <footer className="relative border-t border-border">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link to="/">
              <Logo />
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-text-muted">
              {t("footer.tagline")}
            </p>
            <button
              type="button"
              onClick={openPartnerModal}
              className="press-spring mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-accent-soft to-accent px-5 py-2.5 text-sm font-semibold text-accent-ink"
            >
              {t("footer.cta")}
            </button>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-text">{t("footer.columns.product")}</h4>
            <ul className="mt-4 space-y-3">
              {PRODUCT_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-text-muted transition-colors hover:text-text"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-text">{t("footer.columns.company")}</h4>
            <ul className="mt-4 space-y-3">
              {CONTACT_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    className="flex items-center gap-2 text-sm text-text-muted transition-colors hover:text-text"
                  >
                    <link.icon size={14} className="text-text-faint" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-text">{t("footer.columns.legal")}</h4>
            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  to="/privacy"
                  className="text-sm text-text-muted transition-colors hover:text-text"
                >
                  {t("footer.links.privacy")}
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-sm text-text-muted transition-colors hover:text-text"
                >
                  {t("footer.links.terms")}
                </Link>
              </li>
              <li>
                <Link
                  to="/refund"
                  className="text-sm text-text-muted transition-colors hover:text-text"
                >
                  {t("footer.links.refund")}
                </Link>
              </li>
              <li>
                <Link
                  to="/delete-account"
                  className="text-sm text-text-muted transition-colors hover:text-text"
                >
                  {t("footer.links.deleteAccount")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-border-soft pt-8 text-xs text-text-faint sm:flex-row">
          <p>&copy; {new Date().getFullYear()} SmartChair. {t("footer.rights")}</p>
          <p>{t("footer.madeFor")}</p>
        </div>
      </div>
    </footer>
  );
}
