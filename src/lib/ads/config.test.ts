import { describe, expect, it } from "vitest";
import { AD_FORMATS, selectAdFormat, type AdFormat } from "./config";

const horizontalFormats: AdFormat[] = ["320x50", "468x60", "728x90"];

describe("ad format selection", () => {
  it.each([
    [319, null],
    [320, "320x50"],
    [467, "320x50"],
    [468, "468x60"],
    [727, "468x60"],
    [728, "728x90"],
  ] as const)("selects the largest horizontal format at %ipx", (width, expected) => {
    expect(selectAdFormat("horizontal", width, horizontalFormats)).toBe(expected);
  });

  it("does not select a format that is not configured", () => {
    expect(selectAdFormat("horizontal", 728, ["320x50"])).toBe("320x50");
    expect(selectAdFormat("horizontal", 319, horizontalFormats)).toBeNull();
  });

  it("selects rectangle and vertical formats only when they fit", () => {
    expect(selectAdFormat("rectangle", 299, ["300x250"])).toBeNull();
    expect(selectAdFormat("rectangle", 300, ["300x250"])).toBe("300x250");
    expect(selectAdFormat("vertical", 160, ["160x300"])).toBe("160x300");
    expect(selectAdFormat("vertical", 160, ["160x300", "160x600"])).toBe(
      "160x600",
    );
  });

  it("keeps the declared creative dimensions", () => {
    expect(AD_FORMATS["320x50"]).toMatchObject({ width: 320, height: 50 });
    expect(AD_FORMATS["468x60"]).toMatchObject({ width: 468, height: 60 });
    expect(AD_FORMATS["728x90"]).toMatchObject({ width: 728, height: 90 });
    expect(AD_FORMATS["300x250"]).toMatchObject({ width: 300, height: 250 });
  });
});
