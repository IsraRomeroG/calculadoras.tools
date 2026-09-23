# Consulta y restauración segura del historial versionado

## Diagnóstico corregido

Con el esquema actual, el lector ya acepta snapshots cuya `rulesVersion` difiere
de la vigente y el listado las marca como históricas. También usa
`sessionStorage`, limita el historial a 50 entradas sin expulsarlas
automáticamente y borra solo la clave de esta calculadora. Estas conductas deben
conservarse como pruebas de regresión; no son defectos pendientes.

Los problemas pendientes son:

- el listado muestra materia, fecha y política, pero no permite consultar el
  resultado guardado antes de restaurar;
- restaurar recalcula con las reglas actuales sin mostrar el resultado histórico
  junto al nuevo cuando las versiones difieren;
- una entrada corrupta dentro de un arreglo de snapshots descarta todo el
  historial, incluso las entradas válidas;
- la validación de los datos guardados no cubre todos los límites y relaciones
  necesarios antes de mostrarlos o restaurarlos.

## Lectura y compatibilidad

- Aceptar snapshots válidas del esquema actual aunque su `rulesVersion` sea
  anterior. Conservar `schemaVersion` y `rulesVersion` originales y marcar las de
  reglas distintas como históricas.
- Admitir otros esquemas solo mediante lectores o migraciones explícitos para
  versiones identificadas. Rechazar de forma segura un esquema desconocido; no
  asumir que dos versiones son compatibles por parecer similares.
- Si el JSON contiene un arreglo con entradas válidas e inválidas, aislar las
  inválidas, conservar las válidas y avisar que algunas se ignoraron. La lectura
  no debe reescribir ni borrar automáticamente el historial almacenado.
- Si el JSON completo no puede analizarse o su contenedor es inválido, informar
  que el historial no está disponible sin impedir el cálculo actual.
- Validar ID, fecha, nombre, origen, entradas, política, eventos y estructura del
  resultado histórico antes de mostrarlos. Aplicar límites y relaciones del
  contrato de cálculo; no basta con comprobar que los campos sean cadenas.

## Consulta y restauración

El usuario debe poder consultar el resultado guardado sin modificar la materia
activa. La vista histórica debe identificar la fecha, materia, origen y versión
de reglas, y distinguir el resultado guardado de cualquier cálculo vigente.

Restaurar debe ser una acción explícita y debe:

1. validar de nuevo toda la snapshot antes de modificar el estado activo;
2. cargar sus entradas y política, sin reutilizar datos de otra materia;
3. recalcular con las reglas actuales;
4. cuando las versiones de reglas difieran, mostrar el resultado guardado junto
   al recalculado e indicar si cambiaron las cifras o el estado.

Una snapshot inválida no puede modificar la materia ni el resultado activo. El
resultado histórico nunca sustituye directamente al resultado recalculado. Los
datos guardados se presentan como texto; no se ejecutan ni se insertan como HTML.

## Invariantes de almacenamiento

- Usar únicamente `sessionStorage` para el historial, sin fallback silencioso a
  `localStorage`. Su ausencia o fallo no impide calcular.
- Mantener un máximo de 50 snapshots. Al intentar guardar la número 51, pedir
  borrar alguna sin eliminar entradas automáticamente.
- Borrar todo elimina únicamente la clave de historial de esta calculadora.

## Aceptación

1. Una snapshot válida con el esquema actual y reglas antiguas se lista como
   histórica y permite consultar su resultado guardado sin restaurarla.
2. Restaurarla recalcula con las reglas actuales y, si difieren las versiones,
   muestra ambos resultados con una indicación de sus diferencias.
3. En un arreglo con una snapshot corrupta y otra válida, la válida permanece
   consultable; la corrupta se ignora y se informa del problema.
4. Un JSON ilegible, un esquema desconocido o una snapshot inválida no rompen el
   cálculo ni modifican los datos activos.
5. Un historial lleno no expulsa snapshots y borrar todo no afecta claves ajenas.
