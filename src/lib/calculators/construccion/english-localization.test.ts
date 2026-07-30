import { describe, expect, it } from "vitest";
import {
  BRICK_CANONICAL_PATH,
  BRICK_PRESET_CONFIG,
  formatBrickCurrency,
} from "./calculadora-cantidad-ladrillos/bricks.en";
import {
  TILE_CANONICAL_PATH,
  TILE_PATTERN_CONFIG,
  formatTileCurrency,
} from "./calculadora-piso-azulejo-superficie/tiles.en";
import {
  REMODEL_BUDGET_CANONICAL_PATH,
  REMODEL_COST_TYPE_LABELS,
  REMODEL_TEMPLATES,
  formatRemodelCurrency,
} from "./calculadora-presupuesto-remodelacion/remodelBudget.en";
import {
  CONCRETE_PRESET_CONFIG,
  CONCRETE_VOLUME_CANONICAL_PATH,
  formatConcreteCurrency,
} from "./calculadora-volumen-concreto-cemento/concreteVolume.en";
import {
  PAINT_AREA_CANONICAL_PATH,
  buildPaintShareUrl,
  formatPaintNumber,
} from "./metros-cuadrados-de-pintura/paintArea.en";

describe("English construction calculator localization", () => {
  it("uses the five English canonical routes", () => {
    expect([
      BRICK_CANONICAL_PATH,
      TILE_CANONICAL_PATH,
      REMODEL_BUDGET_CANONICAL_PATH,
      CONCRETE_VOLUME_CANONICAL_PATH,
      PAINT_AREA_CANONICAL_PATH,
    ]).toEqual([
      "/en/construction/brick-calculator",
      "/en/construction/tile-calculator",
      "/en/construction/renovation-budget-calculator",
      "/en/construction/concrete-volume-calculator",
      "/en/construction/paint-calculator",
    ]);
  });

  it("provides English presets and templates", () => {
    expect(BRICK_PRESET_CONFIG.custom.label).toBe("Custom");
    expect(TILE_PATTERN_CONFIG.herringbone.label).toBe("Herringbone");
    expect(REMODEL_COST_TYPE_LABELS.mano_obra).toBe("Labor");
    expect(REMODEL_TEMPLATES.kitchen.label).toBe("Kitchen");
    expect(CONCRETE_PRESET_CONFIG.slab.dimensionLabels).toEqual([
      "Length",
      "Width",
      "Thickness",
    ]);
  });

  it("uses English number and currency formatting", () => {
    expect(formatBrickCurrency(1234.5)).toContain("$1,234.50");
    expect(formatTileCurrency(1234.5)).toContain("$1,234.50");
    expect(formatRemodelCurrency(1234.5)).toContain("$1,234.50");
    expect(formatConcreteCurrency(1234.5)).toContain("$1,234.50");
    expect(formatPaintNumber(1234.5)).toBe("1,234.50");
  });

  it("keeps shared paint links on the English route", () => {
    expect(buildPaintShareUrl({ mode: "habitacion", length: 5 })).toMatch(
      /^\/en\/construction\/paint-calculator\?/,
    );
  });
});
