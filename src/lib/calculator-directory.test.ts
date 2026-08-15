import { describe, expect, it } from "vitest";
import {
  CATEGORIES,
  CATEGORY_DEFINITIONS,
  CATEGORY_SLUGS,
  getCategoryByLabel,
  getCategoryBySlugOrLegacySlug,
} from "./constants/categories";
import { CALCULATOR_DEFINITIONS, CALCULATORS } from "./constants/calculators";
import { LEGAL_TAX_MARKET_DIRECTORY_ITEMS } from "./calculators/legal-tax/catalog";
import {
  getCalculatorCategories,
  getCalculatorCategoryUrl,
  getCalculatorUrl,
  getPublishedCalculators,
} from "./calculator-directory";

describe("calculator category directory", () => {
  it("uses explicit canonical slugs for category URLs", () => {
    expect(getCalculatorCategoryUrl("legal-impuestos")).toBe(
      "/legal-impuestos",
    );
    expect(getCalculatorCategoryUrl("fecha-tiempo")).toBe("/fecha-tiempo");
    expect(getCalculatorCategoryUrl("probabilidad-estadistica")).toBe(
      "/probabilidad-estadistica",
    );
    expect(getCalculatorCategoryUrl("eventos")).toBe("/eventos");
    expect(getCalculatorCategoryUrl("matematicas", "en")).toBe("/en/math");
    expect(getCalculatorCategoryUrl("finanzas", "en")).toBe("/en/finance");
    expect(getCalculatorCategoryUrl("inmuebles", "en")).toBe(
      "/en/real-estate",
    );
    expect(getCalculatorCategoryUrl("salud", "en")).toBe("/en/health");
  });

  it("keeps the English pilot category URL without a trailing slash", () => {
    expect(getCalculatorCategoryUrl("matematicas", "en")).toBe("/en/math");
  });

  it("defines English metadata for every calculator category", () => {
    const englishCategories = Object.values(CATEGORY_DEFINITIONS).map(
      (definition) => definition.locales.en,
    );

    expect(englishCategories).toHaveLength(CATEGORY_SLUGS.length);
    expect(englishCategories.every(Boolean)).toBe(true);
  });

  it("keeps the Spanish percentage calculator route and creates the English pilot route", () => {
    const percentageCalculator = CALCULATOR_DEFINITIONS.find(
      (calculator) => calculator.id === "calculadora-de-porcentajes",
    );

    expect(percentageCalculator).toBeDefined();
    expect(getCalculatorUrl(percentageCalculator!, "es")).toBe(
      "/matematicas/calculadora-de-porcentajes",
    );
    expect(getCalculatorUrl(percentageCalculator!, "en")).toBe(
      "/en/math/percentage-calculator",
    );
  });

  it("publishes only reviewed English calculator metadata", () => {
    const englishCalculators = getPublishedCalculators("en");

    expect(englishCalculators).toEqual(expect.arrayContaining([
      expect.objectContaining({
        id: "calculadora-de-porcentajes",
        title: "Percentage calculator",
        href: "/en/math/percentage-calculator",
        categoryId: "matematicas",
      }),
      expect.objectContaining({
        id: "calculadora-de-regla-de-tres",
        title: "Rule of three calculator",
        href: "/en/math/rule-of-three-calculator",
        categoryId: "matematicas",
      }),
      expect.objectContaining({
        id: "calculadora-mcd-mcm",
        title: "GCD and LCM calculator",
        href: "/en/math/gcd-lcm-calculator",
        categoryId: "matematicas",
      }),
      expect.objectContaining({
        id: "calculadora-ecuaciones-cuadraticas",
        title: "Quadratic equation calculator",
        href: "/en/math/quadratic-equation-calculator",
        categoryId: "matematicas",
      }),
      expect.objectContaining({
        id: "calculadora-sistema-ecuaciones-2x2",
        title: "2x2 system of equations calculator",
        href: "/en/math/linear-system-2x2-calculator",
        categoryId: "matematicas",
      }),
      expect.objectContaining({
        id: "calculadora-de-iva",
        title: "VAT, GST and sales tax calculator",
        href: "/en/legal-tax/indirect-tax-calculator",
        categoryId: "legal-impuestos",
      }),
      expect.objectContaining({
        id: "calculadora-isr-irpf",
        title: "Mexico income tax calculator",
        href: "/en/legal-tax/mexico-income-tax-calculator",
        categoryId: "legal-impuestos",
      }),
      expect.objectContaining({
        id: "calculadora-salario-neto",
        title: "Mexico net salary calculator",
        href: "/en/legal-tax/mexico-net-salary-calculator",
        categoryId: "legal-impuestos",
      }),
      expect.objectContaining({
        id: "calculadora-vacaciones-proporcionales",
        title: "Mexico proportional vacation calculator",
        href: "/en/legal-tax/mexico-proportional-vacation-calculator",
        categoryId: "legal-impuestos",
      }),
      expect.objectContaining({
        id: "calculadora-de-interes-compuesto",
        title: "Compound interest calculator",
        href: "/en/finance/compound-interest-calculator",
        categoryId: "finanzas",
      }),
      expect.objectContaining({
        id: "calculadora-de-inflacion-poder-adquisitivo",
        title: "Inflation and purchasing power calculator",
        href: "/en/finance/inflation-purchasing-power-calculator",
        categoryId: "finanzas",
      }),
      expect.objectContaining({
        id: "calculadora-de-interes-simple",
        title: "Simple interest calculator",
        href: "/en/finance/simple-interest-calculator",
        categoryId: "finanzas",
      }),
      expect.objectContaining({
        id: "calculadora-de-prestamo",
        title: "Loan calculator",
        href: "/en/finance/loan-calculator",
        categoryId: "finanzas",
      }),
      expect.objectContaining({
        id: "plan-de-pago-de-deudas",
        title: "Debt payoff calculator",
        href: "/en/finance/debt-payoff-calculator",
        categoryId: "finanzas",
      }),
      expect.objectContaining({
        id: "calculadora-de-ahorro-para-un-objetivo",
        title: "Savings goal calculator",
        href: "/en/finance/savings-goal-calculator",
        categoryId: "finanzas",
      }),
      expect.objectContaining({
        id: "calculadora-de-roi",
        title: "ROI calculator",
        href: "/en/finance/roi-calculator",
        categoryId: "finanzas",
      }),
      expect.objectContaining({
        id: "calculadora-de-margen-y-markup",
        title: "Margin and markup calculator",
        href: "/en/finance/margin-markup-calculator",
        categoryId: "finanzas",
      }),
      expect.objectContaining({
        id: "calculadora-de-punto-de-equilibrio",
        title: "Break-even calculator",
        href: "/en/finance/break-even-calculator",
        categoryId: "finanzas",
      }),
      expect.objectContaining({
        id: "calculadora-de-tarifa-por-hora-freelance",
        title: "Freelance hourly rate calculator",
        href: "/en/finance/freelance-hourly-rate-calculator",
        categoryId: "finanzas",
      }),
      expect.objectContaining({
        id: "calculadora-de-precio-de-proyecto-freelance",
        title: "Freelance project pricing calculator",
        href: "/en/finance/freelance-project-pricing-calculator",
        categoryId: "finanzas",
      }),
      expect.objectContaining({
        id: "calculadora-dca-costo-promedio",
        title: "DCA average cost calculator",
        href: "/en/finance/dca-average-cost-calculator",
        categoryId: "finanzas",
      }),
      expect.objectContaining({
        id: "calculadora-de-hipoteca",
        title: "Mortgage calculator",
        href: "/en/real-estate/mortgage-calculator",
        categoryId: "inmuebles",
      }),
      expect.objectContaining({
        id: "calculadora-capacidad-compra-vivienda",
        title: "Home affordability calculator",
        href: "/en/real-estate/home-affordability-calculator",
        categoryId: "inmuebles",
      }),
      expect.objectContaining({
        id: "calculadora-renta-vs-compra",
        title: "Rent vs. buy calculator",
        href: "/en/real-estate/rent-vs-buy-calculator",
        categoryId: "inmuebles",
      }),
      expect.objectContaining({
        id: "calculadora-cap-rate-rentabilidad",
        title: "Cap rate calculator",
        href: "/en/real-estate/cap-rate-calculator",
        categoryId: "inmuebles",
      }),
      expect.objectContaining({
        id: "calculadora-gastos-escrituracion",
        title: "Closing costs calculator",
        href: "/en/real-estate/closing-costs-calculator",
        categoryId: "inmuebles",
      }),
      expect.objectContaining({
        id: "calculadora-plusvalia-estimada",
        title: "Property appreciation calculator",
        href: "/en/real-estate/property-appreciation-calculator",
        categoryId: "inmuebles",
      }),
      expect.objectContaining({
        id: "calculadora-precio-por-metro-cuadrado",
        title: "Price per area calculator",
        href: "/en/real-estate/price-per-area-calculator",
        categoryId: "inmuebles",
      }),
      expect.objectContaining({ id: "calculadora-de-imc", title: "BMI calculator", href: "/en/health/bmi-calculator", categoryId: "salud" }),
      expect.objectContaining({ id: "calculadora-de-porcentaje-de-grasa-corporal", title: "Body fat percentage calculator", href: "/en/health/body-fat-percentage-calculator", categoryId: "salud" }),
      expect.objectContaining({ id: "calculadora-de-calorias-diarias-tdee", title: "TDEE calculator", href: "/en/health/tdee-calculator", categoryId: "salud" }),
      expect.objectContaining({ id: "calculadora-de-calorias-quemadas-por-ejercicio", title: "Exercise calories burned calculator", href: "/en/health/exercise-calories-burned-calculator", categoryId: "salud" }),
      expect.objectContaining({ id: "calculadora-de-macros", title: "Macro calculator", href: "/en/health/macro-calculator", categoryId: "salud" }),
      expect.objectContaining({ id: "calculadora-de-proteina-diaria", title: "Daily protein calculator", href: "/en/health/daily-protein-calculator", categoryId: "salud" }),
      expect.objectContaining({ id: "calculadora-deficit-calorico", title: "Calorie deficit calculator", href: "/en/health/calorie-deficit-calculator", categoryId: "salud" }),
      expect.objectContaining({ id: "fecha-probable-de-parto", title: "Pregnancy due date calculator", href: "/en/health/pregnancy-due-date-calculator", categoryId: "salud" }),
      expect.objectContaining({ id: "calculadora-de-ovulacion", title: "Ovulation calculator", href: "/en/health/ovulation-calculator", categoryId: "salud" }),
      expect.objectContaining({ id: "calculadora-de-frecuencia-cardiaca-maxima", title: "Maximum heart rate calculator", href: "/en/health/maximum-heart-rate-calculator", categoryId: "salud" }),
      expect.objectContaining({ id: "calculadora-de-zonas-de-frecuencia-cardiaca", title: "Heart rate zones calculator", href: "/en/health/heart-rate-zones-calculator", categoryId: "salud" }),
      expect.objectContaining({ id: "calculadora-de-agua-diaria", title: "Daily water intake calculator", href: "/en/health/daily-water-intake-calculator", categoryId: "salud" }),
      expect.objectContaining({ id: "calculadora-1rm-repeticion-maxima", title: "One-rep max calculator", href: "/en/health/one-rep-max-calculator", categoryId: "salud" }),
      expect.objectContaining({ id: "calculadora-vo2-max", title: "VO2 max calculator", href: "/en/health/vo2-max-calculator", categoryId: "salud" }),
      expect.objectContaining({ id: "calculadora-de-pace-ritmo-de-carrera", title: "Running pace calculator", href: "/en/health/running-pace-calculator", categoryId: "salud" }),
      expect.objectContaining({ id: "calculadora-prediccion-tiempo-carrera", title: "Race time predictor", href: "/en/health/race-time-predictor", categoryId: "salud" }),
      expect.objectContaining({
        id: "calculadora-de-edad",
        title: "Age calculator",
        href: "/en/date-time/age-calculator",
        categoryId: "fecha-tiempo",
      }),
      expect.objectContaining({
        id: "diferencia-entre-fechas",
        title: "Date difference calculator",
        href: "/en/date-time/date-difference-calculator",
        categoryId: "fecha-tiempo",
      }),
      expect.objectContaining({
        id: "calculadora-fecha-limite-countdown",
        title: "Deadline countdown calculator",
        href: "/en/date-time/deadline-countdown-calculator",
        categoryId: "fecha-tiempo",
      }),
      expect.objectContaining({
        id: "calculadora-de-horas-trabajadas",
        title: "Work hours calculator",
        href: "/en/date-time/work-hours-calculator",
        categoryId: "fecha-tiempo",
      }),
      expect.objectContaining({
        id: "calculadora-pomodoro",
        title: "Pomodoro timer",
        href: "/en/date-time/pomodoro-timer",
        categoryId: "fecha-tiempo",
      }),
      expect.objectContaining({
        id: "calculadora-costo-reunion",
        title: "Meeting cost calculator",
        href: "/en/date-time/meeting-cost-calculator",
        categoryId: "fecha-tiempo",
      }),
      expect.objectContaining({
        id: "calculadora-tiempo-de-lectura",
        title: "Reading time calculator",
        href: "/en/date-time/reading-time-calculator",
        categoryId: "fecha-tiempo",
      }),
      expect.objectContaining({
        id: "conversor-de-temperatura",
        title: "Temperature converter",
        href: "/en/converters/temperature-converter",
        categoryId: "conversores",
      }),
      expect.objectContaining({
        id: "kilometros-a-millas",
        title: "Kilometers to miles converter",
        href: "/en/converters/kilometers-to-miles",
        categoryId: "conversores",
      }),
      expect.objectContaining({
        id: "litros-a-galones",
        title: "Liters to gallons converter",
        href: "/en/converters/liters-to-gallons",
        categoryId: "conversores",
      }),
      expect.objectContaining({
        id: "conversor-de-area-m2-ft2-hectareas-acres",
        title: "Area converter",
        href: "/en/converters/area-converter",
        categoryId: "conversores",
      }),
      expect.objectContaining({
        id: "conversor-de-volumen",
        title: "Volume converter",
        href: "/en/converters/volume-converter",
        categoryId: "conversores",
      }),
      expect.objectContaining({
        id: "conversor-de-peso",
        title: "Weight converter",
        href: "/en/converters/weight-converter",
        categoryId: "conversores",
      }),
      expect.objectContaining({
        id: "conversor-tallas-de-ropa",
        title: "Clothing size converter",
        href: "/en/converters/clothing-size-converter",
        categoryId: "conversores",
      }),
      expect.objectContaining({
        id: "calculadora-de-area-y-perimetro",
        title: "Area and perimeter calculator",
        href: "/en/geometry/area-perimeter-calculator",
        categoryId: "geometria",
      }),
      expect.objectContaining({
        id: "calculadora-del-teorema-de-pitagoras",
        title: "Pythagorean theorem calculator",
        href: "/en/geometry/pythagorean-theorem-calculator",
        categoryId: "geometria",
      }),
      expect.objectContaining({
        id: "calculadora-de-estadistica-basica",
        title: "Basic statistics calculator",
        href: "/en/math/basic-statistics-calculator",
        categoryId: "matematicas",
      }),
      expect.objectContaining({
        id: "calculadora-promedio-escolar-gpa",
        title: "Grade average and GPA calculator",
        href: "/en/math/gpa-calculator",
        categoryId: "matematicas",
      }),
      expect.objectContaining({
        id: "calculadora-nota-minima-para-aprobar",
        title: "Minimum grade calculator",
        href: "/en/math/minimum-grade-calculator",
        categoryId: "matematicas",
      }),
      expect.objectContaining({
        id: "calculadora-calificacion-ponderada",
        title: "Weighted grade calculator",
        href: "/en/math/weighted-grade-calculator",
        categoryId: "matematicas",
      }),
      expect.objectContaining({
        id: "calculadora-horas-de-estudio",
        title: "Study hours calculator",
        href: "/en/math/study-hours-calculator",
        categoryId: "matematicas",
      }),
      expect.objectContaining({
        id: "calculadora-porcentaje-asistencia-escolar",
        title: "School attendance percentage calculator",
        href: "/en/math/attendance-percentage-calculator",
        categoryId: "matematicas",
      }),
      expect.objectContaining({
        id: "conversor-de-medidas-culinarias",
        title: "Cooking measurement converter",
        href: "/en/cooking/cooking-measurement-converter",
        categoryId: "cocina",
      }),
      expect.objectContaining({
        id: "conversor-de-temperatura-de-horno",
        title: "Oven temperature converter",
        href: "/en/cooking/oven-temperature-converter",
        categoryId: "cocina",
      }),
      expect.objectContaining({
        id: "calculadora-tiempo-coccion-por-peso",
        title: "Cooking time by weight calculator",
        href: "/en/cooking/cooking-time-by-weight-calculator",
        categoryId: "cocina",
      }),
      expect.objectContaining({
        id: "escalar-receta-por-porciones",
        title: "Recipe scaler",
        href: "/en/cooking/recipe-scaler",
        categoryId: "cocina",
      }),
      expect.objectContaining({
        id: "edad-de-mascota-en-anos-humanos",
        title: "Pet age calculator",
        href: "/en/pets/pet-age-calculator",
        categoryId: "mascotas",
      }),
      expect.objectContaining({
        id: "calorias-diarias-para-perro-o-gato",
        title: "Pet calorie calculator",
        href: "/en/pets/pet-calorie-calculator",
        categoryId: "mascotas",
      }),
      expect.objectContaining({
        id: "calculadora-presupuesto-boda",
        title: "Wedding budget calculator",
        href: "/en/events/wedding-budget-calculator",
        categoryId: "eventos",
      }),
      expect.objectContaining({
        id: "calculadora-costo-por-persona-evento",
        title: "Event cost per person calculator",
        href: "/en/events/event-cost-per-person-calculator",
        categoryId: "eventos",
      }),
      expect.objectContaining({
        id: "calculadora-volumen-concreto-cemento",
        title: "Concrete volume calculator",
        href: "/en/construction/concrete-volume-calculator",
        categoryId: "construccion",
      }),
      expect.objectContaining({
        id: "calculadora-cantidad-ladrillos",
        title: "Brick calculator",
        href: "/en/construction/brick-calculator",
        categoryId: "construccion",
      }),
      expect.objectContaining({
        id: "calculadora-piso-azulejo-superficie",
        title: "Floor and wall tile calculator",
        href: "/en/construction/tile-calculator",
        categoryId: "construccion",
      }),
      expect.objectContaining({
        id: "calculadora-presupuesto-remodelacion",
        title: "Renovation budget calculator",
        href: "/en/construction/renovation-budget-calculator",
        categoryId: "construccion",
      }),
      expect.objectContaining({
        id: "metros-cuadrados-de-pintura",
        title: "Paint calculator",
        href: "/en/construction/paint-calculator",
        categoryId: "construccion",
      }),
    ]));
    expect(englishCalculators).toHaveLength(
      CALCULATORS.length - 2 + LEGAL_TAX_MARKET_DIRECTORY_ITEMS.length,
    );
    expect(englishCalculators.map((calculator) => calculator.id)).not.toContain(
      "calculadora-aguinaldo-proporcional",
    );
    expect(englishCalculators.map((calculator) => calculator.id)).not.toContain(
      "calculadora-prima-vacacional",
    );
  });

  it("groups English calculators only under localized published categories", () => {
    const categories = getCalculatorCategories(
      getPublishedCalculators("en"),
      "en",
    );

    expect(categories).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "matematicas",
          slug: "math",
          label: "Math",
          count: 11,
        }),
        expect.objectContaining({
          id: "cocina",
          slug: "cooking",
          label: "Cooking",
          count: 4,
        }),
        expect.objectContaining({
          id: "construccion",
          slug: "construction",
          label: "Construction",
          count: 5,
        }),
        expect.objectContaining({
          id: "conversores",
          slug: "converters",
          label: "Converters",
          count: 7,
        }),
        expect.objectContaining({
          id: "eventos",
          slug: "events",
          label: "Events",
          count: 2,
        }),
        expect.objectContaining({
          id: "fecha-tiempo",
          slug: "date-time",
          label: "Date & Time",
          count: 7,
        }),
        expect.objectContaining({
          id: "finanzas",
          slug: "finance",
          label: "Finance",
          count: 12,
        }),
        expect.objectContaining({
          id: "geometria",
          slug: "geometry",
          label: "Geometry",
          count: 2,
        }),
        expect.objectContaining({
          id: "inmuebles",
          slug: "real-estate",
          label: "Real Estate",
          count: 7,
        }),
        expect.objectContaining({
          id: "mascotas",
          slug: "pets",
          label: "Pets",
          count: 2,
        }),
        expect.objectContaining({
          id: "legal-impuestos",
          slug: "legal-tax",
          label: "Legal & Taxes",
          count: 36,
        }),
      ]),
    );
  });

  it("lists all published legal and tax calculators", () => {
    const legalCalculators = getPublishedCalculators().filter(
      (calculator) => calculator.categoryId === "legal-impuestos",
    );

    expect(legalCalculators.map((calculator) => calculator.id)).toEqual([
      "calculadora-de-iva",
      "calculadora-isr-irpf",
      "calculadora-salario-neto",
      "calculadora-vacaciones-proporcionales",
      "calculadora-aguinaldo-proporcional",
      "calculadora-prima-vacacional",
      "calculadora-finiquito-liquidacion",
    ]);
  });

  it("publishes the probability, programming, vehicle and restaurant calculators in English", () => {
    const englishCalculators = getPublishedCalculators("en");

    expect(englishCalculators).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: "calculadora-probabilidad-basica", href: "/en/probability-statistics/basic-probability-calculator" }),
      expect.objectContaining({ id: "calculadora-entropia-contrasena", href: "/en/programming/password-entropy-calculator" }),
      expect.objectContaining({ id: "calculadora-de-consumo-de-gasolina", href: "/en/vehicles/fuel-consumption-calculator" }),
      expect.objectContaining({ id: "calculadora-de-propina", href: "/en/restaurants/tip-calculator" }),
    ]));
  });

  it("keeps display labels separate from canonical slugs", () => {
    const categories = getCalculatorCategories(getPublishedCalculators());

    expect(categories).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          slug: "legal-impuestos",
          label: "Legal e impuestos",
        }),
        expect.objectContaining({
          slug: "fecha-tiempo",
          label: "Fecha y tiempo",
        }),
        expect.objectContaining({
          slug: "probabilidad-estadistica",
          label: "Probabilidad y estadística",
        }),
        expect.objectContaining({
          slug: "programacion",
          label: "Programación",
        }),
        expect.objectContaining({
          slug: "eventos",
          label: "Eventos",
        }),
      ]),
    );
    expect(categories.map((category) => category.slug)).not.toContain(
      "legal-e-impuestos",
    );
    expect(categories.map((category) => category.slug)).not.toContain(
      "fecha-y-tiempo",
    );
  });

  it("declares coherent category metadata and calculator routes", () => {
    const reservedSlugs = new Set([
      "404",
      "blog",
      "calculadora-de-edad",
      "calculadora-deficit-calorico",
      "categoria",
      "contacto",
      "en",
      "pagina",
      "privacidad",
      "robots.txt",
    ]);

    Object.entries(CATEGORIES).forEach(([slug, metadata]) => {
      expect(metadata.slug).toBe(slug);
      expect(reservedSlugs.has(slug)).toBe(false);
    });

    CALCULATORS.forEach((calculator) => {
      expect(CATEGORIES[calculator.categorySlug]).toBeDefined();
      expect(CATEGORIES[calculator.categorySlug].description).toBeTruthy();
      expect(calculator.href.startsWith(`/${calculator.categorySlug}/`)).toBe(
        true,
      );
    });

    CALCULATOR_DEFINITIONS.forEach((calculator) => {
      expect("href" in calculator).toBe(false);
      expect(CATEGORIES[calculator.categoryId]).toBeDefined();
      expect(calculator.locales.es?.published).toBe(!calculator.draft);
    });
  });

  it("keeps localized category and calculator slugs unique", () => {
    const reservedSlugs = new Set([
      "404",
      "blog",
      "categoria",
      "contacto",
      "en",
      "pagina",
      "privacidad",
      "robots.txt",
    ]);
    const categorySlugsByLocale = new Map<string, string>();
    const calculatorSlugsByLocaleAndCategory = new Map<string, string>();

    Object.values(CATEGORY_DEFINITIONS).forEach((definition) => {
      Object.entries(definition.locales).forEach(([locale, metadata]) => {
        expect(metadata).toBeDefined();
        expect(reservedSlugs.has(metadata.slug)).toBe(false);

        const key = `${locale}:${metadata.slug}`;
        expect(categorySlugsByLocale.has(key)).toBe(false);
        categorySlugsByLocale.set(key, definition.id);

        metadata.legacySlugs?.forEach((legacySlug) => {
          expect(reservedSlugs.has(legacySlug)).toBe(false);
        });
      });
    });

    CALCULATOR_DEFINITIONS.forEach((definition) => {
      Object.entries(definition.locales).forEach(([locale, metadata]) => {
        expect(metadata).toBeDefined();

        const key = `${locale}:${definition.categoryId}:${metadata.slug}`;
        expect(calculatorSlugsByLocaleAndCategory.has(key)).toBe(false);
        calculatorSlugsByLocaleAndCategory.set(key, definition.id);
      });
    });
  });

  it("keeps shared category labels and legacy slugs coherent", () => {
    const labels = new Set<string>();
    const routeSlugs = new Set<string>();
    const reservedBlogSlugs = new Set(["categoria", "pagina"]);

    CATEGORY_SLUGS.forEach((slug) => {
      const category = CATEGORIES[slug];

      expect(category.slug).toBe(slug);
      expect(labels.has(category.label)).toBe(false);
      labels.add(category.label);

      expect(routeSlugs.has(category.slug)).toBe(false);
      expect(reservedBlogSlugs.has(category.slug)).toBe(false);
      routeSlugs.add(category.slug);

      category.legacySlugs?.forEach((legacySlug) => {
        expect(routeSlugs.has(legacySlug)).toBe(false);
        expect(reservedBlogSlugs.has(legacySlug)).toBe(false);
        routeSlugs.add(legacySlug);
      });
    });

    expect(getCategoryByLabel("Legal e impuestos")?.slug).toBe(
      "legal-impuestos",
    );
    expect(getCategoryByLabel("Fecha y tiempo")?.slug).toBe("fecha-tiempo");
    expect(getCategoryByLabel("Eventos")?.slug).toBe("eventos");
    expect(getCategoryByLabel("Restaurantes")?.slug).toBe("restaurantes");
    expect(getCategoryByLabel("Probabilidad y estadística")?.slug).toBe(
      "probabilidad-estadistica",
    );
    expect(getCategoryByLabel("Programación")?.slug).toBe("programacion");
    expect(getCategoryBySlugOrLegacySlug("legal-e-impuestos")?.slug).toBe(
      "legal-impuestos",
    );
    expect(getCategoryBySlugOrLegacySlug("fecha-y-tiempo")?.slug).toBe(
      "fecha-tiempo",
    );
    expect(getCategoryBySlugOrLegacySlug("eventos-sociales")?.slug).toBe(
      "eventos",
    );
    expect(getCategoryBySlugOrLegacySlug("math", "en")?.slug).toBe("math");
  });
});
