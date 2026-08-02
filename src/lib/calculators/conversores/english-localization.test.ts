import { describe, expect, it } from "vitest";
import {
  AREA_UNIT_METADATA,
  buildAreaExplanation,
  formatArea,
} from "./conversor-de-area-m2-ft2-hectareas-acres/area.en";
import {
  WEIGHT_UNIT_METADATA,
  buildWeightExplanation,
} from "./conversor-de-peso/weight.en";
import {
  buildTemperatureExplanation,
} from "./conversor-de-temperatura/temperature.en";
import {
  VOLUME_UNIT_GROUPS,
  VOLUME_UNIT_METADATA,
} from "./conversor-de-volumen/volume.en";
import {
  DESTINATION_METADATA,
  MEASUREMENT_METADATA,
  PROFILE_METADATA,
} from "./conversor-tallas-de-ropa/sizeCharts.en";
import {
  DISTANCE_UNIT_METADATA,
  buildDistanceExplanation,
} from "./kilometros-a-millas/distance.en";
import {
  VOLUME_UNIT_METADATA as GALLON_UNIT_METADATA,
  buildVolumeExplanation,
} from "./litros-a-galones/litersGallons.en";

describe("English converter localization", () => {
  it("provides English unit metadata", () => {
    expect(AREA_UNIT_METADATA.ft2.label).toBe("Square feet");
    expect(WEIGHT_UNIT_METADATA.lb.label).toBe("Pounds");
    expect(DISTANCE_UNIT_METADATA.mi.label).toBe("Statute miles");
    expect(GALLON_UNIT_METADATA.us_gal.label).toBe("US gallons");
    expect(VOLUME_UNIT_METADATA.imp_qt.label).toBe("Imperial quarts");
    expect(VOLUME_UNIT_GROUPS.map((group) => group.label)).toEqual([
      "Metric",
      "US liquid",
      "Imperial",
    ]);
  });

  it("uses English formatting and explanation steps", () => {
    expect(formatArea(1234.5, "m2")).toBe("1,234.5 m²");
    expect(buildAreaExplanation(1, "m2", "ft2").steps[0]).toMatch(/^Use/);
    expect(buildWeightExplanation(1, "kg", "lb").steps[0]).toMatch(/^Use/);
    expect(buildTemperatureExplanation(0, "c", "f").steps[0]).toMatch(/^Use/);
    expect(buildDistanceExplanation(1, "km", "mi").steps[0]).toMatch(/^Use/);
    expect(buildVolumeExplanation(1, "l", "us_gal").steps[0]).toMatch(/^Use/);
  });

  it("localizes clothing controls and measurement labels", () => {
    expect(PROFILE_METADATA.mujer.label).toBe("Women");
    expect(DESTINATION_METADATA.all.label).toBe("View all regions");
    expect(MEASUREMENT_METADATA.inseam.label).toBe("Inseam");
  });
});
