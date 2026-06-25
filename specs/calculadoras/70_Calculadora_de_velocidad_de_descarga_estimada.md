# Especificación v2 - Calculadora de tiempo y velocidad de descarga

## Descripción general

Herramienta para estimar cuánto tarda una descarga según tamaño de archivo,
velocidad de conexión y eficiencia real, o qué velocidad nominal se necesita
para descargar un archivo en un tiempo objetivo.

La calculadora debe estar orientada a casos habituales de programación y
desarrollo: artefactos de build, imágenes Docker, backups de bases de datos,
datasets, ISOs, paquetes y archivos grandes usados en CI/CD o despliegues.

Debe aclarar de forma práctica la diferencia entre bits y bytes, entre `Mbps` y
`MB/s`, y entre unidades decimales (`GB`) y binarias (`GiB`).

**Arquitectura:** todo el cálculo ocurre en el cliente. No requiere backend,
base de datos ni llamadas a APIs externas. No mide la velocidad real de
internet; solo estima con los datos ingresados por el usuario.

---

## Objetivo de producto

- Calcular tiempo estimado de descarga para un archivo o artefacto.
- Calcular velocidad nominal necesaria para cumplir un tiempo objetivo.
- Convertir entre unidades de tamaño decimales y binarias.
- Convertir entre velocidades en bits por segundo y bytes por segundo.
- Mostrar equivalencias útiles como `100 Mbps ≈ 12.5 MB/s`.
- Comparar automáticamente el mismo archivo contra velocidades frecuentes.
- Explicar por qué la descarga real puede ser más lenta que el cálculo ideal.
- Generar una página estática optimizada para SEO en Astro.

---

## Alcance recomendado

### MVP

- Modo `Tiempo de descarga`.
- Modo `Velocidad necesaria`.
- Tamaño de archivo y unidad.
- Unidades de tamaño: `KB`, `MB`, `GB`, `TB`, `KiB`, `MiB`, `GiB`, `TiB`.
- Velocidad de conexión y unidad.
- Unidades de velocidad: `Kbps`, `Mbps`, `Gbps`, `KB/s`, `MB/s`, `GB/s`,
  `KiB/s`, `MiB/s`, `GiB/s`.
- Eficiencia de conexión editable con valor por defecto `90%`.
- Presets de eficiencia: `Ideal 100%`, `Cable estable 90%`, `Wi-Fi 75%`,
  `Red congestionada 50%`.
- Presets de tamaño orientados a programación:
  - `Paquete pequeño` (`50 MB`).
  - `Artefacto de build` (`250 MB`).
  - `Imagen Docker` (`1.5 GB`).
  - `Backup de base de datos` (`5 GB`).
  - `Dataset` (`25 GB`).
  - `ISO o VM` (`80 GB`).
- Resultado principal en formato legible.
- Equivalencia de velocidad efectiva en `Mbps` y `MB/s`.
- Tamaño convertido en decimal y binario.
- Tabla comparativa automática con velocidades frecuentes.
- Sugerencia de velocidad mínima o plan cercano en modo `Velocidad necesaria`.
- Copiar resultado y limpiar formulario.
- Bloque breve de explicación: `1 byte = 8 bits`.

### Fase 2

- Estimación para varios archivos y suma total.
- Historial reciente en `sessionStorage`.
- Parámetros en URL para compartir un escenario.
- Perfiles adicionales: fibra, datos móviles, red corporativa, cloud runner.
- Modo opcional `Subida / transferencia` si se quiere hablar de backups o
  despliegues sin limitar el texto a descarga.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL canónica | `/programacion/calculadora-velocidad-descarga` |
| Archivo Astro recomendado | `src/pages/programacion/calculadora-velocidad-descarga.astro` |
| Lógica de cálculo | `src/lib/calculators/programacion/calculadora-velocidad-descarga/downloadSpeed.ts` |
| Pruebas unitarias | `src/lib/calculators/programacion/calculadora-velocidad-descarga/downloadSpeed.test.ts` |
| Categoría | `programacion` |
| Locale base | `es-MX` |
| ID sugerido en directorio | `calculadora-velocidad-descarga` |
| Orden sugerido | `71.5` |

### Redirección canónica

La spec anterior proponía `/conversores/calculadora-velocidad-descarga`. Si esa
ruta llegó a publicarse, debe redirigir a la nueva URL canónica:

```apache
RewriteRule ^conversores/calculadora-velocidad-descarga/?$ /programacion/calculadora-velocidad-descarga [R=301,L]
```

No crear una página Astro duplicada en `conversores`.

---

## Comportamiento mobile-first

- La calculadora debe aparecer muy cerca del inicio de la página, después de un
  hero compacto.
- En móvil, usar una sola columna: modo, entradas, resultado principal,
  equivalencias y comparador.
- Usar control segmentado para alternar entre `Tiempo de descarga` y
  `Velocidad necesaria`.
- Inputs numéricos con selector de unidad visible junto al valor.
- Chips táctiles para presets de tamaño, velocidad y eficiencia.
- Resultado principal inmediatamente visible después de los campos clave.
- El comparador de velocidades puede mostrarse como tabla compacta o lista de
  filas escaneables en móvil.
- En desktop, usar dos columnas: formulario a la izquierda y resultado/resumen a
  la derecha.
- No usar cards anidadas. Las tarjetas solo deben representar bloques
  individuales de resultado, presets o filas comparativas.
- Asegurar que textos de botones, unidades y resultados no se desborden en
  pantallas angostas.
- Incluir una nota visible: la herramienta no mide la conexión real.

---

## Flujo principal MVP

**Ejemplo:** descargar un backup de `5 GB` con una conexión de `100 Mbps` y
eficiencia `90%`. ¿Cuánto tarda?

### Inputs del modo tiempo de descarga

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Preset de archivo | Chips opcionales | presets definidos | ninguno |
| Tamaño del archivo | Texto numérico | `> 0` | vacío |
| Unidad de tamaño | Selector | `KB`, `MB`, `GB`, `TB`, `KiB`, `MiB`, `GiB`, `TiB` | `GB` |
| Velocidad | Texto numérico | `> 0` | vacío |
| Unidad de velocidad | Selector | `Kbps`, `Mbps`, `Gbps`, `KB/s`, `MB/s`, `GB/s`, `KiB/s`, `MiB/s`, `GiB/s` | `Mbps` |
| Eficiencia (%) | Texto numérico, slider o stepper | `1-100` | `90` |

### Inputs del modo velocidad necesaria

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Preset de archivo | Chips opcionales | presets definidos | ninguno |
| Tamaño del archivo | Texto numérico | `> 0` | vacío |
| Unidad de tamaño | Selector | `KB`, `MB`, `GB`, `TB`, `KiB`, `MiB`, `GiB`, `TiB` | `GB` |
| Tiempo objetivo | Horas/minutos/segundos | suma `> 0` | vacío |
| Unidad de salida | Selector | `Mbps`, `Gbps`, `MB/s`, `MiB/s` | `Mbps` |
| Eficiencia (%) | Texto numérico, slider o stepper | `1-100` | `90` |

### Presets de velocidad

Mostrar chips o botones rápidos para velocidades comunes:

- `10 Mbps`
- `50 Mbps`
- `100 Mbps`
- `300 Mbps`
- `500 Mbps`
- `1 Gbps`

### Outputs principales

- Tiempo estimado de descarga.
- Tiempo ideal a `100%` de eficiencia.
- Velocidad nominal ingresada.
- Velocidad efectiva calculada.
- Equivalencias de velocidad en `Mbps` y `MB/s`.
- Tamaño convertido a bytes, decimal y binario.
- Tabla comparativa para velocidades frecuentes.
- Nota sobre eficiencia y condiciones reales.

### Outputs del modo velocidad necesaria

- Velocidad nominal requerida.
- Velocidad efectiva requerida.
- Equivalencia en `Mbps`, `Gbps`, `MB/s` y `MiB/s`.
- Sugerencia de plan cercano: por ejemplo, si requiere `93 Mbps`, indicar que
  una conexión nominal de `100 Mbps` podría bastar con `90%` de eficiencia.
- Advertencia si el objetivo exige una velocidad poco realista.

---

## Fórmulas

### Unidades de tamaño

Usar unidades explícitas. Las unidades decimales y binarias no deben mezclarse:

```text
1 KB = 1000 bytes
1 MB = 1000^2 bytes
1 GB = 1000^3 bytes
1 TB = 1000^4 bytes

1 KiB = 1024 bytes
1 MiB = 1024^2 bytes
1 GiB = 1024^3 bytes
1 TiB = 1024^4 bytes

1 byte = 8 bits
```

### Unidades de velocidad

```text
1 Kbps = 1000 bits/s
1 Mbps = 1000^2 bits/s
1 Gbps = 1000^3 bits/s

1 KB/s = 1000 bytes/s = 8000 bits/s
1 MB/s = 1000^2 bytes/s = 8,000,000 bits/s
1 GB/s = 1000^3 bytes/s = 8,000,000,000 bits/s

1 KiB/s = 1024 bytes/s
1 MiB/s = 1024^2 bytes/s
1 GiB/s = 1024^3 bytes/s
```

### Tiempo de descarga

```text
tamaño_bytes = convertir_tamaño_a_bytes(tamaño, unidad_tamaño)
tamaño_bits = tamaño_bytes * 8
velocidad_bps = convertir_velocidad_a_bps(velocidad, unidad_velocidad)
velocidad_efectiva_bps = velocidad_bps * (eficiencia / 100)
segundos_estimados = tamaño_bits / velocidad_efectiva_bps
segundos_ideales = tamaño_bits / velocidad_bps
```

### Velocidad necesaria

```text
segundos_objetivo = horas * 3600 + minutos * 60 + segundos
tamaño_bits = convertir_tamaño_a_bytes(tamaño, unidad_tamaño) * 8
velocidad_efectiva_requerida_bps = tamaño_bits / segundos_objetivo
velocidad_nominal_requerida_bps = velocidad_efectiva_requerida_bps / (eficiencia / 100)
```

### Comparador de velocidades

Para cada velocidad frecuente:

```text
segundos = tamaño_bits / (velocidad_frecuente_bps * eficiencia / 100)
```

---

## Validaciones y estados

- Tamaño y velocidad deben ser mayores que cero.
- Eficiencia debe estar entre `1` y `100`.
- Tiempo objetivo debe ser mayor que cero al sumar horas, minutos y segundos.
- Aceptar separador decimal con punto o coma, normalizando internamente.
- Rechazar valores no numéricos, negativos, infinitos o demasiado grandes para
  presentar resultados útiles.
- Si el resultado supera `24 h`, mostrar días.
- Si el resultado supera `365 días`, mostrar años aproximados y una advertencia.
- Redondear resultados con unidades legibles, sin ocultar magnitudes pequeñas.
- Aclarar que Wi-Fi, servidor, latencia, throttling, VPN, congestión y límites
  del proveedor pueden cambiar el tiempo real.
- Si no hay datos suficientes, mostrar estado vacío útil: `Ingresa tamaño y
  velocidad para estimar el tiempo`.
- Si hay error, mantener los datos del usuario y marcar solo el campo afectado.

---

## Diseño de resultado

### Resultado principal

Debe comunicar primero la respuesta útil:

```text
Tiempo estimado: 7 min 24 s
```

Debajo, mostrar contexto:

```text
5 GB a 100 Mbps con 90% de eficiencia
Velocidad efectiva: 90 Mbps ≈ 11.25 MB/s
Tiempo ideal sin pérdida: 6 min 40 s
```

### Comparador

Para el tamaño activo, mostrar una tabla/lista como:

| Velocidad nominal | Tiempo estimado con eficiencia actual |
|-------------------|---------------------------------------|
| `10 Mbps` | `1 h 14 min` |
| `50 Mbps` | `14 min 49 s` |
| `100 Mbps` | `7 min 24 s` |
| `300 Mbps` | `2 min 28 s` |
| `1 Gbps` | `44 s` |

### Copiar resultado

El texto copiado debe ser autosuficiente:

```text
Descargar 5 GB a 100 Mbps con 90% de eficiencia tarda aprox. 7 min 24 s.
Velocidad efectiva: 90 Mbps (11.25 MB/s).
```

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de tiempo de descarga: Mbps, MB/s y GB` |
| Meta description | `Estima cuánto tarda en descargarse un archivo según su tamaño, velocidad y eficiencia. Convierte Mbps a MB/s y calcula la velocidad necesaria.` |
| H1 | `Calculadora de tiempo de descarga` |
| Keyword principal | `calculadora tiempo de descarga` |
| Keywords secundarias | `calculadora velocidad descarga`, `Mbps a MB/s`, `cuánto tarda descargar`, `tiempo de descarga GB`, `velocidad necesaria descarga` |
| Categoría visible | `Programación` |
| Canonical | `/programacion/calculadora-velocidad-descarga` |

### Bloques de contenido sugeridos

- Qué calcula esta herramienta.
- Diferencia entre `Mbps` y `MB/s`.
- Diferencia entre `GB` y `GiB`.
- Por qué una descarga real tarda más que el cálculo ideal.
- Ejemplos para desarrollo: Docker, backups, datasets y artefactos de CI.
- Cómo elegir una eficiencia razonable.

### FAQs sugeridas

- ¿Cuál es la diferencia entre Mbps y MB/s?
- ¿Por qué `100 Mbps` no significa `100 MB/s`?
- ¿Cuál es la diferencia entre GB y GiB?
- ¿Por qué la descarga real tarda más?
- ¿La calculadora mide mi internet?
- ¿Qué significa eficiencia de conexión?
- ¿Qué velocidad necesito para descargar un archivo grande en una hora?
- ¿Sirve para imágenes Docker, backups o datasets?

---

## Implementación sugerida

Crear funciones puras en `downloadSpeed.ts`:

- `convertSizeToBytes(value, unit)`
- `convertSpeedToBps(value, unit)`
- `formatDuration(seconds)`
- `formatSpeed(bps, unit?)`
- `estimateDownloadTime(input)`
- `estimateRequiredSpeed(input)`
- `buildSpeedComparison(input, speeds)`
- `buildCopyText(result)`

Tipos sugeridos:

```ts
type SizeUnit = "KB" | "MB" | "GB" | "TB" | "KiB" | "MiB" | "GiB" | "TiB";
type SpeedUnit =
  | "Kbps"
  | "Mbps"
  | "Gbps"
  | "KB/s"
  | "MB/s"
  | "GB/s"
  | "KiB/s"
  | "MiB/s"
  | "GiB/s";
```

La página Astro debe usar estas funciones en el cliente y mantener el cálculo
sin dependencias externas.

---

## Pruebas sugeridas

- `1 GB` a `100 Mbps` y eficiencia `100%` produce `80 s`.
- `5 GB` a `100 Mbps` y eficiencia `90%` produce alrededor de `7 min 24 s`.
- `1 GiB` a `100 Mbps` y eficiencia `100%` produce alrededor de `85.9 s`.
- `100 Mbps` equivale a `12.5 MB/s`.
- `10 MB/s` convierte a `80 Mbps`.
- `10 MiB/s` convierte a `83,886,080 bps`.
- Eficiencia `0` muestra error.
- Eficiencia `101` muestra error.
- Tiempo objetivo con `0 h`, `0 min`, `0 s` muestra error.
- Velocidad necesaria para `1 GB` en `80 s` produce `100 Mbps` con eficiencia
  `100%`.
- Velocidad necesaria para `1 GB` en `80 s` produce alrededor de `111.11 Mbps`
  con eficiencia `90%`.
- El comparador conserva el tamaño actual y aplica la eficiencia actual.
- El texto copiado incluye tamaño, velocidad, eficiencia y resultado.

