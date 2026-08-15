# 01 - Arquitectura de mercados, jurisdicciones y reglas

## Objetivo

Crear un dominio que permita compartir UI y primitivas matemáticas sin compartir
accidentalmente leyes, tablas, monedas o periodos entre países.

## Separación de conceptos

| Concepto | Ejemplo | Responsabilidad |
| --- | --- | --- |
| `locale` | `en-CA` | Copy, formato, accesibilidad y parsing declarado. |
| `marketId` | `ca` | País/producto comercial seleccionado. |
| `jurisdiction` | `CA-ON` | Ley, impuesto o autoridad subnacional aplicable. |
| `regime` | `employee`, `federal-labour` | Supuesto fiscal o laboral soportado. |
| `periodId` | `2026`, `2026-27` | Versión temporal de reglas. |
| `currency` | `CAD` | Unidad monetaria del resultado. |

Está prohibido:

```ts
const rules = locale.startsWith("en") ? MEXICO_RULES : MEXICO_RULES;
```

La selección válida parte de un contexto completo:

```ts
interface MarketContext {
  locale: "en-US" | "en-GB" | "en-CA" | "en-AU" | "en-NZ" | "en-IE" | "en-MX";
  marketId: "us" | "gb" | "ca" | "au" | "nz" | "ie" | "mx-en";
  countryCode: "US" | "GB" | "CA" | "AU" | "NZ" | "IE" | "MX";
  jurisdictionCode: string;
  regimeId: string;
  periodId: string;
  currency: "USD" | "GBP" | "CAD" | "AUD" | "NZD" | "EUR" | "MXN";
}
```

## Identidad de familia y variante

Una calculadora deja de ser una sola entidad con una traducción. Se modela como
familia más variantes:

```ts
type CalculatorFamilyId =
  | "indirect-tax"
  | "income-tax"
  | "take-home-pay"
  | "paid-leave"
  | "termination-pay";

interface CalculatorMarketVariant {
  familyId: CalculatorFamilyId;
  variantId: string;
  marketId: MarketContext["marketId"];
  supportedJurisdictions: string[];
  supportedPeriods: string[];
  canonicalPath: string;
  locale: MarketContext["locale"];
  publicationStatus: "draft" | "review" | "published" | "suspended";
  coverage: "complete" | "partial" | "manual-only";
}
```

`calculatorId` puede conservar la identidad española para variantes `es-MX` y
`en-MX`; las nuevas variantes deben añadir un ID estable propio o un
`variantId`, nunca reutilizar `calculadora-isr-irpf` como si todas las tablas
fueran ISR.

## Envelope obligatorio para rule sets

```ts
interface RuleSetEnvelope<TRules> {
  id: string;
  familyId: CalculatorFamilyId;
  marketId: MarketContext["marketId"];
  countryCode: MarketContext["countryCode"];
  jurisdictionCode: string;
  regimeId: string;
  periodId: string;
  currency: MarketContext["currency"];
  effectiveFrom: string;
  effectiveTo?: string;
  publishedAt?: string;
  reviewedAt: string;
  reviewDueAt: string;
  status:
    | "draft"
    | "independently-reviewed"
    | "current"
    | "historical"
    | "expired"
    | "suspended";
  coverage: "complete" | "partial" | "manual-only";
  missingConcepts: string[];
  assumptions: string[];
  rounding: RoundingPolicy;
  sources: LegalSource[];
  officialFixtures: OfficialFixtureRef[];
  rules: TRules;
}

interface LegalSource {
  authority: string;
  title: string;
  url: string;
  sourceVersion?: string;
  effectiveFrom?: string;
  accessedAt: string;
  appliesTo: string[];
}
```

Un rule set no puede marcarse `current` si carece de `publishedAt`, fuente
primaria, `reviewDueAt`, periodo, jurisdicción o fixtures.

## Resolución de jurisdicción

### Requisitos mínimos por mercado

| Mercado | Contexto fiscal obligatorio | Contexto laboral obligatorio |
| --- | --- | --- |
| US | estado; localidad cuando se calcule sales tax; filing status para impuesto | estado y tipo de relación; contrato/política para PTO o severance |
| GB | región fiscal: Scotland o rest-of-UK | Great Britain o Northern Ireland; régimen soportado |
| CA | provincia/territorio; Quebec separado | federal-regulated o provincia/territorio |
| AU | residencia fiscal y periodo | cobertura NES, tamaño del empleador, award/agreement |
| NZ | tax code y periodo | tipo de empleo y patrón de trabajo |
| IE | estado civil/evaluación y créditos para nómina | antigüedad, empleo asegurable y situación de terminación |
| MX-EN | régimen mexicano soportado | LFT sector privado general y fechas cubiertas |

### Resultado de resolución

```ts
type RuleResolution<T> =
  | { status: "ready"; ruleSet: RuleSetEnvelope<T> }
  | { status: "partial"; ruleSet: RuleSetEnvelope<T>; missing: string[] }
  | { status: "unsupported"; reasonCode: string; officialHelpUrl?: string }
  | { status: "expired"; availablePeriods: string[] };
```

No se permite que `unsupported` dispare modo manual automáticamente. El usuario
debe elegir conscientemente una simulación manual y el resultado pierde toda
etiqueta de cálculo oficial.

## Capas compartibles

### Sí se comparten

- parsing y validación numérica por política declarada;
- aritmética de tramos marginales;
- add/extract de un porcentaje indirecto;
- operaciones con fechas civiles;
- formateo mediante `Intl`;
- componentes de formulario y resultado;
- serialización segura y accesibilidad;
- tipos de fuente, vigencia, cobertura y desglose.

### No se comparten sin un adapter explícito

- tablas fiscales;
- bases, allowances, credits y tax codes;
- aportaciones sociales;
- tasas indirectas y clasificación de bienes/servicios;
- reglas de devengo de vacaciones;
- elegibilidad y fórmulas de redundancy/severance;
- redondeo oficial;
- interpretación de fechas de vigencia;
- copy que afirme derechos o exclusiones.

## Estructura recomendada

```txt
src/lib/calculators/legal-tax/
  core/
    brackets.ts
    civilDates.ts
    indirectTax.ts
    money.ts
    ruleResolution.ts
  markets/
    us/{family}/rules/{jurisdiction}/{period}.ts
    gb/{family}/rules/{jurisdiction}/{period}.ts
    ca/{family}/rules/{jurisdiction}/{period}.ts
    au/{family}/rules/{jurisdiction}/{period}.ts
    nz/{family}/rules/{jurisdiction}/{period}.ts
    ie/{family}/rules/{jurisdiction}/{period}.ts
    mx/{family}/rules/{jurisdiction}/{period}.ts
  registry.ts
  sourceRegistry.ts
```

No mover todavía los módulos mexicanos hasta que existan tests de
caracterización. La migración debe ser mecánica antes de introducir reglas
nuevas.

## Contrato de cálculo

Cada motor devuelve datos, no copy:

```ts
interface CalculationResult {
  ruleSetId: string;
  marketId: string;
  jurisdictionCode: string;
  periodId: string;
  currency: string;
  coverage: "complete" | "partial" | "manual-only";
  rows: Array<{
    id: string;
    amount: number;
    status: "calculated" | "manual" | "not-included" | "not-applicable";
    ruleRefs: string[];
  }>;
  warnings: string[];
  missingConcepts: string[];
}
```

El presenter localizado convierte IDs y códigos en texto. `warnings` debe
terminar siendo códigos tipados; se admite `string[]` solo durante la migración.

## Reglas de UI

- La selección de país está antes de cualquier importe.
- Los campos derivados de jurisdicción se muestran inmediatamente después.
- Cambiar país, jurisdicción, periodo o régimen invalida el resultado.
- Si el cambio selecciona otro rule set, se limpian overrides incompatibles
  después de confirmación.
- El resultado muestra una banda persistente con país, jurisdicción, periodo y
  cobertura.
- El formato `en-US` no convierte CAD, GBP o AUD en USD.
- El historial/localStorage incluye `variantId`, `ruleSetId` y versión; no
  rehidrata cálculos con reglas distintas.

## Validaciones de registro

- IDs únicos.
- Periodos sin huecos ni solapamientos dentro de la misma jurisdicción/régimen.
- La moneda coincide con el mercado salvo excepción documentada.
- `effectiveFrom <= effectiveTo`.
- `reviewedAt <= reviewDueAt`.
- Ningún preset `current` tiene conceptos obligatorios faltantes si se anuncia
  como completo.
- Ninguna variante publicada apunta a un preset `draft`, `expired` o
  `suspended`.
- Ningún módulo bajo `markets/us|gb|ca|au|nz|ie` importa `markets/mx` o
  `legal-impuestos/**/rules/mx`.
- Ningún nombre `MEXICO_*` aparece en un bundle de otra variante.

## Criterios de aceptación

- Una misma UI puede ejecutar dos mercados y devuelve distintos `ruleSetId`.
- `locale="en"` sin mercado produce error tipado, no un preset mexicano.
- Cambiar solo el locale de `es-MX` a `en-MX` conserva el cálculo.
- Cambiar de `en-MX` a `en-GB` cambia reglas, periodo, moneda y fuentes.
- Los casos subnacionales no soportados se bloquean.
- El resultado puede reproducirse a partir de `ruleSetId`, inputs y versión.
