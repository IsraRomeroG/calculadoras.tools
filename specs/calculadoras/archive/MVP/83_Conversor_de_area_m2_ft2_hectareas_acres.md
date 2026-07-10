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
- Calcular el área a partir de largo y ancho para casos de inmuebles,
  construcción, terrenos y agricultura.
- Mostrar resultados simultáneos en todas las unidades.
- Incluir equivalencias y fórmulas.
- Evitar confundir unidades lineales con unidades cuadradas.
- Reducir fricción con conversiones rápidas para búsquedas frecuentes.
- Generar una página estática optimizada para SEO en Astro.

---

## Alcance recomendado

### MVP

- Dos modos: `Convertir superficie` y `Calcular desde medidas`.
- Valor y unidad origen para convertir una superficie existente.
- Largo, ancho y unidad lineal para calcular un área rectangular.
- Conversiones rápidas como chips: `m² a ft²`, `ft² a m²`,
  `ha a acres`, `acres a ha`, `m² a ha`.
- Resultados simultáneos.
- Unidad destino destacada.
- Permitir fijar como destacado cualquier resultado tocándolo o
  seleccionándolo.
- Copiar resultado y limpiar formulario.
- Tabla breve de equivalencias.
- Entrada numérica flexible para coma decimal, punto decimal y separadores
  comunes.

### Fase 2

- Añadir km², yd² y manzanas regionales con notas.
- Historial en `sessionStorage`.
- Comparar superficies con referencias contextuales configurables.

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

- La primera pantalla debe contener el modo, el campo principal y el resultado
  destacado sin requerir desplazamiento excesivo.
- Usar control segmentado para elegir entre `Convertir superficie` y
  `Calcular desde medidas`.
- En modo conversión: campo de valor, selector de unidad origen y chips de
  conversiones rápidas debajo.
- En modo medidas: campos `Largo` y `Ancho`, con selector compacto de unidad
  lineal compartida.
- Mostrar el resultado principal en una banda destacada y la lista de
  equivalencias debajo.
- Permitir tocar un resultado de la lista para fijarlo como destacado.
- Botones de copiar por resultado, con icono y etiqueta accesible.
- Unidades siempre visibles.
- No usar símbolos ambiguos sin etiqueta textual: mostrar `m² · metros
  cuadrados`, `ft² · pies cuadrados`, `ha · hectáreas`, `acre · acres`.
- Mantener fórmulas, decimales y equivalencias en secciones secundarias
  colapsables o de menor jerarquía visual.

---

## Flujo principal MVP

**Ejemplo:** Convertir `1 hectárea` a m², ft² y acres.

1. El usuario elige `Convertir superficie`.
2. Ingresa `1`.
3. Selecciona `ha · hectáreas`.
4. El resultado destacado puede ser `10,000 m²`.
5. La lista muestra también `107,639.1042 ft²` y `2.4711 acres`.

**Ejemplo:** Calcular un terreno de `20 m` por `15 m`.

1. El usuario elige `Calcular desde medidas`.
2. Ingresa largo `20` y ancho `15`.
3. Selecciona unidad lineal `m · metros`.
4. La herramienta calcula `300 m²`.
5. La lista muestra equivalencias en ft², hectáreas y acres.

### Inputs del MVP

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Modo | Control segmentado | `Convertir superficie`, `Calcular desde medidas` | `Convertir superficie` |
| Valor | Texto numérico | `>= 0` | vacío |
| Unidad origen | Selector | `m²`, `ft²`, `ha`, `acre` | `m²` |
| Largo | Texto numérico | `>= 0` | vacío |
| Ancho | Texto numérico | `>= 0` | vacío |
| Unidad lineal | Selector | `m`, `ft` | `m` |
| Unidad destacada | Selector | mismas unidades | `ft²` |
| Decimales | Selector | `0-8` | `4` |

En modo `Convertir superficie`, ocultar o deshabilitar `Largo`, `Ancho` y
`Unidad lineal`.

En modo `Calcular desde medidas`, ocultar o deshabilitar `Valor` y
`Unidad origen`. El área calculada se usa como valor base en m².

---

## Entrada numérica y formato

- Usar `inputmode="decimal"` en campos numéricos para mejorar el teclado móvil.
- Aceptar coma decimal (`1,5`) y punto decimal (`1.5`).
- Aceptar separadores comunes en miles cuando sean interpretables:
  `10,000`, `10 000` y `10000`.
- Normalizar internamente a número decimal antes de calcular.
- Mostrar resultados con `Intl.NumberFormat` usando locale `es-MX`.
- Evitar mostrar `NaN`, `Infinity` o errores técnicos al usuario.
- Si el valor no puede interpretarse, mostrar un error específico junto al
  campo afectado.

---

## Fórmulas

Usar m² como unidad base:

```text
1 ft² = 0.09290304 m²
1 ha = 10000 m²
1 acre = 4046.8564224 m²
1 ft = 0.3048 m
```

```text
metros_cuadrados = convertir_origen_a_m2(valor)
resultado = convertir_m2_a_destino(metros_cuadrados)
```

Para el modo `Calcular desde medidas`:

```text
largo_m = convertir_longitud_a_m(largo)
ancho_m = convertir_longitud_a_m(ancho)
metros_cuadrados = largo_m * ancho_m
resultado = convertir_m2_a_destino(metros_cuadrados)
```

No convertir áreas elevando una conversión lineal ingresada por el usuario. Las
equivalencias de área deben salir de factores definidos y probados.

---

## Validaciones y estados

- Aceptar cero.
- No aceptar valores negativos.
- Mostrar estado inicial vacío sin error hasta que el usuario interactúe.
- Validar cada campo visible según el modo activo.
- En modo medidas, permitir que uno de los campos esté vacío sin calcular hasta
  que existan largo y ancho válidos.
- Conservar precisión interna.
- Usar notación científica solo para valores extremos; cuando sea posible,
  ofrecer el resultado copiable en formato decimal completo.
- Mostrar errores amigables para valores no interpretables.
- Evitar resultados `NaN`, `Infinity` o redondeos que cambien el orden de
  magnitud.
- Aclarar que `m²` no se convierte elevando una conversión lineal ingresada por el usuario.

---

## Equivalencias y contexto

- Mostrar una tabla breve de equivalencias fijas:
  - `1 m² = 10.7639 ft²`
  - `1 ft² = 0.09290304 m²`
  - `1 ha = 10,000 m²`
  - `1 acre = 4,046.8564224 m²`
  - `1 ha ≈ 2.4711 acres`
  - `1 acre ≈ 0.4047 ha`
- Añadir una nota contextual breve cuando ayude a interpretar magnitudes, por
  ejemplo: `100 m²` suele ser una superficie común para vivienda o local
  pequeño/mediano, sin presentarlo como regla universal.
- Mantener el contexto como ayuda secundaria para no distraer del cálculo.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Conversor de área: m², ft², hectáreas y acres` |
| Meta description | `Convierte superficies entre metros cuadrados, pies cuadrados, hectáreas y acres, o calcula el área desde largo y ancho.` |
| H1 | `Conversor de área` |
| Keyword principal | `conversor de area` |
| Keywords secundarias | `m2 a ft2`, `hectareas a acres`, `acres a metros cuadrados` |

Contenido recomendado:

- Bloque breve de uso para convertir una superficie conocida.
- Bloque breve de uso para calcular área desde largo y ancho.
- Pregunta frecuente: diferencia entre metros y metros cuadrados.
- Pregunta frecuente: cuántos metros cuadrados tiene una hectárea.
- Pregunta frecuente: cuántos metros cuadrados tiene un acre.

---

## Pruebas sugeridas

- `1 ha` produce `10000 m²`.
- `1 acre` produce `4046.8564224 m²`.
- `1 ft²` produce `0.09290304 m²`.
- Conversión inversa conserva equivalencia.
- Valor negativo muestra error.
- `20 m * 15 m` produce `300 m²`.
- `10 ft * 10 ft` produce `9.290304 m²`.
- Entrada `1,5 ha` se interpreta como `1.5 ha`.
- Entrada vacía no muestra `NaN`.
- Cambiar decimales entre `0`, `2`, `4` y `8` no altera la precisión interna.
- Tocar o seleccionar un resultado cambia la unidad destacada.
- Copiar resultado devuelve número y unidad legibles.

