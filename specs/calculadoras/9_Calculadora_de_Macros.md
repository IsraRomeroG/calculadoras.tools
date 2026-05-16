# Especificación — Calculadora de Macros

## Descripción general
Herramienta para calcular la distribución óptima de macronutrientes
(proteínas, carbohidratos y grasas) según el objetivo, el nivel de
actividad y las preferencias dietéticas del usuario. Es el paso
natural después del TDEE: una vez que el usuario sabe cuántas
calorías necesita, esta calculadora le dice cómo distribuirlas.

Orientada a tres perfiles: personas que quieren perder grasa,
personas que buscan ganar músculo, y deportistas que optimizan
su rendimiento. Soporta los principales enfoques dietéticos
(dieta estándar, keto, alta en proteína, vegetariana, etc.)
y genera un plan diario expresado en gramos por macronutriente.

---

## Conceptos base

### Los tres macronutrientes

| Macronutriente | Calorías por gramo | Función principal |
|----------------|-------------------|-------------------|
| Proteína | 4 kcal/g | Construcción y reparación muscular |
| Carbohidratos | 4 kcal/g | Energía principal, rendimiento |
| Grasas | 9 kcal/g | Hormonas, absorción de vitaminas |

### Lógica de cálculo
1. Partir del TDEE ajustado al objetivo (calculado aquí
   o importado de la calculadora de TDEE).
2. Fijar primero la proteína según peso corporal.
3. Distribuir el resto de calorías entre carbohidratos y grasas
   según el enfoque dietético elegido.

---

## Casos de uso (modos de cálculo)

### Modo 1 — Distribución estándar por objetivo
> Ejemplo: Mujer, 65 kg, TDEE 2,139 kcal,
> objetivo: perder grasa. ¿Cuántos gramos de cada macro?

**Inputs:**
- Calorías diarias objetivo → ej. 1,818 kcal
  (o calcular desde cero con peso, altura, edad, actividad)
- Peso corporal → ej. 65 kg
- Objetivo → selector

**Distribuciones recomendadas por objetivo:**

| Objetivo | Proteína | Carbohidratos | Grasas |
|----------|----------|---------------|--------|
| Perder grasa | 35% | 35% | 30% |
| Mantener peso | 25% | 45% | 30% |
| Ganar músculo | 30% | 45% | 25% |
| Rendimiento deportivo | 25% | 55% | 20% |
| Recomposición corporal | 40% | 30% | 30% |

**Cálculo ejemplo (perder grasa, 1,818 kcal):**
- Proteína: 35% → 636 kcal / 4 = **159 g**
- Carbohidratos: 35% → 636 kcal / 4 = **159 g**
- Grasas: 30% → 545 kcal / 9 = **61 g**

**Output:**

| Macronutriente | % | kcal | Gramos/día |
|----------------|---|------|-----------|
| Proteína | 35% | 636 kcal | 159 g |
| Carbohidratos | 35% | 636 kcal | 159 g |
| Grasas | 30% | 545 kcal | 61 g |
| **Total** | 100% | **1,818 kcal** | — |

---

### Modo 2 — Por enfoque dietético
> El usuario sigue una dieta específica y quiere
> los macros adaptados a ese enfoque.

**Selector de dieta:**

| Dieta | Proteína | Carbohidratos | Grasas | Notas |
|-------|----------|---------------|--------|-------|
| Estándar / Balanceada | 25–30% | 45–50% | 25–30% | Punto de partida general |
| Alta en proteína | 35–40% | 35–40% | 20–25% | Pérdida de grasa + músculo |
| Keto / Cetogénica | 25–30% | 5–10% | 60–70% | < 50 g carbos/día |
| Low carb | 25–30% | 20–25% | 45–55% | Sin llegar a cetosis |
| Carnívora | 30–35% | < 5% | 60–70% | Sin carbohidratos de plantas |
| Vegetariana | 20–25% | 50–55% | 25–30% | Ajustar fuentes de proteína |
| Vegana | 20–25% | 55–60% | 20–25% | Fuentes vegetales completas |
| Mediterránea | 20–25% | 45–50% | 30–35% | Énfasis en grasas saludables |
| Paleo | 30–35% | 25–30% | 35–40% | Sin procesados ni lácteos |
| Ayuno intermitente | Igual a estándar | — | — | Ajusta ventana de comidas |

Al seleccionar la dieta:
- Se autocompletan los porcentajes recomendados.
- Se pueden editar manualmente.
- Se muestra una nota con las características clave de esa dieta.

---

### Modo 3 — Por gramos de proteína por kg de peso
> Método más usado por deportistas y culturistas.
> Se fija primero la proteína, luego se distribuye el resto.

**Inputs:**
- Calorías diarias → ej. 2,400 kcal
- Peso corporal → ej. 80 kg
- Gramos de proteína por kg → selector o input manual
- Distribución del resto → % grasas (los carbos se calculan solos)

**Referencias de proteína por kg según objetivo:**

| Objetivo | g proteína / kg peso | Ejemplo (80 kg) |
|----------|---------------------|-----------------|
| Sedentario / salud general | 0.8 g/kg | 64 g |
| Pérdida de peso | 1.6 – 2.0 g/kg | 128 – 160 g |
| Mantenimiento activo | 1.4 – 1.8 g/kg | 112 – 144 g |
| Ganancia muscular | 1.8 – 2.2 g/kg | 144 – 176 g |
| Alto rendimiento | 2.0 – 2.4 g/kg | 160 – 192 g |
| Recomposición corporal | 2.2 – 2.6 g/kg | 176 – 208 g |

**Cálculo ejemplo (80 kg, 2,400 kcal, 2.0 g/kg proteína, 30% grasas):**
- Proteína: 80 × 2.0 = 160 g → 640 kcal
- Grasas: 30% de 2,400 = 720 kcal / 9 = 80 g
- Carbohidratos: 2,400 − 640 − 720 = 1,040 kcal / 4 = 260 g

**Output:**

| Macronutriente | Gramos | kcal | % total |
|----------------|--------|------|---------|
| Proteína | 160 g | 640 kcal | 26.7% |
| Carbohidratos | 260 g | 1,040 kcal | 43.3% |
| Grasas | 80 g | 720 kcal | 30.0% |
| **Total** | — | **2,400 kcal** | 100% |

---

### Modo 4 — Por número de comidas
> Distribuye los macros entre el número de comidas del día.

**Inputs:**
- Macros diarios totales (del Modo 1, 2 o 3)
- Número de comidas → ej. 4
- Distribución → Igualitaria / Personalizada

**Distribución igualitaria (4 comidas, 1,818 kcal):**

| Comida | Calorías | Proteína | Carbos | Grasas |
|--------|----------|----------|--------|--------|
| Desayuno | 455 kcal | 40 g | 40 g | 15 g |
| Comida | 455 kcal | 40 g | 40 g | 15 g |
| Merienda | 455 kcal | 40 g | 40 g | 15 g |
| Cena | 455 kcal | 40 g | 40 g | 15 g |

**Distribución personalizada:**
El usuario asigna un porcentaje a cada comida con sliders
que suman 100%. Útil para ayuno intermitente o comida
principal más grande al mediodía.

---

### Modo 5 — Calculadora completa (todo en uno)
> Para el usuario que llega sin datos previos.
> Calcula TDEE y macros en un solo flujo.

**Inputs:**
- Datos personales: sexo, edad, peso, altura
- Nivel de actividad
- Objetivo
- Enfoque dietético

**Output:**
- TMB → TDEE → Calorías objetivo → Macros
- Todo el flujo en una sola página sin saltar entre calculadoras.

---

## Inputs detallados

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|-------------|-------------------|
| Calorías diarias | Numérico | 800 – 6,000 kcal | — |
| Peso corporal | Numérico | 30 – 300 kg | — |
| Objetivo | Selector | 5 opciones | Mantener peso |
| Enfoque dietético | Selector | 10 dietas | Estándar |
| g proteína / kg | Numérico / Selector | 0.8 – 3.0 g/kg | 1.8 g/kg |
| % grasas | Numérico | 15% – 75% | 30% |
| Número de comidas | Selector | 1 – 7 | 3 |
| Sistema de unidades | Toggle | Métrico / Imperial | Métrico |
| % proteína (manual) | Numérico | 10% – 60% | Según objetivo |
| % carbohidratos (manual) | Numérico | 0% – 70% | Según objetivo |
| % grasas (manual) | Numérico | 10% – 75% | Según objetivo |

---

## Feature — Sliders de distribución con validación de 100%
Tres sliders interconectados para proteína, carbohidratos y grasas.
- Al mover uno, los otros se ajustan automáticamente.
- Siempre suman 100%.
- Si el usuario prefiere, puede fijar uno o dos valores
  y el tercero se calcula solo.
- Indicador visual: "Total: 100% ✅" o "Total: 103% ⚠️"

---

## Feature — Ejemplos de alimentos por macro
Debajo de cada macronutriente, mostrar fuentes alimenticias
comunes con su contenido aproximado:

**Proteína (159 g diarios):**
- 🥚 1 huevo grande = ~6 g proteína
- 🍗 100 g pechuga de pollo = ~31 g proteína
- 🐟 100 g atún en lata = ~25 g proteína
- 🧀 100 g queso cottage = ~11 g proteína
- 🫘 100 g lentejas cocidas = ~9 g proteína

**Carbohidratos (159 g diarios):**
- 🍚 100 g arroz cocido = ~28 g carbos
- 🍌 1 plátano mediano = ~27 g carbos
- 🍞 1 rebanada pan integral = ~12 g carbos
- 🥔 1 papa mediana = ~37 g carbos

**Grasas (61 g diarios):**
- 🥑 1/2 aguacate = ~15 g grasa
- 🫒 1 cda. aceite de oliva = ~14 g grasa
- 🥜 30 g almendras = ~14 g grasa
- 🐟 100 g salmón = ~13 g grasa

CTA: "Estos son ejemplos orientativos. Para un plan
personalizado consulta con un nutricionista certificado."

---

## Feature — Gráfica de distribución
Gráfica de dona con los tres macronutrientes en colores distintos.
- Proteína: azul
- Carbohidratos: naranja
- Grasas: verde
- Tooltip al hover: nombre, gramos y kcal del macro.
- Se actualiza en tiempo real al mover los sliders.

---

## Feature — Comparador de dietas
Tabla que muestra cómo cambian los macros según la dieta elegida
para las mismas calorías. Útil para decidir qué enfoque seguir.

**Ejemplo (1,818 kcal, 65 kg):**

| Dieta | Proteína | Carbos | Grasas |
|-------|----------|--------|--------|
| Estándar | 114 g | 227 g | 60 g |
| Alta proteína | 159 g | 159 g | 50 g |
| Keto | 114 g | 23 g | 141 g |
| Mediterránea | 91 g | 227 g | 67 g |
| Vegana | 91 g | 272 g | 40 g |

---

## Feature — Resumen descargable
Tarjeta visual con el plan de macros del usuario:
- Nombre del objetivo y dieta elegida
- Calorías totales
- Gramos de cada macro por día
- Distribución por comida (si se configuró)
- Botón: "Guardar como imagen" (PNG) para compartir
  o usar como referencia en el móvil

---

## Validaciones de inputs

| Regla | Detalle |
|-------|---------|
| Calorías entre 800 y 6,000 | Fuera de rango: error claro |
| % macros deben sumar 100% | Error si la suma es distinta de 100% |
| Proteína mínima 10% | Advertencia si se baja de ese umbral |
| Grasas mínimas 15% | Advertencia: "Las grasas muy bajas afectan hormonas" |
| Carbos en keto < 10% | Validar que no superen 50 g en modo keto |
| Campos vacíos | Bloquear cálculo y resaltar campo faltante |
| g proteína > 3.5 g/kg | Advertencia: "Ingesta muy elevada sin evidencia de beneficio" |

---

## Formato de outputs

| Tipo de resultado | Formato |
|-------------------|---------|
| Gramos por macro | Número entero → 159 g |
| Calorías por macro | Número entero → 636 kcal |
| Porcentaje | 1 decimal → 35.0% |
| Por comida | 1 decimal en gramos → 39.8 g |
| Total calorías | Número entero → 1,818 kcal |

---

## Features adicionales

### Cálculo en tiempo real
- Todos los outputs y la gráfica se actualizan
  automáticamente con cada cambio de input.

### Botón de copiar resultado
- Copia el plan completo en texto plano:
  "Proteína: 159 g | Carbos: 159 g | Grasas: 61 g | Total: 1,818 kcal"

### Botón de limpiar / reset
- Limpia todos los campos con un clic.

### Historial de planes
- Guarda los últimos 5 planes calculados en la sesión.
- Permite comparar diferentes configuraciones.

### Aviso de salud
- Texto visible debajo de los resultados:
  "Los macros recomendados son orientativos y se basan en
  pautas generales. Las necesidades individuales varían.
  Consulta con un nutricionista para un plan personalizado."

---

## Calculadoras relacionadas (enlaces contextuales)

| Situación | Enlace sugerido |
|-----------|----------------|
| No conoce su TDEE | → Calculadora de TDEE |
| Quiere perder peso | → Calculadora de déficit calórico |
| Quiere ganar músculo | → Calculadora de 1RM |
| No conoce su IMC | → Calculadora de IMC |
| Quiere saber su % grasa | → Calculadora de grasa corporal |
| Siempre | → Calculadora de TDEE, déficit calórico |

---

## SEO y contenido de la página

### Meta información
- Title: "Calculadora de Macros — Proteínas, Carbohidratos y Grasas"
- Description: "Calcula tus macronutrientes diarios según tu objetivo:
  perder grasa, ganar músculo o mantener tu peso. Compatible con
  dieta keto, vegana, mediterránea y más. Gratis."

### URLs sugeridas
- /calculadora-de-macros (principal)
- /calculadora-macronutrientes
- /macros-para-perder-peso
- /macros-para-ganar-musculo
- /calculadora-keto-macros

### Preguntas frecuentes (FAQ — para rich snippets)
- ¿Qué son los macronutrientes y para qué sirven?
- ¿Cuánta proteína debo comer al día para ganar músculo?
- ¿Cuántos carbohidratos se recomiendan al día?
- ¿Cuál es la distribución de macros para bajar de peso?
- ¿Cuántos gramos de grasa debo comer al día?
- ¿Qué macros tiene la dieta keto?
- ¿Cómo se calculan los macros para una dieta vegana?

### Contenido de apoyo
- Tabla de macros recomendados por objetivo (precomputada).
- Explicación de cada macronutriente y su función.
- Guía: "¿Qué dieta es mejor para perder peso?"
  (comparativa de enfoques con pros y contras).
- Lista de alimentos ricos en cada macronutriente.

---

## Especificaciones técnicas

| Parámetro | Detalle |
|-----------|---------|
| Plataforma | Web responsive (mobile-first) |
| Sin backend | Todo el cálculo ocurre en el cliente (JS) |
| Gráfica de dona | Chart.js (doughnut con animación) |
| Sliders interconectados | Lógica JS para mantener suma en 100% |
| Exportar imagen | html2canvas o equivalente ligero |
| Accesibilidad | Labels en todos los inputs, soporte teclado |
| URL principal | /calculadora-de-macros |
| Idioma | Español (locale configurable) |
| Precisión | Gramos redondeados a entero; % a 1 decimal |

---

## Diferencias clave vs otras calculadoras de salud del sitio

| Aspecto | Macros | TDEE | Déficit calórico | IMC |
|---------|--------|------|-----------------|-----|
| Input clave | TDEE + objetivo + dieta | Actividad física | Peso objetivo + plazo | Peso + altura |
| Output clave | Gramos por macro | Calorías totales | Calorías a reducir | Índice numérico |
| Requiere TDEE | Sí (input principal) | No (lo calcula) | Sí (input) | No |
| Soporte por dieta | Sí (10 dietas) | No | No | No |
| Por comida | Sí | No | No | No |
| Vinculación natural | ← TDEE → Déficit | → Macros → Déficit | ← TDEE ← Macros | → TDEE |

---

## Casos extremos a contemplar

- Dieta keto con carbos > 50 g → advertencia:
  "En dieta cetogénica los carbohidratos suelen limitarse
  a menos de 50 g diarios para mantener cetosis"
- Proteína calculada > 3.0 g/kg → advertencia visible
  pero sin bloquear el cálculo
- Grasas < 15% del total → advertencia de salud hormonal
- Calorías muy bajas (< 1,200 mujer / < 1,500 hombre) →
  advertencia: recomendar supervisión médica
- Suma de % macros ≠ 100% → error claro con indicador
  visual del total actual
- Usuario vegano con proteína muy alta → nota sobre
  fuentes de proteína vegetal completa (soja, quinoa, etc.)
- Número de comidas = 1 (ayuno extremo) → permitir
  con nota sobre ayuno prolongado
- Cambio de objetivo con sliders fijos → recalcular
  automáticamente y preguntar si desea resetear sliders