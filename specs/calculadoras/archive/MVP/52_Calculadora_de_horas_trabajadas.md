# Especificación v2 - Calculadora de horas trabajadas

## Descripción general

Herramienta para calcular el tiempo trabajado durante una jornada formada por
uno o varios turnos. Debe restar descansos, identificar turnos que cruzan
medianoche y estimar horas normales, horas extra y pago cuando el usuario
ingresa una tarifa por hora.

La calculadora debe servir para responder rápidamente:

1. ¿Cuánto tiempo trabajé realmente hoy?
2. ¿Cuánto tiempo corresponde a horas normales y horas extra?
3. ¿Cuánto debería recibir según mi tarifa y multiplicador configurados?
4. ¿Cómo puedo copiar un resumen claro para mi hoja de tiempo?

**Arquitectura:** todo el cálculo ocurre en el cliente. No requiere backend,
base de datos ni llamadas a APIs externas.

**Aviso de alcance:** las horas extra y el pago son estimaciones basadas en los
valores configurados por el usuario. La herramienta no aplica automáticamente
leyes laborales, convenios, impuestos, redondeos de nómina ni reglas de una
empresa.

---

## Promesa de producto

> Convierte entradas, salidas y descansos en un resumen claro de la jornada,
> listo para revisar o copiar.

La calculadora debe aportar más que una resta entre dos horas. Debe permitir
registrar jornadas partidas, detectar errores comunes y mostrar conjuntamente
el tiempo bruto, los descansos, el tiempo neto y el pago estimado.

---

## Objetivos de producto

- Calcular una jornada compuesta por uno o varios turnos.
- Restar descansos por turno.
- Soportar turnos que cruzan medianoche.
- Detectar turnos solapados para evitar contar tiempo dos veces.
- Aplicar el límite de horas normales al total neto de la jornada, no a cada
  turno individual.
- Calcular pago normal, pago extra y pago total cuando exista una tarifa.
- Mostrar resultados en formato de duración y en horas decimales.
- Generar un resumen listo para copiar.
- Ofrecer una experiencia accesible y mobile first.
- Generar una página estática optimizada para SEO en Astro.

## Fuera de alcance del MVP

- Calcular automáticamente obligaciones o derechos laborales.
- Aplicar reglas legales por país, estado, convenio o empresa.
- Registrar varios días o una semana laboral completa.
- Asignar fechas específicas a los turnos.
- Soportar turnos individuales de `24 horas` o más.
- Aplicar tarifas diferentes por turno, día, horario nocturno o festivo.
- Calcular impuestos, retenciones o deducciones de nómina.
- Exportar CSV, PDF o archivos de hoja de cálculo.
- Guardar historial o datos personales.

---

## Alcance recomendado

### MVP

- Una jornada con lista editable de turnos.
- Hora de entrada, hora de salida y descanso por turno.
- Etiqueta opcional por turno.
- Detección de cruce de medianoche.
- Detección de solapamientos.
- Tarifa por hora opcional.
- Límite diario de horas normales.
- Multiplicador de horas extra.
- Resultado total y desglose por turno.
- Diferencia frente al límite diario configurado.
- Probar ejemplo, agregar, duplicar y eliminar turno.
- Copiar resumen y limpiar formulario.
- Errores por campo, advertencias contextuales y estados accesibles.

### Fase 2

- Modo semanal con fecha o día de la semana por jornada.
- Reglas de horas extra semanales.
- Tarifas diferentes por turno o franja horaria.
- Guardar plantillas e historial en `localStorage`.
- Exportar CSV y hoja de cálculo.
- Vista imprimible.
- Compartir jornada mediante parámetros de URL.

---

## Ruta y archivos

| Elemento | Valor |
|----------|-------|
| URL canónica | `/fecha-tiempo/calculadora-de-horas-trabajadas` |
| Archivo Astro | `src/pages/fecha-tiempo/calculadora-de-horas-trabajadas.astro` |
| Lógica de cálculo | `src/lib/calculators/fecha-tiempo/calculadora-de-horas-trabajadas/workHours.ts` |
| Pruebas unitarias | `src/lib/calculators/fecha-tiempo/calculadora-de-horas-trabajadas/workHours.test.ts` |
| Categoría | `fecha-tiempo` |
| Locale base | `es-MX` |
| Moneda base | `MXN`, símbolo `$` |

---

## Definiciones del modelo

### Jornada

Conjunto de turnos que se evalúan como una sola unidad para calcular horas
normales y extra. El MVP no asigna una fecha a la jornada.

### Turno

Periodo definido por una hora de entrada, una hora de salida y un descanso. La
hora de entrada pertenece al día base de la jornada.

Si la salida es anterior a la entrada, se interpreta que ocurre al día
siguiente. Una salida igual a la entrada es ambigua y debe mostrar error; no se
interpreta automáticamente como un turno de `24 horas`.

### Tiempo bruto

Duración entre la entrada y la salida antes de restar el descanso.

### Tiempo neto

Tiempo bruto menos el descanso. Es el tiempo usado para totales, horas extra y
pago.

### Horas normales y extra estimadas

El límite de horas normales se aplica una sola vez sobre el tiempo neto total de
la jornada. Las horas que superan el límite se muestran como horas extra
estimadas según la configuración del usuario.

### Horas decimales

Representación del tiempo neto útil para hojas de tiempo y cálculos monetarios.
Por ejemplo, `8 h 30 min` equivale a `8.50 h`.

---

## Experiencia mobile first

### Principios

- Mantener corto el primer recorrido: primer turno, descanso y resultado.
- Mostrar cada turno como una tarjeta editable, nunca como una fila de tabla.
- Colocar tarifa y configuración de horas extra en una sección desplegable.
- Mostrar el resultado principal inmediatamente después del formulario.
- No depender de tablas horizontales para información esencial.
- Mantener objetivos táctiles de al menos `44 × 44 px`.
- Usar etiquetas visibles; no depender únicamente de placeholders o iconos.
- Conservar el último resultado válido y marcarlo como desactualizado al editar.

### Orden de la interfaz en móvil

1. H1 y descripción breve.
2. Lista de turnos.
3. Acción `Agregar otro turno`.
4. Ajustes opcionales de pago y horas extra.
5. Acción principal de ancho completo.
6. Resultado principal.
7. Resumen de tiempo bruto, descansos y tiempo neto.
8. Pago estimado, si aplica.
9. Desglose por turno.
10. Acciones de copiar resumen y limpiar.
11. Contenido educativo y FAQs.

En escritorio, formulario y resultado pueden mostrarse en dos columnas. El orden
del documento debe seguir siendo lógico sin estilos.

### Tarjeta de turno

Cada turno debe mostrar:

- Etiqueta opcional, por ejemplo `Turno 1` o `Proyecto A`.
- Hora de entrada.
- Hora de salida.
- Descanso.
- Indicador visible `Termina al día siguiente` cuando corresponda.
- Duración neta del turno cuando sea válido.
- Acciones `Duplicar` y `Eliminar`.

Composición móvil sugerida:

```text
Turno 1                              8 h 00 min

Entrada                   Salida
[ 09:00 ]                 [ 18:00 ]

Descanso
[ 0 min ] [ 30 min ] [ 45 min ] [ 60 min ] [ Otro ]

[ Duplicar ] [ Eliminar ]
```

Reglas:

- Mostrar una tarjeta vacía al iniciar.
- La primera tarjeta aparece expandida.
- Los turnos nuevos reciben una etiqueta secuencial.
- Después de agregar un turno, mover el foco a su hora de entrada.
- No permitir eliminar el único turno; ofrecer limpiar sus valores.
- Limitar el MVP a `20` turnos.
- En móvil, duplicar y eliminar deben incluir texto accesible y no depender
  únicamente de iconos.

### Captura de horas

- Usar `input type="time"` cuando esté disponible.
- Mantener una etiqueta visible para cada hora.
- No usar selectores personalizados complejos.
- Mostrar `Termina al día siguiente` tan pronto como una salida válida sea
  anterior a la entrada.
- Tratar entrada y salida iguales como error, no como cruce de medianoche.

### Captura de descanso

- Ofrecer accesos rápidos de `0`, `30`, `45` y `60 min`.
- Permitir ingresar otros minutos mediante un campo con `inputmode="numeric"`.
- Comunicar la selección mediante texto y `aria-pressed`.
- No permitir que el descanso sea igual o mayor que el tiempo bruto.

### Ajustes desplegables

Agrupar tarifa y horas extra dentro de:

`Pago y horas extra`

Resumen cerrado sugerido:

> Límite normal: 8 h · Horas extra: 1.5× · Sin tarifa

### Acción principal

- Usar un botón de ancho completo con la etiqueta `Calcular jornada`.
- Puede permanecer sticky en móvil siempre que no cubra campos, errores ni
  acciones del sistema.
- Tras un cálculo válido, mover el foco al encabezado del resultado.
- Anunciar el resultado mediante `aria-live="polite"`.
- No anunciar cada cambio mientras la persona escribe.

### Presentación del resultado

La cifra principal debe ser el tiempo neto:

```text
Total trabajado
8 h 00 min
8.00 horas decimales
```

Debajo:

```text
Tiempo bruto: 9 h 00 min
Descansos: 1 h 00 min
Horas normales: 8 h 00 min
Horas extra estimadas: 0 h 00 min
```

Si existe tarifa:

```text
Pago estimado
$1,200.00
Normal: $960.00 · Extra: $240.00
```

---

## Flujo principal del MVP

**Ejemplo:** trabajé de `09:00` a `18:00` con `60` minutos de descanso.
¿Cuánto tiempo trabajé y cuánto debería recibir?

1. El usuario captura entrada, salida y descanso.
2. Opcionalmente agrega otros turnos de la misma jornada.
3. Opcionalmente configura tarifa, límite normal y multiplicador extra.
4. La calculadora valida los turnos y bloquea solapamientos.
5. El resultado muestra tiempo bruto, descanso, tiempo neto, horas normales,
   horas extra estimadas y pago estimado.
6. El usuario puede copiar un resumen de la jornada.

---

## Inputs del MVP

### Campos por turno

| Campo | Tipo | Valores válidos | Valor inicial |
|-------|------|-----------------|---------------|
| Etiqueta | Texto opcional | `0-40` caracteres | `Turno 1` |
| Hora de entrada | Hora | `00:00-23:59` | vacío |
| Hora de salida | Hora | `00:00-23:59`, diferente de entrada | vacío |
| Descanso | Texto numérico y presets | minutos enteros `0-1,439`, menores que tiempo bruto | `0` |

### Ajustes de jornada

| Campo | Tipo | Valores válidos | Valor inicial |
|-------|------|-----------------|---------------|
| Tarifa por hora | Texto numérico opcional | finita, `>= 0`, máximo 2 decimales | vacío |
| Límite de horas normales | Texto numérico | `0-24`, máximo 2 decimales | `8` |
| Multiplicador de horas extra | Texto numérico | `1-5`, máximo 2 decimales | `1.5` |

La tarifa vacía oculta los resultados monetarios. Una tarifa de `0` es válida y
debe mostrar un pago estimado de `$0.00`.

---

## Acciones del MVP

- `Calcular jornada`.
- `Agregar otro turno`.
- `Duplicar`.
- `Eliminar`.
- `Probar ejemplo`.
- `Copiar resumen`.
- `Limpiar`.

`Exportar CSV` queda fuera del MVP. Sin fechas ni modo semanal, un resumen
copiable aporta más valor inmediato y evita generar archivos poco útiles.

---

## Fórmulas y algoritmo

### Conversión de hora

```text
entrada_min = hora_entrada * 60 + minuto_entrada
salida_min = hora_salida * 60 + minuto_salida
```

### Duración de un turno

```text
si salida_min == entrada_min:
  error "La entrada y la salida no pueden ser iguales."

salida_ajustada_min = salida_min

si salida_min < entrada_min:
  salida_ajustada_min += 1440
  termina_dia_siguiente = true

duracion_bruta_min = salida_ajustada_min - entrada_min
duracion_neta_min = duracion_bruta_min - descanso_min
```

La duración bruta de un turno siempre debe ser mayor que `0` y menor que
`1,440 minutos`. El descanso debe ser menor que la duración bruta.

### Detección de solapamientos

Cada turno se representa como un intervalo semiabierto:

```text
[entrada_min, salida_ajustada_min)
```

Dos turnos se solapan cuando:

```text
inicio_a < fin_b y inicio_b < fin_a
```

Los turnos adyacentes son válidos. Por ejemplo, `09:00-13:00` y
`13:00-17:00` no se solapan.

En el MVP, todas las entradas pertenecen al mismo día base. Un turno que cruza
medianoche puede terminar al día siguiente, pero no se pueden crear turnos cuya
entrada pertenezca explícitamente al día siguiente.

### Totales de jornada

```text
tiempo_bruto_total_min = suma(duracion_bruta_min)
descanso_total_min = suma(descanso_min)
tiempo_neto_total_min = suma(duracion_neta_min)

limite_normal_min = limite_horas_normales * 60

horas_normales_min = min(tiempo_neto_total_min, limite_normal_min)
horas_extra_min = max(0, tiempo_neto_total_min - limite_normal_min)
```

El límite se aplica al total de la jornada. No debe reiniciarse para cada
turno.

### Pago estimado

```text
pago_normal =
  (horas_normales_min / 60) * tarifa_hora

pago_extra =
  (horas_extra_min / 60) * tarifa_hora * multiplicador_extra

pago_total = pago_normal + pago_extra
```

Los pagos deben calcularse a partir de minutos y precisión completa. No se deben
redondear previamente las horas decimales.

### Formato y redondeo

- Mantener minutos enteros y precisión completa durante los cálculos.
- Formatear duraciones como `8 h 05 min`.
- Formatear horas decimales con dos decimales, por ejemplo `8.08 h`.
- Formatear importes monetarios con dos decimales.
- Redondear solo para presentación.
- No mostrar `NaN`, `Infinity` ni resultados parciales inválidos.

---

## Outputs del MVP

### Resultado principal

- Tiempo neto total en formato de duración.
- Tiempo neto total en horas decimales.
- Diferencia frente al límite configurado.

La diferencia debe tener contexto:

- Debajo del límite: `Faltan 45 min para alcanzar el límite configurado.`
- En el límite: `La jornada coincide con el límite configurado.`
- Sobre el límite: `La jornada supera el límite configurado por 1 h 15 min.`

### Desglose de tiempo

- Tiempo bruto total.
- Descansos totales.
- Tiempo neto total.
- Horas normales.
- Horas extra estimadas.

### Pago estimado

Visible únicamente cuando la tarifa no está vacía:

- Tarifa por hora.
- Pago normal.
- Pago extra.
- Pago total estimado.

### Desglose por turno

Cada tarjeta o fila de detalle debe mostrar:

- Etiqueta.
- Entrada y salida.
- Indicador de día siguiente cuando aplique.
- Duración bruta.
- Descanso.
- Duración neta.

Las horas normales y extra se muestran en el total de jornada, no se asignan a
turnos individuales en el MVP.

---

## Validaciones, advertencias y estados

### Errores bloqueantes

- No existe al menos un turno completo.
- Falta entrada o salida en un turno iniciado.
- Entrada o salida no es una hora válida.
- Entrada y salida son iguales.
- Descanso no es un entero finito.
- Descanso es negativo.
- Descanso es igual o mayor que la duración bruta.
- Dos o más turnos se solapan.
- Existen más de `20` turnos.
- Tarifa negativa, no finita o con más de dos decimales.
- Límite de horas normales fuera de `0-24`.
- Multiplicador de horas extra fuera de `1-5`.
- Cualquier resultado excede límites numéricos seguros.

### Advertencias no bloqueantes

- Un turno cruza medianoche:

  > La salida se interpretó como parte del día siguiente.

- Jornada neta mayor que `16 horas`:

  > La jornada es inusualmente larga. Revisa entradas, salidas y descansos.

- Descanso mayor que la mitad del tiempo bruto:

  > El descanso representa más de la mitad de este turno. Confirma el valor.

- Límite normal igual a `0`:

  > Todo el tiempo trabajado se calculará como horas extra estimadas.

- Tarifa igual a `0`:

  > El pago estimado será $0.00 con la tarifa configurada.

- Pago u horas extra visibles:

  > Esta estimación usa tu configuración y no aplica automáticamente reglas
  > laborales, fiscales o de nómina.

### Estados de interfaz

| Estado | Comportamiento |
|--------|----------------|
| Inicial | Mostrar un turno vacío, ajustes cerrados y resultado neutral. |
| Incompleto | No mostrar resultado final; señalar campos faltantes después de interacción o submit. |
| Inválido | Mostrar errores junto a campos y un resumen accesible. |
| Válido | Mostrar totales, diferencia frente al límite y desglose por turno. |
| Válido con pago | Mostrar también pago normal, extra y total. |
| Válido con advertencia | Mostrar resultado completo y advertencias contextuales. |
| Desactualizado | Conservar el último resultado válido, marcarlo como anterior y deshabilitar copiar. |
| Ejemplo cargado | Completar dos turnos, ajustes y mostrar resultado. |
| Limpio | Restaurar un turno vacío, ajustes iniciales y foco en la primera entrada. |

### Estado inválido después de un resultado válido

- Conservar el último resultado válido.
- Marcarlo claramente como `Resultado anterior`.
- No permitir copiarlo como si correspondiera a los datos actuales.
- Mover el foco al resumen de errores después de intentar calcular.

---

## Ejemplo del MVP

Usar un ejemplo que demuestre una jornada partida y horas extra:

| Turno | Entrada | Salida | Descanso |
|-------|---------|--------|----------|
| Mañana | `09:00` | `14:00` | `30 min` |
| Tarde | `15:00` | `20:00` | `0 min` |

Ajustes:

- Tarifa: `$100.00` por hora.
- Límite normal: `8 h`.
- Multiplicador extra: `1.5×`.

Resultado:

```text
Tiempo bruto: 10 h 00 min
Descansos: 0 h 30 min
Tiempo neto: 9 h 30 min
Horas normales: 8 h 00 min
Horas extra estimadas: 1 h 30 min
Pago normal: $800.00
Pago extra: $225.00
Pago total estimado: $1,025.00
```

---

## Copiar resumen

El texto copiable debe incluir únicamente datos válidos y visibles:

```text
Resumen de jornada

Mañana: 09:00-14:00 · descanso 30 min · neto 4 h 30 min
Tarde: 15:00-20:00 · descanso 0 min · neto 5 h 00 min

Tiempo bruto: 10 h 00 min
Descansos: 0 h 30 min
Total trabajado: 9 h 30 min (9.50 h)
Horas normales: 8 h 00 min
Horas extra estimadas: 1 h 30 min
Pago total estimado: $1,025.00

Estimación basada en la configuración ingresada.
Calculado en calculadoras.tools
```

Si no existe tarifa, omitir todas las líneas monetarias.

---

## Accesibilidad

- Asociar cada campo con su `label`, ayuda y mensaje de error.
- Usar `inputmode="numeric"` para descanso y `inputmode="decimal"` para tarifa,
  límite y multiplicador.
- Mantener acciones táctiles frecuentes con un área mínima de `44 × 44 px`.
- Comunicar presets seleccionados mediante `aria-pressed`.
- No depender únicamente del color para errores, advertencias o estado
  desactualizado.
- Anunciar resultados, errores y estado de copiado mediante regiones
  `aria-live`.
- Mover el foco al resultado después de un cálculo válido.
- Mover el foco al resumen de errores después de un intento inválido.
- Mantener un orden de foco lógico al agregar, duplicar o eliminar turnos.
- Respetar `prefers-reduced-motion` al desplazar la vista.
- No ocultar información esencial dentro de una tabla con scroll horizontal.

---

## Privacidad

- Todos los cálculos ocurren en el navegador.
- No enviar turnos, tarifas ni resultados a APIs externas.
- No guardar datos en el MVP.
- Explicar cualquier uso futuro de `localStorage` antes de incorporarlo.

---

## Contenido educativo y confianza

La página debe explicar:

- Diferencia entre tiempo bruto y tiempo neto.
- Cómo convertir minutos a horas decimales.
- Cómo se interpretan los turnos que cruzan medianoche.
- Por qué las horas extra se aplican al total de la jornada.
- Diferencia entre una estimación configurable y las reglas laborales reales.
- Por qué el pago estimado puede diferir de una nómina.

Debe incluir enlaces contextuales a calculadoras relacionadas cuando existan,
por ejemplo tarifa por hora freelance y diferencia entre fechas.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de horas trabajadas y pago por hora` |
| Meta description | `Suma turnos, resta descansos y calcula horas normales, horas extra y pago estimado, incluso si trabajas después de medianoche.` |
| H1 | `Calculadora de horas trabajadas` |
| Keyword principal | `calculadora horas trabajadas` |
| Keywords secundarias | `sumar horas laborales`, `calcular horas extra`, `calcular pago por hora`, `horas de trabajo calculadora` |
| Canonical | `/fecha-tiempo/calculadora-de-horas-trabajadas` |

### FAQs sugeridas

- ¿Cómo calculo mis horas trabajadas?
- ¿Cómo se restan los descansos?
- ¿Cómo calcula un turno que cruza medianoche?
- ¿Cómo convierto horas y minutos a horas decimales?
- ¿Cómo se calculan las horas extra?
- ¿Puedo estimar mi pago por hora?
- ¿La calculadora aplica las leyes laborales de mi país?

---

## Analítica sugerida

Medir sin guardar los valores introducidos:

- Uso de calcular.
- Uso de ejemplo.
- Cantidad de turnos utilizada.
- Uso de duplicar turno.
- Apertura de ajustes de pago.
- Presencia de un turno que cruza medianoche.
- Resultado con horas extra.
- Uso de copiar resumen.

---

## Pruebas sugeridas

### Cálculos base

- `09:00-18:00` con `60 min` produce `8 h 00 min` netas.
- `09:00-17:05` sin descanso produce `8 h 05 min` y `8.08 h` visibles.
- Dos turnos suman correctamente tiempo bruto, descanso y tiempo neto.
- Dos turnos de `5 h` en la misma jornada producen `2 h` extra con límite de
  `8 h`.
- El límite de horas normales se aplica una sola vez al total diario.
- Límite normal `0` convierte todo el tiempo neto en horas extra estimadas.

### Medianoche y solapamientos

- `22:00-06:00` produce `8 h` y marca salida al día siguiente.
- `22:00-06:00` con `30 min` produce `7 h 30 min`.
- Entrada igual a salida muestra error.
- Un turno nunca produce automáticamente `24 h`.
- `09:00-13:00` y `13:00-17:00` son adyacentes y válidos.
- `09:00-14:00` y `13:00-17:00` muestran error de solapamiento.
- Un turno que cruza medianoche se compara correctamente contra otros turnos.

### Pago y precisión

- Tarifa vacía oculta resultados monetarios.
- Tarifa `0` muestra pago de `$0.00`.
- Pago normal usa horas normales.
- Pago extra usa tarifa por multiplicador.
- El pago se calcula desde minutos exactos y no desde horas decimales
  previamente redondeadas.
- Cambiar límite o multiplicador actualiza correctamente el pago.

### Validación y formato

- Descanso igual o mayor que tiempo bruto muestra error.
- Valores vacíos, no finitos y no numéricos no producen resultados visibles.
- Ningún resultado contiene `NaN` o `Infinity`.
- Las duraciones normalizan correctamente minutos y horas.
- El texto copiado omite pago cuando no existe tarifa.

### Interacción y accesibilidad

- En viewports de `320 px` y `390 px` no existe desbordamiento horizontal.
- Turnos y resultados esenciales se muestran como tarjetas apiladas.
- Agregar turno mueve el foco a su entrada.
- No se puede eliminar el único turno.
- Los presets de descanso comunican selección mediante `aria-pressed`.
- El resultado se anuncia mediante `aria-live`.
- Un submit inválido muestra errores asociados a sus campos.
- Editar después de calcular marca el resultado anterior como desactualizado.
- Limpiar restaura estado y foco.

---

## Criterios de aceptación del MVP

1. El usuario puede calcular una jornada con uno o varios turnos.
2. Cada turno resta correctamente su descanso.
3. Los turnos que cruzan medianoche se interpretan y comunican claramente.
4. Entrada y salida iguales no se interpretan como `24 horas`.
5. Los turnos solapados se detectan antes de calcular el total.
6. Las horas extra se calculan sobre el tiempo neto total de la jornada.
7. El resultado muestra duración y horas decimales.
8. El pago usa minutos exactos y separa pago normal y extra.
9. El usuario puede copiar un resumen útil de la jornada.
10. La experiencia esencial no depende de tablas horizontales.
11. La interfaz funciona sin desbordamiento horizontal desde `320 px`.
12. Errores, advertencias y resultados son accesibles mediante teclado y
    tecnologías de asistencia.
13. La página deja claro que el resultado no sustituye reglas laborales ni de
    nómina.
