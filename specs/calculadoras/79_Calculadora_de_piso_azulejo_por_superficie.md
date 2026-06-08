# Especificación v1 - Calculadora de piso / azulejo por superficie

## Descripción general

Herramienta para estimar cuántas piezas y cajas de piso, azulejo o loseta se
necesitan para cubrir una superficie, considerando aberturas, desperdicio y
rendimiento por caja.

**Arquitectura:** todo el cálculo ocurre en el cliente. No requiere backend,
base de datos ni llamadas a APIs externas.

---

## Objetivo de producto

- Calcular superficie neta a cubrir.
- Estimar piezas necesarias según tamaño.
- Estimar cajas usando piezas o m² por caja.
- Añadir desperdicio editable.
- Generar una página estática optimizada para SEO en Astro.

---

## Alcance recomendado

### MVP

- Lista de superficies rectangulares.
- Lista de áreas a descontar.
- Dimensiones de pieza.
- Desperdicio.
- Cobertura por caja o piezas por caja.
- Resultado: área, piezas y cajas.
- Copiar resumen, limpiar formulario y exportar CSV.

### Fase 2

- Patrones diagonal/espiga con desperdicio sugerido.
- Costo por caja y presupuesto.
- Rodapié/zoclo.
- Historial en `sessionStorage`.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL pública recomendada | `/construccion/calculadora-piso-azulejo-superficie` |
| Archivo Astro recomendado | `src/pages/construccion/calculadora-piso-azulejo-superficie.astro` |
| Lógica de cálculo | `src/lib/calculators/construccion/calculadora-piso-azulejo-superficie/tiles.ts` |
| Pruebas unitarias | `src/lib/calculators/construccion/calculadora-piso-azulejo-superficie/tiles.test.ts` |
| Categoría | `construccion` |
| Locale base | `es-MX` |

---

## Comportamiento mobile-first

- Resultado principal como cajas a comprar.
- Superficies y descuentos como bloques editables.
- Unidades visibles y consistentes.
- Mostrar piezas y área como desglose secundario.
- No asumir cobertura de caja; permitir ambos modos.

---

## Flujo principal MVP

**Ejemplo:** Habitación de `4 m x 5 m`, piezas de `60 cm x 60 cm`, `10%` de
desperdicio y `4 piezas` por caja.

### Inputs del MVP

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Largo de superficie | Texto numérico | `> 0` | vacío |
| Ancho de superficie | Texto numérico | `> 0` | vacío |
| Cantidad | Texto numérico entero | `1-1000` | `1` |
| Área a descontar | Dimensiones opcionales | `>= 0` | vacío |
| Largo de pieza | Texto numérico | `> 0` | vacío |
| Ancho de pieza | Texto numérico | `> 0` | vacío |
| Desperdicio (%) | Texto numérico | `0%-100%` | `10` |
| Modo de caja | Selector | `Piezas por caja`, `m² por caja` | `Piezas por caja` |
| Rendimiento de caja | Texto numérico | `> 0` | vacío |
| Precio por caja | Texto numérico opcional | `>= 0` | vacío |

### Outputs principales

- Área neta.
- Área con desperdicio.
- Piezas necesarias.
- Cajas necesarias.
- Sobrante estimado.
- Costo total opcional.

---

## Fórmulas

```text
area_bruta = suma(largo * ancho * cantidad)
area_descuentos = suma(largo_descuento * ancho_descuento * cantidad)
area_neta = max(0, area_bruta - area_descuentos)
area_compra = area_neta * (1 + desperdicio / 100)
area_pieza = largo_pieza * ancho_pieza
piezas = ceil(area_compra / area_pieza)
```

Cajas:

```text
si modo = piezas_por_caja:
  cajas = ceil(piezas / piezas_por_caja)
  piezas_compradas = cajas * piezas_por_caja
si modo = m2_por_caja:
  cajas = ceil(area_compra / m2_por_caja)
```

Costo:

```text
costo_total = cajas * precio_por_caja
```

---

## Validaciones y estados

- Dimensiones deben ser mayores que cero.
- Área descontada mayor al área bruta muestra advertencia.
- Rendimiento de caja debe ser mayor que cero.
- Piezas por caja debe ser entero positivo.
- Desperdicio puede ser cero.
- Redondear piezas y cajas hacia arriba.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de piso y azulejo por superficie` |
| Meta description | `Calcula cuántas piezas y cajas de piso o azulejo necesitas según superficie, tamaño y desperdicio.` |
| H1 | `Calculadora de piso y azulejo` |
| Keyword principal | `calculadora piso azulejo` |
| Keywords secundarias | `cuantas cajas de piso necesito`, `azulejos por metro cuadrado`, `calcular loseta` |

### FAQs sugeridas

- ¿Cuánto desperdicio agregar al piso?
- ¿Cómo calculo piezas por metro cuadrado?
- ¿Se pueden descontar áreas?
- ¿Cómo calcular cajas necesarias?

---

## Pruebas sugeridas

- `4 x 5 m` produce `20 m²`.
- Pieza `0.6 x 0.6 m` calcula área `0.36 m²`.
- Desperdicio incrementa área de compra.
- Cajas redondean hacia arriba.
- Precio por caja calcula costo total.

