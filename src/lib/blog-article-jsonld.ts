import {
  getEditorialEntity,
  getEditorialAuthor,
  toSchemaEntity,
  type EditorialEntity,
} from "./editorial";
import { DEFAULT_LOCALE, type Locale } from "./i18n/config";

export interface BlogArticleJsonLdInput {
  author?: EditorialEntity;
  canonical: string;
  description: string;
  headline: string;
  locale?: Locale;
  pubDate: Date;
  siteUrl: URL | string;
  updatedDate?: Date;
}

export const buildBlogArticleJsonLd = ({
  author,
  canonical,
  description,
  headline,
  locale = DEFAULT_LOCALE,
  pubDate,
  siteUrl,
  updatedDate,
}: BlogArticleJsonLdInput) => ({
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline,
  description,
  datePublished: pubDate.toISOString(),
  dateModified: (updatedDate ?? pubDate).toISOString(),
  author: toSchemaEntity({
    entity: getEditorialAuthor(author, locale),
    siteUrl,
    type: author ? "Person" : "Organization",
  }),
  publisher: toSchemaEntity({
    entity: getEditorialEntity(locale),
    siteUrl,
    type: "Organization",
  }),
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": canonical,
  },
});
