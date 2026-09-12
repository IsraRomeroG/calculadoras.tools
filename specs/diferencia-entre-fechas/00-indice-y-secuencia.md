# Plan de mejora: diferencia entre fechas

## Objetivo

Mejorar el posicionamiento orgánico, el CTR y la utilidad de
`/fecha-tiempo/diferencia-entre-fechas` sin cambiar su URL canónica ni crear
páginas duplicadas para cada variante de la misma intención.

La página debe responder claramente a estas tareas relacionadas:

- calcular la diferencia o los días entre dos fechas;
- obtener semanas, meses y años de calendario;
- contar de forma estándar o inclusiva;
- distinguir días naturales de días hábiles;
- sumar o restar tiempo a una fecha;
- calcular el tiempo restante hasta un evento.

## Alcance

- Contenido HTML visible y metadata SEO.
- FAQ visible y, si se conserva, JSON-LD sincronizado.
- UX y claridad del resultado de la calculadora.
- Enlaces internos y datos estructurados técnicos.
- Medición, QA, despliegue y seguimiento en Search Console.

## Fuera de alcance

- Cambiar la ruta canónica, crear aliases o migrar URLs.
- Crear una página por cada variante de “días”, “semanas” o “meses”.
- Añadir festivos por país en esta iteración.
- Prometer validez legal, laboral o fiscal universal.
- Crear contenido programático basado solo en rangos o cifras.

## Secuencia de ejecución

| Orden | Spec | Resultado |
| --- | --- | --- |
| 1 | `01-diagnostico-y-objetivos.md` | Baseline, clusters y objetivos medibles |
| 2 | `03-ux-y-calculadora.md` | Contrato del resultado, menor fricción y accesibilidad |
| 3 | `02-contenido-y-snippet.md` | Metadata, contenido visible, ejemplos y FAQ |
| 4 | `04-enlazado-y-seo-tecnico.md` | Descubrimiento, schema y validación técnica |
| 5 | `05-medicion-qa-y-release.md` | QA, publicación y evaluación posterior |

La spec 01 debe leerse antes de modificar contenido. Primero debe congelarse el
contrato de resultado de la spec 03, porque la spec 02 tiene que describir
exactamente las etiquetas y reglas que verá el usuario. Una vez fijado ese
contrato, el contenido P0 de la spec 02 y los cambios de UI P1 de la spec 03 se
pueden implementar en paralelo. La 04 debe ejecutarse con las rutas finales ya
confirmadas. La 05 es el gate de release y seguimiento.

P0 incluye metadata, contenido, etiquetas correctas del resultado y enlaces
contextuales. El cambio de controles de fecha es P1; FAQPage y BreadcrumbList
son opcionales. Ninguno de estos trabajos opcionales debe bloquear P0.

## Invariantes de ruta

- Canonical ES: `/fecha-tiempo/diferencia-entre-fechas`.
- Canonical EN existente: `/en/date-time/date-difference-calculator`.
- No agregar trailing slash.
- No cambiar el slug ni conservar una ruta Astro legacy para probar otra URL.
- Todos los enlaces nuevos deben apuntar a rutas publicadas y canónicas.

## Entregable final

La página publicada debe tener una promesa SEO coherente con la herramienta,
contenido estático suficiente para explicar días, semanas, meses y años, una
experiencia rápida en móvil, enlaces internos útiles y un baseline posterior
que permita separar mejoras de CTR de mejoras de ranking.
