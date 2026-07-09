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
- Un wrapper EN bajo `src/pages/en`.
- Metadata EN en `src/lib/constants/calculators.ts`.
- Tests o checks de contenido, routing y formato.

## Regla principal

La logica de calculo vive en `src/lib/calculators/...` y debe seguir siendo compartida. La migracion i18n solo debe cambiar:

- Textos.
- Rutas.
- Metadata SEO.
- Breadcrumbs.
- Labels y mensajes.
- Formato visual de numeros/fechas/moneda.
- Links relacionados.

No cambiar formulas durante una migracion i18n salvo que el cambio sea un bugfix separado y probado.

## Estructura recomendada

Para una calculadora `calculadora-de-regla-de-tres`:

```txt
src/components/calculators/RuleOfThreeCalculatorPage.astro
src/lib/i18n/calculators/rule-of-three.ts
src/pages/matematicas/calculadora-de-regla-de-tres.astro
src/pages/en/math/rule-of-three-calculator.astro
```

El wrapper ES conserva la ruta canonica actual:

```txt
/matematicas/calculadora-de-regla-de-tres
```

El wrapper EN crea una ruta nueva:

```txt
/en/math/rule-of-three-calculator
```

Agregar una ruta EN nueva no requiere redirects. Cambiar una ruta ES existente si requeriria mapa old -> new y `.htaccess` 301.

## Modelo de contenido localizado

Cada calculadora debe tener un tipo explicito, no un `Record<string, string>` gigante sin estructura.

Secciones recomendadas:

```ts
export interface CalculatorContent {
  seo: {
    title: string;
    description: string;
  };
  hero: {
    title: string;
    description: string;
  };
  breadcrumbs: {
    home: string;
    category: string;
    current: string;
  };
  form: Record<string, string>;
  client: Record<string, string>;
  faq: Array<{
    question: string;
    answer: string;
  }>;
  examples?: Array<{
    title: string;
    description: string;
    href?: string;
  }>;
  relatedGuides?: Array<{
    title: string;
    description: string;
    href: string;
    published: boolean;
  }>;
}
```

Las calculadoras complejas pueden ampliar el modelo con secciones propias, pero deben mantener separacion clara entre:

- SEO.
- UI servidor.
- UI cliente.
- FAQs/JSON-LD.
- Links relacionados.

## Props del componente compartido

Cada componente compartido debe recibir:

```ts
interface Props {
  locale: Locale;
  canonical: string;
  alternates: AlternateLink[];
}
```

Si la calculadora necesita configuracion regional, agregar props explicitas:

```ts
region?: string;
currency?: string;
unitSystem?: "metric" | "imperial";
```

No derivar reglas legales, fiscales, medicas o financieras solamente desde `locale`.

## Scripts cliente

Los scripts cliente deben recibir textos localizados de forma segura.

Preferir JSON:

```astro
<script
  id="calculator-i18n"
  type="application/json"
  set:html={JSON.stringify({
    locale,
    formatLocale: LOCALE_CONFIG[locale].formatLocale,
    ui: content.client,
  })}
></script>
```

Reglas:

- No interpolar strings traducidas dentro del script sin escape.
- No dejar mensajes espanoles hardcodeados en funciones cliente.
- No duplicar el script para ES y EN.
- El `localStorage` o historial debe incluir locale en la key cuando el texto guardado dependa del idioma.
- Copiar/exportar resumen debe usar strings del locale activo.

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
- Moneda por defecto puede venir de `LOCALE_CONFIG[locale].defaultCurrency`, pero solo como valor visual inicial.
- Impuestos, tasas, paises y normas no se infieren desde locale.
- Mantener compatibilidad con los defaults actuales de ES.

## Metadata de directorio

No publicar una calculadora EN en `CALCULATOR_DEFINITIONS` hasta que:

- El componente compartido renderice EN.
- Exista wrapper EN.
- La categoria EN exista.
- El contenido localizado este completo.
- Los links relacionados EN esten publicados o desactivados.
- Los tests/checks minimos pasen.

Ejemplo:

```ts
"calculadora-de-regla-de-tres": {
  title: "Rule of three calculator",
  description: "Solve direct and inverse proportions with clear steps.",
  slug: "rule-of-three-calculator",
  published: true,
}
```

## Checklist de migracion

1. Leer la pagina `.astro` actual y marcar textos visibles.
2. Marcar textos de script cliente.
3. Marcar FAQs, JSON-LD, ejemplos y links relacionados.
4. Crear modulo `src/lib/i18n/calculators/<name>.ts`.
5. Extraer pagina a componente compartido.
6. Reemplazar textos hardcodeados por `content`.
7. Pasar strings cliente por JSON o `data-*`.
8. Crear wrapper ES conservando canonical actual.
9. Crear wrapper EN con canonical nuevo.
10. Agregar alternates ES/EN.
11. Agregar metadata EN de categoria/calculadora.
12. Revisar links EN.
13. Agregar/actualizar tests.
14. Ejecutar validacion unitaria.

## Tests minimos

Por calculadora:

- ES conserva canonical actual.
- EN genera canonical nuevo.
- Alternates incluyen solo rutas publicadas.
- Metadata EN aparece en directorio EN.
- Metadata ES no cambia.
- Contenido ES y EN tienen secciones obligatorias.
- No hay links EN a `/blog/...` ES salvo excepcion explicita.
- Funciones de calculo siguen pasando tests existentes.
- Formato EN usa separadores esperados cuando aplica.

## Criterios de aceptacion

- La calculadora funciona igual en ES.
- La calculadora existe en EN sin textos espanoles visibles.
- No hay duplicacion de formulas.
- No hay rutas legacy ni redirects innecesarios.
- La home/categoria EN la listan solo cuando esta completa.
