# Especificación v2 - Calculadora de nota mínima para aprobar

## Descripción general

Herramienta para calcular qué nota necesita un estudiante en un examen, proyecto
o evaluación final para alcanzar una calificación objetivo o aprobar el curso.

**Arquitectura:** todo el cálculo ocurre en el cliente. No requiere backend,
base de datos ni llamadas a APIs externas.

---

## Objetivo de producto

- Calcular nota mínima necesaria en la evaluación pendiente.
- Considerar calificación actual y peso restante.
- Indicar si el objetivo es alcanzable.
- Permitir escalas 0-10, 0-100 y personalizada.
- Ayudar al estudiante a entender su margen: nota máxima posible, nota mínima
  final posible y escenarios rápidos.
- Generar una página estática optimizada para SEO en Astro.

---

## Alcance recomendado

### MVP

- Calificación actual.
- Peso ya evaluado o peso de la evaluación pendiente.
- Calificación objetivo con presets rápidos.
- Escala de calificación.
- Redondeo configurable del resultado.
- Resultado: nota mínima necesaria, estado alcanzable/no alcanzable, nota final
  máxima posible y nota final mínima posible.
- Escenarios rápidos para saber qué pasa si se obtiene una nota específica.
- Copiar resultado y limpiar formulario.

### Fase 2

- Varias evaluaciones pendientes.
- Tabla de escenarios.
- Historial en `sessionStorage`.
- Integración con calificación ponderada.
- Guardar preferencias de escala y redondeo.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL inmediata recomendada | `/matematicas/calculadora-nota-minima-para-aprobar` |
| URL futura si existe Educación | `/educacion/calculadora-nota-minima-para-aprobar` |
| Archivo Astro recomendado | `src/pages/matematicas/calculadora-nota-minima-para-aprobar.astro` |
| Lógica de cálculo | `src/lib/calculators/matematicas/calculadora-nota-minima-para-aprobar/minimumGrade.ts` |
| Pruebas unitarias | `src/lib/calculators/matematicas/calculadora-nota-minima-para-aprobar/minimumGrade.test.ts` |
| Categoría inmediata | `matematicas` |
| Categoría futura opcional | `educacion` |
| Locale base | `es-MX` |

---

## Comportamiento mobile-first

- Mostrar resultado principal como "Necesitas X".
- Usar inputs de porcentaje con ayuda clara y permitir capturar el peso en dos
  modos: "Ya evaluado" o "Pendiente".
- Evitar tablas en el MVP.
- Mostrar estado alcanzable, imposible o ya asegurado sin depender solo del color.
- Permitir cambiar escala sin recargar.
- Usar formulario de una sola columna en móvil.
- Mostrar la fórmula y el desglose en un panel colapsable tipo "Ver cálculo".
- Mostrar escenarios rápidos como tarjetas o chips compactos, no como tabla.
- Usar `inputmode="decimal"` en campos numéricos.
- Mantener el resultado cerca del formulario; en móvil debe aparecer justo debajo
  de los campos al completarse el cálculo.

---

## Flujo principal MVP

**Ejemplo:** Tengo `7.5` de promedio actual en lo ya evaluado, eso vale `70%`
del curso y necesito `8.0` final. ¿Qué nota necesito en el examen final?

La "calificación actual" debe explicarse en la interfaz como el promedio de las
evaluaciones ya calificadas, sin incluir el examen, proyecto o evaluación
pendiente.

### Inputs del MVP

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Escala | Selector | `0-10`, `0-100`, `Personalizada` | `0-10` |
| Mínimo personalizado | Texto numérico | `< máximo` | `0` |
| Máximo personalizado | Texto numérico | `> mínimo` | vacío |
| Calificación actual | Texto numérico | dentro de escala | vacío |
| Modo de peso | Control segmentado | `Ya evaluado`, `Pendiente` | `Ya evaluado` |
| Peso (%) | Texto numérico | `0-100` | `70` |
| Calificación objetivo | Presets + texto numérico | dentro de escala | `Aprobar` |
| Nota para escenarios rápidos | Texto numérico opcional | dentro de escala | vacío |

Presets recomendados para objetivo:

- `Aprobar`: usa `6` en escala 0-10, `60` en escala 0-100 o el valor
  equivalente configurable para escala personalizada.
- `7`, `8`, `9` en escala 0-10.
- `70`, `80`, `90` en escala 0-100.
- `Personalizado`.

Opciones de redondeo:

- Exacto: 2 decimales.
- A décimas: redondear hacia arriba a 1 decimal.
- A enteros: redondear hacia arriba al entero siguiente.

### Outputs principales

- Nota mínima necesaria en lo restante.
- Peso restante.
- Estado: alcanzable, imposible, ya asegurado.
- Nota final si obtiene la nota máxima.
- Nota final si obtiene la nota mínima.
- Resultado redondeado según la opción elegida.
- Fórmula con sustitución en panel colapsable.
- Mensaje accionable para cada estado.

Mensajes sugeridos:

- Alcanzable: `Necesitas 9.17 en el 30% restante para llegar a 8.00.`
- Imposible: `Aunque obtengas 10.00, llegarías a 7.75.`
- Ya asegurado: `Incluso con 0.00, mantendrías 8.05.`

### Escenarios rápidos del MVP

Mostrar hasta tres escenarios simples debajo del resultado, como tarjetas o chips:

- Si obtienes una nota cercana al objetivo redondeado.
- Si obtienes una nota media alta de la escala.
- Si obtienes la nota máxima.

Ejemplo en escala 0-10:

- `Si sacas 8.0, terminas con 7.65`
- `Si sacas 9.0, terminas con 7.95`
- `Si sacas 10.0, terminas con 8.25`

---

## Fórmulas

```text
peso_actual = peso_evaluado / 100
peso_restante = 1 - peso_actual
nota_necesaria = (objetivo - calificacion_actual * peso_actual) / peso_restante
```

Si el usuario captura el peso de la evaluación pendiente:

```text
peso_restante = peso_pendiente / 100
peso_actual = 1 - peso_restante
nota_necesaria = (objetivo - calificacion_actual * peso_actual) / peso_restante
```

Notas finales posibles:

```text
nota_final_minima = calificacion_actual * peso_actual + escala_minima * peso_restante
nota_final_maxima = calificacion_actual * peso_actual + escala_maxima * peso_restante
nota_final_escenario = calificacion_actual * peso_actual + nota_escenario * peso_restante
```

Estados:

```text
nota_necesaria <= escala_minima => ya asegurado
escala_minima < nota_necesaria <= escala_maxima => alcanzable
nota_necesaria > escala_maxima => imposible con la escala actual
```

---

## Validaciones y estados

- Peso debe ser mayor o igual que `0` y menor que `100` cuando el modo es
  "Ya evaluado".
- Peso debe ser mayor que `0` y menor o igual que `100` cuando el modo es
  "Pendiente".
- Si el peso pendiente calculado es `0`, no calcular nota pendiente.
- Si el peso actual calculado es `0`, la calificación actual puede omitirse
  porque no afecta el resultado.
- Calificaciones deben estar dentro de la escala.
- Objetivo no puede superar el máximo de la escala.
- Objetivo no puede ser menor que el mínimo de la escala.
- En escala personalizada, el mínimo debe ser menor que el máximo.
- Aceptar coma decimal y punto decimal en la entrada (`7,5` y `7.5`).
- Mostrar resultado exacto a 2 decimales.
- Si se usa redondeo a décimas o enteros, redondear hacia arriba para no
  recomendar una nota insuficiente.
- Normalizar salida según `es-MX`, con hasta 2 decimales cuando aplique.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de nota mínima para aprobar` |
| Meta description | `Calcula qué nota necesitas en el examen final o evaluación pendiente para aprobar o alcanzar tu objetivo.` |
| H1 | `Calculadora de nota mínima` |
| Keyword principal | `calculadora nota minima` |
| Keywords secundarias | `nota final para aprobar`, `calcular nota examen final`, `nota necesaria` |

### FAQs sugeridas

- ¿Cómo se calcula la nota mínima?
- ¿Qué pasa si el resultado supera la nota máxima?
- ¿Puedo usar escala de 0 a 100?
- ¿Qué significa "calificación actual"?
- ¿Qué diferencia hay entre peso evaluado y peso pendiente?
- ¿Qué pasa si mi escuela redondea a décimas o enteros?
- ¿Sirve para varias evaluaciones pendientes?

---

## Pruebas sugeridas

- Actual `7.5`, peso `70%`, objetivo `8` produce `9.17`.
- Actual `7.5`, peso pendiente `30%`, objetivo `8` produce `9.17`.
- Nota necesaria mayor al máximo marca imposible.
- Nota necesaria menor o igual al mínimo de la escala marca ya asegurado.
- Nota necesaria exactamente igual al máximo marca alcanzable.
- Nota necesaria exactamente `0` marca ya asegurado en escala con mínimo `0`.
- Peso ya evaluado `100%` muestra error.
- Peso ya evaluado `0%` permite calcular si el curso apenas inicia.
- Peso pendiente `100%` permite calcular si todo el curso depende de la
  evaluación pendiente.
- Escala 0-100 funciona correctamente.
- Escala personalizada `0-5` funciona correctamente.
- Escala personalizada `1-7` funciona correctamente.
- Entrada `7,5` se interpreta como `7.5`.
- Redondeo a décimas sube `9.17` a `9.2`.
- Redondeo a enteros sube `9.17` a `10`.
- Si sacar la nota máxima no alcanza, se muestra la nota final máxima posible.

