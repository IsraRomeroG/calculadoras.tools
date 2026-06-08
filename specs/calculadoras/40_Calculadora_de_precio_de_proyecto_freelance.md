# Especificación v1 - Calculadora de precio de proyecto freelance

## Descripción general

Herramienta para estimar el precio de un proyecto freelance a partir de horas,
tarifa, fases, gastos, margen de contingencia, impuestos manuales y pagos por
hito. Debe ayudar a convertir una estimación de trabajo en una cotización clara.

**Arquitectura:** todo el cálculo ocurre en el cliente. No requiere backend,
base de datos ni llamadas a APIs externas. Los impuestos se ingresan manualmente.

---

## Objetivo de producto

- Calcular precio total de proyecto con horas y tarifa.
- Incluir fases, gastos, contingencia e impuestos.
- Mostrar precio por hitos o pagos parciales.
- Calcular tarifa efectiva si el usuario ajusta un precio fijo.
- Generar una página estática optimizada para SEO en Astro.

---

## Alcance recomendado

### MVP

- Lista de fases con nombre, horas estimadas y tarifa opcional.
- Tarifa por hora base.
- Gastos directos del proyecto.
- Contingencia (%).
- Impuestos estimados manuales (%).
- Margen o utilidad adicional opcional.
- Plan de pagos: anticipo, entrega intermedia y cierre.
- Resultado: precio antes de impuestos, impuestos, total y tarifa efectiva.
- Copiar resumen, limpiar formulario y exportar CSV.

### Fase 2

- Plantillas de proyecto: diseño, desarrollo, consultoría, contenido.
- Comparador de tres escenarios.
- Generador de resumen para propuesta.
- Historial en `sessionStorage`.
- Vista imprimible.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL pública recomendada | `/finanzas/calculadora-de-precio-de-proyecto-freelance` |
| Archivo Astro recomendado | `src/pages/finanzas/calculadora-de-precio-de-proyecto-freelance.astro` |
| Lógica de cálculo | `src/lib/calculators/finanzas/calculadora-de-precio-de-proyecto-freelance/freelanceProjectPrice.ts` |
| Pruebas unitarias | `src/lib/calculators/finanzas/calculadora-de-precio-de-proyecto-freelance/freelanceProjectPrice.test.ts` |
| Categoría inmediata | `finanzas` |
| Categoría futura opcional | `negocios` si se crea en `src/lib/constants/categories.ts` |
| Locale base | `es-MX` |
| Moneda base | `MXN`, símbolo `$` |

---

## Comportamiento mobile-first

- En móvil, cada fase debe editarse como bloque compacto.
- El resultado total debe estar visible antes del desglose completo.
- Las acciones de agregar fase y duplicar fase deben ser táctiles y claras.
- El plan de pagos puede mostrarse como tarjetas pequeñas.
- La tabla de desglose debe usar `overflow-x-auto`.

---

## Flujo principal MVP

**Ejemplo:** Un proyecto requiere `60` horas a `$600` por hora, `$3,000` de
gastos, `15%` de contingencia e impuestos estimados de `16%`. ¿Cuánto cotizar?

### Inputs del MVP

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Tarifa por hora base | Texto numérico | `> 0` | vacío |
| Nombre de fase | Texto | 1-50 caracteres | `Fase 1` |
| Horas estimadas de fase | Texto numérico | `> 0` | vacío |
| Tarifa específica de fase | Texto numérico opcional | `> 0` | vacío |
| Gastos directos | Texto numérico | `>= 0` | `0` |
| Contingencia (%) | Texto numérico | `0%-100%` | `10` |
| Margen adicional (%) | Texto numérico | `0%-100%` | `0` |
| Impuestos estimados (%) | Texto numérico | `0%-80%` | `0` |
| Anticipo (%) | Texto numérico | `0%-100%` | `50` |
| Pago intermedio (%) | Texto numérico | `0%-100%` | `25` |
| Pago final (%) | Texto numérico | `0%-100%` | `25` |

### Outputs principales

- Horas totales.
- Costo base por horas.
- Gastos.
- Contingencia.
- Margen adicional.
- Subtotal antes de impuestos.
- Impuestos estimados.
- Total a cotizar.
- Tarifa efectiva por hora.
- Plan de pagos por hito.

---

## Fórmulas

```text
costo_fase = horas_fase * (tarifa_fase || tarifa_base)
costo_horas = suma(costo_fase)
base_proyecto = costo_horas + gastos
contingencia_monto = base_proyecto * (contingencia / 100)
margen_monto = (base_proyecto + contingencia_monto) * (margen_adicional / 100)
subtotal = base_proyecto + contingencia_monto + margen_monto
impuestos_monto = subtotal * (impuestos / 100)
total = subtotal + impuestos_monto
tarifa_efectiva = subtotal / horas_totales
```

Plan de pagos:

```text
pago_anticipo = total * (anticipo / 100)
pago_intermedio = total * (pago_intermedio_porcentaje / 100)
pago_final = total * (pago_final_porcentaje / 100)
```

---

## Validaciones y estados

- Debe existir al menos una fase válida.
- Horas y tarifa base deben ser mayores que cero.
- Impuestos deben ser menores que `100%`.
- Los porcentajes de anticipo, intermedio y final deben sumar `100%`.
- Si una tarifa específica está vacía, usar tarifa base.
- Contingencia `0%` es válida.
- Mostrar advertencia si contingencia es menor a `5%`.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de precio de proyecto freelance` |
| Meta description | `Calcula cuánto cobrar por un proyecto freelance con horas, tarifa, gastos, contingencia, impuestos y pagos por hito.` |
| H1 | `Calculadora de precio de proyecto freelance` |
| Keyword principal | `calculadora precio proyecto freelance` |
| Keywords secundarias | `cuanto cobrar por proyecto`, `cotizacion freelance`, `precio proyecto por horas` |

### FAQs sugeridas

- ¿Cómo calculo el precio de un proyecto freelance?
- ¿Qué porcentaje de contingencia conviene usar?
- ¿Debo cobrar anticipo?
- ¿Cuál es la diferencia entre tarifa por hora y precio fijo?

---

## Pruebas sugeridas

- Una fase de `60` horas a `$600` produce costo base `$36,000`.
- Contingencia `10%` aumenta subtotal correctamente.
- Impuestos `16%` se aplican al subtotal.
- Plan de pagos que no suma `100%` muestra error.
- Tarifa específica de fase reemplaza la tarifa base.
- Exportación CSV incluye fases y resumen.

