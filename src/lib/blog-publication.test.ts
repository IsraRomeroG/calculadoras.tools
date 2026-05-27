import { describe, expect, it } from "vitest";
import { isBlogPostPublishable } from "./blog-publication";

const blogPostData = (pubDate: string, draft?: boolean) => ({
  draft,
  pubDate: new Date(pubDate),
});

describe("blog publication filtering", () => {
  it("excludes drafts even when the publication date has passed", () => {
    expect(
      isBlogPostPublishable(
        blogPostData("2026-05-01", true),
        new Date("2026-05-27T18:00:00.000Z"),
      ),
    ).toBe(false);
  });

  it("includes posts with past or current editorial publication dates", () => {
    const now = new Date("2026-05-27T18:00:00.000Z");

    expect(isBlogPostPublishable(blogPostData("2026-05-26"), now)).toBe(true);
    expect(isBlogPostPublishable(blogPostData("2026-05-27"), now)).toBe(true);
  });

  it("excludes posts with future editorial publication dates", () => {
    expect(
      isBlogPostPublishable(
        blogPostData("2026-05-28"),
        new Date("2026-05-27T18:00:00.000Z"),
      ),
    ).toBe(false);
  });

  it("does not publish early just because UTC has reached the pubDate", () => {
    expect(
      isBlogPostPublishable(
        blogPostData("2026-05-27"),
        new Date("2026-05-27T00:01:00.000Z"),
      ),
    ).toBe(false);
  });
});
