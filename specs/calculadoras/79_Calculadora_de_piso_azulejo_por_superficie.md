# Especificación v2 - Calculadora de piso / azulejo por superficie

## Descripción general

Herramienta mobile-first para estimar cuántas piezas, cajas y metros cuadrados
de piso, azulejo, loseta, cerámica o porcelanato se necesitan para cubrir una
superficie. La calculadora debe considerar superficies y descuentos, desperdicio
editable, rendimiento por caja, sobrante estimado y costo opcional.

El resultado principal debe ser una decisión de compra clara: **cuántas cajas
comprar**. El desglose debe explicar cómo se llegó a ese número y qué sobrante
queda como reserva.

**Arquitectura:** todo el cálculo ocurre en el cliente. No requiere backend,
base de datos ni llamadas a APIs externas.

---

## Objetivo de producto

- Calcular superficie bruta, descuentos y superficie neta a cubrir.
- Permitir capturar superficies por dimensiones rectangulares o por área directa.
- Normalizar unidades: superficies en `m` o `m²`, piezas en `cm`.
- Estimar piezas necesarias según tamaño de pieza y área de compra.
- Estimar cajas usando piezas por caja o `m²` por caja.
- Sugerir desperdicio según patrón de colocación, pero mantenerlo editable.
- Mostrar sobrante estimado en piezas y/o `m²`.
- Calcular costo total opcional y costo aproximado por `m²`.
- Generar una página estática optimizada para SEO en Astro.

---

## Alcance recomendado

### MVP

- Lista de superficies a cubrir:
  - Modo dimensiones: largo, ancho y cantidad.
  - Modo área directa: `m²` y cantidad.
- Lista opcional de áreas a descontar:
  - Modo dimensiones: largo, ancho y cantidad.
  - Modo área directa: `m²` y cantidad.
- Etiqueta opcional por superficie o descuento, por ejemplo `Baño`, `Cocina`,
  `Ventana` o `Puerta`.
- Dimensiones de pieza en centímetros.
- Selector de patrón con desperdicio sugerido:
  - Recto: `10%`.
  - Diagonal: `15%`.
  - Espiga: `18%`.
  - Muchos cortes / área irregular: `20%`.
  - Personalizado: no cambia el valor capturado.
- Desperdicio editable de `0%` a `100%`.
- Modo de caja:
  - Piezas por caja.
  - `m²` por caja.
- Precio por caja opcional.
- Resultado principal: cajas a comprar.
- Desglose: área neta, área con desperdicio, piezas requeridas, cobertura
  comprada, sobrante estimado y costo opcional.
- Advertencias útiles para evitar subcompras o datos poco probables.
- Copiar resumen, limpiar formulario y exportar CSV.

### Fase 2

- Zoclo/rodapié con metros lineales, desperdicio y costo opcional.
- Adhesivo/pegazulejo con rendimiento editable por saco.
- Boquilla/junta con rendimiento editable o cálculo aproximado por ancho de junta.
- Historial en `sessionStorage`.
- URL compartible con parámetros del cálculo.
- Comparador de productos, por ejemplo dos piezas o cajas con distintos precios.
- Exportación a PDF o resumen imprimible.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL pública recomendada | `/construccion/calculadora-piso-azulejo-superficie` |
| Archivo Astro recomendado | `src/pages/construccion/calculadora-piso-azulejo-superficie.astro` |
| Lógica de cálculo | `src/lib/calculators/construccion/calculadora-piso-azulejo-superficie/tiles.ts` |
| Pruebas unitarias | `src/lib/calculators/construccion/calculadora-piso-azulejo-superficie/tiles.test.ts` |
| Categoría | `construccion` |
| Locale base | `es-MX` |

---

## Comportamiento mobile-first

- La primera pantalla debe ser la calculadora usable, no una landing extensa.
- En móvil, ordenar el flujo así:
  1. Resultado compacto o estado neutral.
  2. Superficies a cubrir.
  3. Descuentos.
  4. Pieza.
  5. Patrón y desperdicio.
  6. Caja y costo.
- Cuando exista un resultado válido, mostrar una barra inferior fija con:
  - `Comprar X cajas`.
  - Costo total si hay precio por caja.
  - Botón para ir al desglose.
- La barra inferior debe respetar safe areas y no tapar acciones ni mensajes.
- En desktop, usar un layout de dos columnas: formulario a la izquierda y
  resultado fijo o sticky a la derecha.
- Superficies y descuentos deben verse como bloques editables, con acciones de
  agregar, duplicar y eliminar.
- Usar controles segmentados para modo de superficie, modo de caja y patrón.
- Cada input debe mostrar su unidad visible: `m`, `m²`, `cm`, `%`, `$`.
- Los inputs numéricos deben usar `inputmode="decimal"` o `numeric` según aplique.
- Aceptar punto o coma decimal en la captura, normalizando internamente.
- El resultado principal debe priorizar compra; piezas, área y sobrante van como
  desglose secundario.
- El diseño debe evitar tarjetas anidadas y mantener textos cortos para pantallas
  estrechas.

---

## Flujo principal MVP

**Ejemplo:** Habitación de `4 m x 5 m`, piezas de `60 cm x 60 cm`, patrón recto,
`10%` de desperdicio y `4 piezas` por caja.

Resultado esperado del ejemplo:

- Área neta: `20 m²`.
- Área con desperdicio: `22 m²`.
- Área por pieza: `0.36 m²`.
- Piezas requeridas: `62`.
- Cajas a comprar: `16`.
- Piezas compradas: `64`.
- Cobertura comprada: `23.04 m²`.
- Sobrante estimado: `2 piezas` o `1.04 m²`.

### Inputs del MVP

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Modo de superficie | Selector | `Dimensiones`, `Área directa` | `Dimensiones` |
| Nombre de superficie | Texto opcional | `1-40` caracteres | vacío |
| Largo de superficie | Texto numérico, `m` | `> 0` | vacío |
| Ancho de superficie | Texto numérico, `m` | `> 0` | vacío |
| Área directa de superficie | Texto numérico, `m²` | `> 0` | vacío |
| Cantidad de superficies | Texto numérico entero | `1-1000` | `1` |
| Modo de descuento | Selector | `Dimensiones`, `Área directa` | `Dimensiones` |
| Nombre de descuento | Texto opcional | `1-40` caracteres | vacío |
| Largo de descuento | Texto numérico, `m` | `> 0` | vacío |
| Ancho de descuento | Texto numérico, `m` | `> 0` | vacío |
| Área directa de descuento | Texto numérico, `m²` | `> 0` | vacío |
| Cantidad de descuentos | Texto numérico entero | `1-1000` | `1` |
| Largo de pieza | Texto numérico, `cm` | `> 0` | vacío |
| Ancho de pieza | Texto numérico, `cm` | `> 0` | vacío |
| Patrón de colocación | Selector | `Recto`, `Diagonal`, `Espiga`, `Muchos cortes`, `Personalizado` | `Recto` |
| Desperdicio (%) | Texto numérico | `0%-100%` | `10` |
| Modo de caja | Selector | `Piezas por caja`, `m² por caja` | `Piezas por caja` |
| Piezas por caja | Texto numérico entero | `> 0` | vacío |
| m² por caja | Texto numérico | `> 0` | vacío |
| Precio por caja | Texto numérico opcional | `>= 0` | vacío |

### Outputs principales

- Cajas a comprar.
- Costo total opcional.
- Área neta.
- Área con desperdicio.
- Piezas requeridas.
- Piezas compradas, cuando el modo de caja lo permita.
- Cobertura comprada en `m²`.
- Sobrante estimado en `m²`.
- Sobrante estimado en piezas, exacto en modo piezas por caja y aproximado en
  modo `m²` por caja.
- Costo aproximado por `m²` neto y por `m²` comprado, si hay precio.
- Advertencias y supuestos usados.

---

## Reglas de desperdicio sugerido

El patrón solo debe sugerir el desperdicio. El usuario siempre puede editarlo.

| Patrón | Desperdicio sugerido |
|--------|----------------------|
| Recto | `10%` |
| Diagonal | `15%` |
| Espiga | `18%` |
| Muchos cortes / área irregular | `20%` |
| Personalizado | Mantener valor actual |

Si el usuario ya modificó manualmente el desperdicio, cambiar el patrón no debe
sobrescribir el valor sin una acción explícita. Puede mostrarse una nota breve
como `Sugerido para diagonal: 15%`.

---

## Fórmulas

### Normalización de unidades

```text
largo_pieza_m = largo_pieza_cm / 100
ancho_pieza_m = ancho_pieza_cm / 100
area_pieza_m2 = largo_pieza_m * ancho_pieza_m
```

### Superficies y descuentos

```text
area_superficie_rectangular = largo_m * ancho_m * cantidad
area_superficie_directa = area_m2 * cantidad
area_bruta = suma(areas_superficie)

area_descuento_rectangular = largo_descuento_m * ancho_descuento_m * cantidad
area_descuento_directa = area_descuento_m2 * cantidad
area_descuentos = suma(areas_descuento)

area_neta = max(0, area_bruta - area_descuentos)
area_compra = area_neta * (1 + desperdicio / 100)
piezas_requeridas = ceil(area_compra / area_pieza_m2)
```

### Cajas por piezas

```text
cajas = ceil(piezas_requeridas / piezas_por_caja)
piezas_compradas = cajas * piezas_por_caja
cobertura_comprada_m2 = piezas_compradas * area_pieza_m2
sobrante_piezas = piezas_compradas - piezas_requeridas
sobrante_m2 = max(0, cobertura_comprada_m2 - area_compra)
```

### Cajas por m²

```text
cajas = ceil(area_compra / m2_por_caja)
cobertura_comprada_m2 = cajas * m2_por_caja
sobrante_m2 = max(0, cobertura_comprada_m2 - area_compra)
piezas_compradas_estimadas = floor(cobertura_comprada_m2 / area_pieza_m2)
sobrante_piezas_estimadas = max(0, piezas_compradas_estimadas - piezas_requeridas)
```

En modo `m² por caja`, las piezas sobrantes deben etiquetarse como estimadas,
porque el dato confiable de compra es la cobertura en `m²`.

### Costo

```text
costo_total = cajas * precio_por_caja
costo_por_m2_neto = costo_total / area_neta
costo_por_m2_comprado = costo_total / cobertura_comprada_m2
```

Si no hay precio por caja, ocultar los campos de costo. Si `area_neta` o
`cobertura_comprada_m2` son cero, no calcular el costo por `m²`.

### Comprobación opcional por acomodo rectangular

El cálculo principal usa área, que es el método más común para compra. Para
superficies rectangulares muy estrechas, se puede mostrar una advertencia si el
cálculo por acomodo simple sugiere más piezas sin desperdicio:

```text
columnas = ceil(largo_superficie_m / largo_pieza_m)
filas = ceil(ancho_superficie_m / ancho_pieza_m)
piezas_acomodo_rectangular = columnas * filas * cantidad
```

Esta comprobación no debe simular cortes ni reutilización de recortes. Su uso
principal es advertir al usuario cuando el cálculo por área puede quedarse corto
en franjas, escalones, pasillos estrechos o piezas grandes.

---

## Validaciones y estados

- Debe existir al menos una superficie válida.
- Dimensiones de superficies y descuentos deben ser mayores que cero cuando se
  use modo dimensiones.
- Área directa debe ser mayor que cero cuando se use modo área directa.
- Cantidad debe ser entero positivo.
- Área descontada mayor al área bruta muestra advertencia y el área neta queda
  en cero.
- Largo y ancho de pieza deben ser mayores que cero.
- `m² por caja` debe ser mayor que cero.
- Piezas por caja debe ser entero positivo.
- Precio por caja debe ser mayor o igual que cero cuando exista.
- Desperdicio puede ser cero, pero no puede superar `100%`.
- Desperdicio mayor a `30%` muestra advertencia no bloqueante.
- Si `m² por caja` es menor que el área de una pieza, mostrar advertencia fuerte.
- Si el sobrante es menor que una pieza completa o muy cercano a cero, sugerir
  revisar si conviene comprar una caja extra para reposiciones.
- Si una pieza es muy grande respecto a una superficie estrecha, mostrar
  advertencia de cortes.
- Redondear piezas y cajas siempre hacia arriba.
- Mostrar estado neutral cuando faltan datos: `Completa superficie, pieza y caja
  para calcular`.
- Mostrar que el resultado es una estimación y que el consumo real puede variar
  por cortes, nivelación, piezas rotas, lote/tono y patrón de colocación.

---

## Copiar resumen y CSV

El resumen copiable debe incluir:

- Cajas a comprar.
- Costo total, si hay precio.
- Área neta y área con desperdicio.
- Piezas requeridas.
- Cobertura comprada y sobrante.
- Patrón y desperdicio usados.
- Tamaño de pieza.
- Rendimiento de caja.

El CSV debe incluir entradas, resultados y supuestos principales. Debe ser útil
para llevarlo a tienda o compartirlo por mensaje.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de piso y azulejo por superficie` |
| Meta description | `Calcula cuántas cajas de piso, loseta o azulejo necesitas según superficie, tamaño de pieza, desperdicio y rendimiento por caja.` |
| H1 | `Calculadora de piso y azulejo` |
| Keyword principal | `calculadora piso azulejo` |
| Keywords secundarias | `cuantas cajas de piso necesito`, `calculadora de loseta`, `azulejos por metro cuadrado`, `calcular porcelanato`, `calcular cerámica por m2` |

### FAQs sugeridas

- ¿Cuánto desperdicio agregar al piso o azulejo?
- ¿Qué desperdicio usar para patrón diagonal o espiga?
- ¿Cómo calculo piezas por metro cuadrado?
- ¿Cómo calcular cajas necesarias?
- ¿Qué significa rendimiento por caja?
- ¿Puedo descontar puertas, ventanas o áreas sin azulejo?
- ¿Por qué conviene comprar piezas del mismo lote o tono?
- ¿Qué hago si mi habitación es irregular?

---

## Pruebas sugeridas

- `4 m x 5 m` produce `20 m²` de área neta sin descuentos.
- Pieza de `60 cm x 60 cm` calcula área de `0.36 m²`.
- `10%` de desperdicio sobre `20 m²` produce `22 m²`.
- `22 m²` con pieza de `0.36 m²` produce `62` piezas requeridas.
- `62` piezas con `4` piezas por caja produce `16` cajas.
- `16` cajas con `4` piezas por caja produce `64` piezas compradas.
- `64` piezas de `0.36 m²` producen `23.04 m²` de cobertura comprada.
- Sobrante del ejemplo: `2` piezas y `1.04 m²`.
- Modo `m² por caja` con `1.44 m²` por caja también produce `16` cajas para el
  ejemplo.
- Área directa de `20 m²` produce el mismo resultado que `4 m x 5 m`.
- Descuentos reducen el área neta.
- Descuentos mayores al área bruta devuelven área neta cero y advertencia.
- Desperdicio mayor a `30%` muestra advertencia.
- Cambiar patrón sugiere desperdicio, pero no sobrescribe un valor editado
  manualmente.
- Precio por caja calcula costo total.
- Si falta rendimiento de caja, mostrar estado neutral o error de campo.
- Si `m² por caja` es menor que el área de una pieza, mostrar advertencia fuerte.
- El CSV incluye entradas, resultados y supuestos usados.
