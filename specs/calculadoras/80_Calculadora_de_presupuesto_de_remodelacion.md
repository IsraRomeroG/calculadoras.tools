# Especificación v1 - Calculadora de presupuesto de remodelación

## Descripción general

Herramienta para crear un presupuesto preliminar de remodelación mediante
partidas de materiales, mano de obra, permisos, imprevistos y otros costos. Los
precios se ingresan manualmente y el resultado no sustituye una cotización.

**Arquitectura:** todo el cálculo ocurre en el cliente. No requiere backend,
base de datos ni llamadas a APIs externas.

---

## Objetivo de producto

- Sumar partidas de remodelación.
- Separar materiales, mano de obra y otros costos.
- Añadir contingencia e impuestos editables.
- Comparar presupuesto disponible contra costo estimado.
- Generar una página estática optimizada para SEO en Astro.

---

## Alcance recomendado

### MVP

- Presupuesto disponible opcional.
- Lista editable de partidas.
- Categoría, cantidad, unidad y costo unitario.
- Tipo: material, mano de obra u otro.
- Contingencia e impuestos editables.
- Resultado: subtotal, total y diferencia contra presupuesto.
- Copiar resumen, limpiar formulario y exportar CSV.

### Fase 2

- Plantillas de cocina, baño, pintura y piso.
- Fases del proyecto.
- Comparador de escenarios.
- Guardar presupuesto en `localStorage`.
- Vista imprimible.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL pública recomendada | `/construccion/calculadora-presupuesto-remodelacion` |
| Archivo Astro recomendado | `src/pages/construccion/calculadora-presupuesto-remodelacion.astro` |
| Lógica de cálculo | `src/lib/calculators/construccion/calculadora-presupuesto-remodelacion/remodelBudget.ts` |
| Pruebas unitarias | `src/lib/calculators/construccion/calculadora-presupuesto-remodelacion/remodelBudget.test.ts` |
| Categoría | `construccion` |
| Locale base | `es-MX` |
| Moneda base | `MXN`, símbolo `$` |

---

## Comportamiento mobile-first

- Cada partida debe editarse como bloque compacto.
- Total estimado y diferencia contra presupuesto visibles arriba.
- Botones claros para agregar, duplicar y eliminar partida.
- Desglose por categoría como sección secundaria.
- No presentar precios sugeridos oficiales en MVP.

---

## Flujo principal MVP

**Ejemplo:** Presupuesto de `$250,000`, varias partidas y contingencia de `15%`.
¿Alcanza el presupuesto?

### Inputs del MVP

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Presupuesto disponible | Texto numérico opcional | `>= 0` | vacío |
| Nombre de partida | Texto | 1-80 caracteres | `Partida 1` |
| Categoría | Selector/texto | material, mano de obra, permisos, otro | `Material` |
| Cantidad | Texto numérico | `> 0` | `1` |
| Unidad | Texto | 1-20 caracteres | `pieza` |
| Costo unitario | Texto numérico | `>= 0` | vacío |
| Contingencia (%) | Texto numérico | `0%-100%` | `15` |
| Impuestos (%) | Texto numérico | `0%-100%` | `0` |

### Outputs principales

- Subtotal de materiales.
- Subtotal de mano de obra.
- Subtotal de otros.
- Contingencia.
- Impuestos.
- Total estimado.
- Diferencia contra presupuesto.

---

## Fórmulas

Partidas:

```text
subtotal_partida = cantidad * costo_unitario
subtotal_base = suma(subtotal_partida)
```

Contingencia e impuestos:

```text
contingencia_monto = subtotal_base * (contingencia / 100)
subtotal_con_contingencia = subtotal_base + contingencia_monto
impuestos_monto = subtotal_con_contingencia * (impuestos / 100)
total = subtotal_con_contingencia + impuestos_monto
```

Diferencia:

```text
diferencia = presupuesto_disponible - total
diferencia >= 0 => dentro de presupuesto
diferencia < 0 => excedente estimado
```

---

## Validaciones y estados

- Debe existir al menos una partida válida.
- Cantidad debe ser mayor que cero.
- Costos no pueden ser negativos.
- Presupuesto vacío oculta comparación.
- Permitir partidas con costo cero.
- Mostrar aviso de que precios y alcances pueden cambiar.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de presupuesto de remodelación` |
| Meta description | `Crea un presupuesto preliminar de remodelación con materiales, mano de obra, contingencia e impuestos editables.` |
| H1 | `Calculadora de presupuesto de remodelación` |
| Keyword principal | `calculadora presupuesto remodelacion` |
| Keywords secundarias | `costo remodelacion`, `presupuesto de obra`, `materiales mano de obra` |

### FAQs sugeridas

- ¿Qué incluye un presupuesto de remodelación?
- ¿Cuánta contingencia conviene agregar?
- ¿La calculadora usa precios actuales?
- ¿Puedo separar materiales y mano de obra?

---

## Pruebas sugeridas

- Cantidad por costo unitario calcula subtotal.
- Contingencia se aplica al subtotal base.
- Impuestos se aplican después de contingencia.
- Diferencia positiva indica presupuesto disponible.
- Presupuesto vacío oculta comparación.

