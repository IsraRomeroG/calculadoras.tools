# Especificación — Calculadora de Déficit Calórico para Bajar de Peso

## Descripción general
Herramienta para calcular el déficit calórico necesario para
alcanzar un peso objetivo en un plazo determinado. Es la
calculadora más orientada a la acción de todo el ecosistema
de salud del sitio: el usuario no solo quiere saber números,
quiere un plan concreto para perder peso.

Es el cierre natural del flujo IMC → TDEE → Macros → Déficit.
Debe recibir usuarios desde las tres calculadoras anteriores
y devolverles un plan claro, realista y motivador.

Especial atención al tratamiento responsable del tema:
la pérdida de peso es un área sensible que puede afectar
la salud mental y física del usuario. El tono y los avisos
deben ser empáticos, no alarmistas, y siempre orientados
al bienestar a largo plazo.

---

## Conceptos base

### El déficit calórico
Un déficit calórico ocurre cuando se consumen menos calorías
de las que el cuerpo gasta (TDEE). El cuerpo compensa usando
las reservas de grasa almacenada como fuente de energía.

### Equivalencia calórica de la grasa corporal
- 1 kg de grasa ≈ 7,700 kcal
- 1 lb de grasa ≈ 3,500 kcal

### Ritmos de pérdida recomendados

| Ritmo | Déficit diario | Pérdida semanal | Recomendación |
|-------|---------------|-----------------|---------------|
| Muy suave | 250 kcal/día | ~0.25 kg/semana | Sostenible a largo plazo |
| Suave | 350 kcal/día | ~0.35 kg/semana | Ideal para la mayoría |
| Moderado | 500 kcal/día | ~0.5 kg/semana | Estándar clínico |
| Agresivo | 750 kcal/día | ~0.75 kg/semana | Solo con supervisión |
| Muy agresivo | 1,000 kcal/día | ~1 kg/semana | Límite seguro general |

> Déficits superiores a 1,000 kcal/día no se recomiendan
> sin supervisión médica o nutricional.

---

## Casos de uso (modos de cálculo)

### Modo 1 — Dame un plan para llegar a mi peso objetivo
> El usuario fija el peso objetivo y la calculadora
> sugiere el déficit y el plazo.

**Inputs:**
- Peso actual → ej. 80 kg
- Peso objetivo → ej. 68 kg
- Altura → ej. 1.72 m
- Edad → ej. 34 años
- Sexo → Hombre / Mujer
- Nivel de actividad → selector
- Ritmo de pérdida → selector (suave / moderado / agresivo)

**Cálculo:**
TDEE calculado = 2,450 kcal (Mifflin + actividad moderada)
Déficit elegido = 500 kcal/día (moderado)
Calorías diarias objetivo = 2,450 − 500 = 1,950 kcal
Total a perder = 12 kg → 12 × 7,700 = 92,400 kcal
Semanas necesarias = 92,400 / (500 × 7) = 26.4 semanas

**Output principal:**
- Tu TDEE: **2,450 kcal/día**
- Calorías diarias para bajar de peso: **1,950 kcal/día**
- Déficit diario: **−500 kcal**
- Pérdida semanal estimada: **~0.5 kg/semana**
- Tiempo estimado para llegar a 68 kg: **26 semanas (6.5 meses)**
- Fecha estimada de llegada: **noviembre 2026** 🎯

**Output secundario — hitos del camino:**

| Hito | Pérdida | Fecha estimada |
|------|---------|----------------|
| Primeros 3 kg | −3 kg (77 kg) | Junio 2026 |
| Mitad del camino | −6 kg (74 kg) | Agosto 2026 |
| Meta alcanzada | −12 kg (68 kg) | Noviembre 2026 |

---

### Modo 2 — Tengo X calorías al día, ¿cuándo llego a mi meta?
> El usuario ya sabe cuántas calorías quiere consumir
> y quiere saber cuándo llegará a su objetivo.

**Inputs:**
- Calorías diarias que planea consumir → ej. 1,800 kcal
- TDEE actual → ej. 2,450 kcal (calculado o ingresado)
- Peso actual → ej. 80 kg
- Peso objetivo → ej. 68 kg

**Cálculo:**
Déficit diario = 2,450 − 1,800 = 650 kcal/día
Déficit semanal = 650 × 7 = 4,550 kcal
Total a perder = 12 kg × 7,700 = 92,400 kcal
Semanas = 92,400 / 4,550 = 20.3 semanas

**Output:**
- Déficit diario: **−650 kcal**
- Pérdida semanal estimada: **~0.59 kg/semana**
- Tiempo estimado: **20 semanas (5 meses)**
- Fecha estimada de llegada: **octubre 2026** 🎯
- Advertencia si calorías < mínimo saludable (ver validaciones)

---

### Modo 3 — Quiero llegar a mi meta en X semanas
> El usuario fija el plazo y la calculadora determina
> el déficit y las calorías necesarias.

**Inputs:**
- Peso actual → ej. 80 kg
- Peso objetivo → ej. 68 kg
- Plazo deseado → ej. 16 semanas
- TDEE → calculado automáticamente o ingresado

**Cálculo:**
Total a perder = 12 kg × 7,700 = 92,400 kcal
Déficit diario necesario = 92,400 / (16 × 7) = 825 kcal/día
Calorías objetivo = 2,450 − 825 = 1,625 kcal/día

**Output:**
- Déficit diario necesario: **−825 kcal**
- Calorías diarias: **1,625 kcal**
- Pérdida semanal necesaria: **~0.75 kg/semana**
- Evaluación del ritmo: 🟠 **Agresivo — alcanzable pero exigente**
- Recomendación: "Este ritmo requiere disciplina y es recomendable
  hacerlo con seguimiento nutricional."
- Advertencia si el plazo exige déficit > 1,000 kcal:
  "Para llegar a tu meta en ese plazo necesitarías un déficit
  de X kcal/día, lo cual no es recomendable sin supervisión médica.
  Te sugerimos extender el plazo a mínimo Y semanas."

---

### Modo 4 — Comparador de ritmos
> Muestra simultáneamente cómo cambia el resultado
> según el ritmo de pérdida elegido.

**Inputs:**
- Peso actual → ej. 80 kg
- Peso objetivo → ej. 68 kg
- TDEE → ej. 2,450 kcal

**Output — tabla comparativa:**

| Ritmo | Déficit | Calorías/día | Pérdida/semana | Duración | Fecha llegada |
|-------|---------|-------------|----------------|----------|---------------|
| Muy suave | −250 kcal | 2,200 kcal | 0.23 kg | 52 sem (1 año) | Abril 2027 |
| Suave | −350 kcal | 2,100 kcal | 0.32 kg | 37 sem (9 meses) | Ene 2027 |
| Moderado ⭐ | −500 kcal | 1,950 kcal | 0.45 kg | 26 sem (6.5 m) | Nov 2026 |
| Agresivo | −750 kcal | 1,700 kcal | 0.68 kg | 18 sem (4.5 m) | Sep 2026 |
| Límite | −1,000 kcal | 1,450 kcal | 0.90 kg | 13 sem (3 m) | Jul 2026 |

- Marcar con ⭐ el ritmo recomendado.
- Filas de ritmos muy agresivos en color naranja/rojo con nota.
- El usuario puede hacer clic en cualquier fila para
  seleccionar ese ritmo y ver el plan detallado.

---

### Modo 5 — Con ejercicio incluido
> El usuario combina déficit calórico con ejercicio
> para alcanzar su meta más rápido o con menos restricción alimentaria.

**Inputs:**
- Todos los del Modo 1
- Tipo de ejercicio → selector
- Frecuencia semanal → ej. 4 días/semana
- Duración por sesión → ej. 45 minutos

**Calorías quemadas por ejercicio (estimadas):**

| Ejercicio | kcal quemadas/hora (70 kg aprox.) |
|-----------|----------------------------------|
| Caminar (5 km/h) | ~280 kcal |
| Trote (8 km/h) | ~560 kcal |
| Correr (12 km/h) | ~840 kcal |
| Ciclismo moderado | ~490 kcal |
| Natación | ~560 kcal |
| Pesas / musculación | ~350 kcal |
| HIIT | ~630 kcal |
| Yoga / pilates | ~210 kcal |

**Cálculo:**
Calorías quemadas por ejercicio/semana = 560 × 0.75 h × 4 = 1,680 kcal
Déficit semanal total = (500 × 7) + 1,680 = 5,180 kcal
Pérdida semanal estimada = 5,180 / 7,700 = **0.67 kg/semana**

**Output adicional:**
- Déficit solo con dieta: −500 kcal/día
- Déficit extra por ejercicio: −240 kcal/día (promedio)
- Déficit total combinado: −740 kcal/día
- Nueva pérdida semanal: **~0.67 kg/semana**
- Nuevo plazo para llegar a la meta: **18 semanas** (antes 26)
- Tiempo ahorrado por el ejercicio: **8 semanas** 🏃

---

## Inputs detallados

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|-------------|-------------------|
| Peso actual | Numérico | 30 – 300 kg | — |
| Peso objetivo | Numérico | 30 – 299 kg | — |
| Altura | Numérico | 100 – 250 cm | — |
| Edad | Numérico | 15 – 100 años | — |
| Sexo | Selector | Hombre / Mujer | — |
| Nivel de actividad | Selector | 5 niveles | Sedentario |
| Ritmo de pérdida | Selector / Slider | Muy suave – Límite | Moderado |
| Calorías diarias (Modo 2) | Numérico | 800 – 5,000 kcal | — |
| Plazo en semanas (Modo 3) | Numérico | 4 – 156 semanas | — |
| TDEE manual | Numérico (opcional) | 800 – 6,000 kcal | Calculado auto |
| Ejercicio tipo | Selector | Ver lista | — |
| Ejercicio frecuencia | Selector | 1–7 días/semana | — |
| Ejercicio duración | Numérico | 15 – 180 min | — |
| Sistema de unidades | Toggle | Métrico / Imperial | Métrico |

---

## Feature — Recalcular TDEE en el camino
A medida que el usuario pierde peso, su TDEE disminuye.
La calculadora muestra cuándo será necesario recalibrar:

**Output adicional:**
- TDEE actual (80 kg): **2,450 kcal**
- TDEE en la meta (68 kg): **~2,180 kcal** (estimado)
- Recomendación: "Cuando hayas perdido entre 4 y 5 kg,
  recalcula tu TDEE para mantener el ritmo de pérdida."
- Enlace: "Recalcular TDEE → Calculadora de TDEE"

---

## Feature — Gráfica de progreso proyectado
Línea de tiempo visual que muestra el peso proyectado semana a semana.

**Series:**
- Línea principal: progreso esperado (línea recta descendente)
- Banda de variación: rango realista (±0.5 kg por semana)
  para mostrar que el progreso real no es perfectamente lineal
- Marcadores: hitos (−3 kg, −6 kg, meta)
- Punto actual: "Estás aquí" destacado

**Ejes:**
- X: semanas o fechas
- Y: peso (kg o lb)

**Interactividad:**
- Tooltip al hover: semana, peso proyectado y fecha estimada
- Slider: "¿Qué pasa si como X calorías menos / más?"
  actualiza la gráfica en tiempo real

---

## Feature — Racha y motivación
Elementos de motivación sin caer en lenguaje dañino:

- "En 4 semanas podrías sentir más energía al subir escaleras"
- "En 8 semanas tu ropa comenzará a quedar diferente"
- "En 6 meses habrás construido un hábito que dura toda la vida"

> Usar lenguaje orientado a salud y bienestar, nunca
> a estética o comparaciones corporales.

---

## Feature — Plan semanal simplificado
Resumen accionable para empezar hoy:

**Tu plan esta semana:**
- 🍽️ Come: **1,950 kcal/día**
- 💪 Muévete: al menos 30 min de actividad moderada
- 💧 Hidratación: 2–2.5 litros de agua al día
- ⚖️ Pésate: una vez por semana, misma hora y condiciones
- 🔄 Revisa: recalcula en 4–5 kg de progreso

---

## Validaciones de inputs

| Regla | Detalle |
|-------|---------|
| Peso objetivo < peso actual | Error: "El peso objetivo debe ser menor al actual" |
| Peso objetivo > peso actual | Redirigir a calculadora de TDEE con superávit |
| Calorías < 1,200 (mujer) | Advertencia de salud prominente |
| Calorías < 1,500 (hombre) | Advertencia de salud prominente |
| Calorías < 800 | Bloquear cálculo: "Por tu seguridad no podemos calcular planes por debajo de 800 kcal/día" |
| Déficit > 1,000 kcal | Advertencia y sugerencia de plazo alternativo |
| Plazo < 4 semanas | Advertencia: "Un plazo tan corto puede ser poco realista" |
| Diferencia de peso > 50 kg | Recomendar encarecidamente supervisión médica |
| Edad < 15 | Redirigir: "Para menores de edad consulta con un pediatra" |
| Campos vacíos | Bloquear cálculo y resaltar campo faltante |

---

## Tono y tratamiento responsable del tema

Esta calculadora trata un tema sensible que puede afectar
la salud mental. Aplicar siempre estas pautas de tono:

✅ **Usar:**
- Lenguaje orientado a salud: "bienestar", "energía", "hábitos"
- Metas realistas con plazos honestos
- Recordatorios de que el progreso no es lineal
- Énfasis en la sostenibilidad a largo plazo
- Avisos de consultar profesionales sin alarmar

❌ **Evitar:**
- Lenguaje estético o de apariencia ("quedar bien", "lucir mejor")
- Comparaciones con otras personas o estándares irreales
- Urgencia o presión ("pierde peso rápido", "en solo X días")
- Minimizar los tiempos reales de pérdida de peso saludable
- Validar o sugerir restricciones calóricas extremas

---

## Formato de outputs

| Tipo de resultado | Formato |
|-------------------|---------|
| Calorías | Número entero → 1,950 kcal |
| Déficit diario | Con signo → −500 kcal |
| Peso | 1 decimal → 68.0 kg / 149.9 lb |
| Tiempo | Semanas y meses → "26 semanas (6.5 meses)" |
| Fecha estimada | Mes y año → "noviembre 2026" |
| Pérdida semanal | 2 decimales → ~0.45 kg/semana |
| Ritmo | Etiqueta + color → 🟢 Suave / 🟡 Moderado / 🟠 Agresivo |

---

## Features adicionales

### Cálculo en tiempo real
- Todos los outputs y la gráfica se actualizan
  automáticamente con cada cambio de input.

### Toggle métrico / imperial
- Cambio instantáneo entre kg/cm y lb/ft-in.
- Convierte los valores ya ingresados automáticamente.

### Botón de copiar plan
- Copia el resumen del plan en texto plano:
  "Meta: 68 kg | Calorías: 1,950/día |
   Déficit: −500 kcal | Plazo: 26 semanas"

### Botón de limpiar / reset
- Limpia todos los campos con un clic.

### Compartir por WhatsApp
- Texto preformateado con el resumen del plan.
- Útil para compartir con un acompañante o nutricionista.

### Historial de simulaciones
- Últimas 5 configuraciones calculadas en la sesión.

### Aviso de salud
- Visible siempre debajo de los resultados:
  "Esta calculadora proporciona estimaciones orientativas
  basadas en promedios poblacionales. Los resultados reales
  varían según genética, metabolismo y otros factores.
  Consulta con un profesional de la salud antes de iniciar
  cualquier plan de pérdida de peso."

---

## Calculadoras relacionadas (enlaces contextuales)

| Situación | Enlace sugerido |
|-----------|----------------|
| No conoce su TDEE | → Calculadora de TDEE |
| Quiere distribuir sus macros | → Calculadora de macros |
| Quiere saber su IMC actual | → Calculadora de IMC |
| Quiere saber calorías quemadas | → Calorías quemadas por ejercicio |
| Ha llegado a su meta | → Calculadora de TDEE (mantenimiento) |
| Quiere ganar músculo después | → Calculadora de macros (superávit) |

---

## SEO y contenido de la página

### Meta información
- Title: "Calculadora de Déficit Calórico — ¿Cuánto Debo Comer para Bajar de Peso?"
- Description: "Calcula tu déficit calórico para perder peso de forma
  saludable. Obtén tus calorías diarias, el tiempo estimado para
  llegar a tu meta y un plan semanal accionable. Gratis."

### URLs sugeridas
- /calculadora-deficit-calorico (principal)
- /cuantas-calorias-comer-para-bajar-de-peso
- /calculadora-para-bajar-de-peso
- /calculadora-calorias-para-adelgazar

### Preguntas frecuentes (FAQ — para rich snippets)
- ¿Qué es el déficit calórico y cómo funciona?
- ¿Cuántas calorías debo comer para bajar de peso?
- ¿Cuánto tiempo se tarda en perder 10 kg?
- ¿Es seguro un déficit de 500 calorías al día?
- ¿Cuántas calorías tiene un kilo de grasa?
- ¿Por qué dejo de perder peso si como poco?
- ¿Qué pasa si como muy pocas calorías?

### Contenido de apoyo
- Explicación del concepto de déficit calórico con analogía
  sencilla (el tanque de gasolina del cuerpo).
- Tabla de tiempo estimado para perder 5, 10, 15 y 20 kg
  según distintos ritmos (precomputada).
- Artículo: "Por qué el peso no baja en línea recta"
  (retención de agua, variación diaria, mesetas).
- Guía: "5 señales de que tu déficit calórico es demasiado agresivo."

---

## Especificaciones técnicas

| Parámetro | Detalle |
|-----------|---------|
| Plataforma | Web responsive (mobile-first) |
| Sin backend | Todo el cálculo ocurre en el cliente (JS) |
| Gráfica de progreso | Chart.js (línea con banda de variación) |
| Fechas | Basadas en Date() del navegador; locale es-MX |
| Toggle métrico/imperial | Conversión automática sin pérdida de datos |
| Compartir WhatsApp | API WhatsApp Web con texto preformateado |
| Accesibilidad | Labels en todos los inputs, soporte teclado |
| URL principal | /calculadora-deficit-calorico |
| Idioma | Español (locale configurable) |
| Precisión | Calorías a entero; peso a 1 decimal; semanas a 1 decimal |

---

## Diferencias clave vs otras calculadoras de salud del sitio

| Aspecto | Déficit calórico | TDEE | Macros | IMC |
|---------|-----------------|------|--------|-----|
| Pregunta que responde | ¿Cuándo llego a mi meta? | ¿Cuánto gasto? | ¿Cómo distribuyo? | ¿Cuál es mi estado? |
| Output clave | Calorías + plazo + fecha | TDEE en kcal | Gramos por macro | Índice + categoría |
| Orientado a la acción | ✅ Máximo | 🔶 Medio | ✅ Alto | 🔶 Medio |
| Requiere TDEE | Sí (calcula o importa) | No (lo genera) | Sí | No |
| Gráfica temporal | ✅ Sí (progreso) | ❌ No | ❌ No | ✅ Seguimiento |
| Plazo estimado | ✅ Sí | ❌ No | ❌ No | ❌ No |
| Vinculación natural | ← TDEE ← Macros | → Macros → Déficit | ← TDEE → Déficit | → TDEE |

---

## Casos extremos a contemplar

- Peso objetivo = peso actual → error:
  "Tu peso objetivo es igual a tu peso actual.
   Si quieres mantener tu peso, usa la calculadora de TDEE."
- Peso objetivo > peso actual → detectar y ofrecer
  redirigir a calculadora de TDEE con superávit calórico
- Meta de pérdida > 50 kg → calcular con normalidad
  pero mostrar aviso prominente de supervisión médica
- Plazo elegido exige déficit imposible (> 1,500 kcal) →
  bloquear y sugerir plazo mínimo viable
- TDEE muy bajo (< 1,400 kcal) con déficit moderado →
  calorías resultantes por debajo del mínimo; advertir
- Pérdida de peso muy lenta (< 0.1 kg/semana) →
  nota: "A este ritmo el progreso será muy gradual,
  lo cual es completamente válido y sostenible"
- Usuario cambia ritmo de agresivo a suave →
  gráfica se actualiza suavemente mostrando el nuevo plazo
- Fechas que caen en el pasado (plazo = 0) →
  validar que el plazo mínimo sea de al menos 1 semana