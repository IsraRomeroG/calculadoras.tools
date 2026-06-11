# Especificación v2 - Calculadora de zonas de frecuencia cardíaca

## Descripción general

Herramienta para estimar zonas de frecuencia cardíaca de entrenamiento a partir
de una frecuencia cardíaca máxima (FCM) estimada por edad o conocida por el
usuario. Debe permitir calcular zonas mediante porcentaje directo de FCM o
mediante reserva cardíaca con el método Karvonen.

La calculadora no debe limitarse a mostrar una tabla de bpm. Cada resultado debe
ayudar a interpretar la intensidad mediante lenguaje práctico, sensación de
esfuerzo y una referencia conversacional orientativa.

**Arquitectura:** todo el cálculo ocurre en el cliente. No requiere backend,
base de datos ni llamadas a APIs externas.

---

## Principios de producto

- Distinguir claramente entre una FCM estimada y una FCM conocida.
- Distinguir el origen de la FCM del método utilizado para calcular las zonas.
- Mostrar zonas útiles para entrenar sin presentarlas como una prescripción.
- Explicar la intensidad con texto, no únicamente con porcentajes o colores.
- Reconocer que el modelo de cinco zonas es una convención de entrenamiento y
  que otros dispositivos o profesionales pueden utilizar límites diferentes.
- Diseñar primero para móvil, con controles táctiles cómodos y resultados
  fáciles de consultar durante una actividad.
- Comunicar de forma visible que medicamentos, condiciones de salud y otros
  factores pueden modificar la respuesta cardíaca.

---

## Objetivo de producto

- Calcular rangos enteros de bpm para cinco zonas sin solapamientos.
- Permitir utilizar una FCM estimada por edad o una FCM conocida.
- Permitir método simple por `% de FCM` y método Karvonen.
- Explicar cómo se obtuvo el resultado y qué significa cada zona.
- Ayudar al usuario a elegir el método adecuado para los datos que conoce.
- Integrarse con la calculadora existente de frecuencia cardíaca máxima.
- Generar una página estática optimizada para SEO en Astro.

---

## Alcance recomendado

### MVP

- Elegir el origen de la FCM:
  - Estimada por edad mediante Tanaka.
  - FCM conocida introducida manualmente.
- Elegir el método de zonas:
  - Porcentaje directo de FCM.
  - Reserva cardíaca o método Karvonen.
- Solicitar frecuencia en reposo únicamente cuando se seleccione Karvonen.
- Mostrar un resumen de los datos y método utilizados.
- Mostrar cinco zonas con rango bpm, porcentaje, etiqueta e interpretación.
- Generar rangos enteros sin solapamientos.
- Cargar un ejemplo interactivo.
- Copiar resultado y limpiar formulario.
- Mostrar aviso de salud visible.
- Integración bidireccional con la calculadora de frecuencia cardíaca máxima.

### Fase 2

- Permitir límites personalizados mediante un modo avanzado.
- Guardar el último perfil de forma opcional en `sessionStorage`.
- Exportar zonas a CSV.
- Generar una vista compacta imprimible.

### Fuera de alcance

- Recomendar planes de entrenamiento o tiempo de permanencia en cada zona.
- Diagnosticar condiciones de salud.
- Determinar una FCM real mediante una prueba física.
- Presentar la Zona 5 como una meta que el usuario deba alcanzar o mantener.
- Prometer beneficios específicos como “quema de grasa” para una zona.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL pública | `/salud/calculadora-de-zonas-de-frecuencia-cardiaca` |
| Archivo Astro | `src/pages/salud/calculadora-de-zonas-de-frecuencia-cardiaca.astro` |
| Lógica de cálculo | `src/lib/calculators/salud/calculadora-de-zonas-de-frecuencia-cardiaca/heartRateZones.ts` |
| Pruebas unitarias | `src/lib/calculators/salud/calculadora-de-zonas-de-frecuencia-cardiaca/heartRateZones.test.ts` |
| Categoría | `salud` |
| Locale base | `es-MX` |

La fórmula de Tanaka ya utilizada por la calculadora de frecuencia cardíaca
máxima debe reutilizarse o extraerse a lógica compartida para evitar resultados
inconsistentes entre ambas páginas.

---

## Terminología visible

Evitar depender únicamente de siglas en la interfaz.

| Término | Explicación breve |
|---------|-------------------|
| Frecuencia cardíaca máxima (FCM) | Máximo estimado o conocido utilizado como referencia para calcular las zonas. |
| FCM estimada | Valor aproximado calculado por edad mediante Tanaka. |
| FCM conocida | Valor que el usuario introduce porque dispone de una medición o referencia propia. |
| Reserva cardíaca | Diferencia entre la FCM y la frecuencia cardíaca en reposo. |
| Karvonen | Método que calcula las zonas como porcentaje de la reserva cardíaca y después suma el pulso en reposo. |

No describir una FCM introducida manualmente como “medida” porque la calculadora
no puede conocer su origen ni verificarla.

---

## Flujo principal

### Paso 1: origen de la FCM

Mostrar un selector segmentado:

- `Estimar con mi edad` — opción predeterminada.
- `Usar una FCM conocida`.

Si se selecciona edad, mostrar únicamente el campo de edad. Si se selecciona
FCM conocida, mostrar únicamente el campo de FCM.

### Paso 2: método de cálculo

Mostrar un segundo selector segmentado:

- `% de FCM` — opción predeterminada y más simple.
- `Karvonen` — utiliza también la frecuencia en reposo.

Al seleccionar Karvonen, mostrar el campo de frecuencia en reposo y una
explicación breve siempre visible. No depender de un tooltip para explicar el
método.

### Paso 3: calcular

Mostrar un botón principal de ancho completo: `Calcular mis zonas`.

Después de calcular:

- Mostrar el resumen de cálculo antes de las zonas.
- Llevar el foco accesible al encabezado del resultado sin provocar un salto
  inesperado durante la captura de datos.
- Mantener visibles los datos introducidos para poder ajustarlos.

### Ejemplo interactivo

Incluir una acción secundaria `Probar un ejemplo` que configure:

- Edad: `35 años`.
- Método: `Karvonen`.
- Frecuencia en reposo: `60 bpm`.

El ejemplo debe ejecutar el cálculo y permitir al usuario editar los valores.

---

## Inputs del MVP

| Campo | Tipo | Condición | Rango válido | Valor por defecto |
|-------|------|-----------|--------------|-------------------|
| Origen de FCM | Selector segmentado | Siempre visible | Edad, FCM conocida | Edad |
| Edad | Texto numérico entero | Obligatorio si el origen es edad | `18-100` | Vacío |
| FCM conocida | Texto numérico entero | Obligatorio si el origen es FCM conocida | `80-240 bpm` | Vacío |
| Método | Selector segmentado | Siempre visible | `% de FCM`, Karvonen | `% de FCM` |
| Frecuencia en reposo | Texto numérico entero | Obligatorio para Karvonen | `35-120 bpm` | Vacío |

Los campos ocultos no deben afectar el cálculo. Sus valores pueden conservarse
mientras el usuario cambia de opción, pero `Limpiar` debe restaurar el estado
inicial completo.

---

## Zonas predeterminadas

Las etiquetas y descripciones son orientativas. Debe mostrarse una nota
indicando que relojes, aplicaciones y profesionales pueden utilizar límites o
nombres diferentes.

| Zona | Porcentaje | Etiqueta | Sensación orientativa | Referencia conversacional |
|------|------------|----------|-----------------------|---------------------------|
| Zona 1 | `50%-60%` | Muy fácil | Esfuerzo muy cómodo | Conversación cómoda |
| Zona 2 | `60%-70%` | Fácil | Esfuerzo cómodo y continuo | Se puede hablar en frases completas |
| Zona 3 | `70%-80%` | Sostenida | Esfuerzo perceptible | La conversación requiere pausas |
| Zona 4 | `80%-90%` | Difícil | Esfuerzo alto | Solo frases cortas |
| Zona 5 | `90%-100%` | Esfuerzo muy alto | Muy exigente | Hablar resulta difícil |

La referencia conversacional complementa los bpm; no debe presentarse como una
medición exacta ni como sustituto de una recomendación profesional.

---

## Fórmulas

### Frecuencia cardíaca máxima estimada

Si el origen seleccionado es edad:

```text
fcm_exacta = 208 - (0.7 * edad)
```

Si el origen seleccionado es FCM conocida:

```text
fcm_exacta = fcm_conocida
```

### Método por porcentaje directo de FCM

```text
limite_exacto = fcm_exacta * porcentaje
```

### Método Karvonen

```text
reserva = fcm_exacta - frecuencia_reposo
limite_exacto = frecuencia_reposo + (reserva * porcentaje)
```

### Redondeo y límites sin solapamientos

Los cálculos deben conservar `fcm_exacta` y `reserva` sin redondear. Solo se
redondean los seis límites finales correspondientes a `50%`, `60%`, `70%`,
`80%`, `90%` y `100%`.

```text
limite_mostrado = redondear_al_entero_mas_cercano(limite_exacto)
```

Para evitar que un mismo bpm aparezca en dos zonas:

```text
zona_1 = limite_50 hasta limite_60 - 1
zona_2 = limite_60 hasta limite_70 - 1
zona_3 = limite_70 hasta limite_80 - 1
zona_4 = limite_80 hasta limite_90 - 1
zona_5 = limite_90 hasta limite_100
```

Los seis límites mostrados deben ser estrictamente crecientes. Si el redondeo
produce dos límites iguales, no es posible formar cinco rangos enteros no
vacíos. En ese caso, no mostrar zonas y pedir al usuario que revise la FCM y la
frecuencia en reposo introducidas.

Ejemplo para FCM `180` mediante porcentaje directo:

| Zona | Rango mostrado |
|------|----------------|
| Zona 1 | `90-107 bpm` |
| Zona 2 | `108-125 bpm` |
| Zona 3 | `126-143 bpm` |
| Zona 4 | `144-161 bpm` |
| Zona 5 | `162-180 bpm` |

---

## Resultado

### Resumen de cálculo

Antes de las zonas, mostrar:

- FCM utilizada y su origen.
- Método utilizado.
- Frecuencia en reposo y reserva cardíaca cuando aplique.
- Fórmula resumida.

Ejemplo:

```text
FCM utilizada: 184 bpm, estimada mediante Tanaka
Método: Karvonen
Frecuencia en reposo: 60 bpm
Reserva cardíaca: 123.5 bpm
```

Debe quedar claro que una FCM estimada es una referencia poblacional y no una
meta de ejercicio.

### Barra segmentada

Mostrar una barra horizontal compacta con cinco segmentos como vista general.

- Cada segmento debe incluir el número de zona.
- Debe existir una leyenda textual.
- El significado no puede depender únicamente del color.
- En móvil no debe sustituir las tarjetas ni requerir desplazamiento horizontal.

### Tarjetas de zona

En móvil, mostrar las cinco tarjetas apiladas. Cada tarjeta debe incluir:

- Número y etiqueta de zona.
- Rango bpm como información visual principal.
- Porcentaje y base utilizada: `% de FCM` o `% de reserva cardíaca`.
- Sensación orientativa.
- Referencia conversacional.

### Acciones

- `Copiar resultado`.
- `Limpiar`.

El texto copiado debe incluir:

- Datos de entrada utilizados.
- Origen de la FCM.
- Método.
- Las cinco zonas.
- Nota breve indicando que son estimaciones orientativas.

---

## Diseño mobile-first

### Orden en móvil

1. Introducción breve.
2. Formulario.
3. Botón principal.
4. Resumen del cálculo.
5. Barra segmentada.
6. Tarjetas de zonas.
7. Acciones de copiar y limpiar.
8. Aviso de salud y contenido educativo.

### Requisitos de interacción

- Una sola columna como diseño base.
- Controles táctiles con altura mínima de `48 px`.
- Botón principal de ancho completo.
- Selectores segmentados que puedan apilarse si el ancho es insuficiente.
- Etiquetas siempre visibles; no usar placeholders como única etiqueta.
- Teclado numérico mediante `inputmode="numeric"`.
- No requerir hover ni tooltip para comprender controles o resultados.
- No usar desplazamiento horizontal para consultar las zonas.
- No usar únicamente color para identificar intensidad.

### Ampliación en escritorio

En pantallas amplias, formulario y resultado pueden mostrarse en dos columnas.
Las tarjetas pueden adoptar una cuadrícula siempre que mantengan un orden claro
de Zona 1 a Zona 5.

---

## Estados, validaciones y mensajes

### Estados

- Inicial: formulario vacío y explicación breve de qué se calculará.
- Incompleto: faltan datos obligatorios para la selección actual.
- Inválido: mostrar errores junto al campo correspondiente.
- Válido: mostrar resumen y zonas.
- Copiado: confirmar la acción mediante texto y región `aria-live`.

### Validaciones

- Edad obligatoria únicamente si se estima la FCM.
- Edad debe ser un entero entre `18` y `100`.
- FCM conocida obligatoria únicamente si se selecciona ese origen.
- FCM conocida debe ser un entero entre `80` y `240 bpm`.
- Para Karvonen, frecuencia en reposo es obligatoria.
- Frecuencia en reposo debe ser un entero entre `35` y `120 bpm`.
- Para Karvonen, la FCM utilizada debe ser mayor que la frecuencia en reposo.
- Los seis límites redondeados deben ser estrictamente crecientes para poder
  formar cinco zonas enteras no vacías.
- No calcular parcialmente mientras existan errores.
- Al cambiar de método u origen, retirar errores de campos que dejan de aplicar.

### Mensajes orientativos

- Edad vacía: `Ingresa tu edad para estimar tu frecuencia cardíaca máxima.`
- FCM vacía: `Ingresa la frecuencia cardíaca máxima que deseas utilizar.`
- Reposo vacío: `Karvonen necesita tu frecuencia cardíaca en reposo.`
- FCM no mayor al reposo: `La frecuencia máxima debe ser mayor que la frecuencia en reposo.`
- Límites repetidos: `La diferencia entre la frecuencia máxima y la frecuencia en reposo es demasiado pequeña para mostrar cinco zonas distintas. Revisa los valores.`

---

## Accesibilidad

- Utilizar controles nativos o implementar correctamente `aria-pressed` en los
  selectores segmentados.
- Asociar cada error con su campo mediante `aria-describedby`.
- Aplicar `aria-invalid="true"` cuando corresponda.
- Anunciar el resultado y la confirmación de copiado mediante regiones
  `aria-live` sin leer todo el contenido repetidamente.
- Permitir navegación completa mediante teclado.
- Mantener contraste suficiente en texto, bordes, estados de foco y segmentos.
- Evitar que los cambios de método muevan automáticamente el foco.

---

## Avisos de salud y límites

Mostrar un aviso visible cerca de la calculadora:

> Estas zonas son estimaciones generales, no una prescripción médica. La
> respuesta cardíaca puede cambiar por condición física, temperatura,
> hidratación, estrés, sueño, medicamentos y condiciones de salud.

Añadir una indicación específica:

> Si utilizas medicamentos que afectan el pulso, tienes síntomas durante la
> actividad, antecedentes cardiovasculares o necesitas objetivos
> personalizados, consulta a un profesional de la salud.

No solicitar al usuario información médica sensible únicamente para mostrar
estos avisos.

---

## Integración con la calculadora de FCM

La integración forma parte del MVP.

- Desde la calculadora de frecuencia cardíaca máxima, añadir un enlace para
  calcular zonas usando la edad ya introducida.
- Pasar la edad mediante query string y volver a calcular Tanaka localmente. No
  etiquetar ese valor como FCM conocida.
- La calculadora de zonas debe validar cualquier valor recibido por URL antes
  de utilizarlo.
- Desde la calculadora de zonas, enlazar a la calculadora de FCM para explicar
  y comparar fórmulas.
- Sustituir el mensaje de “disponible próximamente” de la calculadora de FCM
  cuando se publique esta página.

Ejemplo de integración:

```text
/salud/calculadora-de-zonas-de-frecuencia-cardiaca?edad=35
```

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de zonas de frecuencia cardíaca y Karvonen` |
| Meta description | `Calcula tus zonas de frecuencia cardíaca por edad, FCM conocida o método Karvonen y consulta rangos de bpm para cinco intensidades.` |
| H1 | `Calculadora de zonas de frecuencia cardíaca` |
| Keyword principal | `zonas frecuencia cardiaca calculadora` |
| Keywords secundarias | `zonas de entrenamiento`, `karvonen calculadora`, `zona 2 frecuencia cardiaca`, `reserva cardiaca` |

### Contenido educativo recomendado

- Cómo elegir entre `% de FCM` y Karvonen.
- Cómo medir la frecuencia cardíaca en reposo.
- Diferencia entre FCM estimada y conocida.
- Por qué un reloj o aplicación puede mostrar zonas diferentes.
- Diferencia entre cinco zonas de entrenamiento y rangos generales de actividad
  moderada o vigorosa.
- Limitaciones de las fórmulas por edad.

### FAQs sugeridas

- ¿Qué son las zonas de frecuencia cardíaca?
- ¿Qué método debo elegir: porcentaje de FCM o Karvonen?
- ¿Cómo puedo medir mi frecuencia cardíaca en reposo?
- ¿Qué diferencia hay entre una FCM estimada y una conocida?
- ¿Por qué mi reloj muestra zonas diferentes?
- ¿La Zona 5 es una meta que debo alcanzar?
- ¿Las zonas son iguales para todos?
- ¿Los medicamentos pueden modificar mis zonas?

---

## Referencias

- Estudio de Tanaka, Monahan y Seals sobre FCM estimada:
  `https://pubmed.ncbi.nlm.nih.gov/11153730/`
- American Heart Association, frecuencia cardíaca objetivo:
  `https://www.heart.org/en/healthy-living/exercise-and-physical-activity/fitness-basics/target-heart-rates`
- CDC, actividad física:
  `https://www.cdc.gov/physical-activity/`

La página debe diferenciar los rangos generales de actividad moderada y vigorosa
de la convención de cinco zonas utilizada por la calculadora.

---

## Pruebas sugeridas

### Cálculo

- Edad `40` estima una FCM exacta de `180 bpm` mediante Tanaka.
- FCM conocida `180`, método `% de FCM`, produce:
  - Zona 1: `90-107 bpm`.
  - Zona 2: `108-125 bpm`.
  - Zona 3: `126-143 bpm`.
  - Zona 4: `144-161 bpm`.
  - Zona 5: `162-180 bpm`.
- FCM conocida `180`, reposo `60`, método Karvonen, produce:
  - Reserva: `120 bpm`.
  - Zona 1: `120-131 bpm`.
  - Zona 2: `132-143 bpm`.
  - Zona 3: `144-155 bpm`.
  - Zona 4: `156-167 bpm`.
  - Zona 5: `168-180 bpm`.
- Edad `35` conserva la FCM exacta `183.5` para calcular límites antes de
  mostrar la FCM redondeada como `184 bpm`.
- Todas las zonas son contiguas y ningún bpm aparece en dos zonas.

### Validación

- Edad vacía con origen por edad muestra error.
- Edad `17`, `101` o decimal muestra error.
- FCM conocida vacía cuando está seleccionada muestra error.
- FCM conocida fuera de `80-240` muestra error.
- Karvonen sin frecuencia en reposo muestra error.
- Frecuencia en reposo fuera de `35-120` muestra error.
- FCM menor o igual que frecuencia en reposo muestra error.
- Una combinación que produzca límites redondeados repetidos muestra error y no
  genera zonas vacías.
- Cambiar de Karvonen a `% de FCM` retira el error de reposo y permite calcular.
- Los parámetros URL inválidos no se utilizan.

### Interacción y accesibilidad

- El ejemplo interactivo configura y calcula los valores esperados.
- Limpiar restaura origen por edad, método `% de FCM` y formulario vacío.
- Copiar incluye resumen, cinco zonas y aviso orientativo.
- El resultado se anuncia sin mover el foco durante la captura.
- La calculadora puede utilizarse únicamente con teclado.
- Las tarjetas conservan orden y legibilidad a `320 px` de ancho.

---

## Criterios de aceptación del MVP

- El usuario puede calcular zonas desde edad o FCM conocida.
- El usuario puede elegir `% de FCM` o Karvonen sin confundir ambas decisiones.
- Los campos visibles corresponden únicamente a la selección actual.
- El resumen identifica claramente origen de FCM, método y datos utilizados.
- Las cinco zonas muestran rangos enteros contiguos sin solapamientos.
- Cada zona incluye una interpretación textual además del color.
- La experiencia funciona en una sola columna desde `320 px`.
- Los avisos de salud y las limitaciones son visibles.
- La integración con la calculadora de FCM conserva la edad y recalcula Tanaka.
- Las fórmulas, validaciones y estados principales cuentan con pruebas unitarias.
