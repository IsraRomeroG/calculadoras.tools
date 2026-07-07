# Especificación v2 - Calculadora de cantidad de ladrillos

## Descripción general

Herramienta mobile-first para estimar cuántos ladrillos, bloques o piezas de
mampostería se necesitan para construir uno o varios muros, considerando juntas,
aberturas, desperdicio, costo opcional y una estimación simple de mortero.

La calculadora debe ser útil para una compra preliminar de material, pero debe
mostrar que el resultado es una estimación y que el rendimiento real puede variar
por aparejo, cortes, esquinas, tipo de pieza, técnica de colocación y condiciones
de obra.

**Arquitectura:** todo el cálculo ocurre en el cliente. No requiere backend,
base de datos ni llamadas a APIs externas.

---

## Objetivo de producto

- Calcular área bruta, área de aberturas y área neta de muros.
- Estimar piezas según dimensiones reales de la pieza y espesor de junta.
- Permitir captura rápida con presets de ladrillos y bloques comunes.
- Añadir porcentaje de desperdicio editable.
- Estimar costo total cuando el usuario indique precio por pieza.
- Ofrecer una estimación opcional de mortero en volumen aproximado.
- Entregar un resumen fácil de copiar, exportar o revisar en móvil.
- Generar una página estática optimizada para SEO en Astro.

---

## Alcance recomendado

### MVP

- Lista de muros.
- Lista de aberturas.
- Selector de preset de pieza con opción personalizada.
- Dimensiones reales del ladrillo/bloque sin junta.
- Espesor de junta horizontal y vertical.
- Desperdicio editable.
- Precio opcional por pieza.
- Piezas por paquete opcional para redondear compra por paquetes.
- Estimación simple de mortero opcional.
- Resultado: piezas netas, piezas a comprar, paquetes sugeridos y costo total
  cuando aplique.
- Copiar resumen, limpiar formulario y exportar CSV.

### Fuera del MVP

- Cálculo estructural o cumplimiento normativo.
- Dosificación exacta de mortero por resistencia o mezcla.
- Cálculo de mano de obra.
- Cotización por proveedor o inventario local.
- Geometrías complejas fuera de muros rectangulares y aberturas rectangulares.

### Fase 2

- Tipos de aparejo/patrón con factor de ajuste.
- Muros con doble hoja o varias capas.
- Esquinas, castillos, dalas y refuerzos como deducciones o ajustes.
- Historial en `sessionStorage`.
- Compartir enlace con parámetros.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL pública recomendada | `/construccion/calculadora-cantidad-ladrillos` |
| Archivo Astro recomendado | `src/pages/construccion/calculadora-cantidad-ladrillos.astro` |
| Lógica de cálculo | `src/lib/calculators/construccion/calculadora-cantidad-ladrillos/bricks.ts` |
| Pruebas unitarias | `src/lib/calculators/construccion/calculadora-cantidad-ladrillos/bricks.test.ts` |
| Categoría | `construccion` |
| Locale base | `es-MX` |

---

## Comportamiento mobile-first

- La calculadora debe aparecer como primera experiencia útil de la página.
- En móvil, el flujo debe ser: resumen de resultado, muros, aberturas, pieza,
  ajustes y acciones.
- El resultado principal debe ser `piezas a comprar` y mantenerse visible cerca
  del formulario, idealmente en una banda compacta o bloque sticky cuando no
  interfiera con la captura.
- Muros y aberturas deben mostrarse como bloques editables apilados, no como
  tabla rígida.
- Los campos deben agruparse por intención: `Muros`, `Aberturas`, `Pieza`,
  `Compra` y `Mortero opcional`.
- Usar controles compactos: botones para añadir/eliminar muros, selector de
  preset, checkboxes para opciones y campos numéricos con unidad visible.
- Las unidades deben ser claras junto a cada dimensión. Muros y aberturas usan
  metros por defecto; pieza y juntas usan centímetros por defecto.
- Los presets no deben impedir valores personalizados.
- Mostrar área neta antes del cálculo de piezas para que el usuario pueda
  detectar errores de captura.
- No debe haber scroll horizontal en pantallas pequeñas.

---

## Flujo principal MVP

**Ejemplo:** Muro de `5 m x 2.5 m`, con una puerta de `0.9 m x 2.1 m`, usando
ladrillos de `20 cm x 10 cm`, junta de `1 cm`, `10%` de desperdicio y precio
opcional de `$8` por pieza.

### Inputs del MVP

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Ancho de muro | Texto numérico | `> 0` | vacío |
| Alto de muro | Texto numérico | `> 0` | vacío |
| Cantidad de muros | Texto numérico entero | `1-1000` | `1` |
| Ancho de abertura | Texto numérico opcional | `> 0` | vacío |
| Alto de abertura | Texto numérico opcional | `> 0` | vacío |
| Cantidad de aberturas | Texto numérico entero | `1-1000` | `1` |
| Preset de pieza | Selector | preset válido o `personalizado` | `personalizado` |
| Largo real de pieza | Texto numérico | `> 0` | según preset o vacío |
| Alto real de pieza | Texto numérico | `> 0` | según preset o vacío |
| Espesor real de pieza | Texto numérico opcional | `> 0` | según preset o vacío |
| Junta horizontal | Texto numérico | `>= 0` | `1 cm` |
| Junta vertical | Texto numérico | `>= 0` | `1 cm` |
| Desperdicio (%) | Texto numérico | `0%-100%` | `10` |
| Precio por pieza | Texto numérico opcional | `>= 0` | vacío |
| Piezas por paquete | Texto numérico entero opcional | `>= 1` | vacío |
| Estimar mortero | Checkbox | `true/false` | `false` |
| Desperdicio de mortero (%) | Texto numérico | `0%-100%` | `10` |

### Presets iniciales sugeridos

Los presets deben ser editables después de seleccionarse. La implementación
puede ajustar nombres y medidas según el mercado objetivo, pero debe conservar
la opción personalizada.

| Preset | Largo | Alto | Espesor | Nota |
|--------|-------|------|---------|------|
| Ladrillo/tabique personalizado | vacío | vacío | vacío | Captura libre |
| Ladrillo rojo común | `20 cm` | `10 cm` | `6 cm` | Referencia genérica |
| Block 10 | `40 cm` | `20 cm` | `10 cm` | Bloque de concreto |
| Block 12 | `40 cm` | `20 cm` | `12 cm` | Bloque de concreto |
| Block 15 | `40 cm` | `20 cm` | `15 cm` | Bloque de concreto |
| Block 20 | `40 cm` | `20 cm` | `20 cm` | Bloque de concreto |

### Outputs principales

- Área bruta de muros.
- Área de aberturas.
- Área neta.
- Piezas por m².
- Piezas netas.
- Piezas a comprar con desperdicio.
- Paquetes sugeridos, si se indicó piezas por paquete.
- Costo estimado, si se indicó precio por pieza.
- Mortero aproximado, si se activó la opción.
- Advertencias y supuestos usados.

---

## Fórmulas

Todas las dimensiones deben normalizarse internamente a metros antes de calcular.
Las dimensiones de pieza son medidas reales sin junta. La junta se suma para
obtener el módulo de colocación.

```text
area_muros = suma(ancho_muro * alto_muro * cantidad)
area_aberturas = suma(ancho_abertura * alto_abertura * cantidad)
area_neta = max(0, area_muros - area_aberturas)
```

Módulo de pieza incluyendo junta:

```text
modulo_ancho = largo_pieza + junta_vertical
modulo_alto = alto_pieza + junta_horizontal
area_modulo = modulo_ancho * modulo_alto
piezas_por_m2 = 1 / area_modulo
piezas_netas = ceil(area_neta / area_modulo)
piezas_compra = ceil(piezas_netas * (1 + desperdicio / 100))
```

Paquetes y costo opcionales:

```text
paquetes = piezas_por_paquete != null ? ceil(piezas_compra / piezas_por_paquete) : null
piezas_redondeadas_por_paquete = paquetes != null ? paquetes * piezas_por_paquete : piezas_compra
costo_estimado = precio_por_pieza != null ? piezas_redondeadas_por_paquete * precio_por_pieza : null
```

Mortero aproximado opcional:

```text
volumen_muro = area_neta * espesor_pieza
volumen_piezas = piezas_netas * largo_pieza * alto_pieza * espesor_pieza
volumen_mortero_neto = max(0, volumen_muro - volumen_piezas)
volumen_mortero_compra = volumen_mortero_neto * (1 + desperdicio_mortero / 100)
```

La estimación de mortero debe mostrarse como aproximada. Para bloques huecos,
piezas especiales o juntas parciales, el consumo real puede variar.

---

## Validaciones y estados

- Área de aberturas no puede superar área de muros sin advertencia.
- Dimensiones de pieza deben ser mayores que cero.
- Juntas pueden ser cero.
- Cantidades deben ser enteros positivos.
- Desperdicio puede ser cero.
- Desperdicio mayor a `30%` debe mostrar advertencia no bloqueante.
- Juntas mayores a `2 cm` deben mostrar advertencia no bloqueante.
- Precio por pieza puede ser cero o vacío.
- Piezas por paquete debe ser entero positivo cuando se capture.
- Para estimar mortero, el espesor de pieza debe ser mayor que cero.
- Redondear piezas siempre hacia arriba.
- Si el área neta es cero, mostrar resultado en cero y advertencia clara.

---

## Acciones del usuario

- Copiar resumen en texto.
- Exportar CSV con entradas, resultados y supuestos.
- Limpiar formulario.
- Añadir y eliminar muros.
- Añadir y eliminar aberturas.
- Cambiar preset sin bloquear la edición manual de dimensiones.

### Resumen copiable

El resumen debe incluir:

- Área bruta, área de aberturas y área neta.
- Preset o dimensiones de pieza usadas.
- Junta horizontal y vertical.
- Desperdicio aplicado.
- Piezas netas y piezas a comprar.
- Paquetes y piezas redondeadas, si aplica.
- Costo estimado, si aplica.
- Mortero aproximado, si aplica.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de cantidad de ladrillos` |
| Meta description | `Estima cuántos ladrillos o bloques necesitas según área de muros, aberturas, juntas, desperdicio y costo opcional.` |
| H1 | `Calculadora de ladrillos` |
| Keyword principal | `calculadora cantidad ladrillos` |
| Keywords secundarias | `ladrillos por metro cuadrado`, `bloques para muro`, `calcular mamposteria`, `cuantos ladrillos necesito` |

### FAQs sugeridas

- ¿Cómo calcular ladrillos por metro cuadrado?
- ¿Se restan puertas y ventanas?
- ¿Cómo influyen las juntas?
- ¿Cuánto desperdicio debo agregar?
- ¿Cómo calcular blocks para un muro?
- ¿La calculadora también estima mortero?
- ¿Por qué el resultado puede cambiar según el aparejo?

---

## Pruebas sugeridas

- Área neta resta aberturas correctamente.
- Junta aumenta módulo y reduce piezas por m².
- Desperdicio redondea piezas hacia arriba.
- Aberturas mayores al muro muestran advertencia.
- Conversión de cm a m es correcta.
- Preset carga dimensiones y permite editarlas.
- Precio por pieza calcula costo sobre piezas redondeadas.
- Piezas por paquete redondea compra al paquete superior.
- Área neta cero devuelve cero piezas y advertencia.
- Desperdicio mayor a `30%` muestra advertencia.
- Junta mayor a `2 cm` muestra advertencia.
- Mortero opcional requiere espesor de pieza.

