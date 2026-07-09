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
      "Cuenta días entre fechas, suma o resta tiempo y calcula días hábiles sin fines de semana.",
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
    id: "conversor-de-peso",
    title: "Conversor de peso",
    description:
      "Convierte kilogramos y libras al instante con fórmula y equivalencias útiles.",
    href: "/conversores/conversor-de-peso",
    categorySlug: "conversores",
    order: 70,
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
