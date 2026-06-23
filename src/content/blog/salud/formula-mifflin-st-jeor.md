---
title: "Fórmula Mifflin-St Jeor: cómo calcula la TMB"
seoTitle: "Fórmula Mifflin-St Jeor para TMB: ecuaciones y ejemplo"
description: "Conoce la fórmula Mifflin-St Jeor para estimar la tasa metabólica basal y cómo se usa después para calcular TDEE."
pubDate: 2027-07-08
categorySlug: "salud"
tags:
  - mifflin st jeor
  - tmb
  - tdee
readTime: "7 min"
relatedCalculator:
  label: "Calculadora de calorías diarias (TDEE)"
  href: "/salud/calculadora-de-calorias-diarias-tdee"
---

La fórmula Mifflin-St Jeor estima el gasto energético en reposo de una persona adulta usando peso, estatura, edad y sexo. En muchas calculadoras ese resultado se presenta como TMB y después se multiplica por un factor de actividad para obtener el TDEE.

La ecuación no calcula directamente tus calorías de mantenimiento. Primero obtiene la base en reposo; la actividad se añade en un segundo paso.

## Qué es la fórmula Mifflin-St Jeor

Mifflin y colaboradores publicaron la ecuación en 1990 a partir de mediciones de gasto energético en reposo. Su objetivo era predecir ese gasto mediante datos fáciles de obtener.

Aunque se hable habitualmente de “TMB”, el estudio original se refiere al gasto energético en reposo. La medición basal estricta y la medición en reposo no son idénticas en laboratorio, pero en calculadoras generales ambos términos suelen simplificarse como metabolismo basal estimado.

Lo importante es no confundir el resultado con el gasto de todo el día.

## Fórmula para hombres

```txt
TMB hombre = 10 x peso_kg + 6.25 x altura_cm - 5 x edad + 5
```

Las unidades deben ser:

- Peso en kilogramos.
- Altura en centímetros.
- Edad en años.

## Fórmula para mujeres

```txt
TMB mujer = 10 x peso_kg + 6.25 x altura_cm - 5 x edad - 161
```

La estructura es la misma. Cambia la constante final que utiliza la ecuación.

La variable “sexo” forma parte del modelo estadístico original. La fórmula no describe identidad de género ni composición corporal individual, y puede necesitar interpretación adicional en personas en tratamiento hormonal o con contextos clínicos específicos.

## Ejemplo paso a paso

Calculemos el resultado para una mujer de 28 años, 65 kg y 165 cm:

```txt
TMB = 10 x 65 + 6.25 x 165 - 5 x 28 - 161
```

Resolvemos cada término:

```txt
10 x 65 = 650
6.25 x 165 = 1,031.25
5 x 28 = 140
```

Sustituimos:

```txt
TMB = 650 + 1,031.25 - 140 - 161
TMB = 1,380.25 kcal/día
```

La fórmula estima unas `1,380 kcal/día` en reposo. Ese número todavía no incluye una aproximación de su vida activa.

## Cómo pasar de TMB a TDEE

Para estimar el gasto total diario:

```txt
TDEE = TMB x factor de actividad
```

Si la persona del ejemplo tiene actividad moderada y se utiliza un factor de `1.55`:

```txt
TDEE = 1,380.25 x 1.55
TDEE = 2,139.39 kcal/día
```

Redondeado:

```txt
TDEE ≈ 2,139 kcal/día
```

Ahora sí tenemos una primera estimación de mantenimiento. La diferencia entre ambos números se explica en [TMB vs TDEE](/blog/salud/tmb-vs-tdee-diferencias).

El factor `1.55` no es correcto para cualquiera que entrene. Debe representar entrenamiento y movimiento cotidiano. Consulta cómo [elegir tu nivel de actividad](/blog/salud/como-elegir-nivel-de-actividad-tdee) antes de usarlo.

## Limitaciones de la fórmula

Mifflin-St Jeor es una ecuación de predicción. Puede diferir del gasto real porque no incorpora directamente:

- Porcentaje de grasa o masa libre de grasa.
- Diferencias metabólicas individuales.
- Condiciones médicas.
- Medicamentos.
- Embarazo o lactancia.
- Crecimiento en menores de edad.
- Cambios recientes de peso.

También puede ser menos representativa en personas con una composición corporal muy distinta del promedio, como algunos atletas o personas con pérdida marcada de masa muscular.

### Mifflin-St Jeor frente a otras fórmulas

Harris-Benedict es otra ecuación conocida. Katch-McArdle utiliza masa magra estimada y requiere un porcentaje de grasa que también puede contener error.

No existe una ecuación universalmente exacta para cada individuo. Cambiar de fórmula puede mover el resultado, pero no elimina la incertidumbre del factor de actividad. Para uso práctico conviene emplear una fórmula coherente, observar 2 a 3 semanas y ajustar.

## Cómo hacer el cálculo manual sin errores

- Convierte libras a kilogramos antes de aplicar la ecuación.
- Usa centímetros, no metros.
- Respeta el orden de las operaciones.
- Aplica la constante correcta.
- No multipliques por actividad hasta terminar la TMB.
- Redondea al final, no en cada paso.

Un error habitual es introducir `1.65` como altura en una fórmula que espera `165`. Eso reduce el resultado de manera drástica.

## Calcula tu resultado automáticamente

La [calculadora de calorías diarias (TDEE)](/salud/calculadora-de-calorias-diarias-tdee) aplica Mifflin-St Jeor, muestra la TMB estimada y calcula el TDEE según tu actividad.

Usa el resultado como punto de partida. La precisión práctica mejora al compararlo con tu evolución, no al añadir más decimales.

Para una explicación menos técnica del resultado final, consulta [qué es TDEE](/blog/salud/que-es-tdee-calorias-diarias).

## Preguntas frecuentes

### ¿La fórmula Mifflin-St Jeor calcula TMB o TDEE?

Calcula gasto energético en reposo, presentado habitualmente como TMB. Para obtener TDEE se multiplica después por un factor de actividad.

### ¿Es mejor que Harris-Benedict?

Puede ofrecer una estimación útil en adultos, pero ninguna fórmula es superior para todas las personas y contextos. La evolución real sigue siendo necesaria para ajustar.

### ¿Sirve para deportistas?

Puede utilizarse como referencia inicial, aunque una composición corporal atípica y un gasto de entrenamiento elevado pueden aumentar el margen de error.

### ¿Sirve si conozco mi porcentaje de grasa?

Mifflin-St Jeor no utiliza ese dato. Existen fórmulas basadas en masa magra, pero su precisión depende también de que el porcentaje de grasa esté bien medido.

## Fuentes consultadas

- [Mifflin-St Jeor: A new predictive equation for resting energy expenditure in healthy individuals](https://pubmed.ncbi.nlm.nih.gov/2305711/)
- [National Academies: Dietary Reference Intakes for Energy](https://www.nationalacademies.org/read/26818/chapter/2)
- [NCBI Bookshelf: Factors Affecting Energy Expenditure](https://www.ncbi.nlm.nih.gov/books/NBK591031/)
