# Especificación v1 - Plan de pago de deudas: bola de nieve y avalancha

## Descripción general

Herramienta para ordenar varias deudas y estimar cuánto tiempo tomará pagarlas
usando dos estrategias populares: bola de nieve y avalancha. La calculadora debe
ayudar al usuario a comparar meses, intereses y orden de pago sin presentar el
resultado como asesoría financiera.

**Arquitectura:** todo el cálculo ocurre en el cliente. No requiere backend,
base de datos ni llamadas a APIs externas.

---

## Objetivo de producto

- Permitir capturar varias deudas con saldo, tasa y pago mínimo.
- Comparar bola de nieve contra avalancha con el mismo pago extra mensual.
- Mostrar fecha estimada de liquidación, intereses totales y orden de ataque.
- Detectar deudas cuyo pago mínimo no cubre intereses.
- Generar una página estática optimizada para SEO en Astro.

---

## Alcance recomendado

### MVP

- Lista editable de deudas.
- Estrategias: `Bola de nieve`, `Avalancha` y `Orden personalizado`.
- Pago extra mensual global.
- Mes de inicio opcional.
- Simulación mensual hasta liquidar todas las deudas.
- Resumen comparativo entre estrategias.
- Tabla mensual agrupada por deuda.
- Copiar resumen, limpiar formulario y exportar CSV.
- Aviso legal visible.

### Fase 2

- Pagos extra por deuda.
- Aportaciones extraordinarias en meses específicos.
- Pausa de pagos o meses sin ingreso.
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

## Comportamiento mobile-first

- La calculadora debe aparecer como experiencia principal en el primer viewport.
- En móvil, mostrar primero resumen de pago extra y después la lista de deudas.
- Cada deuda debe editarse en un bloque compacto, no en una tabla obligatoria.
- La comparación de estrategias puede mostrarse como tarjetas apiladas.
- La tabla mensual debe usar `overflow-x-auto`.
- Los botones para agregar, duplicar o eliminar deuda deben tener etiqueta clara.
- No depender únicamente del color para indicar la estrategia ganadora.

---

## Flujo principal MVP

**Ejemplo:** Tengo tres deudas: tarjeta de `$20,000` al `45%`, préstamo de
`$50,000` al `24%` y compra a meses de `$8,000` al `0%`. Puedo pagar `$2,000`
extra al mes. ¿Qué estrategia me conviene?

### Inputs del MVP

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Estrategia | Selector | `Bola de nieve`, `Avalancha`, `Personalizado` | `Avalancha` |
| Pago extra mensual | Texto numérico | `>= 0` | `0` |
| Mes de inicio | Mes/año | fecha válida | mes actual |
| Nombre de deuda | Texto | 1-60 caracteres | `Deuda 1` |
| Saldo | Texto numérico | `> 0` | vacío |
| Tasa anual (%) | Texto numérico | `0%-200%` | vacío |
| Pago mínimo mensual | Texto numérico | `>= 0` | vacío |

### Outputs principales

- Meses para quedar sin deudas.
- Fecha estimada de liquidación.
- Intereses totales.
- Total pagado.
- Deuda atacada primero.
- Diferencia de intereses entre bola de nieve y avalancha.
- Tabla mensual con saldo, interés, pago mínimo, pago extra y saldo final.

---

## Fórmulas y algoritmo

### Orden de estrategias

```text
bola_de_nieve = ordenar deudas por saldo ascendente
avalancha = ordenar deudas por tasa_anual descendente
personalizado = usar orden elegido por el usuario
```

### Simulación mensual

```text
tasa_mensual = tasa_anual / 12 / 100
interes_mes = saldo_anterior * tasa_mensual
saldo_con_interes = saldo_anterior + interes_mes
pago_base = min(pago_minimo, saldo_con_interes)
```

El pago extra mensual completo se asigna a la primera deuda activa según la
estrategia. Cuando una deuda se liquida, el pago mínimo de esa deuda se suma al
flujo disponible del siguiente mes.

```text
flujo_disponible_mes = suma_pagos_minimos_de_deudas_activas + pago_extra
pago_deuda_objetivo = pago_minimo + extra_asignado
saldo_final = max(0, saldo_con_interes - pago_real)
```

### Condición de seguridad

Si una deuda tiene `pago_minimo <= interes_mes` y no recibe pago extra suficiente,
la simulación debe advertir que la deuda no baja de saldo.

---

## Validaciones y estados

- Requerir al menos 2 deudas para mostrar comparación de estrategias.
- Permitir una sola deuda, pero explicar que no hay diferencia entre estrategias.
- Detener simulación si supera `600` meses y mostrar advertencia.
- No aceptar saldos negativos.
- No aceptar tasas negativas.
- Si el pago extra es `0`, comparar solo con pagos mínimos.
- Si todas las tasas son `0`, la avalancha debe empatar con otros órdenes.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Plan de pago de deudas: bola de nieve y avalancha` |
| Meta description | `Compara estrategias para pagar deudas, estima intereses, fecha de liquidación y el impacto de hacer pagos extra.` |
| H1 | `Plan de pago de deudas` |
| Keyword principal | `plan de pago de deudas` |
| Keywords secundarias | `bola de nieve deudas`, `avalancha de deudas`, `pagar deudas rapido` |

### FAQs sugeridas

- ¿Qué es mejor, bola de nieve o avalancha?
- ¿Qué pasa si solo puedo pagar mínimos?
- ¿La calculadora incluye comisiones o moratorios?
- ¿Puedo usarla para tarjetas de crédito?

---

## Pruebas sugeridas

- Deuda a tasa `0%` se liquida con pagos directos a capital.
- Pago mínimo menor al interés mensual muestra advertencia.
- Avalancha ahorra más intereses que bola de nieve en caso típico.
- Bola de nieve liquida primero la deuda de menor saldo.
- Pago extra `0` no rompe la simulación.
- Exportación CSV conserva meses y saldos redondeados.

