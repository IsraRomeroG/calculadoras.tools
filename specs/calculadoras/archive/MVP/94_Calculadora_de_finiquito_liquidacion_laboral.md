# Especificación v2 - Calculadora de finiquito y liquidación laboral en México

## Descripción general

Herramienta para estimar los pagos brutos relacionados con la terminación de una
relación laboral en México. Calcula primero el finiquito por conceptos generados
o pendientes y, de forma independiente, permite explorar escenarios
condicionados de indemnización.

La herramienta no determina si un despido fue justificado o injustificado, no
resuelve controversias y no sustituye la revisión de documentos ni la asesoría
de una autoridad laboral o profesional.

**Arquitectura:** cálculo íntegramente en cliente, mediante reglas locales
versionadas, motores de prestaciones reutilizables y un registro visible de los
supuestos o ajustes introducidos por el usuario. No requiere backend, pero las
reglas y fuentes legales necesitan revisión periódica.

---

## Decisiones de producto

- El MVP soporta exclusivamente México y no muestra selectores de país o
  periodo mientras exista un solo preset.
- El resultado principal siempre es el `Finiquito bruto estimado`.
- Ninguna indemnización se activa automáticamente por el motivo declarado.
- Las indemnizaciones se muestran como escenarios condicionados y visualmente
  separados del finiquito.
- El salario diario ordinario y el salario diario integrado para indemnización
  son bases distintas.
- Los motores de vacaciones, prima vacacional y aguinaldo deben devolver
  variables con unidades explícitas; nunca se suman días directamente con
  importes monetarios.
- Las prestaciones legales no se pueden desactivar silenciosamente. El usuario
  debe indicar si ya fueron pagadas, si no aplican según su información o si
  desea excluirlas sólo de la simulación.
- Todos los resultados monetarios del MVP son brutos, antes de impuestos,
  retenciones, descuentos o compensaciones.
- Las fechas, salarios, motivos e importes permanecen en el dispositivo y no se
  envían a analítica.

---

## Objetivo de producto

- Estimar el finiquito con un desglose reproducible por concepto.
- Diferenciar importes generados de indemnizaciones cuya procedencia depende de
  hechos, documentos, acciones y criterios jurídicos.
- Explicar la base salarial, fórmula, vigencia y fuente de cada concepto.
- Permitir prestaciones contractuales superiores al mínimo legal.
- Registrar los conceptos ya pagados, excluidos o sustituidos manualmente.
- Comparar opcionalmente una oferta recibida con la estimación, sin presentar la
  diferencia como una deuda determinada.
- Ayudar al usuario a identificar datos faltantes, documentos útiles y casos
  que requieren orientación personalizada.

---

## Alcance

### MVP

- México, moneda MXN y locale `es-MX`.
- Relación laboral privada general comprendida por la Ley Federal del Trabajo.
- Trabajo continuo y salario fijo.
- Fecha de ingreso y último día de la relación laboral.
- Salario diario ordinario normalizado desde una frecuencia de pago.
- Salarios devengados y no pagados.
- Aguinaldo proporcional.
- Vacaciones pendientes monetizadas.
- Prima vacacional.
- Prima de antigüedad como concepto condicionado con reglas propias.
- Escenario condicionado de indemnización constitucional de tres meses.
- Escenario avanzado y condicionado de veinte días por año.
- Conceptos adicionales y prestaciones contractuales.
- Comparación opcional contra una oferta total o desglosada.
- Fórmulas con valores sustituidos, fuentes y registro de supuestos.

### Fuera del alcance automático del MVP

- Empleo público o relaciones regidas por el apartado B del artículo 123.
- Personas trabajadoras de plataformas digitales.
- Trabajo discontinuo, de temporada o regímenes especiales.
- Trabajo del hogar, trabajo del campo y relaciones colectivas con reglas
  especiales.
- Salario predominantemente variable, por comisión, unidad de obra o propinas.
- Prestación de servicios independientes sin relación laboral reconocida.
- Terminación colectiva, incapacidad, riesgo de trabajo o muerte.
- Salarios vencidos, intereses procesales, reinstalación y aportaciones de
  seguridad social.
- Impuestos, retenciones, adeudos, descuentos o cálculo neto.
- PTU no determinada o todavía no exigible.
- Determinar si un despido, rescisión o convenio es jurídicamente válido.

Cuando el usuario indique un caso fuera de alcance, no se aplicará
silenciosamente la regla general. Se mostrará el motivo y un enlace a una fuente
oficial o recomendación de asesoría.

### Fase 2

- Salarios variables y promedios conforme a reglas específicas.
- Regímenes laborales adicionales.
- Estimación fiscal por concepto.
- Salarios vencidos e intereses mediante escenarios con fechas procesales.
- Comparación y guardado local de varios escenarios.
- Exportación a PDF.
- Reglas por contrato colectivo, contrato ley o convenio.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL pública | `/legal-impuestos/calculadora-finiquito-liquidacion` |
| Página Astro | `src/pages/legal-impuestos/calculadora-finiquito-liquidacion.astro` |
| Componente de página | `src/components/calculators/TerminationPayCalculatorPage.astro` |
| Lógica principal | `src/lib/calculators/legal-impuestos/calculadora-finiquito-liquidacion/terminationPay.ts` |
| Normalización salarial | `src/lib/calculators/legal-impuestos/calculadora-finiquito-liquidacion/salary.ts` |
| Reglas locales | `src/lib/calculators/legal-impuestos/calculadora-finiquito-liquidacion/rules/mx/{version}.ts` |
| Pruebas unitarias | `src/lib/calculators/legal-impuestos/calculadora-finiquito-liquidacion/terminationPay.test.ts` |
| Categoría | `legal-impuestos` |
| Clave de locale inicial | `es` |
| Región y moneda | `es-MX` y `MXN` |

La página Astro debe ser un contenedor del componente y la calculadora debe
registrarse en el directorio y metadatos de calculadoras del proyecto. No se
publicará una variante en otro idioma sin una revisión editorial propia. Una
eventual traducción debe conservar de forma inequívoca el alcance jurídico de
México y reutilizar exactamente el mismo dataset mexicano versionado.

---

## Terminología de producto

| Término | Definición |
|---------|------------|
| Finiquito | Suma estimada de salarios, prestaciones generadas y otros importes pendientes al terminar la relación. |
| Liquidación | Término de uso común que puede incluir indemnizaciones. La interfaz no lo presenta como derecho automático. |
| Escenario condicionado | Simulación de uno o varios conceptos cuya procedencia debe confirmarse según los hechos y la ley. |
| Salario diario ordinario | Cuota diaria usada en el MVP para salarios y prestaciones devengadas. |
| Salario diario integrado para indemnización | Base estimada que incorpora la cuota diaria y prestaciones integrables para escenarios de indemnización. No debe confundirse con el salario base de cotización del IMSS. |
| Saldo anterior de vacaciones | Días pendientes reconocidos antes del último aniversario. La herramienta no puede reconstruirlos sólo con la fecha de ingreso. |
| Último día trabajado | Fecha final de la relación laboral; se incluye en los cálculos. |
| Total bruto | Importe antes de impuestos, retenciones, descuentos o compensaciones. |
| Oferta recibida | Importe informado por el usuario. No se presume correcto, definitivo ni jurídicamente exigible. |

---

## Alcance legal visible

Antes de solicitar importes debe mostrarse:

`Esta estimación usa la Ley Federal del Trabajo de México para una relación
privada general, trabajo continuo y salario fijo. No determina si un despido fue
justificado ni calcula impuestos.`

El usuario debe confirmar que el caso se encuentra dentro del alcance. Si
selecciona otro régimen o salario predominantemente variable, se muestra el
estado fuera de alcance.

---

## Fuentes y reglas versionadas

Cada regla debe incluir vigencia, régimen laboral, moneda, fuentes, artículos,
fecha de consulta y fecha de revisión. `sourceUrl` no es suficiente porque un
concepto puede depender de la LFT, PROFEDET y los salarios mínimos de CONASAMI.

```ts
interface LegalSource {
  title: string;
  url: string;
  articles?: string[];
  publishedAt?: string;
  accessedAt: string;
}

interface TerminationRuleSet {
  id: string;
  country: "MX";
  currency: "MXN";
  employmentRegime: "lft-private-sector-general";
  ruleVersion: string;
  effectiveFrom: string;
  effectiveTo?: string;
  reviewedAt: string;
  status: "current" | "expired" | "draft";
  salaryNormalization: SalaryNormalizationRule;
  annualBonus: AnnualBonusRule;
  vacation: VacationRuleReference;
  vacationPremium: VacationPremiumRule;
  seniorityPremium: SeniorityPremiumRule;
  indemnityScenarios: IndemnityScenario[];
  minimumWageAreas: MinimumWageAreaRule[];
  sources: LegalSource[];
}
```

### Selección de reglas

- La versión se selecciona automáticamente con el último día de la relación.
- Los motores que cubran ciclos anteriores deben validar que cuentan con reglas
  para todas las fechas relevantes.
- La ubicación laboral sólo se solicita cuando una regla depende del área de
  salario mínimo, como la prima de antigüedad.
- Si no existe una regla vigente compatible, se bloquea el cálculo automático.
- La interfaz muestra el régimen, versión legal y fecha de revisión junto al
  resultado.
- Los valores contractuales editados conservan el mínimo del preset como
  referencia visible.

### Fuentes iniciales

- [Cámara de Diputados - Ley Federal del Trabajo](https://www.diputados.gob.mx/LeyesBiblio/pdf/LFT.pdf)
- [PROFEDET - Derechos en caso de renuncia o despido](https://www.gob.mx/profedet/articulos/conoce-tus-derechos-en-caso-de-renuncia-o-despido?idiom=es)
- [PROFEDET - Renuncia voluntaria](https://www.profedet.gob.mx/micrositio/index.php/renuncia-voluntaria)
- [PROFEDET - Despido](https://profedet.gob.mx/profedet/micrositio/index.php/despido)
- [PROFEDET - Rescisión](https://profedet.gob.mx/profedet/micrositio/index.php/rescision)
- [CONASAMI - Salarios mínimos por área geográfica](https://www.gob.mx/conasami/documentos/tabla-de-salarios-minimos-generales-y-profesionales-por-areas-geograficas)

La fecha de última revisión y la última reforma legal no deben escribirse
manualmente en el contenido editorial; deben provenir del dataset utilizado.

---

## Flujo principal

### 1. Confirmación de alcance

Primer bloque visible después de la introducción:

- `Relación privada general bajo la LFT`.
- `Trabajo continuo`.
- `Salario fijo`.

Una opción `Mi caso es diferente` abre los casos no soportados y las fuentes de
orientación. No debe permitir continuar con un cálculo automático incompatible.

### 2. Situación declarada

Mostrar tarjetas o botones segmentados con explicación breve; no usar un
selector desplegable para esta decisión principal:

- `Renuncié voluntariamente`.
- `Me despidieron`.
- `Me separé por una causa atribuible al patrón`.
- `Terminó mi contrato u obra`.
- `Llegamos a un acuerdo`.
- `Otra situación`.

La opción elegida sirve para explicar escenarios y solicitar datos pertinentes,
pero nunca determina por sí sola la procedencia jurídica de una indemnización.

Cuando se elija `Me despidieron`, se puede preguntar si el usuario recibió un
aviso escrito con una causa. La respuesta es informativa y no permite que la
calculadora declare el despido justificado o injustificado.

### 3. Datos comunes

| Campo | Tipo | Validación | Valor inicial |
|-------|------|------------|---------------|
| Fecha de ingreso | `date` | Fecha civil válida | Vacío |
| Último día de la relación | `date` | `>= fecha de ingreso` | Hoy |
| Tipo de contrato | Selector | indeterminado, determinado menor de un año, determinado de un año o más, desconocido | Indeterminado |
| Salario base | Texto numérico decimal | `> 0` | Vacío |
| Frecuencia | Selector | diario, semanal, quincenal, mensual | Mensual |
| Días de salario devengado no pagados | Texto numérico decimal | `>= 0` | `0` |
| Monto de salarios pendientes | Texto numérico decimal opcional | `>= 0` | Calculado |

El monto de salarios pendientes se calcula inicialmente como días de salario
devengado no pagados por salario diario. La ayuda debe aclarar que no siempre
coinciden con días naturales y recomendar capturar el monto bruto conocido en
casos de descanso semanal, jornadas parciales u otras condiciones. Si el usuario
lo sustituye, el resultado debe identificarlo como monto manual y conservar los
valores originales como referencia.

### 4. Prestaciones

Los mínimos legales se cargan desde el preset. Los campos contractuales se
agrupan en `Ajustar prestaciones`, colapsado por defecto.

| Campo | Tipo | Validación | Valor inicial |
|-------|------|------------|---------------|
| Días anuales de aguinaldo | Texto numérico decimal | `>= mínimo del preset` | Preset |
| Días no elegibles para aguinaldo | Texto numérico decimal | `>= 0` y no supera el periodo | `0` |
| Saldo anterior de vacaciones | Texto numérico decimal | `>= 0` | `0` |
| Días de vacaciones usados o pagados desde el último aniversario | Texto numérico decimal | `>= 0` | `0` |
| Días contractuales de vacaciones | Controles contextuales | `>= mínimo aplicable` | Preset |
| Prima vacacional | Texto numérico porcentual | `>= mínimo del preset` | Preset |

`Saldo anterior de vacaciones` debe incluir ayuda contextual que recomiende
consultar recibos, constancias o registros del empleador. No se inferirá con las
fechas.

### 5. Salario integrado para indemnización

Este bloque sólo aparece al explorar un escenario condicionado.

Opciones:

- `Estimar con mis prestaciones`, seleccionada por defecto.
- `Conozco mi salario diario integrado`, que permite capturarlo directamente.

Para la estimación se utilizan el salario diario ordinario, aguinaldo,
vacaciones, prima vacacional y un campo opcional para el promedio diario de
otras prestaciones integrables recurrentes.

La interfaz debe aclarar que bonos, comisiones, alimentación, habitación,
prestaciones en especie u otras percepciones pueden modificar la base. Si estas
percepciones son predominantes o variables, el caso queda fuera del cálculo
automático del MVP.

### 6. Conceptos adicionales

Lista editable de conceptos monetarios con:

- Nombre.
- Importe bruto no negativo.
- Clasificación: prestación contractual, comisión pendiente, bono, fondo de
  ahorro, PTU ya determinada u otro.
- Nota opcional que permanece local en el dispositivo.

No se mezclan descuentos con importes a favor. Los pagos ya recibidos se
registran en una sección separada para evitar presentar una deducción como si
fuera un concepto legal negativo.

### 7. Pagos ya recibidos

Permitir añadir pagos con:

- Importe bruto no negativo.
- Fecha opcional.
- Concepto al que corresponde o `Sin desglose`.
- Nota opcional local.

Un pago asociado a un concepto reduce únicamente el pendiente de ese concepto.
Un pago sin desglose reduce el pendiente total, pero no permite marcar
prestaciones específicas como pagadas. El mismo pago no puede descontarse a la
vez de un concepto y del total general.

### 8. Oferta recibida, opcional

Permitir uno de estos modos:

- Monto total ofrecido.
- Desglose por concepto.

La comparación sólo se muestra después de obtener una estimación válida. Una
diferencia positiva se etiqueta `Diferencia frente a la estimación`, nunca
`Deuda`, `Faltante obligatorio` o una expresión equivalente.

---

## Convenciones de cálculo

### Fechas

- Trabajar únicamente con fechas civiles `YYYY-MM-DD`, sin horas ni conversión
  de zona horaria.
- El último día de la relación es inclusivo. Para operar se crea
  `endExclusive = ultimoDia + 1 día`.
- Calcular diferencias con fechas UTC para evitar cambios por horario de verano.
- Derivar aniversarios desde la fecha de ingreso; no sumar 365 días de forma
  repetida.
- En ingresos del 29 de febrero, utilizar `addCalendarYearsClamped` y explicar
  el criterio técnico en `Cómo se calculó`.
- No redondear valores intermedios.

### Normalización salarial

```text
si frecuencia = diario:
  salario_diario_ordinario = salario_base

si frecuencia = semanal:
  salario_diario_ordinario = salario_base / 7

si frecuencia = quincenal:
  salario_diario_ordinario = salario_base / 15

si frecuencia = mensual:
  salario_diario_ordinario = salario_base / 30
```

La regla de frecuencia debe mostrar su fuente. Si la frecuencia quincenal no
está definida expresamente por el preset, se tratará como criterio de producto
visible y editable, no como texto legal.

### Aguinaldo proporcional

Delegar al motor específico de aguinaldo:

```text
inicio_devengo = max(fecha_ingreso, primer_dia_del_periodo_anual)
dias_elegibles =
  dias_inclusivos(inicio_devengo, ultimo_dia)
  - dias_no_elegibles

aguinaldo_proporcional =
  salario_diario_ordinario
  * dias_anuales_aguinaldo
  * dias_elegibles
  / dias_base_del_periodo
```

El preset define si la base anual es 365 o 366 y cómo se tratan las ausencias.

### Vacaciones pendientes y prima vacacional

El motor de vacaciones proporcionales devuelve días, no dinero:

```text
dias_vacaciones_pendientes = calcular_vacaciones_terminacion(
  fecha_ingreso,
  ultimo_dia,
  saldo_anterior,
  dias_usados_o_pagados,
  reglas_vacaciones
)

pago_vacaciones =
  salario_diario_ordinario * dias_vacaciones_pendientes

prima_vacacional =
  pago_vacaciones * porcentaje_prima_vacacional
```

El pago base de vacaciones se suma una sola vez. El motor de prima vacacional
debe recibir `pago_vacaciones` o `dias_vacaciones_pendientes`, pero nunca
devolver un total que vuelva a incluir el pago base sin identificarlo.

### Salario diario integrado estimado

Para salario fijo y prestaciones anuales conocidas:

```text
factor_prestaciones_fijas =
  1
  + dias_anuales_aguinaldo / dias_base_del_periodo
  + dias_vacaciones_del_año_de_servicio
    * porcentaje_prima_vacacional
    / dias_base_del_periodo

salario_diario_integrado_estimado =
  salario_diario_ordinario * factor_prestaciones_fijas
  + promedio_diario_otras_prestaciones_integrables
```

Esta fórmula es una estimación de producto limitada a los componentes
capturados. Debe mostrarse el factor y permitir sustituir el resultado por un
salario diario integrado informado por el usuario.

### Finiquito bruto

```text
finiquito_bruto =
  salarios_pendientes
  + aguinaldo_proporcional
  + pago_vacaciones
  + prima_vacacional
  + conceptos_adicionales

finiquito_pendiente_estimado = max(
  0,
  finiquito_bruto - pagos_ya_recibidos_aplicables
)
```

Si los pagos informados superan la estimación, mostrar el exceso por separado;
no mostrar un finiquito pendiente negativo.

---

## Prima de antigüedad

La prima de antigüedad se presenta separada del finiquito ordinario y de la
indemnización constitucional.

El preset debe definir:

- Días por año.
- Tratamiento de fracciones de año.
- Condición de persona trabajadora de planta.
- Supuestos de elegibilidad por tipo de separación.
- Antigüedad mínima para separación voluntaria.
- Base mínima y tope salarial.
- Área geográfica del salario mínimo.
- Artículos y fuentes.

```text
salario_base_prima_antiguedad = aplicar_minimo_y_tope(
  salario_diario_ordinario,
  salario_minimo_del_area,
  regla
)

prima_antiguedad =
  dias_por_año
  * antiguedad_computable
  * salario_base_prima_antiguedad
```

La herramienta puede sugerir el escenario compatible con la situación
declarada, pero exige confirmación del usuario. Debe explicar, como mínimo, que
la separación voluntaria, la separación justificada por la persona trabajadora
y el despido tienen condiciones diferentes.

Si el usuario no sabe si era persona trabajadora de planta, la prima se marca
como `No determinada` y no se incorpora silenciosamente al total.

---

## Escenarios condicionados de indemnización

### Indemnización constitucional de tres meses

```text
indemnizacion_tres_meses =
  salario_diario_integrado_para_indemnizacion * 30 * 3
```

- Sólo se muestra después de que el usuario activa `Explorar posible
  indemnización`.
- Debe explicar que su procedencia depende de los hechos y de la acción elegida.
- No se incorpora al `Finiquito bruto estimado`.

### Veinte días por año

```text
indemnizacion_veinte_dias =
  salario_diario_integrado_para_indemnizacion
  * 20
  * antiguedad_computable_segun_regla
```

- Es una opción avanzada y colapsada por defecto.
- Nunca se activa automáticamente por elegir `Me despidieron`.
- Antes de activarla se explica que no es un componente universal de todo
  despido y que depende del supuesto jurídico aplicable.
- El tipo de contrato puede cambiar la fórmula; si el preset no soporta el caso,
  el concepto se marca como no calculado.

### Conceptos no incluidos en el MVP

Salarios vencidos, intereses, reinstalación, aportaciones de seguridad social y
daños no se aproximan con un importe genérico. Se muestran como `No calculados`
cuando puedan ser relevantes.

### Total del escenario

```text
total_escenario_condicionado =
  finiquito_pendiente_estimado
  + prima_antiguedad_confirmada
  + indemnizaciones_condicionadas_activadas
```

El total condicionado nunca sustituye visualmente al finiquito como resultado
principal. Debe incluir el nombre de cada escenario activado.

---

## Estados de cada concepto

Cada fila del desglose utiliza uno de estos estados:

| Estado | Uso |
|--------|-----|
| `Calculado` | Derivado automáticamente con una regla vigente. |
| `Editado` | El usuario sustituyó un mínimo, base o importe. |
| `Ya pagado` | Se conserva en el desglose y se descuenta del pendiente. |
| `Excluido por el usuario` | No se suma, pero permanece visible con advertencia. |
| `Condicionado` | Sólo forma parte del escenario explícitamente activado. |
| `No determinado` | Faltan datos o la procedencia no puede resolverse. |
| `Fuera de alcance` | El motor no soporta el régimen o concepto. |

La acción `Excluido por el usuario` requiere confirmación y la aclaración de que
excluir un concepto de la simulación no equivale a renunciar válidamente a un
derecho.

---

## Resultados

### Jerarquía

1. `Finiquito bruto estimado`.
2. `Pagos ya recibidos` y `Finiquito pendiente estimado`.
3. Prima de antigüedad, cuando fue determinada o explorada.
4. Escenario condicionado de indemnización.
5. Total del escenario condicionado.
6. Comparación con la oferta recibida.
7. Conceptos no calculados y advertencias.

### Desglose mínimo

- Salarios devengados no pagados.
- Aguinaldo proporcional.
- Días de vacaciones pendientes y su importe monetario.
- Prima vacacional.
- Conceptos adicionales.
- Pagos ya recibidos.
- Prima de antigüedad, con base y tope utilizados.
- Cada indemnización condicionada activada.

### Cómo se calculó

Para cada concepto mostrar:

- Fórmula.
- Valores sustituidos.
- Unidad de cada variable.
- Base salarial aplicada.
- Periodo o antigüedad utilizados.
- Regla legal o supuesto manual.
- Fuente, artículos, vigencia y fecha de revisión.

### Comparación con oferta

```text
diferencia_finiquito =
  finiquito_pendiente_estimado - oferta_asignada_a_finiquito

diferencia_escenario =
  total_escenario_condicionado - oferta_total
```

Si sólo se capturó una oferta total, no inventar un desglose por conceptos.
Mostrar que no es posible saber qué incluye la oferta sin documentación.

### Acciones

- `Copiar resultado`: incluye fecha, situación declarada, desglose, conceptos
  condicionados, supuestos, versión de reglas y aviso legal.
- `Revisar datos`: lleva al primer bloque editable.
- `Comparar oferta`: visible después de un cálculo válido.
- `Consultar orientación oficial`: enlaza a PROFEDET.

---

## Validaciones y estados de la calculadora

### Errores bloqueantes

- Alcance laboral no confirmado.
- Fecha vacía, inválida o último día anterior al ingreso.
- Salario vacío, no finito o menor o igual a cero.
- Valor numérico vacío cuando el campo está activo, no finito o negativo.
- Días no elegibles superiores al periodo correspondiente.
- Prestación contractual inferior al mínimo del preset.
- Regla inexistente, vencida o incompatible con las fechas.
- Salario variable o régimen no soportado.
- Salario diario integrado capturado menor o igual a cero.

### Advertencias no bloqueantes

- Saldo anterior de vacaciones informado por el usuario.
- Monto de salarios pendientes sustituido manualmente.
- Salario diario integrado sustituido manualmente.
- Concepto excluido de la simulación.
- Prestación contractual superior al mínimo.
- Falta el desglose de una oferta total.
- La fecha de ingreso exige reglas históricas que el motor no reconstruye; los
  saldos anteriores dependen de la información proporcionada.
- Contrato, convenio, ausencias, comisiones o políticas internas pueden cambiar
  el resultado.
- El resultado no constituye una resolución ni asesoría legal.

### Estado sin datos

No mostrar `$0` como si fuera un resultado. Utilizar:

`Captura tu fecha de ingreso y salario para comenzar.`

### Resultado desactualizado

Después de calcular, cualquier cambio en un input marca el resultado como
desactualizado y desactiva su resumen fijo, copia y comparación hasta volver a
calcular.

### Cambio de reglas derivado de los datos

Si modificar la fecha o ubicación cambia el preset y existen ajustes manuales,
pedir confirmación antes de restablecerlos. Siempre ofrecer conservarlos cuando
sean compatibles con la nueva regla.

---

## Diseño mobile-first

### Jerarquía en pantallas pequeñas

1. H1 y explicación de una línea.
2. Aviso compacto de alcance.
3. Confirmación del régimen soportado.
4. Tarjetas de situación declarada.
5. Fechas y tipo de contrato.
6. Salario y salarios pendientes.
7. Prestaciones mínimas.
8. `Ajustar prestaciones`, colapsado.
9. `Conceptos adicionales`, colapsado.
10. `Pagos ya recibidos`, colapsado.
11. Botón `Calcular finiquito`, de ancho completo.
12. Finiquito bruto y pendiente.
13. Desglose.
14. `Explorar posible indemnización`, separado y sin activar.
15. Comparación opcional con oferta.
16. Cómo se calculó, fuentes, límites y orientación.

Todos los bloques usan una columna hasta el breakpoint de escritorio. No se
utilizan tablas horizontales dentro de la calculadora; conceptos y comparaciones
se presentan como tarjetas o filas apiladas.

### Controles

- Objetivo táctil mínimo de 44 px; preferentemente 48 px.
- Texto de al menos 16 px en inputs para evitar zoom automático móvil.
- Etiquetas visibles; no depender de placeholders.
- `inputmode="decimal"` para cantidades y días.
- Mostrar `MXN` y la frecuencia junto al salario sin ocupar un campo separado
  en cada fila de resultado.
- Errores junto al campo, vinculados mediante `aria-describedby` y
  `aria-invalid`.
- Las tarjetas de situación y controles segmentados deben ser utilizables con
  teclado y lector de pantalla.
- No comunicar estados exclusivamente mediante color o iconos.
- La ayuda contextual debe abrirse sin desplazar inesperadamente el foco.
- Con teclado móvil abierto, el botón y los mensajes del campo activo deben
  permanecer alcanzables.

### Resultados móviles

- Mostrar primero el significado completo y después la cifra; evitar cantidades
  sin contexto.
- Finiquito e indemnización usan encabezados y contenedores distintos.
- El total condicionado nunca se confunde visualmente con el finiquito.
- Fórmulas y fuentes pueden usar acordeones, pero `Estimación bruta` y
  `Escenario condicionado` permanecen visibles.
- Después de un cálculo válido, mostrar un resumen inferior compacto con
  `Finiquito pendiente estimado` y `Ver desglose`.
- El resumen inferior respeta `env(safe-area-inset-bottom)` y la página reserva
  espacio para que no cubra controles, errores o fuentes.
- Ocultar o neutralizar el resumen cuando el resultado esté desactualizado.
- Actualizar resultados con `aria-live="polite"` después de calcular; no
  anunciar cada pulsación durante la captura.
- Al existir un error de envío, mover el foco al resumen de errores y ofrecer un
  enlace al primer campo inválido.

### Escritorio

- El formulario puede ocupar una columna principal y el resumen una columna
  lateral fija dentro del contenedor.
- La jerarquía y el orden de lectura deben coincidir con móvil.
- No depender del diseño de dos columnas para comprender o completar el flujo.

### Matriz mínima de revisión visual

- Anchos de 320, 360, 390, 768, 1024 y 1440 px.
- Teclado móvil abierto.
- Área segura en dispositivos con indicador de inicio.
- Zoom del navegador al 200 %.
- Textos legales largos y errores de varias líneas.
- Importes de al menos nueve dígitos.
- Conceptos editados, condicionados y no determinados simultáneamente.
- Navegación completa sólo con teclado.
- Lectura del flujo con lector de pantalla.

---

## Privacidad y analítica

El cálculo se realiza localmente. No guardar ni enviar:

- Fechas de ingreso o salida.
- Motivo declarado.
- Salarios o importes.
- Antigüedad.
- Notas de conceptos.
- Oferta recibida.

Si el proyecto registra eventos, sólo se permiten eventos agregados:

- `termination_scope_confirmed`.
- `termination_situation_selected` sin enviar la opción como propiedad.
- `termination_calculation_completed`.
- `termination_conditional_scenario_opened`.
- `termination_offer_comparison_used`.
- `termination_out_of_scope_shown`.
- `termination_result_copied`.

---

## SEO y contenido editorial

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de finiquito y liquidación en México` |
| Meta description | `Estima tu finiquito bruto por salarios, aguinaldo, vacaciones y prima vacacional, y explora posibles indemnizaciones con desglose y fuentes.` |
| H1 | `Calculadora de finiquito y liquidación` |
| Keyword principal | `calculadora finiquito` |
| Keywords secundarias | `calculadora liquidación laboral`, `finiquito México`, `indemnización laboral`, `prima de antigüedad` |

Contenido complementario mínimo:

- Diferencia entre finiquito y liquidación.
- Qué conceptos puede incluir un finiquito.
- Diferencia entre salario diario y salario integrado.
- Por qué los veinte días por año no se incluyen automáticamente.
- Cuándo puede considerarse la prima de antigüedad.
- Qué no calcula la herramienta.
- Qué documentos ayudan a revisar una oferta: contrato, recibos de nómina,
  constancias de vacaciones, comprobantes de pago y propuesta desglosada.
- Plazos orientativos para solicitar prestaciones o actuar ante un despido, con
  fuente oficial, fecha de revisión y advertencia de que pueden existir reglas
  especiales o suspensión por conciliación.
- Cómo obtener orientación gratuita de PROFEDET.

Las preguntas frecuentes y avisos deben utilizar lenguaje condicional. No
afirmar que el motivo seleccionado demuestra por sí mismo la existencia de un
derecho o el importe definitivo.

---

## Pruebas unitarias y de aceptación

### Salario y unidades

- Salario semanal se divide entre siete.
- Salario mensual se divide entre treinta.
- Cada variable declara si representa días, porcentaje o MXN.
- Los días de vacaciones se monetizan antes de sumarse al finiquito.
- El pago base de vacaciones se suma una sola vez.
- El salario diario integrado nunca sustituye al ordinario en prestaciones sin
  que la regla lo indique.
- No se redondean cálculos intermedios.

### Fechas

- El último día de la relación se incluye.
- El cálculo no cambia por zona horaria u horario de verano.
- Los ciclos bisiestos utilizan su base definida.
- Un ingreso el 29 de febrero aplica consistentemente
  `addCalendarYearsClamped`.
- Un aniversario exacto cierra el ciclo anterior sin añadir un día al siguiente.

### Prestaciones

- El aguinaldo de un periodo completo produce el número anual de días por
  salario diario.
- Días no elegibles reducen el aguinaldo y nunca superan el periodo.
- Vacaciones pendientes coinciden con el motor de vacaciones proporcionales en
  modo de terminación.
- La prima vacacional usa exactamente el pago de vacaciones calculado.
- Prestaciones contractuales inferiores al mínimo legal bloquean el cálculo.
- Saldos anteriores y valores manuales aparecen en el registro de supuestos.

### Prima de antigüedad

- Una renuncia voluntaria inferior a la antigüedad mínima no activa la prima.
- Una renuncia que alcanza la antigüedad mínima puede explorarla.
- Un despido no reutiliza la condición mínima de la renuncia voluntaria.
- La condición de persona trabajadora de planta se valida.
- El tope utiliza el área geográfica y periodo correctos.
- La política para fracciones de año proviene del preset y se muestra.

### Indemnizaciones condicionadas

- Ninguna se activa al elegir un motivo.
- Tres meses utilizan el salario diario integrado por noventa días.
- Capturar manualmente el salario integrado registra la sustitución.
- Veinte días por año permanece en opciones avanzadas y requiere confirmación.
- Un tipo de contrato no soportado produce `No calculado`, no una fórmula
  aproximada.
- Salarios vencidos e intereses nunca se incluyen en el MVP.

### Totales y comparación

- `Finiquito bruto` no incluye indemnizaciones.
- `Total condicionado` incluye sólo escenarios confirmados.
- Pagos recibidos reducen el pendiente sin producir un resultado negativo.
- Un pago asociado a un concepto se descuenta una sola vez.
- Un pago sin desglose no marca prestaciones concretas como pagadas.
- Una oferta total no genera un desglose inventado.
- La diferencia contra una oferta nunca se etiqueta como deuda.
- Modificar cualquier input invalida el resultado hasta recalcular.

### Reglas, privacidad y accesibilidad

- Un preset vencido o incompatible bloquea el cálculo automático.
- Fuente, artículos, vigencia y fecha de revisión corresponden al preset usado.
- No se envían valores sensibles en eventos de analítica.
- El flujo es utilizable a 320 px sin desplazamiento horizontal.
- Todos los controles cumplen el tamaño táctil mínimo.
- Errores y estados son comprensibles sin depender del color.
- El resultado se anuncia una sola vez después de calcular.
- El resumen inferior no cubre contenido y desaparece al invalidarse.

---

## Criterios de aceptación del MVP

- El alcance de México, régimen privado general, trabajo continuo y salario fijo
  aparece antes de capturar importes.
- El usuario distingue salario diario ordinario de salario diario integrado.
- Vacaciones se calculan primero en días y se convierten una sola vez a dinero.
- El resultado principal siempre identifica que es un finiquito bruto estimado.
- La prima de antigüedad muestra sus condiciones, tope y área salarial.
- Ninguna indemnización se activa automáticamente por el motivo declarado.
- Los veinte días por año se presentan como escenario avanzado condicionado.
- Todo importe puede reproducirse mediante fórmula, valores y regla mostrados.
- Los conceptos editados, ya pagados, excluidos y no determinados permanecen
  visibles en el desglose.
- La comparación con una oferta no presenta la diferencia como deuda cierta.
- Los casos fuera de alcance no reciben una estimación automática genérica.
- Fuente legal, artículos, versión y fecha de revisión son accesibles desde el
  resultado.
- La calculadora funciona completamente a 320 px, con teclado y lector de
  pantalla.
- Las pruebas unitarias y la matriz visual están cubiertas antes de publicar.
