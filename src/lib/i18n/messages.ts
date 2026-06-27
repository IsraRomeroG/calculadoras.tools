import { DEFAULT_LOCALE, type Locale } from "./config";

export const messages = {
  es: {
    "site.brandName": "calculadoras.tools",
    "nav.home": "Inicio",
    "nav.blog": "Blog",
    "nav.contact": "Contacto",
    "nav.openMenu": "Abrir menu de navegacion",
    "nav.closeMenu": "Cerrar menu de navegacion",
    "footer.tagline":
      "Herramientas simples y rapidas para resolver calculos del dia a dia.",
    "footer.rights": "Todos los derechos reservados.",
    "footer.privacy": "Privacidad",
    "footer.contact": "Contacto",
    "footer.about": "Acerca de",
    "footer.methodology": "Metodologia",
    "footer.editorialPolicy": "Politica editorial",
    "footer.corrections": "Correcciones",
    "footer.adPreferences": "Preferencias de publicidad",
    "breadcrumbs.ariaLabel": "Ruta de navegacion",
    "breadcrumbs.home": "Inicio",
    "breadcrumbs.showIntermediate": "Mostrar niveles intermedios",
    "common.use": "Usar",
    "common.readArticle": "Leer guia",
    "common.search": "Buscar",
    "common.calculators": "calculadoras",
    "common.categories": "categorias",
    "common.result": "resultado",
    "common.results": "resultados",
    "home.title": "Calculadoras disponibles",
    "home.description":
      "Calculadoras online simples para resolver porcentajes y otros calculos cotidianos de forma rapida, clara y gratuita.",
    "home.heroTitle": "Encuentra la calculadora que necesitas",
    "home.heroAccent": "en segundos",
    "home.heroDescription":
      "Herramientas claras para porcentajes, finanzas, salud, fechas, conversiones y otros calculos cotidianos.",
    "home.searchLabel": "Buscar calculadora",
    "home.searchPlaceholder": "IVA, IMC, hipoteca...",
    "home.viewAll": "Ver todo",
    "home.availableCalculators": "Calculadoras disponibles",
    "home.selectTool": "Selecciona una herramienta para comenzar.",
    "home.resultsFor": "{count} {resultLabel} para \"{query}\".",
    "adConsent.title": "Ayudanos a mantener estas herramientas gratuitas",
    "adConsent.body":
      "La publicidad ayuda a financiar calculadoras.tools. Con tu permiso, cargaremos anuncios de terceros que pueden usar cookies o tecnologias similares para medir y seleccionar publicidad. Puedes aceptar o rechazar estos anuncios sin perder acceso al sitio.",
    "adConsent.privacyLink": "Consulta nuestra politica de privacidad",
    "adConsent.accept": "Aceptar anuncios",
    "adConsent.reject": "Rechazar anuncios",
  },
  en: {
    "site.brandName": "calculadoras.tools",
    "nav.home": "Home",
    "nav.blog": "Blog",
    "nav.contact": "Contact",
    "nav.openMenu": "Open navigation menu",
    "nav.closeMenu": "Close navigation menu",
    "footer.tagline":
      "Simple tools for everyday calculations, built to be clear and fast.",
    "footer.rights": "All rights reserved.",
    "footer.privacy": "Privacy",
    "footer.contact": "Contact",
    "footer.about": "About",
    "footer.methodology": "Methodology",
    "footer.editorialPolicy": "Editorial policy",
    "footer.corrections": "Corrections",
    "footer.adPreferences": "Ad preferences",
    "breadcrumbs.ariaLabel": "Breadcrumb",
    "breadcrumbs.home": "Home",
    "breadcrumbs.showIntermediate": "Show intermediate levels",
    "common.use": "Use",
    "common.readArticle": "Read guide",
    "common.search": "Search",
    "common.calculators": "calculators",
    "common.categories": "categories",
    "common.result": "result",
    "common.results": "results",
    "home.title": "Available calculators",
    "home.description":
      "Simple online calculators for percentages and everyday math, with fast and clear results.",
    "home.heroTitle": "Find the calculator you need",
    "home.heroAccent": "in seconds",
    "home.heroDescription":
      "Clear tools for percentages, finance, health, dates, conversions and everyday calculations.",
    "home.searchLabel": "Search calculator",
    "home.searchPlaceholder": "Percentages, BMI, mortgage...",
    "home.viewAll": "View all",
    "home.availableCalculators": "Available calculators",
    "home.selectTool": "Choose a tool to get started.",
    "home.resultsFor": "{count} {resultLabel} for \"{query}\".",
    "adConsent.title": "Help us keep these tools free",
    "adConsent.body":
      "Advertising helps fund calculadoras.tools. With your permission, we will load third-party ads that may use cookies or similar technologies to measure and select advertising. You can accept or reject these ads without losing access to the site.",
    "adConsent.privacyLink": "Read our privacy policy",
    "adConsent.accept": "Accept ads",
    "adConsent.reject": "Reject ads",
  },
} as const;

export type MessageKey = keyof typeof messages.es;

export function t(
  locale: Locale,
  key: MessageKey,
  params: Record<string, string | number> = {},
): string {
  const message = messages[locale]?.[key] ?? messages[DEFAULT_LOCALE][key];

  return Object.entries(params).reduce(
    (result, [name, value]) =>
      result.replaceAll(`{${name}}`, String(value)),
    message,
  );
}
