# Plan de internacionalizacion

## Resumen

El sitio debe pasar de una arquitectura solo en espanol a una arquitectura multidioma sin romper las URLs actuales. La primera entrega debe crear la base tecnica completa y publicar un piloto en ingles con la home, el directorio por categoria y la calculadora de porcentajes.

La estrategia recomendada es mantener espanol como idioma por defecto en la raiz:

- Espanol actual: `/`, `/matematicas`, `/matematicas/calculadora-de-porcentajes`
- Ingles nuevo: `/en`, `/en/math`, `/en/math/percentage-calculator`

No se deben mover las rutas actuales en espanol durante la fase inicial. Por eso no se requieren redirects 301 en esta fase.

## Objetivos

- Soportar multiples idiomas con `id` estables para categorias, calculadoras, rutas y contenido.
- Mantener SEO correcto por idioma: `lang`, canonical, `hreflang`, `x-default` y sitemap.
- Evitar publicar paginas parcialmente traducidas o con enlaces a contenido no traducido.
- Preparar el blog para i18n sin traducirlo completo en la primera entrega.
- Mantener la logica matematica compartida; solo deben cambiar textos, rutas y formato local.

## Alcance de la fase 1

- Idiomas:
  - `es`: idioma fuente, sin prefijo de URL, `htmlLang: "es-MX"`.
  - `en`: primer idioma nuevo, con prefijo `/en`, `htmlLang: "en"`.
- Paginas:
  - Home en ingles: `/en`
  - Categoria de matematicas en ingles: `/en/math`
  - Calculadora de porcentajes en ingles: `/en/math/percentage-calculator`
- UI compartida:
  - Navbar
  - Footer
  - Breadcrumbs
  - CTAs
  - Textos de busqueda/directorio
  - Metadatos SEO
- Fuera de alcance en fase 1:
  - Traduccion completa del blog.
  - Traduccion completa de todas las calculadoras.
  - Mover espanol a `/es`.
  - Deteccion automatica por IP o redireccion por idioma del navegador.

## Estrategia por fases

### Fase 1: infraestructura y piloto

Crear la capa i18n, adaptar layout/SEO/directorio y publicar el piloto en ingles. La calculadora de porcentajes debe probar el flujo completo: URL localizada, textos traducidos, resultado interactivo, formato numerico, canonical y alternates.

### Fase 2: expandir calculadoras

Traducir calculadoras por lotes de bajo riesgo primero: matematicas, conversores, geometria, cocina y fecha/tiempo. Dejar salud, finanzas, impuestos e inmuebles para despues por requerir mayor revision editorial y localizacion regional.

### Fase 3: blog y clusters SEO

Traducir contenido editorial por clusters completos. No publicar articulos ingleses sueltos si dejan enlaces internos rotos o enlazan a calculadoras sin version inglesa.

### Fase 4: localizacion avanzada

Agregar variantes regionales solo cuando exista necesidad real: `en-US`, `es-ES`, `es-CO`, etc. Para impuestos, monedas, medidas y salud, separar idioma de region para evitar mezclar traduccion con reglas locales.

## Decisiones canonicas

- Espanol conserva las rutas actuales y sigue siendo `x-default`.
- Ingles usa prefijo `/en`.
- Las URLs localizadas deben generarse desde helpers, no escribirse a mano en cada pagina.
- Cada pagina localizada debe tener canonical hacia si misma, no hacia la version en espanol.
- Cada grupo de paginas equivalentes debe declarar alternates para todos los idiomas publicados.
- El sitemap debe incluir solo rutas publicables para cada idioma.
- No se deben conservar paginas Astro duplicadas como redirects. Si una fase futura mueve URLs existentes, se deben crear reglas Apache `.htaccess` con 301.

## Flujo de traduccion

- La IA puede generar borradores de traduccion.
- Un humano debe revisar antes de publicar:
  - Title y meta description.
  - Slugs.
  - Labels de inputs, botones, errores y resultados.
  - Formulas y ejemplos.
  - Unidades, moneda, separadores y tono.
- Cada traduccion debe poder quedar en estado `draft` o `published`.
- Las paginas de listado solo muestran contenido `published` para ese locale.

## Riesgos principales

- Duplicar rutas o canonicals entre idiomas.
- Mostrar enlaces a paginas no traducidas desde `/en`.
- Traducir textos de calculadoras sin adaptar formato local.
- Mezclar idioma con reglas regionales, especialmente en impuestos, salud y finanzas.
- Mantener textos hardcodeados en scripts cliente que no pasen por diccionarios.

## Criterios de aceptacion

- Las rutas actuales en espanol siguen funcionando sin cambios.
- `/en`, `/en/math` y `/en/math/percentage-calculator` se generan estaticamente.
- `BaseLayout` renderiza `lang`, canonical y `hreflang` correctos por locale.
- La version inglesa no enlaza a articulos o calculadoras sin traduccion publicada.
- La calculadora de porcentajes calcula igual en ambos idiomas.
- Los tests unitarios cubren helpers i18n, directorio localizado, rutas y formato basico.

