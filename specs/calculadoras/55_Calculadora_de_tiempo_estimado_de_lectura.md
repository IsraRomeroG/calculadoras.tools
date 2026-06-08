# Especificación v1 - Calculadora de tiempo estimado de lectura

## Descripción general

Herramienta para estimar cuánto tiempo toma leer un texto según número de
palabras y velocidad de lectura. Debe servir para artículos, ensayos, guiones,
posts, documentación y materiales educativos.

**Arquitectura:** todo el cálculo ocurre en el cliente. No requiere backend,
base de datos ni llamadas a APIs externas.

---

## Objetivo de producto

- Calcular tiempo de lectura a partir de texto pegado o número de palabras.
- Permitir ajustar palabras por minuto.
- Mostrar minutos, segundos y estimación para lectura lenta/media/rápida.
- Contar palabras sin enviar contenido a servidores.
- Generar una página estática optimizada para SEO en Astro.

---

## Alcance recomendado

### MVP

- Campo para pegar texto.
- Campo alternativo para número de palabras.
- Velocidad de lectura en palabras por minuto.
- Resultado: tiempo estimado, palabras, caracteres y frases aproximadas.
- Presets: lento, promedio, rápido.
- Copiar resumen y limpiar formulario.

### Fase 2

- Tiempo de lectura en voz alta.
- Tiempo de presentación.
- Estimación por idioma.
- Historial local desactivado por defecto por privacidad.

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

- Textarea grande pero no dominante en el primer viewport.
- Resultado visible encima o justo debajo del textarea.
- Presets de velocidad como chips o control segmentado.
- Aclarar que el texto se procesa localmente.
- No guardar texto pegado en `localStorage`.

---

## Flujo principal MVP

**Ejemplo:** Pego un artículo de `1,200` palabras y uso `220` palabras por
minuto. ¿Cuánto tardaré en leerlo?

### Inputs del MVP

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Texto | Textarea | hasta 100,000 caracteres | vacío |
| Número de palabras manual | Texto numérico opcional | `0-100000` | vacío |
| Velocidad de lectura | Texto numérico | `50-1000` ppm | `220` |
| Preset | Selector | `Lento`, `Promedio`, `Rápido`, `Personalizado` | `Promedio` |

### Presets sugeridos

| Preset | Palabras por minuto |
|--------|---------------------|
| Lento | `150` |
| Promedio | `220` |
| Rápido | `300` |

### Outputs principales

- Tiempo estimado de lectura.
- Total de palabras.
- Caracteres con y sin espacios.
- Frases aproximadas.
- Comparación entre presets.

---

## Fórmulas y algoritmo

Conteo de palabras:

```text
texto_normalizado = texto.trim()
palabras = texto_normalizado ? texto_normalizado.split(/\s+/).length : 0
```

Si el número manual está presente, usarlo sobre el conteo del texto.

Tiempo:

```text
minutos_decimales = palabras / palabras_por_minuto
segundos_totales = round(minutos_decimales * 60)
```

Frases aproximadas:

```text
frases = contar separadores ".", "?", "!" con texto no vacío
```

---

## Validaciones y estados

- Si no hay texto ni número manual, mostrar estado vacío.
- Velocidad debe estar entre `50` y `1000`.
- Número manual no puede ser negativo.
- Si el texto supera 100,000 caracteres, mostrar advertencia y permitir cálculo si el navegador responde bien.
- No guardar contenido pegado automáticamente.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de tiempo estimado de lectura` |
| Meta description | `Calcula cuánto tardas en leer un texto según palabras y velocidad de lectura. Procesamiento local y presets de lectura.` |
| H1 | `Calculadora de tiempo de lectura` |
| Keyword principal | `calculadora tiempo de lectura` |
| Keywords secundarias | `reading time calculator`, `palabras por minuto`, `cuanto tarda leer un texto` |

### FAQs sugeridas

- ¿Cuántas palabras por minuto lee una persona?
- ¿El texto se guarda o se envía?
- ¿Puedo calcular tiempo de lectura en voz alta?
- ¿Cómo se cuentan las palabras?

---

## Pruebas sugeridas

- `1200` palabras a `220 ppm` produce aproximadamente `5 min 27 s`.
- Texto con saltos de línea cuenta palabras correctamente.
- Número manual reemplaza conteo del textarea.
- Velocidad fuera de rango muestra error.
- Texto vacío muestra estado vacío.

