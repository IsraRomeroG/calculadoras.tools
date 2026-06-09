# Especificación v2 - Calculadora de margen de ganancia, markup y precio de venta

## Descripción general

Herramienta para analizar la rentabilidad estimada de una venta y calcular un
precio de venta que alcance un margen o markup objetivo. Está pensada para
freelancers, tiendas, e-commerce, servicios y pequeños negocios.

La calculadora debe ayudar a responder preguntas accionables:

- ¿Cuánto gano realmente por cada venta?
- ¿Qué porcentaje del precio consumen mis costos?
- ¿A qué precio debo vender para alcanzar mi objetivo?
- ¿Cuál es el precio mínimo antes de comenzar a perder?
- ¿Qué descuento máximo puedo ofrecer sin perder por esa venta?
- ¿Cuál es la diferencia entre margen y markup?

**Arquitectura:** todo el cálculo ocurre en el cliente. No requiere backend,
base de datos ni llamadas a APIs externas.

**Alcance financiero:** los resultados representan una estimación por venta.
No incluyen impuestos ni gastos generales del negocio, como renta, nómina,
publicidad o suscripciones, salvo que el usuario los distribuya manualmente
dentro de los costos por venta.

---

## Objetivo de producto

- Analizar margen, markup y ganancia estimada desde costo y precio.
- Calcular el precio necesario para alcanzar un margen objetivo.
- Calcular el precio necesario para alcanzar un markup objetivo.
- Incluir costos fijos por venta y una comisión porcentual sobre el precio.
- Mostrar un precio comercial redondeado sin quedar debajo del objetivo.
- Explicar el resultado con lenguaje útil y evitar confundir margen con markup.
- Generar una página estática optimizada para SEO en Astro.

---

## Decisiones de producto y semántica

### Ganancia estimada por venta

Usar el término **ganancia estimada por venta** en lugar de `utilidad bruta`.
La calculadora no conoce todos los gastos ni impuestos del negocio y no debe
presentar el resultado como utilidad contable.

Mostrar cerca del resultado:

> Estimación antes de impuestos y gastos generales del negocio.

### Costos fijos por venta

Son importes que no cambian al modificar el precio dentro de esta simulación:

- Costo base del producto, materiales o trabajo.
- Envío pagado por el negocio.
- Empaque.
- Cargo fijo por venta.
- Otros costos directos.

### Comisión porcentual

La comisión porcentual se calcula sobre el precio final de venta. Sirve para
modelar de forma sencilla comisiones de cobro, plataformas o vendedores.

La calculadora debe indicar claramente:

> La comisión porcentual se aplica al precio final de venta.

No modelar múltiples bases, impuestos sobre comisiones o tarifas específicas de
marketplaces. Para esos casos, enlazar a la calculadora especializada de
comisión de marketplace.

### Margen y markup

- **Margen de ganancia:** ganancia estimada dividida entre precio de venta.
- **Markup:** ganancia estimada dividida entre costo total efectivo de la venta.

El costo total efectivo incluye los costos fijos por venta y la comisión
porcentual calculada para ese precio.

Mostrar siempre una explicación breve:

> El margen se calcula sobre el precio de venta. El markup se calcula sobre el
> costo total efectivo.

### Precio mínimo para no perder

Representa el precio que cubre los costos directos incluidos por el usuario. No
incluye automáticamente renta, nómina, impuestos u otros gastos generales.

Etiquetar como:

> Precio mínimo por venta

Complementar con:

> Cubre los costos capturados, pero no necesariamente todos los gastos de tu
> negocio.

Mostrar como resultado principal de equilibrio el precio mínimo cobrable,
redondeado hacia arriba al centavo. El valor matemático exacto puede mostrarse
dentro del detalle del cálculo.

---

## Alcance recomendado

### MVP

- Tres modos: `Analizar`, `Por margen` y `Por markup`.
- Costo base y dato objetivo según el modo.
- Costos adicionales opcionales por venta.
- Comisión porcentual opcional sobre el precio.
- Resultado principal adaptado al modo activo.
- Ganancia estimada, margen, markup y costo total efectivo.
- Precio mínimo por venta y descuento máximo sin perder.
- Precio exacto y precio comercial redondeado.
- Escenarios rápidos por margen objetivo.
- Desglose de costos como proporción del precio.
- Copiar resumen y limpiar formulario.

### Fase 2

- Impuestos y descuentos capturados como inputs.
- Comparador de productos o canales de venta.
- Historial opt-in en `sessionStorage`.
- Exportar escenarios a CSV.
- Múltiples comisiones porcentuales y diferentes bases de cálculo.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL pública recomendada | `/finanzas/calculadora-de-margen-y-markup` |
| Archivo Astro recomendado | `src/pages/finanzas/calculadora-de-margen-y-markup.astro` |
| Lógica de cálculo | `src/lib/calculators/finanzas/calculadora-de-margen-y-markup/marginMarkup.ts` |
| Pruebas unitarias | `src/lib/calculators/finanzas/calculadora-de-margen-y-markup/marginMarkup.test.ts` |
| Categoría | `finanzas` |
| Locale base | `es-MX` |
| Moneda base | `MXN`, símbolo `$` |

---

## Experiencia mobile-first

### Orden del primer viewport

1. H1 y descripción breve.
2. Calculadora.
3. Control segmentado de modo.
4. Campos esenciales del modo activo.
5. Botón principal.
6. Resultado principal.

Evitar tablas, explicaciones largas y contenido SEO antes del resultado.

### Control de modos

Usar un control segmentado con etiquetas cortas:

- `Analizar`
- `Por margen`
- `Por markup`

El control debe:

- Caber desde `320px` sin cortar texto.
- Tener objetivos táctiles de al menos `44px` de alto.
- Comunicar el modo activo visualmente y mediante atributos ARIA.
- Conservar costos y opciones compartidas al cambiar de modo.
- Mostrar únicamente los campos relevantes del modo activo.

### Formulario

- Una sola columna en móvil.
- Mostrar inicialmente solo costo base y el dato requerido por el modo.
- Colocar costos adicionales dentro de un `<details>`.
- Usar como resumen del desplegable: `Costos adicionales: $X`.
- Colocar comisión y redondeo comercial dentro del mismo bloque opcional.
- Usar inputs de texto numérico con `inputmode="decimal"`.
- Mostrar prefijos o sufijos visuales para `$` y `%`, sin incluirlos en el valor.
- Mostrar errores inline junto al campo correspondiente.
- Usar un botón principal de ancho completo: `Calcular`.
- No usar elementos fijos que puedan quedar ocultos detrás del teclado móvil.

### Resultados

- Mostrar el resultado principal inmediatamente después del botón.
- Usar tarjetas apiladas en móvil.
- No depender únicamente de color para comunicar ganancia, equilibrio o pérdida.
- Mostrar cálculos secundarios y fórmulas dentro de un `<details>`.
- Anunciar cambios importantes mediante una región `aria-live="polite"`.
- En escritorio puede usarse una distribución de dos columnas y mantener el
  resultado visible durante la captura, sin aplicar comportamiento sticky en
  móvil.

### Anchos mínimos de validación visual

Validar como mínimo en:

- `320px`
- `360px`
- `390px`
- `430px`
- `768px`
- `1024px`

---

## Flujo principal del MVP

### Ejemplo introductorio

> Un producto cuesta `$300` y se vende en `$500`. ¿Cuánto gano, cuál es mi
> margen y cuál es mi markup?

### Modos

| Modo | Pregunta que responde | Campos requeridos |
|------|----------------------|-------------------|
| Analizar | ¿Qué tan rentable es este precio? | costo base, precio de venta |
| Por margen | ¿A qué precio alcanzo este margen? | costo base, margen objetivo |
| Por markup | ¿A qué precio alcanzo este markup? | costo base, markup objetivo |

### Campos esenciales por modo

| Campo | Modo | Tipo | Rango válido | Valor por defecto |
|-------|------|------|--------------|-------------------|
| Costo base por venta | Todos | Texto numérico | `>= 0` | vacío |
| Precio de venta | Analizar | Texto numérico | `> 0` | vacío |
| Margen objetivo | Por margen | Texto numérico | `0%` a `< 100%` | vacío |
| Markup objetivo | Por markup | Texto numérico | `>= 0%` | vacío |

Texto de ayuda para costo base:

> Incluye producto, materiales o trabajo directamente asociado con una venta.

### Costos y opciones adicionales

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Envío pagado por el negocio | Texto numérico | `>= 0` | `0` |
| Empaque | Texto numérico | `>= 0` | `0` |
| Cargo fijo por venta | Texto numérico | `>= 0` | `0` |
| Otros costos directos | Texto numérico | `>= 0` | `0` |
| Comisión sobre el precio | Texto numérico porcentual | `0%` a `< 100%` | `0` |
| Redondeo comercial | Selector | centavo, entero, múltiplo de 5, terminación `.99` | entero |

### Comportamiento del botón principal

- Texto: `Calcular`.
- No calcular con campos requeridos vacíos o inválidos.
- Llevar el foco al primer error cuando el usuario envíe datos inválidos.
- Después de un cálculo válido, conservar el resultado mientras el usuario
  corrige o ajusta valores.

---

## Resultados por modo

### Modo `Analizar`

Resultado principal:

- Margen de ganancia.
- Estado: `Ganancia`, `Punto de equilibrio` o `Pérdida`.
- Ganancia o pérdida estimada por venta.

Resultados secundarios:

- Markup.
- Costo total efectivo.
- Precio mínimo por venta.
- Descuento máximo sin perder desde el precio capturado.
- Porcentaje del precio consumido por costos.

### Modo `Por margen`

Resultado principal:

- Precio comercial sugerido.
- Precio exacto para alcanzar el margen objetivo.
- Margen real alcanzado después del redondeo.

Resultados secundarios:

- Ganancia estimada por venta con el precio comercial.
- Markup resultante.
- Costo total efectivo.
- Precio mínimo por venta.
- Descuento máximo sin perder desde el precio comercial.

### Modo `Por markup`

Resultado principal:

- Precio comercial sugerido.
- Precio exacto para alcanzar el markup objetivo.
- Markup real alcanzado después del redondeo.

Resultados secundarios:

- Margen resultante.
- Ganancia estimada por venta con el precio comercial.
- Costo total efectivo.
- Precio mínimo por venta.
- Descuento máximo sin perder desde el precio comercial.

### Conversión educativa

Mostrar una frase dinámica cuando existan resultados válidos:

> Un margen de `40%` equivale a un markup de `66.67%` con los costos capturados.

No sugerir que margen y markup son intercambiables.

---

## Precio exacto y precio comercial

En los modos objetivo, mostrar dos precios:

- **Precio exacto:** el mínimo matemático que alcanza el objetivo antes de
  convertirlo en un importe cobrable.
- **Precio comercial sugerido:** precio redondeado hacia arriba según la opción
  elegida.

El precio exacto puede mostrarse con hasta cuatro decimales para explicar el
cálculo. El precio comercial debe ser cobrable en centavos y nunca quedar por
debajo del precio exacto.

```text
redondeo_centavo(precio) = ceil(precio * 100) / 100
redondeo_entero(precio) = ceil(precio)
redondeo_multiplo_5(precio) = ceil(precio / 5) * 5
redondeo_99(precio) = ceil(precio + 0.01) - 0.01
```

Después del redondeo, recalcular y mostrar el margen y markup reales. No mostrar
el objetivo original como si fuera el resultado alcanzado.

---

## Escenarios rápidos por margen

Mostrar después del resultado principal escenarios para márgenes objetivo de:

- `20%`
- `30%`
- `40%`
- `50%`

Cada escenario debe mostrar:

- Margen objetivo.
- Precio comercial sugerido.
- Ganancia estimada.
- Markup resultante.

Reglas:

- Usar los mismos costos, comisión y redondeo capturados.
- Omitir o marcar como no disponible cualquier escenario matemáticamente
  imposible.
- En móvil usar tarjetas apiladas o una cuadrícula de una columna.
- No usar una tabla horizontal como presentación principal.

---

## Desglose de costos

Mostrar cuánto consume cada concepto del precio utilizado para el resultado:

- Costo base.
- Envío.
- Empaque.
- Cargo fijo.
- Otros costos.
- Comisión porcentual calculada.
- Ganancia estimada.

Para cada concepto mostrar importe y porcentaje del precio. Puede presentarse
como lista o barra proporcional accesible. Las barras visuales deben acompañarse
de valores de texto.

---

## Fórmulas

Todas las tasas usadas en fórmulas se expresan como decimales. Por ejemplo,
`15% = 0.15`.

### Variables

```text
C = costos_fijos_por_venta
r = tasa_comision
P = precio_venta
g = margen_objetivo
m = markup_objetivo
```

### Costos fijos por venta

```text
C =
  costo_base
  + envio
  + empaque
  + cargo_fijo
  + otros_costos
```

### Análisis de un precio

```text
comision_monto = P * r
costo_total_efectivo = C + comision_monto
ganancia_estimada = P - costo_total_efectivo
margen = ganancia_estimada / P
markup =
  costo_total_efectivo > 0
    ? ganancia_estimada / costo_total_efectivo
    : no_disponible
porcentaje_costos = costo_total_efectivo / P
```

### Precio por margen objetivo

```text
precio_exacto_margen = C / (1 - r - g)
```

La fórmula solo es válida cuando:

```text
C > 0
r + g < 1
```

### Precio por markup objetivo

El markup objetivo se aplica sobre el costo total efectivo, incluida la comisión
porcentual calculada para el precio resultante.

```text
precio_exacto_markup = C * (1 + m) / (1 - r * (1 + m))
```

La fórmula solo es válida cuando:

```text
C > 0
1 - r * (1 + m) > 0
```

Cuando `r = 0`, la fórmula se reduce a:

```text
precio_exacto_markup = C * (1 + m)
```

### Precio mínimo por venta

```text
precio_minimo_exacto = C / (1 - r)
precio_minimo_cobrable = redondeo_centavo(precio_minimo_exacto)
```

La fórmula requiere `r < 1`.

### Descuento máximo sin perder

La comisión se asume calculada sobre el precio final después del descuento.

```text
descuento_maximo_monto =
  max(0, precio_referencia - precio_minimo_cobrable)
descuento_maximo_porcentaje =
  precio_referencia > 0
    ? descuento_maximo_monto / precio_referencia
    : 0
```

Usar como `precio_referencia`:

- El precio capturado en modo `Analizar`.
- El precio comercial sugerido en modos objetivo.

### Precisión y redondeo

- Realizar fórmulas y métricas con precisión completa.
- No redondear valores intermedios antes de terminar el cálculo.
- Redondear importes mostrados a dos decimales, excepto el precio exacto
  matemático, que puede mostrar hasta cuatro.
- Redondear porcentajes mostrados a dos decimales.
- Todo precio sugerido cobrable debe redondearse hacia arriba al menos al
  centavo.
- Usar una estrategia consistente para evitar errores de punto flotante.

---

## Estados e interpretación

### Ganancia

Condición:

```text
ganancia_estimada > 0
```

Mensaje sugerido:

> Después de los costos capturados, ganas aproximadamente `$X` por venta.

### Punto de equilibrio

Condición:

```text
ganancia_estimada = 0
```

Mensaje sugerido:

> Este precio cubre exactamente los costos capturados. No deja ganancia por
> venta.

### Pérdida

Condición:

```text
ganancia_estimada < 0
```

Mensaje sugerido:

> Pierdes aproximadamente `$X` por venta. Necesitas cobrar al menos `$Y` para
> cubrir los costos capturados.

Para clasificar el estado, considerar equilibrio cualquier ganancia o pérdida
cuya magnitud sea menor a medio centavo antes de formatear.

---

## Validaciones

- Todos los importes y porcentajes deben ser finitos y no negativos.
- Precio de venta debe ser mayor que cero en modo `Analizar`.
- Comisión porcentual debe ser menor que `100%`.
- Margen objetivo debe ser menor que `100%`.
- En modo `Por margen`, `comisión + margen objetivo` debe ser menor que `100%`.
- En modo `Por markup`, el denominador
  `1 - comisión * (1 + markup)` debe ser mayor que cero.
- Los modos objetivo requieren costos fijos por venta mayores que cero para
  producir un precio único.
- En modo `Analizar`, permitir costos fijos iguales a cero.
- Si el costo total efectivo es cero, mostrar markup como `No disponible`.
- No ocultar resultados negativos.
- No convertir automáticamente valores inválidos en cero.
- Aceptar formatos numéricos comunes de `es-MX`, pero normalizar internamente.

Mensajes sugeridos:

| Caso | Mensaje |
|------|---------|
| Campo requerido vacío | `Ingresa un valor para continuar.` |
| Número inválido | `Ingresa un número válido.` |
| Valor negativo | `El valor no puede ser negativo.` |
| Comisión `>= 100%` | `La comisión debe ser menor que 100%.` |
| Margen `>= 100%` | `El margen debe ser menor que 100%.` |
| Comisión + margen imposible | `La comisión y el margen suman 100% o más; no existe un precio que alcance ese objetivo.` |
| Markup imposible por comisión | `Con esta comisión no existe un precio que alcance el markup indicado.` |
| Costos objetivo iguales a cero | `Agrega al menos un costo por venta para calcular un precio objetivo.` |

---

## Acciones

### Copiar resumen

Copiar únicamente datos aplicables al modo activo. Incluir:

- Modo utilizado.
- Costos fijos por venta.
- Comisión porcentual y monto calculado.
- Precio utilizado o sugerido.
- Ganancia estimada.
- Margen.
- Markup, cuando esté disponible.
- Precio mínimo por venta.
- Nota: `Estimación antes de impuestos y gastos generales del negocio.`

### Limpiar formulario

- Restablecer campos y opciones a sus valores por defecto.
- Mantener el modo activo.
- Limpiar errores y resultados.
- Solicitar confirmación solo si existen datos capturados suficientes para
  perder trabajo relevante.

---

## Contenido educativo y enlaces relacionados

Incluir contenido breve después de la calculadora:

1. Diferencia entre margen y markup.
2. Cómo calcular un precio con margen objetivo.
3. Cómo afectan las comisiones al precio necesario.
4. Qué costos conviene incluir.
5. Por qué el precio mínimo por venta no sustituye un análisis completo del
   negocio.

Enlaces relacionados recomendados:

- Calculadora de punto de equilibrio.
- Calculadora de comisión de marketplace.
- Calculadora de ROI.
- Calculadora de precio de proyecto freelance.

---

## SEO

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de margen de ganancia, markup y precio de venta` |
| Meta description | `Calcula margen, markup, ganancia, precio mínimo y precio de venta objetivo incluyendo costos y comisión porcentual.` |
| H1 | `Calculadora de margen, markup y precio de venta` |
| Keyword principal | `calculadora margen ganancia` |
| Keywords secundarias | `calculadora de markup`, `margen vs markup`, `precio de venta con margen`, `calcular precio de venta` |

### FAQs sugeridas

- ¿Cuál es la diferencia entre margen y markup?
- ¿Cómo calculo el precio de venta con un margen objetivo?
- ¿Cómo afectan las comisiones al margen?
- ¿Qué costos debo incluir?
- ¿Qué pasa si vendo por debajo del costo?
- ¿Cuál es el descuento máximo que puedo ofrecer sin perder?
- ¿El resultado representa mi utilidad neta?

---

## Pruebas unitarias sugeridas

### Casos base

- Costo `300`, precio `500`, sin comisión produce ganancia `200`, margen `40%`
  y markup `66.67%`.
- Margen objetivo `40%` sobre costo `300`, sin comisión, produce precio exacto
  `500`.
- Markup objetivo `50%` sobre costo `300`, sin comisión, produce precio exacto
  `450`.
- Costos adicionales se suman una sola vez.

### Comisión porcentual

- Costo fijo `300`, precio `500` y comisión `10%` producen comisión `50`, costo
  total efectivo `350`, ganancia `150`, margen `30%` y markup `42.86%`.
- Costo fijo `300`, margen objetivo `30%` y comisión `10%` producen precio
  exacto `500`.
- Costo fijo `300`, markup objetivo `50%` y comisión `10%` producen precio
  exacto aproximado `529.41`.
- Comisión `100%` muestra error.
- Comisión `70%` más margen objetivo `30%` muestra objetivo imposible.
- Markup cuyo denominador sea cero o negativo muestra objetivo imposible.

### Equilibrio y descuento

- Costo fijo `300` y comisión `10%` producen precio mínimo exacto aproximado
  `333.3333` y precio mínimo cobrable `333.34`.
- Precio de referencia `500` y precio mínimo `300` producen descuento máximo
  de `$200` o `40%`.
- Precio de referencia inferior al precio mínimo produce descuento máximo `0`.
- Precio exactamente igual al mínimo muestra estado de equilibrio.
- Precio menor al mínimo muestra pérdida y conserva valores negativos.

### Redondeo comercial

- Precio exacto `483.27` redondeado a entero produce `484`.
- Precio exacto `483.27` redondeado a múltiplo de `5` produce `485`.
- Precio exacto `483.27` con terminación `.99` produce `483.99`.
- Precio exacto `529.4118` redondeado a centavo produce `529.42`.
- Ningún método de redondeo produce un precio inferior al exacto.
- Margen y markup se recalculan usando el precio comercial.

### Casos límite

- Margen objetivo `0%` produce el precio mínimo por venta.
- Margen objetivo `100%` muestra error.
- Costos fijos iguales a cero son válidos en modo `Analizar`.
- Costos fijos iguales a cero muestran error en modos objetivo.
- Costo total efectivo cero muestra markup como `No disponible`.
- Valores negativos, vacíos, infinitos y no numéricos muestran error.
- Cambiar de modo conserva costos y opciones compartidas.

---

## Criterios de aceptación del MVP

- Los tres modos producen resultados coherentes usando una única definición de
  margen, markup y costo total efectivo.
- La comisión porcentual afecta correctamente análisis, precios objetivo,
  equilibrio, descuento máximo y escenarios.
- El resultado principal cambia según la intención del modo activo.
- Los modos objetivo muestran precio exacto, precio comercial y métricas reales
  después del redondeo.
- Las pérdidas y objetivos imposibles se explican con mensajes accionables.
- La interfaz funciona sin desbordamiento horizontal desde `320px`.
- Todos los campos son utilizables con teclado móvil y tienen etiquetas
  accesibles.
- Los resultados no presentan la ganancia estimada como utilidad contable o
  neta.
- La página funciona completamente sin JavaScript de servidor ni APIs externas.
