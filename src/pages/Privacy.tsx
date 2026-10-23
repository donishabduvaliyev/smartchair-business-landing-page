import { useTranslation } from "react-i18next";
import { LegalLayout } from "../components/LegalLayout";
import { LEGAL_CONTENT, resolveLegalLang } from "../i18n/legalContent";

export function Privacy() {
  const { i18n } = useTranslation();
  const lang = resolveLegalLang(i18n.language);
  const doc = LEGAL_CONTENT[lang].privacy;

  return <LegalLayout doc={doc} />;
}
