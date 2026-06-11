# Especificación v2 - Calculadora de agua diaria recomendada

## Descripción general

Herramienta educativa para estimar un **rango orientativo de líquidos para
beber durante el día** en adultos, usando peso y el contexto del día. El
resultado debe ayudar al usuario a entender de dónde sale la estimación,
convertirla a recipientes cotidianos y distribuirla de forma flexible.

La calculadora no debe presentar una cifra como necesidad exacta ni como límite
seguro. Las necesidades varían ampliamente; además, otras bebidas y alimentos
también aportan agua, por lo que no se debe forzar el extremo alto del rango.

**Arquitectura:** todo el cálculo ocurre en el cliente. No requiere backend,
base de datos ni llamadas a APIs externas.

---

## Objetivo de producto

- Dar una referencia comprensible sin aparentar precisión clínica.
- Mostrar un rango, no una cifra rígida.
- Explicar la base y cada ajuste aplicado.
- Convertir el resultado a vasos o botellas que el usuario utiliza.
- Ofrecer un plan diario flexible y acciones prácticas.
- Detectar situaciones en las que no corresponde generar una meta genérica.
- Generar una página estática optimizada para SEO en Astro.

## No objetivos

- Diagnosticar deshidratación o sobrehidratación.
- Prescribir una cantidad médica de líquidos.
- Sustituir indicaciones profesionales o restricciones de líquidos.
- Calcular necesidades para menores de edad.
- Recomendar reponer todo el peso perdido durante ejercicio sin evaluación.
- Presentar una cantidad que deba beberse de una sola vez.

---

## Principios de comunicación

- Usar preferentemente **líquidos para beber** en lugar de afirmar que todo el
  resultado debe consumirse como agua simple.
- Utilizar expresiones como `rango orientativo`, `referencia inicial` y
  `ajusta según tu contexto`.
- No mostrar mensajes alarmistas por estar fuera del rango.
- No usar el color por sí solo para comunicar estados o advertencias.
- Mostrar siempre que otras bebidas y alimentos también aportan agua y que la
  calculadora no intenta medir ese aporte.
- Explicar que sed, comidas, actividad, calor, enfermedad y recomendaciones
  médicas pueden modificar la necesidad individual.

---

## Alcance recomendado

### MVP

- Confirmación de uso exclusivo para adultos.
- Comprobación de restricciones o situaciones que requieren orientación
  individual.
- Peso y sistema de unidades.
- Ejercicio realizado o previsto durante el día.
- Duración aproximada del ejercicio y sudoración percibida.
- Exposición prolongada al calor.
- Recipiente habitual con opciones rápidas y valor personalizado.
- Rango orientativo en litros y mililitros.
- Equivalencia aproximada en recipientes.
- Desglose transparente de base y ajustes.
- Plan diario flexible.
- Avisos de salud y límites de la estimación.
- Probar ejemplo, copiar resultado y limpiar formulario.

### Fase 2

- Ajustes para embarazo y lactancia, únicamente después de revisión editorial
  o profesional.
- Estimación personalizada de tasa de sudor usando peso antes y después del
  ejercicio, líquidos ingeridos y duración.
- Historial opcional en `sessionStorage`.
- Recordatorio exportable como texto.
- Comparación con referencias poblacionales según variables requeridas por la
  fuente.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL pública recomendada | `/salud/calculadora-de-agua-diaria` |
| Archivo Astro recomendado | `src/pages/salud/calculadora-de-agua-diaria.astro` |
| Lógica de cálculo | `src/lib/calculators/salud/calculadora-de-agua-diaria/dailyWater.ts` |
| Pruebas unitarias | `src/lib/calculators/salud/calculadora-de-agua-diaria/dailyWater.test.ts` |
| Categoría | `salud` |
| Locale base | `es-MX` |

---

## Flujo principal

1. El usuario confirma que es adulto y que no tiene una indicación médica de
   limitar o controlar líquidos.
2. Ingresa su peso.
3. Describe el contexto del día: ejercicio, duración, sudoración y calor.
4. Elige el tamaño de su vaso o botella habitual.
5. La calculadora muestra un rango orientativo, el desglose, equivalencias y
   una distribución flexible durante el día.

**Ejemplo:** peso `70 kg`, adulto sin restricción médica, realizará `60 min` de
ejercicio con sudoración moderada, sin exposición prolongada al calor y usa una
botella de `500 ml`.

---

## Comportamiento mobile first

### Estructura

- Usar un flujo vertical y numerado:
  `1. Antes de calcular`, `2. Datos básicos`, `3. Contexto de hoy`,
  `4. Tu recipiente`.
- Mostrar el formulario antes del resultado en móvil.
- En pantallas amplias, permitir dos columnas con formulario y resultado.
- Mantener el contenido esencial dentro de una sola columna legible.
- Evitar tablas horizontales dentro del resultado móvil.

### Controles

- Controles y botones con altura mínima de `48 px`.
- Botón principal de ancho completo en móvil.
- Usar botones segmentados, tarjetas o chips con descripciones breves para las
  decisiones importantes.
- No seleccionar ejercicio o calor por defecto.
- Mostrar campos de duración y sudoración únicamente si el usuario indica que
  hará ejercicio.
- Ofrecer recipientes rápidos: `250 ml`, `500 ml`, `750 ml` y `Personalizado`.
- Usar `inputmode="decimal"` o `inputmode="numeric"` según corresponda.

### Resultado e interacción

- Al calcular correctamente, mover el foco al encabezado del resultado y
  desplazarlo a la vista.
- Mostrar primero el rango en litros; después recipientes, desglose, plan y
  avisos.
- Mantener una región `aria-live="polite"` para comunicar cálculo y copiado.
- Los errores deben aparecer junto al campo y utilizar `aria-invalid`.
- `Limpiar` debe restaurar el estado inicial y devolver el foco al primer
  control.

---

## Inputs del MVP

| Campo | Tipo | Valores o rango | Valor por defecto |
|-------|------|-----------------|-------------------|
| Confirmación de adulto | Checkbox obligatorio | Confirmado | Sin confirmar |
| Situaciones especiales | Selección múltiple | Restricción médica, enfermedad renal/cardiaca, embarazo, lactancia | Ninguna marcada |
| Sistema de unidades | Botón segmentado | `kg`, `lb` | `kg` |
| Peso | Texto numérico | `30-250 kg` o equivalente | Vacío |
| ¿Harás ejercicio hoy? | Botón segmentado | `Sí`, `No` | Sin seleccionar |
| Duración de ejercicio | Texto numérico condicional | `1-300 min` | Vacío |
| Sudoración percibida | Tarjetas condicionales | `Poca`, `Moderada`, `Mucha` | Sin seleccionar |
| Exposición prolongada al calor | Botón segmentado | `Sí`, `No` | Sin seleccionar |
| Tamaño de recipiente | Opciones rápidas o texto numérico | `100-2000 ml` | `500 ml` |

### Definiciones visibles para el usuario

- **Poca sudoración:** ropa casi seca y pocas gotas visibles.
- **Sudoración moderada:** sudor visible y ropa parcialmente húmeda.
- **Mucha sudoración:** ropa muy húmeda o sudor abundante.
- **Exposición prolongada al calor:** varias horas en un ambiente caluroso,
  especialmente al aire libre o realizando actividad.

Estas descripciones son orientativas y no equivalen a medir la tasa de sudor.

---

## Situaciones especiales y estados de bloqueo

### Restricción médica o enfermedad renal/cardiaca

No generar una meta personalizada. Mostrar:

> Una recomendación general podría contradecir tu indicación médica. Sigue el
> límite o plan indicado por tu profesional de salud.

Se puede mantener visible contenido educativo general, pero no mostrar litros,
vasos ni plan diario calculado.

### Embarazo o lactancia

En el MVP no aplicar un ajuste automático. Mostrar:

> Las necesidades pueden cambiar durante el embarazo o la lactancia. Esta
> versión no calcula ese ajuste; usa el resultado solo como contexto y consulta
> una recomendación individual.

El resultado puede mostrarse con esta advertencia destacada únicamente si la
revisión editorial aprueba este comportamiento. De lo contrario, bloquearlo
igual que una restricción médica.

### Menores de edad

Si no se confirma que el usuario es adulto, no calcular. Mostrar:

> Esta calculadora está diseñada para adultos. Las necesidades de menores deben
> revisarse con una fuente o profesional apropiado.

---

## Metodología de cálculo

### Regla editorial obligatoria

Los coeficientes siguientes son una **heurística editorial**, no una Dietary
Reference Intake ni una prescripción médica. Deben ser revisados y aprobados
antes de publicar. La interfaz y el contenido deben identificar la metodología
como una estimación.

### Base por peso

Usar un rango base en lugar de una cifra única:

```text
base_baja_ml = peso_kg * 30
base_alta_ml = peso_kg * 35
```

No mostrar `peso × 35 ml` como necesidad exacta.

### Ajuste contextual por ejercicio

El ajuste depende de la duración y de la sudoración percibida. Los intervalos
son editoriales y requieren revisión:

```text
poca = 200-400 ml por hora
moderada = 400-700 ml por hora
mucha = 700-1000 ml por hora

horas_ejercicio = duracion_min / 60
ajuste_ejercicio_bajo = horas_ejercicio * tasa_baja
ajuste_ejercicio_alto = horas_ejercicio * tasa_alta
```

El resultado debe explicar que una medición de tasa de sudor individual es más
útil que esta clasificación.

### Ajuste contextual por calor

Para evitar sumar dos veces la misma pérdida:

- Si no hay ejercicio y sí hay exposición prolongada al calor, ampliar el rango
  editorial en `250-500 ml`.
- Si hay ejercicio y calor, no sumar un ajuste fijo adicional. Ampliar solo el
  extremo superior del ajuste de ejercicio en `250 ml` y explicar que calor y
  sudoración pueden solaparse.

Este ajuste también requiere revisión editorial antes de publicar.

### Resultado

```text
total_bajo_ml = base_baja_ml + ejercicio_bajo_ml + calor_bajo_ml
total_alto_ml = base_alta_ml + ejercicio_alto_ml + calor_alto_ml

recipientes_bajos = total_bajo_ml / recipiente_ml
recipientes_altos = total_alto_ml / recipiente_ml
```

### Redondeo

- Litros: una decimal.
- Mililitros: múltiplos de `50 ml`.
- Recipientes: una decimal.
- Mantener los valores exactos internamente y redondear solo al presentar.

---

## Límites de seguridad de la experiencia

- No describir el extremo alto como objetivo que deba alcanzarse.
- Mostrar que no se deben beber grandes cantidades de golpe.
- Incluir un aviso visible sobre el riesgo de beber demasiado rápidamente.
- No presentar reglas por hora como instrucciones universales.
- No calcular para ejercicios de más de `300 min`; recomendar una estrategia
  individual para esfuerzos prolongados.
- No interpretar color de orina, sed u otros signos como diagnóstico.
- Si el resultado supera `6 L/día`, no mostrarlo como meta normal. Mostrar un
  estado de revisión de datos y orientación profesional.
- Si cualquier ajuste contextual supera la base baja, mostrar un aviso de alta
  variabilidad y recomendar una medición individual.

El umbral de `6 L/día` es una protección de producto y debe revisarse antes de
publicar; no representa un límite clínico universal.

---

## Outputs principales

### Resumen

- Rango orientativo de líquidos en litros por día.
- Equivalencia aproximada en recipientes.
- Mensaje permanente:
  `Otras bebidas y alimentos también aportan agua; no necesitas forzar el extremo alto`.

### Desglose

- Rango base estimado por peso.
- Ajuste estimado por ejercicio, si aplica.
- Ajuste por calor, si aplica.
- Explicación de posibles solapamientos.
- Datos utilizados y metodología.

### Plan diario flexible

Mostrar una distribución no prescriptiva del punto medio del rango:

| Momento | Porcentaje orientativo |
|---------|------------------------|
| Mañana | `30%` |
| Mediodía y comida | `30%` |
| Tarde | `25%` |
| Noche | `15%` |

El plan debe:

- Presentarse como ejemplo flexible.
- Evitar sugerir beber grandes cantidades justo antes de dormir.
- Repartir el ajuste de ejercicio alrededor de la actividad sin convertirlo en
  una instrucción médica.
- Poder ocultarse si existe un estado de bloqueo.

### Orientación práctica

- Beber de forma distribuida durante el día.
- Ajustar según sed, comidas, actividad, calor e indicaciones médicas.
- Considerar una estrategia individual para ejercicio prolongado o sudoración
  abundante.
- No intentar alcanzar rápidamente una cifra pendiente al final del día.

---

## Estados de interfaz

### Inicial

- Explicar en una frase qué calcula y qué no.
- Resultado en estado vacío con un ejemplo visual breve.
- Botones `Probar ejemplo` y `Limpiar`.

### Incompleto o inválido

- No calcular parcialmente.
- Mantener los valores introducidos.
- Mostrar mensajes específicos junto a los campos.
- Enviar el foco al primer error al intentar calcular.

### Válido

- Mostrar resumen, desglose, equivalencias, plan y avisos aplicables.
- Habilitar `Copiar resultado`.
- El texto copiado debe incluir que es una estimación orientativa.

### Bloqueado

- Ocultar cifras y equivalencias calculadas.
- Mostrar el motivo y una acción segura.
- Permitir limpiar o cambiar la selección.

---

## Validaciones

- Confirmación de adulto obligatoria.
- Las situaciones especiales deben poder marcarse de forma independiente.
- Peso entre `30` y `250 kg`, o equivalente en libras.
- Aceptar coma o punto decimal y etiquetas comunes como `kg` o `lb`.
- Ejercicio y calor deben seleccionarse explícitamente; no asumir valores.
- Duración obligatoria solo cuando ejercicio sea `Sí`.
- Sudoración obligatoria solo cuando ejercicio sea `Sí`.
- Duración entre `1` y `300 min`.
- Recipiente entre `100` y `2000 ml`.
- Rechazar números negativos, infinitos y valores no numéricos.
- Al cambiar de unidades, convertir un peso válido sin perder precisión
  interna.

---

## Accesibilidad

- Asociar cada campo con `label`, ayuda y error mediante `aria-describedby`.
- Usar `fieldset` y `legend` para grupos de decisiones.
- Reflejar selección en botones con `aria-pressed`.
- Mantener orden de foco lógico.
- Permitir completar el flujo solo con teclado.
- No depender de iconos, colores o posición para entender el resultado.
- Anunciar resultado, bloqueo y copiado con regiones vivas no intrusivas.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de agua diaria: rango orientativo de líquidos` |
| Meta description | `Estima un rango orientativo de líquidos para beber según tu peso, ejercicio, sudoración y calor. Consulta litros, botellas y un plan flexible.` |
| H1 | `Calculadora de agua diaria` |
| Keyword principal | `calculadora agua diaria` |
| Keywords secundarias | `cuanta agua tomar al dia`, `agua por peso`, `litros de agua diarios`, `cuantas botellas de agua tomar` |

### Contenido editorial requerido

- Diferencia entre agua simple, otros líquidos y agua presente en alimentos.
- Por qué la calculadora no resta automáticamente el agua de los alimentos.
- Por qué no existe una cifra universal para todas las personas.
- Cómo influyen ejercicio, sudoración y calor.
- Por qué una tasa de sudor medida supera a una categoría percibida.
- Riesgos de beber grandes cantidades rápidamente.
- Cuándo seguir una indicación médica en lugar de una calculadora.

### FAQs sugeridas

- ¿El resultado incluye agua de alimentos y otras bebidas?
- ¿Debo alcanzar siempre el extremo alto del rango?
- ¿Cómo cambia la estimación si hago ejercicio?
- ¿Cómo puedo estimar mi tasa de sudor?
- ¿Qué pasa si tengo restricción médica de líquidos?
- ¿Puedo beber toda el agua pendiente al final del día?
- ¿Cuántos vasos o botellas son un litro?

---

## Referencias y revisión editorial

Fuentes mínimas que deben mostrarse y revisarse antes de publicar:

- National Academies, *Dietary Reference Intakes for Water, Potassium, Sodium,
  Chloride, and Sulfate*:
  `https://www.nationalacademies.org/read/10925/chapter/6`
- CDC, *About Water and Healthier Drinks*:
  `https://www.cdc.gov/healthy-weight-growth/water-healthy-drinks/index.html`
- CDC/NIOSH, recomendaciones para exposición laboral al calor:
  `https://www.cdc.gov/niosh/heat-stress/recommendations/index.html`
- American College of Sports Medicine, *Exercise and Fluid Replacement*:
  `https://pubmed.ncbi.nlm.nih.gov/17277604/`

Antes de implementar, la revisión debe confirmar:

- Coeficientes del rango base por peso.
- Rangos editoriales de sudoración.
- Ajustes por calor y tratamiento del solapamiento.
- Comportamiento para embarazo y lactancia.
- Umbrales de protección y mensajes de seguridad.

---

## Pruebas unitarias sugeridas

### Cálculo

- `70 kg` produce un rango base de `2100-2450 ml`.
- `60 min` de sudoración moderada añade `400-700 ml`.
- Ejercicio con calor no suma el ajuste completo de calor dos veces.
- Calor sin ejercicio añade el rango editorial definido.
- Vaso de `250 ml` y botella de `500 ml` convierten correctamente.
- El redondeo de presentación no modifica los cálculos internos.

### Validación

- No calcula sin confirmar que el usuario es adulto.
- No calcula con restricción médica o enfermedad renal/cardiaca.
- Embarazo/lactancia sigue el comportamiento aprobado.
- Peso fuera de rango muestra error.
- Duración solo se exige cuando hay ejercicio.
- Sudoración solo se exige cuando hay ejercicio.
- Recipiente fuera de rango muestra error.
- Entradas con coma decimal y unidades comunes se normalizan correctamente.
- Resultado superior al umbral de protección muestra estado de revisión.

### Interacción y accesibilidad

- No hay actividad ni calor seleccionados por defecto.
- Campos condicionales aparecen y desaparecen correctamente.
- Al calcular, el foco llega al encabezado del resultado.
- Al enviar datos inválidos, el foco llega al primer error.
- Limpiar restaura el estado inicial.
- Copiar incluye el rango, contexto y aviso de estimación.
- Los estados pueden comprenderse sin depender del color.

---

## Criterios de aceptación del MVP

- El usuario puede completar el cálculo cómodamente en una pantalla móvil de
  `320 px` de ancho sin desplazamiento horizontal.
- Ninguna situación médica bloqueante produce una meta numérica.
- El resultado diferencia claramente líquidos totales de agua simple.
- Cada ajuste mostrado puede rastrearse hasta un input del usuario.
- El rango y el plan se presentan como referencias flexibles.
- La metodología, sus límites y las fuentes están visibles en la página.
- Todos los coeficientes y umbrales editoriales han sido revisados antes de
  publicar.
