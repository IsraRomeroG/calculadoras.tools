# 02 - Contenido visible, metadata y FAQ

## Objetivo

Hacer que la promesa del snippet, el contenido rastreable y el resultado de la
calculadora cubran la demanda observada sin repetir keywords de forma
artificial.

Usar “días naturales (también llamados días calendario)” en la primera
explicación y después mantener “días naturales” para el total. Reservar “días
hábiles” para lunes a viernes sin festivos. No usar “Todos” como etiqueta del
tipo de días.

## Metadata propuesta

Usar inicialmente estos valores como variante de mejora:

```text
Title:
Diferencia entre fechas: calculadora de días, semanas y meses

Description:
Calcula días, semanas, meses y años entre dos fechas. Conteo estándar o inclusivo. Días hábiles de lunes a viernes; no descuenta festivos.
```

Requisitos:

- No modificar canonical, slug ni alternates.
- Mantener el title alineado con el contenido realmente visible.
- No incluir “festivos oficiales”, “plazo legal exacto” o promesas similares
  mientras la calculadora solo excluya sábados y domingos.
- Revisar el título mostrado en Search después del recrawl: Google puede
  generar el title link o snippet desde otros textos visibles.

## Introducción superior

Añadir entre el hero y la calculadora un bloque breve de 40–70 palabras que
explique que la herramienta permite:

- calcular días entre dos fechas;
- ver semanas, meses y años de calendario;
- elegir conteo estándar o inclusivo;
- consultar días hábiles de lunes a viernes, sin descontar festivos;
- sumar o restar una cantidad a una fecha;
- calcular cuánto falta para un evento mediante una fecha base y una fecha del
  evento.

La introducción debe llevar al uso inmediato de la calculadora y no desplazar
la herramienta innecesariamente debajo del primer viewport.

## Estructura editorial obligatoria

Mantener el contenido debajo de la calculadora y añadir estas secciones con
jerarquía semántica clara:

### Cómo calcular los días entre dos fechas

Incluir:

- fórmula conceptual: `fecha final - fecha inicial`;
- conteo estándar: excluye el extremo cronológicamente anterior e incluye el
  posterior, aunque el usuario introduzca las fechas en orden inverso;
- conteo inclusivo: incluye ambos extremos; en días hábiles solo cuenta los
  extremos que caen de lunes a viernes;
- ejemplo: del 1 al 2 de enero son 1 día estándar y 2 días inclusivos;
- aclaración de que el cálculo usa fechas de calendario, no horas exactas.

La fórmula debe explicar también que el total mostrado es absoluto y que la
dirección se informa aparte cuando la fecha final es anterior. No presentar
“fecha final - fecha inicial” como un resultado siempre positivo sin explicar
esa dirección.

### Semanas, meses y años entre fechas

Incluir:

- diferencia entre días totales y desglose de calendario;
- semanas completas y días naturales restantes, derivadas del total natural
  con el conteo seleccionado, incluso si el resultado principal muestra hábiles;
- explicación de que los meses no equivalen siempre a 30 días;
- explicación de que los años no deben aproximarse siempre dividiendo entre
  365;
- años bisiestos y 29 de febrero.

El texto debe describir exactamente el formato que se muestra en el resultado.
El desglose de calendario y el total de días deben tener una etiqueta que deje
claro si usan la regla estándar o el modo inclusivo seleccionado. No mostrar un
desglose de calendario exclusivo junto a un total inclusivo sin explicarlo.

### Días naturales y días hábiles

Incluir:

- definición de días naturales;
- regla actual de días hábiles: lunes a viernes, excluyendo sábado y domingo;
- aviso destacado de que esta versión no descuenta festivos;
- ejemplo de cuándo seleccionar cada opción.

### Sumar o restar tiempo a una fecha

Explicar el modo existente con ejemplos de 30 días, 30 días hábiles, semanas,
meses y años. Aclarar que sumar meses o años puede requerir una regla para
fechas de fin de mes y que la regla implementada debe ser la que se documente.

### Hasta un evento

Explicar el uso de una fecha base, una fecha de evento y un nombre opcional.
Enlazar a la calculadora de fecha límite cuando el usuario necesite una cuenta
regresiva en vivo o una hora exacta.

## Ejemplos estáticos

Añadir los tres ejemplos siguientes, marcados como “Ejemplo” para que no se
interpreten como un resultado personalizado:

1. Del 1 al 2 de enero: 1 día estándar y 2 días inclusivos.
2. Del 15 de enero de 2026 al 30 de septiembre de 2026:
   - estándar: 258 días, 36 semanas y 6 días, y 8 meses y 15 días de
     calendario;
   - inclusivo: 259 días, equivalente a 37 semanas; si el desglose de
     calendario permanece estándar, debe etiquetarse expresamente como tal.

3. Del 28 de febrero de 2024 al 1 de marzo de 2024: 2 días estándar y 3 días
   inclusivos. Este ejemplo demuestra que el 29 de febrero se procesa como
   fecha real.

## FAQ

Mantener las preguntas actuales visibles y añadir como mínimo:

- ¿Qué pasa si una fecha cae en sábado o domingo?
- ¿Cómo se calculan los meses y años entre dos fechas?
- ¿Se tienen en cuenta los años bisiestos?

La respuesta debe estar completamente visible al abrir la pregunta. Si se
conserva el JSON-LD opcional, debe generarse desde la misma colección de FAQs
visible; no agregar preguntas solo en el schema. Aplicar el criterio de la
spec 04, sin exigir un resultado enriquecido FAQ para publicar.

Actualizar las respuestas existentes para que respeten el contrato de conteo,
incluidas las fechas invertidas. Sustituir referencias internas como “MVP”,
“dataset” o fases futuras por una explicación directa de las limitaciones.

## Enlaces editoriales

El contenido debe incluir CTAs contextuales hacia:

- calculadora de fecha límite;
- calculadora de edad;
- calculadora de horas trabajadas cuando el contexto sea laboral.

Los anchors deben describir la acción y no usar exclusivamente “haz clic aquí”.

## Criterios de redacción

- Español claro y natural; no insertar variantes sin acento de forma artificial.
- No fijar una cantidad de palabras como objetivo de ranking.
- No copiar la explicación de competidores.
- Cada ejemplo debe poder verificarse con la lógica de la calculadora.
- La regla de sumar meses o años en fin de mes debe documentarse como
  “ajustar al último día válido del mes destino”, si se conserva la lógica
  actual.
- La explicación de plazos legales debe conservar el aviso de limitaciones.
