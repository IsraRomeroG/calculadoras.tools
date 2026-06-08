# Especificación v1 - Conversor de bytes y almacenamiento

## Descripción general

Herramienta para convertir bits, bytes y unidades de almacenamiento usando
sistemas decimal y binario, mostrando explícitamente la base empleada.

**Arquitectura:** todo el cálculo ocurre en el cliente. No requiere backend,
base de datos ni llamadas a APIs externas.

---

## Objetivo de producto

- Convertir entre bits, bytes y múltiplos comunes.
- Diferenciar unidades decimales de binarias.
- Evitar confundir `MB` con `MiB` y `Gb` con `GB`.
- Mostrar equivalencias útiles con precisión configurable.
- Generar una página estática optimizada para SEO en Astro.

---

## Alcance recomendado

### MVP

- Valor, unidad origen y unidad destino.
- Bits y bytes.
- Unidades decimales: `kB`, `MB`, `GB`, `TB`, `PB`.
- Unidades binarias: `KiB`, `MiB`, `GiB`, `TiB`, `PiB`.
- Precisión y notación configurables.

### Fase 2

- Tabla de conversiones simultáneas.
- Conversión de tasas por segundo.
- Comparador capacidad anunciada vs visible.
- Copiar tabla completa.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL pública recomendada | `/tecnologia/conversor-bytes-almacenamiento` |
| Archivo Astro recomendado | `src/pages/tecnologia/conversor-bytes-almacenamiento.astro` |
| Lógica de cálculo | `src/lib/calculators/tecnologia/conversor-bytes-almacenamiento/storageUnits.ts` |
| Pruebas unitarias | `src/lib/calculators/tecnologia/conversor-bytes-almacenamiento/storageUnits.test.ts` |
| Categoría | `tecnologia` |
| Locale base | `es-MX` |

---

## Comportamiento mobile-first

- Mostrar resultado convertido como valor principal.
- Mantener símbolos de unidad siempre visibles.
- Etiquetar claramente sistema decimal o binario.
- Mostrar una equivalencia intermedia en bytes.
- No usar `KB` ambiguo sin explicar la convención.

---

## Flujo principal MVP

### Inputs del MVP

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Valor | Texto numérico | `>= 0` | vacío |
| Unidad origen | Selector | bit, byte, kB-PB, KiB-PiB | MB |
| Unidad destino | Selector | bit, byte, kB-PB, KiB-PiB | GB |
| Precisión | Selector | `0-12` decimales | `4` |
| Notación | Selector | normal, científica | normal |

### Outputs principales

- Valor convertido.
- Valor equivalente en bytes.
- Sistema de unidad origen y destino.
- Factor de conversión.
- Equivalencias cercanas.

---

## Fórmulas

```text
1 byte = 8 bits
1 kB = 1000 bytes
1 MB = 1000^2 bytes
1 GB = 1000^3 bytes
1 KiB = 1024 bytes
1 MiB = 1024^2 bytes
1 GiB = 1024^3 bytes
```

Algoritmo:

```text
bytes = valor * factor_origen_en_bytes
resultado = bytes / factor_destino_en_bytes
```

Para bits, convertir primero a bytes dividiendo entre `8`.

---

## Validaciones y estados

- Valor no puede ser negativo.
- Aceptar cero.
- Mantener precisión interna sin redondear antes del resultado.
- Mostrar notación científica para valores extremos.
- Diferenciar mayúsculas y minúsculas en símbolos: `b` es bit y `B` es byte.
- Explicar que algunos sistemas muestran capacidad con convenciones distintas.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Conversor de bytes y almacenamiento` |
| Meta description | `Convierte bits, bytes, MB, GB, MiB, GiB y otras unidades decimales y binarias de almacenamiento.` |
| H1 | `Conversor de bytes y almacenamiento` |
| Keyword principal | `conversor bytes` |
| Keywords secundarias | `MB a GB`, `GB a GiB`, `bits a bytes`, `unidades almacenamiento` |

---

## Pruebas sugeridas

- `8 bits` equivalen a `1 byte`.
- `1000 MB` equivalen a `1 GB`.
- `1024 MiB` equivalen a `1 GiB`.
- `1 GB` no equivale a `1 GiB`.
- Cero se convierte correctamente en todas las unidades.

