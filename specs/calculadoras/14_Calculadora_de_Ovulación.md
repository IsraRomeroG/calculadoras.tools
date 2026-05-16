# Especificación — Calculadora de Ovulación

## Descripción general
Herramienta para identificar los días fértiles y el día de ovulación
dentro del ciclo menstrual. Es la calculadora previa natural a la
de fecha probable de parto: la usa una mujer que está buscando
quedarse embarazada, o que quiere conocer mejor su ciclo para
planificación familiar natural.

Alto volumen de búsqueda constante durante todo el año con picos
en enero (propósitos de año nuevo) y primavera. El perfil de usuario
es predominantemente mujeres entre 25 y 38 años, frecuentemente
acompañadas por su pareja, con una intención clara de concepción
o de autoconocimiento del ciclo menstrual.

El tono debe ser esperanzador, empático y clínicamente correcto.
Esta calculadora toca temas de fertilidad que pueden estar
cargados emocionalmente para muchas usuarias.

---

## Conceptos base

### El ciclo menstrual
El ciclo menstrual se mide desde el primer día de la menstruación
hasta el día anterior a la siguiente menstruación.

- Ciclo promedio: **28 días** (rango normal: 21–35 días)
- La duración puede variar mes a mes incluso en ciclos regulares

### Las fases del ciclo

| Fase | Duración | Descripción |
|------|----------|-------------|
| Menstruación | Días 1–5 | Sangrado menstrual |
| Fase folicular | Días 1–13 | Maduración del folículo |
| Ovulación | Día 14 (en ciclo de 28) | Liberación del óvulo |
| Fase lútea | Días 15–28 | Preparación del útero |

### La ovulación
- Ocurre aproximadamente **14 días antes** del inicio
  de la siguiente menstruación (no 14 días después de la FUM).
- El óvulo es viable durante **12–24 horas** tras la ovulación.
- Los espermatozoides pueden sobrevivir **3–5 días** en el tracto
  reproductivo femenino.

### La ventana fértil
La combinación de la supervivencia del espermatozoide y la
viabilidad del óvulo crea una ventana fértil de **5–6 días**:
- **5 días antes** de la ovulación
- **El día de la ovulación** (pico de fertilidad)
- **1 día después** de la ovulación

### Fase lútea
- Duración relativamente constante: **12–16 días**
- Promedio: **14 días**
- Esto significa que la ovulación varía según la longitud
  del ciclo, pero la fase lútea es casi siempre la misma

### Fórmula de cálculo
Día de ovulación = FUM + (duración_ciclo − 14 días)

**Ejemplos:**
- Ciclo 28 días: ovulación día 14 (FUM + 14)
- Ciclo 30 días: ovulación día 16 (FUM + 16)
- Ciclo 35 días: ovulación día 21 (FUM + 21)
- Ciclo 24 días: ovulación día 10 (FUM + 10)

---

## Casos de uso (modos de cálculo)

### Modo 1 — Cálculo estándar de días fértiles
> La mujer sabe cuándo fue su última menstruación.
> Quiere saber cuándo será su próxima ovulación.

**Inputs:**
- Fecha de inicio de la última menstruación (FUM) → ej. 01/04/2026
- Duración del ciclo (días) → ej. 28 días
- Duración de la menstruación (días) → ej. 5 días (opcional)

**Cálculo:**
Día de ovulación = 01/04/2026 + (28 − 14) = **15 de abril de 2026**
Ventana fértil inicio = 15/04/2026 − 5 = **10 de abril de 2026**
Ventana fértil fin = 15/04/2026 + 1 = **16 de abril de 2026**
Próxima menstruación estimada = 01/04/2026 + 28 = **29 de abril de 2026**

**Output principal:**
- 🥚 Día de ovulación estimado: **miércoles, 15 de abril de 2026**
- 💚 Días más fértiles: **10 al 16 de abril de 2026**
- 📅 Próxima menstruación estimada: **29 de abril de 2026**

**Output secundario — desglose de la ventana fértil:**

| Día | Fecha | Fertilidad | Descripción |
|-----|-------|-----------|-------------|
| Día 10 | 10 abr | 🟡 Baja-media | Inicio ventana fértil |
| Día 11 | 11 abr | 🟡 Media | Fertilidad creciente |
| Día 12 | 12 abr | 🟠 Alta | Alta probabilidad |
| Día 13 | 13 abr | 🔴 Muy alta | Pico previo |
| Día 14 | 14 abr | 🔴 Muy alta | Pico previo |
| **Día 15** | **15 abr** | **🔴 Máxima** | **Día de ovulación** |
| Día 16 | 16 abr | 🟡 Decreciente | Último día fértil |
| Día 17+ | 17 abr+ | ⚪ Muy baja | Fase lútea |

---

### Modo 2 — Proyección de varios ciclos
> La mujer quiere planificar con más de un mes de antelación
> o ha estado intentando concebir durante varios ciclos.

**Inputs:**
- FUM → ej. 01/04/2026
- Duración del ciclo → ej. 28 días
- Número de ciclos a proyectar → ej. 3 ciclos (1–6)

**Output — calendario de 3 ciclos:**

| Ciclo | Menstruación | Ovulación | Ventana fértil |
|-------|-------------|-----------|----------------|
| Ciclo 1 | 01–05 abr 2026 | 15 abr | 10–16 abr 2026 |
| Ciclo 2 | 29 abr–03 may 2026 | 13 may | 08–14 may 2026 |
| Ciclo 3 | 27–31 may 2026 | 10 jun | 05–11 jun 2026 |

- Vista de calendario visual con colores:
  🔴 Menstruación · 🟢 Ventana fértil · ⭐ Ovulación

---

### Modo 3 — Con ciclo irregular
> La mujer tiene ciclos irregulares y quiere
> una estimación basada en el rango de su ciclo.

**Inputs:**
- FUM → ej. 01/04/2026
- Ciclo más corto de los últimos 6 meses → ej. 25 días
- Ciclo más largo de los últimos 6 meses → ej. 32 días

**Cálculo:**
Ovulación más temprana = FUM + (ciclo_corto − 14) = FUM + 11 = **12 abr**
Ovulación más tardía = FUM + (ciclo_largo − 14) = FUM + 18 = **19 abr**
Ventana fértil ampliada = **7 al 20 de abril**

**Output:**
- Ventana fértil estimada: **7 al 20 de abril de 2026**
- Días de máxima probabilidad: **12 al 19 de abril**
- Nota: "Con ciclos irregulares la ventana fértil es más amplia
  y menos predecible. Los test de ovulación (LH) pueden
  ayudarte a confirmar el momento exacto."

---

### Modo 4 — Calculadora de fase lútea
> Para mujeres que ya han detectado su ovulación
> (con test LH o temperatura basal) y quieren saber
> cuándo esperar su menstruación o hacer un test de embarazo.

**Inputs:**
- Fecha detectada de ovulación → ej. 15/04/2026
- Duración habitual de la fase lútea → ej. 14 días (rango 12–16)

**Output:**
- Próxima menstruación estimada: **29 de abril de 2026**
- Desde cuándo puede dar positivo un test:
  **Día 25–27 de abril** (10–12 días post ovulación)
- Día óptimo para hacer el test de embarazo:
  **29 de abril de 2026** (primer día de retraso)
- Si la menstruación no llega el 29 de abril:
  "Considera hacer un test de embarazo ese día."

---

### Modo 5 — Registro y seguimiento de ciclos
> La mujer registra sus ciclos mes a mes y la calculadora
> aprende el patrón para hacer predicciones más precisas.

**Inputs (registro histórico):**
- Hasta 12 ciclos anteriores con fecha de inicio
- Duración de cada ciclo (calculada automáticamente)

**Procesamiento:**
- Promedio de ciclos registrados
- Desviación estándar (variabilidad)
- Tendencia (ciclos que se alargan o acortan)

**Output:**
- Ciclo promedio: **29.3 días** (basado en 6 ciclos)
- Variabilidad: **±2 días**
- Predicción próxima ovulación: **17 de abril** (±2 días)
- Predicción próxima menstruación: **1 de mayo** (±2 días)
- Nota: "Con más registros las predicciones mejoran.
  Agrega al menos 3 ciclos para mayor precisión."

> Datos guardados en localStorage del navegador.
> Sin cuenta, sin backend.

---

## Inputs detallados

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|-------------|-------------------|
| Fecha FUM | Date picker | Hasta 45 días atrás | — |
| Duración del ciclo | Numérico + Slider | 21 – 45 días | 28 días |
| Duración menstruación | Numérico | 2 – 10 días | 5 días |
| Ciclo más corto (Modo 3) | Numérico | 21 – 44 días | — |
| Ciclo más largo (Modo 3) | Numérico | 22 – 45 días | — |
| Fecha ovulación detectada | Date picker | Últimos 30 días | — |
| Duración fase lútea | Numérico | 10 – 16 días | 14 días |
| Ciclos a proyectar | Selector | 1 – 6 | 3 |
| Formato de fecha | Selector | DD/MM/AAAA / MM/DD/AAAA | Según locale |

---

## Feature — Calendario visual del ciclo
Representación visual del ciclo menstrual completo
en formato de calendario mensual.

**Código de colores:**
- 🔴 Rojo: días de menstruación
- 🟢 Verde claro: ventana fértil
- ⭐ Estrella: día de ovulación (máxima fertilidad)
- ⚪ Gris: días de baja fertilidad (fase lútea)
- 📅 Borde azul: día de hoy

**Interactividad:**
- Al hacer clic en cualquier día del calendario,
  mostrar tooltip con: fase del ciclo, nivel de fertilidad
  y descripción breve.
- Navegación entre meses si se proyectan varios ciclos.

---

## Feature — Indicador de dónde estás hoy
Si la FUM es reciente, mostrar prominentemente
en qué punto del ciclo está la usuaria hoy:

📍 Hoy (25 de abril) estás en el día 25 de tu ciclo
[============================|=======]
Día 1                 Día 25   Día 28
FUM          Fase lútea ↑      Próx. regla
Estado: Fase lútea · Fertilidad muy baja
Próxima ovulación: en 17 días (12 de mayo)
Próxima menstruación: en 3 días (29 de abril)

---

## Feature — Síntomas de ovulación (guía informativa)
Sección educativa que ayuda a la usuaria a confirmar
la ovulación con señales físicas:

| Señal | Descripción | Momento del ciclo |
|-------|-------------|------------------|
| Moco cervical | Transparente, elástico (tipo clara de huevo) | 2–3 días antes de ovulación |
| Dolor de Mittelschmerz | Leve dolor en un lado del abdomen | Día de ovulación |
| Temperatura basal (BBT) | Sube 0.2–0.5°C después de ovular | Día después de ovulación |
| Test LH (OPK) | Pico de LH 24–36h antes de ovular | 1–2 días antes |
| Sensibilidad en senos | Leve sensibilidad | Tras la ovulación |
| Aumento de libido | Frecuente en días fértiles | Días previos a ovulación |

CTA: "Combinar esta calculadora con test de ovulación
(OPK) mejora significativamente la precisión."

---

## Feature — Probabilidades de concepción por día
Mostrar la probabilidad estimada de concepción
para cada día de la ventana fértil según estudios clínicos:

| Días antes de ovulación | Probabilidad estimada |
|------------------------|----------------------|
| 5 días antes | ~10% |
| 4 días antes | ~14% |
| 3 días antes | ~16% |
| 2 días antes | ~27% |
| 1 día antes | ~31% |
| Día de ovulación | ~33% |
| 1 día después | ~5% |
| 2+ días después | < 1% |

Fuente: Wilcox et al. (New England Journal of Medicine, 1995)
Nota: "Estas probabilidades son por ciclo y para parejas
sin problemas de fertilidad conocidos."

---

## Feature — Cuándo hacer el test de embarazo
Orientación sobre el momento óptimo para realizar
el test, basado en la fecha de ovulación calculada:

🧪 ¿Cuándo hacer el test de embarazo?
Demasiado pronto → resultado poco fiable
Momento óptimo  → primer día de retraso (29 de abril)
Con test sensible → desde el 25 de abril (10 días post-ovulación)
💡 Consejo: Hacer el test con la primera orina de la mañana
aumenta la concentración de hCG y mejora la precisión.

---

## Feature — Compartir ventana fértil
Para parejas que quieren coordinar:

💚 Mi ventana fértil
📅 Días más fértiles: 10 al 16 de abril de 2026
🥚 Día de ovulación: 15 de abril de 2026
📆 Próxima regla estimada: 29 de abril de 2026
Calculado en calculadoras.tools

Botón "Compartir en WhatsApp" con texto preformateado.

---

## Validaciones de inputs

| Regla | Detalle |
|-------|---------|
| FUM no futura | Error: "La fecha de inicio no puede ser futura" |
| FUM hace más de 45 días | Advertencia: "Han pasado más de 45 días. ¿Es correcta la fecha?" |
| Ciclo entre 21 y 45 días | Fuera de rango: error con sugerencia de consultar médico |
| Ciclo corto < ciclo largo (Modo 3) | Error si el ciclo corto es mayor que el largo |
| Duración menstruación > ciclo | Error lógico: la menstruación no puede durar más que el ciclo |
| Fase lútea entre 10 y 16 días | Fuera de rango: advertencia |
| Campos vacíos | Bloquear cálculo y resaltar campo faltante |

---

## Tono y tratamiento responsable del tema

La fertilidad es un tema cargado emocionalmente.
Muchas usuarias pueden llevar meses o años intentando concebir.

✅ **Usar:**
- Lenguaje esperanzador y neutral: "días fértiles", "ventana de concepción"
- Énfasis claro en que es una estimación, no una garantía
- Recordatorios amables de consultar con ginecólogo o especialista
- Reconocer implícitamente que el proceso puede ser largo
- Información clínicamente correcta con fuentes

❌ **Evitar:**
- Promesas de embarazo o lenguaje que genere expectativas irreales
- Frases que impliquen que "si no funciona es tu culpa"
- Lenguaje excesivamente técnico o clínico que genere ansiedad
- Minimizar la complejidad de la fertilidad humana
- Dar consejos médicos específicos sobre infertilidad

**Aviso especial para usuarias con ciclos muy irregulares:**
"Los ciclos muy irregulares pueden dificultar la predicción
de la ovulación. Si llevas más de 12 meses intentando
concebir (o 6 meses si tienes más de 35 años), te
recomendamos consultar con un especialista en fertilidad."

---

## Formato de outputs

| Tipo de resultado | Formato |
|-------------------|---------|
| Día de ovulación | Formato largo → "miércoles, 15 de abril de 2026" |
| Ventana fértil | Rango → "10 al 16 de abril de 2026" |
| Próxima menstruación | Formato largo → "miércoles, 29 de abril de 2026" |
| Probabilidades | Porcentaje entero → "~31%" |
| Ciclos proyectados | Tabla con filas por ciclo |
| Día actual del ciclo | Número entero → "Día 25 de tu ciclo" |

---

## Features adicionales

### Cálculo instantáneo
- El resultado aparece automáticamente al completar
  la fecha y la duración del ciclo, sin botón de calcular.

### Slider de duración del ciclo
- Slider visual de 21 a 45 días.
- Al moverlo, el calendario y todos los outputs
  se actualizan en tiempo real.
- Muestra el día de ovulación cambiando en tiempo real.

### Botón de copiar resultado
- Copia el resumen de la ventana fértil en texto plano.

### Guardar mi ciclo
- Guardar FUM y duración del ciclo en localStorage.
- Al volver al sitio, recordar los datos y recalcular
  automáticamente con la fecha actual.
- Botón: "Guardar mi ciclo en este dispositivo"

### Aviso médico siempre visible
- "Esta calculadora es una herramienta de apoyo basada
  en promedios. Los ciclos menstruales varían naturalmente.
  Para un seguimiento preciso de tu fertilidad consulta
  con tu ginecólogo o matrona."

---

## Calculadoras relacionadas (enlaces contextuales)

| Situación | Enlace sugerido |
|-----------|----------------|
| Embarazo confirmado | → Fecha probable de parto |
| Quiere saber semanas de gestación | → Semanas de gestación |
| Quiere calcular su IMC | → Calculadora de IMC |
| Ciclo muy irregular | → Nota de consultar especialista |
| Quiere calcular TDEE en embarazo | → Calculadora de TDEE |

---

## SEO y contenido de la página

### Meta información
- Title: "Calculadora de Ovulación — Días Fértiles y Ciclo Menstrual"
- Description: "Calcula tu día de ovulación y ventana fértil al instante.
  Conoce tus días más fértiles del mes con el calendario de ciclo
  menstrual. Gratis y sin registro."

### URLs sugeridas
- /calculadora-ovulacion (principal)
- /dias-fertiles-calculadora
- /cuando-ovulo
- /calendario-menstrual
- /ventana-fertil-calculadora

### Preguntas frecuentes (FAQ — para rich snippets)
- ¿Cómo sé cuándo voy a ovular?
- ¿Cuántos días antes de la ovulación puedo quedar embarazada?
- ¿Qué es la ventana fértil?
- ¿Cómo afecta la duración del ciclo al día de ovulación?
- ¿Es posible ovular durante la menstruación?
- ¿Qué síntomas indican que estoy ovulando?
- ¿Cuándo es el mejor momento para hacer un test de embarazo?
- ¿Por qué mi ciclo es irregular?

### Contenido de apoyo
- Explicación de las fases del ciclo menstrual con infografía.
- Guía: "¿Cómo usar los test de ovulación (OPK)?"
- Tabla de día de ovulación según duración del ciclo
  (precalculada para ciclos de 21 a 35 días).
- Artículo: "Mitos y verdades sobre los días fértiles."
- Diferencia entre temperatura basal y test de ovulación.

---

## Especificaciones técnicas

| Parámetro | Detalle |
|-----------|---------|
| Plataforma | Web responsive (mobile-first) |
| Sin backend | Todo el cálculo ocurre en el cliente (JS) |
| Manejo de fechas | date-fns o Temporal API |
| Calendario visual | Generado con JS + CSS Grid nativo |
| Slider duración ciclo | Input range nativo con actualización en tiempo real |
| Guardar ciclo | localStorage del navegador |
| Compartir WhatsApp | API WhatsApp Web |
| Accesibilidad | Labels, roles ARIA en calendario, soporte teclado |
| URL principal | /calculadora-ovulacion |
| Idioma | Español; nombres de días y meses en español |
| Locale | es-MX base; adaptar según país del usuario |

---

## Diferencias clave vs Calculadora de Fecha Probable de Parto

| Aspecto | Calculadora de Ovulación | Fecha probable de parto |
|---------|-------------------------|------------------------|
| Momento de uso | Antes / durante búsqueda de embarazo | Después de confirmar embarazo |
| Objetivo principal | Identificar días fértiles | Saber cuándo nace el bebé |
| Horizonte temporal | Próximos 1–6 ciclos (semanas) | 40 semanas completas |
| Output central | Ventana fértil + ovulación | FPP + semanas de gestación |
| Probabilidades | ✅ Por día de la ventana fértil | ❌ No aplica |
| Calendario visual | ✅ Del ciclo mensual | ❌ De hitos del embarazo |
| Hitos del bebé | ❌ No aplica | ✅ Semana a semana |
| Test de embarazo | ✅ Cuándo hacerlo | ❌ No aplica |
| Tono | Esperanzador / práctico | Celebratorio / informativo |
| Usuario típico | Mujer buscando concebir | Mujer ya embarazada |
| Vinculación natural | → FPP (si hay embarazo) | ← Ovulación (antes) |

---

## Casos extremos a contemplar

- Ciclo de 21 días → ovulación en día 7 (FUM + 7);
  ventana fértil desde día 2, casi solapada con menstruación;
  mostrar nota explicativa de ciclo corto
- Ciclo de 45 días → ovulación en día 31; ventana fértil
  muy tardía; mostrar nota sobre ciclo largo
- FUM hace más de 35 días con ciclo de 28 → ya debería
  haber llegado la menstruación; advertencia amable:
  "Si tu ciclo es regular y aún no ha llegado tu regla,
  podría ser momento de hacer un test de embarazo."
- Ciclo corto = ciclo largo en Modo 3 → tratar como
  ciclo regular con ese valor exacto
- Proyectar 6 ciclos con ciclo de 45 días → el calendario
  abarca más de 8 meses; paginar correctamente
- Fase lútea de 10 días (defecto de fase lútea) → calcular
  correctamente y añadir nota discreta sobre consultar médico
- Guardar ciclo en localStorage y volver después de 2 meses →
  detectar que la FUM guardada es antigua, sugerir actualizar
  con la FUM más reciente
- Usuaria ingresa duración menstruación mayor que ventana
  fértil calculada → advertencia visual pero sin bloquear
- Cambio de idioma / locale → adaptar nombres de días
  y meses sin recalcular los valores