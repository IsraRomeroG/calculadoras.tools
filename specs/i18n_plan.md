# Plan de internacionalizacion

## Resumen

El sitio debe pasar de una arquitectura solo en espanol a una arquitectura multidioma sin romper las URLs actuales. La fase inicial mantiene espanol como idioma fuente en la raiz y agrega un piloto en ingles:

- Espanol actual: `/`, `/matematicas`, `/matematicas/calculadora-de-porcentajes`
- Ingles nuevo: `/en`, `/en/math`, `/en/math/percentage-calculator`

La fase inicial no mueve rutas existentes. Por eso no requiere redirects 301. Si una fase futura mueve una URL publica, se debe generar antes un mapa old -> new y entregar reglas Apache `.htaccess` 301, sin conservar paginas Astro legacy.

## Objetivos

- Soportar multiples idiomas con IDs estables para categorias, calculadoras, rutas y contenido.
- Mantener SEO correcto por idioma: `lang`, canonical, `hreflang`, `x-default` y sitemap.
- Evitar paginas parcialmente traducidas o enlaces desde `/en` a contenido no traducido.
- Separar idioma, region, formato numerico, moneda y reglas locales.
- Mantener la logica matematica compartida; solo deben cambiar textos, rutas y formato local.
- Preparar el blog para i18n sin mover ni traducir contenido en fase 1.

## Alcance de la fase 1

- Locales:
  - `es`: idioma fuente, sin prefijo de URL, `htmlLang: "es-MX"`.
  - `en`: primer idioma nuevo, con prefijo `/en`, `htmlLang: "en"`.
- Paginas publicadas:
  - Home inglesa: `/en`
  - Categoria de matematicas inglesa: `/en/math`
  - Calculadora de porcentajes inglesa: `/en/math/percentage-calculator`
- UI compartida:
  - `BaseLayout`
  - Navbar
  - Footer
  - Breadcrumbs
  - CTAs
  - Textos de busqueda/directorio
  - Consentimiento de anuncios, o supresion segura si no hay politica legal localizada
  - Metadatos SEO
- Fuera de alcance:
  - Traduccion completa del blog.
  - Traduccion completa de todas las calculadoras.
  - Mover espanol a `/es`.
  - Redireccion automatica por IP o por `Accept-Language`.

## Paquetes de trabajo

La implementacion debe dividirse en specs pequenas para reducir riesgo:

1. `specs/i18n/01-core-seo-routing.md`
   - Configuracion de locales.
   - Helpers de rutas, canonical y alternates.
   - Diccionarios compartidos.
   - `BaseLayout` con `locale`, `lang`, canonical y `hreflang`.

2. `specs/i18n/02-localized-directory.md`
   - Categorias con ID estable y metadata por locale.
   - Calculadoras con ID estable, slugs localizados y `published` por locale.
   - Helpers del directorio con compatibilidad para espanol.

3. `specs/i18n/03-localized-shell.md`
   - Navbar, Footer, Breadcrumbs y consentimiento de anuncios.
   - Reglas para no enlazar contenido no traducido desde `/en`.

4. `specs/i18n/04-home-category-pilot.md`
   - Home compartida.
   - Ruta `/en`.
   - Ruta `/en/math`.
   - Busqueda y directorio localizados.

5. `specs/i18n/05-percentage-calculator-pilot.md`
   - Extraccion de la calculadora de porcentajes a componente compartido.
   - Contenido localizado.
   - Script cliente con JSON seguro.
   - Formatters por locale sin cambiar formulas.

6. `specs/i18n/06-sitemap-links-validation.md`
   - Sitemap.
   - Tests de links internos.
   - Validacion de no trailing slash.
   - Validacion de no enlaces ingleses a rutas espanolas salvo alternates o selector de idioma.

7. `specs/i18n/07-blog-future-architecture.md`
   - Preparacion futura del blog sin cambios de rutas en fase 1.
   - Modelo recomendado para contenido editorial localizado.

## Secuencia recomendada

1. Implementar `01-core-seo-routing`.
2. Implementar `02-localized-directory`.
3. Implementar `03-localized-shell`.
4. Implementar `04-home-category-pilot`.
5. Implementar `05-percentage-calculator-pilot`.
6. Implementar `06-sitemap-links-validation`.
7. Mantener `07-blog-future-architecture` como referencia para fases posteriores.

No mezclar la calculadora de porcentajes con la base i18n en el mismo PR si no es necesario. La calculadora tiene mucho script cliente y es el punto con mayor riesgo de regresion visual o funcional.

## Decisiones canonicas

- Espanol conserva las rutas actuales y sigue siendo `x-default`.
- Ingles usa prefijo `/en`.
- Las URLs localizadas se generan desde helpers, no a mano en cada pagina.
- Cada pagina localizada tiene canonical hacia si misma.
- Cada grupo de paginas equivalentes declara alternates solo para idiomas publicados.
- El sitemap incluye solo rutas publicables.
- No se publican rutas inglesas si dependen de contenido, legal pages o UI que sigue solo en espanol.

## Flujo de traduccion

- La IA puede generar borradores de traduccion.
- Un humano revisa antes de publicar:
  - Title y meta description.
  - Slugs.
  - Labels de inputs, botones, errores y resultados.
  - Formulas y ejemplos.
  - Unidades, moneda, separadores y tono.
  - Enlaces internos y legal links.
- Cada traduccion queda en estado `draft` o `published`.
- Las paginas de listado solo muestran contenido `published` para ese locale.

## Riesgos principales

- Duplicar rutas o canonicals entre idiomas.
- Mostrar UI mixta, por ejemplo banners o footer en espanol dentro de `/en`.
- Mostrar enlaces a paginas no traducidas desde `/en`.
- Mezclar idioma con reglas regionales, especialmente en impuestos, salud, finanzas, moneda y unidades.
- Romper helpers existentes que asumen slugs canonicos espanoles.
- Inyectar textos cliente de forma insegura o romper el bundling de scripts Astro.

## Criterios de aceptacion globales

- Las URLs espanolas actuales siguen funcionando sin cambios.
- `/en`, `/en/math` y `/en/math/percentage-calculator` se generan estaticamente.
- `BaseLayout` renderiza `lang`, canonical y `hreflang` correctos por locale.
- La version inglesa no enlaza a blog, contacto, privacidad ni calculadoras sin version inglesa publicada, salvo alternates o selector de idioma.
- La calculadora de porcentajes calcula igual en ambos idiomas.
- Los tests unitarios cubren routing i18n, directorio localizado, shell localizado, links internos, sitemap y formato basico.
- No se ejecuta `npm run dev` ni `npm run build` salvo pedido explicito.
