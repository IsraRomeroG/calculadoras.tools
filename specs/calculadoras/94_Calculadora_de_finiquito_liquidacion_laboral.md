# Especificación v1 - Calculadora de finiquito / liquidación laboral

## Descripción general

Herramienta para construir escenarios estimados de pagos al terminar una
relación laboral. Distingue el finiquito de una posible liquidación o
indemnización, cuya procedencia depende de la ley y de los hechos del caso.

**Arquitectura:** cálculo en cliente con reglas locales versionadas y conceptos
editables. No requiere backend, pero necesita revisión legal periódica.

---

## Objetivo de producto

- Separar finiquito, prestaciones proporcionales e indemnizaciones hipotéticas.
- Explicar cada concepto y su fórmula.
- Evitar afirmar automáticamente que existe derecho a liquidación.
- Permitir reglas contractuales y montos manuales.
- Mostrar fuentes, periodo y límites de la estimación.

---

## Alcance recomendado

### MVP

- País, periodo y motivo de terminación declarado por el usuario.
- Fechas de ingreso y salida, salario base y frecuencia.
- Salarios pendientes y prestaciones proporcionales.
- Modo `Solo finiquito` y modo `Escenario con indemnización`.
- Conceptos editables y desglose completo.

### Fase 2

- Salario integrado con prestaciones variables.
- Escenarios comparables.
- Impuestos estimados sobre conceptos.
- Reglas por jurisdicción, convenio o contrato.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL pública recomendada | `/legal-impuestos/calculadora-finiquito-liquidacion` |
| Archivo Astro recomendado | `src/pages/legal-impuestos/calculadora-finiquito-liquidacion.astro` |
| Lógica de cálculo | `src/lib/calculators/legal-impuestos/calculadora-finiquito-liquidacion/terminationPay.ts` |
| Reglas locales | `src/lib/calculators/legal-impuestos/calculadora-finiquito-liquidacion/rules/{pais}/{periodo}.ts` |
| Pruebas unitarias | `src/lib/calculators/legal-impuestos/calculadora-finiquito-liquidacion/terminationPay.test.ts` |
| Categoría | `legal-impuestos` |
| Locale inicial | `es-MX` |

---

## Datos locales y vigencia

Cada dataset debe definir prestaciones mínimas, fórmulas disponibles, reglas de
antigüedad, topes y metadatos de vigencia. La elegibilidad jurídica de una
indemnización nunca debe inferirse únicamente del preset.

```ts
interface TerminationRuleSet {
  country: string;
  jurisdiction?: string;
  period: string;
  effectiveFrom: string;
  effectiveTo?: string;
  sourceUrl: string;
  reviewedAt: string;
  status: "current" | "expired" | "draft";
  benefitRules: BenefitRule[];
  indemnityScenarios: IndemnityScenario[];
}
```

- Mostrar fuente y fecha de revisión de cada concepto local.
- Permitir activar, desactivar o editar conceptos.
- Etiquetar toda indemnización como escenario sujeto a revisión legal.

### Fuentes iniciales para el preset de México

- [Cámara de Diputados - Ley Federal del Trabajo](https://www.diputados.gob.mx/LeyesBiblio/pdf/LFT.pdf)
- [PROFEDET - Derechos después de renuncia o despido](https://profedet.gob.mx/prensa/asesoria_despido.html)
- [PROFEDET - Conoce tus prestaciones laborales](https://www.profedet.gob.mx/profedet/pdf/conoce-tus-prestaciones-laborales.pdf)

---

## Comportamiento mobile-first

- Mostrar total estimado y separar finiquito de indemnización hipotética.
- Presentar conceptos en una lista expandible con fórmula y fuente.
- Mantener visible el motivo declarado y el modo de cálculo.
- Destacar el aviso de que la procedencia depende del caso concreto.

---

## Flujo principal MVP

### Inputs del MVP

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| País / periodo | Selector | presets vigentes, manual | preset vigente |
| Modo | Selector | solo finiquito, escenario con indemnización | solo finiquito |
| Motivo declarado | Selector | renuncia, despido, mutuo acuerdo, otro | otro |
| Fecha de ingreso | Fecha | fecha válida | vacío |
| Fecha de salida | Fecha | `>= ingreso` | vacío |
| Salario base | Texto numérico | `> 0` | vacío |
| Salarios pendientes | Texto numérico | `>= 0` | `0` |
| Conceptos adicionales | Lista editable | importes `>= 0` | vacío |

### Outputs principales

- Total de finiquito estimado.
- Prestaciones proporcionales por concepto.
- Indemnización hipotética separada, si fue activada.
- Total general del escenario.
- Antigüedad, regla, vigencia y fuente utilizadas.

---

## Fórmulas y algoritmo

```text
salario_diario = normalizar_salario(salario_base, frecuencia)
finiquito = salarios_pendientes
          + vacaciones_pendientes
          + prima_vacacional
          + aguinaldo_proporcional
          + otros_conceptos

indemnizacion_hipotetica = suma(
  calcular_concepto_activado(salario_diario, antiguedad, regla)
)
total_escenario = finiquito + indemnizacion_hipotetica
```

Las prestaciones proporcionales deben delegarse a sus motores específicos. No
se deben mezclar impuestos o deducciones salvo que exista una regla verificable.

---

## Validaciones y estados

- Fecha de salida no puede preceder a la de ingreso.
- Salario y conceptos no pueden ser negativos.
- No activar indemnización automáticamente según el motivo elegido.
- Mostrar conceptos no contemplados y supuestos editados.
- Solicitar confirmación antes de cambiar país o periodo y perder ajustes.
- Incluir recomendación de consultar a la autoridad laboral o a un profesional.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de finiquito y liquidación laboral` |
| Meta description | `Construye un escenario estimado de finiquito, prestaciones proporcionales y posible liquidación con reglas locales editables.` |
| H1 | `Calculadora de finiquito y liquidación` |
| Keyword principal | `calculadora finiquito` |
| Keywords secundarias | `calculadora liquidación laboral`, `prestaciones proporcionales`, `indemnización laboral` |

Incluir contenido que explique la diferencia entre finiquito y liquidación sin
afirmar que un motivo declarado determina por sí solo el derecho aplicable.

---

## Pruebas sugeridas

- `Solo finiquito` nunca incluye indemnización.
- Las prestaciones proporcionales coinciden con sus calculadoras individuales.
- Cambiar un concepto manual actualiza total y registra el supuesto.
- Un preset vencido bloquea el cálculo automático.
- La interfaz separa claramente total de finiquito e indemnización hipotética.
