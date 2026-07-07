# Especificación v2 - Calculadora de volumen de concreto / cemento

## Descripción general

Herramienta mobile-first para estimar el volumen de concreto necesario para
losas, columnas, zapatas, vigas y formas cilíndricas. Debe convertir medidas
mixtas a metros cúbicos, sumar varias secciones de una obra y transformar el
resultado en una decisión accionable: cuánto concreto pedir por m³, cuántos
sacos comprar y, opcionalmente, cuánto costaría.

La calculadora debe dejar claro que el concreto no es lo mismo que el cemento:
el cemento es un componente, mientras que el concreto incluye cemento, arena,
grava y agua. En el MVP, la estimación de cemento se cubre mediante sacos o
rendimientos editables; la dosificación de materiales queda para una fase
posterior.

**Arquitectura:** todo el cálculo ocurre en el cliente. No requiere backend,
base de datos ni llamadas a APIs externas.

---

## Objetivo de producto

- Calcular volumen de concreto para elementos comunes de obra.
- Permitir medidas mixtas por dimensión, por ejemplo `5 m x 4 m x 10 cm`.
- Sumar varias secciones con nombre, forma, dimensiones y cantidad.
- Añadir porcentaje de desperdicio editable.
- Estimar pedido de concreto por m³ o sacos usando rendimientos editables.
- Mostrar un resultado principal accionable para compra o pedido.
- Calcular costo estimado opcional con precio por m³ o precio por saco.
- Generar una página estática optimizada para SEO en Astro.

---

## Alcance recomendado

### MVP

- Presets de elemento: `Losa`, `Columna rectangular`, `Columna circular`,
  `Viga` y `Otro`.
- Formas geométricas base: prisma rectangular y cilindro.
- Lista editable de secciones con nombre, duplicar, eliminar y cantidad.
- Unidades por dimensión: `m`, `cm`, `ft`, `in`.
- Desperdicio editable.
- Modo de estimación:
  - `Concreto por m³`.
  - `Sacos / premezclado`.
- Rendimiento por saco opcional en `m³/saco`.
- Precio opcional por `m³` o por saco.
- Resultado: volumen neto, volumen con desperdicio, pedido sugerido, sacos
  estimados, sobrante estimado y costo opcional.
- Copiar resumen, limpiar formulario y exportar CSV.

### Fase 2

- Zapata trapezoidal y escalones.
- Mezcla por proporciones.
- Estimación de cemento, arena, grava y agua.
- Presets de rendimiento por tipos de saco, siempre editables.
- Historial en `sessionStorage`.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL pública recomendada | `/construccion/calculadora-volumen-concreto-cemento` |
| Archivo Astro recomendado | `src/pages/construccion/calculadora-volumen-concreto-cemento.astro` |
| Lógica de cálculo | `src/lib/calculators/construccion/calculadora-volumen-concreto-cemento/concreteVolume.ts` |
| Pruebas unitarias | `src/lib/calculators/construccion/calculadora-volumen-concreto-cemento/concreteVolume.test.ts` |
| Categoría | `construccion` |
| Locale base | `es-MX` |

---

## Comportamiento mobile-first

- La calculadora debe aparecer como la experiencia principal, antes del
  contenido largo.
- El resultado principal debe verse pronto en mobile, idealmente como bloque
  superior compacto y/o barra sticky inferior:
  - `Pide 2.20 m³ de concreto`.
  - `Compra 110 sacos`.
  - `Costo estimado: $...`, si aplica.
- Mostrar volumen total antes del desglose.
- Cada sección debe editarse como bloque compacto y escaneable.
- Cada sección debe tener un resumen visible: nombre, forma, cantidad y volumen.
- Los controles de agregar, duplicar y eliminar deben ser claros; en mobile se
  recomiendan íconos con texto accesible o botones compactos.
- Unidades visibles en cada dimensión, no solo una unidad global.
- El espesor de losa debe poder capturarse en `cm` por defecto.
- Para cilindros, ocultar campos que no apliquen; no mostrar `espesor`.
- El rendimiento por saco debe explicarse como dato del fabricante.
- Los presets no deben impedir valores personalizados.
- No usar tarjetas dentro de tarjetas; reservar cards para secciones editables,
  resultados concretos y modales.
- Validar visualmente en 320 px, 360 px, 390 px y desktop sin desbordamiento
  horizontal ni solapamientos.

---

## Flujo principal MVP

**Ejemplo:** Losa de `5 m x 4 m x 10 cm` con `10%` de desperdicio.

1. El usuario elige preset `Losa`.
2. Captura `Largo = 5 m`, `Ancho = 4 m`, `Espesor = 10 cm`, `Cantidad = 1`.
3. Deja `Desperdicio = 10%`.
4. Elige modo `Concreto por m³` o `Sacos / premezclado`.
5. La calculadora muestra primero el pedido sugerido y después el desglose.

### Inputs del MVP

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Nombre de sección | Texto | 1-60 caracteres | `Losa 1` |
| Preset de elemento | Selector | `Losa`, `Columna rectangular`, `Columna circular`, `Viga`, `Otro` | `Losa` |
| Forma base | Selector derivado/editable | `Prisma rectangular`, `Cilindro` | Según preset |
| Largo / altura | Texto numérico + unidad | `> 0` | vacío |
| Ancho / diámetro | Texto numérico + unidad | `> 0` | vacío |
| Espesor / alto / fondo | Texto numérico + unidad | `> 0`, solo prisma | vacío |
| Unidad por dimensión | Selector | `m`, `cm`, `ft`, `in` | Según dimensión |
| Cantidad | Texto numérico entero | `1-10000` | `1` |
| Desperdicio (%) | Texto numérico | `0%-100%` | `10` |
| Modo de estimación | Selector | `Concreto por m³`, `Sacos / premezclado` | `Concreto por m³` |
| Rendimiento por saco (m³) | Texto numérico opcional | `> 0` | vacío |
| Precio por m³ | Texto numérico opcional | `>= 0` | vacío |
| Precio por saco | Texto numérico opcional | `>= 0` | vacío |

### Defaults recomendados por preset

| Preset | Forma base | Etiquetas | Unidades por defecto |
|--------|------------|-----------|----------------------|
| Losa | Prisma rectangular | Largo, ancho, espesor | `m`, `m`, `cm` |
| Columna rectangular | Prisma rectangular | Ancho, fondo, altura | `cm`, `cm`, `m` |
| Columna circular | Cilindro | Diámetro, altura | `cm`, `m` |
| Viga | Prisma rectangular | Largo, ancho, alto | `m`, `cm`, `cm` |
| Otro | Prisma rectangular | Largo, ancho, alto | `m`, `m`, `m` |

### Outputs principales

- Pedido sugerido como resultado principal:
  - `Pide X.XX m³ de concreto`, si el modo es concreto por m³.
  - `Compra N sacos`, si el modo es sacos/premezclado y hay rendimiento.
- Volumen neto en m³.
- Volumen con desperdicio en m³.
- Volumen en ft³ y yd³.
- Sacos estimados, si hay rendimiento por saco.
- Sobrante estimado, si el redondeo de sacos genera volumen comprado mayor al
  volumen requerido.
- Costo estimado, si hay precio por m³ o por saco.
- Desglose por sección con volumen individual, cantidad y porcentaje del total.

---

## Fórmulas

Todas las dimensiones deben convertirse a metros antes de calcular.

Conversiones de longitud:

```text
m = m
cm_a_m = cm / 100
ft_a_m = ft * 0.3048
in_a_m = in * 0.0254
```

Prisma rectangular:

```text
volumen = dimension_1_m * dimension_2_m * dimension_3_m * cantidad
```

Cilindro:

```text
radio = diametro_m / 2
volumen = PI * radio^2 * altura_m * cantidad
```

Totales:

```text
volumen_neto = suma(volumen_secciones)
volumen_total = volumen_neto * (1 + desperdicio / 100)
```

Sacos:

```text
sacos = ceil(volumen_total / rendimiento_por_saco)
volumen_comprado_sacos = sacos * rendimiento_por_saco
sobrante_sacos = max(0, volumen_comprado_sacos - volumen_total)
```

Costo:

```text
costo_concreto = volumen_total * precio_por_m3
costo_sacos = sacos * precio_por_saco
```

Conversiones de volumen:

```text
ft3 = m3 * 35.3146667
yd3 = m3 * 1.30795062
```

---

## Validaciones y estados

- Todas las dimensiones requeridas deben ser mayores que cero.
- Para cilindro, `diámetro` y `altura` son obligatorios; `espesor` no aplica.
- Cantidad debe ser entera positiva.
- Desperdicio puede ser cero.
- Rendimiento por saco es opcional; si falta, ocultar sacos y mostrar solo m³.
- Precio por m³ y precio por saco son opcionales; si faltan, ocultar costo.
- Redondear sacos hacia arriba.
- Mostrar advertencia para volúmenes muy grandes, por ejemplo `> 50 m³`.
- Mostrar advertencia si desperdicio es mayor a `30%`.
- Mostrar advertencia si el espesor de una losa parece inusual, por ejemplo
  menor a `5 cm` o mayor a `40 cm`.
- Mostrar advertencia si el rendimiento por saco parece inusual, por ejemplo
  menor a `0.005 m³` o mayor a `0.2 m³`.
- El resumen debe aclarar que es una estimación orientativa y que elementos
  estructurales pueden requerir revisión técnica.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de volumen de concreto y cemento` |
| Meta description | `Calcula metros cúbicos de concreto para losas, columnas, vigas y zapatas, con desperdicio, sacos estimados y costo opcional.` |
| H1 | `Calculadora de concreto` |
| Keyword principal | `calculadora concreto` |
| Keywords secundarias | `volumen concreto`, `metros cubicos cemento`, `sacos de concreto`, `calcular concreto para losa` |

### FAQs sugeridas

- ¿Cómo calculo metros cúbicos de concreto?
- ¿Cuánto desperdicio debo agregar al concreto?
- ¿Cómo se calcula concreto para una losa?
- ¿Cómo se calcula concreto para una columna circular?
- ¿Cómo sé el rendimiento por saco?
- ¿Cemento y concreto son lo mismo?
- ¿La calculadora estima arena y grava?
- ¿Puedo usar centímetros para el espesor y metros para largo y ancho?

---

## Pruebas sugeridas

- `5 m x 4 m x 0.1 m` produce `2 m³`.
- `5 m x 4 m x 10 cm` produce `2 m³`.
- `10%` de desperdicio sobre `2 m³` produce `2.2 m³`.
- Cilindro usa diámetro/2 como radio.
- Cilindro no requiere ni usa espesor.
- Rendimiento por saco redondea hacia arriba.
- Sobrante por sacos se calcula cuando el volumen comprado supera el requerido.
- Precio por m³ calcula costo sobre volumen con desperdicio.
- Precio por saco calcula costo sobre sacos redondeados.
- Conversión de cm, ft e in a m conserva volumen esperado.
- Preset `Losa` usa espesor en cm por defecto.
- Preset `Columna circular` muestra diámetro y altura, no ancho/espesor.
