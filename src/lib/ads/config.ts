export const AD_FORMATS = {
  "320x50": { width: 320, height: 50, variant: "horizontal" },
  "468x60": { width: 468, height: 60, variant: "horizontal" },
  "728x90": { width: 728, height: 90, variant: "horizontal" },
  "300x250": { width: 300, height: 250, variant: "rectangle" },
  "160x300": { width: 160, height: 300, variant: "vertical" },
  "160x600": { width: 160, height: 600, variant: "vertical" },
} as const;

export type AdFormat = keyof typeof AD_FORMATS;
export type AdVariant = (typeof AD_FORMATS)[AdFormat]["variant"];

export const AD_CONSENT_STORAGE_KEY = "calculadoras-ad-consent-v1";
export const ADS_REQUIRE_CONSENT = true;

const HORIZONTAL_FORMATS: AdFormat[] = ["728x90", "468x60", "320x50"];
const VERTICAL_FORMATS: AdFormat[] = ["160x600", "160x300"];

export function selectAdFormat(
  variant: AdVariant,
  availableWidth: number,
  configuredFormats: readonly AdFormat[],
): AdFormat | null {
  if (variant === "horizontal") {
    return (
      HORIZONTAL_FORMATS.find(
        (format) =>
          configuredFormats.includes(format) &&
          AD_FORMATS[format].width <= availableWidth,
      ) ?? null
    );
  }

  const formats: readonly AdFormat[] =
    variant === "rectangle" ? ["300x250"] : VERTICAL_FORMATS;

  return (
    formats.find(
      (format) =>
        configuredFormats.includes(format) &&
        AD_FORMATS[format].width <= availableWidth,
    ) ?? null
  );
}
