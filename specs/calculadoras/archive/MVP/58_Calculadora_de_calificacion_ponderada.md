# Especificación v2 - Calculadora de calificación ponderada

## Descripción general

Herramienta para calcular una calificación final a partir de actividades,
exámenes, tareas o proyectos con diferentes pesos. Debe ser clara para sistemas
de evaluación por porcentajes.

Además de calcular el promedio ponderado actual, debe ayudar al usuario a tomar
decisiones: saber qué nota necesita en evaluaciones pendientes para aprobar o
alcanzar una meta, entender cuánto peso lleva evaluado y comparar una proyección
realista contra la calificación acumulada.

**Arquitectura:** todo el cálculo ocurre en el cliente. No requiere backend,
base de datos ni llamadas a APIs externas.

---

## Objetivo de producto

- Calcular calificación ponderada con varias evaluaciones.
- Validar que los pesos sumen 100% o mostrar pendiente.
- Permitir escalas comunes y personalizada.
- Mostrar contribución de cada evaluación.
- Calcular la nota necesaria en el peso pendiente para alcanzar una meta.
- Permitir evaluaciones pendientes con calificación estimada opcional.
- Generar una página estática optimizada para SEO en Astro.

---

## Alcance recomendado

### MVP

- Lista editable de evaluaciones.
- Nombre, estado, calificación y peso.
- Escala 0-10, 0-100 o personalizada.
- Meta de calificación final opcional.
- Evaluaciones calificadas y pendientes.
- Resultado: calificación acumulada, promedio del peso evaluado, peso evaluado,
  peso pendiente y nota necesaria para alcanzar la meta.
- Contribución por evaluación.
- Botón para usar el peso restante en una evaluación.
- Botón para dividir el peso restante entre evaluaciones pendientes.
- Copiar resumen, limpiar formulario y exportar CSV.

### Fase 2

- Escenarios alternativos.
- Historial en `sessionStorage`.
- Importar desde texto o CSV.
- Guardar plantillas frecuentes, por ejemplo `Tareas / Examen / Proyecto`.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL inmediata recomendada | `/matematicas/calculadora-calificacion-ponderada` |
| URL futura si existe Educación | `/educacion/calculadora-calificacion-ponderada` |
| Archivo Astro recomendado | `src/pages/matematicas/calculadora-calificacion-ponderada.astro` |
| Lógica de cálculo | `src/lib/calculators/matematicas/calculadora-calificacion-ponderada/weightedGrade.ts` |
| Pruebas unitarias | `src/lib/calculators/matematicas/calculadora-calificacion-ponderada/weightedGrade.test.ts` |
| Categoría inmediata | `matematicas` |
| Categoría futura opcional | `educacion` |
| Locale base | `es-MX` |

Si en el futuro se mueve de `/matematicas/` a `/educacion/`, conservar SEO con
una redirección 301 desde la URL anterior.

---

## Comportamiento mobile-first

- Cada evaluación debe editarse como bloque en móvil.
- Mostrar calificación acumulada, peso pendiente y nota necesaria arriba.
- Mantener el resumen principal visible cerca del inicio; en móvil puede ser una
  franja compacta sticky si no tapa los campos.
- Botones de agregar, duplicar y eliminar evaluación.
- Botones de acción rápida por evaluación: `Usar peso restante` y `Duplicar`.
- Acción global para repartir el peso restante entre pendientes.
- Si los pesos no suman 100%, mostrar advertencia clara.
- Evitar depender solo del color para pesos incompletos.
- Usar campos numéricos con `inputmode="decimal"` y aceptar punto o coma decimal.
- Evitar tablas en móvil; usar tarjetas compactas por evaluación.
- Las acciones secundarias como exportar CSV deben ser menos prominentes que
  agregar evaluación y calcular meta.

---

## Flujo principal MVP

**Ejemplo 1:** Tareas `30%` con `9`, examen `40%` con `8` y proyecto `30%` con
`10`. ¿Cuál es la calificación final?

**Ejemplo 2:** Ya tengo `72%` del curso evaluado y quiero terminar con `8.0`.
¿Qué promedio necesito en el `28%` restante?

### Inputs del MVP

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Escala | Selector | `0-10`, `0-100`, `Personalizada` | `0-10` |
| Máximo personalizado | Texto numérico | `> 0` | vacío |
| Calificación objetivo | Texto numérico | dentro de escala | vacío |
| Nombre de evaluación | Texto | 1-60 caracteres | `Evaluación 1` |
| Estado | Selector o toggle | `Calificada`, `Pendiente` | `Calificada` |
| Calificación | Texto numérico | dentro de escala | vacío |
| Calificación estimada | Texto numérico | dentro de escala | vacío |
| Peso (%) | Texto numérico | `0-100` | vacío |

### Outputs principales

- Calificación acumulada sobre el 100% del curso.
- Promedio del peso evaluado.
- Calificación proyectada si hay pendientes con estimación.
- Nota promedio necesaria en el peso pendiente para alcanzar la meta.
- Peso total asignado.
- Peso evaluado.
- Peso pendiente o excedente.
- Contribución por evaluación.
- Estado de pesos.
- Estado de factibilidad de la meta.

### Mensajes de valor

- `Necesitas promedio de 8.35 en el 20% restante para terminar con 8.0.`
- `Con el peso pendiente ya no es posible alcanzar 9.5.`
- `Ya alcanzaste la meta aunque tus evaluaciones pendientes valgan 0.`
- `Falta asignar 15% del curso. Puedes repartirlo entre pendientes.`

---

## Fórmulas

```text
contribucion = calificacion * (peso / 100)
calificacion_acumulada = suma(contribucion_calificada)
peso_asignado = suma(peso de todas las evaluaciones)
peso_evaluado = suma(peso de evaluaciones calificadas)
peso_pendiente_asignado = suma(peso de evaluaciones pendientes)
peso_sin_asignar = 100 - peso_asignado
peso_restante_evaluable = 100 - peso_evaluado
```

Si el peso evaluado no es 100%, mostrar resultado parcial y el promedio del
peso ya calificado:

```text
promedio_peso_evaluado = suma(calificacion * peso) / suma(peso calificado)
calificacion_proyectada =
  suma(contribuciones calificadas + contribuciones estimadas pendientes)
nota_necesaria_pendiente =
  (meta - calificacion_acumulada) / (peso_restante_evaluable / 100)
```

Si `nota_necesaria_pendiente` es menor o igual a `0`, la meta ya está alcanzada
con lo evaluado. Si es mayor al máximo de la escala, la meta no es alcanzable con
el peso restante evaluable. Si `peso_asignado` es menor a `100`, explicar que la
nota necesaria asume que el peso sin asignar también cuenta como parte del curso
restante.

---

## Validaciones y estados

- Debe existir al menos una evaluación válida.
- Calificación debe estar dentro de escala cuando la evaluación esté marcada
  como calificada.
- Calificación estimada debe estar dentro de escala cuando exista.
- Peso no puede ser negativo.
- Si peso asignado supera 100%, mostrar advertencia de excedente.
- Si peso asignado es menor a 100%, mostrar peso sin asignar.
- Aceptar coma decimal y punto decimal.
- Permitir tolerancia pequeña para pesos de `99.99` a `100.01`, mostrando `100%`
  en la interfaz si el redondeo aplica.
- Si una evaluación tiene peso `0`, permitirlo pero mostrar nota suave de que no
  afecta el resultado.
- Diferenciar entre `faltan pesos`, `sobran pesos` y `hay evaluaciones sin nota`.
- La escala personalizada debe tener máximo mayor a `0`; opcionalmente permitir
  una mínima aprobatoria para mensajes como `necesitas 6.0 para aprobar`.
- Redondear a 2 decimales.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de calificación ponderada` |
| Meta description | `Calcula tu calificación final con actividades, exámenes y proyectos de distinto peso porcentual.` |
| H1 | `Calculadora de calificación ponderada` |
| Keyword principal | `calculadora calificacion ponderada` |
| Keywords secundarias | `promedio ponderado notas`, `calificacion final`, `peso de evaluaciones`, `que nota necesito en el final`, `calcular nota necesaria` |

Incluir un ejemplo resuelto cerca de la calculadora:

```text
Tareas: 30% con 9
Examen: 40% con 8
Proyecto: 30% con 10
Resultado: 8.9
```

### FAQs sugeridas

- ¿Qué significa calificación ponderada?
- ¿Los pesos deben sumar 100%?
- ¿Qué pasa si tengo evaluaciones pendientes?
- ¿Cómo calculo qué nota necesito en el examen final?
- ¿Puedo usar escala de 0 a 100?

---

## Pruebas sugeridas

- `9*30% + 8*40% + 10*30%` produce `8.9`.
- Peso total `80%` muestra pendiente `20%`.
- Peso total `120%` muestra excedente.
- Calificación fuera de escala muestra error.
- Promedio del peso evaluado se calcula cuando el peso calificado es menor a
  `100%`.
- Con acumulado `6.5`, peso pendiente `20%` y meta `8.0`, nota necesaria produce
  `7.5`.
- Si la nota necesaria supera el máximo de escala, la meta aparece como no
  alcanzable.
- Si la nota necesaria es menor o igual a `0`, la meta aparece como ya alcanzada.
- Pesos `33.33 + 33.33 + 33.34` se consideran `100%`.

