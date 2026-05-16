# Especificación — Calculadora de Diferencia entre Fechas

## Descripción general
Herramienta para calcular el tiempo transcurrido o restante entre
dos fechas cualesquiera. A diferencia de la calculadora de edad
(enfocada en personas y cumpleaños), esta es una herramienta
de propósito general: sirve para contar días hasta un evento,
medir cuánto tiempo lleva un proyecto, calcular vencimientos
de contratos, planificar plazos legales o simplemente saber
cuántos días faltan para las vacaciones.

Es una calculadora de alto volumen de búsqueda con un perfil
de usuario muy diverso: estudiantes, profesionales, abogados,
contadores, parejas que cuentan su aniversario y padres que
cuentan el embarazo.

---

## Conceptos base

### Tipos de diferencia entre fechas

**Diferencia calendario:**
Cuenta todos los días entre dos fechas incluyendo fines
de semana y festivos. Es el cálculo estándar.

**Diferencia en días hábiles:**
Excluye sábados y domingos. Opcionalmente excluye
festivos según el país seleccionado.

**Diferencia en días naturales:**
Sinónimo de diferencia calendario en contexto legal/laboral.

### Dirección del cálculo
- Fecha A < Fecha B → resultado positivo (días que faltan)
- Fecha A > Fecha B → resultado negativo (días que pasaron)
- La calculadora maneja ambas direcciones sin error.

---

## Casos de uso (modos de cálculo)

### Modo 1 — Diferencia entre dos fechas
> El caso más común. ¿Cuántos días hay entre
> el 15 de enero y el 30 de septiembre de 2026?

**Inputs:**
- Fecha A (inicio) → ej. 15/01/2026
- Fecha B (fin) → ej. 30/09/2026
- Incluir día final → Sí / No (toggle)
- Tipo de conteo → Todos los días / Solo días hábiles

**Cálculo:**
Días totales entre 15 enero y 30 septiembre 2026 = 257 días
(con día final incluido: 258 días)

**Output principal:**
- Diferencia total: **257 días**

**Output secundario — desglose:**

| Unidad | Valor |
|--------|-------|
| Años completos | 0 años |
| Meses completos | 8 meses |
| Semanas completas | 36 semanas |
| Días totales | 257 días |
| Días hábiles | 184 días hábiles |
| Fines de semana | 73 días (36 fines de semana) |
| Horas totales | 6,168 horas |
| Minutos totales | 370,080 minutos |

**Output terciario — contexto:**
- Fecha A: **jueves, 15 de enero de 2026**
- Fecha B: **miércoles, 30 de septiembre de 2026**
- La fecha B es **257 días después** de la fecha A
- Equivale a aproximadamente **8 meses y 15 días**

---

### Modo 2 — ¿Cuántos días faltan para una fecha?
> Countdown hasta un evento futuro.
> Ejemplo: ¿Cuántos días faltan para el 31 de diciembre?

**Inputs:**
- Fecha del evento → ej. 31/12/2026
- Nombre del evento (opcional) → ej. "Año Nuevo"
- Fecha de inicio → Hoy (por defecto)

**Output:**
- Faltan **250 días** para **Año Nuevo** 🎉
- Equivale a: **35 semanas y 5 días**
- Fecha: **jueves, 31 de diciembre de 2026**
- Días hábiles restantes: **179 días hábiles**

**Contador regresivo en tiempo real:**

Faltan:
249 días · 14 horas · 23 minutos · 41 segundos
↑
(cuenta regresiva en vivo)

---

### Modo 3 — ¿Qué fecha será dentro de X días?
> El usuario suma o resta días a una fecha.
> Ejemplo: ¿Qué fecha es 90 días después del 1 de mayo?

**Inputs:**
- Fecha de inicio → ej. 01/05/2026
- Operación → Sumar / Restar
- Cantidad → ej. 90
- Unidad → Días / Semanas / Meses / Años
- Contar solo días hábiles → Sí / No

**Cálculo:**
01/05/2026 + 90 días = 29/07/2026

**Output:**
- 90 días después del 1 de mayo de 2026:
  **miércoles, 29 de julio de 2026**
- Semana del año: **semana 31**
- Día del año: **día 210**
- Si excluyes fines de semana:
  90 días hábiles después = **viernes, 4 de septiembre de 2026**

---

### Modo 4 — Múltiples fechas / línea de tiempo
> El usuario agrega varias fechas y ve la diferencia
> entre cada una y el orden cronológico.

**Inputs:**
- Fecha base (referencia) → ej. hoy
- Lista de fechas adicionales (hasta 10)
  con etiqueta opcional cada una

**Ejemplo:**

Fecha base: 25/04/2026 (Hoy)

Entrega del proyecto    → 15/06/2026
Vacaciones              → 01/08/2026
Vencimiento contrato    → 30/09/2026
Fin de año              → 31/12/2026

**Output — tabla ordenada cronológicamente:**

| Evento | Fecha | Días desde hoy | Días hábiles | Semanas |
|--------|-------|----------------|--------------|---------|
| Entrega proyecto | 15/06/2026 | 51 días | 37 hábiles | 7.3 sem |
| Vacaciones | 01/08/2026 | 98 días | 70 hábiles | 14 sem |
| Vence contrato | 30/09/2026 | 158 días | 113 hábiles | 22.6 sem |
| Fin de año | 31/12/2026 | 250 días | 179 hábiles | 35.7 sem |

- Barra de progreso visual para cada evento
  mostrando qué tan cerca o lejos está.
- Opción de exportar la línea de tiempo como imagen o CSV.

---

### Modo 5 — Días hábiles con festivos por país
> Versión profesional para cálculos legales,
> laborales o contractuales.

**Inputs:**
- Fecha A → ej. 01/04/2026
- Fecha B → ej. 30/06/2026
- País → selector
- Estado / provincia (si aplica) → selector

**Output:**
- Días calendario totales: **90 días**
- Días hábiles (sin festivos): **63 días**
- Festivos en el período: **3 días**
  - Día del Trabajo (1 mayo)
  - Día de la Independencia (16 septiembre — si aplica)
  - [festivo local]
- Fines de semana: **26 días**

**Festivos por país disponibles (base inicial):**

| País | Festivos nacionales cubiertos |
|------|------------------------------|
| México | 7 festivos oficiales + 1 optativo |
| España | 8 festivos nacionales + autonómicos |
| Colombia | 18 festivos |
| Argentina | 15 festivos |
| Chile | 16 festivos |
| Perú | 12 festivos |
| EE.UU. | 11 festivos federales |

> Nota: Los festivos regionales o locales se cubren
> parcialmente según disponibilidad de datos.

---

## Inputs detallados

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|-------------|-------------------|
| Fecha A | Date picker | 01/01/1900 – 31/12/2100 | Hoy |
| Fecha B | Date picker | 01/01/1900 – 31/12/2100 | — |
| Nombre del evento | Texto libre | Hasta 40 caracteres | — |
| Incluir día final | Toggle | Sí / No | Sí |
| Tipo de conteo | Selector | Todos / Hábiles | Todos |
| País (festivos) | Selector | Ver lista | México |
| Operación (Modo 3) | Selector | Sumar / Restar | Sumar |
| Cantidad (Modo 3) | Numérico | 1 – 36,500 | — |
| Unidad (Modo 3) | Selector | Días / Semanas / Meses / Años | Días |
| Formato de fecha | Selector | DD/MM/AAAA / MM/DD/AAAA | Según locale |

---

## Feature — Contador regresivo en tiempo real
Para el Modo 2 (countdown), mostrar una cuenta regresiva
que se actualiza cada segundo.

**Display:**

⏳ Faltan para [Nombre del evento]:
249      14       23        41
días    horas   minutos  segundos

- Se actualiza cada segundo con requestAnimationFrame.
- Se pausa automáticamente si el tab no está visible
  (Page Visibility API) para ahorrar recursos.
- Al llegar a 0: mensaje de celebración "¡El día llegó! 🎉"

---

## Feature — Indicador de día de la semana
Para cada fecha ingresada, mostrar automáticamente
el día de la semana en que cae.

**Útil para:**
- Saber si un vencimiento cae en fin de semana
- Planificar reuniones o entregas
- Verificar si una fecha festiva cae en día hábil

**Display:**
- Fecha A: **jueves** · Fecha B: **miércoles**
- Si cae en fin de semana: indicador visual 🔴
- Si cae en festivo: indicador 🔴 + nombre del festivo

---

## Feature — Barra de progreso temporal
Cuando ambas fechas están definidas y la fecha actual
está entre ellas, mostrar una barra de progreso:

Inicio [████████████░░░░░░░░░░░] Fin
15 ene                           30 sep
Has completado el 47% del período
Quedan 136 días (53%)

---

## Feature — Semana del año y día del año
Para cada fecha calculada, mostrar:
- Número de semana del año (1–53)
- Número de día del año (1–366)
- Trimestre del año (Q1–Q4)

**Útil para:** planificación empresarial, reportes fiscales,
seguimiento de proyectos.

---

## Feature — Exportar y compartir

**Exportar como texto:**

Diferencia entre fechas
Desde: jueves, 15 de enero de 2026
Hasta: miércoles, 30 de septiembre de 2026
──────────────────────────────────────────
Total: 257 días (8 meses y 15 días)
Días hábiles: 184
Semanas: 36 semanas y 5 días
Calculado en calculadoras.tools

**Exportar línea de tiempo (Modo 4):** CSV con columnas
evento, fecha, días desde hoy, días hábiles.

**Compartir por WhatsApp:** texto preformateado con
el resultado principal y la fecha del evento.

**Generar imagen:** tarjeta visual del countdown
para compartir en redes sociales.

---

## Feature — Historial de fechas frecuentes
El usuario puede guardar fechas recurrentes para
acceder rápidamente sin volver a ingresarlas:

- Fecha de nacimiento
- Aniversario
- Fecha de vencimiento de contrato
- Fecha de examen importante

Guardado en localStorage, sin cuenta necesaria.
Máximo 10 fechas guardadas.

---

## Usos por perfil de usuario

| Perfil | Caso de uso típico | Modo recomendado |
|--------|-------------------|-----------------|
| Estudiante | ¿Cuántos días faltan para el examen? | Modo 2 |
| Abogado / Contador | Plazos legales en días hábiles | Modo 5 |
| Embarazada | ¿Cuántas semanas de gestación? | Modo 1 |
| HR / RRHH | Días de antigüedad de un empleado | Modo 1 |
| Project manager | Línea de tiempo del proyecto | Modo 4 |
| Pareja | Aniversario: ¿cuánto tiempo llevamos? | Modo 1 |
| Viajero | ¿Cuántos días faltan para el viaje? | Modo 2 |
| Freelance | Vencimiento de contrato o factura | Modo 3 |

---

## Validaciones de inputs

| Regla | Detalle |
|-------|---------|
| Fecha válida | Error si el día no existe en ese mes |
| 29 de febrero | Validar que el año sea bisiesto |
| Rango de fechas | Aceptar 01/01/1900 – 31/12/2100 |
| Fecha A = Fecha B | Resultado 0 días; mensaje: "Las fechas son iguales" |
| Cantidad Modo 3 > 0 | Error si se ingresa 0 o negativo |
| Cantidad Modo 3 > 36,500 | Advertencia: "Más de 100 años en el futuro" |
| Más de 10 fechas Modo 4 | Bloquear con mensaje: "Máximo 10 fechas por cálculo" |
| Campos vacíos | Bloquear cálculo y resaltar campo faltante |

---

## Formato de outputs

| Tipo de resultado | Formato |
|-------------------|---------|
| Días totales | Número entero con separador de miles → 1,257 días |
| Desglose | "X años, Y meses y Z días" |
| Días hábiles | Número entero → 184 días hábiles |
| Semanas | "36 semanas y 5 días" |
| Horas / minutos | Con separador de miles → 6,168 horas |
| Fechas resultado | Formato largo → "miércoles, 29 de julio de 2026" |
| Countdown | DD · HH · MM · SS con etiquetas |
| Porcentaje progreso | 1 decimal → 47.3% completado |

---

## Features adicionales

### Cálculo instantáneo
- El resultado aparece automáticamente al completar
  ambas fechas, sin botón de calcular.

### Intercambiar fechas (swap)
- Botón con ícono ⇄ para intercambiar Fecha A y Fecha B
  con un clic. Útil cuando el usuario las invierte.

### Fecha de hoy con un clic
- Botón "Hoy" junto a cada campo de fecha para
  rellenarlo instantáneamente con la fecha actual.

### Date picker amigable
- Tres campos separados: día / mes / año.
- Opción de calendario visual.
- Navegación por teclado completa.

### Botón de copiar resultado
- Copia el resumen completo en texto plano.

### Botón de limpiar / reset
- Limpia todos los campos con un clic.

### Modo oscuro compatible
- La barra de progreso y el countdown se ven bien
  en modo oscuro del navegador (prefers-color-scheme).

---

## SEO y contenido de la página

### Meta información
- Title: "Calculadora de Diferencia entre Fechas — Días, Semanas y Meses"
- Description: "Calcula cuántos días hay entre dos fechas, cuánto
  falta para un evento o qué fecha será dentro de X días.
  Incluye días hábiles y festivos por país. Gratis."

### URLs sugeridas
- /diferencia-entre-fechas (principal)
- /calculadora-de-dias
- /cuantos-dias-faltan-para
- /dias-habiles-calculadora
- /contador-regresivo-fecha

### Preguntas frecuentes (FAQ — para rich snippets)
- ¿Cómo calculo la diferencia entre dos fechas en días?
- ¿Cómo sé cuántos días hábiles hay entre dos fechas?
- ¿Cómo calculo qué fecha es dentro de 30 días hábiles?
- ¿Cuántos días faltan para el 31 de diciembre?
- ¿Cómo cuento días excluyendo fines de semana?
- ¿Qué día de la semana cae el [fecha]?

### Contenido de apoyo
- Guía: "Días hábiles vs días naturales: diferencia legal."
- Tabla de festivos nacionales por país (actualizable).
- Ejemplos de uso: plazos legales, contratos, embarazo,
  planificación de proyectos.

---

## Especificaciones técnicas

| Parámetro | Detalle |
|-----------|---------|
| Plataforma | Web responsive (mobile-first) |
| Sin backend | Todo el cálculo ocurre en el cliente (JS) |
| Manejo de fechas | date-fns o Temporal API (sin moment.js) |
| Años bisiestos | Manejo nativo con validación explícita |
| Festivos | JSON embebido por país; actualizable anualmente |
| Countdown | setInterval 1,000 ms con Page Visibility API |
| Barra de progreso | CSS + JS nativo; sin librerías externas |
| Exportar CSV | Blob API en cliente |
| Compartir WhatsApp | API WhatsApp Web |
| Generar imagen tarjeta | html2canvas o equivalente ligero |
| Accesibilidad | Labels, ARIA live regions para countdown, teclado |
| URL principal | /diferencia-entre-fechas |
| Idioma | Español; fechas en formato DD/MM/AAAA por defecto |
| Locale | es-MX base; adaptar nombres de días y meses |

---

## Diferencias clave vs Calculadora de Edad

| Aspecto | Diferencia entre Fechas | Calculadora de Edad |
|---------|------------------------|---------------------|
| Enfoque | Cualquier par de fechas | Personas y cumpleaños |
| Input principal | Fecha A + Fecha B | Solo fecha de nacimiento |
| Días hábiles | ✅ Sí, con festivos por país | ❌ No |
| Countdown en vivo | ✅ Sí (Modo 2) | ✅ Sí (contador de vida) |
| Línea de tiempo múltiple | ✅ Sí (Modo 4) | ❌ No |
| Sumar / restar días | ✅ Sí (Modo 3) | ❌ No |
| Datos curiosos | ❌ No | ✅ Sí (generación, zodiaco) |
| Festivos por país | ✅ Sí | ❌ No |
| Barra de progreso | ✅ Sí | ❌ No |
| Perfil de usuario | Profesional / planificación | Personal / curiosidad |
| Vinculación natural | → Calculadora de edad | → Diferencia entre fechas |

---

## Casos extremos a contemplar

- Fecha A > Fecha B → calcular normalmente con resultado
  negativo; mostrar "La fecha B es 257 días antes de la fecha A"
  en lugar de un error
- Fecha A = Fecha B → resultado 0 días con mensaje claro
- Fechas muy lejanas (ej. 1920 a 2080) → manejar sin
  desbordamiento; mostrar correctamente años bisiestos intermedios
- 29 de febrero en año no bisiesto → error claro con
  sugerencia de usar 28 de febrero o 1 de marzo
- Festivo que cae en fin de semana → no contarlo doble;
  seguir convención del país (traslado al lunes o se pierde)
- Modo 3 restando días que resultan en fecha anterior
  a 01/01/1900 → error: "Fecha fuera del rango soportado"
- Modo 4 con fechas desordenadas → ordenar automáticamente
  de forma cronológica sin avisar al usuario
- Countdown que llega a 0 mientras el usuario tiene
  la página abierta → animación de celebración y
  mensaje "¡El día llegó! 🎉" sin recargar la página
- País con festivos regionales → mostrar solo festivos
  nacionales con nota: "No incluye festivos regionales o locales"
- Cambio de horario de verano (DST) entre fechas →
  trabajar siempre con fechas sin hora para evitar
  el problema de la hora perdida/ganada en el conteo de días