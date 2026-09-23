# Diagnóstico y trazabilidad

## Evidencia de partida

Revisión del código ES, de la spec v1 y de las pruebas existentes. Las 13 pruebas
unitarias ES pasaban durante la revisión, pero no cubrían los fallos siguientes.
Los casos numéricos se reprodujeron ejecutando el módulo; las observaciones de
interfaz proceden del código y requieren comprobación en navegador al implementar.
Se identificó además un módulo EN que duplica la lógica del módulo ES.

| ID | Problema observado | Corrección requerida | Spec |
| --- | --- | --- | --- |
| C01 | 2/3 con mínimo 66.67% devuelve «Cumple», excedente 1 y recuperación 1 | Comparaciones exactas; redondeo solo visual | 02, 05 |
| C02 | `80.125` se rechaza y `0.001` se interpreta como 1 | Parser de porcentaje sin agrupadores de miles | 02, 05 |
| C03 | 40/25, 80%, 5 restantes muestra 5/5 necesarias aunque requiere 11 | No truncar la necesidad; estado imposible explícito en pantalla y copia | 02, 03, 05 |
| C04 | Ejemplo «Sin margen» permite una falta | Datos y etiqueta comprobados | 04, 05 |
| C05 | «Estado» mezcla cumplimiento actual con viabilidad final | Estados separados, incluido cumplimiento final asegurado | 02, 03 |
| C06 | «Puedes faltar» sugiere mantener el mínimo durante todo el curso | Aclarar que es una proyección final condicionada | 03, 04 |
| C07 | Recuperación muestra 35 clases cuando quedan 5 | Identificar recuperación teórica y su viabilidad dentro del curso | 02, 03 |
| C08 | Resultados vacíos extensos antes del formulario en móvil | Formulario primero en DOM y presentación móvil | 03 |
| C09 | Faltas acumuladas ausentes del resultado visible | Mostrar total, asistencias y faltas acumuladas | 03 |
| C10 | Errores sin asociación accesible; copia sin aviso accesible | Descripciones, invalidez y región de estado | 03, 05 |
| C11 | Fallback de copia ignora resultado de `execCommand` | Confirmar éxito y ofrecer copia manual si falla | 03, 05 |
| C12 | Tildes omitidas y «MVP» expuesto al usuario | Revisión editorial y mensajes de producto | 04 |
| S01 | v1 limita la necesidad con `min` y luego comprueba si supera el límite | Conservar necesidad real y comparar antes de representar | 02 |
| S02 | v1 permite más faltas futuras que clases restantes | Limitar disponibilidad y separar excedente | 02 |
| S03 | Restantes vacío equivale a curso terminado | Vacío = desconocido; cero explícito = terminado | 02, 03 |
| S04 | Precisión de comparación y parser indefinida | Contrato decimal y aritmética exacta | 02 |
| S05 | «Ya cumplido» confunde actualidad y garantía futura | Estado final asegurado solo si ya se alcanzó el mínimo del total final | 02 |
| S06 | Límite artificial de 1000 para recuperación | Fórmula directa sin corte de búsqueda | 02 |
| S07 | Pruebas insuficientes para límites y UX | Matriz numérica y aceptación de interacción | 05 |
| I01 | Reglas duplicadas ES/EN | Núcleo común y pruebas de paridad | 04, 05 |

## Requisitos valiosos de v1 conservados o recuperados

| Requisito v1 | Situación inicial | Destino |
| --- | --- | --- |
| Cálculo local, Astro estático, sin API | Implementado | Conservar, 00 y 04 |
| Asistencias o faltas, mínimo configurable | Implementado | Conservar y validar, 02–03 |
| Clases futuras opcionales | Implementado con ambigüedad | Corregir semántica, 02–03 |
| Porcentaje, margen, máximo final y faltas permitidas | Implementado con defectos | Corregir, 02–03 |
| Faltas acumuladas visibles | Solo aparecen en copia | Incorporar a pantalla, 03 |
| Recuperación y acción práctica sin tono punitivo | Parcialmente implementado | Mensajes precisos, 03–04 |
| Detalles y explicación del cálculo | Definiciones breves; sin desarrollo suficiente | Ejemplo resuelto y fórmulas, 04 |
| Formulario primero en móvil | No respetado por orden actual | 03 |
| Copiar y limpiar | Implementado | Robustecer, 03 |
| FAQs, metadata y datos estructurados | Implementado | Conservar y sincronizar, 04 |
| Varias materias | No presente en la calculadora revisada | 06, ampliación A |
| Calendario de faltas | No presente | 06, ampliación B |
| Historial en `sessionStorage` | No presente | 06, ampliación C |
| Exportación CSV | No presente | 06, ampliación D |
| Justificadas, retardos y redondeo institucional | No presente | 06, ampliación E |

No se recupera la sugerencia de cambiar la categoría pública a Educación: no
resuelve los problemas detectados y no forma parte de este trabajo.
