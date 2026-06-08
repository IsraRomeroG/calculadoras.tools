# Especificación v1 - Calculadora de ISR / IRPF básico

## Descripción general

Herramienta para estimar un impuesto sobre la renta progresivo, denominado ISR,
IRPF u otro nombre local, a partir de una base gravable y reglas fiscales
versionadas por país, régimen y periodo.

**Arquitectura:** cálculo en cliente con datasets locales. No requiere backend,
pero las tarifas, deducciones y reglas deben revisarse periódicamente.

---

## Objetivo de producto

- Explicar cómo funciona una tarifa progresiva.
- Estimar impuesto, tasa marginal y tasa efectiva.
- Comparar impuesto calculado contra retenciones realizadas.
- Identificar claramente país, régimen, periodo y fuente.
- Permitir un cálculo manual sin asumir reglas universales.

---

## Alcance recomendado

### MVP

- País, régimen y periodo fiscal.
- Base gravable, deducciones aplicables y retenciones previas.
- Motor genérico de tarifas progresivas.
- Preset local vigente y modo manual.
- Desglose por tramo y saldo estimado.

### Fase 2

- Declaración conjunta o unidades familiares.
- Créditos fiscales y deducciones complejas.
- Comparador entre periodos.
- Más países y regímenes.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL pública recomendada | `/legal-impuestos/calculadora-isr-irpf` |
| Archivo Astro recomendado | `src/pages/legal-impuestos/calculadora-isr-irpf.astro` |
| Lógica de cálculo | `src/lib/calculators/legal-impuestos/calculadora-isr-irpf/incomeTax.ts` |
| Reglas locales | `src/lib/calculators/legal-impuestos/calculadora-isr-irpf/rules/{pais}/{regimen}/{periodo}.ts` |
| Pruebas unitarias | `src/lib/calculators/legal-impuestos/calculadora-isr-irpf/incomeTax.test.ts` |
| Categoría | `legal-impuestos` |
| Locale inicial | `es-MX` |

---

## Datos locales y vigencia

Cada preset debe declarar moneda, periodicidad, tramos, cuota fija, deducciones
o subsidios compatibles, fuente oficial, vigencia y fecha de revisión.

```ts
interface IncomeTaxRuleSet {
  country: string;
  regime: string;
  period: string;
  frequency: "monthly" | "annual";
  effectiveFrom: string;
  effectiveTo?: string;
  sourceUrl: string;
  reviewedAt: string;
  status: "current" | "expired" | "draft";
  brackets: TaxBracket[];
}
```

- El usuario debe ver el nombre local del impuesto: ISR, IRPF u otro.
- Un preset vencido no debe seleccionarse como vigente.
- El modo manual permite capturar tramos o una tasa única para simulación.

### Fuentes iniciales para el preset de México

- [SAT - Resolución Miscelánea Fiscal 2026](https://www.sat.gob.mx/minisitio/NormatividadRMFyRGCE/normatividad_rmf_rgce2026.html)
- [SAT - Anexo 8 de la RMF 2026, tarifas de ISR](https://www.sat.gob.mx/minisitio/NormatividadRMFyRGCE/documentos2026/rmf/anexos/Anexo-8-RMF-2026_DOF-28122025.pdf)

---

## Comportamiento mobile-first

- Mostrar impuesto estimado y saldo como resultados principales.
- Desglose por tramo en acordeón o tabla desplazable.
- Mostrar régimen, periodo y fuente cerca del cálculo.
- No presentar el saldo como declaración o resolución oficial.

---

## Flujo principal MVP

### Inputs del MVP

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| País | Selector | presets vigentes, manual | preset vigente |
| Régimen | Selector | según país | primero disponible |
| Periodo | Selector | periodos disponibles | vigente |
| Base gravable | Texto numérico | `>= 0` | vacío |
| Deducciones aplicables | Texto numérico | `>= 0` | `0` |
| Retenciones realizadas | Texto numérico | `>= 0` | `0` |

### Outputs principales

- Base gravable ajustada.
- Impuesto estimado.
- Tasa marginal y efectiva.
- Desglose por tramo.
- Diferencia estimada contra retenciones.

---

## Fórmulas y algoritmo

```text
base_ajustada = max(0, base_gravable - deducciones)
impuesto = suma(monto_en_tramo * tasa_del_tramo) + ajustes_aplicables
tasa_efectiva = base_ajustada > 0 ? impuesto / base_ajustada : 0
saldo_estimado = impuesto - retenciones_realizadas
```

Si la tabla local usa cuota fija y porcentaje sobre excedente, el motor debe
aplicar exactamente ese modelo en vez de convertirlo a tramos aproximados.

---

## Validaciones y estados

- Base, deducciones y retenciones no pueden ser negativas.
- Las deducciones no reducen la base por debajo de cero.
- Los tramos deben estar ordenados, sin huecos ni superposiciones.
- Mostrar advertencia ante régimen o periodo no vigente.
- Aclarar que residencia, ingresos adicionales, exenciones y obligaciones
  particulares pueden alterar el impuesto final.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora básica de ISR e IRPF` |
| Meta description | `Estima el impuesto sobre la renta con tarifas progresivas locales y consulta tasas marginal, efectiva y saldo contra retenciones.` |
| H1 | `Calculadora de ISR / IRPF` |
| Keyword principal | `calculadora ISR` |
| Keywords secundarias | `calculadora IRPF`, `impuesto sobre la renta`, `tasa efectiva ISR` |

Incluir aviso de estimación informativa y enlaces a las fuentes oficiales de las
reglas seleccionadas.

---

## Pruebas sugeridas

- Probar valores justo debajo, en y arriba de cada límite.
- Comparar fixtures contra ejemplos oficiales del periodo.
- Base cero produce impuesto y tasa efectiva cero.
- Retenciones mayores al impuesto muestran saldo a favor estimado.
- Presets vencidos y sin fuente no pueden marcarse como vigentes.
