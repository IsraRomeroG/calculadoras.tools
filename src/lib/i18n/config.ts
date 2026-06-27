export const LOCALES = ["es", "en"] as const;

export type Locale = (typeof LOCALES)[number];

export interface LocaleConfig {
  locale: Locale;
  htmlLang: string;
  formatLocale: string;
  urlPrefix: "" | "/en";
  label: string;
  defaultCurrency?: string;
}

export const DEFAULT_LOCALE = "es" satisfies Locale;

export const LOCALE_CONFIG: Record<Locale, LocaleConfig> = {
  es: {
    locale: "es",
    htmlLang: "es-MX",
    formatLocale: "es-MX",
    urlPrefix: "",
    label: "Espanol",
    defaultCurrency: "MXN",
  },
  en: {
    locale: "en",
    htmlLang: "en",
    formatLocale: "en-US",
    urlPrefix: "/en",
    label: "English",
    defaultCurrency: "USD",
  },
};

export const isLocale = (value: string): value is Locale =>
  LOCALES.includes(value as Locale);
