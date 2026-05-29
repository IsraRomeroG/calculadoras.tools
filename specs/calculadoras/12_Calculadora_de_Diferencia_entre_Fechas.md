# Especificación v2 - Calculadora de Diferencia entre Fechas

## Descripción general

Herramienta para calcular el tiempo entre dos fechas, saber cuántos días faltan
para un evento y sumar o restar unidades de calendario a una fecha. A diferencia
de la calculadora de edad, esta calculadora debe resolver preguntas generales de
planificación: vencimientos, entregas, vacaciones, aniversarios, plazos de
trabajo y conteos personales.

La experiencia debe ser rápida, clara y confiable. En una calculadora de fechas,
la confianza depende menos de tener muchas funciones y más de explicar bien qué
se está contando: si se cuenta la fecha inicial, si se excluyen fines de semana,
si el resultado es calendario o hábil y si una fecha calculada cae en sábado,
domingo o festivo.

La calculadora debe funcionar sin backend, sin llamadas de red y sin guardar
fechas personales salvo que el usuario active explícitamente una opción de
historial en una fase futura.

---

## Objetivo de producto

- Calcular la diferencia en días entre dos fechas de calendario.
- Mostrar una equivalencia útil en semanas, meses y años calendario sin
  confundir aproximaciones con valores exactos.
- Permitir conteo estándar y conteo inclusivo.
- Calcular días hábiles excluyendo sábados y domingos en el MVP.
- Sumar o restar días, semanas, meses y años a una fecha.
- Sumar o restar días hábiles a una fecha.
- Avisar si una fecha relevante cae en fin de semana.
- Sugerir el siguiente día hábil cuando un resultado cae en fin de semana.
- Permitir copiar el resultado en texto plano.
- Resolver casos comunes con precisión: años bisiestos, fin de mes, fechas
  iguales, fechas invertidas, rangos largos y cambios de horario.
- Mantener el MVP simple y confiable; mover festivos por país, línea de tiempo,
  countdown en vivo, imagen para compartir e historial persistente a fases
  posteriores.
- Evitar prometer validez legal, laboral, fiscal o administrativa. El resultado
  es una ayuda de cálculo; las reglas oficiales dependen del país, institución o
  contrato.

---

## Alcance recomendado

### MVP

La primera versión debe cubrir los flujos de mayor volumen y menor riesgo:

- Modo "Diferencia entre fechas": Fecha inicial + Fecha final.
- Fecha inicial por defecto: hoy en la fecha local del navegador.
- Resultado principal: `258 días`.
- Resultado secundario: semanas, años/meses/días calendario, horas y minutos
  aproximados.
- Toggle de conteo: `Estándar` / `Inclusivo`.
- Selector de conteo: `Todos los días` / `Días hábiles`.
- Días hábiles sin festivos: excluir únicamente sábados y domingos.
- Indicador automático de día de la semana para cada fecha ingresada.
- Aviso si la fecha final o la fecha calculada cae en sábado o domingo.
- Sugerencia de siguiente día hábil cuando aplique.
- Modo "Sumar o restar tiempo": días, semanas, meses, años y días hábiles.
- Modo "Días hasta un evento": una variante del modo principal con inicio en
  hoy y etiqueta opcional.
- Inputs separados de día, mes y año, optimizados para móvil.
- Botón de usar hoy.
- Botón de intercambiar fechas.
- Botón de copiar resultado.
- Botón de limpiar.
- FAQ visible y JSON-LD de `FAQPage`.
- Sin APIs externas.
- Sin historial persistente.
- Pruebas unitarias para la lógica de fechas.

### Fase 2

- Días hábiles con festivos nacionales por país mediante dataset local.
- Selector de país para festivos: México como primer país recomendado.
- Lista de festivos descontados dentro del periodo.
- Línea de tiempo de múltiples fechas, hasta 10 eventos.
- Exportar línea de tiempo como CSV.
- Barra de progreso temporal cuando hoy está entre fecha inicial y fecha final.
- Semana del año, día del año y trimestre.
- Countdown en vivo opcional para eventos futuros.
- Historial de sesión con `sessionStorage`, solo si el usuario lo activa.

### Fase 3

- Festivos regionales o estatales, solo si existe dataset confiable y mantenible.
- Reglas de traslado de festivos por país.
- Compartir por WhatsApp.
- Tarjeta visual para compartir.
- Exportar resultado como imagen.
- Historial persistente con `localStorage`, opt-in explícito, límite claro y
  botón para borrar.

> No implementar festivos regionales, imagen compartible, historial persistente
> ni promesas de validez legal en el MVP. Son funciones atractivas, pero aumentan
> mantenimiento y riesgo de resultados incorrectos.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL pública recomendada | `/fecha-tiempo/diferencia-entre-fechas` |
| Alias SEO recomendado | `/diferencia-entre-fechas` |
| Alias SEO recomendado | `/calculadora-de-dias` |
| Alias SEO recomendado | `/cuantos-dias-faltan-para` |
| Alias SEO recomendado | `/sumar-dias-a-fecha` |
| Alias SEO recomendado | `/calculadora-dias-habiles` |
| Archivo Astro recomendado | `src/pages/fecha-tiempo/diferencia-entre-fechas.astro` |
| Lógica de cálculo | `src/lib/calculators/date-difference.ts` |
| Pruebas unitarias | `src/lib/calculators/date-difference.test.ts` |
| Locale base | `es-MX` |
| Layout | `BaseLayout.astro` |
| UI compartida | `PageHero`, `Container`, `SectionIntro`, `FaqSection` |
| Estilos | Tailwind CSS |

La URL canónica debe ser `/fecha-tiempo/diferencia-entre-fechas`. Los alias, si
existen, deben redirigir o exponer el mismo canonical para evitar duplicidad SEO.

---

## Comportamiento mobile-first

- La calculadora interactiva debe aparecer en el primer viewport.
- No crear una landing page antes de la herramienta.
- En móvil, usar una sola columna: modo, fechas, opciones, resultado y acciones.
- En desktop, se puede usar una composición de dos columnas: formulario a la
  izquierda y resultado a la derecha.
- Los controles táctiles deben tener altura mínima aproximada de `44px`.
- Preferir inputs separados de día, mes y año sobre un calendario nativo como
  único método.
- El resultado principal debe tener dimensiones estables para evitar saltos de
  layout.
- Las tablas deben convertirse en listas o tarjetas compactas en móvil si no
  caben cómodamente.
- Los textos largos deben hacer wrap sin romper botones, tablas o tarjetas.
- No depender solo del color para errores, advertencias o estados activos.
- Las acciones principales deben ser claras: copiar, limpiar, usar hoy e
  intercambiar fechas.
- El contenido educativo, FAQ y calculadoras relacionadas van debajo de la
  herramienta.

---

## Conceptos base

### Fechas sin hora

Los inputs representan fechas de calendario, no instantes con hora.

- Para "hoy", usar la fecha local del navegador.
- No parsear strings `YYYY-MM-DD` con `new Date(string)` si eso puede convertir
  a UTC y mover el día según la zona horaria.
- Usar una abstracción tipo `{ year, month, day }`.
- Trabajar siempre a nivel de fecha sin hora para evitar errores por horario de
  verano.
- Recalcular "hoy" si la página permanece abierta durante el cambio de día local.

### Conteo estándar

Regla por defecto del producto:

```text
días = fecha_final - fecha_inicial
```

En lenguaje de usuario:

- No se cuenta la fecha inicial como día transcurrido.
- La fecha final sí queda representada como el día al que se llega.
- Del 1 de enero al 2 de enero hay `1 día`.
- Del 1 de enero al 1 de enero hay `0 días`.

Ejemplo:

```text
Fecha inicial: 15/01/2026
Fecha final:   30/09/2026

Conteo estándar: 258 días
```

### Conteo inclusivo

Algunas personas necesitan contar ambos extremos del periodo, por ejemplo para
ciertos plazos internos, estancias o reportes. Para eso se ofrece un toggle
visible llamado `Contar fecha inicial`.

Regla:

- Si las fechas son distintas, el conteo inclusivo suma `1` al valor absoluto.
- Si las fechas son iguales, el conteo inclusivo muestra `1 día` si la fecha
  cuenta dentro del tipo seleccionado.
- En rangos invertidos se conserva el signo del resultado.

Ejemplo:

```text
15/01/2026 a 30/09/2026
Estándar: 258 días
Inclusivo: 259 días
```

La UI debe explicar discretamente:

```text
El conteo estándar no cuenta la fecha inicial. Activa "Contar fecha inicial" si
necesitas contar ambos extremos del periodo.
```

### Días calendario, naturales y hábiles

| Tipo | Regla |
|------|-------|
| Todos los días | Cuenta días calendario, incluyendo fines de semana. |
| Días naturales | Sinónimo editorial de todos los días. Usarlo en contenido explicativo. |
| Días hábiles MVP | Excluye sábados y domingos. No excluye festivos. |
| Días hábiles con festivos | Fase 2. Excluye sábados, domingos y festivos del dataset seleccionado. |

En el MVP, si el usuario elige días hábiles, mostrar:

```text
En esta versión, los días hábiles excluyen sábados y domingos. No se descuentan
festivos.
```

### Fechas invertidas

La calculadora debe manejar fechas en cualquier orden.

- Si Fecha inicial < Fecha final, mostrar resultado positivo.
- Si Fecha inicial > Fecha final, mostrar resultado negativo o una frase humana.
- No mostrar error por fechas invertidas.
- Ofrecer botón para intercambiar fechas.

Ejemplo:

```text
La fecha final es 258 días antes de la fecha inicial.
```

### Sumar y restar unidades

Regla por defecto:

- `90 días después del 1 de mayo de 2026` significa sumar 90 días calendario.
- El 1 de mayo no se cuenta como día 1.
- Resultado: `jueves, 30 de julio de 2026`.

Para meses y años:

- Usar suma de calendario.
- Si el día original no existe en el mes destino, ajustar al último día válido.
- Ejemplo: `31/01/2026 + 1 mes = 28/02/2026`.
- Ejemplo bisiesto: `31/01/2024 + 1 mes = 29/02/2024`.

Para días hábiles:

- Avanzar o retroceder fecha por fecha.
- Solo contar lunes a viernes.
- No contar la fecha inicial.
- Si el resultado cae en fin de semana por una operación no hábil, sugerir el
  siguiente día hábil.

---

## Modo MVP 1 - Diferencia entre dos fechas

### Inputs

| Campo | Tipo | Requerido | Default |
|-------|------|-----------|---------|
| Fecha inicial | Día / mes / año | Sí | Hoy |
| Fecha final | Día / mes / año | Sí | Vacío |
| Conteo | Segmentado | Sí | Estándar |
| Tipo de días | Segmentado | Sí | Todos los días |

### Ejemplo

```text
Fecha inicial: 15/01/2026
Fecha final:   30/09/2026
Conteo:        Estándar
Tipo:          Todos los días
```

### Output principal

```text
Entre estas fechas hay 258 días.
```

### Output secundario

| Unidad | Valor esperado |
|--------|----------------|
| Años, meses y días calendario | `8 meses y 15 días` |
| Semanas | `36 semanas y 6 días` |
| Días totales | `258 días` |
| Días hábiles sin festivos | `184 días hábiles` |
| Fines de semana | `74 días` |
| Horas aproximadas | `6,192 horas` |
| Minutos aproximados | `371,520 minutos` |

Texto breve sugerido:

```text
Las horas y minutos son aproximados porque el cálculo usa fechas sin hora.
```

### Contexto

```text
Fecha inicial: jueves, 15 de enero de 2026
Fecha final: miércoles, 30 de septiembre de 2026
La fecha final es 258 días después de la fecha inicial.
```

Si se activa conteo inclusivo:

```text
Contando también la fecha inicial, el periodo tiene 259 días.
```

---

## Modo MVP 2 - ¿Qué fecha será dentro de X días?

### Inputs

| Campo | Tipo | Requerido | Default |
|-------|------|-----------|---------|
| Fecha de inicio | Día / mes / año | Sí | Hoy |
| Operación | Segmentado | Sí | Sumar |
| Cantidad | Numérico | Sí | Vacío |
| Unidad | Selector | Sí | Días |
| Tipo de días | Segmentado | Sí | Todos los días |

### Ejemplo con días calendario

```text
Fecha de inicio: 01/05/2026
Operación:       Sumar
Cantidad:        90
Unidad:          Días
Tipo:            Todos los días
```

Output:

```text
90 días después del 1 de mayo de 2026 será jueves, 30 de julio de 2026.
```

Datos útiles:

| Dato | Valor esperado |
|------|----------------|
| Día de la semana | `jueves` |
| Semana ISO del año | `semana 31` |
| Día del año | `día 211` |
| Trimestre | `Q3` |

### Ejemplo con días hábiles

```text
90 días hábiles después del 1 de mayo de 2026 será viernes, 4 de septiembre de 2026.
```

### Siguiente día hábil

Si una operación de calendario resulta en sábado o domingo:

```text
La fecha calculada cae en sábado. El siguiente día hábil es lunes, 3 de agosto de 2026.
```

---

## Modo MVP 3 - ¿Cuántos días faltan para una fecha?

Este modo es una variante del modo principal:

- Fecha inicial: hoy por defecto.
- Fecha final: fecha del evento.
- Etiqueta opcional del evento.
- Resultado optimizado para eventos futuros, pero debe funcionar con fechas
  pasadas.

### Inputs

| Campo | Tipo | Requerido | Default |
|-------|------|-----------|---------|
| Fecha del evento | Día / mes / año | Sí | Vacío |
| Nombre del evento | Texto, máximo 40 caracteres | No | Vacío |
| Fecha de inicio | Hoy / personalizada | No | Hoy |
| Tipo de días | Segmentado | Sí | Todos los días |

### Ejemplo

Fecha de referencia del ejemplo: `25/04/2026`.

```text
Evento: Fin de año
Fecha: 31/12/2026
```

Output:

```text
Faltan 250 días para Fin de año.
Equivale a 35 semanas y 5 días.
La fecha cae en jueves, 31 de diciembre de 2026.
Días hábiles restantes, sin festivos: 179.
```

Si la fecha ya pasó:

```text
Fin de año fue hace 12 días.
```

---

## Fase 2 - Línea de tiempo de múltiples fechas

### Inputs

- Fecha base, por defecto hoy.
- Lista de hasta 10 fechas adicionales.
- Etiqueta opcional para cada fecha.
- Tipo de días: todos / hábiles.

### Ejemplo

Fecha base del ejemplo: `25/04/2026`.

| Evento | Fecha | Días desde base | Días hábiles sin festivos | Semanas |
|--------|-------|-----------------|----------------------------|---------|
| Entrega proyecto | 15/06/2026 | `51 días` | `36 hábiles` | `7 semanas y 2 días` |
| Vacaciones | 01/08/2026 | `98 días` | `70 hábiles` | `14 semanas` |
| Vence contrato | 30/09/2026 | `158 días` | `113 hábiles` | `22 semanas y 4 días` |
| Fin de año | 31/12/2026 | `250 días` | `179 hábiles` | `35 semanas y 5 días` |

Reglas:

- Ordenar automáticamente de forma cronológica.
- Mostrar fechas pasadas con lenguaje claro.
- Permitir exportar CSV.
- No generar imagen en Fase 2 salvo que ya exista infraestructura ligera.

---

## Fase 2 - Días hábiles con festivos por país

Esta función debe implementarse solo con dataset local versionado.

### Reglas de producto

- En el MVP, los días hábiles excluyen solo sábados y domingos.
- En Fase 2, se puede activar `Descontar festivos`.
- Mostrar país y año del dataset usado.
- Mostrar lista de festivos descontados.
- No contar dos veces un festivo que cae en fin de semana.
- Si el dataset no cubre una región, decirlo de forma visible.
- No prometer validez legal, fiscal o laboral.

### Países candidatos iniciales

| País | Alcance recomendado |
|------|---------------------|
| México | Festivos nacionales oficiales primero |
| España | Festivos nacionales; autonómicos en fase posterior |
| Colombia | Festivos nacionales |
| Argentina | Festivos nacionales |
| Chile | Festivos nacionales |
| Perú | Festivos nacionales |
| EE.UU. | Festivos federales |

### Ejemplo

```text
Fecha inicial: 01/04/2026
Fecha final:   30/06/2026
País:          México
```

Output sin festivos:

```text
Días calendario: 90
Días hábiles sin festivos: 64
Fines de semana: 26
```

Output con dataset de festivos nacionales, si aplica:

```text
Días hábiles descontando festivos nacionales: 63
Festivos descontados:
- Día del Trabajo: viernes, 1 de mayo de 2026
```

Aviso sugerido:

```text
Este cálculo usa un dataset local de festivos nacionales. No incluye reglas
regionales, locales ni criterios particulares de contratos o instituciones.
```

---

## Fase 2 - Countdown en vivo

No debe estar activo por defecto en el MVP.

Reglas:

- Usar `setInterval` de `1,000 ms` solo mientras la pestaña está visible.
- Pausar si `document.visibilityState !== "visible"`.
- Respetar `prefers-reduced-motion`.
- No actualizar una región `aria-live` cada segundo.
- Si solo se captura fecha y no hora, contar hacia el inicio del día del evento.
- Al llegar a cero, mostrar mensaje estable: `El día llegó.`

Texto sugerido:

```text
El contador usa el inicio del día del evento porque no se ingresó una hora.
```

---

## Features adicionales por fase

### MVP

- Cálculo instantáneo cuando las fechas son válidas.
- Botón con icono para intercambiar fechas.
- Botón `Hoy` junto a cada fecha.
- Botón de copiar resultado en texto plano.
- Botón de limpiar.
- Indicador de día de la semana.
- Aviso de fin de semana.
- Siguiente día hábil sugerido.
- FAQ visible.

### Fase 2

- Barra de progreso temporal.
- Semana del año, día del año y trimestre.
- Exportar CSV.
- Festivos nacionales.
- Línea de tiempo múltiple.
- Countdown en vivo opcional.
- Historial de sesión opt-in con `sessionStorage`.

### Fase 3

- Compartir por WhatsApp.
- Imagen o tarjeta visual.
- Festivos regionales.
- Historial persistente opt-in.

---

## Inputs detallados

| Campo | Tipo | Rango válido | Requerido | Default |
|-------|------|--------------|-----------|---------|
| Día inicial | Texto numérico | `1 - 31` | Sí | Hoy |
| Mes inicial | Selector/texto numérico | `1 - 12` | Sí | Hoy |
| Año inicial | Texto numérico | `1900 - 2100` | Sí | Hoy |
| Día final | Texto numérico | `1 - 31` | Según modo | Vacío |
| Mes final | Selector/texto numérico | `1 - 12` | Según modo | Vacío |
| Año final | Texto numérico | `1900 - 2100` | Según modo | Vacío |
| Conteo | Segmentado | Estándar / Inclusivo | Sí | Estándar |
| Tipo de días | Segmentado | Todos / Hábiles | Sí | Todos |
| Operación | Segmentado | Sumar / Restar | Modo 2 | Sumar |
| Cantidad | Numérico | `1 - 36,500` | Modo 2 | Vacío |
| Unidad | Selector | Días / Semanas / Meses / Años | Modo 2 | Días |
| Etiqueta del evento | Texto | `1 - 40` caracteres | No | Vacío |
| País | Selector | Dataset disponible | Fase 2 | México |
| Descontar festivos | Toggle | Sí / No | Fase 2 | No |

### Parsing

- Aceptar números con ceros iniciales: `03`, `07`.
- Rechazar años de 2 dígitos.
- Rechazar fechas inexistentes: `31/04/2026`, `29/02/2025`.
- Si se permite pegar fecha completa, aceptar `DD/MM/AAAA` para `es-MX`.
- Si se ofrece `MM/DD/AAAA`, debe depender del locale o de un selector explícito,
  no inferirse silenciosamente.
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
| Fecha inicial = fecha final | Estándar: `0 días`; inclusivo: `1 día`. |
| Fecha inicial > fecha final | Calcular normalmente y mostrar frase de "antes de". |
| Cantidad = 0 | Error: `Ingresa una cantidad mayor a cero.` |
| Cantidad negativa | Usar operación restar; no aceptar signo negativo en cantidad. |
| Cantidad > 36,500 | Advertencia: `Estás calculando más de 100 años.` |
| Resultado fuera de rango | Error: `La fecha calculada queda fuera del rango soportado.` |
| Más de 10 eventos | Fase 2: bloquear con mensaje claro. |
| Dataset de festivos faltante | Fase 2: calcular sin festivos y mostrar aviso. |

---

## Formato de outputs

Usar `Intl.DateTimeFormat` e `Intl.NumberFormat` con locale base `es-MX`.

| Tipo | Formato |
|------|---------|
| Días totales | `1,257 días` |
| Resultado humano | `Entre estas fechas hay 258 días.` |
| Diferencia calendario | `8 meses y 15 días` |
| Semanas | `36 semanas y 6 días` |
| Días hábiles | `184 días hábiles` |
| Horas aproximadas | `6,192 horas aprox.` |
| Minutos aproximados | `371,520 minutos aprox.` |
| Fechas | `miércoles, 30 de septiembre de 2026` |
| Día de semana | `miércoles` |
| Semana del año | `semana 31` |
| Día del año | `día 211` |
| Porcentaje progreso | `47.3% completado` |

### Pluralización

- `1 año`, `2 años`.
- `1 mes`, `2 meses`.
- `1 semana`, `2 semanas`.
- `1 día`, `2 días`.
- `1 día hábil`, `2 días hábiles`.
- Omitir unidades en cero en frases largas si mejora legibilidad.
- Mantener `0 días` cuando las fechas son iguales en conteo estándar.

---

## Acciones del MVP

### Copiar resultado

Debe copiar texto plano.

Ejemplo:

```text
Calculadora de diferencia entre fechas - calculadoras.tools
Desde: jueves, 15 de enero de 2026
Hasta: miércoles, 30 de septiembre de 2026
Conteo: estándar
Total: 258 días
Equivalente: 8 meses y 15 días
Semanas: 36 semanas y 6 días
Días hábiles sin festivos: 184
```

Si `navigator.clipboard` no está disponible:

- Usar fallback con `textarea` temporal, o
- Mostrar mensaje accesible de error.

No usar `alert()`.

### Limpiar

- Vacía fecha final, cantidad y etiqueta.
- Restaura fecha inicial a hoy.
- Restaura conteo estándar y tipo "todos los días".
- Limpia errores, advertencias y resultado.
- No recarga la página.

### Usar ejemplo

Opcional en MVP. Rellena:

```text
Fecha inicial: 15/01/2026
Fecha final: 30/09/2026
```

El ejemplo debe dejar claro que son fechas de demostración.

---

## SEO y contenido de la página

### Meta información

| Campo | Valor |
|-------|-------|
| Title | `Calculadora de Diferencia entre Fechas - Días, Semanas y Meses` |
| Description | `Calcula cuántos días hay entre dos fechas, cuántos días faltan para un evento o qué fecha será dentro de X días. Incluye días hábiles sin fines de semana.` |
| Canonical | `/fecha-tiempo/diferencia-entre-fechas` |

Evitar claims como:

- `Cálculo legal exacto`.
- `Plazos laborales oficiales`.
- `Festivos siempre actualizados`.

### Estructura sugerida

- `h1`: Calculadora de diferencia entre fechas.
- Intro breve orientada a uso.
- Calculadora interactiva.
- Resultado y desglose.
- Cómo se cuentan los días.
- Días naturales vs días hábiles.
- Qué pasa si una fecha cae en fin de semana.
- Calculadoras relacionadas.
- FAQ.

### FAQ sugeridas

- ¿Cómo calculo la diferencia entre dos fechas en días?
- ¿Se cuenta el día inicial al calcular días entre fechas?
- ¿Cuál es la diferencia entre días naturales y días hábiles?
- ¿Cómo calculo qué fecha será dentro de 30 días?
- ¿Cómo calculo 30 días hábiles después de una fecha?
- ¿Qué pasa si una fecha cae en sábado o domingo?
- ¿La calculadora descuenta festivos?
- ¿Sirve para plazos legales o laborales?

Agregar JSON-LD para `FAQPage` solo si las preguntas y respuestas están visibles
en la página.

### Calculadoras relacionadas

| Contexto | Enlace sugerido |
|----------|-----------------|
| Siempre | Calculadora de edad |
| Eventos | Calculadora de countdown |
| Finanzas | Calculadora de intereses o vencimientos |
| Trabajo | Calculadora de días hábiles |
| Familia | Calculadora de embarazo o fecha probable de parto |

---

## Implementación en Astro + Tailwind

### Criterios técnicos

- Página estática compatible con Astro SSG.
- Sin backend.
- Sin llamadas de red.
- No introducir React, Vue, Svelte ni librerías adicionales para esta
  calculadora.
- La lógica matemática debe vivir en funciones puras.
- La UI puede vivir en Astro con un script cliente ligero.
- Evitar usar `Date` con strings que se interpreten como UTC.
- Preferir una representación interna tipo `{ year, month, day }`.
- Mantener consistencia visual con el sitio existente.
- No usar `moment.js`.
- Si se usa una librería, preferir `date-fns` ya instalada; si no existe, usar
  helpers propios bien probados.

### Funciones puras sugeridas

```ts
interface PlainDateParts {
  year: number;
  month: number;
  day: number;
}

type CountMode = "standard" | "inclusive";
type DayCountType = "calendar" | "business";
type DateOperation = "add" | "subtract";
type DateUnit = "days" | "weeks" | "months" | "years" | "businessDays";

interface DateDifferenceResult {
  sign: 1 | -1 | 0;
  totalDays: number;
  calendar: {
    years: number;
    months: number;
    days: number;
  };
  weeks: {
    weeks: number;
    days: number;
  };
  businessDays: number;
  weekendDays: number;
}

interface AddDateResult {
  date: PlainDateParts;
  weekday: string;
  dayOfYear: number;
  isoWeek: number;
  quarter: 1 | 2 | 3 | 4;
  isWeekend: boolean;
  nextBusinessDay?: PlainDateParts;
}

parseDateParts(input)
isValidDateParts(date)
isLeapYear(year)
daysInMonth(year, month)
comparePlainDates(a, b)
todayInLocalTimeZone()
addCalendarDays(date, amount)
addBusinessDays(date, amount)
addCalendarMonths(date, amount)
addCalendarYears(date, amount)
diffTotalDays(start, end, countMode)
diffCalendarParts(start, end)
countBusinessDays(start, end, countMode)
countWeekendDays(start, end, countMode)
getWeekday(date, locale)
getDayOfYear(date)
getIsoWeek(date)
getQuarter(date)
getNextBusinessDay(date)
formatPlainDate(date, locale)
formatDateDifference(result, locale)
formatNumber(value, locale)
buildDateDifferenceCopyText(input, result)
validateDateDifferenceInput(input)
```

### Constantes sugeridas

```ts
const DEFAULT_LOCALE = "es-MX";
const MIN_YEAR = 1900;
const MAX_YEAR = 2100;
const MAX_AMOUNT = 36500;
const DEFAULT_COUNT_MODE: CountMode = "standard";
const DEFAULT_DAY_COUNT_TYPE: DayCountType = "calendar";
```

---

## Accesibilidad

- Todos los inputs deben tener `label` visible.
- Los errores deben asociarse con `aria-describedby`.
- El resultado principal debe estar en una región `aria-live="polite"`.
- No actualizar `aria-live` cada segundo si existe countdown en vivo.
- Los controles segmentados deben comunicar estado activo con texto, color y
  ARIA.
- Los botones de icono deben incluir `aria-label`.
- El foco visible debe ser claro.
- La navegación debe funcionar con teclado.
- No depender solo del color para errores, advertencias o estados.
- Las confirmaciones de copiar/limpiar deben ser perceptibles sin `alert()`.
- Respetar `prefers-reduced-motion`.

---

## Privacidad

- No enviar fechas, etiquetas ni resultados a APIs externas.
- No registrar valores personales en analytics.
- No pasar fechas personales por query params a otras calculadoras.
- No guardar historial en `localStorage` en el MVP.
- Si se implementa historial en Fase 2, usar `sessionStorage` y hacerlo opt-in.
- Permitir borrar historial con un botón visible.
- La acción de copiar o compartir debe requerir interacción explícita.
- Si se añade tarjeta visual, generarla en el cliente.

---

## Avisos sugeridos

Para días hábiles en MVP:

```text
Los días hábiles excluyen sábados y domingos. No se descuentan festivos en esta
versión.
```

Para usos legales o laborales:

```text
Esta calculadora ayuda a contar fechas, pero no sustituye reglas legales,
laborales, fiscales ni contractuales. Verifica siempre el criterio aplicable a
tu caso.
```

Para horas y minutos:

```text
Las horas y minutos son aproximados porque el cálculo usa fechas sin hora.
```

---

## Casos extremos

| Caso | Resultado esperado |
|------|--------------------|
| Misma fecha en conteo estándar | `0 días`. |
| Misma fecha en conteo inclusivo | `1 día`, si cuenta en el tipo seleccionado. |
| Fecha inicial posterior a final | Calcular y mostrar "antes de", no error. |
| 29/02/2024 válido | Aceptar. |
| 29/02/2025 inválido | Bloquear con error claro. |
| Año 1900 | No es bisiesto. |
| Año 2000 | Sí es bisiesto. |
| 31/01/2026 + 1 mes | `28/02/2026`. |
| 31/01/2024 + 1 mes | `29/02/2024`. |
| Restar días y salir de rango | Bloquear con error claro. |
| Rango 1920 a 2080 | Calcular sin desbordamiento. |
| Resultado cae en sábado | Mostrar aviso y siguiente lunes hábil. |
| Días hábiles con inicio en fin de semana | No contar fecha inicial; avanzar hasta hábil siguiente. |
| Festivo en fin de semana | Fase 2: no descontarlo dos veces. |
| Cambio de horario de verano | No afectar conteo de días. |
| Cambio de medianoche local | Recalcular "hoy" si aplica. |
| Texto largo de etiqueta | Truncar visualmente o hacer wrap sin romper layout. |

---

## Criterios de aceptación

| Caso | Inputs | Resultado esperado |
|------|--------|--------------------|
| Diferencia principal | `15/01/2026` a `30/09/2026`, estándar | `258 días`. |
| Conteo inclusivo | Mismos inputs, inclusivo | `259 días`. |
| Semanas | Mismos inputs | `36 semanas y 6 días`. |
| Diferencia calendario | Mismos inputs | `8 meses y 15 días`. |
| Días hábiles MVP | Mismos inputs | `184 días hábiles`. |
| Fines de semana | Mismos inputs | `74 días`. |
| Misma fecha estándar | `01/01/2026` a `01/01/2026` | `0 días`. |
| Misma fecha inclusiva | `01/01/2026` a `01/01/2026` | `1 día`. |
| Fecha invertida | `30/09/2026` a `15/01/2026` | "258 días antes". |
| Sumar días | `01/05/2026 + 90 días` | `jueves, 30 de julio de 2026`. |
| Sumar días hábiles | `01/05/2026 + 90 días hábiles` | `viernes, 4 de septiembre de 2026`. |
| Sumar mes fin de mes | `31/01/2026 + 1 mes` | `28 de febrero de 2026`. |
| Sumar mes bisiesto | `31/01/2024 + 1 mes` | `29 de febrero de 2024`. |
| Evento futuro | Base `25/04/2026`, evento `31/12/2026` | `250 días`. |
| Hábiles evento | Mismos inputs | `179 días hábiles`. |
| 29/feb válido | `29/02/2024` | Acepta. |
| 29/feb inválido | `29/02/2025` | Error: fecha inexistente. |
| Año de 2 dígitos | `15/03/26` | Error: pedir 4 dígitos. |
| Copiar | Resultado válido | Copia texto plano sin HTML. |
| Limpiar | Después de calcular | Restablece estado inicial. |
| Mobile | viewport `390px` | Sin solapamientos ni desbordes. |
| Teclado | Navegación por Tab | Todos los controles son alcanzables y operables. |

---

## Pruebas recomendadas

### Unitarias

- `isLeapYear`: 1900 falso, 2000 verdadero, 2024 verdadero, 2025 falso.
- Validación de fechas inexistentes.
- Diferencia total de días en conteo estándar.
- Diferencia total de días en conteo inclusivo.
- Fechas iguales en ambos modos.
- Fechas invertidas.
- Diferencia calendario en años, meses y días.
- Conteo de fines de semana.
- Conteo de días hábiles sin festivos.
- Sumar días.
- Restar días.
- Sumar semanas.
- Sumar meses con fin de mes.
- Sumar años con 29 de febrero.
- Sumar días hábiles hacia adelante.
- Restar días hábiles hacia atrás.
- Siguiente día hábil para sábado.
- Siguiente día hábil para domingo.
- Semana ISO del año.
- Día del año.
- Trimestre.
- Formato de pluralización.
- Texto copiable.
- Validaciones de año de 2 dígitos.
- Resultado fuera de rango.

### E2E con Playwright

- Escribir dos fechas válidas y ver resultado en tiempo real.
- Cambiar de conteo estándar a inclusivo.
- Cambiar de todos los días a días hábiles.
- Intercambiar fechas.
- Usar botón `Hoy`.
- Sumar 90 días a una fecha.
- Sumar 90 días hábiles a una fecha.
- Intentar fecha inexistente.
- Intentar año de 2 dígitos.
- Copiar resultado.
- Limpiar formulario.
- Navegar con teclado.
- Verificar `aria-live` para resultado.
- Revisar layout en móvil y desktop.
- Verificar que una etiqueta larga no rompa el layout.

---

## Fuentes y notas editoriales

- Para cálculos de calendario, usar reglas del calendario gregoriano.
- En el MVP, los días hábiles solo excluyen sábados y domingos.
- Si se añaden festivos, mantener un dataset local versionado y revisable.
- No citar fuentes legales salvo que exista una página específica por país o
  institución y se mantenga actualizada.
- En contenido SEO, explicar claramente la diferencia entre conteo estándar,
  conteo inclusivo, días naturales y días hábiles.
