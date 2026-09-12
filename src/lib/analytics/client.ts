export type DateDifferenceMetricMode = "difference" | "add" | "event";
export type DateDifferenceMetricCountMode = "standard" | "inclusive";
export type DateDifferenceMetricDayType = "calendar" | "business";
export type DateDifferenceMetricUnit =
  | "days"
  | "businessDays"
  | "weeks"
  | "months"
  | "years";

export type DateDifferenceMetric =
  | {
      event: "date_difference_calculation_completed";
      mode: DateDifferenceMetricMode;
      countMode?: DateDifferenceMetricCountMode;
      dayType?: DateDifferenceMetricDayType;
      unit?: DateDifferenceMetricUnit;
    }
  | {
      event: "date_difference_validation_error";
      mode: DateDifferenceMetricMode;
      error: string;
    };

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

/**
 * Sends only approved calculator metadata to the site's optional metric hooks.
 * User-entered values never belong in this payload.
 */
export function trackDateDifferenceMetric(metric: DateDifferenceMetric): void {
  window.dataLayer?.push(metric);
  document.dispatchEvent(
    new CustomEvent<DateDifferenceMetric>("calculadoras:calculator-metric", {
      detail: metric,
    }),
  );
}
