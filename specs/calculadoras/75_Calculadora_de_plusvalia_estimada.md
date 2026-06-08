# Especificación v1 - Calculadora de plusvalía estimada

## Descripción general

Herramienta para proyectar el valor futuro de una propiedad usando una tasa
anual de plusvalía ingresada por el usuario. Debe mostrar escenarios y aclarar
que el valor real depende del mercado, zona, estado del inmueble y otros factores.

**Arquitectura:** todo el cálculo ocurre en el cliente. No requiere backend,
base de datos ni llamadas a APIs externas.

---

## Objetivo de producto

- Estimar valor futuro con plusvalía compuesta.
- Calcular ganancia nominal y porcentaje acumulado.
- Permitir plusvalía positiva, cero o negativa.
- Comparar escenarios conservador, base y optimista.
- Generar una página estática optimizada para SEO en Astro.

---

## Alcance recomendado

### MVP

- Valor actual.
- Tasa anual manual.
- Plazo en años.
- Gastos de mejora opcionales.
- Resultado: valor futuro, ganancia nominal y plusvalía acumulada.
- Tabla anual.
- Copiar resultado, limpiar formulario y exportar CSV.

### Fase 2

- Tres escenarios simultáneos.
- Inflación para valor real.
- Costos de venta e impuestos manuales.
- Historial en `sessionStorage`.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL pública recomendada | `/inmuebles/calculadora-plusvalia-estimada` |
| Archivo Astro recomendado | `src/pages/inmuebles/calculadora-plusvalia-estimada.astro` |
| Lógica de cálculo | `src/lib/calculators/inmuebles/calculadora-plusvalia-estimada/appreciation.ts` |
| Pruebas unitarias | `src/lib/calculators/inmuebles/calculadora-plusvalia-estimada/appreciation.test.ts` |
| Categoría | `inmuebles` |
| Locale base | `es-MX` |
| Moneda base | `MXN`, símbolo `$` |

---

## Comportamiento mobile-first

- Resultado principal como valor futuro estimado.
- Tabla anual secundaria y desplazable.
- Mostrar tasa manual claramente en el resumen.
- No etiquetar escenarios como garantía.
- Permitir tasa negativa sin mensajes alarmistas.

---

## Flujo principal MVP

**Ejemplo:** Propiedad de `$2,000,000` con plusvalía estimada de `4%` anual
durante `10 años`.

### Inputs del MVP

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Valor actual | Texto numérico | `> 0` | vacío |
| Plusvalía anual (%) | Texto numérico | `-50%-100%` | `4` |
| Plazo | Texto numérico | `1-100 años` | `10` |
| Mejoras añadidas al valor | Texto numérico opcional | `>= 0` | `0` |

### Outputs principales

- Valor futuro estimado.
- Ganancia o pérdida nominal.
- Plusvalía acumulada.
- Valor aportado por mejoras.
- Tabla anual.

---

## Fórmulas

```text
base = valor_actual + mejoras
tasa = plusvalia_anual / 100
valor_futuro = base * (1 + tasa)^años
ganancia_nominal = valor_futuro - base
plusvalia_acumulada = ((valor_futuro / base) - 1) * 100
```

Tabla anual:

```text
valor_año_n = base * (1 + tasa)^n
```

---

## Validaciones y estados

- Valor actual debe ser mayor que cero.
- Tasa debe ser mayor que `-100%`.
- Plazo entre 1 y 100 años.
- Permitir resultado menor al valor actual.
- Mostrar advertencia si tasa supera `20%`.
- No incluir inflación, impuestos o costos de venta en MVP.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de plusvalía estimada` |
| Meta description | `Proyecta el valor futuro de una propiedad con una tasa anual de plusvalía manual y consulta la ganancia acumulada.` |
| H1 | `Calculadora de plusvalía` |
| Keyword principal | `calculadora plusvalia` |
| Keywords secundarias | `plusvalia inmueble`, `valor futuro propiedad`, `apreciacion vivienda` |

### FAQs sugeridas

- ¿Cómo se calcula la plusvalía?
- ¿La plusvalía está garantizada?
- ¿Puedo usar una tasa negativa?
- ¿Las mejoras aumentan el valor?

---

## Pruebas sugeridas

- `$2,000,000`, `4%`, `10 años` produce aproximadamente `$2,960,488.57`.
- Tasa `0%` conserva el valor.
- Tasa negativa reduce valor.
- Mejoras se suman a la base.
- Tasa `-100%` muestra error.

