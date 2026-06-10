# Especificación v2 - Calculadora de precio de proyecto freelance

## Descripción general

Herramienta para estimar cuánto cobrar por un proyecto freelance y analizar si
un precio fijo propuesto compensa el trabajo, los gastos y el riesgo asumido.

La calculadora debe ayudar a responder tres preguntas:

1. ¿Cuánto debería cotizar?
2. ¿Qué margen de tiempo y dinero estoy reservando?
3. ¿Qué pasa si el proyecto requiere más horas de las previstas?

El cálculo parte de una tarifa sostenible definida por el usuario, las horas de
cada fase, los gastos directos y el riesgo del proyecto. Debe separar claramente
el precio antes de impuestos, el impuesto agregado a la cotización, las
comisiones de cobro y el margen comercial objetivo.

**Arquitectura:** todo el cálculo ocurre en el cliente. No requiere backend,
base de datos ni llamadas a APIs externas.

**Aviso de alcance:** el impuesto agregado es una estimación manual para preparar
la cotización. La herramienta no calcula obligaciones fiscales, retenciones ni
la utilidad contable real del usuario.

---

## Objetivo de producto

- Recomendar un precio de proyecto basado en fases, tarifas y riesgo.
- Mostrar un rango útil: precio base, recomendado y conservador.
- Hacer visible la contingencia como horas y dinero, no solo como porcentaje.
- Analizar un precio fijo propuesto y compararlo contra la tarifa sostenible.
- Separar gastos directos, comisiones, margen comercial e impuesto agregado.
- Crear un plan de pagos por hitos que sume exactamente el total cotizado.
- Generar un resumen listo para copiar en una propuesta.
- Ofrecer una experiencia mobile first que no dependa de tablas horizontales.

---

## Alcance recomendado

### MVP

- Dos modos de cálculo:
  - `Recomendar precio`.
  - `Analizar precio propuesto`.
- Tarifa por hora base.
- Lista editable de fases con nombre, horas y tarifa específica opcional.
- Gastos directos del proyecto.
- Contingencia sobre las horas de trabajo.
- Comisión porcentual sobre el cobro.
- Margen comercial objetivo real.
- Impuesto agregado manualmente a la cotización.
- Tres escenarios: base, recomendado y conservador.
- Plan de pagos: anticipo, avance y entrega.
- Resumen para propuesta listo para copiar.
- Usar ejemplo, copiar resumen y limpiar formulario.

### Fuera del MVP

- Cálculo automático de impuestos por país o régimen fiscal.
- Retenciones, deducciones o declaraciones fiscales.
- Exportación CSV o PDF.
- Historial persistente.
- Seguimiento de horas reales durante la ejecución.
- Comparación con precios de mercado.
- Contratos, términos legales o generación de facturas.

### Fase 2

- Plantillas de proyecto: diseño, desarrollo, consultoría y contenido.
- Hitos editables con nombre y porcentaje.
- Comparador de hasta tres cotizaciones guardadas.
- Historial en `sessionStorage`.
- Vista imprimible y exportación.
- Compartir escenario mediante parámetros de URL.
- Comparar horas estimadas contra horas reales.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL pública recomendada | `/finanzas/calculadora-de-precio-de-proyecto-freelance` |
| Archivo Astro recomendado | `src/pages/finanzas/calculadora-de-precio-de-proyecto-freelance.astro` |
| Lógica de cálculo | `src/lib/calculators/finanzas/calculadora-de-precio-de-proyecto-freelance/freelanceProjectPrice.ts` |
| Pruebas unitarias | `src/lib/calculators/finanzas/calculadora-de-precio-de-proyecto-freelance/freelanceProjectPrice.test.ts` |
| Categoría inmediata | `finanzas` |
| Categoría futura opcional | `negocios` si se crea en `src/lib/constants/categories.ts` |
| Locale base | `es-MX` |
| Moneda base | `MXN`, símbolo `$` |

---

## Definiciones del modelo

### Tarifa por hora base

Valor sostenible de una hora de trabajo del usuario. Debe cubrir su operación
habitual antes de agregar el riesgo comercial específico del proyecto.

La página debe enlazar contextualmente a la calculadora de tarifa por hora
freelance para usuarios que todavía no conocen esta cifra.

### Costo modelado del trabajo

Suma del valor de las horas de todas las fases. No representa necesariamente un
costo contable; es la base usada para evitar cotizar por debajo del valor del
tiempo estimado.

### Gastos directos

Importes necesarios únicamente para ejecutar el proyecto, por ejemplo licencias,
materiales, colaboradores, traslados o servicios contratados.

### Contingencia de trabajo

Reserva de horas para revisiones, coordinación, pequeños cambios y errores de
estimación. Se aplica al costo modelado del trabajo, no a los gastos directos.

Debe mostrarse tanto como porcentaje como en horas y dinero.

### Comisión sobre cobros

Porcentaje descontado del precio antes de impuestos por una plataforma,
marketplace o pasarela de pago.

### Margen comercial objetivo

Porcentaje del precio antes de impuestos que queda después del costo modelado
ajustado por contingencia, los gastos directos y la comisión sobre cobros.

No debe confundirse con un recargo o markup. Para alcanzar un margen real, el
precio se obtiene dividiendo entre el porcentaje restante.

### Impuesto agregado a la cotización

Porcentaje manual que se agrega al precio antes de impuestos para obtener el
total presentado al cliente. No forma parte del ingreso disponible ni de la
tarifa efectiva.

### Precio propuesto

Precio fijo antes de impuestos que el usuario o el cliente ya tiene en mente.
Se analiza contra los mismos costos, comisión y horas del proyecto.

---

## Experiencia mobile first

### Principios

- Mantener corto el primer recorrido: tarifa base, primera fase y cálculo.
- Colocar ajustes avanzados dentro de secciones desplegables.
- Mostrar el resultado principal inmediatamente después del formulario.
- No depender de tablas horizontales para resultados esenciales.
- Usar tarjetas apiladas para fases, escenarios y pagos.
- Conservar el último resultado válido y marcarlo como desactualizado al editar.
- Mantener objetivos táctiles de al menos `44 × 44 px` para acciones frecuentes.

### Orden de la interfaz en móvil

1. Selector de modo.
2. Tarifa base.
3. Lista de fases.
4. Ajustes del proyecto.
5. Acción principal sticky.
6. Resultado principal.
7. Escenarios de precio o análisis del precio propuesto.
8. Plan de pagos.
9. Resumen copiable.
10. Desglose detallado.
11. Contenido educativo y FAQs.

En escritorio, formulario y resultado pueden mostrarse en dos columnas. El orden
del documento debe seguir siendo lógico sin estilos.

### Selector de modo

Mostrar dos pestañas o botones segmentados:

- `Recomendar precio`: calcula cuánto cotizar para alcanzar el margen objetivo.
- `Analizar precio propuesto`: evalúa un precio fijo antes de impuestos.

El cambio de modo debe conservar los datos compartidos. El precio propuesto solo
se muestra en el segundo modo.

### Editor de fases

Cada fase se presenta como una tarjeta compacta.

Contenido expandido:

- Nombre de fase.
- Horas estimadas.
- Tarifa específica opcional.
- Acción `Duplicar`.
- Acción `Eliminar`.

Resumen colapsado:

> Diseño · 12 h · $7,200

Reglas:

- La primera fase aparece expandida.
- Las fases nuevas reciben un nombre secuencial.
- Después de agregar una fase, mover el foco a su nombre.
- No permitir eliminar la única fase existente; ofrecer limpiar sus valores.
- Limitar el MVP a `20` fases.
- En móvil, las acciones de duplicar y eliminar deben incluir texto accesible y
  no depender únicamente de iconos.

### Ajustes desplegables

Agrupar los campos secundarios en dos bloques:

`Riesgo, gastos y margen`

> Ajustes: 10% de contingencia, sin gastos y 20% de margen.

`Impuesto y plan de pagos`

> Cotización sin impuesto agregado. Pagos: 50%, 25% y 25%.

### Acción principal

- Usar un botón sticky de ancho completo en móvil.
- Etiqueta por modo:
  - `Calcular precio recomendado`.
  - `Analizar precio propuesto`.
- Tras un cálculo válido, desplazar suavemente el foco al resultado.
- Anunciar el resultado mediante `aria-live="polite"`.

### Presentación del resultado

No usar una tabla horizontal para el resumen principal. Mostrar tarjetas y
detalles desplegables.

En modo recomendado, la cifra principal es:

> Precio recomendado antes de impuestos: $57,662.34

Debajo:

> Reserva 9 horas de contingencia y alcanza un margen comercial estimado de 20%.

En modo análisis:

> El precio propuesto queda $4,200 por debajo del objetivo recomendado.

Debajo:

> Financia aproximadamente 68 horas antes de caer por debajo de tu tarifa base.

---

## Flujo principal del MVP

### Ejemplo de precio recomendado

Un proyecto requiere `60` horas a `$600` por hora, tiene `$3,000` de gastos,
usa `15%` de contingencia, paga `3%` de comisión y busca un margen comercial de
`20%`. El usuario quiere saber cuánto cotizar antes y después de agregar `16%`
de impuesto.

### Ejemplo de análisis

Con los mismos supuestos, el cliente propone pagar `$55,000` antes de impuestos.
El usuario quiere saber el margen alcanzado, la tarifa efectiva y cuántas horas
adicionales puede absorber.

---

## Inputs del MVP

| Campo | Tipo | Rango válido | Valor por defecto | Visibilidad |
|-------|------|---------------|-------------------|-------------|
| Modo | Selector | recomendado / análisis | recomendado | Siempre |
| Tarifa por hora base | Texto numérico | `> 0` | vacío | Siempre |
| Nombre de fase | Texto | 1-60 caracteres | `Fase 1` | Siempre |
| Horas estimadas de fase | Texto numérico | `> 0` | vacío | Siempre |
| Tarifa específica de fase | Texto numérico opcional | `> 0` | vacío | Siempre |
| Gastos directos | Texto numérico | `>= 0` | `0` | Ajustes |
| Contingencia recomendada (%) | Texto numérico | `0%-100%` | `10` | Ajustes |
| Contingencia conservadora (%) | Texto numérico | recomendada-`100%` | recomendada + `10`, máximo `100` | Ajustes |
| Comisión sobre cobros (%) | Texto numérico | `0%-50%` | `0` | Ajustes |
| Margen comercial objetivo (%) | Texto numérico | `0%-80%` | `20` | Ajustes |
| Precio propuesto antes de impuestos | Texto numérico | `> 0` | vacío | Solo análisis |
| Impuesto agregado (%) | Texto numérico | `0%-100%` exclusivo | `0` | Ajustes |
| Anticipo (%) | Texto numérico | `0%-100%` | `50` | Ajustes |
| Pago de avance (%) | Texto numérico | `0%-100%` | `25` | Ajustes |
| Pago final (%) | Texto numérico | `0%-100%` | `25` | Ajustes |

La contingencia conservadora debe actualizarse automáticamente a
`contingencia recomendada + 10 puntos`, salvo que el usuario la haya editado.

---

## Acciones del MVP

- `Calcular precio recomendado` o `Analizar precio propuesto`.
- `Agregar fase`.
- `Duplicar fase`.
- `Eliminar fase`.
- `Usar ejemplo`.
- `Copiar resumen para propuesta`.
- `Limpiar`.

`Exportar CSV` se mantiene fuera del MVP. El resumen para propuesta aporta más
valor inmediato y debe ser la acción secundaria principal.

---

## Outputs del MVP

### Outputs compartidos

- Horas estimadas.
- Costo modelado del trabajo.
- Gastos directos.
- Tarifa promedio ponderada.
- Comisión estimada.
- Precio antes de impuestos.
- Impuesto agregado.
- Total presentado al cliente.
- Plan de pagos.

### Modo `Recomendar precio`

- Precio base antes de impuestos.
- Precio recomendado antes de impuestos.
- Precio conservador antes de impuestos.
- Horas y monto reservados por contingencia en cada escenario.
- Margen comercial objetivo.
- Tarifa efectiva neta del escenario recomendado.
- Diferencia monetaria entre escenarios.

### Modo `Analizar precio propuesto`

- Diferencia contra el precio recomendado.
- Margen comercial alcanzado.
- Tarifa efectiva neta.
- Estado del precio: `saludable`, `ajustado` o `por debajo de base`.
- Horas financiadas a la tarifa promedio ponderada.
- Horas adicionales disponibles antes de caer debajo de la tarifa base.
- Precio mínimo para cubrir el escenario recomendado sin margen comercial.

### Plan de pagos

Mostrar tres tarjetas:

- Anticipo.
- Pago de avance.
- Pago final.

Cada tarjeta muestra porcentaje y monto. Los pagos se calculan sobre el total
presentado al cliente, incluido el impuesto agregado.

### Resumen para propuesta

El texto copiable debe incluir:

- Nombre genérico del proyecto.
- Precio antes de impuestos.
- Impuesto agregado, si aplica.
- Total presentado al cliente.
- Horas estimadas y contingencia incluida.
- Gastos directos, si existen.
- Plan de pagos.
- Aclaración breve de que cambios de alcance requieren una nueva estimación.

Ejemplo:

> Cotización estimada: $57,662.34 antes de impuestos. Incluye 60 horas estimadas,
> 9 horas de contingencia y $3,000 de gastos directos. Total con impuesto:
> $66,888.31. Pagos: 50% anticipo, 25% avance y 25% entrega. Cambios de alcance
> no incluidos requieren una nueva estimación.

---

## Fórmulas y algoritmo

### Valores base

```text
tarifa_fase = tarifa_especifica_fase || tarifa_base
costo_fase = horas_fase * tarifa_fase

horas_estimadas = suma(horas_fase)
costo_trabajo = suma(costo_fase)
tarifa_promedio_ponderada = costo_trabajo / horas_estimadas
```

La tarifa base solo es obligatoria si al menos una fase válida no tiene tarifa
específica.

### Construcción de un escenario

Para cada escenario se usa una tasa de contingencia diferente:

```text
horas_contingencia = horas_estimadas * (contingencia / 100)
costo_contingencia = costo_trabajo * (contingencia / 100)

horas_ajustadas = horas_estimadas + horas_contingencia
costo_ajustado = costo_trabajo + costo_contingencia + gastos_directos
```

La contingencia se aplica al trabajo. Los gastos directos no se multiplican por
la contingencia.

### Precio para alcanzar margen objetivo

```text
tasa_comision = comision_cobro / 100
tasa_margen = margen_objetivo / 100

precio_antes_impuestos =
  costo_ajustado / (1 - tasa_comision - tasa_margen)

comision_monto = precio_antes_impuestos * tasa_comision
margen_monto =
  precio_antes_impuestos - costo_ajustado - comision_monto

margen_alcanzado =
  margen_monto / precio_antes_impuestos
```

Si `tasa_comision + tasa_margen >= 1`, no existe un precio que alcance el
objetivo y el cálculo debe bloquearse.

### Escenarios de precio

```text
escenario_base = construir_escenario(contingencia = 0%)
escenario_recomendado =
  construir_escenario(contingencia = contingencia_recomendada)
escenario_conservador =
  construir_escenario(contingencia = contingencia_conservadora)
```

Los tres escenarios usan los mismos gastos, comisión y margen objetivo.

### Impuesto agregado y total

```text
impuesto_monto = precio_antes_impuestos * (impuesto_agregado / 100)
total_cliente = precio_antes_impuestos + impuesto_monto
```

El impuesto agregado no forma parte del margen ni de la tarifa efectiva.

### Tarifa efectiva neta

```text
ingreso_disponible_para_trabajo =
  precio_antes_impuestos - gastos_directos - comision_monto

tarifa_efectiva_neta =
  ingreso_disponible_para_trabajo / horas_ajustadas
```

La tarifa efectiva usa las horas ajustadas del escenario correspondiente. No
debe inflarse incluyendo gastos reembolsables o impuesto agregado.

### Análisis de precio propuesto

El precio propuesto siempre se interpreta antes de impuestos.

```text
comision_propuesta = precio_propuesto * tasa_comision

resultado_comercial_propuesto =
  precio_propuesto
  - costo_ajustado_recomendado
  - comision_propuesta

margen_propuesto =
  resultado_comercial_propuesto / precio_propuesto

ingreso_propuesto_para_trabajo =
  precio_propuesto - gastos_directos - comision_propuesta

tarifa_efectiva_propuesta =
  ingreso_propuesto_para_trabajo / horas_ajustadas_recomendadas

horas_financiadas =
  ingreso_propuesto_para_trabajo / tarifa_promedio_ponderada

horas_adicionales_disponibles =
  horas_financiadas - horas_estimadas

diferencia_con_recomendado =
  precio_propuesto - precio_recomendado_antes_impuestos

precio_minimo_cobertura =
  costo_ajustado_recomendado / (1 - tasa_comision)
```

Las horas adicionales disponibles pueden ser negativas. Esta métrica compara
el precio contra la tarifa promedio ponderada y debe presentarse como una
estimación, especialmente cuando las fases usan tarifas diferentes.

### Estado del precio propuesto

```text
si tarifa_efectiva_propuesta < tarifa_promedio_ponderada:
  estado = "por_debajo_de_base"

si tarifa_efectiva_propuesta >= tarifa_promedio_ponderada
  y margen_propuesto < margen_objetivo:
  estado = "ajustado"

si margen_propuesto >= margen_objetivo:
  estado = "saludable"
```

### Plan de pagos

```text
pago_anticipo = total_cliente * (anticipo / 100)
pago_avance = total_cliente * (pago_avance_porcentaje / 100)
pago_final = total_cliente - pago_anticipo - pago_avance
```

Redondear primero el total, el anticipo y el pago de avance a centavos. Calcular
el pago final por diferencia entre esos importes redondeados evita que la suma
visible sea distinta del total presentado al cliente.

---

## Validaciones, advertencias y estados

### Errores bloqueantes

- Debe existir al menos una fase válida.
- Cada fase válida necesita nombre y horas mayores que cero.
- Debe existir una tarifa válida para cada fase.
- No se permiten más de `20` fases.
- Gastos directos negativos.
- Contingencia recomendada fuera de `0%-100%`.
- Contingencia conservadora menor que la recomendada o mayor que `100%`.
- Comisión fuera de `0%-50%`.
- Margen fuera de `0%-80%`.
- Comisión más margen igual o mayor que `100%`.
- Impuesto agregado menor que `0%` o igual o mayor que `100%`.
- Precio propuesto vacío o menor o igual que cero en modo análisis.
- Porcentajes de pago que no suman `100%`, con tolerancia de `0.01`.
- Valores no finitos o entradas con más de dos decimales.

### Advertencias no bloqueantes

- Contingencia igual a `0%`:

  > No estás reservando horas para revisiones o cambios menores. Confirma que el
  > alcance está suficientemente definido.

- Contingencia mayor que `50%`:

  > La reserva supera la mitad del trabajo estimado. Revisa si conviene ajustar
  > el alcance o dividir el proyecto.

- Gastos directos mayores que el costo del trabajo:

  > Los gastos directos representan la mayor parte de la cotización. Confirma
  > importes y condiciones de reembolso.

- Impuesto agregado igual a `0%`:

  > La cotización no agrega impuestos. Confirma que este supuesto aplica a tu
  > caso.

- Precio propuesto por debajo de la base:

  > Con este precio, la tarifa efectiva queda por debajo del valor modelado de
  > tu tiempo.

- Anticipo menor que `20%`:

  > Un anticipo bajo puede aumentar el riesgo de financiar el inicio del
  > proyecto.

### Estado inicial

- No mostrar cifras calculadas como si fueran resultados.
- Explicar brevemente qué aparecerá después del cálculo.
- Mostrar una sola fase vacía.
- Mantener cerrados los ajustes secundarios.

### Estado inválido después de un resultado válido

- Conservar el último resultado válido.
- Mostrar que el resultado corresponde a datos anteriores.
- No permitir copiar el resultado desactualizado como si fuera nuevo.
- Mover el foco al resumen de errores cuando el usuario intenta recalcular.

### Redondeo

- Mantener precisión completa durante los cálculos.
- Mostrar importes monetarios con dos decimales.
- Mostrar horas y porcentajes con máximo dos decimales.
- Calcular el último pago por diferencia para asegurar que el plan suma el total.

---

## Contenido educativo y confianza

La página debe explicar:

- Diferencia entre precio por horas y precio fijo.
- Diferencia entre margen comercial y recargo.
- Por qué la contingencia debe expresarse también en horas.
- Qué gastos directos conviene incluir.
- Qué significa una tarifa efectiva neta.
- Por qué el impuesto agregado no es ingreso disponible.
- Cómo reducir riesgo mediante alcance, hitos y anticipo.

Debe incluir un enlace contextual a:

- Calculadora de tarifa por hora freelance.
- Calculadora de margen y markup.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de precio de proyecto freelance` |
| Meta description | `Calcula cuánto cobrar por un proyecto freelance, compara escenarios y analiza si un precio fijo cubre horas, gastos, riesgo y margen.` |
| H1 | `Calculadora de precio de proyecto freelance` |
| Keyword principal | `calculadora precio proyecto freelance` |
| Keywords secundarias | `cuánto cobrar por proyecto`, `cotización freelance`, `precio fijo freelance`, `presupuesto proyecto freelance` |

### FAQs sugeridas

- ¿Cómo calculo cuánto cobrar por un proyecto freelance?
- ¿Qué porcentaje de contingencia conviene usar?
- ¿Cuál es la diferencia entre margen y recargo?
- ¿Cómo sé si un precio fijo me conviene?
- ¿Debo cobrar anticipo?
- ¿Los impuestos forman parte de mi tarifa efectiva?
- ¿Qué gastos debo incluir en una cotización?

---

## Accesibilidad

- Asociar cada campo con su `label`, ayuda y mensaje de error.
- Usar `inputmode="decimal"` para importes, horas y porcentajes.
- Mantener acciones táctiles frecuentes con un área mínima de `44 × 44 px`.
- No depender únicamente del color para comunicar el estado del precio.
- Anunciar resultados, errores y estado de copiado con regiones `aria-live`.
- Mover el foco al resultado después de un cálculo válido.
- Mover el foco al resumen de errores después de un intento inválido.
- Mantener un orden de foco lógico al agregar, duplicar o eliminar fases.
- No ocultar información esencial dentro de una tabla con scroll horizontal.
- Respetar `prefers-reduced-motion` al desplazar la vista.

---

## Pruebas sugeridas

### Cálculo base

- Una fase de `60` horas a `$600` produce costo de trabajo de `$36,000`.
- Dos fases con tarifas distintas calculan la tarifa promedio ponderada.
- Una tarifa específica reemplaza la tarifa base solo en su fase.
- La tarifa base no es obligatoria si todas las fases tienen tarifa específica.
- Gastos directos se suman una sola vez.

### Contingencia y escenarios

- Contingencia `15%` sobre `60` horas reserva `9` horas.
- Contingencia `15%` sobre `$36,000` agrega `$5,400` al trabajo.
- La contingencia no incrementa los gastos directos.
- El escenario base usa contingencia `0%`.
- El escenario conservador nunca usa menos contingencia que el recomendado.

### Margen y comisión

- Un margen objetivo se calcula sobre el precio, no como recargo sobre el costo.
- Comisión `0%` no cambia el precio.
- Aumentar comisión incrementa el precio necesario.
- Comisión más margen igual o mayor que `100%` bloquea el cálculo.
- El margen alcanzado del precio recomendado coincide con el objetivo dentro de
  la tolerancia de redondeo.

### Impuesto y pagos

- Impuesto `16%` se agrega después del precio antes de impuestos.
- El impuesto no modifica el margen ni la tarifa efectiva.
- Los pagos se calculan sobre el total incluido impuesto.
- El último pago absorbe diferencias de redondeo.
- Un plan que no suma `100%` muestra error.

### Análisis de precio propuesto

- Un precio igual al recomendado tiene diferencia de `$0`.
- Un precio por debajo del costo ajustado muestra estado `por_debajo_de_base`.
- Un precio que cubre la tarifa base pero no alcanza el margen muestra
  `ajustado`.
- Un precio que alcanza el margen objetivo muestra `saludable`.
- Las horas adicionales pueden ser negativas.
- Gastos e impuesto agregado no inflan la tarifa efectiva.

### Interfaz y accesibilidad

- En móvil, el resultado aparece inmediatamente después del formulario.
- Fases, escenarios y pagos se muestran como tarjetas apiladas.
- Agregar fase mueve el foco a la fase nueva.
- No se puede eliminar la única fase.
- El botón principal sticky cambia de etiqueta según el modo.
- El foco llega al resultado después de un cálculo válido.
- El resultado principal se anuncia mediante `aria-live="polite"`.
- Un resultado anterior se marca como desactualizado después de editar.

---

## Criterios de aceptación del MVP

1. El usuario puede calcular un precio recomendado con al menos una fase.
2. El margen comercial se calcula como porcentaje del precio, no como recargo.
3. Gastos, contingencia, comisión e impuesto agregado se muestran por separado.
4. La contingencia se expresa en porcentaje, horas y dinero.
5. Se muestran escenarios base, recomendado y conservador.
6. El usuario puede analizar un precio fijo propuesto.
7. El análisis muestra diferencia, margen, tarifa efectiva y horas disponibles.
8. El plan de pagos suma exactamente el total presentado al cliente.
9. El usuario puede copiar un resumen útil para una propuesta.
10. Los resultados esenciales no dependen de tablas horizontales en móvil.
11. Los errores, advertencias y resultados son accesibles mediante teclado y
    tecnologías de asistencia.
12. La página deja claro que no sustituye asesoría fiscal ni contractual.
