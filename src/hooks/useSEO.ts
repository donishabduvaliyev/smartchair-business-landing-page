import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export interface SEOOptions {
  title?: string;
  description?: string;
  canonicalPath?: string;
  ogImage?: string;
}

const DEFAULT_HOME_METADATA = {
  uz: {
    title: "SmartChair — Sartaroshxona va Go'zallik Salonlariga Online Navbat | smartchair.uz",
    description:
      "SmartChair (smartchair.uz) — Namangan va O'zbekistondagi sartaroshxona, go'zallik salonlari, manikyur va spa markazlariga online navbat olish platformasi. 24/7 navbatsiz yozilish.",
  },
  ru: {
    title: "SmartChair — Онлайн запись в барбершопы и салоны красоты в Намангане | smartchair.uz",
    description:
      "SmartChair — современная платформа для онлайн записи в барбершопы, парикмахерские и салоны красоты в Намангане и Узбекистане. Записывайтесь 24/7 без очередей.",
  },
  en: {
    title: "SmartChair — Barbershop & Beauty Salon Online Booking in Uzbekistan | smartchair.uz",
    description:
      "SmartChair (smartchair.uz) — Book appointments 24/7 at top-rated barbershops, salons, spas, and wellness masters in Namangan and across Uzbekistan.",
  },
};

function setMetaTag(selector: string, attrName: string, attrValue: string, content: string) {
  let el = document.querySelector(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attrName, attrValue);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

export function useSEO(options?: SEOOptions) {
  const { i18n } = useTranslation();
  const lang = (i18n.language?.slice(0, 2) as "uz" | "ru" | "en") || "uz";
  const defaultMeta = DEFAULT_HOME_METADATA[lang] || DEFAULT_HOME_METADATA.uz;

  const title = options?.title || defaultMeta.title;
  const description = options?.description || defaultMeta.description;
  const canonicalPath = options?.canonicalPath ?? window.location.pathname;
  const canonicalUrl = `https://smartchair.uz${canonicalPath === "/" ? "/" : canonicalPath}`;
  const ogImage = options?.ogImage || "https://smartchair.uz/og-image.png";

  useEffect(() => {
    // 1. Title
    document.title = title;

    // 2. Meta description
    setMetaTag('meta[name="description"]', "name", "description", description);

    // 3. Canonical tag
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute("href", canonicalUrl);

    // 4. OpenGraph tags
    setMetaTag('meta[property="og:title"]', "property", "og:title", title);
    setMetaTag('meta[property="og:description"]', "property", "og:description", description);
    setMetaTag('meta[property="og:url"]', "property", "og:url", canonicalUrl);
    setMetaTag('meta[property="og:image"]', "property", "og:image", ogImage);

    // 5. Twitter Card tags
    setMetaTag('meta[name="twitter:title"]', "name", "twitter:title", title);
    setMetaTag('meta[name="twitter:description"]', "name", "twitter:description", description);
    setMetaTag('meta[name="twitter:url"]', "name", "twitter:url", canonicalUrl);
    setMetaTag('meta[name="twitter:image"]', "name", "twitter:image", ogImage);

    // 6. html lang attribute
    document.documentElement.lang = lang;
  }, [title, description, canonicalUrl, ogImage, lang]);
}
