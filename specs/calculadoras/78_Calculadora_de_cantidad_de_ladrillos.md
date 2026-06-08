# Especificación v1 - Calculadora de cantidad de ladrillos

## Descripción general

Herramienta para estimar cuántos ladrillos, bloques o piezas de mampostería se
necesitan para construir uno o varios muros, considerando juntas, aberturas y
desperdicio.

**Arquitectura:** todo el cálculo ocurre en el cliente. No requiere backend,
base de datos ni llamadas a APIs externas.

---

## Objetivo de producto

- Calcular área neta de muros.
- Restar puertas y ventanas.
- Estimar piezas según dimensiones y junta.
- Añadir porcentaje de desperdicio.
- Generar una página estática optimizada para SEO en Astro.

---

## Alcance recomendado

### MVP

- Lista de muros.
- Lista de aberturas.
- Dimensiones del ladrillo/bloque.
- Espesor de junta horizontal y vertical.
- Desperdicio editable.
- Resultado: piezas netas y piezas a comprar.
- Copiar resumen, limpiar formulario y exportar CSV.

### Fase 2

- Presets de piezas comunes.
- Estimación de mortero.
- Muros con doble hoja.
- Historial en `sessionStorage`.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL pública recomendada | `/construccion/calculadora-cantidad-ladrillos` |
| Archivo Astro recomendado | `src/pages/construccion/calculadora-cantidad-ladrillos.astro` |
| Lógica de cálculo | `src/lib/calculators/construccion/calculadora-cantidad-ladrillos/bricks.ts` |
| Pruebas unitarias | `src/lib/calculators/construccion/calculadora-cantidad-ladrillos/bricks.test.ts` |
| Categoría | `construccion` |
| Locale base | `es-MX` |

---

## Comportamiento mobile-first

- Muros y aberturas como bloques editables.
- Resultado principal como piezas a comprar.
- Unidades claras junto a cada dimensión.
- Presets futuros no deben impedir valores personalizados.
- Mostrar área neta antes del cálculo de piezas.

---

## Flujo principal MVP

**Ejemplo:** Muro de `5 m x 2.5 m`, con una puerta de `0.9 m x 2.1 m`, usando
ladrillos de `20 cm x 10 cm` y junta de `1 cm`.

### Inputs del MVP

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Ancho de muro | Texto numérico | `> 0` | vacío |
| Alto de muro | Texto numérico | `> 0` | vacío |
| Cantidad de muros | Texto numérico entero | `1-1000` | `1` |
| Ancho de abertura | Texto numérico opcional | `> 0` | vacío |
| Alto de abertura | Texto numérico opcional | `> 0` | vacío |
| Cantidad de aberturas | Texto numérico entero | `1-1000` | `1` |
| Largo visible de pieza | Texto numérico | `> 0` | vacío |
| Alto visible de pieza | Texto numérico | `> 0` | vacío |
| Junta horizontal | Texto numérico | `>= 0` | `1 cm` |
| Junta vertical | Texto numérico | `>= 0` | `1 cm` |
| Desperdicio (%) | Texto numérico | `0%-100%` | `10` |

### Outputs principales

- Área bruta de muros.
- Área de aberturas.
- Área neta.
- Piezas por m².
- Piezas netas.
- Piezas a comprar con desperdicio.

---

## Fórmulas

```text
area_muros = suma(ancho_muro * alto_muro * cantidad)
area_aberturas = suma(ancho_abertura * alto_abertura * cantidad)
area_neta = max(0, area_muros - area_aberturas)
```

Módulo de pieza incluyendo junta:

```text
modulo_ancho = largo_pieza + junta_vertical
modulo_alto = alto_pieza + junta_horizontal
area_modulo = modulo_ancho * modulo_alto
piezas_netas = ceil(area_neta / area_modulo)
piezas_compra = ceil(piezas_netas * (1 + desperdicio / 100))
```

---

## Validaciones y estados

- Área de aberturas no puede superar área de muros sin advertencia.
- Dimensiones de pieza deben ser mayores que cero.
- Juntas pueden ser cero.
- Cantidades deben ser enteros positivos.
- Desperdicio puede ser cero.
- Redondear piezas siempre hacia arriba.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de cantidad de ladrillos` |
| Meta description | `Estima cuántos ladrillos o bloques necesitas según área de muros, aberturas, juntas y desperdicio.` |
| H1 | `Calculadora de ladrillos` |
| Keyword principal | `calculadora cantidad ladrillos` |
| Keywords secundarias | `ladrillos por metro cuadrado`, `bloques para muro`, `calcular mamposteria` |

### FAQs sugeridas

- ¿Cómo calcular ladrillos por metro cuadrado?
- ¿Se restan puertas y ventanas?
- ¿Cómo influyen las juntas?
- ¿Cuánto desperdicio debo agregar?

---

## Pruebas sugeridas

- Área neta resta aberturas correctamente.
- Junta aumenta módulo y reduce piezas por m².
- Desperdicio redondea piezas hacia arriba.
- Aberturas mayores al muro muestran advertencia.
- Conversión de cm a m es correcta.

