# Especificacion v2 - Paleta HEX / RGB / HSL

## Descripcion general

Herramienta para convertir colores entre HEX, RGB y HSL, generar una escala de
color util para CSS y revisar contraste WCAG entre color de texto y fondo. Debe
servir a programadores y personas que construyen interfaces web: copiar valores
CSS, crear variables reutilizables, validar accesibilidad y compartir una paleta
sin depender de backend.

**Arquitectura:** todo el calculo ocurre en el cliente. No requiere backend,
base de datos ni llamadas a APIs externas.

---

## Objetivo de producto

- Convertir colores entre HEX, RGB y HSL.
- Aceptar formatos CSS comunes y normalizarlos.
- Generar tintes, tonos y sombras como escala practica de diseno.
- Calcular contraste WCAG entre dos colores.
- Recomendar automaticamente color de texto legible cuando aplique.
- Exportar valores listos para CSS, incluyendo variables.
- Permitir compartir una paleta mediante parametros de URL.
- Generar una pagina estatica optimizada para SEO en Astro.

---

## Alcance recomendado

### MVP

- Input principal de color con soporte para:
  - `#RGB`, `RGB`, `#RRGGBB`, `RRGGBB`.
  - `rgb(14, 165, 233)`.
  - `rgb(14 165 233)`.
  - `hsl(199, 89%, 48%)`.
  - `hsl(199 89% 48%)`.
- Campos HEX, RGB y HSL editables.
- Vista previa del color visible en el primer viewport.
- Vista previa real de UI: texto sobre fondo, boton, borde y estado de ejemplo.
- Escala de color tipo sistema de diseno con pasos `50`, `100`, `200`, `300`,
  `400`, `500`, `600`, `700`, `800` y `900`.
- Tintes y sombras derivados del color base.
- Selector de color de texto y fondo para contraste.
- Ratio de contraste WCAG con nivel: falla, AA grande, AA normal, AAA.
- Recomendacion automatica entre `#000000` y `#FFFFFF` para texto legible.
- Aviso cuando ninguno de los dos colores sugeridos alcance AA normal.
- Copiar valores CSS por formato:
  - HEX.
  - RGB clasico: `rgb(14, 165, 233)`.
  - RGB moderno: `rgb(14 165 233)`.
  - HSL clasico: `hsl(199, 89%, 48%)`.
  - HSL moderno: `hsl(199 89% 48%)`.
- Exportar CSS variables de la escala generada.
- Ejemplos rapidos: azul UI, verde exito, rojo error, gris neutral.
- Compartir mediante parametros de URL, por ejemplo:
  `/programacion/paleta-hex-rgb-hsl?color=0EA5E9`.
- Limpiar formulario.

### Fase 2

- Paletas complementarias, analogas y triadicas.
- Guardar paletas recientes en `localStorage`.
- Selector visual de color si el navegador lo soporta.
- Soporte de canal alfa con `#RRGGBBAA`, `rgb(... / alpha)` y
  `hsl(... / alpha)`.
- Exportar JSON y Tailwind-like config.
- Generar variantes hover, active y disabled.
- Comparar dos escalas de color.
- Soporte opcional de OKLCH si el proyecto decide incorporar conversiones de
  color perceptual.

---

## Ruta, categoria y archivos

| Elemento | Valor |
|----------|-------|
| URL publica canonica | `/programacion/paleta-hex-rgb-hsl` |
| Archivo Astro | `src/pages/programacion/paleta-hex-rgb-hsl.astro` |
| Logica de calculo | `src/lib/calculators/programacion/paleta-hex-rgb-hsl/colorPalette.ts` |
| Pruebas unitarias | `src/lib/calculators/programacion/paleta-hex-rgb-hsl/colorPalette.test.ts` |
| Categoria | `programacion` |
| Locale base | `es-MX` |

La calculadora debe publicarse directamente en la categoria `programacion`.
No debe crearse una pagina duplicada bajo `/conversores/`.

Si por error ya existiera o llegara a publicarse
`/conversores/paleta-hex-rgb-hsl`, se debe eliminar la pagina duplicada y
agregar un redirect 301 en Apache hacia la URL canonica:

```apache
RewriteRule ^conversores/paleta-hex-rgb-hsl/?$ /programacion/paleta-hex-rgb-hsl [R=301,L]
```

### Categoria Programacion

La categoria `programacion` ya existe en el proyecto y debe usarse desde el
lanzamiento. Para publicar la calculadora se debe:

1. Registrar la calculadora con `categorySlug: "programacion"`.
2. Usar la etiqueta visible `Programación`.
3. Usar la URL canonica `/programacion/paleta-hex-rgb-hsl`.
4. Confirmar que la pagina dinamica de categoria `/programacion` lista la
   calculadora.
5. Mantener breadcrumbs, canonical, enlaces internos y metadatos apuntando a la
   ruta canonica.

---

## Experiencia mobile first

### Orden de la interfaz

1. Input principal de color.
2. Vista previa grande del color.
3. Acciones rapidas para copiar HEX, RGB, HSL y CSS variable.
4. Campos editables HEX, RGB y HSL.
5. Preview real de UI con texto, fondo, boton y borde.
6. Contraste WCAG y recomendacion de color de texto.
7. Escala generada `50-900` con swatches tactiles.
8. Exportacion de CSS variables.
9. Ejemplos rapidos.
10. FAQs y contenido educativo.

### Reglas de diseno

- Usar una sola columna como composicion base en movil.
- La vista previa del color debe ser visible en el primer viewport.
- Los inputs HEX/RGB/HSL deben estar apilados en movil y compactarse en desktop.
- Cada accion de copiar debe ser un boton tactil claro.
- Los swatches deben tener dimensiones estables para evitar saltos de layout.
- No usar texto dentro de swatches si puede no contrastar.
- Los resultados de contraste deben usar texto explicito y no depender solo del
  color.
- La escala de color debe ser facil de copiar en movil: tocar un swatch copia su
  HEX y los botones secundarios copian RGB/HSL cuando sea necesario.
- El area de exportacion CSS debe usar una caja de codigo con boton de copiar.

---

## Flujo principal MVP

**Ejemplo:** ingreso `#0EA5E9`. Quiero ver RGB, HSL, contraste recomendado y
una escala CSS lista para pegar.

1. El usuario escribe `#0EA5E9`.
2. La herramienta normaliza a `#0EA5E9`.
3. Muestra `rgb(14, 165, 233)` y `hsl(199, 89%, 48%)`.
4. Genera la escala `--color-primary-50` a `--color-primary-900`.
5. Calcula si `#000000` o `#FFFFFF` funciona mejor como texto.
6. Muestra preview real de UI con el color base.
7. Permite copiar un valor individual o todas las CSS variables.
8. Actualiza la URL a `?color=0EA5E9` para poder compartir el resultado.

---

## Inputs del MVP

| Campo | Tipo | Rango valido | Valor por defecto |
|-------|------|--------------|-------------------|
| Color principal | Texto | HEX, RGB o HSL valido | `#0EA5E9` |
| HEX | Texto | `#RGB` o `#RRGGBB` | calculado |
| R | Texto numerico | `0-255` | calculado |
| G | Texto numerico | `0-255` | calculado |
| B | Texto numerico | `0-255` | calculado |
| H | Texto numerico | `0-360` | calculado |
| S | Texto numerico | `0-100` | calculado |
| L | Texto numerico | `0-100` | calculado |
| Color de fondo | HEX | color valido | color base |
| Color de texto | HEX | color valido | recomendado |
| Nombre de variable | Texto | slug CSS simple | `primary` |

---

## Outputs principales

- HEX normalizado.
- RGB clasico y moderno.
- HSL clasico y moderno.
- Vista previa de color.
- Preview real de UI.
- Escala `50-900`.
- Tintes y sombras.
- CSS variables listas para copiar.
- Ratio de contraste.
- Nivel WCAG: falla, AA grande, AA normal o AAA.
- Recomendacion de color de texto.
- URL compartible.

---

## Formatos CSS de salida

Para el color base `#0EA5E9` y variable `primary`, la herramienta debe poder
generar:

```css
:root {
  --color-primary: #0EA5E9;
  --color-primary-rgb: 14 165 233;
  --color-primary-hsl: 199 89% 48%;
  --color-primary-50: #F0F9FF;
  --color-primary-100: #E0F2FE;
  --color-primary-200: #BAE6FD;
  --color-primary-300: #7DD3FC;
  --color-primary-400: #38BDF8;
  --color-primary-500: #0EA5E9;
  --color-primary-600: #0284C7;
  --color-primary-700: #0369A1;
  --color-primary-800: #075985;
  --color-primary-900: #0C4A6E;
}

.button-primary {
  background: var(--color-primary);
  color: #000000;
}
```

Los valores de escala anteriores son ejemplo de salida esperada para un azul de
referencia; el algoritmo final puede generar resultados cercanos siempre que sea
estable, probado y documentado.

---

## Formulas y algoritmo

### Normalizacion HEX

- Eliminar espacios al inicio y final.
- Aceptar `#RGB`, `RGB`, `#RRGGBB` y `RRGGBB`.
- Expandir `#RGB` a `#RRGGBB`.
- Convertir letras a mayusculas.
- Rechazar longitudes distintas a 3 o 6 para MVP.

### HEX a RGB

```text
r = parseInt(hex.slice(0, 2), 16)
g = parseInt(hex.slice(2, 4), 16)
b = parseInt(hex.slice(4, 6), 16)
```

### RGB a HEX

```text
hex = "#" + toHex(r) + toHex(g) + toHex(b)
```

`toHex` debe rellenar con cero a la izquierda y devolver dos caracteres.

### RGB a HSL

```text
r1 = r / 255
g1 = g / 255
b1 = b / 255
max = max(r1, g1, b1)
min = min(r1, g1, b1)
l = (max + min) / 2
```

Calcular `h` y `s` con el algoritmo estandar segun canal maximo:

- Si `max == min`, `h = 0` y `s = 0`.
- Si `l > 0.5`, `s = d / (2 - max - min)`.
- Si `l <= 0.5`, `s = d / (max + min)`.
- Normalizar `h` a `0-360`.
- Redondear HSL de forma estable para evitar saltos visuales.

### HSL a RGB

Debe implementarse el algoritmo estandar `hue2rgb` y redondear canales RGB a
enteros `0-255`.

### Escala de color

La escala debe generar pasos `50-900` a partir del color base:

- `500` representa el color base normalizado.
- `50-400` son mezclas progresivas hacia blanco.
- `600-900` son mezclas progresivas hacia negro.
- Las mezclas deben operar en RGB lineal o en HSL de forma consistente y
  documentada.
- El algoritmo debe ser determinista: el mismo input siempre produce la misma
  escala.
- Evitar valores fuera de rango mediante clamp.

Una implementacion sencilla aceptable para MVP:

```text
tint(color, amount) = mix(color, white, amount)
shade(color, amount) = mix(color, black, amount)
```

Con cantidades sugeridas:

| Paso | Operacion sugerida |
|------|--------------------|
| 50 | tint 0.92 |
| 100 | tint 0.84 |
| 200 | tint 0.68 |
| 300 | tint 0.52 |
| 400 | tint 0.28 |
| 500 | base |
| 600 | shade 0.12 |
| 700 | shade 0.28 |
| 800 | shade 0.44 |
| 900 | shade 0.60 |

### Contraste WCAG

```text
luminancia_relativa = calcular segun sRGB linealizado
contraste = (L1 + 0.05) / (L2 + 0.05)
```

Donde `L1` es la luminancia mayor y `L2` la menor.

Criterios:

- Falla: `< 3`.
- AA grande: `>= 3`.
- AA normal: `>= 4.5`.
- AAA: `>= 7`.

La recomendacion automatica debe comparar el contraste de `#000000` y
`#FFFFFF` contra el fondo seleccionado y elegir el mayor. Si el mayor es menor
que `4.5`, mostrar una advertencia clara.

---

## Validaciones y estados

- HEX debe aceptar `#RGB`, `RGB`, `#RRGGBB` y `RRGGBB`.
- RGB debe estar entre `0` y `255`.
- HSL debe respetar rangos:
  - `H`: `0-360`.
  - `S`: `0-100`.
  - `L`: `0-100`.
- Los formatos `rgb()` y `hsl()` deben aceptar sintaxis clasica con comas y
  sintaxis moderna con espacios.
- Si el usuario edita un formato, actualizar los demas.
- Evitar bucles infinitos de actualizacion entre inputs con una fuente activa de
  edicion.
- Mostrar errores cerca del campo editado.
- Mantener el ultimo color valido mientras el usuario escribe un valor temporal
  incompleto.
- No actualizar la URL compartible cuando el color sea invalido.
- Los botones de copiar deben confirmar exito con un estado breve y accesible.

---

## Parametros de URL

La calculadora debe leer y escribir al menos:

| Parametro | Ejemplo | Uso |
|-----------|---------|-----|
| `color` | `0EA5E9` | Color base |
| `name` | `primary` | Nombre de variable CSS |
| `text` | `000000` | Color de texto opcional |
| `bg` | `0EA5E9` | Color de fondo opcional |

Reglas:

- Aceptar parametros con o sin `#`.
- Normalizar antes de usar.
- Ignorar parametros invalidos sin romper la pagina.
- Usar `history.replaceState` para evitar llenar el historial mientras se edita.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Paleta HEX, RGB y HSL para CSS` |
| Meta description | `Convierte colores entre HEX, RGB y HSL, genera variables CSS, crea una escala de color y revisa contraste WCAG para interfaces web.` |
| H1 | `Paleta HEX, RGB y HSL` |
| Keyword principal | `hex rgb hsl` |
| Keywords secundarias | `conversor hex rgb`, `paleta de colores css`, `contraste wcag`, `variables css color` |
| Canonical | `/programacion/paleta-hex-rgb-hsl` |

### FAQs sugeridas

- ¿Que diferencia hay entre HEX, RGB y HSL?
- ¿Como convierto HEX a RGB?
- ¿Como genero variables CSS desde un color?
- ¿Que es una escala de color 50-900?
- ¿Que es el contraste WCAG?
- ¿Que color de texto conviene sobre un fondo?
- ¿Puedo compartir una paleta por URL?

---

## Pruebas sugeridas

### Conversiones

- `#FFFFFF` produce RGB `255,255,255`.
- `#000000` produce HSL `0,0,0`.
- `#0EA5E9` normaliza correctamente.
- HEX corto `#FFF` se expande a `#FFFFFF`.
- HEX sin `#`, como `0EA5E9`, se normaliza a `#0EA5E9`.
- RGB `14,165,233` produce `#0EA5E9`.
- HSL `199,89,48` produce un HEX equivalente o documentadamente redondeado.
- Round-trip HEX -> RGB -> HSL -> RGB -> HEX mantiene el color dentro del margen
  de redondeo definido.

### Formatos CSS

- `rgb(14, 165, 233)` se parsea correctamente.
- `rgb(14 165 233)` se parsea correctamente.
- `hsl(199, 89%, 48%)` se parsea correctamente.
- `hsl(199 89% 48%)` se parsea correctamente.
- Entradas con espacios extra se normalizan.

### Validaciones

- RGB menor a `0` o mayor a `255` devuelve error.
- HSL con saturacion o luminosidad fuera de `0-100` devuelve error.
- HEX con longitud invalida devuelve error.
- Texto temporal incompleto no borra el ultimo color valido.
- Editar un campo no genera bucles de actualizacion.

### Contraste

- Contraste blanco/negro produce `21`.
- Un ratio `>= 4.5` clasifica como AA normal.
- Un ratio `>= 3` y `< 4.5` clasifica como AA grande.
- Un ratio `>= 7` clasifica como AAA.
- La recomendacion automatica elige el mejor entre blanco y negro.
- Si ni blanco ni negro alcanzan AA normal, se muestra advertencia.

### Escala y exportacion

- La escala genera exactamente los pasos `50-900`.
- El paso `500` coincide con el color base.
- Todos los colores generados son HEX validos.
- El export CSS incluye `--color-primary`, `--color-primary-rgb`,
  `--color-primary-hsl` y los pasos `--color-primary-50` a
  `--color-primary-900`.
- Cambiar el nombre de variable actualiza todas las variables exportadas.

### URL compartible

- `?color=0EA5E9` inicializa la calculadora con `#0EA5E9`.
- Parametros invalidos se ignoran sin romper la experiencia.
- Cambiar el color actualiza la URL con `history.replaceState`.
