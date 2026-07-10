# Especificación v2 - Calculadora de tiempo de cocción por peso

## Descripción general

Herramienta para estimar tiempo de cocción a partir del peso y una tasa de
tiempo por unidad, ya sea ingresada manualmente o tomada de una referencia
editorial por alimento y método. Es una herramienta de planificación: el tiempo
ayuda a organizar la cocina, pero la seguridad debe verificarse con temperatura
interna, no solo con tiempo.

**Arquitectura:** todo el cálculo ocurre en el cliente. Los presets se mantienen
como datos locales editables y no requieren backend.

---

## Objetivo de producto

- Calcular tiempo estimado o rango estimado usando minutos por kg o por lb.
- Permitir un modo manual para quien ya conoce su tasa de cocción.
- Ofrecer referencias editoriales básicas por alimento y método para que la
  calculadora aporte valor sin exigir que el usuario traiga la tasa.
- Añadir minutos extra de cocción y tiempo de reposo sin mezclar conceptos.
- Mostrar cuándo empezar a revisar, hora estimada de fin y hora de servir.
- Reforzar que el tiempo no confirma cocción segura.
- Enlazar a la referencia interna de temperatura de horno y temperatura interna.
- Generar una página estática optimizada para SEO en Astro.

---

## Alcance recomendado

### MVP

- Peso y unidad.
- Dos modos de cálculo:
  - **Usar una referencia:** alimento + método con rango editorial de minutos
    por unidad.
  - **Usar mi tasa:** minutos por unidad editables.
- Presets editoriales mínimos por alimento y método, con rango mínimo/máximo,
  fuente visible y fecha de revisión.
- Minutos extra de cocción.
- Tiempo de reposo.
- Hora de inicio opcional; si queda vacía, usar la hora actual del cliente.
- Resultado: tiempo activo, rango recomendado para revisar, hora estimada de fin
  de cocción y hora estimada de servir.
- Copiar resultado y limpiar formulario.
- Enlace a `/cocina/conversor-de-temperatura-de-horno`.

### Fase 2

- Historial en `sessionStorage`.
- Planificador de varias preparaciones.
- Presets personalizados guardados localmente.
- Matriz editorial más amplia por alimento, corte, método y estado inicial.
- Ajustes opcionales como congelado, con hueso, relleno o pieza muy gruesa, solo
  si pueden explicarse sin dar falsa precisión.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL pública recomendada | `/cocina/calculadora-tiempo-coccion-por-peso` |
| Archivo Astro recomendado | `src/pages/cocina/calculadora-tiempo-coccion-por-peso.astro` |
| Lógica de cálculo | `src/lib/calculators/cocina/calculadora-tiempo-coccion-por-peso/cookingTime.ts` |
| Datos editoriales | `src/lib/calculators/cocina/calculadora-tiempo-coccion-por-peso/cookingPresets.ts` |
| Pruebas unitarias | `src/lib/calculators/cocina/calculadora-tiempo-coccion-por-peso/cookingTime.test.ts` |
| Categoría | `cocina` |
| Locale base | `es-MX` |

---

## Comportamiento mobile-first

- El primer viewport móvil debe mostrar la calculadora, no un bloque editorial
  largo.
- Layout de una columna en móvil, con resultado principal inmediatamente después
  de los controles esenciales.
- Modo de cálculo, unidad de peso y unidad de tasa deben usar controles
  segmentados o selects compactos.
- Inputs numéricos con `inputmode="decimal"` y soporte para coma decimal.
- Tiempo activo/rango como resultado principal.
- "Empieza a revisar desde" y hora de servir como resultados secundarios.
- Aviso visible y compacto de usar termómetro de alimentos.
- No mostrar presets como universales; etiquetarlos como "referencia
  orientativa" e incluir fuente/fecha.
- Mantener dimensiones estables para evitar saltos al cambiar entre modo manual
  y modo referencia.

---

## Flujo principal MVP

**Ejemplo manual:** Pieza de `2.5 kg`, a `40 minutos por kg`, más `20 minutos`
extra de cocción.

**Ejemplo con referencia:** Pollo entero al horno de `2.5 kg`, con referencia de
`35-45 min/kg`, más `10 minutos` de reposo.

### Inputs del MVP

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Modo de cálculo | Control segmentado | `referencia`, `manual` | `referencia` |
| Alimento y método | Selector | preset activo | primer preset recomendado |
| Peso | Texto numérico | `> 0` | vacío |
| Unidad de peso | Selector | `kg`, `lb` | `kg` |
| Minutos por unidad | Texto numérico | `> 0`; solo modo manual | vacío |
| Unidad de tasa | Selector | `min/kg`, `min/lb` | `min/kg` |
| Minutos extra de cocción | Texto numérico | `>= 0` minutos | `0` |
| Tiempo de reposo | Texto numérico | `>= 0` minutos | `0` |
| Hora de inicio | Hora opcional | hora válida | vacío; usar ahora |

### Outputs principales

- Tiempo activo estimado o rango de tiempo activo.
- Empieza a revisar desde.
- Tiempo total incluyendo reposo.
- Hora estimada o rango de terminar cocción.
- Hora estimada o rango de servir.
- Conversión de peso usada.
- Preset/fuente usada cuando aplique.
- Recordatorio de verificar temperatura interna con termómetro.

---

## Fórmulas

Normalizar peso a la unidad de la tasa:

```text
1 kg = 2.2046226218 lb
```

Modo manual:

```text
tiempo_activo_min = peso_en_unidad_tasa * minutos_por_unidad + minutos_extra_coccion
tiempo_total_min = tiempo_activo_min + tiempo_reposo
hora_fin_coccion = hora_inicio + tiempo_activo_min
hora_servir = hora_inicio + tiempo_total_min
```

Modo referencia:

```text
tiempo_activo_min_min = peso_en_unidad_tasa * minutos_por_unidad_min + minutos_extra_coccion
tiempo_activo_min_max = peso_en_unidad_tasa * minutos_por_unidad_max + minutos_extra_coccion
tiempo_total_min_min = tiempo_activo_min_min + tiempo_reposo
tiempo_total_min_max = tiempo_activo_min_max + tiempo_reposo
hora_fin_coccion_min = hora_inicio + tiempo_activo_min_min
hora_fin_coccion_max = hora_inicio + tiempo_activo_min_max
hora_servir_min = hora_inicio + tiempo_total_min_min
hora_servir_max = hora_inicio + tiempo_total_min_max
```

`empieza_a_revisar` debe usar el límite inferior del tiempo activo. En modo
manual, coincide con `hora_fin_coccion`.

Redondear minutos mostrados a enteros para evitar falsa precisión: el límite
inferior puede redondearse hacia abajo para "empezar a revisar", y el límite
superior debe redondearse hacia arriba para no acortar la estimación visual.
Evitar mostrar decimales en horas finales.

---

## Validaciones y estados

- Peso y minutos por unidad deben ser mayores que cero.
- En modo referencia, el preset debe tener rango mínimo y máximo mayor que cero.
- Si el rango mínimo supera al máximo, mostrar error de datos y no calcular.
- Tiempos adicionales pueden ser cero.
- Mostrar advertencia si tiempo activo supera 24 horas.
- No inferir temperatura interna ni seguridad.
- Aceptar coma decimal en campos numéricos (`2,5`) y normalizarla a punto.
- Presets deben incluir fuente, fecha de revisión y nota breve de alcance.
- Mostrar copy de cautela cuando el preset dependa de grosor, hueso, relleno,
  horno real o temperatura inicial.

---

## Presets editoriales mínimos

Los presets son referencias orientativas, no instrucciones universales. Cada
registro debe incluir:

```ts
type CookingPreset = {
  id: string;
  label: string;
  food: string;
  method: string;
  rateUnit: "min/kg" | "min/lb";
  minMinutesPerUnit: number;
  maxMinutesPerUnit: number;
  restMinutesDefault?: number;
  sourceLabel: string;
  sourceUrl?: string;
  reviewedAt: string; // YYYY-MM-DD
  note: string;
};
```

Presets iniciales recomendados:

- Pollo entero al horno.
- Pavo entero al horno.
- Carne asada al horno.
- Cerdo asado al horno.
- Pescado entero al horno.
- Verduras asadas por peso.

Si no hay fuente editorial confiable para un preset, no incluirlo. En ese caso,
priorizar el modo manual y explicar que el usuario debe usar una referencia de
su receta.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de tiempo de cocción por peso` |
| Meta description | `Estima tiempo de cocción por kilogramo o libra, usa referencias orientativas, añade reposo y calcula cuándo revisar, terminar y servir.` |
| H1 | `Calculadora de tiempo de cocción` |
| Keyword principal | `tiempo coccion por peso` |
| Keywords secundarias | `minutos por kilo`, `tiempo horno por peso`, `hora terminar coccion`, `tiempo coccion pollo por kilo`, `tiempo coccion pavo por kilo` |

Contenido de apoyo recomendado:

- Explicar que la forma, grosor, horno, temperatura inicial y presencia de hueso
  cambian el tiempo real.
- Incluir enlace contextual a `/cocina/conversor-de-temperatura-de-horno` con
  texto tipo "consulta temperaturas de horno y temperatura interna segura".
- Repetir que la cocción segura se confirma con termómetro de alimentos.

---

## Pruebas sugeridas

- Modo manual: `2.5 kg * 40 min/kg + 20` produce `120 min`.
- Modo referencia: `2.5 kg * 35-45 min/kg + 20` produce rango `107.5-132.5 min`
  antes de redondeo visual.
- Reposo se suma después del tiempo activo y no altera la hora de fin de cocción.
- Conversión kg/lb conserva equivalencia.
- Hora de fin cruza medianoche correctamente.
- Peso cero muestra error.
- `2,5` se acepta como `2.5`.
- En modo referencia, un preset con `min > max` muestra error de datos.
- Si la hora de inicio está vacía, se usa una hora actual inyectable en tests.
- Copiar resultado incluye modo, peso, tiempo activo, hora de revisar y aviso de
  termómetro.

