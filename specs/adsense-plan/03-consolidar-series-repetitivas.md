# Spec 03 - Consolidar series repetitivas

## Objetivo

Conservar únicamente URLs con intención y aportación editorial propias. Las
páginas cuya diferencia principal sea sustituir una cifra deben fusionarse,
redirigirse o retirarse.

## Alcance

Series mencionadas en el plan base:

- Estatura y peso saludable:
  - `src/content/blog/salud/cuanto-debo-pesar-si-mido-150.md`
  - `src/content/blog/salud/cuanto-debo-pesar-si-mido-155.md`
  - `src/content/blog/salud/cuanto-debo-pesar-si-mido-160.md`
  - `src/content/blog/salud/cuanto-debo-pesar-si-mido-165.md`
  - `src/content/blog/salud/cuanto-debo-pesar-si-mido-170.md`
  - `src/content/blog/salud/cuanto-debo-pesar-si-mido-175.md`
  - `src/content/blog/salud/cuanto-debo-pesar-si-mido-180.md`
  - `src/content/blog/salud/cuanto-debo-pesar-si-mido-185.md`
- Hipotecas por monto:
  - `src/content/blog/inmuebles/hipoteca-1000000-cuanto-pago.md`
  - `src/content/blog/inmuebles/hipoteca-1500000-cuanto-pago.md`
  - `src/content/blog/inmuebles/hipoteca-2000000-cuanto-pago.md`
  - `src/content/blog/inmuebles/hipoteca-3000000-cuanto-pago.md`
- Préstamos por monto:
  - `src/content/blog/finanzas/prestamo-50000-cuanto-pago.md`
  - `src/content/blog/finanzas/prestamo-100000-cuanto-pago.md`

Archivos de soporte:

- `public/.htaccess`
- `astro.config.mjs`
- `src/lib/blog.ts`
- `src/lib/blog-links.test.ts`
- `src/lib/internal-links.test.ts`
- Sitemap generado por `@astrojs/sitemap`

## Regla editorial

Una URL numérica independiente solo se conserva si aporta al menos uno:

- Datos, reglas o fuentes diferentes.
- Decisiones distintas para el usuario.
- Comparación propia, no reutilizada.
- Riesgos o límites específicos.
- Herramienta, tabla o ejemplo especializado.
- Intención de búsqueda claramente distinta.

Cambiar solo monto, peso, estatura, tasa, plazo o unidad no es suficiente.

## Destinos recomendados

### Estatura

Destino principal recomendado:

`/blog/salud/tabla-peso-saludable-150-195`

Condición: la guía debe convertirse en una pieza fuerte, no solo una tabla. Debe
incluir:

- Rango por estatura de 1.50 m a 1.95 m.
- Fórmula IMC usada para derivar rangos.
- Ejemplo desarrollado.
- Diferencia entre peso saludable, peso ideal e IMC.
- Límites para embarazo, menores, adultos mayores, atletas y composición
  corporal.
- Enlace a `/salud/calculadora-de-imc`.
- Fuentes oficiales o médicas.

URLs a redirigir:

```apache
RewriteRule ^blog/salud/cuanto-debo-pesar-si-mido-150/?$ /blog/salud/tabla-peso-saludable-150-195 [R=301,L]
RewriteRule ^blog/salud/cuanto-debo-pesar-si-mido-155/?$ /blog/salud/tabla-peso-saludable-150-195 [R=301,L]
RewriteRule ^blog/salud/cuanto-debo-pesar-si-mido-160/?$ /blog/salud/tabla-peso-saludable-150-195 [R=301,L]
RewriteRule ^blog/salud/cuanto-debo-pesar-si-mido-165/?$ /blog/salud/tabla-peso-saludable-150-195 [R=301,L]
RewriteRule ^blog/salud/cuanto-debo-pesar-si-mido-170/?$ /blog/salud/tabla-peso-saludable-150-195 [R=301,L]
RewriteRule ^blog/salud/cuanto-debo-pesar-si-mido-175/?$ /blog/salud/tabla-peso-saludable-150-195 [R=301,L]
RewriteRule ^blog/salud/cuanto-debo-pesar-si-mido-180/?$ /blog/salud/tabla-peso-saludable-150-195 [R=301,L]
RewriteRule ^blog/salud/cuanto-debo-pesar-si-mido-185/?$ /blog/salud/tabla-peso-saludable-150-195 [R=301,L]
```

También mantener o actualizar las reglas legacy de una sola ruta si siguen
existiendo:

```apache
RewriteRule ^blog/(cuanto-debo-pesar-si-mido-150|cuanto-debo-pesar-si-mido-155|cuanto-debo-pesar-si-mido-160|cuanto-debo-pesar-si-mido-165|cuanto-debo-pesar-si-mido-170|cuanto-debo-pesar-si-mido-175|cuanto-debo-pesar-si-mido-180|cuanto-debo-pesar-si-mido-185)/?$ /blog/salud/tabla-peso-saludable-150-195 [R=301,L]
```

### Hipotecas por monto

Destino principal recomendado:

`/blog/inmuebles/comparar-creditos-hipotecarios`

Destino alternativo si se crea una guía nueva:

`/blog/inmuebles/hipoteca-por-monto-comparativa`

La consolidación debe incorporar escenarios de 1,000,000; 1,500,000; 2,000,000
y 3,000,000 como tabla comparativa dentro de una sola pieza.

La pieza destino debe incluir:

- Supuestos explícitos de tasa, plazo, enganche y sistema de amortización.
- Tabla comparativa por monto.
- Ejemplo de cómo cambia la mensualidad al cambiar tasa o plazo.
- Advertencia de que bancos, comisiones, seguros y gastos notariales cambian el
  costo real.
- Enlace a `/inmuebles/calculadora-de-hipoteca`.
- Fuentes financieras o regulatorias cuando se mencionen CAT, tasa o productos.

URLs a redirigir:

```apache
RewriteRule ^blog/inmuebles/hipoteca-1000000-cuanto-pago/?$ /blog/inmuebles/comparar-creditos-hipotecarios [R=301,L]
RewriteRule ^blog/inmuebles/hipoteca-1500000-cuanto-pago/?$ /blog/inmuebles/comparar-creditos-hipotecarios [R=301,L]
RewriteRule ^blog/inmuebles/hipoteca-2000000-cuanto-pago/?$ /blog/inmuebles/comparar-creditos-hipotecarios [R=301,L]
RewriteRule ^blog/inmuebles/hipoteca-3000000-cuanto-pago/?$ /blog/inmuebles/comparar-creditos-hipotecarios [R=301,L]
```

### Préstamos por monto

Destino principal recomendado:

`/blog/finanzas/comparar-dos-prestamos`

Destino alternativo si se crea una guía nueva:

`/blog/finanzas/prestamo-por-monto-comparativa`

La pieza destino debe incluir:

- Tabla con escenarios de 50,000 y 100,000.
- Efecto de tasa, plazo, comisión y seguro.
- Ejemplo de pago mensual e intereses totales.
- Advertencia sobre CAT, comisiones y capacidad de pago.
- Enlace a `/finanzas/calculadora-de-prestamo`.

URLs a redirigir:

```apache
RewriteRule ^blog/finanzas/prestamo-50000-cuanto-pago/?$ /blog/finanzas/comparar-dos-prestamos [R=301,L]
RewriteRule ^blog/finanzas/prestamo-100000-cuanto-pago/?$ /blog/finanzas/comparar-dos-prestamos [R=301,L]
```

## Cambios requeridos

### 1. Auditar intención y datos

Antes de borrar cualquier archivo:

- Revisar Search Console si hay datos disponibles.
- Confirmar si alguna URL tiene enlaces externos.
- Confirmar si alguna pieza responde una intención distinta.
- Documentar decisión por URL: conservar, fusionar, retirar.

Si no hay datos externos, aplicar la regla editorial de esta spec.

### 2. Fortalecer destinos

No redirigir hacia una página débil. Primero mejorar el destino:

- Respuesta corta al inicio.
- Tabla o ejemplo que absorba las variantes.
- Fuentes.
- Límites.
- Enlaces internos útiles.
- `updatedDate` solo si se revisó de verdad.

### 3. Retirar rutas fuente

Después de agregar redirects:

- Eliminar los archivos Markdown fuente que se retiran.
- Eliminar enlaces internos hacia URLs retiradas.
- Confirmar que el sitemap ya no las incluye.
- No dejar páginas vacías con `noindex`.

### 4. Ajustar enlaces internos

Enlaces detectados que requieren cambio:

- `src/content/blog/salud/tabla-peso-saludable-150-195.md` enlaza a todas las
  páginas por estatura.
- `src/content/blog/finanzas/cuanto-puedo-pedir-prestado-segun-ingreso.md`
  enlaza a `prestamo-100000-cuanto-pago`.
- `src/content/blog/finanzas/prestamo-50000-cuanto-pago.md` y
  `prestamo-100000-cuanto-pago.md` se enlazan entre sí.

Buscar de nuevo con:

```txt
cuanto-debo-pesar-si-mido
hipoteca-1000000-cuanto-pago
hipoteca-1500000-cuanto-pago
hipoteca-2000000-cuanto-pago
hipoteca-3000000-cuanto-pago
prestamo-50000-cuanto-pago
prestamo-100000-cuanto-pago
```

### 5. Actualizar redirects legacy

`public/.htaccess` ya contiene reglas que redirigen slugs legacy de una sola
ruta hacia `/blog/{categoria}/{slug}`. Cuando una URL se retire, esas reglas
deben apuntar directamente al destino final para evitar cadenas de redirects.

Ejemplo:

```apache
RewriteRule ^blog/(prestamo-50000-cuanto-pago|prestamo-100000-cuanto-pago)/?$ /blog/finanzas/comparar-dos-prestamos [R=301,L]
```

## Pruebas requeridas

- Prueba de enlaces internos: ningún Markdown apunta a slugs retirados.
- Prueba de sitemap o snapshot: URLs retiradas no aparecen en sitemap.
- Prueba de redirects, si existe harness para `.htaccess`, o checklist manual
  documentado.
- Prueba de conflictos de rutas en `src/lib/blog.ts` sigue pasando.

No ejecutar `npm run build` salvo solicitud explícita. Para esta fase basta con
pruebas unitarias relevantes si se modifican tests.

## Criterios de aceptación

- No quedan series publicadas cuya diferencia principal sea sustituir una cifra.
- Cada URL retirada responde con 301 al destino más relevante.
- No hay cadenas de redirects desde URLs legacy.
- El sitemap solo incluye las URLs consolidadas.
- No existen enlaces internos hacia URLs retiradas.
- Los destinos consolidados tienen suficiente explicación, tabla, fuentes y
  límites.

## Riesgos y mitigaciones

Riesgo: redirigir una URL que sí tenía intención propia.

Mitigación: revisar datos de Search Console y enlaces antes de retirar.

Riesgo: perder contexto específico útil para una altura o monto.

Mitigación: absorberlo en tablas comparativas y ejemplos dentro del destino.

Riesgo: crear redirects duplicados o en orden incorrecto.

Mitigación: colocar reglas específicas antes de reglas amplias y evitar saltos
intermedios.
