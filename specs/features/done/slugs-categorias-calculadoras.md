# Spec: slugs explicitos para categorias de calculadoras

## Contexto

Las paginas de categoria de calculadoras se generan desde
`src/pages/categoria/[category].astro` usando los helpers de
`src/lib/calculator-directory.ts`.

Hoy el modelo de categoria de calculadoras usa un solo valor:

```ts
category: "Legal e impuestos"
```

Ese valor se usa como texto visible y tambien como base para generar el slug de
URL mediante `getCalculatorCategorySlug(category)`. La normalizacion actual
convierte espacios, conectores y signos en guiones:

- `Legal e impuestos` -> `legal-e-impuestos`
- `Fecha y tiempo` -> `fecha-y-tiempo`

Pero las URLs de las calculadoras ya usan slugs mas cortos como segmento de
categoria:

- `/legal-impuestos/calculadora-de-iva`
- `/fecha-tiempo/calculadora-de-edad`

Esto produce URLs de categoria no homologadas con las URLs de calculadoras:

- categoria actual: `/categoria/legal-e-impuestos`
- calculadora actual: `/legal-impuestos/calculadora-de-iva`

El problema no es solo de estas dos categorias. Cualquier categoria futura de
multiples palabras puede necesitar un nombre publico distinto del slug usado en
la URL.

## Objetivo

Separar explicitamente el nombre visible de una categoria y su slug canonico de
URL para calculadoras.

Las categorias afectadas deben quedar asi:

| Categoria visible | Slug canonico | URL de categoria |
| --- | --- | --- |
| `Legal e impuestos` | `legal-impuestos` | `/categoria/legal-impuestos` |
| `Fecha y tiempo` | `fecha-tiempo` | `/categoria/fecha-tiempo` |

La misma regla debe aplicar a categorias nuevas: el label que se muestra en UI
no debe derivar automaticamente el slug canonico.

## Opciones analizadas

### Opcion 1: mantener slug automatico desde el label

Consiste en seguir usando `getCalculatorCategorySlug(category)` sobre el texto
visible.

Ventajas:

- No requiere migracion del modelo actual.
- Mantiene una convencion simple para categorias de una palabra.

Desventajas:

- No resuelve el caso requerido, porque `Legal e impuestos` seguiria generando
  `legal-e-impuestos`.
- Obliga a cambiar el texto visible si se quiere cambiar la URL.
- No escala para categorias futuras donde el nombre publico y el slug deban
  diferir.

Esta opcion queda descartada.

### Opcion 2: agregar excepciones al slugger

Consiste en mantener el label como fuente principal, pero agregar un mapa de
excepciones:

```ts
{
  "Legal e impuestos": "legal-impuestos",
  "Fecha y tiempo": "fecha-tiempo",
}
```

Ventajas:

- Cambio pequeno.
- Corrige rapidamente las dos categorias actuales.

Desventajas:

- Convierte reglas de negocio en casos especiales escondidos dentro del helper.
- Cada categoria nueva con slug custom requiere modificar el slugger.
- Es facil que otros usos sigan asumiendo que el slug se deriva del label.

Esta opcion puede servir como parche temporal, pero no es la recomendada.

### Opcion 3: definir categorias de calculadoras como metadata explicita

Consiste en crear una fuente central para categorias de calculadoras donde cada
categoria declare al menos:

```ts
{
  slug: "legal-impuestos",
  label: "Legal e impuestos",
  description: "..."
}
```

Las calculadoras deben referenciar esa categoria por un identificador estable,
preferentemente el mismo slug canonico:

```ts
{
  id: "calculadora-de-iva",
  href: "/legal-impuestos/calculadora-de-iva",
  categorySlug: "legal-impuestos"
}
```

Ventajas:

- Separa de forma clara UI y URL.
- Evita repetir labels y descripciones por calculadora.
- Hace explicito el contrato para categorias futuras.
- Permite validar que cada calculadora apunta a una categoria existente.
- Permite validar que el primer segmento de `href` coincida con
  `categorySlug`.

Desventajas:

- Requiere una migracion pequena del modelo de `CalculatorDirectoryItem`.
- Requiere adaptar helpers y paginas que hoy reciben `category` como string.

Esta es la opcion recomendada.

## Alcance

- Crear una fuente central de metadata de categorias de calculadoras.
- Separar el label visible del slug canonico.
- Actualizar `CalculatorDirectoryItem` para que no dependa del label como clave
  de agrupacion.
- Actualizar los helpers de `src/lib/calculator-directory.ts`.
- Actualizar el index para que los chips apunten al slug canonico.
- Actualizar `src/pages/categoria/[category].astro` para generar rutas,
  canonical y filtros desde el slug canonico.
- Actualizar descripciones de categoria para que usen el slug canonico.
- Agregar redirects desde las rutas antiguas de categoria hacia las nuevas
  cuando aplique.

## Fuera de alcance

- Cambiar las URLs de calculadoras individuales ya existentes.
- Cambiar categorias del blog. El blog puede seguir usando su modelo actual.
- Cambiar el diseno visual de chips o paginas de categoria.
- Cambiar contenido editorial de calculadoras.
- Migrar rutas de articulos.

## Modelo propuesto

Agregar una constante central, por ejemplo
`src/lib/constants/calculator-categories.ts`:

```ts
export const CALCULATOR_CATEGORIES = {
  finanzas: {
    slug: "finanzas",
    label: "Finanzas",
    description:
      "Calculadoras para estimar prestamos, intereses y escenarios de inversion antes de comprometer tu dinero.",
  },
  inmuebles: {
    slug: "inmuebles",
    label: "Inmuebles",
    description:
      "Herramientas para estimar pagos, financiamiento y escenarios relacionados con vivienda e inmuebles.",
  },
  "legal-impuestos": {
    slug: "legal-impuestos",
    label: "Legal e impuestos",
    description:
      "Herramientas para agregar o desglosar impuestos, revisar montos con IVA y preparar cifras utiles para facturas o presupuestos.",
  },
  matematicas: {
    slug: "matematicas",
    label: "Matematicas",
    description:
      "Calculadoras para porcentajes, proporciones y reglas de tres, con resultados directos para tareas, compras y trabajo.",
  },
  salud: {
    slug: "salud",
    label: "Salud",
    description:
      "Calculadoras de referencia para revisar indicadores personales y entender mejor tus resultados de bienestar.",
  },
  "fecha-tiempo": {
    slug: "fecha-tiempo",
    label: "Fecha y tiempo",
    description:
      "Herramientas para calcular edades, intervalos, cumpleanos y fechas importantes con claridad.",
  },
} as const;
```

Actualizar `CalculatorDirectoryItem` para usar el slug canonico:

```ts
export interface CalculatorDirectoryItem {
  id: string;
  title: string;
  description: string;
  href: string;
  categorySlug: CalculatorCategorySlug;
  order: number;
  draft?: boolean;
}
```

La propiedad `category` actual puede eliminarse o conservarse temporalmente solo
durante la migracion. Si se conserva, debe tratarse como legacy y no debe ser
fuente de verdad para URLs.

## Helpers esperados

`src/lib/calculator-directory.ts` debe exponer helpers basados en slug canonico:

```ts
getCalculatorCategory(slug: CalculatorCategorySlug)
getCalculatorCategoryUrl(slug: CalculatorCategorySlug)
getCalculatorCategoryDescription(slug: CalculatorCategorySlug)
getCalculatorCategories(items: CalculatorDirectoryItem[])
```

`getCalculatorCategoryUrl("legal-impuestos")` debe devolver:

```ts
"/categoria/legal-impuestos"
```

`getCalculatorCategories(items)` debe devolver categorias agrupadas por
`categorySlug`, con:

- `slug`
- `label`
- `description`
- `count`

La categoria renderizada en UI siempre debe usar `category.label`.

## Comportamiento esperado

1. El chip `Legal e impuestos` en `/` debe enlazar a
   `/categoria/legal-impuestos`.
2. La pagina `/categoria/legal-impuestos` debe mostrar las calculadoras con
   `categorySlug: "legal-impuestos"`, incluida la calculadora de IVA.
3. El texto visible de la pagina debe seguir usando `Legal e impuestos`.
4. El canonical de esa pagina debe ser `/categoria/legal-impuestos`.
5. El chip `Fecha y tiempo` en `/` debe enlazar a
   `/categoria/fecha-tiempo`.
6. La pagina `/categoria/fecha-tiempo` debe mostrar las calculadoras con
   `categorySlug: "fecha-tiempo"`, incluida la calculadora de edad.
7. El texto visible de la pagina debe seguir usando `Fecha y tiempo`.
8. El canonical de esa pagina debe ser `/categoria/fecha-tiempo`.
9. Las categorias de una sola palabra deben conservar sus URLs actuales:
   `/categoria/finanzas`, `/categoria/inmuebles`, `/categoria/matematicas`,
   `/categoria/salud`.
10. Toda categoria nueva debe declarar explicitamente `slug` y `label`; no debe
    depender de derivar el slug desde el label.

## Redirects y compatibilidad

Las rutas antiguas de categoria deben redirigir a las nuevas para evitar enlaces
rotos y perdida innecesaria de SEO:

```js
redirects: {
  "/categoria/legal-e-impuestos": "/categoria/legal-impuestos",
  "/categoria/fecha-y-tiempo": "/categoria/fecha-tiempo"
}
```

Si el hosting o la salida estatica no soporta redirects nativos, se debe
confirmar el mecanismo que Astro genera para `redirects` antes de cerrar la
implementacion.

Las rutas antiguas no deben seguir apareciendo como canonicas ni en enlaces
internos.

## Validaciones recomendadas

Agregar validaciones unitarias o checks puros para evitar que el problema se
repita:

1. Cada `calculator.categorySlug` existe en `CALCULATOR_CATEGORIES`.
2. Cada `CALCULATOR_CATEGORIES[slug].slug` coincide con su clave.
3. Cada `calculator.href` empieza con `/${calculator.categorySlug}/`.
4. No hay dos categorias con el mismo slug.
5. `getCalculatorCategoryUrl("legal-impuestos")` devuelve
   `/categoria/legal-impuestos`.
6. `getCalculatorCategoryUrl("fecha-tiempo")` devuelve
   `/categoria/fecha-tiempo`.

## Criterios de aceptacion

- `/` muestra `Legal e impuestos` como texto visible y el enlace apunta a
  `/categoria/legal-impuestos`.
- `/` muestra `Fecha y tiempo` como texto visible y el enlace apunta a
  `/categoria/fecha-tiempo`.
- `/categoria/legal-impuestos` se genera durante el build.
- `/categoria/legal-impuestos` muestra la calculadora de IVA.
- `/categoria/legal-impuestos` no usa `legal-e-impuestos` en canonical ni
  enlaces internos.
- `/categoria/fecha-tiempo` se genera durante el build.
- `/categoria/fecha-tiempo` muestra la calculadora de edad.
- `/categoria/fecha-tiempo` no usa `fecha-y-tiempo` en canonical ni enlaces
  internos.
- `/categoria/legal-e-impuestos` redirige a `/categoria/legal-impuestos`.
- `/categoria/fecha-y-tiempo` redirige a `/categoria/fecha-tiempo`.
- `npm.cmd run test:unit:run` termina sin errores.
- `npm.cmd run build` termina sin errores.

## Pruebas manuales sugeridas

- Revisar `/` y confirmar los `href` de los chips de categoria.
- Abrir `/categoria/legal-impuestos` y confirmar titulo, breadcrumb,
  descripcion, canonical y cards.
- Abrir `/categoria/fecha-tiempo` y confirmar titulo, breadcrumb, descripcion,
  canonical y cards.
- Abrir `/legal-impuestos/calculadora-de-iva` y confirmar que no cambia.
- Abrir `/fecha-tiempo/calculadora-de-edad` y confirmar que no cambia.
- Confirmar que las categorias no afectadas siguen resolviendo:
  `/categoria/finanzas`, `/categoria/inmuebles`, `/categoria/matematicas` y
  `/categoria/salud`.

