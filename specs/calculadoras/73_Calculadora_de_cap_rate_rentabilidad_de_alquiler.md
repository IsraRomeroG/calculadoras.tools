# Especificación v1 - Calculadora de cap rate / rentabilidad de alquiler

## Descripción general

Herramienta para estimar la rentabilidad operativa de una propiedad en alquiler
mediante cap rate, rendimiento bruto y flujo de caja. Los datos se ingresan
manualmente y el resultado no sustituye un análisis inmobiliario profesional.

**Arquitectura:** todo el cálculo ocurre en el cliente. No requiere backend,
base de datos ni llamadas a APIs externas.

---

## Objetivo de producto

- Calcular cap rate con ingreso operativo neto.
- Calcular rendimiento bruto del alquiler.
- Estimar flujo de caja mensual y anual.
- Incluir vacancia, mantenimiento y gastos operativos editables.
- Generar una página estática optimizada para SEO en Astro.

---

## Alcance recomendado

### MVP

- Precio de compra o valor actual.
- Renta mensual.
- Vacancia estimada.
- Gastos operativos anuales.
- Financiamiento opcional para flujo de caja.
- Resultado: cap rate, rendimiento bruto, NOI y flujo.
- Copiar resumen, limpiar formulario y exportar CSV.

### Fase 2

- Cash-on-cash return.
- Comparador de propiedades.
- Plusvalía y retorno total.
- Historial en `sessionStorage`.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL pública recomendada | `/inmuebles/calculadora-cap-rate-rentabilidad` |
| Archivo Astro recomendado | `src/pages/inmuebles/calculadora-cap-rate-rentabilidad.astro` |
| Lógica de cálculo | `src/lib/calculators/inmuebles/calculadora-cap-rate-rentabilidad/capRate.ts` |
| Pruebas unitarias | `src/lib/calculators/inmuebles/calculadora-cap-rate-rentabilidad/capRate.test.ts` |
| Categoría | `inmuebles` |
| Locale base | `es-MX` |
| Moneda base | `MXN`, símbolo `$` |

---

## Comportamiento mobile-first

- Resultado principal como cap rate.
- Mostrar NOI y flujo de caja como resultados secundarios.
- Agrupar gastos en bloque editable.
- No etiquetar automáticamente un cap rate como bueno o malo.
- Tabla de desglose anual en sección secundaria.

---

## Flujo principal MVP

**Ejemplo:** Propiedad de `$2,500,000`, renta mensual `$18,000`, vacancia `5%`
y gastos operativos anuales de `$35,000`. ¿Cuál es su cap rate?

### Inputs del MVP

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Precio de compra / valor actual | Texto numérico | `> 0` | vacío |
| Renta mensual bruta | Texto numérico | `>= 0` | vacío |
| Otros ingresos mensuales | Texto numérico | `>= 0` | `0` |
| Vacancia (%) | Texto numérico | `0%-100%` | `5` |
| Gastos operativos anuales | Texto numérico | `>= 0` | `0` |
| Pago anual de deuda | Texto numérico opcional | `>= 0` | `0` |

### Outputs principales

- Ingreso bruto anual.
- Ingreso efectivo tras vacancia.
- NOI / ingreso operativo neto.
- Cap rate.
- Rendimiento bruto.
- Flujo de caja después de deuda.

---

## Fórmulas

```text
ingreso_bruto_anual = (renta_mensual + otros_ingresos_mensuales) * 12
perdida_vacancia = ingreso_bruto_anual * (vacancia / 100)
ingreso_efectivo = ingreso_bruto_anual - perdida_vacancia
noi = ingreso_efectivo - gastos_operativos_anuales
cap_rate = (noi / valor_propiedad) * 100
rendimiento_bruto = (ingreso_bruto_anual / valor_propiedad) * 100
flujo_caja = noi - pago_anual_deuda
```

La deuda no se resta al calcular cap rate.

---

## Validaciones y estados

- Valor de propiedad debe ser mayor que cero.
- Vacancia debe estar entre 0% y 100%.
- Permitir NOI y flujo negativos.
- Gastos no pueden ser negativos.
- Mostrar advertencia si gastos operativos están en cero.
- Redondear porcentajes a 2 decimales.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de cap rate y rentabilidad de alquiler` |
| Meta description | `Calcula cap rate, rendimiento bruto, NOI y flujo de caja de una propiedad en alquiler con gastos y vacancia editables.` |
| H1 | `Calculadora de cap rate` |
| Keyword principal | `calculadora cap rate` |
| Keywords secundarias | `rentabilidad alquiler`, `ingreso operativo neto`, `rendimiento inmueble` |

### FAQs sugeridas

- ¿Qué es el cap rate?
- ¿El cap rate incluye hipoteca?
- ¿Qué gastos se incluyen en NOI?
- ¿Qué diferencia hay entre cap rate y rendimiento bruto?

---

## Pruebas sugeridas

- Cálculo típico produce NOI correcto.
- Vacancia 100% elimina ingreso efectivo.
- Pago de deuda afecta flujo, no cap rate.
- NOI negativo se muestra correctamente.
- Valor cero muestra error.

