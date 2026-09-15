import { AtSign, Phone, Send } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
  PHONE_HREF,
  PHONE_NUMBER,
  TELEGRAM_HANDLE,
  TELEGRAM_URL,
} from "../lib/constants";
import { Logo } from "./Logo";

export function Footer() {
  const { t } = useTranslation();

  const PRODUCT_LINKS = [
    { label: t("footer.links.forBusiness"), href: "/#for-business" },
    { label: t("footer.links.features"), href: "/#features" },
    { label: t("footer.links.howItWorks"), href: "/#how-it-works" },
    { label: t("footer.links.reviews"), href: "/#reviews" },
  ];

  const CONTACT_LINKS = [
    { label: PHONE_NUMBER, href: PHONE_HREF, icon: Phone },
    { label: TELEGRAM_HANDLE, href: TELEGRAM_URL, icon: Send, external: true },
    { label: INSTAGRAM_HANDLE, href: INSTAGRAM_URL, icon: AtSign, external: true },
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
            <a
              href={TELEGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-accent-soft to-accent px-5 py-2.5 text-sm font-semibold text-accent-ink"
            >
              {t("footer.cta")}
            </a>
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
