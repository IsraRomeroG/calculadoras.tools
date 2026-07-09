# Especificación v2 - Calculadora de presupuesto de remodelación

## Descripción general

Herramienta para crear un presupuesto preliminar de remodelación mediante
partidas de materiales, mano de obra, permisos y otros costos. Permite organizar
los gastos por zona, añadir una reserva para imprevistos, definir cómo se tratan
los impuestos y comparar el total contra el presupuesto disponible.

Los precios se ingresan manualmente. La calculadora no proporciona precios
oficiales ni sustituye una cotización profesional, una revisión fiscal o un
contrato de obra.

**Arquitectura:** todo el cálculo ocurre en el cliente. No requiere backend,
base de datos ni llamadas a APIs externas.

---

## Objetivo de producto

- Ayudar al usuario a recordar, organizar y sumar los gastos de una remodelación.
- Separar las partidas por zona y por tipo de costo.
- Añadir una reserva editable para imprevistos.
- Evitar el doble conteo de impuestos mediante un tratamiento explícito.
- Comparar el costo estimado contra el presupuesto disponible.
- Mostrar cuánto presupuesto queda, cuánto se excede y qué partidas tienen mayor
  impacto.
- Calcular el costo estimado por metro cuadrado cuando se proporciona una
  superficie.
- Conservar automáticamente el trabajo realizado en el dispositivo.
- Generar una página estática optimizada para SEO en Astro.

---

## Alcance recomendado

### MVP

- Presupuesto disponible opcional.
- Superficie de remodelación opcional.
- Presupuesto en blanco o plantilla sin precios.
- Lista editable de partidas.
- Zona, tipo de costo, cantidad, unidad y costo unitario por partida.
- Contingencia editable.
- Tratamiento explícito de impuestos.
- Resultado: subtotal, impuestos adicionales, contingencia, total y diferencia
  contra presupuesto.
- Porcentaje de presupuesto utilizado y capacidad para nuevas partidas.
- Costo por metro cuadrado cuando exista una superficie válida.
- Desglose por zona y por tipo de costo.
- Partidas con mayor impacto en el total.
- Autoguardado en `localStorage`.
- Copiar resumen, limpiar formulario y exportar CSV.

### Fase 2

- Fases del proyecto y calendario de pagos.
- Comparador de escenarios.
- Costo estimado frente a costo real.
- Estado de pagos por partida.
- Impuestos configurables por partida.
- Vista imprimible.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL pública recomendada | `/construccion/calculadora-presupuesto-remodelacion` |
| Archivo Astro recomendado | `src/pages/construccion/calculadora-presupuesto-remodelacion.astro` |
| Lógica de cálculo | `src/lib/calculators/construccion/calculadora-presupuesto-remodelacion/remodelBudget.ts` |
| Pruebas unitarias | `src/lib/calculators/construccion/calculadora-presupuesto-remodelacion/remodelBudget.test.ts` |
| Categoría | `construccion` |
| Locale base | `es-MX` |
| Moneda base | `MXN`, símbolo `$` |

---

## Modelo de datos

### Datos del proyecto

```text
presupuesto_disponible?: number
superficie_m2?: number
contingencia_porcentaje: number
modo_impuestos: "costos_finales" | "agregar_impuestos"
impuestos_porcentaje: number
partidas: Partida[]
```

`costos_finales` significa que los importes capturados se toman como precios
finales y no se agregan impuestos. Es la opción adecuada cuando los precios ya
incluyen IVA o cuando el usuario no desea estimarlo.

### Partida

```text
id: string
nombre: string
zona: string
tipo: "material" | "mano_obra" | "permiso" | "otro"
cantidad: number
unidad: string
costo_unitario: number
```

La **zona** indica dónde o en qué trabajo se utilizará el gasto, por ejemplo:
cocina, baño, pintura, instalación eléctrica o general. El **tipo** describe la
naturaleza del costo. Ambos campos son independientes.

---

## Plantillas iniciales

El usuario puede comenzar en blanco o seleccionar una plantilla:

- Cocina.
- Baño.
- Pintura.
- Piso.
- Remodelación general.

Las plantillas agregan nombres de partidas y zonas frecuentes, pero dejan todos
los costos vacíos. Deben poder editarse y eliminarse como cualquier otra
partida. No deben mostrar importes sugeridos ni dar a entender que la lista es
exhaustiva.

Entre los conceptos que pueden ayudar a recordar están demolición, retiro de
escombro, preparación de superficies, materiales, instalación, mano de obra,
fletes, permisos y limpieza final.

---

## Comportamiento mobile first

### Orden de la interfaz

1. Introducción breve y aviso sobre los precios.
2. Datos del proyecto: presupuesto, superficie y ajustes.
3. Selector de plantilla.
4. Resumen principal.
5. Lista de partidas.
6. Desgloses y partidas con mayor impacto.
7. Acciones para copiar, exportar y limpiar.
8. Contenido explicativo y FAQs.

### Resumen principal

- Debe aparecer antes de la lista de partidas.
- Muestra total estimado y, cuando exista presupuesto, cuánto queda o cuánto se
  excede.
- Puede transformarse en una barra compacta fija durante la edición si no
  bloquea contenido ni reduce excesivamente el área visible.
- El estado debe expresarse con texto e icono; el color no puede ser el único
  indicador.
- Antes de existir una partida completa debe mostrarse un estado vacío, no un
  total de `$0` presentado como estimación válida.

### Edición de partidas

- Cada partida se presenta como una tarjeta, nunca como una tabla con
  desplazamiento horizontal.
- El encabezado de la tarjeta muestra nombre, tipo y subtotal.
- La tarjeta puede expandirse o contraerse para editar sus campos.
- Una partida nueva queda expandida y recibe el foco en el nombre.
- El subtotal de la partida se actualiza dentro de la propia tarjeta.
- Agregar, duplicar y eliminar deben ser acciones claramente identificables.
- El botón `Agregar partida` aparece antes y después de la lista cuando esta sea
  larga.
- Eliminar ofrece una acción temporal para deshacer en lugar de abrir una
  confirmación por cada partida.
- Los controles táctiles deben medir al menos `44 × 44 px`.
- Los inputs deben usar texto de al menos `16 px` y `inputmode="decimal"` en
  importes, cantidades y porcentajes.
- Agregar, duplicar o eliminar una partida no debe provocar saltos inesperados
  de scroll.

### Divulgación progresiva

- Presupuesto y contingencia permanecen visibles.
- Superficie y tratamiento de impuestos pueden agruparse bajo `Más ajustes`,
  manteniendo un resumen visible de la configuración elegida.
- El desglose y las partidas con mayor impacto son resultados secundarios y
  pueden mostrarse después del resultado principal.

### Adaptación a escritorio

En pantallas amplias, los datos y partidas pueden ocupar la columna principal y
el resumen una columna lateral. La experiencia móvil sigue siendo la estructura
base; escritorio es una mejora progresiva.

---

## Flujo principal del MVP

**Ejemplo:** el usuario dispone de `$250,000`, elige una plantilla de baño,
captura costos finales, usa una contingencia de `15%` e indica una superficie de
`18 m²`. La calculadora responde:

- ¿Cuál es el total estimado?
- ¿Cuánto queda o cuánto se excede el presupuesto?
- ¿Qué porcentaje del presupuesto se utilizaría?
- ¿Cuánto puede agregarse todavía en partidas antes de la contingencia?
- ¿Cuál es el costo estimado por metro cuadrado?
- ¿Qué zonas y tipos de costo concentran el gasto?

### Inputs del proyecto

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Presupuesto disponible | Texto numérico opcional | `>= 0` | vacío |
| Superficie de remodelación | Texto numérico opcional | `> 0` | vacío |
| Plantilla | Selector | blanco, cocina, baño, pintura, piso, general | blanco |
| Contingencia (%) | Texto numérico | `0-100` | `15` |
| Tratamiento de impuestos | Selector | costos finales, agregar impuestos | costos finales |
| Impuestos (%) | Texto numérico condicional | `0-100` | `16`, editable |

El porcentaje de impuestos solamente se utiliza y se muestra como campo editable
cuando el usuario elige `agregar impuestos`.

### Inputs por partida

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Nombre de partida | Texto | 1-80 caracteres | nombre de plantilla o `Partida 1` |
| Zona | Selector con opción personalizada | 1-40 caracteres | `General` |
| Tipo de costo | Selector | material, mano de obra, permiso, otro | `Material` |
| Cantidad | Texto numérico | `> 0` | `1` |
| Unidad | Selector con opción personalizada | 1-20 caracteres | `pieza` |
| Costo unitario | Texto numérico | `>= 0` | vacío |

Unidades iniciales recomendadas: pieza, metro cuadrado, metro cúbico, metro
lineal, lote, hora, día y servicio.

### Outputs principales

- Subtotal de partidas.
- Impuestos adicionales, si corresponde.
- Contingencia.
- Total estimado.
- Diferencia contra presupuesto.
- Porcentaje del presupuesto utilizado.
- Capacidad para nuevas partidas antes de impuestos y contingencia.
- Costo estimado por metro cuadrado.

### Outputs secundarios

- Subtotal por zona.
- Subtotal de materiales.
- Subtotal de mano de obra.
- Subtotal de permisos.
- Subtotal de otros.
- Partidas con mayor impacto, ordenadas por subtotal.

---

## Fórmulas

### Partidas

```text
subtotal_partida = cantidad * costo_unitario
subtotal_base = suma(subtotal_partida_valida)
```

### Impuestos y contingencia

```text
si modo_impuestos = "agregar_impuestos":
    impuestos_monto = subtotal_base * (impuestos_porcentaje / 100)
si no:
    impuestos_monto = 0

subtotal_con_impuestos = subtotal_base + impuestos_monto
contingencia_monto =
    subtotal_con_impuestos * (contingencia_porcentaje / 100)
total = subtotal_con_impuestos + contingencia_monto
```

La contingencia se calcula sobre el importe que previsiblemente tendría que
pagarse, incluidos los impuestos adicionales configurados. No representa un
impuesto ni una partida contratada: es una reserva presupuestaria.

### Comparación contra presupuesto

```text
diferencia = presupuesto_disponible - total

diferencia >= 0 => dentro de presupuesto
diferencia < 0 => excedente estimado

porcentaje_utilizado =
    presupuesto_disponible > 0
        ? (total / presupuesto_disponible) * 100
        : no_aplica
```

Cuando el presupuesto es exactamente `0`, debe mostrarse la diferencia, pero el
porcentaje utilizado se presenta como no aplicable para evitar una división
entre cero.

### Capacidad para nuevas partidas

```text
factor_impuestos =
    modo_impuestos = "agregar_impuestos"
        ? 1 + (impuestos_porcentaje / 100)
        : 1

factor_contingencia = 1 + (contingencia_porcentaje / 100)

presupuesto_base_maximo =
    presupuesto_disponible / (factor_impuestos * factor_contingencia)

capacidad_base =
    presupuesto_base_maximo - subtotal_base
```

- Si `capacidad_base >= 0`, se presenta como el máximo que todavía podría
  agregarse en partidas base bajo los supuestos actuales.
- Si `capacidad_base < 0`, se presenta como la reducción aproximada necesaria en
  partidas base.
- No se calcula cuando el presupuesto está vacío.

### Costo por metro cuadrado

```text
costo_por_m2 = total / superficie_m2
```

Solo se muestra cuando la superficie es válida y mayor que cero.

---

## Validaciones y estados

- Debe existir al menos una partida completa para mostrar una estimación.
- Una partida completa tiene nombre, zona, tipo, cantidad, unidad y costo
  unitario válidos.
- Cantidad debe ser mayor que cero.
- Costos, presupuesto y porcentajes no pueden ser negativos.
- Superficie, cuando se proporciona, debe ser mayor que cero.
- Contingencia e impuestos deben estar entre `0` y `100`.
- Costo vacío significa partida incompleta; costo `0` escrito explícitamente es
  válido.
- Las partidas incompletas se conservan, se identifican claramente y no se
  incluyen silenciosamente en el total.
- Presupuesto vacío oculta la comparación; presupuesto `0` sí genera una
  comparación.
- Los cálculos deben rechazar valores no finitos o fuera de los límites seguros
  definidos por la implementación.
- Los importes pueden capturarse o pegarse con símbolo de moneda, espacios y
  separadores de miles comunes en `es-MX`, por ejemplo `$25,000.50`.
- Los valores se conservan con su precisión interna y se redondean a dos
  decimales solamente al presentarse.
- Los errores se muestran junto al campo correspondiente y no dependen
  exclusivamente del color.
- Debe mostrarse un aviso de que precios, impuestos y alcances pueden cambiar.

---

## Autoguardado y recuperación

- Guardar los datos válidos e incompletos en `localStorage` después de cada
  cambio, utilizando una espera breve para evitar escrituras excesivas.
- Incluir una versión del esquema almacenado para permitir futuras migraciones.
- Restaurar automáticamente el último presupuesto y mostrar un aviso discreto
  con la opción `Descartar datos guardados`.
- Una carga corrupta o incompatible se ignora sin bloquear la calculadora.
- `Limpiar formulario` requiere confirmación, elimina el estado guardado y crea
  un presupuesto en blanco.
- Informar que los datos permanecen únicamente en el dispositivo.

---

## Copiar y exportar

### Copiar resumen

El texto copiado debe incluir:

- Total estimado.
- Presupuesto y diferencia, cuando existan.
- Contingencia y tratamiento de impuestos.
- Superficie y costo por metro cuadrado, cuando existan.
- Desglose por tipo de costo.

### Exportar CSV

El archivo debe contener, como mínimo:

```text
nombre,zona,tipo,cantidad,unidad,costo_unitario,subtotal
```

Debe escapar correctamente comas, comillas y saltos de línea. Puede añadir al
final filas identificadas de subtotal, impuestos, contingencia y total.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de presupuesto de remodelación` |
| Meta description | `Crea un presupuesto de remodelación por partidas, calcula imprevistos, costo por m² y compara el total contra tu presupuesto.` |
| H1 | `Calculadora de presupuesto de remodelación` |
| Keyword principal | `calculadora presupuesto remodelacion` |
| Keywords secundarias | `costo remodelacion`, `presupuesto de obra`, `materiales mano de obra`, `costo remodelacion por metro cuadrado` |

### Contenido de apoyo

- Cómo elaborar un presupuesto de remodelación.
- Gastos que suelen olvidarse: retiro de escombro, fletes, permisos, limpieza y
  trabajos preparatorios.
- Diferencia entre costo base y contingencia.
- Cómo saber si una cotización ya incluye impuestos.
- Cómo interpretar el costo por metro cuadrado sin tratarlo como precio
  universal.

### FAQs sugeridas

- ¿Qué incluye un presupuesto de remodelación?
- ¿Cuánta contingencia conviene agregar?
- ¿Los precios deben incluir IVA?
- ¿La calculadora usa precios actuales?
- ¿Cómo se calcula el costo por metro cuadrado?
- ¿Puedo separar materiales, mano de obra y permisos?
- ¿Dónde se guarda mi presupuesto?

---

## Accesibilidad

- Todos los inputs tienen etiquetas visibles y asociadas.
- Los mensajes de error se relacionan programáticamente con su campo.
- La navegación y todas las acciones funcionan con teclado.
- El foco se mueve de manera predecible al agregar o duplicar partidas.
- Los cambios importantes del resultado pueden anunciarse con una región de
  estado sin interrumpir al usuario en cada pulsación.
- Iconos como duplicar o eliminar incluyen un nombre accesible.
- Estados positivos, negativos e incompletos no dependen únicamente del color.

---

## Pruebas sugeridas

### Cálculo

- Cantidad por costo unitario calcula el subtotal de partida.
- El subtotal base suma solamente partidas completas.
- Los costos finales no agregan impuestos.
- El modo `agregar_impuestos` calcula el porcentaje sobre el subtotal base.
- La contingencia se aplica después de los impuestos adicionales.
- Contingencia e impuestos en cero no modifican el subtotal.
- Cada tipo de costo, incluidos permisos, obtiene el subtotal correcto.
- Los subtotales por zona se calculan correctamente.
- Diferencia positiva o cero indica que el total cabe en el presupuesto.
- Diferencia negativa indica el excedente.
- Presupuesto vacío no genera comparación.
- Presupuesto cero genera diferencia y evita dividir entre cero.
- La capacidad para nuevas partidas considera impuestos y contingencia.
- El costo por metro cuadrado divide el total entre una superficie válida.
- Los cálculos no acumulan errores por redondeo intermedio.

### Validación

- Cantidad cero o negativa muestra error.
- Superficie cero o negativa muestra error cuando fue capturada.
- Costo vacío mantiene la partida como incompleta.
- Costo cero escrito explícitamente crea una partida válida.
- Porcentajes fuera de `0-100` muestran error.
- Importes con formato `$25,000.50` se interpretan correctamente.
- Valores no finitos o excesivos no producen `NaN` o `Infinity` visibles.

### Interacción y persistencia

- Una plantilla crea las partidas esperadas con costos vacíos.
- Duplicar una partida crea un identificador independiente.
- Eliminar una partida puede deshacerse.
- Autoguardado restaura partidas completas e incompletas.
- Datos guardados corruptos no rompen la página.
- Limpiar elimina el formulario y el estado persistido.
- CSV escapa texto con comas y comillas.
- El estado inicial no presenta `$0` como una estimación calculada.
