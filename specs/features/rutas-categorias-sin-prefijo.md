# Spec: rutas de categorias de calculadoras sin prefijo

## Contexto

Las categorias de calculadoras ya tienen metadata explicita con `slug`, `label`
y `description` en `src/lib/constants/calculator-categories.ts`.

Actualmente las paginas de categoria se publican bajo:

```txt
/categoria/<category-slug>
```

Ejemplos actuales:

- `/categoria/finanzas`
- `/categoria/legal-impuestos`
- `/categoria/fecha-tiempo`

Las calculadoras individuales ya viven bajo el slug de categoria como primer
segmento:

- `/finanzas/calculadora-de-prestamo`
- `/legal-impuestos/calculadora-de-iva`
- `/fecha-tiempo/calculadora-de-edad`

Por consistencia, se quiere eliminar la palabra `categoria` de las URLs de
categorias y dejar solo el slug canonico de categoria en el root.

## Objetivo

Cambiar las URLs canonicas de categorias de calculadoras de:

```txt
/categoria/<category-slug>
```

a:

```txt
/<category-slug>
```

El label visible de la categoria no cambia. Solo cambia la URL publica de la
pagina de categoria.

## URLs esperadas

| Categoria visible | URL actual | URL nueva |
| --- | --- | --- |
| `Fecha y tiempo` | `/categoria/fecha-tiempo` | `/fecha-tiempo` |
| `Finanzas` | `/categoria/finanzas` | `/finanzas` |
| `Inmuebles` | `/categoria/inmuebles` | `/inmuebles` |
| `Legal e impuestos` | `/categoria/legal-impuestos` | `/legal-impuestos` |
| `Matematicas` | `/categoria/matematicas` | `/matematicas` |
| `Salud` | `/categoria/salud` | `/salud` |

Las URLs de calculadoras individuales deben conservarse:

- `/fecha-tiempo/calculadora-de-edad`
- `/legal-impuestos/calculadora-de-iva`
- `/matematicas/calculadora-de-porcentajes`

## Analisis de routing

El sitio ya tiene carpetas de calculadoras por categoria:

```txt
src/pages/finanzas/calculadora-de-prestamo.astro
src/pages/legal-impuestos/calculadora-de-iva.astro
src/pages/fecha-tiempo/calculadora-de-edad.astro
```

Agregar una pagina de categoria en `/<category-slug>` no debe afectar esas
rutas. La categoria debe generar el `index.html` del segmento, mientras las
calculadoras siguen viviendo como rutas hijas.

Hay dos formas posibles de implementarlo.

### Opcion A: crear un `index.astro` por categoria

Ejemplo:

```txt
src/pages/finanzas/index.astro
src/pages/legal-impuestos/index.astro
src/pages/fecha-tiempo/index.astro
```

Ventajas:

- Muy explicito para las categorias actuales.
- Evita introducir una ruta dinamica de primer nivel.

Desventajas:

- Duplica el mismo template por categoria o exige wrappers manuales.
- Cada categoria futura requiere crear una pagina nueva.
- Es mas facil olvidar una categoria y crear enlaces rotos.

No es la opcion recomendada.

### Opcion B: mover la pagina dinamica al root

Mover o recrear la pagina actual:

```txt
src/pages/categoria/[category].astro
```

como:

```txt
src/pages/[category].astro
```

`getStaticPaths()` debe seguir generando solo los slugs declarados en
`CALCULATOR_CATEGORIES` que tienen calculadoras publicadas.

Ventajas:

- Mantiene una sola fuente para todas las paginas de categoria.
- Escala automaticamente para categorias futuras.
- Usa el mismo modelo `categorySlug` ya implementado.
- Evita duplicar markup y SEO.

Riesgos:

- Una ruta dinamica de primer nivel puede chocar con rutas estaticas existentes
  o futuras si se agrega una categoria con slug reservado.
- Requiere redirects explicitos desde las URLs antiguas.

Esta es la opcion recomendada.

## Slugs reservados

Al mover categorias al root, los slugs de categoria pasan a competir con rutas
top-level del sitio.

Los siguientes slugs no deben usarse para categorias de calculadoras:

- `blog`
- `contacto`
- `privacidad`
- `robots.txt`
- `404`
- `categoria`
- cualquier slug legacy de redirect top-level, por ejemplo
  `calculadora-de-edad` o `calculadora-deficit-calorico`

Si una categoria futura necesita un nombre visible que naturalmente produciria
uno de esos slugs, debe elegirse un `slug` alternativo explicito en
`CALCULATOR_CATEGORIES`.

## Alcance

- Actualizar `getCalculatorCategoryUrl(slug)` en
  `src/lib/calculator-directory.ts` para devolver `/${slug}`.
- Mover la ruta dinamica de categorias de
  `src/pages/categoria/[category].astro` a `src/pages/[category].astro`.
- Mantener el contenido, breadcrumbs, cards y SEO de la pagina actual.
- Actualizar canonicals para que apunten a `/<category-slug>`.
- Actualizar todos los enlaces internos de categorias que usen
  `getCalculatorCategoryUrl()`.
- Agregar redirects desde las rutas antiguas `/categoria/<slug>` hacia las
  nuevas `/<slug>`.
- Actualizar pruebas unitarias de `getCalculatorCategoryUrl()`.
- Agregar o ajustar validaciones para slugs reservados.
- Confirmar que el sitemap solo incluye las URLs canonicas nuevas de
  categorias.

## Fuera de alcance

- Cambiar las URLs de calculadoras individuales.
- Cambiar las rutas del blog, incluidas `/blog/categoria/<slug>`.
- Cambiar labels visibles de categorias.
- Cambiar el diseno de la pagina de categoria.
- Cambiar el modelo `categorySlug` de calculadoras.

## Cambios tecnicos esperados

### Helper de URL

Cambiar:

```ts
export const getCalculatorCategoryUrl = (slug: CalculatorCategorySlug) =>
  `/categoria/${slug}`;
```

por:

```ts
export const getCalculatorCategoryUrl = (slug: CalculatorCategorySlug) =>
  `/${slug}`;
```

Con esto, el index y cualquier otro consumidor que ya use el helper heredara la
nueva URL sin duplicar logica.

### Ruta Astro

Crear `src/pages/[category].astro` usando el contenido actual de
`src/pages/categoria/[category].astro`.

La ruta debe conservar:

- `getStaticPaths()`.
- `getPublishedCalculators()`.
- `getCalculatorCategories(calculators)`.
- `getCalculatorsByCategorySlug(calculators, category.slug)`.
- `canonical = getCalculatorCategoryUrl(category.slug)`.

Despues de crear la nueva ruta, eliminar
`src/pages/categoria/[category].astro` para que las rutas antiguas no se
generen como paginas canonicas.

### Redirects

Actualizar `astro.config.mjs` para redirigir todas las rutas antiguas de
categorias actuales:

```js
redirects: {
  "/categoria/fecha-tiempo": "/fecha-tiempo",
  "/categoria/finanzas": "/finanzas",
  "/categoria/inmuebles": "/inmuebles",
  "/categoria/legal-impuestos": "/legal-impuestos",
  "/categoria/matematicas": "/matematicas",
  "/categoria/salud": "/salud",
  "/categoria/legal-e-impuestos": "/legal-impuestos",
  "/categoria/fecha-y-tiempo": "/fecha-tiempo"
}
```

Las dos ultimas entradas mantienen compatibilidad con las rutas generadas antes
de separar `label` y `slug`.

Si Astro o el adaptador usado soportan redirects dinamicos confiables, podria
evaluarse una regla de patron. Para esta implementacion se recomienda usar
redirects explicitos para evitar ambiguedad en salida estatica.

### Tests

Actualizar `src/lib/calculator-directory.test.ts`:

```ts
expect(getCalculatorCategoryUrl("legal-impuestos")).toBe("/legal-impuestos");
expect(getCalculatorCategoryUrl("fecha-tiempo")).toBe("/fecha-tiempo");
```

Agregar una validacion para que ningun `categorySlug` use slugs reservados.

Tambien debe mantenerse la validacion existente:

```ts
expect(calculator.href.startsWith(`/${calculator.categorySlug}/`)).toBe(true);
```

Esa validacion sigue siendo importante porque ahora la pagina de categoria y
las calculadoras comparten el mismo segmento root.

## Criterios de aceptacion

- En `/`, el chip `Legal e impuestos` apunta a `/legal-impuestos`.
- En `/`, el chip `Fecha y tiempo` apunta a `/fecha-tiempo`.
- `/legal-impuestos` se genera durante el build.
- `/legal-impuestos` muestra la calculadora de IVA.
- `/legal-impuestos` tiene canonical `https://calculadoras.tools/legal-impuestos`.
- `/fecha-tiempo` se genera durante el build.
- `/fecha-tiempo` muestra la calculadora de edad.
- `/fecha-tiempo` tiene canonical `https://calculadoras.tools/fecha-tiempo`.
- `/categoria/legal-impuestos` redirige a `/legal-impuestos`.
- `/categoria/fecha-tiempo` redirige a `/fecha-tiempo`.
- `/categoria/legal-e-impuestos` redirige a `/legal-impuestos`.
- `/categoria/fecha-y-tiempo` redirige a `/fecha-tiempo`.
- Las calculadoras individuales conservan sus URLs actuales.
- El sitemap incluye `/<category-slug>` para categorias de calculadoras.
- El sitemap no incluye `/categoria/<category-slug>` para categorias de
  calculadoras.
- `npm.cmd run test:unit:run` termina sin errores.
- `npm.cmd run build` termina sin errores.

## Pruebas manuales sugeridas

- Revisar `/` y confirmar los `href` de todos los chips de categoria.
- Abrir `/finanzas`, `/legal-impuestos`, `/fecha-tiempo`, `/matematicas`,
  `/salud` e `/inmuebles`.
- Abrir `/legal-impuestos/calculadora-de-iva` y confirmar que no cambia.
- Abrir `/fecha-tiempo/calculadora-de-edad` y confirmar que no cambia.
- Abrir `/categoria/legal-impuestos` y confirmar redirect.
- Abrir `/categoria/legal-e-impuestos` y confirmar redirect.
- Revisar `dist/sitemap-0.xml` despues del build y confirmar que no aparecen
  rutas canonicas de calculadoras bajo `/categoria/`.

