---
title: "Fórmula del interés compuesto paso a paso"
description: "Conoce la fórmula del interés compuesto, qué significa cada variable y cómo aplicarla con ejemplos claros."
pubDate: 2026-05-22
category: "Finanzas"
tags:
  - interés compuesto
  - fórmulas
  - matemáticas financieras
readTime: "6 min"
seoTitle: "Fórmula del interés compuesto: cómo calcularlo con ejemplos"
relatedCalculator:
  label: "Calculadora de interés compuesto"
  href: "/finanzas/calculadora-de-interes-compuesto"
---

## Fórmula del interés compuesto

La fórmula del interés compuesto sirve para calcular cuánto puede valer un capital después de reinvertir los intereses durante cierto tiempo. En su forma más común se escribe así:

```txt
VF = P x (1 + r / n) ^ (n x t)
```

Donde:

| Variable | Significado |
|---|---|
| `VF` | Valor futuro o monto final. |
| `P` | Capital inicial. |
| `r` | Tasa anual en decimal. |
| `n` | Número de capitalizaciones por año. |
| `t` | Plazo en años. |

La parte clave es `(1 + r / n) ^ (n x t)`: ahí se acumula el crecimiento de cada período. Si la capitalización es mensual, por ejemplo, la tasa anual se divide entre 12 y el número de períodos también se multiplica por 12.

Si primero quieres repasar el concepto general, puedes leer la guía sobre [qué es el interés compuesto](/blog/que-es-interes-compuesto).

## Cómo convertir la tasa a decimal

Antes de usar la fórmula, convierte el porcentaje a decimal dividiéndolo entre 100.

```txt
8% = 8 / 100 = 0.08
12.5% = 12.5 / 100 = 0.125
```

Este paso evita uno de los errores más comunes: escribir `8` en la fórmula cuando debería usarse `0.08`. También conviene revisar si la tasa que tienes es anual, mensual o de otro período. La fórmula anterior asume una tasa anual.

Si ya tienes una tasa mensual, no la mezcles directamente con `t` en años. Primero decide si vas a trabajar todo en meses o si vas a convertir la tasa para mantener unidades consistentes.

## Ejemplo con capitalización anual

Supón que inviertes $10,000 a una tasa anual de 8% durante 5 años, con capitalización anual. Los datos son:

```txt
P = 10000
r = 0.08
n = 1
t = 5
```

Sustituyendo en la fórmula:

```txt
VF = 10000 x (1 + 0.08 / 1) ^ (1 x 5)
VF = 10000 x 1.08 ^ 5
VF = 14693.28
```

El monto final sería aproximadamente $14,693.28. De ese total, $10,000 corresponden al capital inicial y $4,693.28 a intereses generados.

## Ejemplo con capitalización mensual

Ahora usa los mismos datos, pero con capitalización mensual. En este caso, `n = 12` porque hay 12 capitalizaciones por año.

```txt
P = 10000
r = 0.08
n = 12
t = 5
```

La fórmula queda así:

```txt
VF = 10000 x (1 + 0.08 / 12) ^ (12 x 5)
VF = 14898.46
```

El monto final sería aproximadamente $14,898.46. La diferencia frente a la capitalización anual es de $205.18:

| Capitalización | Monto final |
|---|---:|
| Anual | $14,693.28 |
| Mensual | $14,898.46 |

La capitalización mensual genera un poco más porque los intereses se incorporan al capital con mayor frecuencia. Eso no convierte el resultado en una garantía de inversión: la fórmula solo modela un escenario con tasa constante.

## Fórmula con aportaciones periódicas

Cuando además del capital inicial haces aportaciones periódicas, el cálculo cambia. Si la aportación coincide con cada período de capitalización y ocurre al final del período, una fórmula de referencia es:

```txt
VF = P x (1 + i) ^ m + A x (((1 + i) ^ m - 1) / i)
```

Donde:

| Variable | Significado |
|---|---|
| `i` | Tasa por período, calculada como `r / n`. |
| `m` | Número total de períodos, calculado como `n x t`. |
| `A` | Aportación periódica. |

Si la aportación ocurre al inicio de cada período, el segundo bloque se multiplica por `(1 + i)`:

```txt
VF = P x (1 + i) ^ m + A x (((1 + i) ^ m - 1) / i) x (1 + i)
```

Y si la tasa es 0%, no conviene usar la división entre `i`. En ese caso el monto final es simplemente:

```txt
VF = capital inicial + aportaciones totales
```

Para escenarios con aportaciones mensuales, aportaciones anuales, inflación o diferentes frecuencias, es más cómodo usar la [calculadora de interés compuesto](/finanzas/calculadora-de-interes-compuesto). Así evitas mezclar períodos y redondeos manuales. Si quieres ver ese caso con más detalle, revisa la guía de [interés compuesto con aportaciones mensuales](/blog/interes-compuesto-aportaciones-mensuales).

## Errores comunes al aplicar la fórmula

No convertir la tasa a decimal cambia por completo el resultado. Si la tasa anual es 8%, en la fórmula se usa `0.08`, no `8`.

Otro error frecuente es mezclar meses con años. Si el plazo es de 18 meses, puedes expresarlo como `1.5` años o trabajar todo por períodos mensuales, pero las unidades deben coincidir.

También es fácil olvidar la frecuencia de capitalización. No es lo mismo capitalización anual que mensual, trimestral o diaria, aunque la tasa anual sea la misma.

Si estás comparando tasas con distintas formas de capitalización, conviene distinguir entre [tasa nominal y tasa efectiva](/blog/tasa-nominal-vs-tasa-efectiva) antes de sustituir datos en la fórmula.

Por último, evita redondear en cada paso intermedio. Redondea solo al mostrar el resultado final; de lo contrario, los decimales pequeños se acumulan y pueden mover el monto final.

## Usa la calculadora para escenarios completos

La fórmula base es ideal para entender el mecanismo del interés compuesto y validar cálculos simples. Para un escenario realista, normalmente también quieres probar aportaciones periódicas, frecuencia de capitalización, plazo e inflación.

Puedes hacerlo con la [calculadora de interés compuesto](/finanzas/calculadora-de-interes-compuesto). La herramienta muestra monto final, intereses generados, total aportado y una tabla de crecimiento para comparar escenarios sin hacer cada operación a mano.

## Preguntas frecuentes

**¿Qué significa `n` en la fórmula?**  
`n` es el número de veces que los intereses se capitalizan en un año. Si la capitalización es anual, `n = 1`; si es mensual, `n = 12`; si es trimestral, `n = 4`.

**¿Qué pasa si la tasa es 0%?**  
El dinero no genera intereses. Sin aportaciones, el valor futuro será igual al capital inicial. Con aportaciones, el monto final será el capital inicial más las aportaciones acumuladas.

**¿La fórmula funciona con aportaciones mensuales?**  
La fórmula base no incluye aportaciones. Para aportaciones periódicas se usa una fórmula adicional o un cálculo por períodos, sobre todo si la frecuencia de aportación no coincide con la capitalización.

**¿Debo usar tasa anual o mensual?**  
Usa la tasa que corresponda a las unidades de tu cálculo. La fórmula principal usa tasa anual y la ajusta con `n`. Si tienes una tasa mensual, asegúrate de convertir el plazo y los períodos de forma consistente.
