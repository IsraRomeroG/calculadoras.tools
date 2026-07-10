# 09 - Estandar de migracion de calculadoras

## Objetivo

Definir el patron unico para convertir una calculadora espanola existente en calculadora bilingue, reutilizando logica y UI estructural sin duplicar formulas ni crear dos paginas divergentes.

## Alcance

Aplica a cada calculadora bajo:

```txt
src/pages/<categoria>/<slug>.astro
```

El resultado esperado por calculadora es:

- Un componente compartido en `src/components/calculators`.
- Un modulo de contenido localizado en `src/lib/i18n/calculators`.
- Un wrapper ES que conserva la ruta actual.
- Una entrada tipada en el registro de calculadoras localizadas.
- Una ruta EN generada desde el manifest publicado. El patron preferido es `src/pages/en/[category]/[slug].astro` con `getStaticPaths()`; un wrapper estatico solo es aceptable si existe un check bloqueante de paridad y nunca se integra en estado draft.
- Metadata EN en `src/lib/constants/calculators.ts`.
- Tests o checks de contenido, routing y formato.

## Regla principal

La logica de calculo debe vivir en `src/lib/calculators/...` y seguir siendo compartida. Antes de asumir que ya esta separada, auditar todos los modulos importados por la pagina. El dominio no puede devolver frases, errores traducidos ni numeros preformateados; debe devolver numeros, codigos y estructuras de datos. Un presenter localizado transforma ese resultado para UI, pasos, copy y exportacion.

La migracion i18n cambia:

- Textos.
- Rutas.
- Metadata SEO.
- Breadcrumbs.
- Labels y mensajes.
- Formato visual de numeros/fechas/moneda.
- Links relacionados.

No cambiar formulas durante una migracion i18n salvo que el cambio sea un bugfix separado y probado.

Si el modulo actual mezcla formula y presentacion, hacer primero tests de caracterizacion y un refactor mecanico dominio -> presenter. Ese refactor forma parte del prerrequisito i18n, pero no debe alterar los resultados matematicos.

## Estructura recomendada

Para una calculadora `calculadora-de-regla-de-tres`:

```txt
src/components/calculators/RuleOfThreeCalculatorPage.astro
src/lib/i18n/calculators/rule-of-three.ts
src/pages/matematicas/calculadora-de-regla-de-tres.astro
src/pages/en/[category]/[slug].astro
```

El route registry asocia `calculatorId` con su componente compartido. `getStaticPaths()` obtiene categoria, slug, locale y props desde `PublishedRouteManifest`, por lo que una localizacion no publicada no genera HTML ni da 200.

El wrapper ES conserva la ruta canonica actual:

```txt
/matematicas/calculadora-de-regla-de-tres
```

El router EN genera una ruta publica nueva al activar la localizacion:

```txt
/en/math/rule-of-three-calculator
```

Agregar una ruta EN nueva no requiere redirects. Cambiar cualquier URL ya publicada, ES o EN, requiere mapa old -> new y `.htaccess` 301.

## Modelo de contenido localizado

Cada calculadora debe tener un tipo explicito. No usar `Record<string, string>` para secciones cuyos keys son conocidos; eso no detecta keys faltantes, typos ni paridad entre locales.

Secciones recomendadas:

```ts
export interface CalculatorContent<FormKey extends string, ClientKey extends string> {
  seo: {
    title: string;
    description: string;
  };
  hero: {
    title: string;
    description: string;
  };
  form: Record<FormKey, string>;
  client: Record<ClientKey, string>;
  faq: Array<{
    question: string;
    answer: string;
  }>;
  examples?: Array<{
    title: string;
    description: string;
    guideId?: string;
  }>;
  relatedGuideRefs?: readonly BlogPostRef[];
}

type BlogPostRef =
  | { kind: "translationGroup"; id: string }
  | { kind: "localizedPost"; id: string };
```

Las calculadoras complejas pueden ampliar el modelo con secciones propias, pero deben mantener separacion clara entre:

- SEO.
- UI servidor.
- UI cliente.
- FAQs/JSON-LD.
- Links relacionados.

Breadcrumbs comunes, URL de home, categoria y labels globales deben derivarse de `messages`, metadata de categoria y page context. No repetirlos en cada diccionario salvo copy realmente especifico.

Las relaciones usan referencias discriminadas. Un resolver produce el `href`, label y disponibilidad para el locale actual. No guardar `published` junto a `relatedGuideRefs`: ese dato pertenece al post/manifest.

## Props del componente compartido

Cada componente compartido debe recibir un page context resuelto desde identidad y locale:

```ts
interface Props {
  calculatorId: CalculatorId;
  locale: Locale;
  canonical: string;
  alternates: AlternateLink[];
  marketContext: MarketContext;
}
```

`canonical` y `alternates` no se escriben a mano en cada wrapper: salen de las variantes publicadas del mismo `calculatorId`.

Si la calculadora necesita configuracion regional, usar tipos explicitos:

```ts
region?: RegionCode;
currency?: CurrencyCode;
unitSystem?: "metric" | "imperial";
timeZone?: TimeZoneId;
```

No derivar reglas legales, fiscales, medicas o financieras solamente desde `locale`.

## Scripts cliente

Los scripts cliente deben recibir textos localizados de forma segura.

Preferir JSON serializado con un helper seguro para HTML:

```astro
<script
  id="calculator-i18n"
  type="application/json"
  set:html={serializeJsonForHtmlScript({
    locale,
    formatLocale: LOCALE_CONFIG[locale].formatLocale,
    ui: content.client,
  })}
></script>
```

Reglas:

- `serializeJsonForHtmlScript()` debe neutralizar `</script>` escapando al menos `<` y U+2028/U+2029, y tener tests de round-trip.
- No interpolar strings traducidas dentro del script sin escape.
- No dejar mensajes espanoles hardcodeados en funciones cliente.
- No duplicar el script para ES y EN.
- El `localStorage` o historial debe incluir locale en la key cuando el texto guardado dependa del idioma.
- Copiar/exportar resumen debe usar strings del locale activo.
- Aplicar el mismo serializador a JSON-LD insertado con `set:html`.

## Formato numerico y fechas

Cada calculadora debe revisar si usa:

- `Intl.NumberFormat`
- `Intl.DateTimeFormat`
- Moneda hardcodeada.
- Separadores manuales.
- Fechas en strings.
- Unidades de entrada/salida.

Reglas:

- `formatLocale` viene de `LOCALE_CONFIG[locale].formatLocale`.
- `formatLocale` controla presentacion, no interpretacion legal o comercial.
- Moneda, region, unidades y zona horaria vienen de `MarketContext` o seleccion explicita; no asumir USD solo por `locale="en"`.
- Impuestos, tasas, paises y normas no se infieren desde locale.
- Mantener compatibilidad con los defaults actuales de ES.
- Definir y probar politica de parsing de entradas por locale/market, incluidas entradas ambiguas como `1,234`.

## Metadata de directorio

`CALCULATOR_DEFINITIONS` debe convertirse en la fuente canonica. `CALCULATORS` y sus `href` legacy solo pueden mantenerse como vista temporal derivada durante la migracion, no como segunda autoridad.

Una localizacion EN se agrega inicialmente como no publicada. No cambiarla a publicada hasta que:

- El componente compartido renderice EN.
- El componente este registrado y la ruta EN sea emitible desde el manifest.
- Exista metadata localizada de categoria; su pagina se publicara de forma derivada con la primera calculadora.
- El contenido localizado este completo.
- Las relaciones EN resuelvan destinos publicados o se omitan.
- Los tests/checks minimos pasen.

Ejemplo:

```ts
"calculadora-de-regla-de-tres": {
  title: "Rule of three calculator",
  description: "Solve direct and inverse proportions with clear steps.",
  slug: "rule-of-three-calculator",
  published: false,
}
```

El cambio final a `published: true` ocurre despues de todas las revisiones y validaciones, en la misma release atomica que rutas, listados, alternates, sitemap y links.

## Checklist de migracion

1. Leer pagina, scripts y todos los modulos importados; marcar texto, formato y logica mezclada.
2. Agregar tests de caracterizacion de formulas y resultados actuales.
3. Separar dominio estructurado y presenter localizado si hace falta.
4. Marcar FAQs, JSON-LD, aria labels, `sr-only`, estados live, ejemplos y relaciones.
5. Crear modulo tipado `src/lib/i18n/calculators/<name>.ts`.
6. Extraer pagina a componente compartido y conservar wrapper ES/canonical actual.
7. Reemplazar textos hardcodeados por contenido tipado.
8. Pasar strings cliente mediante serializacion segura.
9. Registrar componente y localizacion EN como no publicada.
10. Resolver canonical, alternates y relaciones desde IDs/manifest.
11. Verificar ads mediante capacidad central; no arrastrar `AdSlot` ES a EN automaticamente.
12. Agregar/actualizar tests, revision humana y QA renderizado.
13. Activar publicacion al final y comprobar paridad de rutas/sitemap/listados.

## Tests minimos

Por calculadora:

- ES conserva canonical actual.
- EN genera canonical nuevo.
- Alternates incluyen solo rutas publicadas.
- Alternates son reciprocos y se derivan del mismo `calculatorId`.
- Metadata EN aparece en directorio EN.
- Metadata ES no cambia.
- Contenido ES y EN tienen secciones obligatorias.
- No hay links EN a `/blog/...` ES salvo excepcion explicita.
- Funciones de calculo siguen pasando tests existentes.
- Formato EN usa separadores esperados cuando aplica.
- Parsing de entradas respeta la politica declarada.
- Una localizacion no publicada no emite ruta ni aparece en sitemap.
- El contenido localizado tiene exactamente los keys requeridos, incluidos textos de accesibilidad.
- El serializer no permite cerrar el elemento `<script>`.

## Criterios de aceptacion

- La calculadora funciona igual en ES.
- La calculadora existe en EN sin textos espanoles visibles.
- No hay duplicacion de formulas.
- No hay rutas legacy ni redirects innecesarios.
- La home/categoria EN la listan solo cuando esta completa.
- Despublicar una localizacion elimina su ruta del artefacto y del sitemap; si ya fue publica, se aplica la politica de rollback/redirect de spec 13.
