# Spec 08 - Validación final y nueva solicitud de AdSense

## Objetivo

Definir la revisión técnica, editorial y de Search Console que debe completarse
antes de volver a solicitar AdSense. No se debe reenviar inmediatamente después
de desplegar cambios.

## Precondiciones

Antes de iniciar esta spec:

- Spec 01 completada: anuncios retirados de navegación, listados y paginación.
- Spec 02 completada: publicaciones futuras pausadas.
- Spec 03 completada: series repetitivas consolidadas o retiradas.
- Spec 04 completada: páginas de confianza y metadatos editoriales publicados.
- Spec 05 completada al menos para todas las URLs YMYL principales.
- Spec 06 completada para hubs y enlaces internos críticos.
- Spec 07 completada si AdSense o scripts publicitarios estarán activos.

## Revisión técnica

### Sitemap

Validar:

- El sitemap no contiene borradores.
- El sitemap no contiene artículos futuros.
- El sitemap no contiene URLs retiradas por consolidación.
- El sitemap contiene páginas de confianza.
- El sitemap contiene destinos consolidados.
- Las páginas de paginación que existan son intencionales.

Fuente técnica:

- `astro.config.mjs`
- Integración `@astrojs/sitemap`
- `src/lib/blog.ts`
- `src/lib/blog-publication.ts`

### Respuestas HTTP

Auditar una lista representativa:

- Inicio.
- Categorías principales.
- Categorías de una sola herramienta.
- Artículos consolidados.
- URLs retiradas.
- Páginas de confianza.
- Calculadoras YMYL.
- `robots.txt`.
- `sitemap-index.xml`.

Esperado:

- URLs finales: 200.
- URLs retiradas: 301 al destino correcto.
- Sin cadenas de redirects.
- Sin 404 en enlaces internos.

### Canonicals

Validar:

- Cada página indexable tiene canonical correcto.
- Las URLs con trailing slash redirigen a forma canónica.
- Las páginas retiradas no tienen canonical propio porque ya no existen como
  fuente.
- Las páginas legacy no se conservan como Astro pages.

### Robots

Validar:

- `src/pages/robots.txt.ts` permite rastrear contenido público.
- Apunta a `sitemap-index.xml`.
- No bloquea accidentalmente `/blog`, categorías, calculadoras o páginas de
  confianza.

### Enlaces internos

Buscar:

- Slugs retirados por la spec 03.
- Rutas futuras pausadas por la spec 02.
- Enlaces hacia categorías redirigidas por la spec 06.
- Enlaces externos rotos en fuentes YMYL.

## Revisión en Search Console

Completar:

- Comprobar acciones manuales.
- Revisar `Rastreada: actualmente sin indexar`.
- Revisar `Descubierta: actualmente sin indexar`.
- Revisar duplicados.
- Revisar canónicas elegidas por Google.
- Inspeccionar manualmente al menos 20 URLs.
- Solicitar indexación de hubs y páginas principales actualizadas.

Muestra mínima recomendada de 20 URLs:

- 4 calculadoras de salud.
- 3 artículos de salud.
- 3 calculadoras financieras o inmobiliarias.
- 3 artículos financieros o inmobiliarios.
- 2 páginas de impuestos o legal.
- 2 hubs de categorías.
- 2 páginas de confianza.
- 1 URL retirada para confirmar 301.

## Revisión editorial

Completar:

- Auditar todas las páginas de salud, finanzas, inmuebles e impuestos.
- Auditar las 20 URLs con menos contenido original.
- Verificar que fuentes respaldan afirmaciones concretas.
- Comparar páginas de una misma serie para detectar reutilización excesiva.
- Pedir a una persona externa que pruebe al menos 10 calculadoras y describa
  qué entiende del resultado.

Preguntas para cada URL revisada:

- ¿La página responde una tarea clara?
- ¿El usuario recibe valor antes de cualquier anuncio?
- ¿Hay autor o responsable editorial visible?
- ¿Las fuentes son suficientes para el tema?
- ¿La página explica límites?
- ¿El resultado se entiende sin abrir otra URL?
- ¿El schema coincide con lo visible?
- ¿Hay enlaces internos útiles?

## Revisión publicitaria

Validar:

- No hay `AdSlot` en listados, categorías ni paginación.
- No hay publicidad en páginas de confianza, privacidad, contacto o 404.
- Artículos no revisados tienen como máximo un anuncio.
- Calculadoras no revisadas tienen como máximo un anuncio.
- No hay espacios publicitarios vacíos.
- Rechazar consentimiento no bloquea herramientas.

## Condiciones para reenviar

La solicitud de AdSense estará lista cuando:

- No haya anuncios en páginas principalmente de navegación.
- Las series repetitivas estén consolidadas y redirigidas.
- Las páginas de confianza estén publicadas y enlazadas.
- El contenido sensible muestre autoría, fuentes y límites.
- Las páginas débiles hayan sido mejoradas o retiradas.
- Google haya rastreado una parte representativa de las URLs actualizadas.
- El sitemap refleje únicamente el inventario final.
- Search Console no muestre un patrón grave de duplicación o exclusión en las
  páginas principales.

## Tiempo de espera recomendado

No reenviar el mismo día del despliegue.

Esperar a que:

- El sitemap nuevo haya sido leído.
- Las URLs principales muestren última lectura reciente en Search Console.
- Los redirects estén detectados.
- Al menos una muestra representativa de URLs actualizadas haya sido
  recrawleada.

No hay una duración garantizada. La decisión debe basarse en rastreo observado,
no solo en días transcurridos.

## Entregables

Crear un registro final con:

- Fecha de despliegue de cambios.
- Lista de specs completadas.
- URLs consolidadas y destinos 301.
- Páginas de confianza publicadas.
- Muestra de URLs inspeccionadas.
- Hallazgos de Search Console.
- Problemas pendientes.
- Decisión: listo o no listo para reenviar.

## Criterios de aceptación

- Checklist técnico completado.
- Checklist editorial completado.
- Checklist publicitario completado.
- Muestra de Search Console documentada.
- No quedan bloqueadores conocidos del plan base.
- La decisión de reenviar está respaldada por evidencia, no por intuición.

## Riesgos y mitigaciones

Riesgo: reenviar demasiado pronto.

Mitigación: esperar señales de rastreo y documentar evidencia.

Riesgo: aprobar checklist con cambios no desplegados.

Mitigación: validar contra URLs públicas, no solo repositorio local.

Riesgo: Google sigue rechazando por señales externas.

Mitigación: documentar que esta spec reduce riesgos controlables, pero no
garantiza aprobación.
