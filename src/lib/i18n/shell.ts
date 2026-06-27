import type { Locale } from "./config";
import type { MessageKey } from "./messages";

export interface FooterLinkDefinition {
  id:
    | "privacy"
    | "contact"
    | "about"
    | "methodology"
    | "editorialPolicy"
    | "corrections";
  labelKey: MessageKey;
  paths: Partial<Record<Locale, string>>;
}

export interface FooterLink {
  id: FooterLinkDefinition["id"];
  labelKey: MessageKey;
  href: string;
}

export const FOOTER_LINKS: FooterLinkDefinition[] = [
  {
    id: "privacy",
    labelKey: "footer.privacy",
    paths: { es: "/privacidad" },
  },
  {
    id: "contact",
    labelKey: "footer.contact",
    paths: { es: "/contacto" },
  },
  {
    id: "about",
    labelKey: "footer.about",
    paths: { es: "/acerca-de" },
  },
  {
    id: "methodology",
    labelKey: "footer.methodology",
    paths: { es: "/metodologia" },
  },
  {
    id: "editorialPolicy",
    labelKey: "footer.editorialPolicy",
    paths: { es: "/politica-editorial" },
  },
  {
    id: "corrections",
    labelKey: "footer.corrections",
    paths: { es: "/correcciones" },
  },
];

export const getFooterLinks = (locale: Locale): FooterLink[] =>
  FOOTER_LINKS.flatMap((link) => {
    const href = link.paths[locale];

    return href ? [{ id: link.id, labelKey: link.labelKey, href }] : [];
  });

export const getPrivacyPath = (locale: Locale) =>
  FOOTER_LINKS.find((link) => link.id === "privacy")?.paths[locale] ?? null;

export const isAdConsentEnabled = (locale: Locale) =>
  Boolean(getPrivacyPath(locale));
