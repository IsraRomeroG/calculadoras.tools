# Especificación v2 - Calculadora de repetición máxima / 1RM

## Descripción general

Herramienta para estimar la repetición máxima (`1RM`) a partir del peso usado,
las repeticiones completadas y la cercanía de la serie al fallo técnico.

La calculadora no debe limitarse a mostrar un número. Su principal aportación de
valor es ayudar al usuario a convertir la estimación en una carga práctica para
su próxima serie, considerando:

- La variación entre fórmulas comunes.
- La calidad de la serie usada para estimar.
- Las repeticiones objetivo.
- El porcentaje de entrenamiento deseado.
- Los incrementos de peso realmente disponibles.

La herramienta debe favorecer estimaciones submáximas y no incentivar pruebas
de 1RM real sin preparación, técnica adecuada y supervisión.

**Arquitectura:** todo el cálculo ocurre en el cliente. No requiere backend,
base de datos ni llamadas a APIs externas.

---

## Objetivo de producto

- Estimar el 1RM sin obligar al usuario a realizar un intento máximo.
- Mostrar un resultado principal fácil de interpretar y un rango que haga
  visible la incertidumbre entre fórmulas.
- Explicar cuándo la estimación tiene una base mejor o peor.
- Ayudar a elegir una carga práctica para una próxima serie.
- Mostrar cargas derivadas por porcentaje del 1RM.
- Permitir trabajar en `kg` y `lb` sin perder equivalencia.
- Redondear cargas según los incrementos de equipo disponibles.
- Generar una página estática optimizada para SEO en Astro.

### Pregunta principal que debe responder

> Levanté este peso durante estas repeticiones. ¿Cuál es mi 1RM estimado y qué
> carga práctica puedo usar en mi próxima serie?

---

## Principios de producto

1. **Acción antes que falsa precisión:** el resultado debe ayudar a elegir una
   carga, no presentar una estimación como una medición exacta.
2. **Comparación visible:** Epley será la referencia principal predeterminada,
   pero Brzycki se mostrará siempre como comparación y podrá elegirse como base
   desde opciones avanzadas.
3. **Contexto de la serie:** las repeticiones solo son una buena base para
   estimar 1RM si la serie se acercó al fallo técnico.
4. **Carga montable:** las cargas sugeridas deben considerar el incremento de
   peso que el usuario puede utilizar realmente.
5. **Mobile first:** el flujo completo debe funcionar cómodamente con una mano
   y sin desplazamiento horizontal obligatorio.
6. **Seguridad sin alarmismo:** priorizar técnica, control y progresión gradual.

---

## Alcance recomendado

### MVP

- Peso levantado.
- Unidad `kg` o `lb`.
- Repeticiones completadas entre `1` y `15`.
- RIR o repeticiones en reserva:
  - `0`: no podía completar otra repetición con buena técnica.
  - `1`: podía completar una repetición más.
  - `2`: podía completar dos repeticiones más.
  - `3 o más`: la serie quedó lejos del fallo técnico.
  - `No lo sé`.
- Epley como fórmula principal predeterminada.
- Brzycki como comparación siempre visible.
- Selector de fórmula principal dentro de `Opciones avanzadas`.
- Rango estimado entre ambas fórmulas.
- Indicador contextual de calidad de la estimación.
- Planificador de próxima serie por:
  - Repeticiones objetivo.
  - Porcentaje objetivo.
- Tabla de porcentajes: `50%`, `60%`, `70%`, `75%`, `80%`, `85%`, `90%`,
  `95%`.
- Incremento disponible configurable.
- Carga matemática y carga práctica redondeada.
- Copiar resultado, probar ejemplo y limpiar formulario.
- Aviso de seguridad visible.

### Fase 2

- Comparador expandido con fórmulas adicionales, por ejemplo Lombardi,
  Mayhew u O'Conner.
- Plantillas o perfiles por ejercicio.
- Comparación de varias series del mismo ejercicio para detectar resultados
  inconsistentes.
- Historial de últimos resultados en `sessionStorage`, únicamente si el usuario
  lo activa.
- Enlace compartible que no incluya datos en la URL sin una acción explícita.
- Incrementos personalizados guardados por ejercicio.

### Fuera de alcance

- Prescribir rutinas completas de entrenamiento.
- Determinar si una técnica es segura.
- Recomendar que el usuario pruebe un 1RM real.
- Sustituir la supervisión de un entrenador o profesional.
- Comparar fuerza entre personas mediante peso corporal, sexo o edad.
- Clasificar al usuario como principiante, intermedio o avanzado.

---

## Ruta y archivos recomendados

| Elemento | Valor |
|----------|-------|
| URL canónica definitiva | `/salud/calculadora-1rm-repeticion-maxima` |
| Archivo Astro | `src/pages/salud/calculadora-1rm-repeticion-maxima.astro` |
| Lógica de cálculo | `src/lib/calculators/salud/calculadora-1rm-repeticion-maxima/oneRepMax.ts` |
| Pruebas unitarias | `src/lib/calculators/salud/calculadora-1rm-repeticion-maxima/oneRepMax.test.ts` |
| Categoría principal | `salud` |
| Categoría secundaria opcional | `fitness` |
| Locale base | `es-MX` |

La URL canónica no debe cambiar si posteriormente se crea la categoría
`fitness`. La calculadora podrá aparecer enlazada o listada en esa categoría,
pero debe conservar una sola página y una sola URL canónica.

Si en el futuro fuera imprescindible cambiar la URL pública, se debe retirar la
ruta anterior, actualizar enlaces y canonical, y añadir una redirección Apache
`301` en `.htaccess`. No se deben mantener páginas Astro duplicadas.

---

## Comportamiento mobile first

### Orden del flujo en móvil

1. Selector segmentado `kg / lb`.
2. Peso levantado.
3. Repeticiones completadas.
4. Cercanía al fallo técnico o RIR.
5. Opciones avanzadas colapsadas.
6. Botón principal `Calcular mi 1RM`.
7. Resultado principal, rango e indicador de calidad.
8. Planificador `Elige tu próxima carga`.
9. Lista de cargas por porcentaje.
10. Metodología, seguridad, contenido educativo y FAQs.

### Reglas de interfaz

- Usar una sola columna en móvil.
- A partir de escritorio amplio, formulario y resultado pueden mostrarse en dos
  columnas.
- El resultado principal debe tener dimensiones estables para evitar saltos
  bruscos de layout.
- Todos los controles interactivos deben tener una altura mínima de `48px`.
- El selector de unidad debe ser claro, táctil y usar `aria-pressed`.
- Usar `input type="text"` con `inputmode="decimal"` para peso.
- Usar `input type="text"` con `inputmode="numeric"` para repeticiones.
- Aceptar coma y punto como separador decimal para el peso.
- Mantener el selector de fórmula dentro de un bloque de opciones avanzadas
  cerrado inicialmente.
- Al alternar entre `kg` y `lb`, convertir el valor existente y las cargas
  mostradas; no limitarse a cambiar la etiqueta.
- Las acciones principales deben ocupar el ancho completo en móvil.
- Evitar tarjetas dentro de tarjetas.
- La lista de porcentajes debe mostrarse como filas compactas de dos o tres
  columnas: porcentaje, carga práctica y carga exacta opcional.
- No usar desplazamiento horizontal como solución principal para la lista de
  porcentajes.
- Los textos y resultados largos deben hacer wrap sin romper el layout.
- Probar como mínimo en viewports de `320px` y `390px`.

### Resultado tras calcular

- Llevar el foco al encabezado del resultado y desplazarlo a la vista sin
  ocultarlo detrás de elementos fijos.
- No mover automáticamente el foco durante la escritura.
- Mantener visibles los inputs para facilitar ajustes rápidos.
- El planificador debe aparecer inmediatamente después del resultado, no en una
  sección distante.

---

## Flujo principal del MVP

### Ejemplo inicial

> Levanté `80 kg` durante `5` repeticiones y no podía completar otra repetición
> con buena técnica. ¿Cuál es mi 1RM estimado y qué peso podría usar para `8`
> repeticiones?

### Paso 1 - Registrar la serie

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Unidad | Selector segmentado | `kg`, `lb` | `kg` |
| Peso levantado | Texto numérico decimal | `> 0` y dentro de límites | vacío |
| Repeticiones completadas | Texto numérico entero | `1-15` | `5` |
| RIR | Selector de opciones | `0`, `1`, `2`, `3+`, `unknown` | `unknown` |
| Fórmula principal | Selector avanzado | `epley`, `brzycki` | `epley` |

Texto de ayuda para RIR:

> Piensa cuántas repeticiones adicionales habrías podido completar manteniendo
> una técnica aceptable. Si no estás seguro, elige “No lo sé”.

### Paso 2 - Mostrar resultado

El resultado debe incluir, en este orden:

1. `1RM estimado` con la fórmula principal seleccionada.
2. Rango mínimo-máximo entre Epley y Brzycki.
3. Indicador contextual de calidad.
4. Serie utilizada y repeticiones efectivas, si aplica RIR.
5. Comparación de fórmulas.
6. Nota breve sobre interpretación y seguridad.

Ejemplo de resultado:

```text
1RM estimado con Epley: 93.3 kg
Rango entre fórmulas: 90.0-93.3 kg
Base de estimación: mejor
Calculado desde: 80 kg x 5 repeticiones, RIR 0
```

### Paso 3 - Elegir la próxima carga

El planificador debe ofrecer dos modos mediante selector segmentado:

#### Modo A - Por repeticiones objetivo

- El usuario elige entre `1` y `15` repeticiones.
- Se calcula una carga objetivo usando la inversa de la fórmula principal y el
  1RM principal.
- Se muestran:
  - Fórmula utilizada.
  - Carga matemática.
  - Carga práctica más cercana.
  - Alternativa conservadora inferior cuando la carga más cercana redondea
    hacia arriba.

#### Modo B - Por porcentaje objetivo

- El usuario elige un porcentaje entre `40%` y `100%`.
- Se calcula el porcentaje sobre el 1RM principal seleccionado.
- Se muestran la carga matemática y la carga práctica.

El texto debe dejar claro que una carga calculada no garantiza completar un
número concreto de repeticiones.

### Paso 4 - Consultar cargas por porcentaje

Mostrar una lista compacta con:

| Columna | Descripción |
|---------|-------------|
| Porcentaje | `50%` a `95%` según lista del MVP |
| Carga práctica | Redondeada al incremento disponible |
| Carga exacta | Visible como detalle secundario |

No asociar porcentajes con un número garantizado de repeticiones. Puede
añadirse contenido educativo separado explicando que las relaciones entre
porcentaje y repeticiones varían entre personas y ejercicios.

---

## Reglas de cálculo

### Unidades

Usar como equivalencia:

```text
1 kg = 2.2046226218 lb
```

Mantener internamente un valor canónico en kilogramos para evitar acumulación
de errores al alternar unidades varias veces. Convertir y redondear únicamente
para mostrar.

### Repeticiones efectivas y RIR

Las fórmulas de 1RM funcionan mejor cuando la serie representa aproximadamente
el máximo de repeticiones que el usuario podía completar con buena técnica.

```text
si RIR es 0, 1 o 2:
  repeticiones_efectivas = repeticiones_completadas + RIR

si RIR es "3+" o "unknown":
  repeticiones_efectivas = repeticiones_completadas
```

- Para `RIR 1` o `RIR 2`, mostrar claramente que la estimación se ajustó usando
  repeticiones efectivas.
- Para `RIR 3+`, no sumar un valor arbitrario. Mostrar que el resultado
  probablemente subestima el 1RM y asignar calidad baja.
- Para `RIR unknown`, calcular con las repeticiones completadas y mostrar que la
  cercanía al fallo no se conoce.
- Si las repeticiones efectivas superan `15`, mostrar el resultado únicamente
  como orientación de baja calidad y no permitir calcular con más de `15` como
  entrada directa.

### Caso especial de una repetición

Si `repeticiones_completadas = 1` y `RIR = 0`, el 1RM principal y ambas
fórmulas deben ser iguales al peso levantado.

El resultado debe describirse como:

> 1RM levantado, no solo estimado.

Si se completó una repetición con `RIR 1` o `RIR 2`, aplicar las repeticiones
efectivas correspondientes.

### Epley

```text
one_rm_epley = peso * (1 + repeticiones_efectivas / 30)
```

Para el caso especial de `1 repetición` con `RIR 0`:

```text
one_rm_epley = peso
```

### Brzycki

```text
one_rm_brzycki = peso * (36 / (37 - repeticiones_efectivas))
```

Para el caso especial de `1 repetición` con `RIR 0`:

```text
one_rm_brzycki = peso
```

Brzycki no permite `repeticiones_efectivas >= 37`. El rango del producto evita
ese caso, pero la lógica debe validarlo explícitamente.

### Rango entre fórmulas

```text
rango_minimo = min(one_rm_epley, one_rm_brzycki)
rango_maximo = max(one_rm_epley, one_rm_brzycki)
diferencia_porcentual =
  ((rango_maximo - rango_minimo) / one_rm_principal) * 100
```

Epley es la fórmula principal predeterminada. Si el usuario elige Brzycki en
opciones avanzadas, el resultado principal y las cargas derivadas deben usar
Brzycki. La otra fórmula permanece visible como comparación.

El rango no debe promediarse ni presentarse como intervalo estadístico de
confianza.

### Cargas por porcentaje

```text
carga_exacta = one_rm_principal * (porcentaje / 100)
```

### Carga objetivo por repeticiones

Usar la inversa correspondiente a la fórmula principal:

```text
si formula_principal es Epley:
  carga_objetivo_exacta =
    one_rm_epley / (1 + repeticiones_objetivo / 30)

si formula_principal es Brzycki:
  carga_objetivo_exacta =
    one_rm_brzycki * ((37 - repeticiones_objetivo) / 36)
```

Para `1 repetición objetivo`, la carga exacta debe ser igual al 1RM principal.

### Redondeo según equipo disponible

Incrementos predeterminados:

| Unidad | Incremento predeterminado | Opciones rápidas |
|--------|---------------------------|------------------|
| `kg` | `2.5 kg` | `0.5`, `1`, `2.5`, `5 kg` |
| `lb` | `5 lb` | `1`, `2.5`, `5`, `10 lb` |

Permitir un incremento personalizado positivo dentro de límites razonables.

```text
carga_practica_cercana =
  round(carga_exacta / incremento) * incremento

carga_practica_inferior =
  floor(carga_exacta / incremento) * incremento
```

- Mantener toda la precisión durante el cálculo.
- Redondear únicamente al mostrar cargas prácticas.
- Si la carga práctica más cercana es mayor que la carga exacta, mostrar también
  la alternativa conservadora inferior.
- No redondear el 1RM principal al incremento de equipo; mostrarlo con un
  decimal como máximo.

---

## Indicador de calidad de la estimación

El indicador es una explicación de contexto, no una puntuación científica ni
un intervalo de confianza.

| Nivel | Condiciones orientativas | Mensaje |
|-------|--------------------------|---------|
| `levantado` | `1 repetición` y `RIR 0` | El peso fue levantado una vez; no depende de una fórmula para el valor principal. |
| `mejor` | Repeticiones efectivas `2-5` y `RIR 0-1` | La serie está cerca del fallo técnico y usa pocas repeticiones. |
| `orientativa` | Repeticiones efectivas `6-10`, o `RIR 2` | La estimación es útil como referencia, pero puede variar. |
| `baja` | Repeticiones efectivas `11-15`, `RIR 3+`, `RIR unknown` o efectivas `> 15` | La serie ofrece una base menos precisa; usa el resultado con cautela. |

Si varias condiciones aplican, usar siempre el nivel más conservador.

Mensajes complementarios:

- Si `repeticiones_efectivas > 10`, advertir que las fórmulas suelen divergir
  más con muchas repeticiones.
- Si `diferencia_porcentual >= 5%`, destacar la diferencia entre fórmulas.
- Si `RIR 3+`, indicar que una serie más cercana al fallo técnico puede ofrecer
  una referencia más útil, sin pedir al usuario llegar al fallo si no es
  apropiado.

---

## Validaciones

### Peso levantado

- Obligatorio.
- Debe ser un número finito mayor que cero.
- Aceptar coma o punto decimal, pero no separadores de miles ambiguos.
- Límite de entrada recomendado:
  - `0.5-2,000 kg`.
  - Equivalente en `lb`.
- Mostrar el error junto al campo.

### Repeticiones

- Obligatorio.
- Debe ser un número entero entre `1` y `15`.
- No aceptar decimales.

### RIR

- Debe ser una de las opciones soportadas.
- `No lo sé` es un valor válido y no debe generar error.

### Fórmula principal

- Debe ser `epley` o `brzycki`.
- Epley debe permanecer seleccionada mientras el usuario no cambie la opción
  avanzada explícitamente.

### Repeticiones o porcentaje objetivo

- Repeticiones objetivo: entero entre `1` y `15`.
- Porcentaje objetivo: número entre `40` y `100`.

### Incremento disponible

- Debe ser un número positivo.
- Debe ser finito y quedar dentro de un límite razonable definido por la lógica
  para evitar valores accidentales extremos.
- Debe convertirse cuando el usuario cambia de unidad.

### Reglas generales

- Rechazar `NaN`, `Infinity`, negativos y texto no numérico.
- No calcular resultados con campos obligatorios inválidos.
- No borrar automáticamente un valor inválido mientras el usuario lo corrige.
- Limpiar errores por campo cuando el valor vuelve a ser válido.

---

## Estados de interfaz

| Estado | Comportamiento |
|--------|----------------|
| Inicial | Formulario visible, resultado neutral y ejemplo disponible. |
| Incompleto | No mostrar un resultado final; indicar qué falta después de interacción o submit. |
| Inválido | Mostrar errores por campo y ocultar acciones dependientes del resultado. |
| Válido | Mostrar resultado, rango, calidad, planificador y porcentajes. |
| Calidad baja | Mostrar resultado válido con advertencia contextual. |
| Una repetición real | Mostrar el peso como 1RM levantado y mantener el aviso de seguridad. |
| Fórmula cambiada | Actualizar resultado principal y cargas derivadas; mantener ambas estimaciones visibles. |
| Unidad cambiada | Convertir inputs, incremento y resultados sin recalcular desde valores ya redondeados. |
| Limpiar | Volver al estado inicial y enfocar el campo de peso. |

El cálculo principal debe ejecutarse al enviar el formulario. Después de obtener
un resultado válido, los cambios en planificador, porcentaje o incremento pueden
actualizar sus cargas en tiempo real.

---

## Formato de resultados

| Resultado | Formato |
|-----------|---------|
| 1RM principal | Máximo `1` decimal y unidad visible |
| Rango entre fórmulas | Máximo `1` decimal por límite |
| Diferencia entre fórmulas | Máximo `1%` decimal |
| Carga exacta | Máximo `1` decimal |
| Carga práctica | Precisión correspondiente al incremento |
| Repeticiones | Enteros |
| Porcentajes | Enteros salvo entrada personalizada |

Ejemplos:

```text
93.3 kg
90.0-93.3 kg
La fórmula más alta difiere 3.6% de Epley
Carga práctica: 75 kg
Alternativa conservadora: 72.5 kg
```

---

## Acciones

### Calcular mi 1RM

- Acción principal.
- Valida los campos.
- Muestra resultado y lleva el foco a su encabezado.

### Probar ejemplo

Usar:

```text
Peso: 80 kg
Repeticiones: 5
RIR: 0
Incremento: 2.5 kg
Próxima serie: 8 repeticiones
```

Debe completar, calcular y mostrar el resultado.

### Copiar resultado

Copiar texto plano con:

- Serie utilizada.
- RIR y repeticiones efectivas.
- Fórmula principal seleccionada.
- 1RM Epley.
- 1RM Brzycki.
- Rango.
- Indicador de calidad.
- Próxima carga seleccionada.
- Incremento disponible.
- Nota de que es una estimación orientativa.

No copiar contenido promocional ni una URL con parámetros sensibles.

### Limpiar

- Limpia inputs editables, errores, advertencias y resultados.
- Restaura `kg`, RIR `No lo sé`, `5` repeticiones y el incremento
  predeterminado.
- Enfoca el campo de peso.

---

## Accesibilidad

- Asociar cada input con un `label`.
- Asociar ayuda y errores con `aria-describedby`.
- Usar `aria-invalid="true"` en campos inválidos.
- Usar `role="alert"` para errores generales.
- El resultado principal debe estar en una región con `aria-live="polite"`.
- El estado de copiar debe anunciarse con `aria-live="polite"`.
- El encabezado del resultado debe poder recibir foco mediante `tabindex="-1"`.
- Los selectores segmentados deben exponer el estado con `aria-pressed`.
- La lista de cargas debe tener encabezados o etiquetas accesibles.
- No depender únicamente del color para comunicar calidad o advertencias.
- Mantener foco visible y contraste suficiente.
- Respetar `prefers-reduced-motion` al desplazar hacia el resultado.

---

## Seguridad y lenguaje

### Aviso visible cerca del resultado

> Esta calculadora ofrece una estimación orientativa. No necesitas probar tu 1RM
> real para usarla. Prioriza una técnica controlada, calentamiento adecuado,
> progresión gradual y supervisión cuando el ejercicio lo requiera.

### Reglas de contenido

- Usar “estimado”, “orientativo”, “carga práctica” y “podría”.
- Evitar “peso seguro”, “debes levantar”, “resultado exacto” o “garantizado”.
- No recomendar llegar al fallo en todos los ejercicios o sesiones.
- Explicar que ejercicio, técnica, fatiga, experiencia y persona pueden cambiar
  la relación entre repeticiones y 1RM.
- Si se menciona probar un 1RM real, hacerlo únicamente dentro de contenido de
  seguridad y no como llamada a la acción.

---

## Privacidad

- Todo el cálculo ocurre en el navegador.
- El MVP no guarda peso, repeticiones, RIR ni resultados en `localStorage`.
- No enviar inputs ni resultados a APIs externas.
- No incluir valores del usuario en la URL automáticamente.
- Si se implementa historial en una fase futura, preferir `sessionStorage`,
  hacerlo opt-in y ofrecer una acción clara para borrarlo.

---

## SEO y contenido

| Elemento | Valor recomendado |
|----------|-------------------|
| Title | `Calculadora 1RM: estima tu repetición máxima y cargas` |
| Meta description | `Estima tu 1RM con Epley y Brzycki, compara el rango y calcula cargas prácticas por repeticiones o porcentaje.` |
| H1 | `Calculadora de 1RM y cargas de entrenamiento` |
| Keyword principal | `calculadora 1rm` |
| Keywords secundarias | `repetición máxima`, `one rep max`, `calcular RM gimnasio`, `porcentaje 1RM`, `carga por repeticiones` |

### Contenido educativo recomendado

- Qué es 1RM y para qué sirve.
- Cómo elegir una serie útil para estimarlo.
- Qué significa RIR o repeticiones en reserva.
- Por qué Epley y Brzycki producen resultados diferentes.
- Cómo usar una carga práctica sin confundirla con una garantía.
- Por qué el resultado cambia entre ejercicios.
- Cómo influyen discos, mancuernas y máquinas en el redondeo.

### FAQs sugeridas

- ¿Qué es 1RM?
- ¿Necesito probar mi 1RM real?
- ¿Qué fórmula es mejor, Epley o Brzycki?
- ¿Qué significa RIR?
- ¿Por qué cambia el resultado con muchas repeticiones?
- ¿Qué peso debería usar para 8 o 10 repeticiones?
- ¿Por qué la carga práctica es diferente de la carga exacta?
- ¿El 1RM es igual para todos los ejercicios?

### Metodología visible

La página debe mostrar las fórmulas usadas, explicar el ajuste por RIR y aclarar
que el rango representa la diferencia entre dos ecuaciones, no un intervalo
estadístico de confianza.

---

## Contrato sugerido de lógica

```ts
type WeightUnit = "kg" | "lb";
type RirValue = 0 | 1 | 2 | "3+" | "unknown";
type EstimateQuality = "lifted" | "better" | "orientation" | "low";
type OneRepMaxFormula = "epley" | "brzycki";

interface OneRepMaxInput {
  weight: number;
  unit: WeightUnit;
  repetitions: number;
  rir: RirValue;
  increment: number;
  primaryFormula: OneRepMaxFormula;
}

interface FormulaEstimate {
  epley: number;
  brzycki: number;
  primary: number;
  min: number;
  max: number;
  differencePercent: number;
}

interface OneRepMaxResult {
  input: OneRepMaxInput;
  effectiveRepetitions: number;
  estimate: FormulaEstimate;
  quality: EstimateQuality;
  warnings: string[];
  percentageLoads: PercentageLoad[];
}

interface PracticalLoad {
  exact: number;
  nearest: number;
  lower: number;
  nearestRoundsUp: boolean;
}
```

Funciones sugeridas:

```text
parseWeightInput(rawValue)
convertWeight(value, fromUnit, toUnit)
calculateEffectiveRepetitions(repetitions, rir)
calculateEpleyOneRepMax(weight, effectiveRepetitions)
calculateBrzyckiOneRepMax(weight, effectiveRepetitions)
resolvePrimaryOneRepMax(formula, estimates)
calculateOneRepMaxResult(input)
getEstimateQuality(input, effectiveRepetitions)
calculatePercentageLoad(oneRepMax, percentage, increment)
calculateTargetRepetitionLoad(oneRepMax, repetitions, formula, increment)
roundToAvailableIncrement(value, increment)
buildOneRepMaxCopyText(result, plannerSelection)
```

---

## Pruebas unitarias sugeridas

### Fórmulas

- `80 kg`, `5 reps`, `RIR 0`: Epley produce `93.333... kg`.
- `80 kg`, `5 reps`, `RIR 0`: Brzycki produce `90 kg`.
- `80 kg`, `1 rep`, `RIR 0`: ambas fórmulas producen `80 kg`.
- `80 kg`, `5 reps`, `RIR 2`: usa `7` repeticiones efectivas.
- `80 kg`, `5 reps`, `RIR 3+`: no suma repeticiones arbitrarias.
- Brzycki rechaza internamente repeticiones efectivas `>= 37`.
- Cambiar la fórmula principal no modifica las estimaciones individuales de
  Epley y Brzycki.

### Rango y calidad

- El rango usa el mínimo y máximo de ambas fórmulas.
- `1 rep`, `RIR 0` produce calidad `lifted`.
- `5 reps`, `RIR 0` produce calidad `better`.
- `8 reps`, `RIR 0` produce calidad `orientation`.
- `12 reps`, `RIR 0` produce calidad `low`.
- `5 reps`, `RIR unknown` produce calidad `low`.
- `5 reps`, `RIR 3+` produce calidad `low` y advertencia.

### Planificador y redondeo

- La inversa de Epley devuelve el peso esperado cuando Epley es principal.
- La inversa de Brzycki devuelve el peso esperado cuando Brzycki es principal.
- `1 repetición objetivo` devuelve el 1RM principal.
- Una carga exacta de `76.8 kg` con incremento `2.5 kg` devuelve:
  - Cercana: `77.5 kg`.
  - Inferior: `75 kg`.
  - `nearestRoundsUp = true`.
- Una carga exacta de `75 kg` con incremento `2.5 kg` permanece en `75 kg`.
- Los porcentajes se calculan desde la fórmula principal sin redondeo
  intermedio.

### Parsing, validación y unidades

- Acepta `80`, `80.5` y `80,5`.
- Rechaza vacío, texto, negativos, cero, `NaN` e `Infinity`.
- Repeticiones `0`, `16` y decimales muestran error.
- Conversión `kg -> lb -> kg` mantiene equivalencia interna.
- Alternar unidades varias veces no acumula errores por redondeo.
- El incremento disponible se convierte junto con la unidad.

### Copiar

- Incluye ambas fórmulas, rango, calidad, carga planificada y aviso.
- No incluye datos indefinidos ni parámetros de URL.

---

## Pruebas de interfaz y aceptación

| Caso | Resultado esperado |
|------|--------------------|
| Estado inicial | No muestra un 1RM final ni errores prematuros. |
| Submit vacío | Marca peso como obligatorio y enfoca el primer error. |
| Ejemplo | Completa `80 kg x 5`, calcula y muestra planificador. |
| Cambio de unidad | Convierte peso, incremento, 1RM y cargas visibles. |
| Cambio de RIR | Recalcula resultado y explica repeticiones efectivas. |
| Cambio de fórmula principal | Cambia el 1RM destacado y las cargas derivadas, pero mantiene ambas comparaciones. |
| Calidad baja | Muestra advertencia sin bloquear resultado válido. |
| Carga redondeada hacia arriba | Muestra alternativa conservadora inferior. |
| Copiar | Copia un resumen útil en texto plano y anuncia el estado. |
| Limpiar | Restaura el estado inicial y enfoca peso. |
| Mobile `320px` | No hay solapamientos ni desbordamiento horizontal. |
| Mobile `390px` | Inputs, resultado, planificador y cargas se leen en una columna. |
| Teclado | Todo control es operable y el foco es visible. |
| Lector de pantalla | Errores, resultado y estado de copiar se anuncian correctamente. |

---

## Criterios de aceptación del MVP

- El usuario puede estimar su 1RM con peso, repeticiones y RIR.
- El resultado principal usa Epley de forma predeterminada, permite elegir
  Brzycki en opciones avanzadas y siempre muestra ambas fórmulas.
- La interfaz muestra un rango y nunca lo describe como intervalo de confianza.
- El usuario recibe un indicador contextual de calidad.
- El usuario puede obtener una carga práctica por repeticiones o porcentaje.
- El redondeo considera el incremento de equipo disponible.
- Alternar `kg/lb` convierte datos y resultados sin pérdida acumulativa.
- La experiencia funciona sin desplazamiento horizontal en `320px` y `390px`.
- Errores, foco y resultados cumplen las reglas de accesibilidad descritas.
- La página no guarda ni envía datos del usuario.
- La URL canónica permanece en `/salud/calculadora-1rm-repeticion-maxima`.
- La calculadora no incentiva intentos máximos ni presenta cargas como seguras o
  garantizadas.
