# Especificación v2 - Calculadora de salario neto por país

## Descripción general

Herramienta para estimar cuánto recibe una persona después de impuestos,
aportaciones del trabajador y deducciones de nómina según el país, jurisdicción,
periodo fiscal, base salarial y frecuencia de pago seleccionados.

El resultado es una **estimación informativa de nómina**. No representa un
recibo oficial, una determinación fiscal ni una asesoría profesional.

**Arquitectura:** el cálculo ocurre en el cliente usando datasets locales
versionados. No requiere backend ni llamadas a APIs externas, pero las tablas,
fuentes y reglas deben revisarse periódicamente. La interfaz debe indicar cuándo
se calculó con reglas vigentes, históricas, manuales o incompletas.

**Alcance inicial:** México como país con preset completo. La arquitectura debe
permitir agregar otros países sin asumir que todos usan las mismas bases,
frecuencias, créditos fiscales o aportaciones.

---

## Objetivo de producto

- Convertir salario bruto a salario neto estimado.
- Explicar impuestos, créditos fiscales, aportaciones del trabajador y
  deducciones por separado.
- Comparar el neto por pago, el equivalente mensual y la proyección anual bajo
  supuestos explícitos.
- Permitir simular salario mensual o anual sin cambiar accidentalmente el
  significado del importe introducido.
- Informar claramente la vigencia, fuente, versión y supuestos de cada preset.
- Ofrecer un modo manual claramente etiquetado cuando no exista un preset
  completo y vigente.
- Generar una página estática optimizada para SEO en Astro y usable en móvil.

---

## Definiciones de cálculo

La calculadora debe diferenciar estas magnitudes:

- **Salario base:** importe fijo de la relación laboral.
- **Ingreso efectivo del periodo:** dinero o prestaciones monetizables que se
  reciben en el periodo, incluyendo conceptos exentos cuando se paguen a la
  persona.
- **Ingreso gravable:** parte del ingreso efectivo que forma parte de la base
  del impuesto local.
- **Base de seguridad social:** base utilizada para calcular las aportaciones
  sociales; puede ser distinta del salario real o de la base fiscal.
- **Deducción pre-fiscal:** concepto que reduce la base fiscal únicamente cuando
  las reglas del país lo permiten.
- **Aportación del trabajador:** importe que sí se descuenta del pago de la
  persona.
- **Aportación patronal:** importe informativo que no se resta del salario neto.
- **Crédito o subsidio fiscal:** importe que reduce el impuesto o aumenta el
  neto, según las reglas locales.
- **Deducción post-fiscal:** descuento que se resta después de calcular el
  impuesto, por ejemplo ciertos préstamos, seguros o retenciones judiciales.

No se debe usar `bruto_gravable` como base universal para todas las reglas.
Cada impuesto y aportación debe declarar explícitamente su base y unidad.

---

## Alcance recomendado

### MVP México

- País, jurisdicción aplicable y periodo fiscal.
- Salario expresado como mensual, anual o por periodo.
- Frecuencia de pago: 7 días, 15 días, mensual y anual como mínimo. La lista
  debe depender del dataset seleccionado.
- Bonos del periodo, distinguiendo recurrentes de pagos únicos.
- Prestaciones gravables y exentas con captura separada.
- ISR de salarios mediante tarifa oficial con cuota fija y porcentaje sobre el
  excedente del límite inferior.
- Subsidios o créditos fiscales aplicables.
- Aportaciones del trabajador verificadas para el preset.
- Deducciones post-fiscales editables.
- Resultado neto por pago, equivalente mensual y proyección anual.
- Desglose de todos los conceptos y tasas efectivas claramente definidas.
- Preset local vigente para México.
- Modo manual con advertencia de simulación.

Si las aportaciones de seguridad social no están verificadas para un caso,
el producto no debe presentarlo como salario neto completo. Debe mostrar un
resultado parcial, por ejemplo “neto después de ISR”, e indicar qué conceptos
faltan.

### Fase 2

- Más países y jurisdicciones.
- Páginas indexables por país y periodo.
- Comparador de ofertas laborales con normalización anual.
- Prestaciones, exenciones y topes avanzados.
- Situaciones laborales específicas por país.
- Exportación y compartición del desglose.
- Cálculo inverso de salario bruto necesario para alcanzar un neto objetivo.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL pública recomendada | `/legal-impuestos/calculadora-salario-neto` |
| Archivo Astro recomendado | `src/pages/legal-impuestos/calculadora-salario-neto.astro` |
| Lógica de cálculo | `src/lib/calculators/legal-impuestos/calculadora-de-salario-neto/netSalary.ts` |
| Motor fiscal reutilizable | `src/lib/calculators/legal-impuestos/calculadora-isr-irpf/` |
| Reglas locales | `src/lib/calculators/legal-impuestos/calculadora-de-salario-neto/rules/{pais}/{jurisdiccion}/{periodo}.ts` |
| Pruebas unitarias | `src/lib/calculators/legal-impuestos/calculadora-de-salario-neto/netSalary.test.ts` |
| Categoría | `legal-impuestos` |
| Locale inicial | `es-MX` |

La calculadora de salario neto debe reutilizar el motor de la calculadora de
ISR/IRPF cuando sea compatible, pero no debe forzar que las aportaciones
sociales utilicen la misma base o periodicidad.

---

## Modelo de datos y vigencia

Cada dataset debe declarar la información legal, temporal y de cálculo necesaria:

```ts
interface SalaryRuleSet {
  countryCode: string;
  country: string;
  jurisdictionCode?: string;
  jurisdiction?: string;
  regime: string;
  period: string;
  currency: string;
  locale: string;
  effectiveFrom: string;
  effectiveTo?: string;
  publishedAt: string;
  reviewedAt: string;
  sourceUrl: string;
  sourceName: string;
  sourceVersion?: string;
  status: "current" | "historical" | "expired" | "draft";
  supportedFrequencies: PayrollFrequency[];
  salaryBasis: "period" | "monthly" | "annual";
  taxRules: TaxRule[];
  contributionRules: ContributionRule[];
  taxCreditRules: TaxCreditRule[];
  requiredInputs: RequiredSalaryInput[];
  assumptions: string[];
  rounding: RoundingPolicy;
}

type PayrollFrequency = {
  id: string;
  label: string;
  days?: number;
  periodsPerYear?: number;
  taxTableKey: string;
};

interface TaxRule {
  id: string;
  name: string;
  basis: "taxableIncome" | "annualTaxableIncome" | "custom";
  frequency: string;
  brackets: TaxBracket[];
  deductions?: DeductionRule[];
}

interface TaxBracket {
  lowerBound: number;
  upperBound?: number;
  fixedAmount: number;
  marginalRate: number;
}

interface ContributionRule {
  id: string;
  name: string;
  payer: "employee" | "employer";
  basis: "grossCash" | "taxableIncome" | "socialSecurityBase" | "custom";
  rate?: number;
  fixedAmount?: number;
  cap?: number;
  floor?: number;
  conditions?: string[];
}

interface TaxCreditRule {
  id: string;
  name: string;
  basis: "tax" | "taxableIncome" | "custom";
  amount?: number;
  rate?: number;
  cap?: number;
  conditions?: string[];
}
```

Requisitos de los datasets:

- Mostrar país, jurisdicción, régimen, periodo, moneda, fecha de revisión,
  versión y enlace a la fuente oficial.
- Validar que las reglas tengan fuentes, fechas, unidades y periodicidades
  compatibles antes de marcar el preset como `current`.
- No reutilizar automáticamente reglas de un periodo para otro.
- Un preset `draft` o `expired` no puede calcular como preset vigente.
- Un preset `historical` puede calcular si el usuario selecciona explícitamente
  el periodo y debe mostrarse como histórico.
- Las modificaciones posteriores de la fuente deben crear una nueva versión o
  actualizar el dataset con trazabilidad.
- Si faltan aportaciones o créditos para un supuesto, el resultado debe indicar
  que es parcial.

### Fuentes iniciales para México

- [SAT - Normatividad RMF 2026](https://www.sat.gob.mx/minisitio/NormatividadRMFyRGCE/normatividad_rmf_rgce2026.html)
- [SAT - Anexo 8 de la RMF 2026, tarifas de ISR](https://www.sat.gob.mx/minisitio/NormatividadRMFyRGCE/documentos2026/rmf/anexos/Anexo-8-RMF-2026_DOF-28122025.pdf)
- [SAT - Manual laboral y fiscal 2026, subsidio para el empleo](https://www.sat.gob.mx/minisitio/RepartodeUtilidades/documentos/manuallaboralfiscal2026.pdf)
- [IMSS - Sistema Único de Autodeterminación y conceptos de cuotas](https://www.imss.gob.mx/patrones/sua/que-es-sua)

Las cotizaciones, topes, bases y subsidios deben incorporarse únicamente después
de verificar su fuente oficial específica, condiciones de aplicación y fecha de
vigencia.

---

## Comportamiento mobile-first

La pantalla inicial debe mostrar únicamente las decisiones necesarias para un
primer resultado:

1. País y periodo fiscal.
2. Salario bruto y base del importe: mensual, anual o por periodo.
3. Frecuencia de pago.
4. Acción “Calcular salario neto” o cálculo inmediato con resultado accesible.

Los ajustes secundarios deben estar dentro de una sección “Ajustes avanzados”
colapsable:

- bonos recurrentes y bonos únicos;
- prestaciones gravables y exentas;
- base de seguridad social, si aplica;
- deducciones pre-fiscales y post-fiscales;
- situación laboral o residencia requerida por el preset.

Después del formulario, en este orden, mostrar:

- salario neto estimado por pago;
- equivalente mensual, si puede calcularse con la frecuencia seleccionada;
- proyección anual de pagos;
- desglose expandible por impuesto, crédito, aportación del trabajador,
  aportación patronal informativa y deducción;
- supuestos, fuente, vigencia y advertencia.

Requisitos de interfaz:

- Usar controles de al menos 44 px de alto y campos con `inputmode="decimal"`.
- Evitar tablas anchas; usar filas expandibles o tarjetas. Si una tabla es
  imprescindible, permitir desplazamiento horizontal sin romper el layout.
- Mantener el neto y el aviso de estimación visibles tras calcular.
- Usar `aria-live` para anunciar cambios en el resultado y mensajes de error.
- Mostrar el resultado principal antes de contenido editorial, anuncios o FAQ.
- No depender únicamente del color para distinguir impuestos, aportaciones y
  créditos.
- Mantener botones de limpiar, copiar y compartir accesibles sin ocultarlos en
  menús difíciles de usar en móvil.

---

## Flujo principal MVP

### Inputs del MVP

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| País | Selector | presets disponibles, manual | México |
| Jurisdicción | Selector o texto | según preset | la del preset |
| Régimen o tipo de trabajador | Selector | según preset | el primero disponible |
| Periodo fiscal | Selector | datasets disponibles | vigente |
| Base del salario | Selector | mensual, anual, por periodo | mensual |
| Frecuencia de pago | Selector | frecuencias del dataset | mensual |
| Salario bruto | Texto numérico | `> 0` | vacío |
| Bonos recurrentes del periodo | Texto numérico | `>= 0` | `0` |
| Bono único del periodo | Texto numérico | `>= 0` | `0` |
| Prestaciones gravables del periodo | Texto numérico | `>= 0` | `0` |
| Prestaciones exentas recibidas | Texto numérico | `>= 0` | `0` |
| Deducciones pre-fiscales | Texto numérico | `>= 0` | `0` |
| Deducciones post-fiscales | Texto numérico | `>= 0` | `0` |
| Base de seguridad social | Texto numérico | `>= 0`, si aplica | automática o vacía |

Los campos que no sean necesarios para el preset deben permanecer ocultos o
marcarse como no aplicables. No deben presentarse inputs irrelevantes por
defecto en móvil.

### Outputs principales

- Salario neto estimado por pago.
- Ingreso efectivo del periodo.
- Base gravable para ISR u otro impuesto.
- Base de seguridad social, si aplica.
- Impuesto estimado antes y después de créditos fiscales.
- Aportaciones del trabajador.
- Aportaciones patronales informativas.
- Deducciones pre-fiscales y post-fiscales.
- Tasa efectiva del impuesto.
- Carga total efectiva del trabajador.
- Tasa marginal del impuesto.
- Equivalente mensual y proyección anual de pagos.
- Conceptos no contemplados, supuestos y nivel de cobertura del cálculo.

La salida debe distinguir siempre entre **impuesto estimado del periodo** y
**impuesto anual proyectado**.

---

## Fórmulas y algoritmo

```text
ingreso_efectivo_periodo =
  salario_base_periodo
  + bonos_recurrentes
  + bono_unico
  + prestaciones_gravables
  + prestaciones_exentas

base_fiscal = calcular_base_fiscal(
  ingreso_efectivo_periodo,
  reglas_de_exención,
  deducciones_pre_fiscales,
  condiciones_del_usuario
)

impuesto_bruto = calcular_tarifa(
  base_fiscal,
  tabla_de_la_frecuencia,
  cuota_fija,
  porcentaje_sobre_excedente
)

creditos_fiscales = calcular_creditos(
  base_fiscal,
  impuesto_bruto,
  reglas_del_preset
)

impuesto_neto = max(0, impuesto_bruto - creditos_fiscales)

base_seguridad_social = calcular_base_seguridad_social(
  ingreso_efectivo_periodo,
  reglas_de_integración,
  topes,
  días_del_periodo
)

aportaciones_trabajador = sumar_aportaciones(
  base_seguridad_social,
  reglas_con_payer_employee
)

aportaciones_patronales = sumar_aportaciones(
  base_seguridad_social,
  reglas_con_payer_employer
)

neto_periodo = max(0,
  ingreso_efectivo_periodo
  - impuesto_neto
  - aportaciones_trabajador
  - deducciones_post_fiscales
)

tasa_efectiva_impuesto =
  base_fiscal > 0 ? impuesto_neto / base_fiscal : 0

carga_total_efectiva =
  ingreso_efectivo_periodo > 0
    ? (impuesto_neto + aportaciones_trabajador + deducciones_post_fiscales)
      / ingreso_efectivo_periodo
    : 0
```

La conversión entre frecuencias debe utilizar la configuración del dataset,
no una constante universal. La interfaz debe informar el supuesto usado para
calcular equivalentes mensuales o anuales.

Los bonos únicos no deben anualizarse como recurrentes. Si se muestra una
proyección anual, debe indicar si incluye o excluye esos pagos extraordinarios.

### Redondeo

- Mantener precisión interna suficiente durante el cálculo.
- Aplicar la política de redondeo declarada por el dataset cuando las reglas
  oficiales lo requieran.
- Redondear cada concepto únicamente si el procedimiento oficial lo exige;
  de lo contrario, redondear el resultado final y los valores mostrados.
- Probar explícitamente diferencias entre cálculo por periodo y cálculo anual.

---

## Validaciones y estados

- No aceptar importes negativos, vacíos cuando sean obligatorios, `NaN` ni
  importes fuera del límite seguro del navegador.
- Validar separadores decimales y de miles usados en `es-MX` sin alterar el
  valor introducido silenciosamente.
- No permitir que deducciones superen el ingreso efectivo sin mostrar un error o
  advertencia clara; el neto no debe mostrarse como negativo.
- No permitir tarifas, topes o aportaciones sin unidad, fuente o periodicidad.
- Validar que los tramos estén ordenados, sin huecos ni superposiciones, y que
  el cálculo con cuota fija y excedente sea consistente.
- Mostrar si el periodo seleccionado es vigente, histórico, vencido o manual.
- Permitir calcular periodos históricos cuando exista un dataset válido, pero no
  presentarlos como vigentes.
- No calcular con un preset sin fuente, fecha de revisión o reglas completas.
- Si el cálculo es parcial, indicarlo junto al resultado principal.
- Mostrar conceptos no contemplados y permitir agregarlos manualmente sin
  atribuirles tratamiento fiscal automático.
- Aclarar que nómina, residencia, jurisdicción, contrato, base de cotización,
  situación personal e ingresos adicionales pueden cambiar el resultado.

### Estados de la interfaz

- `initial`: formulario sin salario válido.
- `invalid`: existe un error de captura o configuración.
- `partial`: resultado disponible, pero faltan conceptos del preset.
- `valid`: resultado calculado con reglas compatibles y vigentes.
- `historical`: resultado calculado con reglas de un periodo anterior.
- `manual`: resultado calculado con parámetros introducidos por el usuario.
- `blocked`: no se puede calcular por falta de fuente, reglas o vigencia.

---

## SEO y contenido

Para el MVP de México:

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de salario neto en México 2026` |
| Meta description | `Estima tu salario neto en México después de ISR, subsidios, aportaciones y deducciones, con desglose y fuentes oficiales.` |
| H1 | `Calculadora de salario neto en México` |
| Keyword principal | `calculadora salario neto` |
| Keywords secundarias | `sueldo neto`, `salario bruto a neto`, `calculadora de nómina`, `ISR de salarios` |

La página genérica no debe prometer cobertura completa de todos los países si
solo existe un preset de México. Cuando se agreguen países, crear páginas
indexables por país y periodo con contenido y canonical coherentes.

El contenido debe explicar:

- diferencia entre salario bruto, gravable y neto;
- diferencia entre retención periódica y cálculo anual;
- qué aportaciones están incluidas y cuáles no;
- fecha, versión y fuentes de las reglas;
- que el resultado es informativo y no sustituye un cálculo de nómina,
  asesoría fiscal ni información de la autoridad competente.

---

## Pruebas sugeridas

### Motor de cálculo

- Cada fixture oficial del periodo produce el impuesto esperado.
- Probar valores justo debajo, en y arriba de cada límite de tramo.
- Verificar cuota fija y porcentaje sobre excedente.
- Crédito fiscal cero, parcial y mayor que el impuesto bruto.
- Base fiscal cero produce impuesto y tasa efectiva cero.
- Base de seguridad social distinta de la base fiscal.
- Solo se restan del neto las aportaciones del trabajador.
- Las aportaciones patronales no alteran el neto.
- Deducciones pre-fiscales y post-fiscales tienen efectos distintos.
- Bonos únicos no se multiplican al proyectar el año.
- El neto nunca resulta negativo sin una advertencia explícita.

### Frecuencia y proyección

- Cambiar frecuencia conserva el equivalente anual únicamente cuando el
  dataset y el supuesto de conversión lo permiten.
- Las tarifas de 7, 15 días, mensual y anual seleccionan la tabla correcta.
- La proyección anual distingue pagos recurrentes de pagos únicos.
- Los días del periodo y el número de pagos al año quedan visibles.

### Presets y vigencia

- Un preset vencido o `draft` bloquea el cálculo como vigente y ofrece modo
  manual.
- Un preset histórico se puede consultar, pero se etiqueta como histórico.
- Un dataset sin fuente, revisión, periodicidad o reglas completas no puede
  marcarse como `current`.
- La interfaz muestra fuente, versión, vigencia, fecha de revisión y supuestos.

### Interfaz mobile first y accesibilidad

- El resultado principal aparece después del formulario sin desplazamiento
  innecesario.
- Los controles se pueden usar con teclado y lector de pantalla.
- Las filas expandibles tienen nombre, estado y foco accesibles.
- Los mensajes de error se anuncian y se asocian al campo correspondiente.
- No hay desbordamiento horizontal en pantallas móviles estrechas.
- Se verifica que la fuente y el aviso de estimación permanezcan visibles junto
  al resultado.
