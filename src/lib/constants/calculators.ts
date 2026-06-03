import type { CalculatorDirectoryItem } from "@lib/calculator-directory";

export const CALCULATORS: CalculatorDirectoryItem[] = [
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
    id: "calculadora-de-prestamo",
    title: "Calculadora de préstamo",
    description:
      "Calcula cuota mensual, intereses, costo total y tabla de amortización.",
    href: "/finanzas/calculadora-de-prestamo",
    categorySlug: "finanzas",
    order: 35,
  },
  {
    id: "calculadora-de-hipoteca",
    title: "Calculadora de hipoteca",
    description:
      "Estima cuota mensual, intereses y tabla de amortización de una hipoteca.",
    href: "/inmuebles/calculadora-de-hipoteca",
    categorySlug: "inmuebles",
    order: 37,
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
    id: "conversor-de-peso",
    title: "Conversor de peso",
    description:
      "Convierte kilogramos y libras al instante con fórmula y equivalencias útiles.",
    href: "/conversores/conversor-de-peso",
    categorySlug: "conversores",
    order: 70,
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
    id: "conversor-de-medidas-culinarias",
    title: "Conversor de medidas culinarias",
    description:
      "Convierte tazas, cucharadas, mililitros, gramos y otras medidas comunes de cocina.",
    href: "/cocina/conversor-de-medidas-culinarias",
    categorySlug: "cocina",
    order: 78,
  },
];
