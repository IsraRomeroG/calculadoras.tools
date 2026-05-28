---
title: "Interés simple vs interés compuesto"
description: "Conoce la diferencia entre interés simple e interés compuesto con fórmulas, tabla comparativa y ejemplos."
pubDate: 2026-05-16
categorySlug: "finanzas"
tags:
  - interes simple
  - interes compuesto
  - formulas
readTime: "5 min"
seoTitle: "Interés simple vs compuesto: diferencias, fórmulas y ejemplos"
relatedCalculator:
  label: "Calculadora de interés compuesto"
  href: "/finanzas/calculadora-de-interes-compuesto"
---

## Diferencia principal

La diferencia entre interés simple e interés compuesto está en la base del cálculo. El interés simple calcula siempre sobre el capital original. El interés compuesto reinvierte los intereses y calcula sobre un saldo que va creciendo.

En una frase: con interés simple el crecimiento es lineal; con interés compuesto el crecimiento puede acelerarse porque los intereses también generan intereses.

Si quieres partir desde el concepto general antes de comparar, revisa primero [qué es el interés compuesto](/blog/que-es-interes-compuesto).

## Fórmula del interés simple

El interés simple se calcula con esta fórmula:

```txt
I = P x r x t
```

Donde `I` es el interés generado, `P` es el capital inicial, `r` es la tasa por período expresada como decimal y `t` es el tiempo.

Después, para obtener el monto final:

```txt
Monto = P + I
```

Si inviertes $10,000 al 8% anual durante 10 años, el interés simple sería:

```txt
I = 10000 x 0.08 x 10 = 8000
Monto = 10000 + 8000 = 18000
```

El resultado final sería $18,000.

## Fórmula del interés compuesto

El interés compuesto usa una base que cambia con el tiempo. La fórmula general es:

```txt
VF = P x (1 + r / n) ^ (n x t)
```

Donde `VF` es el valor futuro, `P` es el capital inicial, `r` es la tasa anual expresada como decimal, `n` es el número de capitalizaciones por año y `t` es el tiempo en años.

La parte clave es `(1 + r / n) ^ (n x t)`: ahí se refleja que cada período suma intereses al saldo y ese nuevo saldo se usa para el siguiente cálculo.

Para una explicación más detallada de cada variable, consulta la [fórmula del interés compuesto](/blog/formula-interes-compuesto).

## Ejemplo con los mismos datos

Comparemos los dos métodos con el mismo capital, tasa y plazo:

```txt
Capital inicial: $10,000
Tasa anual: 8%
Plazo: 10 años
```

Con interés simple:

```txt
10000 + (10000 x 0.08 x 10) = 18000
```

Monto final: $18,000.

Con interés compuesto anual:

```txt
10000 x (1 + 0.08) ^ 10 = 21589.25
```

Monto final aproximado: $21,589.25.

Con interés compuesto mensual:

```txt
10000 x (1 + 0.08 / 12) ^ 120 = 22196.40
```

Monto final aproximado: $22,196.40.

El capital, la tasa y el plazo son los mismos. Lo que cambia es la forma de capitalizar los intereses. Por eso el interés compuesto termina con un monto mayor.

## Tabla comparativa

| Punto                  | Interés simple                                               | Interés compuesto                                   |
| ---------------------- | ------------------------------------------------------------ | --------------------------------------------------- |
| Base del cálculo       | Capital inicial                                              | Capital más intereses acumulados                    |
| Crecimiento            | Lineal                                                       | Acelerado con el tiempo                             |
| Fórmula base           | `I = P x r x t`                                              | `VF = P x (1 + r/n)^(n x t)`                        |
| Sensible a reinversión | No                                                           | Sí                                                  |
| Efecto del plazo       | Suma el mismo interés cada período                           | Cada período puede aumentar el interés siguiente    |
| Uso común              | Ejercicios escolares, algunos préstamos o rendimientos fijos | Ahorro, inversión, reinversión y deudas revolventes |

## Cuándo usar cada uno

Usa interés simple cuando el cálculo mantiene fija la base: por ejemplo, un ejercicio escolar, una estimación rápida o un producto donde el rendimiento se calcula sobre el capital inicial sin reinvertir intereses.

Usa interés compuesto cuando los intereses se reinvierten o se acumulan sobre el saldo. Es más común al proyectar ahorro, inversión a largo plazo, cuentas que capitalizan rendimientos o deudas donde los intereses no pagados se agregan al saldo.

También conviene distinguir entre interés ganado e interés cobrado. En una inversión, el interés compuesto puede ayudarte si reinviertes. En una deuda, puede trabajar en tu contra si los intereses se acumulan y empiezan a generar más intereses.

## Calcula el escenario compuesto

La forma más clara de entender la diferencia es cambiar el plazo, la tasa y la frecuencia de capitalización. En la [calculadora de interés compuesto](/finanzas/calculadora-de-interes-compuesto) puedes probar el mismo capital con capitalización anual, mensual o con aportaciones periódicas.

Esto ayuda a ver cuándo el crecimiento compuesto empieza a separarse del crecimiento simple y cuánto depende del tiempo.

Si solo buscas una estimación rápida de cuánto tarda en duplicarse una cantidad con interés compuesto, la [regla del 72](/blog/regla-del-72) puede servir como atajo aproximado.

## Preguntas frecuentes

**¿Cuál genera más dinero: interés simple o compuesto?**

Con la misma tasa, capital y plazo, el interés compuesto suele generar más dinero porque reinvierte intereses. La diferencia se vuelve más visible cuando el plazo es largo o cuando la capitalización ocurre con más frecuencia.

**¿El interés compuesto también aplica a deudas?**

Sí. En deudas, el interés compuesto puede aparecer cuando los intereses se acumulan al saldo pendiente. Si no se pagan a tiempo, pueden convertirse en parte de la base sobre la que se calculan nuevos intereses.

**¿Por qué el interés compuesto crece más rápido?**

Porque no solo trabaja el capital inicial. También trabajan los intereses acumulados. Con el tiempo, esa reinversión hace que cada período pueda generar un poco más que el anterior.

**¿Qué significa capitalizar intereses?**

Capitalizar intereses significa sumar los intereses generados al saldo. Desde ese momento, el nuevo saldo queda disponible para generar intereses en los siguientes períodos.
