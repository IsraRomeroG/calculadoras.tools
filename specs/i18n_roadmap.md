# Spec principal: roadmap i18n a ingles

## Objetivo

Guiar la expansion del sitio a ingles sin romper las URLs espanolas actuales, sin publicar paginas parcialmente traducidas y sin duplicar logica de calculadoras. La expansion debe apoyarse en un modelo unico de disponibilidad publica para que rutas, listados, canonical, alternates, sitemap y enlaces consuman la misma verdad derivada. Esta spec es el indice principal para las siguientes fases de i18n y debe leerse junto con las specs existentes de fase 1.

## Estado actual

Snapshot verificado al 2026-07-10. El inventario generado de spec 08 debe sustituir estos conteos como referencia durable.

El sitio ya cuenta con una base i18n inicial:

- Locales configurados en `src/lib/i18n/config.ts`: `es` sin prefijo y `en` con `/en`.
- Helpers de routing, canonical y alternates en `src/lib/i18n/routing.ts`.
- Mensajes compartidos en `src/lib/i18n/messages.ts`.
- Home y categorias con soporte por locale.
- Blog con rutas EN y contenido ingles parcial.
- Categoria `matematicas` localizada como `/en/math`.
- Calculadora de porcentajes publicada en `/en/math/percentage-calculator`.
- Tres articulos ingleses bajo `src/content/blog/en/math`.

La expansion debe construir sobre esa base. No se debe reiniciar la arquitectura ni crear un segundo sistema paralelo.

## Principios no negociables

- Espanol sigue siendo el idioma fuente y vive en la raiz: `/`, `/matematicas`, `/blog/...`.
- Ingles vive bajo `/en`: `/en`, `/en/math`, `/en/blog/...`.
- No se crea `/es`.
- No se redirige por IP ni por `Accept-Language`.
- Una URL sin prefijo se interpreta como `es`.
- Cada pagina publicada tiene canonical hacia si misma.
- `hreflang` solo apunta a versiones publicadas reales.
- `x-default` apunta a la version espanola cuando existe.
- No se enlaza desde paginas `/en` a contenido espanol salvo selector de idioma o alternate explicito.
- No se publica metadata EN si la pagina, UI, script, SEO y enlaces no estan completos.
- `Locale` no equivale a pais, moneda, sistema de unidades ni regla legal/fiscal.
- Si una URL publica existente cambia, antes se debe crear un mapa old -> new y reglas Apache `.htaccess` 301.
- No se usan paginas Astro legacy, meta refresh ni redirects cliente para rutas movidas.
- Estas reglas de redirects aplican a cualquier URL publica, incluida una URL EN ya publicada.
- Cada dato tiene un solo propietario: IDs, slugs, estado editorial y relaciones no se duplican en matrices, sitemap o componentes.
- La existencia de metadata localizada no significa que una ruta este publicada.
- Toda ruta EN emitida debe corresponder a una release publicada y toda release publicada debe emitir su ruta.
- Las relaciones entre calculadoras, posts, categorias y paginas estaticas usan IDs estables; los `href` se resuelven desde rutas publicadas.
- El render EN usa APIs estrictas. No se permite fallback silencioso a contenido ES.

## Specs existentes de fase 1

Estas specs documentan la base ya introducida o el piloto inicial:

1. [Core SEO y routing](./i18n/01-core-seo-routing.md)
2. [Directorio localizado](./i18n/02-localized-directory.md)
3. [Shell localizado](./i18n/03-localized-shell.md)
4. [Piloto home y categoria](./i18n/04-home-category-pilot.md)
5. [Piloto calculadora de porcentajes](./i18n/05-percentage-calculator-pilot.md)
6. [Sitemap, links y validacion](./i18n/06-sitemap-links-validation.md)
7. [Arquitectura futura del blog](./i18n/07-blog-future-architecture.md)

Las specs 01-07 son historicas/implementadas y pueden contener reglas transitorias del piloto, por ejemplo ocultar Blog EN antes de que existiera contenido. No reimplementar una regla antigua si contradice el estado actual o las specs 08-14. Cada spec futura debe declarar cuando reemplaza una regla anterior.

## Specs de expansion

Las siguientes specs son la base para continuar la implementacion:

8. [Inventario y matriz de estado i18n](./i18n/08-expansion-inventory.md)
9. [Estandar de migracion de calculadoras](./i18n/09-calculator-migration-standard.md)
10. [Categorias, slugs y URLs localizadas](./i18n/10-category-url-localization.md)
11. [Clusters de traduccion del blog](./i18n/11-blog-translation-clusters.md)
12. [Shell, paginas legales y anuncios en ingles](./i18n/12-shell-legal-ads-en.md)
13. [SEO, QA y release incremental](./i18n/13-seo-qa-release.md)
14. [Release Math 2: regla de tres](./i18n/14-math-cluster-2.md)

## Secuencia recomendada

### Fase A: control de alcance

1. Definir las fuentes tipadas de identidad, metadata localizada, workflow y relaciones.
2. Crear un `PublishedRouteManifest` derivado; no mantener rutas publicas en una matriz manual paralela.
3. Generar desde esas fuentes un inventario revisable por `entityId + locale + surface`.
4. Separar workflow editorial, blockers y estado publico derivado.
5. Agregar guardrails para exigir paridad entre rutas emitidas, manifest, sitemap, alternates y links.

### Fase B: categorias y directorio

1. Completar metadata EN de categorias en estado no publicado.
2. Publicar una categoria EN solo si tiene al menos una calculadora EN publicada.
3. Validar unicidad de slugs localizados por locale.
4. Mantener IDs estables basados en las categorias espanolas actuales.
5. Generar alternates solo cuando la superficie de categoria correspondiente exista realmente.

### Fase C: calculadoras por lotes

Orden sugerido:

1. Matematicas cercanas al piloto: regla de tres, MCD/MCM, estadistica basica, GPA.
2. Conversores simples: temperatura, peso, kilometros a millas, litros a galones.
3. Fecha y tiempo: edad, diferencia entre fechas, Pomodoro, horas trabajadas.
4. Programacion y geometria.
5. Finanzas e inmuebles.
6. Salud.
7. Legal/impuestos.

Los lotes 5, 6 y 7 requieren revision extra porque mezclan idioma con region, moneda, unidades, disclaimers o reglas locales.

### Fase D: blog por clusters

1. Traducir articulos alrededor de calculadoras ya publicadas en ingles.
2. Publicar releases editoriales completas, no articulos huerfanos.
3. Usar un unico `translationGroupId` para emparejar equivalencias directas y distinguirlas de adaptaciones u originales.
4. Mantener `hreflang` solo entre posts publicados.
5. Evitar links EN hacia articulos ES salvo cambio de idioma explicito.

### Fase E: shell, legal y monetizacion

1. Crear paginas legales e informativas EN antes de activar links globales.
2. Activar footer EN solo con rutas publicadas.
3. Activar consentimiento/anuncios EN solo cuando una capacidad central valide politica publicada y aprobada, market/jurisdiccion, version y proveedor.
4. Revisar copy legal y publicitario por humano antes de publicar.
5. Incluir selector de idioma basado solo en alternates publicados y una estrategia de error 404 para solicitudes EN.

### Fase F: QA y release

1. Ejecutar validaciones unitarias.
2. En CI, compilar el sitio y validar el HTML/rutas emitidas.
3. Revisar links internos, canonical, alternates reciprocos y sitemap contra el manifest publicado.
4. Revisar UI movil/desktop de cada calculadora migrada.
5. Publicar cada release como un cambio atomico; el estado publicado se activa al final.
6. Monitorear 404, sitemap e indexacion.

## Definition of done por pagina EN

Una pagina inglesa se puede publicar solo si cumple todo esto:

- Ruta EN canonica definida.
- Ruta ES equivalente conservada, si existe.
- `BaseLayout` recibe `locale="en"`.
- Canonical apunta a la ruta EN.
- Alternates incluyen solo versiones publicadas.
- Title y meta description estan en ingles.
- H1, breadcrumbs, labels, botones, errores y estados vacios estan en ingles.
- Scripts cliente no contienen frases espanolas visibles.
- JSON-LD, FAQ y contenido estructurado estan localizados.
- JSON embebido y JSON-LD usan un serializador seguro para HTML.
- Formatos numericos/fecha usan `LOCALE_CONFIG.en.formatLocale` o configuracion explicita.
- Enlaces internos apuntan a contenido EN publicado o a selector de idioma claro.
- La pagina aparece en listados EN solo cuando esta completa.
- La ruta pertenece al `PublishedRouteManifest` y no puede seguir dando 200 al despublicarse.
- Los anuncios se omiten salvo que una capacidad central los permita para ese contexto.
- Tests o checks cubren la ruta, metadata y links principales.

## Definition of done por release de calculadora

Una release EN de calculadora esta completa cuando:

- La categoria EN existe y tiene slug revisado.
- La calculadora EN esta publicada.
- La home/directorio EN la muestran.
- El blog EN tiene articulos de soporte solo si fueron declarados dependencias requeridas o la calculadora los enlaza.
- Los articulos publicados enlazan de vuelta a la calculadora EN.
- No hay links rotos ni links silenciosos a ES.
- Sitemap incluye las rutas publicadas.
- Search snippets basicos fueron revisados por humano.

## Validacion recomendada

Comando permitido como validacion principal:

```powershell
npm.cmd run test:unit:run
```

No ejecutar estos comandos salvo pedido explicito:

```powershell
npm run dev
npm run build
```

Esta restriccion aplica a la ejecucion local del agente. No sustituye el gate de release: CI debe compilar el sitio, inspeccionar las rutas emitidas y validar el HTML generado antes de desplegar.

## Riesgos principales

- Publicar una calculadora EN con script cliente aun en espanol.
- Crear slugs EN antes de traducir categoria o calculadora.
- Mostrar links legales ES desde footer EN.
- Enlazar blog EN hacia posts ES como si fueran del mismo idioma.
- Usar `en-US` como regla fiscal, financiera o medica por defecto.
- Cambiar cualquier ruta publica, ES o EN, sin redirects 301 cuando corresponda.
- Duplicar rutas Astro en vez de usar componentes compartidos.
- Tratar `published` como si pudiera ocultar un wrapper Astro estatico.
- Mantener un segundo sistema de rutas dentro del sitemap.
- Emitir `hreflang` por mera existencia de metadata localizada.
- Usar `JSON.stringify()` sin escape dentro de `<script set:html>`.
- Guardar `href` y flags `published` duplicados en relaciones de contenido.

## Siguiente paso recomendado

Implementar primero la base de control de publicacion: manifest derivado, inventario generado, alternates basados en disponibilidad real y validacion de rutas. Despues usar `calculadora-de-regla-de-tres` como siguiente calculadora EN. Antes de traducirla, separar su dominio numerico de los textos, errores, pasos y formato `es-MX`. Math 2 sera la prueba del estandar corregido antes de entrar a calculadoras con dinero, salud o reglas regionales.
