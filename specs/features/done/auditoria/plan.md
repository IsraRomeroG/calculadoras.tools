# Plan de accion: auditoria general

## Contexto

Este plan consolida los hallazgos de la auditoria general del proyecto y los
convierte en una lista de tareas accionables.

La auditoria no modifico codigo. La validacion ejecutada fue:

```powershell
npm.cmd run test:unit:run
```

Resultado observado: 31 archivos de prueba y 395 tests pasaron correctamente.

## To-do list

| Prioridad | Estado | Tarea | Spec detallada |
| --- | --- | --- | --- |
| Alta | Pendiente | Corregir enlaces internos legacy del blog que apuntan a `/blog/<slug>` | `corregir-enlaces-internos-blog-legacy.md` |
| Alta | Pendiente | Resolver la ruta faltante `/vehiculos/calculadora-de-costo-por-kilometro` | `resolver-calculadora-costo-por-kilometro-faltante.md` |
| Media | Pendiente | Implementar redirects legacy documentados para categorias y articulos | `implementar-redirects-legacy-rutas.md` |
| Media | Pendiente | Actualizar README y documentacion desfasada del proyecto | `actualizar-readme-documentacion-proyecto.md` |
| Baja | Pendiente | Agregar validacion automatizada de rutas, enlaces y render basico | `agregar-validacion-rutas-y-render.md` |
| Baja | Pendiente | Mejorar estado activo y accesibilidad del navbar | `mejorar-estado-activo-navbar.md` |

## Orden recomendado

1. Corregir enlaces internos legacy del blog.
2. Implementar redirects legacy para proteger trafico externo y URLs antiguas.
3. Resolver la calculadora faltante de costo por kilometro o retirar los enlaces
   mientras se implementa.
4. Agregar validacion automatizada de rutas y enlaces para evitar regresiones.
5. Actualizar README y documentacion activa.
6. Mejorar estado activo del navbar.

## Validacion global esperada

Al completar todas las tareas:

- `npm.cmd run test:unit:run` debe pasar sin errores.
- `npm.cmd run build` debe pasar sin errores.
- No deben existir enlaces internos rotos hacia `/blog/<slug>` cuando el
  articulo canonico vive en `/blog/<categoria>/<slug>`.
- No debe existir ningun enlace interno hacia una ruta no implementada.
- Las rutas legacy importantes deben tener redirect 301 documentado e
  implementado.
- La documentacion activa debe coincidir con la estructura real del proyecto.
- La navegacion principal debe exponer visualmente y mediante `aria-current` la
  seccion activa.

