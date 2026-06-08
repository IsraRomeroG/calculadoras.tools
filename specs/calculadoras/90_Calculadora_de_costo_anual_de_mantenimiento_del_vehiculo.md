# Especificación v1 - Calculadora de costo anual de mantenimiento del vehículo

## Descripción general

Herramienta para estimar el costo anual y mensual de mantener un vehículo a
partir de servicios, reparaciones, llantas, seguro, impuestos y otros gastos
ingresados manualmente.

**Arquitectura:** todo el cálculo ocurre en el cliente. No requiere backend,
base de datos ni llamadas a APIs externas.

---

## Objetivo de producto

- Sumar costos recurrentes y periódicos.
- Convertir gastos por kilometraje a costo anual.
- Mostrar costo mensual y por kilómetro.
- Separar mantenimiento, propiedad y uso.
- Generar una página estática optimizada para SEO en Astro.

---

## Alcance recomendado

### MVP

- Kilómetros recorridos al año.
- Lista editable de gastos.
- Frecuencia: mensual, anual, cada N meses, cada N km.
- Resultado: costo anual, mensual y por km.
- Desglose por categoría.
- Copiar resumen, limpiar formulario y exportar CSV.

### Fase 2

- Combustible integrado.
- Depreciación integrada.
- Comparador de vehículos.
- Guardado en `localStorage`.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL pública recomendada | `/vehiculos/calculadora-costo-anual-mantenimiento` |
| Archivo Astro recomendado | `src/pages/vehiculos/calculadora-costo-anual-mantenimiento.astro` |
| Lógica de cálculo | `src/lib/calculators/vehiculos/calculadora-costo-anual-mantenimiento/maintenanceCost.ts` |
| Pruebas unitarias | `src/lib/calculators/vehiculos/calculadora-costo-anual-mantenimiento/maintenanceCost.test.ts` |
| Categoría | `vehiculos` |
| Locale base | `es-MX` |
| Moneda base | `MXN`, símbolo `$` |

---

## Comportamiento mobile-first

- Resultado anual y mensual visibles arriba.
- Cada gasto como bloque editable.
- Frecuencia condicional según tipo seleccionado.
- Desglose por categoría secundario.
- No usar costos predeterminados como universales.

---

## Flujo principal MVP

**Ejemplo:** Vehículo que recorre `15,000 km/año`, con servicio de `$3,000` cada
`10,000 km`, seguro anual y otros gastos.

### Inputs del MVP

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Kilómetros anuales | Texto numérico | `>= 0` | vacío |
| Nombre del gasto | Texto | 1-80 caracteres | `Servicio` |
| Categoría | Selector | mantenimiento, seguro, impuestos, reparación, otro | mantenimiento |
| Costo por evento | Texto numérico | `>= 0` | vacío |
| Frecuencia | Selector | mensual, anual, cada N meses, cada N km | anual |
| Intervalo | Texto numérico | `> 0` | `1` |

### Outputs principales

- Costo anual estimado.
- Costo mensual promedio.
- Costo por kilómetro.
- Eventos estimados por año.
- Desglose por categoría.

---

## Fórmulas

Costo anual por frecuencia:

```text
mensual: costo_anual = costo * 12
anual: costo_anual = costo
cada_N_meses: eventos = 12 / N; costo_anual = costo * eventos
cada_N_km: eventos = km_anuales / N; costo_anual = costo * eventos
```

Para planificación práctica, mostrar también eventos redondeados hacia arriba:

```text
eventos_practicos = ceil(eventos)
costo_anual_practico = costo * eventos_practicos
```

Resumen:

```text
total_anual = suma(costos_anuales)
promedio_mensual = total_anual / 12
costo_por_km = km_anuales > 0 ? total_anual / km_anuales : null
```

---

## Validaciones y estados

- Costos no pueden ser negativos.
- Intervalo debe ser mayor que cero.
- Frecuencia por km requiere kilómetros anuales mayores que cero.
- Si km anuales es cero, ocultar costo por km.
- Mostrar costo teórico y práctico cuando el redondeo cambie el resultado.
- No incluir combustible o depreciación salvo que el usuario los agregue.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de costo anual de mantenimiento del vehículo` |
| Meta description | `Estima cuánto cuesta mantener un vehículo al año, al mes y por kilómetro con servicios y gastos editables.` |
| H1 | `Calculadora de mantenimiento del vehículo` |
| Keyword principal | `costo mantenimiento vehiculo` |
| Keywords secundarias | `mantenimiento auto anual`, `costo por kilometro mantenimiento`, `gastos de carro` |

---

## Pruebas sugeridas

- Gasto mensual multiplica por 12.
- Servicio cada `10000 km` con `15000 km/año` produce `1.5` eventos teóricos y `2` prácticos.
- Km cero oculta costo por km.
- Varias categorías se suman correctamente.
- Intervalo cero muestra error.

