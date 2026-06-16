# Especificación v1 - Calculadora de tiempo estimado de lectura

## Descripción general

Herramienta para estimar cuánto tiempo toma leer un texto según número de
palabras y velocidad de lectura. Debe servir para artículos, ensayos, guiones,
posts, documentación y materiales educativos.

Además del cálculo puntual, debe ayudar a planear la lectura: mostrar un rango
según ritmos comunes, indicar una hora aproximada de finalización si se empieza
ahora y generar un resumen fácil de copiar.

**Arquitectura:** todo el cálculo ocurre en el cliente. No requiere backend,
base de datos ni llamadas a APIs externas.

---

## Objetivo de producto

- Calcular tiempo de lectura a partir de texto pegado o número de palabras.
- Diferenciar claramente el modo "pegar texto" del modo "ingresar palabras".
- Permitir ajustar palabras por minuto.
- Mostrar minutos, segundos, rango lento/promedio/rápido y hora aproximada de
  finalización.
- Contar palabras sin enviar contenido a servidores.
- Mostrar métricas útiles del texto: palabras, caracteres, frases aproximadas y
  densidad básica de lectura.
- Mantener una experiencia mobile-first donde el resultado sea visible sin
  obligar al usuario a desplazarse demasiado.
- Generar una página estática optimizada para SEO en Astro.

---

## Alcance recomendado

### MVP

- Selector de modo de entrada: pegar texto o ingresar número de palabras.
- Campo para pegar texto.
- Campo alternativo para número de palabras.
- Velocidad de lectura en palabras por minuto.
- Resultado destacado: tiempo estimado, rango de lectura y hora aproximada de
  finalización si se empieza ahora.
- Métricas: palabras, caracteres con/sin espacios, frases aproximadas y
  promedio de palabras por frase.
- Presets: lento, promedio, rápido y personalizado.
- Copiar resumen y limpiar formulario.
- Aviso de privacidad visible: el texto se procesa localmente y no se guarda.
- Opción para recordar solo la velocidad preferida, nunca el texto pegado.

### Fase 2

- Tiempo de lectura en voz alta.
- Tiempo de presentación.
- Estimación por idioma.
- Historial local desactivado por defecto por privacidad.
- Comparación por tipo de contenido: artículo, ensayo, guion o documentación.
- Exportar resumen en formatos breves para CMS o notas editoriales.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL inmediata recomendada | `/fecha-tiempo/calculadora-tiempo-de-lectura` |
| URL futura si existe Productividad | `/productividad/calculadora-tiempo-de-lectura` |
| Archivo Astro recomendado | `src/pages/fecha-tiempo/calculadora-tiempo-de-lectura.astro` |
| Lógica de cálculo | `src/lib/calculators/fecha-tiempo/calculadora-tiempo-de-lectura/readingTime.ts` |
| Pruebas unitarias | `src/lib/calculators/fecha-tiempo/calculadora-tiempo-de-lectura/readingTime.test.ts` |
| Categoría inmediata | `fecha-tiempo` |
| Categoría futura opcional | `productividad` |
| Locale base | `es-MX` |

---

## Comportamiento mobile-first

- Primer viewport recomendado:
  1. Resultado compacto.
  2. Selector de modo de entrada.
  3. Presets de velocidad.
  4. Entrada principal.
- Textarea amplio, pero no dominante: altura inicial sugerida de `160-220px` en
  móvil, con scroll interno para textos largos.
- Resultado visible encima del textarea o justo debajo del selector de modo.
- Presets de velocidad como control segmentado estable: `Lento`, `Promedio`,
  `Rápido`, `Personalizado`.
- Las acciones principales deben ser compactas: copiar resumen y limpiar.
- Aclarar que el texto se procesa localmente.
- No guardar texto pegado en `localStorage`, `sessionStorage` ni cookies.
- Si se permite recordar una preferencia, guardar únicamente la velocidad de
  lectura y solo después de una acción explícita del usuario.

---

## Flujo principal MVP

**Ejemplo:** Pego un artículo de `1,200` palabras y uso `220` palabras por
minuto. ¿Cuánto tardaré en leerlo y a qué hora terminaría si empiezo ahora?

Flujo esperado:

1. El usuario elige `Pegar texto` o `Ingresar palabras`.
2. La calculadora muestra un resultado vacío hasta que haya texto o número de
   palabras válido.
3. Al ingresar contenido, el resultado principal se actualiza en vivo.
4. Si el usuario cambia el preset, se actualiza la velocidad y el resultado.
5. Si escribe una velocidad manual, el preset cambia a `Personalizado`.
6. El usuario puede copiar un resumen breve o limpiar la entrada.

### Inputs del MVP

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Modo de entrada | Control segmentado | `Texto`, `Palabras` | `Texto` |
| Texto | Textarea | hasta 100,000 caracteres | vacío |
| Número de palabras manual | Numérico | `0-100000`, enteros, acepta separadores como `1,200` o `1.200` | vacío |
| Velocidad de lectura | Numérico o slider/input combinado | `50-1000` ppm | `220` |
| Preset | Control segmentado | `Lento`, `Promedio`, `Rápido`, `Personalizado` | `Promedio` |
| Recordar velocidad | Checkbox/toggle | `Sí`/`No` | `No` |

Notas:

- En modo `Texto`, el número manual no debe competir con el conteo del textarea.
- En modo `Palabras`, el textarea puede ocultarse o quedar deshabilitado.
- Si por accesibilidad o fallback ambos campos quedan visibles, usar únicamente
  el modo seleccionado como fuente de palabras.
- No aceptar decimales en el número manual de palabras.

### Presets sugeridos

| Preset | Palabras por minuto |
|--------|---------------------|
| Lento | `150` |
| Promedio | `220` |
| Rápido | `300` |

### Outputs principales

- Tiempo estimado de lectura como métrica principal.
- Rango estimado entre lectura rápida y lenta.
- Hora aproximada de finalización si se empieza ahora.
- Total de palabras.
- Caracteres con y sin espacios.
- Frases aproximadas.
- Promedio de palabras por frase.
- Comparación entre presets.
- Resumen copiable.

Formato recomendado para el resumen copiable:

```text
Tiempo de lectura: 5 min 27 s · 1,200 palabras · 220 ppm
Rango estimado: 4 min a 8 min · Terminaría aprox. a las 14:36
```

---

## Fórmulas y algoritmo

Conteo de palabras:

```text
texto_normalizado = texto.trim()

si Intl.Segmenter está disponible:
  segmentos = segmentar texto_normalizado con granularity="word" y locale="es-MX"
  palabras = contar segmentos con isWordLike=true

si Intl.Segmenter no está disponible:
  palabras = contar coincidencias Unicode de letras/números con fallback regex
```

Fallback sugerido:

```text
matches = texto_normalizado.match(/[\p{L}\p{N}]+(?:['’´-][\p{L}\p{N}]+)*/gu)
palabras = matches ? matches.length : 0
```

Fuente de palabras:

```text
si modo = "Palabras":
  palabras = parsear número manual normalizado
si modo = "Texto":
  palabras = conteo del textarea
```

Parseo del número manual:

```text
valor_limpio = valor.replace(/[,\s.]/g, "")
palabras_manual = entero base 10
```

El número manual debe rechazar negativos, decimales y valores mayores a
`100000`.

Tiempo:

```text
minutos_decimales = palabras / palabras_por_minuto
segundos_totales = round(minutos_decimales * 60)
```

Formato de tiempo:

```text
si segundos_totales < 60:
  mostrar "X s"
si segundos_totales < 3600:
  mostrar "M min S s"
si segundos_totales >= 3600:
  mostrar "H h M min"
```

Rango estimado:

```text
segundos_rapido = round((palabras / 300) * 60)
segundos_lento = round((palabras / 150) * 60)
rango = formato(segundos_rapido) + " a " + formato(segundos_lento)
```

Hora aproximada de finalización:

```text
fecha_fin = ahora + segundos_totales
mostrar hora local con locale "es-MX"
```

La función debe aceptar una fecha base opcional para facilitar pruebas
deterministas.

Frases aproximadas:

```text
frases = contar separadores ".", "?", "!" con texto no vacío
si hay palabras pero no hay separadores:
  frases = 1
```

Promedio de palabras por frase:

```text
palabras_por_frase = frases > 0 ? palabras / frases : 0
```

---

## Validaciones y estados

- Si no hay texto ni número manual, mostrar estado vacío.
- Velocidad debe estar entre `50` y `1000`.
- Número manual no puede ser negativo, decimal ni mayor a `100000`.
- Si el modo activo es `Texto`, ignorar el número manual.
- Si el modo activo es `Palabras`, ignorar el textarea.
- Valores como `1,200` y `1.200` deben interpretarse como `1200`.
- Si el resultado es menor a un minuto, mostrar segundos en vez de `0 min`.
- Si el texto supera 100,000 caracteres, mostrar advertencia y permitir cálculo si el navegador responde bien.
- No guardar contenido pegado automáticamente.
- Si el usuario activa "recordar velocidad", guardar solo las palabras por
  minuto en almacenamiento local.
- Si no se puede copiar el resumen por permisos del navegador, mostrar un
  estado alternativo con el texto seleccionable.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de tiempo estimado de lectura` |
| Meta description | `Calcula cuánto tardas en leer un texto según palabras y velocidad de lectura. Estima rango, hora de finalización y métricas del texto sin enviarlo a servidores.` |
| H1 | `Calculadora de tiempo de lectura` |
| Keyword principal | `calculadora tiempo de lectura` |
| Keywords secundarias | `reading time calculator`, `palabras por minuto`, `cuanto tarda leer un texto`, `tiempo estimado de lectura`, `calcular palabras por minuto` |

### FAQs sugeridas

- ¿Cuántas palabras por minuto lee una persona?
- ¿El texto se guarda o se envía?
- ¿Puedo calcular tiempo de lectura en voz alta?
- ¿Cómo se cuentan las palabras?
- ¿Por qué mi tiempo cambia al elegir lectura lenta o rápida?
- ¿Cómo saber a qué hora terminaré de leer?

---

## Pruebas sugeridas

- `1200` palabras a `220 ppm` produce aproximadamente `5 min 27 s`.
- Texto con saltos de línea cuenta palabras correctamente.
- En modo `Palabras`, el número manual reemplaza conteo del textarea.
- En modo `Texto`, el textarea reemplaza el número manual.
- Número manual con `1,200` o `1.200` se interpreta como `1200`.
- Velocidad fuera de rango muestra error.
- Texto vacío muestra estado vacío.
- Texto con acentos, signos de apertura y saltos múltiples cuenta palabras de
  forma estable.
- Resultado menor a un minuto se muestra en segundos.
- Rango estimado para `1200` palabras muestra rápido antes que lento.
- Hora de finalización usa una fecha base inyectada en pruebas.
- La opción de recordar velocidad no guarda el texto pegado.

