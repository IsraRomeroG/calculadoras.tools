# Especificación v2 — Calculadora de Calorías Diarias (TDEE)

## Descripción general

Herramienta para estimar el Total Daily Energy Expenditure (TDEE), es decir,
las calorías totales que una persona adulta gasta en un día considerando su
metabolismo basal y su nivel de actividad física.

La página debe entregar una estimación rápida, clara y responsable: mostrar
TMB, TDEE, calorías orientativas para mantener, perder o ganar peso, y avisos
cuando el resultado pueda implicar un déficit o superávit agresivo.

El TDEE es una estimación, no una medición exacta ni una prescripción médica.
La experiencia debe explicar que el resultado sirve como punto de partida y que
conviene ajustar según cambios reales de peso, energía, apetito, entrenamiento y
seguimiento profesional cuando aplique.

La calculadora debe estar optimizada para uso móvil desde el primer viewport y
construirse con Astro + Tailwind CSS, sin backend ni llamadas de red.

---

## Objetivo de producto

- Calcular TMB y TDEE para personas adultas usando Mifflin-St Jeor por defecto.
- Permitir sistema métrico e imperial sin obligar a reescribir datos.
- Ayudar a elegir un nivel de actividad con ejemplos concretos.
- Mostrar calorías orientativas para mantener peso, déficit y superávit.
- Usar lenguaje neutral, educativo y no prescriptivo.
- Mostrar advertencias para calorías muy bajas, déficits altos, edad fuera de
  alcance adulto y datos poco realistas.
- Conectar de forma contextual con IMC, macros, déficit calórico y grasa
  corporal.
- Evitar transferir datos personales de salud entre calculadoras sin una acción
  explícita del usuario.
- Generar una página estática optimizada para SEO en Astro.

---

## Alcance recomendado

### MVP

La primera versión debe enfocarse en el flujo principal para adultos:

- Cálculo de TMB con Mifflin-St Jeor.
- Cálculo de TDEE con multiplicador de actividad.
- Toggle de unidades: métrico (`kg/cm`) e imperial (`lb/ft/in`).
- Conversión automática de valores al cambiar de sistema.
- Inputs: sexo usado por la fórmula, edad, peso, altura, actividad y objetivo.
- Resultado principal: TMB, TDEE y calorías objetivo.
- Tabla o lista responsive de ajustes calóricos por objetivo.
- Avisos de salud y de precisión de la estimación.
- Botón de copiar resultado.
- Botón de limpiar.
- Opción de usar ejemplo.
- Contenido SEO, FAQ visible y JSON-LD de `FAQPage`.
- Fuentes visibles al final de la página.

### Fase 2

- Modo con porcentaje de grasa corporal usando Katch-McArdle.
- Comparador de fórmulas: Mifflin-St Jeor, Harris-Benedict revisada y
  Katch-McArdle cuando exista `% de grasa`.
- Slider de ajuste calórico entre déficit y superávit con límites seguros.
- Recomendación de recalcular al cambiar `4 - 5 kg` de peso.
- Historial de últimos cálculos válidos en `sessionStorage`, solo si el usuario
  lo activa explícitamente.

### Fase 3

- Enlace contextual hacia la calculadora de déficit calórico para la pregunta
  inversa: calorías para acercarse a un peso objetivo en un plazo.
- Distribución de macros sugerida como anticipo de la calculadora de macros.
- Gráfica de composición del gasto energético.
- Equivalencias calóricas educativas.
- Vista de impresión.
- Exportación de resultado como texto o CSV.

> No implementar Chart.js, cálculo inverso dentro de TDEE, historial,
> comparador de fórmulas ni macros sugeridos en el MVP. Son funciones útiles,
> pero aumentan el alcance, el peso de la página y el riesgo de comunicar una
> precisión que la estimación no tiene.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL pública recomendada | `/salud/calculadora-de-calorias-diarias-tdee` |
| Alias opcional corto | `/calculadora-calorias-diarias` |
| Alias opcional corto | `/calculadora-metabolismo-basal` |
| Archivo Astro recomendado | `src/pages/salud/calculadora-de-calorias-diarias-tdee.astro` |
| Lógica de cálculo | `src/lib/calculators/tdee.ts` |
| Pruebas unitarias | `src/lib/calculators/tdee.test.ts` |
| Locale base | `es-MX` |
| Layout | `BaseLayout.astro` |
| Contenedores UI | `PageHero`, `Container`, `SectionIntro`, `FaqSection` |
| Estilos | Tailwind CSS |

> La URL canónica debe ser `/salud/calculadora-de-calorias-diarias-tdee`. Los
> alias cortos, si se crean, deben redirigir o exponer el canonical principal.
> La página debe exponer un único `canonical`.

---

## Comportamiento mobile-first

- La calculadora interactiva debe aparecer como experiencia principal en el
  primer viewport. No crear una landing page antes de la herramienta.
- En móvil, usar una sola columna: unidades, inputs, actividad, objetivo,
  resultado, acciones y contenido contextual.
- En pantallas medianas o grandes, usar dos columnas: formulario a la izquierda
  y resultado a la derecha.
- Los controles táctiles deben tener altura mínima aproximada de `44px`.
- El selector de unidades debe ser un control segmentado.
- El nivel de actividad debe funcionar bien en móvil: usar radio cards o un
  selector con descripción visible, no un desplegable críptico.
- La tabla de objetivos debe convertirse en lista de filas/cards compactas en
  móvil o permitir scroll horizontal con encabezados legibles.
- El resultado principal debe tener dimensiones estables para evitar saltos de
  layout al recalcular.
- No depender únicamente del color para comunicar objetivo, advertencia o error.
  Acompañar color con texto y, si aplica, icono accesible.
- Evitar tarjetas dentro de tarjetas. Usar cards solo para resultados concretos
  o bloques repetidos.
- Los textos largos deben permitir salto de línea sin romper el layout.
- En móvil, las acciones deben ser botones de ancho completo o wrap natural.
- El contenido educativo, FAQ, fuentes y calculadoras relacionadas deben quedar
  debajo de la calculadora.

---

## Conceptos base

### Tasa Metabólica Basal (TMB / BMR)

Calorías estimadas que el cuerpo usa en reposo para mantener funciones vitales
como respiración, circulación y temperatura corporal.

### TDEE

TMB ajustada por el nivel de actividad diaria.

```text
TDEE = TMB * factor_actividad
```

### Limitación principal

El factor de actividad suele ser la mayor fuente de error. Dos personas con el
mismo entrenamiento pueden tener TDEE distinto por NEAT, trabajo, sueño,
adaptación metabólica, medicamentos, masa muscular, ciclo menstrual, estrés y
otros factores.

Texto sugerido:

```text
Tu TDEE es una estimación inicial. Úsalo como punto de partida y ajusta después de 2 a 3 semanas según tu evolución real.
```

---

## Fórmulas de TMB

### Mifflin-St Jeor — MVP

Usar por defecto para población adulta general.

```text
Hombres:
TMB = (10 * peso_kg) + (6.25 * altura_cm) - (5 * edad) + 5

Mujeres:
TMB = (10 * peso_kg) + (6.25 * altura_cm) - (5 * edad) - 161
```

En la UI, explicar que el campo de sexo se usa porque la ecuación requiere esa
variable. No usarlo para inferir identidad de género ni otros datos personales.

### Harris-Benedict revisada — Fase 2

Fórmula clásica para comparación educativa.

```text
Hombres:
TMB = (13.397 * peso_kg) + (4.799 * altura_cm) - (5.677 * edad) + 88.362

Mujeres:
TMB = (9.247 * peso_kg) + (3.098 * altura_cm) - (4.330 * edad) + 447.593
```

### Katch-McArdle — Fase 2

Útil si el usuario conoce su porcentaje de grasa corporal. No debe aparecer en
el MVP porque requiere un dato que muchas personas no conocen con precisión.

```text
masa_magra_kg = peso_kg * (1 - grasa_corporal / 100)
TMB = 370 + (21.6 * masa_magra_kg)
```

### OMS / FAO o EER — Fase futura

No incluir en el MVP ni en el comparador hasta documentar la fórmula completa,
rangos de edad, coeficientes y fuente editorial. Si se añade una ecuación EER
de National Academies, debe tratarse como estimación de requerimiento energético
total, no como fórmula de TMB.

---

## Factores de actividad física

| Nivel | Descripción breve | Factor |
|-------|-------------------|--------|
| Sedentario | Trabajo de escritorio, sin ejercicio regular | `1.2` |
| Ligeramente activo | Ejercicio ligero `1 - 3` días/semana | `1.375` |
| Moderadamente activo | Ejercicio moderado `3 - 5` días/semana | `1.55` |
| Muy activo | Ejercicio intenso `6 - 7` días/semana | `1.725` |
| Extremadamente activo | Atleta o trabajo físico muy demandante | `1.9` |

Texto de ayuda:

```text
Si dudas entre dos niveles, elige el menor y ajusta después con tu evolución real.
```

### Ayuda para elegir actividad

El selector de actividad debe reducir el error más común: elegir un nivel alto
solo por entrenar algunos días, aunque el resto del día sea sedentario.

En la UI, cada opción debe combinar dos señales:

- Movimiento diario: trabajo sentado, trabajo de pie, caminatas, traslados,
  tareas domésticas o trabajo físico.
- Ejercicio estructurado: frecuencia, intensidad y duración semanal.

Texto breve sugerido cerca del selector:

```text
Piensa en todo tu día, no solo en tu entrenamiento. Si entrenas 3 días pero pasas casi todo el día sentado, quizá "ligeramente activo" sea más realista que "moderadamente activo".
```

No convertir esta ayuda en un cuestionario largo en el MVP. Debe funcionar como
microcopy o ayuda expandible dentro del selector.

### Guía expandida para la UI

**Sedentario (`1.2`)**

- Trabajo de oficina la mayor parte del día.
- Sin ejercicio regular.
- Desplazamientos principalmente en auto o transporte.

**Ligeramente activo (`1.375`)**

- Caminatas frecuentes o `30 min` al día.
- Ejercicio ligero `1 - 3` días por semana.
- Trabajo de oficina con pausas activas.

**Moderadamente activo (`1.55`)**

- Cardio, pesas o deporte `3 - 5` días por semana.
- Trabajo con algo de movimiento.
- Actividad diaria constante, pero no física intensa.

**Muy activo (`1.725`)**

- Entrenamiento intenso `6 - 7` días por semana.
- Trabajo físico moderado.
- Deportistas amateur con carga alta.

**Extremadamente activo (`1.9`)**

- Atletas de alto rendimiento con doble sesión frecuente.
- Trabajo físicamente muy demandante.
- Entrenamiento militar, agrícola, construcción pesada u otro esfuerzo similar.

---

## Flujo principal MVP — Cálculo estándar de TDEE

Modo por defecto al cargar la página.

**Ejemplo:** Mujer, `28` años, `65 kg`, `165 cm`, actividad moderada. ¿Cuántas
calorías diarias necesita como punto de partida?

### Inputs del MVP

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Sistema de unidades | Control segmentado | Métrico / Imperial | Métrico |
| Sexo usado por fórmula | Selector | Hombre / Mujer | Vacío |
| Edad | Texto numérico | `18 - 100 años` | Vacío |
| Peso kg | Texto numérico | `30 - 300 kg` | Vacío |
| Peso lb | Texto numérico | `66 - 660 lb` | Vacío |
| Altura cm | Texto numérico | `100 - 250 cm` | Vacío |
| Altura ft | Texto numérico | `3 - 8 ft` | Vacío |
| Altura in | Texto numérico | `0 - 11.99 in` | Vacío |
| Nivel de actividad | Radio cards / selector | 5 niveles | Vacío |
| Objetivo | Selector | 7 niveles | Mantener peso |

### Reglas del formulario

- Sexo, edad, peso, altura y actividad son obligatorios para calcular.
- El objetivo define qué fila queda destacada y cuál es la caloría objetivo
  principal.
- El sistema imperial debe capturar pies y pulgadas como campos separados.
- Al cambiar unidades, convertir valores existentes y conservar el significado
  del cálculo.
- El cálculo puede actualizarse en tiempo real cuando hay valores válidos.
- Si el usuario aún no ha interactuado con un campo, no mostrar errores
  agresivos; usar estado inicial neutral.

### Cálculo del ejemplo

```text
TMB = (10 * 65) + (6.25 * 165) - (5 * 28) - 161
TMB = 650 + 1031.25 - 140 - 161
TMB = 1380.25 kcal/día

TDEE = 1380.25 * 1.55
TDEE = 2139.39 kcal/día
```

### Output principal

Para el ejemplo anterior:

| Resultado | Valor esperado |
|-----------|----------------|
| TMB | `1,380 kcal/día` |
| TDEE | `2,139 kcal/día` |
| Objetivo por defecto | `Mantener peso` |
| Calorías objetivo | `2,139 kcal/día` |

Texto breve sugerido:

```text
Tu gasto total diario estimado es de 2,139 kcal. Este número es un punto de partida; ajústalo según tu evolución durante las próximas 2 a 3 semanas.
```

---

## Ajuste calórico por objetivo

Usar el TDEE calculado como base. Redondear solo al mostrar.

| Objetivo | Ajuste | Calorías/día con ejemplo | Equivalente energético |
|----------|--------|--------------------------|------------------------|
| Perder peso agresivo | `-20%` | `1,712 kcal` | `~0.39 kg/semana` |
| Perder peso moderado | `-15%` | `1,818 kcal` | `~0.29 kg/semana` |
| Perder peso suave | `-10%` | `1,925 kcal` | `~0.19 kg/semana` |
| Mantener peso | `0%` | `2,139 kcal` | `Estable` |
| Superávit suave | `+5%` | `2,246 kcal` | `~0.10 kg/semana` |
| Superávit moderado | `+10%` | `2,353 kcal` | `~0.19 kg/semana` |
| Superávit alto | `+15%` | `2,460 kcal` | `~0.29 kg/semana` |

Notas importantes:

- Destacar visualmente la fila del objetivo seleccionado.
- El equivalente semanal usa la aproximación `7,700 kcal ≈ 1 kg`, pero no debe
  presentarse como promesa de cambio real.
- Para pérdida de peso, `500 kcal/día` equivale aproximadamente a
  `0.45 kg/semana`, aunque la evolución real cambia con el tiempo.
- Mostrar advertencia si el déficit supera `1,000 kcal/día`.
- Mostrar advertencia si el objetivo baja de mínimos orientativos de seguridad.
- No prometer ganancia muscular solo por usar superávit calórico. Para objetivos
  de músculo, explicar que también influyen entrenamiento, proteína, descanso y
  progresión.

---

## Conversiones de unidades

```text
kg = lb * 0.45359237
lb = kg / 0.45359237
cm = in * 2.54
in = cm / 2.54
altura_total_in = (ft * 12) + in
```

Reglas:

- Calcular internamente siempre en `kg` y `cm`.
- Conservar precisión completa internamente.
- Redondear al mostrar: peso con `1 decimal`, altura con `0` o `1 decimal`.
- Al cambiar de métrico a imperial, dividir altura en `ft` e `in`.
- Al cambiar de imperial a métrico, combinar `ft` e `in` antes de convertir.

---

## Parsing y validación de inputs

### Tipo de input

Usar `input type="text"` con:

```html
inputmode="decimal"
autocomplete="off"
```

Esto permite aceptar valores pegados con símbolos o formatos regionales.

### Normalización de valores

Aceptar y normalizar:

| Entrada | Valor interno |
|---------|---------------|
| `65` | `65` |
| `65.5` | `65.5` |
| `65,5` | `65.5` |
| `65 kg` | `65` |
| `143 lb` | `143` |
| `165 cm` | `165` |
| `1.65 m` | `165 cm` si el campo métrico acepta altura |
| `5 ft 5 in` | Fase futura; en MVP usar ft/in separados |

### Validaciones

| Regla | Comportamiento esperado |
|-------|-------------------------|
| Sexo vacío | No calcular; pedir selección si el campo fue tocado. |
| Edad vacía | No calcular; pedir edad si el campo fue tocado. |
| Edad `< 18` | No calcular TDEE adulto; mostrar nota de consulta profesional. |
| Edad `>= 65` | Calcular si el resto es válido, pero mostrar nota de menor precisión en adultos mayores. |
| Edad `> 100` | Bloquear cálculo y mostrar error claro. |
| Peso `< 30 kg` o `> 300 kg` | Bloquear cálculo y mostrar error claro. |
| Peso `< 66 lb` o `> 660 lb` | Bloquear cálculo y mostrar error claro. |
| Altura `< 100 cm` o `> 250 cm` | Bloquear cálculo y mostrar error claro. |
| Pies `< 3` o `> 8` | Bloquear cálculo. |
| Pulgadas `< 0` o `>= 12` | Bloquear cálculo. |
| Campos vacíos | No mostrar resultado final; indicar qué falta si el usuario ya interactuó. |
| Caracteres ambiguos | Error: `Ingresa un número válido.` |
| Valores negativos | Error específico; no calcular. |
| TDEE `< 1,000 kcal` | Mostrar TMB y TDEE solo si los inputs son válidos, añadir advertencia de revisar datos; no bloquear automáticamente. |
| Calorías objetivo `< 1,000 kcal` | Bloquear objetivo y mostrar advertencia de salud. |
| Calorías objetivo `< 1,200` en mujeres | Mostrar advertencia prominente. |
| Calorías objetivo `< 1,500` en hombres | Mostrar advertencia prominente. |
| Déficit `> 1,000 kcal/día` | Mostrar advertencia prominente. |

---

## Avisos de salud y tono

La calculadora debe evitar lenguaje prescriptivo como "debes comer",
"calorías exactas", "peso ideal" o "resultado perfecto". Usar "estimado",
"orientativo" y "punto de partida".

### Aviso general visible

```text
Estos resultados son estimaciones educativas y no reemplazan una evaluación médica o nutricional. Consulta con un profesional de la salud si tienes embarazo, lactancia, una condición médica, historial de trastornos de la conducta alimentaria, cambios recientes de peso o síntomas.
```

### Edad menor a 18

```text
Esta calculadora está pensada para adultos. En niñas, niños y adolescentes, las necesidades energéticas dependen del crecimiento y deben evaluarse con un profesional de salud.
```

### Calorías muy bajas

```text
El objetivo calculado queda en un rango muy bajo. Evita dietas muy bajas en calorías sin supervisión profesional.
```

### Déficit alto

```text
Este déficit es alto y puede ser difícil de sostener. Considera un ajuste más gradual o consulta con un profesional.
```

### TDEE inusualmente bajo

```text
El gasto diario estimado quedó inusualmente bajo. Revisa edad, peso, altura y actividad antes de usar este número como referencia.
```

### Adultos mayores

```text
En adultos mayores, las fórmulas pueden ser menos precisas por cambios en masa muscular, salud, medicamentos y actividad diaria. Toma el resultado como una referencia inicial.
```

### Actividad extrema

```text
Con entrenamientos o trabajos muy demandantes, la estimación puede quedarse corta. Si conoces tu composición corporal, Katch-McArdle puede ayudar como comparación en una versión avanzada.
```

---

## Estados de la calculadora

| Estado | Comportamiento |
|--------|----------------|
| Inicial | Campos vacíos, resultado neutral y sin errores. |
| Incompleto | No mostrar resultado final; indicar qué falta si el usuario ya interactuó. |
| Válido adulto | Mostrar TMB, TDEE, objetivo, tabla de ajustes y acciones. |
| Inválido | Mostrar errores por campo y ocultar acciones de resultado. |
| Valor inusual | Mostrar resultado solo si los inputs son válidos y añadir advertencia. |
| Adulto mayor | Mostrar resultado si los datos son válidos y añadir nota de menor precisión. |
| Objetivo riesgoso | Mantener TDEE visible, pero advertir o bloquear objetivo según severidad. |
| Copiado | Confirmación visual durante 2 segundos y anuncio accesible. |
| Limpio | Restaurar estado inicial sin recargar la página. |

---

## Formato de outputs

Usar `Intl.NumberFormat` con locale `es-MX`.

| Tipo de resultado | Formato |
|-------------------|---------|
| TMB y TDEE | Entero: `1,380 kcal/día` |
| Ajuste calórico | Con signo: `-321 kcal/día`, `+214 kcal/día` |
| Calorías por objetivo | Entero: `1,818 kcal/día` |
| Equivalente semanal | 2 decimales: `~0.29 kg/semana` |
| Peso métrico | 1 decimal: `65.0 kg` |
| Peso imperial | 1 decimal: `143.3 lb` |
| Altura métrica | Entero o 1 decimal: `165 cm` |
| Altura imperial | `5 ft 5 in` |
| Porcentaje de grasa fase 2 | 1 decimal: `22.0%` |

### Redondeo

- Usar precisión completa para cálculos internos.
- Redondear solo al mostrar.
- En las pruebas, comparar con tolerancia cuando haya conversión imperial.

---

## Acciones del MVP

### Copiar resultado

Debe copiar texto plano.

Ejemplo:

```text
Calculadora de Calorías Diarias - calculadoras.tools
Sexo usado por fórmula: Mujer
Edad: 28 años
Peso: 65 kg
Altura: 165 cm
Actividad: Moderadamente activo
TMB estimada: 1,380 kcal/día
TDEE estimado: 2,139 kcal/día
Objetivo: Mantener peso
Calorías objetivo: 2,139 kcal/día
```

Si `navigator.clipboard` no está disponible, usar fallback con `textarea` o
mostrar mensaje accesible de error.

### Limpiar

- Restablece valores por defecto.
- Limpia errores, advertencias y resultado.
- No recarga la página.
- Mantiene sistema métrico como default.

### Usar ejemplo

Debe estar disponible en el MVP. Rellena:

```text
sexo = Mujer
edad = 28
peso = 65 kg
altura = 165 cm
actividad = Moderadamente activo
objetivo = Mantener peso
```

---

## Modo fase 2 — Con porcentaje de grasa corporal

Para usuarios que conocen su `% de grasa` y quieren comparar el resultado con
una fórmula basada en masa magra.

### Input adicional

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Grasa corporal | Texto numérico opcional | `3% - 60%` | Vacío |

### Reglas

- No exigir este campo en el MVP.
- Si el valor existe, calcular masa magra y TMB Katch-McArdle.
- Si el valor es `< 3%` o `> 60%`, bloquear comparación.
- Si el valor es fisiológicamente inusual, mostrar advertencia:
  - Hombres `< 3%`.
  - Mujeres `< 10%`.

### Output ejemplo

Para `65 kg` y `22%` de grasa:

| Resultado | Valor esperado |
|-----------|----------------|
| Masa magra | `50.7 kg` |
| TMB Katch-McArdle | `1,465 kcal/día` |
| TDEE Katch-McArdle con factor `1.55` | `2,271 kcal/día` |
| Diferencia vs Mifflin | `+132 kcal/día` de TDEE |

Texto sugerido:

```text
La diferencia entre fórmulas es normal. Usa estos números como rango de referencia y ajusta según tu evolución real.
```

---

## Modo fase 2 — Comparador de fórmulas

Muestra resultados simultáneos para usuarios que quieren entender la variación
entre métodos.

| Fórmula | Requisito | Estado recomendado |
|---------|-----------|--------------------|
| Mifflin-St Jeor | Sexo, edad, peso, altura | Referencia |
| Harris-Benedict revisada | Sexo, edad, peso, altura | Comparación |
| Katch-McArdle | Peso y `% grasa` | Comparación opcional |
| OMS / FAO / EER | Fórmula documentada | Fase futura |

No debe sustituir el resultado principal del MVP. Debe vivir en una sección
avanzada y colapsable.

---

## Modo fase 2 — Slider de ajuste calórico

Slider interactivo de déficit/superávit calórico.

### Reglas

- Rango técnico: `-1,000 kcal` a `+750 kcal`.
- Paso recomendado: `50 kcal`.
- Valor inicial: ajuste del objetivo seleccionado.
- Actualizar en tiempo real:
  - calorías objetivo,
  - diferencia contra TDEE,
  - equivalente energético semanal.
- Mostrar advertencias si el resultado cruza umbrales de seguridad.
- Respetar `prefers-reduced-motion`.

---

## Fuera del MVP — Cálculo inverso por peso objetivo

Pregunta: ¿qué calorías aproximadas necesitaría para acercarme a cierto peso en
cierto plazo?

Este flujo no debe implementarse dentro de la calculadora de TDEE. Pertenece a
la calculadora de déficit calórico, porque responde a un plan de cambio de peso
y requiere más contexto de plazo, peso objetivo y ritmo. En TDEE, mostrar como
enlace contextual solo cuando el usuario elija un objetivo de pérdida o
superávit.

### Inputs

- Peso actual.
- Peso objetivo.
- Plazo en semanas.
- TDEE actual calculado automáticamente o ingresado manualmente.

### Cálculo aproximado

```text
diferencia_kg = peso_actual - peso_objetivo
energia_total = diferencia_kg * 7700
ajuste_diario = energia_total / (semanas * 7)
calorias_objetivo = TDEE - ajuste_diario
```

### Advertencia obligatoria

```text
Este cálculo usa una aproximación lineal. En la vida real el gasto cambia al perder o ganar peso, por lo que el resultado no predice una fecha exacta.
```

### Validaciones adicionales

- Si el objetivo implica perder y `peso_objetivo > peso_actual`, mostrar
  inconsistencia.
- Si el objetivo implica ganar y `peso_objetivo < peso_actual`, mostrar
  inconsistencia.
- Si el déficit diario supera `1,000 kcal`, advertir.
- Si las calorías objetivo quedan por debajo de mínimos orientativos, advertir
  o bloquear.

---

## Feature fase 3 — Distribución de macros sugerida

Mostrar como sección expandible debajo del resultado principal. Debe ser un
anticipo de la calculadora de macros completa, no una dieta personalizada.

Ejemplo para pérdida moderada con `1,818 kcal`:

| Macronutriente | % | kcal | Gramos |
|----------------|---|------|--------|
| Proteína | `30%` | `545 kcal` | `136 g` |
| Carbohidratos | `40%` | `727 kcal` | `182 g` |
| Grasas | `30%` | `545 kcal` | `61 g` |

CTA:

```text
Personaliza tu distribución en la calculadora de macros.
```

---

## Feature fase 3 — Composición del gasto energético

Si se implementa una visualización, preferir SVG o CSS simple antes de añadir
Chart.js. Si se usa Chart.js, cargarlo solo cuando la sección sea visible.

No comunicar componentes estimados como mediciones directas. Una versión simple
puede mostrar:

- TMB estimada.
- Actividad estimada: `TDEE - TMB`.

Si se separan NEAT, ejercicio y efecto térmico de los alimentos, documentar las
suposiciones y mostrarlo como aproximación educativa.

---

## Feature fase 3 — Equivalencias calóricas

Puede ayudar a que el número sea tangible, pero debe evitar moralizar alimentos
o promover compensaciones rígidas.

Reglas:

- Presentar equivalencias como aproximaciones educativas.
- No etiquetar alimentos como buenos o malos.
- No sugerir que el ejercicio "compensa" comida.
- Permitir ocultar la sección.

Texto sugerido:

```text
Estas equivalencias son aproximadas y solo sirven para dimensionar el número.
```

---

## Calculadoras relacionadas

Mostrar enlaces contextuales debajo del resultado y/o al final de la página.
No presentarlos como tratamiento médico.

| Condición | Enlace sugerido |
|-----------|-----------------|
| Siempre | Calculadora de IMC |
| Siempre | Calculadora de macros |
| Objetivo: perder peso | Calculadora de déficit calórico |
| Objetivo: superávit / ganar peso | Calculadora de macros |
| Actividad de fuerza | Calculadora de 1RM |
| `% grasa` desconocido | Calculadora de grasa corporal |

Texto de seguridad:

```text
Estas herramientas son educativas y no reemplazan una evaluación profesional.
```

---

## SEO y contenido de la página

### Meta información

| Campo | Valor |
|-------|-------|
| Title | `Calculadora de Calorías Diarias (TDEE) — TMB y Gasto Diario` |
| Description | `Calcula tus calorías diarias estimadas según tu metabolismo, actividad física y objetivo. Obtén TMB, TDEE y rangos orientativos para mantener peso, crear déficit o usar superávit.` |
| Canonical | `/salud/calculadora-de-calorias-diarias-tdee` |

Evitar claims como "calorías exactas" o "plan perfecto".

### Estructura sugerida

- `h1`: Calculadora de calorías diarias (TDEE)
- Intro breve orientada a uso.
- Calculadora interactiva.
- Qué significan TMB y TDEE.
- Cómo elegir tu nivel de actividad.
- Cómo usar el resultado durante `2 - 3` semanas.
- Ejemplo de cálculo.
- Limitaciones y aviso de salud.
- FAQ.
- Fuentes.

### FAQ sugeridas

- ¿Qué es el TDEE y cómo se calcula?
- ¿Qué es la TMB?
- ¿Cuántas calorías necesito para mantener mi peso?
- ¿Cuántas calorías necesito para perder peso?
- ¿Cuántas calorías necesito para subir de peso o apoyar ganancia muscular?
- ¿Qué nivel de actividad debo elegir?
- ¿Por qué mi peso no cambia aunque coma según mi TDEE?
- ¿Cada cuánto debo recalcular mis calorías?
- ¿Qué fórmula es más precisa para calcular el metabolismo?
- ¿Esta calculadora sirve para adolescentes?

### Schema.org

Agregar JSON-LD para `FAQPage` si las preguntas y respuestas están visibles en
la página.

---

## Implementación en Astro + Tailwind

### Estructura recomendada

```text
src/pages/salud/calculadora-de-calorias-diarias-tdee.astro
src/lib/calculators/tdee.ts
src/lib/calculators/tdee.test.ts
```

### Criterios técnicos

- La página debe ser estática y compatible con Astro SSG.
- La UI se construye con Astro + Tailwind.
- La lógica interactiva puede vivir en un `<script>` de la página o importarse
  desde un módulo cliente.
- La lógica matemática debe separarse en funciones puras.
- No introducir React, Vue, Svelte ni librerías adicionales para esta
  calculadora.
- No usar backend.
- No hacer llamadas de red.
- No añadir Chart.js en el MVP.
- Mantener consistencia visual con las páginas existentes (`BaseLayout`,
  `PageHero`, `Container`, fondo oscuro y acentos sobrios).

### Funciones puras sugeridas

```ts
type FormulaSex = "male" | "female";
type UnitSystem = "metric" | "imperial";
type ActivityLevel =
  | "sedentary"
  | "light"
  | "moderate"
  | "very-active"
  | "extreme";
type Goal =
  | "lose-aggressive"
  | "lose-moderate"
  | "lose-gentle"
  | "maintain"
  | "gain-gentle"
  | "gain-moderate"
  | "gain-high";

interface TdeeInput {
  sex: FormulaSex;
  age: number;
  weightKg: number;
  heightCm: number;
  activityLevel: ActivityLevel;
  goal: Goal;
}

interface TdeeResult {
  bmr: number;
  tdee: number;
  activityFactor: number;
  goalCalories: number;
  goalAdjustmentCalories: number;
  weeklyEnergyEquivalentKg: number;
  warnings: string[];
}

calculateMifflinBmr({ sex, age, weightKg, heightCm })
calculateHarrisBenedictBmr({ sex, age, weightKg, heightCm })
calculateKatchMcArdleBmr({ weightKg, bodyFatPercentage })
calculateTdee(bmr, activityFactor)
calculateGoalCalories(tdee, goal)
estimateWeeklyEnergyEquivalentKg(dailyAdjustmentCalories)
getActivityFactor(activityLevel)
validateTdeeInput(input)
validateGoalCalories({ sex, goalCalories, tdee })
convertKgToLb(kg)
convertLbToKg(lb)
convertCmToIn(cm)
convertInToCm(inches)
convertMetricToImperial({ weightKg, heightCm })
convertImperialToMetric({ weightLb, feet, inches })
parseHealthInput(value)
formatCalories(value)
formatSignedCalories(value)
formatWeight(value, unit)
formatHeight(value, unit)
buildTdeeCopyText(input, result)
```

### Constantes sugeridas

```ts
const ACTIVITY_FACTORS = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  "very-active": 1.725,
  extreme: 1.9,
} as const;

const GOAL_ADJUSTMENTS = {
  "lose-aggressive": -0.2,
  "lose-moderate": -0.15,
  "lose-gentle": -0.1,
  maintain: 0,
  "gain-gentle": 0.05,
  "gain-moderate": 0.1,
  "gain-high": 0.15,
} as const;

const KCAL_PER_KG = 7700;
```

---

## Accesibilidad

- Todos los inputs deben tener `label` visible.
- Los errores deben asociarse con `aria-describedby`.
- El resultado principal debe estar en una región con `aria-live="polite"`.
- Los controles segmentados deben comunicar estado activo con texto, color y
  atributos ARIA.
- Los botones de icono deben incluir `aria-label`.
- El foco visible debe ser claro con Tailwind.
- No depender únicamente del color para comunicar objetivo, advertencia o error.
- La tabla/lista de objetivos debe tener encabezados o etiquetas accesibles.
- La navegación debe funcionar con teclado.
- Las acciones de copiar y limpiar deben informar éxito o error sin depender de
  `alert()`.
- Respetar `prefers-reduced-motion` para transiciones y slider.

---

## Privacidad

- El MVP no debe guardar datos de salud en `localStorage`.
- No enviar peso, altura, edad, sexo usado por fórmula, objetivo ni resultados a
  APIs externas.
- No registrar valores personales en analytics.
- Si se implementa historial en fase futura, preferir `sessionStorage` y
  hacerlo opt-in.
- Si se usa `localStorage` en una fase futura, debe ser opt-in y mostrar texto
  claro: los datos se guardan solo en el navegador del usuario.
- La acción de copiar debe requerir interacción explícita del usuario.
- No pasar edad, peso, altura, sexo usado por fórmula, objetivo ni resultados
  por query params hacia macros o déficit calórico sin una acción explícita del
  usuario.
- Si se añade un flujo "continuar en macros" o "continuar en déficit", debe
  explicar que los datos se usan solo en el navegador y no se registran en
  analytics.

---

## Casos extremos

| Caso | Comportamiento esperado |
|------|-------------------------|
| Edad `< 18` | No calcular TDEE adulto; mostrar nota de salud. |
| Edad `>= 65` | Calcular si los datos son válidos y mostrar nota de menor precisión. |
| Edad `> 100` | Bloquear cálculo. |
| Altura `0` | Error claro antes del cálculo. |
| Peso negativo | Error claro antes del cálculo. |
| Sistema imperial con `in = 12` | Error; pulgadas deben ser menores que 12. |
| TDEE `< 1,000 kcal` | Mostrar resultado solo con datos válidos y advertir que revise los datos. |
| Calorías objetivo `< 1,000 kcal` | Bloquear objetivo. |
| Calorías objetivo bajo mínimos orientativos | Mostrar advertencia prominente. |
| Déficit `> 1,000 kcal/día` | Mostrar advertencia prominente. |
| Actividad extrema + bajo peso | Mostrar advertencia de revisar datos y consultar profesional. |
| Cambio de unidades | Convertir sin perder el valor equivalente. |
| Resultado largo | Debe hacer wrap sin romper layout. |
| Usuario duda entre actividad moderada y alta | Sugerir elegir la menor y ajustar después. |

---

## Criterios de aceptación

| Caso | Inputs | Resultado esperado |
|------|--------|--------------------|
| TDEE mujer ejemplo | Mujer, `28`, `65 kg`, `165 cm`, moderada | TMB `1,380`, TDEE `2,139`. |
| Mantener peso | Mismos inputs, objetivo mantener | Calorías objetivo `2,139`. |
| Pérdida moderada | Mismos inputs, objetivo `-15%` | Calorías objetivo aprox. `1,818`. |
| Superávit moderado | Mismos inputs, objetivo `+10%` | Calorías objetivo aprox. `2,353`; no prometer ganancia muscular automática. |
| TDEE hombre básico | Hombre, `30`, `80 kg`, `180 cm`, sedentario | TMB `1,780`, TDEE `2,136`. |
| Conversión imperial | `143.3 lb`, `5 ft`, `5 in` | Resultado cercano al ejemplo métrico. |
| Edad menor | Edad `16`, datos completos | No calcular TDEE adulto; mostrar nota. |
| Adulto mayor | Edad `70`, datos completos válidos | Calcular y mostrar nota de menor precisión. |
| Peso inválido | `-65 kg` | Bloquear cálculo y mostrar error. |
| Altura inválida | `0 cm` | Bloquear cálculo y mostrar error. |
| Pulgadas inválidas | `5 ft`, `12 in` | Bloquear cálculo y mostrar error. |
| TDEE inusualmente bajo | Datos válidos con TDEE `< 1,000` | Mostrar TMB/TDEE con advertencia de revisar datos, sin bloquear automáticamente. |
| Calorías muy bajas | Objetivo `< 1,000 kcal` | Bloquear objetivo y mantener visible el TDEE válido. |
| Copiar resultado | Resultado válido | Copia texto plano con TMB, TDEE y objetivo. |
| Limpiar | Después de calcular | Campos y resultado vuelven a estado inicial. |
| Mobile | viewport `390px` | Formulario, resultado y tabla no se superponen ni desbordan. |
| Teclado | Navegación por Tab | Todos los controles son alcanzables y operables. |

---

## Pruebas recomendadas

### Unitarias

Si se añade Vitest:

- Fórmula Mifflin-St Jeor para hombres y mujeres.
- Fórmula Harris-Benedict fase 2 para hombres y mujeres.
- Fórmula Katch-McArdle fase 2.
- Cálculo de TDEE con cada nivel de actividad.
- Ajustes por objetivo.
- Estimación semanal usando `7,700 kcal/kg`.
- Conversión kg/lb.
- Conversión cm/in.
- Conversión imperial con ft/in.
- Parsing de coma decimal y unidades pegadas.
- Validaciones de edad, peso, altura y pulgadas.
- Advertencia de adulto mayor.
- Advertencia de TDEE inusualmente bajo sin bloqueo automático.
- Validaciones de calorías objetivo.
- Formato de calorías, peso y altura.
- Texto de copia.

### E2E con Playwright

- Escribir valores y ver resultado en tiempo real.
- Cambiar unidades y verificar conversión.
- Cambiar nivel de actividad y verificar TDEE.
- Cambiar objetivo y verificar fila destacada.
- Ingresar edad menor de 18 y verificar bloqueo adulto.
- Ingresar edad de 65 o más y verificar nota de menor precisión.
- Ver advertencia por calorías muy bajas.
- Copiar resultado.
- Limpiar formulario.
- Validar mensajes de error.
- Validar navegación con teclado.
- Revisar layout en móvil y desktop.

---

## Fuentes de referencia

- Mifflin MD, St Jeor ST, et al. "A new predictive equation for resting energy
  expenditure in healthy individuals":
  https://pubmed.ncbi.nlm.nih.gov/2305711/
- National Academies — Dietary Reference Intakes for Energy, resumen de EER:
  https://nap.nationalacademies.org/read/26818/chapter/2
- NCBI Bookshelf — Factors Affecting Energy Expenditure and Requirements:
  https://www.ncbi.nlm.nih.gov/books/NBK591031/
- NIDDK — Body Weight Planner:
  https://www.niddk.nih.gov/bwp
- CDC — Steps for Losing Weight:
  https://www.cdc.gov/healthy-weight-growth/losing-weight/index.html

---

## Aviso de salud sugerido

Texto visible cerca de los resultados:

```text
Los resultados son estimaciones educativas basadas en fórmulas poblacionales. Tu gasto energético real puede variar por actividad diaria, composición corporal, sueño, estrés, medicamentos, condiciones médicas y adaptación metabólica. Consulta con un profesional de la salud si tienes dudas, síntomas, embarazo, lactancia, antecedentes de trastornos de la conducta alimentaria o una condición médica.
```
