export const BLOG_PUBLICATION_TIME_ZONE = "America/Mexico_City";

export interface BlogPublicationData {
  draft?: boolean;
  pubDate: Date;
}

const editorialDateFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: BLOG_PUBLICATION_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const padDatePart = (value: number) => String(value).padStart(2, "0");

export const getBlogPublicationDateKey = (date: Date) =>
  [
    date.getUTCFullYear(),
    padDatePart(date.getUTCMonth() + 1),
    padDatePart(date.getUTCDate()),
  ].join("-");

export const getEditorialDateKey = (date: Date) => {
  const parts = editorialDateFormatter.formatToParts(date);
  const values = parts.reduce<Record<string, string>>((result, part) => {
    if (part.type !== "literal") {
      result[part.type] = part.value;
    }

    return result;
  }, {});

  return `${values.year}-${values.month}-${values.day}`;
};

export const isBlogPostPublishable = (
  data: BlogPublicationData,
  now = new Date(),
) =>
  !data.draft &&
  getBlogPublicationDateKey(data.pubDate) <= getEditorialDateKey(now);
