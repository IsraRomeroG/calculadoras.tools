# Especificación v1.1 - Calculadora de gastos de escrituración

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
- Ayudar a responder cuánto dinero adicional se necesita para cerrar, separado del enganche.
- Identificar las partidas con mayor impacto para que el usuario pueda revisar o negociar.
- Generar una página estática optimizada para SEO en Astro.

---

## Alcance recomendado

### MVP

- Precio de propiedad.
- Enganche opcional.
- Modo de uso: comprador, vendedor o ambos.
- Lista editable de partidas.
- Tipo de partida: porcentaje o monto fijo.
- Responsable: comprador o vendedor.
- Chips de alta rápida para agregar partidas comunes.
- Margen de reserva opcional para calcular un escenario conservador.
- Resultado: costos por parte, total, efectivo requerido y efectivo adicional al enganche.
- Copiar resumen, limpiar formulario y exportar CSV.
- Aviso legal visible.

### Fase 2

- Presets editoriales por país/estado.
- Guardar plantillas en `localStorage`.
- Comparador de escenarios.
- Vista imprimible.
- Base de cálculo avanzada por partida: precio, enganche, monto financiado o valor personalizado.
- Reparto flexible de partidas: comprador, vendedor, dividido 50/50 o porcentaje configurable.

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

- El resultado principal debe aparecer antes del formulario completo y mantenerse fácil de consultar.
- En móvil, mostrar como métrica principal: `Necesitas $X para cerrar` o `Recibirías neto $X`, según el modo de uso.
- Mostrar también `Adicional al enganche: $X` cuando el modo sea comprador.
- Organizar el formulario en pasos cortos: operación, partidas y resumen.
- Cada partida debe editarse como tarjeta compacta, no como tabla.
- Añadir partidas con botones/chips claros y de un toque.
- Aviso visible: porcentajes editables y no oficiales.
- El desglose debe ser colapsable por responsable o categoría.
- La tabla de desglose completa puede existir como vista secundaria con `overflow-x-auto`.
- Los campos numéricos deben usar `inputmode="decimal"` y etiquetas visibles.
- Botones táctiles con altura mínima cómoda y estados deshabilitados claros.

---

## Flujo principal MVP

**Ejemplo:** Vivienda de `$3,000,000`, gastos porcentuales de `5%` y avalúo fijo
de `$8,000`. ¿Cuánto efectivo adicional se necesita?

### Inputs del MVP

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Modo de uso | Selector segmentado | `Comprador`, `Vendedor`, `Ambos` | `Comprador` |
| Precio de propiedad | Texto numérico | `> 0` | vacío |
| Enganche | Texto numérico opcional | `>= 0` | `0` |
| Margen de reserva | Selector/stepper porcentual | `0%` a `30%` | `0%` |
| Nombre de partida | Texto | 1-60 caracteres | `Impuesto / derecho` |
| Tipo | Selector | `Porcentaje`, `Monto fijo` | `Porcentaje` |
| Valor | Texto numérico | `>= 0` | vacío |
| Responsable | Selector | `Comprador`, `Vendedor` | `Comprador` |

### Partidas sugeridas como chips editables

- `+ Impuesto de adquisición`
- `+ Honorarios notariales`
- `+ Registro`
- `+ Avalúo`
- `+ Gestoría`
- `+ Comisión de venta`

Cada chip debe crear una partida editable con nombre precargado, tipo y valor
vacíos o conservadores. No debe insertar porcentajes oficiales como si fueran
universales.

### Outputs principales

- Gastos del comprador.
- Gastos del vendedor.
- Porcentaje efectivo total.
- Efectivo del comprador: enganche + gastos.
- Efectivo adicional al enganche.
- Margen de reserva incluido, si aplica.
- Neto estimado del vendedor.
- Partidas de mayor impacto ordenadas por monto.
- Resumen copiable en lenguaje natural.

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
gastos_totales = gastos_comprador + gastos_vendedor
margen_reserva = gastos_comprador * (porcentaje_margen / 100)
efectivo_adicional_al_enganche = gastos_comprador + margen_reserva
efectivo_comprador = enganche + efectivo_adicional_al_enganche
neto_vendedor = precio_propiedad - gastos_vendedor
porcentaje_efectivo = (gastos_totales / precio_propiedad) * 100
```

Si el modo de uso es `Comprador`, priorizar `efectivo_comprador` y
`efectivo_adicional_al_enganche`. Si es `Vendedor`, priorizar `neto_vendedor`.
Si es `Ambos`, mostrar ambos bloques con el mismo peso visual.

---

## Validaciones y estados

- Precio debe ser mayor que cero.
- Partidas no pueden ser negativas.
- Enganche no puede superar precio sin advertencia.
- Margen de reserva debe estar entre `0%` y `30%`.
- Mostrar advertencia no bloqueante si una partida porcentual supera `15%`.
- Permitir lista vacía y mostrar costos cero.
- No cargar tasas oficiales predeterminadas como universales.
- Mostrar aviso de consultar notaría/profesional local.
- Si el usuario elimina todas las partidas, mantener visible la opción de agregar
  partidas sugeridas.
- Si el modo es vendedor, ocultar o minimizar el enganche para evitar ruido.

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
- ¿Cuánto debo ahorrar además del enganche?
- ¿Qué gastos suelen revisar compradores y vendedores antes de firmar?

---

## Pruebas sugeridas

- Partida `5%` de `$3,000,000` produce `$150,000`.
- Monto fijo se suma sin porcentaje.
- Partidas se separan por responsable.
- Lista vacía produce costos cero.
- Precio cero muestra error.
- Margen de reserva de `10%` sobre gastos del comprador se suma al efectivo requerido.
- Modo comprador prioriza efectivo adicional al enganche.
- Modo vendedor prioriza neto estimado.
- Partidas se ordenan por impacto sin alterar el total.

