# Especificacion v1.1 - Calculadora de costo por persona en evento

## Descripcion general

Herramienta para calcular el costo total, costo por persona, cuota sugerida e
invitados posibles de un evento a partir de gastos fijos, costos por invitado,
presupuesto disponible y contingencia.

La herramienta debe servir para fiestas, reuniones, cenas, celebraciones,
eventos corporativos pequenos y eventos sociales donde el usuario captura sus
propios costos. No debe sugerir precios predeterminados como si fueran
universales, porque los costos dependen de ciudad, temporada, proveedores y tipo
de evento.

**Arquitectura:** todo el calculo ocurre en el cliente. No requiere backend,
base de datos ni llamadas a APIs externas.

---

## Objetivo de producto

- Calcular costo total y costo por persona.
- Separar gastos fijos y costos variables por invitado.
- Calcular cuantos invitados caben en un presupuesto.
- Comparar escenarios rapidos de asistencia.
- Mostrar sobrante o faltante contra presupuesto disponible.
- Sugerir una cuota por persona redondeada para recuperar el costo del evento.
- Identificar que partidas consumen mas presupuesto.
- Generar una pagina estatica optimizada para SEO en Astro.

---

## Alcance recomendado

### MVP

- Dos modos: `Costo por persona` e `Invitados posibles`.
- Nombre del evento opcional para resumen y CSV.
- Tipo de evento opcional: fiesta, cena, reunion, corporativo, boda/celebracion,
  otro.
- Invitados en modo costo por persona.
- Presupuesto disponible opcional en modo costo por persona y requerido en modo
  invitados posibles.
- Lista editable de gastos fijos.
- Lista editable de costos variables por persona.
- Partidas con nombre, categoria, importe y notas opcionales.
- Contingencia editable.
- Redondeo opcional de cuota sugerida.
- Resultado total, costo por persona, cuota sugerida, sobrante/faltante contra
  presupuesto e invitados posibles.
- Escenarios rapidos de asistencia: `80%`, `100%` y `120%` de los invitados.
- Top 3 partidas mas caras.
- Copiar resumen, limpiar formulario y exportar CSV.

### Fase 2

- Comparador de escenarios editable.
- Guardado en `localStorage`.
- Costo por mesa.
- Depositos o pagos realizados.
- Vista imprimible.
- Plantillas de partidas sin precios predeterminados.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL canonica MVP | `/eventos/calculadora-costo-por-persona-evento` |
| Archivo Astro recomendado | `src/pages/eventos/calculadora-costo-por-persona-evento.astro` |
| Logica de calculo | `src/lib/calculators/eventos/calculadora-costo-por-persona-evento/eventCost.ts` |
| Pruebas unitarias | `src/lib/calculators/eventos/calculadora-costo-por-persona-evento/eventCost.test.ts` |
| Categoria | `eventos` |
| Locale base | `es-MX` |
| Moneda base | `MXN`, simbolo `$` |

No crear una pagina duplicada en `/restaurantes/`. Si alguna version previa
hubiera sido publicada o indexada en `/restaurantes/calculadora-costo-por-persona-evento`,
agregar un 301 en Apache:

```apache
RewriteRule ^restaurantes/calculadora-costo-por-persona-evento/?$ /eventos/calculadora-costo-por-persona-evento [R=301,L]
```

---

## Comportamiento mobile-first

- El primer viewport debe mostrar H1 compacto, selector de modo, inputs clave y
  resultado principal sin obligar a hacer scroll largo.
- En modo `Costo por persona`, el resultado principal es costo por persona y
  cuota sugerida.
- En modo `Invitados posibles`, el resultado principal es invitados posibles y
  presupuesto sobrante estimado.
- Usar una barra resumen sticky inferior o superior en movil con total, costo por
  persona o invitados posibles.
- Gastos fijos y costos variables deben presentarse como bloques/cards
  editables o colapsables, no como filas de tabla.
- Los botones de agregar, duplicar y eliminar deben ser tactiles, claros y de al
  menos 44px de alto.
- Evitar tablas extensas en el primer viewport; desgloses y escenarios pueden ir
  en secciones colapsables.
- Mostrar siempre los supuestos usados: invitados, contingencia, presupuesto y
  redondeo de cuota.
- Los textos no deben depender del ancho de viewport para escalar y no deben
  desbordar botones o cards.

---

## Flujo principal MVP

**Ejemplo:** Evento de `100 personas`, gastos fijos de `$50,000` y costos
variables de `$700` por persona.

### Inputs del MVP

#### Campos globales

| Campo | Tipo | Rango valido | Valor por defecto |
|-------|------|--------------|-------------------|
| Modo | Control segmentado | costo por persona, invitados posibles | costo por persona |
| Nombre del evento | Texto opcional | 0-80 caracteres | vacio |
| Tipo de evento | Selector/texto | fiesta, cena, reunion, corporativo, boda/celebracion, otro | otro |
| Invitados | Texto numerico entero | `1-10000` | vacio |
| Presupuesto disponible | Texto numerico | `>= 0` en costo por persona, `> 0` en invitados posibles | vacio |
| Contingencia (%) | Texto numerico | `0%-100%` | `10` |
| Redondeo de cuota | Selector | sin redondeo, `$10`, `$50`, `$100` | `$50` |

#### Campos por partida

| Campo | Tipo | Rango valido | Valor por defecto |
|-------|------|--------------|-------------------|
| Tipo de partida | Selector | fijo, por_invitado | segun lista |
| Nombre | Texto | 1-80 caracteres | `Gasto 1` |
| Categoria | Selector/texto | lugar, comida, bebidas, personal, mobiliario, entretenimiento, invitaciones, transporte, limpieza, otro | otro |
| Importe | Texto monetario | `>= 0` | vacio |
| Notas | Texto opcional | 0-140 caracteres | vacio |

Los gastos fijos suman una vez por evento. Los costos por invitado se multiplican
por la cantidad de invitados.

La captura monetaria debe aceptar formatos comunes de Mexico, por ejemplo
`400000`, `$400,000`, `400,000.50` y `400000.50`.

### Outputs principales

- Gastos fijos totales.
- Costo variable unitario.
- Costo variable total.
- Subtotal antes de contingencia.
- Contingencia.
- Costo total.
- Costo por persona.
- Cuota sugerida por persona.
- Sobrante estimado si se cobra la cuota sugerida.
- Invitados posibles.
- Presupuesto usado.
- Sobrante o faltante contra presupuesto.
- Escenarios rapidos de asistencia.
- Top 3 partidas mas caras.

---

## Formulas

### Costo por persona

```text
fijos = suma(gastos_fijos)
variable_unitario = suma(costos_por_persona)
variable_total = variable_unitario * invitados
subtotal = fijos + variable_total
contingencia_monto = subtotal * (contingencia / 100)
total = subtotal + contingencia_monto
costo_por_persona = total / invitados
```

Cuota sugerida:

```text
si redondeo = 0:
  cuota_sugerida = costo_por_persona
si redondeo > 0:
  cuota_sugerida = ceil(costo_por_persona / redondeo) * redondeo

sobrante_por_cuotas = cuota_sugerida * invitados - total
```

Comparacion contra presupuesto:

```text
diferencia_presupuesto = presupuesto_disponible - total
porcentaje_presupuesto_usado = total / presupuesto_disponible * 100
```

`diferencia_presupuesto` solo se calcula si el presupuesto no esta vacio.
`porcentaje_presupuesto_usado` solo se calcula si `presupuesto_disponible > 0`.
Con presupuesto `0`, mostrar la diferencia negativa si hay costos y ocultar el
porcentaje para evitar division entre cero.

### Invitados posibles

```text
factor = 1 + contingencia / 100
presupuesto_base = presupuesto / factor
base_para_variables = presupuesto_base - fijos

si base_para_variables < 0:
  invitados_posibles = 0

si base_para_variables >= 0 y variable_unitario > 0:
  invitados_posibles = floor(base_para_variables / variable_unitario)

si base_para_variables >= 0 y variable_unitario = 0:
  mostrar estado especial: el presupuesto cubre los fijos y no hay costo
  variable por invitado; los invitados no quedan limitados por la formula.
```

Para mostrar el total estimado con `invitados_posibles`, recalcular:

```text
subtotal_posible = fijos + variable_unitario * invitados_posibles
total_posible = subtotal_posible * factor
presupuesto_sobrante = presupuesto - total_posible
```

### Escenarios rapidos

En modo `Costo por persona`, calcular escenarios con `80%`, `100%` y `120%` de
los invitados base:

```text
invitados_escenario = max(1, round(invitados * factor_escenario))
total_escenario = (fijos + variable_unitario * invitados_escenario) * factor
costo_por_persona_escenario = total_escenario / invitados_escenario
```

---

## Validaciones y estados

- Invitados debe ser entero positivo en modo `Costo por persona`.
- Presupuesto debe ser positivo en modo `Invitados posibles`.
- Presupuesto vacio oculta comparacion; presupuesto `0` no es vacio.
- Costos no pueden ser negativos.
- Contingencia puede ser `0`.
- Contingencia no puede superar `100%`.
- Si presupuesto no cubre gastos fijos con contingencia, invitados posibles es
  cero.
- Si costo variable unitario es cero y el presupuesto cubre fijos con
  contingencia, mostrar estado especial en lugar de dividir entre cero.
- Permitir partidas con importe cero.
- Una partida sin nombre puede mostrar nombre generado, por ejemplo `Gasto 1`.
- Una partida con importe vacio cuenta como cero hasta que el usuario capture un
  valor.
- Limitar el MVP a 100 partidas para mantener una experiencia movil manejable.
- El redondeo de cuota nunca debe redondear hacia abajo.
- Si todos los costos estan vacios o en cero, mostrar estado inicial claro y no
  resultados enganosos.

---

## Copiar resumen y CSV

El resumen copiado debe incluir nombre del evento cuando exista, tipo de evento,
modo, invitados o presupuesto, gastos fijos, costo variable unitario, subtotal,
contingencia, total, costo por persona, cuota sugerida, sobrante/faltante contra
presupuesto y supuestos usados.

El CSV debe exportar al menos estas columnas:

```text
tipo_partida,nombre,categoria,importe,notas
```

Opcionalmente puede incluir filas resumen al final:

```text
concepto,valor
gastos_fijos,total
costo_variable_unitario,total
costo_total,total
costo_por_persona,total
cuota_sugerida,total
```

Los valores monetarios del CSV deben exportarse como numeros sin simbolo de
moneda para facilitar edicion posterior en hojas de calculo.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de costo por persona en evento` |
| Meta description | `Calcula el costo total, costo por persona, cuota sugerida o cuantos invitados caben en el presupuesto de un evento.` |
| H1 | `Calculadora de costo por persona en evento` |
| Keyword principal | `costo por persona evento` |
| Keywords secundarias | `presupuesto evento`, `costo por invitado`, `cuantos invitados presupuesto`, `cuota por persona evento` |

Contenido recomendado:

- Explicar la diferencia entre gastos fijos y costos por invitado.
- Aclarar que los precios se capturan manualmente y dependen de proveedores,
  ciudad y temporada.
- Incluir ejemplos de gastos frecuentes sin precios predeterminados.
- Incluir FAQ sobre como calcular costo por invitado, que incluir en la
  contingencia y como decidir una cuota por persona.
- Enlazar internamente a calculadoras relacionadas de eventos cuando existan,
  como presupuesto de boda, comida para evento, bebidas para evento o costo de
  catering.

---

## Pruebas sugeridas

- `100` invitados, fijos `50000`, variable `700`, sin contingencia produce total
  `120000`.
- Costo por persona del caso anterior produce `1200`.
- Con contingencia de `10%`, el caso anterior produce total `132000`.
- Cuota sugerida con costo por persona `1320` y redondeo `$50` produce `1350`.
- Sobrante por cuotas usa `cuota_sugerida * invitados - total`.
- Presupuesto menor a gastos fijos con contingencia produce cero invitados.
- Presupuesto igual a gastos fijos con variable cero muestra estado especial.
- Variable cero no divide entre cero en modo invitados posibles.
- Presupuesto vacio no genera diferencia contra presupuesto.
- Presupuesto `0` genera diferencia negativa si hay total y no calcula
  porcentaje usado.
- Parser acepta `$400,000` como `400000`.
- Partidas con importe vacio cuentan como cero.
- Costos negativos muestran error.
- Contingencia mayor a `100%` muestra error.
- Escenario `80%` con 100 invitados usa 80 invitados.
- CSV exporta importes sin simbolo de moneda.
