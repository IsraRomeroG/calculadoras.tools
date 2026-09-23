# Ampliaciones de fase 2 recuperadas de v1

Estado: especificadas como entregas posteriores a la base. Conservan las ideas
valiosas de v1 aún ausentes, con alcance y aceptación propios. No bloquean las
correcciones de 01–05 ni autorizan a anunciar funcionalidades todavía inexistentes.

Secuencia: A (materias), E (políticas), B (calendario), C (historial), D (CSV).
A usa inicialmente las reglas base; E añade configuración explícita. B se apoya
en ambas para evitar dos fuentes de conteo incompatibles. C y D consumen el modelo
versionado resultante. Cada ampliación mantiene paridad funcional ES/EN.

## A. Varias materias

Crear, renombrar, seleccionar y eliminar materias locales, cada una con ID estable,
nombre, entradas y política propia. Una materia nueva usa los valores iniciales
de la spec 02; cambiar de materia no sobrescribe otras. Confirmar eliminación de
una materia con datos o proporcionar deshacer. No solicitar nombre del estudiante.

Mostrar por materia asistencia actual y proyección diferenciadas; no promediar
porcentajes para deducir aprobación global. Un promedio global, si se añadiera,
requeriría otra definición y no pertenece a esta ampliación. El límite es 20
materias por sesión, con mensaje al alcanzarlo; no truncar silenciosamente.

Aceptación: dos materias con mínimos y estados diferentes permanecen independientes;
renombrar no cambia sus datos; borrar la seleccionada elige otra o muestra inicio
vacío; no queda una copia exportable de un resultado eliminado.

## E. Políticas escolares configurables

La política base sigue siendo la predeterminada. Un panel avanzado permite elegir
reglas explícitas por materia, sin presuponer normas nacionales ni institucionales.
Mostrar la política utilizada en resultados, historial y exportación.

- Justificadas J: enteros entre 0 y F. Opciones: cuentan como ausencia (base), se
  excluyen del denominador, o cuentan como asistencia. En exclusión, T'=T−J y A'=A;
  en crédito, T'=T y A'=A+J; en base, T'=T y A'=A. No aplicar dos opciones a la vez.
- Si T'=0, mostrar «Sin clases computables», porcentaje indefinido y sin división
  por cero. La proyección puede calcularse si T'+R>0; de lo contrario es indefinida.
- Retardos L: número de clases asistidas con retardo, entero 0–A; ninguna clase puede
  contar simultáneamente como falta y retardo. Regla opcional: cada k retardos
  completos equivalen a una ausencia, con k entero 1–100 elegido por el usuario.
  Descontar `floor(L/k)` de A' sin cambiar T'; registrar el remanente `L mod k`.
  Las proyecciones suponen futuras asistencias sin retardo. No descontar fracciones.
- Redondeo institucional opcional: exacto (base) o redondeo decimal a 0, 1 o 2
  decimales, mitad hacia arriba, aplicado al porcentaje antes de evaluar el umbral.
  Mostrar porcentaje real, porcentaje evaluado y política. No inferir esta regla
  porque la pantalla normalmente muestre dos decimales.

Cuando haya política de redondeo, no reutilizar ciegamente las fórmulas exactas de
02: definir un predicado compartido `meetsPolicy(attended,total)` y obtener M como
el menor número entero de asistencias que satisface ese predicado para N. El mismo
predicado determina estado actual, máximo alcanzable, disponibilidad y recuperación.
Con redondeo a d decimales, usar aritmética racional: las unidades redondeadas son
`floor((2 * attended * 100 * 10^d + total) / (2 * total))`; compararlas con el mínimo
exacto mediante enteros escalados. Recuperación puede resolverse por búsqueda
monótona acotada analíticamente o por duplicación y búsqueda binaria, sin corte
arbitrario de 1000. Conservar la regla de imposibilidad de 100% con faltas solo en
política exacta: algunas políticas de redondeo sí pueden evaluar 100%.

Aceptación: T=10,A=8,J=1 produce 80% base, 8/9 en exclusión y 90% con crédito;
T=10,A=9,L=3,k=3 produce 80% tras penalización. L=2,k=3 no descuenta asistencia.
T=3,A=2,p=66.67 falla en exacto y cumple redondeando a 2 decimales. Validar
combinaciones, mínimos 0/100, denominador cero y paridad entre predicado y proyección.
Cambiar política no modifica los registros originales, solo la interpretación.

## B. Calendario simple de clases y faltas

Dos modos de origen por materia: totales manuales o registro de clases. No mezclar
un total manual con eventos sumados automáticamente. Antes de cambiar de origen
con datos existentes, explicar el reemplazo y permitir cancelar; no inventar
fechas a partir de totales. El registro anterior puede conservarse separado para
volver al modo, pero solo el modo activo alimenta el cálculo.

Cada evento tiene ID, fecha local `YYYY-MM-DD`, etiqueta opcional y estado:
asistida, falta, justificada, retardo, programada o cancelada. Permitir varias
clases el mismo día con IDs distintos. Editar/eliminar recalcula sin duplicaciones.
Justificada es una falta base con marca de política; retardo es asistencia con
marca. Cancelada no entra en denominadores; programada solo entra en R. No cambiar
automáticamente una programada a falta cuando pasa su fecha.

Incluir control «El calendario restante está completo». Solo si está activado,
R es el número de programadas (incluido cero); en otro caso R es desconocido.
Sin clases realizadas, pedir registrar al menos una antes de usar el motor base.
Mantener límites de 1000 realizadas y 1000 programadas activas y explicar el exceso.

Aceptación: cancelar no reduce el porcentaje, editar un evento no lo duplica,
varias sesiones por fecha se cuentan individualmente, cambiar zona horaria no
mueve fechas locales y el calendario incompleto no produce curso terminado.

## C. Historial local en `sessionStorage`

Guardar instantáneas solo mediante «Guardar resultado», no cada pulsación.
Cada instantánea incluye ID, fecha/hora, versión del esquema, versión de reglas,
materia, entradas, política, origen y resultado. Mantener un máximo de 50
instantáneas; al llenarse, pedir borrar alguna, sin eliminar silenciosamente.

Permitir consultar, restaurar entradas y borrar una o todas. Restaurar recalcula
con las reglas actuales; si difieren de la versión guardada, distinguir el
resultado histórico del recalculado. Una instantánea no debe sobrescribir datos
activos sin una acción explícita de restaurar.

Explicar que se guarda en la sesión del navegador, sin sincronización ni promesa
de conservación permanente. `sessionStorage` ausente, sin cuota o bloqueado no
impide calcular; mostrar que no se pudo guardar. Validar esquema y datos al leer,
sin ejecutar contenido ni insertar HTML de nombres. No usar `localStorage` como
fallback silencioso. Permitir borrar datos guardados independientemente de limpiar
el formulario actual.

Aceptación: recargar conserva instantáneas de la sesión cuando el almacenamiento
está disponible; datos corruptos/incompatibles no rompen la herramienta; borrar
todo elimina solo las claves de esta calculadora, no las de otras herramientas.

## D. Exportación CSV

Exportar mediante acción explícita el resultado actual, materias válidas o
instantáneas seleccionadas. Cada fila identifica su origen; no exportar formularios
inválidos como resultados ni reconstruir falsamente un calendario desde agregados.

Columnas mínimas: versión de esquema, fecha de exportación, materia, origen,
T/A/F originales, mínimo, R, política, T/A efectivos si aplica, porcentaje actual,
estado actual, estado final, total final, Q, B, E, máximo final, n y estado de
recuperación. Usar columnas de estado y celdas vacías para desconocido/no aplicable;
el cero solo representa cero. Conservar precisión del mínimo y suficiente precisión
numérica; los estados exactos son autoritativos frente al formato de porcentajes.

CSV UTF-8, separador coma, saltos CRLF, cabecera estable, punto decimal sin
agrupadores; escapar comillas, comas y saltos de línea según CSV. Neutralizar en
campos textuales del usuario prefijos que una hoja de cálculo pueda ejecutar como
fórmula (`=`, `+`, `-`, `@`, tabuladores y retornos iniciales). No alterar números
calculados legítimos. Crear descarga local y liberar la URL de objeto después.

Aceptación: nombres con tildes, comas, comillas y saltos de línea se recuperan
correctamente; fórmulas en nombres no se ejecutan al importar; null y cero son
distintos; cifras y estados coinciden con el resultado o la instantánea seleccionada.
