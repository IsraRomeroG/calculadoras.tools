import { describe, expect, it } from "vitest";
import { WEIGHTED_GRADE_EXAMPLES } from "./calculadora-calificacion-ponderada/weightedGrade.en";
import { STATISTICS_EXAMPLES } from "./calculadora-de-estadistica-basica/basicStatistics.en";
import { calculateRuleOfThree } from "./calculadora-de-regla-de-tres/ruleOfThree.en";
import { calculateQuadraticEquation } from "./calculadora-ecuaciones-cuadraticas/quadratic.en";
import { STUDY_WEEKDAYS } from "./calculadora-horas-de-estudio/studyHours.en";
import { GCD_LCM_EXAMPLES } from "./calculadora-mcd-mcm/gcdLcm.en";
import { getStatusLabel } from "./calculadora-nota-minima-para-aprobar/minimumGrade.en";
import { ATTENDANCE_EXAMPLES } from "./calculadora-porcentaje-asistencia-escolar/attendance.en";
import { GPA_EXAMPLES } from "./calculadora-promedio-escolar-gpa/gpa.en";
import { LINEAR_SYSTEM_2X2_EXAMPLES } from "./calculadora-sistema-ecuaciones-2x2/linearSystem2x2.en";

describe("English math calculator localization", () => {
  it("exposes English examples and weekday labels", () => {
    expect(WEIGHTED_GRADE_EXAMPLES[0].label).toBe("Complete course");
    expect(STATISTICS_EXAMPLES[0].label).toBe("Grades");
    expect(GCD_LCM_EXAMPLES[0].description).toContain("Common case");
    expect(ATTENDANCE_EXAMPLES[1].label).toBe("Recover");
    expect(GPA_EXAMPLES[0].label).toBe("Without credits");
    expect(LINEAR_SYSTEM_2X2_EXAMPLES[0].label).toBe("Unique solution");
    expect(STUDY_WEEKDAYS.map((weekday) => weekday.label)).toEqual([
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ]);
  });

  it("returns English calculation labels and steps", () => {
    const proportion = calculateRuleOfThree({
      type: "direct",
      a: 2,
      b: 4,
      c: 3,
    });
    const quadratic = calculateQuadraticEquation({ a: 1, b: -5, c: 6 });

    expect(proportion.steps[0]).toContain("Identify the values");
    expect(quadratic.solutionLabel).toBe("Two distinct real roots");
    expect(getStatusLabel("secured")).toBe("already secured");
  });
});
