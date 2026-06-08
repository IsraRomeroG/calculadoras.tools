# Especificación v1 - Calculadora de velocidad de descarga estimada

## Descripción general

Herramienta para estimar cuánto tarda una descarga según tamaño de archivo y
velocidad de conexión, o qué velocidad se necesita para descargar un archivo en
un tiempo objetivo. Debe aclarar la diferencia entre bits y bytes.

**Arquitectura:** todo el cálculo ocurre en el cliente. No requiere backend,
base de datos ni llamadas a APIs externas.

---

## Objetivo de producto

- Calcular tiempo estimado de descarga.
- Calcular velocidad necesaria para un tiempo objetivo.
- Convertir entre KB, MB, GB, TB y Kbps, Mbps, Gbps.
- Explicar diferencia entre MB/s y Mbps.
- Generar una página estática optimizada para SEO en Astro.

---

## Alcance recomendado

### MVP

- Modo `Tiempo de descarga`.
- Modo `Velocidad necesaria`.
- Tamaño de archivo y unidad.
- Velocidad de conexión y unidad.
- Eficiencia opcional de conexión.
- Resultado en formato legible.
- Copiar resultado y limpiar formulario.

### Fase 2

- Comparador de velocidades.
- Tabla de tamaños frecuentes.
- Estimación para varios archivos.
- Historial en `sessionStorage`.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL inmediata recomendada | `/conversores/calculadora-velocidad-descarga` |
| URL futura si existe Tecnología | `/tecnologia/calculadora-velocidad-descarga` |
| Archivo Astro recomendado | `src/pages/conversores/calculadora-velocidad-descarga.astro` |
| Lógica de cálculo | `src/lib/calculators/conversores/calculadora-velocidad-descarga/downloadSpeed.ts` |
| Pruebas unitarias | `src/lib/calculators/conversores/calculadora-velocidad-descarga/downloadSpeed.test.ts` |
| Categoría inmediata | `conversores` |
| Categoría futura opcional | `tecnologia` |
| Locale base | `es-MX` |

---

## Comportamiento mobile-first

- Control segmentado para modos.
- Resultado principal como tiempo o velocidad necesaria.
- Inputs con unidades visibles junto al valor.
- Bloque breve para explicar `1 byte = 8 bits`.
- No medir velocidad real; solo estimar con datos ingresados.

---

## Flujo principal MVP

**Ejemplo:** Descargar `5 GB` con una conexión de `100 Mbps`. ¿Cuánto tarda?

### Inputs del modo tiempo de descarga

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Tamaño del archivo | Texto numérico | `> 0` | vacío |
| Unidad de tamaño | Selector | `KB`, `MB`, `GB`, `TB` | `GB` |
| Velocidad | Texto numérico | `> 0` | vacío |
| Unidad de velocidad | Selector | `Kbps`, `Mbps`, `Gbps`, `KB/s`, `MB/s`, `GB/s` | `Mbps` |
| Eficiencia (%) | Texto numérico | `1-100` | `90` |

### Inputs del modo velocidad necesaria

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Tamaño del archivo | Texto numérico | `> 0` | vacío |
| Unidad de tamaño | Selector | `KB`, `MB`, `GB`, `TB` | `GB` |
| Tiempo objetivo | Horas/minutos/segundos | `> 0` | vacío |
| Unidad de salida | Selector | `Mbps`, `MB/s`, `Gbps` | `Mbps` |
| Eficiencia (%) | Texto numérico | `1-100` | `90` |

### Outputs principales

- Tiempo estimado de descarga.
- Velocidad efectiva.
- Tamaño convertido.
- Velocidad necesaria.
- Nota sobre eficiencia.

---

## Fórmulas

Usar base decimal para unidades de red en MVP:

```text
1 KB = 1000 bytes
1 MB = 1000^2 bytes
1 GB = 1000^3 bytes
1 TB = 1000^4 bytes
1 byte = 8 bits
```

Tiempo de descarga:

```text
tamaño_bits = tamaño_bytes * 8
velocidad_bps = convertir_velocidad_a_bps(velocidad, unidad)
velocidad_efectiva_bps = velocidad_bps * (eficiencia / 100)
segundos = tamaño_bits / velocidad_efectiva_bps
```

Velocidad necesaria:

```text
velocidad_efectiva_requerida_bps = tamaño_bits / segundos_objetivo
velocidad_nominal_requerida_bps = velocidad_efectiva_requerida_bps / (eficiencia / 100)
```

---

## Validaciones y estados

- Tamaño y velocidad deben ser mayores que cero.
- Eficiencia debe estar entre `1` y `100`.
- Tiempo objetivo debe ser mayor que cero.
- Si el resultado supera varios días, mostrar formato con días.
- Aclarar que Wi-Fi, servidor, latencia y congestión pueden cambiar el tiempo real.
- Redondear resultados con unidades legibles.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de velocidad de descarga` |
| Meta description | `Estima cuánto tarda una descarga según tamaño de archivo y velocidad, o calcula la velocidad necesaria para un tiempo objetivo.` |
| H1 | `Calculadora de velocidad de descarga` |
| Keyword principal | `calculadora velocidad descarga` |
| Keywords secundarias | `tiempo de descarga`, `Mbps a MB/s`, `cuanto tarda descargar` |

### FAQs sugeridas

- ¿Cuál es la diferencia entre Mbps y MB/s?
- ¿Por qué la descarga real tarda más?
- ¿La calculadora mide mi internet?
- ¿Qué significa eficiencia de conexión?

---

## Pruebas sugeridas

- `1 GB` a `100 Mbps` y eficiencia `100%` produce `80 s`.
- `5 GB` a `100 Mbps` y eficiencia `90%` produce alrededor de `7 min 24 s`.
- `MB/s` convierte multiplicando por 8 a bits.
- Eficiencia `0` muestra error.
- Velocidad necesaria para `1 GB` en `80 s` produce `100 Mbps` con eficiencia `100%`.

