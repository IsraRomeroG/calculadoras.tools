# Especificación v2 - Calculadora de precio promedio de compra (DCA)

## Descripción general

Herramienta para calcular y explicar el precio promedio de compra de un activo
después de realizar varias compras a precios distintos. Debe funcionar con
acciones, criptomonedas, fondos, ETFs o cualquier activo capturado manualmente.

También debe permitir simular una próxima compra para responder cómo cambiarían
el precio promedio, el costo efectivo y el capital total expuesto.

La herramienta sirve tanto para compras periódicas bajo una estrategia DCA como
para compras irregulares. No debe afirmar que toda serie de compras es DCA ni
que comprar más siempre mejora la inversión.

**Arquitectura:** todo el cálculo ocurre en el cliente. No requiere backend,
base de datos ni llamadas a APIs externas.

---

## Objetivo de producto

- Calcular unidades acumuladas y precio promedio de compra.
- Diferenciar claramente el precio promedio sin comisiones del costo efectivo
  por unidad incluyendo comisiones.
- Mostrar el precio necesario para recuperar el desembolso total.
- Mostrar valor actual, ganancia o pérdida no realizada y rendimiento cuando el
  usuario capture un precio actual.
- Simular cómo una próxima compra cambiaría el promedio y el capital expuesto.
- Permitir capturar compras manuales sin depender de precios en vivo.
- Explicar el cálculo y las limitaciones sin prometer rendimientos.
- Generar una página estática optimizada para SEO en Astro.

---

## Principios de presentación

- Usar `Monto de compra` para el dinero destinado a adquirir unidades.
- Usar `Comisión` para el costo adicional pagado por ejecutar la compra.
- Usar `Desembolso total` para `monto de compra + comisión`.
- No usar `precio promedio`, `costo efectivo` y `precio de equilibrio` como
  sinónimos.
- Explicar que el precio promedio de compra excluye comisiones.
- Explicar que el costo efectivo por unidad incluye comisiones y representa el
  precio de equilibrio antes de impuestos y costos de venta.
- No describir cualquier conjunto de compras como una estrategia DCA. DCA
  implica normalmente invertir cantidades iguales a intervalos regulares.
- Mostrar pérdidas y efectos desfavorables sin ocultarlos ni tratarlos como
  errores.
- Advertir que reducir el promedio mediante una nueva compra aumenta el capital
  expuesto y no garantiza una recuperación.
- No presentar ningún resultado como costo fiscal.

---

## Alcance recomendado

### MVP

- Lista editable de compras.
- Cada compra incluye monto de compra, precio por unidad, comisión adicional y
  fecha opcional.
- Nombre del activo y precio actual opcionales.
- Resumen con precio promedio, costo efectivo, unidades, desembolso, comisiones
  y ganancia o pérdida.
- Simulador de próxima compra usando monto, precio y comisión.
- Agregar, duplicar y eliminar compras.
- Botón `Usar ejemplo`.
- Bloque desplegable `Cómo se calculó`.
- Copiar resumen y limpiar formulario.

### Fase 2

- Pegar o importar compras desde CSV u hoja de cálculo.
- Exportar compras y resultados a CSV.
- Historial temporal en `sessionStorage`.
- Calcular cuánto comprar a un precio determinado para alcanzar un precio
  promedio objetivo, acompañado de una advertencia sobre capital expuesto.
- Modo de aportación periódica con una serie de precios capturada o una regla de
  evolución explícita.
- Comparador contra compra única usando exactamente las mismas fechas, precios,
  aportaciones y comisiones.

No simular una trayectoria de precios usando únicamente un precio inicial y uno
final. Sin definir los precios intermedios, el resultado sería arbitrario.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL pública recomendada | `/finanzas/calculadora-dca-costo-promedio` |
| Archivo Astro recomendado | `src/pages/finanzas/calculadora-dca-costo-promedio.astro` |
| Lógica de cálculo | `src/lib/calculators/finanzas/calculadora-dca-costo-promedio/dca.ts` |
| Pruebas unitarias | `src/lib/calculators/finanzas/calculadora-dca-costo-promedio/dca.test.ts` |
| Categoría | `finanzas` |
| Locale base | `es-MX` |
| Moneda inicial | `MXN`, símbolo `$` |

---

## Comportamiento mobile-first

### Orden de contenido en móvil

1. Nombre del activo, moneda y precio actual opcional.
2. Lista de compras presentada como tarjetas editables.
3. Botón de ancho completo `Agregar compra`.
4. Botón principal sticky `Calcular promedio`.
5. Resultado principal con precio promedio y costo efectivo.
6. Resumen de unidades, monto comprado, desembolso, comisiones y P/L.
7. Simulador de próxima compra.
8. Bloque desplegable `Cómo se calculó`.
9. Acciones secundarias: copiar resumen y limpiar.

### Tarjeta de compra en móvil

Cada tarjeta debe mostrar directamente:

- Número de compra.
- Monto de compra.
- Precio por unidad.
- Unidades calculadas cuando la fila sea válida.
- Acciones para duplicar y eliminar.

La fecha y comisión pueden colocarse dentro de un bloque desplegable
`Más detalles` para reducir la altura inicial.

En desktop puede utilizarse una tabla editable, siempre que conserve etiquetas
accesibles y no dependa exclusivamente del encabezado visual.

### Reglas de interfaz

- Usar controles táctiles de al menos `44px` de alto.
- Mantener etiquetas visibles; no depender solo de placeholders.
- Usar `input type="text"` con `inputmode="decimal"` para monto, precio y
  comisión.
- Mostrar prefijo de moneda sin incluirlo en el valor editable.
- Aceptar valores pegados con símbolos de moneda, comas, puntos y espacios.
- No reformatear el número mientras el usuario escribe; formatearlo al perder
  foco o al calcular.
- Mostrar errores debajo del campo o dentro de la tarjeta correspondiente.
- Anunciar cambios del resultado con `aria-live="polite"`.
- No depender solo del color para comunicar ganancia, equilibrio o pérdida.
- Ocultar las métricas de valor actual y P/L cuando no exista precio actual.
- Mantener el resultado antes del detalle extenso de compras.
- En pantallas amplias se puede usar formulario a la izquierda y resumen visible
  a la derecha.

---

## Flujo principal MVP

### Ejemplo principal

**Ejemplo:** Compré `$1,000` a precio `$50`, después `$1,000` a precio `$40` y
después `$1,000` a precio `$60`. ¿Cuál es mi precio promedio y cuánto necesito
que valga el activo para recuperar también las comisiones?

### Campos generales

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Nombre del activo | Texto opcional | 1-40 caracteres | vacío |
| Moneda | Selector | lista soportada | `MXN` |
| Precio actual | Texto numérico opcional | `> 0` | vacío |

La moneda únicamente cambia el símbolo y formato de presentación. No realiza
conversión de divisas.

### Campos por compra

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Monto de compra | Texto numérico | `> 0` | vacío |
| Precio por unidad | Texto numérico | `> 0` | vacío |
| Comisión adicional | Texto numérico | `>= 0` | `0` |
| Fecha de compra | Fecha opcional | fecha válida | vacío |

Mostrar cerca de `Monto de compra`:

> Es el dinero destinado a comprar el activo. La comisión se agrega por
> separado al desembolso total.

### Outputs principales

- Precio promedio de compra, sin comisiones.
- Costo efectivo por unidad o precio de equilibrio, incluyendo comisiones.
- Unidades acumuladas.
- Monto total destinado a compras.
- Comisiones totales.
- Comisión como porcentaje del desembolso total.
- Desembolso total.
- Diferencia entre precio promedio y costo efectivo.

### Outputs con precio actual

- Valor actual.
- Ganancia o pérdida no realizada.
- Rendimiento porcentual sobre el desembolso total.
- Diferencia monetaria por unidad contra el precio de equilibrio.
- Subida necesaria o caída disponible para llegar al equilibrio.
- Estado: pérdida, equilibrio o ganancia.

---

## Semántica de comisiones

En el MVP, la comisión siempre se captura como un costo adicional al monto de
compra.

Ejemplo:

```text
monto_compra = $1,000
precio_unidad = $50
comision = $10

unidades = 20
desembolso = $1,010
precio_promedio_compra = $50
costo_efectivo = $50.50
```

Esta convención evita mostrar un precio promedio igual al precio actual mientras
el usuario continúa en pérdida por las comisiones.

No incluir en el MVP un selector para comisiones descontadas del monto. Ese
comportamiento puede agregarse posteriormente si existe una necesidad clara.

---

## Fórmulas

### Cálculo por compra

```text
unidades_fila = monto_compra / precio_por_unidad
desembolso_fila = monto_compra + comision
```

### Totales y promedios

```text
total_monto_compras = suma(monto_compra)
total_comisiones = suma(comision)
desembolso_total = total_monto_compras + total_comisiones
unidades_totales = suma(unidades_fila)

precio_promedio_compra = total_monto_compras / unidades_totales
costo_efectivo_unidad = desembolso_total / unidades_totales
diferencia_por_comisiones = costo_efectivo_unidad - precio_promedio_compra
porcentaje_comisiones = (total_comisiones / desembolso_total) * 100
```

`costo_efectivo_unidad` también se presenta como `Precio de equilibrio antes de
impuestos y costos de venta`.

### Valor actual y rendimiento

Calcular únicamente cuando exista un precio actual válido:

```text
valor_actual = unidades_totales * precio_actual
ganancia_no_realizada = valor_actual - desembolso_total
rendimiento = (ganancia_no_realizada / desembolso_total) * 100
diferencia_unidad_equilibrio = precio_actual - costo_efectivo_unidad
```

Si `precio_actual < costo_efectivo_unidad`:

```text
subida_necesaria_equilibrio =
  ((costo_efectivo_unidad / precio_actual) - 1) * 100
```

Si `precio_actual > costo_efectivo_unidad`:

```text
caida_disponible_equilibrio =
  (1 - (costo_efectivo_unidad / precio_actual)) * 100
```

Si ambos precios son iguales con la precisión interna, mostrar equilibrio.

---

## Simulador de próxima compra

El simulador usa los resultados actuales como punto de partida y no modifica la
lista de compras hasta que el usuario elija `Agregar esta compra`.

### Inputs

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Monto de próxima compra | Texto numérico | `> 0` | vacío |
| Precio de próxima compra | Texto numérico | `> 0` | precio actual o vacío |
| Comisión adicional | Texto numérico | `>= 0` | `0` |

### Outputs

- Nuevo precio promedio de compra.
- Nuevo costo efectivo por unidad.
- Nuevas unidades totales.
- Nuevo desembolso total.
- Cambio monetario y porcentual del precio promedio.
- Cambio monetario y porcentual del costo efectivo.
- Capital adicional requerido.

### Fórmulas

```text
nuevas_unidades = monto_proxima_compra / precio_proxima_compra
nuevo_total_monto_compras =
  total_monto_compras + monto_proxima_compra
nuevo_total_comisiones =
  total_comisiones + comision_proxima_compra
nuevo_desembolso =
  desembolso_total + monto_proxima_compra + comision_proxima_compra
nuevas_unidades_totales =
  unidades_totales + nuevas_unidades

nuevo_precio_promedio =
  nuevo_total_monto_compras / nuevas_unidades_totales
nuevo_costo_efectivo =
  nuevo_desembolso / nuevas_unidades_totales

cambio_precio_promedio =
  nuevo_precio_promedio - precio_promedio_compra
cambio_costo_efectivo =
  nuevo_costo_efectivo - costo_efectivo_unidad
```

### Interpretación

Mostrar una frase factual:

> Si compras `$5,000` adicionales a `$40`, tu precio promedio cambiaría de
> `$52.17` a `$47.82`. Tu desembolso total aumentaría a `$8,030`.

Mostrar siempre:

> Comprar más puede reducir o aumentar tu promedio y siempre incrementa el
> capital expuesto. No garantiza recuperar pérdidas.

Si el precio de la próxima compra es mayor al precio promedio actual, indicar
claramente que el promedio aumentaría.

---

## Interpretación del resultado

La interpretación principal debe responder primero qué precio tiene el usuario
y cuál es su punto de equilibrio.

### Sin precio actual

> Tu precio promedio de compra es `$48.65`. Incluyendo `$30` de comisiones,
> necesitas un precio de `$49.14` por unidad para recuperar tu desembolso antes
> de impuestos y costos de venta.

### Con ganancia

> El precio actual está `$6.20` por unidad sobre tu punto de equilibrio. Tu
> ganancia no realizada es `$1,240`, equivalente a `12.4%` del desembolso.

### En equilibrio

> El precio actual coincide con tu costo efectivo. Antes de impuestos y costos
> de venta, no existe ganancia ni pérdida no realizada.

### Con pérdida

> El precio actual está `$4.10` por unidad debajo de tu punto de equilibrio.
> Necesitaría subir `9.3%` para llegar al equilibrio antes de impuestos y costos
> de venta.

---

## Bloque `Cómo se calculó`

Mostrar un desglose compacto usando los valores agregados.

```text
Unidades totales = suma de unidades de cada compra
Precio promedio = total destinado a compras / unidades totales
Costo efectivo = desembolso total / unidades totales
Ganancia o pérdida = valor actual - desembolso total
Rendimiento = ganancia o pérdida / desembolso total x 100
```

Cuando existan comisiones, incluir una línea que explique cuánto elevaron el
precio de equilibrio por unidad.

---

## Validaciones y estados

### Compras

- Requerir al menos una compra completa y válida para calcular.
- Ignorar tarjetas completamente vacías.
- Si una tarjeta contiene algún dato pero está incompleta o es inválida,
  bloquear el cálculo y marcarla claramente.
- No omitir silenciosamente una compra parcial.
- Monto de compra y precio por unidad deben ser mayores que cero.
- Comisión debe ser mayor o igual a cero.
- La comisión puede superar el monto de compra, pero debe mostrar una
  advertencia por ser un costo inusualmente alto.
- La fecha es opcional y no altera los cálculos del MVP.

### Campos opcionales

- Precio actual vacío no es un error; ocultar P/L y métricas relacionadas.
- Precio actual capturado debe ser mayor que cero.
- Nombre del activo vacío no es un error.
- Una próxima compra inválida no debe invalidar el resultado principal.
- `Agregar esta compra` solo debe habilitarse con una simulación válida.

### Precisión y seguridad

- Mantener toda la precisión disponible durante los cálculos.
- No redondear valores intermedios.
- Mostrar importes monetarios normalmente con 2 decimales.
- Mostrar precios pequeños con hasta 12 decimales significativos cuando sea
  necesario.
- Mostrar unidades con hasta 12 decimales significativos y eliminar ceros
  finales innecesarios.
- Permitir configurar la precisión visual de unidades entre 2 y 12 decimales;
  usar 8 como valor inicial.
- Evitar `NaN`, infinito y divisiones entre cero en todos los estados.
- Determinar ganancia, equilibrio o pérdida con precisión interna, no con el
  valor redondeado visible.

---

## Acciones

### Agregar compra

- Añadir una tarjeta vacía después de la última compra.
- Mover el foco al campo `Monto de compra`.

### Duplicar compra

- Copiar monto, precio y comisión.
- No copiar la fecha para evitar registrar accidentalmente dos compras
  idénticas en el mismo día.

### Eliminar compra

- No requerir confirmación si existen varias compras.
- Si es la única tarjeta, vaciarla en lugar de eliminarla.

### Agregar esta compra

- Convertir los datos válidos del simulador en una nueva compra.
- Limpiar el simulador después de agregarla.
- Recalcular el resultado principal.

### Usar ejemplo

- Cargar tres compras, al menos una comisión y un precio actual.
- Calcular y mostrar todos los estados aplicables.

### Copiar resumen

Debe incluir:

- Nombre del activo, si existe.
- Precio promedio de compra.
- Costo efectivo o precio de equilibrio.
- Unidades acumuladas.
- Monto de compras, comisiones y desembolso total.
- Precio actual, valor actual, P/L y rendimiento, si aplican.
- Resultado de la simulación, si existe.
- Nota breve sobre factores no considerados.

No incluir datos fiscales ni afirmar que el resultado es asesoría financiera.

### Limpiar

- Restablecer campos generales, compras, simulación y resultados.
- Volver al estado inicial.
- Pedir confirmación únicamente si hay más de una compra con datos, porque el
  MVP no conserva historial.

---

## Limitaciones y advertencias

Mostrar cerca del resultado:

> Esta calculadora estima el precio promedio y el rendimiento no realizado con
> los datos capturados. No considera impuestos, comisión de venta, spreads,
> dividendos, intereses, tipo de cambio, ventas parciales ni retiros.

También explicar:

- No utiliza precios en vivo.
- No calcula rendimiento anualizado ni rendimiento ponderado por tiempo.
- No determina el costo fiscal del activo.
- No evalúa riesgo, diversificación, liquidez ni conveniencia de comprar más.
- El rendimiento no realizado cambia con el precio y no representa una ganancia
  cobrada.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora DCA y precio promedio de compra` |
| Meta description | `Calcula tu precio promedio de compra, costo efectivo con comisiones, punto de equilibrio y cómo cambiaría con una próxima compra.` |
| H1 | `Calculadora de precio promedio de compra (DCA)` |
| Keyword principal | `calculadora precio promedio` |
| Keywords secundarias | `calculadora DCA`, `costo promedio inversión`, `promediar a la baja`, `precio promedio acciones`, `precio promedio criptomonedas` |

### Contenido educativo recomendado

- Diferencia entre precio promedio y costo efectivo.
- Qué significa DCA y cuándo una serie de compras no es DCA.
- Cómo afectan las comisiones al punto de equilibrio.
- Qué ocurre al comprar por debajo o por encima del promedio.
- Riesgo de aumentar capital para reducir el promedio.
- Diferencia entre rendimiento no realizado y ganancia realizada.
- Limitaciones del cálculo ante ventas parciales e impuestos.

### FAQs sugeridas

- ¿Cómo se calcula el precio promedio de varias compras?
- ¿Cuál es la diferencia entre precio promedio y costo efectivo?
- ¿Las comisiones cambian mi precio de equilibrio?
- ¿Qué significa DCA?
- ¿Comprar más siempre reduce mi precio promedio?
- ¿Cuánto necesito que suba para quedar en equilibrio?
- ¿La calculadora usa precios en vivo?
- ¿Este resultado sirve como costo fiscal?

---

## Pruebas sugeridas

### Cálculos principales

- Tres compras de igual monto a precios distintos calculan unidades y precio
  promedio correctos.
- Compras con montos distintos ponderan el promedio por unidades, no por número
  de compras.
- Compra de `$1,000` a `$50` con comisión `$10` produce `20` unidades, precio
  promedio `$50` y costo efectivo `$50.50`.
- Comisiones cero hacen que precio promedio y costo efectivo sean iguales.
- El desembolso total suma monto de compras y comisiones una sola vez.
- Comisión alta no invalida la compra, pero produce advertencia.

### Precio actual y P/L

- Precio actual vacío no produce error ni muestra P/L.
- Precio actual igual al precio promedio pero inferior al costo efectivo muestra
  una pérdida por comisiones.
- Precio actual igual al costo efectivo muestra equilibrio.
- Rendimiento se calcula contra desembolso total.
- Precio actual inferior al costo efectivo calcula correctamente la subida
  necesaria para equilibrio.
- Precio actual superior al costo efectivo calcula correctamente la caída
  disponible hasta equilibrio.

### Simulador de próxima compra

- Comprar por debajo del promedio reduce el nuevo promedio.
- Comprar por encima del promedio aumenta el nuevo promedio.
- Comisión de la próxima compra aumenta el nuevo costo efectivo.
- La simulación no modifica las compras existentes.
- `Agregar esta compra` agrega la fila, limpia la simulación y recalcula.
- Una simulación inválida no elimina ni invalida el resultado principal.

### Entrada, precisión y estados

- Tarjetas completamente vacías se ignoran.
- Una tarjeta parcialmente capturada bloquea el cálculo y muestra error.
- Monto o precio igual a cero se rechaza.
- Comisión negativa se rechaza.
- Inputs con símbolos de moneda, comas, puntos y espacios se interpretan
  correctamente.
- Precios y unidades de criptomonedas con hasta 12 decimales conservan precisión.
- Ningún estado válido o inválido muestra `NaN` o infinito.
- Un resultado muy cercano a equilibrio conserva el estado correcto aunque el
  valor visible se redondee.
- Copiar resumen incluye únicamente métricas disponibles.

### Interfaz mobile-first

- Las tarjetas no generan desplazamiento horizontal en viewport móvil.
- Los controles principales tienen al menos `44px` de alto.
- El botón sticky no oculta campos, errores ni acciones.
- El resultado puede entenderse sin depender del color.
- Los errores se asocian con su campo y son anunciables por tecnologías de
  asistencia.
