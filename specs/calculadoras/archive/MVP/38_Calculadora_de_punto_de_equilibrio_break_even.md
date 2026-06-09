# Especificación v2 - Calculadora de punto de equilibrio / break-even

## Descripción general

Herramienta para calcular cuánto necesita vender un negocio para cubrir sus
costos fijos y variables, alcanzar una utilidad objetivo y evaluar si su volumen
esperado es suficiente.

Debe servir para un producto, servicio, tipo de cliente, reserva, hora facturable
u otra unidad representativa. El MVP analiza una sola unidad homogénea; para un
negocio con varios productos, el usuario debe capturar un precio y costo
variable promedio representativos.

La calculadora debe responder rápidamente:

- ¿Cuántas unidades y cuánto dinero necesito vender para no perder?
- ¿Qué porcentaje de cada venta queda disponible para cubrir costos fijos?
- ¿Qué utilidad o pérdida tendría con las ventas que espero lograr?
- ¿Cuánto me falta o cuánto supero el punto de equilibrio?
- ¿Cuánto necesito vender para alcanzar una utilidad objetivo?

**Arquitectura:** todo el cálculo ocurre en el cliente. No requiere backend,
base de datos ni llamadas a APIs externas.

---

## Objetivo de producto

- Calcular el punto de equilibrio exacto y el mínimo práctico en unidades y
  dinero.
- Mostrar el margen de contribución por unidad y como porcentaje del precio.
- Estimar utilidad o pérdida a partir de un volumen esperado opcional.
- Mostrar cuánto falta o sobra frente al punto de equilibrio.
- Calcular las unidades necesarias para una utilidad objetivo opcional.
- Detectar combinaciones inviables donde una venta no genera contribución.
- Explicar resultados con lenguaje accionable y sin presentar estimaciones como
  garantías.
- Generar una página estática optimizada para SEO en Astro.

---

## Definiciones y supuestos

### Unidad

Una unidad es aquello que el usuario vende y desea analizar: producto, cliente,
hora, reserva, servicio u otra medida homogénea.

El usuario puede personalizar el nombre de la unidad. El nombre solo modifica
las etiquetas y textos; no cambia las fórmulas.

### Costos variables por unidad

Son costos que aumentan al vender una unidad adicional, por ejemplo materiales,
empaque, envío pagado por el negocio o mano de obra directamente asociada con
la venta.

### Costos fijos del periodo

Son costos que existen aunque no se venda ninguna unidad durante el periodo,
por ejemplo renta, nómina administrativa, licencias o publicidad fija.

### Comisión porcentual

La comisión porcentual opcional se aplica sobre el precio final de cada venta.
Sirve para modelar de forma sencilla comisiones de cobro, plataformas o
vendedores.

No modelar múltiples bases de comisión, impuestos sobre comisiones ni tarifas
específicas de marketplaces en el MVP.

### Periodo

El selector de periodo solo cambia etiquetas y contexto. No convierte valores.

Mostrar cerca del selector:

> Captura costos fijos, utilidad objetivo y ventas esperadas para el mismo
> periodo.

### Impuestos

La calculadora no calcula impuestos. El usuario debe capturar precio y costos
con un criterio consistente: todos con impuestos o todos sin impuestos.

### Alcance del resultado

Mostrar cerca del resultado:

> Esta es una estimación basada en los datos capturados. No considera cambios de
> demanda, descuentos, impuestos ni variaciones de costos.

---

## Alcance recomendado

### MVP

- Periodo: mensual, anual o proyecto.
- Nombre de unidad personalizable.
- Precio por unidad.
- Costo variable por unidad.
- Costos fijos del periodo.
- Comisión porcentual opcional sobre el precio.
- Incremento mínimo vendible opcional.
- Utilidad objetivo opcional.
- Unidades esperadas opcionales.
- Resultado de equilibrio exacto y mínimo práctico.
- Margen de contribución en dinero y porcentaje.
- Evaluación del volumen esperado: utilidad o pérdida, cuánto falta o sobra y
  margen de seguridad.
- Escenarios de volumen alrededor del punto de equilibrio.
- Usar ejemplo, copiar resumen y limpiar formulario.

### Fase 2

- Modo `Por ventas` para negocios con múltiples productos usando porcentaje de
  contribución promedio.
- Comparador de precios con escenarios `-10%`, actual y `+10%`.
- Desglose editable de costos variables y costos fijos.
- Historial opt-in en `sessionStorage`.
- Gráfica simple de ingresos, costos y utilidad por unidades.
- Exportar escenarios a CSV.
- Moneda configurable.

### Fuera de alcance

- Pronóstico de demanda.
- Optimización automática de precios.
- Cálculo de impuestos.
- Mezcla ponderada de múltiples productos.
- Flujos de efectivo, financiamiento o valor del dinero en el tiempo.
- Recomendaciones financieras personalizadas.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL pública recomendada | `/finanzas/calculadora-de-punto-de-equilibrio/` |
| Archivo Astro recomendado | `src/pages/finanzas/calculadora-de-punto-de-equilibrio.astro` |
| Lógica de cálculo | `src/lib/calculators/finanzas/calculadora-de-punto-de-equilibrio/breakEven.ts` |
| Pruebas unitarias | `src/lib/calculators/finanzas/calculadora-de-punto-de-equilibrio/breakEven.test.ts` |
| Categoría | `finanzas` |
| Locale base | `es-MX` |
| Moneda base | `MXN`, símbolo `$` |

La ruta recomendada sigue el patrón de las calculadoras financieras existentes.
Como la ruta anterior solo aparecía como propuesta en esta spec y no existe una
página publicada, no requiere redirección. Si llegara a publicarse primero
`/finanzas/calculadora-punto-de-equilibrio/`, agregar una redirección 301 en
Apache hacia la ruta canónica recomendada.

---

## Diseño mobile-first

### Orden del flujo en móvil

1. Introducción breve y ejemplo.
2. Selector de periodo y nombre de unidad.
3. Precio, costo variable y costos fijos.
4. Bloque desplegable `Objetivos y opciones`.
5. Botón principal de ancho completo.
6. Resultado principal.
7. Estado de las ventas esperadas, cuando se capturen.
8. Métricas secundarias.
9. Escenarios como tarjetas apiladas.
10. Detalle del cálculo, contenido educativo y FAQs.

No colocar tablas, explicaciones largas ni contenido SEO antes del resultado.

### Formulario

- Usar una sola columna en móvil.
- Usar inputs de texto numérico con `inputmode="decimal"`.
- Mostrar prefijos o sufijos visuales para `$` y `%`, sin incluirlos en el valor.
- Mantener visibles inicialmente solo los tres datos esenciales.
- Colocar utilidad objetivo, unidades esperadas, comisión e incremento mínimo
  dentro de un `<details>` con resumen `Objetivos y opciones`.
- Usar botones con área táctil mínima de `44px`.
- Evitar acciones fijas que puedan quedar ocultas detrás del teclado móvil.
- Incluir botón `Usar ejemplo` para reducir la fricción inicial.

### Resultados

- Mostrar inmediatamente después del botón una frase accionable:

  > Necesitas vender al menos **200 unidades**, equivalentes a **$50,000**, para
  > cubrir tus costos del mes.

- Diferenciar visualmente:
  - Equilibrio.
  - Proyección con utilidad.
  - Proyección con pérdida.
  - Configuración inviable.
- Mostrar el resultado principal antes de métricas secundarias.
- Mostrar métricas secundarias en una cuadrícula de dos columnas en móvil.
- Usar texto además de color para comunicar estados.
- Colocar el detalle matemático dentro de un `<details>`.
- Anunciar cambios importantes mediante `aria-live="polite"`.

### Escenarios

- En móvil, mostrar tarjetas apiladas con las cifras esenciales.
- Desde `md`, se puede mostrar una tabla.
- Si se usa tabla como respaldo, permitir `overflow-x-auto`, pero no depender de
  desplazamiento horizontal como experiencia principal en móvil.

---

## Flujo principal del MVP

### Ejemplo introductorio

> Vendo un producto a `$250`, me cuesta `$100` producirlo y tengo costos fijos
> de `$30,000` al mes. ¿Cuántas unidades debo vender para no perder?

### Datos esenciales

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Periodo | Selector | `Mensual`, `Anual`, `Proyecto` | `Mensual` |
| Nombre de unidad | Texto corto | 1 a 30 caracteres | `unidades` |
| Precio por unidad | Texto numérico | `> 0` | vacío |
| Costo variable por unidad | Texto numérico | `>= 0` | vacío |
| Costos fijos del periodo | Texto numérico | `>= 0` | vacío |

Ayuda para costo variable:

> Incluye los costos que aumentan cada vez que realizas una venta.

Ayuda para costos fijos:

> Incluye los costos del periodo que existen aunque no vendas.

### Objetivos y opciones

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Unidades esperadas | Texto numérico opcional | `>= 0` | vacío |
| Utilidad objetivo | Texto numérico opcional | `>= 0` | vacío |
| Comisión sobre el precio | Texto numérico opcional | `0%` a `< 100%` | `0%` |
| Incremento mínimo vendible | Selector o texto numérico | `> 0` | `1` |

Valores rápidos sugeridos para incremento mínimo:

- `1` para productos, clientes o reservas.
- `0.5` para medias unidades.
- `0.25` para horas facturables por cuarto de hora.

El incremento mínimo afecta los resultados prácticos y los escenarios, pero no
los resultados exactos.

### Acciones

- Acción principal: `Calcular punto de equilibrio`.
- Acciones secundarias: `Usar ejemplo`, `Limpiar` y `Copiar resumen`.
- Ocultar `Copiar resumen` hasta que exista un resultado válido.
- Mover `Exportar CSV` a fase 2.

---

## Resultados

### Resultado principal

Mostrar:

- Unidades mínimas prácticas para alcanzar el equilibrio.
- Ventas mínimas prácticas correspondientes.
- Frase dinámica con periodo y nombre de unidad.

Ejemplo:

> Necesitas vender al menos **200 unidades**, equivalentes a **$50,000**, para
> cubrir tus costos del mes.

### Resumen del equilibrio

Mostrar como métricas secundarias:

- Margen de contribución por unidad.
- Margen de contribución porcentual.
- Punto de equilibrio exacto en unidades.
- Ventas exactas de equilibrio.
- Costos variables al alcanzar el mínimo práctico.
- Comisión al alcanzar el mínimo práctico, cuando aplique.
- Utilidad estimada al vender el mínimo práctico.

La utilidad del mínimo práctico puede ser positiva debido al redondeo. No
presentarla como error.

### Evaluación de ventas esperadas

Mostrar esta sección únicamente cuando el usuario capture unidades esperadas.

Debe incluir:

- Ventas esperadas.
- Costos variables esperados.
- Comisión esperada.
- Costos totales esperados.
- Utilidad o pérdida esperada.
- Diferencia de unidades frente al mínimo práctico.
- Diferencia de ventas frente al equilibrio exacto.
- Margen de seguridad en dinero y porcentaje, cuando sea calculable.

Estados sugeridos:

| Estado | Condición | Mensaje base |
|--------|-----------|--------------|
| `Por debajo` | utilidad esperada `< 0` | `Te faltan X unidades para cubrir tus costos.` |
| `En equilibrio` | utilidad esperada aproximadamente `0` | `Tus ventas esperadas están en el punto de equilibrio.` |
| `Por encima` | utilidad esperada `> 0` | `Superas el punto de equilibrio por X unidades.` |

Usar una tolerancia monetaria de `$0.005` para clasificar el estado, evitando
errores visuales por precisión flotante.

### Utilidad objetivo

Mostrar esta sección únicamente cuando `utilidad_objetivo > 0`.

Debe incluir:

- Unidades exactas necesarias.
- Unidades prácticas necesarias.
- Ventas prácticas necesarias.
- Utilidad real estimada después de redondear al incremento mínimo.

No duplicar esta sección cuando la utilidad objetivo sea cero.

### Interpretación accionable

Cuando exista un resultado válido, mostrar una frase breve que ayude a decidir:

- Con ventas esperadas menores al equilibrio:

  > Con tu volumen esperado perderías `$X`. Necesitas vender `Y` unidades más o
  > mejorar tu contribución por venta.

- Con ventas esperadas mayores al equilibrio:

  > Con tu volumen esperado obtendrías una utilidad aproximada de `$X` y un
  > margen de seguridad de `Y%`.

- Con contribución no positiva:

  > Cada venta pierde dinero o no aporta a tus costos fijos. Aumenta el precio,
  > reduce el costo variable o disminuye la comisión antes de buscar más ventas.

---

## Escenarios de volumen

Generar escenarios alrededor del punto de equilibrio exacto usando:

- `80%` del punto de equilibrio.
- `100%` del punto de equilibrio.
- `120%` del punto de equilibrio.
- `150%` del punto de equilibrio.

Para cada escenario:

1. Calcular las unidades objetivo exactas.
2. Redondear hacia arriba al incremento mínimo vendible.
3. Evitar filas duplicadas después del redondeo.
4. Mostrar el porcentaje de referencia y las unidades prácticas.

Cada escenario debe mostrar:

- Unidades.
- Ingresos.
- Costos variables.
- Comisión.
- Costos totales.
- Utilidad o pérdida.

Si el usuario captura unidades esperadas y estas no coinciden con un escenario,
agregar una tarjeta o fila `Tu estimación`.

---

## Fórmulas

Usar precisión completa internamente. Redondear únicamente para presentación o
cuando se calcule una cantidad práctica según el incremento mínimo.

### Variables

```text
P = precio_unitario
V = costo_variable_unitario
F = costos_fijos_periodo
c = comision_porcentual / 100
I = incremento_minimo_vendible
Qe = unidades_esperadas
Uo = utilidad_objetivo
```

### Contribución

```text
comision_por_unidad = P * c
margen_contribucion_unidad = P - V - comision_por_unidad
margen_contribucion_porcentaje = margen_contribucion_unidad / P * 100
```

### Redondeo práctico

```text
redondear_al_incremento(valor, I) = ceil(valor / I) * I
```

Aplicar una corrección de precisión antes de `ceil` para evitar que un valor
matemáticamente entero como `200` se convierta accidentalmente en `201` por
errores de punto flotante.

### Punto de equilibrio

Si `margen_contribucion_unidad > 0`:

```text
equilibrio_exacto_unidades =
  F / margen_contribucion_unidad

equilibrio_exacto_ventas =
  equilibrio_exacto_unidades * P

equilibrio_practico_unidades =
  redondear_al_incremento(equilibrio_exacto_unidades, I)

equilibrio_practico_ventas =
  equilibrio_practico_unidades * P
```

### Totales para cualquier volumen

```text
ingresos(Q) = Q * P
costos_variables(Q) = Q * V
comision(Q) = ingresos(Q) * c
costos_totales(Q) = F + costos_variables(Q) + comision(Q)
utilidad(Q) = ingresos(Q) - costos_totales(Q)
```

### Utilidad objetivo

Si `Uo > 0`:

```text
objetivo_exacto_unidades =
  (F + Uo) / margen_contribucion_unidad

objetivo_practico_unidades =
  redondear_al_incremento(objetivo_exacto_unidades, I)

objetivo_practico_ventas =
  objetivo_practico_unidades * P

objetivo_utilidad_real =
  utilidad(objetivo_practico_unidades)
```

### Evaluación del volumen esperado

Si el usuario captura `Qe`:

```text
utilidad_esperada = utilidad(Qe)

diferencia_unidades_practicas =
  Qe - equilibrio_practico_unidades

diferencia_ventas_exactas =
  ingresos(Qe) - equilibrio_exacto_ventas
```

Si `ingresos(Qe) > 0`:

```text
margen_seguridad_dinero =
  ingresos(Qe) - equilibrio_exacto_ventas

margen_seguridad_porcentaje =
  margen_seguridad_dinero / ingresos(Qe) * 100
```

El margen de seguridad puede ser negativo cuando las ventas esperadas están por
debajo del equilibrio.

---

## Validaciones y estados

### Validaciones de campos

- Precio por unidad debe ser mayor que cero.
- Costo variable por unidad no puede ser negativo.
- Costos fijos no pueden ser negativos.
- Comisión debe ser mayor o igual que `0%` y menor que `100%`.
- Incremento mínimo vendible debe ser mayor que cero.
- Utilidad objetivo no puede ser negativa.
- Unidades esperadas no pueden ser negativas.
- Nombre de unidad debe tener entre 1 y 30 caracteres después de recortar
  espacios.
- Aceptar separadores comunes para `es-MX`, símbolos de moneda y espacios, pero
  normalizar antes de calcular.

### Configuración inviable

Si `margen_contribucion_unidad <= 0`, no calcular equilibrio, utilidad objetivo
ni escenarios.

Mostrar:

> No existe un punto de equilibrio con estos datos porque cada venta no genera
> contribución positiva.

Además, mostrar una explicación específica:

- Si la contribución es cero:

  > Cada venta cubre exactamente su costo variable y comisión, pero no aporta a
  > los costos fijos.

- Si la contribución es negativa:

  > Cada venta aumenta la pérdida en `$X`.

### Casos límite

- Si costos fijos son `0` y utilidad objetivo es `0`, el equilibrio exacto y
  práctico es `0` unidades.
- Si costos fijos son `0` y utilidad objetivo es positiva, calcular las unidades
  necesarias normalmente.
- Si unidades esperadas son `0`, mostrar pérdida igual a los costos fijos.
- Si el punto de equilibrio exacto coincide con el incremento mínimo, no
  aumentarlo al siguiente incremento.
- Permitir resultados prácticos decimales cuando el incremento mínimo sea menor
  que `1`.
- Redondear moneda a 2 decimales solo al mostrar.
- Mostrar porcentajes con máximo 2 decimales.
- No permitir resultados `NaN`, infinitos ni desbordados.

### Mensajes de error sugeridos

| Caso | Mensaje |
|------|---------|
| Campo requerido vacío | `Completa este campo para calcular.` |
| Número inválido | `Ingresa un número válido.` |
| Valor negativo | `El valor no puede ser negativo.` |
| Precio cero | `El precio debe ser mayor que cero.` |
| Comisión inválida | `La comisión debe ser menor que 100%.` |
| Incremento inválido | `El incremento mínimo debe ser mayor que cero.` |
| Contribución no positiva | `Cada venta debe generar una contribución positiva para alcanzar el equilibrio.` |

---

## Copiar resumen

El resumen copiado debe incluir:

- Periodo y nombre de unidad.
- Precio, costo variable, comisión y costos fijos.
- Margen de contribución en dinero y porcentaje.
- Equilibrio exacto y mínimo práctico.
- Ventas mínimas prácticas.
- Utilidad objetivo y resultado correspondiente, cuando aplique.
- Ventas esperadas, utilidad o pérdida y cuánto falta o sobra, cuando aplique.
- Nota breve de estimación.

Ejemplo:

```text
Punto de equilibrio mensual
Precio por unidad: $250.00
Costo variable por unidad: $100.00
Margen de contribución: $150.00 (60%)
Punto de equilibrio exacto: 200 unidades
Mínimo práctico: 200 unidades ($50,000.00)
Ventas esperadas: 240 unidades
Utilidad estimada: $6,000.00
Margen de seguridad: 16.67%
Estimación basada en los datos capturados.
```

---

## Contenido educativo y SEO

### Contenido posterior a la calculadora

Incluir contenido breve:

1. Qué es el punto de equilibrio.
2. Cómo distinguir costos fijos y variables.
3. Qué significa el margen de contribución.
4. Cómo interpretar el margen de seguridad.
5. Cómo calcular el punto de equilibrio cuando vendes varios productos.
6. Qué alternativas existen cuando cada venta no genera contribución positiva.

### Enlaces internos sugeridos

- Calculadora de margen y markup.
- Calculadora de ROI.
- Calculadora de comisión de marketplace, cuando exista.

### Metadatos

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de punto de equilibrio y utilidad` |
| Meta description | `Calcula cuántas unidades necesitas vender para cubrir costos, evaluar tus ventas esperadas y alcanzar una utilidad objetivo.` |
| H1 | `Calculadora de punto de equilibrio` |
| Keyword principal | `calculadora punto de equilibrio` |
| Keywords secundarias | `break even calculadora`, `punto de equilibrio fórmula`, `margen de contribución`, `cuánto debo vender para no perder` |

### FAQs sugeridas

- ¿Qué es el punto de equilibrio?
- ¿Qué costos fijos y variables debo incluir?
- ¿Qué es el margen de contribución?
- ¿Qué es el margen de seguridad?
- ¿Por qué se redondean las unidades hacia arriba?
- ¿Qué pasa si mi costo variable y comisión superan el precio?
- ¿Cómo calculo el equilibrio si vendo varios productos?
- ¿Debo capturar importes con IVA o sin IVA?

---

## Accesibilidad

- Asociar cada input con un `<label>`.
- Relacionar mensajes de ayuda y error mediante `aria-describedby`.
- Anunciar el resultado principal con `aria-live="polite"`.
- No usar únicamente color para utilidad, pérdida o advertencias.
- Mantener orden lógico de foco.
- Permitir operar formulario, desplegables y acciones con teclado.
- Usar encabezados y etiquetas explícitas en tarjetas y tablas de escenarios.
- Al copiar, anunciar confirmación accesible durante aproximadamente 2 segundos.

---

## Analítica sugerida

Registrar únicamente eventos agregados, sin valores financieros capturados:

- Cálculo válido.
- Configuración inviable.
- Uso del ejemplo.
- Uso de unidades esperadas.
- Uso de utilidad objetivo.
- Apertura de objetivos y opciones.
- Copiar resumen.

---

## Pruebas sugeridas

### Casos base

- Precio `250`, costo variable `100`, costos fijos `30000`, sin comisión,
  produce contribución de `$150`, contribución de `60%` y equilibrio de `200`
  unidades.
- El equilibrio exacto y práctico coinciden cuando el resultado ya es múltiplo
  del incremento mínimo.
- Precio `250`, costo variable `100`, costos fijos `30001` produce equilibrio
  exacto aproximado de `200.0067` y mínimo práctico de `201` unidades.
- Ventas mínimas exactas y prácticas se calculan y etiquetan por separado.

### Comisión

- Precio `250`, costo variable `100` y comisión `10%` produce contribución de
  `$125` y contribución porcentual de `50%`.
- Comisión `100%` muestra error.
- Comisión suficientemente alta para producir contribución cero o negativa
  muestra configuración inviable.

### Volumen esperado

- Con el caso base y `150` unidades esperadas, la utilidad es `-$7,500` y faltan
  `50` unidades prácticas.
- Con el caso base y `240` unidades esperadas, la utilidad es `$6,000`, sobran
  `40` unidades prácticas y el margen de seguridad es aproximadamente `16.67%`.
- Unidades esperadas `0` producen pérdida igual a costos fijos.

### Utilidad objetivo

- Con el caso base y utilidad objetivo de `$15,000`, se requieren `300`
  unidades.
- Utilidad objetivo positiva con costos fijos `0` calcula unidades normalmente.
- Utilidad objetivo `0` no muestra una sección duplicada.

### Incremento mínimo

- Equilibrio exacto de `10.1` con incremento `1` produce mínimo práctico `11`.
- Equilibrio exacto de `10.1` con incremento `0.5` produce mínimo práctico
  `10.5`.
- Un resultado matemáticamente entero no sube al siguiente incremento por
  errores de precisión flotante.

### Casos límite y errores

- Costos fijos `0` y utilidad objetivo `0` producen equilibrio de `0` unidades.
- Margen de contribución cero muestra advertencia y oculta resultados no
  calculables.
- Margen de contribución negativo indica cuánto aumenta la pérdida por venta.
- Valores negativos, vacíos, infinitos y no numéricos muestran error.
- Escenarios no contienen filas duplicadas después del redondeo.
- Todos los importes mostrados usan formato `es-MX`.

---

## Criterios de aceptación del MVP

- El usuario puede calcular el equilibrio usando solo precio, costo variable y
  costos fijos.
- El resultado distingue claramente equilibrio exacto y mínimo práctico.
- El margen de contribución se muestra en dinero y porcentaje.
- La comisión porcentual afecta correctamente equilibrio, proyecciones,
  utilidad objetivo y escenarios.
- El incremento mínimo redondea cantidades prácticas sin alterar resultados
  exactos.
- Las ventas esperadas muestran utilidad o pérdida, cuánto falta o sobra y
  margen de seguridad.
- La utilidad objetivo muestra el resultado práctico y la utilidad real después
  del redondeo.
- Una contribución cero o negativa bloquea cálculos inviables y explica cómo
  interpretar el problema.
- El flujo esencial funciona cómodamente en una pantalla móvil de `320px` sin
  desplazamiento horizontal.
- Los escenarios se presentan como tarjetas en móvil y pueden convertirse en
  tabla desde `md`.
- Copiar resumen, usar ejemplo y limpiar funcionan mediante teclado y pantalla
  táctil.
- La página conserva funcionalidad sin backend ni llamadas externas.
