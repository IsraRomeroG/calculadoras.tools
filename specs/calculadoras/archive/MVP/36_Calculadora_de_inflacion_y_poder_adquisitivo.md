# Especificación v2 - Calculadora de inflación y poder adquisitivo

## Descripción general

Herramienta para estimar cómo cambia el costo de los bienes y el poder
adquisitivo de una cantidad de dinero cuando el usuario ingresa una tasa de
inflación anual manual.

Debe responder de forma clara preguntas como:

- "¿Cuánto necesitaré en el futuro para comprar lo mismo que hoy?"
- "¿Cuánto valdrá en dinero de hoy una cantidad que tendré en el futuro?"
- "¿Qué porcentaje de poder de compra conservará mi dinero?"
- "¿Cómo cambia el resultado si la inflación es un poco menor o mayor?"

La calculadora debe distinguir explícitamente entre:

- **Aumento acumulado de precios:** cuánto más costaría comprar lo mismo.
- **Pérdida de poder adquisitivo:** qué proporción de compra pierde una cantidad
  que no aumenta.

Estos porcentajes no son equivalentes. Por ejemplo, si los precios aumentan
`100%`, el dinero pierde `50%` de poder adquisitivo.

**Arquitectura:** todo el cálculo ocurre en el cliente. No requiere backend,
base de datos ni llamadas a APIs externas. La inflación se captura manualmente.

---

## Objetivo de producto

- Traducir una tasa de inflación abstracta a cantidades comprensibles.
- Calcular cuánto costará en el futuro algo que tiene un precio actual.
- Calcular el poder adquisitivo actual de una cantidad futura.
- Mostrar por separado aumento de precios, poder adquisitivo restante y pérdida
  de poder adquisitivo.
- Ayudar al usuario a entender la incertidumbre mediante escenarios sencillos.
- Evitar depender de datos oficiales o tasas en vivo.
- Generar una página estática optimizada para SEO en Astro.

---

## Alcance recomendado

### MVP

- Modo `¿Cuánto costará?`: equivalencia futura de un precio actual.
- Modo `¿Cuánto valdrá mi dinero?`: poder adquisitivo actual de una cantidad
  futura.
- Cantidad, inflación anual y plazo.
- Ejemplo editable cargado por defecto.
- Resultado principal expresado como una frase fácil de interpretar.
- Resumen con:
  - aumento acumulado de precios;
  - poder adquisitivo restante;
  - pérdida de poder adquisitivo porcentual y monetaria.
- Indicador visual ligero: `De cada $100 conservarías...`.
- Comparación de inflación baja, tasa ingresada e inflación alta.
- Detalle anual colapsable.
- Copiar resultado, limpiar formulario y exportar CSV.
- Aviso visible de que la tasa es ingresada por el usuario y no representa una
  proyección oficial.

### Fase 2

- Comparar dos tasas personalizadas.
- Agregar crecimiento de salario, ahorro o rendimiento.
- Simular una serie de tasas anuales o inflación mensual.
- Historial en `sessionStorage`.
- Enlace compartible con parámetros seguros en la URL.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL pública recomendada | `/finanzas/calculadora-de-inflacion-poder-adquisitivo` |
| Archivo Astro recomendado | `src/pages/finanzas/calculadora-de-inflacion-poder-adquisitivo.astro` |
| Lógica de cálculo | `src/lib/calculators/finanzas/calculadora-de-inflacion-poder-adquisitivo/inflation.ts` |
| Pruebas unitarias | `src/lib/calculators/finanzas/calculadora-de-inflacion-poder-adquisitivo/inflation.test.ts` |
| Categoría | `finanzas` |
| Locale base | `es-MX` |
| Moneda base | `MXN`, símbolo `$` |

---

## Experiencia mobile-first

### Orden de contenido en móvil

La experiencia debe diseñarse primero para anchos desde `320px`.

1. Título y explicación breve.
2. Control segmentado de ancho completo para cambiar de modo.
3. Formulario en una columna.
4. Resultado principal inmediatamente después de los inputs.
5. Resumen de métricas secundarias.
6. Indicador `De cada $100 conservarías...`.
7. Comparación de escenarios.
8. Detalle anual colapsable.
9. Acciones secundarias.
10. Explicación, fórmula, metodología y FAQs.

### Requisitos de interacción

- Usar etiquetas orientadas a la pregunta del usuario:
  - `¿Cuánto costará?`
  - `¿Cuánto valdrá mi dinero?`
- El control segmentado debe comunicar visualmente y mediante atributos ARIA el
  modo seleccionado.
- Mostrar todos los campos en una columna.
- Mostrar `Plazo` y `Unidad` en una misma fila con proporción aproximada `60/40`
  cuando haya al menos `320px` disponibles.
- Usar controles táctiles de al menos `44px` de alto.
- Usar `inputmode="decimal"` en campos numéricos.
- Mostrar errores debajo del campo correspondiente.
- Actualizar el resultado sin recargar la página y anunciarlo mediante
  `aria-live="polite"`.
- No depender únicamente del color para comunicar estados o comparaciones.
- Mantener el resultado principal visible antes de cualquier tabla.
- No usar gráficas pesadas en el MVP.
- Implementar el indicador de poder adquisitivo con HTML y CSS ligero.
- Mostrar escenarios como filas o tarjetas; no requerir scroll horizontal.
- Mostrar el detalle anual dentro de un elemento colapsable cerrado por defecto
  cuando tenga más de `10` filas.
- En móvil, mostrar el detalle anual como filas compactas o tarjetas. En
  pantallas amplias puede mostrarse como tabla.
- Validar visualmente en `320px`, `360px`, `390px` y `430px`.

---

## Flujo principal MVP

### Estado inicial

Para evitar una pantalla vacía y explicar el producto desde el primer momento,
la calculadora debe iniciar con un ejemplo editable:

| Campo | Valor inicial |
|-------|---------------|
| Modo | `¿Cuánto costará?` |
| Cantidad | `$10,000` |
| Inflación anual | `5%` |
| Plazo | `10` |
| Unidad | `Años` |

La acción `Limpiar` sí debe dejar los campos vacíos y regresar al modo
`¿Cuánto costará?`.

### Ejemplo principal

Si algo cuesta `$10,000` hoy y la inflación promedio es `5%` anual, en `10
años` costaría aproximadamente `$16,288.95`.

La interfaz debe explicarlo así:

> Para comprar en 10 años lo que hoy cuesta $10,000, necesitarías
> aproximadamente $16,288.95.

Resumen:

- Necesitarías `$6,288.95` adicionales.
- Los precios habrían aumentado `62.89%`.
- Una cantidad que no creciera conservaría `61.39%` de su poder adquisitivo.
- La pérdida de poder adquisitivo sería `38.61%`.
- `$10,000` dentro de 10 años comprarían aproximadamente lo que hoy compran
  `$6,139.13`.

---

## Inputs del MVP

| Campo | Tipo | Rango válido | Valor inicial |
|-------|------|--------------|---------------|
| Modo | Control segmentado | `¿Cuánto costará?`, `¿Cuánto valdrá mi dinero?` | `¿Cuánto costará?` |
| Cantidad | Texto numérico | `> 0` y `<= 999,999,999,999.99` | `$10,000` |
| Inflación anual (%) | Texto numérico | `0%–100%` | `5%` |
| Plazo | Texto numérico | `> 0`, hasta `100 años` | `10` |
| Unidad de plazo | Selector | `Meses`, `Años` | `Años` |

### Etiquetas y ayuda contextual

Las etiquetas deben cambiar según el modo:

| Modo | Etiqueta de cantidad | Ayuda |
|------|----------------------|-------|
| `¿Cuánto costará?` | `Precio actual` | `Lo que cuesta hoy el producto, servicio o gasto.` |
| `¿Cuánto valdrá mi dinero?` | `Cantidad futura` | `El dinero que esperas tener o recibir en el futuro.` |

Junto al input de inflación se debe mostrar:

> Usa una tasa anual promedio que quieras explorar. Esta calculadora no consulta
> ni predice la inflación oficial.

### Formatos numéricos aceptados

- Aceptar cantidades con símbolo monetario y separadores comunes.
- Aceptar porcentajes con o sin `%`.
- Interpretar correctamente formatos como:
  - `10000.50`
  - `10,000.50`
  - `10.000,50`
  - `$10,000`
  - `5,5%`
- Permitir hasta `2` decimales en cantidades y plazo.
- Permitir hasta `4` decimales en la tasa durante la captura.
- Formatear resultados monetarios y porcentajes con `2` decimales.

---

## Definiciones y fórmulas

```text
monto = cantidad
i = inflacion_anual / 100
t = plazo_en_años
factor_inflacion = (1 + i)^t
```

Para plazo en meses:

```text
t = meses / 12
```

Métricas comunes:

```text
aumento_precios_pct = (factor_inflacion - 1) * 100
poder_adquisitivo_restante_pct = (1 / factor_inflacion) * 100
perdida_poder_adquisitivo_pct =
  (1 - 1 / factor_inflacion) * 100
```

### Modo `¿Cuánto costará?`

```text
costo_futuro = monto * factor_inflacion
monto_adicional_necesario = costo_futuro - monto
valor_futuro_en_dinero_de_hoy = monto / factor_inflacion
perdida_poder_adquisitivo_monetaria =
  monto - valor_futuro_en_dinero_de_hoy
```

Interpretación:

- `costo_futuro` responde cuánto se necesitaría para comprar lo mismo.
- `monto_adicional_necesario` no debe etiquetarse como pérdida de poder
  adquisitivo.
- `valor_futuro_en_dinero_de_hoy` muestra qué podría comprar en el futuro la
  cantidad original si permaneciera sin cambios.

### Modo `¿Cuánto valdrá mi dinero?`

```text
valor_presente = monto / factor_inflacion
perdida_poder_adquisitivo_monetaria = monto - valor_presente
```

Interpretación:

- `valor_presente` responde cuánto representa hoy una cantidad futura.
- La pérdida monetaria compara la cifra nominal futura con su poder adquisitivo
  expresado en dinero de hoy.

### Casos especiales

- Si la inflación es `0%`, el factor es `1`, los valores no cambian y la
  pérdida de poder adquisitivo es `0%`.
- Los cálculos deben usar valores sin redondear; redondear únicamente al
  presentar resultados.
- Si un resultado deja de ser finito, bloquear la presentación y mostrar un
  mensaje para reducir cantidad, tasa o plazo.

---

## Resultados y visualización

### Resultado principal

El resultado principal debe ser una frase completa, no solamente una cifra.

Modo `¿Cuánto costará?`:

> Para comprar en {plazo} lo que hoy cuesta {cantidad}, necesitarías
> aproximadamente {costo_futuro}.

Modo `¿Cuánto valdrá mi dinero?`:

> {cantidad_futura} dentro de {plazo} tendría un poder adquisitivo aproximado de
> {valor_presente} en dinero de hoy.

### Resumen secundario

Mostrar como máximo cuatro métricas inmediatamente después del resultado:

| Métrica | Descripción |
|---------|-------------|
| Aumento acumulado de precios | Porcentaje en que aumentaría el costo equivalente |
| Poder adquisitivo restante | Porcentaje de compra que conservaría una cantidad sin crecimiento |
| Pérdida de poder adquisitivo | Porcentaje y cantidad monetaria perdida |
| Cantidad adicional necesaria | Solo en modo `¿Cuánto costará?` |

### Indicador de poder adquisitivo

Mostrar una frase y una barra ligera:

> De cada $100, conservarías aproximadamente {poder_restante} de poder de compra.

- La barra debe representar visualmente el porcentaje restante entre `0%` y
  `100%`.
- Debe incluir el valor como texto y ser comprensible sin color.

### Comparación de escenarios

Mostrar tres escenarios calculados automáticamente:

| Escenario | Tasa |
|-----------|------|
| Inflación baja | `max(0, tasa_ingresada - 2 puntos porcentuales)` |
| Tasa ingresada | `tasa_ingresada` |
| Inflación alta | `min(100, tasa_ingresada + 2 puntos porcentuales)` |

Cada escenario debe mostrar:

- tasa utilizada;
- resultado monetario principal;
- diferencia monetaria frente a la tasa ingresada;
- poder adquisitivo restante.

Reglas:

- Explicar que son escenarios ilustrativos, no pronósticos.
- Omitir escenarios duplicados cuando la tasa esté cerca de `0%` o `100%`.
- Permitir aplicar la tasa baja o alta al formulario mediante una acción
  explícita y recalcular.

### Detalle anual

El detalle debe incluir una fila por cada año completo y una fila final para un
periodo parcial.

Columnas:

| Columna | Descripción |
|---------|-------------|
| Periodo | `Año 1`, `Año 2` o una duración parcial comprensible |
| Tasa anual | Tasa manual utilizada |
| Aumento acumulado de precios | Aumento desde el inicio |
| Costo equivalente | Cuánto se necesitaría para comprar lo mismo |
| Poder adquisitivo equivalente | Valor en dinero inicial de una cantidad sin crecimiento |
| Poder adquisitivo restante | Porcentaje restante |

La exportación CSV debe incluir todas las filas, aunque el detalle esté
colapsado.

### Acciones secundarias

- `Copiar resultado`: copiar una explicación legible con inputs, resultado,
  métricas y aviso de estimación.
- `Limpiar`: vaciar campos y restablecer el modo inicial.
- `Exportar CSV`: exportar el detalle completo.

---

## Validaciones y estados

### Errores bloqueantes

| Caso | Comportamiento |
|------|----------------|
| Cantidad vacía, inválida o `<= 0` | Mostrar error debajo del campo |
| Cantidad superior al máximo | Pedir una cantidad menor |
| Inflación vacía, inválida o `< 0%` | Mostrar error debajo del campo |
| Inflación `> 100%` | Pedir una tasa dentro del rango |
| Plazo vacío, inválido o `<= 0` | Mostrar error debajo del campo |
| Plazo superior a `100 años` o `1,200 meses` | Pedir un plazo menor |
| Resultado no finito | Mostrar error general y no renderizar resultados |

### Advertencias no bloqueantes

| Caso | Comportamiento |
|------|----------------|
| Inflación `> 30%` | Advertir que es una tasa alta y que el resultado crece rápidamente |
| Plazo `> 50 años` | Advertir que pequeñas diferencias en la tasa cambian mucho el resultado |
| Inflación `0%` | Explicar que no hay pérdida de poder adquisitivo en el escenario |

### Cambio de unidad

- Al cambiar entre `Años` y `Meses`, convertir el valor actual para conservar la
  misma duración.
- Mostrar hasta `2` decimales después de convertir.
- No redondear internamente el plazo convertido.

### Estado vacío

Después de usar `Limpiar`:

- ocultar resultados anteriores;
- mostrar una instrucción breve para completar los tres campos;
- conservar accesibles los mensajes de error y ayuda;
- no sustituir campos vacíos por ceros.

---

## Accesibilidad

- Asociar cada input con una etiqueta visible.
- Asociar mensajes de ayuda y error mediante `aria-describedby`.
- Usar `aria-invalid="true"` en campos inválidos.
- Anunciar cambios relevantes del resultado con `aria-live="polite"`.
- Mantener orden de foco lógico.
- Permitir operar controles segmentados, acciones y detalle anual con teclado.
- No depender del color para distinguir escenarios o estados.
- Ofrecer contraste suficiente y foco visible.
- Usar encabezados y etiquetas claras en la tabla o tarjetas del detalle.

---

## Contenido educativo

La página debe explicar brevemente:

- Qué es la inflación.
- Qué significa poder adquisitivo.
- Por qué aumento de precios y pérdida de poder adquisitivo no son el mismo
  porcentaje.
- Por qué la inflación compuesta produce cambios mayores con plazos largos.
- Por qué una tasa manual representa un escenario y no una predicción.

La fórmula debe mostrarse después de los resultados, nunca antes del flujo
principal.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de inflación y poder adquisitivo` |
| Meta description | `Calcula cuánto necesitarás en el futuro y cuánto poder adquisitivo conservará tu dinero con una tasa de inflación anual.` |
| H1 | `Calculadora de inflación y poder adquisitivo` |
| Keyword principal | `calculadora de inflación` |
| Keywords secundarias | `poder adquisitivo`, `valor futuro con inflación`, `valor presente inflación`, `pérdida de poder adquisitivo` |

### FAQs sugeridas

- ¿La calculadora usa inflación oficial?
- ¿Cómo se calcula cuánto costará algo en el futuro?
- ¿Qué es el poder adquisitivo?
- ¿Por qué el aumento de precios y la pérdida de poder adquisitivo son
  diferentes?
- ¿Qué tasa de inflación debo ingresar?
- ¿Por qué pequeñas diferencias en la tasa cambian tanto el resultado?

---

## Pruebas unitarias sugeridas

### Cálculos

- `1000`, `10%`, `1 año` produce costo futuro `1100`.
- `1100`, `10%`, `1 año` produce valor presente `1000`.
- Inflación `0%` conserva el monto y produce pérdida `0%`.
- `100`, `100%`, `1 año` produce costo futuro `200`, poder adquisitivo
  restante `50%` y pérdida de poder adquisitivo `50%`.
- `10000`, `5%`, `10 años` produce costo futuro aproximado `$16,288.95`.
- `10000`, `5%`, `10 años` produce poder adquisitivo equivalente aproximado
  `$6,139.13`.
- El aumento acumulado de precios y la pérdida de poder adquisitivo se calculan
  y etiquetan por separado.
- Un plazo de `18 meses` equivale a `1.5 años`.
- Un plazo parcial genera una fila final adicional.
- Los escenarios respetan los límites de `0%` y `100%` y omiten duplicados.
- Aplicar un escenario actualiza la tasa y recalcula.
- Los cálculos usan valores sin redondear internamente.

### Parseo y validaciones

- Aceptar `10000.50`, `10,000.50`, `10.000,50` y `$10,000`.
- Aceptar `5`, `5%` y `5,5%` como tasas válidas.
- Rechazar cantidades negativas, cero o superiores al máximo.
- Rechazar inflación negativa o superior a `100%`.
- Rechazar plazos de cero o superiores al máximo.
- Inflación alta muestra advertencia sin bloquear el cálculo.
- Cambio entre meses y años conserva la duración.

---

## Criterios de aceptación

1. La calculadora distingue correctamente aumento de precios y pérdida de poder
   adquisitivo.
2. Ambos modos producen resultados matemáticamente correctos.
3. El resultado principal se expresa como una frase comprensible.
4. El ejemplo inicial produce resultados útiles sin requerir captura.
5. La comparación de escenarios responde al cambiar cantidad, tasa o plazo.
6. Los escenarios se identifican como ilustrativos y no como pronósticos.
7. El indicador `De cada $100...` coincide con el poder adquisitivo restante.
8. El detalle anual incluye periodos completos y parciales correctamente.
9. Copiar resultado y exportar CSV incluyen datos coherentes con la pantalla.
10. Errores y advertencias se muestran en los estados definidos.
11. El flujo principal es utilizable con teclado y lector de pantalla.
12. La interfaz no presenta scroll horizontal en `320px`, `360px`, `390px` ni
    `430px`.
13. El resultado principal aparece antes del detalle anual en móvil.
14. Ningún texto afirma que la tasa manual es oficial o predictiva.
