---
title: "CAGR: que es la tasa de crecimiento anual compuesto"
description: "Aprende que es el CAGR, como se calcula y por que no es lo mismo que un promedio anual simple."
pubDate: 2026-05-22
category: "Finanzas"
tags:
  - CAGR
  - rendimiento anual
  - interes compuesto
readTime: "6 min"
seoTitle: "CAGR: formula de la tasa de crecimiento anual compuesto"
relatedCalculator:
  label: "Calculadora de interes compuesto"
  href: "/finanzas/calculadora-de-interes-compuesto"
---

El CAGR, o tasa de crecimiento anual compuesto, sirve para responder una pregunta concreta: si un valor paso de un monto inicial a un monto final durante varios anos, que tasa anual constante habria producido ese mismo resultado?

Es una medida util para comparar inversiones, ventas, usuarios, ingresos o cualquier metrica que crece durante varios periodos. Pero tambien tiene un limite importante: resume el camino en un solo numero y puede ocultar anos malos, anos excelentes y mucha volatilidad.

## Que es el CAGR

CAGR significa `compound annual growth rate`, o tasa de crecimiento anual compuesto. No mide lo que paso exactamente cada ano. Mide la tasa anual constante que conectaria el valor inicial con el valor final si el crecimiento se hubiera compuesto de forma uniforme.

Por ejemplo, si una inversion sube de $100,000 a $300,000 en 10 anos, el CAGR no dice que cada ano gano exactamente lo mismo. Dice que el resultado final equivale a crecer a una tasa anual compuesta constante durante esos 10 anos.

Por eso el CAGR tambien se conoce como rendimiento anual compuesto. Es una forma de suavizar el crecimiento real para compararlo con otros escenarios.

## Formula del CAGR

La CAGR formula es:

```txt
CAGR = (valor final / valor inicial) ^ (1 / anos) - 1
```

Donde:

1. `valor inicial` es el monto al inicio del periodo.
2. `valor final` es el monto al cierre del periodo.
3. `anos` es la duracion total expresada en anos.

El resultado sale en decimal. Para convertirlo a porcentaje, multiplicalo por 100.

La formula necesita un valor inicial positivo. Si el valor inicial es cero o negativo, el CAGR deja de ser una medida adecuada y conviene usar otro tipo de analisis.

## Ejemplo paso a paso

Supongamos que una inversion o negocio empezo con un valor de $100,000, termino en $300,000 y el periodo fue de 10 anos.

```txt
valor inicial = 100000
valor final = 300000
anos = 10

CAGR = (300000 / 100000) ^ (1 / 10) - 1
CAGR = 3 ^ 0.1 - 1
CAGR = 0.1161
```

Convertido a porcentaje:

```txt
0.1161 x 100 = 11.61%
```

El CAGR aproximado es 11.61% anual. Eso significa que crecer $100,000 a una tasa compuesta de 11.61% anual durante 10 anos daria cerca de $300,000.

Puedes comprobarlo con la formula de valor futuro:

```txt
monto final = 100000 x (1 + 0.1161)^10
monto final aproximado = 300000
```

La cifra no significa que el rendimiento real haya sido 11.61% todos los anos. Solo expresa la tasa anual constante equivalente para ese periodo completo.

## CAGR vs promedio anual simple

El CAGR y el promedio anual simple pueden dar respuestas muy distintas.

En el ejemplo anterior, el valor subio de $100,000 a $300,000. El crecimiento total fue de 200% sobre el valor inicial. Si divides ese crecimiento total entre 10 anos, obtienes un promedio simple de 20% anual.

```txt
crecimiento total = (300000 - 100000) / 100000
crecimiento total = 2 = 200%

promedio simple = 200% / 10
promedio simple = 20% anual
```

Pero ese 20% no considera el efecto compuesto. Si $100,000 crecieran 20% compuesto durante 10 anos, el monto final seria mucho mayor:

```txt
100000 x (1 + 0.20)^10 = 619173.64
```

Por eso el promedio simple puede exagerar la lectura cuando lo comparas contra crecimiento compuesto. El CAGR suaviza el camino y responde otra pregunta: que tasa anual compuesta conecta el punto inicial con el punto final?

Tambien hay que tener cuidado con la volatilidad. Dos inversiones pueden tener el mismo CAGR, pero una pudo crecer con pequenas variaciones y otra pudo caer fuerte antes de recuperarse. El CAGR no muestra esa diferencia.

## Cuando usar CAGR

El CAGR es util cuando quieres comparar crecimiento entre periodos de distinta duracion. Si una inversion crecio durante 5 anos y otra durante 8, convertir ambas a una tasa anual compuesta permite compararlas con mas orden.

Tambien se usa en reportes de inversion para resumir rendimiento historico. En lugar de listar cada ano, el CAGR muestra una tasa anual equivalente para todo el periodo analizado.

En negocios, puede servir para medir crecimiento de ventas, ingresos, clientes, utilidad o trafico. Por ejemplo, si las ventas pasaron de $2 millones a $5 millones en 4 anos, el CAGR ayuda a expresar ese cambio como crecimiento anual compuesto.

Y en planeacion, el CAGR puede usarse al reves: si tienes un monto inicial y supones una tasa anual compuesta, puedes estimar un valor futuro. Para hacer ese tipo de simulacion, puedes usar la [calculadora de interes compuesto](/finanzas/calculadora-de-interes-compuesto).

## Limites del CAGR

El CAGR no muestra riesgo. Una tasa alta puede verse atractiva, pero no dice si el camino incluyo caidas fuertes, poca liquidez, deuda, concentracion o condiciones excepcionales. Para inversiones reales, el riesgo importa tanto como el rendimiento. Como referencia general, [Investor.gov explica que toda inversion implica algun grado de riesgo](https://www.investor.gov/introduction-investing/investing-basics/what-risk).

Tampoco muestra variaciones ano a ano. Imagina estos dos caminos:

```txt
camino A: +10%, +11%, +12%, +10%
camino B: +80%, -35%, +25%, +5%
```

Ambos podrian terminar con un CAGR parecido, pero la experiencia del inversionista seria muy distinta. El CAGR resume el resultado, no la estabilidad del trayecto.

Otro limite aparece cuando hubo aportaciones o retiros. Si agregaste dinero durante el periodo, el valor final no viene solo del crecimiento del capital inicial. En ese caso, el CAGR simple puede sobreestimar o subestimar el rendimiento real. Para carteras con flujos de efectivo, conviene usar metricas que consideren aportaciones, retiros y fechas.

Finalmente, el CAGR depende mucho del punto inicial y final. Si eliges un inicio inusualmente bajo o un cierre inusualmente alto, la tasa puede verse mejor de lo que representa la tendencia completa.

## Relacion con interes compuesto

El CAGR esta directamente relacionado con el interes compuesto porque expresa una tasa que se reinvierte ano tras ano en el calculo.

La formula de interes compuesto parte de esta idea:

```txt
monto final = capital inicial x (1 + tasa)^anos
```

Si despejas la tasa, llegas a la formula del CAGR:

```txt
tasa = (monto final / capital inicial) ^ (1 / anos) - 1
```

En otras palabras: el CAGR es una forma de encontrar la tasa de interes compuesto anual que explicaria el cambio entre dos valores.

Si quieres entender la formula base con mas detalle, revisa la guia de [formula de interes compuesto](/blog/formula-interes-compuesto). Y si estas comparando tasas financieras, tambien puede ayudarte la diferencia entre [tasa nominal y tasa efectiva](/blog/tasa-nominal-vs-tasa-efectiva).

Como apoyo conceptual, la formula de CAGR tambien se presenta de forma similar en recursos de finanzas como [Corporate Finance Institute](https://corporatefinanceinstitute.com/resources/valuation/what-is-cagr/) y [Wall Street Prep](https://www.wallstreetprep.com/knowledge/cagr-compound-annual-growth-rate/).

## Preguntas frecuentes

**CAGR es lo mismo que interes compuesto?**

No exactamente. El interes compuesto describe como crece un monto cuando los rendimientos se reinvierten. El CAGR es la tasa anual compuesta que explica el cambio entre un valor inicial y un valor final durante un periodo.

**CAGR considera aportaciones?**

La formula simple de CAGR no considera aportaciones ni retiros intermedios. Si hubo flujos de efectivo durante el periodo, el resultado puede ser enganoso porque el valor final no depende solo del crecimiento del valor inicial.

**Por que CAGR puede ser distinto del promedio anual?**

Porque el CAGR considera el efecto compuesto. El promedio anual simple divide el crecimiento total entre los anos, pero no responde que tasa anual compuesta habria producido el monto final.

**Un CAGR alto significa que una inversion es segura?**

No. Un CAGR alto solo resume crecimiento historico o proyectado entre dos puntos. No muestra riesgo, volatilidad, liquidez, comisiones, impuestos ni probabilidad de que ese crecimiento se repita.
