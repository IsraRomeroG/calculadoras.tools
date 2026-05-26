# Spec: categorias de calculadoras enlazables

## Contexto

En `/`, debajo del texto "Selecciona una herramienta para comenzar", se muestra
un listado de categorias de calculadoras, pero actualmente se renderiza con
`span` y no permite navegar.

La experiencia deseada es similar a las categorias del blog en cuanto a
interaccion visual, pero el destino y el contenido deben ser de calculadoras,
no de articulos.

Ejemplos de rutas esperadas:

- `/categoria/finanzas`
- `/categoria/legal-e-impuestos`
- `/categoria/matematicas`
- `/categoria/salud`

## Objetivo

Convertir los chips de categorias del index en enlaces funcionales hacia nuevas
paginas de categoria de calculadoras. Cada pagina de categoria debe mostrar las
cards de calculadoras publicadas que pertenecen a esa categoria.

## Alcance

- Pagina afectada: `src/pages/index.astro`.
- Nueva pagina dinamica esperada: `src/pages/categoria/[category].astro`.
- Seccion del index afectada: bloque de categorias que aparece antes del grid
  de calculadoras.
- Las cards deben reutilizar el mismo componente/patron visual que el index.
- El orden de calculadoras debe respetar el orden existente de
  `getPublishedCalculators()`.
- No se requiere JavaScript en cliente.

## Requisitos funcionales

1. Cada categoria visible en el index debe renderizarse como un enlace.
2. El `href` debe usar la convencion `/categoria/{slug}`.
3. El slug debe generarse con la misma logica de categorias de calculadoras
   para evitar diferencias en acentos, espacios o signos:
   - `Finanzas` -> `/categoria/finanzas`
   - `Legal e impuestos` -> `/categoria/legal-e-impuestos`
   - `Matematicas` -> `/categoria/matematicas`
   - `Salud` -> `/categoria/salud`
4. Al abrir una ruta de categoria, la pagina debe mostrar solo calculadoras
   publicadas cuya categoria coincida con el slug de la URL.
5. El texto visible de cada chip del index debe mantenerse igual:
   - label de categoria
   - contador `category.count`
6. El contador debe reflejar el numero de calculadoras publicadas en esa
   categoria.
7. El estilo base de los chips debe seguir alineado con el estilo actual del
   sitio:
   - forma rounded full
   - borde gris
   - texto gris
   - estado hover/focus con color de acento y texto claro
8. La navegacion debe funcionar desde teclado y mouse.
9. No debe introducirse ningun enlace roto: toda categoria listada en el index
   debe tener una pagina generada en `/categoria/{slug}`.

## Pagina de categoria

La pagina `/categoria/[category]` debe incluir:

- Titulo claro con el nombre de la categoria, por ejemplo
  `Calculadoras de finanzas`.
- Descripcion breve orientada a calculadoras, no a articulos.
- Breadcrumbs recomendados:
  - `Inicio` -> `/`
  - categoria actual
- Grid de cards con las calculadoras publicadas de esa categoria.
- Estado vacio solo como proteccion defensiva; no deberia aparecer para rutas
  generadas desde categorias existentes.
- `title`, `description` y `canonical` especificos de la categoria.

## Notas tecnicas

- No usar `@lib/blog` para esta funcionalidad. La categoria enlazada es de
  calculadoras, no de posts.
- Agregar un helper en `@lib/calculator-directory`, por ejemplo:
  `getCalculatorCategoryUrl(category: string)`.
- El helper debe construir URLs con `getCalculatorCategorySlug(category)`:
  `/categoria/${getCalculatorCategorySlug(category)}`.
- La ruta dinamica puede usar `getStaticPaths()` con
  `getPublishedCalculators()` y `getCalculatorCategories(calculators)`.
- Para filtrar, comparar slugs:
  `getCalculatorCategorySlug(calculator.category) === category.slug`.
- Evitar duplicar manualmente la generacion de slugs en `index.astro` o en la
  pagina dinamica.
- El cambio esperado en el markup es pasar de:

```astro
<span class="...">
  ...
</span>
```

a:

```astro
<a href={getCalculatorCategoryUrl(category.label)} class="...">
  ...
</a>
```

## Accesibilidad

- Cada chip debe tener un destino navegable real (`href`).
- El foco visible debe ser claro. Puede usarse `focus-visible:outline`,
  `focus-visible:ring` o las convenciones ya existentes del proyecto.
- El nombre accesible del enlace puede ser el texto visible de la categoria; si
  se agrega `aria-label`, debe ser breve, por ejemplo:
  `Ver calculadoras de Finanzas`.

## Criterios de aceptacion

- En `/`, las categorias debajo de "Selecciona una herramienta para comenzar"
  son enlaces y ya no `span` no interactivos.
- Al seleccionar `Finanzas`, el usuario navega a `/categoria/finanzas`.
- En `/categoria/finanzas`, se muestran solo las calculadoras publicadas de
  Finanzas.
- Al seleccionar `Legal e impuestos`, el usuario navega a
  `/categoria/legal-e-impuestos`.
- En `/categoria/legal-e-impuestos`, se muestran solo las calculadoras
  publicadas de Legal e impuestos.
- Al seleccionar `Matematicas`, el usuario navega a
  `/categoria/matematicas`.
- En `/categoria/matematicas`, se muestran solo las calculadoras publicadas de
  Matematicas.
- Al seleccionar `Salud`, el usuario navega a `/categoria/salud`.
- En `/categoria/salud`, se muestran solo las calculadoras publicadas de Salud.
- El contador de cada categoria sigue mostrando el numero de calculadoras en esa
  categoria.
- El build de Astro termina sin errores.

## Pruebas sugeridas

- Ejecutar `npm run build`.
- Revisar manualmente `/` y confirmar que todos los chips de categoria son
  navegables.
- Revisar manualmente `/categoria/finanzas` y confirmar que carga solo cards de
  calculadoras financieras.
- Revisar manualmente `/categoria/legal-e-impuestos`, `/categoria/matematicas`
  y `/categoria/salud`.
- Confirmar que las rutas de blog existentes no cambian.

## Fuera de alcance

- Cambiar el contenido editorial del blog.
- Cambiar el modelo de datos de calculadoras.
- Agregar filtros interactivos de calculadoras en el index.
- Cambiar el diseno general de la home.
