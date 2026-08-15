import { describe, expect, it } from "vitest";
import * as bmi from "./calculadora-de-imc/bmi.en";
import * as water from "./calculadora-de-agua-diaria/dailyWater.en";
import * as macros from "./calculadora-de-macros/macros.en";
import * as ovulation from "./calculadora-de-ovulacion/ovulation.en";
import * as bodyFat from "./calculadora-de-porcentaje-de-grasa-corporal/bodyFat.en";
import * as tdee from "./calculadora-de-calorias-diarias-tdee/tdee.en";
import * as exercise from "./calculadora-de-calorias-quemadas-por-ejercicio/exerciseCalories.en";
import * as maxHeartRate from "./calculadora-de-frecuencia-cardiaca-maxima/maxHeartRate.en";
import * as protein from "./calculadora-de-proteina-diaria/dailyProtein.en";
import * as zones from "./calculadora-de-zonas-de-frecuencia-cardiaca/heartRateZones.en";
import * as deficit from "./calculadora-deficit-calorico/deficit.en";
import * as oneRepMax from "./calculadora-1rm-repeticion-maxima/oneRepMax.en";
import * as pace from "./calculadora-de-pace-ritmo-de-carrera/runningPace.en";
import * as race from "./calculadora-prediccion-tiempo-carrera/racePrediction.en";
import * as vo2 from "./calculadora-vo2-max/vo2Max.en";
import * as dueDate from "./fecha-probable-de-parto/pregnancyDueDate.en";

describe("English health calculator localization modules", () => {
  it("loads every localized calculator module", () => {
    const modules = [bmi, water, macros, ovulation, bodyFat, tdee, exercise,
      maxHeartRate, protein, zones, deficit, oneRepMax, pace, race, vo2, dueDate];

    expect(modules.every((module) => Object.keys(module).length > 0)).toBe(true);
  });

  it("returns English labels from representative formatters", () => {
    expect(bmi.ADULT_BMI_CATEGORIES[3].label).toBe("Healthy range");
    expect(water.getSweatLevelLabel("moderate")).toBe("Moderate");
    expect(macros.getGoalOption("maintain").label).toBe("Maintain weight");
    expect(bodyFat.getBodyFatFormulaLabel("female")).toBe("Female formula");
  });
});
