# Especificación v2 - Calculadora de vacaciones proporcionales en México

## Descripción general

Herramienta para estimar vacaciones conforme a la Ley Federal del Trabajo (LFT)
de México en dos situaciones distintas:

1. Una persona continúa trabajando y quiere conocer sus vacaciones adquiridas,
   su saldo estimado y el avance informativo hacia el siguiente aniversario.
2. La relación laboral terminó y se necesita estimar la parte proporcional de
   vacaciones que podría formar parte del finiquito.

La herramienta debe distinguir con claridad entre días adquiridos, avance
proporcional todavía no adquirido y remuneración proporcional por terminación.
No debe presentar las tres cifras como si fueran el mismo derecho disponible.

**Arquitectura:** cálculo en cliente con reglas legales locales versionadas. No
requiere backend. Las reglas, fuentes y fecha de revisión deben mantenerse junto
al código y revisarse periódicamente.

---

## Objetivo de producto

- Responder con lenguaje sencillo cuántos días podría tener disponibles una
  persona o cuántos días proporcionales podrían incluirse en su finiquito.
- Explicar el cálculo por aniversarios laborales sin exigir conocimientos
  legales o de nómina.
- Mostrar por separado el derecho adquirido y el avance del ciclo en curso.
- Permitir prestaciones contractuales superiores al mínimo legal.
- Mostrar la regla utilizada, su vigencia, sus fuentes y los límites de la
  estimación.
- Evitar resultados aparentemente exactos cuando faltan saldos históricos o el
  caso pertenece a un régimen no soportado.

---

## Alcance

### MVP

- México, bajo el régimen general de la LFT para relaciones laborales del
  sector privado.
- Personas con trabajo continuo y una fecha de ingreso conocida.
- Regla mínima vigente desde el 1 de enero de 2023.
- Dos modos: `activeEmployment` y `terminatedEmployment`.
- Cálculo por aniversarios laborales.
- Prestación legal o valores contractuales manuales superiores.
- Saldo anterior informado por el usuario.
- Días disfrutados o ya liquidados desde el último aniversario.
- Resultado desglosado y explicación reproducible.

### Fuera del MVP

- Trabajadores al servicio del Estado y otros regímenes distintos de la LFT
  general.
- Trabajo discontinuo, de temporada o regímenes especiales.
- Reconstrucción automática de saldos de todos los años anteriores.
- Determinar prescripción, exigibilidad o validez de un saldo histórico.
- Ausencias o suspensiones que pudieran modificar el tiempo computable.
- Conversión a dinero, salario diario y prima vacacional.
- Fechas de cálculo anteriores al 1 de enero de 2023.
- Reglas de otros países.

Cuando el caso esté fuera del alcance, la interfaz debe explicarlo antes de
calcular y no producir un resultado legal genérico.

### Fase 2

- Historial editable por cada aniversario laboral.
- Reglas anteriores a 2023 y transición entre versiones.
- Trabajo discontinuo o de temporada.
- Ausencias que no generan vacaciones.
- Pago estimado, prima vacacional e integración con finiquito.
- Reglas de contratos colectivos, convenios y otros regímenes.
- Presets de otros países.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL pública | `/legal-impuestos/calculadora-vacaciones-proporcionales` |
| Archivo Astro | `src/pages/legal-impuestos/calculadora-vacaciones-proporcionales.astro` |
| Lógica de cálculo | `src/lib/calculators/legal-impuestos/calculadora-vacaciones-proporcionales/proportionalVacation.ts` |
| Reglas locales | `src/lib/calculators/legal-impuestos/calculadora-vacaciones-proporcionales/rules/mx/2023.ts` |
| Pruebas unitarias | `src/lib/calculators/legal-impuestos/calculadora-vacaciones-proporcionales/proportionalVacation.test.ts` |
| Categoría | `legal-impuestos` |
| Locale inicial | `es-MX` |

---

## Fundamento y alcance legal del preset de México

El preset se basa en los artículos 76 a 81 de la LFT:

- El artículo 76 expresa la prestación anual en días laborables y establece la
  tabla mínima por años de servicio.
- El artículo 77 establece una regla específica para trabajo discontinuo y de
  temporada, que queda fuera del MVP.
- El artículo 78 regula el disfrute continuo de al menos doce días y la potestad
  de distribuirlos.
- El artículo 79 impide sustituir normalmente las vacaciones por dinero y
  reconoce una remuneración proporcional cuando termina la relación laboral
  antes de completar el año de servicios.
- El artículo 80 establece una prima vacacional mínima de 25 %, que no se
  calcula en este MVP.
- El artículo 81 dispone que las vacaciones deben concederse dentro de los seis
  meses siguientes al cumplimiento del año de servicios.

### Fuentes oficiales

- [Cámara de Diputados - Ley Federal del Trabajo vigente](https://www.diputados.gob.mx/LeyesBiblio/pdf/LFT.pdf)
- [PROFEDET - Vacaciones](https://profedet.gob.mx/micrositio/index.php/vacaciones)
- [PROFEDET - Renuncia voluntaria](https://www.profedet.gob.mx/micrositio/index.php/renuncia-voluntaria)

La página debe mostrar la fecha de última revisión del preset. La fecha no debe
escribirse manualmente en el contenido de la página: debe provenir de los datos
de la regla.

---

## Terminología de producto

| Término | Definición |
|---------|------------|
| Año de servicio | Periodo comprendido entre una fecha de aniversario laboral y la siguiente. |
| Años completados | Número de aniversarios laborales completados a la fecha de cálculo. |
| Derecho adquirido | Días que corresponden por un año de servicio ya completado. |
| Saldo anterior | Días pendientes que el usuario o su empleador reconocen inmediatamente antes del último aniversario. No se reconstruye ni valida. |
| Días usados | Días disfrutados o ya liquidados desde el último aniversario. |
| Avance del ciclo | Prorrateo informativo del tiempo transcurrido desde el último aniversario. No debe etiquetarse como saldo disponible mientras la relación continúa. |
| Parte proporcional por terminación | Estimación correspondiente al ciclo incompleto cuando termina la relación laboral. |
| Fecha de corte | Fecha hasta la que continúa la relación laboral. Se incluye en el cálculo. |
| Último día trabajado | Fecha final de la relación laboral. Se incluye en el cálculo. |

---

## Reglas de vacaciones en México

### Tabla mínima vigente

| Año de servicio | Días laborables |
|-----------------|-----------------|
| 1 | 12 |
| 2 | 14 |
| 3 | 16 |
| 4 | 18 |
| 5 | 20 |
| 6 a 10 | 22 |
| 11 a 15 | 24 |
| 16 a 20 | 26 |
| 21 a 25 | 28 |
| 26 a 30 | 30 |

A partir del sexto año, el derecho aumenta dos días por cada bloque adicional
de cinco años. La implementación no debe terminar en el año 30; debe poder
calcular antigüedades superiores mediante la misma regla.

```text
si año_de_servicio <= 5:
  derecho = 10 + 2 * año_de_servicio

si año_de_servicio >= 6:
  derecho = 20 + 2 * ceil((año_de_servicio - 5) / 5)
```

### Modelo de datos sugerido

```ts
interface VacationSource {
  title: string;
  url: string;
  articles?: string[];
  accessedAt: string;
}

interface VacationEntitlement {
  serviceYearFrom: number;
  serviceYearTo?: number;
  workingDays: number;
}

interface VacationRuleSet {
  id: string;
  country: "MX";
  employmentRegime: "lft-private-sector-general";
  ruleVersion: string;
  effectiveFrom: string;
  effectiveTo?: string;
  status: "current" | "expired" | "draft";
  entitlementUnit: "working-days";
  prorationBasis: "calendar-days-between-anniversaries";
  entitlementByServiceYear: VacationEntitlement[];
  sources: VacationSource[];
  reviewedAt: string;
}
```

La regla no debe declarar un redondeo legal si la fuente no lo establece. La
precisión de presentación pertenece a la configuración del producto, no al
preset legal.

---

## Flujo principal

### 1. Selección de situación

Primer control visible, mediante dos tarjetas o botones segmentados:

- `Sigo trabajando`
- `Terminó mi relación laboral`

Debe incluirse una explicación de una línea bajo cada opción. No utilizar un
selector desplegable para esta decisión principal.

Inmediatamente después debe mostrarse un aviso compacto de alcance:

`Esta estimación usa la LFT para trabajo continuo en el sector privado. No
aplica automáticamente a empleo público, trabajo discontinuo o de temporada.`

### 2. Datos comunes

| Campo | Tipo | Validación | Valor inicial |
|-------|------|------------|---------------|
| Fecha de ingreso | `date` | Fecha válida | Vacío |
| Fecha de corte / último día trabajado | `date` | `>= fecha de ingreso` y reglas disponibles para los ciclos relevantes | Hoy |
| Saldo anterior al último aniversario | Texto numérico decimal | `>= 0` | `0` |
| Días usados desde el último aniversario | Texto numérico decimal | `>= 0` | `0` |

La etiqueta de la segunda fecha cambia según el modo. Debe aclararse que el día
seleccionado se incluye en el cálculo.

“Saldo anterior” debe tener ayuda contextual: es un dato tomado de recibos,
constancias o registros del empleador; la calculadora no puede deducirlo con
fiabilidad sólo a partir de la fecha de ingreso.

Antes del primer aniversario, ocultar o deshabilitar `Saldo anterior` salvo que
el usuario indique expresamente que su empleador ya reconoce un saldo. Esto
evita pedir un dato que normalmente no existe en ese momento.

### 3. Prestación aplicable

Por defecto se muestra una etiqueta no editable:

`México · LFT · mínimo legal vigente`

No mostrar selectores de país, jurisdicción o periodo mientras sólo exista un
preset. La versión correcta se elige automáticamente a partir de la fecha.

En `Opciones avanzadas`, permitir activar `Mi contrato ofrece más días`. Al
activarlo, mostrar los valores legales precargados y editables:

- Días correspondientes al último año completado, cuando exista.
- Días correspondientes al ciclo actualmente en curso.

Ambos campos admiten decimales, deben ser mayores o iguales al mínimo legal y
deben indicar qué año de servicio representan.

---

## Algoritmo

### Convenciones de fechas

- Trabajar únicamente con fechas civiles `YYYY-MM-DD`, sin horas ni conversión
  de zona horaria.
- La fecha de corte o último día trabajado es inclusiva. Para operaciones se
  crea `endExclusive = fechaFinal + 1 día`.
- Los días transcurridos se calculan como diferencias de fechas UTC para evitar
  errores por horario de verano.
- Los aniversarios se derivan siempre de la fecha de ingreso, no sumando 365
  días repetidamente.
- Para ingresos el 29 de febrero, `addCalendarYearsClamped` utiliza el último
  día válido de febrero en años no bisiestos. La interfaz debe identificarlo
  como un criterio técnico de la estimación, no como resolución legal.

### Variables

```text
años_completados = aniversarios alcanzados entre ingreso y endExclusive
inicio_ciclo = ingreso + años_completados años
siguiente_aniversario = ingreso + (años_completados + 1) años
dias_transcurridos_ciclo = diferencia(inicio_ciclo, endExclusive)
dias_totales_ciclo = diferencia(inicio_ciclo, siguiente_aniversario)

derecho_ultimo_periodo =
  años_completados >= 1
    ? derecho_para_año_de_servicio(años_completados)
    : 0

derecho_ciclo_actual =
  derecho_para_año_de_servicio(años_completados + 1)

avance_ciclo =
  derecho_ciclo_actual
  * dias_transcurridos_ciclo
  / dias_totales_ciclo

saldo_adquirido_bruto =
  saldo_anterior
  + derecho_ultimo_periodo
  - dias_usados
```

Cuando `endExclusive` coincide exactamente con un aniversario, ese año se
considera completado y el avance del nuevo ciclo comienza en cero.

No redondear valores intermedios. Los resultados se formatean con un máximo de
dos decimales, conservando el valor completo para cálculos y copiado detallado.

### Modo `activeEmployment`

```text
dias_disponibles_estimados = max(0, saldo_adquirido_bruto)
dias_adelantados = max(0, -saldo_adquirido_bruto)
avance_informativo = avance_ciclo
```

El avance informativo no se suma al resultado principal. Si la persona todavía
no cumple un año, el resultado principal debe explicar que aún no hay un
periodo anual adquirido bajo el alcance general del MVP y mostrar únicamente el
avance hacia el primer periodo.

### Modo `terminatedEmployment`

```text
saldo_total_bruto = saldo_adquirido_bruto + avance_ciclo
dias_proporcionales_estimados = max(0, saldo_total_bruto)
dias_adelantados_o_pagados_en_exceso = max(0, -saldo_total_bruto)
```

El resultado debe llamarse `Vacaciones estimadas para finiquito`, no
`Vacaciones disponibles`. Debe aclararse que todavía no incluye salario, prima
vacacional ni otras prestaciones.

---

## Resultados y contenido dinámico

### Empleo activo

Resultado principal:

`Saldo disponible estimado: X días laborables`

Desglose:

- Derecho adquirido en el último aniversario.
- Saldo anterior informado.
- Días usados desde el último aniversario.
- Avance informativo hacia el siguiente periodo.
- Próximo aniversario y derecho que se adquiriría al completarlo.

Si no se ha cumplido el primer año:

`Avance hacia tu primer periodo: X de 12 días estimados`

### Relación terminada

Resultado principal:

`Vacaciones estimadas para finiquito: X días laborables`

Desglose:

- Saldo anterior informado.
- Derecho de periodos completados considerado.
- Parte proporcional del ciclo incompleto.
- Días disfrutados o ya liquidados.
- Prima vacacional: no incluida.

### Explicación común

- Mostrar años de antigüedad y año de servicio utilizado.
- Mostrar las fechas exactas del ciclo y `días transcurridos / días del ciclo`.
- Mostrar el derecho legal y cualquier sustitución contractual.
- Ofrecer `Cómo se calculó` con fórmula y valores sustituidos.
- Ofrecer `Copiar resultado` incluyendo fecha, modo, desglose, regla y aviso de
  estimación.
- Mostrar fuente, artículos, vigencia y última revisión junto al resultado.

---

## Validaciones y estados

### Errores bloqueantes

- Fecha de ingreso vacía o inválida.
- Fecha final anterior a la fecha de ingreso.
- No existe una versión de reglas que cubra todos los derechos y ciclos
  relevantes para las fechas introducidas.
- Valores numéricos vacíos, no finitos o negativos.
- Prestación contractual inferior al mínimo legal correspondiente.
- El usuario indica que pertenece a trabajo discontinuo, de temporada, sector
  público u otro régimen no soportado desde el aviso de alcance o la ayuda.

### Advertencias no bloqueantes

- Los días usados superan el saldo adquirido; mostrar los días adelantados por
  separado y nunca un resultado principal negativo.
- El usuario añadió saldo anterior: recordar que no se verifican su vigencia ni
  exigibilidad.
- La fecha de ingreso es anterior a 2023: la antigüedad se usa para determinar
  la prestación vigente, pero el MVP no reconstruye periodos históricos.
- Contrato, convenio, ausencias o políticas internas pueden cambiar el
  resultado.
- El cálculo no constituye una resolución vinculante ni asesoría legal.

### Estado sin datos

No mostrar ceros que parezcan un resultado. Utilizar:

`Captura tu fecha de ingreso para comenzar.`

### Estado fuera de alcance

Explicar por qué el caso no se calcula y dirigir a una fuente oficial o asesoría
laboral. No aplicar silenciosamente la regla general.

---

## Diseño mobile-first

### Jerarquía y orden en pantallas pequeñas

1. Título y descripción breve.
2. Selector de situación.
3. Fechas.
4. Saldo anterior y días usados.
5. Opciones avanzadas, colapsadas por defecto.
6. Botón `Calcular vacaciones` de ancho completo.
7. Resultado principal.
8. Desglose y línea temporal.
9. Cómo se calculó, fuentes y aviso.

Todos los elementos usan una sola columna hasta el breakpoint de escritorio.
No utilizar tablas horizontales dentro de la calculadora; el desglose se
presenta como filas apiladas.

### Controles

- Altura táctil mínima de 44 px; preferentemente 48 px.
- Texto de al menos 16 px en inputs para evitar zoom automático móvil.
- Etiquetas visibles; no depender de placeholders.
- `inputmode="decimal"` para días y `autocomplete="off"` cuando corresponda.
- Errores junto al campo, asociados mediante `aria-describedby` y
  `aria-invalid`.
- El selector de situación debe ser usable con teclado y lector de pantalla.
- No comunicar estados únicamente mediante color.

### Resultado móvil

- Mostrar la cifra principal y su significado completo; evitar un número sin
  contexto.
- Después del primer cálculo válido, mostrar un resumen inferior fijo con el
  resultado principal y un enlace `Ver desglose`.
- El resumen debe respetar `env(safe-area-inset-bottom)` y la página debe añadir
  espacio inferior suficiente para que no cubra campos, mensajes o fuentes.
- Ocultar o neutralizar el resumen cuando los datos cambien y el resultado ya
  no sea vigente.
- Actualizar el resultado con `aria-live="polite"`; no anunciar cada pulsación
  mientras el usuario escribe.
- La fuente y el aviso pueden estar en acordeones, pero la naturaleza estimada
  del resultado siempre permanece visible.

### Matriz mínima de revisión visual

- Anchos de 320, 360, 390, 768 y 1024 px.
- Teclado móvil abierto.
- Zoom del navegador al 200 %.
- Errores largos y valores de dos dígitos.
- Área segura en dispositivos con indicador de inicio.
- Navegación completa sólo con teclado.

---

## Analítica respetuosa de privacidad

Si el proyecto registra eventos, no enviar fechas ni cantidades introducidas.
Sólo se permiten eventos agregados como:

- `vacation_mode_selected`
- `vacation_calculation_completed`
- `vacation_out_of_scope_shown`
- `vacation_result_copied`

El modo puede enviarse como propiedad; las fechas, antigüedad, saldos y días no.

---

## SEO y contenido editorial

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de vacaciones proporcionales en México` |
| Meta description | `Estima tus días de vacaciones disponibles o la parte proporcional para finiquito según tu antigüedad y la LFT de México.` |
| H1 | `Calculadora de vacaciones proporcionales` |
| Keyword principal | `vacaciones proporcionales` |
| Keywords secundarias | `días de vacaciones pendientes`, `vacaciones por antigüedad`, `vacaciones en finiquito`, `cálculo vacaciones México` |

Contenido complementario mínimo:

- Diferencia entre vacaciones adquiridas y proporcionales.
- Tabla vigente por antigüedad.
- Qué sucede antes del primer aniversario.
- Qué incluye un finiquito y qué no calcula esta herramienta.
- Diferencia entre días laborables usados como prestación y días calendario
  usados para medir el ciclo.
- Preguntas frecuentes con fuentes oficiales y fecha de revisión.

---

## Pruebas unitarias y de aceptación

### Fechas y aniversarios

- Ingreso `2025-01-01` y corte inclusivo `2025-06-30`: 181 días transcurridos
  de un ciclo de 365 y avance `12 * 181 / 365`.
- Ingreso `2024-01-01` y corte inclusivo `2024-12-31`: un año completado, 12
  días adquiridos y cero días en el nuevo ciclo.
- Ingreso `2024-01-01` y corte inclusivo `2025-06-30`: un año completado; el
  avance del segundo año usa 14 días y 181/365 del ciclo.
- Un ciclo que contiene el 29 de febrero usa 366 días.
- Un ingreso el 29 de febrero aplica de forma consistente la política
  `addCalendarYearsClamped`.
- La fecha final no puede preceder a la fecha de ingreso.
- La lógica no cambia con la zona horaria del navegador ni con horario de
  verano.

### Antigüedad

- Los años de servicio 1 a 5 producen 12, 14, 16, 18 y 20 días.
- Los límites 6, 10, 11, 15, 16 y 30 producen el valor de su bloque correcto.
- Una antigüedad superior a 30 años continúa aumentando por bloques de cinco.
- En un ciclo incompleto se usa el derecho del año de servicio que se está
  cursando, no el del año anterior.

### Saldos y modos

- En empleo activo, el avance del ciclo no se suma a los días disponibles.
- En terminación, la parte proporcional sí se incluye en el total estimado.
- El saldo anterior se suma una sola vez.
- Los días usados se restan una sola vez.
- Un resultado bruto negativo muestra cero como pendiente y el exceso como
  días adelantados o ya pagados.
- Antes del primer aniversario, empleo activo muestra avance pero no un derecho
  anual adquirido.
- Antes del primer aniversario, terminación incluye la parte proporcional.

### Reglas y presentación

- El modo contractual nunca permite menos días que el preset legal.
- No se redondean valores intermedios.
- La UI muestra como máximo dos decimales sin alterar el valor interno.
- Un preset vencido o no compatible bloquea el cálculo automático.
- Fuente, artículos, vigencia y fecha de revisión corresponden al preset usado.
- Cambiar cualquier input invalida el resumen fijo hasta recalcular.

---

## Criterios de aceptación del MVP

- El usuario identifica antes de introducir datos si calcula vacaciones durante
  el empleo o para una terminación.
- Ningún avance proporcional se presenta como derecho disponible en empleo
  activo.
- El resultado puede reproducirse con el desglose y la fórmula mostrados.
- La herramienta nunca muestra un saldo pendiente negativo.
- Los límites del MVP aparecen antes o junto al resultado, no sólo en el pie de
  página.
- La calculadora es plenamente utilizable a 320 px sin desplazamiento
  horizontal.
- La fuente legal y su fecha de revisión son visibles desde el resultado.
- Todas las pruebas unitarias y la matriz mobile-first definida anteriormente
  están cubiertas antes de publicar.
