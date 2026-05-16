# Especificación — Calculadora de Calorías Diarias (TDEE)

## Descripción general
Herramienta para calcular el Total Daily Energy Expenditure (TDEE),
es decir, las calorías totales que una persona quema en un día
considerando su metabolismo basal y su nivel de actividad física.
Es la calculadora de referencia para cualquier objetivo nutricional:
mantenimiento, pérdida de peso o ganancia muscular.

Es la calculadora puente del ecosistema de salud del sitio:
sus resultados alimentan directamente las calculadoras de macros,
déficit calórico y peso ideal. Debe posicionarse como el primer
paso de cualquier plan nutricional.

---

## Conceptos base

### Tasa Metabólica Basal (TMB / BMR)
Calorías mínimas que el cuerpo necesita en reposo absoluto
para mantener funciones vitales (respiración, circulación,
temperatura corporal).

### TDEE
TMB ajustada por el nivel de actividad física diaria.
TDEE = TMB × factor de actividad

### Fórmulas de TMB disponibles

#### Mifflin-St Jeor (recomendada por defecto)
La más precisa para población general según estudios recientes.

Hombres: TMB = (10 × peso_kg) + (6.25 × altura_cm) − (5 × edad) + 5
Mujeres:  TMB = (10 × peso_kg) + (6.25 × altura_cm) − (5 × edad) − 161

#### Harris-Benedict (revisada 1984)
Fórmula clásica, ligeramente menos precisa que Mifflin.

Hombres: TMB = (13.397 × peso) + (4.799 × altura) − (5.677 × edad) + 88.362
Mujeres:  TMB = (9.247 × peso) + (3.098 × altura) − (4.330 × edad) + 447.593

#### Katch-McArdle
La más precisa si se conoce la masa muscular (masa magra).
Requiere % de grasa corporal como input adicional.

TMB = 370 + (21.6 × masa_magra_kg)
masa_magra = peso × (1 − grasa/100)

#### OMS / FAO (alternativa)
Basada en rangos de edad, menos personalizada.

> Mostrar por defecto Mifflin-St Jeor con opción de cambiar
> la fórmula en configuración avanzada.

---

### Factores de actividad física (multiplicadores)

| Nivel | Descripción | Factor |
|-------|-------------|--------|
| Sedentario | Trabajo de escritorio, sin ejercicio | 1.2 |
| Ligeramente activo | Ejercicio ligero 1–3 días/semana | 1.375 |
| Moderadamente activo | Ejercicio moderado 3–5 días/semana | 1.55 |
| Muy activo | Ejercicio intenso 6–7 días/semana | 1.725 |
| Extremadamente activo | Atleta profesional / trabajo físico intenso | 1.9 |

---

## Casos de uso (modos de cálculo)

### Modo 1 — Cálculo estándar de TDEE
> Ejemplo: Mujer, 28 años, 65 kg, 1.65 m,
> ejercicio moderado 4 días/semana. ¿Cuántas calorías necesito?

**Inputs:**
- Sexo → Hombre / Mujer
- Edad → ej. 28 años
- Peso → ej. 65 kg
- Altura → ej. 1.65 m (o 165 cm)
- Nivel de actividad → selector con descripciones detalladas
- Sistema de unidades → Métrico / Imperial
- Objetivo → Perder peso / Mantener peso / Ganar músculo

**Cálculo paso a paso:**
1. TMB (Mifflin): (10×65) + (6.25×165) − (5×28) − 161
              = 650 + 1031.25 − 140 − 161 = **1,380.25 kcal**
2. TDEE: 1,380.25 × 1.55 = **2,139 kcal**

**Output principal:**
- Tu TMB (metabolismo basal): **1,380 kcal**
- Tu TDEE (gasto total diario): **2,139 kcal**

**Output por objetivo (ajuste calórico):**

| Objetivo | Ajuste | Calorías/día | Ritmo estimado |
|----------|--------|-------------|----------------|
| Perder peso rápido | −20% | 1,711 kcal | ~0.5 kg/semana |
| Perder peso moderado | −15% | 1,818 kcal | ~0.35 kg/semana |
| Perder peso suave | −10% | 1,925 kcal | ~0.2 kg/semana |
| **Mantener peso** | 0% | **2,139 kcal** | — |
| Ganar músculo suave | +10% | 2,353 kcal | ~0.15 kg/semana |
| Ganar músculo moderado | +15% | 2,460 kcal | ~0.25 kg/semana |
| Ganar músculo rápido | +20% | 2,567 kcal | ~0.4 kg/semana |

- Destacar visualmente la fila del objetivo seleccionado.
- Nota: "0.5 kg/semana equivale a un déficit de ~500 kcal/día."

---

### Modo 2 — Con porcentaje de grasa corporal (Katch-McArdle)
> Para usuarios que conocen su % de grasa y quieren
> mayor precisión.

**Inputs adicionales:**
- Porcentaje de grasa corporal → ej. 22%
- (Calculado automáticamente) Masa magra → 50.7 kg

**Output adicional:**
- TMB (Katch-McArdle): **1,464 kcal**
- Comparativa: "Con Mifflin obtenías 1,380 kcal.
  La diferencia es de +84 kcal/día."
- Enlace: "¿No sabes tu % de grasa? → Calculadora de grasa corporal"

---

### Modo 3 — Comparador de fórmulas
> Muestra el resultado de las 4 fórmulas simultáneamente
> para que el usuario elija con cuál trabajar.

**Inputs:** mismos que Modo 1

**Output:**

| Fórmula | TMB | TDEE | Diferencia vs Mifflin |
|---------|-----|------|----------------------|
| Mifflin-St Jeor | 1,380 kcal | 2,139 kcal | — (referencia) |
| Harris-Benedict | 1,412 kcal | 2,189 kcal | +50 kcal |
| OMS / FAO | 1,355 kcal | 2,100 kcal | −39 kcal |
| Katch-McArdle* | 1,464 kcal | 2,269 kcal | +130 kcal |

*Requiere % de grasa corporal

- Destacar Mifflin como recomendada.
- Nota: "La diferencia entre fórmulas es normal.
  Usa el TDEE como punto de partida y ajusta según
  cómo responde tu cuerpo en 2–3 semanas."

---

### Modo 4 — Calculadora inversa
> ¿A cuántas calorías debo comer para pesar X kg
> en Y semanas?

**Inputs:**
- Peso actual → ej. 75 kg
- Peso objetivo → ej. 65 kg
- Plazo → ej. 20 semanas
- TDEE actual → calculado automáticamente o ingresado manual

**Cálculo:**
deficit_total = (75 − 65) × 7,700 kcal/kg = 77,000 kcal
deficit_diario = 77,000 / (20 × 7) = 550 kcal/día
calorias_objetivo = TDEE − 550 = 2,139 − 550 = 1,589 kcal/día

**Output:**
- Calorías diarias necesarias: **1,589 kcal**
- Déficit diario: **550 kcal**
- Ritmo de pérdida: **0.5 kg/semana**
- Advertencia si déficit > 1,000 kcal:
  "Un déficit tan alto puede ser contraproducente.
  Considera un plazo más largo o consulta con un nutricionista."
- Advertencia si calorías < 1,200 (mujeres) o < 1,500 (hombres):
  "Comer menos de X kcal/día sin supervisión médica
  puede ser perjudicial para tu salud."

---

## Inputs detallados

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|-------------|-------------------|
| Sexo | Selector | Hombre / Mujer | — |
| Edad | Numérico | 15 – 100 años | — |
| Peso | Numérico | 30 – 300 kg / 66 – 660 lb | — |
| Altura | Numérico | 100 – 250 cm / 3'3" – 8'2" | — |
| Nivel de actividad | Selector | 5 niveles | — |
| Objetivo | Selector | 7 niveles | Mantener peso |
| % grasa corporal | Numérico (opcional) | 3% – 60% | — |
| Fórmula TMB | Selector (avanzado) | 4 opciones | Mifflin-St Jeor |
| Sistema de unidades | Toggle | Métrico / Imperial | Métrico |

---

## Guía de nivel de actividad (descripción expandida)
Mostrar ejemplos concretos en cada opción del selector
para que el usuario elija correctamente:

**Sedentario (×1.2)**
- Trabajo de oficina todo el día
- Sin ejercicio regular
- Desplazamientos en auto o transporte

**Ligeramente activo (×1.375)**
- Caminar 30 min al día
- Ejercicio ligero 1–3 días/semana (yoga, caminata)
- Trabajo de oficina con pausas activas

**Moderadamente activo (×1.55)**
- Ejercicio cardiovascular o pesas 3–5 días/semana
- Trabajos con algo de movimiento (educación, ventas)

**Muy activo (×1.725)**
- Entrenamiento intenso 6–7 días/semana
- Trabajo físico moderado (construcción, agricultura)
- Deportistas amateur en pretemporada

**Extremadamente activo (×1.9)**
- Atletas de alto rendimiento con doble sesión diaria
- Trabajos físicamente muy demandantes
- Militares en entrenamiento intensivo

---

## Validaciones de inputs

| Regla | Detalle |
|-------|---------|
| Edad entre 15 y 100 | Menores de 15: redirigir a pediatra / nutriólogo |
| Peso entre 30 y 300 kg | Fuera de rango: error claro |
| Altura entre 100 y 250 cm | Fuera de rango: error claro |
| % grasa entre 3% y 60% | Fuera de rango: advertencia |
| Campos vacíos | Bloquear cálculo y resaltar campo faltante |
| Calorías resultantes < 800 | Bloquear y mostrar advertencia de salud |

---

## Formato de outputs

| Tipo de resultado | Formato |
|-------------------|---------|
| TMB y TDEE | Número entero → 1,380 kcal / 2,139 kcal |
| Ajuste calórico | Con signo → −428 kcal / +213 kcal |
| Calorías por objetivo | Tabla con fila destacada según objetivo elegido |
| Ritmo estimado | Decimales → ~0.35 kg/semana |
| Macros sugeridos | Gramos y porcentajes (si se activa la sección) |

---

## Feature — Distribución de macros sugerida
Mostrar como sección expandible debajo del resultado principal.
Un anticipo de la calculadora de macros completa.

Para el objetivo seleccionado, mostrar una distribución
de macronutrientes estándar:

**Ejemplo para pérdida de peso (1,818 kcal):**

| Macronutriente | % | kcal | Gramos |
|----------------|---|------|--------|
| Proteína | 30% | 545 kcal | 136 g |
| Carbohidratos | 40% | 727 kcal | 182 g |
| Grasas | 30% | 545 kcal | 61 g |

- CTA: "Personaliza tu distribución de macros →
  Calculadora de macros completa"

---

## Feature — Gráfica de composición calórica
Gráfica de dona mostrando:
- TMB (metabolismo basal)
- Termogénesis de actividad sin ejercicio (NEAT estimado)
- Ejercicio (TEF estimado)

Ayuda a entender visualmente de dónde vienen las calorías quemadas.

---

## Feature — Equivalencias calóricas
Mostrar el TDEE en términos cotidianos para hacerlo más tangible:

**Tu TDEE de 2,139 kcal equivale aproximadamente a:**
- 🍕 6.5 rebanadas de pizza
- 🍌 10 plátanos medianos
- 🏃 3.5 horas de caminata rápida
- 🚴 2.2 horas de ciclismo moderado
- 💤 16 horas de sueño (TMB)

---

## Feature — Ajuste por objetivo con slider
Slider interactivo de déficit/superávit calórico:
- Rango: −1,000 kcal a +1,000 kcal
- Al mover el slider actualiza en tiempo real:
  calorías resultantes, ritmo semanal estimado y
  tiempo para llegar al peso objetivo (si fue ingresado)

---

## Calculadoras relacionadas (enlaces contextuales)

| Situación | Enlace sugerido |
|-----------|----------------|
| Siempre | → Calculadora de macros |
| IMC > 25 | → Calculadora de déficit calórico |
| IMC < 18.5 | → Calculadora de macros (ganancia) |
| Objetivo: perder peso | → Déficit calórico, IMC |
| Objetivo: ganar músculo | → Macros, 1RM |
| % grasa no conocido | → Calculadora de grasa corporal |

---

## SEO y contenido de la página

### Meta información
- Title: "Calculadora de Calorías Diarias (TDEE) — ¿Cuánto Debo Comer?"
- Description: "Calcula tus calorías diarias según tu metabolismo
  y actividad física. Obtén tu TDEE, tu TMB y las calorías exactas
  para perder peso, mantenerlo o ganar músculo. Gratis."

### URLs sugeridas
- /calculadora-calorias-diarias (principal)
- /calculadora-tdee
- /calculadora-metabolismo-basal
- /calculadora-tmb
- /cuantas-calorias-necesito

### Preguntas frecuentes (FAQ — para rich snippets)
- ¿Cuántas calorías necesito al día para perder peso?
- ¿Qué es el TDEE y cómo se calcula?
- ¿Qué es la tasa metabólica basal (TMB)?
- ¿Cuántas calorías necesito para mantener mi peso?
- ¿Qué fórmula es más precisa para calcular el metabolismo?
- ¿Cuántas calorías debo comer para ganar músculo?
- ¿Por qué hombres y mujeres tienen diferente TDEE?

### Contenido de apoyo
- Explicación de TMB vs TDEE con analogía del automóvil
  (consumo en ralentí vs en carretera).
- Tabla de referencia de TDEE promedio por sexo, edad
  y nivel de actividad.
- Artículo: "¿Por qué el TDEE cambia si pierdo peso?"
  (explica por qué hay que recalcular cada 4–5 kg perdidos).

---

## Especificaciones técnicas

| Parámetro | Detalle |
|-----------|---------|
| Plataforma | Web responsive (mobile-first) |
| Sin backend | Todo el cálculo ocurre en el cliente (JS) |
| Gráfica dona | Chart.js (doughnut) |
| Slider de déficit | Input range nativo con actualización en tiempo real |
| Toggle métrico/imperial | Conversión automática de valores ya ingresados |
| Accesibilidad | Labels en todos los inputs, soporte teclado |
| URL principal | /calculadora-calorias-diarias |
| Idioma | Español (locale configurable) |
| Precisión | TMB y TDEE redondeados a entero; macros a 1 decimal |

---

## Diferencias clave vs otras calculadoras de salud del sitio

| Aspecto | TDEE | IMC | Macros | Déficit calórico |
|---------|------|-----|--------|-----------------|
| Input clave | Actividad física | Peso + altura | TDEE + objetivo | TDEE + peso objetivo |
| Output clave | Calorías totales | Índice numérico | Gramos por macro | Calorías a reducir |
| Primer paso para | Macros, déficit | TDEE, déficit | Plan de dieta | Plan de pérdida |
| Requiere TDEE | No (lo calcula) | No | Sí (input) | Sí (input) |
| Vinculación natural | → Macros → Déficit | → TDEE | → Lista de alimentos | → Macros |

---

## Casos extremos a contemplar

- Sedentario + objetivo de perder rápido → calorías muy bajas;
  mostrar advertencia si bajan de 1,200 (mujer) o 1,500 (hombre)
- Atleta extremo con mucha masa muscular → sugerir Katch-McArdle
  para mayor precisión
- Edad < 15 → mostrar mensaje: "Para menores de 15 años
  recomendamos consultar con un pediatra o nutricionista"
- Peso objetivo mayor que peso actual con objetivo "perder peso" →
  detectar inconsistencia y alertar
- Déficit resultante > 1,000 kcal/día → advertencia prominente
- TDEE < 1,000 kcal → caso imposible; verificar inputs
- Cambio de sistema métrico a imperial → convertir valores
  automáticamente sin pérdida de datos
- % de grasa fuera de rangos fisiológicos (< 3% hombre,
  < 10% mujer) → advertencia de valor poco realista