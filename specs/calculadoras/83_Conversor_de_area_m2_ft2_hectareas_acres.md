# Especificación v1 - Conversor de área: m², ft², hectáreas y acres

## Descripción general

Herramienta para convertir superficies entre metros cuadrados, pies cuadrados,
hectáreas y acres. Debe ser útil para inmuebles, terrenos, construcción y
agricultura.

**Arquitectura:** todo el cálculo ocurre en el cliente. No requiere backend,
base de datos ni llamadas a APIs externas.

---

## Objetivo de producto

- Convertir áreas entre unidades métricas e imperiales.
- Mostrar resultados simultáneos en todas las unidades.
- Incluir equivalencias y fórmulas.
- Evitar confundir unidades lineales con unidades cuadradas.
- Generar una página estática optimizada para SEO en Astro.

---

## Alcance recomendado

### MVP

- Valor y unidad origen.
- Resultados simultáneos.
- Unidad destino destacada.
- Copiar resultado y limpiar formulario.
- Tabla breve de equivalencias.

### Fase 2

- Añadir km², yd² y manzanas regionales con notas.
- Calcular área desde largo y ancho.
- Historial en `sessionStorage`.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL pública recomendada | `/conversores/conversor-de-area-m2-ft2-hectareas-acres` |
| Archivo Astro recomendado | `src/pages/conversores/conversor-de-area-m2-ft2-hectareas-acres.astro` |
| Lógica de cálculo | `src/lib/calculators/conversores/conversor-de-area-m2-ft2-hectareas-acres/area.ts` |
| Pruebas unitarias | `src/lib/calculators/conversores/conversor-de-area-m2-ft2-hectareas-acres/area.test.ts` |
| Categoría | `conversores` |
| Locale base | `es-MX` |

---

## Comportamiento mobile-first

- Resultado destacado y lista de equivalencias debajo.
- Selector de origen compacto.
- Botones de copiar por resultado.
- Unidades siempre visibles.
- No usar símbolos ambiguos sin etiqueta textual.

---

## Flujo principal MVP

**Ejemplo:** Convertir `1 hectárea` a m², ft² y acres.

### Inputs del MVP

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Valor | Texto numérico | `>= 0` | vacío |
| Unidad origen | Selector | `m²`, `ft²`, `ha`, `acre` | `m²` |
| Unidad destacada | Selector | mismas unidades | `ft²` |
| Decimales | Selector | `0-8` | `4` |

---

## Fórmulas

Usar m² como unidad base:

```text
1 ft² = 0.09290304 m²
1 ha = 10000 m²
1 acre = 4046.8564224 m²
```

```text
metros_cuadrados = convertir_origen_a_m2(valor)
resultado = convertir_m2_a_destino(metros_cuadrados)
```

---

## Validaciones y estados

- Aceptar cero.
- No aceptar valores negativos.
- Conservar precisión interna.
- Mostrar notación científica para valores extremos.
- Aclarar que `m²` no se convierte elevando una conversión lineal ingresada por el usuario.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Conversor de área: m², ft², hectáreas y acres` |
| Meta description | `Convierte superficies entre metros cuadrados, pies cuadrados, hectáreas y acres con equivalencias precisas.` |
| H1 | `Conversor de área` |
| Keyword principal | `conversor de area` |
| Keywords secundarias | `m2 a ft2`, `hectareas a acres`, `acres a metros cuadrados` |

---

## Pruebas sugeridas

- `1 ha` produce `10000 m²`.
- `1 acre` produce `4046.8564224 m²`.
- `1 ft²` produce `0.09290304 m²`.
- Conversión inversa conserva equivalencia.
- Valor negativo muestra error.

