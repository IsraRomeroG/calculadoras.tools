# Especificación v2 - Conversor de temperatura de horno

## Descripción general

Herramienta mobile-first para convertir temperaturas de horno entre Celsius,
Fahrenheit y marca de gas. Debe mostrar tanto la conversión exacta como el ajuste
práctico más cercano para hornos domésticos, además de un ajuste orientativo para
horno con ventilador/convección.

La tabla de temperaturas internas seguras del alimento se mantiene en una sección
editorial separada. La temperatura configurada en el horno y la temperatura
interna del alimento nunca deben confundirse.

**Arquitectura:** los cálculos ocurren en el cliente. Las tablas de marca de gas
y seguridad alimentaria se mantienen como datos locales versionados con fuente,
URL, fecha de última revisión de la fuente y fecha de revisión editorial.

---

## Objetivo de producto

- Convertir temperaturas de horno entre `°C`, `°F` y marca de gas.
- Mostrar conversión exacta y ajuste práctico de horno cuando difieran.
- Mostrar equivalencia aproximada de marca de gas con aviso claro.
- Ofrecer ajuste orientativo para horno con ventilador/convección.
- Consultar temperaturas internas mínimas seguras por alimento en una tabla
  separada.
- Reforzar el uso de termómetro de alimentos.
- Diferenciar esta herramienta del conversor general de temperatura con contexto
  específico de cocina y horno.
- Generar una página estática optimizada para SEO en Astro.

---

## Alcance recomendado

### MVP

- Conversión principal: `°C`, `°F` y marca de gas.
- Kelvin como escala avanzada, oculta por defecto o en un panel secundario.
- Conversión exacta, por ejemplo `180 °C = 356 °F`.
- Ajuste práctico de horno, por ejemplo `180 °C ≈ 350 °F / gas 4`.
- Ajuste orientativo para horno con ventilador/convección:
  - `°C`: restar `20 °C`.
  - `°F`: restar `25 °F`.
  - Mostrar siempre como sugerencia, no como regla universal.
- Tabla local explícita de marcas de gas aproximadas.
- Presets rápidos de horno: `160 °C`, `180 °C`, `200 °C`, `350 °F`, `375 °F`,
  `400 °F`, `gas 4`, `gas 6`.
- Tabla separada de temperaturas internas seguras con fuente oficial.
- Resultado principal, equivalencias frecuentes, copiar resultado y limpiar
  formulario.
- Entrada tolerante a formatos comunes: `180c`, `180 °C`, `350 f`, `gas 4`,
  `mark 6`, `4 gas`.

### Fase 2

- Historial en `sessionStorage`.
- Favoritos o presets personalizados.
- Comparación de horno convencional vs ventilador en una mini tabla.
- Enlaces internos desde recetas/contenido de cocina hacia presets populares.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL pública recomendada | `/cocina/conversor-de-temperatura-de-horno` |
| Archivo Astro recomendado | `src/pages/cocina/conversor-de-temperatura-de-horno.astro` |
| Lógica de cálculo | `src/lib/calculators/cocina/conversor-de-temperatura-de-horno/ovenTemperature.ts` |
| Datos de marca de gas | `src/lib/calculators/cocina/conversor-de-temperatura-de-horno/gasMarks.ts` |
| Datos editoriales | `src/lib/calculators/cocina/conversor-de-temperatura-de-horno/safeTemperatures.ts` |
| Pruebas unitarias | `src/lib/calculators/cocina/conversor-de-temperatura-de-horno/ovenTemperature.test.ts` |
| Categoría | `cocina` |
| Locale base | `es-MX` |

### Cambio de URL respecto a v1

La v1 sugería `/cocina/conversor-temperatura-coccion`. La ruta v2 recomendada es
más clara para intención de búsqueda y reduce la confusión con temperatura
interna del alimento.

Si la ruta v1 ya estuviera publicada, agregar redirección 301 en Apache:

```apache
RewriteRule ^cocina/conversor-temperatura-coccion/?$ /cocina/conversor-de-temperatura-de-horno [R=301,L]
```

---

## Comportamiento mobile-first

- Primer viewport centrado en la calculadora, no en contenido editorial largo.
- Input grande con teclado numérico (`inputmode="decimal"`) y selector compacto
  `°C / °F / Gas`.
- Resultado principal visible sin scroll excesivo:
  - Línea 1: conversión exacta.
  - Línea 2: ajuste práctico de horno.
  - Línea 3: sugerencia para ventilador/convección si está activada.
- Presets como chips táctiles de al menos `44px` de alto.
- Tabla de seguridad alimentaria debajo del conversor, en sección claramente
  separada; en móvil puede ir dentro de acordeones por categoría.
- No depender solo del color para avisos de seguridad.
- Evitar presentar tiempos de cocción como garantía de seguridad.
- La tabla de temperaturas internas debe mostrar fuente y fecha cerca de la tabla,
  no solo al pie de página.

---

## Flujo principal MVP

**Ejemplo:** convertir `180 °C` a Fahrenheit y marca de gas.

Resultado esperado:

- Conversión exacta: `180 °C = 356 °F`.
- Ajuste práctico: `horno recomendado: 350 °F / gas 4`.
- Si ventilador está activado: `orientativo con ventilador: 160 °C / 325 °F`.

### Inputs del MVP

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Temperatura | Texto numérico | válida según escala | vacío |
| Unidad origen | Selector segmentado | `°C`, `°F`, `Gas` | `°C` |
| Unidad destino | Selector | `°C`, `°F`, `Gas` | `°F` |
| Horno con ventilador | Toggle | sí/no | no |
| Mostrar Kelvin avanzado | Toggle o acordeón | sí/no | no |

### Outputs principales

- Temperatura convertida exacta.
- Ajuste práctico de horno más cercano.
- Equivalencias en `°C`, `°F` y marca de gas.
- Sugerencia orientativa para ventilador/convección.
- Aviso si el valor está fuera del rango habitual de horno doméstico.
- Tabla separada de seguridad alimentaria.

---

## Fórmulas

Conversión exacta:

```text
F = C * 9/5 + 32
C = (F - 32) * 5/9
K = C + 273.15
C = K - 273.15
```

Ajuste práctico de horno:

```text
F_practico = múltiplo de 25 °F más cercano
C_practico = múltiplo de 10 °C más cercano
gas_practico = marca de gas más cercana por tabla local
```

Ajuste orientativo para ventilador/convección:

```text
C_ventilador = C_convencional - 20
F_ventilador = F_convencional - 25
```

La interfaz debe explicar que el ajuste de ventilador varía por receta, horno y
fabricante.

---

## Tabla local de marca de gas

Usar una tabla editorial local, no una fórmula inventada. Las marcas de gas son
aproximadas y pueden variar por horno.

| Marca de gas | °C aprox. | °F aprox. |
|--------------|-----------|-----------|
| 1/4 | 110 | 225 |
| 1/2 | 130 | 250 |
| 1 | 140 | 275 |
| 2 | 150 | 300 |
| 3 | 160 | 325 |
| 4 | 180 | 350 |
| 5 | 190 | 375 |
| 6 | 200 | 400 |
| 7 | 220 | 425 |
| 8 | 230 | 450 |
| 9 | 240 | 475 |

Reglas:

- Al convertir desde marca de gas, usar el valor aproximado de la tabla.
- Al convertir hacia marca de gas, elegir la marca más cercana por °C.
- Si hay empate entre dos marcas, elegir la marca inferior y mostrar nota de
  aproximación.
- Para valores fuera del rango de la tabla, mostrar `sin marca de gas cercana`
  y conservar las conversiones `°C`/`°F`.

---

## Tabla editorial de temperaturas internas seguras

La tabla de seguridad alimentaria debe estar separada visual y semánticamente del
conversor de horno. Debe incluir categorías como aves, carnes molidas, cortes
enteros, pescados, huevos, guisos y sobras, con tiempo de reposo cuando
corresponda.

Campos recomendados en `safeTemperatures.ts`:

| Campo | Descripción |
|-------|-------------|
| `food` | Nombre del alimento o categoría |
| `detail` | Corte, preparación o nota breve |
| `temperatureF` | Temperatura interna mínima en °F |
| `temperatureC` | Temperatura interna mínima en °C |
| `restTime` | Tiempo de reposo si aplica |
| `note` | Advertencia o criterio visual complementario |
| `sourceName` | Nombre de la fuente |
| `sourceUrl` | URL de la fuente |
| `sourceReviewedAt` | Fecha de última revisión indicada por la fuente |
| `editorialReviewedAt` | Fecha de revisión editorial del dato local |

Fuente base recomendada:

- FoodSafety.gov, `Cook to a Safe Minimum Internal Temperature`:
  `https://www.foodsafety.gov/food-safety-charts/safe-minimum-internal-temperatures`
- Fecha de última revisión indicada por la fuente consultada: `2024-11-21`.

Valores mínimos que debe cubrir el MVP:

| Alimento | Temperatura interna mínima | Reposo |
|----------|----------------------------|--------|
| Aves | `165 °F / 74 °C` | No indicado |
| Carne molida y salchicha | `160 °F / 71 °C` | No indicado |
| Cortes enteros de res, cerdo, ternera, cordero, cabra o bisonte | `145 °F / 63 °C` | 3 minutos |
| Pescado | `145 °F / 63 °C` o criterio visual oficial | No indicado |
| Guisos/cazuelas | `165 °F / 74 °C` | No indicado |
| Sobras recalentadas | `165 °F / 74 °C` | No indicado |

Advertencia obligatoria: la temperatura del horno no permite inferir que el
alimento alcanzó una temperatura interna segura. Recomendar verificar con
termómetro de alimentos.

---

## Validaciones y estados

- Validar cero absoluto en todas las escalas:
  - `K >= 0`.
  - `°C >= -273.15`.
  - `°F >= -459.67`.
- Si el valor está fuera del rango habitual de horno doméstico, permitir la
  conversión pero mostrar advertencia contextual.
- Rango orientativo de horno doméstico:
  - `50 °C` a `300 °C`.
  - `120 °F` a `575 °F`.
- Marca de gas solo acepta valores de la tabla local (`1/4`, `1/2`, `1` a `9`).
- Mostrar que marcas de gas son aproximadas y varían por horno.
- No inferir seguridad alimentaria desde temperatura del horno.
- Tabla editorial debe tener fuente, URL, fecha de revisión de fuente y fecha de
  revisión editorial.
- Recomendar verificar temperatura interna con termómetro.
- No presentar tiempos de cocción como garantía de seguridad.

Estados de error:

- Campo vacío: mostrar estado inicial sin error.
- Formato inválido: sugerir ejemplos (`180c`, `350 f`, `gas 4`).
- Temperatura físicamente imposible: bloquear resultado.
- Marca de gas fuera de tabla: pedir elegir una marca válida.
- Valor fuera de rango habitual de horno: mostrar advertencia, no bloquear.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Conversor de temperatura de horno: °C, °F y gas mark` |
| Meta description | `Convierte temperaturas de horno entre Celsius, Fahrenheit y marca de gas. Consulta ajuste para ventilador y temperaturas internas seguras.` |
| H1 | `Conversor de temperatura de horno` |
| Keyword principal | `conversor temperatura horno` |
| Keywords secundarias | `180 grados celsius a fahrenheit horno`, `350 fahrenheit a celsius horno`, `marca de gas horno`, `temperatura interna segura` |

### Contenido recomendado

- Breve explicación: conversión exacta vs ajuste práctico de horno.
- Tabla de equivalencias frecuentes de horno.
- Nota sobre ventilador/convección.
- Tabla separada de temperaturas internas seguras.
- FAQ con intención de búsqueda:
  - `¿Cuánto es 180 °C en Fahrenheit para horno?`
  - `¿Cuánto es 350 °F en Celsius?`
  - `¿Qué marca de gas equivale a 180 °C?`
  - `¿Debo bajar la temperatura si mi horno tiene ventilador?`
  - `¿La temperatura del horno garantiza que la carne está cocida?`

### Diferenciación con el conversor general

El sitio ya puede tener un conversor general de temperatura. Esta página debe
evitar duplicarse mediante:

- Marca de gas como resultado principal.
- Ajustes prácticos redondeados para hornos.
- Presets de cocina.
- Ventilador/convección.
- Tabla de temperatura interna segura separada.

---

## Referencias sugeridas

- FoodSafety.gov: temperaturas internas seguras de cocción.
- USDA FSIS como referencia complementaria cuando apunte a la misma tabla o a
  materiales oficiales relacionados.
- Manuales de fabricantes o notas editoriales propias solo para explicar que los
  ajustes de ventilador/convección son orientativos.

---

## Pruebas sugeridas

- `180 °C` produce conversión exacta `356 °F`.
- `180 °C` produce ajuste práctico `350 °F / gas 4`.
- `350 °F` produce conversión exacta `176.67 °C`.
- `350 °F` produce ajuste práctico `180 °C / gas 4`.
- `gas 4` produce `180 °C` y `350 °F` aproximados.
- `200 °C` con ventilador activado sugiere `180 °C`.
- `400 °F` con ventilador activado sugiere `375 °F`.
- `32 °F` produce `0 °C`, pero muestra advertencia de fuera de rango habitual de
  horno.
- `0 K` produce `-273.15 °C` en modo avanzado.
- Kelvin negativo, `-274 °C` y `-460 °F` muestran error físico.
- `gas 10` muestra error de marca no soportada.
- Entrada `180c`, `350 f`, `gas 4` y `mark 6` se interpreta correctamente.
- La tabla editorial incluye fuente, URL, fecha de revisión de fuente y fecha de
  revisión editorial.
- La página no muestra la tabla de seguridad como si fuera resultado derivado de
  la temperatura de horno.
