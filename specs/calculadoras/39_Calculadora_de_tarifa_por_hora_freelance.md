# Especificación v1 - Calculadora de tarifa por hora freelance

## Descripción general

Herramienta para estimar una tarifa por hora freelance considerando ingreso
deseado, horas facturables, gastos, impuestos manuales, vacaciones y colchón de
ahorro. Debe ayudar a convertir una meta de ingreso en una tarifa sostenible.

**Arquitectura:** todo el cálculo ocurre en el cliente. No requiere backend,
base de datos ni llamadas a APIs externas. Los impuestos se ingresan manualmente.

---

## Objetivo de producto

- Calcular tarifa por hora, día y proyecto base.
- Considerar horas no facturables y semanas no trabajadas.
- Incluir gastos mensuales, impuestos manuales y ahorro.
- Explicar que la tarifa no es salario neto directo.
- Generar una página estática optimizada para SEO en Astro.

---

## Alcance recomendado

### MVP

- Ingreso neto mensual deseado.
- Gastos de negocio mensuales.
- Porcentaje de impuestos manual.
- Horas de trabajo por semana.
- Porcentaje de horas facturables.
- Semanas de vacaciones/no facturables por año.
- Colchón o ahorro mensual opcional.
- Resultado: tarifa por hora, día, semana y mes.
- Copiar resumen y limpiar formulario.

### Fase 2

- Tarifas por nivel: mínimo, recomendado y premium.
- Comparador de tarifas por cliente.
- Historial en `sessionStorage`.
- Exportar escenario a CSV.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL pública recomendada | `/finanzas/calculadora-de-tarifa-por-hora-freelance` |
| Archivo Astro recomendado | `src/pages/finanzas/calculadora-de-tarifa-por-hora-freelance.astro` |
| Lógica de cálculo | `src/lib/calculators/finanzas/calculadora-de-tarifa-por-hora-freelance/freelanceRate.ts` |
| Pruebas unitarias | `src/lib/calculators/finanzas/calculadora-de-tarifa-por-hora-freelance/freelanceRate.test.ts` |
| Categoría inmediata | `finanzas` |
| Categoría futura opcional | `negocios` si se crea en `src/lib/constants/categories.ts` |
| Locale base | `es-MX` |
| Moneda base | `MXN`, símbolo `$` |

---

## Comportamiento mobile-first

- El resultado principal debe ser la tarifa por hora.
- Mostrar tarifas equivalentes por día y proyecto como resultados secundarios.
- Usar sliders o inputs compactos para porcentajes.
- Explicar horas facturables con microcopy breve.
- Evitar pedir demasiados datos en el primer viewport; gastos e impuestos pueden estar en un bloque "ajustes".

---

## Flujo principal MVP

**Ejemplo:** Quiero ganar neto `$40,000` al mes, tengo `$8,000` de gastos,
trabajo `40` horas semanales y solo `60%` son facturables. ¿Cuánto debo cobrar?

### Inputs del MVP

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Ingreso neto mensual deseado | Texto numérico | `> 0` | vacío |
| Gastos mensuales del negocio | Texto numérico | `>= 0` | `0` |
| Ahorro / colchón mensual | Texto numérico | `>= 0` | `0` |
| Impuestos estimados (%) | Texto numérico | `0%-80%` | `0` |
| Horas de trabajo por semana | Texto numérico | `1-80` | `40` |
| Porcentaje facturable (%) | Texto numérico | `1%-100%` | `60` |
| Semanas no trabajadas al año | Texto numérico | `0-20` | `4` |
| Horas por día facturable | Texto numérico | `1-12` | `8` |

### Outputs principales

- Tarifa por hora.
- Tarifa por día.
- Ingreso bruto mensual necesario.
- Horas facturables mensuales.
- Tarifa mínima sin ahorro.
- Resumen de supuestos.

---

## Fórmulas

```text
ingreso_neto_objetivo = ingreso_deseado + gastos + ahorro
tasa_impuestos = impuestos / 100
ingreso_bruto_necesario = ingreso_neto_objetivo / (1 - tasa_impuestos)
semanas_trabajadas_anuales = 52 - semanas_no_trabajadas
horas_facturables_anuales = horas_semana * semanas_trabajadas_anuales * (porcentaje_facturable / 100)
horas_facturables_mensuales = horas_facturables_anuales / 12
tarifa_hora = ingreso_bruto_necesario / horas_facturables_mensuales
tarifa_dia = tarifa_hora * horas_por_dia
```

---

## Validaciones y estados

- Ingreso deseado debe ser mayor que cero.
- Impuestos deben ser menores que `100%`.
- Porcentaje facturable debe ser mayor que cero.
- Si horas facturables mensuales son muy bajas, mostrar advertencia.
- Si la tarifa es menor que un umbral definido por el usuario, no bloquear.
- Redondear tarifa al entero superior opcionalmente para presentación.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de tarifa por hora freelance` |
| Meta description | `Calcula cuánto cobrar por hora como freelance considerando ingreso deseado, gastos, impuestos y horas facturables.` |
| H1 | `Calculadora de tarifa freelance` |
| Keyword principal | `calculadora tarifa freelance` |
| Keywords secundarias | `cuanto cobrar por hora freelance`, `tarifa por hora independiente`, `precio freelance` |

### FAQs sugeridas

- ¿Cómo calculo mi tarifa freelance?
- ¿Qué son horas facturables?
- ¿Debo incluir impuestos?
- ¿Por qué mi tarifa por hora no equivale a mi salario?

---

## Pruebas sugeridas

- Impuestos `0%` calcula bruto igual al neto objetivo.
- Impuestos `25%` divide entre `0.75`.
- Semanas no trabajadas reducen horas facturables.
- Porcentaje facturable `0%` muestra error.
- Gastos y ahorro aumentan tarifa.

