# Especificación v2 - Calculadora de VO2 máx estimado

## Descripción general

Herramienta mobile-first para estimar VO2 máx mediante dos pruebas de campo:

- **Cooper de 12 minutos:** prueba de esfuerzo alto basada en la distancia
  recorrida.
- **Rockport de caminata de 1 milla:** prueba submáxima basada en edad, sexo
  utilizado por la fórmula, peso, tiempo y pulso final.

La calculadora debe ayudar al usuario a elegir y ejecutar correctamente la
prueba, detectar datos poco fiables, interpretar el resultado y compararlo con
una medición anterior realizada con el mismo método.

Debe aclarar que una prueba de campo estima la capacidad aeróbica y no equivale
a medir VO2 máx mediante una prueba cardiopulmonar de laboratorio.

**Arquitectura:** todo el cálculo ocurre en el cliente. No requiere backend,
base de datos ni llamadas a APIs externas.

---

## Objetivos de producto

- Estimar VO2 máx con métodos de campo conocidos.
- Ayudar a elegir entre Cooper y Rockport según el esfuerzo que puede realizar
  el usuario.
- Explicar cómo obtener datos comparables antes de mostrar el formulario.
- Mostrar un resultado comprensible y accionable sin diagnóstico clínico.
- Identificar problemas de protocolo, valores inusuales y extrapolaciones.
- Facilitar el seguimiento con el resultado anterior del mismo método.
- Generar una página estática optimizada para SEO en Astro.

## Principios de producto

1. **El protocolo importa tanto como la fórmula:** un dato mal obtenido no debe
   presentarse con falsa precisión.
2. **Comparar tendencias aporta más valor que una cifra aislada:** solo comparar
   resultados obtenidos con el mismo método.
3. **Seguridad antes que conversión:** Cooper requiere una advertencia más
   visible por ser una prueba intensa.
4. **Interpretación prudente:** no usar etiquetas clínicas ni presentar el
   resultado como diagnóstico.
5. **Mobile-first real:** el usuario podría consultar instrucciones y capturar
   el resultado mientras está en una pista o caminando.

---

## Alcance

### MVP

- Selector entre Cooper y Rockport.
- Ayuda breve para elegir método.
- Aviso de seguridad visible antes de las instrucciones.
- Protocolo guiado y checklist de calidad para cada método.
- Cooper mediante distancia total con unidades `m`, `km` o `mi`.
- Entrada alternativa de Cooper mediante vueltas de `400 m` y metros
  adicionales.
- Rockport con peso en `kg` o `lb`, tiempo separado en minutos y segundos, y
  pulso final.
- Confirmación de que Rockport se realizó caminando toda la milla sin correr.
- Resultado principal en `ml/kg/min`, redondeado a un decimal.
- Resumen del método y datos utilizados.
- Indicador textual de calidad del dato.
- Ritmo medio derivado de la prueba.
- Comparación con el resultado anterior del mismo método en `sessionStorage`.
- Probar ejemplo, copiar resultado y limpiar formulario.
- Errores por campo, advertencias contextuales y estados accesibles.

### Fase 2

- Cronómetro integrado de 12 minutos para Cooper.
- Cronómetro integrado para Rockport.
- Método de carrera de 1.5 millas.
- Referencias por edad y sexo con fuente y revisión editorial explícitas.
- Historial de varias mediciones con fecha y notas.
- Enlace contextual a calculadora de ritmo.

### Fuera de alcance

- Diagnosticar capacidad cardiovascular o enfermedades.
- Recomendar intensidad de entrenamiento a partir del resultado.
- Determinar si una persona puede realizar ejercicio intenso.
- Comparar directamente un resultado Cooper contra uno Rockport.
- Sustituir una prueba de laboratorio o evaluación profesional.
- Guardar datos de salud de forma persistente en servidor o `localStorage`.

---

## Ruta y archivos

| Elemento | Valor |
|----------|-------|
| URL canónica | `/salud/calculadora-vo2-max` |
| Archivo Astro | `src/pages/salud/calculadora-vo2-max.astro` |
| Lógica de cálculo | `src/lib/calculators/salud/calculadora-vo2-max/vo2Max.ts` |
| Pruebas unitarias | `src/lib/calculators/salud/calculadora-vo2-max/vo2Max.test.ts` |
| Categoría | `salud` |
| Locale base | `es-MX` |

La ruta `/salud/calculadora-vo2-max` debe considerarse definitiva. Si en el
futuro se mueve a otra categoría, se debe cambiar la ruta canónica y crear un
redirect Apache `301`; no deben coexistir páginas duplicadas.

---

## Comportamiento mobile-first

### Layout

- Usar una sola columna desde `320 px` hasta escritorio amplio.
- Orden móvil:
  1. Selector de método.
  2. Aviso de seguridad.
  3. Protocolo breve.
  4. Inputs.
  5. Acción principal.
  6. Resultado.
  7. Interpretación y contenido educativo.
- En escritorio amplio, formulario y resultado pueden mostrarse en dos
  columnas.
- Mostrar únicamente los inputs del método seleccionado.
- Evitar tablas horizontales en la interfaz de la calculadora.
- Mantener dimensiones estables en la región de resultado para reducir saltos
  visuales.
- Textos, unidades y resultados deben hacer wrap sin romper el layout.

### Controles

- Selector de método como dos botones segmentados de ancho completo.
- Objetivos táctiles de al menos `48 px`.
- CTA principal de ancho completo en móvil.
- Usar `inputmode="decimal"` para distancia y peso.
- Usar `inputmode="numeric"` para edad, minutos, segundos, vueltas y pulso.
- No depender de placeholders como única etiqueta.
- Mantener selector de unidad unido visualmente a su campo.
- En Rockport, minutos y segundos deben mostrarse juntos sin requerir escribir
  un tiempo decimal.

### Resultado y foco

- Al enviar un cálculo válido, desplazar el resultado a la vista y llevar foco a
  su encabezado.
- Respetar `prefers-reduced-motion`.
- El resultado principal debe poder leerse sin abrir acordeones.
- Evitar colocar referencias normativas o contenido editorial largo antes del
  resultado.

---

## Elección del método

Mostrar una ayuda breve junto al selector:

| Método | Mensaje de elección |
|--------|---------------------|
| Cooper | `Elige Cooper si puedes realizar una carrera o esfuerzo intenso durante 12 minutos.` |
| Rockport | `Elige Rockport si prefieres una caminata rápida de 1 milla y puedes medir tu pulso al terminar.` |

No presentar Rockport como una prueba sin riesgo. Ambos métodos requieren
detenerse ante síntomas.

Al cambiar de método:

- Conservar temporalmente los valores ya escritos de cada método durante la
  sesión de edición.
- Ocultar errores y advertencias pertenecientes al método anterior.
- Invalidar el resultado visible hasta realizar un nuevo cálculo.
- No comparar resultados entre métodos.

---

## Aviso de seguridad

Debe aparecer antes del protocolo y de los inputs:

> No realices la prueba si tienes dolor de pecho, mareo, dificultad respiratoria
> inusual, una lesión que limite el esfuerzo o indicación médica de evitar
> ejercicio. Detente si aparecen síntomas. Esta herramienta no determina si es
> seguro que realices la prueba.

Para Cooper, añadir:

> Cooper exige un esfuerzo alto. Si no estás acostumbrado a correr o tienes
> dudas sobre tu salud, considera Rockport o consulta a un profesional.

El aviso debe ser textual y no depender únicamente del color o de un icono.

---

## Protocolos guiados

### Protocolo Cooper

Mostrar antes de los inputs:

1. Usa una ruta plana y medida, preferiblemente una pista.
2. Tras un calentamiento adecuado, recorre la mayor distancia posible durante
   exactamente `12:00`.
3. Registra la distancia total, incluyendo metros adicionales a las vueltas
   completas.
4. Para comparar avances, repite la prueba con condiciones similares.

Checklist opcional que modifica la calidad del dato, pero no bloquea:

- `La ruta fue plana y la distancia estaba medida.`
- `La prueba duró exactamente 12 minutos.`
- `No tuve que detenerme por dolor, mareo u otro síntoma.`

### Protocolo Rockport

Mostrar antes de los inputs:

1. Usa una ruta plana y medida de exactamente `1 milla` o `1.609 km`.
2. Camina toda la distancia lo más rápido posible sin correr.
3. Registra el tiempo total en minutos y segundos.
4. Mide el pulso inmediatamente al terminar.
5. Para comparar avances, repite la prueba con condiciones similares.

Confirmación obligatoria:

- `Caminé toda la milla sin correr.`

Checklist opcional que modifica la calidad del dato:

- `La ruta fue plana y la distancia estaba medida.`
- `Medí el pulso inmediatamente al terminar.`
- `No tuve que detenerme por dolor, mareo u otro síntoma.`

Ayuda para pulso:

> Usa el valor de un monitor o cuenta los latidos durante 60 segundos
> inmediatamente al terminar. Si usas una medición más corta, conviértela con
> cuidado a latidos por minuto.

---

## Flujo principal

1. El usuario elige Cooper o Rockport.
2. Lee el aviso de seguridad y el protocolo breve.
3. Captura los datos disponibles.
4. La calculadora valida datos y protocolo al enviar.
5. Si el cálculo es válido, muestra resultado, calidad, ritmo y resumen.
6. Si existe un resultado anterior del mismo método en `sessionStorage`, muestra
   la diferencia sin clasificarla automáticamente como mejora o deterioro.
7. El usuario puede copiar, probar otro ejemplo o limpiar.

---

## Inputs Cooper

El usuario puede elegir uno de dos modos de captura.

### Distancia total

| Campo | Tipo | Rango aceptado | Valor por defecto |
|-------|------|----------------|-------------------|
| Distancia recorrida | Texto numérico | Equivalente a `600-5000 m` | vacío |
| Unidad | Selector | `m`, `km`, `mi` | `m` |

### Vueltas de pista

| Campo | Tipo | Rango aceptado | Valor por defecto |
|-------|------|----------------|-------------------|
| Vueltas completas de 400 m | Entero | `0-12` | vacío |
| Metros adicionales | Entero | `0-399` | vacío |

Reglas:

- La distancia canónica interna siempre se guarda en metros.
- En modo vueltas, al menos uno de los dos campos debe ser mayor que cero.
- La suma debe cumplir el rango aceptado.
- Cambiar unidad debe convertir desde el valor canónico, no desde un valor ya
  redondeado.
- La interfaz debe explicar que el resultado puede ser poco representativo si
  la persona caminó gran parte de Cooper o no mantuvo esfuerzo alto.

---

## Inputs Rockport

| Campo | Tipo | Rango aceptado | Valor por defecto |
|-------|------|----------------|-------------------|
| Edad | Entero | `18-100` | vacío |
| Sexo utilizado por la fórmula | Selector | `Masculino`, `Femenino` | vacío |
| Peso | Texto numérico | Equivalente a `20-250 kg` | vacío |
| Unidad de peso | Selector | `kg`, `lb` | `kg` |
| Minutos de la milla | Entero | `8-30` | vacío |
| Segundos | Entero | `0-59` | vacío |
| Pulso al final | Entero | `60-220 bpm` | vacío |
| Caminé sin correr | Checkbox obligatorio | confirmado | desmarcado |

Reglas:

- Mostrar texto de ayuda para explicar que el sexo es una variable requerida
  por la ecuación original.
- Convertir el peso a libras internamente.
- Convertir tiempo a minutos decimales mediante:

```text
tiempo_minutos = minutos + (segundos / 60)
```

- No permitir un tiempo inferior a `8:00` ni superior a `30:00`.
- Un tiempo inferior a `10:00` debe mostrar advertencia para confirmar que se
  caminó toda la distancia sin correr.
- Edad `30-69` se considera el rango principal de uso de la ecuación.
- Edad `18-29` o `70-100` permite calcular, pero debe mostrar una advertencia de
  extrapolación y reducir la calidad del dato.

Antes del lanzamiento, la redacción del rango principal de edad debe verificarse
contra la fuente editorial elegida para la ecuación Rockport.

---

## Parsing y unidades

- Aceptar punto o coma decimal para distancia y peso.
- Rechazar valores con más de dos decimales en inputs generales.
- Edad, tiempo, vueltas, metros adicionales y pulso deben ser enteros.
- El parsing debe rechazar texto mezclado, infinito, `NaN` y valores vacíos.
- No redondear valores internos antes de calcular.
- Redondear únicamente al mostrar resultados.

### Conversiones

```text
metros_desde_km = km * 1000
metros_desde_millas = millas * 1609.344
peso_lb = peso_kg * 2.2046226218
peso_kg = peso_lb / 2.2046226218
```

---

## Fórmulas

### Cooper

```text
vo2max = (distancia_metros - 504.9) / 44.73
```

### Rockport

```text
sexo = masculino ? 1 : 0
peso_lb = peso_kg * 2.2046226218
tiempo_minutos = minutos + (segundos / 60)

vo2max = 132.853
         - (0.0769 * peso_lb)
         - (0.3877 * edad)
         + (6.315 * sexo)
         - (3.2649 * tiempo_minutos)
         - (0.1565 * pulso_final)
```

### Ritmo medio derivado

Cooper:

```text
ritmo_min_por_km = 12 / (distancia_metros / 1000)
```

Rockport:

```text
ritmo_min_por_km = tiempo_minutos / 1.609344
```

El ritmo es un dato derivado para contextualizar y repetir la prueba. No debe
presentarse como recomendación de entrenamiento.

---

## Calidad del dato

Mostrar uno de estos estados textuales:

| Calidad | Condición |
|---------|-----------|
| Buena | Todos los campos son válidos, no hay advertencias y el checklist relevante está completo. |
| Aceptable | El cálculo es válido, pero falta uno o más elementos opcionales del protocolo. |
| Revisar protocolo | Existe una advertencia por edad extrapolada, resultado inusual, tiempo Rockport muy rápido o condiciones de prueba poco comparables. |

No mostrar porcentajes de precisión ni intervalos de confianza inventados.

La calidad evalúa la información capturada y el protocolo declarado; no
certifica que el resultado sea exacto.

---

## Resultado

El resultado válido debe incluir, en este orden:

1. Encabezado `Tu VO2 máx estimado`.
2. Valor principal con un decimal y unidad `ml/kg/min`.
3. Método utilizado: Cooper o Rockport.
4. Calidad del dato y explicación breve.
5. Ritmo medio de la prueba.
6. Resumen de los inputs utilizados.
7. Comparación con resultado anterior del mismo método, si existe.
8. Advertencias aplicables.
9. Acciones de copiar y limpiar.

Ejemplo:

```text
Tu VO2 máx estimado
42.4 ml/kg/min

Método: Cooper de 12 minutos
Calidad del dato: Buena
Distancia: 2,400 m
Ritmo medio: 5:00 min/km

Frente a tu resultado anterior con Cooper: +1.4 ml/kg/min
```

### Interpretación

- Describir el valor como estimación de capacidad aeróbica relativa al peso.
- Explicar que clima, altitud, superficie, esfuerzo, técnica, medición del pulso
  y condiciones del día pueden cambiar el resultado.
- Recomendar comparar tendencias con el mismo método y condiciones similares.
- No usar etiquetas como `enfermo`, `riesgo`, `saludable` o equivalentes.
- No mostrar una clasificación por edad o sexo hasta contar con fuentes y
  revisión editorial.

### Valores inusuales

- Resultado menor a `10` o mayor a `90 ml/kg/min`: mostrar el cálculo con
  advertencia `El resultado es inusual; revisa los datos y cómo realizaste la
  prueba.`
- Resultado no finito, cero o negativo: no mostrar como resultado válido.
- No limitar silenciosamente el resultado a un rango.

---

## Comparación con resultado anterior

- Guardar en `sessionStorage` únicamente el último resultado válido de Cooper y
  el último resultado válido de Rockport.
- Guardar método, resultado sin redondear, fecha de sesión y resumen mínimo.
- Comparar únicamente resultados del mismo método.
- Mostrar diferencia absoluta en `ml/kg/min` con un decimal.
- No usar mensajes automáticos de celebración o alarma.
- Explicar que una diferencia pequeña puede deberse a las condiciones de prueba.
- La acción `Limpiar` borra el formulario y resultado actual, pero no elimina el
  resultado anterior guardado.
- Incluir una acción separada `Borrar comparación anterior` cuando exista.
- No usar `localStorage` ni enviar datos a APIs externas.

---

## Estados de interfaz

| Estado | Comportamiento |
|--------|----------------|
| Inicial | Selector, seguridad, protocolo e inputs visibles; resultado neutral. |
| Incompleto | No mostrar resultado final; señalar qué campos faltan después de interacción o submit. |
| Inválido | Mostrar errores junto a los campos y resumen accesible; no guardar ni copiar resultado. |
| Válido | Mostrar resultado, calidad, ritmo, resumen y acciones. |
| Válido con advertencia | Mostrar resultado y advertencias contextuales; calidad `Revisar protocolo`. |
| Método cambiado | Ocultar errores anteriores e invalidar el resultado visible. |
| Ejemplo cargado | Completar campos, calcular y mostrar resultado. |
| Limpio | Volver al estado inicial sin eliminar la comparación anterior. |

---

## Validaciones y mensajes

### Cooper

| Caso | Mensaje sugerido |
|------|------------------|
| Distancia vacía | `Ingresa la distancia recorrida en 12 minutos.` |
| Distancia menor a 600 m | `Revisa la distancia. Esta fórmula no ofrece un resultado utilizable con menos de 600 m.` |
| Distancia mayor a 5000 m | `Revisa la distancia; supera el rango aceptado por esta herramienta.` |
| Vueltas y metros en cero | `Ingresa al menos una vuelta o metros adicionales.` |
| Metros adicionales fuera de rango | `Usa un valor entre 0 y 399 metros.` |

### Rockport

| Caso | Mensaje sugerido |
|------|------------------|
| Edad fuera de rango | `Usa una edad entre 18 y 100 años.` |
| Peso fuera de rango | `Usa un peso equivalente a 20-250 kg.` |
| Minutos o segundos inválidos | `Ingresa un tiempo entre 8:00 y 30:00.` |
| Segundos mayores a 59 | `Usa un valor entre 0 y 59 segundos.` |
| Pulso fuera de rango | `Usa un pulso final entre 60 y 220 bpm.` |
| Confirmación sin marcar | `Confirma que caminaste toda la milla sin correr.` |
| Tiempo menor a 10:00 | `Es un tiempo de caminata muy rápido. Confirma que no corriste y que la distancia fue exactamente una milla.` |
| Edad fuera de 30-69 | `La ecuación puede ser menos representativa fuera de su rango principal de edad.` |

Los errores deben indicar cómo corregir el campo. Las advertencias no deben
bloquear un cálculo válido salvo cuando incumplen el protocolo obligatorio.

---

## Acciones

### Calcular

- Validar el método visible.
- No validar campos ocultos del otro método.
- Mostrar todos los errores relevantes en un solo envío.
- Si es válido, guardar el resultado actual después de recuperar la comparación
  anterior.

### Probar ejemplo

Ejemplo Cooper predeterminado:

```text
Distancia: 2400 m
Checklist: completo
Resultado esperado: 42.4 ml/kg/min
```

Ejemplo Rockport alternativo:

```text
Edad: 30
Sexo de fórmula: Masculino
Peso: 70 kg
Tiempo: 15:00
Pulso final: 140 bpm
Caminé sin correr: Sí
Resultado esperado: aproximadamente 44.8 ml/kg/min
```

La interfaz puede mostrar solo el ejemplo correspondiente al método activo.

### Copiar resultado

Copiar texto plano con:

- Resultado y unidad.
- Método.
- Calidad del dato.
- Resumen de inputs.
- Ritmo medio.
- Advertencias aplicables.
- Nota de que es una estimación de campo.

No copiar datos del resultado anterior salvo que la comparación esté visible.

### Limpiar

- Limpiar inputs, checklist, errores, advertencias y resultado actual.
- Mantener el método seleccionado.
- No borrar automáticamente la comparación anterior de `sessionStorage`.

---

## Accesibilidad

- Usar controles nativos y etiquetas asociadas.
- El selector segmentado debe comunicar el método activo.
- Los errores por campo deben estar asociados mediante `aria-describedby`.
- El resumen de errores debe recibir foco tras un submit inválido.
- El resultado principal debe estar en una región con `aria-live="polite"`.
- El estado de copiar debe anunciarse mediante `aria-live="polite"`.
- El encabezado del resultado debe aceptar foco mediante `tabindex="-1"`.
- No anunciar cada cambio mientras el usuario escribe; anunciar tras calcular.
- No depender únicamente de color para calidad, errores o advertencias.
- Respetar navegación por teclado y `prefers-reduced-motion`.

---

## Privacidad

- Todos los cálculos ocurren en el navegador.
- No enviar edad, sexo de fórmula, peso, pulso, distancia, tiempo ni resultados
  a APIs externas.
- `sessionStorage` solo contiene el último resultado de cada método durante la
  pestaña actual.
- Explicar que cerrar la pestaña elimina la comparación guardada.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de VO2 máx: prueba Cooper y Rockport` |
| Meta description | `Estima tu VO2 máx con la prueba Cooper de 12 minutos o la caminata Rockport. Incluye protocolo, calidad del dato y comparación.` |
| H1 | `Calculadora de VO2 máx estimado` |
| Keyword principal | `calculadora vo2 max` |
| Keywords secundarias | `vo2 max cooper`, `test rockport vo2`, `capacidad aerobica calculadora` |
| Canonical | `/salud/calculadora-vo2-max` |

### Contenido editorial recomendado

1. Qué significa VO2 máx y qué mide esta calculadora.
2. Cómo elegir entre Cooper y Rockport.
3. Cómo realizar correctamente cada prueba.
4. Por qué el resultado puede cambiar entre intentos.
5. Cómo comparar resultados sin falsa precisión.
6. Diferencia entre estimación de campo y prueba de laboratorio.
7. Fórmulas y fuentes utilizadas.

### FAQs sugeridas

- ¿Qué es VO2 máx?
- ¿Qué tan precisa es una prueba de campo?
- ¿Cuál es la diferencia entre Cooper y Rockport?
- ¿Puedo correr durante la prueba Rockport?
- ¿Cómo mido el pulso al terminar?
- ¿Por qué cambió mi resultado?
- ¿Puedo comparar Cooper con Rockport?
- ¿Necesito un pulsómetro?

---

## Fuentes editoriales mínimas

Antes de publicar:

- Citar la publicación original o una fuente técnica fiable para la fórmula de
  Cooper.
- Citar la publicación original o una fuente técnica fiable para la ecuación
  Rockport.
- Verificar el rango poblacional y limitaciones de cada ecuación.
- Revisar el aviso de seguridad con criterio editorial de salud.
- No añadir tablas normativas sin documentar población, método y fuente.

---

## Pruebas unitarias

### Fórmulas y conversiones

- Cooper con `2400 m` produce aproximadamente `42.37`.
- `2.4 km` y su equivalente en millas producen el mismo resultado.
- Cooper por `6 vueltas de 400 m` produce el mismo resultado que `2400 m`.
- Rockport convierte peso de kg a lb antes de aplicar la fórmula.
- Rockport con `15:30` utiliza `15.5` minutos.
- Rockport con edad `30`, masculino, `70 kg`, `15:00` y `140 bpm` produce
  aproximadamente `44.8`.
- Cambiar unidades y volver a la original no acumula error.
- El ritmo medio se calcula correctamente para ambos métodos.

### Validación

- Cooper menor a `600 m` no produce resultado válido.
- Cooper que produce resultado menor a `10` muestra advertencia.
- Rockport no calcula sin confirmar que se caminó toda la milla.
- Tiempo Rockport menor a `10:00` muestra advertencia.
- Segundos `60` o mayores muestran error.
- Pulso fuera de `60-220 bpm` muestra error.
- Edad fuera de `30-69`, pero dentro de `18-100`, calcula con advertencia.
- Resultado cero, negativo o no finito no se muestra como válido.
- Resultado mayor a `90` muestra advertencia.
- Se acepta coma decimal en distancia y peso.

### Estado y almacenamiento

- Cambiar método oculta errores del método anterior.
- No se validan inputs ocultos.
- Solo se compara contra el resultado anterior del mismo método.
- Limpiar no elimina la comparación anterior.
- Borrar comparación elimina únicamente el resultado anterior del método activo.

---

## Pruebas de aceptación

| Escenario | Criterio |
|-----------|----------|
| Cooper conocido | `2400 m` muestra `42.4 ml/kg/min`, ritmo `5:00 min/km` y método Cooper. |
| Cooper por vueltas | `6` vueltas y `0` metros coincide con `2400 m`. |
| Rockport conocido | Datos del ejemplo muestran aproximadamente `44.8 ml/kg/min`. |
| Rockport con segundos | `15:30` se interpreta como `15.5` minutos. |
| Rockport corriendo | Sin confirmación de caminata, no permite calcular. |
| Valor inusual | Se muestra resultado válido con advertencia textual. |
| Comparación | Un segundo cálculo del mismo método muestra diferencia contra el anterior. |
| Cambio de método | No arrastra resultado ni errores visibles del método anterior. |
| Copiar | El portapapeles contiene método, resultado, calidad y nota de estimación. |
| Mobile `320 px` | No hay desbordamiento horizontal y los controles se pueden usar. |
| Mobile `390 px` | Formulario, CTA y resultado se leen en una sola columna. |
| Escritorio amplio | Formulario y resultado pueden compartir viewport sin perder orden lógico. |
| Teclado | Todos los controles y acciones son utilizables sin puntero. |
| Lector de pantalla | Errores, resultado y estado de copiar se anuncian correctamente. |

---

## Criterios de finalización

- Los dos métodos calculan con fórmulas y conversiones verificadas.
- La interfaz explica cómo ejecutar cada prueba antes de solicitar datos.
- Seguridad y limitaciones son visibles sin depender del contenido SEO.
- El resultado incluye método, calidad, ritmo, resumen y comparación aplicable.
- No se comparan métodos distintos.
- Validaciones distinguen entre error bloqueante y advertencia.
- La experiencia funciona desde `320 px` y cumple las reglas de accesibilidad.
- No se envían ni persisten datos fuera de `sessionStorage`.
- La ruta canónica es `/salud/calculadora-vo2-max`.
