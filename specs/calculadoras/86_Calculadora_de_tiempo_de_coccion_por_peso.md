# Especificación v1 - Calculadora de tiempo de cocción por peso

## Descripción general

Herramienta para estimar tiempo de cocción a partir del peso y una tasa de tiempo
por unidad ingresada o seleccionada por el usuario. Es una herramienta de
planificación; la seguridad debe verificarse con temperatura interna, no solo
con tiempo.

**Arquitectura:** todo el cálculo ocurre en el cliente. Los presets se mantienen
como datos locales editables y no requieren backend.

---

## Objetivo de producto

- Calcular tiempo estimado usando minutos por kg o por lb.
- Añadir tiempo fijo de preparación o reposo.
- Mostrar hora estimada de finalización.
- Reforzar que el tiempo no confirma cocción segura.
- Generar una página estática optimizada para SEO en Astro.

---

## Alcance recomendado

### MVP

- Peso y unidad.
- Minutos por unidad editables.
- Tiempo fijo adicional.
- Hora de inicio opcional.
- Resultado: tiempo total y hora estimada de fin.
- Copiar resultado y limpiar formulario.
- Enlace a temperatura de cocción.

### Fase 2

- Presets editoriales por alimento y método.
- Intervalos de tiempo mínimo/máximo.
- Historial en `sessionStorage`.
- Planificador de varias preparaciones.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL pública recomendada | `/cocina/calculadora-tiempo-coccion-por-peso` |
| Archivo Astro recomendado | `src/pages/cocina/calculadora-tiempo-coccion-por-peso.astro` |
| Lógica de cálculo | `src/lib/calculators/cocina/calculadora-tiempo-coccion-por-peso/cookingTime.ts` |
| Pruebas unitarias | `src/lib/calculators/cocina/calculadora-tiempo-coccion-por-peso/cookingTime.test.ts` |
| Categoría | `cocina` |
| Locale base | `es-MX` |

---

## Comportamiento mobile-first

- Tiempo total como resultado principal.
- Inputs de peso y minutos por unidad claramente vinculados.
- Hora de fin como resultado secundario.
- Aviso visible de usar termómetro de alimentos.
- No mostrar presets como universales.

---

## Flujo principal MVP

**Ejemplo:** Pieza de `2.5 kg`, a `40 minutos por kg`, más `20 minutos` fijos.

### Inputs del MVP

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Peso | Texto numérico | `> 0` | vacío |
| Unidad de peso | Selector | `kg`, `lb` | `kg` |
| Minutos por unidad | Texto numérico | `> 0` | vacío |
| Unidad de tasa | Selector | `min/kg`, `min/lb` | `min/kg` |
| Tiempo fijo adicional | Texto numérico | `>= 0` minutos | `0` |
| Tiempo de reposo | Texto numérico | `>= 0` minutos | `0` |
| Hora de inicio | Hora opcional | hora válida | ahora |

### Outputs principales

- Tiempo activo estimado.
- Tiempo total incluyendo reposo.
- Hora estimada de terminar cocción.
- Hora estimada de servir.
- Conversión de peso usada.

---

## Fórmulas

Normalizar peso a la unidad de la tasa:

```text
1 kg = 2.2046226218 lb
```

```text
tiempo_activo_min = peso_en_unidad_tasa * minutos_por_unidad + tiempo_fijo
tiempo_total_min = tiempo_activo_min + tiempo_reposo
hora_fin_coccion = hora_inicio + tiempo_activo_min
hora_servir = hora_inicio + tiempo_total_min
```

---

## Validaciones y estados

- Peso y minutos por unidad deben ser mayores que cero.
- Tiempos adicionales pueden ser cero.
- Mostrar advertencia si tiempo activo supera 24 horas.
- No inferir temperatura interna ni seguridad.
- Presets futuros deben incluir fuente y fecha de revisión.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de tiempo de cocción por peso` |
| Meta description | `Estima tiempo de cocción por kilogramo o libra, añade tiempo fijo y reposo, y calcula la hora de finalización.` |
| H1 | `Calculadora de tiempo de cocción` |
| Keyword principal | `tiempo coccion por peso` |
| Keywords secundarias | `minutos por kilo`, `tiempo horno por peso`, `hora terminar coccion` |

---

## Pruebas sugeridas

- `2.5 kg * 40 min/kg + 20` produce `120 min`.
- Reposo se suma después del tiempo activo.
- Conversión kg/lb conserva equivalencia.
- Hora de fin cruza medianoche correctamente.
- Peso cero muestra error.

