# Spec 07 - Privacidad, consentimiento y preparación publicitaria

## Objetivo

Preparar el sitio para AdSense sin tratar la configuración publicitaria como
solución al rechazo de contenido de poco valor. La prioridad sigue siendo
calidad editorial; esta spec evita problemas de privacidad y cumplimiento
cuando los anuncios se activen.

## Alcance

Archivos:

- `src/pages/privacidad.astro`
- `src/components/ads/AdConsentBanner.astro`
- `src/components/ads/AdSlot.astro`
- `src/lib/ads/config.ts`
- `src/lib/ads/client.ts`
- `src/lib/ads/provider.ts`
- `public/ads.txt` cuando exista identificador de editor aprobado.

## Estado actual observado

- Existe página `/privacidad`.
- Existe banner de consentimiento publicitario.
- `AD_CONSENT_MODE` está en `"all"`.
- La detección regional usa `https://get.geojs.io/v1/ip/geo.json`.
- `AdSlot.astro` no renderiza en producción si no hay proveedor configurado.
- No debe asumirse que ya existe `ads.txt` ni identificador de editor aprobado.

## Cambios requeridos

### 1. Actualizar privacidad

La página de privacidad debe identificar explícitamente a Google cuando se
active AdSense.

Contenido mínimo:

- Qué datos pueden tratar los proveedores publicitarios.
- Uso de cookies o tecnologías similares.
- Personalización y medición de anuncios.
- Posibilidad de anuncios no personalizados según consentimiento o región.
- Enlace a información oficial de Google sobre uso de datos.
- Cómo cambiar preferencias de publicidad en el sitio.
- Qué ocurre si el usuario rechaza consentimiento.

No afirmar que AdSense está activo si todavía no lo está. Usar redacción
condicional:

> Cuando activemos Google AdSense...

o redacción de estado real si ya está activo.

### 2. Enlaces oficiales

Incluir enlaces a documentación pública de Google, por ejemplo:

- `https://policies.google.com/technologies/partner-sites`
- `https://policies.google.com/privacy`
- `https://support.google.com/adsense/answer/1348695`

Verificar enlaces antes de publicar si se requiere precisión legal actualizada.

### 3. Consentimiento por región

Revisar estrategia:

| Modo | Uso |
| --- | --- |
| `all` | Banner para todos los usuarios |
| `europe` | Banner para regiones donde se requiera consentimiento reforzado |
| `off` | Sin banner; solo si hay base legal y configuración clara |

Para una nueva solicitud de AdSense, la opción conservadora es mantener banner
global hasta confirmar requisitos por audiencia y región.

### 4. Rechazo de consentimiento

Confirmar que rechazar consentimiento:

- No bloquea calculadoras.
- No oculta contenido.
- No rompe navegación.
- No deja contenedores publicitarios vacíos.
- No hace llamadas publicitarias no consentidas si la estrategia requiere
  consentimiento previo.

### 5. `ads.txt`

No crear `ads.txt` con datos ficticios.

Agregar `public/ads.txt` solo cuando exista identificador real de editor
aprobado por AdSense.

Formato esperado:

```txt
google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0
```

El identificador `pub-XXXXXXXXXXXXXXXX` debe reemplazarse por el real. No usar
placeholders en producción.

### 6. Proveedor publicitario

Revisar `src/lib/ads/provider.ts`:

- Variables necesarias.
- Detección de proveedor configurado.
- Carga de scripts.
- Comportamiento sin proveedor.

El sitio debe funcionar correctamente con anuncios desactivados o no
configurados.

## Criterios de aceptación

- `/privacidad` menciona Google AdSense o su activación condicional con claridad.
- La página explica cookies, personalización, medición y proveedores.
- Incluye enlaces oficiales de Google.
- El usuario puede rechazar consentimiento sin perder acceso a calculadoras.
- No se crea `ads.txt` hasta tener publisher ID real.
- Si existe `ads.txt`, no contiene placeholders.
- Los anuncios no dejan espacios vacíos cuando no hay proveedor o consentimiento.

## Pruebas requeridas

- Prueba manual de aceptar y rechazar consentimiento.
- Revisión de localStorage relacionado con:
  - `AD_CONSENT_STORAGE_KEY`
  - `AD_REGION_STORAGE_KEY`
- Revisión de que las calculadoras funcionan con consentimiento rechazado.
- Si se agrega `ads.txt`, validar que se sirve desde `/ads.txt`.
- Si se modifican helpers de ads, añadir pruebas unitarias para configuración.

## Fuera de alcance

Esta spec no decide cuántos anuncios se muestran ni dónde. Eso pertenece a la
spec 01.

Esta spec no corrige el rechazo por contenido de poco valor. Solo prepara el
cumplimiento publicitario para cuando el inventario editorial esté listo.

## Riesgos y mitigaciones

Riesgo: publicar `ads.txt` falso o incompleto.

Mitigación: no crear el archivo hasta tener ID real.

Riesgo: prometer comportamiento legal que no se cumple técnicamente.

Mitigación: probar aceptación, rechazo y ausencia de proveedor.

Riesgo: mezclar privacidad con marketing.

Mitigación: mantener texto claro, factual y verificable.
