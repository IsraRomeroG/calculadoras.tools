# 02 - Rutas, SEO y migración de México en inglés

## Objetivo

Evitar que una URL publicada cambie silenciosamente de legislación. Las páginas
actuales de ISR, salario, vacaciones y terminación son de México; deben seguir
representando México después de la adaptación y trasladarse a rutas explícitas.

## Mapa obligatorio old -> new

| URL publicada actual | Nuevo canonical | Motivo |
| --- | --- | --- |
| `/en/legal-tax/vat-calculator` | `/en/legal-tax/indirect-tax-calculator` | El producto pasa a distinguir VAT, GST/HST y sales tax. |
| `/en/legal-tax/income-tax-calculator` | `/en/legal-tax/mexico-income-tax-calculator` | La página publicada calcula ISR México. |
| `/en/legal-tax/net-salary-calculator` | `/en/legal-tax/mexico-net-salary-calculator` | La página publicada calcula nómina mexicana. |
| `/en/legal-tax/proportional-vacation-calculator` | `/en/legal-tax/mexico-proportional-vacation-calculator` | La página publicada usa LFT México. |
| `/en/legal-tax/termination-pay-calculator` | `/en/legal-tax/mexico-termination-pay-calculator` | La página publicada usa LFT México. |

No repurposar las cuatro URLs genéricas como UK/US/global: eso cambiaría el
significado de resultados guardados, enlaces y tráfico existente.

## Redirects Apache requeridos

En la release que mueve los archivos, agregar antes del rewrite a
`index.html` en `public/.htaccess`:

```apache
RewriteRule ^en/legal-tax/vat-calculator/?$ /en/legal-tax/indirect-tax-calculator [R=301,L,NE]
RewriteRule ^en/legal-tax/income-tax-calculator/?$ /en/legal-tax/mexico-income-tax-calculator [R=301,L,NE]
RewriteRule ^en/legal-tax/net-salary-calculator/?$ /en/legal-tax/mexico-net-salary-calculator [R=301,L,NE]
RewriteRule ^en/legal-tax/proportional-vacation-calculator/?$ /en/legal-tax/mexico-proportional-vacation-calculator [R=301,L,NE]
RewriteRule ^en/legal-tax/termination-pay-calculator/?$ /en/legal-tax/mexico-termination-pay-calculator [R=301,L,NE]
```

La implementación debe validar la sintaxis contra el `.htaccess` real. No
agregar reglas equivalentes en `public/en/.htaccess` ni crear cadenas.

## Archivos legacy

Después de mover la implementación:

- no debe quedar ningún `.astro` en las cinco rutas anteriores;
- no usar meta refresh, JavaScript, `Astro.redirect()` ni wrappers vacíos;
- buscar los slugs antiguos en `src`, `specs`, tests y contenido;
- actualizar links, breadcrumbs, canonicals, metadata, sitemap, manifest,
  JSON-LD y alternates en la misma release.

## Inventario de rutas nuevas

### Impuesto indirecto

```txt
/en/legal-tax/indirect-tax-calculator
/en/legal-tax/us-sales-tax-calculator
/en/legal-tax/uk-vat-calculator
/en/legal-tax/canada-gst-hst-calculator
/en/legal-tax/australia-gst-calculator
/en/legal-tax/new-zealand-gst-calculator
/en/legal-tax/ireland-vat-calculator
```

La primera es un hub/calculadora con selección obligatoria; las demás son
landings indexables solo cuando el preset correspondiente esté publicado.

### Income tax

```txt
/en/legal-tax/income-tax-calculators
/en/legal-tax/mexico-income-tax-calculator
/en/legal-tax/us-federal-income-tax-calculator
/en/legal-tax/uk-income-tax-calculator
/en/legal-tax/canada-income-tax-calculator
/en/legal-tax/australia-income-tax-calculator
/en/legal-tax/new-zealand-income-tax-calculator
/en/legal-tax/ireland-income-tax-calculator
```

`us-federal` es obligatorio en el slug mientras el cálculo no incluya todos los
impuestos estatales/locales.

### Take-home pay

```txt
/en/legal-tax/take-home-pay-calculators
/en/legal-tax/mexico-net-salary-calculator
/en/legal-tax/us-paycheck-calculator
/en/legal-tax/uk-take-home-pay-calculator
/en/legal-tax/canada-paycheck-calculator
/en/legal-tax/australia-take-home-pay-calculator
/en/legal-tax/new-zealand-pay-calculator
/en/legal-tax/ireland-take-home-pay-calculator
```

### Vacaciones y terminación

```txt
/en/legal-tax/mexico-proportional-vacation-calculator
/en/legal-tax/mexico-termination-pay-calculator
/en/legal-tax/us-pto-accrual-calculator
/en/legal-tax/uk-holiday-entitlement-calculator
/en/legal-tax/uk-redundancy-pay-calculator
/en/legal-tax/canada-vacation-pay-calculator
/en/legal-tax/canada-termination-pay-calculator
/en/legal-tax/australia-annual-leave-calculator
/en/legal-tax/australia-redundancy-pay-calculator
/en/legal-tax/new-zealand-holiday-pay-calculator
/en/legal-tax/new-zealand-final-pay-calculator
/en/legal-tax/ireland-annual-leave-calculator
/en/legal-tax/ireland-redundancy-pay-calculator
```

No publicar una ruta US `vacation entitlement` o `severance` nacional: la ley
federal no crea esos mínimos generales.

## Canonical y hreflang

### México bilingüe

Las páginas `es-MX` y `en-MX` sí son alternates:

```txt
es-MX -> /legal-impuestos/calculadora-isr-irpf
en-MX -> /en/legal-tax/mexico-income-tax-calculator
```

Lo mismo aplica a net salary, vacaciones, termination e indirect tax cuando el
contenido represente la misma cobertura.

### Variantes de otros mercados

- No enlazar `en-US` o `en-GB` como traducción directa de una calculadora
  mexicana.
- Agrupar variantes regionales por `familyId` solo si resuelven la misma
  intención de búsqueda.
- Para un grupo completo, usar alternates regionales (`en-US`, `en-GB`,
  `en-CA`, etc.) y `x-default` al hub selector.
- Si el hub o una variante aún no está publicada, omitirla; no inventar hrefs.
- Cada alternate debe ser recíproco y resolver 200 canonical.

Esto es una excepción deliberada a usar ES como `x-default`: en productos
legales multijurisdiccionales el default correcto es la selección de mercado.

## Metadata y directorio

- Los títulos de México incluyen `Mexico`.
- Las tarjetas de país incluyen periodo y cobertura cuando sea útil.
- `Income tax calculator` no puede apuntar por defecto a México; apunta al hub o
  se convierte en `Mexico income tax calculator`.
- La categoría EN agrupa primero por tarea y después por país, evitando una
  lista plana de decenas de variantes.
- Una variante `draft` no aparece en categoría, buscador, sitemap, related
  links ni alternates.
- El JSON-LD incluye `inLanguage`, país/jurisdicción y fecha de modificación;
  no declara cobertura global.

## Actualizaciones obligatorias durante la migración

Como mínimo revisar:

```txt
src/lib/constants/calculators.ts
src/lib/calculator-directory.ts
src/lib/calculator-directory.test.ts
src/lib/internal-links.test.ts
src/lib/calculators/legal-impuestos/english-localization.test.ts
src/lib/i18n/routing.ts
src/pages/legal-impuestos/*.astro
src/pages/en/legal-tax/*.astro
src/components/calculators/*.astro
src/content/blog/en/legal-tax/**
specs/i18n/status-matrix.md
public/.htaccess
```

La lista no sustituye una búsqueda global de los cinco slugs anteriores.

## Tests de rutas y redirects

- Cada source antigua tiene exactamente un 301.
- Ningún target de esas reglas es source de otra regla.
- No existe cadena ni loop.
- Las rutas antiguas no pertenecen al manifest ni al sitemap.
- Las rutas nuevas responden 200 solo si están publicadas.
- Canonical nunca apunta a la URL antigua.
- Todos los links editoriales se actualizan al destino final, no dependen del
  redirect.
- Alternates México son recíprocos después del move.
- Variantes anglófonas no apuntan a México como alternate por conveniencia.

## Criterios de aceptación

- Las cinco URLs actuales conservan intención mediante 301 a un equivalente.
- No se deja ningún route file legacy.
- México en inglés sigue disponible y claramente rotulado.
- Las nuevas landings no se publican antes de tener reglas verificadas.
- Un usuario o buscador no puede confundir idioma con jurisdicción.
