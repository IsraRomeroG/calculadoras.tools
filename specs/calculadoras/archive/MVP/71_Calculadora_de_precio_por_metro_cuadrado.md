# Especificacion v2 - Calculadora de precio por metro cuadrado

## Descripcion general

Herramienta para calcular el precio por metro cuadrado de una propiedad,
terreno, local, oficina o espacio, comparar varias opciones y estimar el precio
efectivo por superficie considerando costos adicionales.

La calculadora debe publicarse en la categoria `inmuebles`.

**Arquitectura:** todo el calculo ocurre en el cliente. No requiere backend,
base de datos ni llamadas a APIs externas.

---

## Objetivo de producto

- Calcular precio por metro cuadrado desde precio total y superficie.
- Calcular precio total desde superficie y precio por metro cuadrado.
- Comparar de 2 a 5 opciones normalizando unidades de superficie.
- Mostrar precio base por m2 y precio efectivo por m2 con costos adicionales.
- Convertir superficies entre m2, ft2, hectareas y acres.
- Ayudar a detectar diferencias relativas, sin afirmar que el menor precio por
  m2 es automaticamente la mejor compra.
- Generar una pagina estatica optimizada para SEO en Astro.

---

## Alcance recomendado

### MVP

- Modos `Precio por m2` y `Precio total`.
- Precio total, superficie, unidad y tipo de superficie.
- Costos adicionales editables en el calculo principal.
- Resultado principal visible inmediatamente:
  - precio base por m2,
  - precio efectivo por m2,
  - precio total estimado,
  - superficie normalizada.
- Comparador de 2 a 5 opciones con bloques editables en movil.
- Diferencia absoluta y porcentual contra la opcion mas barata del comparador.
- Conversiones de superficie y precio por ft2.
- Copiar resultado, compartir resumen y limpiar formulario.

### Fase 2

- Exportar CSV desde el comparador.
- Historial en `sessionStorage`.
- Tabla de escenarios con variaciones de precio, superficie y costos.
- Campos separados para costos recurrentes, mantenimiento o remodelacion.
- Notas por opcion y ordenamiento manual del comparador.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL publica recomendada | `/inmuebles/calculadora-precio-por-metro-cuadrado` |
| Archivo Astro recomendado | `src/pages/inmuebles/calculadora-precio-por-metro-cuadrado.astro` |
| Logica de calculo | `src/lib/calculators/inmuebles/calculadora-precio-por-metro-cuadrado/pricePerArea.ts` |
| Pruebas unitarias | `src/lib/calculators/inmuebles/calculadora-precio-por-metro-cuadrado/pricePerArea.test.ts` |
| Categoria | `inmuebles` |
| Locale base | `es-MX` |
| Moneda base | `MXN`, simbolo `$` |

### Redireccion sugerida

Si la ruta equivocada de `programacion` llego a publicarse, configurar una
redireccion 301 en Apache hacia la ruta canonica de `inmuebles`:

```apache
RewriteRule ^programacion/calculadora-precio-por-metro-cuadrado/?$ /inmuebles/calculadora-precio-por-metro-cuadrado [R=301,L]
```

No mantener una pagina Astro duplicada en la ruta anterior.

---

## Comportamiento mobile-first

- Usar un control segmentado para alternar entre `Precio por m2` y
  `Precio total`.
- Presentar primero los campos minimos del modo activo, con inputs grandes y
  labels visibles.
- Usar `inputmode="decimal"` en campos numericos.
- Permitir pegar valores con simbolos y separadores, por ejemplo `$3,000,000`,
  `3000000`, `120.5` o `120,5`.
- Mantener la unidad visible junto a cada input de superficie.
- Mostrar el resultado principal antes de conversiones, explicaciones y FAQs.
- Mostrar conversiones y detalles en secciones secundarias plegables o tabs.
- Renderizar el comparador como bloques editables en movil y como tabla
  compacta solo en pantallas amplias.
- Mantener botones de accion claros: copiar, compartir y limpiar.
- No sugerir que el menor precio por m2 es automaticamente la mejor compra.

---

## Flujo principal MVP

**Ejemplo:** una vivienda cuesta `$3,000,000`, tiene `120 m2` y requiere
`$80,000` de gastos adicionales. La calculadora muestra el precio base por m2,
el precio efectivo por m2 y permite compararla contra otras opciones.

### Inputs del calculo principal

| Campo | Tipo | Rango valido | Valor por defecto |
|-------|------|--------------|-------------------|
| Modo | Selector segmentado | `Precio por m2`, `Precio total` | `Precio por m2` |
| Precio total | Texto numerico | `> 0` | vacio |
| Superficie | Texto numerico | `> 0` | vacio |
| Unidad de superficie | Selector | `m2`, `ft2`, `ha`, `acre` | `m2` |
| Tipo de superficie | Selector | `Construida`, `Terreno`, `Rentable`, `Otro` | `Construida` |
| Precio por m2 | Texto numerico | `> 0` | vacio |
| Costos adicionales | Texto numerico | `>= 0` | `0` |

### Inputs del comparador

Cada opcion del comparador debe tener:

| Campo | Tipo | Requerido |
|-------|------|-----------|
| Nombre | Texto | No |
| Precio total | Texto numerico | Si |
| Superficie | Texto numerico | Si |
| Unidad de superficie | Selector | Si |
| Tipo de superficie | Selector | No |
| Costos adicionales | Texto numerico | No |
| Nota | Texto corto | No |

El comparador debe permitir agregar, duplicar y eliminar opciones. Mantener un
minimo de 2 opciones y un maximo de 5.

### Outputs principales

- Precio base por m2.
- Precio efectivo por m2, incluyendo costos adicionales.
- Precio por ft2.
- Precio total calculado o ingresado.
- Costos adicionales considerados.
- Superficie convertida a m2, ft2, hectareas y acres.
- Diferencia absoluta contra la opcion mas barata comparable.
- Diferencia porcentual contra la opcion mas barata comparable.
- Aviso contextual si se comparan tipos de superficie distintos.

### Mensajes de ayuda recomendados

- `Precio base por m2`: precio total dividido entre la superficie normalizada.
- `Precio efectivo por m2`: precio total mas costos adicionales, dividido entre
  la superficie normalizada.
- `Comparacion`: una opcion con menor precio por m2 no necesariamente es mejor;
  revisa ubicacion, estado, tipo de superficie y costos futuros.

---

## Formulas

### Conversion de superficie a metros cuadrados

```text
m2_a_m2 = m2
ft2_a_m2 = ft2 * 0.09290304
ha_a_m2 = ha * 10000
acre_a_m2 = acre * 4046.8564224
```

### Conversion desde metros cuadrados

```text
m2_a_ft2 = m2 / 0.09290304
m2_a_ha = m2 / 10000
m2_a_acre = m2 / 4046.8564224
```

### Precio por superficie

```text
precio_base_por_m2 = precio_total / superficie_m2
precio_efectivo_total = precio_total + costos_adicionales
precio_efectivo_por_m2 = precio_efectivo_total / superficie_m2
precio_por_ft2 = precio_efectivo_total / superficie_ft2
```

### Precio total

```text
precio_total = superficie_m2 * precio_por_m2
precio_efectivo_total = precio_total + costos_adicionales
precio_efectivo_por_m2 = precio_efectivo_total / superficie_m2
```

### Comparacion relativa

```text
diferencia_absoluta = precio_efectivo_por_m2_opcion - precio_efectivo_por_m2_mas_bajo
diferencia_porcentual = diferencia_absoluta / precio_efectivo_por_m2_mas_bajo * 100
```

Si se comparan opciones con tipos de superficie distintos, calcular la diferencia
pero mostrar un aviso de comparabilidad limitada.

---

## Validaciones y estados

- Precio total, superficie y precio por m2 deben ser mayores que cero cuando
  apliquen al modo activo.
- Costos adicionales deben ser mayores o iguales que cero.
- No permitir division entre cero.
- Aceptar y normalizar valores con `$`, espacios, comas de miles y coma decimal.
- Redondear moneda a 2 decimales en la UI.
- Redondear porcentajes a 1 o 2 decimales segun espacio disponible.
- Conservar precision interna en conversiones.
- Si se comparan propiedades con unidades distintas, normalizar a m2.
- Si se mezclan tipos de superficie, mostrar advertencia no bloqueante.
- Mostrar errores por campo y mantener el resto de resultados validos cuando sea
  posible.
- Si un valor es extremadamente grande o pequeno, mostrar resultado pero evitar
  notacion cientifica en la UI.

### Estados de interfaz

- Estado inicial con formulario vacio y un ejemplo discreto.
- Estado con resultado valido.
- Estado con errores por campo.
- Estado de comparador vacio o incompleto.
- Estado de comparador con opcion mas barata resaltada.
- Estado de copia/compartir exitoso.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de precio por metro cuadrado` |
| Meta description | `Calcula el precio por metro cuadrado, suma costos adicionales y compara opciones con distintas superficies.` |
| H1 | `Calculadora de precio por metro cuadrado` |
| Keyword principal | `precio por metro cuadrado calculadora` |
| Keywords secundarias | `precio m2`, `calcular valor por metro cuadrado`, `comparar propiedades`, `precio por ft2` |

### Contenido recomendado

- Explicar la diferencia entre precio base por m2 y precio efectivo por m2.
- Aclarar que la calculadora no estima el valor de mercado ni sustituye una
  tasacion.
- Mencionar que comparar terreno, superficie construida y superficie rentable
  puede llevar a conclusiones distintas.
- Incluir un ejemplo numerico breve usando pesos mexicanos.

### FAQs sugeridas

- Como se calcula el precio por metro cuadrado?
- Que diferencia hay entre precio base y precio efectivo por m2?
- Se usa superficie construida, terreno o superficie rentable?
- Puedo comparar propiedades de distinto tamano?
- Por que una opcion con menor precio por m2 no siempre es mejor?
- La calculadora estima el valor de mercado?

---

## Pruebas sugeridas

- `$3,000,000 / 120 m2` produce `$25,000.00/m2`.
- `$3,000,000 + $80,000` sobre `120 m2` produce `$25,666.67/m2`
  efectivo.
- `1000 ft2` se convierte a `92.90304 m2`.
- `1 ha` se convierte a `10000 m2`.
- `1 acre` se convierte a `4046.8564224 m2`.
- Modo precio total multiplica correctamente superficie por precio por m2.
- Superficie cero muestra error y evita division entre cero.
- Costos adicionales negativos muestran error.
- Comparaciones normalizan unidades antes de ordenar.
- Comparador calcula diferencia absoluta y porcentual contra la opcion mas
  barata.
- Comparador muestra advertencia si mezcla `Construida` y `Terreno`.
- Parseo acepta `$3,000,000`, `3 000 000`, `120.5` y `120,5`.
