# Especificación v1 - Calculadora de frecuencia cardíaca máxima

## Descripción general

Herramienta para estimar la frecuencia cardíaca máxima (FCM) a partir de la edad
usando fórmulas conocidas. La calculadora debe mostrar que el resultado es una
estimación poblacional, no una medición individual ni una indicación médica.

**Arquitectura:** todo el cálculo ocurre en el cliente. No requiere backend,
base de datos ni llamadas a APIs externas.

---

## Objetivo de producto

- Estimar frecuencia cardíaca máxima con una fórmula principal.
- Permitir comparar fórmulas comunes sin abrumar.
- Mostrar rangos orientativos de intensidad por porcentaje de FCM.
- Reforzar que medicamentos, condición física y salud cardiovascular pueden alterar el resultado.
- Generar una página estática optimizada para SEO en Astro.

---

## Alcance recomendado

### MVP

- Edad.
- Fórmula: `Tanaka` por defecto y `220 - edad` como alternativa.
- Resultado principal en latidos por minuto.
- Rangos orientativos de intensidad: baja, moderada, vigorosa y alta.
- Copiar resultado y limpiar formulario.
- Aviso de salud visible.

### Fase 2

- Comparador de fórmulas adicionales.
- Integración con calculadora de zonas de frecuencia cardíaca.
- Historial en `sessionStorage`.
- Tabla por edades frecuentes.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL pública recomendada | `/salud/calculadora-de-frecuencia-cardiaca-maxima` |
| Archivo Astro recomendado | `src/pages/salud/calculadora-de-frecuencia-cardiaca-maxima.astro` |
| Lógica de cálculo | `src/lib/calculators/salud/calculadora-de-frecuencia-cardiaca-maxima/maxHeartRate.ts` |
| Pruebas unitarias | `src/lib/calculators/salud/calculadora-de-frecuencia-cardiaca-maxima/maxHeartRate.test.ts` |
| Categoría | `salud` |
| Locale base | `es-MX` |

---

## Comportamiento mobile-first

- La calculadora debe aparecer en el primer viewport.
- Mostrar un único resultado grande en bpm.
- La selección de fórmula debe ser un control segmentado o selector compacto.
- Las zonas por porcentaje deben mostrarse como lista escaneable, no como tabla grande en móvil.
- No depender solo del color para diferenciar intensidades.

---

## Flujo principal MVP

**Ejemplo:** Tengo `35 años`. ¿Cuál es mi frecuencia cardíaca máxima estimada?

### Inputs del MVP

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Edad | Texto numérico | `15-100` | vacío |
| Fórmula | Selector | `Tanaka`, `220 - edad` | `Tanaka` |

### Outputs principales

- Frecuencia cardíaca máxima estimada.
- Tabla breve de porcentajes: 50%, 60%, 70%, 80%, 85%, 90%.
- Mensaje de interpretación.
- Advertencia si el usuario reporta medicación que altera el pulso.

---

## Fórmulas

Fórmula Tanaka:

```text
fcm = 208 - (0.7 * edad)
```

Fórmula clásica:

```text
fcm = 220 - edad
```

Rango por porcentaje:

```text
bpm_objetivo = fcm * (porcentaje / 100)
```

Redondear bpm al entero más cercano.

---

## Validaciones y estados

- Edad debe estar entre `15` y `100`.
- Si la edad está fuera de rango, mostrar error y no calcular.
- Si el usuario marca "uso medicamentos que alteran el pulso", mostrar aviso de consulta profesional.
- No usar el resultado para diagnosticar capacidad física.
- No mostrar zonas de entrenamiento como prescripción personalizada.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de frecuencia cardíaca máxima` |
| Meta description | `Estima tu frecuencia cardíaca máxima por edad y consulta rangos orientativos de intensidad en latidos por minuto.` |
| H1 | `Calculadora de frecuencia cardíaca máxima` |
| Keyword principal | `frecuencia cardiaca maxima calculadora` |
| Keywords secundarias | `fcm por edad`, `220 menos edad`, `formula tanaka frecuencia cardiaca` |

### FAQs sugeridas

- ¿Qué es la frecuencia cardíaca máxima?
- ¿Cuál fórmula conviene usar?
- ¿Por qué mi pulso real puede ser diferente?
- ¿Esto reemplaza una prueba de esfuerzo?

---

## Referencias sugeridas

- American Heart Association: tabla de frecuencias cardíacas objetivo.
- CDC: medición de intensidad de actividad física.

---

## Pruebas sugeridas

- Edad `40` con fórmula clásica produce `180`.
- Edad `40` con Tanaka produce `180`.
- Edad `30` con Tanaka produce `187`.
- Edad fuera de rango muestra error.
- Porcentaje `85%` de `180` produce `153`.

