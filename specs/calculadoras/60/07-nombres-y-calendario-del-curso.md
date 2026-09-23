# Mejora incremental: nombres y calendario del curso

Estado: especificada; pendiente de implementación. Fecha: 2026-09-22.
Dependencia: pasos 01–05 ya implementados según confirmación del usuario.
Prioridad: siguiente entrega, antes de las ampliaciones 06; no depende de ellas.

## Objetivo y alcance

Aclarar qué clases forman el denominador actual y permitir calcular el calendario
final con el dato que conoce el usuario: clases restantes o clases totales del
curso. Actualmente el total final ya se obtiene de impartidas + restantes y se
muestra en el resumen; falta la entrada por total del curso y su cálculo inverso.

Esta spec amplía 02–05 para esta entrega, sin reabrir la implementación base ni
modificar su evidencia histórica. Conserva fórmulas exactas, modos de asistencias
y faltas, estados, rutas, canonical, alternates y cálculo local. No incluye fechas,
eventos, materias, almacenamiento ni políticas escolares de 06.

## Nombres y ayudas

Usar estos nombres de forma coherente en formulario, resultados, errores, copia,
ejemplos, explicación, fórmulas y FAQ:

| Concepto | ES | EN |
| --- | --- | --- |
| T: clases que ya ocurrieron | Clases impartidas hasta hoy | Classes held so far |
| R: clases futuras | Clases restantes | Remaining classes |
| N: clases impartidas y futuras | Clases totales del curso | Total classes in the course |

En resúmenes compactos se admite «Impartidas hasta hoy» / «Held so far».
Evitar «Clases completadas», que puede confundirse con las asistidas por el alumno.
El nombre interno `totalClasses` sigue representando T, nunca N; no es necesario
renombrarlo para cambiar la etiqueta visible.

Ayuda de T: «Incluye las clases a las que asististe y aquellas a las que faltaste.
No cuentes clases futuras ni canceladas». Conservar también el límite 1–1000.
EN: «Include classes you attended and classes you missed. Do not count future or
cancelled classes». Mostrar el mismo límite.

Ayuda de N: «Incluye las clases impartidas hasta hoy y las que faltan para terminar
el curso». EN: «Include classes held so far and those remaining until the course ends».

## Formulario y cálculo automático

Después de los datos de asistencia y mínimo, agrupar la entrada opcional bajo
«Calendario del curso (opcional)» / «Course schedule (optional)».
Mostrar un selector con estas opciones:

- «Conozco las clases restantes» / «I know the remaining classes» (inicial).
- «Conozco el total del curso» / «I know the course total».

Solo el dato seleccionado es editable. El otro se muestra junto a él como salida
de solo lectura identificada con «Calculado automáticamente» / «Calculated
automatically», con etiqueta accesible. No exigir introducir ambas cantidades.
Reutilizar el patrón accesible del selector de asistencias/faltas de 03.

Con T válido:

```text
Modo restantes: R introducido; N = T + R.
Modo total: N introducido; R = N - T.
Asistencia actual = A / T * 100, en ambos modos.
```

La proyección final usa el mismo motor base tras normalizar el calendario a R.
No usar N como denominador de la asistencia actual ni duplicar las fórmulas de
necesidad, disponibilidad o recuperación.

## Contrato y validaciones

- Estado de captura explícito: `calendarMode = remaining | total`; rechazar modos
  desconocidos. N editable puede almacenarse como `courseTotalClasses` para
  distinguirlo de `totalClasses` (T).
- T conserva 1–1000; R conserva 0–1000. N admite enteros 1–2000 y, además,
  debe satisfacer `T <= N <= T + 1000`. El nuevo modo no amplía los límites base.
- Aplicar a N las reglas de parsing de clases de 02, incluida la agrupación de
  miles válida. Rechazar fracciones, signos, texto y valores no finitos.
- N menor que T: «El total del curso no puede ser menor que las clases impartidas
  hasta hoy». Si N−T supera 1000, explicar que se admiten hasta 1000 restantes.
  Traducir ayudas y errores equivalentes en EN.
- Vacío en el campo activo significa calendario desconocido: R normalizado es
  `null`, salida derivada sin cifra y proyección pendiente. Nunca deducir curso
  terminado de un vacío. N=0 es inválido; R=0 o N=T indican curso terminado.
- Solo validar el campo activo. Si el calendario es inválido, conservar la
  situación actual cuando T y A/F sean válidos, retirar la proyección anterior y
  deshabilitar la copia. Pedir revisar el dato activo, sin tratarlo como desconocido.
- Con T inválido o vacío no derivar N/R ni mostrar resultados anteriores como
  vigentes. Conservar el texto introducido para que el usuario pueda corregirlo.

## Cambios de modo, edición y acciones

- Al alternar con calendario y T válidos, convertir R ↔ N conservando el mismo
  resultado. Ejemplo: T=40, R=10 se convierte en N=50, R derivado=10.
- Al alternar sin datos suficientes o con calendario inválido, limpiar el destino
  y la salida derivada; no recuperar valores ocultos obsoletos.
- Al editar T, conservar el dato introducido en el modo activo: con N=50 fijo,
  T de 40 a 45 cambia R de 10 a 5; con R=10 fijo cambia N de 50 a 55.
  Si la nueva combinación resulta inválida, mostrar el error sin ajustar el dato.
- Vaciar el campo activo elimina la cifra derivada y la proyección, manteniendo
  la asistencia actual válida. No reformatear el texto mientras se escribe.
- Limpiar vuelve al modo restantes, ambos valores de calendario vacíos y sin
  resultados ni errores, además de los reinicios de 03.
- Los ejemplos existentes cargan explícitamente el modo restantes y limpian N
  anterior. Añadir un ejemplo por total: T=40, A=34, p=80, N=50; R=10, Q=6, B=4.
- Copiar consume el mismo resultado normalizado que la pantalla e incluye T, R
  y N cuando se conocen. Con calendario vacío indica proyección desconocida.
- Mantener foco, uso por teclado, errores asociados y avisos moderados de 03.
  La salida automática no mueve el foco ni anuncia todo el panel en cada pulsación.

## Contenido e integración

Actualizar ES y EN a la vez en el componente compartido, controlador, adaptadores,
resumen copiable y ambas páginas. Ajustar descripción, introducción, fórmulas,
ejemplo resuelto y FAQ para explicar ambas formas de introducir el calendario.
FAQ visible y JSON-LD siguen compartiendo fuente por idioma.

Mostrar las dos relaciones: «Total del curso = impartidas + restantes» y
«Restantes = total del curso − impartidas». Explicar que basta conocer una de las
dos cantidades, además de las impartidas. El estado desconocido debe invitar a
introducir restantes o total, sin dar a entender que solo existe la primera opción.

## Pruebas y aceptación de esta entrega

Además de conservar las regresiones de 05, comprobar:

| Caso | Resultado esperado |
| --- | --- |
| T=40, A=34, p=80, R=10 | N=50, actual 85%, Q=6, B=4 |
| Mismos datos, N=50 en modo total | R=10; idénticos números, estados y copia |
| T=40, N=40 frente a R=0 | Curso terminado; mismo estado final |
| Campo activo vacío en ambos modos | Actual disponible; calendario desconocido |
| T=40, N=39 o N=0 | Error; sin proyección ni copia habilitada |
| T=40, N=1041 | Error: más de 1000 restantes |
| T=1000, N=2000 | R=1000; válido |
| T=1000, N=2001 | Error de límite |
| Alternar modos con valores válidos | Conserva calendario y resultados |
| Alternar con campo vacío o inválido | Destino vacío; sin cifras obsoletas |
| N=50 fijo, T pasa de 40 a 45 | R pasa de 10 a 5 |
| R=10 fijo, T pasa de 40 a 45 | N pasa de 50 a 55 |
| N=50 fijo, T pasa a 51 | Error; no sustituye N ni muestra R negativo como válido |
| Vaciar, limpiar o cargar un ejemplo tras usar N | Sin datos, errores o resultados residuales |

Repetir casos relevantes en modo faltas y comprobar paridad ES/EN. Cubrir parsing
de N y normalización sin depender solo de comprobaciones textuales de fuente.
Verificar selector, salidas y errores con teclado/lector de pantalla, móvil
320/375 px, escritorio y zoom 200%, siguiendo la estrategia de 05.

Registrar la evidencia de 07 por separado de la obtenida para 05. No marcar esta
mejora ni las revisiones manuales como completadas por haber redactado la spec.
Mantener las restricciones de comandos de validación del proyecto indicadas en 05.
