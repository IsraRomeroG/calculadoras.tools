# 04 - Income tax y take-home pay por mercado

## Objetivo

Crear dos familias distintas:

1. `income-tax`: estimación anual o retención con alcance declarado.
2. `take-home-pay`: pago bruto menos impuestos, aportaciones del trabajador y
   deducciones incluidas.

La segunda puede reutilizar motores de la primera, pero no puede llamarse
`take-home pay` completo si omite contribuciones obligatorias conocidas.

## Regla de cobertura

Cada resultado lleva uno de estos labels visibles:

- `Annual income-tax estimate`;
- `Payroll withholding estimate`;
- `Take-home pay estimate`;
- `Partial take-home pay — excluded items listed`;
- `Manual simulation`.

No mezclar impuesto anual y withholding periódico en una sola cifra sin
explicar la diferencia.

## Requisitos por mercado

### Estados Unidos

#### Income tax

- Año calendario y tax year.
- Filing status.
- Taxable income anual.
- Standard deduction o deducción informada, sin aplicarla dos veces.
- Brackets federales versionados.
- Credits solo si están implementados con condiciones completas.
- Resultado explícito `Federal only` mientras no exista estado/localidad.

#### Paycheck

- Frecuencia de pago.
- Datos necesarios de Form W-4 o un modo simplificado claramente parcial.
- Federal income tax withholding según Publication 15-T/15 vigente.
- Social Security del trabajador.
- Medicare y Additional Medicare withholding.
- State/local withholding solo para jurisdicciones con dataset publicado.
- Deducciones pre-tax/post-tax configurables, con tratamiento no inferido.

Referencia 2026 a verificar al implementar:

- Social Security: 6.2% del trabajador hasta la wage base de USD 184,500.
- Medicare: 1.45%; Additional Medicare withholding de 0.9% sobre salarios que
  exceden USD 200,000 para withholding del empleador.

Fuentes:

- [IRS - Tax withholding](https://www.irs.gov/payments/tax-withholding)
- [IRS - Publication 15, 2026](https://www.irs.gov/publications/p15)
- [IRS - Social Security and Medicare withholding](https://www.irs.gov/taxtopics/tc751)
- [IRS - Federal income-tax rates and brackets](https://www.irs.gov/filing/federal-income-tax-rates-and-brackets)

### Reino Unido

#### Income tax

- Tax year `2026-27`, no `2026` ambiguo.
- Tax region: Scotland o England/Wales/Northern Ireland.
- Personal Allowance y taper por adjusted net income.
- Bands regionales.
- Ingreso no salarial fuera de alcance visible en el MVP.

#### Take-home pay

- PAYE y tax code; modo estándar `1257L` solo si el usuario lo confirma.
- Employee National Insurance por category letter; `A` puede ser el default
  explicado, no una verdad universal.
- Pension salary sacrifice u otras deducciones solo mediante reglas explícitas.
- Student loan/postgraduate loan como módulos opcionales versionados.

Fuentes:

- [GOV.UK - Income Tax rates and allowances](https://www.gov.uk/income-tax-rates/current-rates-and-allowances)
- [GOV.UK - Scottish Income Tax](https://www.gov.uk/scottish-income-tax)
- [GOV.UK - National Insurance rates](https://www.gov.uk/national-insurance/how-much-you-pay)
- [GOV.UK - Employer rates and thresholds 2026-27](https://www.gov.uk/guidance/rates-and-thresholds-for-employers-2026-to-2027)

### Canadá

#### Income tax

- Año calendario.
- Provincia/territorio de residencia.
- Federal + provincial/territorial como filas separadas.
- Basic personal amounts y créditos solo con dataset completo.
- Quebec usa adapter propio; no se trata como otra tabla T4032 genérica.

#### Paycheck

- Provincia/territorio de empleo.
- Federal/provincial withholding.
- CPP/CPP2 o QPP/QPP2 según corresponda.
- EI o QPIP cuando aplique.
- Frecuencia y claim codes/TD1 soportados.

Fuentes:

- [CRA - Current tax rates and brackets 2026](https://www.canada.ca/en/revenue-agency/services/tax/individuals/tax-rates-brackets/current-year.html)
- [CRA - T4032 payroll deductions tables](https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/payroll/t4032-payroll-deductions-tables.html)
- [CRA - Calculate payroll deductions](https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/payroll/calculating-deductions.html)

### Australia

#### Income tax

- Income year `2026-27`.
- Residency status soportado.
- Tax-free threshold y brackets del periodo.
- Medicare levy separada del income tax.
- Offsets solo cuando estén implementados por completo.

#### Take-home pay

- PAYG withholding 2026.
- Medicare levy como proyección anual; explicar diferencias frente a
  withholding.
- HELP/study and training loans opcionales.
- Superannuation patronal se muestra informativa y no se resta del neto salvo
  un supuesto salarial explícito.

Fuentes:

- [ATO - 2026 PAYG withholding tax tables](https://softwaredevelopers.ato.gov.au/PAYGWTaxtables)
- [ATO - Medicare levy](https://www.ato.gov.au/myTax25MedicareLevy)
- [Treasury Laws Amendment (More Cost of Living Relief) Act 2025](https://www.ato.gov.au/law/view/pdf/acts/20250028.pdf)

### Nueva Zelanda

#### Income tax

- Income year `2026-27`.
- Brackets individuales vigentes desde 1 abril 2025 mientras sigan aplicables.
- Fuente principal/secundaria y tax code cuando se estime PAYE.

#### Take-home pay

- PAYE por tablas IR340/IR341 del periodo.
- ACC earners' levy del periodo y earnings cap.
- KiwiSaver y student loan opcionales, nunca activados sin datos.
- Resultado parcial si se omiten esos conceptos.

Referencia 2026-27 a verificar al implementar: ACC earners' levy 1.75% hasta
NZD 156,641.

Fuentes:

- [Inland Revenue - Individual tax rates](https://www.ird.govt.nz/en/income-tax/income-tax-for-individuals/tax-codes-and-tax-rates-for-individuals/tax-rates-for-individuals)
- [Inland Revenue - PAYE lump sum rates and ACC levy](https://www.ird.govt.nz/calculate-lump-sum-paye)
- [Inland Revenue - ACC earners' levy](https://www.ird.govt.nz/acclevy)

### Irlanda

#### Income tax

- Año calendario 2026.
- Basis of assessment/marital status soportado.
- Standard rate band y higher rate.
- Tax credits introducidos o derivados explícitamente.

#### Take-home pay

- PAYE Income Tax.
- USC por bandas.
- PRSI por clase; Class A solo después de confirmación.
- Acumulativo frente a Week 1 basis visible.
- Credits y rate band desde Tax Credit Certificate cuando el usuario los tenga.

Fuentes:

- [Revenue - Calculating your Income Tax](https://www.revenue.ie/en/jobs-and-pensions/calculating-your-income-tax/index.aspx)
- [Revenue - 2026 tax rates, bands and reliefs](https://www.revenue.ie/en/personal-tax-credits-reliefs-and-exemptions/tax-relief-charts/index.aspx)
- [Revenue - PRSI](https://www.revenue.ie/en/employing-people/paying-your-employees-tax-to-revenue/prsi.aspx)
- [Department of Social Protection - PRSI rates 2026](https://www.gov.ie/en/collection/06bf07-prsi-contribution-rates-and-user-guide-sw14/)

## Modelo de reglas

```ts
interface IncomeTaxRuleSet {
  taxPeriod: TaxPeriod;
  calculationModes: Array<"annual-liability" | "payroll-withholding">;
  requiredInputs: string[];
  brackets: TaxBracket[];
  allowances: AllowanceRule[];
  credits: CreditRule[];
  regionalTaxes: TaxComponent[];
  rounding: RoundingPolicy;
}

interface PayrollRuleSet {
  taxRuleSetRef: string;
  frequencies: PayrollFrequency[];
  employeeContributions: ContributionRule[];
  employerContributions: ContributionRule[];
  optionalModules: string[];
  excludedByDefault: string[];
}
```

`PayrollRuleSet` referencia la regla fiscal compatible por ID y periodo; no
importa constantes de otro país ni copia tablas.

## Inputs comunes

- País y jurisdicción.
- Periodo fiscal/income year.
- Residencia o régimen requerido.
- Filing/assessment/tax-code context.
- Importe y significado: gross pay, taxable pay o taxable income.
- Frecuencia.
- Ingresos recurrentes y únicos separados.
- Deducciones, allowances y credits solo si el preset declara su tratamiento.

El formulario no muestra todos los campos de todos los países. Cada variante
deriva un esquema tipado de `requiredInputs`.

## Outputs

### Income tax

- Taxable income/base.
- Impuesto por componente y jurisdicción.
- Marginal rate y effective rate, con denominador explicado.
- Allowances/credits aplicados.
- Annual liability o withholding, nunca etiqueta ambigua `tax` solamente.
- Componentes no incluidos.

### Take-home pay

- Gross cash pay.
- Taxable base por componente.
- Income-tax withholding.
- Aportaciones del trabajador.
- Deducciones introducidas.
- Net pay por periodo.
- Proyección anual separando pagos únicos.
- Employer contributions informativas.
- Coverage y missing concepts junto al neto.

## Reglas de seguridad

- No mostrar USD/GBP/CAD/AUD/NZD/EUR con tablas MXN.
- No convertir brackets por tipo de cambio.
- No anualizar un bono único.
- No inferir filing status, tax code, PRSI class o provincia.
- No llamar refund a la diferencia entre una estimación y withholding sin
  incluir el conjunto de datos necesario.
- Los periodos históricos se seleccionan conscientemente y conservan su fuente.
- Cuando cambie el periodo, el resultado anterior queda stale.

## Pruebas

### Por dataset

- Fixtures oficiales reproducidos sin redondeo prematuro.
- Cada límite de bracket: justo debajo, en el límite y justo arriba.
- Allowance/credit: cero, parcial, completo y phase-out.
- Frecuencias y número de periodos por año.
- Componentes con caps/floors.
- Employee vs employer: solo employee reduce net pay.
- Resultados de regiones distintas difieren cuando la ley difiere.

### Cross-market

- Un mismo gross produce ruleSet, currency y desglose distintos en cada país.
- Nunca se carga `MEXICO_ISR_PRESET` fuera de `mx-en`.
- Cambiar locale sin cambiar mercado no altera números.
- Cambiar mercado invalida números y fuentes.
- Un preset parcial no renderiza `complete take-home pay`.

## Criterios de aceptación

- Cada calculadora identifica si estima liability, withholding o net pay.
- Todos los componentes obligatorios incluidos están versionados y citados.
- Lo omitido aparece junto al resultado principal.
- Las variantes US, GB, CA, AU, NZ e IE no comparten reglas mexicanas.
- Las cifras pueden reproducirse contra fixtures de la autoridad competente.
