# Especificación v1.1 - Calculadora de presupuesto de boda

## Descripción general

Herramienta para crear un presupuesto preliminar de boda mediante categorías,
partidas, invitados, contingencia, depósitos pagados y presupuesto disponible.
La herramienta debe ayudar a convertir costos fijos, costos por invitado, costos
por mesa y cantidades unitarias en un total estimado claro.

Todos los costos se ingresan manualmente. Las plantillas pueden sugerir nombres
de partidas y categorías, pero no deben incluir precios predeterminados como si
fueran universales. El resultado no sustituye cotizaciones.

**Arquitectura:** todo el cálculo ocurre en el cliente. No requiere backend,
base de datos ni llamadas a APIs externas. El guardado local usa `localStorage`
y debe poder borrarse desde la interfaz.

---

## Objetivo de producto

- Sumar partidas del presupuesto de boda.
- Calcular partidas como monto fijo, costo por invitado, costo por mesa o
  cantidad por costo unitario.
- Calcular costo por invitado.
- Comparar costo estimado contra presupuesto disponible.
- Separar pagos capturados, pagos aplicados, excedentes, saldo de partidas y
  reserva de contingencia.
- Mostrar qué partidas y categorías consumen más presupuesto.
- Generar una página estática optimizada para SEO en Astro.

---

## Alcance recomendado

### MVP

- Número de invitados.
- Presupuesto disponible opcional.
- Invitados por mesa para partidas calculadas por mesa.
- Lista editable de partidas.
- Plantillas de partidas sin precios predeterminados.
- Categoría, tipo de cálculo, costo, depósito, responsable y notas opcionales.
- Contingencia editable.
- Resultado: total, costo por invitado, presupuesto usado, faltante/sobrante,
  pagado, saldo de partidas y contingencia reservada.
- Desglose por categoría y top 3 partidas más caras.
- Guardado automático en `localStorage`.
- Copiar resumen, limpiar formulario y exportar CSV.

### Fase 2

- Comparador de escenarios.
- Presupuesto objetivo por persona y prioridades.
- Calendario de pagos o fechas límite por proveedor.
- Vista imprimible.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL canónica | `/eventos/calculadora-presupuesto-boda` |
| Archivo Astro recomendado | `src/pages/eventos/calculadora-presupuesto-boda.astro` |
| Lógica de cálculo | `src/lib/calculators/eventos/calculadora-presupuesto-boda/weddingBudget.ts` |
| Pruebas unitarias | `src/lib/calculators/eventos/calculadora-presupuesto-boda/weddingBudget.test.ts` |
| Categoría | `eventos` |
| Locale base | `es-MX` |
| Moneda base | `MXN`, símbolo `$` |

La ruta canónica debe ser `/eventos/calculadora-presupuesto-boda` desde la
primera implementación. No crear una ruta alternativa, temporal o duplicada para
esta calculadora.

Si la categoría `eventos` todavía no existe en el proyecto, crearla como parte de
la implementación:

- Agregar `eventos` a `CATEGORY_SLUGS` en `src/lib/constants/categories.ts`.
- Agregar la definición de categoría con etiqueta `Eventos`, slug `eventos` y
  descripción orientada a presupuestos, costos por persona, celebraciones y
  organización de eventos.
- Crear la entrada de la calculadora en `src/lib/constants/calculators.ts` con
  `href: "/eventos/calculadora-presupuesto-boda"` y `categorySlug: "eventos"`.
- Crear la página en `src/pages/eventos/calculadora-presupuesto-boda.astro`.
- Actualizar pruebas del directorio de calculadoras y categorías para cubrir la
  nueva categoría y la nueva calculadora.

---

## Comportamiento mobile-first

- El primer viewport debe mostrar H1 compacto, invitados/presupuesto y una
  tarjeta resumen con total estimado, diferencia contra presupuesto y costo por
  invitado.
- En móvil, usar una barra resumen sticky inferior o superior con total y
  faltante/sobrante mientras se editan partidas.
- Cada partida se presenta como bloque editable o card colapsable, no como fila
  de tabla.
- Categorías y pagos como desglose secundario.
- Botones claros para agregar, duplicar y eliminar; usar iconos con texto solo
  cuando la acción no sea obvia.
- Controles táctiles de al menos 44px de alto y textos que no dependan del ancho
  de viewport para escalar.
- Evitar tablas extensas en el primer viewport; los desgloses pueden ir en
  secciones colapsables.
- No incluir precios predeterminados como si fueran universales.

---

## Flujo principal MVP

**Ejemplo:** Boda para `120 invitados`, presupuesto de `$400,000` y distintas
partidas de lugar, comida, fotografía y música.

### Inputs del MVP

#### Campos globales

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Invitados | Texto numérico entero | `1-10000` | vacío |
| Presupuesto disponible | Texto numérico opcional | `>= 0` | vacío |
| Invitados por mesa | Texto numérico entero | `1-50` | `10` |
| Contingencia (%) | Texto numérico | `0%-100%` | `10` |

#### Campos por partida

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Nombre de partida | Texto | 1-80 caracteres | `Partida 1` |
| Categoría | Selector/texto | lugar, banquete, bebidas, foto/video, música, decoración, vestimenta, belleza, ceremonia, transporte, hospedaje, papelería, regalos, otro | `Otro` |
| Tipo de cálculo | Selector | `fijo`, `por_invitado`, `por_mesa`, `cantidad_x_unitario` | `fijo` |
| Importe fijo | Texto numérico | `>= 0` | vacío |
| Costo unitario | Texto numérico | `>= 0` | vacío |
| Cantidad | Texto numérico | `>= 0` | `1` |
| Mesas manuales | Texto numérico entero opcional | `>= 1` | vacío |
| Depósito pagado | Texto numérico | `>= 0` | `0` |
| Responsable | Texto opcional | 0-80 caracteres | vacío |
| Notas | Texto opcional | 0-140 caracteres | vacío |

Para partidas por mesa, usar `mesas_manuales` si existe; si no, calcular mesas con
`ceil(invitados / invitados_por_mesa)`.

Las plantillas del MVP solo llenan nombre y categoría. Ejemplos: lugar, banquete,
bebidas, fotografía/video, música, flores/decoración, vestido/traje, maquillaje,
ceremonia, transporte, hospedaje, invitaciones, recuerdos y otros.

### Outputs principales

- Subtotal de partidas.
- Contingencia.
- Total estimado.
- Costo por invitado.
- Presupuesto por invitado disponible.
- Porcentaje de presupuesto usado.
- Total pagado capturado.
- Total pagado aplicado a partidas.
- Excedente de depósitos.
- Saldo de partidas.
- Contingencia reservada.
- Pendiente total estimado.
- Diferencia contra presupuesto.
- Desglose por categoría.
- Top 3 partidas más caras.

---

## Fórmulas

```text
costo_partida =
  si tipo = fijo: importe_fijo
  si tipo = por_invitado: costo_unitario * invitados
  si tipo = por_mesa: costo_unitario * mesas
  si tipo = cantidad_x_unitario: costo_unitario * cantidad

mesas = mesas_manuales || ceil(invitados / invitados_por_mesa)

subtotal = suma(costo_partida)
contingencia_monto = subtotal * (contingencia / 100)
total = subtotal + contingencia_monto
costo_por_invitado = total / invitados

pagado_capturado = suma(deposito)
pagado_aplicado = suma(min(deposito, costo_partida))
excedente_depositos = suma(max(deposito - costo_partida, 0))

saldo_partidas = max(subtotal - pagado_aplicado, 0)
contingencia_reservada = contingencia_monto
pendiente_total_estimado = saldo_partidas + contingencia_reservada

diferencia_presupuesto = presupuesto_disponible - total
porcentaje_presupuesto_usado = total / presupuesto_disponible * 100
presupuesto_por_invitado = presupuesto_disponible / invitados
```

`diferencia_presupuesto` solo se calcula si el presupuesto no está vacío.
`porcentaje_presupuesto_usado` solo se calcula si `presupuesto_disponible > 0`.
Con presupuesto `0`, mostrar la diferencia pero ocultar el porcentaje para evitar
división entre cero.

`pagado_capturado` muestra lo que el usuario escribió. `pagado_aplicado` limita
el pago al costo de cada partida para que el saldo no sea negativo. Si hay
excedente, debe mostrarse como advertencia y no desaparecer silenciosamente.

---

## Validaciones y estados

- Invitados debe ser entero positivo para costo por invitado, partidas por
  invitado y cálculo automático de mesas.
- Presupuesto vacío oculta la comparación. Presupuesto `0` no es vacío y debe
  mostrar diferencia negativa si hay costos.
- Costos no pueden ser negativos.
- Depósito mayor al costo muestra advertencia y excedente de depósitos.
- Permitir partidas con costo cero.
- Contingencia puede ser cero.
- Si una partida requiere invitados y el campo está vacío o inválido, mostrar
  advertencia en esa partida y excluirla del total hasta que sea calculable.
- Si `invitados_por_mesa` es inválido, usar error claro y no calcular partidas
  por mesa.
- La captura monetaria debe aceptar formatos comunes de México, por ejemplo
  `400000`, `$400,000` y `400,000.50`.
- Limitar el MVP a 100 partidas para mantener una experiencia móvil manejable.
- Si `localStorage` falla o no está disponible, la calculadora debe seguir
  funcionando y mostrar un aviso discreto.

---

## Copiar resumen y CSV

El resumen copiado debe incluir invitados, presupuesto disponible cuando exista,
subtotal, contingencia, total, costo por invitado, pagado aplicado, saldo de
partidas, pendiente total estimado y diferencia contra presupuesto.

El CSV debe exportar al menos estas columnas:

```text
nombre,categoria,tipo_calculo,cantidad,costo_unitario,costo_partida,deposito,responsable,notas
```

Los valores monetarios del CSV deben exportarse como números sin símbolo de
moneda para facilitar edición posterior en hojas de cálculo.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de presupuesto de boda` |
| Meta description | `Crea un presupuesto de boda con invitados, partidas, depósitos, contingencia, costo por persona y comparación contra tu presupuesto.` |
| H1 | `Calculadora de presupuesto de boda` |
| Keyword principal | `calculadora presupuesto boda` |
| Keywords secundarias | `costo boda`, `presupuesto boda por invitado`, `gastos de boda` |

Contenido recomendado:

- Explicar que los precios dependen de ciudad, temporada, proveedores y número
  de invitados.
- Incluir una guía breve de gastos frecuentes sin precios fijos.
- Incluir FAQ sobre qué gastos considerar, cómo calcular costo por invitado y
  para qué sirve la contingencia.
- Enlazar internamente a calculadoras relacionadas de eventos cuando existan.

---

## Pruebas sugeridas

- Costo por invitado divide total entre invitados.
- Contingencia aumenta subtotal.
- Partida fija usa el importe fijo como costo.
- Partida por invitado multiplica costo unitario por invitados.
- Partida por mesa calcula `ceil(invitados / invitados_por_mesa)`.
- Partida por mesa respeta `mesas_manuales` cuando existe.
- Partida cantidad x unitario multiplica cantidad por costo unitario.
- Depósitos capturados se suman correctamente.
- Depósitos aplicados se limitan al costo de la partida.
- Depósito mayor al costo genera excedente y advertencia.
- Saldo de partidas no incluye contingencia.
- Pendiente total estimado suma saldo de partidas y contingencia.
- Presupuesto vacío no genera diferencia.
- Presupuesto `0` genera diferencia negativa si hay total.
- Invitados cero muestra error.
- Parser acepta `$400,000` como `400000`.
- CSV exporta números sin símbolo de moneda.
- `localStorage` guarda y restaura una lista de partidas.

