# Matriz de aceptación de las correcciones

## Pruebas de núcleo

| Caso | Resultado esperado |
| --- | --- |
| `T=2,A=1,p=66.67`, redondeo 2 | Recuperación 1 |
| `T=2,A=1,p=66.67`, exacto | Recuperación 2 |
| `T=3,A=2,p=100`, redondeo 0 | Recuperación finita, no `impossible` |
| `"80.12345"` o `"80.00000"` como texto; `80.12345` como número | Error de precisión; el número `80` sigue siendo válido |
| Snapshot con esquema actual y reglas antiguas | Regresión: se lee como histórica y se conserva su resultado guardado |
| Arreglo con snapshot válida y otra corrupta | La válida sigue disponible; se ignora la corrupta y se avisa |
| JSON de historial ilegible o esquema desconocido | No rompe el cálculo ni modifica la materia activa |
| Restauración manual desde otra materia | No copia eventos ajenos |
| `J=1` en exclusión/crédito | Cambia solo la interpretación efectiva |
| `L=3,k=3` | Descuenta una asistencia efectiva |

## Pruebas de integración

| Flujo | Verificación |
| --- | --- |
| Cambiar política | Pantalla, copia, guardado y CSV comparten estado y cifras |
| Cambiar materia | Se carga únicamente el estado de la materia elegida |
| Cambiar origen | Solo la fuente activa alimenta el resultado |
| Cambiar política avanzada a base | Se restaura el resultado exacto base |
| Copiar después de editar | Nunca copia un resumen anterior |
| Consultar y restaurar historial con reglas antiguas | Se consulta el resultado guardado sin restaurar; al restaurar se muestra junto al recálculo actual |
| Eliminar única materia | Confirma o permite deshacer |
| Evento en ES | Usa etiqueta localizada |
| Móvil 320/375 px | Formulario primero, sin desbordamiento horizontal |

## Paridad

Repetir los escenarios numéricos relevantes en ES y EN. Deben coincidir:

- estados internos;
- valores exactos `Q`, `B`, `E`, `n`;
- resultado de políticas;
- datos de copia, historial y CSV.

Solo deben variar idioma, separadores numéricos y textos localizados.

## Estrategia de ejecución

- Ampliar las pruebas unitarias del núcleo y de fase 2.
- Añadir pruebas de controlador/DOM para cambios de materia, origen, política,
  copia, restauración, borrado y orden de lectura.
- Probar fallos de `sessionStorage`, clipboard y cambios durante una copia asíncrona.
- Ejecutar la suite de pruebas con el cargador nativo configurado por el proyecto.
- No usar `npm run dev` ni `npm run build` salvo petición explícita.

La entrega no se considera cerrada si solo pasan las pruebas matemáticas: deben
pasar también las pruebas de sincronización y experiencia de usuario.
