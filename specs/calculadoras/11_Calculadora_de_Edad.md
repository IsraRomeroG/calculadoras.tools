# Especificación v2 — Calculadora de Edad

## Descripción general

Herramienta para calcular la edad exacta de una persona, la antigüedad de un
evento o la diferencia de edad entre dos fechas. Debe responder rápido a la
pregunta principal del usuario: "¿cuántos años, meses y días tengo?", y después
ofrecer información útil como días vividos, próximo cumpleaños o aniversario,
edad en una fecha de referencia y resultado copiable.

La experiencia debe ser clara, confiable y mobile-first. Aunque el cálculo
parece simple, los detalles de calendario importan: años bisiestos, personas
nacidas el 29 de febrero, fechas sin hora, cambios de día a medianoche y
diferencias entre "años completos" y "días totales".

La calculadora debe funcionar sin backend, sin llamadas de red y sin guardar
fechas personales salvo que el usuario active una opción de historial de sesión.

---

## Objetivo de producto

- Calcular edad exacta en años, meses y días a partir de una fecha de nacimiento.
- Mostrar días vividos y otras unidades alternativas sin confundir aproximaciones
  con valores exactos.
- Calcular próximo cumpleaños o aniversario con días restantes y día de semana.
- Permitir una fecha de referencia personalizable para saber qué edad tenía,
  tiene o tendrá alguien en una fecha específica.
- Manejar explícitamente nacidos el 29 de febrero.
- Resolver casos comunes de familia, escuela, trámites, aniversarios y eventos.
- Ser rápida en móvil con inputs de día, mes y año fáciles de usar.
- Evitar prometer validez legal, médica o administrativa. El resultado es una
  ayuda de cálculo; los requisitos oficiales dependen de cada institución.
- Mantener el MVP simple y confiable; mover curiosidades culturales, contador en
  vivo e imagen para compartir a fases posteriores.

---

## Alcance recomendado

### MVP

La primera versión debe cubrir el flujo principal con el menor riesgo posible:

- Modo "Mi edad": fecha de nacimiento + fecha de referencia.
- Fecha de referencia por defecto: hoy en la fecha local del navegador.
- Resultado principal: `X años, Y meses y Z días`.
- Resultado secundario: días vividos, semanas completas, meses completos, horas,
  minutos y segundos aproximados desde el inicio del día de nacimiento.
- Próximo cumpleaños o aniversario.
- Regla explícita para nacidos el 29 de febrero.
- Inputs separados de día, mes y año, optimizados para móvil.
- Botón de copiar resultado.
- Botón de limpiar.
- Mensajes de validación claros.
- FAQ visible y JSON-LD de `FAQPage`.
- Sin backend, sin APIs externas, sin historial persistente.
- Pruebas unitarias para la lógica de fechas.

### Fase 2

- Diferencia de edad entre dos personas.
- "¿En qué fecha cumpliré X años?"
- Edad de evento o cosa: empresa, matrimonio, proyecto, mascota, etc.
- Modo cumpleaños sin año: calcular cuántos días faltan para el próximo
  cumpleaños cuando solo se conoce día y mes.
- Historial de últimos cálculos en `sessionStorage`, solo si el usuario lo
  activa explícitamente.
- Contador en vivo opcional, etiquetado como aproximado si no se captura hora de
  nacimiento.
- Hora de nacimiento opcional para usuarios que quieran contador de segundos más
  preciso.

### Fase 3

- Datos culturales o curiosos basados en una base local curada.
- Signo zodiacal occidental como dato cultural.
- Año chino calculado con Año Nuevo lunar, no solo por año calendario.
- Generación aproximada, con aviso de que los rangos son convenciones sociales.
- Tarjeta visual para compartir.
- Vista de impresión o descarga como imagen.

> No implementar APIs externas, datos históricos dinámicos, personajes famosos,
> música del año de nacimiento ni imágenes compartibles en el MVP. Son funciones
> atractivas, pero aumentan peso, mantenimiento, riesgo de datos incorrectos y
> posibles problemas de privacidad.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL pública recomendada | `/calculadora-de-edad` |
| Alias SEO recomendado | `/cuantos-anos-tengo` |
| Alias SEO recomendado | `/calculadora-edad-exacta` |
| Alias SEO recomendado | `/dias-vividos-calculadora` |
| Alias SEO recomendado | `/proximo-cumpleanos` |
| Archivo Astro recomendado | `src/pages/calculadora-de-edad.astro` |
| Lógica de cálculo | `src/lib/calculators/age.ts` |
| Pruebas unitarias | `src/lib/calculators/age.test.ts` |
| Locale base | `es-MX` |
| Layout | `BaseLayout.astro` |
| UI compartida | `PageHero`, `Container`, `SectionIntro`, `FaqSection` |
| Estilos | Tailwind CSS |

La URL canónica debe ser `/calculadora-de-edad`. Los alias, si existen, deben
redirigir o exponer el mismo canonical para evitar duplicidad SEO.

---

## Comportamiento mobile-first

- La calculadora interactiva debe aparecer en el primer viewport.
- No crear una landing page antes de la herramienta.
- En móvil, usar una sola columna: modo, fecha, resultado, acciones y contenido
  contextual.
- En desktop, se puede usar una composición de dos columnas: formulario a la
  izquierda y resultado a la derecha.
- Los controles táctiles deben tener altura mínima aproximada de `44px`.
- Preferir inputs separados para día, mes y año sobre un calendario nativo como
  único método.
- El resultado principal debe tener dimensiones estables para evitar saltos de
  layout.
- Los textos largos deben hacer wrap sin romper botones, tablas o tarjetas.
- No depender solo del color para errores, advertencias o estados activos.
- Las acciones principales deben ser claras: copiar, limpiar y, si aplica,
  cambiar de modo.
- El contenido educativo, FAQ y calculadoras relacionadas van debajo de la
  herramienta.

---

## Conceptos base

### Edad calendario

La edad en años, meses y días se calcula con calendario, no dividiendo días
totales entre 365. Debe considerar si el cumpleaños ya ocurrió en la fecha de
referencia y ajustar meses/días según la longitud real de cada mes.

Ejemplo con fecha de referencia del ejemplo: `25/04/2026`.

```text
Nacimiento: 15/03/1990
Referencia: 25/04/2026

Edad calendario: 36 años, 1 mes y 10 días
```

### Diferencia absoluta en días

Los días vividos se calculan como diferencia entre dos fechas de calendario:

```text
días_totales = fecha_referencia - fecha_nacimiento
```

Si la fecha de nacimiento es igual a la referencia, el resultado es `0 días`.
No se cuenta de forma inclusiva. Es decir, del 1 de enero al 2 de enero hay
`1 día`, no `2 días`.

### Unidades alternativas

- `meses completos`: años completos * 12 + meses adicionales.
- `semanas completas`: piso de `días_totales / 7`.
- `horas`: `días_totales * 24`.
- `minutos`: `horas * 60`.
- `segundos`: `minutos * 60`.

Si no se pide hora de nacimiento, horas/minutos/segundos se muestran como una
aproximación desde el inicio del día de nacimiento hasta el inicio del día de
referencia. No llamarlos "exactos".

### Fecha local y zonas horarias

- Para "hoy", usar la fecha local del navegador.
- Los inputs representan fechas sin hora.
- No parsear strings `YYYY-MM-DD` con `new Date(string)` si eso puede convertir
  a UTC y mover el día según la zona horaria.
- Usar una abstracción de fecha sin hora, idealmente `Temporal.PlainDate` si está
  disponible o un helper propio/date-fns cuidadosamente validado.
- El cambio de fecha a medianoche debe recalcular "hoy" si la página sigue
  abierta.

### Nacidos el 29 de febrero

Las personas nacidas el 29 de febrero pueden celebrar su cumpleaños en años no
bisiestos el 28 de febrero o el 1 de marzo según preferencia, costumbre o
criterio de una institución.

Regla del producto:

- Default: usar 28 de febrero para el próximo cumpleaños en años no bisiestos.
- Mostrar texto discreto: "Para nacidos el 29 de febrero usamos 28 de febrero en
  años no bisiestos. Puedes cambiarlo a 1 de marzo."
- Permitir cambiar a 1 de marzo mediante selector en opciones avanzadas.
- Mantener la elección solo en memoria durante la sesión, salvo que el usuario
  active guardar preferencias.

---

## Flujo principal MVP — ¿Cuántos años tengo?

### Inputs

| Campo | Tipo | Rango válido | Default |
|-------|------|--------------|---------|
| Día de nacimiento | Texto numérico | `1 - 31` | Vacío |
| Mes de nacimiento | Selector o texto numérico | `1 - 12` | Vacío |
| Año de nacimiento | Texto numérico | `1900 - año actual` | Vacío |
| Fecha de referencia | Inputs día/mes/año | `>= nacimiento` | Hoy |
| Regla 29/feb | Selector avanzado | 28 feb / 1 mar | 28 feb |

### Reglas del formulario

- Calcular automáticamente cuando la fecha de nacimiento es válida.
- No mostrar errores agresivos antes de que el usuario interactúe con un campo.
- Si la fecha de referencia es hoy, mostrar "al día de hoy".
- Si la fecha de referencia es futura, usar lenguaje "tendrás/tendrá".
- Si la fecha de referencia es pasada pero posterior al nacimiento, usar
  "tenías/tenía".
- Si la fecha de referencia es anterior al nacimiento, bloquear cálculo.
- El año debe tener 4 dígitos. No inferir años de 2 dígitos.
- Si el usuario pega `15/03/1990`, se puede normalizar en los tres campos si el
  parser es confiable; si no, pedir que ingrese día, mes y año.

### Ejemplo

Fecha de referencia del ejemplo: `25 de abril de 2026`.

```text
Nacimiento: 15 de marzo de 1990
Referencia: 25 de abril de 2026

Años completos: 36
Meses adicionales: 1
Días adicionales: 10
```

### Output principal

```text
Tienes 36 años, 1 mes y 10 días.
```

### Output secundario

| Unidad | Valor esperado |
|--------|----------------|
| Años completos | `36 años` |
| Meses completos | `433 meses` |
| Semanas completas | `1,884 semanas` |
| Días | `13,190 días` |
| Horas aproximadas | `316,560 horas` |
| Minutos aproximados | `18,993,600 minutos` |
| Segundos aproximados | `1,139,616,000 segundos` |

Texto breve sugerido:

```text
Las horas, minutos y segundos son aproximados porque no se ingresó hora de nacimiento.
```

### Próximo cumpleaños

Para el mismo ejemplo:

| Resultado | Valor esperado |
|-----------|----------------|
| Próximo cumpleaños | `15 de marzo de 2027` |
| Faltan | `324 días` |
| Equivalente calendario | `10 meses y 18 días` |
| Día de la semana | `lunes` |
| Edad que cumplirá | `37 años` |

---

## Modos fase 2

### Modo 2 — Edad en una fecha específica

Pregunta: "¿Cuántos años tendrá mi hijo al inicio del ciclo escolar?" o
"¿Qué edad tenía una persona en cierta fecha?"

**Inputs:**

- Fecha de nacimiento.
- Fecha de referencia.

**Reglas:**

- La fecha de referencia puede ser pasada, presente o futura.
- Debe ser igual o posterior a la fecha de nacimiento.
- El texto se adapta: tenía, tiene o tendrá.

**Ejemplo:**

```text
Nacimiento: 03/07/2020
Referencia: 01/09/2026

Edad: 6 años, 1 mes y 29 días
Días desde hoy hasta esa fecha: 129 días
```

Si se usa para requisitos escolares o trámites, añadir aviso:

```text
Verifica siempre la regla exacta de la institución. Esta calculadora solo hace el cálculo de fecha.
```

### Modo 3 — Diferencia de edad entre dos personas

**Inputs:**

- Fecha de nacimiento persona A.
- Fecha de nacimiento persona B.

**Output:**

- Diferencia exacta en años, meses y días.
- Indicación de quién es mayor.
- Días totales de diferencia.

**Ejemplo:**

```text
Persona A: 15/03/1990
Persona B: 22/08/1994

A es mayor por 4 años, 5 meses y 7 días.
Diferencia total: 1,621 días.
```

Si ambas fechas son iguales, no mostrar advertencia. Mostrar:

```text
Ambas personas tienen la misma edad exacta.
```

### Modo 4 — ¿En qué fecha cumpliré X años?

**Inputs:**

- Fecha de nacimiento.
- Edad objetivo.

**Reglas:**

- Edad objetivo válida: `1 - 150`.
- Si la edad objetivo ya ocurrió, mostrar cuándo ocurrió y cuál es el próximo
  hito.
- Si la edad objetivo es futura, mostrar fecha, día de semana y tiempo restante.

**Ejemplo:**

```text
Nacimiento: 15/03/1990
Edad objetivo: 40 años

Cumplirás 40 años el 15 de marzo de 2030.
Día de la semana: viernes.
Faltan 3 años, 10 meses y 18 días.
Semanas completas restantes: 202.
```

### Modo 5 — Edad de una cosa o evento

Para empresas, matrimonios, proyectos, membresías o aniversarios.

**Inputs:**

- Fecha de inicio del evento.
- Etiqueta opcional.
- Fecha de referencia.

**Rango recomendado:**

- Permitir eventos desde `01/01/1800`.
- Si el evento es anterior a 1900, ocultar datos culturales o generacionales.

**Ejemplo:**

```text
Etiqueta: Mi empresa
Inicio: 10/01/2015
Referencia: 25/04/2026

Mi empresa tiene 11 años, 3 meses y 15 días.
Equivale a 4,123 días desde su fundación.
Próximo aniversario: 10 de enero de 2027.
```

### Modo cumpleaños sin año

Para recordar cumpleaños de familiares o amistades cuando no se conoce el año de
nacimiento.

**Inputs:**

- Día.
- Mes.
- Nombre o etiqueta opcional.

**Output:**

```text
El próximo cumpleaños será el 22 de agosto.
Faltan 118 días.
Caerá en sábado.
```

No mostrar edad si no existe año de nacimiento.

---

## Features fase 2 y fase 3

### Contador en vivo

No debe estar activo por defecto en el MVP.

Reglas:

- Si solo hay fecha de nacimiento, etiquetar como aproximado.
- Si se captura hora de nacimiento, el contador puede mostrar horas, minutos y
  segundos con mayor precisión.
- Usar `setInterval` de `1,000 ms` solo mientras la pestaña esté visible.
- Pausar si `document.visibilityState !== "visible"`.
- Respetar `prefers-reduced-motion`.
- No actualizar una región `aria-live` cada segundo, porque puede ser molesto
  para lectores de pantalla.
- Recalcular la parte de años/meses/días cuando cambie la fecha local.

Texto sugerido si no hay hora:

```text
Contador aproximado desde el inicio de tu día de nacimiento.
```

### Datos curiosos

Mover fuera del MVP.

Permitidos si existen datos locales curados:

- Día del año de nacimiento.
- Día de la semana de nacimiento.
- Días vividos.
- Próximo cumpleaños.
- Generación aproximada.

Evitar en el MVP:

- Presidente según país y año.
- Canción número 1.
- Personajes famosos.
- Evento histórico destacado.
- Cualquier dato que requiera API externa o mantenimiento frecuente.

Si se implementa más adelante:

- Usar fuentes visibles o dataset documentado.
- Añadir país/locale cuando el dato dependa del país.
- No enviar fecha de nacimiento a APIs externas.
- Mostrar fallback si no hay dato confiable.

### Signo zodiacal occidental

Puede mostrarse como dato cultural, no como predicción.

Reglas:

- Mostrar discreto y opcional.
- Añadir texto: "Dato cultural aproximado".
- No ponerlo como resultado principal.

### Año chino

No calcularlo solo por año calendario, porque el Año Nuevo chino cambia de fecha.

Reglas:

- Usar una tabla local de inicios de Año Nuevo chino por año.
- Si no existe tabla para el año, ocultar el dato o mostrar "no disponible".
- No mostrarlo como certeza si solo se usa el año de nacimiento.

### Generación

Los rangos generacionales son convenciones sociales, no categorías exactas.

| Generación | Años aproximados |
|------------|------------------|
| Generación Alpha | 2013 en adelante |
| Generación Z | 1997 - 2012 |
| Millennials | 1981 - 1996 |
| Generación X | 1965 - 1980 |
| Baby Boomers | 1946 - 1964 |
| Generación Silenciosa | 1928 - 1945 |
| Generación más grande | Antes de 1928 |

Texto sugerido:

```text
Los rangos generacionales son aproximados y pueden variar según la fuente.
```

### Compartir resultado

MVP: botón de copiar texto plano.

Fase 3: tarjeta visual.

Texto copiable del MVP:

```text
Calculadora de Edad - calculadoras.tools
Fecha de nacimiento: 15 de marzo de 1990
Fecha de referencia: 25 de abril de 2026
Edad: 36 años, 1 mes y 10 días
Días vividos: 13,190
Próximo cumpleaños: 15 de marzo de 2027
```

Si se comparte por WhatsApp, construir el texto en el cliente. No enviar datos a
servidores intermedios.

### Historial

No incluir en el MVP.

Fase 2:

- Usar `sessionStorage`, no `localStorage`.
- Si en una fase futura se quiere persistencia entre sesiones, debe ser opt-in
  explícito y con texto claro de privacidad.
- Guardar máximo 5 cálculos.
- Permitir borrar historial.
- No guardar fecha de nacimiento en analytics.
- No sincronizar ni enviar datos al servidor.

---

## Inputs detallados

| Campo | Tipo | Rango válido | Requerido | Default |
|-------|------|--------------|-----------|---------|
| Día | Texto numérico | `1 - 31` | Sí | Vacío |
| Mes | Selector/texto numérico | `1 - 12` | Sí | Vacío |
| Año | Texto numérico | `1900 - año actual` | Sí | Vacío |
| Fecha de referencia | Día/mes/año | `>= fecha base` | No | Hoy |
| Regla 29/feb | Selector | 28 feb / 1 mar | No | 28 feb |
| Edad objetivo | Texto numérico | `1 - 150` | Solo Modo 4 | Vacío |
| Etiqueta | Texto | 1 - 40 caracteres | No | Según modo |
| Hora de nacimiento | Hora | `00:00 - 23:59` | No, fase 2 | Vacío |

### Parsing

- Aceptar números con ceros iniciales: `03`, `07`.
- Rechazar años de 2 dígitos.
- Rechazar fechas inexistentes: `31/04/2026`, `29/02/2025`.
- Si se permite pegar fecha completa, aceptar `DD/MM/AAAA` para `es-MX`.
- Si se ofrece formato `MM/DD/AAAA`, debe depender del locale o de un selector
  explícito, no inferirse silenciosamente.
- Mostrar siempre la fecha interpretada en formato largo antes del resultado.

---

## Validaciones

| Caso | Comportamiento esperado |
|------|-------------------------|
| Campo vacío | No calcular; pedir el campo faltante si ya fue tocado. |
| Día fuera de rango | Error: `Ingresa un día válido.` |
| Mes fuera de rango | Error: `Ingresa un mes válido.` |
| Año con menos de 4 dígitos | Error: `Ingresa el año con 4 dígitos.` |
| Fecha inexistente | Error: `Esa fecha no existe en el calendario.` |
| 29/feb en año no bisiesto | Error claro antes del cálculo. |
| Fecha futura en modo nacimiento | Error: `La fecha de nacimiento no puede ser futura.` |
| Referencia anterior al nacimiento | Error: `La fecha de referencia es anterior al nacimiento.` |
| Edad mayor a 120 | Calcular, pero mostrar advertencia de revisar fecha. |
| Edad mayor a 150 | Bloquear cálculo para persona; permitir solo modo evento si aplica. |
| Modo evento anterior a 1800 | Bloquear o pedir confirmación, según alcance técnico. |
| Modo cumpleaños sin año | No mostrar edad, solo próximo cumpleaños. |
| Misma fecha en diferencia de edad | Mostrar igualdad, no error. |
| Hora sin fecha válida | No calcular contador. |

Advertencia para edad alta:

```text
Revisa la fecha ingresada. Las edades superiores a 120 años son poco comunes.
```

Aviso para usos institucionales:

```text
Para trámites, escuelas o requisitos oficiales, confirma la regla exacta con la institución correspondiente.
```

---

## Estados de la calculadora

| Estado | Comportamiento |
|--------|----------------|
| Inicial | Campos vacíos, resultado neutral, sin errores. |
| Incompleto | No mostrar resultado final; indicar qué falta si el campo fue tocado. |
| Válido | Mostrar edad, unidades, próximo cumpleaños y acciones. |
| Inválido | Mostrar errores por campo y ocultar acciones de resultado. |
| Fecha 29/feb | Mostrar regla aplicada y opción de cambiarla. |
| Edad inusual | Mostrar resultado con advertencia. |
| Copiado | Confirmación visual durante 2 segundos y anuncio accesible. |
| Limpio | Restaurar estado inicial sin recargar página. |
| Cambio de día | Recalcular si el default "hoy" sigue activo. |

---

## Formato de outputs

Usar `Intl.DateTimeFormat` e `Intl.NumberFormat` con locale base `es-MX`.

| Tipo | Formato |
|------|---------|
| Edad principal | `36 años, 1 mes y 10 días` |
| Días vividos | `13,190 días` |
| Semanas completas | `1,884 semanas completas` |
| Fechas | `15 de marzo de 2027` |
| Día de semana | `lunes` |
| Horas aproximadas | `316,560 horas aprox.` |
| Diferencia de edad | `A es mayor por 4 años, 5 meses y 7 días` |
| Fecha interpretada | `15 de marzo de 1990` |

### Pluralización

- `1 año`, `2 años`.
- `1 mes`, `2 meses`.
- `1 día`, `2 días`.
- Omitir unidades en cero solo en textos secundarios si mejora legibilidad.
- En el resultado principal, mantener `0 años, 0 meses y 0 días` para nacidos
  hoy.

---

## Acciones del MVP

### Copiar resultado

Debe copiar texto plano.

Si `navigator.clipboard` no está disponible:

- Usar fallback con `textarea` temporal, o
- Mostrar mensaje accesible de error.

No usar `alert()`.

### Limpiar

- Vacía fecha de nacimiento.
- Restaura fecha de referencia a hoy.
- Limpia errores, advertencias y resultado.
- No recarga la página.

### Usar ejemplo

Opcional en MVP. Rellena:

```text
Nacimiento: 15/03/1990
Referencia: 25/04/2026
```

El ejemplo debe dejar claro que la fecha de referencia es de demostración.

---

## SEO y contenido de la página

### Meta información

| Campo | Valor |
|-------|-------|
| Title | `Calculadora de Edad - Años, Meses, Días y Próximo Cumpleaños` |
| Description | `Calcula tu edad exacta en años, meses y días. Descubre cuántos días has vivido, cuánto falta para tu próximo cumpleaños y qué edad tendrás en una fecha específica.` |
| Canonical | `/calculadora-de-edad` |

Evitar claims como "edad legal exacta para cualquier trámite".

### Estructura sugerida

- `h1`: Calculadora de edad.
- Intro breve orientada a uso.
- Calculadora interactiva.
- Resultado y próximo cumpleaños.
- Cómo se calcula la edad exacta.
- Casos especiales: 29 de febrero y fechas futuras.
- Calculadoras relacionadas.
- FAQ.

### FAQ sugeridas

- ¿Cómo se calcula la edad exacta?
- ¿Cuántos días he vivido?
- ¿Cuánto falta para mi cumpleaños?
- ¿Qué pasa si nací el 29 de febrero?
- ¿Cómo saber qué edad tendré en una fecha futura?
- ¿Puedo calcular la edad de una empresa o aniversario?
- ¿La calculadora sirve para trámites oficiales?

Agregar JSON-LD para `FAQPage` solo si las preguntas y respuestas están visibles
en la página.

### Calculadoras relacionadas

| Contexto | Enlace sugerido |
|----------|-----------------|
| Siempre | Calculadora de diferencia entre fechas |
| Próximo cumpleaños | Countdown / fecha límite |
| Embarazo o bebé futuro | Fecha probable de parto |
| Eventos | Calculadora de días entre fechas |

---

## Implementación en Astro + Tailwind

### Criterios técnicos

- Página estática compatible con Astro SSG.
- Sin backend.
- Sin llamadas de red.
- No introducir React, Vue, Svelte ni librerías adicionales para esta calculadora.
- La lógica matemática debe vivir en funciones puras.
- La UI puede vivir en Astro con un script cliente ligero.
- Evitar usar `Date` con strings que se interpreten como UTC.
- Preferir una representación interna tipo `{ year, month, day }`.
- Mantener consistencia visual con el sitio existente.

### Funciones puras sugeridas

```ts
interface PlainDateParts {
  year: number;
  month: number;
  day: number;
}

type LeapDayRule = "feb-28" | "mar-01";

interface AgeDifference {
  years: number;
  months: number;
  days: number;
  totalDays: number;
}

interface NextAnniversaryResult {
  date: PlainDateParts;
  daysUntil: number;
  calendarUntil: {
    years: number;
    months: number;
    days: number;
  };
  weekday: string;
  turningYears?: number;
}

parseDateParts(input)
isValidDateParts(date)
isLeapYear(year)
daysInMonth(year, month)
comparePlainDates(a, b)
todayInLocalTimeZone()
addYears(date, years, leapDayRule)
diffCalendarDates(start, end)
diffTotalDays(start, end)
calculateAge({ birthDate, referenceDate, leapDayRule })
calculateAlternativeUnits(totalDays, ageDifference)
calculateNextAnniversary({ date, referenceDate, leapDayRule })
calculateTargetAgeDate({ birthDate, targetAge, leapDayRule })
calculateAgeDifferenceBetweenPeople(dateA, dateB)
formatPlainDate(date, locale)
formatAgeDifference(age)
formatNumber(value, locale)
buildAgeCopyText(input, result)
validateAgeInput(input)
```

### Constantes sugeridas

```ts
const DEFAULT_LOCALE = "es-MX";
const MIN_PERSON_YEAR = 1900;
const MIN_EVENT_YEAR = 1800;
const MAX_PERSON_AGE = 150;
const UNUSUAL_PERSON_AGE = 120;
const DEFAULT_LEAP_DAY_RULE: LeapDayRule = "feb-28";
```

---

## Accesibilidad

- Todos los inputs deben tener `label` visible.
- Los errores deben asociarse con `aria-describedby`.
- El resultado principal debe estar en una región `aria-live="polite"`.
- No actualizar `aria-live` cada segundo si existe contador.
- Los controles segmentados deben comunicar estado activo con texto, color y ARIA.
- Los botones de icono deben incluir `aria-label`.
- El foco visible debe ser claro.
- La navegación debe funcionar con teclado.
- No depender solo del color para errores o advertencias.
- Las confirmaciones de copiar/limpiar deben ser perceptibles sin `alert()`.
- Respetar `prefers-reduced-motion`.

---

## Privacidad

- No enviar fecha de nacimiento, etiqueta ni resultado a APIs externas.
- No registrar valores personales en analytics.
- No pasar fechas personales por query params a otras calculadoras.
- No guardar historial en `localStorage` en el MVP.
- Si se implementa historial, usar `sessionStorage` y hacerlo opt-in.
- Permitir borrar historial con un botón visible.
- La acción de copiar o compartir debe requerir interacción explícita.
- Si se añade tarjeta visual, generarla en el cliente.

---

## Casos extremos

| Caso | Resultado esperado |
|------|--------------------|
| Nacimiento = referencia | `0 años, 0 meses y 0 días`; `0 días vividos`. |
| Nacimiento futuro | Bloquear cálculo. |
| Referencia anterior al nacimiento | Bloquear cálculo. |
| 29/02/2024 con referencia 28/02/2025 y regla 28/feb | Cumpleaños reconocido el 28/02/2025. |
| 29/02/2024 con referencia 28/02/2025 y regla 1/mar | Aún no cumplió; próximo cumpleaños 01/03/2025. |
| 31/01 a 28/02 | Diferencia calendario consistente y probada. |
| 31/01 a 01/03 | Diferencia calendario consistente y probada. |
| Año 1900 | No es bisiesto. |
| Año 2000 | Sí es bisiesto. |
| Cambio de medianoche | Recalcular "hoy" sin recargar. |
| Año de 2 dígitos | Bloquear, no inferir. |
| Persona mayor de 120 | Mostrar advertencia. |
| Fecha de evento anterior a 1900 | Calcular solo si está dentro del rango de evento. |
| Solo día y mes | Mostrar próximo cumpleaños, no edad. |
| Resultado largo | No debe desbordar layout móvil. |

---

## Criterios de aceptación

| Caso | Inputs | Resultado esperado |
|------|--------|--------------------|
| Edad principal | Nacimiento `15/03/1990`, referencia `25/04/2026` | `36 años, 1 mes y 10 días`. |
| Días vividos | Mismos inputs | `13,190 días`. |
| Meses completos | Mismos inputs | `433 meses`. |
| Semanas completas | Mismos inputs | `1,884 semanas completas`. |
| Próximo cumpleaños | Mismos inputs | `15 de marzo de 2027`, faltan `324 días`. |
| Nacido hoy | Nacimiento = hoy | `0 años, 0 meses y 0 días`. |
| Fecha futura | Nacimiento posterior a hoy | Error claro. |
| Referencia anterior | Referencia antes del nacimiento | Error claro. |
| Edad en fecha futura | `03/07/2020` a `01/09/2026` | `6 años, 1 mes y 29 días`. |
| Diferencia personas | `15/03/1990` y `22/08/1994` | `4 años, 5 meses y 7 días`; A es mayor. |
| Misma fecha personas | Dos fechas iguales | "Misma edad exacta". |
| Objetivo 40 años | `15/03/1990`, objetivo `40` | `15 de marzo de 2030`, viernes. |
| Evento | `10/01/2015` a `25/04/2026` | `11 años, 3 meses y 15 días`; `4,123 días`. |
| 29/feb default | `29/02/2024`, referencia `28/02/2025` | Aplica regla 28/feb y muestra aviso. |
| Año de 2 dígitos | `15/03/90` | Error: pedir 4 dígitos. |
| Copiar | Resultado válido | Copia texto plano sin HTML. |
| Limpiar | Después de calcular | Restablece estado inicial. |
| Mobile | viewport `390px` | Sin solapamientos ni desbordes. |
| Teclado | Navegación por Tab | Todos los controles son alcanzables y operables. |

---

## Pruebas recomendadas

### Unitarias

- `isLeapYear`: 1900 falso, 2000 verdadero, 2024 verdadero, 2025 falso.
- Validación de fechas inexistentes.
- Diferencia calendario básica.
- Diferencia total de días.
- Nacimiento hoy.
- Referencia anterior al nacimiento.
- Edad en fecha futura.
- Próximo cumpleaños antes y después del cumpleaños del año actual.
- Nacido el 29 de febrero con regla 28/feb.
- Nacido el 29 de febrero con regla 1/mar.
- Fin de mes: enero 31 a febrero/marzo.
- Meses completos vs días totales.
- Formato de pluralización.
- Texto copiable.
- Validaciones de año de 2 dígitos.
- Advertencia para edad mayor de 120.

### E2E con Playwright

- Escribir fecha válida y ver resultado en tiempo real.
- Cambiar fecha de referencia.
- Cambiar regla 29/feb.
- Intentar fecha inexistente.
- Intentar año de 2 dígitos.
- Copiar resultado.
- Limpiar formulario.
- Navegar con teclado.
- Verificar `aria-live` para resultado.
- Revisar layout en móvil y desktop.
- Verificar que el contador, si existe, no actualice lectores de pantalla cada
  segundo.

---

## Fuentes y notas editoriales

- Para cálculos de calendario, usar reglas del calendario gregoriano.
- No citar fuentes legales para edad de trámites salvo que exista una página
  específica por país/institución y se mantenga actualizada.
- Si se añaden rangos generacionales, documentar la fuente o presentarlos como
  aproximaciones editoriales.
- Si se añaden datos culturales, mantener un dataset local versionado y revisable.

---

## Aviso sugerido

Texto visible cerca del resultado o en FAQ:

```text
Esta calculadora usa fechas de calendario para ayudarte a estimar edad, días vividos y próximos cumpleaños. Para trámites, requisitos escolares, médicos o legales, confirma siempre la regla exacta con la institución correspondiente.
```
