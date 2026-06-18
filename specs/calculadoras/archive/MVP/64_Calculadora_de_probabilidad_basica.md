# Especificación v2 - Calculadora de probabilidad básica

**Estado:** MVP implementado.

## Descripción general

Herramienta educativa para calcular e interpretar probabilidades básicas con
eventos simples, complementos, uniones, intersecciones y probabilidad
condicional.

Debe servir tanto para resolver ejercicios introductorios como para comprender
qué representa el resultado. No debe limitarse a convertir valores: debe mostrar
la fórmula, sustituir los datos y expresar la probabilidad en lenguaje sencillo.

**Arquitectura:** todo el cálculo ocurre en el cliente. No requiere backend,
base de datos ni llamadas a APIs externas.

---

## Promesa de producto

> Calcula una probabilidad y entiende qué significa, cómo se obtuvo y si los
> datos ingresados son matemáticamente coherentes.

La calculadora debe aportar más que un porcentaje. Cada resultado válido debe
incluir equivalencias, fórmula sustituida e interpretación breve.

---

## Objetivos de producto

- Calcular la probabilidad de un evento con resultados equiprobables.
- Calcular el complemento `P(no A)`.
- Calcular la unión `P(A o B)`.
- Calcular la intersección `P(A y B)` de eventos independientes o mediante una
  probabilidad condicional conocida.
- Calcular la probabilidad condicional `P(A | B)`.
- Mostrar el resultado como porcentaje, decimal y fracción.
- Explicar la fórmula y sustituir los valores ingresados.
- Detectar combinaciones de probabilidades incoherentes.
- Ofrecer una experiencia accesible y mobile first.
- Generar una página estática optimizada para SEO en Astro.

## Fuera de alcance del MVP

- Inferir independencia entre eventos.
- Calcular una intersección multiplicando probabilidades sin que el usuario
  indique que los eventos son independientes.
- Resolver distribuciones binomial, normal, Poisson u otras distribuciones.
- Calcular espacios muestrales mediante combinaciones o permutaciones.
- Construir árboles de probabilidad.
- Ejecutar simulaciones aleatorias con dados, monedas o cartas.
- Guardar historial o datos del usuario.
- Sustituir una explicación formal o curso de estadística.

---

## Alcance recomendado

### MVP

- Modo `Evento simple`.
- Modo `Complemento`.
- Modo `Unión`.
- Modo `Intersección`.
- Modo `Condicional`.
- Selector de formato de entrada `Porcentaje / Decimal` para campos de
  probabilidad.
- Opción de eventos mutuamente excluyentes en el modo unión.
- Opción de eventos independientes o probabilidad condicional conocida en el
  modo intersección.
- Resultado en porcentaje, decimal y fracción.
- Fórmula general y sustitución de valores.
- Interpretación como `X de cada 100` y, cuando sea legible, `1 de cada N`.
- Validaciones matemáticas con mensajes explicativos.
- Ejemplo específico por modo.
- Copiar resultado y limpiar formulario.

### Fase 2

- Árbol de probabilidad simple.
- Diagrama visual de unión e intersección.
- Simulación con dados, monedas y cartas.
- Espacios muestrales con resultados no equiprobables.
- Historial opcional en `sessionStorage`.
- Compartir un cálculo mediante parámetros de URL.

---

## Ruta y archivos

| Elemento          | Valor                                                                                                   |
| ----------------- | ------------------------------------------------------------------------------------------------------- |
| URL canónica      | `/probabilidad-estadistica/calculadora-probabilidad-basica`                                             |
| Archivo Astro     | `src/pages/probabilidad-estadistica/calculadora-probabilidad-basica.astro`                              |
| Lógica de cálculo | `src/lib/calculators/probabilidad-estadistica/calculadora-probabilidad-basica/basicProbability.ts`      |
| Pruebas unitarias | `src/lib/calculators/probabilidad-estadistica/calculadora-probabilidad-basica/basicProbability.test.ts` |
| Categoría         | `Probabilidad y estadística`                                                                            |
| Slug de categoría | `probabilidad-estadistica`                                                                              |
| Locale base       | `es-MX`                                                                                                 |

La categoría canónica es `Probabilidad y estadística` y su slug público es
`probabilidad-estadistica`. No se debe publicar una segunda página equivalente
dentro de Matemáticas.

---

## Definiciones del modelo

### Evento

Resultado o conjunto de resultados cuya probabilidad se desea calcular.

### Evento simple por casos

La fórmula `casos favorables / casos posibles` solo es válida cuando todos los
resultados elementales considerados son igualmente probables.

Por ejemplo, en un dado equilibrado los seis resultados son equiprobables. En
un proceso donde algunos resultados tienen mayor peso, no basta con contar
casos.

### Complemento

El evento `no A` contiene todos los resultados en los que `A` no ocurre.

### Unión

`A o B` significa que ocurre `A`, ocurre `B` o ocurren ambos.

### Intersección

`A y B` significa que ambos eventos ocurren.

### Eventos mutuamente excluyentes

Dos eventos son mutuamente excluyentes si no pueden ocurrir al mismo tiempo.
En ese caso:

```text
P(A y B) = 0
```

### Eventos independientes

Dos eventos son independientes cuando conocer el resultado de uno no cambia la
probabilidad del otro. Solo en ese caso puede calcularse:

```text
P(A y B) = P(A) × P(B)
```

### Probabilidad condicional

`P(A | B)` representa la probabilidad de que ocurra `A` sabiendo que `B` ya
ocurrió.

---

## Experiencia mobile first

### Principios

- Mantener corto el primer recorrido: elegir modo, ingresar datos y calcular.
- Mostrar solo los campos relevantes para el modo y relación seleccionados.
- No depender de tablas horizontales para la interfaz esencial.
- Mantener objetivos táctiles de al menos `44 × 44 px`.
- Usar etiquetas visibles; no depender únicamente de placeholders o iconos.
- Usar campos con texto de al menos `16 px` para evitar zoom involuntario.
- Mostrar el resultado principal inmediatamente después del formulario.
- No anunciar resultados parciales mientras el usuario escribe.
- Conservar el último resultado válido al editar, pero marcarlo como
  `Resultado anterior` y deshabilitar su copiado hasta recalcular.

### Orden de la interfaz en móvil

1. H1 y descripción breve.
2. Selector de modo.
3. Explicación contextual de una frase.
4. Selector `Porcentaje / Decimal`, cuando el modo use probabilidades.
5. Campos del modo activo.
6. Acción principal `Calcular probabilidad`.
7. Resultado principal.
8. Equivalencias e interpretación.
9. Fórmula y sustitución.
10. Acciones de copiar, probar ejemplo y limpiar.
11. Contenido educativo y FAQs.

En escritorio, formulario y resultado pueden mostrarse en dos columnas. El
orden del documento debe seguir siendo lógico sin estilos.

### Selector de modo

Cinco etiquetas en una sola fila no son fiables en pantallas pequeñas. Usar un
grupo de radios estilizado como tarjetas o control segmentado adaptable:

```text
[ Simple       ] [ Complemento ]
[ Unión        ] [ Intersección ]
[          Condicional          ]
```

Reglas:

- Usar etiquetas cortas en la interfaz.
- Mantener los nombres completos en el texto de ayuda.
- Comunicar la selección mediante el estado nativo del radio o `aria-pressed`.
- No depender únicamente del color para mostrar el modo activo.
- En escritorio puede convertirse en una fila si existe espacio suficiente.
- El selector no debe producir scroll horizontal en `320 px`.

### Campos numéricos

- Usar `input type="text"` con `inputmode="numeric"` para casos.
- Usar `input type="text"` con `inputmode="decimal"` para probabilidades.
- Permitir punto o coma como separador decimal.
- Mostrar la unidad `%` junto al campo en modo porcentaje.
- Mostrar ayudas como `Ejemplo: 25` o `Ejemplo: 0.25`, según el formato activo.
- No usar `type="number"` como único mecanismo de validación.

### Acción principal

- Usar un botón de ancho completo con la etiqueta `Calcular probabilidad`.
- Tras un cálculo válido, mover el foco al encabezado del resultado.
- Tras un intento inválido, mover el foco al resumen de errores.
- Anunciar el resultado mediante `aria-live="polite"`.
- El botón puede permanecer visible en móvil siempre que no cubra campos,
  errores ni acciones del sistema.

---

## Flujo principal del MVP

**Ejemplo:** hay `3` resultados favorables de `12` resultados posibles e
igualmente probables. ¿Cuál es la probabilidad?

1. El usuario elige un modo.
2. La calculadora muestra una explicación breve y únicamente los campos
   necesarios.
3. En modos con probabilidades, el usuario elige porcentaje o decimal.
4. El usuario ingresa los datos.
5. La calculadora valida límites y coherencia matemática.
6. El resultado muestra porcentaje, decimal, fracción, interpretación y
   sustitución de la fórmula.
7. El usuario puede copiar el resumen, probar otro ejemplo o limpiar.

---

## Inputs del MVP

### Formato de probabilidades

El selector se muestra en todos los modos excepto `Evento simple`.

| Formato    | Valores válidos | Ejemplo de 25% |
| ---------- | --------------- | -------------- |
| Porcentaje | `0` a `100`     | `25`           |
| Decimal    | `0` a `1`       | `0.25`         |

Reglas de captura:

- `Porcentaje` es el formato inicial.
- Aceptar hasta `6` decimales.
- Aceptar coma o punto decimal, pero no ambos en un mismo valor.
- En modo porcentaje se puede pegar `25%`; debe normalizarse a `25`.
- En modo decimal, un valor con `%` debe mostrar:

  > Cambia el formato a porcentaje o escribe la probabilidad como decimal.

- No interpretar silenciosamente `25` como `0.25` en modo decimal.
- No permitir mezclar formatos entre campos de un mismo cálculo.
- Los valores se normalizan internamente al rango `0-1`.

### Campos por modo

| Modo          | Campos y controles                                | Valores iniciales      |
| ------------- | ------------------------------------------------- | ---------------------- |
| Evento simple | Casos favorables, casos posibles                  | Vacíos                 |
| Complemento   | `P(A)`                                            | Vacío                  |
| Unión         | `P(A)`, `P(B)`, relación y, si aplica, `P(A y B)` | Relación general       |
| Intersección  | Método, `P(A)` y `P(B)`, o `P(B)` y `P(A \| B)`   | Eventos independientes |
| Condicional   | `P(A y B)`, `P(B)`                                | Vacíos                 |

### Evento simple

| Campo            | Tipo   | Valores válidos       |
| ---------------- | ------ | --------------------- |
| Casos favorables | Entero | `0` a `1,000,000,000` |
| Casos posibles   | Entero | `1` a `1,000,000,000` |

Mostrar junto a los campos:

> Usa este modo cuando todos los resultados posibles tengan la misma
> probabilidad.

### Unión

Control `Relación entre los eventos`:

- `Pueden ocurrir juntos`.
- `No pueden ocurrir juntos`.

Si pueden ocurrir juntos, solicitar `P(A y B)`.

Si no pueden ocurrir juntos:

- Ocultar el campo de intersección.
- Usar `P(A y B) = 0`.
- Mostrar la etiqueta `Eventos mutuamente excluyentes`.

### Intersección

Control `¿Qué información conoces?`:

- `Son independientes`.
- `Conozco P(A | B)`.

Para eventos independientes solicitar:

- `P(A)`.
- `P(B)`.

Para probabilidad condicional conocida solicitar:

- `P(B)`.
- `P(A | B)`.

No ofrecer un cálculo automático para eventos dependientes cuando solo se
conocen `P(A)` y `P(B)`.

---

## Acciones del MVP

- `Calcular probabilidad`.
- `Probar ejemplo`.
- `Copiar resultado`.
- `Limpiar`.

Cambiar de modo debe limpiar los errores del modo anterior. Puede conservar los
datos de cada modo durante la sesión de la página para facilitar comparaciones,
pero no debe guardar información en almacenamiento persistente.

---

## Fórmulas y reglas de cálculo

### Evento simple

```text
P(A) = casos_favorables / casos_posibles
```

Esta fórmula requiere resultados equiprobables.

### Complemento

```text
P(no A) = 1 - P(A)
```

### Unión general

```text
P(A o B) = P(A) + P(B) - P(A y B)
```

La intersección se resta para no contar dos veces los resultados compartidos.

### Unión de eventos mutuamente excluyentes

```text
P(A y B) = 0
P(A o B) = P(A) + P(B)
```

### Intersección de eventos independientes

```text
P(A y B) = P(A) × P(B)
```

La interfaz debe dejar claro que esta multiplicación solo es válida porque el
usuario indicó que los eventos son independientes.

### Intersección con probabilidad condicional

```text
P(A y B) = P(A | B) × P(B)
```

### Probabilidad condicional

```text
P(A | B) = P(A y B) / P(B)
```

`P(B)` debe ser mayor que cero.

---

## Precisión, fracciones y formato

### Precisión interna

- Normalizar las probabilidades al rango `0-1`.
- Mantener precisión completa durante el cálculo.
- No calcular a partir de valores previamente redondeados.
- No mostrar `NaN`, `Infinity`, `-0` ni resultados fuera del rango `0-1`.

### Porcentaje

- Mostrar hasta `2` decimales y eliminar ceros finales innecesarios.
- Mostrar `25%`, no `25.00%`.
- Si un resultado positivo se redondearía a `0%`, mostrar `< 0.01%`.
- Si un resultado menor que `100%` se redondearía a `100%`, mostrar
  `> 99.99%`.

### Decimal

- Mostrar hasta `6` decimales y eliminar ceros finales innecesarios.
- Mantener mayor precisión en la sustitución de la fórmula cuando sea necesaria
  para entender el resultado.

### Fracción

- En `Evento simple`, simplificar exactamente
  `casos_favorables / casos_posibles` mediante máximo común divisor.
- En los demás modos, convertir los valores decimales finitos ingresados a
  fracciones y simplificar el resultado cuando sea legible.
- Mostrar la fracción exacta sin símbolo adicional si el denominador
  simplificado es menor o igual a `10,000`.
- Si se usa una aproximación racional con denominador máximo de `10,000`,
  anteponer `≈`.
- No presentar una fracción aproximada como exacta.

Ejemplos:

```text
3/12 = 1/4
0.125 = 1/8
0.333333 ≈ 1/3
```

---

## Outputs del MVP

### Resultado principal

El porcentaje es el resultado visual principal:

```text
Probabilidad de A
25%
```

### Equivalencias

Debajo del porcentaje:

```text
Decimal: 0.25
Fracción: 1/4
```

### Interpretación

Mostrar al menos una frase:

```text
Equivale a 25 de cada 100 resultados.
```

Cuando la fracción unitaria sea exacta:

```text
Equivale a 1 de cada 4 resultados.
```

Si la equivalencia es aproximada, debe decirlo expresamente:

```text
Equivale aproximadamente a 1 de cada 3 resultados.
```

No mostrar `1 de cada N` cuando:

- La probabilidad es `0`.
- El resultado no puede expresarse de forma comprensible.
- La conversión produciría una interpretación engañosa.

Para `100%`, mostrar:

> El evento ocurre en todos los resultados considerados.

Para `0%`, mostrar:

> El evento no ocurre en ninguno de los resultados considerados.

### Fórmula y sustitución

Mostrar la fórmula general y una sustitución con los datos normalizados:

```text
P(A) = favorables / posibles
P(A) = 3 / 12 = 0.25
```

Para unión:

```text
P(A o B) = P(A) + P(B) - P(A y B)
P(A o B) = 0.4 + 0.5 - 0.2 = 0.7
```

### Nota conceptual

Mostrar una nota corta dependiente del modo:

- Simple: `Este cálculo supone resultados igualmente probables.`
- Unión: `La intersección se resta para evitar contarla dos veces.`
- Intersección independiente: `La multiplicación se usa porque marcaste los eventos como independientes.`
- Condicional: `El espacio de referencia se limita a los casos donde ocurrió B.`

---

## Validaciones, advertencias y estados

### Validaciones generales

- Todos los campos requeridos deben estar completos.
- Las probabilidades deben ser finitas.
- En porcentaje deben estar entre `0` y `100`.
- En decimal deben estar entre `0` y `1`.
- No aceptar más de `6` decimales.
- No aceptar signos negativos.
- No aceptar expresiones como `1/4` dentro de los campos del MVP.

### Evento simple

- Los casos deben ser enteros.
- Los casos posibles deben ser mayores que cero.
- Los casos favorables no pueden superar los casos posibles.

### Unión

Para cualquier par de eventos:

```text
limite_inferior = max(0, P(A) + P(B) - 1)
limite_superior = min(P(A), P(B))

limite_inferior <= P(A y B) <= limite_superior
```

No basta con validar únicamente el límite superior.

Ejemplo de error:

> Con P(A) = 80% y P(B) = 70%, ambos eventos deben coincidir al menos un 50%.

Si se indican eventos mutuamente excluyentes:

```text
P(A) + P(B) <= 1
```

Ejemplo de error:

> Dos eventos que no pueden ocurrir juntos no pueden sumar más de 100%.

El resultado de la unión también debe permanecer entre `0` y `1`.

### Intersección

Para eventos independientes:

```text
0 <= P(A) <= 1
0 <= P(B) <= 1
```

Para probabilidad condicional conocida:

```text
0 <= P(A | B) <= 1
0 <= P(B) <= 1
```

`P(B) = 0` puede producir una intersección de `0`, pero debe acompañarse de una
nota indicando que `P(A | B)` no tendría interpretación condicionada sobre un
evento imposible. Para mantener el flujo simple, el MVP debe bloquear este caso
cuando se elija el método condicional.

### Probabilidad condicional

```text
P(B) > 0
0 <= P(A y B) <= P(B)
```

Ejemplo de error:

> P(A y B) no puede ser mayor que P(B), porque la intersección forma parte de B.

### Advertencias no bloqueantes

- Evento simple:

  > Confirma que todos los resultados posibles sean igualmente probables.

- Resultado muy pequeño:

  > La probabilidad es positiva, aunque el porcentaje redondeado sea menor que
  > 0.01%.

- Intersección independiente:

  > La calculadora usa independencia porque así lo indicaste; no puede
  > comprobarla con estos datos.

### Estados de interfaz

| Estado                 | Comportamiento                                                                           |
| ---------------------- | ---------------------------------------------------------------------------------------- |
| Inicial                | Mostrar modo simple, campos vacíos y resultado neutral.                                  |
| Incompleto             | No mostrar un resultado final; señalar campos faltantes después de interacción o submit. |
| Inválido               | Mostrar errores junto a los campos y un resumen accesible.                               |
| Válido                 | Mostrar porcentaje, decimal, fracción, interpretación y fórmula.                         |
| Válido con advertencia | Mostrar el resultado y la advertencia contextual.                                        |
| Desactualizado         | Conservar el último resultado, marcarlo como anterior y deshabilitar copiar.             |
| Ejemplo cargado        | Completar los campos del modo activo y mostrar el resultado.                             |
| Limpio                 | Restaurar el modo simple, formato porcentaje y foco en el primer campo.                  |

---

## Ejemplos del MVP

### Evento simple

```text
Casos favorables: 3
Casos posibles: 12

Resultado: 25% = 0.25 = 1/4
Interpretación: 25 de cada 100; 1 de cada 4.
```

### Complemento

```text
P(A): 25%

P(no A) = 100% - 25% = 75%
Resultado: 75% = 0.75 = 3/4
```

### Unión

```text
P(A): 40%
P(B): 50%
P(A y B): 20%

P(A o B) = 40% + 50% - 20% = 70%
```

### Intersección independiente

```text
P(A): 40%
P(B): 50%

P(A y B) = 40% × 50% = 20%
```

### Intersección con probabilidad condicional

```text
P(B): 50%
P(A | B): 40%

P(A y B) = 40% × 50% = 20%
```

### Probabilidad condicional

```text
P(A y B): 20%
P(B): 50%

P(A | B) = 20% / 50% = 40%
```

---

## Copiar resultado

El texto copiable debe contener solo datos válidos y visibles:

```text
Probabilidad de A

Resultado: 25%
Decimal: 0.25
Fracción: 1/4
Interpretación: equivale a 25 de cada 100 resultados.

Fórmula: P(A) = casos favorables / casos posibles
Sustitución: P(A) = 3 / 12 = 0.25

Este cálculo supone resultados igualmente probables.
Calculado en calculadoras.tools
```

En cada modo se deben adaptar el título, fórmula, sustitución y nota conceptual.
No copiar un resultado marcado como desactualizado.

---

## Accesibilidad

- Asociar cada campo con su `label`, ayuda y mensaje de error.
- Agrupar selectores de modo, formato y relación mediante `fieldset` y
  `legend`, o una semántica equivalente.
- Mantener objetivos táctiles de al menos `44 × 44 px`.
- No depender únicamente del color para selección, errores o advertencias.
- Anunciar resultados, errores y estado de copiado mediante regiones
  `aria-live`.
- Mover el foco al resultado después de un cálculo válido.
- Mover el foco al resumen de errores después de un intento inválido.
- Mantener orden de foco lógico al cambiar de modo.
- No enfocar automáticamente el primer campo cada vez que el usuario cambia una
  opción secundaria.
- Respetar `prefers-reduced-motion` al desplazar la vista.
- Garantizar que porcentaje, decimal, fracción y fórmula puedan seleccionarse
  como texto.
- No ocultar información esencial únicamente en tooltips.

---

## Privacidad

- Todos los cálculos ocurren en el navegador.
- No enviar valores ni resultados a APIs externas.
- No guardar datos en el MVP.
- Explicar cualquier uso futuro de `sessionStorage` antes de incorporarlo.

---

## Contenido educativo y confianza

La página debe explicar:

- Cuándo puede usarse `casos favorables / casos posibles`.
- Qué significa que los resultados sean equiprobables.
- Diferencia entre `A o B` y `A y B`.
- Diferencia entre eventos independientes y mutuamente excluyentes.
- Por qué la unión resta la intersección.
- Qué cambia cuando una probabilidad es condicional.
- Cómo convertir entre fracción, decimal y porcentaje.

Incluir ejemplos cotidianos breves:

- Dado equilibrado.
- Moneda equilibrada.
- Extracción de cartas sin entrar en combinatoria avanzada.

Incluir enlaces contextuales a:

- Calculadora de combinaciones y permutaciones.
- Calculadora de estadística básica.
- Calculadora de distribución normal y Z-score, cuando exista.

---

## SEO y contenido

| Elemento             | Valor sugerido                                                                                                                                      |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Title                | `Calculadora de probabilidad: simple, unión y condicional`                                                                                          |
| Meta description     | `Calcula probabilidades simples, complementos, uniones, intersecciones y probabilidades condicionales con fórmula, fracción, decimal y porcentaje.` |
| H1                   | `Calculadora de probabilidad`                                                                                                                       |
| Keyword principal    | `calculadora de probabilidad`                                                                                                                       |
| Keywords secundarias | `probabilidad básica`, `probabilidad condicional`, `unión de eventos`, `intersección de eventos`, `casos favorables y posibles`                     |
| Canonical            | `/probabilidad-estadistica/calculadora-probabilidad-basica`                                                                                         |

### FAQs sugeridas

- ¿Cómo se calcula una probabilidad simple?
- ¿Cuándo puedo dividir casos favorables entre casos posibles?
- ¿Qué es el complemento de un evento?
- ¿Qué significa `P(A o B)`?
- ¿Qué significa `P(A y B)`?
- ¿Cuál es la diferencia entre eventos independientes y mutuamente excluyentes?
- ¿Qué es una probabilidad condicional?
- ¿Cómo convierto una probabilidad a porcentaje y fracción?

---

## Analítica sugerida

Medir sin guardar los valores introducidos:

- Uso de calcular.
- Modo seleccionado.
- Formato de entrada seleccionado.
- Uso de eventos mutuamente excluyentes.
- Método de intersección seleccionado.
- Uso de probar ejemplo.
- Errores de coherencia matemática por tipo.
- Uso de copiar resultado.

---

## Pruebas sugeridas

### Evento simple

- `3/12` produce `25%`, `0.25` y `1/4`.
- `0/12` produce `0%`, `0` y `0/1`.
- `12/12` produce `100%`, `1` y `1/1`.
- `1/3` conserva precisión interna y muestra `33.33%`, `0.333333` y `1/3`.
- Casos posibles `0` muestra error.
- Casos favorables mayores que posibles muestra error.
- Valores decimales o negativos en casos muestran error.

### Formatos de entrada

- `25` en porcentaje equivale a `0.25` en decimal.
- `25%` pegado en modo porcentaje se acepta y normaliza.
- `25%` en modo decimal muestra error explicativo.
- `0,25` y `0.25` producen el mismo resultado en modo decimal.
- Un valor que combina coma y punto muestra error.
- Los límites `0`, `1` y `100` se aceptan en el formato correspondiente.

### Complemento

- Complemento de `25%` produce `75%`, `0.75` y `3/4`.
- Complemento de `0%` produce `100%`.
- Complemento de `100%` produce `0%`.

### Unión

- `P(A)=0.4`, `P(B)=0.5`, `P(A y B)=0.2` produce `0.7`.
- Eventos mutuamente excluyentes con `0.4` y `0.5` producen `0.9`.
- Intersección mayor que `min(P(A), P(B))` muestra error.
- Para `P(A)=0.8` y `P(B)=0.7`, una intersección menor que `0.5` muestra error.
- Eventos mutuamente excluyentes cuya suma supera `1` muestran error.
- El resultado nunca supera `1`.

### Intersección

- Eventos independientes con `0.4` y `0.5` producen `0.2`.
- `P(B)=0.5` y `P(A | B)=0.4` producen una intersección de `0.2`.
- Método condicional con `P(B)=0` muestra error.
- La interfaz no multiplica `P(A)` y `P(B)` sin selección explícita de
  independencia.

### Probabilidad condicional

- `P(A y B)=0.2` y `P(B)=0.5` producen `0.4`.
- `P(B)=0` muestra error.
- `P(A y B) > P(B)` muestra error.
- `P(A y B)=0` con `P(B)>0` produce `0`.

### Precisión y formato

- Ningún resultado contiene `NaN`, `Infinity` o `-0`.
- El cálculo usa valores sin redondear.
- Un resultado positivo menor que `0.01%` no se muestra como `0%`.
- Una fracción aproximada incluye `≈`.
- El texto copiado coincide con el resultado visible.

### Interacción y accesibilidad

- En viewports de `320 px` y `390 px` no existe desbordamiento horizontal.
- El selector de cinco modos se puede usar sin scroll horizontal.
- Todos los controles frecuentes cumplen un área mínima de `44 × 44 px`.
- El modo, formato y relación seleccionados se comunican sin depender del color.
- El resultado se anuncia mediante `aria-live`.
- Un submit inválido muestra errores asociados a sus campos.
- Editar después de calcular marca el resultado anterior como desactualizado.
- No se puede copiar un resultado desactualizado.
- Limpiar restaura estado y foco.

---

## Criterios de aceptación del MVP

1. El usuario puede calcular probabilidades simples, complementos, uniones,
   intersecciones y probabilidades condicionales.
2. El modo simple comunica que requiere resultados equiprobables.
3. El formato porcentaje o decimal es explícito y no interpreta valores
   ambiguos silenciosamente.
4. La unión valida tanto el límite inferior como el superior de la
   intersección.
5. La calculadora no supone independencia sin indicación explícita del usuario.
6. La probabilidad condicional bloquea denominadores iguales a cero e
   intersecciones incoherentes.
7. Cada resultado válido incluye porcentaje, decimal, fracción,
   interpretación y fórmula sustituida.
8. El redondeo ocurre únicamente para presentación.
9. El usuario puede cargar un ejemplo, copiar un resumen útil y limpiar.
10. La experiencia esencial no depende de tablas ni scroll horizontal.
11. La interfaz funciona sin desbordamiento desde `320 px`.
12. Errores, advertencias y resultados son accesibles mediante teclado y
    tecnologías de asistencia.
13. La página mantiene una única URL canónica.
