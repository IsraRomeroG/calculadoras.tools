# 14 - Cluster Math 2: regla de tres

## Objetivo

Implementar el siguiente cluster EN despues de porcentajes usando la calculadora de regla de tres como piloto de expansion. Este cluster debe validar el estandar de migracion antes de avanzar a dominios mas sensibles como finanzas, salud o impuestos.

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
src/pages/en/math/rule-of-three-calculator.astro
```

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
  published: true,
}
```

Antes de publicar, revisar si el title SEO debe ser:

```txt
Rule of three calculator - Direct and inverse proportion
```

La metadata de directorio puede ser mas corta que el title SEO.

## Contenido localizado

Crear `src/lib/i18n/calculators/rule-of-three.ts` con secciones:

- `seo`
- `hero`
- `breadcrumbs`
- `modeLabels`
- `fields`
- `form`
- `client`
- `faq`
- `steps`
- `relatedGuides`

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

El script actual de la pagina ES contiene varias cadenas visibles. Durante la migracion:

- Pasar `content.client` mediante JSON seguro.
- Reemplazar strings hardcodeados por helper de traduccion local.
- Mantener el calculo compartido.
- Incluir `formatLocale` en la configuracion cliente.
- Revisar que copy/verification usen EN.

## Blog opcional del cluster

Publicar posts EN solo si estan listos. Propuesta:

```txt
/en/blog/math/rule-of-three
/en/blog/math/direct-and-inverse-proportion
```

Si no se publican posts:

- `relatedGuides` EN queda vacio o con `published: false`.
- La calculadora EN no debe enlazar posts ES.

Si se publican posts:

- Usar `locale: "en"`.
- Usar `categoryId: "matematicas"`.
- Usar slugs EN.
- Enlazar la calculadora EN.
- Agregar `translationKey` si existe equivalente ES.

## Orden de implementacion

1. Revisar pagina ES y marcar textos hardcodeados.
2. Crear modulo i18n de contenido.
3. Extraer componente compartido.
4. Actualizar wrapper ES con mismo canonical.
5. Crear wrapper EN.
6. Agregar metadata EN de calculadora.
7. Revisar categoria Math ya existente.
8. Localizar script cliente.
9. Revisar links relacionados.
10. Agregar tests.
11. Ejecutar validacion unitaria.

## Riesgos especificos

- Frases generadas dinamicamente con orden gramatical distinto entre ES y EN.
- Boton de verificacion con pasos en espanol.
- Unidades editables mezcladas en frases.
- Formula/substitution con texto y numeros mezclados.
- Textos largos en tabs o botones.

## Tests minimos

- `getPublishedCalculators("en")` incluye rule of three cuando esta publicada.
- `/en/math/rule-of-three-calculator` aparece como href EN.
- Alternates incluyen ES/EN.
- Contenido ES/EN tiene mismas secciones obligatorias.
- `relatedGuides.en` no contiene URLs `/blog/...` ES publicadas como EN.
- No hay textos cliente obligatorios faltantes.
- Calculos existentes de regla de tres siguen pasando.

## Criterios de aceptacion

- La ruta ES no cambia.
- La ruta EN renderiza calculadora completa en ingles.
- La calculadora aparece en `/en` y `/en/math`.
- No hay guias relacionadas EN rotas.
- No hay textos espanoles visibles en UI, errores, resultados o copy.
- Tests unitarios pasan.
