import {
  EDITORIAL_ENTITY,
  getEditorialAuthor,
  toSchemaEntity,
  type EditorialEntity,
} from "./editorial";

export interface BlogArticleJsonLdInput {
  author?: EditorialEntity;
  canonical: string;
  description: string;
  headline: string;
  pubDate: Date;
  siteUrl: URL | string;
  updatedDate?: Date;
}

export const buildBlogArticleJsonLd = ({
  author,
  canonical,
  description,
  headline,
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
    entity: getEditorialAuthor(author),
    siteUrl,
    type: author ? "Person" : "Organization",
  }),
  publisher: toSchemaEntity({
    entity: EDITORIAL_ENTITY,
    siteUrl,
    type: "Organization",
  }),
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": canonical,
  },
});
