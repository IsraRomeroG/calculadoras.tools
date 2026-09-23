# Interfaz, resultados y accesibilidad

## Orden y formulario

1. Introducción breve.
2. Formulario: realizadas, modo asistidas/faltas, cantidad, mínimo y restantes.
3. Resultado principal y situación actual.
4. Proyección final y resumen de cantidades.
5. Detalles, recuperación teórica y explicación.

Este es el orden DOM y móvil. En escritorio se permite formulario y resultado en
columnas sin invertir el orden de lectura. Evitar un panel extenso de guiones en
el estado inicial: mostrar una invitación breve a introducir los datos.
No mover el foco ni hacer scroll automáticamente con cada recálculo.

- Ayuda en realizadas: «Cuenta solo las clases que ya se impartieron».
- Ayuda en restantes: «Déjalo vacío si no lo sabes. Escribe 0 si el curso terminó».
- Ayuda en mínimo: «Usa el requisito de tu escuela; 80% es solo el valor inicial».
- Ayuda sobre modelo: «Todas las clases cuentan igual».
- Marcar restantes como opcional. Su valor inicial y tras limpiar es vacío.
- Selector segmentado con botones `type=button`, `aria-pressed` y nombre de grupo,
  o radios nativos equivalentes. Solo el modo activo entra en la validación.
- Al alternar con datos válidos, convertir A ↔ F conservando el mismo resultado.
  Si no se puede convertir por datos inválidos, no reutilizar una cifra oculta
  obsoleta: limpiar el destino y pedir su captura.
- Calcular automáticamente. Mostrar errores al salir del campo o confirmar una
  acción; durante edición incompleta indicar que el resultado necesita datos válidos.
  Validar todos los campos editados relevantes, no solo el primer error global.
- Si un campo obligatorio es inválido, retirar resultados accionables obsoletos y
  deshabilitar la copia. Si solo R es inválido, puede conservarse la situación
  actual, pero la proyección queda «Revisa las clases restantes» y no se puede copiar.

## Información visible

Mostrar el porcentaje actual junto con «Cumples actualmente» o «Por debajo del
mínimo actual». En otra sección mostrar la proyección final de la spec 02.
No usar únicamente una tarjeta «Estado» para ambas cosas.

Resumen visible: realizadas, asistidas, faltas acumuladas, mínimo con su precisión,
margen en puntos porcentuales y, cuando se conoce R, restantes, total final,
faltas máximas totales, faltas futuras disponibles, excedente si existe,
asistencias necesarias y máximo final posible.

El detalle puede ser desplegable; no esconder la distinción entre situación actual
y final, ni una condición que cambie el significado de la recomendación.

## Mensaje principal según proyección

| Estado | Mensaje y condiciones |
| --- | --- |
| `unknown` | «Tu asistencia actual es {actual}%. Indica cuántas clases quedan para estimar el resultado final». Disponibilidad y necesidad: «Pendiente de clases restantes» |
| `finished_meets` | «El curso terminó y cumples el mínimo de {p}%». No recomendar nuevas faltas |
| `finished_below` | «El curso terminó y quedaste por debajo del mínimo de {p}%». No mostrar 0/0 como recomendación |
| `impossible` | «Con las {R} clases restantes no se alcanza el mínimo. Asistiendo a todas, el máximo final sería {max}%» |
| `guaranteed` | «Ya tienes las asistencias necesarias para cumplir el {p}% al final de las {N} clases registradas» |
| `possible`, actualmente debajo | «Necesitas asistir al menos a {Q} de las {R} clases restantes para cumplir el {p}% al final» |
| `possible`, cumple y hay disponibilidad | «Puedes faltar hasta {B} de las {R} clases restantes si asistes a las demás; así cumplirías el {p}% al final» |
| `possible`, sin disponibilidad | «Debes asistir a las {R} clases restantes para cumplir el mínimo al final» |

Para garantía, aclarar «Siempre que no cambie el total de clases ni el requisito»;
es garantía matemática de asistencia, no de aprobación académica.
Para cualquier disponibilidad positiva, incluir junto al resultado: «Este margen
se calcula para el final del curso; tu porcentaje puede bajar temporalmente».
Pluralizar clases y faltas correctamente. No añadir lenguaje punitivo.

En `impossible`, la tarjeta necesaria muestra «No alcanzan las {R} restantes».
En detalle: «Con el total final previsto necesitarías {Q} asistencias adicionales,
pero solo quedan {R} clases». No sugerir ampliar el curso con Q clases.
Disponibilidad: 0; excedente separado: «Excedes en {E} faltas el límite del curso».

Recuperación: «Clases seguidas para alcanzar el mínimo actual». Si n > R,
añadir «Es un cálculo teórico: quedan solo {R} clases». Si R es desconocido,
«No sabemos si quedan suficientes clases». Si n = 0, «Ya alcanzas el mínimo actual».
Si p = 100 y F > 0, «Con faltas registradas no se puede recuperar el 100% asistiendo
a más clases». Con curso terminado, no presentar n como acción pendiente.

## Accesibilidad

- Label explícito para cada campo; ayuda y error con IDs únicos y `aria-describedby`.
- `aria-invalid=true` mientras exista error confirmado; retirar al corregir o limpiar.
- Mensajes de validación precisos; no depender exclusivamente de rojo/verde.
- Región `role=status` / `aria-live=polite` breve para resumen de actualización y
  acciones. No anunciar todo el panel en cada pulsación; actualizar tras pausa o
  confirmación de edición sin anuncios duplicados de input/change/blur.
- Foco visible y navegación completa por teclado. Tras limpiar, foco en realizadas.
  Cargar un ejemplo conserva el foco y anuncia que se cargó.
- Controles táctiles de al menos 44 × 44 CSS px; texto legible, contraste suficiente.
- A 320 CSS px y con zoom 200%, campos, mensajes y cifras no generan scroll horizontal.
- Sin JavaScript, mostrar un aviso visible de que el cálculo requiere activarlo;
  conservar explicación y FAQs útiles, sin botones que aparenten funcionar.

## Copiar resumen

Construirlo a partir del mismo modelo presentado: entradas, modo, mínimo exacto,
restantes conocidas/desconocidas, situación actual, proyección, disponibilidad,
excedente, necesidad real, máximo final y recuperación con sus condiciones.
Omitir métricas que no se pueden calcular; escribir «No indicadas» para R desconocido.
Un resultado válido sin R sí se puede copiar. Un formulario inválido no.

1. Intentar `navigator.clipboard.writeText` cuando esté disponible.
2. Si falla o no existe, intentar fallback si está soportado; comprobar el booleano
   de `execCommand('copy')` y limpiar siempre el textarea temporal.
3. Si falla, anunciar «No se pudo copiar automáticamente» y ofrecer un área de
   texto seleccionable con el resumen para copia manual. No anunciar éxito.

Restaurar foco tras fallback, salvo cuando el usuario necesita el área de copia
manual. Anunciar éxito o error en la región de estado; no usar verde para un fallo.
Limpiar o editar descarta mensajes anteriores y cancela temporizadores. Una copia
asíncrona pendiente no debe anunciar como vigente un resumen anterior tras limpiar
o cambiar entradas; asociar la operación a la versión del resultado.

## Limpiar

Restablecer modo asistidas, cantidades vacías, mínimo 80 y R desconocido; eliminar
errores, atributos de invalidez, resultados, resumen copiable y avisos anteriores.
No dejar valores ocultos de un ejemplo o del otro modo. Anunciar «Formulario limpio».
