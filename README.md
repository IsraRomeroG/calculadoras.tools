# calculadoras.tools

Sitio web de calculadoras online simples, claras y gratuitas. El proyecto esta construido con Astro y combina herramientas interactivas con contenido editorial para explicar calculos cotidianos de matematicas, finanzas e impuestos.

## Stack

- Astro 6
- Tailwind CSS 4
- Vitest para pruebas unitarias
- `@astrojs/sitemap` para sitemap de produccion
- Colecciones de contenido de Astro para el blog

## Requisitos

- Node.js `>=22.12.0`
- npm

## Comandos

Todos los comandos se ejecutan desde la raiz del proyecto.

| Comando | Accion |
| --- | --- |
| `npm install` | Instala dependencias |
| `npm run dev` | Inicia el servidor local de Astro |
| `npm run build` | Genera el sitio estatico en `dist/` |
| `npm run preview` | Previsualiza el build localmente |
| `npm run test` | Ejecuta Vitest en modo watch |
| `npm run test:unit:run` | Ejecuta las pruebas unitarias una vez |
| `npm run coverage` | Ejecuta pruebas con reporte de cobertura |
| `npm run astro -- --help` | Muestra ayuda de la CLI de Astro |

En PowerShell, las validaciones habituales son:

```powershell
npm.cmd run test:unit:run
npm.cmd run coverage
```

## Estructura principal

```text
/
|-- public/                  # Archivos publicos estaticos
|-- specs/                   # Especificaciones y notas de producto
|-- src/
|   |-- components/          # Componentes de layout, blog y UI compartida
|   |-- content/blog/        # Articulos Markdown organizados por categoria
|   |-- layouts/             # Layout base del sitio
|   |-- lib/                 # Logica reutilizable, SEO y calculadoras
|   |-- pages/               # Rutas publicas del sitio
|   |-- styles/              # Estilos globales
|   `-- svg/                 # Assets SVG del proyecto
|-- astro.config.mjs
|-- package.json
`-- vitest.config.ts
```

## Calculadoras disponibles

Las calculadoras publicadas se registran en `src/lib/constants/calculators.ts`. La constante `CALCULATORS` es la fuente de verdad para el directorio: las entradas se muestran automaticamente en la pagina de inicio y evitan mantener una lista manual duplicada en la documentacion.

La logica reutilizable vive en `src/lib/calculators/` junto con sus pruebas unitarias. Cuando agregues una calculadora nueva, crea o actualiza:

- La pagina en `src/pages/<categoria>/<slug>.astro`
- La logica de calculo en `src/lib/calculators/`
- Las pruebas correspondientes en `src/lib/calculators/*.test.ts`
- La entrada del directorio en `src/lib/constants/calculators.ts`

## Blog y contenido

Los articulos estan en `src/content/blog/` y usan la coleccion definida en `src/content.config.ts`. Cada articulo debe incluir metadatos como `title`, `description`, `pubDate`, `categorySlug`, `tags` y, cuando aplique, `relatedCalculator`.

Las categorias compartidas viven en `src/lib/constants/categories.ts`. Usa esos slugs en `categorySlug` para que el blog, las calculadoras y las rutas publicas compartan la misma taxonomia.

Las rutas del blog se generan desde:

- `src/pages/blog.astro`
- `src/pages/blog/[category].astro`
- `src/pages/blog/[category]/[slug].astro`
- `src/pages/blog/[category]/pagina/[page].astro`
- `src/pages/blog/pagina/[page].astro`

## SEO

El sitio usa `https://calculadoras.tools` como dominio canonico en `astro.config.mjs`, genera sitemap con `@astrojs/sitemap` y expone `robots.txt` desde `src/pages/robots.txt.ts`.

Para calculadoras con preguntas frecuentes, la utilidad `buildFaqJsonLd` en `src/lib/seo.ts` ayuda a generar marcado JSON-LD de FAQ.

## Alias de imports

El proyecto define alias en `tsconfig.json`:

- `@/*`
- `@components/*`
- `@layouts/*`
- `@lib/*`
- `@styles/*`
