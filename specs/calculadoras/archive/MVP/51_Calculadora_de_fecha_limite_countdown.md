# Especificación v2 - Calculadora de fecha límite y cuenta regresiva

## Descripción general

Herramienta para crear, seguir, compartir y actuar sobre una fecha límite o
evento. Debe indicar cuánto falta o cuánto tiempo ha transcurrido y, cuando
existe una hora exacta, mostrar una cuenta regresiva en vivo.

Debe servir para entregas, exámenes, vencimientos, viajes, eventos y metas
personales.

**Arquitectura:** todo el cálculo ocurre en el cliente. No requiere backend,
base de datos ni llamadas a APIs externas.

---

## Diferenciación de producto

La calculadora de diferencia entre fechas ya permite contar días hasta un
evento. Esta herramienta debe diferenciarse por el seguimiento de una fecha
límite concreta:

- Mostrar una cuenta regresiva exacta cuando existe hora.
- Distinguir días calendario de periodos exactos de 24 horas.
- Comunicar con claridad si vence hoy, vence pronto o ya venció.
- Permitir compartir el evento sin cambiar el instante objetivo.
- Permitir añadir el evento al calendario.
- Ofrecer accesos rápidos para crear fechas límite frecuentes.

No debe convertirse en otra calculadora general para restar, sumar o comparar
fechas.

---

## Objetivo de producto

- Responder rápidamente: "¿cuánto falta para mi fecha límite?".
- Calcular días calendario restantes para eventos con o sin hora exacta.
- Calcular días, horas, minutos y segundos exactos cuando existe hora.
- Indicar si el evento vence hoy, está próximo, vence ahora o ya pasó.
- Mostrar la zona horaria utilizada.
- Generar enlaces compartibles privados mediante el fragmento de la URL.
- Exportar el evento a un archivo `.ics`.
- Generar una página estática optimizada para SEO en Astro.

---

## Alcance recomendado

### MVP

- Nombre del evento opcional.
- Fecha objetivo obligatoria.
- Dos modos: `Solo fecha` y `Fecha y hora`.
- Hora objetivo en modo `Fecha y hora`.
- Zona horaria local detectada y visible.
- Días calendario restantes.
- Duración exacta y cuenta regresiva en vivo cuando existe hora.
- Estados claros para evento futuro, hoy, próximo, ahora y vencido.
- Presets: `Hoy 23:59`, `Mañana 23:59`, `En 7 días` y `En 30 días`.
- Copiar resumen.
- Compartir mediante fragmento de URL.
- Compartir con o sin nombre del evento.
- Añadir al calendario mediante archivo `.ics`.
- Limpiar formulario.

### Fase 2

- Lista de próximos eventos guardada en `localStorage`, solo con acción
  explícita del usuario y botón visible para borrar.
- Modo "sumar plazo desde hoy": X días, semanas o meses.
- Recordatorios locales si la plataforma lo permite.
- Personalización visual de la tarjeta compartida.

### Fuera de alcance

- Cuentas de usuario, sincronización o almacenamiento en servidor.
- Conversor o selector completo de zonas horarias.
- Notificaciones push.
- Widgets insertables en otras páginas.
- Reglas legales, fiscales, laborales o contractuales sobre vencimientos.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL pública recomendada | `/fecha-tiempo/calculadora-fecha-limite-countdown` |
| Archivo Astro recomendado | `src/pages/fecha-tiempo/calculadora-fecha-limite-countdown.astro` |
| Lógica de cálculo | `src/lib/calculators/fecha-tiempo/calculadora-fecha-limite-countdown/countdown.ts` |
| Pruebas unitarias | `src/lib/calculators/fecha-tiempo/calculadora-fecha-limite-countdown/countdown.test.ts` |
| Categoría | `fecha-tiempo` |
| Locale base | `es-MX` |

La URL canónica debe conservarse como
`/fecha-tiempo/calculadora-fecha-limite-countdown`.

---

## Comportamiento mobile-first

### Orden del primer viewport

1. H1 y descripción de una línea.
2. Nombre del evento opcional.
3. Fecha objetivo.
4. Control segmentado `Solo fecha / Fecha y hora`.
5. Hora objetivo, únicamente cuando aplique.
6. Resultado principal.

La calculadora interactiva debe aparecer en el primer viewport. El contenido
educativo, FAQ y calculadoras relacionadas deben colocarse debajo.

### Composición

- En móvil, usar una sola columna.
- En desktop, se puede usar formulario a la izquierda y resultado a la derecha.
- Todos los controles táctiles deben tener altura mínima aproximada de `44px`.
- Usar inputs nativos `type="date"` y `type="time"` cuando sea posible.
- Los presets deben mostrarse como botones compactos con wrap.
- Mantener dimensiones estables en el resultado para evitar saltos de layout.
- No usar animaciones pesadas ni efectos que se ejecuten cada segundo.

### Resultado principal en móvil

No mostrar cuatro tarjetas estrechas del mismo peso. Usar esta jerarquía:

```text
Faltan 12 días
08 h · 32 min · 14 s
Miércoles, 30 de septiembre de 2026, 23:59
Zona horaria: America/Mexico_City
```

- La primera línea es el mensaje dominante.
- La segunda línea muestra el desglose exacto solo si existe hora.
- Debajo deben aparecer la fecha completa, zona horaria y acciones.
- Acción principal: `Añadir al calendario`.
- Acciones secundarias: `Compartir`, `Copiar` y `Limpiar`.
- Si faltan menos de 24 horas, el mensaje dominante debe priorizar las horas.
- Si el evento ya pasó, cambiar el texto de estado sin depender solo del color.

---

## Flujo principal MVP

**Ejemplo:** Tengo una entrega el `2026-09-30` a las `23:59`. ¿Cuánto falta?

### Inputs del MVP

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Nombre del evento | Texto opcional | 1-80 caracteres | vacío |
| Fecha límite | Fecha | fecha válida | vacío |
| Precisión | Control segmentado | `Solo fecha` o `Fecha y hora` | `Fecha y hora` |
| Hora límite | Hora condicional | hora válida | `23:59` |
| Zona horaria | Texto informativo | zona IANA detectada | local del navegador |
| Fecha de referencia | Fecha/hora interna | fecha actual local | ahora |

El campo de hora debe ocultarse en modo `Solo fecha`. Su último valor puede
conservarse durante la sesión para recuperarlo si el usuario vuelve a
`Fecha y hora`, pero no participa en el cálculo mientras está oculto.

### Presets

- `Hoy 23:59`: activa `Fecha y hora` y usa hoy a las `23:59`.
- `Mañana 23:59`: activa `Fecha y hora` y usa mañana a las `23:59`.
- `En 7 días`: activa `Solo fecha` y usa la fecha local dentro de 7 días.
- `En 30 días`: activa `Solo fecha` y usa la fecha local dentro de 30 días.

### Outputs principales

- Estado y mensaje principal.
- Días calendario restantes o transcurridos.
- Duración exacta descompuesta cuando existe hora.
- Fecha límite formateada.
- Zona horaria utilizada.
- Texto copiable.
- Enlace compartible.
- Archivo `.ics`.

### Acciones

- `Añadir al calendario`: descarga un archivo `.ics`.
- `Compartir`: abre Web Share API cuando esté disponible; en caso contrario,
  copia el enlace.
- `Copiar`: copia un resumen legible, no solo la URL.
- `Limpiar`: restablece inputs, resultado, URL compartida y temporizador.

---

## Semántica de fecha y tiempo

### Modo `Solo fecha`

La fecha representa un día calendario, no un instante exacto.

- El resultado principal debe mostrar días calendario.
- El estado es `es hoy` durante todo el día local correspondiente.
- No mostrar segundos ni iniciar cuenta regresiva en vivo.
- No convertir la fecha a UTC para calcular días calendario.
- Para compartir, conservar `YYYY-MM-DD` como fecha, no como timestamp.
- Al exportar a `.ics`, crear un evento de día completo.

Ejemplo:

```text
Faltan 5 días calendario para la entrega.
La entrega es el miércoles, 30 de septiembre de 2026.
```

### Modo `Fecha y hora`

La fecha y la hora representan un instante exacto en la zona horaria local del
creador.

- Mostrar días calendario hasta la fecha objetivo.
- Mostrar además la duración exacta restante o transcurrida.
- Activar la cuenta regresiva en vivo.
- Para compartir, conservar el timestamp objetivo y la zona horaria del
  creador.
- Al exportar a `.ics`, crear un evento con fecha y hora.

Ejemplo:

```text
Faltan 5 días calendario.
Tiempo exacto: 4 días, 22 horas y 15 minutos.
```

Los días exactos son bloques completos de 24 horas. Los días calendario indican
el número de cambios de fecha local hasta el evento. Deben presentarse con
etiquetas distintas.

---

## Fórmulas y algoritmo

### Tipos sugeridos

```ts
type CountdownMode = "date-only" | "date-time";

interface PlainDateParts {
  year: number;
  month: number;
  day: number;
}

interface CountdownInput {
  name?: string;
  mode: CountdownMode;
  date: PlainDateParts;
  hour?: number;
  minute?: number;
  nowMs: number;
  timeZone: string;
}
```

### Días calendario

Calcular con fechas puras para evitar cambios causados por UTC u horario de
verano. Se puede reutilizar la abstracción de fecha pura de la calculadora de
diferencia entre fechas.

```text
today_local = { year, month, day } obtenido desde now
calendar_days = diferencia_de_fechas_puras(today_local, target_date)
```

No usar `new Date("YYYY-MM-DD")` para fechas puras.

### Instante objetivo

En modo `Fecha y hora`, crear la fecha local con componentes numéricos:

```text
target = new Date(year, monthIndex, day, hour, minute, 0, 0)
target_ms = target.getTime()
diff_ms = target_ms - Date.now()
```

Validar después de construirla que sus componentes coinciden con los inputs.
Esto detecta horas inexistentes durante cambios de horario de verano.

### Duración exacta

```text
abs_ms = abs(diff_ms)
segundos_totales = floor(abs_ms / 1000)
dias_24h = floor(segundos_totales / 86400)
horas = floor((segundos_totales % 86400) / 3600)
minutos = floor((segundos_totales % 3600) / 60)
segundos = segundos_totales % 60
```

La cuenta regresiva debe recalcular `target_ms - Date.now()` en cada
actualización. No debe decrementar una variable local, porque acumularía deriva.

### Estados

En modo `Solo fecha`:

```text
calendar_days > 0 => faltan días
calendar_days = 0 => es hoy
calendar_days < 0 => fue hace días
```

En modo `Fecha y hora`:

```text
abs(diff_ms) < 1 segundo => vence ahora
misma fecha local y diff_ms > 0 => vence hoy
0 < diff_ms <= 24 horas => vence pronto; priorizar horas
diff_ms > 24 horas => faltan días
diff_ms < 0 => ya pasó
```

Evaluar los estados en el orden mostrado para que `vence ahora` tenga
precedencia sobre `ya pasó` durante el cruce de cero y `vence hoy` tenga
precedencia sobre el estado genérico `vence pronto`.

Al cruzar cero, detener el intervalo y mostrar un mensaje estable.

---

## Zona horaria

- Detectar la zona IANA con `Intl.DateTimeFormat().resolvedOptions().timeZone`.
- Mostrarla junto al resultado en modo `Fecha y hora`.
- No implementar un selector completo de zonas horarias en el MVP.
- Si no se puede detectar una zona IANA, mostrar `Zona horaria local`.
- Un evento con hora compartido debe conservar el instante objetivo original.
- Al abrirlo en otra zona, mostrar el evento en la hora local del visitante e
  indicar la zona del creador.

Ejemplo:

```text
Hora en tu zona: 14:00
Creado para: 15:00 America/Mexico_City
```

---

## Enlaces compartibles y privacidad

Los datos compartidos deben almacenarse en el fragmento de URL, después de `#`,
para evitar enviarlos al servidor como query params.

Ejemplos conceptuales:

```text
#mode=date-only&date=2026-09-30
#mode=date-time&target=1790834340000&tz=America%2FMexico_City
```

Reglas:

- Crear o actualizar el fragmento solo tras pulsar `Compartir`.
- No incluir el nombre del evento por defecto.
- Antes de compartir, ofrecer la opción `Incluir nombre del evento`.
- Validar todos los valores reconstruidos desde el fragmento.
- Ignorar parámetros desconocidos o inválidos.
- No registrar nombres, fechas, horas, fragmentos ni resultados en analytics.
- No enviar datos personales a APIs externas.
- Limpiar debe eliminar el fragmento generado.

Para eventos `Solo fecha`, compartir la misma fecha de calendario. Para eventos
`Fecha y hora`, compartir el timestamp exacto y la zona horaria del creador.

---

## Exportación a calendario

La acción `Añadir al calendario` debe generar un archivo `.ics` en el cliente.

- Usar el nombre del evento como título o `Fecha límite` si está vacío.
- Escapar caracteres especiales del formato iCalendar.
- Para `Solo fecha`, crear un evento de día completo con `DTSTART;VALUE=DATE` y
  `DTEND;VALUE=DATE` apuntando al día siguiente, porque el fin es exclusivo.
- Para `Fecha y hora`, convertir el instante objetivo a UTC y escribir
  `DTSTART` con sufijo `Z` para conservarlo entre calendarios y zonas horarias.
- Incluir una descripción breve generada por calculadoras.tools.
- No enviar el evento a servicios externos.

---

## Comportamiento de la cuenta regresiva

- Ejecutar `setInterval` de `1,000 ms` solo en modo `Fecha y hora`.
- Pausar si `document.visibilityState !== "visible"`.
- Recalcular inmediatamente al volver a una pestaña visible.
- Detenerse al llegar a cero, limpiar formulario o desmontar la calculadora.
- Recalcular los días calendario al cruzar medianoche local.
- No actualizar una región `aria-live` cada segundo.
- Respetar `prefers-reduced-motion`.
- No reproducir sonidos ni solicitar notificaciones en el MVP.

---

## Validaciones y estados de error

- Fecha límite es obligatoria.
- Hora límite es obligatoria únicamente en modo `Fecha y hora`.
- Fecha y hora deben representar valores locales válidos.
- Bloquear fechas inválidas como `29/02/2025`.
- Definir un rango soportado, recomendado `1900-2100`.
- Si la hora no existe por un cambio de horario de verano, mostrar un error
  claro y solicitar otra hora.
- Si el nombre supera 80 caracteres, impedir más entrada.
- Si el evento ya pasó, no ocultar el resultado ni tratarlo como error.
- Si el fragmento compartido es inválido, ignorarlo y mostrar el formulario
  vacío con un aviso no bloqueante.

Mensajes sugeridos:

```text
Selecciona una fecha límite válida.
Selecciona una hora válida.
Esa hora no existe en tu zona horaria debido al cambio de horario.
No pudimos abrir todos los datos del enlace compartido.
```

---

## Accesibilidad

- Todos los inputs deben tener `label` visible.
- Los errores deben asociarse con `aria-describedby`.
- El control segmentado debe comunicar estado con texto, color, `aria-pressed`
  o radios nativos.
- El resultado principal puede usar `aria-live="polite"` al cambiar inputs o
  estado, pero el contenido anunciado no debe actualizarse cada segundo.
- Mantener el contador visual separado de la región anunciada.
- Los botones de icono deben incluir `aria-label`.
- El foco visible debe ser claro.
- La navegación debe funcionar con teclado.
- No depender solo del color para errores, advertencias o estados.
- Las confirmaciones de copiar, compartir y descargar deben ser perceptibles
  sin `alert()`.
- Respetar `prefers-reduced-motion`.

---

## Texto copiable

Ejemplo con hora:

```text
Entrega del proyecto
Vence: miércoles, 30 de septiembre de 2026, 23:59
Zona horaria: America/Mexico_City
Faltan 12 días calendario.
Tiempo exacto: 11 días, 8 horas y 32 minutos.
```

Ejemplo sin hora:

```text
Entrega del proyecto
Fecha: miércoles, 30 de septiembre de 2026
Faltan 12 días calendario.
```

No incluir segundos en el texto copiable.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de fecha límite y cuenta regresiva` |
| Meta description | `Calcula cuánto falta para una fecha límite o evento, crea una cuenta regresiva y añade la fecha a tu calendario.` |
| H1 | `Calculadora de fecha límite` |
| Keyword principal | `calculadora de fecha límite` |
| Keywords secundarias | `cuenta regresiva`, `cuánto falta para una fecha`, `countdown online` |

### Contenido educativo sugerido

- Diferencia entre días calendario y bloques de 24 horas.
- Cómo afecta la zona horaria a una cuenta regresiva compartida.
- Cómo añadir una fecha límite al calendario.
- Aviso para plazos legales o contractuales.

### FAQs sugeridas

- ¿La cuenta regresiva usa mi zona horaria?
- ¿Cuál es la diferencia entre días calendario y días de 24 horas?
- ¿Puedo calcular una fecha sin hora exacta?
- ¿Qué pasa si la fecha ya pasó?
- ¿El enlace compartido incluye el nombre del evento?
- ¿Puedo añadir la fecha límite a mi calendario?

Aviso sugerido:

```text
Esta herramienta ayuda a seguir fechas, pero no sustituye reglas legales,
laborales, fiscales ni contractuales. Verifica siempre el criterio aplicable.
```

---

## Casos extremos

| Caso | Resultado esperado |
|------|--------------------|
| Fecha sin hora igual a hoy | Mostrar `Es hoy`; sin countdown en segundos. |
| Evento futuro durante hoy | Mostrar `Vence hoy` y priorizar horas. |
| Evento exactamente a medianoche | Calcular y cambiar estado sin quedarse en cero. |
| Evento pasado | Mostrar tiempo transcurrido; no error. |
| Cambio de horario de verano | Días calendario estables y duración exacta basada en timestamp. |
| Hora local inexistente por cambio horario | Bloquear con error claro. |
| Pestaña oculta varios minutos | Recalcular desde `Date.now()` al volver. |
| Cruzar medianoche con página abierta | Actualizar días calendario. |
| Abrir enlace en otra zona horaria | Conservar instante y mostrar equivalencia local. |
| Nombre con caracteres especiales | Mostrar, copiar y exportar correctamente escapado. |
| Enlace compartido sin nombre | Reconstruir evento sin revelar nombre. |
| Fragmento manipulado o inválido | Ignorar valores inválidos y mostrar aviso. |
| `29/02/2024` | Aceptar. |
| `29/02/2025` | Bloquear. |

---

## Pruebas unitarias sugeridas

- Fecha futura calcula días calendario positivos.
- Fecha pasada calcula días calendario y duración transcurrida.
- Modo `Solo fecha` no produce timestamp ni segundos.
- Modo `Fecha y hora` descompone correctamente 1 día, 2 horas y 3 minutos.
- Días calendario y bloques de 24 horas pueden producir valores distintos.
- La duración usa el timestamp objetivo y no acumula deriva.
- Estado cambia a `vence hoy`, `vence pronto`, `vence ahora` y `ya pasó`.
- Countdown se detiene al llegar a cero.
- Cambio de horario de verano no altera el conteo de días calendario.
- Fecha y hora local inexistente produce error.
- Presets calculan fechas desde la fecha local.
- Fragmento de fecha pura reconstruye la misma fecha calendario.
- Fragmento con timestamp conserva el mismo instante en otra zona horaria.
- Fragmento inválido se ignora de forma segura.
- Nombre no se incluye en el enlace salvo consentimiento explícito.
- Texto copiable omite segundos.
- Archivo `.ics` de fecha pura crea evento de día completo.
- Archivo `.ics` con hora conserva el instante objetivo.

---

## Criterios de aceptación del MVP

- La herramienta completa aparece antes del contenido educativo en móvil.
- El usuario puede obtener un resultado introduciendo solo una fecha.
- El usuario puede crear una cuenta regresiva exacta introduciendo fecha y hora.
- El resultado diferencia explícitamente días calendario y duración exacta.
- La zona horaria utilizada es visible cuando existe hora.
- La cuenta regresiva no deriva después de ocultar y volver a abrir la pestaña.
- El resultado sigue siendo comprensible sin color.
- El contador no genera anuncios de accesibilidad cada segundo.
- Compartir no envía datos mediante query params ni incluye el nombre por
  defecto.
- Un enlace con hora conserva el mismo instante al abrirse en otra zona.
- El usuario puede añadir el evento al calendario sin servicios externos.
- Limpiar detiene el contador y elimina los datos compartidos de la URL.
