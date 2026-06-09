# Especificación v2 - Calculadora de ahorro para un objetivo

## Descripción general

Herramienta para crear un plan de ahorro accionable. Debe calcular cuánto
ahorrar al mes para llegar a una meta en una fecha determinada o cuándo se
alcanzará la meta con una aportación mensual fija.

Debe funcionar para metas como viajes, enganche de vivienda, fondo de
emergencia, estudios o compras importantes. Además de entregar una cifra, debe
ayudar al usuario a entender si el plan es realista, cuánto depende de un
rendimiento hipotético y qué ajustes puede hacer.

**Arquitectura:** todo el cálculo ocurre en el cliente. No requiere backend,
base de datos ni llamadas a APIs externas.

---

## Objetivo de producto

- Calcular la aportación mensual necesaria para una meta y fecha objetivo.
- Calcular el tiempo necesario si el usuario ya sabe cuánto puede ahorrar.
- Considerar ahorro inicial, rendimiento anual e inflación opcionales.
- Convertir el resultado en un próximo paso concreto.
- Mostrar alternativas cuando la aportación o el plazo principal no sean
  convenientes para el usuario.
- Distinguir claramente ahorro aportado, rendimiento estimado y ajuste por
  inflación.
- Generar una página estática optimizada para SEO en Astro.

### Preguntas que debe responder

- ¿Cuánto debo apartar cada mes?
- ¿Cuándo alcanzaré mi meta con lo que puedo ahorrar?
- ¿Cuál debe ser mi próxima aportación?
- ¿Qué cambia si extiendo el plazo o ahorro un poco más?
- ¿Cuánto depende mi plan de obtener el rendimiento esperado?
- ¿Mi meta futura conserva el costo que tendría hoy?

---

## Principios de producto

- Priorizar decisiones y próximos pasos antes que tablas o detalle técnico.
- Presentar el rendimiento como una estimación, nunca como una garantía.
- Ofrecer siempre un escenario conservador con rendimiento de `0%`.
- Mantener visibles los supuestos usados en el cálculo.
- Explicar alternativas sin juzgar la capacidad de ahorro del usuario.
- No depender únicamente del color para comunicar progreso, advertencias o
  recomendaciones.
- Mantener el flujo principal breve; rendimiento e inflación deben vivir en
  opciones avanzadas.

---

## Alcance recomendado

### MVP

- Dos modos:
  - `Tengo una fecha`: calcula cuánto ahorrar al mes.
  - `Sé cuánto puedo ahorrar`: calcula cuándo se alcanzará la meta.
- Meta de ahorro.
- Ahorro actual.
- Fecha objetivo o aportación mensual, según el modo.
- Rendimiento anual opcional.
- Inflación opcional para metas expresadas en pesos de hoy.
- Resultado principal accionable.
- Próxima aportación recomendada.
- Escenario conservador con rendimiento de `0%`.
- Escenarios rápidos para ajustar plazo o aportación.
- Barra de progreso y principales hitos.
- Detalle mensual dentro de una sección avanzada.
- Copiar resumen, limpiar formulario y exportar CSV.

### Fase 2

- Aportaciones quincenales o semanales como frecuencia real de cálculo.
- Aportaciones extraordinarias en meses específicos.
- Meses sin aportación o aportaciones variables.
- Comparador editable de varios escenarios.
- Guardar historial o último plan en `localStorage`.
- Enlace compartible con parámetros seguros en la URL.

### Fuera de alcance

- Recomendar productos financieros o instituciones.
- Prometer rendimientos futuros.
- Considerar impuestos, comisiones o rendimientos variables.
- Sincronizar cuentas bancarias.
- Crear recordatorios o notificaciones.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL pública recomendada | `/finanzas/calculadora-de-ahorro-para-un-objetivo` |
| Archivo Astro recomendado | `src/pages/finanzas/calculadora-de-ahorro-para-un-objetivo.astro` |
| Lógica de cálculo | `src/lib/calculators/finanzas/calculadora-de-ahorro-para-un-objetivo/savingsGoal.ts` |
| Pruebas unitarias | `src/lib/calculators/finanzas/calculadora-de-ahorro-para-un-objetivo/savingsGoal.test.ts` |
| Categoría | `finanzas` |
| Locale base | `es-MX` |
| Moneda base | `MXN`, símbolo `$` |

---

## Experiencia mobile-first

### Principios

- La captura de datos debe ser la experiencia principal del primer viewport.
- Usar una sola columna en móvil.
- Usar un control segmentado para cambiar entre los dos modos.
- Los controles táctiles deben medir al menos `44px` de alto y tener etiquetas
  visibles.
- Usar `inputmode="decimal"` para importes y porcentajes.
- Mantener rendimiento e inflación dentro de `Opciones avanzadas`.
- Mostrar el resultado principal antes que hitos, tablas o contenido educativo.
- Evitar gráficas pesadas en el MVP.

### Flujo recomendado en móvil

1. Elegir `Tengo una fecha` o `Sé cuánto puedo ahorrar`.
2. Capturar meta de ahorro y ahorro actual.
3. Capturar fecha objetivo o aportación mensual.
4. Abrir opcionalmente rendimiento e inflación.
5. Pulsar `Crear mi plan`.
6. Mostrar resultado principal, próxima aportación y supuestos.
7. Mostrar escenario conservador y ajustes rápidos.
8. Mostrar progreso e hitos.
9. Ofrecer detalle mensual, copiar resumen y exportar CSV como acciones
   secundarias.

### Selector de fecha

- Usar un campo de mes y año; no se requiere seleccionar un día.
- Acompañarlo con accesos rápidos como `1 año`, `2 años` y `5 años`.
- El mes objetivo representa el cierre de ese mes.
- Evitar que el calendario o selector ocupe más espacio que los campos
  principales.

### Presentación responsive

- En móvil, el resultado debe aparecer inmediatamente después del formulario.
- En escritorio, formulario y resumen pueden mostrarse en dos columnas.
- Los hitos deben mostrarse como tarjetas compactas, no como una gráfica grande.
- El detalle mensual debe estar en un acordeón o sección avanzada con
  desplazamiento horizontal cuando sea necesario.
- No ocultar filas arbitrariamente en móvil; resumir mediante hitos y conservar
  el calendario completo dentro del detalle.

---

## Flujo principal MVP

**Ejemplo:** quiero ahorrar `$80,000`, ya tengo `$15,000` y necesito llegar en
`18 meses`. ¿Cuánto debo ahorrar cada mes?

### Inputs compartidos

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Meta de ahorro | Texto numérico | `> 0` | vacío |
| Ahorro actual | Texto numérico | `>= 0` | `0` |

### Inputs del modo `Tengo una fecha`

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Fecha objetivo | Mes/año | mes actual o futuro | vacío |
| Rendimiento anual estimado (%) | Texto numérico avanzado | `0%-50%` | `0` |
| Mi meta está expresada en pesos de hoy | Checkbox avanzado | booleano | desactivado |
| Inflación anual estimada (%) | Texto numérico avanzado | `0%-30%` | `4` cuando se activa |

### Inputs del modo `Sé cuánto puedo ahorrar`

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Aportación mensual | Texto numérico | `> 0` | vacío |
| Rendimiento anual estimado (%) | Texto numérico avanzado | `0%-50%` | `0` |
| Mi meta está expresada en pesos de hoy | Checkbox avanzado | booleano | desactivado |
| Inflación anual estimada (%) | Texto numérico avanzado | `0%-30%` | `4` cuando se activa |

### Comportamiento de inflación por modo

- Si la meta está expresada en pesos de hoy y existe una fecha objetivo, ajustar
  primero la meta nominal usando esa fecha.
- En el modo `Sé cuánto puedo ahorrar`, la meta ajustada por inflación cambia
  durante la simulación porque la fecha todavía es desconocida.
- Si la inflación estimada es igual o mayor que el rendimiento y la aportación
  no permite alcanzar la meta creciente dentro del límite, mostrar que el plan
  no se alcanza dentro del horizonte calculado.
- Para metas a más de `24 meses` sin inflación activada, mostrar una nota
  informativa: el costo futuro de la meta podría ser mayor.

---

## Resultados y visualización

### Resultado principal

En modo `Tengo una fecha`, mostrar primero:

- `Ahorra $X al mes`.
- Fecha objetivo.
- Número de aportaciones.
- Próxima aportación sugerida.

Ejemplo:

> Ahorra `$4,250.00` al mes. Haz tu primera aportación antes del cierre del mes
> actual y repítela durante `18 meses`.

En modo `Sé cuánto puedo ahorrar`, mostrar primero:

- `Alcanzarías tu meta en mes y año`.
- Duración estimada en años y meses.
- Próxima aportación sugerida.
- Diferencia entre la última aportación y una aportación mensual normal.

### Resumen secundario

- Meta usada en el cálculo.
- Meta ajustada por inflación, cuando aplique.
- Ahorro actual.
- Brecha actual.
- Total de aportaciones futuras.
- Total aportado incluyendo ahorro actual.
- Rendimiento estimado.
- Saldo final estimado.

### Próximo paso recomendado

Mostrar una instrucción concreta:

> Aparta `$X` antes del cierre de este mes.

También puede mostrar el equivalente informativo por quincena:

```text
equivalente_quincenal = aportacion_mensual / 2
```

El equivalente quincenal es solo una referencia en el MVP; el cálculo y el
calendario siguen siendo mensuales.

### Escenario conservador

Cuando `rendimiento_anual > 0`, mostrar el mismo plan con rendimiento de `0%`:

- Aportación mensual conservadora o fecha conservadora.
- Diferencia frente al resultado principal.
- Porcentaje de la meta final que depende del rendimiento estimado.

Mensaje recomendado:

> Con rendimiento de `0%`, necesitarías ahorrar `$Y` al mes. El rendimiento
> esperado reduce tu aportación estimada en `$Z`, pero no está garantizado.

### Escenarios rápidos

En modo `Tengo una fecha`:

- Fecha elegida.
- Fecha elegida `+3 meses`.
- Fecha elegida `+6 meses`.
- Fecha elegida `+12 meses`.
- Mostrar aportación mensual para cada alternativa.

En modo `Sé cuánto puedo ahorrar`:

- Aportación elegida.
- Aportación elegida `+$500`.
- Aportación elegida `+$1,000`.
- Mostrar fecha estimada para cada alternativa.

Cada escenario debe incluir una acción `Aplicar escenario` que actualice el
campo correspondiente y vuelva a calcular.

### Progreso e hitos

- Mostrar una barra de progreso incluso cuando el ahorro actual sea `0`.
- La barra debe incluir texto accesible con el porcentaje actual.
- Cuando exista rendimiento, distinguir mediante texto o leyenda:
  - ahorro actual;
  - aportaciones futuras;
  - rendimiento estimado.
- No depender únicamente del color.
- Mostrar hitos de `25%`, `50%`, `75%` y `100%` con fecha estimada.
- Si el ahorro actual ya superó un hito, marcarlo como alcanzado.

### Detalle mensual

Mostrar dentro de una sección avanzada:

| Columna | Descripción |
|---------|-------------|
| Mes | Número de aportación |
| Fecha | Mes y año |
| Saldo inicial | Saldo antes del rendimiento y la aportación |
| Rendimiento | Rendimiento estimado del mes |
| Aportación | Aportación realizada |
| Saldo final | Saldo después de rendimiento y aportación |
| Progreso | Porcentaje de la meta usada en ese mes |

- La última aportación debe ajustarse para no aportar más de lo necesario.
- El CSV debe incluir todas las filas del calendario.

---

## Supuestos financieros

- Las aportaciones se realizan al final de cada mes.
- El ahorro inicial comienza a generar rendimiento desde el primer mes.
- El rendimiento es constante y se capitaliza mensualmente.
- La tasa mensual se obtiene dividiendo la tasa nominal anual entre `12`.
- El cálculo no considera impuestos, comisiones ni variaciones de mercado.
- La fecha objetivo representa el cierre del mes seleccionado.
- El calendario comienza en el mes actual y la primera aportación ocurre al
  cierre de ese mes.
- La interfaz debe explicar estos supuestos junto al resultado o en una sección
  desplegable.

---

## Fórmulas y algoritmo

### Variables base

```text
meta = monto_objetivo
P = ahorro_actual
r = tasa_anual / 12 / 100
i = inflacion_anual / 12 / 100
n = numero_de_aportaciones_mensuales
```

### Número de aportaciones

Para una fecha objetivo expresada como mes y año:

```text
n = diferencia_en_meses(mes_actual, mes_objetivo) + 1
```

El `+1` representa la aportación que se realiza al cierre del mes actual.

### Meta ajustada por inflación con fecha conocida

Si la meta está expresada en pesos de hoy:

```text
meta_ajustada = meta * (1 + i)^n
```

Si no:

```text
meta_ajustada = meta
```

### Aportación mensual necesaria

Si `r > 0`:

```text
aportacion_exacta =
  (meta_ajustada - P * (1 + r)^n) * r
  / ((1 + r)^n - 1)
```

Si `r = 0`:

```text
aportacion_exacta = (meta_ajustada - P) / n
```

La aportación mostrada debe redondearse hacia arriba a centavos:

```text
aportacion_mostrada = ceil(aportacion_exacta * 100) / 100
```

Después de calcularla, simular el calendario completo para verificar que
`saldo_final >= meta_ajustada`. Si no se cumple por precisión numérica,
incrementar la aportación mostrada un centavo y volver a verificar.

### Tiempo necesario

Simular mes a mes:

```text
saldo_inicial = saldo
rendimiento_mes = saldo_inicial * r
saldo = saldo_inicial + rendimiento_mes
saldo = saldo + aportacion_mensual
```

Si la meta está expresada en pesos de hoy:

```text
meta_del_mes = meta * (1 + i)^mes
```

Si no:

```text
meta_del_mes = meta
```

Detener cuando:

```text
saldo >= meta_del_mes
```

### Última aportación

La última aportación debe reducirse al importe necesario para alcanzar la meta
del mes:

```text
ultima_aportacion =
  max(meta_del_mes - (saldo_inicial + rendimiento_mes), 0)
```

No debe superar la aportación mensual habitual.

### Rendimiento estimado

```text
total_aportaciones_futuras = suma(aportaciones_del_calendario)
total_aportado = ahorro_actual + total_aportaciones_futuras
rendimiento_estimado = saldo_final - total_aportado
```

### Dependencia del rendimiento

```text
dependencia_rendimiento =
  rendimiento_estimado / saldo_final * 100
```

Mostrar `0%` cuando el saldo final sea `0`.

### Hitos

Para cada umbral de `25%`, `50%`, `75%` y `100%`, guardar el primer mes donde:

```text
saldo_final_del_mes >= meta_del_mes * umbral
```

---

## Estados, validaciones y advertencias

### Validaciones bloqueantes

- La meta debe ser mayor que `0`.
- El ahorro actual no puede ser negativo.
- La aportación mensual debe ser mayor que `0` en el modo correspondiente.
- La fecha objetivo debe ser un mes futuro o el mes actual cuando todavía sea
  posible realizar la primera aportación.
- Rendimiento e inflación no pueden ser negativos en el MVP.
- Rendimiento anual máximo: `50%`.
- Inflación anual máxima: `30%`.
- No aceptar valores no finitos o importes fuera del límite seguro definido por
  la implementación.

### Estados especiales

- Si `ahorro_actual >= meta_ajustada`, mostrar `Meta cumplida` y aportación
  requerida de `$0`.
- Si el ahorro actual alcanza la meta únicamente por rendimiento antes de la
  fecha elegida, mostrar `$0` y la fecha estimada en que se alcanzaría.
- Si la aportación calculada es negativa, tratarla como `$0` y explicar por qué.
- Limitar la simulación a `1200 meses`.
- Al alcanzar el límite, mostrar `Más de 100 años con estos datos`; no afirmar
  que la meta sea matemáticamente imposible.
- Si la aportación mensual es mayor o igual a la brecha actual, mostrar que la
  meta puede alcanzarse con la primera aportación y ajustar ese importe.

### Advertencias no bloqueantes

- Rendimiento anual mayor a `15%`: indicar que es un supuesto optimista y puede
  no mantenerse.
- Meta a más de `24 meses` sin inflación: recordar que el costo futuro podría
  aumentar.
- Inflación igual o mayor que rendimiento: explicar que la meta crece tan rápido
  o más que el ahorro por rendimiento.
- Plazo menor a `3 meses`: indicar que la aportación requerida será alta por el
  plazo corto.
- Más del `25%` del saldo final proviene del rendimiento: recordar que una parte
  importante del plan depende de un supuesto no garantizado.

---

## Acciones

### Crear mi plan

- Es la acción principal.
- Valida todos los campos visibles y avanzados activos.
- Lleva el foco o desplaza la vista al resultado principal en móvil.

### Aplicar escenario

- Actualiza la fecha o aportación principal.
- Recalcula todo el plan.
- Conserva meta, ahorro actual, rendimiento e inflación.

### Copiar resumen

Debe incluir:

- modo utilizado;
- meta original y meta ajustada, cuando aplique;
- ahorro actual;
- aportación mensual o fecha estimada;
- próxima aportación;
- total aportado;
- rendimiento estimado;
- escenario conservador;
- principales supuestos.

### Exportar CSV

- Incluir todas las filas del detalle mensual.
- Conservar importes redondeados a centavos.
- Incluir meta vigente y progreso de cada mes.

### Limpiar formulario

- Restablecer valores y resultados.
- Solicitar confirmación si el usuario ya capturó datos distintos a los valores
  iniciales.

---

## Accesibilidad

- Asociar todas las etiquetas y mensajes de error con su campo.
- Anunciar el resultado principal mediante una región `aria-live="polite"`.
- Mover el foco al primer error al intentar calcular con datos inválidos.
- Mantener un orden de tabulación natural.
- El control segmentado debe comunicar el modo seleccionado.
- La barra de progreso debe tener una alternativa textual.
- Los hitos y escenarios deben ser comprensibles sin depender del color.
- El detalle mensual debe usar encabezados de tabla adecuados.
- Los botones deben conservar textos claros; evitar acciones representadas solo
  por iconos.

---

## Contenido educativo y confianza

Incluir contenido breve después de la calculadora:

- Cómo elegir una meta y una fecha realistas.
- Por qué conviene revisar también el escenario sin rendimiento.
- Cuándo ajustar una meta por inflación.
- Diferencia entre aportar al inicio y al final del mes.
- Qué no considera esta estimación.

Mensaje de confianza recomendado:

> Esta calculadora es una herramienta educativa. Supone aportaciones y tasas
> constantes. No garantiza rendimientos ni considera impuestos, comisiones o
> cambios de mercado.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de ahorro para una meta: crea tu plan mensual` |
| Meta description | `Calcula cuánto ahorrar al mes para alcanzar una meta, cuándo la cumplirás y cómo cambia tu plan al ajustar plazo, aportación, rendimiento e inflación.` |
| H1 | `Calculadora de ahorro para un objetivo` |
| Keyword principal | `calculadora ahorro meta` |
| Keywords secundarias | `cuanto ahorrar al mes`, `ahorro para objetivo`, `meta de ahorro`, `plan de ahorro mensual` |

### FAQs sugeridas

- ¿Cómo calculo cuánto ahorrar cada mes?
- ¿Qué pasa si ya tengo parte del dinero?
- ¿Debo incluir rendimiento en mi plan?
- ¿Cómo afecta la inflación a una meta futura?
- ¿Qué hago si no puedo ahorrar la cantidad recomendada?
- ¿Por qué la última aportación puede ser menor?
- ¿La calculadora garantiza que alcanzaré mi meta?

### Enlaces internos sugeridos

- `/blog/finanzas/cuanto-ahorrar-al-mes-para-una-meta`
- `/finanzas/calculadora-de-interes-compuesto`
- `/finanzas/calculadora-de-inflacion-y-poder-adquisitivo`

---

## Pruebas sugeridas

### Cálculo principal

- Meta `12000`, ahorro `0`, plazo `12 meses`, tasa `0%` produce aportación
  mostrada de `1000`.
- Ahorro actual igual a meta muestra `Meta cumplida`.
- Rendimiento anual positivo reduce la aportación requerida frente al escenario
  de `0%`.
- La aportación redondeada hacia arriba alcanza o supera la meta al simular.
- La última aportación se reduce cuando una aportación completa excedería la
  meta.
- El total aportado más rendimiento estimado coincide con el saldo final.

### Fechas y calendario

- El número de aportaciones incluye el cierre del mes actual.
- Una fecha pasada muestra error.
- La fecha estimada coincide con el primer mes donde el saldo alcanza la meta.
- Los hitos guardan la primera fecha en que se alcanza cada porcentaje.
- El modo tiempo llega a la meta en el mes esperado con tasa `0%`.

### Inflación

- Con inflación activa y fecha fija, la meta ajustada es mayor que la meta
  original.
- Con inflación activa en modo tiempo, la meta crece cada mes.
- Inflación igual o mayor que rendimiento puede producir un plazo más largo.
- Una meta a más de `24 meses` sin inflación muestra la nota informativa.

### Escenarios y estados

- Los escenarios `+3`, `+6` y `+12 meses` reducen o mantienen la aportación
  requerida.
- Los escenarios `+$500` y `+$1,000` adelantan o mantienen la fecha estimada.
- Aplicar un escenario actualiza el input correspondiente y recalcula.
- Si el ahorro actual y su rendimiento cubren la meta, la aportación es `$0` y
  se muestra la fecha estimada.
- Al llegar a `1200 meses`, se muestra `Más de 100 años con estos datos`.
- Una tasa mayor a `15%` muestra advertencia sin bloquear el cálculo.

### Presentación y accesibilidad

- El resultado principal aparece antes del detalle mensual.
- La barra de progreso comunica su valor mediante texto accesible.
- Los resultados se anuncian sin interrumpir al usuario.
- El primer error recibe foco al intentar calcular.
- La experiencia es utilizable a `320px`, `360px`, `390px` y `430px`.
- Copiar resumen incluye el escenario conservador.
- El CSV contiene todas las filas mensuales y la meta vigente de cada mes.
