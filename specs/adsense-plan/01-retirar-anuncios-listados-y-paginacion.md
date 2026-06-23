# Spec 01 - Retirar anuncios de listados y paginación

## Objetivo

Evitar que AdSense encuentre publicidad en páginas cuyo propósito principal sea
navegar hacia otras URLs. Los anuncios restantes deben aparecer solo en páginas
que ya entregaron valor sustancial al usuario.

## Alcance

Quitar `AdSlot` de páginas de listado, categoría e índice:

- `src/pages/index.astro`
- `src/pages/[category].astro`
- `src/pages/blog.astro`
- `src/pages/blog/[category].astro`
- `src/pages/blog/pagina/[page].astro`
- `src/pages/blog/[category]/pagina/[page].astro`

Ajustar estrategia y pruebas de anuncios en:

- `src/pages/blog/[category]/[slug].astro`
- `src/components/ads/AdSlot.astro`
- `src/lib/ads/config.ts`
- `src/lib/ads/placements.test.ts`

## Estado actual observado

- Inicio usa `AdSlot` con `placement="home-after-intro"`.
- Categorías de calculadoras usan `placement="calculator-category-after-intro"`.
- Índice del blog usa `placement="blog-index-after-intro"`.
- Categorías del blog usan `placement="blog-category-after-intro"`.
- Paginación del blog usa `placement="blog-page-after-intro"`.
- Paginación por categoría usa `placement="blog-category-page-after-intro"`.
- Artículos usan `blog-post-after-header` y `blog-post-sidebar`.
- Las pruebas actuales esperan:
  - Entre 1 y 2 anuncios en cada calculadora.
  - Cero anuncios solo en `privacidad.astro`, `contacto.astro` y `404.astro`.
  - Exactamente 2 anuncios en la plantilla de posts.

## Cambios requeridos

### 1. Inicio

Eliminar:

```astro
<AdSlot placement="home-after-intro" />
```

También eliminar el import correspondiente:

```ts
import AdSlot from "@components/ads/AdSlot.astro";
```

No sustituirlo por placeholder, banner propio ni bloque vacío.

### 2. Categorías de calculadoras

Eliminar el anuncio de `src/pages/[category].astro`:

```astro
<AdSlot placement="calculator-category-after-intro" />
```

La página debe quedar como hub navegacional sin monetización directa.

Regla específica:

- Categorías con una sola calculadora nunca deben mostrar anuncios.
- Si una categoría se convierte más adelante en hub editorial completo, su
  elegibilidad publicitaria debe evaluarse de nuevo con la spec 06.

### 3. Índice, categorías y paginación del blog

Eliminar los placements:

- `blog-index-after-intro`
- `blog-category-after-intro`
- `blog-page-after-intro`
- `blog-category-page-after-intro`

Estas páginas deben funcionar como navegación editorial, no como inventario
publicitario.

### 4. Artículos publicados antes de revisión editorial

Cambiar la plantilla de artículo para que, por defecto, exista como máximo un
anuncio por post hasta que el artículo tenga señales editoriales suficientes.

Implementación sugerida:

- Retirar `blog-post-after-header` de la parte superior del artículo.
- Mantener solo un anuncio lateral o posterior, pero no ambos.
- Si se mantiene `blog-post-sidebar`, asegurar que en móvil no aparece antes de
  que el usuario haya leído el bloque principal.
- Si se decide mover el anuncio debajo del contenido, usar un placement nuevo
  explícito como `blog-post-after-content`.

No crear lógica compleja por longitud en esta fase. La regla temporal es simple:
un máximo de un anuncio por artículo mientras se completa la revisión editorial.

### 5. Calculadoras

Mantener como máximo un anuncio inicial en calculadoras con contenido suficiente.

Regla sugerida para la primera pasada:

- Conservar `placement="calculator-after-tool"` cuando aparece después de la
  herramienta y antes de contenido explicativo.
- Retirar `placement="calculator-before-faq"` de calculadoras que no tengan
  explicación completa de fórmula, supuestos, límites y fuentes.

Para calculadoras sensibles, aplicar la spec 05 antes de permitir un segundo
anuncio.

### 6. Placeholders y proveedor no configurado

`AdSlot.astro` ya evita renderizar cuando:

```ts
ADS_ENABLED && (debug || hasConfiguredAds())
```

Revisar que no queden contenedores visibles en producción cuando no hay
proveedor configurado:

- Sin `data-ad-slot`.
- Sin marco punteado.
- Sin etiqueta `Publicidad`.
- Sin espacio vertical reservado.

El modo debug de desarrollo puede seguir mostrando el marco si ayuda a validar
formatos.

### 7. Configuración

No apagar `ADS_ENABLED` como solución principal. El problema es dónde se muestra
publicidad, no solo si se muestra.

Si se agrega una capa de estrategia, preferir nombres explícitos:

```ts
export const ALLOWED_AD_PLACEMENTS = new Set([
  "calculator-after-tool",
  "blog-post-sidebar",
]);
```

Solo hacerlo si reduce duplicación o hace más claras las pruebas.

## Pruebas requeridas

Actualizar `src/lib/ads/placements.test.ts` para comprobar:

- `index.astro` no contiene `<AdSlot`.
- `src/pages/[category].astro` no contiene `<AdSlot`.
- `blog.astro` no contiene `<AdSlot`.
- `blog/[category].astro` no contiene `<AdSlot`.
- `blog/pagina/[page].astro` no contiene `<AdSlot`.
- `blog/[category]/pagina/[page].astro` no contiene `<AdSlot`.
- La plantilla de artículo contiene como máximo un `<AdSlot`.
- Las calculadoras contienen como máximo un `<AdSlot` hasta que exista una
  marca explícita de revisión editorial.
- No se exige publicidad en todas las calculadoras.

Si la prueba sigue detectando calculadoras por `@lib/calculators/`, cambiar la
expectativa de “1 o 2 anuncios” a “0 o 1 anuncio” en la fase temporal.

## Criterios de aceptación

- Ninguna página de listado o paginación contiene `AdSlot`.
- Ninguna categoría de calculadoras contiene `AdSlot`.
- Ninguna categoría con una sola herramienta muestra publicidad.
- La plantilla de artículos contiene como máximo un anuncio.
- Las pruebas de placements reflejan la estrategia nueva.
- En producción, si no hay proveedor configurado, no aparece espacio publicitario
  vacío.
- Los anuncios restantes aparecen después de que el usuario haya recibido valor
  sustancial.

## Riesgos y mitigaciones

Riesgo: perder ingresos temporales.

Mitigación: priorizar aprobación y calidad de inventario. Reintroducir anuncios
solo después de las specs 04 y 05.

Riesgo: romper estilos por retirar secciones intermedias.

Mitigación: revisar visualmente las páginas afectadas y asegurar que no quedan
espacios grandes entre hero y contenido.

Riesgo: mantener imports muertos.

Mitigación: revisar cada archivo editado y eliminar imports de `AdSlot` cuando
ya no se use.
