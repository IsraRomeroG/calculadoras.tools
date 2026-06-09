---
title: "Fórmula del IMC en Excel y Google Sheets"
seoTitle: "Cómo calcular el IMC en Excel y Google Sheets"
description: "Aprende fórmulas para calcular el IMC en Excel o Google Sheets con peso en kg, altura en metros o centímetros."
pubDate: 2026-06-12
categorySlug: "salud"
tags:
  - imc
  - excel
  - google sheets
readTime: "5 min"
relatedCalculator:
  label: "Calculadora de IMC"
  href: "/salud/calculadora-de-imc/"
---

Puedes calcular el IMC en Excel o Google Sheets con una fórmula sencilla. Solo necesitas peso y altura, pero debes cuidar si la altura está en metros o centímetros.

La fórmula base del IMC es:

```txt
IMC = peso_kg / altura_m^2
```

## Fórmula del IMC en Excel

Supongamos:

- `A2` contiene el peso en kg.
- `B2` contiene la altura en metros.

La fórmula es:

```txt
=A2/(B2^2)
```

Ejemplo:

```txt
A2 = 75
B2 = 1.72
=A2/(B2^2)
```

Resultado aproximado:

```txt
25.35
```

## Si la altura está en metros

Usa la fórmula directa:

```txt
=A2/(B2^2)
```

Esto funciona si `B2` contiene valores como `1.72`, `1.65` o `1.80`.

## Si la altura está en centímetros

Si `B2` contiene la altura en centímetros, por ejemplo `172`, primero conviértela a metros dentro de la fórmula:

```txt
=A2/((B2/100)^2)
```

Ejemplo:

```txt
A2 = 75
B2 = 172
=A2/((B2/100)^2)
```

Resultado:

```txt
25.35
```

## Clasificar el resultado con SI

Si el IMC está en `C2`, puedes crear una clasificación básica en Excel o Google Sheets:

```txt
=SI(C2<18.5,"Bajo peso",SI(C2<25,"Rango saludable",SI(C2<30,"Sobrepeso","Obesidad")))
```

Esta clasificación es una referencia adulta simplificada. Si quieres subcategorías como obesidad clase 1, 2 y 3, necesitarás una fórmula más larga.

## Errores comunes

1. Usar centímetros como si fueran metros.

```txt
=75/(172^2)
```

Esa fórmula da un resultado incorrecto porque `172` no está en metros.

2. Escribir la altura como `172` pero usar la fórmula para metros.

3. Redondear antes de calcular.

4. Aplicar la tabla adulta a niños o adolescentes.

## Verifica tu resultado con la calculadora

Si quieres revisar que tu hoja está bien, compara el resultado con la [calculadora de IMC](/salud/calculadora-de-imc/).

También puedes revisar la guía de [qué es el IMC y cómo se calcula](/blog/salud/que-es-el-imc-y-como-se-calcula/) y la [tabla de IMC para adultos](/blog/salud/tabla-imc-adultos-rangos-categorias/).

## Preguntas frecuentes

### La fórmula cambia en Google Sheets?

No para este caso. La fórmula básica funciona igual: `=A2/(B2^2)`.

### Cómo calculo IMC si mi altura está en cm?

Usa `=A2/((B2/100)^2)`.

### Puedo clasificar el resultado automáticamente?

Sí, con una fórmula condicional como `SI`, pero recuerda que la clasificación es orientativa.

## Fuentes consultadas

- [Microsoft Support: Overview of formulas in Excel](https://support.microsoft.com/en-us/office/overview-of-formulas-in-excel-ecfdc708-9162-49e8-b993-c311f47ca173)
- [Google Docs Editors Help: Google Sheets function list](https://support.google.com/docs/table/25273)
- [CDC: Adult BMI Categories](https://www.cdc.gov/bmi/adult-calculator/bmi-categories.html)
