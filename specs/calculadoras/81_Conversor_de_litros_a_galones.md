# Especificación v2 - Conversor de litros a galones

## Descripción general

Herramienta especializada para convertir entre litros, galones estadounidenses
y galones imperiales. Su principal valor es resolver de forma inmediata la
ambigüedad de la palabra `galón`: cuando el origen sea litros, debe mostrar
simultáneamente la equivalencia en ambos tipos de galón.

La experiencia debe ser más rápida y enfocada que un conversor general de
volumen. Las unidades como mililitros, tazas, pintas y cuartos pertenecen al
`Conversor de volumen` y no forman parte de esta calculadora.

**Arquitectura:** todo el cálculo ocurre en el cliente. No requiere backend,
base de datos ni llamadas a APIs externas. El contenido educativo y las tablas
de equivalencias se generan de forma estática con Astro.

---

## Objetivo de producto

- Convertir litros a galones US e imperiales en una sola operación.
- Convertir galones US o imperiales a litros.
- Mostrar siempre la variante regional del galón.
- Explicar de manera breve la diferencia entre ambas variantes.
- Permitir copiar o compartir una conversión sin perder su contexto.
- Incluir fórmulas, sustitución del valor y equivalencias frecuentes.
- Ofrecer una experiencia accesible, rápida y mobile first.
- Generar una página estática optimizada para SEO en Astro.

---

## Principios de la experiencia

1. **Sin ambigüedad:** nunca mostrar `galón` o `gal` sin indicar `US` o
   `imperial`.
2. **Un valor, todas las respuestas relevantes:** cada cálculo muestra las dos
   unidades que no fueron elegidas como origen.
3. **Pocos toques:** la conversión principal no depende de desplegables largos
   ni de un botón `Calcular`.
4. **Precisión legible:** conservar la precisión completa internamente y
   redondear únicamente la presentación.
5. **Contenido enfocado:** no añadir otras unidades que dupliquen el conversor
   general de volumen.

---

## Alcance recomendado

### MVP

- Campo de valor con conversión inmediata.
- Dos modos principales:
  - `Litros → galones`.
  - `Galones → litros`.
- Selector `US / imperial` visible únicamente en el modo
  `Galones → litros`.
- Resultados simultáneos en las dos unidades distintas del origen.
- Detección opcional de una unidad escrita o pegada en el campo.
- Precisión automática y control manual dentro de `Más opciones`.
- Fórmula general y sustitución con el valor ingresado.
- Referencias unitarias directas.
- Copiar resultado, compartir conversión y limpiar formulario.
- Atajos con valores frecuentes.
- Tabla estática breve de equivalencias.
- Estado compartible mediante parámetros de URL.

### Mejoras posteriores sujetas a datos de uso

- Recordar la última dirección y precisión elegidas en `localStorage`.
- Añadir atajos asociados a casos de uso concretos si las búsquedas lo
  justifican.
- Añadir otros idiomas cuando exista una estrategia de internacionalización.

### Fuera de alcance

- Mililitros, tazas, pintas, cuartos u otras unidades de volumen.
- Conversión entre volumen y masa.
- Historial de conversiones.
- Cuentas de usuario o almacenamiento en servidor.
- Tasas o datos obtenidos de APIs externas.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL pública | `/conversores/litros-a-galones` |
| Archivo Astro | `src/pages/conversores/litros-a-galones.astro` |
| Lógica de cálculo | `src/lib/calculators/conversores/litros-a-galones/litersGallons.ts` |
| Pruebas unitarias | `src/lib/calculators/conversores/litros-a-galones/litersGallons.test.ts` |
| Categoría | `conversores` |
| Locale base | `es-MX` |

La calculadora debe registrarse en el catálogo del sitio y enlazarse desde la
categoría de conversores. También debe enlazar al conversor general de volumen
como alternativa para usuarios que necesiten más unidades.

---

## Modelo de unidades

Usar identificadores internos estables y etiquetas completas en la interfaz:

| Identificador | Etiqueta visible | Símbolo corto |
|---------------|------------------|---------------|
| `l` | `litros` | `L` |
| `us_gal` | `galones estadounidenses` | `gal US` |
| `imp_gal` | `galones imperiales` | `gal imperial` |

El símbolo corto puede aparecer junto a un número, pero los controles,
encabezados y textos explicativos deben usar la etiqueta completa cuando haya
espacio.

---

## Flujo principal

### Estado inicial

- Modo seleccionado: `Litros → galones`.
- Campo de valor vacío.
- Sin autofocus para no abrir el teclado ni desplazar la página al cargar.
- Mostrar un estado vacío breve: `Escribe una cantidad para ver ambas
  equivalencias`.
- No mostrar errores mientras el campo permanezca vacío.

### Flujo A: litros a galones

**Ejemplo:** el usuario escribe `10`.

Mostrar:

- Resultado principal: `2.6417 gal US`.
- Resultado secundario: `2.1997 gal imperial`.
- Referencia comparativa: `El galón imperial es aproximadamente 20.1 % mayor
  que el galón estadounidense`.
- Fórmulas con sustitución:
  - `10 ÷ 3.785411784 = 2.6417 gal US`.
  - `10 ÷ 4.54609 = 2.1997 gal imperial`.

El resultado US es el principal por defecto para el locale `es-MX`, pero ambos
resultados deben quedar visibles dentro del mismo bloque y con una jerarquía
clara.

### Flujo B: galones a litros

El usuario selecciona `Galones → litros` y después el tipo de galón:

- Para `10 gal US`:
  - Resultado principal: `37.8541 L`.
  - Equivalencia secundaria: `8.3267 gal imperial`.
- Para `10 gal imperial`:
  - Resultado principal: `45.4609 L`.
  - Equivalencia secundaria: `12.0095 gal US`.

Cambiar el tipo de galón recalcula inmediatamente los resultados.

### Detección de unidad escrita

El campo puede aceptar entradas como:

- `10 litros`
- `10 L`
- `5 gal US`
- `5 galones estadounidenses`
- `5 gal imperial`
- `5 galones imperiales`
- `2.5 US gallons`
- `2,5 imperial gallons`

Cuando se detecte una unidad inequívoca:

- Actualizar el modo y la variante correspondientes.
- Normalizar el valor visual al perder el foco, sin alterar su magnitud.
- Mostrar una confirmación discreta como `Unidad detectada: galón imperial`.

La palabra aislada `galón`, `galones`, `gallon` o `gallons` es ambigua. No debe
asumirse silenciosamente una variante: mostrar un mensaje para que el usuario
elija `US` o `imperial`.

---

## Inputs del MVP

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|---------------|-------------------|
| Valor | Texto numérico con `inputmode="decimal"` | `0` a `1e15`, finito | vacío |
| Dirección | Control de dos opciones | `L → galones`, `galones → L` | `L → galones` |
| Tipo de galón | Control de dos opciones, condicional | `US`, `imperial` | `US` |
| Precisión | Selector dentro de `Más opciones` | `automática`, `0-8` | `automática` |

No se necesita un selector independiente de unidad destino: los resultados
relevantes se muestran simultáneamente. La función interna sí debe admitir
conversiones entre cualquier par de las tres unidades.

---

## Outputs

### Bloque de resultado

- Expresión completa del origen: `10 L`.
- Resultado principal con número grande y etiqueta inequívoca.
- Equivalencia secundaria en la tercera unidad.
- Referencia unitaria directa:
  - `1 L = 0.264172 gal US`.
  - `1 L = 0.219969 gal imperial`.
  - `1 gal US = 3.785411784 L`.
  - `1 gal imperial = 4.54609 L`.
- Nota comparativa entre ambos galones.
- Acción `Copiar resultado`.
- Acción `Compartir` cuando Web Share API esté disponible; en caso contrario,
  copiar el texto y el enlace.

El texto copiado o compartido siempre debe incluir el tipo de galón. Ejemplo:

```text
10 L = 2.6417 gal US = 2.1997 gal imperial
```

### Fórmula

Mostrar:

1. La fórmula general correspondiente.
2. La sustitución con el valor actual.
3. El resultado con la precisión seleccionada.

No utilizar únicamente el pseudocódigo interno como explicación para el
usuario.

---

## Fórmulas y precisión

Usar litros como unidad base:

```text
1 galon_US = 3.785411784 L
1 galon_imperial = 4.54609 L
```

Conversiones directas:

```text
galones_US = litros / 3.785411784
galones_imperiales = litros / 4.54609
litros = galones_US * 3.785411784
litros = galones_imperiales * 4.54609
```

Conversión genérica:

```text
litros = convertir_origen_a_litros(valor)
resultado = convertir_litros_a_destino(litros)
```

Reglas de precisión:

- Usar números de JavaScript sin redondear resultados intermedios.
- Redondear únicamente al formatear el resultado.
- En modo `automática`, mostrar hasta 4 decimales y eliminar ceros finales.
- Si un valor no nulo se redondearía visualmente a cero, aumentar
  progresivamente hasta 8 decimales.
- Respetar exactamente la precisión cuando el usuario seleccione manualmente
  entre 0 y 8 decimales.
- Usar notación científica para magnitudes que no puedan mostrarse de forma
  legible en el bloque de resultado.
- Formatear la salida con `Intl.NumberFormat("es-MX")`.

---

## Parsing, validaciones y estados

### Formatos admitidos

- Enteros y decimales.
- Punto o coma decimal.
- Separadores de miles de formatos habituales.
- Espacios entre grupos de miles.
- Notación científica válida, por ejemplo `1e3`.
- Unidad pegada antes o después del valor cuando sea reconocible.

Para entradas con separadores:

- Si aparecen punto y coma, el último separador se interpreta como decimal y
  el otro como agrupador.
- Si se repite un mismo separador, debe formar grupos de tres cifras válidos.
- Con un solo separador se prioriza el formato `es-MX`: punto decimal y coma
  para miles cuando existan exactamente tres cifras agrupadas.
- Normalizar internamente a una representación numérica estándar.
- Rechazar agrupaciones mal formadas en vez de adivinar.

### Reglas de validación

- Aceptar cero.
- Rechazar valores negativos.
- Rechazar `NaN`, infinito y valores mayores que `1e15`.
- Rechazar texto o unidades desconocidas.
- Rechazar un galón sin variante regional.
- La función de conversión debe aceptar origen y destino iguales y devolver el
  valor original, aunque esa combinación no se exponga en la interfaz.

### Estados de interfaz

| Estado | Comportamiento |
|--------|----------------|
| Vacío | Mostrar ayuda, sin error ni resultado numérico |
| Escritura incompleta | No mostrar error agresivo mientras el usuario escribe |
| Válido | Actualizar ambos resultados inmediatamente |
| Unidad ambigua | Pedir elegir `US` o `imperial` |
| Inválido | Mostrar un mensaje específico junto al campo |
| Fuera de rango | Informar el rango admitido |
| Copiado/compartido | Confirmación breve anunciada de forma accesible |

Los mensajes deben explicar cómo corregir el valor. Evitar textos genéricos
como `Entrada inválida` cuando pueda indicarse el problema.

---

## Experiencia mobile first

### Jerarquía en móvil

El orden visual y de lectura debe ser:

1. Título y descripción breve.
2. Campo de valor.
3. Selector de dirección.
4. Selector US/imperial cuando corresponda.
5. Resultados.
6. Acciones de copiar, compartir y limpiar.
7. Fórmula y referencias.
8. Atajos, tabla y contenido educativo.

### Requisitos de layout

- Funcionar desde `320 px` de ancho sin scroll horizontal.
- Usar una sola columna como diseño base.
- El campo, la dirección y el inicio del resultado deben quedar dentro del
  primer flujo de interacción, sin contenido editorial interpuesto.
- Los controles táctiles deben medir al menos `44 × 44 px`; se recomienda
  `48 px` de alto.
- El texto del input debe medir al menos `16 px` para evitar zoom automático
  en navegadores móviles.
- Los controles de dirección y variante deben usar etiquetas visibles, no
  depender de iconos ni tooltips.
- Los resultados largos pueden envolver líneas sin desbordar su tarjeta.
- Mantener una altura mínima estable en el bloque de resultados para evitar
  saltos bruscos al recalcular.
- En escritorio se puede usar una distribución de dos columnas, con entrada a
  la izquierda y resultado a la derecha.
- La tabla de equivalencias debe transformarse en tarjetas o conservar un
  diseño compacto que no requiera scroll horizontal.
- No usar autofocus.

No incluir un botón de intercambio solo con icono: al existir dos resultados
para un mismo origen, su destino sería ambiguo. El selector de dirección
resuelve la operación inversa de forma explícita.

---

## Accesibilidad

- Asociar el campo con `label`, ayuda y error mediante `aria-describedby`.
- Agrupar dirección y variante en `fieldset` con `legend`.
- Usar `aria-pressed` si las opciones se implementan como botones.
- Mantener navegación y activación completas mediante teclado.
- Anunciar resultados válidos mediante una región `aria-live="polite"` sin
  interrumpir cada pulsación; se puede aplicar una espera breve.
- Anunciar errores después de una entrada inválida estable, al perder el foco
  o al pegar contenido.
- Dar nombre accesible a todos los iconos interactivos.
- No comunicar estados únicamente mediante color.
- Mantener contraste suficiente y respetar `prefers-reduced-motion`.
- Devolver el foco al campo después de limpiar el formulario.

---

## Atajos y tabla de equivalencias

### Atajos interactivos

Mostrar inicialmente valores frecuentes:

- `1 L`
- `5 L`
- `10 L`
- `20 L`
- `50 L`
- `100 L`

Cada atajo carga el valor, selecciona `Litros → galones` y actualiza los
resultados. Se pueden añadir atajos inversos dentro de una sección secundaria:

- `1 gal US`
- `5 gal US`
- `1 gal imperial`
- `5 gal imperial`

### Tabla estática

Renderizar en el HTML inicial una tabla breve con las columnas:

| Litros | Galones estadounidenses | Galones imperiales |
|--------|--------------------------|--------------------|
| 1 | valor calculado | valor calculado |
| 5 | valor calculado | valor calculado |
| 10 | valor calculado | valor calculado |
| 20 | valor calculado | valor calculado |
| 50 | valor calculado | valor calculado |
| 100 | valor calculado | valor calculado |

Los valores deben derivarse de las mismas constantes utilizadas por la lógica
de cálculo para evitar discrepancias.

---

## Estado compartible

La conversión puede representarse mediante parámetros:

```text
/conversores/litros-a-galones?valor=10&origen=l
/conversores/litros-a-galones?valor=5&origen=us_gal
/conversores/litros-a-galones?valor=5&origen=imp_gal
```

- Validar todos los parámetros antes de aplicarlos.
- Ignorar parámetros desconocidos o inválidos sin romper la página.
- Mantener la URL base como canonical para evitar duplicación SEO.
- No añadir una entrada al historial del navegador por cada pulsación.
- La URL no sustituye el contenido de texto al compartir; ambos deben indicar
  claramente la variante del galón.

---

## Contenido educativo

Incluir después de la calculadora:

1. **Diferencia entre galón US e imperial.**
   - `1 gal US = 3.785411784 L`.
   - `1 gal imperial = 4.54609 L`.
   - El galón imperial es aproximadamente `20.1 %` mayor.
2. **Cómo saber qué galón usar.**
   - Recomendar revisar la región, etiqueta, manual o fuente original.
   - No inferir la variante a partir de la palabra `galón` por sí sola.
3. **Cómo convertir litros a galones.**
4. **Cómo convertir galones a litros.**
5. **Tabla de equivalencias frecuentes.**

Enlaces internos sugeridos:

- Conversor general de volumen.
- Calculadora de consumo de gasolina.
- Calculadora de costo por kilómetro.

---

## SEO

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Litros a galones US e imperiales - Conversor` |
| Meta description | `Convierte litros a galones estadounidenses e imperiales, o galones a litros. Compara ambos tipos de galón con fórmulas y equivalencias claras.` |
| H1 | `Conversor de litros a galones` |
| Keyword principal | `litros a galones` |
| Keywords secundarias | `galones a litros`, `galón estadounidense`, `galón americano`, `galón imperial`, `litros a galones US` |
| Canonical | `/conversores/litros-a-galones` |

El resultado interactivo no sustituye el contenido estático. Las fórmulas,
factores y equivalencias más buscadas deben existir en el HTML inicial.

### Preguntas frecuentes sugeridas

- ¿Cuántos galones estadounidenses tiene un litro?
- ¿Cuántos galones imperiales tiene un litro?
- ¿Cuántos litros tiene un galón estadounidense?
- ¿Cuántos litros tiene un galón imperial?
- ¿Cuál es la diferencia entre un galón US y uno imperial?
- ¿Qué tipo de galón debo usar?
- ¿Cuántos galones son 10, 20, 50 o 100 litros?

Si se genera `FAQPage` JSON-LD, sus respuestas deben coincidir con el contenido
visible de la página.

---

## API sugerida para la lógica

```ts
type VolumeUnit = "l" | "us_gal" | "imp_gal";

convertVolume(value: number, from: VolumeUnit, to: VolumeUnit): number
convertAllVolumes(value: number, from: VolumeUnit): Record<VolumeUnit, number>
parseVolumeInput(raw: string): ParseVolumeResult
formatVolume(value: number, unit: VolumeUnit, precision?: Precision): string
buildVolumeExplanation(
  value: number,
  from: VolumeUnit,
  to: VolumeUnit
): VolumeExplanation
```

Las constantes, aliases de unidades, conversión, parsing y formato deben vivir
en el módulo de dominio y ser comprobables sin DOM.

---

## Pruebas unitarias

### Conversión

- `3.785411784 L` produce `1 gal US`.
- `4.54609 L` produce `1 gal imperial`.
- `1 gal US` produce `3.785411784 L`.
- `1 gal imperial` produce `4.54609 L`.
- `10 L` produce resultados correctos en ambas variantes.
- Conversión directa entre galón US e imperial.
- Las conversiones de ida y vuelta conservan la equivalencia dentro de una
  tolerancia definida.
- Origen y destino iguales devuelven el valor original.
- Cero produce cero en todas las unidades.

### Parsing y validación

- Acepta punto y coma decimal.
- Acepta formatos `1,000.5`, `1.000,5` y agrupación con espacios.
- Acepta unidades y aliases reconocidos.
- Detecta `galón` sin variante como ambiguo.
- Rechaza valores negativos.
- Rechaza agrupaciones incorrectas, texto desconocido, `NaN` e infinito.
- Rechaza valores superiores a `1e15`.

### Presentación

- El modo automático elimina ceros finales.
- Un valor no nulo muy pequeño no se presenta como cero en modo automático.
- La precisión manual de `0-8` se respeta.
- Los números grandes usan un formato legible.
- Copiar y compartir siempre incluye `US` o `imperial`.
- La explicación utiliza la fórmula correspondiente al par de unidades.

---

## Criterios de aceptación

- Al escribir `10` en el estado inicial se muestran, sin otro toque, las
  equivalencias en galones US e imperiales.
- Al elegir `Galones → litros` se puede seleccionar explícitamente US o
  imperial.
- La interfaz nunca presenta un resultado etiquetado únicamente como `galón`.
- La calculadora funciona con teclado, lector de pantalla y controles táctiles.
- No existe scroll horizontal a `320 px`.
- La tabla y el contenido principal están presentes sin ejecutar JavaScript.
- Una entrada inválida no borra silenciosamente el último valor escrito.
- Copiar o compartir produce un texto inequívoco y una URL válida.
- No se incorporan unidades que pertenecen al conversor general de volumen.
