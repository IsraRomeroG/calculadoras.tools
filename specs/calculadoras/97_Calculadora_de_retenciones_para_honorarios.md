# Especificación v1 - Calculadora de retenciones para honorarios

## Descripción general

Herramienta para estimar impuestos trasladados, retenciones y monto neto a
recibir en una operación de servicios profesionales u honorarios según país,
régimen, tipo de pagador y periodo fiscal.

**Arquitectura:** cálculo en cliente con datasets locales versionados. No genera
facturas ni requiere backend, pero las tasas y supuestos fiscales deben revisarse
periódicamente.

---

## Objetivo de producto

- Estimar el neto a recibir por honorarios.
- Separar impuestos trasladados y retenidos.
- Explicar por qué una retención puede o no aplicar.
- Permitir tasas manuales y escenarios comparables.
- Mostrar fuente, vigencia y supuestos fiscales utilizados.

---

## Alcance recomendado

### MVP

- País, régimen, periodo y tipo de pagador.
- Subtotal de honorarios.
- Impuestos trasladados y retenciones desde preset o modo manual.
- Desglose de subtotal, impuestos, retenciones y neto.
- Preset únicamente cuando sus condiciones sean verificables.

### Fase 2

- Retención por localidad o actividad.
- Cálculo inverso desde neto deseado.
- Comparador de regímenes.
- Exportación de resumen para conciliación.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL pública recomendada | `/legal-impuestos/calculadora-retenciones-honorarios` |
| Archivo Astro recomendado | `src/pages/legal-impuestos/calculadora-retenciones-honorarios.astro` |
| Lógica de cálculo | `src/lib/calculators/legal-impuestos/calculadora-retenciones-honorarios/withholdings.ts` |
| Reglas locales | `src/lib/calculators/legal-impuestos/calculadora-retenciones-honorarios/rules/{pais}/{regimen}/{periodo}.ts` |
| Pruebas unitarias | `src/lib/calculators/legal-impuestos/calculadora-retenciones-honorarios/withholdings.test.ts` |
| Categoría | `legal-impuestos` |
| Locale inicial | `es-MX` |

---

## Datos locales y vigencia

Cada preset debe especificar las condiciones exactas que activan una tasa:
país, régimen, periodo, tipo de persona o pagador, impuesto y base.

```ts
interface WithholdingRuleSet {
  country: string;
  regime: string;
  period: string;
  effectiveFrom: string;
  effectiveTo?: string;
  sourceUrl: string;
  reviewedAt: string;
  status: "current" | "expired" | "draft";
  transferredTaxes: TaxRule[];
  withholdingRules: ConditionalTaxRule[];
}
```

- No aplicar una retención si faltan datos para verificar su condición.
- Mostrar la condición de cada tasa y permitir desactivarla o editarla.
- Bloquear presets vencidos y ofrecer modo manual.

### Fuentes iniciales para el preset de México

- [SAT - Régimen de servicios profesionales](https://wwwmat.sat.gob.mx/consulta/36192/conoce-el-regimen-de-servicios-profesionales-%28honorarios%29)
- [SAT - Artículo 113-J](https://wwwmatnp.sat.gob.mx/articulo/59511/articulo-113-j)
- [SAT - Artículo 1-A](https://wwwmat.sat.gob.mx/articulo/18243/articulo-1-a)

---

## Comportamiento mobile-first

- Mostrar neto a recibir como resultado principal.
- Separar visualmente impuestos trasladados y retenciones.
- Presentar cada tasa con condición, fuente y vigencia.
- Mantener visible que el resultado no es una factura ni declaración fiscal.

---

## Flujo principal MVP

### Inputs del MVP

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| País / régimen / periodo | Selectores | presets vigentes, manual | preset vigente |
| Tipo de pagador | Selector | según preset, no definido | no definido |
| Subtotal de honorarios | Texto numérico | `>= 0` | vacío |
| Impuesto trasladado (%) | Texto numérico | `>= 0` | desde preset |
| Retención de renta (%) | Texto numérico | `>= 0` | según condición |
| Retención de impuesto indirecto (%) | Texto numérico | `>= 0` | según condición |
| Otros conceptos | Lista editable | importes o tasas `>= 0` | vacío |

### Outputs principales

- Subtotal.
- Impuestos trasladados.
- Retenciones por concepto.
- Total facturado estimado.
- Neto a recibir estimado.
- Tasa total retenida.

---

## Fórmulas y algoritmo

```text
impuestos_trasladados = suma(subtotal * tasa_trasladada)
retenciones = suma(base_de_retencion * tasa_retencion)
total_facturado = subtotal + impuestos_trasladados
neto_a_recibir = total_facturado - retenciones
tasa_total_retenida = subtotal > 0 ? retenciones / subtotal : 0
```

La base de cada retención debe provenir de su regla; no asumir que siempre es el
subtotal. Mantener precisión interna y redondear al final por concepto.

---

## Validaciones y estados

- Subtotal y tasas no pueden ser negativos.
- Las reglas condicionales requieren todos sus datos antes de aplicarse.
- Advertir cuando el usuario modifica una tasa local.
- Mostrar los conceptos no contemplados por el preset.
- Aclarar que actividad, régimen, residencia y tipo de pagador pueden cambiar
  las obligaciones.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de retenciones para honorarios` |
| Meta description | `Estima impuestos, retenciones y monto neto a recibir por honorarios con reglas fiscales locales y tasas editables.` |
| H1 | `Calculadora de retenciones de honorarios` |
| Keyword principal | `retenciones honorarios` |
| Keywords secundarias | `calculadora honorarios`, `neto por honorarios`, `retención ISR honorarios` |

Incluir aviso de que la herramienta no genera comprobantes ni sustituye la
revisión de un profesional fiscal o de la autoridad competente.

---

## Pruebas sugeridas

- Cada fixture oficial produce los conceptos y neto esperados.
- Una condición incompleta no activa retención automáticamente.
- Tasa cero no altera el neto.
- Cambiar una tasa registra y muestra el supuesto manual.
- Preset vencido bloquea tasas automáticas y conserva modo manual.
