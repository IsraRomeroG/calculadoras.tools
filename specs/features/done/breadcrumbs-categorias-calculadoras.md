# Spec: breadcrumbs de categorias en paginas de calculadora

## Contexto

Las paginas individuales de calculadora usan `PageHero` con breadcrumbs
declarados manualmente en cada archivo Astro.

Ejemplos actuales:

```ts
breadcrumbs={[
  { label: "Inicio", href: "/", ariaLabel: "Inicio" },
  { label: "Finanzas", href: "/#calculadoras", optional: true },
  { label: "Calculadora de prestamo", truncate: true },
]}
```

El enlace de categoria apunta al listado de calculadoras del home
`/#calculadoras`, pero el sitio ya tiene paginas canonicas de categoria en el
root:

- `/finanzas`
- `/inmuebles`
- `/legal-impuestos`
- `/matematicas`
- `/salud`
- `/fecha-tiempo`

La metadata compartida de categorias vive en
`src/lib/constants/categories.ts`, y el helper canonico para URLs de categorias
de calculadoras vive en `src/lib/calculator-directory.ts`:

```ts
export const getCalculatorCategoryUrl = (slug: CalculatorCategorySlug) =>
  `/${slug}`;
```

Por eso, el problema no esta en la ruta de categoria ni en el helper principal,
sino en los breadcrumbs hardcodeados dentro de las paginas de calculadora.

## Problema

Dentro de una pagina de calculadora, al hacer click en el breadcrumb de
categoria, el usuario vuelve a `/#calculadoras` en lugar de navegar a la pagina
de esa categoria.

Esto afecta la navegacion interna y la consistencia SEO porque:

- El breadcrumb visible comunica una categoria, pero el destino no es la pagina
  de categoria.
- Se pierde el enlace contextual desde cada calculadora hacia su categoria.
- El comportamiento difiere del index, donde las categorias ya usan
  `getCalculatorCategoryUrl(category.slug)`.
- El problema puede repetirse en calculadoras nuevas si se copian breadcrumbs
  existentes.

## Objetivo

Actualizar los breadcrumbs de paginas individuales de calculadora para que el
nivel de categoria enlace al slug canonico de categoria.

Ejemplos esperados:

| Pagina de calculadora | Breadcrumb de categoria esperado |
| --- | --- |
| `/finanzas/calculadora-de-prestamo` | `Finanzas -> /finanzas` |
| `/finanzas/calculadora-de-interes-compuesto` | `Finanzas -> /finanzas` |
| `/legal-impuestos/calculadora-de-iva` | `Legal e impuestos -> /legal-impuestos` |
| `/matematicas/calculadora-de-porcentajes` | `Matematicas -> /matematicas` |
| `/salud/calculadora-de-imc` | `Salud -> /salud` |
| `/fecha-tiempo/calculadora-de-edad` | `Fecha y tiempo -> /fecha-tiempo` |

## Alcance

- Actualizar todas las paginas individuales de calculadora bajo `src/pages`.
- Mantener el breadcrumb `Inicio -> /`.
- Mantener el ultimo breadcrumb como pagina actual, sin `href`.
- Mantener `optional: true` en el breadcrumb de categoria cuando la pagina ya lo
  use para colapso movil.
- Usar la metadata compartida de categorias para evitar duplicar labels y URLs.
- Agregar una verificacion automatica que falle si una pagina de calculadora
  vuelve a usar `/#calculadoras` como destino del breadcrumb de categoria.

## Fuera de alcance

- Cambiar las URLs canonicas de calculadoras individuales.
- Cambiar las URLs canonicas de categorias.
- Cambiar redirects existentes desde `/categoria/<slug>`.
- Cambiar el diseno visual de `Breadcrumb` o `PageHero`.
- Cambiar CTAs secundarios que apunten a `/#calculadoras`, por ejemplo enlaces
  genericos como "Ver calculadoras disponibles" fuera del breadcrumb.
- Cambiar breadcrumbs del blog o de paginas institucionales.

## Opciones analizadas

### Opcion A: reemplazar manualmente `/#calculadoras` por cada slug

Consiste en editar cada pagina de calculadora y cambiar el `href` hardcodeado:

```ts
{ label: "Finanzas", href: "/finanzas", optional: true }
```

Ventajas:

- Es el cambio mas pequeno.
- No requiere nuevos helpers.

Desventajas:

- Mantiene labels y URLs duplicados en cada pagina.
- Es facil introducir inconsistencias entre `label`, `href`, `kicker` y
  `canonical`.
- No previene que una calculadora nueva copie el patron antiguo.

Esta opcion sirve como parche, pero no es la recomendada.

### Opcion B: usar helpers existentes por pagina

Consiste en declarar el `categorySlug` de cada pagina e importar metadata desde
`src/lib/calculator-directory.ts`:

```ts
import {
  getCalculatorCategory,
  getCalculatorCategoryUrl,
} from "@lib/calculator-directory";

const categorySlug = "finanzas";
const category = getCalculatorCategory(categorySlug);
const categoryUrl = getCalculatorCategoryUrl(categorySlug);
```

Y usarlo en `PageHero`:

```ts
<PageHero
  kicker={category.label}
  breadcrumbs={[
    { label: "Inicio", href: "/", ariaLabel: "Inicio" },
    { label: category.label, href: categoryUrl, optional: true },
    { label: "Calculadora de prestamo", truncate: true },
  ]}
/>
```

Ventajas:

- Usa la fuente de verdad existente para labels y URLs.
- Evita duplicar el slug visible y el destino.
- El cambio es local y claro en cada pagina.
- No acopla la capa de dominio a tipos de componentes Astro.

Desventajas:

- Cada pagina aun debe declarar su `categorySlug`.
- Requiere tocar todas las paginas de calculadora existentes.

Esta es la opcion recomendada para esta correccion.

### Opcion C: crear un helper de breadcrumbs de calculadora

Consiste en exponer una funcion que devuelva los items de breadcrumb completos,
por ejemplo:

```ts
getCalculatorBreadcrumbs(categorySlug, calculatorLabel)
```

Ventajas:

- Reduce repeticion al maximo.
- Estandariza la forma completa del breadcrumb.

Desventajas:

- Puede mezclar logica de UI con `calculator-directory.ts`.
- Requiere decidir donde vive el tipo de item sin depender directamente de un
  componente `.astro`.
- Es mas abstraccion de la necesaria para corregir este bug.

Puede evaluarse mas adelante si se agregan muchas calculadoras, pero no es
necesaria para cerrar este cambio.

## Cambios tecnicos esperados

En cada pagina individual de calculadora:

1. Importar `getCalculatorCategory` y `getCalculatorCategoryUrl` desde
   `@lib/calculator-directory`.
2. Declarar un `categorySlug` que coincida con el primer segmento del
   `canonical` y con `CALCULATORS`.
3. Derivar `category` y `categoryUrl` desde los helpers.
4. Usar `category.label` como `kicker` cuando aplique.
5. Usar `category.label` y `categoryUrl` en el breadcrumb de categoria.

Ejemplo:

```ts
const categorySlug = "fecha-tiempo";
const category = getCalculatorCategory(categorySlug);
const categoryUrl = getCalculatorCategoryUrl(categorySlug);
```

```ts
breadcrumbs={[
  { label: "Inicio", href: "/", ariaLabel: "Inicio" },
  { label: category.label, href: categoryUrl, optional: true },
  { label: "Calculadora de edad", truncate: true },
]}
```

## Paginas afectadas conocidas

Las siguientes paginas contienen actualmente el patron
`href: "/#calculadoras"` dentro de breadcrumbs de calculadora:

- `src/pages/fecha-tiempo/calculadora-de-edad.astro`
- `src/pages/finanzas/calculadora-de-interes-compuesto.astro`
- `src/pages/finanzas/calculadora-de-prestamo.astro`
- `src/pages/inmuebles/calculadora-de-hipoteca.astro`
- `src/pages/legal-impuestos/calculadora-de-iva.astro`
- `src/pages/matematicas/calculadora-de-porcentajes.astro`
- `src/pages/matematicas/calculadora-de-regla-de-tres.astro`
- `src/pages/salud/calculadora-deficit-calorico.astro`
- `src/pages/salud/calculadora-de-calorias-diarias-tdee.astro`
- `src/pages/salud/calculadora-de-imc.astro`
- `src/pages/salud/calculadora-de-macros.astro`

`src/pages/404.astro` y CTAs genericos como el enlace "Ver calculadoras
disponibles" pueden seguir apuntando a `/#calculadoras`; esta spec solo cubre
el nivel de categoria dentro del breadcrumb de paginas de calculadora.

## Validaciones recomendadas

Agregar una prueba en `src/lib/calculator-directory.test.ts` o en un nuevo test
ligero que lea archivos `.astro` de calculadoras y verifique:

1. Ninguna pagina individual de calculadora usa `href: "/#calculadoras"` dentro
   de sus breadcrumbs.
2. Ninguna pagina individual de calculadora usa `href="/#calculadoras"` dentro
   del componente `PageHero`.
3. Cada calculadora registrada en `CALCULATORS` conserva un `href` que empieza
   con `/${categorySlug}/`.
4. `getCalculatorCategoryUrl(categorySlug)` sigue devolviendo `/${slug}` para
   todas las categorias publicadas.

La prueba debe evitar fallar por CTAs no relacionados al breadcrumb, porque
`/#calculadoras` sigue siendo un destino valido para enlaces genericos hacia el
home.

## Criterios de aceptacion

- En `/finanzas/calculadora-de-prestamo`, el breadcrumb `Finanzas` apunta a
  `/finanzas`.
- En `/finanzas/calculadora-de-interes-compuesto`, el breadcrumb `Finanzas`
  apunta a `/finanzas`.
- En `/legal-impuestos/calculadora-de-iva`, el breadcrumb
  `Legal e impuestos` apunta a `/legal-impuestos`.
- En `/matematicas/calculadora-de-porcentajes`, el breadcrumb `Matematicas`
  apunta a `/matematicas`.
- En `/matematicas/calculadora-de-regla-de-tres`, el breadcrumb `Matematicas`
  apunta a `/matematicas`.
- En `/salud/calculadora-de-imc`, el breadcrumb `Salud` apunta a `/salud`.
- En `/salud/calculadora-de-calorias-diarias-tdee`, el breadcrumb `Salud`
  apunta a `/salud`.
- En `/salud/calculadora-de-macros`, el breadcrumb `Salud` apunta a `/salud`.
- En `/salud/calculadora-deficit-calorico`, el breadcrumb `Salud` apunta a
  `/salud`.
- En `/inmuebles/calculadora-de-hipoteca`, el breadcrumb `Inmuebles` apunta a
  `/inmuebles`.
- En `/fecha-tiempo/calculadora-de-edad`, el breadcrumb `Fecha y tiempo`
  apunta a `/fecha-tiempo`.
- El breadcrumb `Inicio` sigue apuntando a `/`.
- El ultimo breadcrumb de cada calculadora sigue siendo texto actual sin
  enlace.
- Los CTAs genericos que apuntan a `/#calculadoras` no se modifican salvo que
  esten dentro del breadcrumb.
- `npm.cmd run test:unit:run` termina sin errores.
- `npm.cmd run build` termina sin errores.

## Pruebas manuales sugeridas

- Abrir una calculadora por categoria y confirmar el destino del breadcrumb de
  categoria:
  - `/finanzas/calculadora-de-prestamo`
  - `/legal-impuestos/calculadora-de-iva`
  - `/matematicas/calculadora-de-porcentajes`
  - `/salud/calculadora-de-imc`
  - `/inmuebles/calculadora-de-hipoteca`
  - `/fecha-tiempo/calculadora-de-edad`
- Hacer click en el breadcrumb de categoria y confirmar que abre la pagina de
  categoria correspondiente.
- Confirmar que cada pagina de categoria lista las calculadoras esperadas.
- Revisar mobile para confirmar que `collapseBreadcrumbOnMobile` mantiene el
  comportamiento visual actual.

