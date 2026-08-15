# 03 - Impuestos indirectos: VAT, GST/HST y sales tax

## Objetivo

Reemplazar la calculadora VAT traducida por un producto que identifique el
sistema fiscal aplicable antes de hacer la aritmética. El motor porcentual es
compartible; la tasa, clasificación, lugar de suministro y nombre del impuesto
no lo son.

## Límites del producto

El MVP calcula:

- impuesto que se agrega a una base;
- base e impuesto incluidos en un total;
- desglose de componentes cuando el preset oficial lo permite;
- escenarios de tasa estándar, reducida o cero elegidos conscientemente.

No determina automáticamente:

- clasificación legal del bien o servicio;
- registro obligatorio, nexus o establecimiento;
- place-of-supply complejo o transacciones transfronterizas;
- exenciones subjetivas;
- filing, invoice compliance, input credits o tax returns.

El copy debe decir `arithmetic estimate` y enlazar la autoridad que permite
confirmar clasificación y tasa.

## Referencia normativa inicial

Valores revisados el 2026-08-15. Antes de implementar cada dataset deben
verificarse otra vez y registrarse `accessedAt`, `effectiveFrom` y
`reviewDueAt`.

| Mercado | Sistema | Presets mínimos | Regla de selección |
| --- | --- | --- | --- |
| US | state/local sales tax | Sin tasa nacional; solo jurisdicciones implementadas | Estado + localidad/dirección o tasa manual explícita. |
| GB | VAT | 20%, 5%, 0% | El usuario elige clasificación; advertir particularidades de Northern Ireland/transfronterizas. |
| CA | GST/HST y, por separado, PST/QST | GST 5%; HST 13%, 14% o 15% según provincia | Place of supply/provincia obligatorio; no sumar PST/QST sin dataset. |
| AU | GST | 10%, GST-free | Australia doméstica; clasificación elegida. |
| NZ | GST | 15%, 0%, exempt | Nueva Zelanda doméstica; clasificación elegida. |
| IE | VAT | 23%, 13.5%, 9%, 4.8%, 0% | El usuario elige una categoría soportada y ve la fecha de vigencia. |
| MX-EN | IVA | Mantener presets mexicanos versionados | Nunca default de una sesión nueva sin contexto. |

## Fuentes oficiales iniciales

### Estados Unidos

- [USAGov - State and local taxes](https://www.usa.gov/state-taxes)
- Autoridad tributaria oficial de cada estado/localidad implementada.

USAGov confirma que estados y municipios aplican porcentajes diferentes. No
existe una tasa federal única que pueda precargarse. No usar fuentes comerciales
como autoridad normativa del dataset.

### Reino Unido

- [GOV.UK - Charge, reclaim and record VAT](https://www.gov.uk/charge-reclaim-record-vat)
- [GOV.UK - VAT rates](https://www.gov.uk/vat-rates)

### Canadá

- [CRA - GST/HST rates and place of supply](https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/gst-hst-businesses/charge-collect-place-supply.html)
- [CRA - Charge and collect GST/HST](https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/gst-hst-businesses/charge-collect-which-rate.html)
- Autoridad provincial para PST/QST cuando se implemente ese componente.

La ficha provincial debe declarar si el total mostrado contiene solo GST/HST o
también un impuesto provincial separado. `Canada tax` no es un único concepto.

### Australia

- [ATO - GST overview](https://www.ato.gov.au/about-ato/research-and-statistics/in-detail/tax-gap/a-h-tax-gaps/goods-and-services-tax-gap/overview)

### Nueva Zelanda

- [Inland Revenue - Charging GST](https://www.ird.govt.nz/gst/charging-gst)

### Irlanda

- [Revenue - Current VAT rates](https://www.revenue.ie/en/vat/vat-rates/search-vat-rates/current-VAT-rates.aspx)
- [Revenue - VAT rates](https://www.revenue.ie/en/vat/vat-rates/index.aspx)

## Modelo de datos

```ts
type IndirectTaxSystem = "vat" | "gst" | "gst-hst" | "sales-tax" | "iva";

interface IndirectTaxRuleSet {
  system: IndirectTaxSystem;
  jurisdictionCode: string;
  placeOfSupplyRequired: boolean;
  components: Array<{
    id: string;
    authorityLevel: "national" | "state" | "province" | "local";
    calculation: "additive" | "compound";
    rates: Array<{
      id: string;
      labelKey: string;
      value: number;
      classification: "standard" | "reduced" | "zero" | "manual";
      effectiveFrom: string;
      effectiveTo?: string;
      sourceRefs: string[];
    }>;
  }>;
  excludedComponents: string[];
}
```

No representar GST + PST como una sola tasa salvo que la autoridad la trate
como HST. El cálculo compuesto debe declarar la base de cada componente.

## Fórmulas

### Tasa única o suma aditiva sobre la misma base

```text
impuesto = redondear_segun_regla(base * tasa / 100)
total = base + impuesto

base_incluida = total / (1 + tasa / 100)
impuesto_incluido = total - base_incluida
```

### Componentes

```text
impuesto_componente_i = calcular(base_definida_por_i, tasa_i)
impuesto_total = suma(impuesto_componente_i)
total = base + impuesto_total
```

No sumar tasas primero si algún componente usa base compuesta o redondeo propio.

Para presets oficiales pueden mostrarse atajos explicativos, por ejemplo GST
incluido australiano `total / 11` o GST neozelandés `total * 3 / 23`, pero el
motor conserva la fórmula general y la política oficial de redondeo.

## Flujo de UI

1. País/sistema.
2. Estado, provincia o place of supply si aplica.
3. Tipo de transacción soportada: doméstica simple por defecto.
4. Clasificación/tasa con fuente y vigencia.
5. Modo `add tax` o `extract included tax`.
6. Importe.
7. Resultado por componente, cobertura y limitaciones.

Reglas:

- Valor inicial del país: `Choose a country`, no México.
- Cambiar país borra tasa, moneda, importe formateado e historial incompatible.
- El label cambia entre VAT, GST, GST/HST, sales tax e IVA.
- US no aparece dentro de una lista llamada `VAT country`.
- Una tasa manual se etiqueta `Manual simulation`; no hereda fuente o vigencia
  del país.
- Si el país no está soportado, permitir aritmética manual solo después de una
  confirmación y sin canonical indexable específico.

## Estados de cobertura

| Estado | Ejemplo | Comportamiento |
| --- | --- | --- |
| `official-simple` | UK VAT doméstico con tasa elegida | Calcula y muestra fuente. |
| `official-components` | HST Ontario | Calcula componentes soportados. |
| `partial` | GST federal canadiense sin PST provincial | Calcula, enumera lo excluido junto al total. |
| `manual` | tasa local US introducida | Simulación sin afirmación oficial. |
| `blocked` | localidad US sin dataset y sin tasa | No calcula como si fuera 0%. |

## SEO

- El hub usa `VAT, GST and sales tax calculator by country`.
- Cada landing usa el término local y el país.
- No crear cientos de páginas de localidad US con contenido generado de una
  base comercial.
- Las tasas nunca se insertan en title si no hay proceso de actualización antes
  de su cambio.
- Los artículos existentes sobre México/España/Latinoamérica pueden enlazar al
  nuevo hub, pero deben seleccionar el contexto correcto mediante UI, no por un
  default escondido.

## Pruebas mínimas

- Add y extract son inversos dentro de la tolerancia de redondeo.
- Base cero, tasa cero y valores límite.
- UK 20%, AU 10%, NZ 15% e IE 23% con fixtures aritméticos.
- Canadá selecciona 5/13/14/15 según dataset y no inventa PST/QST.
- US sin jurisdicción no calcula.
- `manual` nunca se serializa como `official`.
- Cambiar país invalida resultado e historial.
- Cada rate vigente tiene fuente y fechas.
- Tasas efectivas no se solapan dentro de la misma clasificación/jurisdicción.
- No quedan labels españoles en variantes EN.

## Criterios de aceptación

- El usuario sabe qué impuesto calcula antes de introducir el importe.
- La tasa procede del mercado y jurisdicción, no del idioma.
- El total enumera todos los componentes incluidos y excluidos.
- US deja de presentarse como VAT.
- El hub no selecciona México automáticamente.
