# Especificación v1 - Calculadora de vacaciones proporcionales

## Descripción general

Herramienta para estimar los días de vacaciones generados de forma proporcional
según fechas trabajadas, antigüedad, días disfrutados y reglas locales.

**Arquitectura:** cálculo en cliente con presets locales versionados. No requiere
backend, pero las tablas de días y políticas deben revisarse periódicamente.

---

## Objetivo de producto

- Estimar vacaciones generadas y pendientes.
- Explicar el prorrateo por tiempo trabajado.
- Diferenciar días laborables y días naturales.
- Permitir reglas contractuales superiores mediante edición manual.
- Mostrar vigencia y fuente de la regla seleccionada.

---

## Alcance recomendado

### MVP

- País, jurisdicción y periodo.
- Fecha de ingreso y fecha de corte o salida.
- Días anuales según antigüedad, desde preset o valor manual.
- Días disfrutados.
- Resultado generado, disfrutado y pendiente.

### Fase 2

- Historial por aniversarios laborales.
- Ausencias que no generan vacaciones.
- Pago estimado de vacaciones pendientes.
- Reglas por convenio o contrato.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL pública recomendada | `/legal-impuestos/calculadora-vacaciones-proporcionales` |
| Archivo Astro recomendado | `src/pages/legal-impuestos/calculadora-vacaciones-proporcionales.astro` |
| Lógica de cálculo | `src/lib/calculators/legal-impuestos/calculadora-vacaciones-proporcionales/proportionalVacation.ts` |
| Reglas locales | `src/lib/calculators/legal-impuestos/calculadora-vacaciones-proporcionales/rules/{pais}/{periodo}.ts` |
| Pruebas unitarias | `src/lib/calculators/legal-impuestos/calculadora-vacaciones-proporcionales/proportionalVacation.test.ts` |
| Categoría | `legal-impuestos` |
| Locale inicial | `es-MX` |

---

## Datos locales y vigencia

El preset debe definir tabla de días por antigüedad, base de cómputo, regla de
redondeo y tratamiento de años bisiestos.

```ts
interface VacationRuleSet {
  country: string;
  jurisdiction?: string;
  period: string;
  effectiveFrom: string;
  effectiveTo?: string;
  sourceUrl: string;
  reviewedAt: string;
  status: "current" | "expired" | "draft";
  dayBasis: "calendar" | "working";
  entitlementBySeniority: VacationEntitlement[];
}
```

- Mostrar siempre el derecho anual usado y permitir sustituirlo manualmente.
- No asumir que todos los contratos aplican únicamente el mínimo legal.

### Fuentes iniciales para el preset de México

- [Cámara de Diputados - Ley Federal del Trabajo](https://www.diputados.gob.mx/LeyesBiblio/pdf/LFT.pdf)
- [PROFEDET - Derechos laborales](https://www.profedet.gob.mx/profedet/derechos.html)

---

## Comportamiento mobile-first

- Mostrar días pendientes como resultado principal.
- Desglosar días generados y disfrutados.
- Hacer visible si el cálculo usa días laborables o naturales.
- Colocar fuente, vigencia y aviso legal junto al resultado.

---

## Flujo principal MVP

### Inputs del MVP

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| País / regla | Selector | presets vigentes, manual | preset vigente |
| Fecha de ingreso | Fecha | fecha válida | vacío |
| Fecha de corte o salida | Fecha | `>= ingreso` | hoy |
| Derecho anual | Texto numérico | `>= 0` | desde preset |
| Días disfrutados | Texto numérico | `>= 0` | `0` |
| Base de días | Selector | naturales, laborables | desde preset |

### Outputs principales

- Antigüedad a la fecha de corte.
- Días generados proporcionalmente.
- Días disfrutados.
- Días pendientes estimados.
- Regla y periodo utilizados.

---

## Fórmulas y algoritmo

```text
dias_elegibles = diferencia_fechas(inicio_periodo, fecha_corte)
dias_del_periodo = 365 o 366, según regla
vacaciones_generadas = derecho_anual * dias_elegibles / dias_del_periodo
vacaciones_pendientes = vacaciones_generadas - dias_disfrutados
```

El cálculo debe segmentarse por aniversario cuando cambie el derecho anual por
antigüedad. No redondear valores intermedios; aplicar al final la regla local.

---

## Validaciones y estados

- La fecha de corte no puede preceder a la fecha de ingreso.
- Los días disfrutados no pueden ser negativos.
- Avisar si los días disfrutados superan los generados.
- Mostrar si ausencias, contrato o convenio no están contemplados.
- No presentar los días como resolución vinculante.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de vacaciones proporcionales` |
| Meta description | `Estima vacaciones generadas y pendientes según tiempo trabajado, antigüedad y reglas locales vigentes.` |
| H1 | `Calculadora de vacaciones proporcionales` |
| Keyword principal | `vacaciones proporcionales` |
| Keywords secundarias | `días de vacaciones pendientes`, `vacaciones por antigüedad`, `cálculo vacaciones` |

---

## Pruebas sugeridas

- Un periodo completo produce el derecho anual correspondiente.
- Medio periodo produce aproximadamente la mitad antes del redondeo.
- Segmenta correctamente cuando cambia la antigüedad.
- Considera 366 días cuando la regla aplicable lo requiere.
- Un preset vencido muestra advertencia y modo manual.
