# 03 - UX y comportamiento de la calculadora

## Objetivo

Reducir la fricción para introducir fechas y hacer que el resultado confirme
de inmediato la intención del usuario, sin cambiar las reglas matemáticas ya
documentadas ni romper los modos existentes.

## Entrada de fechas

Evaluar la sustitución de los tres campos separados de día, mes y año por un
control de fecha único por cada fecha, preferentemente `input type="date"` con
una representación estable en el modelo interno. Esta es una mejora P1 de UX,
no un requisito para publicar las mejoras P0 de contenido y snippet.

Si se conserva el diseño de tres campos:

- mantener labels y errores asociados a cada grupo;
- permitir navegación por teclado entre día, mes y año;
- validar fechas imposibles antes de calcular;
- conservar el formato local visible sin convertir fechas a timestamps locales
  que puedan cambiar el día por zona horaria.

La decisión final debe basarse en una prueba manual móvil y en la ausencia de
regresiones en los tests de fechas. Si el input nativo no supera la prueba, se
debe conservar el diseño actual y mejorar navegación, foco y validación; no se
debe introducir un componente alternativo solo por motivos SEO.

## Estado inicial

- Mantener “Entre fechas” como modo inicial.
- Mantener el comportamiento actual de “Hoy”.
- No generar un resultado personalizado dependiente de la fecha actual dentro
  del HTML editorial.
- Mostrar un ejemplo fijo en un bloque separado, o mediante “Usar ejemplo”,
  claramente etiquetado como ejemplo.
- El resultado vacío debe explicar qué datos faltan sin parecer un error.

## Resultado principal

Cuando el usuario completa dos fechas, el panel debe mostrar con labels
explícitos y escaneables:

- diferencia principal en días naturales o hábiles según la selección, con la
  unidad explícita;
- modo de conteo seleccionado: estándar o inclusivo;
- semanas completas y días restantes;
- desglose de años, meses y días de calendario, con su regla de conteo
  identificada;
- días hábiles y fines de semana, si están disponibles;
- dirección del intervalo cuando las fechas están invertidas.

El texto principal debe responder directamente a la consulta, por ejemplo:
“Entre estas fechas hay 258 días”. El desglose debe permitir comprobar cómo se
obtuvo la respuesta.

Las etiquetas visibles deben usar “Días naturales” para el total, “Semanas y
días naturales” para el desglose derivado del total seleccionado, “Desglose de
calendario (conteo estándar)” para `calendar`, y “Días hábiles sin festivos” y
“Fines de semana” con el conteo seleccionado. No dejar “Equivalente calendario”,
“Semanas” o “Todos” sin contexto.

### Contrato de resultado

Antes de cambiar la UI, fijar y probar este contrato:

- `totalDays` siempre cuenta días naturales con la regla estándar o inclusiva.
- `weeks` se deriva de `totalDays` y cambia al cambiar el conteo, pero no al
  seleccionar hábiles. Etiquetar “Semanas y días naturales” para evitar que se
  interprete como semanas laborales.
- `calendar` representa actualmente la diferencia de calendario estándar,
  independiente del modo inclusivo. Si se conserva así, la UI debe mostrar una
  etiqueta o nota que lo explique.
- `businessDays` y `weekendDays` usan la regla de conteo seleccionada.
- El resultado numérico es absoluto; la dirección se comunica mediante el
  texto principal.

En diferencia y evento, ordenar cronológicamente los extremos para contar:
el modo estándar excluye el anterior e incluye el posterior; el inclusivo
incluye ambos. Filtrar después por lunes a viernes para hábiles y por sábado
o domingo para fines de semana. Con fechas iguales: 0 en estándar; en
inclusivo, 1 día natural y 1 hábil o 1 de fin de semana según corresponda.
Debe cumplirse `businessDays + weekendDays = totalDays`.

Ejemplo de aceptación: entre viernes 11 y lunes 14 de septiembre de 2026,
en ambos órdenes, obtener 3 naturales, 1 hábil y 2 de fin de semana en
estándar; 4 naturales, 2 hábiles y 2 de fin de semana en inclusivo. Cambia
la dirección, no los totales. Esta regla de extremos no sustituye la de
sumar/restar hábiles, que avanza desde la fecha introducida en la dirección
solicitada sin contar esa fecha de partida.

No publicar un resultado en el que, por ejemplo, aparezcan 259 días inclusivos
y “8 meses y 15 días” como si ambos fueran dos expresiones equivalentes del
mismo conteo sin aclaración.

Aplicar también las etiquetas y limitaciones al texto copiado y al modo
Hasta evento; no conservar “Equivalente calendario” sin aclarar su conteo.

## Modos existentes

Conservar y probar:

1. **Entre fechas:** diferencia estándar/inclusiva y naturales/hábiles.
2. **Sumar o restar:** días, días hábiles, semanas, meses y años.
3. **Hasta evento:** fecha base, fecha de evento, etiqueta y opciones de
   conteo.

Para sumar meses o años, documentar y probar la regla actual de ajuste al
último día válido del mes destino. No cambiarla silenciosamente como parte de
una mejora SEO.

No mezclar en el texto SEO las reglas de “hasta evento” con una cuenta
regresiva de horas: la página de countdown es la especializada para ese caso.

## Accesibilidad

- Cada fecha debe tener un grupo accesible con nombre único.
- Cada mensaje de error debe tener un `id` y estar relacionado con el grupo de
  controles mediante `aria-describedby`.
- Los cambios de modo deben conservar `aria-pressed` correcto.
- El resultado debe tener una live region separada del panel de detalles y
  anunciar solo un resultado válido después de una breve pausa, sin anunciar
  cada pulsación ni cada rerender.
- El foco debe permanecer predecible al cambiar de modo o mostrar errores.
- Contraste y targets táctiles deben conservar los criterios globales del sitio.

## Rendimiento y anuncios

- No añadir librerías de calendario pesadas sin medir su impacto.
- Evitar cambios de layout cuando aparezca el resultado o el anuncio.
- Mantener la calculadora utilizable antes de cargar proveedores de anuncios.
- Comprobar móvil y escritorio en una conexión no ideal.

## Instrumentación

Usar el mecanismo de analítica existente, si está disponible, para registrar de
forma anónima:

- `date_difference_calculation_completed`;
- modo (`difference`, `add`, `event`);
- tipo de conteo;
- tipo de días;
- error de validación, sin enviar las fechas introducidas.

### Definición de conversión y deduplicación

- Usar la sesión del mecanismo de analítica existente. La conversión primaria
  es una sesión con al menos un resultado válido de esta página, no el número
  bruto de eventos. Tasa: sesiones con conversión / sesiones medidas que
  visitaron esta página, con el mismo filtro de tráfico en ambos términos.
- Emitir `date_difference_calculation_completed` después de una interacción
  del usuario que produzca un resultado válido y permanezca estable durante
  1 segundo. Reiniciar el temporizador al editar; cancelarlo ante estado
  incompleto o inválido. No emitir al inicializar, refrescar “Hoy”
  automáticamente ni cargar “Usar ejemplo”. Una edición posterior del ejemplo
  sí puede producir un cálculo elegible.
- Deduplicar los disparos `input`/`change` y los rerenders del mismo estado.
  Comparar el estado solo en memoria local; no enviar ni persistir fechas,
  resultados, cantidades, etiquetas introducidas por el usuario para eventos
  ni hashes de esos valores. El nombre técnico del evento analítico no es un
  dato personal y puede enviarse si existe un mecanismo de analítica aprobado.
- Los cálculos posteriores pueden generar eventos tras una nueva edición
  estable, pero no otra conversión primaria dentro de la misma sesión.
- En modo `add`, registrar la unidad; omitir tipo de conteo y tipo de días
  cuando no sean aplicables. No atribuir valores de controles ocultos.
- Registrar errores solo al terminar de editar un grupo o confirmar un
  control, una vez por episodio de error y código. No contar el estado vacío
  inicial ni cada pulsación como error.
- Si se mide abandono, definirlo como sesiones con interacción en la
  calculadora y sin cálculo válido; requiere un evento de primera interacción
  deduplicado por sesión. No inferirlo únicamente de las visitas a la página.

Si el mecanismo existente no permite identificar sesiones o deduplicar,
documentar qué métricas no pueden calcularse; no sustituir la tasa de
conversión por un cociente de eventos y visitas.

No enviar fechas concretas ni valores que permitan reconstruir una consulta
personal del usuario. Si no existe mecanismo de eventos, documentar la
limitación y no introducir un proveedor nuevo solo para esta página.
