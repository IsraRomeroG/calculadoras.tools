import type { Locale } from "@lib/i18n/config";
import type { CategoryId, CategorySlug } from "./categories";

export interface LegacyCalculatorDirectoryItem {
  id: string;
  title: string;
  description: string;
  href: string;
  categorySlug: CategorySlug;
  order: number;
  draft?: boolean;
}

export interface LocalizedCalculatorMetadata {
  title: string;
  description: string;
  slug: string;
  published: boolean;
}

export interface CalculatorDefinition {
  id: string;
  categoryId: CategoryId;
  order: number;
  draft?: boolean;
  locales: Partial<Record<Locale, LocalizedCalculatorMetadata>>;
}

export const CALCULATORS: LegacyCalculatorDirectoryItem[] = [
  {
    id: "calculadora-de-porcentajes",
    title: "Calculadora de porcentajes",
    description: "Calcula porcentajes y aumentos/disminuciones en valores.",
    href: "/matematicas/calculadora-de-porcentajes",
    categorySlug: "matematicas",
    order: 10,
  },
  {
    id: "calculadora-de-regla-de-tres",
    title: "Calculadora de regla de tres",
    description: "Resuelve proporciones directas e inversas paso a paso.",
    href: "/matematicas/calculadora-de-regla-de-tres",
    categorySlug: "matematicas",
    order: 15,
  },
  {
    id: "calculadora-mcd-mcm",
    title: "Calculadora de MCD y MCM",
    description:
      "Calcula máximo común divisor y mínimo común múltiplo con procedimiento, comprobación y factores primos.",
    href: "/matematicas/calculadora-mcd-mcm",
    categorySlug: "matematicas",
    order: 16,
  },
  {
    id: "calculadora-ecuaciones-cuadraticas",
    title: "Calculadora de ecuaciones cuadráticas",
    description:
      "Resuelve ecuaciones cuadráticas con discriminante, raíces reales o complejas, vértice y procedimiento paso a paso.",
    href: "/matematicas/calculadora-ecuaciones-cuadraticas",
    categorySlug: "matematicas",
    order: 17,
  },
  {
    id: "calculadora-sistema-ecuaciones-2x2",
    title: "Calculadora de sistema de ecuaciones 2x2",
    description:
      "Resuelve sistemas lineales 2x2 con regla de Cramer, determinantes, comprobacion e interpretacion.",
    href: "/matematicas/calculadora-sistema-ecuaciones-2x2",
    categorySlug: "matematicas",
    order: 18,
  },
  {
    id: "calculadora-probabilidad-basica",
    title: "Calculadora de probabilidad",
    description:
      "Calcula probabilidades simples, complementos, uniones, intersecciones y probabilidades condicionales con fórmula y explicación.",
    href: "/probabilidad-estadistica/calculadora-probabilidad-basica",
    categorySlug: "probabilidad-estadistica",
    order: 18.5,
  },
  {
    id: "calculadora-combinaciones-permutaciones",
    title: "Calculadora de combinaciones y permutaciones",
    description:
      "Calcula combinaciones y arreglos con o sin repetición, resultado exacto y explicación de la fórmula.",
    href: "/probabilidad-estadistica/calculadora-combinaciones-permutaciones",
    categorySlug: "probabilidad-estadistica",
    order: 19,
  },
  {
    id: "calculadora-distribucion-normal-z-score",
    title: "Calculadora de distribución normal y Z-score",
    description:
      "Calcula Z-score, percentiles, probabilidades y valores críticos con gráfica y procedimiento.",
    href: "/probabilidad-estadistica/calculadora-distribucion-normal-z-score",
    categorySlug: "probabilidad-estadistica",
    order: 19.5,
  },
  {
    id: "calculadora-de-iva",
    title: "Calculadora de IVA",
    description: "Agrega o desglosa IVA con tasa editable y presets por país.",
    href: "/legal-impuestos/calculadora-de-iva",
    categorySlug: "legal-impuestos",
    order: 20,
  },
  {
    id: "calculadora-isr-irpf",
    title: "Calculadora de ISR",
    description:
      "Estima tu ISR por periodo o por año y consulta la tasa efectiva del impuesto.",
    href: "/legal-impuestos/calculadora-isr-irpf",
    categorySlug: "legal-impuestos",
    order: 21,
  },
  {
    id: "calculadora-salario-neto",
    title: "Calculadora de salario neto",
    description:
      "Estima tu salario neto después de ISR, subsidios y deducciones, con desglose del cálculo.",
    href: "/legal-impuestos/calculadora-salario-neto",
    categorySlug: "legal-impuestos",
    order: 22,
  },
  {
    id: "calculadora-vacaciones-proporcionales",
    title: "Calculadora de vacaciones proporcionales",
    description:
      "Estima vacaciones adquiridas o la parte proporcional para finiquito según antigüedad y la LFT de México.",
    href: "/legal-impuestos/calculadora-vacaciones-proporcionales",
    categorySlug: "legal-impuestos",
    order: 23,
  },
  {
    id: "calculadora-aguinaldo-proporcional",
    title: "Calculadora de aguinaldo proporcional",
    description:
      "Estima el aguinaldo bruto generado en México según salario fijo, fechas, días elegibles y la LFT.",
    href: "/legal-impuestos/calculadora-aguinaldo-proporcional",
    categorySlug: "legal-impuestos",
    order: 23.5,
  },
  {
    id: "calculadora-prima-vacacional",
    title: "Calculadora de prima vacacional",
    description:
      "Calcula la prima vacacional en México y compara el mínimo legal con un porcentaje contractual o pagado.",
    href: "/legal-impuestos/calculadora-prima-vacacional",
    categorySlug: "legal-impuestos",
    order: 23.75,
  },
  {
    id: "calculadora-finiquito-liquidacion",
    title: "Calculadora de finiquito y liquidación",
    description:
      "Estima el finiquito bruto, prestaciones proporcionales y escenarios condicionados de indemnización en México.",
    href: "/legal-impuestos/calculadora-finiquito-liquidacion",
    categorySlug: "legal-impuestos",
    order: 24,
  },
  {
    id: "calculadora-de-interes-compuesto",
    title: "Calculadora de interés compuesto",
    description:
      "Simula inversiones con aportaciones, inflación y crecimiento año a año.",
    href: "/finanzas/calculadora-de-interes-compuesto",
    categorySlug: "finanzas",
    order: 30,
  },
  {
    id: "calculadora-de-inflacion-poder-adquisitivo",
    title: "Calculadora de inflación y poder adquisitivo",
    description:
      "Calcula cuánto costará algo en el futuro y cuánto poder de compra conservará tu dinero.",
    href: "/finanzas/calculadora-de-inflacion-poder-adquisitivo",
    categorySlug: "finanzas",
    order: 31,
  },
  {
    id: "calculadora-de-interes-simple",
    title: "Calculadora de interés simple",
    description:
      "Calcula intereses y total con tasas diarias, mensuales o anuales.",
    href: "/finanzas/calculadora-de-interes-simple",
    categorySlug: "finanzas",
    order: 32,
  },
  {
    id: "calculadora-de-prestamo",
    title: "Calculadora de préstamo",
    description:
      "Calcula cuota mensual, intereses, costo total y tabla de amortización.",
    href: "/finanzas/calculadora-de-prestamo",
    categorySlug: "finanzas",
    order: 35,
  },
  {
    id: "plan-de-pago-de-deudas",
    title: "Plan de pago de deudas",
    description:
      "Compara bola de nieve y avalancha, estima intereses y crea un plan mensual de pagos.",
    href: "/finanzas/plan-de-pago-de-deudas",
    categorySlug: "finanzas",
    order: 36,
  },
  {
    id: "calculadora-de-ahorro-para-un-objetivo",
    title: "Calculadora de ahorro para un objetivo",
    description:
      "Calcula cuánto ahorrar al mes, cuándo alcanzarás una meta y cómo ajustar tu plan.",
    href: "/finanzas/calculadora-de-ahorro-para-un-objetivo",
    categorySlug: "finanzas",
    order: 36.5,
  },
  {
    id: "calculadora-de-roi",
    title: "Calculadora de ROI",
    description:
      "Calcula retorno de inversión, ganancia, punto de equilibrio y cuánto falta para alcanzar tu objetivo.",
    href: "/finanzas/calculadora-de-roi",
    categorySlug: "finanzas",
    order: 37,
  },
  {
    id: "calculadora-de-margen-y-markup",
    title: "Calculadora de margen y markup",
    description:
      "Calcula ganancia, margen, markup, precio mínimo y precio de venta objetivo incluyendo comisiones.",
    href: "/finanzas/calculadora-de-margen-y-markup",
    categorySlug: "finanzas",
    order: 37.25,
  },
  {
    id: "calculadora-de-punto-de-equilibrio",
    title: "Calculadora de punto de equilibrio",
    description:
      "Calcula cuánto necesitas vender para cubrir costos, evaluar tu proyección y alcanzar una utilidad objetivo.",
    href: "/finanzas/calculadora-de-punto-de-equilibrio",
    categorySlug: "finanzas",
    order: 37.4,
  },
  {
    id: "calculadora-de-tarifa-por-hora-freelance",
    title: "Calculadora de tarifa por hora freelance",
    description:
      "Calcula una tarifa sostenible según ingreso deseado, gastos, impuestos, comisiones y horas facturables.",
    href: "/finanzas/calculadora-de-tarifa-por-hora-freelance",
    categorySlug: "finanzas",
    order: 37.45,
  },
  {
    id: "calculadora-de-precio-de-proyecto-freelance",
    title: "Calculadora de precio de proyecto freelance",
    description:
      "Calcula cuánto cobrar por un proyecto, compara escenarios y analiza si un precio fijo cubre horas, gastos, riesgo y margen.",
    href: "/finanzas/calculadora-de-precio-de-proyecto-freelance",
    categorySlug: "finanzas",
    order: 37.47,
  },
  {
    id: "calculadora-dca-costo-promedio",
    title: "Calculadora de precio promedio (DCA)",
    description:
      "Calcula precio promedio, costo efectivo con comisiones y cómo cambiaría con una próxima compra.",
    href: "/finanzas/calculadora-dca-costo-promedio",
    categorySlug: "finanzas",
    order: 37.5,
  },
  {
    id: "calculadora-de-hipoteca",
    title: "Calculadora de hipoteca",
    description:
      "Estima cuota mensual, intereses y tabla de amortización de una hipoteca.",
    href: "/inmuebles/calculadora-de-hipoteca",
    categorySlug: "inmuebles",
    order: 38,
  },
  {
    id: "calculadora-capacidad-compra-vivienda",
    title: "Calculadora de capacidad de compra de vivienda",
    description:
      "Estima que precio de vivienda podrias considerar segun ingreso, deudas, enganche, gastos iniciales, tasa y plazo.",
    href: "/inmuebles/calculadora-capacidad-compra-vivienda",
    categorySlug: "inmuebles",
    order: 38.15,
  },
  {
    id: "calculadora-renta-vs-compra",
    title: "Calculadora renta vs compra",
    description:
      "Compara rentar e invertir frente a comprar vivienda con hipoteca, enganche, plusvalia y supuestos editables.",
    href: "/inmuebles/calculadora-renta-vs-compra",
    categorySlug: "inmuebles",
    order: 38.25,
  },
  {
    id: "calculadora-cap-rate-rentabilidad",
    title: "Calculadora de cap rate",
    description:
      "Calcula cap rate, NOI, rendimiento bruto, flujo de caja y cash-on-cash de una propiedad en alquiler.",
    href: "/inmuebles/calculadora-cap-rate-rentabilidad",
    categorySlug: "inmuebles",
    order: 38.3,
  },
  {
    id: "calculadora-gastos-escrituracion",
    title: "Calculadora de gastos de escrituracion",
    description:
      "Estima gastos de escrituracion y cierre con partidas editables, efectivo requerido y neto del vendedor.",
    href: "/inmuebles/calculadora-gastos-escrituracion",
    categorySlug: "inmuebles",
    order: 38.35,
  },
  {
    id: "calculadora-plusvalia-estimada",
    title: "Calculadora de plusvalía estimada",
    description:
      "Proyecta el valor futuro de una propiedad con plusvalía compuesta y escenarios conservador, base y optimista.",
    href: "/inmuebles/calculadora-plusvalia-estimada",
    categorySlug: "inmuebles",
    order: 38.4,
  },
  {
    id: "calculadora-de-imc",
    title: "Calculadora de IMC",
    description:
      "Calcula tu Índice de Masa Corporal y revisa tu rango saludable estimado.",
    href: "/salud/calculadora-de-imc",
    categorySlug: "salud",
    order: 40,
  },
  {
    id: "calculadora-de-porcentaje-de-grasa-corporal",
    title: "Calculadora de grasa corporal",
    description:
      "Estima tu porcentaje de grasa corporal con circunferencias y revisa la sensibilidad de la medición.",
    href: "/salud/calculadora-de-porcentaje-de-grasa-corporal",
    categorySlug: "salud",
    order: 42,
  },
  {
    id: "calculadora-de-calorias-diarias-tdee",
    title: "Calculadora de calorías diarias (TDEE)",
    description:
      "Estima tu TMB, gasto diario total y calorías orientativas por objetivo.",
    href: "/salud/calculadora-de-calorias-diarias-tdee",
    categorySlug: "salud",
    order: 45,
  },
  {
    id: "calculadora-de-macros",
    title: "Calculadora de macros",
    description:
      "Calcula gramos diarios de proteína, carbohidratos y grasas según calorías, peso y objetivo.",
    href: "/salud/calculadora-de-macros",
    categorySlug: "salud",
    order: 50,
  },
  {
    id: "calculadora-de-calorias-quemadas-por-ejercicio",
    title: "Calculadora de calorías quemadas por ejercicio",
    description:
      "Estima calorías totales y activas según peso, duración, actividad y ritmo.",
    href: "/salud/calculadora-de-calorias-quemadas-por-ejercicio",
    categorySlug: "salud",
    order: 47,
  },
  {
    id: "calculadora-de-proteina-diaria",
    title: "Calculadora de proteína diaria",
    description:
      "Calcula un rango orientativo de proteína según peso, objetivo y tipo de entrenamiento.",
    href: "/salud/calculadora-de-proteina-diaria",
    categorySlug: "salud",
    order: 52,
  },
  {
    id: "calculadora-deficit-calorico",
    title: "Calculadora de deficit calorico",
    description:
      "Estima calorias diarias, deficit, ritmo semanal y plazo para bajar de peso.",
    href: "/salud/calculadora-deficit-calorico",
    categorySlug: "salud",
    order: 55,
  },
  {
    id: "fecha-probable-de-parto",
    title: "Calculadora de fecha probable de parto",
    description:
      "Calcula FPP, semanas de embarazo, ventana de parto y confianza por FUM, ecografia, FIV o FPP oficial.",
    href: "/salud/fecha-probable-de-parto",
    categorySlug: "salud",
    order: 57,
  },
  {
    id: "calculadora-de-ovulacion",
    title: "Calculadora de ovulacion",
    description:
      "Estima ventana fertil, ovulacion probable, proxima menstruacion y confianza segun tu ciclo.",
    href: "/salud/calculadora-de-ovulacion",
    categorySlug: "salud",
    order: 58,
  },
  {
    id: "calculadora-de-frecuencia-cardiaca-maxima",
    title: "Calculadora de frecuencia cardíaca máxima",
    description:
      "Estima tu frecuencia cardíaca máxima por edad y consulta rangos generales de actividad moderada y vigorosa.",
    href: "/salud/calculadora-de-frecuencia-cardiaca-maxima",
    categorySlug: "salud",
    order: 59,
  },
  {
    id: "calculadora-de-zonas-de-frecuencia-cardiaca",
    title: "Calculadora de zonas de frecuencia cardíaca",
    description:
      "Calcula cinco zonas orientativas por porcentaje de FCM o mediante reserva cardíaca con Karvonen.",
    href: "/salud/calculadora-de-zonas-de-frecuencia-cardiaca",
    categorySlug: "salud",
    order: 59.5,
  },
  {
    id: "calculadora-de-agua-diaria",
    title: "Calculadora de agua diaria",
    description:
      "Estima un rango orientativo de líquidos para beber según peso, ejercicio, sudoración y calor.",
    href: "/salud/calculadora-de-agua-diaria",
    categorySlug: "salud",
    order: 59.7,
  },
  {
    id: "calculadora-1rm-repeticion-maxima",
    title: "Calculadora de 1RM",
    description:
      "Estima tu repetición máxima, compara Epley y Brzycki y calcula cargas prácticas.",
    href: "/salud/calculadora-1rm-repeticion-maxima",
    categorySlug: "salud",
    order: 59.8,
  },
  {
    id: "calculadora-vo2-max",
    title: "Calculadora de VO2 máx",
    description:
      "Estima tu VO2 máx con las pruebas Cooper o Rockport y compara resultados del mismo método.",
    href: "/salud/calculadora-vo2-max",
    categorySlug: "salud",
    order: 59.85,
  },
  {
    id: "calculadora-de-pace-ritmo-de-carrera",
    title: "Calculadora de pace y ritmo de carrera",
    description:
      "Calcula ritmo, tiempo o distancia y obtén equivalencias y splits acumulados para tu carrera.",
    href: "/salud/calculadora-de-pace-ritmo-de-carrera",
    categorySlug: "salud",
    order: 59.9,
  },
  {
    id: "calculadora-prediccion-tiempo-carrera",
    title: "Calculadora de predicción de tiempo de carrera",
    description:
      "Predice tiempos y ritmos para otras distancias desde una marca reciente y evalúa la calidad de la referencia.",
    href: "/salud/calculadora-prediccion-tiempo-carrera",
    categorySlug: "salud",
    order: 59.95,
  },
  {
    id: "calculadora-de-edad",
    title: "Calculadora de edad",
    description:
      "Calcula edad exacta, días vividos y próximo cumpleaños con fecha de referencia editable.",
    href: "/fecha-tiempo/calculadora-de-edad",
    categorySlug: "fecha-tiempo",
    order: 60,
  },
  {
    id: "diferencia-entre-fechas",
    title: "Calculadora de diferencia entre fechas",
    description:
      "Calcula días, semanas, meses y años entre fechas, suma o resta tiempo y cuenta días hábiles de lunes a viernes sin festivos.",
    href: "/fecha-tiempo/diferencia-entre-fechas",
    categorySlug: "fecha-tiempo",
    order: 62,
  },
  {
    id: "calculadora-fecha-limite-countdown",
    title: "Calculadora de fecha límite",
    description:
      "Calcula cuánto falta para una fecha límite, sigue una cuenta regresiva y añade el evento a tu calendario.",
    href: "/fecha-tiempo/calculadora-fecha-limite-countdown",
    categorySlug: "fecha-tiempo",
    order: 63,
  },
  {
    id: "calculadora-de-horas-trabajadas",
    title: "Calculadora de horas trabajadas",
    description:
      "Suma turnos, resta descansos y estima horas normales, horas extra y pago por hora.",
    href: "/fecha-tiempo/calculadora-de-horas-trabajadas",
    categorySlug: "fecha-tiempo",
    order: 64,
  },
  {
    id: "calculadora-pomodoro",
    title: "Calculadora Pomodoro",
    description:
      "Planifica pomodoros con descansos, hora de finalizacion y bloques posibles en tu tiempo disponible.",
    href: "/fecha-tiempo/calculadora-pomodoro",
    categorySlug: "fecha-tiempo",
    order: 64.5,
  },
  {
    id: "calculadora-costo-reunion",
    title: "Calculadora de costo de reunion",
    description:
      "Estima costo, horas-persona, recurrencia y ahorro potencial de una reunion segun asistentes, duracion y tarifa por hora.",
    href: "/fecha-tiempo/calculadora-costo-reunion",
    categorySlug: "fecha-tiempo",
    order: 64.7,
  },
  {
    id: "calculadora-tiempo-de-lectura",
    title: "Calculadora de tiempo de lectura",
    description:
      "Calcula tiempo estimado, rango de lectura, hora de finalizacion y metricas de palabras sin enviar el texto a servidores.",
    href: "/fecha-tiempo/calculadora-tiempo-de-lectura",
    categorySlug: "fecha-tiempo",
    order: 64.8,
  },
  {
    id: "conversor-de-temperatura",
    title: "Conversor de temperatura",
    description:
      "Convierte temperaturas entre Celsius, Fahrenheit y Kelvin con fórmula y referencias prácticas.",
    href: "/conversores/conversor-de-temperatura",
    categorySlug: "conversores",
    order: 65,
  },
  {
    id: "kilometros-a-millas",
    title: "Kilómetros a millas",
    description:
      "Convierte kilómetros y millas terrestres al instante con fórmula y equivalencias frecuentes.",
    href: "/conversores/kilometros-a-millas",
    categorySlug: "conversores",
    order: 69,
  },
  {
    id: "litros-a-galones",
    title: "Litros a galones",
    description:
      "Convierte litros a galones estadounidenses e imperiales, o galones a litros, con ambas variantes claramente identificadas.",
    href: "/conversores/litros-a-galones",
    categorySlug: "conversores",
    order: 69.5,
  },
  {
    id: "conversor-de-area-m2-ft2-hectareas-acres",
    title: "Conversor de área",
    description:
      "Convierte m², ft², hectáreas y acres, o calcula la superficie desde largo y ancho.",
    href: "/conversores/conversor-de-area-m2-ft2-hectareas-acres",
    categorySlug: "conversores",
    order: 69.75,
  },
  {
    id: "conversor-de-volumen",
    title: "Conversor de volumen",
    description:
      "Convierte ml, L, cm³, m³ y medidas líquidas US o imperiales con el sistema regional siempre visible.",
    href: "/conversores/conversor-de-volumen",
    categorySlug: "conversores",
    order: 69.8,
  },
  {
    id: "conversor-de-peso",
    title: "Conversor de peso",
    description:
      "Convierte kilogramos y libras al instante con fórmula y equivalencias útiles.",
    href: "/conversores/conversor-de-peso",
    categorySlug: "conversores",
    order: 70,
  },
  {
    id: "conversor-tallas-de-ropa",
    title: "Conversor de tallas de ropa",
    description:
      "Convierte tallas de ropa entre sistemas internacionales, US, EU, UK y MX con rangos de medidas orientativos.",
    href: "/conversores/conversor-tallas-de-ropa",
    categorySlug: "conversores",
    order: 70.5,
  },
  {
    id: "conversor-de-bases-numericas",
    title: "Conversor de bases numéricas",
    description:
      "Convierte enteros exactos entre binario, octal, decimal, hexadecimal y bases de 2 a 36.",
    href: "/programacion/conversor-de-bases-numericas",
    categorySlug: "programacion",
    order: 71,
  },
  {
    id: "paleta-hex-rgb-hsl",
    title: "Paleta HEX, RGB y HSL",
    description:
      "Convierte colores para CSS, genera una escala 50-900 y revisa contraste WCAG.",
    href: "/programacion/paleta-hex-rgb-hsl",
    categorySlug: "programacion",
    order: 71.5,
  },
  {
    id: "calculadora-entropia-contrasena",
    title: "Calculadora de entropía de contraseña",
    description:
      "Estima entropía, patrones, espacio de búsqueda y tiempo aproximado de ataque sin enviar la contraseña.",
    href: "/programacion/calculadora-entropia-contrasena",
    categorySlug: "programacion",
    order: 71.7,
  },
  {
    id: "calculadora-velocidad-descarga",
    title: "Calculadora de tiempo de descarga",
    description:
      "Estima tiempos de descarga, convierte Mbps a MB/s y calcula la velocidad necesaria para archivos grandes.",
    href: "/programacion/calculadora-velocidad-descarga",
    categorySlug: "programacion",
    order: 71.9,
  },
  {
    id: "calculadora-precio-por-metro-cuadrado",
    title: "Calculadora de precio por metro cuadrado",
    description:
      "Calcula precio base, precio efectivo y compara opciones por superficie con costos adicionales.",
    href: "/inmuebles/calculadora-precio-por-metro-cuadrado",
    categorySlug: "inmuebles",
    order: 38.5,
  },
  {
    id: "calculadora-de-area-y-perimetro",
    title: "Calculadora de área y perímetro",
    description:
      "Calcula área y perímetro de cuadrados, rectángulos, triángulos, círculos y polígonos regulares.",
    href: "/geometria/calculadora-de-area-y-perimetro",
    categorySlug: "geometria",
    order: 72,
  },
  {
    id: "calculadora-del-teorema-de-pitagoras",
    title: "Calculadora del teorema de Pitágoras",
    description:
      "Calcula la hipotenusa o un cateto de un triángulo rectángulo con fórmula y procedimiento.",
    href: "/geometria/calculadora-del-teorema-de-pitagoras",
    categorySlug: "geometria",
    order: 74,
  },
  {
    id: "calculadora-de-estadistica-basica",
    title: "Calculadora de estadistica basica",
    description:
      "Calcula media, mediana y moda de una lista de numeros con resumen y tabla de frecuencias.",
    href: "/matematicas/calculadora-de-estadistica-basica",
    categorySlug: "matematicas",
    order: 76,
  },
  {
    id: "calculadora-promedio-escolar-gpa",
    title: "Calculadora de promedio escolar y GPA",
    description:
      "Calcula promedio simple, promedio ponderado, GPA aproximado y calificacion necesaria para una meta.",
    href: "/matematicas/calculadora-promedio-escolar-gpa",
    categorySlug: "matematicas",
    order: 77,
  },
  {
    id: "calculadora-nota-minima-para-aprobar",
    title: "Calculadora de nota minima para aprobar",
    description:
      "Calcula la nota que necesitas en una evaluacion pendiente y revisa si tu objetivo es alcanzable.",
    href: "/matematicas/calculadora-nota-minima-para-aprobar",
    categorySlug: "matematicas",
    order: 77.2,
  },
  {
    id: "calculadora-calificacion-ponderada",
    title: "Calculadora de calificacion ponderada",
    description:
      "Calcula calificacion acumulada, peso pendiente y nota necesaria con evaluaciones ponderadas.",
    href: "/matematicas/calculadora-calificacion-ponderada",
    categorySlug: "matematicas",
    order: 77.3,
  },
  {
    id: "calculadora-horas-de-estudio",
    title: "Calculadora de horas de estudio",
    description:
      "Calcula horas por dia, sesiones y un plan semanal segun tu fecha limite o ritmo disponible.",
    href: "/matematicas/calculadora-horas-de-estudio",
    categorySlug: "matematicas",
    order: 77.4,
  },
  {
    id: "calculadora-porcentaje-asistencia-escolar",
    title: "Calculadora de asistencia escolar",
    description:
      "Calcula porcentaje de asistencia, faltas disponibles y clases necesarias para cumplir un minimo requerido.",
    href: "/matematicas/calculadora-porcentaje-asistencia-escolar",
    categorySlug: "matematicas",
    order: 77.5,
  },
  {
    id: "conversor-de-medidas-culinarias",
    title: "Conversor de medidas culinarias",
    description:
      "Convierte tazas, cucharadas, mililitros, gramos y otras medidas comunes de cocina.",
    href: "/cocina/conversor-de-medidas-culinarias",
    categorySlug: "cocina",
    order: 78,
  },
  {
    id: "conversor-de-temperatura-de-horno",
    title: "Conversor de temperatura de horno",
    description:
      "Convierte °C, °F y marca de gas con ajuste practico para horno, ventilador y seguridad alimentaria.",
    href: "/cocina/conversor-de-temperatura-de-horno",
    categorySlug: "cocina",
    order: 79,
  },
  {
    id: "calculadora-tiempo-coccion-por-peso",
    title: "Calculadora de tiempo de coccion por peso",
    description:
      "Estima tiempo de coccion por kilogramo o libra, hora para revisar, fin de coccion y hora de servir.",
    href: "/cocina/calculadora-tiempo-coccion-por-peso",
    categorySlug: "cocina",
    order: 79.5,
  },
  {
    id: "escalar-receta-por-porciones",
    title: "Escalar receta por porciones",
    description:
      "Ajusta las cantidades de una receta segun las porciones que necesitas preparar.",
    href: "/cocina/escalar-receta-por-porciones",
    categorySlug: "cocina",
    order: 80,
  },
  {
    id: "edad-de-mascota-en-anos-humanos",
    title: "Edad de mascota en anos humanos",
    description:
      "Estima la edad equivalente de perros y gatos con una tabla orientativa por especie y talla.",
    href: "/mascotas/edad-de-mascota-en-anos-humanos",
    categorySlug: "mascotas",
    order: 82,
  },
  {
    id: "calorias-diarias-para-perro-o-gato",
    title: "Calorias diarias para perro o gato",
    description:
      "Estima un rango orientativo de calorias diarias para perros y gatos adultos segun peso, perfil y condicion corporal.",
    href: "/mascotas/calorias-diarias-para-perro-o-gato",
    categorySlug: "mascotas",
    order: 84,
  },
  {
    id: "calculadora-presupuesto-boda",
    title: "Calculadora de presupuesto de boda",
    description:
      "Organiza partidas, depósitos y contingencia para estimar el total y costo por invitado de una boda.",
    href: "/eventos/calculadora-presupuesto-boda",
    categorySlug: "eventos",
    order: 85,
  },
  {
    id: "calculadora-costo-por-persona-evento",
    title: "Calculadora de costo por persona en evento",
    description:
      "Calcula costo total, costo por persona, cuota sugerida e invitados posibles para fiestas, cenas y celebraciones.",
    href: "/eventos/calculadora-costo-por-persona-evento",
    categorySlug: "eventos",
    order: 85.5,
  },
  {
    id: "dividir-cuenta-en-restaurante",
    title: "Dividir cuenta en restaurante",
    description:
      "Divide una cuenta entre varias personas, añade propina opcional y ajusta centavos o redondeo.",
    href: "/restaurantes/dividir-cuenta-en-restaurante",
    categorySlug: "restaurantes",
    order: 86,
  },
  {
    id: "calculadora-de-propina",
    title: "Calculadora de propina",
    description:
      "Calcula propina, total final, total cerrado y pago por persona.",
    href: "/restaurantes/calculadora-de-propina",
    categorySlug: "restaurantes",
    order: 88,
  },
  {
    id: "calculadora-de-consumo-de-gasolina",
    title: "Calculadora de consumo de gasolina",
    description:
      "Calcula rendimiento de combustible en km/L, L/100 km y mpg, o estima litros para un trayecto.",
    href: "/vehiculos/calculadora-de-consumo-de-gasolina",
    categorySlug: "vehiculos",
    order: 90,
  },
  {
    id: "calculadora-de-depreciacion-del-vehiculo",
    title: "Calculadora de depreciacion del vehiculo",
    description:
      "Estima valor futuro, perdida acumulada y tasa anual equivalente con depreciacion porcentual, lineal o valor actual.",
    href: "/vehiculos/calculadora-de-depreciacion-del-vehiculo",
    categorySlug: "vehiculos",
    order: 91,
  },
  {
    id: "calculadora-de-gastos-anuales-del-vehiculo",
    title: "Calculadora de gastos anuales del vehiculo",
    description:
      "Estima mantenimiento, propiedad y uso anual del vehiculo con gastos editables, reserva mensual y costo por kilometro.",
    href: "/vehiculos/calculadora-de-gastos-anuales-del-vehiculo",
    categorySlug: "vehiculos",
    order: 91.5,
  },
  {
    id: "calculadora-de-costo-por-kilometro",
    title: "Calculadora de costo por kilómetro",
    description:
      "Estima combustible, costo de un trayecto y costo por kilómetro con gastos adicionales opcionales.",
    href: "/vehiculos/calculadora-de-costo-por-kilometro",
    categorySlug: "vehiculos",
    order: 92,
  },
  {
    id: "calculadora-volumen-concreto-cemento",
    title: "Calculadora de concreto",
    description:
      "Calcula volumen de concreto por secciones, desperdicio, sacos estimados y costo opcional.",
    href: "/construccion/calculadora-volumen-concreto-cemento",
    categorySlug: "construccion",
    order: 93,
  },
  {
    id: "calculadora-cantidad-ladrillos",
    title: "Calculadora de ladrillos",
    description:
      "Estima ladrillos o blocks por area de muros, aberturas, juntas, desperdicio, paquetes y costo opcional.",
    href: "/construccion/calculadora-cantidad-ladrillos",
    categorySlug: "construccion",
    order: 93.5,
  },
  {
    id: "calculadora-piso-azulejo-superficie",
    title: "Calculadora de piso y azulejo",
    description:
      "Calcula cajas de piso, loseta o azulejo segun superficie, pieza, desperdicio, sobrante y costo opcional.",
    href: "/construccion/calculadora-piso-azulejo-superficie",
    categorySlug: "construccion",
    order: 93.75,
  },
  {
    id: "calculadora-presupuesto-remodelacion",
    title: "Calculadora de presupuesto de remodelación",
    description:
      "Organiza partidas, imprevistos e impuestos, calcula costo por m² y compara el total contra tu presupuesto.",
    href: "/construccion/calculadora-presupuesto-remodelacion",
    categorySlug: "construccion",
    order: 93.8,
  },
  {
    id: "metros-cuadrados-de-pintura",
    title: "Metros cuadrados de pintura",
    description:
      "Calcula superficie de paredes o techo y estima litros de pintura segun manos y rendimiento.",
    href: "/construccion/metros-cuadrados-de-pintura",
    categorySlug: "construccion",
    order: 94,
  },
];

const ENGLISH_CALCULATOR_METADATA: Partial<
  Record<string, LocalizedCalculatorMetadata>
> = {
  "calculadora-de-porcentajes": {
    title: "Percentage calculator",
    description:
      "Calculate percentages, discounts, increases and changes between values instantly.",
    slug: "percentage-calculator",
    published: true,
  },
  "calculadora-de-regla-de-tres": {
    title: "Rule of three calculator",
    description:
      "Solve direct and inverse proportions with step-by-step work and verification.",
    slug: "rule-of-three-calculator",
    published: true,
  },
  "calculadora-mcd-mcm": {
    title: "GCD and LCM calculator",
    description:
      "Calculate the greatest common divisor and least common multiple with steps and prime factors.",
    slug: "gcd-lcm-calculator",
    published: true,
  },
  "calculadora-ecuaciones-cuadraticas": {
    title: "Quadratic equation calculator",
    description:
      "Solve quadratic equations with the discriminant, real or complex roots, vertex and steps.",
    slug: "quadratic-equation-calculator",
    published: true,
  },
  "calculadora-sistema-ecuaciones-2x2": {
    title: "2x2 system of equations calculator",
    description:
      "Solve a 2x2 linear system with determinants, Cramer's rule and verification.",
    slug: "linear-system-2x2-calculator",
    published: true,
  },
  "calculadora-de-estadistica-basica": {
    title: "Basic statistics calculator",
    description:
      "Calculate mean, median, mode, range and frequencies for a list of numbers.",
    slug: "basic-statistics-calculator",
    published: true,
  },
  "calculadora-promedio-escolar-gpa": {
    title: "Grade average and GPA calculator",
    description:
      "Calculate simple and weighted averages, approximate GPA and the grade needed for a target.",
    slug: "gpa-calculator",
    published: true,
  },
  "calculadora-nota-minima-para-aprobar": {
    title: "Minimum grade calculator",
    description:
      "Calculate the grade needed on a pending assessment to pass or reach a target.",
    slug: "minimum-grade-calculator",
    published: true,
  },
  "calculadora-calificacion-ponderada": {
    title: "Weighted grade calculator",
    description:
      "Calculate accumulated and projected grades from weighted assessments and a target.",
    slug: "weighted-grade-calculator",
    published: true,
  },
  "calculadora-horas-de-estudio": {
    title: "Study hours calculator",
    description:
      "Calculate daily study hours, sessions and a weekly plan before a deadline.",
    slug: "study-hours-calculator",
    published: true,
  },
  "calculadora-porcentaje-asistencia-escolar": {
    title: "School attendance percentage calculator",
    description:
      "Calculate attendance percentage, available absences and classes needed to meet a minimum.",
    slug: "attendance-percentage-calculator",
    published: true,
  },
  "calculadora-de-area-y-perimetro": {
    title: "Area and perimeter calculator",
    description:
      "Calculate the area and perimeter of squares, rectangles, triangles, circles and regular polygons.",
    slug: "area-perimeter-calculator",
    published: true,
  },
  "calculadora-del-teorema-de-pitagoras": {
    title: "Pythagorean theorem calculator",
    description:
      "Calculate a right triangle's hypotenuse or missing leg with formulas and step-by-step work.",
    slug: "pythagorean-theorem-calculator",
    published: true,
  },
  "edad-de-mascota-en-anos-humanos": {
    title: "Pet age calculator",
    description:
      "Estimate a dog's or cat's equivalent age in human years using a veterinary reference table.",
    slug: "pet-age-calculator",
    published: true,
  },
  "calorias-diarias-para-perro-o-gato": {
    title: "Pet calorie calculator",
    description:
      "Estimate a daily calorie range for adult dogs and cats based on weight, profile and body condition.",
    slug: "pet-calorie-calculator",
    published: true,
  },
  "calculadora-de-interes-compuesto": {
    title: "Compound interest calculator",
    description:
      "Calculate compound growth with periodic contributions, inflation, and a year-by-year projection.",
    slug: "compound-interest-calculator",
    published: true,
  },
  "calculadora-de-inflacion-poder-adquisitivo": {
    title: "Inflation and purchasing power calculator",
    description:
      "Estimate future prices and how much purchasing power money retains over time.",
    slug: "inflation-purchasing-power-calculator",
    published: true,
  },
  "calculadora-de-interes-simple": {
    title: "Simple interest calculator",
    description:
      "Calculate simple interest and total value using daily, monthly, or annual rates.",
    slug: "simple-interest-calculator",
    published: true,
  },
  "calculadora-de-prestamo": {
    title: "Loan calculator",
    description:
      "Estimate monthly loan payments, interest, total cost, and an amortization schedule.",
    slug: "loan-calculator",
    published: true,
  },
  "plan-de-pago-de-deudas": {
    title: "Debt payoff calculator",
    description:
      "Compare snowball and avalanche strategies, estimate interest, and build a monthly debt payoff plan.",
    slug: "debt-payoff-calculator",
    published: true,
  },
  "calculadora-de-ahorro-para-un-objetivo": {
    title: "Savings goal calculator",
    description:
      "Calculate how much to save each month, when a goal can be reached, and how to adjust the plan.",
    slug: "savings-goal-calculator",
    published: true,
  },
  "calculadora-de-roi": {
    title: "ROI calculator",
    description:
      "Calculate return on investment, profit, break-even amount, and progress toward a target ROI.",
    slug: "roi-calculator",
    published: true,
  },
  "calculadora-de-margen-y-markup": {
    title: "Margin and markup calculator",
    description:
      "Calculate profit, margin, markup, break-even price, and a target selling price including fees.",
    slug: "margin-markup-calculator",
    published: true,
  },
  "calculadora-de-punto-de-equilibrio": {
    title: "Break-even calculator",
    description:
      "Calculate the sales needed to cover costs, evaluate a projection, and reach a target profit.",
    slug: "break-even-calculator",
    published: true,
  },
  "calculadora-de-tarifa-por-hora-freelance": {
    title: "Freelance hourly rate calculator",
    description:
      "Calculate a sustainable freelance rate from income goals, expenses, taxes, fees, and billable hours.",
    slug: "freelance-hourly-rate-calculator",
    published: true,
  },
  "calculadora-de-precio-de-proyecto-freelance": {
    title: "Freelance project pricing calculator",
    description:
      "Price a freelance project, compare scenarios, and check whether a fixed quote covers hours, expenses, risk, and margin.",
    slug: "freelance-project-pricing-calculator",
    published: true,
  },
  "calculadora-dca-costo-promedio": {
    title: "DCA average cost calculator",
    description:
      "Calculate average purchase price, effective cost including fees, and the impact of a future purchase.",
    slug: "dca-average-cost-calculator",
    published: true,
  },
  "calculadora-de-iva": {
    title: "VAT, GST and sales tax calculator",
    description:
      "Choose a country before estimating VAT, GST, GST/HST, sales tax or IVA with jurisdiction-specific coverage.",
    slug: "indirect-tax-calculator",
    published: true,
  },
  "calculadora-isr-irpf": {
    title: "Mexico income tax calculator",
    description:
      "Estimate Mexican income tax by pay period or year, view the effective rate and compare withholding.",
    slug: "mexico-income-tax-calculator",
    published: true,
  },
  "calculadora-salario-neto": {
    title: "Mexico net salary calculator",
    description:
      "Estimate net salary in Mexico after income tax, subsidies and entered deductions with a clear breakdown.",
    slug: "mexico-net-salary-calculator",
    published: true,
  },
  "calculadora-vacaciones-proporcionales": {
    title: "Mexico proportional vacation calculator",
    description:
      "Estimate vested vacation days or proportional vacation for a final settlement under Mexico's Federal Labor Law.",
    slug: "mexico-proportional-vacation-calculator",
    published: true,
  },
  "calculadora-aguinaldo-proporcional": {
    title: "Mexico proportional annual bonus calculator",
    description:
      "Estimate the gross proportional annual bonus earned under Mexico's Federal Labor Law.",
    slug: "mexico-proportional-annual-bonus-calculator",
    published: false,
  },
  "calculadora-finiquito-liquidacion": {
    title: "Mexico termination pay calculator",
    description:
      "Estimate gross final pay, proportional benefits and conditional severance scenarios under Mexico's Federal Labor Law.",
    slug: "mexico-termination-pay-calculator",
    published: true,
  },
  "calculadora-de-hipoteca": {
    title: "Mortgage calculator",
    description:
      "Estimate monthly mortgage payments, total interest and a month-by-month amortization schedule.",
    slug: "mortgage-calculator",
    published: true,
  },
  "calculadora-capacidad-compra-vivienda": {
    title: "Home affordability calculator",
    description:
      "Estimate an affordable home price from income, debts, available cash, mortgage rate and term.",
    slug: "home-affordability-calculator",
    published: true,
  },
  "calculadora-renta-vs-compra": {
    title: "Rent vs. buy calculator",
    description:
      "Compare renting and investing with buying using a mortgage, upfront costs, appreciation and editable assumptions.",
    slug: "rent-vs-buy-calculator",
    published: true,
  },
  "calculadora-cap-rate-rentabilidad": {
    title: "Cap rate calculator",
    description:
      "Calculate cap rate, NOI, gross yield, cash flow and cash-on-cash return for a rental property.",
    slug: "cap-rate-calculator",
    published: true,
  },
  "calculadora-gastos-escrituracion": {
    title: "Closing costs calculator",
    description:
      "Estimate editable buyer and seller closing costs, cash required and seller proceeds.",
    slug: "closing-costs-calculator",
    published: true,
  },
  "calculadora-plusvalia-estimada": {
    title: "Property appreciation calculator",
    description:
      "Project a property's future value with compound appreciation and conservative, base and optimistic scenarios.",
    slug: "property-appreciation-calculator",
    published: true,
  },
  "calculadora-precio-por-metro-cuadrado": {
    title: "Price per area calculator",
    description:
      "Calculate base and effective price per area and compare properties with different measurements and costs.",
    slug: "price-per-area-calculator",
    published: true,
  },
  "calculadora-de-edad": {
    title: "Age calculator",
    description:
      "Calculate exact age in years, months and days, days lived and time until the next birthday.",
    slug: "age-calculator",
    published: true,
  },
  "diferencia-entre-fechas": {
    title: "Date difference calculator",
    description:
      "Calculate days, weeks, months, and years between dates, add or subtract time, and count weekdays from Monday to Friday; holidays are not excluded.",
    slug: "date-difference-calculator",
    published: true,
  },
  "calculadora-fecha-limite-countdown": {
    title: "Deadline countdown calculator",
    description:
      "Calculate time remaining until a deadline, follow a live countdown and add the event to your calendar.",
    slug: "deadline-countdown-calculator",
    published: true,
  },
  "calculadora-de-horas-trabajadas": {
    title: "Work hours calculator",
    description:
      "Add shifts, subtract breaks and estimate regular hours, overtime and hourly pay.",
    slug: "work-hours-calculator",
    published: true,
  },
  "calculadora-pomodoro": {
    title: "Pomodoro timer",
    description:
      "Plan Pomodoro focus blocks, short and long breaks, total duration and estimated end time.",
    slug: "pomodoro-timer",
    published: true,
  },
  "calculadora-costo-reunion": {
    title: "Meeting cost calculator",
    description:
      "Estimate meeting cost, person-hours, recurring cost and potential savings.",
    slug: "meeting-cost-calculator",
    published: true,
  },
  "calculadora-tiempo-de-lectura": {
    title: "Reading time calculator",
    description:
      "Estimate reading time from word count and reading speed without sending text to a server.",
    slug: "reading-time-calculator",
    published: true,
  },
  "conversor-de-medidas-culinarias": {
    title: "Cooking measurement converter",
    description:
      "Convert cups, tablespoons, milliliters, grams and other common cooking measurements.",
    slug: "cooking-measurement-converter",
    published: true,
  },
  "conversor-de-temperatura-de-horno": {
    title: "Oven temperature converter",
    description:
      "Convert oven temperatures between Celsius, Fahrenheit and gas mark, with fan-oven guidance.",
    slug: "oven-temperature-converter",
    published: true,
  },
  "calculadora-tiempo-coccion-por-peso": {
    title: "Cooking time by weight calculator",
    description:
      "Estimate cooking time by kilogram or pound, including check, finish and serving times.",
    slug: "cooking-time-by-weight-calculator",
    published: true,
  },
  "escalar-receta-por-porciones": {
    title: "Recipe scaler",
    description:
      "Adjust ingredient quantities for the original and desired number of servings.",
    slug: "recipe-scaler",
    published: true,
  },
  "calculadora-presupuesto-boda": {
    title: "Wedding budget calculator",
    description:
      "Organize wedding expenses, deposits and contingency, then estimate the total and cost per guest.",
    slug: "wedding-budget-calculator",
    published: true,
  },
  "calculadora-costo-por-persona-evento": {
    title: "Event cost per person calculator",
    description:
      "Calculate total event cost, cost per guest, a suggested contribution or how many guests fit the budget.",
    slug: "event-cost-per-person-calculator",
    published: true,
  },
  "calculadora-volumen-concreto-cemento": {
    title: "Concrete volume calculator",
    description:
      "Calculate concrete volume by section, waste allowance, estimated bags and optional cost.",
    slug: "concrete-volume-calculator",
    published: true,
  },
  "calculadora-cantidad-ladrillos": {
    title: "Brick calculator",
    description:
      "Estimate bricks or blocks from wall area, openings, joints, waste allowance, packages and optional cost.",
    slug: "brick-calculator",
    published: true,
  },
  "calculadora-piso-azulejo-superficie": {
    title: "Floor and wall tile calculator",
    description:
      "Calculate tile boxes from area, tile size, waste allowance, surplus and optional cost.",
    slug: "tile-calculator",
    published: true,
  },
  "calculadora-presupuesto-remodelacion": {
    title: "Renovation budget calculator",
    description:
      "Organize line items, contingency and taxes, calculate cost per m² and compare the total with your budget.",
    slug: "renovation-budget-calculator",
    published: true,
  },
  "metros-cuadrados-de-pintura": {
    title: "Paint calculator",
    description:
      "Calculate wall or ceiling area and estimate paint from coats and coverage.",
    slug: "paint-calculator",
    published: true,
  },
  "conversor-de-temperatura": {
    title: "Temperature converter",
    description:
      "Convert temperatures between Celsius, Fahrenheit, Kelvin and other scales.",
    slug: "temperature-converter",
    published: true,
  },
  "kilometros-a-millas": {
    title: "Kilometers to miles converter",
    description:
      "Convert kilometers to statute miles and miles to kilometers with formulas and common equivalents.",
    slug: "kilometers-to-miles",
    published: true,
  },
  "litros-a-galones": {
    title: "Liters to gallons converter",
    description:
      "Convert liters to US and Imperial gallons, or either gallon type to liters.",
    slug: "liters-to-gallons",
    published: true,
  },
  "conversor-de-area-m2-ft2-hectareas-acres": {
    title: "Area converter",
    description:
      "Convert square meters, square feet, hectares and acres, or calculate area from dimensions.",
    slug: "area-converter",
    published: true,
  },
  "conversor-de-volumen": {
    title: "Volume converter",
    description:
      "Convert metric, US and Imperial volume and capacity units.",
    slug: "volume-converter",
    published: true,
  },
  "conversor-de-peso": {
    title: "Weight converter",
    description:
      "Convert kilograms, pounds, grams, ounces and stone with formulas and common equivalents.",
    slug: "weight-converter",
    published: true,
  },
  "conversor-tallas-de-ropa": {
    title: "Clothing size converter",
    description:
      "Compare International, US, EU, UK and MX clothing sizes and measurement ranges.",
    slug: "clothing-size-converter",
    published: true,
  },
  "calculadora-de-imc": {
    title: "BMI calculator",
    description: "Calculate body mass index and view the estimated healthy weight range for your height.",
    slug: "bmi-calculator",
    published: true,
  },
  "calculadora-de-porcentaje-de-grasa-corporal": {
    title: "Body fat percentage calculator",
    description: "Estimate body fat percentage from circumference measurements and review measurement sensitivity.",
    slug: "body-fat-percentage-calculator",
    published: true,
  },
  "calculadora-de-calorias-diarias-tdee": {
    title: "TDEE calculator",
    description: "Estimate basal metabolic rate, total daily energy expenditure, and calorie targets by goal.",
    slug: "tdee-calculator",
    published: true,
  },
  "calculadora-de-macros": {
    title: "Macro calculator",
    description: "Calculate daily protein, carbohydrate, and fat targets from calories, weight, and goal.",
    slug: "macro-calculator",
    published: true,
  },
  "calculadora-de-calorias-quemadas-por-ejercicio": {
    title: "Exercise calories burned calculator",
    description: "Estimate total and active calories burned from weight, duration, activity, and intensity.",
    slug: "exercise-calories-burned-calculator",
    published: true,
  },
  "calculadora-de-proteina-diaria": {
    title: "Daily protein calculator",
    description: "Calculate a daily protein range based on weight, goal, and type of training.",
    slug: "daily-protein-calculator",
    published: true,
  },
  "calculadora-deficit-calorico": {
    title: "Calorie deficit calculator",
    description: "Estimate daily calories, calorie deficit, weekly weight-loss rate, and goal timeline.",
    slug: "calorie-deficit-calculator",
    published: true,
  },
  "fecha-probable-de-parto": {
    title: "Pregnancy due date calculator",
    description: "Estimate due date, gestational age, delivery window, and confidence from LMP, ultrasound, IVF, or an official due date.",
    slug: "pregnancy-due-date-calculator",
    published: true,
  },
  "calculadora-de-ovulacion": {
    title: "Ovulation calculator",
    description: "Estimate the fertile window, probable ovulation, next period, and confidence level from cycle information.",
    slug: "ovulation-calculator",
    published: true,
  },
  "calculadora-de-frecuencia-cardiaca-maxima": {
    title: "Maximum heart rate calculator",
    description: "Estimate maximum heart rate by age and view general ranges for moderate and vigorous activity.",
    slug: "maximum-heart-rate-calculator",
    published: true,
  },
  "calculadora-de-zonas-de-frecuencia-cardiaca": {
    title: "Heart rate zones calculator",
    description: "Calculate five training zones from maximum heart rate percentage or the Karvonen heart rate reserve method.",
    slug: "heart-rate-zones-calculator",
    published: true,
  },
  "calculadora-de-agua-diaria": {
    title: "Daily water intake calculator",
    description: "Estimate a practical hydration range from weight, exercise, sweat level, and heat exposure.",
    slug: "daily-water-intake-calculator",
    published: true,
  },
  "calculadora-1rm-repeticion-maxima": {
    title: "One-rep max calculator",
    description: "Estimate your one-repetition maximum, compare Epley and Brzycki, and calculate practical training loads.",
    slug: "one-rep-max-calculator",
    published: true,
  },
  "calculadora-vo2-max": {
    title: "VO2 max calculator",
    description: "Estimate VO2 max using the Cooper or Rockport test and compare results from the same method.",
    slug: "vo2-max-calculator",
    published: true,
  },
  "calculadora-de-pace-ritmo-de-carrera": {
    title: "Running pace calculator",
    description: "Calculate pace, time, or distance and view equivalent speeds and cumulative race splits.",
    slug: "running-pace-calculator",
    published: true,
  },
  "calculadora-prediccion-tiempo-carrera": {
    title: "Race time predictor",
    description: "Predict race times and paces for other distances from a recent performance and assess prediction quality.",
    slug: "race-time-predictor",
    published: true,
  },
  "calculadora-combinaciones-permutaciones": {
    title: "Combinations and permutations calculator",
    description: "Calculate combinations, arrangements and permutations with or without repetition and view the exact result.",
    slug: "combinations-permutations-calculator",
    published: true,
  },
  "calculadora-distribucion-normal-z-score": {
    title: "Normal distribution and Z-score calculator",
    description: "Calculate Z-scores, percentiles, probabilities and critical values for a normal distribution.",
    slug: "normal-distribution-z-score-calculator",
    published: true,
  },
  "calculadora-probabilidad-basica": {
    title: "Basic probability calculator",
    description: "Calculate simple, union, intersection, complement and conditional probabilities.",
    slug: "basic-probability-calculator",
    published: true,
  },
  "calculadora-entropia-contrasena": {
    title: "Password entropy calculator",
    description: "Estimate entropy, search space, predictable patterns and approximate attack times locally.",
    slug: "password-entropy-calculator",
    published: true,
  },
  "calculadora-velocidad-descarga": {
    title: "Download time calculator",
    description: "Estimate download time or required speed from file size, connection speed and efficiency.",
    slug: "download-time-calculator",
    published: true,
  },
  "conversor-de-bases-numericas": {
    title: "Number base converter",
    description: "Convert exact integers between binary, octal, decimal, hexadecimal and bases 2 through 36.",
    slug: "number-base-converter",
    published: true,
  },
  "paleta-hex-rgb-hsl": {
    title: "HEX, RGB and HSL color converter",
    description: "Convert colors, generate a CSS color scale and check WCAG contrast.",
    slug: "hex-rgb-hsl-color-converter",
    published: true,
  },
  "calculadora-de-consumo-de-gasolina": {
    title: "Fuel consumption calculator",
    description: "Calculate fuel economy in km/L, L/100 km and US mpg or estimate fuel for a trip.",
    slug: "fuel-consumption-calculator",
    published: true,
  },
  "calculadora-de-costo-por-kilometro": {
    title: "Cost per kilometer calculator",
    description: "Estimate fuel, total trip cost, cost per kilometer and cost per passenger.",
    slug: "cost-per-kilometer-calculator",
    published: true,
  },
  "calculadora-de-depreciacion-del-vehiculo": {
    title: "Vehicle depreciation calculator",
    description: "Estimate depreciation, future value, accumulated loss and equivalent annual rate.",
    slug: "vehicle-depreciation-calculator",
    published: true,
  },
  "calculadora-de-gastos-anuales-del-vehiculo": {
    title: "Annual vehicle cost calculator",
    description: "Estimate annual, monthly and per-kilometer vehicle expenses with an editable reserve.",
    slug: "annual-vehicle-cost-calculator",
    published: true,
  },
  "calculadora-de-propina": {
    title: "Tip calculator",
    description: "Calculate a tip, final total, rounded total and payment per person.",
    slug: "tip-calculator",
    published: true,
  },
  "dividir-cuenta-en-restaurante": {
    title: "Restaurant bill splitting calculator",
    description: "Split a bill, add an optional tip and distribute exact or rounded payments.",
    slug: "restaurant-bill-split-calculator",
    published: true,
  },
};

const getCalculatorSlugFromHref = (href: string) =>
  href.split("/").filter(Boolean).at(-1) ?? href;

export const CALCULATOR_DEFINITIONS: CalculatorDefinition[] = CALCULATORS.map(
  (calculator) => ({
    id: calculator.id,
    categoryId: calculator.categorySlug,
    order: calculator.order,
    ...(calculator.draft ? { draft: calculator.draft } : {}),
    locales: {
      es: {
        title: calculator.title,
        description: calculator.description,
        slug: getCalculatorSlugFromHref(calculator.href),
        published: !calculator.draft,
      },
      ...(ENGLISH_CALCULATOR_METADATA[calculator.id]
        ? { en: ENGLISH_CALCULATOR_METADATA[calculator.id] }
        : {}),
    },
  }),
);
