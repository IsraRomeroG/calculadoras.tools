# Contrato matemático y validaciones

## Entradas

| Campo | Dominio | Inicial / limpiar |
| --- | --- | --- |
| `totalClasses` (T) | Entero 1–1000 | Vacío |
| `mode` | `attended` o `absences` | `attended` |
| `attendedClasses` (A) | Entero 0–T, obligatorio solo en ese modo | Vacío |
| `absences` (F) | Entero 0–T, obligatorio solo en ese modo | Vacío |
| `requiredPercent` (p) | 0–100, hasta 4 decimales | 80 |
| `remainingClasses` (R) | Entero 0–1000 o `null` | Vacío (`null`) |

En modo faltas, A = T − F. En modo asistencias, F = T − A. No sumar ambos campos
ni validar como obligatorio el campo oculto. Rechazar modos desconocidos en el
contrato del motor. Cada campo de clases admite hasta 1000; el total final puede
ser 2000. Mostrar estos límites en ayuda y errores.

R vacío significa «No sé cuántas quedan». R = 0 significa que no habrá más clases.
No convertir `null`, vacío o ausencia de la propiedad en cero. Valores inválidos
no son desconocidos: deben dar error. No aceptar NaN, infinito o valores fuera de
dominio al invocar directamente el motor.

## Parsing

- Recortar espacios exteriores. No eliminar caracteres arbitrarios del interior.
- Clases: dígitos enteros; conservar compatibilidad con `1,000` y `1.000` como
  agrupación de miles válida. Los separadores son de agrupación, nunca decimales
  en campos de clases. Rechazar `12.5`, `12,5`, `1 0`, signos, exponentes y texto.
  Validar la agrupación de tres dígitos antes de convertir y luego el rango.
- Porcentaje: dígitos con, opcionalmente, un único punto o coma decimal y de 1 a 4
  cifras posteriores. Admitir un único `%` al final, con espacio antes de él.
  No admitir miles, separadores mezclados/repetidos, exponentes, signos ni espacios
  entre dígitos. `80.125` y `80,125` son ambos 80.125; `0.001` es 0.001; `80.000` es 80.
- Rechazar `.5`/`,5` con ayuda para escribir `0.5`; rechazar `80.` al confirmar
  edición. Mientras se escribe, no sustituir ni reformatear el texto del usuario.
- Más de cuatro decimales se rechazan, incluso si los adicionales son ceros.
- Distinguir requerido, formato, negativo, cero no permitido, precisión y límite.
  Mensajes específicos: «Usa un entero entre 1 y 1000», «Las asistencias no pueden
  superar las 40 clases realizadas», «Usa un porcentaje de 0 a 100 con hasta 4 decimales».

## Precisión y decisiones

Representar el mínimo como entero escalado P = p × 10000, construido a partir
del texto decimal normalizado, rellenando ceros a la derecha. D = 1000000.
Así, el cociente de asistencia requerido es P/D. El parser debe entregar esta
representación al motor; no reconstruirla a partir de porcentajes redondeados.
Un adaptador numérico, si se conserva, debe validar la misma precisión y convertir
de forma determinista al mismo P.

Con los límites base todos los productos de las fórmulas siguientes son enteros
seguros en JavaScript. Usar división entera con techo para decisiones; para n ≥ 0
y d > 0: `ceilDiv(n,d) = floor((n+d-1)/d)`. No aplicar epsilon para cambiar el umbral.

```text
currentMeets = A * D >= T * P
currentPercent = 100 * A / T                  # sin redondear en el modelo
marginPoints = 100 * (A * D - T * P) / (T * D)
```

El formato habitual muestra hasta dos decimales, sin `-0`. El mínimo introducido
se muestra con toda su precisión significativa (hasta cuatro decimales).
Si redondear el porcentaje produce apariencia de igualdad con un mínimo que no
se cumple, acompañar el valor con «Por debajo de {p}% antes de redondear»; nunca
alterar el estado. Aplicar lo mismo al máximo final. Si el margen no nulo se
mostraría como cero, mostrar «Déficit menor de 0.01 puntos porcentuales» o
«Margen positivo menor de 0.01 puntos porcentuales», según su signo exacto.

## Proyección cuando R es conocido

```text
N = T + R
minimumAttendancesFinal (M) = ceilDiv(N * P, D)
maximumFinalAbsences = N - M
rawAvailableAbsences = maximumFinalAbsences - F
availableAbsences = max(0, min(R, rawAvailableAbsences))
exceededAbsences = max(0, -rawAvailableAbsences)
requiredAttendancesFromRemaining (Q) = max(0, M - A)
isPossibleFinal = Q <= R
isFinalGuaranteed = Q == 0
maxPossiblePercent = 100 * (A + R) / N
```

Q conserva la necesidad real, incluso si supera R. No devolver `min(Q,R)` con
nombre de «clases necesarias». El excedente no se representa como disponibilidad
negativa; es un dato separado. Los consumidores actuales de valores negativos y
de `minimumRemainingAttendances` deben migrar al nuevo contrato.

Q se calcula para el total final fijo N: cuando Q > R no significa que agregar
Q clases nuevas al calendario baste; eso cambiaría N. Para ese escenario se usa
la recuperación teórica, definida más abajo.

## Estados independientes

`currentStatus`: `meets` o `below`, determinado únicamente por `currentMeets`.

`projection` es una unión discriminada, no una colección de números ficticios:

| Estado | Condición | Significado |
| --- | --- | --- |
| `unknown` | R = null | No se conoce el calendario final |
| `finished_meets` | R = 0 y cumple actualmente | Curso terminado, mínimo alcanzado |
| `finished_below` | R = 0 y no cumple | Curso terminado, mínimo no alcanzado |
| `impossible` | R > 0 y Q > R | No puede alcanzar el mínimo del curso |
| `guaranteed` | R > 0 y Q = 0 | Ya tiene las asistencias mínimas para el total final |
| `possible` | R > 0 y 0 < Q <= R | Necesita asistir a Q clases de las R restantes |

Evaluar en ese orden. `possible` puede coexistir con `currentStatus=meets` o
`below`: cumplir hoy no garantiza cumplir al final.
`unknown` no expone N, M, Q, disponibilidad, excedente ni máximo final como cero;
se omiten o son `null` según el tipo elegido. Sí permite asistencia actual,
faltas acumuladas, margen y recuperación teórica.

## Recuperación teórica sin límite de búsqueda

Mínimo número n de futuras clases consecutivas asistidas para alcanzar el umbral:

```text
si currentMeets: n = 0
si no cumple y P == D: recuperación imposible (hay faltas y el mínimo es 100%)
en otro caso: n = ceilDiv(T * P - A * D, D - P)
```

No buscar por iteración ni sustituir números mayores de 1000 por `>1000`.
El límite de entrada de clases no limita este resultado teórico.
Con R conocido, señalar si n > R; con R desconocido no afirmar que n cabe en el
curso. Con R = 0 y n > 0, rotularlo como escenario hipotético fuera del curso terminado.
No confundir n con Q: n aumenta el denominador con cada nueva clase; Q se refiere
al total final fijo N. Para p = 0 siempre cumple y n = 0. Para p = 100 con F = 0
cumple actualmente, pero si R > 0 debe asistir a todas las restantes.

## Invariantes verificables

- A + F = T; 0 <= availableAbsences <= R cuando R es conocido.
- Si Q <= R: availableAbsences + Q = R y exceededAbsences = 0.
- Si Q > R: availableAbsences = 0 y exceededAbsences = Q − R.
- `guaranteed` implica cumplimiento actual; cumplimiento actual no implica garantía.
- Si R = 0, el resultado final coincide con el estado actual exacto.
- n finito cumple `(A+n)*D >= (T+n)*P`; si n > 0, n−1 no cumple.
- Pantalla, mensajes y copia consumen el mismo resultado; no recalculan umbrales.
