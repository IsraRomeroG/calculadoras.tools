# 05 - Vacaciones, final pay y redundancy por jurisdicción

## Objetivo

Eliminar la reutilización de vacaciones, aguinaldo, prima vacacional e
indemnizaciones mexicanas en mercados donde esos conceptos no existen o se
calculan de otra manera.

Se crean tres capacidades distintas:

1. `paid-leave`: días/horas y, cuando sea soportado, holiday/vacation pay.
2. `final-pay`: salarios y prestaciones devengadas al terminar.
3. `redundancy`: pago estatutario o contractual por una causa compatible.

No toda jurisdicción ofrece las tres.

## Regla central

La selección `I was dismissed` nunca activa automáticamente severance,
redundancy o indemnización. Primero se valida jurisdicción, motivo jurídico,
antigüedad, régimen, exclusiones y base salarial.

Cada concepto usa uno de estos estados:

```txt
calculated-official
calculated-contractual
manual-scenario
not-applicable
not-determined
out-of-scope
```

## Estados Unidos

### Alcance permitido

- La FLSA federal no exige vacaciones, holiday pay o severance generales.
- Publicar `US PTO accrual calculator`, no `statutory vacation entitlement`.
- Inputs contractuales: horas/días otorgados, frecuencia de accrual, carryover,
  saldo inicial y uso.
- Un resultado contractual no se etiqueta derecho federal.
- Final pay, PTO payout, notice y severance requieren estado y dataset estatal
  o término contractual.

### Comportamiento

- Sin estado: bloquear todo cálculo legal de terminación.
- Estado sin dataset: ofrecer solo inventario manual de cantidades, sin total
  `legally owed`.
- No crear un preset nacional con cero vacaciones: ausencia de mínimo federal
  no equivale a que una política o ley estatal no aplique.

Fuentes:

- [US Department of Labor - What the FLSA does not require](https://webapps.dol.gov/elaws/whd/flsa/screen6.asp)
- [US Department of Labor - Vacation pay FAQ](https://webapps.dol.gov/elaws/faq/esa/flsa/006.htm)

## Reino Unido / Great Britain

### Holiday entitlement

MVP:

- trabajador regular con días u horas semanales;
- leave year explícito;
- inicio/terminación a mitad del leave year;
- mínimo equivalente a 5.6 semanas, con cap de 28 días para quien trabaja cinco
  o más días por semana;
- accrued/used/carried balance;
- irregular-hours/part-year solo con el método vigente y periodo soportado.

La regla 12.07% no puede aplicarse universalmente: depende del tipo de trabajador
y del inicio del leave year. Debe ser una estrategia separada.

Fuente:

- [GOV.UK - Calculate leave entitlement](https://www.gov.uk/holiday-entitlement-rights/calculate-leave-entitlement)

### Statutory redundancy

MVP Great Britain:

- elegibilidad después de 2 años;
- edad durante cada año completo de servicio;
- 0.5 semana por año bajo 22, 1 semana entre 22 y 40, 1.5 semanas desde 41;
- máximo 20 años computables;
- average weekly pay y cap del periodo;
- exclusiones y suitable alternative work como preguntas de alcance;
- notice/holiday/final wages separados del redundancy total.

Referencia para terminaciones desde 6 abril 2026, a verificar al implementar:
weekly pay cap GBP 751 y máximo GBP 22,530.

Fuente:

- [GOV.UK - Statutory redundancy pay](https://www.gov.uk/redundancy-your-rights/redundancy-pay)
- [GOV.UK - Tax on termination payments](https://www.gov.uk/termination-payments-and-tax-when-you-leave-a-job/what-you-pay-tax-and-national-insurance-on)

La variante se rotula Great Britain mientras no se verifique cobertura laboral
equivalente para Northern Ireland.

## Canadá

### Selector jurisdiccional obligatorio

Primera pregunta laboral:

`Is your workplace federally regulated?`

- `yes`: reglas del Canada Labour Code.
- `no`: provincia/territorio obligatorio.
- `not sure`: bloquear y enlazar el listado oficial de industrias.

No aplicar reglas federales como default a toda Canadá.

Fuente de alcance:

- [Canada.ca - Federally regulated industries and workplaces](https://www.canada.ca/en/services/jobs/workplace/federally-regulated-industries.html)

### Federal annual vacation

Preset federal inicial:

- 1 año: al menos 2 semanas y vacation pay 4%;
- 5 años: 3 semanas y 6%;
- 10 años: 4 semanas y 8%.

Fuente:

- [Canada.ca - Labour Bulletin March 2026](https://www.canada.ca/en/employment-social-development/corporate/portfolio/labour/bulletin/march-2026.html)

### Federal termination/severance

- Notice mínimo conforme a antigüedad o wages in lieu.
- Severance solo después de 12 meses y bajo condiciones soportadas.
- Severance federal: mayor entre 2 días de salario por año completo o 5 días.
- Wages, vacation pay, notice y severance se muestran por separado.
- Just cause, fixed term, resignation y temporary lay-off son gates, no simples
  etiquetas.

Fuente:

- [Canada.ca - Termination, layoff or dismissal](https://www.canada.ca/en/services/jobs/workplace/federal-labour-standards/termination.html)

Las variantes provinciales permanecen `draft` hasta tener fuentes y fixtures de
cada employment standards authority.

## Australia

### Annual leave

MVP NES:

- empleados cubiertos distintos de casual;
- 4 semanas por año basadas en ordinary hours;
- 5 semanas para shiftworkers solo cuando el instrumento aplicable lo confirme;
- accrual continuo;
- unused annual leave pagado al terminar;
- annual leave loading solo si award/agreement/contract lo exige.

Fuente:

- [Fair Work Ombudsman - Annual leave](https://www.fairwork.gov.au/tools-and-resources/fact-sheets/minimum-workplace-entitlements/annual-leave)

### Redundancy y final pay

- Confirmar cobertura del national workplace relations system.
- Confirmar si el empleador es small business y si existe excepción.
- Confirmar award/enterprise agreement o limitar el resultado a NES.
- Tabla NES versionada: 4, 6, 7, 8, 10, 11, 13, 14, 16 y 12 semanas según
  años de servicio.
- Base pay rate por ordinary hours; excluir bonuses, loadings, allowances,
  overtime y penalty rates de la base NES.
- Notice, unused leave y long service leave separados; este último puede
  depender de estado/territorio.

Fuentes:

- [Fair Work Ombudsman - Redundancy pay](https://www.fairwork.gov.au/ending-employment/redundancy/redundancy-pay)
- [Fair Work Ombudsman - Final pay](https://www.fairwork.gov.au/ending-employment/final-pay)

Un award con esquema específico produce `out-of-scope` hasta tener adapter; no
se fuerza la tabla NES.

## Nueva Zelanda

### Holiday pay

- 4 semanas después de 12 meses de empleo continuo.
- Ordinary weekly pay frente a average weekly earnings: pagar el mayor cuando
  corresponda.
- Si termina antes del aniversario o existe part-year desde el último
  aniversario: 8% de gross earnings menos cantidades ya pagadas aplicables.
- Pay-as-you-go 8% solo para relaciones que legalmente califican y con acuerdo.
- Public holidays/alternative holidays se mantienen separados.

Fuentes:

- [Employment New Zealand - Annual holiday pay](https://www.employment.govt.nz/pay-and-hours/pay-and-wages/leave-and-holiday-pay/annual-holiday-pay)
- [Employment New Zealand - Final pay](https://www.employment.govt.nz/pay-and-hours/pay-and-wages/final-pay)

### Redundancy

No existe una compensación estatutaria general que se pueda calcular con años de
servicio. Depende del employment agreement o negociación.

- La ruta es `new-zealand-final-pay-calculator`, no `statutory redundancy`.
- Permitir un importe/fórmula contractual manual identificado.
- Si el acuerdo no contiene compensación, mostrar `No contractual redundancy
  amount entered`, no afirmar una determinación legal universal.

Fuente:

- [Employment New Zealand - Redundancy](https://www.employment.govt.nz/ending-employment/redundancy)

## Irlanda

### Annual leave

Calcular las tres vías estatutarias y otorgar la mayor compatible:

1. 4 working weeks al alcanzar 1,365 horas, salvo año en que cambia empleo;
2. 1/3 de una working week por mes con al menos 117 horas;
3. 8% de horas trabajadas, con máximo de 4 working weeks.

En terminación sí puede monetizarse el mínimo no usado. Beneficios contractuales
adicionales se capturan aparte.

Fuente:

- [Workplace Relations Commission - Annual Leave](https://www.workplacerelations.ie/en/what_you_should_know/leave/annual-leave/)

### Statutory redundancy

- Edad mínima 16.
- 104 semanas de continuous service.
- Fully insurable employment.
- Situación jurídica de redundancy, no dismissal genérico.
- 2 semanas de gross pay por año de servicio + 1 bonus week.
- Weekly pay cap EUR 600 para el periodo actualmente documentado.
- Notice por antigüedad se calcula separado.

Fuentes:

- [WRC - Redundancy](https://www.workplacerelations.ie/en/what_you_should_know/ending%20the%20employment%20relationship/redundancy/)
- [WRC - Minimum Notice](https://www.workplacerelations.ie/en/what_you_should_know/ending%20the%20employment%20relationship/minimum%20notice/minimum_notice.html)

## Modelo de reglas

```ts
interface LeaveRuleSet {
  entitlementUnit: "days" | "hours" | "weeks" | "percentage-of-earnings";
  eligibility: ConditionRule[];
  accrualStrategies: AccrualStrategy[];
  payStrategies: PayStrategy[];
  carryRules: CarryRule[];
  terminationRules: TerminationLeaveRule[];
}

interface TerminationRuleSet {
  supportedReasons: string[];
  eligibility: ConditionRule[];
  noticeRules: NoticeRule[];
  finalPayComponents: ComponentRule[];
  redundancyRules: ComponentRule[];
  taxTreatment?: ComponentRule[];
  exclusions: ConditionRule[];
}
```

El motor mexicano puede implementar estas interfaces mediante adapter, pero sus
campos `annualBonus`, `vacationPremium`, `seniorityPremium`, `threeMonths` y
`twentyDays` no forman parte de una interfaz universal.

## UX y seguridad

- Mostrar alcance laboral antes de fechas/salario.
- Pedir working pattern, employment type y jurisdicción solo cuando la regla lo
  necesite.
- Separar `earned final pay` de `conditional redundancy/severance`.
- No mostrar cero para un concepto `not-determined`.
- No sumar escenarios manuales al total oficial sin confirmación.
- Mostrar gross/net y tratamiento fiscal por separado; esta calculadora no
  reutiliza automáticamente la tasa de income tax.
- En resultados compartidos incluir jurisdicción, versión, supuestos y estados
  de cada concepto.

## Pruebas mínimas

### Comunes

- Fechas civiles inclusivas y aniversarios, incluidos 29 de febrero.
- Cambiar jurisdicción invalida el resultado.
- Conceptos `not-determined` no se convierten en cero.
- Ningún rule set no mexicano contiene aguinaldo o prima vacacional.
- Ningún dismissal activa redundancy automáticamente.

### País

- US sin estado solo calcula accrual contractual, no derecho legal.
- GB prueba edades que cruzan 22 y 41 durante los años computables, 20-year cap
  y weekly pay cap.
- Canadá federal prueba 3/12 meses, notice, mínimo de 5 días y 2 días por año.
- Australia prueba cada fila NES y la caída de 16 a 12 semanas a 10 años.
- NZ prueba OWP frente a AWE, 8% part-year y holiday extension en final pay.
- Irlanda compara los tres métodos de leave y prueba 104 semanas/cap/bonus week.

## Criterios de aceptación

- Cada variante describe exactamente la jurisdicción cubierta.
- Los casos contractuales, estatutarios y manuales no se mezclan.
- No se usa la LFT mexicana fuera de `mx-en`.
- El usuario puede reproducir cada componente con fórmula, inputs y fuente.
- Un caso fuera del MVP se bloquea y dirige a la autoridad correcta.
