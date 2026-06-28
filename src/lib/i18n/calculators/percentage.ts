import type { Locale } from "@lib/i18n/config";
import type { PercentageMode } from "@lib/calculators/matematicas/calculadora-de-porcentajes/percentage";

export interface PercentageCalculatorField {
  label: string;
  placeholder?: string;
  hint?: string;
}

export interface PercentageCalculatorFaq {
  question: string;
  answer: string;
  relatedHref?: string;
  relatedLabel?: string;
}

export interface PercentageCalculatorExample {
  title: string;
  description: string;
  href?: string;
}

export interface PercentageCalculatorRelatedGuide {
  title: string;
  description: string;
  href: string;
  published: boolean;
}

export interface PercentageCalculatorContent {
  seo: {
    title: string;
    description: string;
  };
  hero: {
    title: string;
    description: string;
  };
  breadcrumbs: {
    home: string;
    category: string;
    current: string;
  };
  tabs: Record<PercentageMode, string>;
  fields: Record<string, PercentageCalculatorField>;
  client: Record<string, string>;
  faq: PercentageCalculatorFaq[];
  examples: PercentageCalculatorExample[];
  relatedGuides: PercentageCalculatorRelatedGuide[];
  quickReference: Array<{ label: string; value: string }>;
}

export const percentageCalculatorContent = {
  es: {
    seo: {
      title: "Calculadora de porcentajes online - Rapida y gratis",
      description:
        "Calcula porcentajes al instante: descuentos, aumentos, IVA y mas. Sin registro y con resultado en tiempo real.",
    },
    hero: {
      title: "Calculadora de porcentajes",
      description:
        "Calcula porcentajes, descuentos, aumentos y cambios entre valores con resultados claros al instante.",
    },
    breadcrumbs: {
      home: "Inicio",
      category: "Matematicas",
      current: "Calculadora de porcentajes",
    },
    tabs: {
      percentageOfNumber: "% de numero",
      whatPercentIs: "X de Y",
      percentChange: "Cambio %",
      addPercent: "Sumar %",
      subtractPercent: "Restar %",
    },
    fields: {
      "percentageOfNumber.percent": {
        label: "Porcentaje",
        placeholder: "20",
      },
      "percentageOfNumber.base": {
        label: "Numero base",
        placeholder: "350",
      },
      "whatPercentIs.partial": {
        label: "Valor parcial",
        placeholder: "45",
      },
      "whatPercentIs.total": {
        label: "Valor total",
        placeholder: "200",
      },
      "percentChange.original": {
        label: "Valor original",
        placeholder: "80",
      },
      "percentChange.next": {
        label: "Valor nuevo",
        placeholder: "100",
      },
      "addPercent.base": {
        label: "Numero base",
        placeholder: "500",
      },
      "addPercent.percent": {
        label: "Porcentaje a sumar",
        placeholder: "16",
      },
      "subtractPercent.base": {
        label: "Numero base",
        placeholder: "1200",
      },
      "subtractPercent.percent": {
        label: "Porcentaje a restar",
        placeholder: "30",
      },
    },
    client: {
      tablistLabel: "Tipos de calculo de porcentaje",
      calculatorHeading: "Calculadora interactiva de porcentajes",
      "percentageOfNumber.title": "Cuanto es X% de un numero?",
      "percentageOfNumber.hint": "Ejemplo: 20% de 350.",
      "whatPercentIs.title": "Que porcentaje es X de Y?",
      "whatPercentIs.hint": "Ejemplo: 45 de 200.",
      "percentChange.title": "Cambio porcentual entre dos valores",
      "percentChange.hint": "Ejemplo: de 80 a 100.",
      "addPercent.title": "Sumar un porcentaje a un numero",
      "addPercent.hint": "Ejemplo: 500 + 16%.",
      "subtractPercent.title": "Restar un porcentaje a un numero",
      "subtractPercent.hint": "Ejemplo: 1,200 con 30% de descuento.",
      swap: "Intercambiar",
      clear: "Limpiar",
      resultTitle: "Resultado",
      copyResult: "Copiar resultado",
      historyTitle: "Historial",
      historyEmpty: "Los ultimos calculos apareceran aqui.",
      relatedGuidesTitle: "Guias relacionadas",
      relatedGuidesDescription:
        "Profundiza en los casos mas comunes antes o despues de usar la calculadora.",
      relatedGuideCta: "Leer guia",
      exampleLinkLabel: "Leer guia",
      quickReferenceTitle: "Porcentajes comunes",
      quickReferenceDescription:
        "Referencias rapidas para cantidades habituales.",
      faqTitle: "Preguntas frecuentes",
      "error.required": "Este campo es obligatorio.",
      "error.invalid": "Ingresa un numero valido.",
      "error.negative": "Ingresa un numero igual o mayor a cero.",
      "error.too_many_decimals": "Usa maximo 2 decimales.",
      "error.zero_total": "El valor total no puede ser cero.",
      "error.zero_original": "El valor original no puede ser cero.",
      "state.initial.main": "Ingresa los valores",
      "state.initial.explanation": "El calculo aparecera aqui.",
      "state.invalid.main": "Revisa los campos",
      "state.invalid.explanation":
        "Corrige el valor marcado para continuar.",
      "result.percentageOfNumber.main":
        "El {percent} de {base} es {result}",
      "result.percentageOfNumber.explanation":
        "{base} * {rate} = {result}",
      "result.whatPercentIs.main": "{partial} es el {percent} de {total}",
      "result.whatPercentIs.explanation":
        "({partial} / {total}) * 100 = {percent}",
      "result.percentChange.increase": "Aumento {change}",
      "result.percentChange.decrease": "Disminuyo {change}",
      "result.percentChange.none": "No hubo cambio: 0%",
      "result.percentChange.secondary": "Diferencia: {difference}",
      "result.percentChange.explanation":
        "(({next} - {original}) / {original}) * 100 = {change}",
      "result.addPercent.main": "Total con porcentaje: {total}",
      "result.addPercent.secondary": "Incremento: {increment}",
      "result.addPercent.explanation":
        "{base} * {rate} = {increment}; {base} + {increment} = {total}",
      "result.subtractPercent.main": "Precio final: {total}",
      "result.subtractPercent.secondary": "Descuento: {discount}",
      "result.subtractPercent.explanation":
        "{base} * {rate} = {discount}; {base} - {discount} = {total}",
      "copy.copied": "Copiado",
      "copy.status": "Resultado copiado.",
      "copy.error": "No se pudo copiar el resultado.",
    },
    faq: [
      {
        question: "Como se calcula el porcentaje de un numero?",
        answer:
          "Multiplica el numero base por el porcentaje dividido entre 100. Por ejemplo, el 20% de 350 se calcula como 350 x 0.20 = 70.",
        relatedHref: "/blog/matematicas/como-calcular-porcentajes",
        relatedLabel: "Ver la guia para calcular porcentajes",
      },
      {
        question: "Como saber que porcentaje representa una cantidad?",
        answer:
          "Divide la cantidad parcial entre el total y multiplica el resultado por 100. Por ejemplo, 45 de 200 es (45 / 200) x 100 = 22.5%.",
      },
      {
        question: "Como calcular el porcentaje de aumento entre dos valores?",
        answer:
          "Resta el valor original al valor nuevo, divide entre el valor original y multiplica por 100. Si el resultado es negativo, se trata de una disminucion.",
        relatedHref: "/blog/matematicas/aumento-porcentual",
        relatedLabel: "Entender el aumento porcentual",
      },
      {
        question: "Como calcular un descuento?",
        answer:
          "Multiplica el precio base por el porcentaje de descuento dividido entre 100. Despues resta ese descuento al precio base.",
        relatedHref: "/blog/finanzas/porcentaje-de-descuento",
        relatedLabel: "Ver como calcular descuentos",
      },
      {
        question: "Que formula se usa para sacar el porcentaje?",
        answer:
          "La formula general es parte / total x 100. Para obtener un porcentaje de un numero, usa porcentaje / 100 x numero.",
      },
    ],
    examples: [
      {
        title: "Descuentos",
        description:
          "Calcula cuanto pagas despues de aplicar una promocion.",
        href: "/blog/finanzas/porcentaje-de-descuento",
      },
      {
        title: "Aumentos",
        description:
          "Compara un valor inicial y final para saber cuanto crecio.",
        href: "/blog/matematicas/aumento-porcentual",
      },
      {
        title: "IVA",
        description:
          "Suma un porcentaje a una cantidad base para estimar totales.",
      },
      {
        title: "Calificaciones",
        description:
          "Encuentra que porcentaje representa un resultado parcial.",
        href: "/blog/matematicas/como-calcular-porcentajes",
      },
    ],
    relatedGuides: [
      {
        href: "/blog/matematicas/como-calcular-porcentajes",
        title: "Como calcular porcentajes sin complicarte",
        description:
          "Repasa la formula base para calcular porcentajes, partes de un total y variaciones.",
        published: true,
      },
      {
        href: "/blog/finanzas/porcentaje-de-descuento",
        title: "Como calcular un descuento",
        description:
          "Aprende a pasar de porcentaje de descuento a ahorro real y precio final.",
        published: true,
      },
      {
        href: "/blog/matematicas/aumento-porcentual",
        title: "Que es el aumento porcentual",
        description:
          "Compara dos valores y entiende cuanto cambio una cantidad respecto a su punto de partida.",
        published: true,
      },
    ],
    quickReference: [
      { label: "10% de $100", value: "$10" },
      { label: "15% de $500", value: "$75" },
      { label: "20% de $1,200", value: "$240" },
      { label: "25% de $1,200", value: "$300" },
    ],
  },
  en: {
    seo: {
      title: "Percentage calculator - Fast and free",
      description:
        "Calculate percentages instantly: discounts, increases, taxes and value changes. No signup required.",
    },
    hero: {
      title: "Percentage calculator",
      description:
        "Calculate percentages, discounts, increases and changes between values with clear instant results.",
    },
    breadcrumbs: {
      home: "Home",
      category: "Math",
      current: "Percentage calculator",
    },
    tabs: {
      percentageOfNumber: "% of number",
      whatPercentIs: "X of Y",
      percentChange: "% change",
      addPercent: "Add %",
      subtractPercent: "Subtract %",
    },
    fields: {
      "percentageOfNumber.percent": {
        label: "Percentage",
        placeholder: "20",
      },
      "percentageOfNumber.base": {
        label: "Base number",
        placeholder: "350",
      },
      "whatPercentIs.partial": {
        label: "Partial value",
        placeholder: "45",
      },
      "whatPercentIs.total": {
        label: "Total value",
        placeholder: "200",
      },
      "percentChange.original": {
        label: "Original value",
        placeholder: "80",
      },
      "percentChange.next": {
        label: "New value",
        placeholder: "100",
      },
      "addPercent.base": {
        label: "Base number",
        placeholder: "500",
      },
      "addPercent.percent": {
        label: "Percentage to add",
        placeholder: "16",
      },
      "subtractPercent.base": {
        label: "Base number",
        placeholder: "1200",
      },
      "subtractPercent.percent": {
        label: "Percentage to subtract",
        placeholder: "30",
      },
    },
    client: {
      tablistLabel: "Percentage calculation types",
      calculatorHeading: "Interactive percentage calculator",
      "percentageOfNumber.title": "What is X% of a number?",
      "percentageOfNumber.hint": "Example: 20% of 350.",
      "whatPercentIs.title": "What percentage is X of Y?",
      "whatPercentIs.hint": "Example: 45 of 200.",
      "percentChange.title": "Percentage change between two values",
      "percentChange.hint": "Example: from 80 to 100.",
      "addPercent.title": "Add a percentage to a number",
      "addPercent.hint": "Example: 500 + 16%.",
      "subtractPercent.title": "Subtract a percentage from a number",
      "subtractPercent.hint": "Example: 1,200 with a 30% discount.",
      swap: "Swap",
      clear: "Clear",
      resultTitle: "Result",
      copyResult: "Copy result",
      historyTitle: "History",
      historyEmpty: "Your recent calculations will appear here.",
      relatedGuidesTitle: "Related guides",
      relatedGuidesDescription:
        "Explore common percentage cases before or after using the calculator.",
      relatedGuideCta: "Read guide",
      exampleLinkLabel: "Read guide",
      quickReferenceTitle: "Common percentages",
      quickReferenceDescription: "Quick references for common amounts.",
      faqTitle: "Frequently asked questions",
      "error.required": "This field is required.",
      "error.invalid": "Enter a valid number.",
      "error.negative": "Enter a number equal to or greater than zero.",
      "error.too_many_decimals": "Use at most 2 decimal places.",
      "error.zero_total": "The total value cannot be zero.",
      "error.zero_original": "The original value cannot be zero.",
      "state.initial.main": "Enter values",
      "state.initial.explanation": "The calculation will appear here.",
      "state.invalid.main": "Check the fields",
      "state.invalid.explanation":
        "Fix the highlighted value to continue.",
      "result.percentageOfNumber.main":
        "{percent} of {base} is {result}",
      "result.percentageOfNumber.explanation":
        "{base} * {rate} = {result}",
      "result.whatPercentIs.main": "{partial} is {percent} of {total}",
      "result.whatPercentIs.explanation":
        "({partial} / {total}) * 100 = {percent}",
      "result.percentChange.increase": "Increased by {change}",
      "result.percentChange.decrease": "Decreased by {change}",
      "result.percentChange.none": "No change: 0%",
      "result.percentChange.secondary": "Difference: {difference}",
      "result.percentChange.explanation":
        "(({next} - {original}) / {original}) * 100 = {change}",
      "result.addPercent.main": "Total with percentage: {total}",
      "result.addPercent.secondary": "Increase: {increment}",
      "result.addPercent.explanation":
        "{base} * {rate} = {increment}; {base} + {increment} = {total}",
      "result.subtractPercent.main": "Final price: {total}",
      "result.subtractPercent.secondary": "Discount: {discount}",
      "result.subtractPercent.explanation":
        "{base} * {rate} = {discount}; {base} - {discount} = {total}",
      "copy.copied": "Copied",
      "copy.status": "Result copied.",
      "copy.error": "The result could not be copied.",
    },
    faq: [
      {
        question: "How do you calculate a percentage of a number?",
        answer:
          "Multiply the base number by the percentage divided by 100. For example, 20% of 350 is 350 x 0.20 = 70.",
      },
      {
        question: "How do you find what percentage one value is of another?",
        answer:
          "Divide the partial value by the total and multiply by 100. For example, 45 of 200 is (45 / 200) x 100 = 22.5%.",
      },
      {
        question: "How do you calculate percentage increase or decrease?",
        answer:
          "Subtract the original value from the new value, divide by the original value and multiply by 100. A negative result means a decrease.",
      },
      {
        question: "How do you calculate a discount?",
        answer:
          "Multiply the base price by the discount percentage divided by 100, then subtract that discount from the base price.",
      },
      {
        question: "What formula is used for percentages?",
        answer:
          "The general formula is part / total x 100. To get a percentage of a number, use percentage / 100 x number.",
      },
    ],
    examples: [
      {
        title: "Discounts",
        description: "Find what you pay after applying a promotion.",
      },
      {
        title: "Increases",
        description:
          "Compare an initial and final value to see how much it grew.",
        href: "/en/blog/math/percentage-increase",
      },
      {
        title: "Taxes",
        description: "Add a percentage to a base amount to estimate totals.",
      },
      {
        title: "Grades",
        description:
          "Find what percentage a partial result represents.",
        href: "/en/blog/math/what-percentage-is-one-number-of-another",
      },
    ],
    relatedGuides: [
      {
        href: "/en/blog/math/how-to-calculate-percentages",
        title: "How to calculate percentages",
        description:
          "Review the base formulas for percentages, parts of a total and percentage change.",
        published: true,
      },
      {
        href: "/en/blog/math/percentage-increase",
        title: "What is percentage increase?",
        description:
          "Compare original and new values to understand a change relative to its starting point.",
        published: true,
      },
      {
        href: "/en/blog/math/what-percentage-is-one-number-of-another",
        title: "What percentage is one number of another?",
        description:
          "Use part divided by total to find what percentage one value represents.",
        published: true,
      },
    ],
    quickReference: [
      { label: "10% of $100", value: "$10" },
      { label: "15% of $500", value: "$75" },
      { label: "20% of $1,200", value: "$240" },
      { label: "25% of $1,200", value: "$300" },
    ],
  },
} satisfies Record<Locale, PercentageCalculatorContent>;
