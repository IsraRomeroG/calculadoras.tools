# Índice del plan detallado de AdSense

## Origen

Estas specs desglosan el plan base:

`specs/adsense-contenido-poco-valor-plan-de-accion.md`

La auditoría base está fechada el 22 de junio de 2026 y el motivo comunicado
por Google AdSense fue `Contenido de poco valor`.

## Principio de ejecución

El objetivo no es aumentar artificialmente la cantidad de contenido. Cada cambio
debe reducir inventario débil, hacer visible la responsabilidad editorial y
mejorar la utilidad real de las URLs que sigan indexables.

Prioridad práctica:

1. Quitar anuncios de páginas principalmente navegacionales.
2. Pausar contenido programado hasta completar la revisión editorial.
3. Consolidar series repetitivas con 301 y retirada de rutas fuente.
4. Publicar señales de confianza reales: equipo, metodología, política
   editorial, correcciones, autores, revisores y fuentes.
5. Elevar calculadoras y artículos sensibles, especialmente salud, finanzas,
   inmuebles e impuestos.
6. Mejorar hubs, categorías, enlaces internos y descubrimiento.
7. Completar privacidad, consentimiento y preparación publicitaria.
8. Validar sitemap, rastreo, Search Console y condiciones antes de reenviar.

## Specs creadas

| Orden | Spec | Punto cubierto |
| --- | --- | --- |
| 1 | `01-retirar-anuncios-listados-y-paginacion.md` | Retirar anuncios de listados, categorías y paginación |
| 2 | `02-pausar-publicaciones-programadas.md` | Pausar publicaciones futuras y congelar expansión |
| 3 | `03-consolidar-series-repetitivas.md` | Fusionar o retirar URLs numéricas repetitivas |
| 4 | `04-confianza-editorial-autoria-fuentes.md` | Crear páginas, campos y presentación de confianza |
| 5 | `05-estandar-calculadoras-articulos-ymyl.md` | Revisión de calculadoras y artículos sensibles |
| 6 | `06-hubs-enlaces-internos-arquitectura.md` | Arquitectura editorial, hubs y enlaces internos |
| 7 | `07-privacidad-consentimiento-y-preparacion-adsense.md` | Privacidad, consentimiento, `ads.txt` y proveedor publicitario |
| 8 | `08-validacion-y-reenvio-adsense.md` | Validación final y nueva solicitud de AdSense |

## Dependencias entre specs

- La spec 1 debe ejecutarse antes de volver a revisar AdSense porque reduce el
  riesgo de inventario publicitario de bajo valor.
- Las specs 2 y 3 deben ejecutarse juntas: pausar sin consolidar solo aplaza el
  problema; consolidar mientras siguen apareciendo artículos futuros puede
  recrearlo.
- La spec 4 desbloquea la spec 5, porque los artículos y calculadoras YMYL
  necesitan campos visibles de autoría, revisión, fuentes y fechas.
- La spec 6 debe ejecutarse después de retirar o fusionar URLs, para no enlazar
  desde hubs nuevos hacia contenido que terminará redirigido.
- La spec 7 no corrige por sí sola el rechazo de contenido de poco valor, pero
  evita problemas de cumplimiento cuando AdSense se reactive.
- La spec 8 no debe empezar hasta que el inventario final esté desplegado y
  rastreable.

## Reglas globales

- No inventar autores, credenciales, revisores, experiencia ni procesos.
- No usar `noindex` como sustituto permanente de una consolidación editorial.
- No conservar páginas Astro legacy para URLs retiradas; usar redirects 301 en
  `public/.htaccess`.
- No crear nuevas URLs que solo cambien una cifra, estatura, monto, tasa,
  unidad o país sin valor editorial verificable.
- No mostrar fechas de actualización o revisión si no hubo revisión real.
- No enlazar rutas futuras desde contenido publicado.
- No reactivar más anuncios hasta que las páginas que los alojan hayan superado
  los criterios editoriales de estas specs.

## Evidencia local observada

Durante la revisión del repositorio se observó:

- `src/content.config.ts` ya tiene `updatedDate`, pero no `author`,
  `reviewer`, `reviewedDate`, `sources` ni `methodologyNote`.
- `src/pages/blog/[category]/[slug].astro` genera schema `Article` con autoría
  genérica de organización.
- Existen `AdSlot` en inicio, categorías de calculadoras, índice de blog,
  categorías de blog, paginaciones y plantilla de artículos.
- `src/lib/ads/placements.test.ts` espera actualmente anuncios en todas las
  calculadoras y exactamente dos anuncios en posts.
- `public/.htaccess` ya contiene reglas 301 para URLs legacy de blog y
  calculadoras.
- Con fecha local 23 de junio de 2026 se detectaron 16 artículos con `pubDate`
  posterior a esa fecha; el plan base menciona 17 programados, por lo que debe
  reconciliarse el inventario antes de cambiar fechas o estados.

## Entregable final esperado

El sitio queda listo para una nueva solicitud solo cuando:

- No hay anuncios en páginas cuyo valor principal sea navegar.
- No quedan series repetitivas publicadas por sustitución de cifras.
- Las páginas de confianza existen, son honestas y están enlazadas.
- Las piezas YMYL muestran fuentes, límites, responsable editorial y fechas
  coherentes.
- El sitemap solo contiene URLs finales.
- Search Console no muestra señales fuertes de duplicación, rastreo sin
  indexación o canónicas inesperadas en las páginas revisadas.
