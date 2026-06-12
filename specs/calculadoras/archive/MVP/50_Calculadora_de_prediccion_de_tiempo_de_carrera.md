# Especificación v2 - Calculadora de predicción de tiempo de carrera

## Descripción general

Herramienta para estimar el rendimiento probable en una distancia objetivo a
partir de una marca reciente en otra distancia. Debe servir para 1K, 1 milla,
5K, 10K, 15K, medio maratón, maratón y distancias personalizadas.

La calculadora usa la fórmula Riegel para responder:

- ¿Qué tiempo podría hacer en otra distancia?
- ¿Qué ritmo promedio requeriría ese resultado?
- ¿Cuánto tendría que reducir el ritmo respecto a mi marca de referencia?
- ¿Qué factores hacen que la predicción sea más o menos confiable?

La predicción es una estimación deportiva, no una garantía. El resultado real
depende, entre otros factores, del entrenamiento específico para la distancia,
fatiga, estrategia, terreno, clima y condiciones del día.

**Arquitectura:** todo el cálculo ocurre en el cliente. No requiere backend,
base de datos ni llamadas a APIs externas.

---

## Promesa de producto

> Convierte una marca reciente en una meta de carrera realista y entiende qué
> tan buena es la referencia utilizada.

La calculadora debe aportar más que una conversión de ritmo constante. La
calculadora de pace responde cuánto tardaría una persona si mantuviera
exactamente el mismo ritmo; esta herramienta aplica una fórmula de rendimiento
que contempla el efecto esperado de la distancia sobre el ritmo.

---

## Objetivos de producto

- Predecir un tiempo central para una distancia objetivo mediante Riegel.
- Mostrar escenarios matemáticos de mejor conservación y mayor fatiga.
- Calcular ritmo objetivo por kilómetro y milla.
- Mostrar el cambio de ritmo frente a la marca de referencia.
- Ayudar a evaluar la calidad de la marca utilizada.
- Comparar predicciones para distancias populares.
- Comunicar claramente supuestos, limitaciones y advertencias.
- Mantener una experiencia rápida, accesible y mobile first.
- Generar una página estática optimizada para SEO en Astro.

## Fuera de alcance

- Garantizar un resultado de carrera.
- Crear un intervalo de confianza estadístico o porcentaje de precisión.
- Ajustar automáticamente la predicción por desnivel, clima o superficie.
- Recomendar un plan de entrenamiento o zonas de intensidad.
- Sustituir la evaluación de un entrenador o profesional de salud.
- Duplicar el plan de splits de la calculadora de pace.

---

## Alcance recomendado

### MVP

- Distancia y tiempo de referencia.
- Distancia objetivo.
- Fórmula Riegel con exponente central fijo de `1.06`.
- Sección opcional `Mejorar predicción` con contexto de la marca.
- Resultado central: tiempo previsto, ritmo, velocidad y cambio de ritmo.
- Escenarios matemáticos con exponentes `1.03`, `1.06` y `1.09`.
- Calidad de referencia con explicación textual.
- Predicciones para distancias populares en filas o tarjetas.
- Enlace contextual a la calculadora de pace para planear splits.
- Probar ejemplo, copiar resultado y limpiar formulario.
- Errores por campo, advertencias contextuales y estados accesibles.

### Fase 2

- Exponente Riegel editable dentro de opciones avanzadas.
- Comparar dos marcas recientes y observar consistencia.
- Historial de predicciones en `sessionStorage`.
- Compartir resultado mediante URL con parámetros.
- Exportar predicciones a CSV.
- Ajustes explícitos y documentados por desnivel o temperatura.

---

## Ruta y archivos

| Elemento | Valor |
|----------|-------|
| URL canónica | `/salud/calculadora-prediccion-tiempo-carrera` |
| Archivo Astro | `src/pages/salud/calculadora-prediccion-tiempo-carrera.astro` |
| Lógica de cálculo | `src/lib/calculators/salud/calculadora-prediccion-tiempo-carrera/racePrediction.ts` |
| Pruebas unitarias | `src/lib/calculators/salud/calculadora-prediccion-tiempo-carrera/racePrediction.test.ts` |
| Categoría | `salud` |
| Locale base | `es-MX` |

La ruta se considera canónica desde el lanzamiento. Si en el futuro se mueve a
otra categoría, se debe mover la página y crear una redirección Apache `301`;
no deben coexistir páginas duplicadas en `salud` y `fitness`.

---

## Experiencia mobile first

### Orden del contenido

El primer viewport debe priorizar la tarea principal:

1. H1 y descripción de una línea.
2. Bloque `Tu marca reciente`.
3. Bloque `Tu objetivo`.
4. Sección plegada `Mejorar predicción`.
5. Botón principal de ancho completo.
6. Resultado principal grande.
7. Ritmo objetivo y cambio frente a la referencia.

Después del resultado principal deben aparecer:

1. Calidad de referencia y motivos.
2. Escenarios matemáticos.
3. Predicciones para distancias populares.
4. Enlace para planear ritmo y splits.
5. Explicación, fórmula y FAQs.

### Reglas de interacción

- Mostrar etiquetas visibles; no depender de placeholders.
- Usar `inputmode="decimal"` para distancia y `inputmode="numeric"` para tiempo.
- Usar controles táctiles de al menos `44 × 44 px`.
- Permitir que los chips de distancia ocupen varias líneas.
- Marcar visualmente y mediante `aria-pressed` el chip seleccionado.
- Mostrar errores junto al campo correspondiente.
- Anunciar el resultado mediante una región `aria-live="polite"`.
- Llevar el foco al encabezado del resultado después de calcular.
- No anunciar cada cambio mientras la persona escribe.
- Mantener el botón principal accesible sin desplazamiento innecesario.
- No mostrar tablas horizontales en móvil.
- Presentar las predicciones populares como filas o tarjetas apiladas.
- No depender únicamente de color para calidad, errores o advertencias.
- Respetar navegación por teclado y `prefers-reduced-motion`.

### Composición móvil sugerida

```text
Tu marca reciente
[5K] [10K] [15K] [Medio] [Maratón]
[ Distancia ] [ km ]
[ HH ] [ MM ] [ SS ]

Tu objetivo
[5K] [10K] [15K] [Medio] [Maratón]
[ Distancia ] [ km ]

[ Mejorar predicción ]
[ Calcular mi tiempo probable ]

Tiempo previsto
1:50:19
Ritmo: 5:14 min/km
Cambio: +14 s/km
```

---

## Flujo principal MVP

**Ejemplo:** Corrí `10 km` en `50:00`. ¿Qué tiempo podría hacer en medio
maratón?

### Campos principales

| Campo | Tipo | Valores válidos | Valor inicial |
|-------|------|-----------------|---------------|
| Distancia de referencia | Texto numérico o preset | `> 0` | `10K` |
| Unidad de referencia | Selector | `km`, `mi` | `km` |
| Tiempo de referencia | Campos separados | horas `>= 0`, minutos y segundos `0-59` | vacío |
| Distancia objetivo | Texto numérico o preset | `> 0` | `Medio maratón` |
| Unidad objetivo | Selector | `km`, `mi` | `km` |

Las unidades de referencia y objetivo son independientes. Cambiar una unidad
debe convertir el valor físico visible, no reinterpretar el mismo número.

### Distancias rápidas

| Etiqueta | Distancia interna |
|----------|-------------------|
| 1K | `1 km` |
| 1 milla | `1.609344 km` |
| 5K | `5 km` |
| 10K | `10 km` |
| 15K | `15 km` |
| Medio maratón | `21.0975 km` |
| Maratón | `42.195 km` |

Al seleccionar una distancia rápida, se debe actualizar el campo y su unidad
visible sin perder precisión interna.

### Sección opcional `Mejorar predicción`

Estos datos no modifican silenciosamente la fórmula en el MVP. Se utilizan para
evaluar y explicar la calidad de la referencia.

| Campo | Tipo | Opciones | Valor inicial |
|-------|------|----------|---------------|
| Antigüedad de la marca | Selector | `Últimos 30 días`, `1 a 3 meses`, `Más de 3 meses`, `No indicar` | `No indicar` |
| Tipo de esfuerzo | Selector | `Carrera o máximo esfuerzo`, `Entrenamiento controlado`, `No indicar` | `No indicar` |
| Condiciones comparables | Selector | `Sí`, `No`, `No estoy seguro` | `No estoy seguro` |

Incluir ayuda breve:

> Una carrera reciente, realizada a máximo esfuerzo y en condiciones parecidas,
> suele ser una mejor referencia. Estos datos explican la incertidumbre, pero
> no alteran el tiempo calculado.

---

## Fórmulas, unidades y precisión

### Conversión base

Todos los cálculos internos deben usar:

- Distancia en kilómetros.
- Tiempo en segundos.
- `1 mi = 1.609344 km`.

### Predicción central Riegel

```text
tiempo_objetivo =
  tiempo_referencia
  * (distancia_objetivo / distancia_referencia) ^ 1.06
```

El exponente mayor que `1` modela que, al aumentar la distancia, normalmente no
se conserva exactamente el mismo ritmo.

### Escenarios matemáticos

Calcular tres resultados usando la misma marca:

```text
mejor_conservacion = tiempo_referencia * ratio_distancias ^ 1.03
prediccion_central = tiempo_referencia * ratio_distancias ^ 1.06
mayor_fatiga       = tiempo_referencia * ratio_distancias ^ 1.09
```

Los nombres describen el comportamiento del modelo, no probabilidades:

- `Mejor conservación`: el ritmo cambia menos entre distancias.
- `Predicción central`: estimación principal con exponente `1.06`.
- `Mayor fatiga`: el ritmo cambia más entre distancias.

Cuando la distancia objetivo sea menor que la referencia, el orden cronológico
de los tiempos se invierte. La interfaz debe conservar los nombres de escenario
y ordenar visualmente por significado, no renombrarlos como optimista o
conservador.

Incluir junto al bloque:

> Son escenarios de la fórmula Riegel, no un intervalo de confianza. Tu
> preparación específica y las condiciones del día pueden producir resultados
> fuera de estos valores.

### Ritmo y velocidad

```text
ritmo_referencia_seg_por_km =
  tiempo_referencia_segundos / distancia_referencia_km

ritmo_objetivo_seg_por_km =
  tiempo_objetivo_segundos / distancia_objetivo_km

ritmo_objetivo_seg_por_mi =
  tiempo_objetivo_segundos / (distancia_objetivo_km / 1.609344)

cambio_ritmo_seg_por_km =
  ritmo_objetivo_seg_por_km - ritmo_referencia_seg_por_km

velocidad_objetivo_kmh =
  distancia_objetivo_km / (tiempo_objetivo_segundos / 3600)
```

El cambio de ritmo debe presentarse con contexto:

- Valor positivo: `La predicción añade 14 s/km frente a tu marca`.
- Valor negativo: `La predicción requiere 12 s/km más rápido que tu marca`.
- Cero: `La distancia objetivo coincide con tu referencia`.

No mostrar como comparación principal la diferencia entre tiempos totales de
distancias distintas.

### Redondeo y formato

- Conservar precisión completa durante todos los cálculos.
- Redondear tiempo y ritmo únicamente para presentación.
- Formatear tiempo redondeado al segundo más cercano como `h:mm:ss` o `mm:ss`.
- Formatear ritmo redondeado al segundo más cercano como `m:ss`.
- Evitar resultados como `4:60`; deben normalizarse a `5:00`.
- Mostrar velocidad con dos decimales.
- No mostrar `NaN`, `Infinity` ni resultados parciales inválidos.

---

## Calidad de referencia

La calidad evalúa la utilidad de los datos capturados como referencia. No
certifica la exactitud del resultado y no debe expresarse como porcentaje.

### Factores evaluados

- Separación entre distancia de referencia y objetivo.
- Antigüedad declarada de la marca.
- Tipo de esfuerzo declarado.
- Comparabilidad declarada de las condiciones.
- Datos opcionales no indicados.

### Motivos de incertidumbre

Generar una lista de motivos aplicables:

- Ratio de distancias mayor que `4` o menor que `0.25`.
- Marca de más de tres meses.
- Marca obtenida en entrenamiento controlado.
- Condiciones no comparables.
- Contexto opcional no indicado.

### Estado mostrado

| Estado | Regla |
|--------|-------|
| Buena referencia | Ratio entre `0.5` y `2`, marca de últimos 30 días, carrera o máximo esfuerzo y condiciones comparables. |
| Referencia aceptable | El cálculo es válido y no existe un motivo fuerte de alta incertidumbre, pero falta contexto o hay una limitación moderada. |
| Alta incertidumbre | Ratio fuera de `0.25` a `4`, marca de más de tres meses, entrenamiento controlado o condiciones no comparables. |

Mostrar siempre el estado con una explicación breve y los motivos concretos. No
bloquear el cálculo por una calidad baja.

Ejemplo:

```text
Calidad de referencia: Referencia aceptable
La distancia objetivo es aproximadamente el doble de tu marca. No indicaste
cuándo ni en qué condiciones obtuviste el tiempo.
```

---

## Resultados

### Resultado principal

El resultado válido debe incluir, en este orden:

1. Encabezado `Tiempo previsto`.
2. Tiempo central grande.
3. Distancia objetivo.
4. Ritmo objetivo por kilómetro y milla.
5. Cambio de ritmo frente a la marca de referencia.
6. Velocidad objetivo.
7. Calidad de referencia y motivos.
8. Escenarios matemáticos.
9. Advertencias aplicables.
10. Acciones de copiar, planear splits y limpiar.

Ejemplo para `10 km` en `50:00` hacia medio maratón:

```text
Tiempo previsto
1:50:19

Medio maratón · 21.0975 km
Ritmo objetivo: 5:14 min/km · 8:25 min/mi
Cambio frente a tu marca: +14 s/km
Velocidad objetivo: 11.47 km/h
```

### Predicciones para distancias populares

Mostrar todas las distancias rápidas excepto la distancia de referencia. La
distancia objetivo debe estar marcada como `Tu objetivo`.

Cada fila o tarjeta debe incluir:

- Nombre y distancia.
- Tiempo central previsto.
- Ritmo central por la unidad preferida.
- Indicador `Tu objetivo` cuando aplique.

En móvil no usar tabla horizontal:

```text
Medio maratón                         Tu objetivo
1:50:19
5:14 min/km
```

### Enlace a la calculadora de pace

Después del resultado principal, incluir una acción contextual:

> Planear ritmo y splits para `1:50:19`

El enlace debe dirigir a `/salud/calculadora-de-pace-ritmo-de-carrera`. La
precarga mediante parámetros queda fuera del MVP salvo que la calculadora de
pace ya la soporte.

---

## Validaciones y advertencias

### Reglas de validación

- Distancia de referencia y objetivo deben ser finitas y mayores que cero.
- Tiempo de referencia debe ser finito y mayor que cero.
- Horas deben ser enteras y mayores o iguales a cero.
- Minutos y segundos deben ser enteros entre `0` y `59`.
- El tiempo combinado no puede ser cero.
- Aceptar punto o coma como separador decimal en distancia.
- Permitir distancias de hasta `500 km`.
- Bloquear resultados cuyo tiempo previsto supere `10,000 horas`.
- Rechazar valores no numéricos, infinitos o fuera de límites seguros.

### Advertencias contextuales

- Distancias iguales: calcular y explicar que el resultado coincide con la marca.
- Ratio fuera de `0.25` a `4`: mostrar advertencia de alta incertidumbre.
- Marca de más de tres meses: explicar que el estado actual puede haber cambiado.
- Entrenamiento controlado: explicar que quizá no represente máximo rendimiento.
- Condiciones no comparables: explicar que clima, terreno o desnivel pueden alterar el resultado.
- Objetivo maratón desde referencia menor a `10 km`: advertir que la preparación específica y la resistencia tienen mayor peso.
- Resultado más rápido que el récord de referencia para la misma distancia: no aplica, ya que distancias iguales deben devolver el mismo tiempo.

### Mensajes sugeridos

- `Ingresa una distancia mayor que cero.`
- `Ingresa al menos un minuto o segundo.`
- `Los minutos y segundos deben estar entre 0 y 59.`
- `La distancia es inusualmente larga; revisa el valor y la unidad.`
- `Las distancias están muy separadas; interpreta la predicción con cautela.`

---

## Estados de interfaz

| Estado | Comportamiento |
|--------|----------------|
| Inicial | Mostrar formulario, ejemplo breve y resultado neutral. |
| Incompleto | No mostrar resultado final; señalar campos faltantes después de interacción o submit. |
| Inválido | Mostrar errores específicos junto a los campos y resumen accesible. |
| Válido | Mostrar resultado, calidad, escenarios y predicciones populares. |
| Válido con advertencia | Mostrar resultado completo y advertencias contextuales. |
| Ejemplo cargado | Completar `10 km`, `50:00` y medio maratón; calcular resultado. |
| Limpio | Restaurar valores iniciales, ocultar resultados y devolver foco al primer campo editable. |

---

## Acciones

### Probar ejemplo

- Cargar referencia de `10 km` en `50:00`.
- Cargar medio maratón como objetivo.
- Mantener los campos opcionales en `No indicar`.
- Calcular y mostrar el resultado.

### Copiar resultado

Copiar texto plano con contexto, resultado y limitación:

```text
Predicción de carrera
Referencia: 10 km en 50:00
Objetivo: medio maratón
Tiempo previsto: 1:50:19
Ritmo objetivo: 5:14 min/km (8:25 min/mi)
Cambio frente a la referencia: +14 s/km
Calidad de referencia: Referencia aceptable

Estimación mediante fórmula Riegel; el resultado real puede variar.
Calculado en calculadoras.tools
```

### Limpiar

- Restaurar referencia a `10K` y objetivo a `Medio maratón`.
- Restaurar unidades a `km`.
- Vaciar tiempo, contexto opcional, errores, advertencias y resultados.
- Devolver el foco al primer campo editable.

---

## Accesibilidad

- Usar controles nativos y etiquetas asociadas.
- Los chips deben comunicar selección mediante `aria-pressed`.
- Los errores por campo deben asociarse mediante `aria-describedby`.
- El resumen de errores debe recibir foco tras un submit inválido.
- El resultado principal debe estar en una región `aria-live="polite"`.
- El encabezado del resultado debe aceptar foco mediante `tabindex="-1"`.
- El estado de copiar debe anunciarse mediante `aria-live="polite"`.
- La sección plegable debe usar un botón con `aria-expanded`.
- No depender únicamente de color para estados o advertencias.

---

## Privacidad

- Todos los cálculos ocurren en el navegador.
- No enviar distancias, tiempos, contexto ni resultados a APIs externas.
- No guardar datos en el MVP.
- Explicar cualquier uso futuro de `sessionStorage` antes de incorporarlo.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de predicción de tiempo de carrera` |
| Meta description | `Predice tu tiempo para 5K, 10K, medio maratón o maratón desde una marca reciente. Consulta ritmo, escenarios y calidad de referencia.` |
| H1 | `Calculadora de predicción de tiempo de carrera` |
| Keyword principal | `calculadora prediccion carrera` |
| Keywords secundarias | `prediccion tiempo running`, `calculadora Riegel`, `tiempo medio maraton desde 10k`, `predicción maratón` |
| Canonical | `/salud/calculadora-prediccion-tiempo-carrera` |

### Contenido editorial mínimo

- Qué calcula la fórmula Riegel.
- Diferencia entre mantener el mismo ritmo y predecir rendimiento.
- Por qué una marca reciente y a máximo esfuerzo es mejor referencia.
- Por qué las predicciones de maratón desde distancias cortas son inciertas.
- Cómo interpretar los escenarios matemáticos.
- Factores no contemplados: entrenamiento, clima, terreno, desnivel y estrategia.
- Enlace contextual a la calculadora de pace.

### FAQs sugeridas

- ¿Qué es la fórmula Riegel?
- ¿Qué tan precisa es la predicción?
- ¿Puedo predecir un maratón desde un 5K?
- ¿Por qué el ritmo previsto es más lento en distancias largas?
- ¿Qué marca debería usar como referencia?
- ¿La calculadora considera clima, terreno o desnivel?
- ¿Qué diferencia hay entre esta calculadora y la calculadora de pace?

---

## Analítica sugerida

Medir sin guardar los valores introducidos:

- Uso de calcular.
- Uso de ejemplo.
- Apertura de `Mejorar predicción`.
- Selección de distancia objetivo.
- Calidad de referencia resultante.
- Uso de copiar resultado.
- Clic hacia la calculadora de pace.

---

## Pruebas sugeridas

### Cálculos base

- `10 km` en `50:00` predice medio maratón alrededor de `1:50:19`.
- `10 km` en `50:00` produce aproximadamente `5:14 min/km` para medio maratón.
- Misma distancia de referencia y objetivo devuelve exactamente el mismo tiempo.
- Misma distancia produce cambio de ritmo de cero.
- Una distancia objetivo menor produce un ritmo previsto más rápido con Riegel.
- Conversión km/mi conserva resultados internos equivalentes.

### Escenarios y calidad

- Para una distancia objetivo mayor, `1.03` produce menos tiempo que `1.06` y `1.09`.
- Para una distancia objetivo menor, el orden cronológico de escenarios se invierte.
- Los escenarios conservan sus nombres aunque cambie el orden de tiempos.
- Ratio fuera de `0.25` a `4` produce `Alta incertidumbre`.
- Marca reciente, a máximo esfuerzo y comparable con ratio entre `0.5` y `2` produce `Buena referencia`.
- Contexto sin indicar produce como máximo `Referencia aceptable`.
- La calidad no modifica el tiempo central calculado.

### Formato y validación

- Un ritmo redondeado que cruza minuto se normaliza correctamente.
- Distancia con coma decimal se interpreta correctamente.
- Minutos o segundos mayores de `59` muestran error.
- Tiempo total igual a cero muestra error.
- Valores vacíos, no finitos y no numéricos no producen resultados visibles.
- Distancia superior al límite seguro bloquea el cálculo.
- Ningún resultado visible contiene `NaN` o `Infinity`.

### Interacción y accesibilidad

- Cambiar una unidad convierte el valor físico sin alterar el resultado interno.
- Seleccionar un preset actualiza distancia y unidad.
- El resultado se anuncia mediante `aria-live`.
- Un submit inválido muestra errores asociados a sus campos.
- `Limpiar` restaura estado y foco.
- El texto copiado incluye contexto, unidades y limitación.
- Las predicciones populares se muestran sin tabla horizontal en móvil.
