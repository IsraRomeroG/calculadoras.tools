# Especificación v1 - Calculadora de gastos de escrituración

## Descripción general

Herramienta para estimar gastos de escrituración y cierre de una compraventa
inmobiliaria mediante porcentajes y montos editables. No debe usar tasas
oficiales fijas ni presentar el resultado como cotización notarial.

**Arquitectura:** todo el cálculo ocurre en el cliente. No requiere backend,
base de datos ni llamadas a APIs externas.

---

## Objetivo de producto

- Estimar costos adicionales a la compra de una propiedad.
- Permitir partidas porcentuales y montos fijos.
- Mostrar total de cierre y efectivo necesario.
- Separar costos del comprador y vendedor.
- Generar una página estática optimizada para SEO en Astro.

---

## Alcance recomendado

### MVP

- Precio de propiedad.
- Enganche opcional.
- Lista editable de partidas.
- Tipo de partida: porcentaje o monto fijo.
- Responsable: comprador o vendedor.
- Resultado: costos por parte, total y efectivo requerido.
- Copiar resumen, limpiar formulario y exportar CSV.
- Aviso legal visible.

### Fase 2

- Presets editoriales por país/estado.
- Guardar plantillas en `localStorage`.
- Comparador de escenarios.
- Vista imprimible.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL pública recomendada | `/inmuebles/calculadora-gastos-escrituracion` |
| Archivo Astro recomendado | `src/pages/inmuebles/calculadora-gastos-escrituracion.astro` |
| Lógica de cálculo | `src/lib/calculators/inmuebles/calculadora-gastos-escrituracion/closingCosts.ts` |
| Pruebas unitarias | `src/lib/calculators/inmuebles/calculadora-gastos-escrituracion/closingCosts.test.ts` |
| Categoría | `inmuebles` |
| Locale base | `es-MX` |
| Moneda base | `MXN`, símbolo `$` |

---

## Comportamiento mobile-first

- Cada partida debe editarse como bloque compacto.
- Resultado total visible antes del desglose.
- Añadir/eliminar partidas con botones claros.
- Aviso visible: porcentajes editables y no oficiales.
- Tabla de desglose con `overflow-x-auto`.

---

## Flujo principal MVP

**Ejemplo:** Vivienda de `$3,000,000`, gastos porcentuales de `5%` y avalúo fijo
de `$8,000`. ¿Cuánto efectivo adicional se necesita?

### Inputs del MVP

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Precio de propiedad | Texto numérico | `> 0` | vacío |
| Enganche | Texto numérico opcional | `>= 0` | `0` |
| Nombre de partida | Texto | 1-60 caracteres | `Impuesto / derecho` |
| Tipo | Selector | `Porcentaje`, `Monto fijo` | `Porcentaje` |
| Valor | Texto numérico | `>= 0` | vacío |
| Responsable | Selector | `Comprador`, `Vendedor` | `Comprador` |

### Partidas sugeridas como ejemplos editables

- Impuesto de adquisición.
- Honorarios notariales.
- Registro.
- Avalúo.
- Gestoría.
- Comisión de venta.

### Outputs principales

- Gastos del comprador.
- Gastos del vendedor.
- Porcentaje efectivo total.
- Efectivo del comprador: enganche + gastos.
- Neto estimado del vendedor.

---

## Fórmulas

Monto por partida:

```text
si tipo = porcentaje:
  monto_partida = precio_propiedad * (valor / 100)
si tipo = fijo:
  monto_partida = valor
```

Totales:

```text
gastos_comprador = suma(partidas comprador)
gastos_vendedor = suma(partidas vendedor)
efectivo_comprador = enganche + gastos_comprador
neto_vendedor = precio_propiedad - gastos_vendedor
porcentaje_efectivo = (gastos_totales / precio_propiedad) * 100
```

---

## Validaciones y estados

- Precio debe ser mayor que cero.
- Partidas no pueden ser negativas.
- Enganche no puede superar precio sin advertencia.
- Permitir lista vacía y mostrar costos cero.
- No cargar tasas oficiales predeterminadas como universales.
- Mostrar aviso de consultar notaría/profesional local.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de gastos de escrituración` |
| Meta description | `Estima gastos de escrituración y cierre con porcentajes y montos editables para comprador y vendedor.` |
| H1 | `Calculadora de gastos de escrituración` |
| Keyword principal | `calculadora gastos escrituracion` |
| Keywords secundarias | `gastos notariales`, `costos compra vivienda`, `gastos cierre inmueble` |

### FAQs sugeridas

- ¿Qué incluyen los gastos de escrituración?
- ¿Los porcentajes son oficiales?
- ¿Quién paga cada gasto?
- ¿El enganche forma parte de los gastos?

---

## Pruebas sugeridas

- Partida `5%` de `$3,000,000` produce `$150,000`.
- Monto fijo se suma sin porcentaje.
- Partidas se separan por responsable.
- Lista vacía produce costos cero.
- Precio cero muestra error.

