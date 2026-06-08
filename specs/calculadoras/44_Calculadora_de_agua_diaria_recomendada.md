# Especificación v1 - Calculadora de agua diaria recomendada

## Descripción general

Herramienta para estimar una meta diaria orientativa de agua usando peso,
actividad, clima y condiciones seleccionadas por el usuario. Debe aclarar que
las necesidades de líquidos varían ampliamente y que parte del agua proviene de
alimentos y otras bebidas.

**Arquitectura:** todo el cálculo ocurre en el cliente. No requiere backend,
base de datos ni llamadas a APIs externas.

---

## Objetivo de producto

- Estimar litros y vasos de agua al día de forma sencilla.
- Ajustar por actividad física y clima cálido.
- Mostrar un rango, no una cifra rígida.
- Incluir avisos para embarazo, lactancia, enfermedad renal/cardiaca o restricciones médicas.
- Generar una página estática optimizada para SEO en Astro.

---

## Alcance recomendado

### MVP

- Peso.
- Nivel de actividad.
- Clima o sudoración.
- Meta orientativa en litros, mililitros y vasos.
- Rango bajo/alto.
- Aviso de salud visible.
- Copiar resultado y limpiar formulario.

### Fase 2

- Ajuste por embarazo/lactancia con datos editoriales revisados.
- Plan de distribución durante el día.
- Historial en `sessionStorage`.
- Recordatorio exportable como texto.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL pública recomendada | `/salud/calculadora-de-agua-diaria` |
| Archivo Astro recomendado | `src/pages/salud/calculadora-de-agua-diaria.astro` |
| Lógica de cálculo | `src/lib/calculators/salud/calculadora-de-agua-diaria/dailyWater.ts` |
| Pruebas unitarias | `src/lib/calculators/salud/calculadora-de-agua-diaria/dailyWater.test.ts` |
| Categoría | `salud` |
| Locale base | `es-MX` |

---

## Comportamiento mobile-first

- Resultado principal en litros por día.
- Mostrar equivalencia en vasos como dato secundario.
- Usar selectores simples para actividad y clima.
- No mostrar un mensaje alarmista por no llegar a la meta.
- Mantener avisos médicos visibles pero compactos.

---

## Flujo principal MVP

**Ejemplo:** Peso `70 kg`, hago actividad moderada y vivo en clima cálido.
¿Cuánta agua diaria puedo tomar como referencia?

### Inputs del MVP

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Peso | Texto numérico | `20-250 kg` | vacío |
| Sistema de unidades | Selector | `kg`, `lb` | `kg` |
| Actividad | Selector | `Baja`, `Moderada`, `Alta` | `Moderada` |
| Clima / sudoración | Selector | `Normal`, `Cálido`, `Muy cálido` | `Normal` |
| Tamaño de vaso | Texto numérico | `100-1000 ml` | `250 ml` |

### Outputs principales

- Litros diarios estimados.
- Rango orientativo.
- Vasos equivalentes.
- Ajuste aplicado por actividad y clima.
- Aviso de variabilidad individual.

---

## Fórmulas

Base por peso:

```text
agua_base_ml = peso_kg * 35
```

Ajuste por actividad:

```text
baja = +0 ml
moderada = +350 ml
alta = +700 ml
```

Ajuste por clima:

```text
normal = +0 ml
calido = +300 ml
muy_calido = +600 ml
```

Rango:

```text
agua_total_ml = agua_base_ml + ajuste_actividad + ajuste_clima
rango_bajo = agua_total_ml * 0.85
rango_alto = agua_total_ml * 1.15
vasos = agua_total_ml / tamano_vaso_ml
```

---

## Validaciones y estados

- Peso debe estar entre `20` y `250 kg`.
- Tamaño de vaso debe estar entre `100` y `1000 ml`.
- Mostrar aviso si el usuario indica enfermedad renal/cardiaca o restricción de líquidos.
- No recomendar beber grandes cantidades de golpe.
- No usar para menores de edad en el MVP.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de agua diaria recomendada` |
| Meta description | `Estima cuánta agua tomar al día según peso, actividad y clima. Obtén litros, rango orientativo y vasos equivalentes.` |
| H1 | `Calculadora de agua diaria` |
| Keyword principal | `calculadora agua diaria` |
| Keywords secundarias | `cuanta agua tomar al dia`, `agua por peso`, `litros de agua diarios` |

### FAQs sugeridas

- ¿La meta incluye agua de alimentos?
- ¿Debo tomar más agua si hago ejercicio?
- ¿Qué pasa si tengo restricción médica de líquidos?
- ¿Cuántos vasos son un litro?

---

## Referencias sugeridas

- National Academies: Dietary Reference Intakes for Water.

---

## Pruebas sugeridas

- `70 kg` produce base `2450 ml`.
- Actividad alta suma `700 ml`.
- Clima muy cálido suma `600 ml`.
- Vaso `250 ml` convierte litros a vasos correctamente.
- Peso fuera de rango muestra error.

