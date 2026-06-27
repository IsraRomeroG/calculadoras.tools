# 06 - Sitemap, links y validacion

## Objetivo

Validar que las rutas localizadas publicadas aparezcan correctamente en sitemap, que no haya trailing slash y que `/en` no enlace a contenido espanol no traducido.

## Alcance

- `astro.config.mjs` si el filtro de sitemap necesita cambios.
- `src/lib/blog-sitemap.mjs` y tests relacionados si aplica.
- `src/lib/internal-links.test.ts`
- Tests i18n de rutas, sitemap y links internos.

## Sitemap

`robots.txt` puede seguir apuntando a `sitemap-index.xml`.

Reglas:

- Incluir `/en`, `/en/math` y `/en/math/percentage-calculator` cuando existan como rutas estaticas publicadas.
- No incluir rutas inglesas en `draft`.
- No incluir `/en/blog` hasta que exista blog ingles publicado.
- Mantener exclusion de rutas legacy del blog.
- No generar trailing slash.

El filtro actual de sitemap es blog-specific. Como deja pasar rutas que no empiezan con `/blog`, puede no requerir cambios para `/en`. Aun asi, agregar tests para documentar esa decision.

## Links internos

Actualizar `src/lib/internal-links.test.ts` si detecta nuevos patrones de links localizados.

Casos:

- No trailing slash en `/en`.
- No trailing slash en `/en/math`.
- No trailing slash en `/en/math/percentage-calculator`.
- No enlaces ingleses a rutas espanolas salvo:
  - `<link rel="alternate">`
  - selector de idioma explicito
  - casos legales aprobados explicitamente
- No links a `/en/blog`, `/en/contact`, `/en/privacy` si esas rutas no existen.

## Validacion de rutas publicadas

Agregar tests de helpers o snapshots ligeros para:

- Rutas espanolas existentes no cambian.
- Rutas inglesas del piloto existen en metadata/directorio.
- No se generan URLs localizadas para calculadoras sin `published: true`.
- No se generan alternates para traducciones en draft.

## Validacion de shell

Agregar tests o checks para:

- Navbar inglesa no contiene `Blog` ni `Contact` si no hay paths ingleses.
- Footer ingles no contiene links espanoles sin traduccion.
- `AdConsentBanner` no se renderiza en ingles sin politica legal inglesa publicada.

## Comando final

Ejecutar:

```powershell
npm.cmd run test:unit:run
```

No ejecutar:

```powershell
npm run dev
npm run build
```

salvo pedido explicito.

## Criterios de aceptacion

- El sitemap incluye solo rutas publicadas.
- No hay trailing slash en rutas internas.
- `/en` no enlaza a contenido no traducido.
- Los tests unitarios pasan.
