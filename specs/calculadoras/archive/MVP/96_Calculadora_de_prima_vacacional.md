# Especificación v2 - Calculadora de prima vacacional en México

## Descripción general

Herramienta para estimar la prima vacacional conforme a la Ley Federal del
Trabajo (LFT) de México y explicar con claridad la diferencia entre:

- El salario ordinario correspondiente a los días de vacaciones.
- La prima vacacional, que es una cantidad adicional.
- El componente vacacional que podría incluirse en un finiquito.

La herramienta debe evitar presentar el salario ordinario de las vacaciones
como si siempre fuera un depósito adicional. También debe permitir comparar el
mínimo legal con una prestación contractual superior o con un porcentaje
ofrecido o pagado por el empleador.

**Arquitectura:** cálculo en cliente con reglas legales locales versionadas. No
requiere backend. Las reglas, fuentes y fecha de revisión deben mantenerse junto
al código y revisarse periódicamente.

---

## Objetivo de producto

- Responder cuánto corresponde de prima vacacional adicional.
- Distinguir el cálculo durante una relación laboral del cálculo para finiquito.
- Ayudar a obtener los días de vacaciones cuando el usuario no los conoce.
- Explicar la base, los días y el porcentaje utilizados.
- Comparar el mínimo legal con una prestación contractual superior.
- Detectar una posible diferencia cuando el porcentaje ofrecido o pagado es
  inferior al mínimo legal.
- Mostrar la regla, su vigencia, sus fuentes y los límites de la estimación.
- Producir un resultado reproducible sin exigir conocimientos de nómina.

---

## Alcance

### MVP

- México, bajo el régimen general de la LFT para relaciones laborales del
  sector privado.
- Salario fijo ordinario expresado como importe bruto.
- Dos situaciones: vacaciones durante la relación laboral y terminación de la
  relación laboral.
- Captura directa de días o cálculo guiado mediante la lógica existente de
  vacaciones proporcionales.
- Porcentaje mínimo legal vigente de 25 %.
- Porcentaje contractual superior al mínimo.
- Comparación opcional contra un porcentaje ofrecido o pagado, incluso cuando
  sea inferior al mínimo.
- Resultados en pesos mexicanos y antes de impuestos.
- Fuente legal, versión y fecha de revisión visibles.

### Fuera del MVP

- Empleo público y regímenes distintos de la LFT general.
- Trabajo discontinuo, de temporada u otros regímenes especiales.
- Salario variable, mixto, por unidad de obra o con bases que requieran un
  promedio especial.
- Determinar automáticamente el salario correcto desde un recibo de nómina.
- Sustituir vacaciones por dinero mientras continúa la relación laboral.
- Calcular un finiquito completo, indemnización u otras prestaciones.
- Determinar prescripción, exigibilidad o validez de saldos históricos.
- Reglas de otros países.
- Retención exacta de ISR o importe neto a depositar.

Cuando el caso esté fuera del alcance, la interfaz debe explicarlo antes de
calcular y no producir un resultado legal genérico.

### Fase 2

- Salario variable o mixto con reglas y periodos de promedio documentados.
- Desglose fiscal estimado entre importe exento y gravado, considerando la UMA
  aplicable y los pagos acumulados del mismo año calendario.
- Reglas por contrato colectivo, convenio o régimen especial.
- Historial de periodos con salarios o porcentajes distintos.
- Presets de otros países.

La Fase 2 no debe prometer un importe neto de ISR sin contar con la información
completa de nómina necesaria para estimar la retención.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL pública | `/legal-impuestos/calculadora-prima-vacacional` |
| Archivo Astro | `src/pages/legal-impuestos/calculadora-prima-vacacional.astro` |
| Lógica de cálculo | `src/lib/calculators/legal-impuestos/calculadora-prima-vacacional/vacationPremium.ts` |
| Reglas locales | `src/lib/calculators/legal-impuestos/calculadora-prima-vacacional/rules/mx/2023.ts` |
| Pruebas unitarias | `src/lib/calculators/legal-impuestos/calculadora-prima-vacacional/vacationPremium.test.ts` |
| Categoría | `legal-impuestos` |
| País y moneda iniciales | `México · MXN` |
| Locale inicial | `es-MX` |

---

## Fundamento y alcance legal del preset de México

El preset se basa principalmente en los artículos 76 a 81 de la LFT:

- El artículo 76 establece los días mínimos de vacaciones por antigüedad.
- El artículo 79 impide sustituir normalmente las vacaciones por una
  remuneración y reconoce una remuneración proporcional al terminar la
  relación antes de completar el año de servicios.
- El artículo 80 establece una prima no menor de 25 % sobre los salarios que
  correspondan durante el periodo de vacaciones.

El MVP debe hablar de `salario diario ordinario`. No debe pedir ni sugerir el
uso automático del salario diario integrado (SDI). Si el salario es variable,
mixto o su determinación requiere reglas adicionales, el caso queda fuera del
MVP.

### Fuentes oficiales iniciales

- [Cámara de Diputados - Ley Federal del Trabajo vigente](https://www.diputados.gob.mx/LeyesBiblio/pdf/LFT.pdf),
  artículos 76 a 81.
- [PROFEDET - Prima vacacional](https://www.profedet.gob.mx/micrositio/index.php/prima-vacacional).
- [PROFEDET - Vacaciones](https://www.profedet.gob.mx/micrositio/index.php/vacaciones).

La página debe mostrar la fecha de última revisión del preset. Esta fecha debe
provenir de los datos de la regla y no escribirse manualmente en el contenido.

---

## Modelo de reglas sugerido

```ts
interface VacationPremiumSource {
  title: string;
  url: string;
  articles?: string[];
  accessedAt: string;
}

interface VacationPremiumRuleSet {
  id: string;
  country: "MX";
  jurisdiction: "federal";
  employmentRegime: "lft-private-sector-general";
  currency: "MXN";
  ruleVersion: string;
  supportedFrom: string;
  supportedTo?: string;
  status: "current" | "expired" | "draft";
  minimumPremiumRate: number;
  premiumBase: "ordinary-vacation-wages";
  vacationDayUnit: "working-days";
  sources: VacationPremiumSource[];
  reviewedAt: string;
}
```

`supportedFrom` representa el límite de cobertura del producto y no debe
presentarse como si fuera necesariamente la fecha en que nació el derecho
legal. El porcentaje se almacena como decimal (`0.25`) y se muestra como
porcentaje (`25 %`).

Mientras sólo exista un preset, no mostrar selectores de país, jurisdicción o
periodo. La interfaz debe mostrar una etiqueta no editable:

`México · LFT · mínimo legal vigente: 25 %`

---

## Terminología de producto

| Término | Definición |
|---------|------------|
| Salario diario ordinario | Importe bruto del salario que corresponde a un día normal de trabajo dentro del alcance de salario fijo del MVP. |
| Días de vacaciones | Días laborables que se disfrutarán, pagarán o considerarán en el finiquito. |
| Base vacacional | Salario diario ordinario multiplicado por los días de vacaciones. |
| Prima vacacional | Cantidad adicional calculada sobre la base vacacional. |
| Porcentaje legal | Mínimo de 25 % establecido por el artículo 80 de la LFT. |
| Porcentaje contractual | Porcentaje superior al mínimo legal reconocido por contrato, convenio o política del empleador. |
| Porcentaje ofrecido o pagado | Dato opcional usado sólo para comparar; no sustituye el mínimo legal aplicable. |
| Componente vacacional del finiquito | Suma de la remuneración por vacaciones pendientes y su prima; no equivale al finiquito completo. |

---

## Flujo principal

### 1. Selección de situación

Primer control visible, mediante dos tarjetas o botones segmentados:

- `Voy a disfrutar o revisar mis vacaciones`
- `Terminó mi relación laboral`

Cada opción debe incluir una explicación de una línea. No utilizar un selector
desplegable para esta decisión principal.

Solicitar después una `Fecha de cálculo o pago`, con la fecha actual como valor
inicial. Esta fecha selecciona la versión de reglas aplicable y permite
reproducir la estimación. Una fecha no cubierta por los presets disponibles debe
bloquear el cálculo automático.

Inmediatamente después debe mostrarse un aviso compacto de alcance:

`Esta estimación usa la LFT para salario fijo y trabajo continuo en el sector
privado. No aplica automáticamente a empleo público, trabajo de temporada o
salario variable.`

### 2. Obtención de los días

Mostrar dos opciones:

- `Ya conozco mis días`
- `Ayúdame a calcularlos`

#### Captura directa

Solicitar `Días laborables de vacaciones`. La ayuda debe explicar que no se
capturan días calendario ni fines de semana que no formen parte de la
prestación.

#### Cálculo guiado

Reutilizar la lógica y las reglas de la calculadora de vacaciones
proporcionales; no duplicar la tabla legal ni el algoritmo de aniversarios.

Datos mínimos:

- Fecha de ingreso.
- Fecha de corte o último día trabajado, según la situación.
- Saldo anterior informado.
- Días usados o ya liquidados.
- Prestación contractual superior, cuando corresponda.

En relación laboral activa, mostrar primero los días disponibles estimados y
preguntar cuántos de ellos se disfrutarán o revisarán. En terminación, utilizar
los días estimados para finiquito. El usuario debe confirmar los días antes de
calcular importes.

Si la lógica de vacaciones produce más de dos decimales, mostrar el valor
original y el valor normalizado a dos decimales que se utilizará en esta
calculadora. Aplicar una sola política de redondeo al confirmar; no redondear de
nuevo durante las operaciones monetarias.

Si el cálculo guiado queda fuera del alcance de las reglas disponibles, no
transferir silenciosamente un resultado aproximado; dirigir a la calculadora de
vacaciones y explicar la limitación.

### 3. Salario

Campo principal:

`Salario diario ordinario bruto`

Debe incluir ayuda para localizarlo en un recibo de nómina y una advertencia de
que el MVP no determina bases variables, mixtas ni SDI.

En una ayuda desplegable se puede ofrecer conversión aritmética para salario
fijo:

| Periodicidad conocida | Conversión mostrada |
|-----------------------|---------------------|
| Diario | Importe capturado |
| Semanal | Importe / 7 |
| Quincenal | Importe / 15 |
| Mensual | Importe / 30 |

La interfaz debe mostrar el salario diario resultante antes de calcular y
aclarar que la conversión no sustituye la revisión del recibo, contrato o
criterio de nómina aplicable.

### 4. Porcentaje aplicable

Por defecto se usa y muestra el mínimo legal de 25 %.

En `Opciones avanzadas`, permitir:

- `Mi contrato ofrece una prima mayor`: habilita un porcentaje contractual que
  debe ser mayor o igual al mínimo legal.
- `Quiero comparar un porcentaje ofrecido o pagado`: habilita un porcentaje de
  comparación que puede ser inferior al mínimo, pero nunca reemplaza el
  resultado legal o contractual.

El campo debe llevar un sufijo visible `%`. Capturar `25` significa `25 %` y se
normaliza internamente a `0.25`; nunca debe interpretarse como un multiplicador
de `25`.

### 5. Cálculo

Usar un botón explícito `Calcular prima vacacional`. No anunciar resultados
mientras el usuario todavía escribe. Cambiar cualquier dato debe marcar el
resultado anterior como desactualizado hasta volver a calcular.

---

## Inputs del MVP

| Campo | Tipo | Validación | Valor inicial |
|-------|------|------------|---------------|
| Situación | Botones segmentados | Opción requerida | Vacío |
| Fecha de cálculo o pago | `date` | Fecha cubierta por un preset | Hoy |
| Origen de los días | Botones segmentados | Directo o guiado | Directo |
| Días laborables de vacaciones | Texto numérico decimal | `> 0`, máximo 2 decimales | Vacío |
| Salario diario ordinario | Texto monetario decimal | `> 0`, máximo 2 decimales | Vacío |
| Prima contractual (%) | Texto numérico decimal | `>= mínimo legal`, máximo 2 decimales | Oculto |
| Porcentaje ofrecido o pagado (%) | Texto numérico decimal | `>= 0`, máximo 2 decimales | Oculto |

Los campos del cálculo guiado se rigen además por las validaciones de la
calculadora de vacaciones proporcionales.

Los parsers deben aceptar punto o coma decimal, rechazar valores no finitos y
normalizar los datos antes del cálculo. Un porcentaje superior a 100 % no se
bloquea por una regla legal inventada, pero debe producir una advertencia de
confirmación para prevenir errores de captura.

---

## Fórmulas y algoritmo

```text
base_vacacional = salario_diario_ordinario * dias_vacaciones

prima_minima = base_vacacional * porcentaje_minimo_legal

porcentaje_aplicable = existe_porcentaje_contractual
  ? porcentaje_contractual
  : porcentaje_minimo_legal

prima_aplicable = base_vacacional * porcentaje_aplicable

beneficio_sobre_minimo = max(0, prima_aplicable - prima_minima)
```

Cuando existe un porcentaje ofrecido o pagado:

```text
prima_ofrecida = base_vacacional * porcentaje_ofrecido
diferencia_con_aplicable = prima_aplicable - prima_ofrecida
```

En relación laboral activa:

```text
pago_adicional_estimado = prima_aplicable
```

La base vacacional se muestra como el salario ordinario correspondiente al
periodo, pero no se etiqueta como ingreso adicional ni como depósito esperado.

En terminación:

```text
componente_vacacional_finiquito = base_vacacional + prima_aplicable
```

Este total debe llamarse `Componente vacacional estimado del finiquito`; nunca
`Finiquito total`.

No redondear valores intermedios. Conservar la precisión interna y redondear
cada importe monetario final a centavos para presentación. La política de
redondeo debe ser única, explícita y estar cubierta por pruebas. Los resultados
se formatean con `Intl.NumberFormat("es-MX", { style: "currency", currency:
"MXN" })`.

Cuando los días pertenecen a periodos con salarios o porcentajes distintos, el
MVP debe pedir que se calculen por separado y no combinar bases incompatibles.

---

## Resultados y contenido dinámico

### Relación laboral activa

Resultado principal:

`Prima vacacional adicional estimada: $X`

Desglose:

- Días laborables considerados.
- Salario diario ordinario.
- Salario ordinario correspondiente a esos días.
- Porcentaje mínimo legal y prima mínima.
- Porcentaje aplicado y prima aplicable.
- Beneficio adicional sobre el mínimo, cuando exista.

Junto a la base debe permanecer visible:

`El salario de estos días normalmente forma parte de tu sueldo ordinario; la
prima es la cantidad adicional estimada.`

### Terminación de la relación laboral

Resultado principal:

`Componente vacacional estimado del finiquito: $X`

Desglose:

- Vacaciones pendientes o proporcionales en dinero.
- Prima vacacional aplicable.
- Porcentaje y regla utilizados.
- Aclaración de que no incluye aguinaldo, salarios pendientes, indemnización ni
  otras prestaciones.

### Comparación de un pago u oferta

Cuando el usuario captura un porcentaje ofrecido o pagado, mostrar:

- Prima que correspondería con la regla legal o contractual aplicable.
- Prima ofrecida o pagada según el dato del usuario.
- Diferencia estimada a favor o por encima del mínimo.

Una diferencia positiva a favor del usuario debe presentarse como posible
diferencia para revisión, no como deuda legal definitivamente determinada.

### Explicación común

- Mostrar la fórmula con los valores sustituidos.
- Mostrar el origen de los días: capturados o calculados.
- Ofrecer `Cómo se calculó` y `Copiar resultado`.
- El texto copiado debe incluir fecha, situación, inputs, desglose, regla,
  fuente y aviso de estimación.
- Mostrar fuente, artículos, cobertura y fecha de revisión junto al resultado.
- Mantener visible que todos los importes son brutos y antes de impuestos.

---

## Validaciones y estados

### Errores bloqueantes

- Situación no seleccionada.
- Salario o días vacíos, no finitos, iguales a cero o negativos.
- Más de dos decimales en importes, días o porcentajes.
- Porcentaje contractual inferior al mínimo legal.
- Fecha final anterior a la fecha de ingreso en el cálculo guiado.
- No existe una regla compatible con la fecha o el régimen indicado.
- Caso declarado como empleo público, trabajo discontinuo, de temporada o
  salario variable o mixto.

### Advertencias no bloqueantes

- Porcentaje ofrecido o pagado inferior al mínimo legal: mantener el cálculo
  aplicable y mostrar la diferencia.
- Porcentaje capturado superior a 100 %: pedir confirmación.
- Días con fracciones: aclarar que pueden representar una proporción monetaria
  y que el disfrute efectivo puede administrarse de otra manera.
- Los días provienen de un saldo informado por el usuario que la herramienta no
  puede verificar.
- Contrato, convenio, ausencias, políticas internas o composición salarial
  pueden cambiar el resultado.
- El cálculo no constituye una resolución vinculante ni asesoría legal.

### Estado sin datos

No mostrar ceros que parezcan un resultado. Utilizar:

`Selecciona tu situación y captura tus datos para comenzar.`

### Estado desactualizado

Si cambia cualquier input después de calcular:

`Tus datos cambiaron. Vuelve a calcular para actualizar el resultado.`

El resumen móvil fijo debe ocultarse o neutralizarse en este estado.

### Estado fuera de alcance

Explicar qué dato dejó el caso fuera del MVP y dirigir a una fuente oficial o a
asesoría laboral. No aplicar silenciosamente el 25 % sobre una base salarial que
la herramienta no puede determinar.

---

## Diseño mobile-first

### Jerarquía en pantallas pequeñas

1. Título y descripción breve.
2. Selector de situación.
3. Aviso compacto de alcance.
4. Origen y número de días.
5. Salario diario.
6. Regla legal visible y opciones avanzadas colapsadas.
7. Botón `Calcular prima vacacional` de ancho completo.
8. Resultado principal.
9. Desglose y comparación.
10. Cómo se calculó, fuentes y aviso legal.

Todos los elementos usan una sola columna hasta el breakpoint de escritorio.
No utilizar tablas horizontales dentro de la calculadora; los desgloses se
presentan como filas apiladas.

### Controles

- Altura táctil mínima de 44 px; preferentemente 48 px.
- Texto de al menos 16 px en inputs para evitar zoom automático móvil.
- Etiquetas siempre visibles; no depender de placeholders.
- Sufijos visibles para `MXN`, días y `%` sin impedir la edición.
- `inputmode="decimal"` en cantidades y `autocomplete="off"` cuando corresponda.
- Errores junto al campo, asociados mediante `aria-describedby` y
  `aria-invalid`.
- Botones segmentados utilizables con teclado y lector de pantalla.
- No comunicar errores, diferencias o estados únicamente mediante color.
- Mantener visible el valor convertido de salario diario cuando se use otra
  periodicidad.

### Resultado móvil

- Mostrar siempre cifra, moneda y significado completo; evitar números sin
  contexto.
- Mantener la prima como resultado principal en relación laboral activa.
- Después del primer cálculo válido se puede mostrar un resumen inferior fijo
  con el resultado principal y un enlace `Ver desglose`.
- El resumen debe respetar `env(safe-area-inset-bottom)` y la página debe añadir
  espacio inferior para que no cubra campos, errores o fuentes.
- Ocultar o neutralizar el resumen cuando el resultado esté desactualizado.
- Anunciar el resultado con `aria-live="polite"` sólo después de calcular.
- La naturaleza estimada y bruta del resultado debe permanecer visible aunque
  las fuentes estén dentro de un acordeón.

### Matriz mínima de revisión visual

- Anchos de 320, 360, 390, 768 y 1024 px.
- Teclado móvil abierto.
- Zoom del navegador al 200 %.
- Mensajes de error largos.
- Valores monetarios grandes y porcentajes con decimales.
- Área segura en dispositivos con indicador de inicio.
- Navegación completa sólo con teclado.

---

## Analítica respetuosa de privacidad

Si el proyecto registra eventos, no enviar fechas, salarios, días, porcentajes
ni resultados. Sólo se permiten eventos agregados como:

- `vacation_premium_situation_selected`
- `vacation_premium_days_source_selected`
- `vacation_premium_calculation_completed`
- `vacation_premium_comparison_used`
- `vacation_premium_out_of_scope_shown`
- `vacation_premium_result_copied`

La situación y el origen general de los días pueden enviarse como propiedades;
las cantidades introducidas o calculadas no.

---

## SEO y contenido editorial

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de prima vacacional en México` |
| Meta description | `Calcula tu prima vacacional en México con salario, días y porcentaje legal o contractual. Compara el mínimo de la LFT y estima su parte en un finiquito.` |
| H1 | `Calculadora de prima vacacional` |
| Keyword principal | `calculadora prima vacacional` |
| Keywords secundarias | `prima vacacional México`, `pago de vacaciones`, `porcentaje prima vacacional`, `prima vacacional finiquito` |

Contenido complementario mínimo:

- Qué es la prima vacacional y por qué es adicional al salario.
- Diferencia entre vacaciones disfrutadas y vacaciones en un finiquito.
- Qué salario y qué días utilizar.
- Diferencia entre el porcentaje mínimo y uno contractual.
- Qué hacer si el porcentaje pagado parece menor.
- Tratamiento fiscal general sin prometer una retención exacta.
- Preguntas frecuentes con fuentes oficiales y fecha de revisión.

---

## Pruebas unitarias y de aceptación

### Fórmulas

- Salario `100`, `10` días y `25 %` producen base `1,000` y prima `250`.
- En relación activa, el resultado principal anterior es `250`, no `1,250`.
- En terminación, el componente vacacional del ejemplo es `1,250`.
- Salario `100`, `10` días y prima contractual de `30 %` producen prima `300`,
  mínimo `250` y beneficio adicional `50`.
- Un porcentaje ofrecido de `20 %` produce prima ofrecida `200` y diferencia
  estimada de `100` contra una prima contractual aplicable de `30 %`.
- Salario `333.33`, `12` días y `25 %` producen prima presentada de `999.99`.
- No se redondea la base antes de calcular la prima.

### Parsing y validación

- Capturar `25` en el campo de porcentaje se normaliza a `0.25`.
- Capturar `25,5` y `25.5` produce el mismo porcentaje.
- `0.25` capturado en la UI significa `0.25 %`, no `25 %`.
- Salario o días vacíos, cero, negativos, infinitos o no numéricos bloquean el
  cálculo.
- Más de dos decimales produce un error junto al campo.
- Porcentaje contractual inferior a 25 % bloquea el cálculo contractual.
- Porcentaje ofrecido inferior a 25 % conserva la regla aplicable y activa la
  comparación.
- Un preset vencido o incompatible bloquea el cálculo automático.

### Situaciones y días

- La relación activa nunca etiqueta la base vacacional como dinero adicional.
- La terminación nunca etiqueta el resultado como finiquito completo.
- El modo directo conserva exactamente los días confirmados por el usuario.
- El modo guiado reutiliza la lógica de vacaciones proporcionales sin duplicar
  sus reglas y utiliza los días normalizados que el usuario confirmó.
- Un resultado guiado con más de dos decimales muestra antes de confirmar tanto
  el valor original como el valor normalizado que se utilizará.
- En relación activa, el usuario puede elegir menos días que su saldo estimado.
- En terminación, se usan los días estimados para finiquito confirmados por el
  usuario.
- Un caso fuera del régimen soportado no produce resultado.

### Presentación y accesibilidad

- Todos los importes se muestran en MXN con dos decimales.
- Fuente, artículos, cobertura y fecha de revisión corresponden al preset usado.
- Cambiar cualquier input invalida el resultado y oculta el resumen fijo.
- El resultado se anuncia una sola vez después de pulsar calcular.
- Los errores están asociados al campo y no dependen únicamente del color.
- La interfaz no tiene desplazamiento horizontal a 320 px.
- El resumen fijo no cubre contenido con área segura ni teclado móvil.

---

## Criterios de aceptación del MVP

- El usuario identifica antes de introducir importes si calcula vacaciones
  durante el empleo o un componente de finiquito.
- La prima adicional es el resultado principal durante la relación laboral.
- El salario ordinario de los días nunca se presenta como un ingreso adicional
  garantizado.
- Un porcentaje contractual inferior al mínimo legal no puede sustituir la
  regla aplicable.
- Un porcentaje ofrecido inferior al mínimo produce una comparación clara y no
  un cálculo legal aparentemente válido.
- El usuario puede calcular aunque no conozca inicialmente sus días de
  vacaciones.
- El resultado puede reproducirse mediante el desglose y la fórmula mostrados.
- Todos los importes indican que son brutos y antes de impuestos.
- Los límites del MVP aparecen antes o junto al resultado, no sólo al final de
  la página.
- La calculadora es plenamente utilizable a 320 px sin desplazamiento
  horizontal.
- La fuente legal y su fecha de revisión son visibles desde el resultado.
- Las pruebas unitarias, de accesibilidad y la matriz mobile-first están
  cubiertas antes de publicar.
