# 04 - Piloto home y categoria

## Objetivo

Publicar `/en` y `/en/math` usando el directorio localizado, sin duplicar markup y sin enlazar a contenido no traducido.

## Alcance

- `src/components/pages/HomePage.astro`
- `src/pages/index.astro`
- `src/pages/en/index.astro`
- `src/pages/[category].astro`
- `src/pages/en/[category].astro`
- Textos de home/directorio en `messages.ts`

No incluye la calculadora de porcentajes.

## Home compartida

La home actual `src/pages/index.astro` sigue sirviendo `/`.

Crear `src/components/pages/HomePage.astro`.

Props:

```ts
interface Props {
  locale: Locale;
  canonical: string;
  alternates: AlternateLink[];
}
```

Rutas:

```astro
---
// src/pages/index.astro
---

<HomePage
  locale="es"
  canonical="/"
  alternates={buildAlternateLinks({ es: "/", en: "/en" }, Astro.site ?? Astro.url)}
/>
```

```astro
---
// src/pages/en/index.astro
---

<HomePage
  locale="en"
  canonical="/en"
  alternates={buildAlternateLinks({ es: "/", en: "/en" }, Astro.site ?? Astro.url)}
/>
```

Reglas:

- Usar `getPublishedCalculators(locale)`.
- Usar `getCalculatorCategories(calculators, locale)`.
- Usar `getCalculatorCategoryUrl(category.id, locale)`.
- Usar textos desde `t(locale, ...)`.
- Usar `Card` con CTA localizada.
- No mostrar categorias sin calculadoras publicadas en ese locale.
- No enlazar desde `/en` a calculadoras o categorias espanolas.

## Busqueda cliente

Mantener la busqueda cliente, pero localizar:

- Label.
- Placeholder.
- Resumen vacio.
- Cantidad de resultados.
- Singular/plural basico.

Regla tecnica:

- Pasar textos por `data-*` o por JSON seguro en un `<script type="application/json">`.
- Evitar hardcodear frases inglesas o espanolas dentro del script cliente.

## Categoria espanola

La ruta actual `src/pages/[category].astro` sigue generando categorias espanolas.

Reglas:

- Usar helpers con default `es`.
- Conservar canonical actual, por ejemplo `/matematicas`.
- Pasar alternates cuando exista equivalente publicado en otro locale, por ejemplo `/en/math`.
- Mantener legacy slugs y tests existentes.

## Categoria inglesa

Crear `src/pages/en/[category].astro`.

`getStaticPaths` para ingles:

- Obtener calculadoras publicadas en `en`.
- Obtener categorias con al menos una calculadora publicada en `en`.
- Usar slug localizado de categoria como param, por ejemplo `math`.
- Pasar `locale: "en"`, `categoryId`, `category`, `calculators`, `canonical` y `alternates`.

La pagina debe:

- Usar canonical `/en/math`.
- Declarar alternate con `/matematicas` si existe equivalente `es`.
- No listar categorias sin calculadoras publicadas en ingles.
- Usar breadcrumbs localizados.
- Usar CTAs localizados.

## SEO

Home:

- `/` canonical absoluto hacia `/`.
- `/en` canonical absoluto hacia `/en`.
- Ambas declaran alternates `es-MX`, `en`, `x-default`.

Categoria:

- `/matematicas` canonical absoluto hacia `/matematicas`.
- `/en/math` canonical absoluto hacia `/en/math`.
- Ambas declaran alternates `es-MX`, `en`, `x-default`.

## Tests

Agregar o actualizar tests para:

- `getPublishedCalculators("en")` alimenta la home inglesa solo con contenido publicado.
- `getCalculatorCategories(..., "en")` devuelve solo Math en fase 1.
- `/en` no tiene trailing slash en helpers.
- `/en/math` no tiene trailing slash en helpers.
- No se generan paths ingleses para categorias sin metadata inglesa publicada.

## Criterios de aceptacion

- `/` sigue funcionando igual en espanol.
- `/matematicas` sigue funcionando igual en espanol.
- `/en` renderiza home inglesa.
- `/en/math` renderiza categoria inglesa.
- La home inglesa no enlaza a blog, contacto, privacidad ni calculadoras sin version inglesa publicada.
