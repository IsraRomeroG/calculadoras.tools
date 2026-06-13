import {
  AD_REGION_CACHE_TTL_MS,
  AD_REGION_LOOKUP_TIMEOUT_MS,
  AD_REGION_LOOKUP_URL,
  AD_REGION_STORAGE_KEY,
} from "./config";

export type AdConsentRequirement = "required" | "not-required";

interface GeoJsResponse {
  continent_code?: unknown;
}

interface RegionCache {
  requirement: AdConsentRequirement;
  expiresAt: number;
}

export function getConsentRequirementFromRegion(
  response: GeoJsResponse,
): AdConsentRequirement {
  if (typeof response.continent_code !== "string") {
    return "required";
  }

  return response.continent_code === "EU" ? "required" : "not-required";
}

function readCachedRequirement(): AdConsentRequirement | null {
  try {
    const cached = JSON.parse(
      localStorage.getItem(AD_REGION_STORAGE_KEY) ?? "null",
    ) as Partial<RegionCache> | null;

    if (
      cached?.expiresAt &&
      cached.expiresAt > Date.now() &&
      (cached.requirement === "required" ||
        cached.requirement === "not-required")
    ) {
      return cached.requirement;
    }
  } catch {
    // A lookup will be used when storage is unavailable or malformed.
  }

  return null;
}

function cacheRequirement(requirement: AdConsentRequirement): void {
  try {
    const cached: RegionCache = {
      requirement,
      expiresAt: Date.now() + AD_REGION_CACHE_TTL_MS,
    };

    localStorage.setItem(AD_REGION_STORAGE_KEY, JSON.stringify(cached));
  } catch {
    // The regional decision remains valid for the current page load.
  }
}

export async function resolveAdConsentRequirement(): Promise<AdConsentRequirement> {
  const cached = readCachedRequirement();

  if (cached) {
    return cached;
  }

  const controller = new AbortController();
  const timeout = window.setTimeout(
    () => controller.abort(),
    AD_REGION_LOOKUP_TIMEOUT_MS,
  );

  try {
    const response = await fetch(AD_REGION_LOOKUP_URL, {
      credentials: "omit",
      referrerPolicy: "no-referrer",
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Regional lookup failed with status ${response.status}`);
    }

    const data = (await response.json()) as GeoJsResponse;

    if (typeof data.continent_code !== "string") {
      throw new Error("Regional lookup returned an invalid response");
    }

    const requirement = getConsentRequirementFromRegion(data);
    cacheRequirement(requirement);
    return requirement;
  } catch {
    return "required";
  } finally {
    window.clearTimeout(timeout);
  }
}
