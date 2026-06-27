# 03 - Shell localizado

## Objetivo

Localizar la UI global para evitar paginas `/en` con textos, CTAs o enlaces en espanol. El shell incluye navegacion, footer, breadcrumbs y consentimiento de anuncios.

## Alcance

- `src/lib/constants/menu.ts`
- `src/components/template/Navbar.astro`
- `src/components/template/Footer.astro`
- `src/components/shared/Breadcrumb.astro`
- `src/components/ads/AdConsentBanner.astro`
- Mensajes relacionados en `src/lib/i18n/messages.ts`

No incluye home, categoria ni calculadora.

## Navegacion

Actualizar `src/lib/constants/menu.ts` para separar identidad, labels y paths.

Modelo:

```ts
export interface MenuItemDefinition {
  id: "home" | "blog" | "contact";
  order: number;
  labels: Record<Locale, string>;
  descriptions: Partial<Record<Locale, string>>;
  paths: Partial<Record<Locale, string>>;
}
```

Datos fase 1:

- `home`: `es -> /`, `en -> /en`
- `blog`: `es -> /blog`, sin `en`
- `contact`: `es -> /contacto`, sin `en`

Reglas:

- `Navbar.astro` recibe `locale`.
- Mostrar solo items con `paths[locale]`.
- El logo apunta a la home del locale actual.
- El estado activo debe respetar prefijos; `/en/math` no debe activar `/`.
- Labels, `aria-label` y textos del menu movil deben venir de diccionarios.

## Footer

`Footer.astro` recibe `locale`.

Reglas:

- El logo apunta a la home del locale actual.
- El tagline y derechos se localizan.
- Mostrar solo links legales o informativos que tengan path publicado para ese locale.
- No enlazar `/en` hacia `/privacidad`, `/contacto`, `/acerca-de`, `/metodologia`, `/politica-editorial` o `/correcciones` si no existe version inglesa.
- El boton de preferencias de publicidad puede mostrarse solo si `AdConsentBanner` existe para ese locale.

Paths fase 1:

- `es`: conservar links actuales.
- `en`: mostrar solo links con version inglesa publicada. Si no hay paginas legales inglesas, no mostrar esos links en footer ingles.

## Breadcrumbs

`Breadcrumb.astro` puede seguir recibiendo items explicitos, pero:

- El `ariaLabel` default debe estar localizado o recibirse desde el caller.
- El label de home debe venir de `t(locale, "breadcrumbs.home")`.
- Las paginas inglesas no deben pasar breadcrumbs hardcodeados en espanol.

## Consentimiento de anuncios

`AdConsentBanner.astro` es obligatorio de revisar porque actualmente se monta globalmente desde `BaseLayout`.

Opciones permitidas:

1. Localizar completamente el banner para `en`, incluyendo texto, botones y link a politica legal inglesa publicada.
2. Si no existe politica legal inglesa, no renderizar `AdConsentBanner` ni cargar terceros de anuncios en paginas `en` hasta que exista esa politica.

Reglas:

- No mostrar banner en espanol dentro de `/en`.
- No enlazar desde banner ingles a `/privacidad` salvo que se acepte explicitamente como pagina cross-locale; por defecto no se permite.
- Labels de botones, `aria-labelledby`, texto legal y link de privacidad deben venir de diccionarios o metadata localizada.
- El boton del footer `data-ad-consent-open` solo aparece si el banner esta habilitado para ese locale.

## Selector de idioma

Fase 1 puede omitir un selector visible de idioma. Si se agrega:

- Solo debe apuntar a alternates publicados.
- No debe construir URLs a mano.
- No debe enlazar a versiones en draft.

## Tests

Agregar o actualizar tests para:

- `MENU` no muestra `blog` ni `contact` en `en`.
- Footer ingles no contiene links a rutas espanolas sin traduccion.
- Mensajes de shell tienen keys completas en `es` y `en`.
- Si `AdConsentBanner` esta habilitado en `en`, existe path de privacidad ingles publicado.

## Criterios de aceptacion

- Ninguna pagina `/en` renderiza shell en espanol.
- Navbar y footer ingleses no enlazan a contenido no traducido.
- El banner de consentimiento queda localizado o deshabilitado de forma explicita para `en`.
- Las rutas espanolas del shell no cambian.
