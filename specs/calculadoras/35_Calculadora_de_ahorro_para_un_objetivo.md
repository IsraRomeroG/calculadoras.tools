# Especificación v1 - Calculadora de ahorro para un objetivo

## Descripción general

Herramienta para estimar cuánto ahorrar al mes para llegar a una meta o cuánto
tiempo tomará alcanzarla con una aportación fija. Debe funcionar para metas como
viajes, enganche, fondo de emergencia, estudios o compras importantes.

**Arquitectura:** todo el cálculo ocurre en el cliente. No requiere backend,
base de datos ni llamadas a APIs externas.

---

## Objetivo de producto

- Calcular aportación mensual necesaria para una meta y fecha objetivo.
- Calcular tiempo necesario si el usuario ya sabe cuánto puede ahorrar.
- Considerar ahorro inicial y rendimiento anual opcional.
- Mostrar progreso, brecha y fecha estimada.
- Generar una página estática optimizada para SEO en Astro.

---

## Alcance recomendado

### MVP

- Dos modos: `Cuánto ahorrar al mes` y `Cuándo llegaré a mi meta`.
- Meta de ahorro.
- Ahorro actual.
- Fecha objetivo o aportación mensual, según modo.
- Rendimiento anual opcional.
- Resultado principal con aportación o fecha.
- Tabla mensual resumida.
- Copiar resumen, limpiar formulario y exportar CSV.

### Fase 2

- Aportaciones quincenales o semanales.
- Aportaciones extraordinarias.
- Inflación opcional de la meta.
- Historial en `sessionStorage`.
- Comparador de escenarios.

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

## Comportamiento mobile-first

- Usar control segmentado para cambiar entre los dos modos.
- El resultado principal debe aparecer antes de la tabla.
- En móvil, la tabla mensual puede mostrar solo los primeros y últimos meses.
- Mostrar barra de progreso cuando `ahorro_actual > 0`.
- Evitar que el calendario o selector de fecha ocupe demasiado espacio.

---

## Flujo principal MVP

**Ejemplo:** Quiero ahorrar `$80,000`, ya tengo `$15,000` y necesito llegar en
`18 meses`. ¿Cuánto debo ahorrar cada mes?

### Inputs del modo cuánto ahorrar al mes

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Meta de ahorro | Texto numérico | `> 0` | vacío |
| Ahorro actual | Texto numérico | `>= 0` | `0` |
| Fecha objetivo | Mes/año | futura | vacío |
| Rendimiento anual opcional (%) | Texto numérico | `0%-50%` | `0` |

### Inputs del modo cuándo llegaré

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Meta de ahorro | Texto numérico | `> 0` | vacío |
| Ahorro actual | Texto numérico | `>= 0` | `0` |
| Aportación mensual | Texto numérico | `> 0` | vacío |
| Rendimiento anual opcional (%) | Texto numérico | `0%-50%` | `0` |

### Outputs principales

- Aportación mensual necesaria o meses para la meta.
- Fecha estimada de cumplimiento.
- Brecha actual.
- Rendimiento estimado.
- Total aportado.
- Tabla mensual de avance.

---

## Fórmulas y algoritmo

### Aportación mensual necesaria

```text
meta = monto_objetivo
P = ahorro_actual
r = tasa_anual / 12 / 100
n = meses_hasta_fecha
```

Si `r > 0`:

```text
aportacion = (meta - P * (1 + r)^n) * r / ((1 + r)^n - 1)
```

Si `r = 0`:

```text
aportacion = (meta - P) / n
```

### Tiempo necesario

Simular mes a mes:

```text
saldo = saldo * (1 + r) + aportacion_mensual
```

Detener cuando `saldo >= meta`.

---

## Validaciones y estados

- Si el ahorro actual ya supera la meta, mostrar meta cumplida.
- La fecha objetivo debe estar en el futuro.
- Si la aportación calculada es negativa, mostrar `0` y explicar que el ahorro actual/rendimiento ya cubre la meta.
- Limitar simulación a `1200` meses para evitar ciclos infinitos.
- No aceptar rendimiento negativo en MVP.
- Redondear aportación a 2 decimales.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de ahorro para un objetivo` |
| Meta description | `Calcula cuánto ahorrar al mes para una meta o cuánto tiempo tardarás en alcanzarla con tu aportación actual.` |
| H1 | `Calculadora de ahorro para un objetivo` |
| Keyword principal | `calculadora ahorro meta` |
| Keywords secundarias | `cuanto ahorrar al mes`, `ahorro para objetivo`, `meta de ahorro` |

### FAQs sugeridas

- ¿Cómo calculo cuánto ahorrar cada mes?
- ¿Qué pasa si ya tengo parte del dinero?
- ¿Debo incluir rendimiento?
- ¿La calculadora considera inflación?

---

## Pruebas sugeridas

- Meta `12000`, ahorro `0`, plazo `12 meses`, tasa `0%` produce aportación `1000`.
- Ahorro actual igual a meta muestra meta cumplida.
- Rendimiento anual reduce aportación requerida.
- Modo tiempo llega a meta en el mes esperado.
- Fecha pasada muestra error.

