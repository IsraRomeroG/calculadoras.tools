# 14 - Release Math 2: regla de tres

## Objetivo

Implementar la siguiente release de calculadora EN despues de porcentajes usando regla de tres como piloto de expansion. La release debe validar el estandar corregido de publicacion y migracion antes de avanzar a dominios mas sensibles. Solo se considera cluster editorial si se declaran y publican posts requeridos.

## Prerrequisitos bloqueantes

Antes de crear/publicar la ruta EN:

- Existe `PublishedRouteManifest` y las rutas emitidas se validan contra el.
- Construccion de paths y disponibilidad publica son APIs distintas.
- La calculadora EN puede permanecer en draft sin responder 200 ni aparecer en sitemap.
- `CALCULATOR_DEFINITIONS` es la fuente canonica o existe un plan explicito para retirar el `href` legacy.
- `ruleOfThree.ts` fue caracterizado con tests y separado en dominio estructurado + presenter localizado.
- Existe serializador seguro para JSON embebido/JSON-LD.
- `AdSlot` usa capacidad central y no puede cargar proveedor EN sin autorizacion.

## Alcance principal

Calculadora:

```txt
ES: /matematicas/calculadora-de-regla-de-tres
EN: /en/math/rule-of-three-calculator
```

Archivos esperados:

```txt
src/components/calculators/RuleOfThreeCalculatorPage.astro
src/lib/i18n/calculators/rule-of-three.ts
src/pages/matematicas/calculadora-de-regla-de-tres.astro
src/pages/en/[category]/[slug].astro
registro calculatorId -> componente compartido
```

La opcion preferida es la ruta dinamica. Si se conserva un wrapper EN estatico, no puede integrarse en draft y debe existir un check de paridad archivo <-> manifest. Cambiar la ubicacion generadora sin cambiar la URL publica no requiere redirect.

Metadata:

```txt
src/lib/constants/calculators.ts
```

Tests:

```txt
src/lib/i18n/calculators/rule-of-three.test.ts
src/lib/calculator-directory.test.ts
src/lib/internal-links.test.ts
```

## Fuera de alcance

- No migrar todas las calculadoras de matematicas en el mismo cambio.
- No mover la ruta ES.
- No cambiar formulas.
- No publicar posts EN si no estan revisados.
- No tocar finanzas/salud/legal.
- No activar anuncios EN ni paginas legales como efecto colateral.

## Ruta y SEO

ES:

```txt
canonical: /matematicas/calculadora-de-regla-de-tres
```

EN:

```txt
canonical: /en/math/rule-of-three-calculator
```

Alternates:

```txt
es-MX -> /matematicas/calculadora-de-regla-de-tres
en -> /en/math/rule-of-three-calculator
x-default -> /matematicas/calculadora-de-regla-de-tres
```

Agregar ruta EN nueva no requiere redirects.

## Metadata EN recomendada

Propuesta inicial:

```ts
{
  title: "Rule of three calculator",
  description: "Solve direct and inverse proportions with clear steps.",
  slug: "rule-of-three-calculator",
  published: false,
}
```

Antes de publicar, revisar si el title SEO debe ser:

```txt
Rule of three calculator - Direct and inverse proportion
```

La metadata de directorio puede ser mas corta que el title SEO. Revisar variante de ingles e intencion editorial antes de congelar el slug; el cambio a `published: true` ocurre solo al final.

## Contenido localizado

Crear `src/lib/i18n/calculators/rule-of-three.ts` con secciones:

- `seo`
- `hero`
- Breadcrumb actual especifico si difiere de hero; home/categoria se derivan del page context.
- `modeLabels`
- `fields`
- `form`
- `client`
- `faq`
- `steps`
- `relatedGuideRefs`

Usar keys tipados para fields/client. `relatedGuideRefs` usa `BlogPostRef` discriminado, no `href` ni otro flag `published`.

Textos cliente a localizar:

- Modo directa/inversa.
- Labels de unidades.
- Placeholders.
- Errores de campos.
- Frase explicativa.
- Resultado principal.
- Nota de resultado.
- Advertencias.
- Formula.
- Sustitucion.
- Pasos.
- Verificacion.
- Copiar resultado.
- Estado de copia.
- Limpiar.
- Intercambiar.

## Script cliente

El script y el modulo de dominio actuales contienen varias cadenas visibles y formato `es-MX`. Durante la migracion:

- Pasar `content.client` mediante JSON seguro.
- Reemplazar strings hardcodeados por helper de traduccion local.
- Hacer que el dominio compartido devuelva numeros, codigos, operandos y ecuaciones estructuradas.
- Construir pasos, errores, verificacion, formula visible y copy en el presenter del locale.
- Incluir `formatLocale` en la configuracion cliente.
- Revisar que copy/verification usen EN.
- Definir politica de parsing y probar entradas ambiguas.
- Incluir aria labels, texto `sr-only`, estados live y fallback de copy en el inventario de strings.

## Anuncios

La pagina ES actual contiene `AdSlot`. Al extraer el componente compartido:

- No renderizar/montar proveedor en EN salvo `canServeAds(context) === true`.
- No depender de un `locale === "es"` repetido en la pagina; el gate vive en la capa de ads.
- Una preferencia de consentimiento guardada en ES no salta el gate EN.
- Localizar label y aria-label del slot si algun dia se habilita EN.

## Blog opcional de la release

Publicar posts EN solo si estan listos. Propuesta:

```txt
/en/blog/math/rule-of-three
/en/blog/math/direct-and-inverse-proportion
```

Si no se publican posts:

- `relatedGuideRefs` EN queda vacio; no duplicar `published: false`.
- La calculadora EN no debe enlazar posts ES.
- La entrega se denomina release de calculadora, no cluster editorial completo.

Si se publican posts:

- Usar `locale: "en"`.
- Usar `categoryId: "matematicas"`.
- Usar slugs EN.
- Enlazar la calculadora EN.
- Agregar `translationGroupId` y `translationKind: "equivalent"` si existe equivalente ES.

## Orden de implementacion

1. Verificar los prerrequisitos de manifest/routing.
2. Auditar pagina, script y modulos importados.
3. Agregar tests de caracterizacion de formulas, parsing y resultados ES.
4. Separar dominio estructurado y presenter localizado sin cambiar formulas.
5. Crear contenido i18n tipado y registrar relaciones por ID.
6. Extraer componente compartido; conservar wrapper ES y canonical actual.
7. Registrar componente y metadata EN con `published: false`.
8. Generar la ruta candidata desde el router dinamico, sin emitirla mientras esta en draft.
9. Localizar UI, script, accesibilidad, JSON-LD, copy y formato.
10. Aplicar gate central de anuncios y revisar links relacionados.
11. Agregar tests unitarios, build/crawl en CI y revision humana.
12. Cambiar a `published: true` como ultimo paso de la release atomica.
13. Confirmar home, categoria, alternates, sitemap y ruta emitida en el mismo artefacto.

## Riesgos especificos

- Frases generadas dinamicamente con orden gramatical distinto entre ES y EN.
- Boton de verificacion con pasos en espanol.
- Unidades editables mezcladas en frases.
- Formula/substitution con texto y numeros mezclados.
- Textos largos en tabs o botones.
- Conservar pasos/verificacion ES dentro del modulo de dominio.
- Interpretar `1,234` de forma distinta a la politica declarada.
- Arrastrar `AdSlot` ES al componente EN.
- Integrar wrapper o metadata publicada antes de terminar QA.

## Tests minimos

- `published: false` no emite `/en/math/rule-of-three-calculator`, no da 200 y no aparece en sitemap/listados.
- `getPublishedCalculators("en")` incluye rule of three solo cuando esta publicada.
- `/en/math/rule-of-three-calculator` aparece como href EN.
- Alternates incluyen ES/EN.
- Alternates son reciprocos y solo aparecen al publicar ambas rutas.
- Contenido ES/EN tiene mismas secciones obligatorias.
- `relatedGuideRefs.en` resuelve solo posts EN publicados.
- No hay textos cliente obligatorios faltantes.
- Calculos existentes de regla de tres siguen pasando.
- Dominio no contiene copy visible ni `Intl.NumberFormat("es-MX")` hardcodeado.
- Parsing/formato EN cubren casos ambiguos declarados.
- Serializacion JSON neutraliza `</script>`.
- `canServeAds(...) === false` impide montar proveedor EN aun con consentimiento previo.
- Build/crawl confirma ruta, canonical, HTML lang, JSON-LD, sitemap y links.

## Criterios de aceptacion

- La ruta ES no cambia.
- La ruta EN renderiza calculadora completa en ingles.
- La calculadora aparece en `/en` y `/en/math`.
- No hay guias relacionadas EN rotas.
- No hay textos espanoles visibles en UI, errores, resultados o copy.
- Tests unitarios pasan.
- CI compila y valida el artefacto contra `PublishedRouteManifest`.
- El flip a publicada fue la ultima operacion y la ruta puede despublicarse realmente segun spec 13.
