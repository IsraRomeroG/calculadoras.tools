# Eliminación de materias y orden del DOM

## Eliminación

Si la materia seleccionada es la única y contiene datos, eventos, política o un
resultado guardado localmente, la acción de eliminar debe pedir confirmación o
proporcionar un deshacer visible. No se debe reemplazar silenciosamente por una
materia nueva.

Si la confirmación se cancela, no cambia ningún dato. Si se confirma:

- se elimina solo la materia seleccionada;
- se selecciona otra materia existente o se muestra el inicio vacío;
- no queda una copia exportable de un resultado eliminado;
- las demás materias y su historial permanecen intactos.

La confirmación debe existir también cuando solo hay una materia.

## Orden DOM y móvil

Dentro de cada calculadora raíz, el orden de lectura debe ser:

1. introducción breve;
2. formulario principal: clases impartidas, modo, asistencias/faltas, mínimo y
   calendario;
3. resultado actual;
4. proyección final y resumen;
5. detalles, recuperación y explicación.

Los controles adicionales de materias y origen no deben desplazar el formulario
principal por delante de las entradas obligatorias en móvil. Pueden integrarse dentro
del formulario después de la introducción o presentarse en una sección posterior,
sin invertir el orden de lectura en escritorio.

Debe conservarse:

- navegación completa por teclado;
- etiquetas, ayudas y errores asociados;
- foco visible;
- ausencia de scroll horizontal a 320 px y con zoom de 200%;
- botones de al menos 44 CSS px.

## Aceptación

1. El primer control de datos después de la introducción es `totalClasses`.
2. El selector de materia/origen no aparece antes de las entradas principales en el
   orden DOM móvil.
3. El borrado de la única materia con datos siempre requiere confirmación o permite
   deshacer.
4. Cancelar el borrado deja la pantalla y el almacenamiento sin cambios.
