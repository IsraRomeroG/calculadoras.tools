# Plan de acción para corregir el rechazo de AdSense por contenido de poco valor

## Estado

- Fecha de la auditoría base: 22 de junio de 2026.
- Motivo comunicado por Google AdSense: `Contenido de poco valor`.
- Alcance: contenido indexable, arquitectura editorial, publicidad, confianza, experiencia de usuario y rastreo.
- Objetivo: conseguir que cada URL monetizada aporte utilidad propia, señales editoriales verificables y una experiencia centrada en el usuario.

## Resumen ejecutivo

El sitio no carece de contenido ni de funcionalidad. La auditoría encontró:

- 65 calculadoras publicadas en 14 categorías.
- 110 artículos publicados al momento de la auditoría.
- 17 artículos adicionales programados.
- 214 URLs declaradas en el sitemap público.
- Páginas principales, `robots.txt` y sitemap accesibles con respuesta HTTP 200.
- Etiquetas canonical, sitemap, privacidad y contacto ya implementados.

El riesgo principal no es la cantidad total de contenido. Es la combinación de:

1. Anuncios en páginas que funcionan principalmente como directorios o navegación.
2. Publicación acelerada de artículos y series con intenciones muy parecidas.
3. Autoría, revisión y antecedentes editoriales poco visibles.
4. Contenido financiero, fiscal y de salud sin un estándar uniforme de fuentes y actualización.
5. Algunas páginas con poca explicación original alrededor de la herramienta o respuesta principal.

## Referencias de Google

- Requisitos mínimos de contenido:
  `https://support.google.com/adsense/answer/9335564`
- Contenido original de calidad y experiencia del usuario:
  `https://support.google.com/adsense/answer/10015918`
- Políticas sobre valor del inventario:
  `https://support.google.com/adsense/answer/10502938`
- Contenido útil y fiable pensado primero para personas:
  `https://developers.google.com/search/docs/fundamentals/creating-helpful-content`
- Políticas de spam y contenido escalado:
  `https://developers.google.com/search/docs/essentials/spam-policies`

---

## Hallazgos

### 1. Publicidad en páginas de navegación

El sitemap incluye:

- 14 categorías de calculadoras.
- 5 categorías editoriales.
- 16 páginas de paginación del blog.

Estas páginas muestran principalmente introducciones breves, tarjetas de enlaces y un anuncio. Las categorías con una sola calculadora son el caso de mayor riesgo: ofrecen poca información propia antes o después del bloque publicitario.

Archivos involucrados:

- `src/pages/index.astro`
- `src/pages/[category].astro`
- `src/pages/blog.astro`
- `src/pages/blog/[category].astro`
- `src/pages/blog/pagina/[page].astro`
- `src/pages/blog/[category]/pagina/[page].astro`

### 2. Crecimiento editorial con apariencia escalada

Los 110 artículos se publicaron entre el 4 de mayo y el 22 de junio de 2026, con días de hasta seis publicaciones.

Series que requieren consolidación o una justificación editorial clara:

- `cuanto-debo-pesar-si-mido-150.md` hasta `cuanto-debo-pesar-si-mido-185.md`.
- `hipoteca-1000000-cuanto-pago.md` hasta `hipoteca-3000000-cuanto-pago.md`.
- `prestamo-50000-cuanto-pago.md` y `prestamo-100000-cuanto-pago.md`.

El riesgo no es compartir una plantilla visual. El riesgo es que la respuesta sustancial cambie principalmente por sustituir una cifra.

### 3. Señales de confianza incompletas

Actualmente:

- No existe una página pública sobre el equipo o responsable del sitio.
- No existe una política editorial.
- No existe una página general de metodología.
- Los artículos no muestran autor o revisor visible.
- El schema asigna la autoría genéricamente a la organización.
- 34 de los 110 artículos publicados no tienen una sección identificable de fuentes.
- 28 artículos no enlazan fuentes externas.
- Ningún artículo publicado usa `updatedDate`.

Esto es especialmente importante para salud, préstamos, hipotecas, inversión e impuestos.

Archivos involucrados:

- `src/content.config.ts`
- `src/pages/blog/[category]/[slug].astro`
- `src/layouts/BaseLayout.astro`
- `src/components/template/Footer.astro`

### 4. Profundidad desigual

Se detectaron artículos de aproximadamente 180 a 326 palabras y calculadoras con muy poco contexto editorial fuera de:

- La interfaz de cálculo.
- Una introducción breve.
- Preguntas frecuentes generadas desde datos en el frontmatter.

No se utilizará una cantidad de palabras como requisito de calidad. La revisión debe evaluar si la página explica suficientemente la fórmula, los supuestos, el resultado, las limitaciones y las fuentes.

### 5. Densidad publicitaria uniforme

La plantilla de artículos coloca dos espacios publicitarios en todos los artículos, independientemente de su extensión. Las calculadoras tienen entre uno y dos anuncios por diseño.

Archivos involucrados:

- `src/pages/blog/[category]/[slug].astro`
- `src/components/ads/AdSlot.astro`
- `src/lib/ads/config.ts`
- `src/lib/ads/placements.test.ts`

---

## Plan de ejecución

## Fase P0 — Reducir inmediatamente el riesgo de inventario

### Objetivo

Evitar que AdSense encuentre anuncios en páginas cuyo propósito principal sea navegar hacia otras URLs.

### Tareas

- [ ] Eliminar `AdSlot` de la página de inicio.
- [ ] Eliminar `AdSlot` de las categorías de calculadoras.
- [ ] Eliminar `AdSlot` del índice y categorías del blog.
- [ ] Eliminar `AdSlot` de todas las páginas de paginación.
- [ ] Mantener como máximo un anuncio en artículos que todavía no hayan superado una revisión editorial.
- [ ] Mantener como máximo un anuncio inicial en calculadoras con contenido suficiente.
- [ ] Evitar espacios publicitarios vacíos, placeholders o contenedores visibles cuando no haya proveedor configurado.
- [ ] Actualizar las pruebas de placements para reflejar la nueva estrategia.

### Criterios de aceptación

- Ninguna página de listado o paginación contiene `AdSlot`.
- Ninguna categoría con una sola herramienta muestra publicidad.
- Los anuncios restantes aparecen después de que el usuario ya haya recibido valor sustancial.

---

## Fase P1 — Consolidar o retirar URLs repetitivas

### Objetivo

Conservar únicamente páginas con una intención y una aportación editorial propias.

### Tareas

- [ ] Pausar la publicación automática de los 17 artículos programados.
- [ ] Revisar las series por estatura, monto de hipoteca y monto de préstamo.
- [ ] Crear una guía principal de peso saludable por estatura con tabla completa y enlace a la calculadora de IMC.
- [ ] Redirigir mediante 301 las páginas individuales por estatura hacia la guía consolidada.
- [ ] Crear una guía comparativa de hipotecas por monto o incorporar los escenarios en la calculadora.
- [ ] Redirigir las variantes de hipoteca que no aporten una intención independiente.
- [ ] Consolidar los artículos de préstamo por monto cuando solo cambien las cifras del escenario.
- [ ] Revisar todos los artículos con menos de 400 palabras para ampliarlos, fusionarlos o retirarlos.
- [ ] No usar `noindex` como sustituto permanente de una consolidación correcta.
- [ ] Mantener los redirects en `.htaccess` y retirar las rutas fuente antiguas cuando se implemente el cambio.

### Regla editorial

Una página numérica independiente solo puede conservarse cuando aporte al menos uno de estos elementos:

- Datos o reglas diferentes.
- Decisiones distintas para el usuario.
- Comparación propia y no reutilizada.
- Riesgos o limitaciones específicos.
- Fuentes diferentes.
- Una herramienta o tabla especializada.

Cambiar únicamente el monto, porcentaje, peso, altura o unidad no es suficiente.

### Criterios de aceptación

- No quedan series publicadas cuya diferencia principal sea sustituir una cifra.
- Cada URL retirada responde con 301 hacia el destino más relevante.
- El sitemap solo incluye las URLs consolidadas.
- No existen enlaces internos hacia URLs retiradas.

---

## Fase P2 — Crear una capa editorial verificable

### Objetivo

Explicar quién crea el contenido, cómo se revisa y qué fuentes respaldan las herramientas.

### Nuevas páginas

- [ ] `/acerca-de`
- [ ] `/metodologia`
- [ ] `/politica-editorial`
- [ ] `/correcciones`
- [ ] Aviso general de salud.
- [ ] Aviso general financiero y fiscal.

### Contenido mínimo de confianza

La página `Acerca de` debe explicar:

- Quién opera calculadoras.tools.
- Propósito del proyecto.
- Experiencia real del equipo.
- Cómo contactar al responsable.
- Cómo se financia el sitio.

La política editorial debe explicar:

- Cómo se seleccionan temas.
- Cómo se comprueban fórmulas y resultados.
- Cómo se eligen fuentes.
- Cómo se usa IA, si aplica.
- Cómo se realizan correcciones.
- Cómo se gestionan actualizaciones.

No se deben inventar autores, credenciales, revisores o procesos que no existan.

### Cambios de modelo de contenido

Agregar a `src/content.config.ts`:

- [ ] `author`
- [ ] `reviewer`, opcional y solo cuando exista revisión real.
- [ ] `updatedDate`
- [ ] `reviewedDate`
- [ ] `sources`
- [ ] `methodologyNote`, cuando corresponda.

### Cambios de presentación

- [ ] Mostrar autor y enlace a su perfil.
- [ ] Mostrar fecha de publicación.
- [ ] Mostrar fecha de actualización cuando exista.
- [ ] Mostrar fecha y responsable de revisión cuando corresponda.
- [ ] Incorporar fuentes en una sección consistente.
- [ ] Actualizar el schema `Article` con entidades y URLs reales.
- [ ] Añadir las nuevas páginas de confianza al footer.

### Criterios de aceptación

- Todos los artículos muestran responsable editorial.
- Todos los artículos YMYL tienen fuentes externas fiables.
- Las fechas de actualización solo se muestran cuando hubo una revisión real.
- La información visible coincide con los datos estructurados.

---

## Fase P3 — Elevar el estándar de calculadoras y artículos

### Calculadoras

Cada calculadora indexable debe incluir, cuando aplique:

- [ ] Qué calcula.
- [ ] Datos de entrada necesarios.
- [ ] Fórmula o método.
- [ ] Ejemplo desarrollado.
- [ ] Interpretación del resultado.
- [ ] Supuestos.
- [ ] Limitaciones.
- [ ] Fuentes.
- [ ] Fecha de revisión.
- [ ] Herramientas y guías relacionadas.

La funcionalidad interactiva cuenta como valor, pero no sustituye la explicación cuando el resultado puede afectar decisiones médicas, financieras, fiscales o legales.

### Artículos

Cada artículo debe:

- [ ] Responder la pregunta principal en el primer bloque.
- [ ] Aportar algo que no esté ya explicado en la calculadora.
- [ ] Incluir ejemplos propios y verificables.
- [ ] Explicar límites y posibles errores de interpretación.
- [ ] Enlazar fuentes primarias cuando el tema lo requiera.
- [ ] Tener enlaces internos útiles, no solo un CTA.
- [ ] Evitar secciones FAQ creadas únicamente para aumentar extensión.

### Política de fuentes

Priorizar:

1. Organismos públicos y reguladores.
2. Documentación técnica original.
3. Instituciones académicas o profesionales reconocidas.
4. Publicaciones de referencia que identifiquen autores y metodología.

Evitar usar como respaldo principal:

- Otros sitios de calculadoras.
- Blogs anónimos.
- Fragmentos de resultados de búsqueda.
- Contenido generado sin fuentes.

### Criterios de aceptación

- No quedan artículos sin fuente en categorías YMYL.
- Cada calculadora sensible declara explícitamente sus límites.
- La información necesaria para comprender el resultado está disponible sin depender de otra página.

---

## Fase P4 — Mejorar arquitectura y descubrimiento

### Objetivo

Hacer que el sitio parezca una biblioteca de herramientas mantenida editorialmente, no una colección de URLs aisladas.

### Tareas

- [ ] Añadir acceso a las principales categorías desde la navegación.
- [ ] Añadir artículos relacionados al final de cada artículo.
- [ ] Enlazar calculadoras con sus guías, ejemplos y comparaciones.
- [ ] Crear hubs editoriales con introducción, alcance y selección curada.
- [ ] Revisar categorías con una sola calculadora.
- [ ] Convertir esas categorías en hubs útiles o redirigirlas a la herramienta cuando no exista contenido suficiente.
- [ ] Evitar que las páginas de paginación compitan con los hubs principales.
- [ ] Revisar textos de tarjetas para que describan diferencias reales entre herramientas.

### Criterios de aceptación

- Ninguna calculadora importante queda huérfana.
- Los enlaces relacionados responden a un siguiente paso real del usuario.
- Las categorías explican su alcance y no son únicamente una cuadrícula de enlaces.

---

## Fase P5 — Privacidad y preparación publicitaria

### Tareas

- [ ] Actualizar privacidad para identificar explícitamente a Google cuando se active AdSense.
- [ ] Explicar cookies, personalización y tratamiento de datos por proveedores publicitarios.
- [ ] Enlazar la información oficial de Google sobre uso de datos.
- [ ] Verificar la estrategia de consentimiento por región.
- [ ] Añadir `ads.txt` cuando exista un identificador de editor aprobado.
- [ ] Confirmar que rechazar consentimiento no impida usar las calculadoras.

`ads.txt` no corrige el rechazo por contenido de poco valor y no debe tratarse como prioridad anterior a la limpieza editorial.

---

## Validación previa a una nueva solicitud

### Revisión técnica

- [ ] Todas las URLs del sitemap responden 200 o son redirects 301 intencionales.
- [ ] El sitemap no contiene borradores, páginas futuras ni contenido retirado.
- [ ] `robots.txt` permite rastrear el contenido público.
- [ ] Todas las páginas indexables tienen canonical correcto.
- [ ] No existen enlaces internos rotos.
- [ ] No hay errores graves de experiencia móvil o Core Web Vitals.

### Revisión en Search Console

- [ ] Comprobar acciones manuales.
- [ ] Revisar `Rastreada: actualmente sin indexar`.
- [ ] Revisar `Descubierta: actualmente sin indexar`.
- [ ] Revisar duplicados y canónicas elegidas por Google.
- [ ] Inspeccionar manualmente una muestra de al menos 20 URLs.
- [ ] Solicitar indexación de hubs y páginas principales actualizadas.

### Revisión editorial

- [ ] Auditar todas las páginas de salud, finanzas, inmuebles e impuestos.
- [ ] Auditar las 20 URLs con menos contenido original.
- [ ] Verificar que las fuentes realmente respalden cada afirmación.
- [ ] Comparar páginas de una misma serie para detectar reutilización excesiva.
- [ ] Pedir a una persona externa que pruebe al menos 10 calculadoras y describa qué entiende del resultado.

---

## Condiciones para volver a solicitar AdSense

No se debe reenviar el sitio inmediatamente después de desplegar los cambios.

La solicitud estará lista cuando:

- No haya anuncios en páginas principalmente de navegación.
- Las series repetitivas estén consolidadas y redirigidas.
- Las páginas de confianza estén publicadas y enlazadas.
- El contenido sensible muestre autoría, fuentes y límites.
- Las páginas débiles hayan sido mejoradas o retiradas.
- Google haya rastreado una parte representativa de las URLs actualizadas.
- El sitemap refleje únicamente el inventario final.

## Orden recomendado

1. Retirar anuncios de listados y paginación.
2. Pausar publicaciones programadas.
3. Consolidar series repetitivas.
4. Crear páginas y campos de confianza editorial.
5. Revisar calculadoras y artículos YMYL.
6. Mejorar hubs y enlaces internos.
7. Validar en Search Console.
8. Solicitar nuevamente la revisión de AdSense.

## Fuera de alcance

Este plan no garantiza la aprobación de AdSense, porque la decisión final depende de Google y de señales externas no disponibles en el repositorio. Tampoco propone aumentar artificialmente la extensión, publicar más artículos ni añadir nuevas categorías antes de corregir el inventario actual.
