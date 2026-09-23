# Correcciones de la calculadora de asistencia escolar

Estado: propuesta de corrección posterior a la auditoría de `specs/calculadoras/60`.
Fecha: 2026-09-22.

## Objetivo

Corregir los defectos observados en la implementación actualmente expuesta en:

- `/matematicas/calculadora-porcentaje-asistencia-escolar`.
- `/en/math/attendance-percentage-calculator`.

La corrección debe conservar las rutas públicas, canonical, alternates, cálculo
local, funcionamiento sin backend y la semántica matemática de las specs base.
No se deben crear rutas nuevas ni duplicar calculadoras.

## Alcance

Este set cubre todos los hallazgos de la auditoría:

| Documento | Área | Hallazgos |
| --- | --- | --- |
| [01: fuente única e integración](01-fuente-unica-e-integracion.md) | Estado visible, copia y cambios de contexto | Controladores desincronizados |
| [02: políticas y precisión](02-politicas-y-precision.md) | Redondeo, recuperación y parser | Recuperación incorrecta y precisión laxa |
| [03: historial versionado](03-historial-versionado.md) | `sessionStorage` | Consulta y comparación históricas; aislamiento de snapshots corruptas |
| [04: restauración aislada](04-restauracion-aislada.md) | Materias y snapshots | Contaminación de eventos |
| [05: captura de políticas](05-captura-de-politicas.md) | UI de fase 2 | Justificadas y retardos manuales inutilizables |
| [06: presentación y localización](06-presentacion-y-localizacion.md) | Resultados ES/EN | Mensajes genéricos, precisión y estados sin traducir |
| [07: eliminación y orden DOM](07-eliminacion-y-orden-dom.md) | UX y accesibilidad | Borrado sin confirmación y formulario fuera de orden |
| [08: matriz de aceptación](08-matriz-de-aceptacion.md) | Verificación | Regresiones y pruebas de integración |

## Invariantes

- La pantalla, el resumen copiable, el guardado y el CSV deben consumir el mismo
  resultado normalizado; ningún consumidor puede recalcular una variante propia.
- Cambiar materia, origen, política, modo de captura o modo de calendario debe
  invalidar o recalcular el resultado de forma atómica.
- ES y EN deben producir los mismos números y estados; solo cambia la presentación.
- Los cálculos exactos de la spec 02 no pueden ser reemplazados por porcentajes
  redondeados.
- Las funciones de fase 2 activas deben conservar los mensajes y condiciones de
  la interfaz base cuando el resultado representa el mismo modelo.
- No ejecutar `npm run dev` ni `npm run build` como parte de esta corrección sin
  una solicitud explícita.

## Criterio de cierre

La corrección se cierra cuando todos los casos de [08](08-matriz-de-aceptacion.md)
están cubiertos por pruebas automatizadas apropiadas y no existe un estado visible
que difiera del resultado usado para copiar, guardar o exportar.
