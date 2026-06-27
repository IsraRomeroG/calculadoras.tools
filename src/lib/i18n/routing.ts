import {
  DEFAULT_LOCALE,
  LOCALE_CONFIG,
  LOCALES,
  type Locale,
} from "./config";

export interface AlternateLink {
  locale: Locale | "x-default";
  hreflang: string;
  href: string;
}

export function normalizePath(path: string): string {
  const pathname = path.trim() || "/";
  const prefixedPathname = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const normalized = prefixedPathname.replace(/\/+$/, "");

  return normalized || "/";
}

export function getLocaleFromPathname(pathname: string): Locale {
  const normalizedPathname = normalizePath(pathname);
  const firstSegment = normalizedPathname.split("/").filter(Boolean)[0];
  const matchingLocale = LOCALES.find(
    (locale) => LOCALE_CONFIG[locale].urlPrefix === `/${firstSegment}`,
  );

  return matchingLocale ?? DEFAULT_LOCALE;
}

export function prefixLocalePath(locale: Locale, path: string): string {
  const normalizedPath = normalizePath(path);
  const prefix = LOCALE_CONFIG[locale].urlPrefix;

  if (!prefix) {
    return normalizedPath;
  }

  if (normalizedPath === "/") {
    return prefix;
  }

  if (normalizedPath === prefix || normalizedPath.startsWith(`${prefix}/`)) {
    return normalizedPath;
  }

  return normalizePath(`${prefix}${normalizedPath}`);
}

export function buildCanonicalUrl(path: string, site: URL | string): string {
  const url = new URL(path, site);
  url.pathname = normalizePath(url.pathname);
  url.search = "";
  url.hash = "";

  return url.toString();
}

export function buildAlternateLinks(
  pathsByLocale: Partial<Record<Locale, string>>,
  site: URL | string,
): AlternateLink[] {
  const links = LOCALES.flatMap((locale) => {
    const path = pathsByLocale[locale];

    if (!path) {
      return [];
    }

    return [
      {
        locale,
        hreflang: LOCALE_CONFIG[locale].htmlLang,
        href: buildCanonicalUrl(path, site),
      },
    ];
  });

  const defaultPath = pathsByLocale[DEFAULT_LOCALE];

  if (defaultPath) {
    links.push({
      locale: "x-default",
      hreflang: "x-default",
      href: buildCanonicalUrl(defaultPath, site),
    });
  }

  return links;
}
