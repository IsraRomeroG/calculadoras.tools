# Especificación v2 - Calculadora de frecuencia cardíaca máxima

## Descripción general

Herramienta para estimar la frecuencia cardíaca máxima (FCM) a partir de la edad
usando fórmulas poblacionales conocidas. La calculadora debe ayudar a interpretar
el resultado sin presentarlo como una medición individual, una meta que se deba
alcanzar ni una indicación médica.

La experiencia principal debe ser muy breve: ingresar la edad, obtener la FCM
estimada con Tanaka y consultar dos rangos generales de intensidad. La comparación
con la fórmula clásica debe estar disponible como contexto secundario.

**Arquitectura:** todo el cálculo ocurre en el cliente. No requiere backend,
base de datos ni llamadas a APIs externas.

---

## Objetivo de producto

- Estimar la frecuencia cardíaca máxima con Tanaka como fórmula principal.
- Comunicar con claridad que la FCM es un límite estimado, no una frecuencia que
  se deba intentar mantener durante el ejercicio.
- Mostrar la diferencia frente a la fórmula clásica para evitar una falsa
  sensación de precisión.
- Traducir el resultado en rangos generales de actividad moderada y vigorosa.
- Derivar a la calculadora especializada cuando el usuario necesite zonas de
  entrenamiento más detalladas.
- Reforzar que medicamentos, condición física y salud cardiovascular pueden
  alterar la frecuencia cardíaca.
- Generar una página estática optimizada para SEO en Astro.

---

## Alcance recomendado

### MVP

- Edad como único input requerido.
- Estimación principal con fórmula Tanaka.
- Resultado principal grande en latidos por minuto.
- Texto visible que explique que la FCM no es una frecuencia que se deba
  mantener durante el ejercicio.
- Rangos generales de actividad moderada (`50%-70%`) y vigorosa (`70%-85%`).
- Comparación secundaria con la fórmula clásica `220 - edad`.
- CTA hacia la calculadora de zonas de frecuencia cardíaca.
- Copiar resultado y limpiar formulario.
- Aviso de salud siempre visible.

### Fase 2

- Comparador de fórmulas adicionales respaldadas por referencias.
- Recibir la edad o FCM desde otras calculadoras relacionadas.
- Tabla informativa por edades frecuentes dentro del contenido SEO.
- Historial opcional en `sessionStorage`, solo si existe una necesidad de
  producto demostrada.

### Fuera de alcance

- Medir la FCM real del usuario.
- Recomendar entrenamientos o prescribir intensidades personalizadas.
- Calcular zonas 1 a 5 o usar el método Karvonen; esas funciones corresponden a
  la calculadora de zonas de frecuencia cardíaca.
- Solicitar datos sobre medicamentos o diagnósticos.

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

### Primer viewport

- Mostrar H1 y una descripción breve.
- Mostrar el campo de edad y el botón principal sin contenido accesorio entre
  ambos.
- Mostrar el resultado inmediatamente debajo del formulario cuando exista.
- Evitar que contenido SEO, comparadores o explicaciones desplacen la
  calculadora fuera del primer viewport.

### Controles e interacción

- Usar un campo de texto numérico con `inputmode="numeric"`.
- Usar controles táctiles de al menos `48px` de alto.
- No mostrar un selector de fórmula en el flujo principal.
- Mostrar la comparación de fórmulas en una sección secundaria o acordeón.
- Anunciar errores y cambios de resultado mediante regiones accesibles con
  `aria-live`.
- Mantener las acciones `Calcular`, `Limpiar` y `Copiar resultado` fáciles de
  alcanzar y con etiquetas explícitas.

### Presentación del resultado

- Mostrar un único resultado principal grande en `bpm`.
- Mostrar actividad moderada y vigorosa como dos tarjetas apiladas en móvil.
- Cada tarjeta debe incluir etiqueta, porcentaje, rango en bpm y una
  interpretación breve.
- No usar tablas horizontales en móvil.
- No depender solo del color para comunicar intensidad.
- El CTA hacia la calculadora de zonas debe aparecer después de los rangos, no
  antes del resultado principal.

---

## Flujo principal MVP

**Ejemplo:** Tengo `35 años`. ¿Cuál es mi frecuencia cardíaca máxima estimada?

1. El usuario ingresa su edad.
2. Presiona `Calcular frecuencia máxima`.
3. La calculadora muestra la estimación principal con Tanaka.
4. Debajo muestra rangos generales de actividad moderada y vigorosa.
5. El usuario puede abrir `Comparar fórmulas` para consultar el resultado de
   `220 - edad`.
6. Si necesita zonas detalladas, puede continuar hacia la calculadora de zonas
   de frecuencia cardíaca.

### Inputs del MVP

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Edad | Texto numérico entero | `18-100` | vacío |

### Outputs principales

- Frecuencia cardíaca máxima estimada con Tanaka.
- Fórmula utilizada y sustitución con la edad capturada.
- Rango general de actividad moderada: `50%-70%` de la FCM estimada.
- Rango general de actividad vigorosa: `70%-85%` de la FCM estimada.
- Comparación secundaria con la fórmula clásica.
- Mensaje de interpretación y limitaciones.
- CTA hacia la calculadora de zonas de frecuencia cardíaca.

### Mensajes recomendados

Resultado principal:

```text
Tu frecuencia cardíaca máxima estimada es de aproximadamente 184 bpm.
```

Interpretación inmediata:

```text
Esta cifra es un máximo estimado, no una frecuencia que debas intentar mantener
durante el ejercicio.
```

Comparación:

```text
Tanaka: 184 bpm
Fórmula clásica (220 - edad): 185 bpm
Las fórmulas ofrecen estimaciones poblacionales y tu frecuencia máxima real
puede ser diferente.
```

Aviso de salud:

```text
Algunos medicamentos y condiciones de salud pueden modificar tu frecuencia
cardíaca y tus rangos de ejercicio. Consulta a un profesional de la salud para
obtener objetivos personalizados.
```

---

## Fórmulas y redondeo

### Fórmula principal: Tanaka

```text
fcm_tanaka_exacta = 208 - (0.7 * edad)
fcm_tanaka_mostrada = redondear(fcm_tanaka_exacta)
```

### Fórmula secundaria: clásica

```text
fcm_clasica_exacta = 220 - edad
fcm_clasica_mostrada = redondear(fcm_clasica_exacta)
```

### Rangos generales de intensidad

```text
moderada_min = redondear(fcm_tanaka_exacta * 0.50)
moderada_max = redondear(fcm_tanaka_exacta * 0.70)

vigorosa_min = redondear(fcm_tanaka_exacta * 0.70)
vigorosa_max = redondear(fcm_tanaka_exacta * 0.85)
```

- Calcular los rangos usando la FCM exacta de Tanaka, no el resultado principal
  previamente redondeado.
- Redondear cada valor mostrado al entero más cercano.
- Mostrar `bpm` junto a todos los resultados.

---

## Interpretación de rangos

| Rango | Porcentaje de FCM | Texto orientativo |
|-------|-------------------|-------------------|
| Actividad moderada | `50%-70%` | Esfuerzo general moderado; la intensidad percibida también importa. |
| Actividad vigorosa | `70%-85%` | Esfuerzo general más intenso; conviene progresar de forma gradual. |

- No mostrar porcentajes superiores al `85%` como una recomendación de uso
  general.
- No presentar estos rangos como zonas personalizadas.
- Incluir un enlace contextual a la calculadora de zonas para usuarios que
  busquen zonas 1 a 5 o el método Karvonen.

---

## Validaciones y estados

- Edad es obligatoria y debe ser un número entero entre `18` y `100`.
- Rechazar valores decimales, negativos, vacíos o con caracteres no numéricos.
- Si la edad está fuera de rango, mostrar un error junto al campo y no calcular.
- Tras corregir un error, permitir calcular sin recargar la página.
- Al limpiar, borrar el input, errores, resultado y estado de copia.
- No solicitar información sobre medicamentos; mostrar el aviso de salud de
  manera permanente.
- No usar el resultado para diagnosticar capacidad física o salud
  cardiovascular.
- No presentar los rangos como prescripción personalizada.
- Indicar que una prueba de esfuerzo supervisada puede medir la respuesta
  individual con mayor precisión.

---

## Accesibilidad

- Asociar el label `Edad` con su input.
- Conectar el mensaje de error mediante `aria-describedby`.
- Usar `aria-live="polite"` para anunciar el resultado y la confirmación de
  copia.
- Mover el foco al primer error después de intentar calcular, cuando sea
  necesario.
- Mantener contraste suficiente y estados de foco visibles.
- Usar texto y etiquetas además de color para diferenciar intensidades.
- Evitar que el acordeón de comparación oculte información imprescindible para
  interpretar el resultado principal.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de frecuencia cardíaca máxima por edad` |
| Meta description | `Estima tu frecuencia cardíaca máxima por edad con la fórmula de Tanaka y consulta rangos generales de actividad moderada y vigorosa.` |
| H1 | `Calculadora de frecuencia cardíaca máxima` |
| Keyword principal | `frecuencia cardiaca maxima calculadora` |
| Keywords secundarias | `fcm por edad`, `220 menos edad`, `formula tanaka frecuencia cardiaca` |

### Contenido recomendado

- Diferencia entre frecuencia cardíaca máxima y frecuencia objetivo.
- Por qué dos fórmulas pueden producir resultados distintos.
- Factores que pueden modificar la frecuencia cardíaca durante el ejercicio.
- Cómo se mide la FCM individual mediante una prueba supervisada.
- Enlace hacia la calculadora de zonas de frecuencia cardíaca.

### FAQs sugeridas

- ¿Qué es la frecuencia cardíaca máxima?
- ¿La frecuencia cardíaca máxima es una meta de ejercicio?
- ¿Cuál fórmula conviene usar: Tanaka o 220 menos edad?
- ¿Por qué mi pulso real puede ser diferente?
- ¿Qué diferencia hay entre frecuencia máxima y frecuencia objetivo?
- ¿Esto reemplaza una prueba de esfuerzo?

---

## Referencias sugeridas

- American Heart Association: tabla de frecuencias cardíacas objetivo y
  aclaración de que los valores son promedios generales.
- Tanaka, Monahan y Seals: fórmula de predicción de frecuencia cardíaca máxima
  basada en edad.
- CDC: medición e interpretación general de la intensidad de actividad física.

---

## Pruebas sugeridas

### Cálculos

- Edad `35` con Tanaka produce `184` bpm después de redondear.
- Edad `35` con fórmula clásica produce `185` bpm.
- Edad `60` con Tanaka produce `166` bpm.
- Edad `60` con fórmula clásica produce `160` bpm.
- Edad `35` produce rango moderado `92-128` bpm.
- Edad `35` produce rango vigoroso `128-156` bpm.
- Los rangos se calculan usando la FCM exacta antes de redondear.

### Validaciones

- Edad `18` es válida.
- Edad `100` es válida.
- Edad `17` muestra error.
- Edad `101` muestra error.
- Edad `35.5` muestra error.
- Edad vacía muestra error.
- Texto no numérico muestra error.

### Interacción y contenido

- El resultado identifica Tanaka como fórmula principal.
- La comparación secundaria muestra ambas fórmulas.
- El aviso explica que la FCM no es una frecuencia que se deba mantener.
- El aviso sobre medicamentos y condiciones de salud siempre está visible.
- Limpiar elimina input, errores y resultado.
- Copiar incluye FCM, fórmula principal y rangos generales.
- El resultado y los errores pueden anunciarse con tecnologías de asistencia.
- En móvil, el formulario y resultado principal aparecen antes de contenido
  secundario y las tarjetas no generan desplazamiento horizontal.
