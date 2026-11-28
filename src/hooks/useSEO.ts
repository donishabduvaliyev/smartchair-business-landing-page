import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { normalizeLang, STORY_CONTENT, type LangCode } from "../content/storyContent";

export interface SEOOptions {
  title?: string;
  description?: string;
  canonicalPath?: string;
  ogImage?: string;
}

const DEFAULT_HOME_METADATA: Record<LangCode, { title: string; description: string; ogLocale: string }> = {
  uz: {
    title: "SmartChair — Sartaroshxona va Salonlarga Online Navbat",
    description:
      "O'zbekiston va Namangandagi barbershop, sartaroshxona, go'zallik saloni va spa markazlariga 24/7 online navbat va salon boshqaruv tizimi.",
    ogLocale: "uz_UZ",
  },
  ru: {
    title: "SmartChair — Онлайн-запись в барбершопы и салоны",
    description:
      "Платформа онлайн-записи и управления для барбершопов, парикмахерских, нейл-студий и спа-салонов в Намангане и по всему Узбекистану.",
    ogLocale: "ru_RU",
  },
  en: {
    title: "SmartChair — Barbershop & Salon Booking in Uzbekistan",
    description:
      "Online appointment booking and salon operations platform for barbershops, beauty salons, nail studios, and spas in Namangan and across Uzbekistan.",
    ogLocale: "en_US",
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

function setHreflangLink(hreflang: string, href: string) {
  let link = document.querySelector(`link[rel="alternate"][hreflang="${hreflang}"]`);
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "alternate");
    link.setAttribute("hreflang", hreflang);
    document.head.appendChild(link);
  }
  link.setAttribute("href", href);
}

export function useSEO(options?: SEOOptions) {
  const { i18n } = useTranslation();
  const lang = normalizeLang(i18n.language);
  const defaultMeta = DEFAULT_HOME_METADATA[lang] || DEFAULT_HOME_METADATA.uz;

  const title = options?.title || defaultMeta.title;
  const description = options?.description || defaultMeta.description;
  const canonicalPath = options?.canonicalPath ?? window.location.pathname;
  const normalizedPath = canonicalPath === "/" ? "/" : canonicalPath;
  const canonicalUrl = `https://smartchair.uz${normalizedPath}`;
  const ogImage = options?.ogImage || "https://smartchair.uz/og-image.png";

  useEffect(() => {
    document.title = title;
    document.documentElement.lang = lang;

    setMetaTag('meta[name="description"]', "name", "description", description);

    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute("href", canonicalUrl);

    // Sync hreflang alternates with sitemap.xml
    setHreflangLink("x-default", canonicalUrl);
    setHreflangLink("uz", `${canonicalUrl}?lang=uz`);
    setHreflangLink("ru", `${canonicalUrl}?lang=ru`);
    setHreflangLink("en", `${canonicalUrl}?lang=en`);

    // Open Graph & Twitter
    setMetaTag('meta[property="og:title"]', "property", "og:title", title);
    setMetaTag('meta[property="og:description"]', "property", "og:description", description);
    setMetaTag('meta[property="og:url"]', "property", "og:url", canonicalUrl);
    setMetaTag('meta[property="og:image"]', "property", "og:image", ogImage);
    setMetaTag('meta[property="og:locale"]', "property", "og:locale", defaultMeta.ogLocale);

    setMetaTag('meta[name="twitter:title"]', "name", "twitter:title", title);
    setMetaTag('meta[name="twitter:description"]', "name", "twitter:description", description);
    setMetaTag('meta[name="twitter:url"]', "name", "twitter:url", canonicalUrl);
    setMetaTag('meta[name="twitter:image"]', "name", "twitter:image", ogImage);

    // Sync structured JSON-LD @graph (FAQPage emitted on /faq so schema matches rendered FAQ content 100%)
    const jsonLdEl = document.getElementById("smartchair-jsonld");
    if (jsonLdEl) {
      const graphNodes: Record<string, unknown>[] = [
        {
          "@type": "SoftwareApplication",
          "@id": "https://smartchair.uz/#app",
          name: "SmartChair",
          alternateName: [
            "smartchair.uz",
            "Smart Chair Uzbekistan",
            "SmartChair Sartaroshxona",
            "SmartChair Барбершоп",
          ],
          applicationCategory: "LifestyleApplication",
          operatingSystem: "Web, Telegram, iOS, Android",
          url: "https://smartchair.uz",
          description,
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "UZS",
          },
        },
        {
          "@type": "Organization",
          "@id": "https://smartchair.uz/#org",
          name: "SmartChair",
          url: "https://smartchair.uz",
          logo: "https://smartchair.uz/favicon-512x512.png",
          telephone: "+998949827070",
          contactPoint: {
            "@type": "ContactPoint",
            telephone: "+998949827070",
            contactType: "customer service",
            areaServed: "UZ",
            availableLanguage: ["Uzbek", "Russian", "English"],
          },
          sameAs: [
            "https://t.me/SmartChairNamanganbot",
            "https://instagram.com/_smartchair",
          ],
          address: {
            "@type": "PostalAddress",
            addressLocality: "Namangan",
            addressCountry: "UZ",
          },
        },
        {
          "@type": "WebSite",
          "@id": "https://smartchair.uz/#website",
          url: "https://smartchair.uz",
          name: "SmartChair",
          publisher: { "@id": "https://smartchair.uz/#org" },
        },
      ];

      if (normalizedPath === "/faq") {
        const faqs = STORY_CONTENT[lang].act5.faqs;
        graphNodes.push({
          "@type": "FAQPage",
          "@id": "https://smartchair.uz/faq#faq",
          mainEntity: faqs.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.a,
            },
          })),
        });
      }

      jsonLdEl.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@graph": graphNodes,
      });
    }
  }, [title, description, canonicalUrl, ogImage, lang, defaultMeta.ogLocale]);
}
