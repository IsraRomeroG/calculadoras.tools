# Especificación v2 - Calculadora de calorías quemadas por ejercicio

## Descripción general

Herramienta para estimar las calorías totales y activas consumidas durante una
actividad física usando peso, duración y un valor MET documentado.

La calculadora debe ayudar al usuario a elegir una actividad comparable a la que
realmente realizó mediante variantes concretas de ritmo, velocidad o esfuerzo.
El resultado siempre se presenta como una estimación, porque el gasto real
depende de intensidad, técnica, condición física, composición corporal,
eficiencia de movimiento y mediciones individuales.

**Arquitectura:** todo el cálculo ocurre en el cliente. No requiere backend,
base de datos ni llamadas a APIs externas. Las actividades y sus variantes se
definen con datos locales versionados.

---

## Objetivo de producto

La calculadora debe responder tres preguntas:

1. ¿Elegí una actividad comparable a la que realmente hice?
2. ¿Cuántas calorías consumí en total y cuántas fueron adicionales al reposo?
3. ¿Cómo cambiaría el resultado con otro ritmo o duración?

### Objetivos específicos

- Estimar calorías totales y calorías activas por sesión.
- Facilitar la selección de una variante concreta de la actividad.
- Mostrar de forma transparente el MET y la descripción utilizados.
- Comparar variantes cercanas de una misma actividad cuando existan.
- Mostrar proyecciones útiles para distintas duraciones.
- Explicar por qué el resultado puede diferir de relojes y aplicaciones.
- Generar una página estática optimizada para SEO en Astro.

### No objetivos del MVP

- Medir el gasto energético real de una persona.
- Prescribir ejercicio o intensidad.
- Estimar un déficit calórico clínico.
- Recomendar comer de vuelta las calorías calculadas.
- Combinar sesiones con varias actividades.

---

## Alcance recomendado

### MVP

- Peso en kilogramos o libras.
- Actividad popular o búsqueda en una lista local.
- Variante concreta por ritmo, velocidad o esfuerzo.
- Duración en minutos con accesos rápidos.
- MET manual dentro de opciones avanzadas.
- Resultado principal: calorías totales y calorías activas por sesión.
- Datos secundarios: MET utilizado, kcal/min y proyecciones por duración.
- Comparación con variantes cercanas de la misma actividad.
- Copiar resultado, probar ejemplo y limpiar formulario.
- Avisos visibles sobre estimación, MET estándar y relación con TDEE.

### Fase 2

- Lista ampliada de actividades.
- Entrenamiento por intervalos con varias actividades y duraciones.
- Historial en `sessionStorage`.
- Exportar sesión a CSV.
- Modo personalizado con MET corregido usando edad, altura y sexo usados por la
  ecuación, claramente separado del cálculo estándar.
- Catálogos específicos para adultos mayores y usuarios de silla de ruedas.

---

## Ruta y archivos recomendados

| Elemento | Valor |
|----------|-------|
| URL canónica | `/salud/calculadora-de-calorias-quemadas-por-ejercicio` |
| Archivo Astro | `src/pages/salud/calculadora-de-calorias-quemadas-por-ejercicio.astro` |
| Lógica de cálculo | `src/lib/calculators/salud/calculadora-de-calorias-quemadas-por-ejercicio/exerciseCalories.ts` |
| Datos de actividades | `src/lib/calculators/salud/calculadora-de-calorias-quemadas-por-ejercicio/activities.ts` |
| Pruebas unitarias | `src/lib/calculators/salud/calculadora-de-calorias-quemadas-por-ejercicio/exerciseCalories.test.ts` |
| Categoría | `salud` |
| Locale base | `es-MX` |

No crear una ruta alternativa en `/fitness` mientras no exista esa categoría.
Si la ruta cambia después de publicarse, mover la página canónica y añadir un
redirect `301` en Apache; no conservar páginas Astro duplicadas.

---

## Público y limitaciones

- El cálculo estándar está pensado como orientación general para adultos.
- El Compendio de Actividades Físicas 2024 para adultos está orientado a edades
  de `19-59` años.
- Existen compendios separados para adultos mayores y usuarios de silla de
  ruedas; el MVP no debe asumir que el catálogo estándar representa igualmente
  a esos grupos.
- Los valores MET estándar sirven como referencia poblacional y no sustituyen
  mediciones individuales.

---

## Experiencia mobile first

### Principios

- Un único flujo vertical antes del resultado.
- Controles táctiles con altura mínima de `48px`.
- Sin tablas horizontales en móvil.
- Resultado principal visible inmediatamente después de calcular.
- Opciones avanzadas cerradas por defecto.
- Texto breve en el formulario y explicaciones amplias después del resultado.

### Orden del flujo móvil

1. Actividades populares como botones o tarjetas rápidas.
2. Acción `Buscar otra actividad`.
3. Variante concreta de ritmo, velocidad o esfuerzo.
4. Peso y selector segmentado `kg` / `lb`.
5. Duración con accesos rápidos `15`, `30`, `45` y `60 min`, más campo
   personalizado.
6. Opciones avanzadas para ingresar un MET manual.
7. Botón principal de ancho completo `Calcular calorías`.
8. Resultado con calorías totales y activas.
9. Comparación de variantes y proyecciones.
10. Metodología, limitaciones y preguntas frecuentes.

### Comportamiento responsive

- En móvil, formulario y resultado se muestran apilados.
- En escritorio amplio, formulario y resultado pueden mostrarse en dos columnas.
- Después de un cálculo válido, mover el foco al encabezado del resultado y
  desplazarlo a la vista respetando `prefers-reduced-motion`.
- Las actividades frecuentes se muestran como tarjetas apiladas en móvil, no
  como tabla.
- No usar únicamente color para comunicar intensidad o estados.

---

## Flujo principal MVP

**Ejemplo:** peso `70 kg`, correr a `10 km/h` durante `30 minutos`.

El usuario debe obtener:

- Calorías totales aproximadas durante la sesión.
- Calorías activas aproximadas por encima del reposo.
- MET y descripción exacta utilizados.
- Comparación con ritmos cercanos.
- Proyección para otras duraciones.

### Inputs del MVP

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Actividad | Selector con búsqueda | catálogo local | `Caminar` |
| Variante | Selector o tarjetas | variantes de la actividad | variante moderada |
| Peso | Texto numérico | `20-250 kg` | vacío |
| Unidad de peso | Selector segmentado | `kg`, `lb` | `kg` |
| Duración | Texto numérico y accesos rápidos | `1-720 min` | `30` |
| MET manual | Texto numérico avanzado | `1-25` | vacío |

### Actividades populares iniciales

Mostrar accesos rápidos para:

- Caminar.
- Correr.
- Bicicleta.
- Entrenamiento de fuerza.
- Natación.
- Yoga.

El catálogo inicial debe contener entre `20` y `30` variantes de alta demanda,
incluyendo también elíptica, remo, escaleras, senderismo, baile, HIIT y fútbol.

---

## Modelo de actividades

Cada valor MET debe corresponder a una actividad o variante documentada. No
inventar intensidades interpolando valores ni modificar los MET publicados.

```ts
type ExerciseActivity = {
  id: string;
  label: string;
  category: string;
  popular?: boolean;
  variants: ExerciseVariant[];
};

type ExerciseVariant = {
  id: string;
  label: string;
  description: string;
  met: number;
  intensity: "light" | "moderate" | "vigorous";
  source: "2024-adult-compendium";
  sourceCode: string;
  isEstimatedBySource?: boolean;
};
```

### Ejemplo conceptual

```ts
{
  id: "walking",
  label: "Caminar",
  popular: true,
  category: "walking",
  variants: [
    {
      id: "walking-slow-level",
      label: "Lento",
      description: "3.2-3.9 km/h, superficie plana",
      met: 2.8,
      intensity: "light",
      source: "2024-adult-compendium",
      sourceCode: "17152"
    },
    {
      id: "walking-moderate-level",
      label: "Moderado",
      description: "4.5-5.5 km/h, superficie plana",
      met: 3.8,
      intensity: "moderate",
      source: "2024-adult-compendium",
      sourceCode: "17190"
    },
    {
      id: "walking-brisk-level",
      label: "Rápido",
      description: "5.6-6.3 km/h, superficie plana",
      met: 4.8,
      intensity: "moderate",
      source: "2024-adult-compendium",
      sourceCode: "17200"
    }
  ]
}
```

### Reglas del catálogo

- Conservar el código y fuente de cada variante.
- Traducir la descripción para el usuario sin alterar su significado.
- Mostrar velocidad tanto en `km/h` como en `mph` cuando sea útil.
- Marcar internamente los valores que la fuente identifica como estimados.
- Comparar solamente variantes pertenecientes a la misma actividad.
- Clasificar intensidad estándar como:
  - Ligera: menos de `3.0 MET`.
  - Moderada: `3.0-5.9 MET`.
  - Vigorosa: `6.0 MET` o más.

---

## Fórmulas

### Conversión de peso

```text
peso_kg = peso_lb * 0.45359237
```

### Calorías totales

Representan todo el gasto estimado durante la sesión, incluido el gasto que
habría ocurrido en reposo.

```text
kcal_totales_por_minuto = MET * 3.5 * peso_kg / 200
kcal_totales = kcal_totales_por_minuto * minutos
```

### Calorías activas

Representan el gasto estimado adicional al reposo durante la sesión.

```text
MET_activo = max(MET - 1, 0)
kcal_activas_por_minuto = MET_activo * 3.5 * peso_kg / 200
kcal_activas = kcal_activas_por_minuto * minutos
```

### Reglas de cálculo

- Si el usuario activa e ingresa un MET manual válido, usar ese valor en lugar
  del MET de la variante seleccionada.
- Mostrar claramente `MET manual utilizado` cuando aplique.
- Mantener precisión completa durante el cálculo.
- Redondear calorías de sesión al entero más cercano solo al presentar.
- Mostrar kcal/min con un decimal.
- Las proyecciones reutilizan el mismo MET y peso; no asumen que la intensidad
  pueda sostenerse durante cualquier duración.

---

## Resultado

### Jerarquía

1. **Resultado principal:** calorías totales aproximadas.
2. **Resultado complementario:** calorías activas aproximadas.
3. Actividad, variante, duración, peso y MET utilizados.
4. Comparación con variantes cercanas.
5. Proyecciones por duración.
6. Explicación y advertencias.

### Mensaje principal sugerido

> Aproximadamente **368 kcal totales** durante la sesión.  
> De ellas, unas **331 kcal son activas**, adicionales al reposo.

### Datos secundarios

- `kcal/min` totales.
- `kcal/min` activas.
- MET utilizado.
- Clasificación de intensidad.
- Fuente y código de la variante.

### Comparación de variantes

Mostrar hasta dos variantes cercanas de la misma actividad, por ejemplo:

| Variante | MET | kcal totales |
|----------|-----|---------------|
| Correr a 8 km/h | `8.5` | valor calculado |
| Correr a 10 km/h | `9.3` | valor calculado |
| Correr a 10.8 km/h | `10.5` | valor calculado |

En móvil, presentar cada fila como tarjeta compacta o lista; evitar scroll
horizontal.

### Proyecciones

Mostrar calorías totales y activas para `15`, `30`, `45` y `60 minutos`,
excluyendo la duración actual si coincide. Incluir el mensaje:

> La proyección supone el mismo ritmo o esfuerzo durante todo el tiempo.

No destacar `kcal por hora` como resultado principal.

---

## Estados e interacción

### Estado inicial

- Mostrar una explicación breve de lo que aparecerá.
- Mantener deshabilitado o no procesar el cálculo hasta disponer de peso,
  duración y variante válidos.
- Incluir una acción `Probar ejemplo`.

### Estado válido

- Mostrar resultado completo.
- Anunciar la actualización mediante una región `aria-live="polite"`.
- Permitir copiar un resumen que incluya ambos tipos de calorías, actividad,
  duración, peso y MET.

### Estado inválido

- Mostrar errores junto al campo correspondiente.
- Aplicar `aria-invalid="true"` al control inválido.
- Mover el foco al primer campo con error al enviar.
- No conservar un resultado anterior que pueda confundirse con el nuevo intento.

### Cambio de unidades

- Convertir el peso mostrado al cambiar entre `kg` y `lb`.
- Mantener internamente el peso canónico en kilogramos para evitar acumulación
  de errores por conversiones sucesivas.

### MET manual

- Estar dentro de un bloque `Opciones avanzadas` cerrado por defecto.
- Requerir una acción explícita para activarlo.
- Mostrar una advertencia de que reemplazará el MET de la variante.
- Al desactivarlo, volver a utilizar el MET documentado de la variante.

---

## Validaciones y advertencias

### Errores bloqueantes

- Peso requerido y dentro de `20-250 kg` o su equivalente en libras.
- Duración requerida, entera y dentro de `1-720 minutos`.
- Actividad y variante requeridas salvo que exista un MET manual válido.
- MET manual dentro de `1-25` y con máximo un decimal.
- Rechazar valores no finitos, negativos y formatos ambiguos.
- Aceptar punto o coma como separador decimal.

### Advertencias no bloqueantes

- Duración superior a `240 minutos`: confirmar que el mismo esfuerzo se sostuvo
  durante todo el periodo.
- MET igual o superior a `15`: intensidad extremadamente alta y difícil de
  sostener.
- MET manual activo: el resultado ya no usa el valor documentado de la variante.
- Recordar que algunos relojes muestran calorías activas y otros calorías
  totales.
- No sumar automáticamente el resultado a una meta calórica basada en TDEE,
  porque el factor de actividad podría incluir ya parte del ejercicio.

### Mensaje de seguridad

> Esta herramienta ofrece una estimación educativa y no mide tu gasto real. No
> la uses como prescripción de ejercicio ni para definir un déficit calórico
> clínico.

---

## Accesibilidad

- Usar elementos `form`, `fieldset`, `legend`, `label` y botones semánticos.
- Todos los controles deben poder utilizarse con teclado.
- El selector con búsqueda debe tener una alternativa accesible y anunciar la
  cantidad de coincidencias.
- No depender únicamente del color para identificar intensidad.
- Mantener contraste suficiente en errores, advertencias y resultados.
- El resultado debe tener un encabezado enfocable con `tabindex="-1"`.
- Respetar `prefers-reduced-motion` al desplazar el resultado.

---

## SEO y contenido

| Elemento | Valor recomendado |
|----------|-------------------|
| Title | `Calculadora de calorías quemadas por ejercicio y actividad` |
| Meta description | `Estima calorías totales y activas según tu peso, duración y actividad. Compara ritmos de caminar, correr, bicicleta y más.` |
| H1 | `Calculadora de calorías quemadas por ejercicio` |
| Keyword principal | `calculadora calorias quemadas ejercicio` |
| Keywords secundarias | `calorias activas`, `calorias por actividad`, `MET ejercicio`, `calorias quemadas correr`, `calorias quemadas caminar` |

### Contenido recomendado

- Diferencia entre calorías totales y activas.
- Cómo elegir una actividad o ritmo comparable.
- Qué es un MET y cuáles son sus limitaciones.
- Por qué el reloj o aplicación puede mostrar otro resultado.
- Relación entre calorías de ejercicio y TDEE.
- Metodología y fuente de los valores.

### FAQs sugeridas

- ¿Qué diferencia hay entre calorías totales y calorías activas?
- ¿Qué es un MET?
- ¿Cómo elijo la intensidad correcta?
- ¿Por qué mi reloj muestra otro resultado?
- ¿Las calorías quemadas son exactas?
- ¿Puedo ingresar un MET manual?
- ¿Debo comer las calorías que quemé?
- ¿Puedo sumar estas calorías a mi TDEE?

---

## Referencias

- [Compendio de Actividades Físicas](https://pacompendium.com/).
- [Compendio 2024 para adultos](https://pacompendium.com/adult-compendium/).
- [MET corregidos y límites del MET estándar](https://pacompendium.com/corrected-mets/).
- [CDC: actividad física](https://www.cdc.gov/physical-activity/).

La página debe citar el Compendio y explicar que sus valores MET estandarizan el
costo energético de actividades, pero no determinan con precisión el gasto de
una persona.

---

## Casos de prueba recomendados

### Cálculo

- `70 kg`, MET `10`, `30 min` produce `367.5 kcal` totales.
- `70 kg`, MET `10`, `30 min` produce `330.75 kcal` activas.
- MET `1` produce `0 kcal` activas.
- MET menor que `1`, si llegara desde datos internos, nunca produce calorías
  activas negativas.
- kcal/min y proyecciones se calculan desde valores sin redondear.
- El resultado mostrado redondea calorías de sesión al entero más cercano.

### Unidades y entrada

- `154 lb` se convierte aproximadamente a `69.85 kg`.
- Cambiar repetidamente entre `kg` y `lb` no degrada el peso canónico.
- Se aceptan `70.5` y `70,5`.
- Duración `0`, decimal o superior a `720` muestra error.
- Peso fuera del rango muestra error.

### Actividades y MET

- Seleccionar una variante utiliza su MET documentado.
- Cambiar de variante actualiza comparación y resultado.
- Las comparaciones solo incluyen variantes de la misma actividad.
- MET manual activo reemplaza el MET de la variante.
- Desactivar MET manual restaura el MET de la variante.
- MET manual inválido bloquea el cálculo.

### Estados y accesibilidad

- El estado inicial no muestra cifras que parezcan un resultado.
- Un cálculo válido mueve el foco al resultado.
- Un envío inválido mueve el foco al primer campo con error.
- Limpiar restaura valores y estado inicial.
- Copiar resultado incluye calorías totales, activas y MET utilizado.
- La interfaz no requiere scroll horizontal a `320px` de ancho.

---

## Criterios de aceptación del MVP

- El usuario puede completar el flujo principal con una sola mano en una
  pantalla móvil.
- El resultado diferencia claramente calorías totales y activas.
- Toda variante predefinida tiene MET, descripción, código y fuente.
- La comparación utiliza valores documentados, no intensidades inventadas.
- El MET manual no puede sobrescribir silenciosamente una variante.
- El resultado explica que es una estimación y por qué puede diferir de un reloj.
- La página funciona completamente sin backend ni solicitudes externas.
- Existen pruebas unitarias para fórmulas, conversiones, validaciones y selección
  de MET.
