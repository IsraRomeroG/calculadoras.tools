# Especificación v1 - Calculadora de aguinaldo proporcional

## Descripción general

Herramienta para estimar la parte proporcional de aguinaldo, paga extra o
prestación anual equivalente según salario, días elegibles y reglas locales.

**Arquitectura:** cálculo en cliente con presets locales versionados. No requiere
backend, pero los mínimos legales y criterios de cómputo requieren revisión
periódica.

---

## Objetivo de producto

- Estimar el aguinaldo proporcional generado.
- Explicar días de prestación y días elegibles.
- Admitir salario fijo o promedio variable.
- Permitir prestaciones contractuales superiores al mínimo.
- Mostrar fuente oficial, vigencia y supuestos utilizados.

---

## Alcance recomendado

### MVP

- País, periodo y preset local vigente.
- Fecha inicial y fecha de corte o salida.
- Salario diario fijo o promedio.
- Días anuales de aguinaldo desde preset o captura manual.
- Días no elegibles configurables.
- Resultado proporcional antes de impuestos.

### Fase 2

- Estimación fiscal del pago.
- Historial por varios periodos.
- Integración con finiquito.
- Reglas por convenio o contrato.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL pública recomendada | `/legal-impuestos/calculadora-aguinaldo-proporcional` |
| Archivo Astro recomendado | `src/pages/legal-impuestos/calculadora-aguinaldo-proporcional.astro` |
| Lógica de cálculo | `src/lib/calculators/legal-impuestos/calculadora-aguinaldo-proporcional/proportionalBonus.ts` |
| Reglas locales | `src/lib/calculators/legal-impuestos/calculadora-aguinaldo-proporcional/rules/{pais}/{periodo}.ts` |
| Pruebas unitarias | `src/lib/calculators/legal-impuestos/calculadora-aguinaldo-proporcional/proportionalBonus.test.ts` |
| Categoría | `legal-impuestos` |
| Locale inicial | `es-MX` |

---

## Datos locales y vigencia

El dataset debe definir el mínimo anual, periodo de devengo, política de días
elegibles, redondeo, fuente oficial y vigencia.

```ts
interface AnnualBonusRuleSet {
  country: string;
  jurisdiction?: string;
  period: string;
  effectiveFrom: string;
  effectiveTo?: string;
  sourceUrl: string;
  reviewedAt: string;
  status: "current" | "expired" | "draft";
  minimumDays: number;
  accrualBasisDays: number;
}
```

- Mostrar los días anuales utilizados y permitir editarlos.
- No asumir que el mínimo legal coincide con la prestación contractual.
- Si no hay preset vigente, usar exclusivamente modo manual.

### Fuentes iniciales para el preset de México

- [Cámara de Diputados - Ley Federal del Trabajo](https://www.diputados.gob.mx/LeyesBiblio/pdf/LFT.pdf)
- [PROFEDET - Derechos laborales](https://www.profedet.gob.mx/profedet/derechos.html)

---

## Comportamiento mobile-first

- Mostrar el aguinaldo proporcional estimado como resultado principal.
- Presentar días elegibles y proporción del periodo.
- Mantener visible si el salario es fijo o promedio variable.
- Mostrar fuente, vigencia y aviso de estimación junto al resultado.

---

## Flujo principal MVP

### Inputs del MVP

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| País / periodo | Selector | presets vigentes, manual | preset vigente |
| Fecha inicial | Fecha | fecha válida | inicio del periodo |
| Fecha de corte o salida | Fecha | `>= fecha inicial` | hoy |
| Tipo de salario | Selector | fijo, promedio variable | fijo |
| Salario diario | Texto numérico | `> 0` | vacío |
| Días anuales de aguinaldo | Texto numérico | `>= 0` | desde preset |
| Días no elegibles | Texto numérico | `>= 0` | `0` |

### Outputs principales

- Aguinaldo proporcional bruto estimado.
- Días elegibles y días del periodo.
- Proporción generada.
- Prestación anual equivalente.
- Regla, periodo y fuente utilizados.

---

## Fórmulas y algoritmo

```text
dias_elegibles = max(0, dias_entre_fechas - dias_no_elegibles)
aguinaldo_anual = salario_diario * dias_anuales_aguinaldo
aguinaldo_proporcional =
  aguinaldo_anual * dias_elegibles / dias_base_del_periodo
```

No redondear cálculos intermedios. Para salario variable, usar el promedio
capturado por el usuario y explicar que el periodo de promedio depende de la
regla aplicable.

---

## Validaciones y estados

- Fecha de corte no puede preceder a fecha inicial.
- Salario y días no pueden ser negativos.
- Días no elegibles no pueden superar los días entre fechas.
- Advertir si el usuario modifica el mínimo local.
- No incluir impuestos automáticamente.
- Aclarar que contrato, convenio y ausencias pueden cambiar el resultado.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de aguinaldo proporcional` |
| Meta description | `Estima tu aguinaldo proporcional según salario, días trabajados y reglas locales vigentes.` |
| H1 | `Calculadora de aguinaldo proporcional` |
| Keyword principal | `aguinaldo proporcional` |
| Keywords secundarias | `calculadora aguinaldo`, `aguinaldo por días trabajados`, `paga extra proporcional` |

---

## Pruebas sugeridas

- Un periodo completo produce salario diario por días anuales.
- Medio periodo produce la proporción esperada antes de redondear.
- Los días no elegibles reducen correctamente el resultado.
- El año bisiesto usa la base definida por el preset.
- Preset vencido fuerza modo manual y muestra advertencia.
