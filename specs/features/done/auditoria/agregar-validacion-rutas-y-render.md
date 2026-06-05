# Spec: agregar validacion automatizada de rutas y render

## Contexto

La auditoria ejecuto las pruebas unitarias actuales:

```powershell
npm.cmd run test:unit:run
```

El resultado fue verde: 31 archivos de prueba y 395 tests.

La cobertura actual valida principalmente logica pura dentro de `src/lib`. Sin
embargo, los hallazgos principales fueron de rutas, enlaces y UI:

- Enlaces internos legacy del blog.
- Enlace hacia una calculadora no implementada.
- Redirects legacy no visibles.
- Navbar sin estado activo real.

## Problema

Las pruebas actuales pueden pasar aunque existan enlaces rotos o rutas no
implementadas.

Esto deja huecos en:

- Validacion de contenido Markdown renderizado.
- Validacion de links internos.
- Smoke testing de paginas Astro.
- Interacciones basicas de calculadoras.
- Accesibilidad basica de navegacion.

## Objetivo

Agregar validacion automatizada minima que detecte rutas rotas, enlaces internos
invalidos y fallos basicos de render.

## Alcance recomendado

### Link checker interno

Crear un test o script que:

- Recoja rutas publicas generadas desde `src/pages`.
- Recoja rutas de articulos publicados desde `src/content/blog`.
- Recoja `href` internos desde Markdown y componentes relevantes.
- Falle si un enlace interno apunta a una ruta no existente.

Debe detectar especificamente:

- `/blog/<articleSlug>` cuando falta redirect o no existe ruta canonica.
- `/vehiculos/calculadora-de-costo-por-kilometro` si la pagina no existe.

### Smoke tests de render

Agregar pruebas E2E o smoke tests con Playwright para paginas clave:

- `/`
- `/blog`
- Una categoria de calculadoras, por ejemplo `/finanzas`
- Una categoria de blog, por ejemplo `/blog/salud`
- Un articulo de blog.
- Una calculadora representativa por tipo de interaccion.

### Validacion de accesibilidad minima

Comprobar al menos:

- Navbar expone `aria-current` en ruta activa.
- Boton mobile mantiene `aria-expanded`.
- Breadcrumb actual usa `aria-current="page"`.

## Fuera de alcance

- Crear una suite E2E exhaustiva para todas las calculadoras.
- Agregar pruebas visuales pixel-perfect.
- Cambiar formulas de calculadoras.

## Cambios tecnicos esperados

1. Agregar herramienta o script de validacion.

   Opciones:

   - Test Vitest con lectura de archivos y rutas esperadas.
   - Playwright con crawling local del build.
   - Link checker posterior al build.

2. Agregar scripts npm si aplica:

   ```json
   {
     "test:links": "...",
     "test:e2e": "..."
   }
   ```

3. Documentar la validacion en README.

4. Asegurar que la validacion se pueda ejecutar en CI.

## Criterios de aceptacion

- Existe una validacion automatizada que falla con enlaces internos rotos.
- La validacion detecta rutas internas que no existen en `src/pages` ni en
  contenido publicado.
- Existe al menos un smoke test de render para paginas principales.
- Los scripts nuevos estan documentados.
- `npm.cmd run test:unit:run` pasa sin errores.
- Si se agrega Playwright, `npm.cmd run test:e2e` pasa sin errores.
- Si se agrega link checker, `npm.cmd run test:links` pasa sin errores.

## Casos que deben fallar durante la prueba

Antes de corregir los hallazgos, la nueva validacion deberia detectar:

- Enlaces Markdown a `/blog/<articleSlug>`.
- Enlaces a `/vehiculos/calculadora-de-costo-por-kilometro` si la pagina sigue
  sin existir.

Esto confirma que la validacion cubre el tipo de regresion observado.

