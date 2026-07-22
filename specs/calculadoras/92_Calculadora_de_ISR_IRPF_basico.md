# Especificación v2 - Calculadora de ISR en México

## Descripción general

Herramienta para estimar el Impuesto Sobre la Renta (ISR) en México a partir de
una base gravable y reglas fiscales versionadas por régimen, periodo y
frecuencia de cálculo.

El MVP se limita a personas físicas del régimen de sueldos y salarios. No debe
presentarse como una calculadora universal de ISR, IRPF ni de todos los
regímenes fiscales. La arquitectura del motor debe permitir incorporar otros
países y regímenes posteriormente.

El resultado es una estimación informativa. No representa una declaración,
retención oficial, resolución de la autoridad, recibo de nómina ni asesoría
fiscal.

**Arquitectura:** cálculo en cliente con datasets locales versionados. No
requiere backend, pero las tarifas, fuentes y reglas deben revisarse
periódicamente y publicarse con trazabilidad.

---

## Objetivo de producto

- Estimar el ISR de un periodo de nómina o de un ejercicio anual.
- Distinguir claramente entre retención del periodo e impuesto anual estimado.
- Explicar qué tramo aplica, qué cuota fija se utiliza y qué porcentaje se
  aplica sobre el excedente.
- Mostrar tasa marginal, tasa efectiva e importe antes y después de créditos.
- Comparar el impuesto estimado con retenciones del mismo periodo o ejercicio.
- Mostrar país, régimen, periodo, frecuencia, supuestos y fuente oficial junto
  al resultado.
- Permitir una simulación manual claramente identificada como no oficial.

---

## Alcance recomendado

### MVP: México, sueldos y salarios, ejercicio 2026

La interfaz debe ofrecer dos modos explícitos:

1. **Retención de nómina**
   - Base gravable del pago.
   - Frecuencia del pago.
   - ISR estimado del periodo.
   - Retención ISR del mismo periodo.
   - Diferencia estimada a pagar o a favor.

2. **Impuesto anual estimado**
   - Base gravable anual.
   - Deducciones anuales autorizadas, únicamente si el preset las contempla.
   - Retenciones ISR acumuladas del ejercicio.
   - Impuesto anual estimado y saldo aproximado.

El MVP incluye:

- Preset vigente de México para sueldos y salarios.
- Tarifas oficiales por frecuencia disponible en el dataset.
- Motor de cuota fija más porcentaje sobre excedente.
- Cálculo de créditos o subsidios solo cuando estén verificados para el
  supuesto seleccionado.
- Modo manual con tarifa por tramos o tasa única.
- Desglose del cálculo y fuentes oficiales.
- Ejemplos reproducibles y pruebas con límites de tramo.

### Fuera del MVP

- Otros países, incluido IRPF de España.
- Regímenes empresariales, arrendamiento, RESICO u otros no verificados.
- Declaración conjunta o unidades familiares.
- Tratamiento automático de ingresos adicionales, exenciones complejas o
  situaciones personales.
- Cálculo completo de salario neto, seguridad social o nómina. Esa funcionalidad
  pertenece a la calculadora de salario neto y puede reutilizar este motor
  cuando las bases sean compatibles.

### Fase 2

- Más regímenes y jurisdicciones.
- Más países con rutas y datasets específicos.
- Deducciones complejas, exenciones y créditos condicionados.
- Comparador entre periodos.
- Cálculo inverso para alcanzar un impuesto o saldo objetivo.
- Exportación y compartición del desglose.

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
| Preset inicial | `mx/sueldos-salarios/2026` |

Aunque se conserve la ruta por compatibilidad con la planificación existente, el
contenido visible y el SEO del MVP deben hablar de ISR en México. No se debe
usar IRPF como si fuera aplicable a este preset.

---

## Datos locales, vigencia y fuentes

El dataset debe representar una tarifa concreta, no una tabla genérica que el
motor intente adaptar automáticamente.

```ts
type TaxCalculationMode = "payroll-withholding" | "annual-estimate";

type TaxFrequency =
  | "daily"
  | "weekly"
  | "every_10_days"
  | "biweekly"
  | "monthly"
  | "annual";

interface TaxSource {
  name: string;
  url: string;
  reference?: string;
  publishedAt?: string;
  checkedAt: string;
}

interface TaxBracket {
  lowerBound: number;
  upperBound?: number;
  fixedAmount: number;
  marginalRate: number;
}

interface IncomeTaxRuleSet {
  id: string;
  countryCode: "MX";
  country: "México";
  taxName: "ISR";
  jurisdiction?: string;
  regime: "sueldos-salarios";
  period: string;
  currency: "MXN";
  locale: "es-MX";
  supportedModes: TaxCalculationMode[];
  supportedFrequencies: TaxFrequency[];
  periodsPerYear?: Partial<Record<TaxFrequency, number>>;
  calculationModel: "fixed-plus-excess" | "marginal-slices";
  effectiveFrom: string;
  effectiveTo?: string;
  publishedAt?: string;
  reviewedAt: string;
  sourceVersion?: string;
  sources: TaxSource[];
  status: "current" | "historical" | "expired" | "draft";
  brackets: TaxBracket[];
  assumptions: string[];
  rounding: RoundingPolicy;
  credits?: CreditRule[];
  deductions?: DeductionRule[];
}
```

Requisitos de los datasets:

- `current` solo puede usarse cuando la fecha actual está dentro de la vigencia
  y las reglas tienen fuente, unidad, frecuencia y revisión.
- `historical` puede seleccionarse expresamente y debe mostrarse como histórico.
- `expired` y `draft` no deben calcular como presets vigentes.
- No reutilizar automáticamente una tarifa de otro año, frecuencia o régimen.
- No convertir una tarifa mensual en anual multiplicando por 12 salvo que el
  dataset declare que esa proyección es válida.
- Los cambios de la fuente deben crear una nueva versión o dejar trazabilidad de
  la actualización.
- Si un crédito, subsidio o deducción no está verificado para el supuesto, se
  debe ocultar o marcar como no contemplado, nunca inferirlo.

### Fuentes iniciales para México

- [SAT - Normatividad RMF, RGCE y RFA 2026](https://www.sat.gob.mx/minisitio/NormatividadRMFyRGCE/normatividad_rmf_rgce2026.html)
- [SAT - Anexo 8 de la RMF 2026: tarifas aplicables a pagos provisionales, retenciones y cálculo del ISR](https://www.sat.gob.mx/minisitio/NormatividadRMFyRGCE/documentos2026/rmf/anexos/Anexo-8-RMF-2026_DOF-28122025.pdf)

El preset debe guardar la tabla exacta utilizada y su referencia. El Anexo 8
incluye tablas diferenciadas para pagos de 7, 10 y 15 días, además de tarifas
mensuales y anuales; no se debe tratar como una única tarifa universal.

---

## Comportamiento mobile-first

La pantalla inicial debe mostrar únicamente las decisiones necesarias para un
primer resultado:

1. Modo: retención de nómina o impuesto anual.
2. Periodo fiscal.
3. Base gravable y su frecuencia.
4. Retención comparable, si aplica.
5. Acción “Calcular ISR”.

País, régimen, moneda, fuente y fecha de revisión deben mostrarse como contexto
compacto, sin obligar al usuario a navegar por varios controles si solo existe un
preset vigente.

Las deducciones anuales y supuestos adicionales deben estar dentro de una
sección “Opciones avanzadas”. No deben mostrarse inputs que el preset no utilice.

Después del formulario, en este orden, mostrar:

- ISR estimado del periodo o ejercicio.
- Etiqueta inequívoca del alcance: “del periodo” o “anual”.
- Saldo estimado: “a pagar”, “a favor” o “sin diferencia”.
- Tasa efectiva y tasa marginal.
- Desglose expandible del tramo, cuota fija, excedente, créditos y retenciones.
- Supuestos, cobertura, fuente, vigencia y aviso de estimación.

Requisitos de interfaz y accesibilidad:

- Controles de al menos 44 px de alto.
- Campos numéricos con `inputmode="decimal"`.
- Formato y parseo explícitos para moneda y separadores de `es-MX`.
- Errores asociados al campo correspondiente mediante `aria-describedby` y
  `aria-invalid`.
- Resultado y errores anunciados con `aria-live`.
- Desglose en tarjetas o `<details>` accesibles; evitar tablas anchas.
- Si se usa una tabla, permitir desplazamiento horizontal sin romper el layout.
- No depender únicamente del color para distinguir impuesto, crédito y saldo.
- Mantener resultado, fuente y aviso visibles en el flujo inmediatamente después
  del formulario.
- Ofrecer “Cargar ejemplo”, “Limpiar” y “Copiar resultado”.

---

## Flujo principal MVP

### Inputs de contexto

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| País | Selector o texto fijo | `México` | `México` |
| Impuesto | Texto fijo | `ISR` | `ISR` |
| Régimen | Selector o texto fijo | `Sueldos y salarios` | preset vigente |
| Periodo fiscal | Selector | datasets disponibles | `2026` |
| Modo de cálculo | Selector | nómina, anual | nómina |
| Frecuencia | Selector | frecuencias del dataset | la primera explícitamente compatible |

No seleccionar silenciosamente “el primer régimen disponible” si hay más de uno.
Cada opción debe mostrar su nombre completo y alcance.

### Inputs de cálculo

| Campo | Tipo | Rango válido | Aplicación |
|-------|------|--------------|------------|
| Base gravable del periodo | Texto numérico | `>= 0` | modo nómina |
| Base gravable anual | Texto numérico | `>= 0` | modo anual |
| Retención ISR del periodo | Texto numérico | `>= 0` | modo nómina |
| Retenciones ISR acumuladas | Texto numérico | `>= 0` | modo anual |
| Deducciones anuales autorizadas | Texto numérico | `>= 0` | solo si el preset las contempla |

La base gravable se considera ya depurada. No se deben restar deducciones
automáticamente sobre ella. Si posteriormente se permite calcular la base desde
ingresos, debe existir un modo separado con campos y reglas explícitas.

### Outputs principales

- Base gravable usada y unidad del cálculo.
- Tramo aplicado: límites, cuota fija, excedente y tasa marginal.
- ISR antes de créditos.
- Créditos o subsidios aplicados y sus condiciones.
- ISR estimado después de créditos, nunca menor que cero.
- Tasa efectiva sobre la base gravable.
- Retención comparable, cuando exista.
- Diferencia etiquetada como saldo a pagar o saldo a favor.
- Supuestos, conceptos no contemplados, fuente, versión y vigencia.

El resultado debe indicar siempre si corresponde al periodo capturado o al
ejercicio anual. No presentar una proyección anual como si fuera una obligación
definitiva.

---

## Fórmulas y algoritmo

### Modelo de cuota fija más excedente

```text
base = base_gravable
tramo = buscar_tramo(base, tarifa_de_la_frecuencia)

excedente = max(0, base - tramo.limite_inferior)
impuesto_bruto = tramo.cuota_fija + excedente * tramo.tasa_marginal

creditos = calcular_creditos(base, impuesto_bruto, reglas_del_preset)
recargos = calcular_recargos(base, reglas_del_preset)
impuesto_neto = max(0, impuesto_bruto - creditos + recargos)

tasa_efectiva = base > 0 ? impuesto_neto / base : 0

saldo = impuesto_neto - retenciones_del_mismo_alcance
```

### Modelo de tramos marginales

Solo debe usarse cuando el dataset declare `calculationModel: "marginal-slices"`:

```text
impuesto_bruto = suma(monto_de_cada_tramo * tasa_del_tramo)
```

No mezclar ambos modelos ni convertir automáticamente uno en otro.

### Definiciones obligatorias

- **Tasa marginal:** tasa del tramo que contiene la base, no porcentaje sobre
  todo el ingreso.
- **Tasa efectiva:** `impuesto_neto / base_gravable`.
- **Saldo a pagar:** impuesto neto mayor que la retención comparable.
- **Saldo a favor:** retención comparable mayor que el impuesto neto.

La tasa efectiva debe mostrarse como cero cuando la base sea cero. Los créditos
que superen el impuesto bruto deben llevar el impuesto neto a cero, no a un
valor negativo.

### Redondeo

- Mantener precisión interna suficiente.
- Declarar en el dataset la precisión, modo de redondeo y etapa de aplicación.
- Redondear cada concepto solo si el procedimiento oficial lo exige.
- Si no existe una regla específica, redondear resultados mostrados y resultado
  final, no cada operación intermedia.
- Probar diferencias entre cálculo por periodo y cálculo anual.

---

## Validaciones y estados

Validaciones:

- No aceptar negativos, `NaN`, infinitos ni valores fuera del límite seguro del
  navegador.
- No aceptar campos obligatorios vacíos.
- Validar separadores decimales y de miles sin cambiar silenciosamente el valor.
- Validar que los tramos estén ordenados, sin huecos ni superposiciones.
- Validar límites, cuotas y tasas con unidades y frecuencia compatibles.
- Validar `0 <= marginalRate <= 1` y cuotas no negativas.
- La base debe ser mayor o igual a cero; no ocultar errores usando un `max(0)`
  que transforme una captura inválida en una base válida.
- Retenciones y deducciones no pueden superar su alcance aplicable sin una
  advertencia explícita.
- Una retención solo puede compararse con un impuesto de la misma frecuencia,
  régimen y periodo de referencia.
- Un preset sin fuente, fecha de revisión, unidad, frecuencia o reglas completas
  no puede marcarse como `current`.
- El modo manual debe indicar que no tiene fuente oficial ni vigencia fiscal.

Estados de la interfaz:

- `initial`: formulario sin base válida.
- `invalid`: error de captura o configuración.
- `valid`: resultado con reglas compatibles y vigentes.
- `partial`: resultado disponible, pero faltan conceptos o reglas aplicables.
- `historical`: resultado calculado con reglas de un periodo anterior.
- `manual`: resultado calculado con parámetros del usuario.
- `blocked`: no se puede calcular por falta de fuente, reglas o vigencia.

El aviso de estimación debe explicar que residencia, ingresos adicionales,
exenciones, situación personal, otros empleadores y obligaciones particulares
pueden cambiar el resultado.

---

## SEO y contenido

Para el MVP de México:

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de ISR en México 2026` |
| Meta description | `Estima tu ISR en México por periodo o por año, consulta tu tasa efectiva y compara el impuesto con tus retenciones.` |
| H1 | `Calculadora de ISR en México` |
| Keyword principal | `calculadora ISR México` |
| Keywords secundarias | `ISR de nómina`, `impuesto sobre la renta México`, `tasa efectiva ISR` |

No usar “calculadora IRPF” como keyword secundaria mientras no exista un preset
de España. Cuando se incorporen otros países, crear páginas específicas por país,
régimen y periodo con canonical coherente.

El contenido debe explicar:

- diferencia entre ingreso bruto y base gravable;
- diferencia entre retención del periodo e impuesto anual;
- significado de tasa marginal y tasa efectiva;
- interpretación de saldo a pagar y saldo a favor;
- qué conceptos están incluidos y cuáles no;
- fecha, versión, vigencia y fuentes de la tarifa;
- que el resultado es informativo y no sustituye una declaración, nómina oficial
  ni asesoría profesional.

---

## Pruebas sugeridas

### Motor de cálculo

- Fixtures oficiales del preset producen el resultado esperado.
- Valores justo debajo, en y arriba de cada límite.
- Cuota fija y porcentaje sobre excedente en todos los tramos.
- Modelo marginal separado del modelo de cuota fija.
- Base cero produce impuesto y tasa efectiva cero.
- Crédito cero, crédito parcial y crédito mayor que el impuesto bruto.
- El impuesto neto nunca es negativo.
- Tasa marginal y tasa efectiva coinciden con sus definiciones.
- Saldo a pagar, saldo a favor y saldo cero.
- Redondeo en límites y valores decimales.

### Frecuencia y alcance

- Tarifas de 7, 10 y 15 días, mensual y anual seleccionan la tabla correcta
  cuando el dataset las ofrece.
- No se compara una retención mensual con un impuesto anual sin conversión
  explícita.
- La proyección anual solo aparece si el dataset define el supuesto.
- Cambiar de frecuencia no altera silenciosamente la base capturada.

### Presets y vigencia

- Preset `current`, `historical`, `expired`, `draft` y `manual` se muestran con
  el estado correcto.
- Un preset sin fuente, revisión, unidad o frecuencia bloquea el cálculo vigente.
- La interfaz muestra fuente, versión, vigencia, frecuencia y supuestos.
- Una actualización de la fuente genera una nueva versión o trazabilidad.

### Interfaz mobile first y accesibilidad

- Resultado principal visible inmediatamente después del formulario.
- No existe desbordamiento horizontal en pantallas estrechas.
- Los controles son utilizables con teclado y lector de pantalla.
- Los errores se anuncian y se asocian al campo correspondiente.
- Las filas o tarjetas expandibles exponen nombre, estado y foco accesibles.
- El aviso, la fuente y el alcance del cálculo permanecen junto al resultado.
- Los importes se interpretan correctamente con formato `es-MX`.
