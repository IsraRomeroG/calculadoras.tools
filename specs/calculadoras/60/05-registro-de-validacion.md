# Registro de validación del paso 05

## Evidencia automatizada

- La matriz numérica obligatoria se cubre en `attendance.test.ts`, antes de
  comprobar mensajes formateados.
- Se cubren los parsers de porcentajes y clases, la representación escalada,
  entradas directas inválidas, invariantes, ambos modos de captura y los cinco
  ejemplos de 04 en ES y EN.
- `attendance-integration.test.ts` verifica rutas, metadata, contenido estático,
  FAQ visible/JSON-LD, orden del formulario, estados accesibles, copia manual,
  limpieza y límites de idioma.
- Resultado observado: suite focalizada, 2 archivos y 117 pruebas correctas;
  suite completa, 136 archivos y 1573 pruebas correctas.
- `astro sync` terminó correctamente y generó los tipos del proyecto.
- La suite focalizada y la suite completa deben ejecutarse con `--configLoader
  native`; no se consideran aquí comandos de desarrollo o build.

## Verificación manual de navegador

Esta ejecución no dispone de una instancia de vista previa ni de un arnés de
navegador instalado. Por ello, los siguientes casos quedan registrados como
pendientes manuales y no se presentan como pruebas automatizadas:

| Caso | Estado |
| --- | --- |
| Teclado, foco visible y anuncios de lector de pantalla | Pendiente de vista previa |
| Anchos de 320/375 px, escritorio y zoom del 200% | Pendiente de vista previa |
| Alternar asistencias/faltas, cargar ejemplos y limpiar | Pendiente de vista previa |
| Clipboard real, fallback y copia manual seleccionable | Pendiente de vista previa |
| Comportamiento sin JavaScript y lectura de explicación/FAQ | Pendiente de vista previa |

La cobertura automatizada no sustituye esta revisión visual y de accesibilidad.
