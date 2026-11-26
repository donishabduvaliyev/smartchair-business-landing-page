import { MessageCircle, Phone } from "lucide-react";
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
    { label: TELEGRAM_HANDLE, href: TELEGRAM_URL, icon: MessageCircle, external: true },
    { label: INSTAGRAM_HANDLE, href: INSTAGRAM_URL, icon: InstagramIcon, external: true },
  ];

  return (
    <footer className="bg-obsidian text-obsidian-text">
      <div className="mx-auto max-w-[1200px] border-x border-white/[0.06] px-8 py-16 lg:px-12">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link to="/" aria-label="SmartChair Home" className="inline-flex items-center">
              <Logo tone="dark" />
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-[#9c9ca6]">
              {t("footer.tagline")}
            </p>
            <button
              type="button"
              onClick={openPartnerModal}
              className="btn-brass press-spring mt-6 inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold"
            >
              {t("footer.cta")}
            </button>
          </div>

          <div>
            <h3 className="font-mono text-xs uppercase tracking-wider text-obsidian-text">
              {t("footer.columns.product")}
            </h3>
            <ul className="mt-4 space-y-3">
              {PRODUCT_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-[#9c9ca6] transition-colors hover:text-obsidian-text"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-mono text-xs uppercase tracking-wider text-obsidian-text">
              {t("footer.columns.company")}
            </h3>
            <ul className="mt-4 space-y-3">
              {CONTACT_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    className="flex items-center gap-2 text-sm text-[#9c9ca6] transition-colors hover:text-obsidian-text"
                  >
                    <link.icon size={14} className="shrink-0 text-[#9c9ca6]" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-mono text-xs uppercase tracking-wider text-obsidian-text">
              {t("footer.columns.legal")}
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  to="/privacy"
                  className="text-sm text-[#9c9ca6] transition-colors hover:text-obsidian-text"
                >
                  {t("footer.links.privacy")}
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-sm text-[#9c9ca6] transition-colors hover:text-obsidian-text"
                >
                  {t("footer.links.terms")}
                </Link>
              </li>
              <li>
                <Link
                  to="/refund"
                  className="text-sm text-[#9c9ca6] transition-colors hover:text-obsidian-text"
                >
                  {t("footer.links.refund")}
                </Link>
              </li>
              <li>
                <Link
                  to="/delete-account"
                  className="text-sm text-[#9c9ca6] transition-colors hover:text-obsidian-text"
                >
                  {t("footer.links.deleteAccount")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/[0.08] pt-8 text-xs text-[#9c9ca6] sm:flex-row">
          <p>
            &copy; {new Date().getFullYear()} SmartChair. {t("footer.rights")}
          </p>
          <p>{t("footer.madeFor")}</p>
        </div>
      </div>
    </footer>
  );
}
