# Especificación v1 - Calculadora de prima vacacional

## Descripción general

Herramienta para estimar la prima o bonificación vacacional aplicable al pago de
días de vacaciones según salario, porcentaje y reglas locales.

**Arquitectura:** cálculo en cliente con presets locales versionados. No requiere
backend, pero los porcentajes mínimos y reglas requieren revisión periódica.

---

## Objetivo de producto

- Estimar pago de vacaciones y prima vacacional por separado.
- Explicar la base y porcentaje aplicados.
- Admitir porcentajes contractuales superiores.
- Integrarse conceptualmente con vacaciones proporcionales y finiquito.
- Mostrar fuente, periodo y vigencia de la regla.

---

## Alcance recomendado

### MVP

- País, periodo y preset vigente.
- Salario diario.
- Días de vacaciones a pagar.
- Porcentaje de prima desde preset o captura manual.
- Resultado de pago vacacional, prima y total antes de impuestos.

### Fase 2

- Días pendientes calculados automáticamente.
- Estimación fiscal del pago.
- Reglas por convenio o contrato.
- Comparador entre porcentaje mínimo y contractual.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL pública recomendada | `/legal-impuestos/calculadora-prima-vacacional` |
| Archivo Astro recomendado | `src/pages/legal-impuestos/calculadora-prima-vacacional.astro` |
| Lógica de cálculo | `src/lib/calculators/legal-impuestos/calculadora-prima-vacacional/vacationPremium.ts` |
| Reglas locales | `src/lib/calculators/legal-impuestos/calculadora-prima-vacacional/rules/{pais}/{periodo}.ts` |
| Pruebas unitarias | `src/lib/calculators/legal-impuestos/calculadora-prima-vacacional/vacationPremium.test.ts` |
| Categoría | `legal-impuestos` |
| Locale inicial | `es-MX` |

---

## Datos locales y vigencia

El dataset debe declarar porcentaje mínimo, base de cálculo, fuente oficial,
vigencia y fecha de revisión.

```ts
interface VacationPremiumRuleSet {
  country: string;
  jurisdiction?: string;
  period: string;
  effectiveFrom: string;
  effectiveTo?: string;
  sourceUrl: string;
  reviewedAt: string;
  status: "current" | "expired" | "draft";
  minimumPremiumRate: number;
  premiumBase: "vacation_pay" | "custom";
}
```

- Mostrar el porcentaje local usado y permitir editarlo.
- Advertir cuando el porcentaje capturado sea menor al mínimo del preset.
- No asumir tratamiento fiscal sin una regla local específica.

### Fuentes iniciales para el preset de México

- [Cámara de Diputados - Ley Federal del Trabajo](https://www.diputados.gob.mx/LeyesBiblio/pdf/LFT.pdf)
- [PROFEDET - Prima vacacional](https://www.profedet.gob.mx/micrositio/index.php/prima-vacacional)

---

## Comportamiento mobile-first

- Mostrar prima vacacional como resultado principal.
- Separar pago base de vacaciones y prima.
- Presentar porcentaje, regla y vigencia cerca del resultado.
- No ocultar que el cálculo es bruto antes de impuestos.

---

## Flujo principal MVP

### Inputs del MVP

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| País / periodo | Selector | presets vigentes, manual | preset vigente |
| Salario diario | Texto numérico | `> 0` | vacío |
| Días de vacaciones | Texto numérico | `>= 0` | vacío |
| Prima vacacional (%) | Texto numérico | `>= 0` | desde preset |
| Pago base incluido | Toggle | sí, no | sí |

### Outputs principales

- Pago base de vacaciones.
- Prima vacacional estimada.
- Total bruto estimado.
- Porcentaje aplicado.
- Regla, vigencia y fuente.

---

## Fórmulas y algoritmo

```text
pago_vacaciones = salario_diario * dias_vacaciones
prima_vacacional = pago_vacaciones * porcentaje_prima
total_bruto = pago_base_incluido
  ? pago_vacaciones + prima_vacacional
  : prima_vacacional
```

El porcentaje debe almacenarse como decimal y mostrarse como porcentaje. No
redondear antes del resultado final.

---

## Validaciones y estados

- Salario diario y días no pueden ser negativos.
- Porcentaje no puede ser negativo.
- Avisar cuando el porcentaje sea menor al mínimo local.
- Días con decimales deben respetar la regla local o modo manual.
- Aclarar que salario integrado, impuestos y contrato pueden cambiar el pago.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de prima vacacional` |
| Meta description | `Estima la prima vacacional y el pago de vacaciones con porcentaje local o contractual editable.` |
| H1 | `Calculadora de prima vacacional` |
| Keyword principal | `calculadora prima vacacional` |
| Keywords secundarias | `pago de vacaciones`, `porcentaje prima vacacional`, `prima de vacaciones` |

---

## Pruebas sugeridas

- Salario `100`, `10` días y `25%` producen prima `250`.
- Desactivar pago base muestra únicamente la prima.
- Porcentaje menor al mínimo local genera advertencia.
- Porcentaje cero produce prima cero.
- Preset vencido fuerza modo manual.
