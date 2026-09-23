# Asistencia escolar v2: índice y alcance

Estado: pasos 01–05 implementados según confirmación del usuario; ampliaciones 06
y mejora 07 pendientes de implementación. Fecha: 2026-09-22.
La evidencia y las verificaciones manuales pendientes de la base se conservan en
[05: registro de validación](05-registro-de-validacion.md); no se consideran
ejecutadas por esta actualización documental.

## Objetivo

Corregir errores numéricos y de interpretación, separar asistencia actual de
proyección final y ofrecer resultados accesibles, verificables y útiles en móvil.
Este conjunto sustituye como referencia de implementación a la
[spec v1 archivada](../archive/MVP/60_Calculadora_de_porcentaje_de_asistencia_escolar.md).
La v1 se conserva como antecedente; sus fórmulas y mensajes contradictorios no son
criterios de aceptación de v2.

## Secuencia y entregables

| Orden | Documento | Entregable |
| --- | --- | --- |
| 1 | [01: diagnóstico y trazabilidad](01-diagnostico-y-trazabilidad.md) | Problemas y requisitos heredados con destino explícito |
| 2 | [02: contrato matemático](02-contrato-matematico-y-validaciones.md) | Entradas, precisión, estados y fórmulas verificables |
| 3 | [03: interfaz y accesibilidad](03-interfaz-resultados-y-accesibilidad.md) | Formulario, resultados, mensajes y acciones coherentes |
| 4 | [04: contenido e integración](04-contenido-seo-e-integracion.md) | Explicaciones, ejemplos, ES/EN y arquitectura |
| 5 | [05: pruebas y aceptación](05-pruebas-y-aceptacion.md) | Regresiones, escenarios y lista de cierre |
| 6 | [06: ampliaciones](06-ampliaciones-de-fase-2.md) | Materias, calendario, historial, CSV y políticas configurables |
| 7 | [07: nombres y calendario del curso](07-nombres-y-calendario-del-curso.md) | Clases impartidas hasta hoy y captura por restantes o total del curso |

La entrega v2 base incluye íntegramente 01–05. La 06 es una entrega posterior
especificada, no un requisito para cerrar la corrección base. No debe aparecer
en la interfaz ninguna función de la 06 antes de implementarse y validarse.
01–05 se conservan como referencia de la base implementada. La siguiente mejora
es 07, independiente de 06 y con prioridad sobre ella; la numeración conserva las
referencias existentes. 07 sustituye únicamente los nombres y la captura del
calendario que señala expresamente, manteniendo las demás reglas de 01–05.
Crear la spec 07 no marca su funcionalidad como implementada.

## Invariantes

- Cálculo local en el navegador; página estática Astro, sin cuentas, backend ni API.
- Conservar `/matematicas/calculadora-porcentaje-asistencia-escolar` y
  `/en/math/attendance-percentage-calculator`, sus canonical y alternates.
- No ejecutar la migración hipotética a `/educacion` de v1 ni crear rutas duplicadas.
- Conservar captura por asistencias o faltas, actualización automática, ejemplos,
  copiar y limpiar; mejorar sus contratos según este conjunto.
- Todas las clases tienen el mismo peso en la entrega base. No deducir políticas
  de una institución o un país; el mínimo lo proporciona el usuario.
- No presentar resultados redondeados como fundamento de una decisión exacta.
- Valores desconocidos, imposibles y cero son estados distintos.
- ES usa `es-MX`; EN usa la convención de formato inglesa ya adoptada por el sitio.
  Ambos idiomas deben compartir reglas y resultados numéricos.

## Archivos de aplicación de referencia

- `src/pages/matematicas/calculadora-porcentaje-asistencia-escolar.astro`.
- `src/pages/en/math/attendance-percentage-calculator.astro`.
- `src/lib/calculators/matematicas/calculadora-porcentaje-asistencia-escolar/attendance.ts`.
- `src/lib/calculators/matematicas/calculadora-porcentaje-asistencia-escolar/attendance.en.ts`.
- `src/lib/calculators/matematicas/calculadora-porcentaje-asistencia-escolar/attendance.test.ts`.
- `src/components/calculators/AttendanceCalculator.astro`.
- `src/lib/calculators/matematicas/calculadora-porcentaje-asistencia-escolar/attendance-controller.ts`.
- `src/lib/calculators/matematicas/calculadora-porcentaje-asistencia-escolar/attendance-core.ts`.
- `src/lib/calculators/matematicas/calculadora-porcentaje-asistencia-escolar/attendance-integration.test.ts`.

La ubicación exacta de módulos nuevos es una decisión de implementación; los
contratos, criterios de aceptación y rutas públicas de este conjunto son obligatorios.
