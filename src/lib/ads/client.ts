import {
  AD_CONSENT_MODE,
  AD_CONSENT_STORAGE_KEY,
  selectAdFormat,
  type AdFormat,
  type AdVariant,
} from "./config";
import {
  getConfiguredAdFormats,
  hasConfiguredAds,
  mountProviderAd,
} from "./provider";
import {
  resolveAdConsentRequirement,
  type AdConsentRequirement,
} from "./region";

type AdConsent = "accepted" | "rejected" | null;
type AdEventName = "ad_requested" | "ad_viewable";

interface AdEventDetail {
  event: AdEventName;
  format: AdFormat;
  placement: string;
  path: string;
}

let consentRequirement: AdConsentRequirement | null = null;
let consentRequirementPromise: Promise<AdConsentRequirement> | null = null;

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

function ensureConsentRequirement(): Promise<AdConsentRequirement> {
  if (AD_CONSENT_MODE === "off") {
    consentRequirement = "not-required";
    return Promise.resolve("not-required");
  }

  if (AD_CONSENT_MODE === "all") {
    consentRequirement = "required";
    return Promise.resolve("required");
  }

  consentRequirementPromise ??= resolveAdConsentRequirement().then(
    (requirement) => {
      consentRequirement = requirement;
      return requirement;
    },
  );

  return consentRequirementPromise;
}

function getConsent(): AdConsent {
  if (AD_CONSENT_MODE === "off") {
    return "accepted";
  }

  if (consentRequirement === "not-required") {
    return "accepted";
  }

  if (consentRequirement === null) {
    return null;
  }

  try {
    const value = localStorage.getItem(AD_CONSENT_STORAGE_KEY);
    return value === "accepted" || value === "rejected" ? value : null;
  } catch {
    return null;
  }
}

function setConsent(value: Exclude<AdConsent, null>): void {
  try {
    localStorage.setItem(AD_CONSENT_STORAGE_KEY, value);
  } catch {
    // Storage can be unavailable in private browsing or restricted contexts.
  }

  document.dispatchEvent(
    new CustomEvent("calculadoras:ad-consent", { detail: value }),
  );
}

function trackAdEvent(
  event: AdEventName,
  format: AdFormat,
  placement: string,
): void {
  const detail: AdEventDetail = {
    event,
    format,
    placement,
    path: window.location.pathname,
  };

  window.dataLayer?.push(detail);
  document.dispatchEvent(
    new CustomEvent<AdEventDetail>("calculadoras:ad-metric", { detail }),
  );
}

function observeViewability(
  slot: HTMLElement,
  format: AdFormat,
  placement: string,
): void {
  let viewabilityTimer: number | undefined;

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry?.intersectionRatio >= 0.5) {
        viewabilityTimer ??= window.setTimeout(() => {
          trackAdEvent("ad_viewable", format, placement);
          observer.disconnect();
        }, 1000);
        return;
      }

      if (viewabilityTimer) {
        window.clearTimeout(viewabilityTimer);
        viewabilityTimer = undefined;
      }
    },
    { threshold: [0, 0.5] },
  );

  observer.observe(slot);
}

function prepareSlot(slot: HTMLElement): (() => void) | null {
  const variant = slot.dataset.adVariant as AdVariant | undefined;
  const placement = slot.dataset.adPlacement;
  const content = slot.querySelector<HTMLElement>("[data-ad-content]");

  if (!variant || !placement || !content) {
    return null;
  }

  const configuredFormats = getConfiguredAdFormats();
  const format = selectAdFormat(
    variant,
    slot.getBoundingClientRect().width,
    configuredFormats,
  );

  if (!format) {
    slot.dataset.adState =
      slot.dataset.adDebug === "true" ? "debug" : "unavailable";
    return null;
  }

  slot.dataset.adFormat = format;
  slot.dataset.adState = getConsent() === "rejected" ? "blocked" : "ready";

  return () => {
    if (slot.dataset.adState === "loaded") {
      return;
    }

    if (getConsent() !== "accepted") {
      slot.dataset.adState = getConsent() === "rejected" ? "blocked" : "ready";
      return;
    }

    const mounted = mountProviderAd(
      content,
      format,
      placement,
      slot.id,
    );

    if (!mounted) {
      slot.dataset.adState = "unavailable";
      return;
    }

    slot.dataset.adState = "loaded";
    trackAdEvent("ad_requested", format, placement);
    observeViewability(slot, format, placement);
  };
}

export function initAdSlots(): void {
  const slots = Array.from(
    document.querySelectorAll<HTMLElement>("[data-ad-slot]"),
  );

  slots.forEach((slot) => {
    if (slot.dataset.adInitialized === "true") {
      return;
    }

    slot.dataset.adInitialized = "true";
    const load = prepareSlot(slot);

    if (!load) {
      return;
    }

    let isNearViewport = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) {
          return;
        }

        isNearViewport = true;
        load();
        observer.disconnect();
      },
      { rootMargin: "300px 0px" },
    );

    observer.observe(slot);
    void ensureConsentRequirement().then(() => {
      if (isNearViewport) {
        load();
      }
    });

    document.addEventListener("calculadoras:ad-consent", (event) => {
      const consent = (event as CustomEvent<AdConsent>).detail;

      if (consent === "rejected") {
        slot.dataset.adState = "blocked";
        return;
      }

      if (isNearViewport) {
        load();
      }
    });
  });
}

export function initAdConsent(): void {
  const banner = document.querySelector<HTMLElement>("[data-ad-consent]");
  const preferencesButtons = Array.from(
    document.querySelectorAll<HTMLElement>("[data-ad-consent-open]"),
  );

  if (!banner || !hasConfiguredAds() || AD_CONSENT_MODE === "off") {
    return;
  }

  const showBanner = () => banner.classList.remove("hidden");
  const hideBanner = () => banner.classList.add("hidden");

  preferencesButtons.forEach((button) => {
    button.addEventListener("click", showBanner);
  });

  banner
    .querySelector<HTMLElement>("[data-ad-consent-accept]")
    ?.addEventListener("click", () => {
      setConsent("accepted");
      hideBanner();
    });

  banner
    .querySelector<HTMLElement>("[data-ad-consent-reject]")
    ?.addEventListener("click", () => {
      setConsent("rejected");
      hideBanner();
    });

  void ensureConsentRequirement().then((requirement) => {
    if (requirement !== "required") {
      hideBanner();
      return;
    }

    preferencesButtons.forEach((button) => button.classList.remove("hidden"));

    if (getConsent() === null) {
      showBanner();
    }
  });
}
