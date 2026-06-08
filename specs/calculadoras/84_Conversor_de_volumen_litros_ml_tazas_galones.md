# Especificación v1 - Conversor de volumen: litros, ml, tazas y galones

## Descripción general

Herramienta para convertir volumen entre litros, mililitros, tazas y galones.
Debe distinguir tazas y galones estadounidenses de variantes imperiales cuando
corresponda.

**Arquitectura:** todo el cálculo ocurre en el cliente. No requiere backend,
base de datos ni llamadas a APIs externas.

---

## Objetivo de producto

- Convertir unidades cotidianas de volumen.
- Mostrar simultáneamente equivalencias principales.
- Distinguir taza US, taza métrica, galón US y galón imperial.
- Complementar el conversor culinario sin depender de ingredientes.
- Generar una página estática optimizada para SEO en Astro.

---

## Alcance recomendado

### MVP

- Litros, ml, taza US, taza métrica, galón US e imperial.
- Valor y unidad origen.
- Resultado destacado y equivalencias.
- Copiar resultado, intercambiar unidades y limpiar formulario.

### Fase 2

- Cucharadas, cucharaditas, pintas y cuartos.
- Presets culinarios regionales.
- Historial en `sessionStorage`.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL pública recomendada | `/conversores/conversor-de-volumen` |
| Archivo Astro recomendado | `src/pages/conversores/conversor-de-volumen.astro` |
| Lógica de cálculo | `src/lib/calculators/conversores/conversor-de-volumen/volume.ts` |
| Pruebas unitarias | `src/lib/calculators/conversores/conversor-de-volumen/volume.test.ts` |
| Categoría | `conversores` |
| Locale base | `es-MX` |

---

## Comportamiento mobile-first

- Mostrar siempre variante regional en tazas y galones.
- Resultado principal antes de lista de equivalencias.
- Botón de intercambiar unidades.
- Evitar una cuadrícula demasiado densa en móvil.
- Mantener números y unidades sin salto incoherente.

---

## Flujo principal MVP

**Ejemplo:** Convertir `2 litros` a ml, tazas US y galones US.

### Inputs del MVP

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Valor | Texto numérico | `>= 0` | vacío |
| Unidad origen | Selector | unidades disponibles | `L` |
| Unidad destino | Selector | unidades disponibles | `ml` |
| Decimales | Selector | `0-8` | `4` |

---

## Fórmulas

Usar mililitros como unidad base:

```text
1 L = 1000 ml
1 taza_US = 236.5882365 ml
1 taza_metrica = 250 ml
1 galon_US = 3785.411784 ml
1 galon_imperial = 4546.09 ml
```

```text
mililitros = convertir_origen_a_ml(valor)
resultado = convertir_ml_a_destino(mililitros)
```

---

## Validaciones y estados

- Aceptar cero.
- No aceptar negativos.
- Mostrar tipo de taza/galón en cada resultado.
- Conservar precisión interna.
- Si origen y destino son iguales, devolver el valor original.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Conversor de volumen: litros, ml, tazas y galones` |
| Meta description | `Convierte litros, mililitros, tazas métricas o US y galones estadounidenses o imperiales.` |
| H1 | `Conversor de volumen` |
| Keyword principal | `conversor volumen` |
| Keywords secundarias | `litros a tazas`, `ml a litros`, `galones a litros` |

---

## Pruebas sugeridas

- `1 L` produce `1000 ml`.
- `1 taza US` produce `236.5882365 ml`.
- `1 taza métrica` produce `250 ml`.
- Variantes de galón producen resultados distintos.
- Conversión inversa conserva equivalencia.

