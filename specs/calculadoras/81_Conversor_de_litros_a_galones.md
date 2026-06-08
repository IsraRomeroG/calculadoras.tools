# Especificación v1 - Conversor de litros a galones

## Descripción general

Herramienta para convertir volumen entre litros, galones estadounidenses y
galones imperiales. Debe evitar la ambigüedad entre ambos tipos de galón y
mostrar equivalencias útiles.

**Arquitectura:** todo el cálculo ocurre en el cliente. No requiere backend,
base de datos ni llamadas a APIs externas.

---

## Objetivo de producto

- Convertir litros a galones US e imperiales.
- Convertir galones a litros.
- Mostrar claramente el tipo de galón seleccionado.
- Incluir equivalencias frecuentes y fórmula.
- Generar una página estática optimizada para SEO en Astro.

---

## Alcance recomendado

### MVP

- Valor de entrada.
- Unidad origen y destino.
- Conversión inmediata.
- Intercambiar unidades.
- Copiar resultado y limpiar formulario.
- Tabla breve de equivalencias.

### Fase 2

- Añadir mililitros, cuartos y pintas.
- Historial en `sessionStorage`.
- Conversión múltiple simultánea.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL pública recomendada | `/conversores/litros-a-galones` |
| Archivo Astro recomendado | `src/pages/conversores/litros-a-galones.astro` |
| Lógica de cálculo | `src/lib/calculators/conversores/litros-a-galones/litersGallons.ts` |
| Pruebas unitarias | `src/lib/calculators/conversores/litros-a-galones/litersGallons.test.ts` |
| Categoría | `conversores` |
| Locale base | `es-MX` |

---

## Comportamiento mobile-first

- Valor y unidades visibles en el primer viewport.
- Botón de intercambiar con icono y tooltip.
- Resultado principal grande y equivalencias secundarias.
- Mostrar siempre `galón US` o `galón imperial`, nunca solo `galón`.
- Mantener dimensiones estables al cambiar unidades.

---

## Flujo principal MVP

**Ejemplo:** Convertir `10 litros` a galones estadounidenses e imperiales.

### Inputs del MVP

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Valor | Texto numérico | `>= 0` | vacío |
| Unidad origen | Selector | `L`, `gal US`, `gal imperial` | `L` |
| Unidad destino | Selector | `L`, `gal US`, `gal imperial` | `gal US` |
| Decimales | Selector | `0-8` | `4` |

### Outputs principales

- Resultado convertido.
- Equivalencias en las otras unidades.
- Fórmula usada.
- Valor inverso por unidad.

---

## Fórmulas

Usar litros como unidad base:

```text
1 galon_US = 3.785411784 L
1 galon_imperial = 4.54609 L
```

```text
litros = convertir_origen_a_litros(valor)
resultado = convertir_litros_a_destino(litros)
```

---

## Validaciones y estados

- Aceptar cero.
- No aceptar valores negativos.
- Aceptar coma o punto decimal.
- Conservar precisión interna y redondear solo la presentación.
- Si origen y destino son iguales, devolver el mismo valor.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Litros a galones - Conversor US e imperial` |
| Meta description | `Convierte litros a galones estadounidenses o imperiales y galones a litros con fórmulas y equivalencias claras.` |
| H1 | `Conversor de litros a galones` |
| Keyword principal | `litros a galones` |
| Keywords secundarias | `galones a litros`, `galon americano`, `galon imperial` |

---

## Pruebas sugeridas

- `3.785411784 L` produce `1 gal US`.
- `4.54609 L` produce `1 gal imperial`.
- Conversión inversa conserva equivalencia.
- Cero produce cero.
- Valor negativo muestra error.

