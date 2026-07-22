# Especificación v1.1 - Calculadora de gastos anuales del vehículo

## Descripción general

Herramienta para estimar cuánto cuesta mantener y usar un vehículo durante un
año a partir de gastos capturados manualmente: servicios, reparaciones, llantas,
seguro, impuestos, verificación, estacionamiento, peajes y otros conceptos.

El valor principal para el usuario es convertir gastos irregulares en una
reserva mensual sugerida. La herramienta no debe prometer precios de mercado ni
usar costos predeterminados como si fueran universales, porque los importes
dependen de ciudad, taller, kilometraje, tipo de vehículo y hábitos de uso.

**Arquitectura:** todo el cálculo ocurre en el cliente. No requiere backend,
base de datos ni llamadas a APIs externas.

---

## Objetivo de producto

- Sumar costos recurrentes, periódicos y dependientes del kilometraje.
- Convertir gastos por kilometraje a costo anual.
- Mostrar costo anual promedio, reserva mensual sugerida y costo por kilómetro.
- Separar gastos de mantenimiento, propiedad y uso.
- Distinguir entre estimación promedio y reserva práctica conservadora.
- Identificar las partidas y categorías que más pesan en el presupuesto.
- Permitir copiar resumen, limpiar, exportar CSV y conservar datos localmente.
- Generar una página estática optimizada para SEO en Astro.

---

## Alcance recomendado

### MVP

- Nombre del vehículo opcional para resumen y CSV.
- Kilómetros recorridos al año.
- Lista editable de hasta `100` gastos.
- Partidas con nombre, categoría, costo por evento, frecuencia, intervalo y
  notas opcionales.
- Frecuencia: mensual, anual, cada N meses, cada N km.
- Categorías orientadas a recordar conceptos sin precios predeterminados.
- Resultado: costo anual promedio, reserva anual práctica, promedio mensual,
  reserva mensual sugerida y costo por km.
- Eventos estimados por año, con eventos teóricos y prácticos cuando difieran.
- Desglose por grupo y categoría.
- Top 3 partidas más caras.
- Copiar resumen, limpiar formulario y exportar CSV.
- Autoguardado en `localStorage` con aviso de que solo se guarda en el
  dispositivo del usuario.

### Fase 2

- Combustible integrado o importable desde la calculadora de consumo/costo por
  kilómetro.
- Depreciación integrada o importable desde la calculadora de depreciación.
- Comparador de vehículos.
- Escenarios duplicables: uso bajo, base y uso alto.
- Vista imprimible.
- Plantillas de conceptos frecuentes sin precios predeterminados.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL canónica MVP | `/vehiculos/calculadora-de-gastos-anuales-del-vehiculo` |
| Archivo Astro recomendado | `src/pages/vehiculos/calculadora-de-gastos-anuales-del-vehiculo.astro` |
| Lógica de cálculo | `src/lib/calculators/vehiculos/calculadora-de-gastos-anuales-del-vehiculo/vehicleAnnualCosts.ts` |
| Pruebas unitarias | `src/lib/calculators/vehiculos/calculadora-de-gastos-anuales-del-vehiculo/vehicleAnnualCosts.test.ts` |
| Categoría | `vehiculos` |
| Locale base | `es-MX` |
| Moneda base | `MXN`, símbolo `$` |

Si la ruta previa de la spec llegara a publicarse o indexarse, agregar
redirección 301:

```apache
RewriteRule ^vehiculos/calculadora-costo-anual-mantenimiento/?$ /vehiculos/calculadora-de-gastos-anuales-del-vehiculo [R=301,L]
```

---

## Comportamiento mobile-first

- El primer viewport debe mostrar H1 compacto, kilómetros anuales, total anual,
  reserva mensual sugerida y acción para agregar gasto.
- Usar una barra resumen sticky inferior o superior en móvil con total anual,
  reserva mensual y costo por km cuando aplique.
- Cada gasto debe presentarse como bloque/card editable o colapsable, no como
  fila de tabla.
- Los botones de agregar, duplicar, eliminar y expandir deben ser táctiles,
  claros y de al menos `44px` de alto.
- La frecuencia debe mostrar campos condicionales: intervalo en meses solo para
  `cada N meses` e intervalo en km solo para `cada N km`.
- El desglose por categoría y el top de partidas deben ser secundarios y pueden
  mostrarse en secciones colapsables.
- Evitar tablas extensas en el primer viewport; si se usa una tabla en desktop,
  envolverla en `overflow-x-auto`.
- Mostrar siempre los supuestos usados: km anuales, cantidad de partidas,
  frecuencia e importes vacíos tratados como cero.
- No usar costos predeterminados como universales. Se pueden ofrecer conceptos
  sugeridos vacíos para ayudar a recordar gastos.
- Los textos no deben depender del ancho de viewport para escalar ni desbordar
  botones, cards o controles.

---

## Flujo principal MVP

**Ejemplo:** Vehículo que recorre `15,000 km/año`, con servicio de `$3,000` cada
`10,000 km`, seguro anual, verificación, llantas y otros gastos capturados por
el usuario.

### Inputs del MVP

#### Campos globales

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Nombre del vehículo | Texto opcional | 0-80 caracteres | vacío |
| Kilómetros anuales | Texto numérico | `>= 0` | vacío |

#### Campos por gasto

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Nombre del gasto | Texto | 0-80 caracteres | `Gasto 1` |
| Categoría | Selector/texto | servicio, llantas, seguro, impuestos/verificación, reparación, estacionamiento/peajes, lavado/accesorios, otro | servicio |
| Grupo | Selector o derivado | mantenimiento, propiedad, uso | derivado de categoría |
| Costo por evento | Texto monetario | `>= 0` | vacío |
| Frecuencia | Selector | mensual, anual, cada N meses, cada N km | anual |
| Intervalo | Texto numérico | `> 0` cuando aplique | `1` |
| Notas | Texto opcional | 0-140 caracteres | vacío |

La captura monetaria debe aceptar formatos comunes de México, por ejemplo
`3000`, `$3,000`, `3,000.50` y `3000.50`.

### Mapeo recomendado de categorías

| Categoría | Grupo |
|-----------|-------|
| servicio | mantenimiento |
| llantas | mantenimiento |
| reparación | mantenimiento |
| seguro | propiedad |
| impuestos/verificación | propiedad |
| estacionamiento/peajes | uso |
| lavado/accesorios | uso |
| otro | elegido por el usuario o `uso` por defecto |

### Outputs principales

- Costo anual promedio.
- Reserva anual práctica.
- Promedio mensual.
- Reserva mensual sugerida.
- Costo por kilómetro promedio.
- Costo por kilómetro práctico.
- Eventos teóricos y prácticos por gasto.
- Desglose por grupo y categoría.
- Top 3 partidas más caras.
- Supuestos usados y partidas incompletas.

---

## Fórmulas

Eventos por frecuencia:

```text
mensual: eventos_teoricos = 12
anual: eventos_teoricos = 1
cada_N_meses: eventos_teoricos = 12 / N
cada_N_km: eventos_teoricos = km_anuales / N
```

Costo anual promedio:

```text
costo_anual_promedio = costo_evento * eventos_teoricos
```

Para planificación práctica, mostrar también eventos redondeados hacia arriba
cuando el redondeo cambie el resultado. Esta cifra debe etiquetarse como reserva
conservadora, no como calendario exacto del año:

```text
eventos_practicos =
  frecuencia es cada_N_meses o cada_N_km ? ceil(eventos_teoricos) : eventos_teoricos

costo_anual_practico = costo_evento * eventos_practicos
```

Resumen:

```text
total_anual_promedio = suma(costos_anuales_promedio)
reserva_anual_practica = suma(costos_anuales_practicos)
promedio_mensual = total_anual_promedio / 12
reserva_mensual_sugerida = reserva_anual_practica / 12

costo_por_km_promedio =
  km_anuales > 0 ? total_anual_promedio / km_anuales : null

costo_por_km_practico =
  km_anuales > 0 ? reserva_anual_practica / km_anuales : null
```

Desglose:

```text
total_grupo = suma(costos_anuales_promedio del grupo)
total_categoria = suma(costos_anuales_promedio de la categoria)
porcentaje_del_total = total_categoria / total_anual_promedio * 100
```

`porcentaje_del_total` solo se calcula cuando `total_anual_promedio > 0`.

---

## Validaciones y estados

- Costos no pueden ser negativos.
- Un costo vacío cuenta como cero, pero debe marcarse como partida incompleta en
  el resumen.
- Intervalo debe ser mayor que cero cuando la frecuencia sea `cada N meses` o
  `cada N km`.
- En frecuencias mensual y anual, ignorar el intervalo aunque exista en estado.
- Frecuencia por km requiere kilómetros anuales mayores que cero.
- Si km anuales es cero, ocultar costo por km y bloquear gastos `cada N km`
  hasta que exista kilometraje válido.
- Permitir kilómetros anuales en cero para usuarios que solo quieren sumar
  gastos fijos de propiedad.
- Mostrar costo promedio y reserva práctica cuando el redondeo cambie el
  resultado.
- Si todos los costos están vacíos o en cero, mostrar estado inicial claro y no
  resultados engañosos.
- Limitar el MVP a `100` partidas para mantener una experiencia móvil manejable.
- Una partida sin nombre puede mostrar nombre generado, por ejemplo `Gasto 1`.
- No incluir combustible o depreciación salvo que el usuario los agregue
  manualmente como partidas.
- El autoguardado en `localStorage` no debe sincronizar datos ni enviarlos a un
  servidor.

---

## Copiar resumen y CSV

El resumen copiado debe incluir nombre del vehículo cuando exista, kilómetros
anuales, total anual promedio, reserva anual práctica, promedio mensual, reserva
mensual sugerida, costo por km cuando aplique, top 3 partidas, desglose por
grupo y supuestos usados.

El CSV debe exportar al menos estas columnas:

```text
nombre,categoria,grupo,costo_evento,frecuencia,intervalo,notas,eventos_teoricos,eventos_practicos,costo_anual_promedio,costo_anual_practico
```

Opcionalmente puede incluir filas resumen al final:

```text
concepto,valor
kilometros_anuales,total
total_anual_promedio,total
reserva_anual_practica,total
promedio_mensual,total
reserva_mensual_sugerida,total
costo_por_km_promedio,total
costo_por_km_practico,total
```

Los valores monetarios del CSV deben exportarse como números sin símbolo de
moneda para facilitar edición posterior en hojas de cálculo.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de gastos anuales del vehículo` |
| Meta description | `Estima cuánto cuesta mantener y usar un vehículo al año, al mes y por kilómetro con gastos editables y reserva mensual sugerida.` |
| H1 | `Calculadora de gastos anuales del vehículo` |
| Keyword principal | `gastos anuales vehiculo` |
| Keywords secundarias | `costo mantenimiento auto`, `mantenimiento auto anual`, `costo por kilometro mantenimiento`, `gastos de carro`, `cuanto cuesta mantener un coche` |

Contenido recomendado:

- Explicar la diferencia entre mantenimiento, propiedad y uso.
- Aclarar que los precios se capturan manualmente y dependen de ciudad,
  proveedor, kilometraje y tipo de vehículo.
- Incluir ejemplos de conceptos frecuentes sin precios predeterminados.
- Explicar la diferencia entre costo anual promedio y reserva mensual sugerida.
- Enlazar internamente a `/vehiculos/calculadora-de-consumo-de-gasolina` y
  `/vehiculos/calculadora-de-costo-por-kilometro`.
- Enlazar a la calculadora de depreciación cuando exista publicada.
- Incluir FAQ sobre qué gastos incluir, cómo tratar llantas/servicios por km y
  por qué combustible/depreciación no se calculan automáticamente en el MVP.

---

## Pruebas sugeridas

- Gasto mensual multiplica por `12`.
- Gasto anual produce `1` evento teórico y práctico.
- Servicio cada `10000 km` con `15000 km/año` produce `1.5` eventos teóricos y
  `2` prácticos.
- Servicio anterior con costo `$3000` produce `$4500` promedio anual y `$6000`
  de reserva práctica.
- Km cero oculta costo por km.
- Km cero bloquea gastos `cada N km` con mensaje claro.
- Varias categorías se suman correctamente por grupo y categoría.
- Top 3 partidas ordena por costo anual promedio descendente.
- Intervalo cero muestra error en frecuencias por intervalo.
- Intervalo se ignora en frecuencia mensual o anual.
- Parser acepta `$3,000` como `3000`.
- Partidas con importe vacío cuentan como cero y se marcan incompletas.
- CSV exporta importes sin símbolo de moneda.
- Total anual promedio en cero oculta porcentajes de desglose para evitar
  división entre cero.

