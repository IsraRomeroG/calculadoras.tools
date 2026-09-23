# Contenido, SEO e integración

## Arquitectura e idiomas

Extraer las reglas duplicadas de `attendance.ts` y `attendance.en.ts` a un núcleo
puro compartido, sin texto localizado ni dependencias de DOM. Los adaptadores de
idioma formatean números, etiquetas, mensajes y resumen. Mantener adaptadores de
compatibilidad si son útiles para migrar imports, pero no dos implementaciones
de las fórmulas. Los estados internos son los mismos en ambos idiomas.

Actualizar las dos páginas existentes con la misma semántica de R vacío, estados,
errores, copia y ejemplos. Se permite compartir controlador o componente; acotar
selectores al contenedor de cada calculadora y evitar registros duplicados de
eventos si el sitio usa navegación de cliente. No ampliar este trabajo a una
reestructuración de otras calculadoras.

## Contenido estático requerido

- Title ES: «Calculadora de porcentaje de asistencia escolar».
- H1 ES: «Calculadora de asistencia escolar».
- Description ES: «Calcula tu porcentaje de asistencia escolar y, si sabes cuántas
  clases quedan, estima las faltas disponibles y las asistencias necesarias».
- Introducción: cálculo actual con realizadas y asistidas/faltas; proyección opcional.
- Corregir tildes, signos de apertura, concordancia y plurales en página y resúmenes.
- Eliminar «MVP», límites de búsqueda y otros términos internos del contenido público.
- Conservar componentes de layout, publicidad y FAQ del proyecto; no insertar
  anuncios entre campos o entre recomendación y su condición explicativa.

Explicar en HTML estático, con ejemplo resuelto:

1. Asistencia actual = asistidas / realizadas × 100.
2. Total final = realizadas + restantes.
3. Asistencias mínimas finales = techo(total final × mínimo / 100).
4. Restar asistencias actuales para conocer cuántas faltan; si exceden las restantes,
   no es posible cumplir dentro del calendario indicado.
5. Diferenciar faltas acumuladas, máximas totales y futuras disponibles.
6. Diferenciar recuperar el mínimo hoy de cumplirlo al final.

Ejemplo editorial: T=40, A=34, p=80, R=10 produce 85% actual, 50 clases finales,
40 asistencias mínimas, 6 asistencias pendientes y 4 faltas futuras disponibles.
La condición de esas 4 faltas es asistir a las otras 6; el mínimo no está garantizado
en cada punto intermedio. No presentar el redondeo mostrado como regla de la escuela.

## Ejemplos interactivos

Cada ejemplo carga todas sus entradas, limpia errores y genera resultado y copia
coherentes. Las etiquetas describen los datos o el escenario comprobado.

| ID | Etiqueta ES | T | Modo / cantidad | p | R | Expectativa |
| --- | --- | --- | --- | --- | --- | --- |
| `regular` | Con margen al final | 40 | asistidas 34 | 80 | 10 | Necesita 6; permite 4 |
| `recover` | Recuperar el mínimo | 40 | asistidas 30 | 80 | 10 | Necesita 10 de 10 |
| `no-margin` | Sin faltas disponibles | 20 | faltas 4 | 80 | 4 | Necesita 4 de 4; permite 0 |
| `impossible` | No alcanzan las restantes | 40 | asistidas 25 | 80 | 5 | Necesita 11; solo quedan 5 |
| `unknown` | Solo asistencia actual | 40 | asistidas 34 | 80 | vacío | 85%; proyección pendiente |

Usar los mismos datos e IDs en EN, traduciendo etiquetas. No son obligatorios
todos los botones en el primer viewport; evitar que desplacen el formulario.

## FAQs

Mantener las seis preguntas útiles de v1 y actualizar sus respuestas:

- ¿Cómo se calcula el porcentaje? Incluir fórmula y denominador de clases realizadas.
- ¿Cuántas faltas puedo tener? Requiere conocer restantes para el margen final y
  presupone asistir a las demás.
- ¿Qué pasa si estoy por debajo del mínimo? Separar recuperación teórica de la
  posibilidad dentro del curso.
- ¿Puedo considerar clases restantes? Sí; vacío es desconocido y 0 es curso terminado.
- ¿Qué significa que ya no sea posible? Ni asistir a todas las restantes basta.
- ¿Las faltas justificadas cuentan? En el cálculo base todas las ausencias
  introducidas cuentan igual; el usuario debe consultar las reglas de su escuela.

Añadir respuestas breves a: «¿Por qué aparece el mismo porcentaje que el mínimo
pero dice que no cumplo?» y «¿Cumplir ahora garantiza cumplir al final?».
FAQ visible y JSON-LD se generan desde la misma fuente por idioma.

## Integración SEO

Conservar URLs, canonical, alternates y breadcrumbs existentes; no crear páginas
para variantes del porcentaje. Verificar que ES apunta a EN y viceversa y que no
hay textos españoles en resultados EN. Las fórmulas, explicación y FAQ deben
existir en el HTML estático, no depender de haber usado la calculadora.
Conservar la metadata coherente con las capacidades reales; no prometer políticas
escolares configurables antes de implementar la ampliación correspondiente.
