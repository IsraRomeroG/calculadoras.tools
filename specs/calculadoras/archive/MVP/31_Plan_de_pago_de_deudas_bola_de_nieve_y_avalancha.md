# Especificación v2 - Plan de pago de deudas: bola de nieve y avalancha

## Descripción general

Herramienta para crear un plan accionable de pago de varias deudas y comparar
las estrategias bola de nieve y avalancha. Además de estimar meses e intereses,
debe indicar cuánto pagar a cada deuda el próximo mes, cuándo se liquidará cada
una y qué se gana al aumentar el presupuesto mensual.

La calculadora debe explicar sus supuestos y no presentar los resultados como
asesoría financiera.

**Arquitectura:** todo el cálculo ocurre en el cliente. No requiere backend,
base de datos ni llamadas a APIs externas.

---

## Objetivo de producto

- Convertir los datos de varias deudas en un plan mensual fácil de seguir.
- Comparar bola de nieve y avalancha con el mismo presupuesto, usando pagos
  mínimos sin reasignación como escenario de referencia.
- Mostrar el intercambio entre ahorrar intereses y liquidar antes la primera deuda.
- Recomendar cuánto pagar a cada deuda durante el próximo mes.
- Mostrar hitos: primera deuda liquidada, fecha por deuda y fecha libre de deudas.
- Detectar presupuestos insuficientes y deudas cuyo saldo no disminuye.
- Generar una página estática optimizada para SEO en Astro.

---

## Alcance recomendado

### MVP

- Lista editable de deudas.
- Estrategias: `Bola de nieve`, `Avalancha` y `Orden personalizado`.
- Dos formas de definir capacidad de pago:
  - `Pago extra mensual`, adicional a la suma de pagos mínimos.
  - `Presupuesto total mensual`, incluyendo los pagos mínimos.
- Mes de inicio opcional.
- Simulación mensual hasta liquidar todas las deudas.
- Presupuesto mensual constante durante toda la simulación.
- Reasignación del dinero sobrante a la siguiente deuda dentro del mismo mes.
- Comparación contra el escenario base de pagar únicamente los mínimos.
- Resumen comparativo entre estrategias.
- Recomendación de pagos para el próximo mes.
- Cronograma de hitos por deuda.
- Detalle mensual expandible.
- Copiar resumen, limpiar formulario y exportar CSV.
- Aviso de supuestos y aviso legal visibles.

### Fase 2

- Escenarios rápidos para comparar el presupuesto actual contra `+$500` y `+$1,000`.
- Pagos extra dirigidos a una deuda específica.
- Aportaciones extraordinarias en meses específicos.
- Pausa de pagos o meses sin ingreso.
- Pagos mínimos variables o calculados como porcentaje del saldo.
- Tasas promocionales con fecha de vencimiento.
- Historial de últimos cálculos en `sessionStorage`.
- Vista imprimible.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL pública recomendada | `/finanzas/plan-de-pago-de-deudas` |
| Archivo Astro recomendado | `src/pages/finanzas/plan-de-pago-de-deudas.astro` |
| Lógica de cálculo | `src/lib/calculators/finanzas/plan-de-pago-de-deudas/debtPayoff.ts` |
| Pruebas unitarias | `src/lib/calculators/finanzas/plan-de-pago-de-deudas/debtPayoff.test.ts` |
| Categoría | `finanzas` |
| Locale base | `es-MX` |
| Moneda base | `MXN`, símbolo `$` |

---

## Experiencia mobile-first

### Principios

- La captura de datos debe ser la experiencia principal del primer viewport.
- Usar tarjetas compactas para las deudas; no obligar a editar dentro de tablas.
- Priorizar decisiones y próximos pasos antes que tablas o gráficas detalladas.
- No depender únicamente del color para indicar advertencias o estrategia ganadora.
- Todos los controles táctiles deben tener etiquetas claras y un área cómoda.
- Mantener visible un botón inferior `Comparar estrategias` cuando haya datos válidos.

### Flujo recomendado en móvil

1. Elegir cómo definir la capacidad de pago y capturar el importe mensual.
2. Agregar o editar deudas mediante tarjetas.
3. Comparar estrategias.
4. Mostrar recomendación, diferencias clave y advertencias.
5. Mostrar los pagos sugeridos para el próximo mes.
6. Mostrar hitos de liquidación en acordeones.
7. Ofrecer el detalle mensual y la exportación CSV como opciones avanzadas.

### Componentes móviles

- Cada tarjeta de deuda muestra nombre, saldo, tasa y pago mínimo.
- Después de capturarla, la tarjeta puede plegarse para reducir desplazamiento.
- El orden personalizado debe permitir botones accesibles `Subir` y `Bajar`,
  aunque también se implemente arrastrar y soltar.
- La comparación de estrategias se muestra como tarjetas apiladas.
- El detalle mensual se muestra primero como acordeones por mes o deuda.
- Si se incluye una tabla completa, debe usar `overflow-x-auto` como vista secundaria.
- Los botones para agregar, duplicar o eliminar deuda deben incluir texto visible.

---

## Flujo principal MVP

**Ejemplo:** Tengo tres deudas: tarjeta de `$20,000` al `45%`, préstamo de
`$50,000` al `24%` y compra a meses de `$8,000` al `0%`. Puedo destinar `$7,500`
en total cada mes. ¿Qué estrategia me conviene y cuánto debo pagar a cada deuda
el próximo mes?

### Inputs globales

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Estrategia | Selector | `Bola de nieve`, `Avalancha`, `Personalizado` | `Avalancha` |
| Forma de captura | Selector | `Pago extra`, `Presupuesto total` | `Pago extra` |
| Importe mensual | Texto numérico | `>= 0` | `0` |
| Mes de inicio | Mes/año | fecha válida | mes actual |

### Inputs por deuda

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Nombre de deuda | Texto | 1-60 caracteres | `Deuda 1` |
| Saldo | Texto numérico | `> 0` | vacío |
| Tasa anual (%) | Texto numérico | `0%-200%` | vacío |
| Pago mínimo mensual | Texto numérico | `>= 0` | vacío |

Cada deuda debe tener un identificador interno único. Los nombres visibles pueden
repetirse.

### Outputs principales

- Estrategia seleccionada y presupuesto mensual constante.
- Meses y fecha estimada para quedar sin deudas.
- Intereses totales y total pagado.
- Ahorro de meses e intereses frente a pagar únicamente los mínimos.
- Diferencia de intereses entre bola de nieve y avalancha.
- Diferencia en la fecha de la primera deuda liquidada entre estrategias.
- Deuda atacada primero.
- Recomendación de cuánto pagar a cada deuda el próximo mes.
- Fecha estimada de liquidación y pago liberado para cada deuda.
- Advertencias sobre presupuesto insuficiente o saldos que no disminuyen.

### Mensaje comparativo recomendado

La comparación debe explicar el intercambio entre estrategias con lenguaje
directo, por ejemplo:

> Avalancha ahorra `$8,450` en intereses. Bola de nieve liquida tu primera deuda
> `4 meses` antes.

Si ambas estrategias empatan, indicarlo explícitamente.

---

## Supuestos financieros

La interfaz debe mostrar estos supuestos cerca de los resultados:

- La tasa anual se divide entre 12 para obtener una tasa mensual.
- El interés mensual se calcula sobre el saldo al inicio del mes.
- Los pagos se aplican después de calcular el interés mensual.
- Los pagos mínimos capturados son importes fijos.
- El presupuesto mensual se mantiene constante hasta liquidar todas las deudas.
- No se incluyen comisiones, seguros, moratorios, impuestos ni nuevas compras.
- No se modela saldo promedio diario ni fechas de corte o pago.
- No se modelan cambios futuros de tasa ni promociones que expiran.
- Los resultados son estimaciones y pueden diferir de los estados de cuenta.

Los cálculos internos deben conservar precisión completa. Redondear a centavos
únicamente los importes presentados y exportados.

---

## Fórmulas y algoritmo

### Presupuesto mensual

```text
suma_minimos_iniciales = suma(pago_minimo de todas las deudas)

si forma_captura = pago_extra:
  presupuesto_mensual = suma_minimos_iniciales + importe_mensual

si forma_captura = presupuesto_total:
  presupuesto_mensual = importe_mensual
```

El presupuesto mensual debe permanecer constante durante toda la simulación.
Cuando se liquida una deuda, su pago mínimo queda disponible para atacar las
deudas restantes.

### Orden de estrategias

El orden se determina al comenzar y se vuelve a evaluar únicamente cuando se
liquida la deuda objetivo actual. Esto evita cambiar de objetivo cada mes.

```text
bola_de_nieve:
  menor saldo actual
  desempate: mayor tasa anual
  segundo desempate: orden original de captura

avalancha:
  mayor tasa anual
  desempate: menor saldo actual
  segundo desempate: orden original de captura

personalizado:
  usar el orden elegido por el usuario
```

### Simulación mensual

Para cada mes:

1. Calcular intereses para todas las deudas activas.
2. Reservar el pago mínimo de cada deuda activa.
3. Aplicar primero esos pagos mínimos.
4. Aplicar todo el presupuesto restante a la deuda objetivo.
5. Si la deuda objetivo se liquida, aplicar el sobrante a la siguiente deuda
   dentro del mismo mes.
6. Repetir hasta agotar el presupuesto mensual o liquidar todas las deudas.

```text
tasa_mensual = tasa_anual / 12 / 100
interes_mes = saldo_anterior * tasa_mensual
saldo_con_interes = saldo_anterior + interes_mes

pago_minimo_real = min(pago_minimo, saldo_con_interes)
saldo_despues_minimo = saldo_con_interes - pago_minimo_real

presupuesto_restante =
  presupuesto_mensual - suma(pagos_minimos_reales)

pago_objetivo = min(presupuesto_restante, saldo_despues_minimo_objetivo)
saldo_final = max(0, saldo_despues_minimo - pago_extra_asignado)
```

El último pago total puede ser menor al presupuesto mensual si todas las deudas
se liquidan antes de agotarlo.

### Escenario base: solo mínimos

Simular también un escenario de referencia en el que cada deuda recibe únicamente
su pago mínimo capturado. Cuando una deuda se liquida, su pago mínimo no se
reasigna y el desembolso mensual total disminuye.

```text
pago_deuda_mes = min(pago_minimo, saldo_con_interes)
pago_adicional = 0
```

Este escenario sirve para calcular meses e intereses ahorrados frente a no seguir
una estrategia de reasignación. Si no logra liquidar las deudas dentro del límite
de simulación, debe indicarse sin impedir la comparación con las estrategias que
sí sean viables.

---

## Advertencias y estados

### Estados bloqueantes

- No hay deudas válidas.
- El presupuesto total es menor que la suma de pagos mínimos.
- El presupuesto disponible es `0` y existen saldos pendientes.
- La simulación supera `600` meses sin liquidar todas las deudas.
- Los importes contienen valores no válidos o fuera de rango.

### Advertencias no bloqueantes

- Una deuda tiene `pago_minimo <= interes_mes` y su saldo puede crecer mientras
  no sea la deuda objetivo.
- Alguna deuda tiene pago mínimo igual a `0`.
- Dos o más estrategias producen el mismo resultado.
- Todas las tasas son `0%`, por lo que el orden no cambia los intereses.
- El resultado puede diferir del estado de cuenta por los supuestos del modelo.

Debe distinguirse claramente entre:

- `El saldo de esta deuda crece temporalmente`.
- `Este plan no logra liquidar todas las deudas`.

---

## Resultados y visualización

### Resumen recomendado

Mostrar primero:

- Estrategia recomendada según menor interés total.
- Alternativa que liquida antes la primera deuda.
- Fecha libre de deudas.
- Intereses totales.
- Ahorro frente a pagar únicamente mínimos.
- Próximo pago recomendado.

La interfaz no debe afirmar que una estrategia es universalmente mejor. Debe
explicar que avalancha suele minimizar intereses y bola de nieve puede ofrecer
hitos tempranos.

### Próximo pago recomendado

Mostrar una lista accionable:

```text
Este mes paga:
- Tarjeta A: $4,500
- Préstamo personal: $2,000
- Compra a meses: $1,000
Total: $7,500
```

### Cronograma de hitos

Por cada deuda mostrar:

- Posición en el orden de ataque.
- Fecha estimada de liquidación.
- Intereses pagados.
- Pago mínimo que se libera al liquidarla.
- Presupuesto disponible para la siguiente deuda.

### Detalle mensual

El detalle debe incluir:

- Mes y fecha.
- Deuda.
- Saldo inicial.
- Interés.
- Pago mínimo real.
- Pago adicional asignado.
- Pago total.
- Saldo final.

---

## Exportación y acciones

- `Copiar resumen` debe incluir estrategia, presupuesto, fecha libre de deudas,
  ahorro estimado y próximo pago recomendado.
- `Exportar CSV` debe incluir el detalle mensual y conservar importes mostrados
  redondeados a centavos.
- `Limpiar formulario` debe solicitar confirmación si hay datos capturados.
- Las exportaciones deben incluir una nota breve sobre los supuestos utilizados.

---

## Validaciones

- Permitir una sola deuda, explicando que no hay diferencia entre estrategias.
- Requerir al menos dos deudas para mostrar una comparación entre estrategias.
- No aceptar saldos, tasas o pagos negativos.
- Aceptar tasa `0%` y pago mínimo `0`, mostrando las advertencias correspondientes.
- Si el pago extra es `0`, las estrategias comienzan con la suma de mínimos como
  presupuesto constante y reutilizan los pagos liberados.
- Si todas las tasas son `0%`, la avalancha debe empatar en intereses.
- Permitir nombres repetidos sin mezclar resultados.
- Detener cualquier simulación al superar `600` meses.
- Validar que los pagos aplicados nunca superen el saldo con intereses.
- Validar que la suma de pagos de un mes no supere el presupuesto mensual, salvo
  diferencias visuales de redondeo.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Plan de pago de deudas: bola de nieve y avalancha` |
| Meta description | `Compara estrategias para pagar deudas, estima intereses, fecha de liquidación y cuánto pagar cada mes.` |
| H1 | `Plan de pago de deudas` |
| Keyword principal | `plan de pago de deudas` |
| Keywords secundarias | `bola de nieve deudas`, `avalancha de deudas`, `pagar deudas rápido` |

### FAQs sugeridas

- ¿Qué es mejor, bola de nieve o avalancha?
- ¿Cómo se reutiliza el pago de una deuda liquidada?
- ¿Qué pasa si solo puedo pagar los mínimos?
- ¿Qué pasa si mi pago mínimo no cubre los intereses?
- ¿La calculadora incluye comisiones o moratorios?
- ¿Puedo usarla para tarjetas de crédito?
- ¿Por qué el resultado puede diferir de mi estado de cuenta?

---

## Pruebas sugeridas

### Algoritmo

- Deuda a tasa `0%` se liquida con pagos directos a capital.
- Pago mínimo menor al interés mensual muestra advertencia.
- Avalancha ahorra más intereses que bola de nieve en un caso típico.
- Bola de nieve liquida primero la deuda de menor saldo.
- El presupuesto mensual permanece constante después de liquidar una deuda.
- El sobrante al liquidar una deuda se aplica a la siguiente dentro del mismo mes.
- El orden se recalcula únicamente al liquidar la deuda objetivo.
- Los desempates producen resultados deterministas.
- El último pago puede ser menor al presupuesto mensual.
- Ningún pago supera el saldo con intereses de la deuda.
- La suma de pagos mensuales no supera el presupuesto.

### Casos límite

- Pago extra `0` no rompe la simulación.
- Presupuesto total menor que la suma de mínimos bloquea la simulación.
- Pago mínimo `0` y pago extra `0` se identifica como plan no viable.
- Una deuda puede crecer temporalmente y liquidarse después.
- Una simulación no viable se detiene a los `600` meses.
- Todas las tasas a `0%` producen el mismo interés total.
- Nombres de deuda repetidos conservan resultados independientes.
- Los cálculos internos no acumulan errores significativos de redondeo.

### Presentación y exportación

- La recomendación del próximo mes suma el presupuesto esperado, salvo que el
  saldo total con intereses sea menor.
- El cronograma muestra la fecha de liquidación correcta por deuda.
- La comparación contra pagos mínimos calcula correctamente meses e intereses ahorrados.
- El escenario base reduce su desembolso mensual al liquidar una deuda y no
  reasigna el pago liberado.
- La exportación CSV conserva fechas, identificadores e importes redondeados.
- La experiencia principal puede completarse usando únicamente un viewport móvil.
