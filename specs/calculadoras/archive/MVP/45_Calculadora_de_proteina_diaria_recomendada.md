# Especificación v2 - Calculadora de proteína diaria recomendada

## Descripción general

Herramienta educativa para estimar un rango diario de proteína para adultos según
peso, objetivo y tipo de actividad. Además del rango, debe ofrecer un punto de
partida práctico, una distribución aproximada por comidas y ejemplos de alimentos
que ayuden a convertir el resultado en acciones cotidianas.

La calculadora debe explicar por qué muestra cada resultado, evitar falsa precisión
y no presentar los rangos altos como una obligación o garantía de resultados.

**Arquitectura:** todo el cálculo ocurre en el cliente. No requiere backend, base
de datos ni llamadas a APIs externas.

---

## Objetivo de producto

La calculadora debe responder con claridad estas preguntas:

1. ¿Qué rango diario de proteína puede servirme como referencia?
2. ¿Por qué recibí ese rango?
3. ¿Qué cantidad práctica puedo usar como punto de partida?
4. ¿Cómo puedo repartirla y alcanzarla con alimentos?

### Principios

- Mostrar rangos orientativos, no una prescripción.
- Diferenciar entre requerimiento general y proteína para apoyar entrenamiento.
- Explicar que consumir más proteína por sí solo no produce pérdida de grasa o
  ganancia muscular.
- Priorizar la seguridad de menores, embarazo/lactancia, enfermedad renal y
  dietas indicadas por profesionales.
- Evitar precisión engañosa: redondear resultados prácticos a múltiplos de `5 g`.
- Mantener coherencia con la calculadora de macros existente.

---

## Alcance recomendado

### MVP

- Peso y sistema de unidades.
- Confirmación de grupo de edad.
- Objetivo.
- Tipo de actividad o entrenamiento.
- Comidas al día.
- Selección opcional de situaciones que requieren orientación individual.
- Rango diario de proteína.
- Punto de partida práctico.
- Distribución aproximada por comida.
- Explicación del rango aplicado.
- Ejemplos de alimentos y combinaciones orientativas.
- Avisos contextuales de seguridad.
- Integración visible con la calculadora de macros.
- Copiar resultado y limpiar formulario.

### Fase 2

- Distribución editable y desigual por comida.
- Preferencias alimentarias para personalizar ejemplos.
- Comparador de combinaciones de alimentos.
- Historial en `sessionStorage`.

### Fuera de alcance

- Diagnosticar deficiencias o enfermedades.
- Prescribir dietas médicas.
- Recomendar suplementos.
- Calcular necesidades para menores de edad.
- Sustituir indicaciones de profesionales de salud.
- Prometer pérdida de grasa, ganancia muscular o mejoras de salud.
- Calcular automáticamente con peso ideal, masa magra o peso objetivo sin una
  metodología específica y validada.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL pública recomendada | `/salud/calculadora-de-proteina-diaria` |
| Archivo Astro recomendado | `src/pages/salud/calculadora-de-proteina-diaria.astro` |
| Lógica de cálculo | `src/lib/calculators/salud/calculadora-de-proteina-diaria/dailyProtein.ts` |
| Pruebas unitarias | `src/lib/calculators/salud/calculadora-de-proteina-diaria/dailyProtein.test.ts` |
| Categoría | `salud` |
| Locale base | `es-MX` |

La calculadora de proteína y la calculadora de macros deben compartir constantes
de proteína o documentar explícitamente cualquier diferencia. No deben producir
recomendaciones contradictorias para la misma combinación de peso, objetivo y
entrenamiento.

---

## Experiencia mobile first

### Jerarquía en móvil

1. Título y descripción breve.
2. Aviso compacto: `Diseñada para adultos sanos`.
3. Formulario en una sola columna.
4. Botón principal de ancho completo.
5. Resultado principal inmediatamente después del formulario.
6. Explicación del cálculo.
7. Ejemplos para alcanzar el resultado.
8. Avisos de seguridad, fuentes, FAQs y calculadoras relacionadas.

Al calcular, mover el foco al encabezado del resultado para usuarios de teclado y
tecnologías de asistencia. No usar un resultado fijo que tape campos o controles
en pantallas pequeñas.

### Controles

- Peso: campo numérico con `inputmode="decimal"`.
- Unidades: control segmentado `kg / lb`, con objetivos táctiles de al menos
  `44 x 44 px`.
- Grupo de edad: selector requerido.
- Objetivo: tarjetas o botones seleccionables con descripción breve.
- Actividad: tarjetas o botones seleccionables con descripción breve.
- Comidas: control `-  3  +` con alternativa accesible mediante campo numérico.
- Situaciones de salud: checkboxes compactos.
- Botón principal: `Calcular mi referencia`.
- Acciones secundarias: `Copiar resultado` y `Limpiar`.

En escritorio, el formulario y el resultado pueden mostrarse en dos columnas. En
móvil, el resultado siempre aparece debajo del formulario.

---

## Flujo principal MVP

**Ejemplo:** Peso `75 kg`, soy adulto, entreno fuerza de forma regular y busco
ganar músculo. ¿Qué rango de proteína diaria puedo usar como referencia y cómo
puedo repartirlo?

### Inputs del MVP

| Campo | Tipo | Valores o rango válido | Valor por defecto |
|-------|------|-------------------------|-------------------|
| Peso | Texto numérico | `20-250 kg` o equivalente en lb | vacío |
| Sistema de unidades | Segmentado | `kg`, `lb` | `kg` |
| Grupo de edad | Selector | `18 años o más`, `Menor de 18 años` | vacío |
| Objetivo | Tarjetas/select | `Salud y mantenimiento`, `Perder grasa`, `Ganar músculo` | `Salud y mantenimiento` |
| Actividad | Tarjetas/select | `Sin entrenamiento estructurado`, `Actividad o entrenamiento regular`, `Entrenamiento de fuerza regular` | `Actividad o entrenamiento regular` |
| Comidas al día | Stepper/campo numérico | `1-8` | `3` |
| Situaciones de salud | Checkboxes opcionales | `Embarazo o lactancia`, `Enfermedad renal`, `Dieta indicada por profesional` | ninguna |

#### Microcopy de opciones

- **Salud y mantenimiento:** referencia general para mantener hábitos y peso.
- **Perder grasa:** puede ayudar a conservar masa muscular, pero no sustituye un
  déficit calórico adecuado.
- **Ganar músculo:** requiere entrenamiento de fuerza; más proteína por sí sola
  no genera músculo.
- **Sin entrenamiento estructurado:** actividad cotidiana sin sesiones regulares.
- **Actividad o entrenamiento regular:** cardio, deporte o entrenamiento mixto
  varias veces por semana.
- **Entrenamiento de fuerza regular:** sesiones de fuerza progresivas varias
  veces por semana.

### Outputs principales

- Punto de partida práctico en gramos por día.
- Rango orientativo en gramos por día.
- Rango aplicado en `g/kg`.
- Cantidad aproximada por comida.
- Resumen de las elecciones del usuario.
- Explicación breve de por qué se eligió ese rango.
- Avisos contextuales.
- Ejemplos de alimentos y combinaciones.

### Orden visual del resultado

```text
Punto de partida práctico
140 g/día

Rango orientativo: 120-165 g/día
Referencia usada: 1.6-2.2 g/kg
Con 3 comidas: aproximadamente 45-50 g por comida

Elegimos este rango porque indicaste entrenamiento de fuerza regular
y el objetivo de ganar músculo.
```

El punto de partida debe dominar visualmente. El rango, la distribución y la
explicación son detalles secundarios. Mostrar siempre la palabra
`aproximadamente` en la distribución por comidas.

---

## Modelo de cálculo

### Matriz de rangos orientativos

La actividad sí debe cambiar el resultado. Cada combinación debe corresponder a
un rango explícito y comprobable.

| Objetivo | Sin entrenamiento estructurado | Actividad o entrenamiento regular | Entrenamiento de fuerza regular |
|----------|--------------------------------|-----------------------------------|----------------------------------|
| Salud y mantenimiento | `0.8-1.2 g/kg` | `1.2-1.6 g/kg` | `1.6-2.0 g/kg` |
| Perder grasa | `1.2-1.6 g/kg` | `1.4-1.8 g/kg` | `1.6-2.2 g/kg` |
| Ganar músculo | `1.2-1.6 g/kg` | `1.4-1.8 g/kg` | `1.6-2.2 g/kg` |

Cuando el usuario elija `Ganar músculo` sin entrenamiento de fuerza regular,
mostrar:

> Consumir proteína suficiente puede apoyar tu alimentación, pero ganar músculo
> requiere entrenamiento de fuerza progresivo.

Cuando el usuario elija `Perder grasa`, mostrar:

> La proteína puede ayudar a conservar masa muscular y mejorar saciedad, pero la
> pérdida de grasa depende principalmente de mantener un déficit calórico
> adecuado.

### Fórmulas

```text
peso_kg = peso ingresado o peso_lb * 0.45359237

proteina_min_exacta = peso_kg * rango_min
proteina_max_exacta = peso_kg * rango_max

proteina_min_mostrada = redondear_a_multiplo_de_5(proteina_min_exacta)
proteina_max_mostrada = redondear_a_multiplo_de_5(proteina_max_exacta)

punto_practico_exacto = (proteina_min_exacta + proteina_max_exacta) / 2
punto_practico_mostrado = redondear_a_multiplo_de_5(punto_practico_exacto)

proteina_por_comida_exacta = punto_practico_exacto / comidas
proteina_por_comida_mostrada = redondear_a_multiplo_de_5(proteina_por_comida_exacta)
```

El punto práctico es una **heurística de producto** basada en el centro del
rango; no debe describirse como el valor óptimo o científicamente exacto.

Si por redondeo el punto práctico queda fuera del rango mostrado, ajustarlo al
límite mostrado más cercano.

### Pesos extremos y contexto individual

La fórmula escala directamente con el peso corporal y puede generar cantidades
muy altas o poco representativas. Si el peso es menor o igual a `35 kg` o mayor
o igual a `150 kg`, calcular el resultado, pero mostrar:

> En algunos pesos corporales, calcular únicamente con el peso total puede
> sobreestimar una referencia útil. Un profesional puede ayudarte a elegir un
> criterio individual.

No cambiar silenciosamente a peso objetivo, peso ideal o masa magra.

---

## Seguridad, validaciones y estados

### Estados bloqueantes

- Peso vacío, no numérico o fuera de `20-250 kg`.
- Peso en lb fuera del equivalente de `20-250 kg`.
- Grupo de edad sin seleccionar.
- Menor de `18 años`.
- Comidas fuera de `1-8`.

Para menores de edad, no calcular y mostrar:

> Las necesidades de proteína durante el crecimiento dependen de edad, desarrollo
> y contexto de salud. Consulta a un profesional de salud.

### Situaciones que requieren orientación individual

Si el usuario selecciona embarazo/lactancia, enfermedad renal o dieta indicada
por un profesional:

- No presentar el punto práctico como recomendación personal.
- Mantener visible el rango general únicamente como información educativa.
- Mostrar el aviso correspondiente antes del resultado.
- No destacar ni incentivar el extremo alto del rango.
- Indicar que debe seguir la orientación de su profesional.

Mensajes sugeridos:

- **Embarazo o lactancia:** las necesidades cambian según etapa y contexto; usa
  orientación profesional individual.
- **Enfermedad renal:** la cantidad adecuada puede requerir límites específicos;
  no aumentes proteína basándote solo en esta calculadora.
- **Dieta indicada por profesional:** prioriza el plan que recibiste sobre este
  resultado educativo.

### Advertencias no bloqueantes

- Peso menor o igual a `35 kg` o mayor o igual a `150 kg`.
- Una sola comida al día.
- Objetivo de ganar músculo sin entrenamiento de fuerza.
- Rango cuyo extremo alto sea mayor a `2.0 g/kg`.

### Reglas generales

- No presentar el rango alto como obligación.
- No usar lenguaje como `debes consumir`, `cantidad ideal` o `garantiza`.
- Permitir coma y punto decimal.
- Aceptar entradas con sufijos conocidos como `kg`, `lb` o `libras`.
- Al cambiar de unidad, convertir el valor actual sin perder precisión interna.
- Redondear únicamente para mostrar; calcular con valores sin redondear.
- Mostrar errores junto al campo y un resumen accesible si existen varios.

---

## Cómo ayudar al usuario a alcanzar el resultado

Los ejemplos de alimentos forman parte del MVP porque convierten gramos abstractos
en decisiones prácticas.

### Reglas de contenido

- Aclarar que `100 g de alimento` no equivalen a `100 g de proteína`.
- Identificar todos los valores como aproximados.
- Mostrar opciones animales y vegetales.
- No presentar alimentos individuales como mejores o peores.
- No generar un plan alimentario completo.
- Recordar que las etiquetas y preparaciones pueden cambiar los valores.

### Ejemplos orientativos iniciales

| Alimento | Proteína aproximada |
|----------|----------------------|
| 100 g de pechuga de pollo cocida | `31 g` |
| 100 g de atún enlatado drenado | `25 g` |
| 2 huevos grandes | `12 g` |
| 200 g de yogur griego natural | `18-20 g` |
| 1 taza de lentejas cocidas | `17-18 g` |
| 150 g de tofu firme | `18-24 g` |

Mostrar entre `3` y `5` tarjetas de ejemplo para el punto práctico calculado.
Las combinaciones son ilustrativas y no necesitan sumar exactamente el resultado.

---

## Integración con otras calculadoras

La calculadora de macros ya existe y debe enlazarse desde el resultado:

> ¿También quieres distribuir carbohidratos y grasas? Usa la calculadora de
> macros.

Enlace: `/salud/calculadora-de-macros`

También puede enlazarse la calculadora de déficit calórico cuando el objetivo sea
perder grasa.

Los valores predeterminados de proteína en la calculadora de macros deben
revisarse para mantener coherencia con esta matriz. Si no pueden compartirse,
documentar en ambas páginas que la calculadora de macros usa un punto de partida
editable distinto.

---

## Accesibilidad

- Todos los controles deben funcionar con teclado.
- Usar `fieldset` y `legend` para grupos de opciones.
- Las tarjetas seleccionables deben exponer su estado con controles nativos o
  `aria-pressed`.
- Objetivos táctiles de al menos `44 x 44 px`.
- Asociar errores mediante `aria-describedby`.
- Usar `aria-live="polite"` para confirmar que el resultado cambió.
- Mover el foco al resultado después de un cálculo enviado por el usuario.
- No depender únicamente del color para comunicar selección, error o advertencia.
- Mantener contraste suficiente en texto secundario y avisos.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de proteína diaria por peso y objetivo` |
| Meta description | `Calcula un rango orientativo de proteína diaria según tu peso, actividad y objetivo. Incluye gramos por día, por comida y ejemplos de alimentos.` |
| H1 | `Calculadora de proteína diaria` |
| Keyword principal | `calculadora proteina diaria` |
| Keywords secundarias | `proteina por kg`, `cuanta proteina necesito`, `gramos de proteina al dia`, `proteina por comida` |

### Contenido explicativo recomendado

- Qué significa calcular proteína por kg.
- Diferencia entre referencia general y rango para entrenamiento.
- Cómo interpretar el punto práctico y el rango.
- Por qué más proteína no siempre aporta más beneficio.
- Cómo repartir proteína durante el día sin exigir cantidades exactas.
- Cuándo buscar orientación profesional.

### FAQs sugeridas

- ¿Cuánta proteína necesito por kg de peso?
- ¿Qué diferencia hay entre el rango y el punto de partida?
- ¿Debo usar el rango bajo o alto?
- ¿La proteína diaria cambia si entreno fuerza?
- ¿Consumir más proteína ayuda a ganar músculo?
- ¿La proteína ayuda a perder grasa?
- ¿Tengo que repartirla exactamente entre comidas?
- ¿Qué pasa si tengo enfermedad renal?
- ¿Puedo usar esta calculadora durante embarazo o lactancia?
- ¿Por qué la calculadora usa mi peso corporal?

---

## Fuentes y transparencia

La página debe enlazar fuentes concretas, no mencionar únicamente nombres
genéricos. Referencias iniciales:

| Uso | Fuente |
|-----|--------|
| Referencia general para adultos | [National Academies: Dietary Reference Intakes for Protein and Amino Acids](https://nap.nationalacademies.org/read/10490/chapter/12) |
| Proteína y ejercicio | [International Society of Sports Nutrition: Position Stand on Protein and Exercise](https://link.springer.com/article/10.1186/s12970-017-0177-8) |
| Proteína y entrenamiento de fuerza | [British Journal of Sports Medicine: Systematic Review and Meta-analysis](https://bjsm.bmj.com/content/52/6/376) |
| Seguridad en enfermedad renal | [KDIGO 2024 Clinical Practice Guideline for CKD](https://kdigo.org/wp-content/uploads/2024/03/KDIGO-2024-CKD-Guideline.pdf) |
| Ejemplos de alimentos | [USDA FoodData Central](https://fdc.nal.usda.gov/) |

En la interfaz, incluir una sección `Cómo calculamos tu resultado` que muestre:

- Peso convertido a kg.
- Combinación de objetivo y actividad.
- Rango aplicado.
- Fórmula utilizada.
- Aclaración de que el punto práctico es el centro redondeado del rango.

---

## Analítica recomendada

Registrar únicamente eventos de interacción sin guardar datos sensibles:

- Cálculo completado.
- Error de validación por tipo.
- Unidad seleccionada.
- Objetivo seleccionado.
- Actividad seleccionada.
- Resultado copiado.
- Clic a calculadora de macros.
- Clic a calculadora de déficit calórico.

No registrar peso, selección de enfermedad renal, embarazo/lactancia ni otras
respuestas de salud.

---

## Pruebas sugeridas

### Cálculo y matriz

- `70 kg`, mantenimiento y sin entrenamiento produce `0.8-1.2 g/kg` y rango
  mostrado `55-85 g`.
- `70 kg`, mantenimiento y actividad regular produce `1.2-1.6 g/kg` y rango
  mostrado `85-110 g`.
- `75 kg`, ganar músculo y fuerza produce `1.6-2.2 g/kg` y rango mostrado
  `120-165 g`.
- `75 kg`, ganar músculo y fuerza produce punto práctico mostrado `145 g`.
- `80 kg`, perder grasa y fuerza produce `1.6-2.2 g/kg`.
- Cada celda de la matriz devuelve exactamente el rango documentado.

### Conversión y redondeo

- `150 lb` se convierte internamente a aproximadamente `68.04 kg`.
- Cambiar entre kg y lb conserva el valor interno.
- Rango, punto práctico y gramos por comida se redondean a múltiplos de `5 g`.
- El punto práctico mostrado nunca queda fuera del rango mostrado.
- Los cálculos internos no usan valores previamente redondeados.

### Distribución

- `145 g` en `3` comidas muestra aproximadamente `50 g` por comida.
- Una comida genera una advertencia no bloqueante.
- Comidas `0` y `9` generan error.

### Seguridad y validación

- Peso vacío muestra error requerido.
- Peso fuera de rango muestra error.
- Menor de edad bloquea el cálculo.
- Enfermedad renal muestra aviso antes del resultado y no incentiva el rango alto.
- Embarazo/lactancia muestra aviso individual.
- Dieta indicada por profesional prioriza esa indicación.
- Peso `35 kg` o menor muestra advertencia contextual.
- Peso `150 kg` o mayor muestra advertencia contextual.
- Ganar músculo sin fuerza muestra aviso sobre entrenamiento.

### Interfaz y accesibilidad

- El flujo funciona completamente con teclado.
- Tras calcular, el foco llega al resultado.
- Los errores están asociados a sus campos.
- El resultado se anuncia sin interrumpir al usuario.
- En viewport móvil, formulario y resultado aparecen en una sola columna.
- Ningún control táctil principal mide menos de `44 x 44 px`.
- Copiar resultado incluye rango, punto práctico, distribución y advertencias
  relevantes.
