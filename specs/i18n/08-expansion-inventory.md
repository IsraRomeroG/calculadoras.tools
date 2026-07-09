# 08 - Inventario y matriz de estado i18n

## Objetivo

Crear una fuente de verdad para saber que piezas del sitio estan listas para ingles, cuales estan en progreso y cuales deben permanecer ocultas. La implementacion posterior no debe depender de memoria informal ni de busquedas manuales cada vez que se publique una ruta EN.

## Alcance

- Categorias de calculadoras.
- Calculadoras publicadas en espanol.
- Rutas EN existentes.
- Articulos del blog ES y EN.
- Paginas informativas y legales.
- Links globales de navbar/footer.
- Estado de anuncios y consentimiento por locale.

No incluye traducir contenido. Esta spec solo define como inventariar, clasificar y usar el inventario.

## Fuentes de datos

Revisar estas fuentes:

- `src/lib/constants/categories.ts`
- `src/lib/constants/calculators.ts`
- `src/lib/calculator-directory.ts`
- `src/pages`
- `src/pages/en`
- `src/content/blog`
- `src/content/blog/en`
- `src/lib/i18n`
- `src/lib/constants/menu.ts`
- `src/components/template/Footer.astro`
- `src/components/ads/AdConsentBanner.astro`

## Modelo de estado

Usar estos estados para cada unidad:

- `not_started`: no existe trabajo EN.
- `draft`: existe metadata o contenido EN, pero no debe publicarse.
- `ready_for_review`: traduccion completa pendiente de revision humana.
- `published`: visible en rutas/listados EN.
- `blocked`: requiere decision antes de avanzar.

No usar `published` si falta cualquiera de estos puntos:

- Ruta canonica.
- Metadata de directorio.
- Contenido visible.
- Script cliente localizado.
- Links internos revisados.
- Tests/checks basicos.

## Modelo de inventario recomendado

Crear o mantener una matriz con estas columnas:

```txt
type
id
spanish_path
english_path
category_id
status
owner
depends_on
source_files
notes
last_reviewed
```

Valores de `type`:

- `category`
- `calculator`
- `blog_post`
- `static_page`
- `shell_link`
- `ad_policy`

## Reglas de publicacion

- Una calculadora EN no puede ser `published` si su categoria EN no existe.
- Una categoria EN no se lista si no tiene calculadoras EN publicadas.
- Un post EN no se enlaza desde una calculadora EN si esta en `draft`.
- Un link de footer EN no se muestra si su pagina EN no existe.
- El banner de anuncios EN no se renderiza si no existe politica de privacidad EN aprobada.

## Inventario inicial esperado

Estado actual aproximado:

- Home EN: `published`.
- Categoria Math: `published`.
- Percentage calculator: `published`.
- Blog EN Math: parcialmente publicado con articulos de porcentajes.
- Resto de calculadoras: `not_started`.
- Paginas legales EN: `not_started` o no publicadas.
- Footer legal EN: restringido a rutas publicadas.

La implementacion debe confirmar estos datos leyendo el codigo, no copiarlos sin verificar.

## Entregable recomendado

Crear un archivo de seguimiento:

```txt
specs/i18n/status-matrix.md
```

Ese archivo puede ser manual al inicio. Si crece mucho, se puede migrar despues a JSON o TS para validaciones automaticas.

## Checks automaticos recomendados

Agregar tests o scripts para detectar:

- Metadata EN publicada sin ruta Astro correspondiente.
- Ruta Astro EN sin metadata publicada.
- Categoria EN publicada sin calculadoras.
- Links EN a rutas no publicadas.
- Alternates hacia drafts.
- Blog posts EN sin `locale: "en"`.
- Blog posts EN sin `categoryId`.
- Blog posts EN sin `slug`.

## Criterios de aceptacion

- Existe una matriz de estado revisable.
- Cada unidad publica EN tiene estado claro.
- Las rutas EN incompletas no aparecen en home, categorias, blog, footer ni sitemap.
- El inventario puede responder que falta para publicar una calculadora o cluster.
