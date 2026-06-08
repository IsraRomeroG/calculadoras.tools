# Especificación v1 - Calculadora de CTR y tasa de conversión

## Descripción general

Herramienta para calcular CTR y tasa de conversión de campañas o embudos usando
impresiones, clics, sesiones y conversiones capturados manualmente.

**Arquitectura:** todo el cálculo ocurre en el cliente. No requiere backend,
cuentas publicitarias ni llamadas a APIs externas.

---

## Objetivo de producto

- Calcular CTR y tasa de conversión sin mezclar denominadores.
- Mostrar el avance entre etapas de un embudo.
- Detectar datos inconsistentes.
- Permitir calcular el volumen necesario para alcanzar una meta.
- Generar una página estática optimizada para SEO en Astro.

---

## Alcance recomendado

### MVP

- Modos `Resultados actuales` y `Planificar objetivo`.
- Impresiones, clics, sesiones y conversiones.
- Denominador de conversión seleccionable.
- CTR, tasa de conversión y pérdidas entre etapas.
- Copiar resultado y limpiar formulario.

### Fase 2

- Embudo con etapas personalizadas.
- Comparación entre campañas.
- Intervalos de confianza.
- Exportación CSV.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL pública recomendada | `/marketing/calculadora-ctr-tasa-conversion` |
| Archivo Astro recomendado | `src/pages/marketing/calculadora-ctr-tasa-conversion.astro` |
| Lógica de cálculo | `src/lib/calculators/marketing/calculadora-ctr-tasa-conversion/funnelRates.ts` |
| Pruebas unitarias | `src/lib/calculators/marketing/calculadora-ctr-tasa-conversion/funnelRates.test.ts` |
| Categoría | `marketing` |
| Locale base | `es-MX` |

---

## Comportamiento mobile-first

- Mostrar CTR y conversión como resultados principales.
- Etiquetar siempre el denominador de cada tasa.
- Presentar el embudo como filas compactas.
- Evitar colores de éxito o fracaso sin una meta capturada.

---

## Flujo principal MVP

### Inputs del MVP

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Impresiones | Texto numérico entero | `>= 0` | vacío |
| Clics | Texto numérico entero | `>= 0` | vacío |
| Sesiones | Texto numérico entero opcional | `>= 0` | vacío |
| Conversiones | Texto numérico entero | `>= 0` | vacío |
| Base de conversión | Selector | clics, sesiones, impresiones | clics |
| CTR o conversión objetivo | Texto numérico opcional | `0%-100%` | vacío |

### Outputs principales

- CTR.
- Tasa de conversión con denominador visible.
- Unidades de la base seleccionada sin conversión.
- Impresiones o clics necesarios para una meta.
- Resumen del embudo.

---

## Fórmulas

```text
CTR = impresiones > 0 ? clics / impresiones * 100 : null
tasa_conversion = base > 0 ? conversiones / base * 100 : null
base_sin_conversion = base - conversiones
volumen_necesario = meta_conversiones / (tasa_objetivo / 100)
```

---

## Validaciones y estados

- Clics no deben superar impresiones sin advertencia.
- Conversiones no deben superar el denominador seleccionado sin advertencia.
- Denominador cero muestra tasa no disponible.
- No asumir que sesiones y clics son equivalentes.
- Permitir conversiones múltiples con una opción avanzada y explicarlo.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de CTR y tasa de conversión` |
| Meta description | `Calcula CTR, tasa de conversión y volumen necesario para alcanzar objetivos de marketing.` |
| H1 | `Calculadora de CTR y conversión` |
| Keyword principal | `calculadora CTR` |
| Keywords secundarias | `tasa de conversión`, `conversion rate`, `click through rate` |

---

## Pruebas sugeridas

- `10000` impresiones y `500` clics producen CTR de `5%`.
- `20` conversiones sobre `500` clics producen `4%`.
- Base cero no produce división inválida.
- Conversiones mayores a la base muestran advertencia.
- Planificación inversa calcula el volumen requerido.
