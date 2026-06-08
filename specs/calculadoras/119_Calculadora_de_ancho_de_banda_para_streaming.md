# Especificación v1 - Calculadora de ancho de banda para streaming

## Descripción general

Herramienta para estimar ancho de banda requerido y consumo de datos al realizar
streaming con uno o varios dispositivos simultáneos.

**Arquitectura:** todo el cálculo ocurre en el cliente. No mide la conexión ni
consulta servicios de streaming y no requiere backend.

---

## Objetivo de producto

- Sumar bitrates de transmisiones simultáneas.
- Añadir margen de capacidad manual.
- Estimar consumo de datos por hora y mes.
- Diferenciar Mbps de MB/s y GB.
- Permitir bitrates manuales o presets editables.

---

## Alcance recomendado

### MVP

- Lista editable de transmisiones.
- Bitrate y cantidad simultánea.
- Margen recomendado editable.
- Horas de uso.
- Ancho de banda requerido y consumo de datos.

### Fase 2

- Perfiles editables por resolución.
- Comparador de planes.
- Subida para streaming en vivo.
- Escenarios de hogar.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL pública recomendada | `/telecomunicaciones/calculadora-ancho-banda-streaming` |
| Archivo Astro recomendado | `src/pages/telecomunicaciones/calculadora-ancho-banda-streaming.astro` |
| Lógica de cálculo | `src/lib/calculators/telecomunicaciones/calculadora-ancho-banda-streaming/streamingBandwidth.ts` |
| Pruebas unitarias | `src/lib/calculators/telecomunicaciones/calculadora-ancho-banda-streaming/streamingBandwidth.test.ts` |
| Categoría | `telecomunicaciones` |
| Locale base | `es-MX` |

---

## Comportamiento mobile-first

- Mostrar Mbps requeridos y GB consumidos como resultados principales.
- Cada transmisión como bloque editable.
- Mantener bitrate y simultaneidad visibles.
- Explicar brevemente `8 bits = 1 byte`.
- No afirmar que una velocidad garantiza calidad.

---

## Flujo principal MVP

### Inputs del MVP

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Nombre / calidad | Texto | 1-80 caracteres | `Stream 1` |
| Bitrate | Texto numérico | `> 0 Mbps` | vacío |
| Streams simultáneos | Texto numérico entero | `>= 1` | `1` |
| Margen de capacidad (%) | Texto numérico | `0%-200%` | `25%` |
| Horas al día | Texto numérico | `0-24` | vacío |
| Días al mes | Texto numérico entero | `0-31` | `30` |

### Outputs principales

- Bitrate total simultáneo.
- Ancho de banda recomendado.
- Datos consumidos por hora.
- Consumo diario y mensual.
- Desglose por transmisión.

---

## Fórmulas

Usar unidades decimales de red:

```text
bitrate_total_Mbps = suma(bitrate_Mbps * streams_simultaneos)
ancho_recomendado = bitrate_total_Mbps * (1 + margen)
GB_por_hora = bitrate_total_Mbps * 3600 / 8 / 1000
GB_mes = GB_por_hora * horas_dia * dias_mes
```

---

## Validaciones y estados

- Bitrate debe ser mayor que cero.
- Streams simultáneos deben ser enteros positivos.
- Horas al día no pueden superar `24`.
- Días al mes no pueden superar `31`.
- Aclarar que protocolo, variación del bitrate y otros dispositivos afectan uso.
- No confundir Mbps con MB/s.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de ancho de banda para streaming` |
| Meta description | `Estima Mbps requeridos y consumo mensual de datos para varios streams simultáneos.` |
| H1 | `Calculadora de ancho de banda para streaming` |
| Keyword principal | `ancho de banda streaming` |
| Keywords secundarias | `Mbps para streaming`, `consumo datos streaming`, `internet para varios dispositivos` |

---

## Pruebas sugeridas

- Dos streams de `5 Mbps` producen `10 Mbps` totales.
- Margen `25%` sobre `10 Mbps` produce `12.5 Mbps`.
- `8 Mbps` durante una hora producen `3.6 GB` decimales.
- Horas mayores a `24` muestran error.
- Cero streams no es válido.

