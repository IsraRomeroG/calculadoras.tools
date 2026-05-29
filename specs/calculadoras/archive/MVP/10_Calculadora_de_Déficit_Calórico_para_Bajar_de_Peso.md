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

## Plan de implementación por fases

La calculadora debe desarrollarse en cuatro fases incrementales. Cada
fase debe quedar publicable, con lógica testeada y sin depender de
features de fases posteriores para funcionar.

| Fase | Nombre | Objetivo | Entregables principales |
|------|--------|----------|-------------------------|
| Fase 1 | MVP sólido | Validar que la calculadora "piense bien" y entregue un plan seguro | Lógica pura, tests unitarios, Modo 1, TDEE calculado/manual, validaciones críticas, comparador básico, resultado con rango y avisos |
| Fase 2 | Modos avanzados | Permitir simulaciones por calorías, plazo e hitos | Modo 2, Modo 3, TDEE proyectado por tramos, hitos del camino, copiar plan, reset |
| Fase 3 | Visualización y experiencia | Mejorar comprensión, accesibilidad y exploración | Gráfica de progreso, tabla accesible, slider de escenarios, estados responsive y accesibilidad refinada |
| Fase 4 | Ejercicio, historial y compartir | Completar funcionalidades periféricas sin comprometer privacidad | Modo 5, prevención de doble conteo de ejercicio, historial local, compartir WhatsApp, contenido SEO/FAQ final |

### Criterios de avance

- No iniciar una fase nueva si la lógica de cálculo de la fase anterior
  no tiene pruebas unitarias.
- Las validaciones de seguridad de Fase 1 aplican a todas las fases.
- Las features de Fase 3 y Fase 4 no deben modificar reglas numéricas
  centrales sin actualizar tests.
- El contenido SEO puede redactarse desde Fase 1, pero se considera
  completo en Fase 4.

---

## Conceptos base

### El déficit calórico
Un déficit calórico ocurre cuando se consumen menos calorías
de las que el cuerpo gasta (TDEE). El cuerpo compensa usando
las reservas de grasa almacenada como fuente de energía.

### Equivalencia calórica de la grasa corporal
- 1 kg de grasa ≈ 7,700 kcal
- 1 lb de grasa ≈ 3,500 kcal

Esta equivalencia debe usarse como aproximación educativa, no como
predicción exacta. El peso real cambia también por agua, glucógeno,
contenido digestivo, masa muscular, sueño, estrés, medicamentos,
condiciones médicas y adaptación metabólica.

### Modelo de estimación

La calculadora debe mostrar el resultado como una estimación inicial
con rango, no como promesa exacta.

- Modelo MVP: `kg_a_perder * 7,700 / déficit_diario`.
- Fase 1: usar el modelo MVP y mostrar un rango prudente para evitar
  falsa precisión.
- Fase 2: recalcular TDEE proyectado por tramos de peso
  para reflejar que el gasto diario baja durante la pérdida.
- Mostrar una fecha estimada en rango: "noviembre - diciembre 2026".
- Mantener visible la frase: "Ajusta después de 2 a 3 semanas según
  tu evolución real".
- Redondear solo para mostrar; los cálculos internos deben conservar
  decimales.

### Ritmos de pérdida recomendados

La clasificación debe considerar tanto el déficit absoluto como el
porcentaje del peso corporal por semana. Esto evita recomendar el
mismo déficit a una persona pequeña y a una persona con un peso mucho
mayor.

| Ritmo | Pérdida semanal relativa | Déficit diario orientativo | Recomendación |
|-------|--------------------------|----------------------------|---------------|
| Muy suave | 0.25% del peso/semana | ~250 kcal/día | Sostenible a largo plazo |
| Suave | 0.25% - 0.5% del peso/semana | ~250 - 350 kcal/día | Ideal para la mayoría |
| Moderado | 0.5% - 0.75% del peso/semana | ~350 - 500 kcal/día | Recomendado por defecto |
| Agresivo | 0.75% - 1% del peso/semana | ~500 - 750 kcal/día | Exigente; sugerir seguimiento |
| Muy agresivo | >1% del peso/semana | ~750 - 1,000 kcal/día | No recomendar como opción por defecto |

> Déficits superiores a 1,000 kcal/día no se recomiendan
> sin supervisión médica o nutricional.

> Pérdidas superiores a 1% del peso corporal por semana deben mostrarse
> como agresivas incluso cuando el déficit absoluto sea menor a 1,000 kcal/día.

---

## Casos de uso (modos de cálculo)

### Modo 1 — Dame un plan para llegar a mi peso objetivo (Fase 1)
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
Semanas base = 92,400 / (500 × 7) = 26.4 semanas
Semanas ajustadas por TDEE proyectado = ~27 - 29 semanas (Fase 2)

**Output principal:**
- Tu TDEE: **2,450 kcal/día**
- Calorías diarias para bajar de peso: **1,950 kcal/día**
- Déficit diario: **−500 kcal**
- Pérdida semanal estimada inicial: **~0.45 kg/semana**
- Ritmo relativo: **~0.57% de tu peso por semana**
- Tiempo estimado para llegar a 68 kg: **27 - 29 semanas (6.5 - 7 meses)**
- Fecha estimada de llegada: **noviembre - diciembre 2026** 🎯
- Revisión recomendada: **recalcula al perder 4 - 5 kg o tras 2 - 3 semanas**

**Output secundario — hitos del camino:**

Los hitos completos pertenecen a Fase 2. En Fase 1 puede mostrarse solo
el tiempo estimado y la fecha/rango de llegada.

| Hito | Pérdida | Fecha estimada |
|------|---------|----------------|
| Primeros 3 kg | −3 kg (77 kg) | Julio 2026 |
| Mitad del camino | −6 kg (74 kg) | Agosto - septiembre 2026 |
| Meta alcanzada | −12 kg (68 kg) | Noviembre - diciembre 2026 |

**Output secundario — alternativas:**

En Fase 1 mostrar un comparador básico con tres rutas. En Fase 2, usar
el cálculo ajustado por tramos y añadir fechas/rangos por ruta.

| Ruta | Calorías/día | Ritmo | Duración estimada |
|------|--------------|-------|-------------------|
| Conservadora | 2,100 kcal | Suave | ~38 semanas |
| Recomendada | 1,950 kcal | Moderada | ~27 - 29 semanas |
| Rápida | 1,700 kcal | Agresiva | ~18 - 20 semanas |

La ruta rápida debe incluir nota de seguimiento nutricional y no debe
aparecer como recomendación principal.

---

### Modo 2 — Tengo X calorías al día, ¿cuándo llego a mi meta? (Fase 2)
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
- Ritmo relativo: **~0.74% de tu peso por semana**
- Tiempo estimado: **20 - 22 semanas (5 meses)**
- Fecha estimada de llegada: **octubre - noviembre 2026** 🎯
- Evaluación del ritmo: **Moderado alto**
- Advertencia si calorías < mínimo saludable (ver validaciones)
- Advertencia si `calorías_diarias >= TDEE`: "Con estas calorías no
  hay déficit estimado; revisa tu TDEE o elige una meta de mantenimiento."

---

### Modo 3 — Quiero llegar a mi meta en X semanas (Fase 2)
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
- Ritmo relativo: **~0.94% de tu peso por semana**
- Evaluación del ritmo: 🟠 **Agresivo — alcanzable pero exigente**
- Recomendación: "Este ritmo requiere disciplina y es recomendable
  hacerlo con seguimiento nutricional."
- Advertencia si el plazo exige déficit > 1,000 kcal:
  "Para llegar a tu meta en ese plazo necesitarías un déficit
  de X kcal/día, lo cual no es recomendable sin supervisión médica.
  Te sugerimos extender el plazo a mínimo Y semanas."
- Bloquear si el plazo exige un déficit imposible (> 1,500 kcal/día),
  una pérdida > 1.5% del peso/semana o calorías por debajo del mínimo
  de seguridad.

---

### Modo 4 — Comparador de ritmos (Fase 1 básico, Fase 2 completo)
> Muestra simultáneamente cómo cambia el resultado
> según el ritmo de pérdida elegido.

**Inputs:**
- Peso actual → ej. 80 kg
- Peso objetivo → ej. 68 kg
- TDEE → ej. 2,450 kcal

**Output — tabla comparativa:**

| Ritmo | Déficit | Calorías/día | Pérdida/semana | % peso/semana | Duración | Fecha llegada |
|-------|---------|-------------|----------------|---------------|----------|---------------|
| Muy suave | −250 kcal | 2,200 kcal | 0.23 kg | 0.29% | 53 sem (1 año) | Junio 2027 |
| Suave | −350 kcal | 2,100 kcal | 0.32 kg | 0.40% | 38 sem (9 meses) | Feb 2027 |
| Moderado ⭐ | −500 kcal | 1,950 kcal | 0.45 kg | 0.57% | 27 - 29 sem | Nov - dic 2026 |
| Agresivo | −750 kcal | 1,700 kcal | 0.68 kg | 0.85% | 18 - 20 sem | Sep - oct 2026 |
| Límite / supervisión | −1,000 kcal | 1,450 kcal | 0.91 kg | 1.14% | 14 - 16 sem | Ago - sep 2026 |

- Marcar con ⭐ el ritmo recomendado.
- Filas de ritmos muy agresivos en color naranja/rojo con nota.
- No depender solo del color: incluir etiqueta textual `Suave`,
  `Moderado`, `Agresivo` o `Solo con supervisión`.
- El usuario puede hacer clic en cualquier fila para
  seleccionar ese ritmo y ver el plan detallado.

---

### Modo 5 — Con ejercicio incluido (Fase 4)
> El usuario combina déficit calórico con ejercicio
> para alcanzar su meta más rápido o con menos restricción alimentaria.

Importante: evitar doble conteo de actividad. Si el TDEE ya fue
calculado con un nivel de actividad que incluye esos entrenamientos,
no se deben sumar de nuevo las mismas calorías de ejercicio.

**Inputs:**
- Todos los del Modo 1
- Base de TDEE para ejercicio:
  - `TDEE sedentario + ejercicio explícito` (recomendado para este modo)
  - `TDEE con actividad ya incluida + solo ejercicio extra`
- Tipo de ejercicio → selector
- Frecuencia semanal → ej. 4 días/semana
- Duración por sesión → ej. 45 minutos
- Intensidad → suave / moderada / vigorosa cuando aplique

**Calorías quemadas por ejercicio (estimadas):**

| Ejercicio | kcal/h para 70 kg aprox. | Nota |
|-----------|---------------------------|------|
| Caminar rápido (5 - 5.6 km/h) | ~280 kcal | Moderado |
| Trote (8 km/h) | ~590 kcal | Vigoroso |
| Correr (12 km/h) | ~800 - 850 kcal | Vigoroso |
| Ciclismo moderado | ~290 - 490 kcal | Depende de velocidad |
| Natación | ~510 - 560 kcal | Depende de estilo |
| Pesas / musculación | ~220 - 440 kcal | Depende de esfuerzo |
| HIIT | ~500 - 700 kcal | Alta variabilidad |
| Yoga / pilates | ~180 - 250 kcal | Suave a moderado |

**Ajuste por peso corporal:**

```text
kcal_sesion = kcal_hora_70kg * (peso_actual_kg / 70) * horas * factor_intensidad
```

El `factor_intensidad` debe ser 0.8 suave, 1.0 moderada, 1.15 vigorosa,
salvo que el ejercicio ya tenga una intensidad implícita.

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
- Nota: "Las calorías del ejercicio son aproximadas. Si ya elegiste
  un nivel de actividad alto para tu TDEE, suma solo ejercicio adicional."

---

## Inputs detallados

La UI puede mostrar solo los inputs de la fase implementada. Las
validaciones críticas de edad, peso objetivo, IMC objetivo y calorías
mínimas deben existir desde Fase 1.

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|-------------|-------------------|
| Peso actual | Numérico | 30 – 300 kg | — |
| Peso objetivo | Numérico | 30 – 299 kg | — |
| Altura | Numérico | 100 – 250 cm | — |
| Edad | Numérico | 18 – 100 años | — |
| Sexo | Selector | Hombre / Mujer | — |
| Nivel de actividad | Selector | 5 niveles | Sedentario |
| Ritmo de pérdida | Selector / Slider | Muy suave – Límite | Moderado |
| Calorías diarias (Modo 2) | Numérico | 800 – 5,000 kcal | — |
| Plazo en semanas (Modo 3) | Numérico | 4 – 156 semanas | — |
| TDEE manual | Numérico (opcional) | 800 – 6,000 kcal | Calculado auto |
| Base de TDEE con ejercicio | Selector | Sedentario + ejercicio / actividad incluida | Sedentario + ejercicio |
| Ejercicio tipo | Selector | Ver lista | — |
| Ejercicio frecuencia | Selector | 1–7 días/semana | — |
| Ejercicio duración | Numérico | 15 – 180 min | — |
| Ejercicio intensidad | Selector | Suave / moderada / vigorosa | Moderada |
| Sistema de unidades | Toggle | Métrico / Imperial | Métrico |

**Alcance por fase:**

- Fase 1: peso actual, peso objetivo, altura, edad, sexo, actividad,
  ritmo de pérdida, TDEE manual opcional y sistema métrico.
- Fase 2: calorías diarias, plazo en semanas, copiar plan y reset.
- Fase 3: inputs interactivos de escenario para gráfica/slider.
- Fase 4: ejercicio tipo, frecuencia, duración, intensidad, base de TDEE,
  historial y compartir.

Notas:

- Calcular IMC actual e IMC objetivo de forma interna para detectar
  metas de bajo peso.
- No pedir diagnósticos ni historial médico como input obligatorio.
  Las condiciones sensibles se cubren con avisos generales y rutas
  de consulta profesional.

---

## Feature — Recalcular TDEE en el camino (Fase 2)
A medida que el usuario pierde peso, su TDEE disminuye.
La calculadora muestra cuándo será necesario recalibrar:

**Output adicional:**
- TDEE actual (80 kg): **2,450 kcal**
- TDEE en la meta (68 kg): **~2,180 kcal** (estimado)
- Recomendación: "Cuando hayas perdido entre 4 y 5 kg,
  recalcula tu TDEE para mantener el ritmo de pérdida."
- Enlace: "Recalcular TDEE → Calculadora de TDEE"

**Implementación recomendada:**

- Calcular TDEE actual con el peso inicial.
- Calcular TDEE estimado en el peso objetivo.
- Para pérdidas mayores a 5 kg, crear tramos cada 4 - 5 kg y estimar
  el déficit real en cada tramo.
- Si el déficit cae por debajo del ritmo elegido, mostrar:
  "Tu déficit se irá reduciendo conforme baje tu peso. Recalcular ayuda
  a mantener una meta realista."
- No ocultar el cálculo simple; mostrarlo como referencia base y el
  cálculo ajustado como estimación recomendada.

---

## Feature — Gráfica de progreso proyectado (Fase 3)
Línea de tiempo visual que muestra el peso proyectado semana a semana.

**Series:**
- Línea principal: progreso esperado ajustado por tramos de TDEE
- Línea secundaria opcional: estimación simple con déficit constante
- Banda de variación: rango realista (±0.3 - 0.7 kg por semana,
  según el ritmo)
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
- Tabla accesible debajo de la gráfica con semana, peso proyectado y
  fecha, para usuarios de lector de pantalla o cuando la gráfica no cargue.
- No usar solo color para comunicar riesgo; combinar color, etiqueta
  textual e icono.

---

## Feature — Racha y motivación (Fase 1 básico, Fase 3 refinado)
Elementos de motivación sin caer en lenguaje dañino:

- "En 4 semanas podrías sentir más energía al subir escaleras"
- "En 8 semanas podrías notar más constancia en tus hábitos"
- "En 6 meses habrás construido un hábito que dura toda la vida"
- "Una semana imperfecta no arruina tu progreso; vuelve al plan en la
  siguiente comida."

> Usar lenguaje orientado a salud y bienestar, nunca
> a estética o comparaciones corporales.

---

## Feature — Plan semanal simplificado (Fase 1)
Resumen accionable para empezar hoy:

**Tu plan esta semana:**
- 🍽️ Come: **1,950 kcal/día**
- 💪 Muévete: al menos 30 min de actividad moderada
- 💧 Hidratación: toma agua de forma regular y ajusta según sed,
  calor y actividad
- ⚖️ Pésate: una vez por semana, misma hora y condiciones
- 🔄 Revisa: recalcula en 4–5 kg de progreso
- 😴 Cuida: sueño y estrés, porque pueden afectar hambre, energía y peso

---

## Validaciones de inputs

| Regla | Detalle |
|-------|---------|
| Peso objetivo < peso actual | Caso válido para pérdida de peso |
| Peso objetivo = peso actual | No calcular déficit: "Tu meta parece ser mantener tu peso. Usa TDEE de mantenimiento." |
| Peso objetivo > peso actual | No calcular déficit; redirigir a calculadora de TDEE con superávit |
| IMC objetivo < 18.5 | Bloquear plan de pérdida: "Ese objetivo podría quedar por debajo de un rango saludable. Revisa tu meta con un profesional." |
| Edad < 18 | No calcular plan adulto: "Para menores de edad, consulta con un pediatra o profesional de salud." |
| Calorías < 1,200 (mujer) | Advertencia prominente y no recomendar como plan por defecto |
| Calorías < 1,500 (hombre) | Advertencia prominente y no recomendar como plan por defecto |
| Calorías < 800 | Bloquear cálculo: "Por tu seguridad no podemos calcular planes por debajo de 800 kcal/día" |
| Calorías objetivo < TMB estimada | Advertencia prominente: "Este objetivo queda por debajo de tu metabolismo basal estimado." |
| Calorías diarias >= TDEE | No hay déficit: explicar que el peso no bajaría según la estimación |
| Déficit > 1,000 kcal | Advertencia y sugerencia de plazo alternativo |
| Pérdida > 1% del peso/semana | Marcar como agresivo o muy agresivo aunque el déficit sea menor a 1,000 kcal |
| Pérdida > 1.5% del peso/semana | Bloquear plan salvo mensaje de supervisión profesional |
| Plazo < 4 semanas | Advertencia: "Un plazo tan corto puede ser poco realista" |
| Diferencia de peso > 50 kg | Recomendar encarecidamente supervisión médica |
| Campos vacíos | Bloquear cálculo y resaltar campo faltante |

### Condiciones sensibles

Mostrar aviso destacado antes o junto a los resultados si aplica por
edad o por texto general de seguridad:

- Embarazo o lactancia.
- Historial de trastornos de la conducta alimentaria.
- Diabetes, enfermedad renal, enfermedad cardiovascular u otra condición
  médica relevante.
- Uso de medicamentos que afecten apetito, peso, glucosa o presión.
- Pérdida de peso reciente sin explicación.
- Síntomas como mareos, fatiga marcada, desmayos o pérdida de menstruación.

La calculadora no debe diagnosticar ni pedir estos datos como requisito;
solo debe indicar que en esos casos conviene usar el resultado únicamente
con acompañamiento profesional.

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
- Mensajes que normalicen ajustes: "si el peso no cambia después de
  2 a 3 semanas, revisa el plan"
- Metas de comportamiento: caminar, planear comidas, dormir mejor,
  registrar porciones, hidratarse

❌ **Evitar:**
- Lenguaje estético o de apariencia ("quedar bien", "lucir mejor")
- Referencias a ropa, talla, playa, verano o transformación corporal
- Comparaciones con otras personas o estándares irreales
- Urgencia o presión ("pierde peso rápido", "en solo X días")
- Minimizar los tiempos reales de pérdida de peso saludable
- Validar o sugerir restricciones calóricas extremas
- Presentar la fecha estimada como garantía

---

## Formato de outputs

| Tipo de resultado | Formato |
|-------------------|---------|
| Calorías | Número entero → 1,950 kcal |
| Déficit diario | Con signo → −500 kcal |
| Peso | 1 decimal → 68.0 kg / 149.9 lb |
| Tiempo | Rango de semanas y meses → "27 - 29 semanas (6.5 - 7 meses)" |
| Fecha estimada | Rango de mes y año → "noviembre - diciembre 2026" |
| Pérdida semanal | 2 decimales → ~0.45 kg/semana |
| Ritmo relativo | Porcentaje → ~0.57% de tu peso/semana |
| Ritmo | Etiqueta + color + texto → 🟢 Suave / 🟡 Moderado / 🟠 Agresivo |
| Confianza | Texto breve → "Estimación inicial; ajusta según progreso real" |

---

## Features adicionales

### Cálculo en tiempo real (Fase 1)
- Todos los outputs y la gráfica se actualizan
  automáticamente con cada cambio de input.
- En Fase 1 aplica a resultados numéricos y comparador básico.
- En Fase 3 aplica también a gráfica y slider.

### Toggle métrico / imperial (Fase 1 métrico, Fase 2 imperial)
- Cambio instantáneo entre kg/cm y lb/ft-in.
- Convierte los valores ya ingresados automáticamente.
- Fase 1 puede limitarse a métrico si acelera el MVP, pero la lógica
  interna debe quedar preparada para imperial.

### Botón de copiar plan (Fase 2)
- Copia el resumen del plan en texto plano:
  "Meta: 68 kg | Calorías: 1,950/día |
   Déficit: −500 kcal | Plazo: 26 semanas"

### Botón de limpiar / reset (Fase 2)
- Limpia todos los campos con un clic.

### Compartir por WhatsApp (Fase 4)
- Texto preformateado con el resumen del plan.
- Útil para compartir con un acompañante o nutricionista.
- El botón debe ser explícito; no compartir automáticamente.
- El texto debe omitir datos sensibles no necesarios. Ejemplo:
  "Plan estimado: 1,950 kcal/día, ritmo moderado, revisión en 2-3 semanas."

### Historial de simulaciones (Fase 4)
- Últimas 5 configuraciones calculadas en la sesión.
- Guardar solo en estado local del navegador o memoria de sesión.
- No enviar ni persistir historial en servidor.
- Incluir botón para borrar historial.

### Aviso de salud (Fase 1)
- Visible siempre debajo de los resultados:
  "Esta calculadora proporciona estimaciones orientativas
  basadas en promedios poblacionales. Los resultados reales
  varían según genética, metabolismo, composición corporal, sueño,
  estrés, medicamentos, condiciones médicas y actividad diaria.
  Consulta con un profesional de la salud antes de iniciar
  cualquier plan de pérdida de peso, especialmente si tienes embarazo,
  lactancia, una condición médica, historial de trastornos de la conducta
  alimentaria, síntomas o cambios recientes de peso sin explicación."

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

El contenido SEO puede iniciarse en Fase 1 con meta title,
description y contenido mínimo. La versión completa con FAQ, contenido
de apoyo y enlaces contextuales se considera alcance de Fase 4.

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
- ¿Por qué mi fecha estimada aparece como rango?
- ¿Cada cuánto debo recalcular mis calorías?
- ¿Debo sumar el ejercicio si ya elegí actividad moderada o alta?

### Contenido de apoyo
- Explicación del concepto de déficit calórico con analogía
  sencilla (el tanque de gasolina del cuerpo).
- Tabla de tiempo estimado para perder 5, 10, 15 y 20 kg
  según distintos ritmos (precomputada con rangos, no promesas).
- Artículo: "Por qué el peso no baja en línea recta"
  (retención de agua, variación diaria, mesetas).
- Guía: "5 señales de que tu déficit calórico es demasiado agresivo."
- Guía breve: "Cómo elegir un objetivo de peso realista y saludable."
- Explicación de por qué no conviene duplicar ejercicio cuando el TDEE
  ya incluye actividad física.

---

## Especificaciones técnicas

| Parámetro | Fase | Detalle |
|-----------|------|---------|
| Plataforma | 1 | Web responsive (mobile-first) |
| Sin backend | 1 | Todo el cálculo ocurre en el cliente (JS) |
| Lógica pura | 1 | `src/lib/calculators/deficit.ts` con unit tests |
| Página principal | 1 | `/calculadora-deficit-calorico` |
| Fechas | 1 | Basadas en Date() del navegador; locale es-MX; mostrar rangos |
| Accesibilidad base | 1 | Labels en todos los inputs, soporte teclado, mensajes de error claros |
| Toggle métrico/imperial | 2 | Conversión automática sin pérdida de datos |
| Copiar/reset | 2 | Acciones explícitas para copiar plan y limpiar campos |
| Gráfica de progreso | 3 | Chart.js (línea ajustada, línea simple opcional y banda de variación) |
| Tabla accesible | 3 | Fallback obligatorio de la gráfica |
| Slider de escenarios | 3 | Actualiza resultados y gráfica sin salto de layout |
| Compartir WhatsApp | 4 | API WhatsApp Web con texto preformateado y acción explícita |
| Historial | 4 | Solo local/sesión; borrado manual disponible |
| SEO completo | 4 | FAQ, contenido de apoyo y enlaces contextuales finales |
| Idioma | 1 | Español (locale configurable) |
| Precisión | 1 | Calorías a entero; peso a 1 decimal; semanas a 1 decimal |

---

## Lógica técnica sugerida

Separar la lógica de cálculo de la UI para poder probarla con unit tests.
La Fase 1 debe crear los tipos y funciones base aunque algunas
propiedades se completen en fases posteriores.

```ts
interface DeficitInput {
  currentWeightKg: number;
  targetWeightKg: number;
  heightCm: number;
  age: number;
  sex: 'male' | 'female';
  activityLevel: ActivityLevel;
  mode: 'target-weight' | 'daily-calories' | 'deadline' | 'comparison' | 'exercise';
  dailyCalories?: number;
  weeks?: number;
  manualTdee?: number;
  exercise?: ExerciseInput;
}

interface DeficitResult {
  tdeeCurrent: number;
  tdeeAtGoal: number;
  dailyDeficit: number;
  targetCalories: number;
  weeklyLossKg: number;
  weeklyLossPercent: number;
  estimatedWeeksSimple: number;
  estimatedWeeksAdjusted: [number, number];
  estimatedDateRange: [Date, Date];
  riskLevel: 'suave' | 'moderado' | 'agresivo' | 'solo-supervision' | 'bloqueado';
  warnings: string[];
}
```

Funciones esperadas:

- `calculateDeficitPlan(input)`
- `calculateSimpleTimeline(weightLossKg, dailyDeficit)`
- `calculateAdjustedTimeline(input, tdeeStepKg = 5)` (Fase 2)
- `classifyDeficitRisk({ weeklyLossPercent, dailyDeficit, targetCalories, bmr })`
- `validateDeficitInput(input)`
- `calculateExerciseCalories({ weightKg, exerciseType, durationMinutes, frequency, intensity })` (Fase 4)
- `buildProgressSeries(result)` (Fase 3)
- `buildDeficitCopyText(input, result)` (Fase 2)

### Alcance técnico por fase

| Fase | Archivos esperados | Pruebas esperadas |
|------|--------------------|-------------------|
| Fase 1 | `deficit.ts`, `deficit.test.ts`, página base Astro | Cálculo Modo 1, clasificación de riesgo, validaciones críticas |
| Fase 2 | Extensión de `deficit.ts`, helpers de copiar/reset | Modo 2, Modo 3, TDEE por tramos, hitos |
| Fase 3 | Componentes de gráfica y tabla accesible | Series de progreso, fallback accesible, slider |
| Fase 4 | Helpers de ejercicio, historial y compartir | Ejercicio sin doble conteo, privacidad de historial, texto compartido |

### Casos de prueba mínimos

| Fase | Caso | Input | Resultado esperado |
|------|------|-------|--------------------|
| 1 | Plan moderado válido | 80 kg → 68 kg, TDEE 2,450, déficit 500 | 1,950 kcal/día, ~0.45 kg/semana, rango de fecha |
| 1 | Peso objetivo igual | 80 kg → 80 kg | No calcular déficit; sugerir mantenimiento |
| 1 | Peso objetivo mayor | 80 kg → 85 kg | No calcular déficit; sugerir superávit/TDEE |
| 1 | Menor de edad | Edad 16 | No calcular plan adulto |
| 1 | IMC objetivo bajo | Objetivo con IMC < 18.5 | Bloquear plan de pérdida |
| 1 | Calorías bajo mínimo | 1,100 kcal mujer o 1,400 kcal hombre | Advertencia prominente |
| 1 | Calorías < 800 | 750 kcal | Bloquear |
| 1 | Pérdida > 1%/semana | Plazo muy corto o ritmo límite | Marcar agresivo o supervisión |
| 1 | Pérdida > 1.5%/semana | Plazo extremo | Bloquear |
| 2 | Calorías >= TDEE | 2,600 kcal con TDEE 2,450 | Indicar que no hay déficit |
| 2 | TDEE por tramos | Pérdida > 5 kg | Duración ajustada mayor o igual a duración simple |
| 2 | Copiar plan | Resultado válido | Texto plano sin datos sensibles innecesarios |
| 2 | Cambio de unidades | kg/cm ↔ lb/ft-in | Mantener valores equivalentes sin perder datos |
| 3 | Gráfica | Resultado válido | Serie de progreso y tabla accesible coherentes |
| 4 | Ejercicio duplicado | Actividad alta + mismo ejercicio explícito | Mostrar advertencia de doble conteo |
| 4 | Historial local | Varias simulaciones | Guardar últimas 5 en sesión/local y permitir borrado |

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
- Peso objetivo < peso actual → caso válido; calcular déficit si el
  IMC objetivo y las calorías resultantes son seguros
- IMC objetivo < 18.5 → bloquear plan y sugerir revisar la meta con
  un profesional
- Edad < 18 → no calcular plan adulto; mostrar orientación de consulta
  profesional
- Meta de pérdida > 50 kg → calcular con normalidad
  pero mostrar aviso prominente de supervisión médica
- Plazo elegido exige déficit imposible (> 1,500 kcal) →
  bloquear y sugerir plazo mínimo viable
- Plazo elegido exige pérdida > 1.5% del peso por semana →
  bloquear y sugerir plazo mínimo viable
- TDEE muy bajo (< 1,400 kcal) con déficit moderado →
  calorías resultantes por debajo del mínimo; advertir
- Calorías objetivo por debajo de TMB estimada → advertencia prominente
- Pérdida de peso muy lenta (< 0.1 kg/semana) →
  nota: "A este ritmo el progreso será muy gradual,
  lo cual es completamente válido y sostenible"
- Usuario ingresa calorías iguales o superiores al TDEE →
  explicar que no existe déficit estimado
- Usuario elige actividad alta y también registra el mismo ejercicio →
  advertir posible doble conteo y ofrecer cambiar a TDEE sedentario
- Usuario cambia ritmo de agresivo a suave →
  gráfica se actualiza suavemente mostrando el nuevo plazo
- Fechas que caen en el pasado (plazo = 0) →
  validar que el plazo mínimo sea de al menos 4 semanas

---

## Fuentes y criterios de referencia

- CDC, Steps for Losing Weight:
  https://www.cdc.gov/healthy-weight-growth/losing-weight/index.html
  Referencia para pérdida gradual y hábitos sostenibles.
- NIDDK Body Weight Planner:
  https://www.niddk.nih.gov/health-information/weight-management/body-weight-planner
  Referencia para planes personalizados con peso objetivo, plazo,
  actividad física y mantenimiento posterior.
- MedlinePlus, Diet for rapid weight loss:
  https://medlineplus.gov/ency/patientinstructions/000885.htm
  Referencia para dietas bajas en calorías y dietas muy bajas en calorías.
- CDC, Physical Activity and Your Weight and Health:
  https://www.cdc.gov/healthy-weight-growth/physical-activity/index.html
  Referencia para estimaciones de calorías por actividad en persona de
  154 lb / 70 kg y ajuste por peso corporal.
