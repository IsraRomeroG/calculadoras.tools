# 04 - Enlazado interno y SEO técnico

## Enlaces relacionados en la página

Añadir una sección visible “Calculadoras relacionadas” después del contenido
principal y antes de la FAQ, con enlaces a rutas publicadas:

| Contexto | Enlace | Anchor recomendado |
| --- | --- | --- |
| Cuenta regresiva | `/fecha-tiempo/calculadora-fecha-limite-countdown` | Calcular una fecha límite y cuenta regresiva |
| Edad | `/fecha-tiempo/calculadora-de-edad` | Calcular edad exacta en años, meses y días |
| Trabajo | `/fecha-tiempo/calculadora-de-horas-trabajadas` | Calcular horas trabajadas y pago estimado |

Solo mostrar enlaces que existan en el registro de calculadoras publicado o en
el conjunto de rutas HTML emitidas por el proyecto. Actualmente no se debe
asumir la existencia de un `PublishedRouteManifest` en `src`; si se crea uno
como parte de otra iniciativa, podrá sustituir esta validación. Los enlaces
deben ser HTML normal, sin depender de JavaScript. En el estado actual, la
fuente de verdad práctica es `getPublishedCalculators()` y la comprobación de
la ruta emitida; no mantener una lista de URLs antiguas paralela.

## Enlaces entrantes

Revisar y, donde sea natural, añadir enlaces contextuales desde:

- la calculadora de edad;
- la calculadora de fecha límite;
- la página de categoría `fecha-tiempo`;
- la calculadora de horas trabajadas.

La categoría española `/fecha-tiempo` se genera mediante la ruta dinámica de
categorías y debe comprobarse con el registro de calculadoras antes de enlazar.
No asumir que existe un archivo `src/pages/fecha-tiempo/index.astro`.

El enlace debe explicar el caso de uso, por ejemplo “calcular días entre dos
fechas”, y no repetir el mismo anchor de forma mecánica en todo el sitio.

No enlazar desde páginas no publicadas ni crear enlaces a aliases antiguos.

## Canonical y alternates

Verificar en el HTML generado:

- canonical absoluto a `https://calculadoras.tools/fecha-tiempo/diferencia-entre-fechas`;
- `hreflang="es-MX"` apuntando a la URL ES;
- `hreflang="en"` apuntando a la URL EN;
- reciprocidad desde la página EN;
- ausencia de query string o hash en canonical;
- ausencia de trailing slash no canónico.

## Datos estructurados

FAQPage es opcional y no constituye un requisito SEO de publicación. Google
retiró los resultados enriquecidos FAQ desde el 7 de mayo de 2026, según su
[registro oficial de actualizaciones](https://developers.google.com/search/updates#may-2026)
(verificado el 11 de septiembre de 2026). Mantener la FAQ visible por su
utilidad para el usuario.

Si se conserva FAQPage, comprobar sintaxis JSON-LD, estructura de Schema.org
y correspondencia exacta con las preguntas y respuestas visibles. No exigir
su detección en Rich Results Test ni atribuirle una mejora de posicionamiento.

Evaluar añadir `BreadcrumbList` porque la página ya muestra breadcrumbs. Es una
mejora técnica opcional y no debe bloquear el release de contenido. Si se
implementa, debe usar exactamente las rutas visibles y la jerarquía real:

1. Inicio.
2. Fecha y tiempo.
3. Diferencia entre fechas.

Si se añade BreadcrumbList, validar ese tipo compatible con Rich Results
Test. La ausencia de resultados enriquecidos FAQ no es un error de QA.

No añadir schema de aplicación, review, rating o autoría ficticia para forzar
apariencias en Search.

## HTML rastreable

El contenido esencial debe existir como HTML estático:

- H1 y hero;
- introducción;
- explicación de días, semanas, meses y años;
- fórmula y ejemplos;
- limitaciones de días hábiles;
- FAQ visible;
- enlaces relacionados.

La calculadora puede seguir usando JavaScript para interactuar, pero ningún
texto esencial para entender la página debe aparecer únicamente después de una
acción del usuario.

## Metadata social y rendimiento

Open Graph y Twitter Cards son una mejora secundaria de compartición, no un
requisito para resolver el problema principal de Search. Solo implementarlos
si existe una convención global del sitio.

Comprobar además:

- `lang` correcto para ES;
- title y description únicos;
- no `noindex` accidental;
- inclusión en sitemap;
- ausencia de links rotos;
- Core Web Vitals y layout shift causado por anuncios o contenido dinámico.
