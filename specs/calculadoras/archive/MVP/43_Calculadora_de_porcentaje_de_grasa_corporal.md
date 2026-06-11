# Especificación v2 - Calculadora de porcentaje de grasa corporal

## Descripción general

Herramienta mobile-first para estimar el porcentaje de grasa corporal mediante
la fórmula de circunferencias de la Marina de EE. UU. Debe ayudar al usuario a
tomar medidas consistentes, explicar cómo cambia el resultado ante pequeños
errores de medición y evitar presentar la estimación como diagnóstico o dato
clínico exacto.

El porcentaje puede calcularse sin conocer el peso. Cuando el usuario añade su
peso, la herramienta también estima masa grasa y masa libre de grasa.

**Arquitectura:** todo el cálculo ocurre en el cliente. No requiere backend,
base de datos ni llamadas a APIs externas.

---

## Objetivo de producto

- Estimar el porcentaje de grasa corporal con medidas accesibles en casa.
- Ayudar a tomar cuello, cintura, cadera y altura de forma consistente.
- Mostrar la sensibilidad del resultado ante una variación de `±1 cm` en los
  perímetros.
- Mostrar masa grasa y masa libre de grasa cuando se proporciona el peso.
- Explicar las limitaciones del método con lenguaje neutral y cuidadoso.
- Favorecer el seguimiento de tendencias consistentes, no la interpretación de
  pequeñas diferencias como cambios reales.
- Generar una página estática optimizada para SEO en Astro.

## No objetivos del MVP

- Diagnosticar estado de salud, obesidad o riesgo metabólico.
- Clasificar el resultado como saludable, no saludable, atlético o ideal.
- Estimar masa muscular. La masa libre de grasa incluye músculo, agua, huesos,
  órganos y otros tejidos.
- Sustituir DEXA, bioimpedancia, pliegues cutáneos o evaluación profesional.
- Recomendar pérdida de peso, dieta, calorías o entrenamiento.
- Evaluar menores de edad o embarazo.

---

## Alcance recomendado

### MVP

- Método principal: fórmula de circunferencias de la Marina de EE. UU.
- Selección explícita de fórmula masculina o femenina.
- Unidades métricas e imperiales con conversión que conserva valores.
- Peso opcional.
- Instrucciones desplegables de medición junto a cada perímetro.
- Resultado principal: porcentaje de grasa corporal estimado.
- Sensibilidad aproximada ante una variación de `±1 cm` en los perímetros.
- Masa grasa y masa libre de grasa cuando existe peso válido.
- Fórmula y medidas usadas.
- Copiar resultado, usar ejemplo y limpiar formulario.
- Aviso visible sobre población objetivo y limitaciones.

### Fase 2

- Guía visual de cómo medir cada perímetro con ilustraciones propias y texto
  alternativo.
- Comparación opcional con IMC.
- Relación cintura-altura con una medición y protocolo diferenciados; no
  reutilizar silenciosamente la cintura de la fórmula Navy.
- Historial local con fecha, consentimiento explícito, botón para borrar datos
  y almacenamiento en `localStorage`.
- Comparación de tendencias usando el mismo método y condiciones de medición.
- Evaluar un segundo método únicamente si aporta una comparación comprensible
  y documentada.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL pública recomendada | `/salud/calculadora-de-porcentaje-de-grasa-corporal` |
| Archivo Astro recomendado | `src/pages/salud/calculadora-de-porcentaje-de-grasa-corporal.astro` |
| Lógica de cálculo | `src/lib/calculators/salud/calculadora-de-porcentaje-de-grasa-corporal/bodyFat.ts` |
| Pruebas unitarias | `src/lib/calculators/salud/calculadora-de-porcentaje-de-grasa-corporal/bodyFat.test.ts` |
| Categoría | `salud` |
| Locale base | `es-MX` |

---

## Población objetivo y lenguaje

- Presentar la herramienta como orientativa para personas adultas.
- Mostrar siempre que no debe usarse durante el embarazo ni para menores de
  edad.
- Advertir que puede ser menos precisa en atletas de alto rendimiento,
  culturistas, personas con mucha masa muscular, cambios importantes de peso o
  distribuciones corporales alejadas de la población usada para desarrollar la
  fórmula.
- Explicar que la selección masculina/femenina elige una ecuación basada en
  sexo corporal y distribución de grasa; no intenta inferir identidad de
  género.
- Usar términos descriptivos y evitar etiquetas valorativas sobre el cuerpo.

Texto sugerido junto al selector:

> Selecciona la fórmula que corresponda a tu fisiología corporal. Esta variable
> solo se usa para elegir la ecuación.

---

## Flujo principal del MVP

1. El usuario selecciona fórmula masculina o femenina.
2. Selecciona sistema métrico o imperial.
3. Ingresa altura y los perímetros requeridos.
4. Opcionalmente ingresa su peso.
5. Consulta instrucciones de medición sin abandonar el formulario.
6. Pulsa `Calcular estimación`.
7. Ve el porcentaje estimado, la sensibilidad de medición y, si añadió peso,
   la composición estimada.
8. Puede copiar el resultado, modificar valores o limpiar el formulario.

**Ejemplo masculino:** altura `180 cm`, cintura `90 cm`, cuello `40 cm` y peso
opcional `80 kg`. El porcentaje estimado es aproximadamente `18.5%`.

---

## Inputs del MVP

Los rangos sirven para detectar errores de captura, no para definir cuerpos
válidos o inválidos. Las validaciones se realizan después de convertir a
unidades métricas canónicas.

| Campo | Tipo | Requerido | Rango métrico orientativo | Valor por defecto |
|-------|------|-----------|---------------------------|-------------------|
| Fórmula | Selector segmentado | Sí | `Masculina`, `Femenina` | vacío |
| Sistema de unidades | Selector segmentado | Sí | `Métrico`, `Imperial` | `Métrico` |
| Altura | Texto numérico | Sí | `100-250 cm` | vacío |
| Cuello | Texto numérico | Sí | `20-80 cm` | vacío |
| Cintura | Texto numérico | Sí | `40-250 cm` | vacío |
| Cadera | Texto numérico | Solo fórmula femenina | `50-250 cm` | vacío |
| Peso | Texto numérico | No | `20-500 kg` | vacío |

### Comportamiento de los inputs

- Aceptar coma o punto decimal.
- Usar `inputmode="decimal"` y unidades visibles dentro o junto al campo.
- Permitir pegar valores con unidades conocidas cuando sea razonable.
- Convertir y conservar los valores al cambiar entre métrico e imperial.
- Mostrar cadera únicamente para la fórmula femenina.
- Conservar el valor de cadera si el usuario cambia temporalmente de fórmula.
- No calcular mientras falten campos obligatorios.
- No mostrar errores agresivos mientras el usuario sigue escribiendo; validar
  al salir del campo o al intentar calcular.

---

## Protocolo de medición

Las instrucciones deben estar disponibles en un control desplegable
`Cómo medir` junto a cada campo. El MVP no depende de imágenes.

### Reglas generales

- Usar una cinta métrica flexible que no se estire.
- Medir sobre la piel o ropa muy ligera.
- Mantener la cinta ajustada, sin comprimir la piel.
- Mantener la cinta paralela al suelo, salvo en el cuello.
- Estar de pie y relajado.
- Medir al final de una exhalación normal, sin contener ni expulsar el aire con
  fuerza.
- Repetir cada perímetro dos veces. Si difieren más de `1 cm`, repetir y usar
  mediciones consistentes.
- Para seguimiento, medir bajo condiciones similares y usar siempre el mismo
  protocolo.

### Altura

- Medir sin calzado, de pie y con la mirada al frente.
- Usar la altura total, no una estimación redondeada si se conoce el dato.

### Cuello

- Colocar la cinta justo debajo de la laringe.
- Inclinarla ligeramente hacia abajo al frente.
- Mantener hombros relajados y no comprimir el cuello.

### Cintura para fórmula masculina

- Medir el abdomen a la altura del ombligo.
- Mantener el abdomen relajado; no meter ni expandir el vientre.

### Cintura para fórmula femenina

- Medir la circunferencia natural de la cintura, normalmente en el punto más
  estrecho del torso.
- No usar automáticamente la altura del ombligo si no coincide con ese punto.

### Cadera para fórmula femenina

- Medir alrededor de la parte más ancha de glúteos y cadera.
- Verificar que la cinta permanezca paralela al suelo.

---

## Acción de cálculo y estados

El MVP debe usar un botón principal explícito `Calcular estimación`. Los
resultados pueden actualizarse después de un primer cálculo cuando el usuario
modifique un valor válido.

### Estado inicial

- Mostrar una explicación breve del método.
- No mostrar ceros ni resultados vacíos simulando una estimación.
- Mantener el botón disponible y señalar campos pendientes al pulsarlo.

### Estado válido

- Mostrar el resultado principal y la sensibilidad.
- Mostrar composición estimada solo cuando existe peso.
- Mostrar fórmula y medidas utilizadas.
- Habilitar copiar resultado.

### Estado incompleto o inválido

- Mantener visibles los valores ingresados.
- Mostrar mensajes específicos junto a los campos afectados.
- No conservar un resultado anterior como si todavía fuera válido.
- Llevar el foco al primer error al intentar calcular.

---

## Outputs principales

### Siempre que el cálculo sea utilizable

- Porcentaje de grasa corporal estimado, redondeado a `1 decimal`.
- Rango de sensibilidad por variación de perímetros, redondeado a `1 decimal`.
- Explicación breve del rango de sensibilidad.
- Fórmula utilizada.
- Resumen de medidas utilizadas.

Texto sugerido:

> Estimación por circunferencias: **18.5%**. Si cada perímetro variara hasta
> `±1 cm`, el cálculo podría moverse aproximadamente entre **X% y Y%**. Este
> rango describe sensibilidad al medir, no un intervalo clínico de confianza.

### Solo cuando existe peso válido

- Masa grasa estimada.
- Masa libre de grasa estimada.

Texto aclaratorio:

> La masa libre de grasa no equivale a masa muscular; también incluye agua,
> huesos, órganos y otros tejidos.

### No mostrar en el MVP

- Rangos saludables o ideales.
- Categorías atléticas, fitness, promedio u obesidad.
- Metas de porcentaje.
- Recomendaciones para perder grasa.
- Masa muscular estimada.

---

## Fórmulas

Convertir siempre altura y perímetros a pulgadas antes de aplicar la fórmula
Navy. El peso no participa en el cálculo del porcentaje.

### Fórmula masculina

```text
body_fat = 86.010 * log10(cintura - cuello)
           - 70.041 * log10(altura)
           + 36.76
```

### Fórmula femenina

```text
body_fat = 163.205 * log10(cintura + cadera - cuello)
           - 97.684 * log10(altura)
           - 78.387
```

### Composición estimada opcional

```text
masa_grasa = peso * (body_fat / 100)
masa_libre_grasa = peso - masa_grasa
```

No calcular composición cuando no existe peso o cuando el porcentaje se
encuentra fuera del rango utilizable.

---

## Sensibilidad ante errores de medición

El MVP no debe afirmar un margen clínico fijo. Debe mostrar un escenario de
sensibilidad que responda a la pregunta: “¿cuánto podría cambiar el resultado
si cada perímetro variara hasta `1 cm` al medirlo?”.

Usar `delta = 1 cm`, convertido a pulgadas antes de calcular:

### Fórmula masculina

```text
estimacion_inferior = formula(cintura - delta, cuello + delta, altura)
estimacion_superior = formula(cintura + delta, cuello - delta, altura)
```

### Fórmula femenina

```text
estimacion_inferior = formula(
  cintura - delta,
  cadera - delta,
  cuello + delta,
  altura
)

estimacion_superior = formula(
  cintura + delta,
  cadera + delta,
  cuello - delta,
  altura
)
```

- Presentar este resultado como sensibilidad conservadora de medición.
- No llamarlo intervalo de confianza ni precisión clínica.
- Si algún escenario produce un logaritmo inválido, ocultar el rango y pedir al
  usuario revisar las mediciones.

---

## Validaciones y estados de resultado

### Validaciones de entrada

- Todos los campos requeridos deben contener números finitos y positivos.
- El peso vacío es válido; un peso presente debe pasar validación.
- `cintura - cuello` debe ser mayor que cero en la fórmula masculina.
- `cintura + cadera - cuello` debe ser mayor que cero en la fórmula femenina.
- Las medidas deben cumplir los rangos orientativos definidos para detectar
  errores de captura.
- No redondear valores antes de aplicar la fórmula.

### Resultado utilizable

- Un resultado mayor que `0%` y menor que `100%` puede mostrarse como
  estimación.
- Si es menor que `2%` o mayor que `70%`, mostrar además una advertencia
  destacada para revisar medidas y no interpretarlo sin orientación
  profesional.

### Resultado fuera de rango

- Si el resultado no es finito, es `<= 0%` o es `>= 100%`, no mostrarlo como
  estimación válida.
- No limitar artificialmente el resultado a `0%` o `100%`.
- No calcular masa grasa ni masa libre de grasa.
- Mostrar:

> El resultado quedó fuera del rango utilizable de esta fórmula. Revisa dónde
> y cómo tomaste las medidas antes de intentarlo de nuevo.

---

## Diseño mobile-first

### Orden en móvil

1. Hero compacto con título, descripción y aviso de que es una estimación.
2. Selector de fórmula.
3. Selector de unidades.
4. Altura y perímetros requeridos, cada uno con `Cómo medir`.
5. Peso opcional.
6. Botón principal ancho `Calcular estimación`.
7. Acciones secundarias `Usar ejemplo` y `Limpiar`.
8. Resultado principal.
9. Sensibilidad y composición estimada.
10. Limitaciones, metodología, contenido educativo y FAQs.

### Requisitos visuales y de interacción

- Una sola columna para campos y resultado en pantallas pequeñas.
- Desde escritorio, formulario y resultado pueden mostrarse en dos columnas.
- No colocar campos de perímetros lado a lado antes del breakpoint `sm`.
- Controles táctiles de al menos `44 px`; preferir inputs de `48 px`.
- Texto de inputs de al menos `16 px` para evitar zoom involuntario.
- Unidad siempre visible.
- No depender del color para comunicar errores o estados.
- Evitar tablas anchas dentro del resultado móvil.
- Permitir completar el cálculo a `320 px` sin scroll horizontal.
- Mantener el resultado inmediatamente después del formulario en el orden del
  documento, aunque en escritorio se muestre a la derecha.
- Respetar `prefers-reduced-motion`.

### Accesibilidad

- Usar `fieldset` y `legend` para fórmula y unidades.
- Asociar etiquetas, ayuda y errores mediante `aria-describedby`.
- Usar `aria-live="polite"` para anunciar resultados y estado de copia.
- Mover el foco al resumen de resultado después de calcular explícitamente.
- Los controles `Cómo medir` deben funcionar con teclado y exponer su estado.
- No ocultar instrucciones esenciales exclusivamente en tooltips.

---

## Copiar resultado

El texto copiado debe incluir únicamente información disponible y una
advertencia breve.

Ejemplo:

```text
Calculadora de porcentaje de grasa corporal - calculadoras.tools
Fórmula: masculina
Estimación: 18.5%
Sensibilidad por variación de perímetros de ±1 cm: X% a Y%
Masa grasa estimada: 14.8 kg
Masa libre de grasa estimada: 65.2 kg
Resultado orientativo; no es una medición clínica.
```

Omitir las líneas de masa cuando el usuario no proporcionó peso.

---

## Contenido educativo

La página debe explicar:

- Qué estima el porcentaje de grasa corporal.
- Cómo funciona el método de circunferencias.
- Por qué la técnica y el lugar de medición afectan el resultado.
- Por qué conviene comparar tendencias tomadas bajo condiciones similares.
- Diferencias generales entre circunferencias, bioimpedancia, pliegues y DEXA.
- Por qué masa libre de grasa no significa masa muscular.
- Cuándo evitar o interpretar con cautela la herramienta.

Debe enlazar al contenido existente sobre
`IMC vs porcentaje de grasa corporal` y, cuando esté disponible, desde ese
artículo hacia esta calculadora.

---

## SEO

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de porcentaje de grasa corporal` |
| Meta description | `Estima tu porcentaje de grasa corporal con medidas de cintura, cuello, altura y cadera. Incluye guía de medición y sensibilidad del resultado.` |
| H1 | `Calculadora de grasa corporal` |
| Keyword principal | `calculadora grasa corporal` |
| Keywords secundarias | `porcentaje de grasa corporal`, `fórmula Navy grasa corporal`, `masa grasa estimada`, `cómo medir grasa corporal` |

### FAQs sugeridas

- ¿Qué tan exacta es esta calculadora?
- ¿Cómo debo medir cuello, cintura y cadera?
- ¿Por qué el resultado cambia si mido un centímetro diferente?
- ¿Necesito conocer mi peso?
- ¿La masa libre de grasa es lo mismo que músculo?
- ¿Sirve para atletas?
- ¿Se puede usar durante el embarazo?
- ¿Es lo mismo que IMC?
- ¿Cómo puedo seguir cambios a lo largo del tiempo?

---

## Pruebas unitarias sugeridas

### Fórmulas

- El ejemplo masculino `180 cm`, cintura `90 cm` y cuello `40 cm` produce
  aproximadamente `18.5%`.
- Medidas femeninas válidas producen un porcentaje finito.
- Medidas femeninas sin cadera muestran error.
- Cintura menor o igual que cuello muestra error en fórmula masculina.
- Una combinación femenina no positiva muestra error.
- Aumentar cintura manteniendo el resto constante aumenta el porcentaje.
- Aumentar cuello manteniendo el resto constante reduce el porcentaje.
- Cambio entre unidades conserva equivalencia dentro de una tolerancia.

### Peso y composición

- Peso vacío permite calcular porcentaje y no produce composición.
- Peso válido produce masa grasa y masa libre de grasa.
- Masa grasa y masa libre de grasa suman el peso dentro de una tolerancia.
- No se calcula composición con resultado `<= 0%` o `>= 100%`.
- La salida usa siempre `masa libre de grasa`, no `masa muscular`.

### Sensibilidad

- La sensibilidad inferior es menor que la estimación principal.
- La sensibilidad superior es mayor que la estimación principal.
- La sensibilidad usa `1 cm` aunque la interfaz esté en unidades imperiales.
- Un escenario de sensibilidad con logaritmo inválido no produce `NaN` visible.

### Validación y presentación

- Se aceptan coma y punto decimal.
- Los valores fuera de rangos orientativos muestran error específico.
- Resultados menores a `2%` o mayores a `70%` muestran advertencia.
- Resultados `<= 0%`, `>= 100%` o no finitos muestran estado fuera de rango.
- Cambiar de fórmula oculta o muestra cadera sin borrar su valor.
- Copiar resultado omite composición cuando no hay peso.

---

## Criterios de aceptación del MVP

1. Una persona puede obtener el porcentaje sin introducir peso.
2. Cada perímetro incluye instrucciones textuales de cómo medirlo.
3. La fórmula femenina solicita cadera y la masculina no.
4. Cambiar unidades conserva valores y resultado equivalente.
5. El resultado muestra sensibilidad de medición sin llamarla margen clínico.
6. La masa libre de grasa nunca se presenta como masa muscular.
7. Resultados imposibles no generan masas negativas ni porcentajes limitados
   artificialmente.
8. La interfaz funciona a `320 px` sin scroll horizontal y con controles
   táctiles accesibles.
9. La página deja claro que la herramienta es orientativa para adultos y no
   debe usarse durante el embarazo.
10. La calculadora funciona completamente en cliente y sin APIs externas.

---

## Fuentes recomendadas para implementación y contenido

- [NCBI Bookshelf: Body Composition and Physical Performance](https://www.ncbi.nlm.nih.gov/books/NBK235960/)
  para antecedentes, desarrollo y limitaciones de los métodos militares de
  circunferencias.
- [Organización Mundial de la Salud: Waist circumference and waist-hip ratio](https://www.who.int/publications/i/item/9789241501491)
  para protocolo y consideraciones sobre medición de cintura y cadera.
- Las fuentes deben citarse en la página y verificarse antes de publicar.
