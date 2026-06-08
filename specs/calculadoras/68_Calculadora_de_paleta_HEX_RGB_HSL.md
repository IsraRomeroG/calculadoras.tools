# Especificación v1 - Paleta HEX / RGB / HSL

## Descripción general

Herramienta para convertir colores entre HEX, RGB y HSL, generar variaciones
simples y revisar contraste básico entre color de texto y fondo. Debe servir para
diseño web, CSS, programación y elección rápida de paletas.

**Arquitectura:** todo el cálculo ocurre en el cliente. No requiere backend,
base de datos ni llamadas a APIs externas.

---

## Objetivo de producto

- Convertir color HEX a RGB y HSL.
- Convertir RGB/HSL a HEX.
- Generar tonos, tintes y sombras simples.
- Calcular contraste WCAG básico entre dos colores.
- Generar una página estática optimizada para SEO en Astro.

---

## Alcance recomendado

### MVP

- Input HEX principal.
- Campos RGB y HSL editables.
- Vista previa de color.
- Variaciones: tintes y sombras.
- Color de texto/fondo para contraste.
- Copiar valores CSS.
- Limpiar formulario.

### Fase 2

- Paletas complementarias, análogas y triádicas.
- Exportar CSS variables.
- Guardar paletas en `localStorage`.
- Selector visual de color si el navegador lo soporta.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL inmediata recomendada | `/conversores/paleta-hex-rgb-hsl` |
| URL futura si existe Programación | `/programacion/paleta-hex-rgb-hsl` |
| Archivo Astro recomendado | `src/pages/conversores/paleta-hex-rgb-hsl.astro` |
| Lógica de cálculo | `src/lib/calculators/conversores/paleta-hex-rgb-hsl/colorPalette.ts` |
| Pruebas unitarias | `src/lib/calculators/conversores/paleta-hex-rgb-hsl/colorPalette.test.ts` |
| Categoría inmediata | `conversores` |
| Categoría futura opcional | `programacion` |
| Locale base | `es-MX` |

---

## Comportamiento mobile-first

- Vista previa de color visible en el primer viewport.
- Inputs HEX/RGB/HSL apilados en móvil.
- Botones de copiar por formato.
- Swatches con dimensiones estables.
- No usar texto dentro de swatches si puede no contrastar.

---

## Flujo principal MVP

**Ejemplo:** Ingreso `#0EA5E9`. Quiero ver RGB, HSL y variaciones.

### Inputs del MVP

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| HEX | Texto | `#RGB` o `#RRGGBB` | `#0EA5E9` |
| R | Texto numérico | `0-255` | calculado |
| G | Texto numérico | `0-255` | calculado |
| B | Texto numérico | `0-255` | calculado |
| H | Texto numérico | `0-360` | calculado |
| S | Texto numérico | `0-100` | calculado |
| L | Texto numérico | `0-100` | calculado |
| Color de fondo/primer plano | HEX | color válido | opcional |

### Outputs principales

- HEX normalizado.
- RGB.
- HSL.
- Vista previa.
- Tintes y sombras.
- Ratio de contraste si hay dos colores.

---

## Fórmulas y algoritmo

HEX a RGB:

```text
r = parseInt(hex.slice(0, 2), 16)
g = parseInt(hex.slice(2, 4), 16)
b = parseInt(hex.slice(4, 6), 16)
```

RGB a HEX:

```text
hex = "#" + toHex(r) + toHex(g) + toHex(b)
```

RGB a HSL:

```text
r1 = r / 255
g1 = g / 255
b1 = b / 255
max = max(r1, g1, b1)
min = min(r1, g1, b1)
l = (max + min) / 2
```

Calcular `h` y `s` con el algoritmo estándar según canal máximo.

Contraste:

```text
luminancia_relativa = calcular según sRGB linealizado
contraste = (L1 + 0.05) / (L2 + 0.05)
```

---

## Validaciones y estados

- HEX debe aceptar `#RGB`, `RGB`, `#RRGGBB` y `RRGGBB`.
- RGB debe estar entre `0` y `255`.
- HSL debe respetar rangos.
- Si el usuario edita un formato, actualizar los demás.
- Evitar bucles infinitos de actualización entre inputs.
- Contraste debe mostrar nivel básico: falla, AA normal, AA grande, AAA.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Paleta HEX / RGB / HSL` |
| Meta description | `Convierte colores entre HEX, RGB y HSL, genera variaciones y revisa contraste básico para CSS y diseño web.` |
| H1 | `Paleta HEX, RGB y HSL` |
| Keyword principal | `hex rgb hsl` |
| Keywords secundarias | `conversor hex rgb`, `paleta de colores`, `contraste wcag` |

### FAQs sugeridas

- ¿Qué diferencia hay entre HEX, RGB y HSL?
- ¿Cómo convierto HEX a RGB?
- ¿Qué es el contraste WCAG?
- ¿Puedo copiar valores CSS?

---

## Pruebas sugeridas

- `#FFFFFF` produce RGB `255,255,255`.
- `#000000` produce HSL `0,0,0`.
- `#0EA5E9` normaliza correctamente.
- HEX corto `#FFF` se expande a `#FFFFFF`.
- Contraste blanco/negro produce `21`.

