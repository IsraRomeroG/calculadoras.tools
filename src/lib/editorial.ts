export interface EditorialEntity {
  name: string;
  url?: string;
  description?: string;
}

export const EDITORIAL_ENTITY: Required<EditorialEntity> = {
  name: "Calculadoras.Tools",
  url: "/acerca-de",
  description:
    "Responsable editorial de calculadoras.tools: mantiene calculadoras, guias y politicas del sitio sin atribuir credenciales profesionales no verificadas.",
};

export const getEditorialAuthor = (
  author?: EditorialEntity,
): EditorialEntity => author ?? EDITORIAL_ENTITY;

export const toAbsoluteUrl = (url: string, siteUrl: URL | string): string =>
  new URL(url, siteUrl).toString();

export const toSchemaEntity = ({
  entity,
  siteUrl,
  type = "Organization",
}: {
  entity: EditorialEntity;
  siteUrl: URL | string;
  type?: "Organization" | "Person";
}) => {
  const schemaEntity: Record<string, string> = {
    "@type": type,
    name: entity.name,
  };

  if (entity.url) {
    schemaEntity.url = toAbsoluteUrl(entity.url, siteUrl);
  }

  return schemaEntity;
};
