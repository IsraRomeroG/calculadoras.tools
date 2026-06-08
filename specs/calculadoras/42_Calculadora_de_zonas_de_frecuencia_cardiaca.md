# Especificación v1 - Calculadora de zonas de frecuencia cardíaca

## Descripción general

Herramienta para estimar zonas de frecuencia cardíaca de entrenamiento usando la
frecuencia máxima estimada o una FCM manual. Debe incluir método por porcentaje
directo de FCM y método Karvonen con frecuencia en reposo.

**Arquitectura:** todo el cálculo ocurre en el cliente. No requiere backend,
base de datos ni llamadas a APIs externas.

---

## Objetivo de producto

- Calcular rangos de bpm para zonas de entrenamiento.
- Permitir método simple y método Karvonen.
- Mostrar zonas de forma clara para caminar, correr, cardio y ejercicio general.
- Comunicar límites: estimación orientativa, no indicación médica.
- Generar una página estática optimizada para SEO en Astro.

---

## Alcance recomendado

### MVP

- Edad.
- FCM manual opcional.
- Frecuencia en reposo opcional para Karvonen.
- Método: `% de FCM` o `Karvonen`.
- Zonas 1 a 5 con porcentajes editables solo en fase futura.
- Copiar resultado y limpiar formulario.
- Aviso de salud visible.

### Fase 2

- Personalizar porcentajes por deporte.
- Guardar perfil en `sessionStorage`.
- Integración desde frecuencia cardíaca máxima.
- Exportar zonas a CSV.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL pública recomendada | `/salud/calculadora-de-zonas-de-frecuencia-cardiaca` |
| Archivo Astro recomendado | `src/pages/salud/calculadora-de-zonas-de-frecuencia-cardiaca.astro` |
| Lógica de cálculo | `src/lib/calculators/salud/calculadora-de-zonas-de-frecuencia-cardiaca/heartRateZones.ts` |
| Pruebas unitarias | `src/lib/calculators/salud/calculadora-de-zonas-de-frecuencia-cardiaca/heartRateZones.test.ts` |
| Categoría | `salud` |
| Locale base | `es-MX` |

---

## Comportamiento mobile-first

- Mostrar las cinco zonas como tarjetas compactas apiladas.
- Cada zona debe incluir porcentaje, rango bpm y etiqueta corta.
- Usar tooltip o texto breve para explicar Karvonen.
- En móvil, evitar gráficos grandes; una barra segmentada simple es suficiente.
- No usar solo color para comunicar intensidad.

---

## Flujo principal MVP

**Ejemplo:** Tengo `35 años`, pulso en reposo de `60 bpm` y quiero calcular mis
zonas con Karvonen.

### Inputs del MVP

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Edad | Texto numérico | `15-100` | vacío |
| FCM manual | Texto numérico opcional | `80-240` | vacío |
| Frecuencia en reposo | Texto numérico opcional | `35-120` | vacío |
| Método | Selector | `% de FCM`, `Karvonen` | `% de FCM` |

### Zonas predeterminadas

| Zona | Porcentaje | Etiqueta |
|------|------------|----------|
| Zona 1 | `50%-60%` | Muy suave |
| Zona 2 | `60%-70%` | Suave |
| Zona 3 | `70%-80%` | Moderada |
| Zona 4 | `80%-90%` | Intensa |
| Zona 5 | `90%-100%` | Máxima |

---

## Fórmulas

Si no hay FCM manual:

```text
fcm = 208 - (0.7 * edad)
```

Método `% de FCM`:

```text
bpm_min = fcm * (porcentaje_min / 100)
bpm_max = fcm * (porcentaje_max / 100)
```

Método Karvonen:

```text
reserva = fcm - frecuencia_reposo
bpm_min = frecuencia_reposo + reserva * (porcentaje_min / 100)
bpm_max = frecuencia_reposo + reserva * (porcentaje_max / 100)
```

---

## Validaciones y estados

- Para Karvonen, frecuencia en reposo es obligatoria.
- FCM manual debe ser mayor que frecuencia en reposo.
- Edad se usa solo si FCM manual está vacía.
- Si el usuario usa medicamentos que alteran el pulso, mostrar aviso.
- Redondear bpm al entero más cercano.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de zonas de frecuencia cardíaca` |
| Meta description | `Calcula zonas de frecuencia cardíaca por edad, FCM manual o método Karvonen con frecuencia en reposo.` |
| H1 | `Calculadora de zonas de frecuencia cardíaca` |
| Keyword principal | `zonas frecuencia cardiaca calculadora` |
| Keywords secundarias | `zonas de entrenamiento`, `karvonen calculadora`, `zona 2 frecuencia cardiaca` |

### FAQs sugeridas

- ¿Qué son las zonas de frecuencia cardíaca?
- ¿Qué diferencia hay entre FCM y Karvonen?
- ¿Qué es la frecuencia cardíaca en reposo?
- ¿Las zonas son iguales para todos?

---

## Referencias sugeridas

- American Heart Association: rangos de frecuencia cardíaca objetivo.
- CDC: intensidad moderada y vigorosa.

---

## Pruebas sugeridas

- FCM `180`, zona 2 produce `108-126 bpm`.
- Edad `40` sin FCM manual estima `180 bpm` por Tanaka.
- Karvonen con FCM `180` y reposo `60`, zona 2 produce `132-144 bpm`.
- Karvonen sin reposo muestra error.
- FCM menor que reposo muestra error.

