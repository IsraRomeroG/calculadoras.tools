# Restauración aislada entre materias

## Problema

Al restaurar una snapshot manual, el estado de eventos de la materia previamente
seleccionada puede permanecer en la variable activa. El siguiente guardado puede
contaminar la materia restaurada con eventos ajenos.

## Requisito

La restauración debe reemplazar atómicamente todo el estado de la materia activa:

- identidad y nombre;
- origen;
- entradas manuales;
- eventos;
- estado de calendario completo;
- política;
- resultado recalculado.

Antes de recalcular, las variables de trabajo deben derivarse exclusivamente de la
snapshot restaurada. Ningún arreglo de eventos o valor de otra materia puede
reutilizarse como fallback.

Si la snapshot es manual, los eventos activos deben ser los eventos persistidos de
la materia restaurada, normalmente un arreglo independiente aunque no se usen para
el cálculo manual. Si la snapshot es de calendario, deben validarse y copiarse sus
eventos antes de actualizar la UI.

## Aceptación

1. Materia A tiene eventos y materia B no. Restaurar una snapshot manual de B desde
   A no introduce eventos de A en B.
2. Después de la restauración manual, cambiar B a origen calendario muestra solo los
   eventos propios de B.
3. Restaurar una snapshot de calendario de A desde B no conserva eventos de B.
4. Modificar o guardar la materia restaurada no cambia ninguna otra materia.
5. Las copias de arreglos se hacen de forma que posteriores mutaciones no compartan
   referencias accidentales.
