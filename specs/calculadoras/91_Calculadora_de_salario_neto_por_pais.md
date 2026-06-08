# Especificación v1 - Calculadora de salario neto por país

## Descripción general

Herramienta para estimar cuánto recibe una persona después de impuestos,
cotizaciones y deducciones de nómina según el país, periodo fiscal y frecuencia
de pago seleccionados.

**Arquitectura:** el cálculo ocurre en el cliente usando datasets locales
versionados. No requiere backend ni llamadas a APIs externas, pero sí revisión
periódica de tablas y reglas.

---

## Objetivo de producto

- Convertir salario bruto a salario neto estimado.
- Explicar impuestos, aportaciones y deducciones por separado.
- Permitir comparar frecuencias de pago y escenarios.
- Informar claramente la vigencia y fuente de cada preset.
- Generar una página estática optimizada para SEO en Astro.

---

## Alcance recomendado

### MVP

- País y periodo fiscal.
- Frecuencia de pago y salario bruto.
- Bonos, prestaciones gravables y deducciones editables.
- Preset local para un país inicialmente soportado.
- Resultado neto, desglose y tasas efectiva y marginal.
- Modo manual cuando no exista un preset vigente.

### Fase 2

- Más países y jurisdicciones.
- Comparador de ofertas laborales.
- Prestaciones exentas y topes avanzados.
- Exportación de desglose.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL pública recomendada | `/legal-impuestos/calculadora-salario-neto` |
| Archivo Astro recomendado | `src/pages/legal-impuestos/calculadora-salario-neto.astro` |
| Lógica de cálculo | `src/lib/calculators/legal-impuestos/calculadora-salario-neto/netSalary.ts` |
| Reglas locales | `src/lib/calculators/legal-impuestos/calculadora-salario-neto/rules/{pais}/{periodo}.ts` |
| Pruebas unitarias | `src/lib/calculators/legal-impuestos/calculadora-salario-neto/netSalary.test.ts` |
| Categoría | `legal-impuestos` |
| Locale inicial | `es-MX` |

---

## Datos locales y vigencia

Cada dataset debe incluir:

```ts
interface SalaryRuleSet {
  country: string;
  jurisdiction?: string;
  period: string;
  effectiveFrom: string;
  effectiveTo?: string;
  sourceUrl: string;
  reviewedAt: string;
  status: "current" | "expired" | "draft";
  currency: string;
  taxBrackets: TaxBracket[];
  contributions: ContributionRule[];
}
```

- Mostrar país, periodo, fecha de revisión y enlace a la fuente oficial.
- Advertir y desactivar el preset cuando su estado sea `expired` o `draft`.
- Ofrecer modo manual con tasas y deducciones editables.
- Nunca reutilizar automáticamente reglas de un periodo para otro.

### Fuentes iniciales para el preset de México

- [SAT - Resolución Miscelánea Fiscal 2026](https://www.sat.gob.mx/minisitio/NormatividadRMFyRGCE/normatividad_rmf_rgce2026.html)
- [SAT - Anexo 8 de la RMF 2026, tarifas de ISR](https://www.sat.gob.mx/minisitio/NormatividadRMFyRGCE/documentos2026/rmf/anexos/Anexo-8-RMF-2026_DOF-28122025.pdf)

Las cotizaciones y subsidios de nómina deben incorporarse únicamente después de
verificar su fuente oficial específica y condiciones de aplicación.

---

## Comportamiento mobile-first

- Mostrar salario neto como resultado principal.
- Colocar el periodo y vigencia del preset junto al resultado.
- Presentar el desglose en filas expandibles.
- Mantener visible el aviso de estimación, sin presentarla como recibo oficial.

---

## Flujo principal MVP

### Inputs del MVP

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| País | Selector | países con preset vigente, manual | primer preset vigente |
| Periodo fiscal | Selector | periodos disponibles | vigente |
| Frecuencia | Selector | semanal, quincenal, mensual, anual | mensual |
| Salario bruto | Texto numérico | `> 0` | vacío |
| Bonos gravables | Texto numérico | `>= 0` | `0` |
| Otras deducciones | Texto numérico | `>= 0` | `0` |

### Outputs principales

- Salario neto estimado por periodo.
- Ingreso bruto gravable.
- Impuesto estimado.
- Cotizaciones y otras deducciones.
- Tasa efectiva y tasa marginal.
- Neto anual equivalente.

---

## Fórmulas y algoritmo

```text
bruto_gravable = salario_bruto + bonos_gravables - conceptos_exentos
impuesto = calcular_tarifa_progresiva(bruto_gravable, reglas)
cotizaciones = suma(calcular_aportacion(bruto_gravable, regla))
neto = salario_bruto + bonos - impuesto - cotizaciones - otras_deducciones
tasa_efectiva = impuesto / bruto_gravable
```

La conversión entre frecuencias debe normalizar primero a la periodicidad usada
por el dataset y redondear únicamente al mostrar el resultado.

---

## Validaciones y estados

- No aceptar importes negativos.
- Avisar cuando el periodo seleccionado no coincida con la fecha actual.
- No calcular con un preset sin fuente o fecha de revisión.
- Mostrar conceptos no contemplados y permitir agregarlos manualmente.
- Aclarar que nómina, residencia, contrato y situación personal pueden cambiar
  el resultado.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de salario neto por país` |
| Meta description | `Estima tu salario neto después de impuestos y aportaciones con reglas locales versionadas y desglose por concepto.` |
| H1 | `Calculadora de salario neto` |
| Keyword principal | `calculadora salario neto` |
| Keywords secundarias | `sueldo neto`, `salario bruto a neto`, `impuestos de nómina` |

Incluir una nota visible: el resultado es informativo y no sustituye un cálculo
de nómina, asesoría fiscal ni información de la autoridad competente.

---

## Pruebas sugeridas

- Cada fixture oficial del periodo produce el impuesto esperado.
- Los límites inferior y superior de cada tramo no crean saltos incorrectos.
- Cambiar frecuencia conserva el equivalente anual.
- Un preset vencido bloquea el cálculo y ofrece modo manual.
- La interfaz muestra fuente, vigencia y fecha de revisión.
