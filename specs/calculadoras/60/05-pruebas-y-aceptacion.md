# Pruebas y aceptación

## Matriz numérica obligatoria

T = realizadas, A = asistidas, p = mínimo, R = restantes, Q = necesidad real,
B = faltas futuras disponibles, E = excedente, n = recuperación teórica.
Comprobar resultados y estados exactos antes de comprobar textos formateados.

| Caso | T | A | p | R | Resultado esperado |
| --- | --- | --- | --- | --- | --- |
| Actual sin calendario | 40 | 34 | 80 | null | 85%, cumple actual; proyección desconocida; n=0; Q/B/E no calculados |
| Margen final | 40 | 34 | 80 | 10 | N=50, M=40, Q=6, B=4, E=0; posible; máximo 88% |
| Recuperación justa | 40 | 30 | 80 | 10 | 75%; debajo; Q=10, B=0, n=10; posible; máximo 80% |
| Imposible | 40 | 25 | 80 | 5 | Q=11, B=0, E=6, n=35; imposible; máximo 66.666…% |
| Ejemplo sin margen corregido | 20 | 16 | 80 | 4 | M=20, Q=4, B=0; cumple actual y posible final |
| Ejemplo antiguo | 20 | 16 | 80 | 5 | Q=4, B=1; no puede llamarse «Sin margen» |
| Umbral redondeado hacia arriba | 3 | 2 | 66.67 | 0 | Debajo; terminado sin cumplir; M=3, E=1, Q=1, n=1; aviso de redondeo |
| Umbral redondeado hacia abajo | 3 | 1 | 33.3332 | 0 | Cumple exacto; terminado cumpliendo; margen positivo menor de 0.01 pp |
| Curso terminado con margen pasado | 40 | 40 | 80 | 0 | Terminado cumpliendo; B=0, Q=0; no recomendar faltar |
| Curso terminado por debajo | 40 | 30 | 80 | 0 | Terminado sin cumplir; Q=2, E=2, B=0; n=10 solo hipotético |
| Garantía final | 40 | 40 | 80 | 5 | M=36, Q=0, B=5; garantizado; cumple actual |
| Mínimo cero | 10 | 0 | 0 | 5 | Cumple actual; garantizado; B=5, Q=0, n=0 |
| Cien con faltas | 10 | 9 | 100 | 100 | Imposible; Q=101, B=0, E=1; n imposible |
| Cien sin faltas | 10 | 10 | 100 | 5 | Cumple actual; posible; Q=5, B=0, n=0; no garantizado |
| Recuperación mayor de 1000 | 1000 | 0 | 99.9 | 1000 | Imposible en el curso; n=999000, sin truncar |
| Precisión máxima de recuperación | 1000 | 0 | 99.9999 | null | n=999999000; no desbordamiento ni corte |
| Total final máximo | 1000 | 1000 | 80 | 1000 | N=2000, M=1600, Q=600, B=400 |

Repetir escenarios relevantes en modo faltas con F=T−A. Probar igualdad exacta
en el umbral, n mínimo, y las invariantes de la spec 02 sobre un conjunto de
entradas que incluya extremos, umbrales fraccionarios y R=0/null.

## Parser y contrato directo

| Entradas | Expectativa |
| --- | --- |
| Porcentaje `80.125`, `80,125` | 80.125; P=801250 |
| `0.001`, `0,001` | 0.001; P=10 |
| `80.000`, `80,000` | 80; P=800000 |
| `87,5%`, ` 87.5 % ` | 87.5 |
| `0`, `100`, `99.9999` | Válidos |
| `100.0001`, `-1`, `NaN`, `Infinity` | Inválidos |
| `80.12345`, `80.00000` | Error de precisión |
| `8 0`, `8%0`, `80%%`, `80,1.2`, `80..1`, `1e2` | Error de formato |
| `.5`, `,5`, `80.` al confirmar | Error de formato con ayuda |
| Clases `1,000`, `1.000` | 1000 |
| Clases `12.5`, `12,5`, `1 0`, `1e2` | Inválidas |
| T vacío/0/1001; A o F > T; R=-1/1001 | Error del campo correspondiente |
| R vacío vs `0` | null/desconocido vs terminado |

Invocar el núcleo con entradas inválidas sin pasar por la UI: modo inexistente,
fracciones de clase, números no finitos y mínimos fuera de rango/precisión.
Si se mantiene adaptador numérico, comprobar equivalencia con el parser textual.

## Integración y experiencia

- Alternar modos conserva A/F complementarios y resultados cuando los datos son
  válidos; no resucita cantidades ocultas obsoletas cuando hay errores.
- Vaciar R después de calcular retira la proyección anterior y mantiene el cálculo
  actual válido. Escribir cero muestra el curso terminado.
- Los cinco ejemplos producen lo indicado en 04 y un resumen equivalente.
- Caso imposible: pantalla y copia nunca muestran «5 clases necesarias» cuando Q=11.
- Caso de redondeo: nunca simultanear «Cumple» con excedente o recuperación pendiente.
- El resumen incluye mínimo con cuatro decimales si corresponde, condiciones de
  disponibilidad, estado desconocido y recuperación teórica fuera del calendario.
- Clipboard: éxito de API, API ausente, rechazo, fallback true/false/excepción,
  copia manual, restauración del foco y resolución tardía tras limpiar.
- Limpiar reinicia valores y errores; no deja resultados ni mensajes anteriores.
- Verificación con teclado y lector de pantalla: labels, ayudas, errores vinculados,
  `aria-invalid`, selector, foco y avisos sin anunciar el panel completo repetidamente.
- Revisar móvil a 320/375 CSS px, escritorio y zoom 200%; formulario primero,
  sin desbordamientos y condiciones legibles junto a los resultados.
- Sin JavaScript: aviso y contenido explicativo disponible.
- Mismos datos producen los mismos estados/números en ES y EN. Textos y resumen
  corresponden al idioma de la página; FAQ visible coincide con su JSON-LD.
- Rutas, canonical, alternates y enlaces de navegación permanecen correctos.

## Estrategia y cierre

Ampliar las pruebas del motor existentes y añadir pruebas del parser, presentación
y adaptadores que verifiquen los comportamientos anteriores. Reutilizar las
herramientas de integración del repositorio; si no existe automatización de
navegador, documentar los casos manuales ejecutados con sus resultados, sin
presentarlos como pruebas automatizadas. Las pruebas de lógica no sustituyen la
revisión visual ni de accesibilidad.

Para la suite focalizada puede usarse:

```powershell
& ./node_modules/.bin/vitest.cmd run src/lib/calculators/matematicas/calculadora-porcentaje-asistencia-escolar/attendance.test.ts --configLoader native
```

Actualizar la selección si se crean archivos de prueba adicionales, incluyendo
núcleo y adaptadores de ambos idiomas. No ejecutar `npm run dev` ni `npm run build`
sin petición explícita del usuario, conforme a las instrucciones del proyecto.
Usar una instancia de vista previa disponible para verificaciones de navegador;
si no está disponible, registrar esa validación como pendiente.

La entrega base se cierra cuando C01–C12, S01–S07 e I01 tienen evidencia, la matriz
pasa, las dos páginas cumplen los estados y no hay requisitos pendientes de 01–05.
No marcar la ampliación 06 como implementada por haber completado esta entrega.
