# Especificación — Calculadora de Edad

## Descripción general
Herramienta para calcular la edad exacta de una persona o la
diferencia entre dos fechas expresada en años, meses, días, horas
y minutos. Es una de las calculadoras con mayor volumen de búsqueda
del sitio por su simplicidad y utilidad universal: la usan desde
estudiantes que necesitan saber su edad exacta hasta profesionales
que verifican requisitos de edad para trámites legales, médicos
o laborales.

Aunque el concepto parece simple, una buena calculadora de edad
va mucho más allá del número de años: ofrece datos curiosos,
próximo cumpleaños, edad en otras unidades y comparativas que
la hacen memorable y compartible.

---

## Conceptos base

### Cálculo de edad exacta
La edad no es simplemente el año actual menos el año de nacimiento.
Debe considerar si el cumpleaños ya ocurrió o no en el año actual,
y los meses y días exactos transcurridos.

### Manejo de años bisiestos
- Febrero 29 existe solo en años bisiestos.
- Personas nacidas el 29 de febrero cumplen años oficialmente
  el 28 de febrero o el 1 de marzo según la convención del país.
- La calculadora debe manejar este caso explícitamente.

### Zonas horarias
- La fecha "actual" puede variar según la ubicación del usuario.
- Usar la fecha local del navegador por defecto.

---

## Casos de uso (modos de cálculo)

### Modo 1 — ¿Cuántos años tengo?
> El caso más común. El usuario ingresa su fecha de nacimiento
> y obtiene su edad exacta al día de hoy.

**Inputs:**
- Fecha de nacimiento → ej. 15 de marzo de 1990
- Fecha de referencia → Hoy (por defecto) / personalizable

**Cálculo:**
Fecha actual: 25 de abril de 2026
Fecha nacimiento: 15 de marzo de 1990

Años completos: 36
Meses adicionales: 1 mes (marzo→abril, cumpleaños ya pasó)
Días adicionales: 10 días

**Output principal:**
- Edad exacta: **36 años, 1 mes y 10 días**

**Output secundario — edad en otras unidades:**

| Unidad | Valor |
|--------|-------|
| Años | 36 años |
| Meses | 433 meses |
| Semanas | 1,884 semanas |
| Días | 13,190 días |
| Horas | 316,560 horas |
| Minutos | 18,993,600 minutos |
| Segundos | 1,139,616,000 segundos |

**Output terciario — próximo cumpleaños:**
- Próximo cumpleaños: **15 de marzo de 2027**
- Faltan: **324 días** (10 meses y 18 días)
- Día de la semana en que cae: **lunes**
- Edad que cumplirás: **37 años**

---

### Modo 2 — ¿Cuántos años tendrá alguien en una fecha futura?
> Ejemplo: Mi hijo nació el 3 de julio de 2020.
> ¿Cuántos años tendrá el 1 de septiembre de 2026
> (inicio del año escolar)?

**Inputs:**
- Fecha de nacimiento → ej. 03/07/2020
- Fecha futura de referencia → ej. 01/09/2026

**Output:**
- Edad en esa fecha: **6 años, 1 mes y 29 días**
- ¿Cumple el requisito de 6 años? → ✅ Sí
- Días que faltan para esa fecha: **129 días**

> Útil para: inscripciones escolares, requisitos de edad
> para trámites, planificación familiar.

---

### Modo 3 — Diferencia de edad entre dos personas
> Ejemplo: Yo nací el 15/03/1990 y mi pareja el 22/08/1994.
> ¿Cuántos años nos llevamos?

**Inputs:**
- Fecha de nacimiento persona A → ej. 15/03/1990
- Fecha de nacimiento persona B → ej. 22/08/1994

**Output:**
- Diferencia exacta: **4 años, 5 meses y 7 días**
- La persona A es mayor por **4 años y 5 meses**
- Cuando A cumplió 10 años, B tenía **5 años**
- Cuando A tenga 70 años, B tendrá **65 años**

---

### Modo 4 — ¿En qué fecha cumpliré X años?
> Ejemplo: ¿Cuándo cumpliré exactamente 40 años?

**Inputs:**
- Fecha de nacimiento → ej. 15/03/1990
- Edad objetivo → ej. 40 años

**Output:**
- Cumplirás 40 años el: **15 de marzo de 2030**
- Día de la semana: **viernes**
- Faltan: **3 años, 10 meses y 18 días**
- Semanas que faltan: **202 semanas**

---

### Modo 5 — Edad de una cosa / evento (no solo personas)
> Ejemplo: ¿Cuántos años tiene mi empresa fundada
> el 10 de enero de 2015? ¿Cuántos años lleva
> casada esta pareja desde el 5 de junio de 2018?

**Inputs:**
- Fecha de inicio del evento → ej. 10/01/2015
- Etiqueta personalizable → ej. "Mi empresa", "Nuestro matrimonio"
- Fecha de referencia → Hoy / personalizable

**Output:**
- "Mi empresa" tiene: **11 años, 3 meses y 15 días**
- Equivale a: **4,123 días** desde su fundación
- Próximo aniversario: **10 de enero de 2027**
  (faltan 260 días — un **martes**)

---

## Inputs detallados

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|-------------|-------------------|
| Fecha de nacimiento | Date picker | 01/01/1900 – hoy | — |
| Fecha de referencia | Date picker | Cualquier fecha | Hoy |
| Fecha futura (Modo 2) | Date picker | Cualquier fecha | — |
| Fecha persona B (Modo 3) | Date picker | 01/01/1900 – hoy | — |
| Edad objetivo (Modo 4) | Numérico | 1 – 150 años | — |
| Etiqueta (Modo 5) | Texto libre | Hasta 30 caracteres | "Este evento" |
| Formato de fecha | Selector | DD/MM/AAAA / MM/DD/AAAA | Según locale |

---

## Feature — Datos curiosos sobre la edad
Sección generada automáticamente con hechos interesantes
basados en la edad calculada. Hace la calculadora memorable
y propensa a ser compartida.

**Ejemplos para una persona de 36 años:**

🌍 **En el mundo:**
- Has vivido aproximadamente **13,190 días**
- Tu corazón ha latido aproximadamente **1,400,000,000 veces**
- Has dormido aproximadamente **12 años** de tu vida

📅 **Fechas notables:**
- Naciste durante el gobierno de: [presidente según país y año]
- El número 1 en música cuando naciste era: [referencia cultural]
- El año en que naciste, el evento más notable fue: [hito histórico]

🎂 **Curiosidades de cumpleaños:**
- Tu cumpleaños cae en un **domingo** este año
- El 15 de marzo es el día número **74** del año
- Comparten tu fecha de nacimiento: [personajes famosos]

> Los datos históricos y culturales se generan a partir de
> una base de datos local embebida con hitos por año (1900–2010).
> Para los más recientes se puede integrar una API externa.

---

## Feature — Contador en tiempo real
Para el Modo 1, mostrar un contador que se actualiza
cada segundo mostrando la edad exacta incluyendo horas,
minutos y segundos transcurridos desde el nacimiento.

**Display:**

Tienes exactamente:
36 años · 1 mes · 10 días · 14 horas · 32 minutos · 07 segundos
↑
(se incrementa en vivo)

Toggle para activar/desactivar el contador en tiempo real.
Si está activo, consume recursos mínimos (setTimeout de 1 seg).

---

## Feature — Signo zodiacal y año chino
Información adicional basada en la fecha de nacimiento.
Presentada como dato cultural, no como predicción.

**Zodiaco occidental:**

| Fechas | Signo |
|--------|-------|
| 21 mar – 19 abr | ♈ Aries |
| 20 abr – 20 may | ♉ Tauro |
| 21 may – 20 jun | ♊ Géminis |
| 21 jun – 22 jul | ♋ Cáncer |
| 23 jul – 22 ago | ♌ Leo |
| 23 ago – 22 sep | ♍ Virgo |
| 23 sep – 22 oct | ♎ Libra |
| 23 oct – 21 nov | ♏ Escorpio |
| 22 nov – 21 dic | ♐ Sagitario |
| 22 dic – 19 ene | ♑ Capricornio |
| 20 ene – 18 feb | ♒ Acuario |
| 19 feb – 20 mar | ♓ Piscis |

**Zodiaco chino:**
Año del [animal] según el año de nacimiento.
Ciclo de 12 animales (rata, buey, tigre, conejo, dragón,
serpiente, caballo, cabra, mono, gallo, perro, cerdo).

**Output:**
- Signo occidental: ♓ **Piscis** (19 feb – 20 mar)
- Año chino: 🐴 **Año del Caballo** (1990)

> Mostrar con diseño discreto, como información complementaria,
> no como elemento principal de la calculadora.

---

## Feature — Generación / Era histórica
Clasificar al usuario en su generación según año de nacimiento:

| Generación | Años de nacimiento |
|-----------|-------------------|
| Generación Z | 1997 – 2012 |
| Millennials | 1981 – 1996 |
| Generación X | 1965 – 1980 |
| Baby Boomers | 1946 – 1964 |
| Generación Silenciosa | 1928 – 1945 |
| Generación más grande | Antes de 1928 |

**Output:**
- Perteneces a: 👶 **Millennials** (1981–1996)
- Característica: "La primera generación criada con internet"

---

## Feature — Compartir resultado
Tarjeta visual generada automáticamente para compartir
en redes sociales o por WhatsApp:

🎂 Mi edad exacta hoy:
36 años, 1 mes y 10 días
= 13,190 días vividos
= ♓ Piscis · 🐴 Año del Caballo
Calculado en calculadoras.tools

Botón "Copiar texto" y botón "Compartir en WhatsApp".

---

## Feature — Modo cumpleaños (para otras personas)
Perfil simplificado orientado a calcular la edad de
un familiar o amigo de forma rápida:

**Input único:**
- "¿Cuándo es su cumpleaños?" → solo día y mes (sin año)
  o fecha completa

**Output:**
- Si solo se ingresa día y mes:
  "El próximo 22 de agosto faltan **118 días**"
  "Caerá en **sábado**"

- Si se ingresa fecha completa:
  "Cumplirá **32 años** el próximo 22 de agosto"
  "Faltan **118 días**"

---

## Validaciones de inputs

| Regla | Detalle |
|-------|---------|
| Fecha no futura (Modo 1) | Error: "La fecha de nacimiento no puede ser futura" |
| Fecha válida | Error si el día no existe en ese mes (ej. 31 de abril) |
| 29 de febrero | Validar que el año sea bisiesto; si no, mostrar error claro |
| Rango de fechas | Aceptar desde 01/01/1900 hasta hoy |
| Edad objetivo > 0 | Error si se ingresa 0 o negativo en Modo 4 |
| Fecha A ≠ Fecha B (Modo 3) | Advertencia si ambas fechas son iguales |
| Campos vacíos | Bloquear cálculo y resaltar campo faltante |

---

## Formato de outputs

| Tipo de resultado | Formato |
|-------------------|---------|
| Edad principal | "X años, Y meses y Z días" |
| Unidades alternativas | Número entero con separador de miles → 13,190 días |
| Fechas | Formato largo → "15 de marzo de 2027" |
| Día de la semana | Capitalizado → "Lunes" |
| Contador en vivo | HH:MM:SS actualizado cada segundo |
| Diferencia de edad | "X años, Y meses y Z días" con indicador de quién es mayor |

---

## Features adicionales

### Cálculo instantáneo
- El resultado aparece automáticamente al completar
  la fecha de nacimiento, sin botón de calcular.

### Date picker amigable
- Selector de fecha con tres campos separados:
  día / mes / año (más fácil en móvil que un calendario).
- Opción alternativa de calendario visual.
- Autocompletado del año con 4 dígitos.

### Botón de copiar resultado
- Copia: "Tengo 36 años, 1 mes y 10 días (13,190 días)"

### Botón de limpiar / reset
- Limpia todos los campos con un clic.

### Historial de cálculos
- Últimas 5 fechas calculadas en la sesión.
- Etiquetadas con el nombre ingresado (si aplica)
  o "Cálculo 1", "Cálculo 2", etc.

---

## SEO y contenido de la página

### Meta información
- Title: "Calculadora de Edad — ¿Cuántos Años, Meses y Días Tengo?"
- Description: "Calcula tu edad exacta en años, meses, días y horas.
  Descubre cuándo es tu próximo cumpleaños, tu signo zodiacal
  y datos curiosos sobre tu vida. Gratis."

### URLs sugeridas
- /calculadora-de-edad (principal)
- /cuantos-anos-tengo
- /calculadora-edad-exacta
- /dias-vividos-calculadora
- /proximo-cumpleanos

### Preguntas frecuentes (FAQ — para rich snippets)
- ¿Cómo calculo mi edad exacta en días?
- ¿Cuántos días he vivido?
- ¿Cuánto falta para mi cumpleaños?
- ¿Cómo sé cuántos años tendré en una fecha futura?
- ¿Cuántos años me llevo con mi pareja?
- ¿Qué generación soy según mi año de nacimiento?

### Contenido de apoyo
- Tabla de generaciones con años y características.
- Tabla de signos zodiacales con fechas.
- Curiosidades: "¿Sabías que si tienes 30 años
  has dormido aproximadamente 10 años de tu vida?"

---

## Especificaciones técnicas

| Parámetro | Detalle |
|-----------|---------|
| Plataforma | Web responsive (mobile-first) |
| Sin backend | Todo el cálculo ocurre en el cliente (JS) |
| Manejo de fechas | Librería date-fns o Temporal API (sin moment.js) |
| Años bisiestos | Manejo nativo con validación explícita de feb 29 |
| Contador en vivo | setInterval de 1,000 ms; se detiene si el tab no es visible |
| Zona horaria | Fecha local del navegador (Intl.DateTimeFormat) |
| Datos históricos | JSON embebido con hitos por año (1900–2015) |
| Compartir WhatsApp | API WhatsApp Web con texto preformateado |
| Accesibilidad | Labels en todos los inputs, soporte teclado completo |
| URL principal | /calculadora-de-edad |
| Idioma | Español con formato de fecha DD/MM/AAAA por defecto |
| Locale | es-MX; adaptar separadores según país |

---

## Diferencias clave vs Calculadora de Diferencia entre Fechas

| Aspecto | Calculadora de Edad | Diferencia entre Fechas |
|---------|--------------------|-----------------------|
| Enfoque | Personas y cumpleaños | Cualquier par de fechas |
| Input principal | Fecha de nacimiento | Fecha A y fecha B |
| Output principal | Años + meses + días vividos | Duración entre dos eventos |
| Datos curiosos | Sí (generación, zodiaco, latidos) | No |
| Contador en vivo | Sí | Opcional |
| Próximo cumpleaños | Sí | No aplica |
| Modo para eventos | Sí (empresa, matrimonio) | Sí (plazo, aniversario) |
| Comparar dos personas | Sí (Modo 3) | No directamente |
| Vinculación natural | → Diferencia fechas | → Calculadora de edad |

---

## Casos extremos a contemplar

- Nacido el 29 de febrero → mostrar aviso:
  "Las personas nacidas el 29 de febrero celebran su
   cumpleaños oficial el 28 de febrero o el 1 de marzo
   según la convención. Hemos usado el 28 de febrero."
- Fecha de nacimiento = hoy → edad: 0 años, 0 meses, 0 días.
  Mensaje: "¡Feliz cumpleaños! 🎂 Tienes exactamente 0 días."
- Fecha de nacimiento en el futuro → error claro
- Edad > 120 años → advertencia: "¿Es correcta esta fecha?
  Pocos humanos han superado los 122 años."
- Fecha objetivo anterior a nacimiento (Modo 2) → error:
  "La fecha de referencia es anterior al nacimiento."
- Año de 2 dígitos ingresado (ej. '90') → interpretar como
  1990 si ≤ año actual − 2000, o como 2090 si no.
  Mostrar siempre el año interpretado para confirmar.
- Cambio de fecha a medianoche → el contador debe actualizar
  la fecha automáticamente si el usuario tiene la página abierta
- Modo 4 con edad objetivo ya cumplida →
  "Ya cumpliste 36 años el 15 de marzo de 2026.
   El próximo hito es 37 años el 15 de marzo de 2027."