# Fuente única de resultado e integración de controladores

## Problema

La calculadora base y la capa de fase 2 mantienen resultados, resumen y ciclo de
actualización independientes. Por ello, una política, materia u origen puede
actualizar la pantalla mientras el botón de copia conserva un resumen anterior,
o la pantalla puede conservar el resultado de otra materia.

## Requisito

Debe existir una única fuente de verdad por calculadora raíz. Puede ser un
controlador coordinador o un estado compartido, pero debe producir un contexto
normalizado con:

- materia y origen activos;
- modo de asistencias/faltas;
- datos manuales o eventos activos;
- política vigente;
- resultado numérico y presentación localizada;
- resumen copiable válido o estado inválido.

El render de resultados, el botón de copia, guardar historial y exportar CSV deben
consumir ese mismo contexto. No debe existir un `currentSummary` independiente que
pueda quedar vigente después de cambiar el modelo.

## Transiciones obligatorias

- Cambiar política recalcula inmediatamente y actualiza pantalla, copia, guardado y
  exportación.
- Cambiar de materia carga sus datos, eventos y política y recalcula; si la materia
  no tiene datos válidos, se muestra el estado inicial y se deshabilitan las acciones.
- Cambiar de origen confirma cuando corresponde, activa únicamente la fuente elegida
  y recalcula; el origen anterior no puede seguir alimentando el resultado.
- Cambiar entre política base y política avanzada no puede dejar valores de la
  política anterior en pantalla.
- Cambiar modo de captura o calendario conserva los datos válidos equivalentes y
  recalcula una sola vez.
- Una operación de copia asíncrona debe quedar asociada a la versión del contexto;
  si cambia cualquier entrada antes de terminar, no puede anunciar ni copiar como
  vigente el resultado anterior.

## Aceptación

1. Con datos manuales válidos, cambiar a una política de redondeo modifica el
   resultado visible y el texto copiado con los mismos estados y cifras.
2. Cambiar de una política avanzada a la base restaura el resultado exacto base sin
   conservar valores de la política avanzada.
3. Crear dos materias con resultados diferentes y alternarlas muestra siempre el
   resultado de la materia seleccionada; copiar después de alternar copia esa materia.
4. Cambiar de manual a calendario y de calendario a manual no conserva el resultado
   del origen anterior.
5. Con una copia pendiente, limpiar o editar el formulario evita cualquier anuncio
   de éxito para el resumen anterior.
6. En todos los casos, las acciones de copiar, guardar y exportar se deshabilitan
   cuando el contexto activo no es válido.
