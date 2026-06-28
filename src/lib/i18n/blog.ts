import type { Locale } from "./config";

export interface BlogUiContent {
  index: {
    title: string;
    description: string;
    heroTitle: string;
    heroDescription: string;
    latestTitle: string;
    latestDescription: string;
    featuredCta: string;
    publishedLabel: string;
    categoryLabel: string;
  };
  category: {
    title: (category: string) => string;
    description: (category: string) => string;
    heroTitle: (category: string) => string;
    heroDescription: (category: string) => string;
  };
  page: {
    title: (page: number) => string;
    description: string;
    heroTitle: (page: number) => string;
    heroDescription: string;
    listTitle: string;
    listDescription: (currentPage: number, totalPages: number) => string;
  };
  categoryPage: {
    title: (category: string, page: number) => string;
    description: (category: string) => string;
    heroTitle: (category: string, page: number) => string;
    heroDescription: (category: string) => string;
  };
  article: {
    by: string;
    published: string;
    updated: string;
    reviewedBy: string;
    editorialReview: string;
    tagsTitle: string;
    relatedCalculatorTitle: string;
    methodologyTitle: string;
    sourcesTitle: string;
    accessedPrefix: string;
  };
  card: {
    readArticle: string;
  };
  pagination: {
    ariaLabel: string;
    previous: string;
    next: string;
    page: (page: number) => string;
    currentPage: (page: number) => string;
  };
}

export const blogUi = {
  es: {
    index: {
      title: "Blog",
      description:
        "Guias simples, formulas practicas y ejemplos para usar mejor las calculadoras de calculadoras.tools.",
      heroTitle: "Guias simples para entender tus calculos diarios",
      heroDescription:
        "Explicaciones claras, formulas practicas y ejemplos para usar mejor las calculadoras de calculadoras.tools.",
      latestTitle: "Ultimos articulos",
      latestDescription:
        "Contenido pensado para acompanar cada herramienta del sitio.",
      featuredCta: "Leer guia destacada",
      publishedLabel: "Publicado",
      categoryLabel: "Categoria",
    },
    category: {
      title: (category) => `Blog de ${category}`,
      description: (category) =>
        `Articulos de ${category.toLowerCase()} con explicaciones claras, formulas practicas y ejemplos.`,
      heroTitle: (category) => `Articulos de ${category.toLowerCase()}`,
      heroDescription: (category) =>
        `Guias y ejemplos para resolver calculos de ${category.toLowerCase()} con mas contexto.`,
    },
    page: {
      title: (page) => `Blog - pagina ${page}`,
      description:
        "Mas guias simples, formulas practicas y ejemplos para usar mejor las calculadoras de calculadoras.tools.",
      heroTitle: (page) => `Blog - pagina ${page}`,
      heroDescription:
        "Mas guias y ejemplos para consultar herramientas, formulas y conceptos utiles.",
      listTitle: "Articulos",
      listDescription: (currentPage, totalPages) =>
        `Pagina ${currentPage} de ${totalPages}.`,
    },
    categoryPage: {
      title: (category, page) => `Blog de ${category} - pagina ${page}`,
      description: (category) =>
        `Mas articulos de ${category.toLowerCase()} con explicaciones claras, formulas practicas y ejemplos.`,
      heroTitle: (category, page) =>
        `Articulos de ${category.toLowerCase()} - pagina ${page}`,
      heroDescription: (category) =>
        `Mas guias y ejemplos para resolver calculos de ${category.toLowerCase()} con contexto practico.`,
    },
    article: {
      by: "Por",
      published: "Publicado",
      updated: "Actualizado",
      reviewedBy: "Revisado por",
      editorialReview: "Revision editorial",
      tagsTitle: "Temas",
      relatedCalculatorTitle: "Calculadora",
      methodologyTitle: "Nota metodologica",
      sourcesTitle: "Fuentes",
      accessedPrefix: "Consultado el",
    },
    card: {
      readArticle: "Leer articulo",
    },
    pagination: {
      ariaLabel: "Paginacion",
      previous: "Anterior",
      next: "Siguiente",
      page: (page) => `Pagina ${page}`,
      currentPage: (page) => `Pagina ${page}, pagina actual`,
    },
  },
  en: {
    index: {
      title: "Blog",
      description:
        "Simple guides, practical formulas and examples for using calculadoras.tools calculators with more context.",
      heroTitle: "Guides for everyday calculations",
      heroDescription:
        "Clear explanations, practical formulas and examples that make each calculator easier to use.",
      latestTitle: "Latest articles",
      latestDescription:
        "Practical context for the calculators published in English.",
      featuredCta: "Read featured guide",
      publishedLabel: "Published",
      categoryLabel: "Category",
    },
    category: {
      title: (category) => `${category} blog`,
      description: (category) =>
        `${category} articles with clear explanations, practical formulas and examples.`,
      heroTitle: (category) => `${category} articles`,
      heroDescription: (category) =>
        `Guides and examples for solving ${category.toLowerCase()} calculations with more context.`,
    },
    page: {
      title: (page) => `Blog - page ${page}`,
      description:
        "More simple guides, practical formulas and examples for using calculadoras.tools calculators.",
      heroTitle: (page) => `Blog - page ${page}`,
      heroDescription:
        "More guides and examples for calculators, formulas and useful everyday concepts.",
      listTitle: "Articles",
      listDescription: (currentPage, totalPages) =>
        `Page ${currentPage} of ${totalPages}.`,
    },
    categoryPage: {
      title: (category, page) => `${category} blog - page ${page}`,
      description: (category) =>
        `More ${category.toLowerCase()} articles with clear explanations, practical formulas and examples.`,
      heroTitle: (category, page) => `${category} articles - page ${page}`,
      heroDescription: (category) =>
        `More guides and examples for solving ${category.toLowerCase()} calculations with practical context.`,
    },
    article: {
      by: "By",
      published: "Published",
      updated: "Updated",
      reviewedBy: "Reviewed by",
      editorialReview: "Editorial review",
      tagsTitle: "Topics",
      relatedCalculatorTitle: "Calculator",
      methodologyTitle: "Methodology note",
      sourcesTitle: "Sources",
      accessedPrefix: "Accessed",
    },
    card: {
      readArticle: "Read article",
    },
    pagination: {
      ariaLabel: "Pagination",
      previous: "Previous",
      next: "Next",
      page: (page) => `Page ${page}`,
      currentPage: (page) => `Page ${page}, current page`,
    },
  },
} satisfies Record<Locale, BlogUiContent>;

export const getBlogUi = (locale: Locale) => blogUi[locale];
