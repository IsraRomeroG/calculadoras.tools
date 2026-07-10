# Especificación v2 - Conversor de volumen y capacidad

## Descripción general

Herramienta general para convertir volumen y capacidad entre unidades métricas,
medidas líquidas estadounidenses y medidas líquidas imperiales.

Su valor principal es reunir en una sola experiencia unidades que suelen
aparecer en envases, depósitos, fichas técnicas, transporte y documentación
internacional, manteniendo siempre visible el sistema al que pertenece cada
unidad.

Esta calculadora no debe competir con:

- El `Conversor de litros a galones`, especializado en comparar galón
  estadounidense e imperial y responder búsquedas de litros a galones.
- El `Conversor de medidas culinarias`, especializado en recetas, tazas,
  cucharadas, cucharaditas, fracciones y medidas de masa.

**Arquitectura:** todo el cálculo ocurre en el cliente. No requiere backend,
base de datos ni llamadas a APIs externas. El contenido educativo se genera de
forma estática con Astro.

---

## Objetivo de producto

- Convertir volumen entre sistemas métrico, US e imperial.
- Ofrecer un resultado principal y equivalencias relacionadas sin saturar la
  pantalla.
- Evitar abreviaturas regionales ambiguas.
- Facilitar conversiones frecuentes de botellas, recipientes y depósitos.
- Explicar relaciones útiles como `1 ml = 1 cm³`.
- Diferenciar onzas líquidas de onzas de masa.
- Permitir copiar o compartir una conversión con su sistema regional.
- Ofrecer una experiencia accesible, rápida y mobile first.
- Generar una página estática optimizada para SEO en Astro.

---

## Posicionamiento y límites

| Herramienta | Intención principal | Contenido propio |
|-------------|---------------------|------------------|
| Conversor de volumen | Conversión general entre sistemas | ml, L, cm³, m³, fl oz, pintas, cuartos y galones |
| Litros a galones | Resolver la ambigüedad US/imperial | Comparación simultánea, tablas y búsquedas de litros a galones |
| Medidas culinarias | Seguir y adaptar recetas | Tazas, cucharas, fracciones, volumen culinario y masa |

Los galones forman parte del catálogo de unidades de esta calculadora, pero no
deben dominar su contenido, sus atajos ni su estrategia SEO. Cuando el usuario
necesite comparar específicamente galones US e imperiales, se debe enlazar al
conversor especializado.

---

## Principios de la experiencia

1. **Sistema siempre visible:** nunca mostrar `fl oz`, `pt`, `qt` o `gal` sin
   indicar `US` o `imperial`.
2. **Resultado primero:** priorizar el par origen/destino elegido y dejar las
   demás equivalencias como apoyo.
3. **Completo sin ser abrumador:** agrupar unidades por familia y colapsar
   resultados secundarios en móvil.
4. **Precisión legible:** conservar precisión interna y redondear únicamente
   la presentación.
5. **Sin falsas equivalencias:** volumen y masa son magnitudes distintas; no
   convertir a gramos, kilogramos u onzas de masa.
6. **Sin duplicar herramientas:** las medidas y presets de recetas permanecen
   en el conversor culinario.

---

## Alcance recomendado

### MVP

- Campo numérico con conversión inmediata.
- Selector de unidad origen y unidad destino.
- Unidades agrupadas por sistema.
- Resultado principal destacado.
- Panel de equivalencias secundarias agrupado y colapsable.
- Intercambio de origen y destino preservando el volumen representado.
- Detección opcional de una unidad escrita o pegada.
- Precisión automática y control manual dentro de `Más opciones`.
- Fórmula y sustitución con el valor actual.
- Copiar resultado, compartir conversión y limpiar formulario.
- Atajos asociados a capacidades frecuentes.
- Estado compartible mediante parámetros de URL.

### Mejoras posteriores sujetas a datos de uso

- Pulgada cúbica (`in³`).
- Pie cúbico (`ft³`).
- Microlitro (`µl`).
- Recordar unidades y precisión elegidas en `localStorage`.
- Fijar unidades favoritas dentro del selector.
- Añadir otros idiomas cuando exista una estrategia de internacionalización.

### Fuera de alcance

- Tazas, cucharadas y cucharaditas.
- Fracciones orientadas a recetas.
- Presets culinarios o conversiones por ingrediente.
- Comparación editorial profunda entre galón US e imperial.
- Conversión entre volumen y masa o densidad.
- Cálculo de volumen a partir de largo, ancho, alto o formas geométricas.
- Historial de conversiones.
- Cuentas de usuario o almacenamiento en servidor.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL pública | `/conversores/conversor-de-volumen` |
| Archivo Astro | `src/pages/conversores/conversor-de-volumen.astro` |
| Lógica de cálculo | `src/lib/calculators/conversores/conversor-de-volumen/volume.ts` |
| Pruebas unitarias | `src/lib/calculators/conversores/conversor-de-volumen/volume.test.ts` |
| Factores compartidos | `src/lib/calculators/conversores/shared/volumeUnits.ts` |
| Categoría | `conversores` |
| Locale base | `es-MX` |

Los factores de galones US e imperiales deben compartirse con el conversor de
litros a galones o, como mínimo, comprobarse contra las mismas constantes. No
deben existir factores regionales distintos entre ambas calculadoras.

La calculadora debe registrarse en el catálogo y enlazarse desde la categoría
de conversores.

---

## Modelo de unidades

Usar litros como unidad base y los siguientes identificadores internos:

### Sistema métrico

| Identificador | Etiqueta visible | Símbolo | Litros por unidad |
|---------------|------------------|---------|--------------------|
| `ml` | mililitros | `ml` | `0.001` |
| `l` | litros | `L` | `1` |
| `cm3` | centímetros cúbicos | `cm³` | `0.001` |
| `m3` | metros cúbicos | `m³` | `1000` |

### Medidas líquidas estadounidenses

| Identificador | Etiqueta visible | Símbolo | Litros por unidad |
|---------------|------------------|---------|--------------------|
| `us_fl_oz` | onzas líquidas estadounidenses | `fl oz US` | `0.0295735295625` |
| `us_pt` | pintas estadounidenses | `pt US` | `0.473176473` |
| `us_qt` | cuartos estadounidenses | `qt US` | `0.946352946` |
| `us_gal` | galones estadounidenses | `gal US` | `3.785411784` |

### Medidas líquidas imperiales

| Identificador | Etiqueta visible | Símbolo | Litros por unidad |
|---------------|------------------|---------|--------------------|
| `imp_fl_oz` | onzas líquidas imperiales | `fl oz imperial` | `0.0284130625` |
| `imp_pt` | pintas imperiales | `pt imperial` | `0.56826125` |
| `imp_qt` | cuartos imperiales | `qt imperial` | `1.1365225` |
| `imp_gal` | galones imperiales | `gal imperial` | `4.54609` |

Los selectores deben presentar estas unidades en tres grupos visibles:
`Métrico`, `Líquido US` e `Imperial`.

---

## Flujo principal

### Estado inicial

- Campo de valor vacío.
- Unidad origen: `litros`.
- Unidad destino: `mililitros`.
- Precisión: `automática`.
- Sin autofocus para evitar abrir el teclado al cargar.
- Estado vacío: `Escribe una cantidad para convertir su volumen`.
- Sin resultados numéricos ni mensajes de error mientras el campo esté vacío.

### Ejemplo A: litros a mililitros

El usuario escribe `2`.

Mostrar:

- Origen: `2 L`.
- Resultado principal: `2,000 ml`.
- Referencia directa: `1 L = 1,000 ml`.
- Fórmula con sustitución: `2 × 1,000 = 2,000 ml`.
- Equivalencia contextual: `2,000 cm³`.

### Ejemplo B: metros cúbicos a litros

El usuario selecciona `m³` como origen, `L` como destino y escribe `1.5`.

Mostrar:

- Resultado principal: `1,500 L`.
- Referencia directa: `1 m³ = 1,000 L`.
- Fórmula con sustitución: `1.5 × 1,000 = 1,500 L`.
- Equivalencias métricas disponibles en el panel secundario.

### Ejemplo C: sistemas regionales

El usuario convierte `32 fl oz US` a `L`.

Mostrar:

- Resultado principal: `0.9464 L`.
- Referencia directa: `1 fl oz US = 0.0295735295625 L`.
- Equivalencia contextual: `1 qt US`.
- El sistema `US` debe aparecer en todos los textos copiados, compartidos y
  anunciados.

### Intercambiar unidades

Intercambiar debe preservar el volumen físico, no solo cambiar las etiquetas.

Ejemplo:

```text
2 L → 2,000 ml
```

Después de intercambiar:

```text
2,000 ml → 2 L
```

El botón debe tener texto visible o un nombre accesible inequívoco.

---

## Inputs del MVP

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|---------------|-------------------|
| Valor | Texto numérico con `inputmode="decimal"` | `0` a `1e15`, finito | vacío |
| Unidad origen | Selector agrupado | unidades del MVP | `l` |
| Unidad destino | Selector agrupado | unidades del MVP | `ml` |
| Precisión | Selector dentro de `Más opciones` | `automática`, `0-8` | `automática` |

Con doce unidades, la interfaz no debe presentar todos los orígenes y destinos
como una cuadrícula de botones.

Implementación recomendada:

- Selector nativo con `optgroup` como base accesible, o
- Diálogo accesible con búsqueda y grupos si se necesita una experiencia más
  rica.

En móvil, ambos selectores ocupan todo el ancho y se apilan verticalmente.

---

## Resultados

### Resultado principal

Mostrar:

- Valor y unidad de origen.
- Valor convertido con la unidad destino completa.
- Referencia `1 unidad origen = x unidades destino`.
- Fórmula y sustitución.
- Acciones `Copiar`, `Compartir` y `Limpiar`.

El texto copiado debe ser inequívoco:

```text
32 fl oz US = 0.9464 L
```

No usar:

```text
32 oz = 0.9464 L
```

### Equivalencias secundarias

Mostrar un panel llamado `Todas las equivalencias`, agrupado en:

- Métrico.
- Líquido US.
- Imperial.

Reglas:

- El grupo que contiene la unidad destino puede aparecer abierto inicialmente.
- Los otros grupos permanecen colapsados en móvil.
- En escritorio pueden mostrarse dos o tres grupos si existe espacio.
- Cada fila incluye valor, símbolo y etiqueta regional.
- Seleccionar una fila puede convertir esa unidad en el nuevo destino.
- Copiar una fila debe incluir el sistema regional.
- No repetir la unidad de origen como un descubrimiento relevante.

La lista completa complementa el resultado principal; no debe competir
visualmente con él.

---

## Detección de unidades

El campo puede aceptar entradas como:

- `750 ml`
- `2.5 L`
- `2,5 litros`
- `1000 cc`
- `1.5 m3`
- `1,5 m³`
- `32 fl oz US`
- `2 pt imperial`
- `5 galones estadounidenses`

Aliases mínimos:

| Unidad | Aliases |
|--------|---------|
| `ml` | `ml`, `mililitro`, `mililitros` |
| `l` | `l`, `litro`, `litros` |
| `cm3` | `cm3`, `cm³`, `cc`, `centímetro cúbico` |
| `m3` | `m3`, `m³`, `metro cúbico`, `metros cúbicos` |
| `us_fl_oz` | `fl oz US`, `US fl oz`, `onza líquida US` |
| `us_pt` | `pt US`, `pinta US`, `pinta estadounidense` |
| `us_qt` | `qt US`, `cuarto US`, `cuarto estadounidense` |
| `us_gal` | `gal US`, `US gal`, `galón estadounidense` |
| `imp_fl_oz` | `fl oz imperial`, `imperial fl oz` |
| `imp_pt` | `pt imperial`, `pinta imperial` |
| `imp_qt` | `qt imperial`, `cuarto imperial` |
| `imp_gal` | `gal imperial`, `imperial gal`, `galón imperial` |

Cuando se detecte una unidad inequívoca:

- Actualizar la unidad origen.
- Mantener el destino si sigue siendo distinto y válido.
- Normalizar el número al perder el foco sin alterar su magnitud.
- Mostrar una confirmación discreta de la unidad detectada.

Son ambiguos:

- `fl oz`
- `pt`
- `pinta`
- `qt`
- `cuarto`
- `gal`
- `galón`

No se debe asumir silenciosamente un sistema. Solicitar `US` o `imperial`.

La entrada `oz` sin `fl` representa normalmente una unidad de masa y debe
rechazarse con una explicación: `Para volumen usa fl oz US o fl oz imperial`.

---

## Fórmulas y precisión

Usar litros como base:

```text
litros = valor * factor_origen_en_litros
resultado = litros / factor_destino_en_litros
```

Fórmula genérica:

```text
resultado =
  valor
  * litros_por_unidad_origen
  / litros_por_unidad_destino
```

La explicación para el usuario debe simplificarse cuando exista una relación
directa fácil de leer:

```text
2 L × 1000 = 2000 ml
1.5 m³ × 1000 = 1500 L
```

Para conversiones entre sistemas puede mostrar el paso por litros:

```text
32 fl oz US × 0.0295735295625 L/fl oz US = 0.946352946 L
```

Reglas de precisión:

- Conservar los resultados intermedios sin redondear.
- Redondear únicamente al formatear.
- En modo `automática`, mostrar hasta 4 decimales y eliminar ceros finales.
- Si un resultado no nulo se redondearía a cero, aumentar progresivamente hasta
  8 decimales.
- Respetar exactamente una precisión manual de 0 a 8 decimales.
- Usar notación científica para magnitudes que no sean legibles en formato
  decimal.
- Normalizar `-0` a `0`.
- Formatear la salida con `Intl.NumberFormat("es-MX")`.

---

## Parsing, validaciones y estados

### Formatos numéricos admitidos

- Enteros y decimales.
- Punto o coma decimal.
- Separadores de miles válidos.
- Espacios entre grupos de miles.
- Notación científica válida, por ejemplo `1e3`.
- Unidad antes o después del valor cuando sea reconocible.

Reglas de interpretación:

- Cuando aparezcan punto y coma, el último separador es decimal y el otro es
  agrupador.
- Un separador repetido solo es válido si forma grupos de tres cifras.
- Con un único punto se prioriza su uso decimal en `es-MX`.
- Con una única coma y tres cifras posteriores se prioriza la agrupación de
  miles, salvo que la parte entera sea `0`.
- Mostrar una nota cuando una entrada potencialmente ambigua se interprete como
  miles.
- Rechazar agrupaciones mal formadas en vez de adivinar.

### Validaciones

- Aceptar cero.
- Rechazar valores negativos.
- Rechazar `NaN`, infinito y valores mayores que `1e15`.
- Rechazar unidades desconocidas o incompatibles.
- Pedir el sistema cuando una unidad regional sea ambigua.
- Permitir origen y destino iguales en la función de dominio y devolver el
  valor original.

### Estados de interfaz

| Estado | Comportamiento |
|--------|----------------|
| Vacío | Ayuda inicial, sin error ni resultado numérico |
| Escritura incompleta | Esperar mientras el usuario escribe |
| Válido | Actualizar resultado y equivalencias inmediatamente |
| Unidad ambigua | Solicitar US o imperial |
| Unidad de masa | Explicar la diferencia entre `oz` y `fl oz` |
| Inválido | Mensaje específico asociado al campo |
| Fuera de rango | Informar el máximo admitido |
| Copiado/compartido | Confirmación breve y accesible |

No borrar ni sustituir silenciosamente el valor que causó un error.

---

## Experiencia mobile first

### Jerarquía

El orden visual y de lectura debe ser:

1. Título y descripción breve.
2. Campo de valor.
3. Unidad origen.
4. Acción `Intercambiar`.
5. Unidad destino.
6. Resultado principal.
7. Acciones de copiar, compartir y limpiar.
8. Equivalencias agrupadas.
9. Fórmula, atajos y contenido educativo.

### Requisitos de layout

- Funcionar desde `320 px` sin scroll horizontal.
- Usar una sola columna como diseño base.
- Apilar los selectores a ancho completo en móvil.
- Mantener campo, selectores y resultado antes de contenido editorial.
- Usar controles táctiles de al menos `44 × 44 px`; se recomienda `48 px`.
- Usar texto de al menos `16 px` en el input para evitar zoom automático.
- Mantener el botón de intercambio cerca de ambos selectores y con nombre
  visible o accesible.
- Mantener una altura mínima estable en el resultado para evitar saltos.
- Permitir que números y etiquetas largas envuelvan línea sin desbordarse.
- Colapsar equivalencias secundarias para evitar una lista extensa.
- No representar las doce unidades como botones simultáneos.
- No usar tablas horizontales para los resultados interactivos.
- No usar autofocus.

En escritorio se puede usar una distribución de dos columnas: entrada a la
izquierda y resultado a la derecha.

---

## Accesibilidad

- Asociar el campo con `label`, ayuda y error mediante `aria-describedby`.
- Usar etiquetas visibles para ambos selectores.
- Conservar `optgroup` si se utilizan selectores nativos.
- Gestionar foco, búsqueda y cierre correctamente si se usa un diálogo
  personalizado.
- Mantener navegación y activación completas mediante teclado.
- Dar nombre accesible al botón de intercambio y a los iconos interactivos.
- Anunciar resultados válidos mediante `aria-live="polite"` con una espera
  breve para no interrumpir cada pulsación.
- Anunciar errores al estabilizarse la entrada, al pegar o al perder el foco.
- No comunicar sistema, selección o error únicamente mediante color.
- Mantener contraste suficiente y respetar `prefers-reduced-motion`.
- Devolver el foco al campo después de limpiar.

---

## Atajos prácticos

Mostrar atajos asociados a capacidades frecuentes, no a recetas:

| Etiqueta | Valor | Unidad |
|----------|-------|--------|
| Lata pequeña | 330 | `ml` |
| Botella individual | 500 | `ml` |
| Botella | 750 | `ml` |
| Un litro | 1 | `l` |
| Botella grande | 1.5 | `l` |
| Botella familiar | 2 | `l` |
| Recipiente | 5 | `l` |
| Garrafón o depósito | 20 | `l` |
| Metro cúbico | 1 | `m3` |

Las etiquetas son referencias de capacidad, no afirmaciones de que todos los
envases tengan ese tamaño.

Cada atajo:

- Carga valor y origen.
- Conserva el destino si es válido o elige uno útil por defecto.
- Desplaza el foco lógico al resultado sin forzar scroll brusco.

---

## Estado compartible

La conversión puede representarse mediante parámetros:

```text
/conversores/conversor-de-volumen?valor=2&origen=l&destino=ml
/conversores/conversor-de-volumen?valor=1.5&origen=m3&destino=l
/conversores/conversor-de-volumen?valor=32&origen=us_fl_oz&destino=l
```

- Validar parámetros antes de aplicarlos.
- Ignorar parámetros desconocidos sin romper la página.
- Mantener la URL base como canonical.
- Actualizar mediante `history.replaceState`; no crear una entrada por cada
  pulsación.
- Incluir la variante regional en el texto compartido.

---

## Contenido educativo

Incluir después de la calculadora:

1. **Volumen y capacidad.**
   - Explicar que ambas expresiones describen espacio, aunque `capacidad` suele
     usarse para recipientes.
2. **Relación entre ml, cm³, L y m³.**
   - `1 ml = 1 cm³`.
   - `1 L = 1000 ml`.
   - `1 m³ = 1000 L`.
3. **Sistemas US e imperial.**
   - Explicar que sus unidades con nombres iguales no siempre representan el
     mismo volumen.
   - Enlazar a `Litros a galones` para una comparación detallada de galones.
4. **Onzas líquidas y onzas de masa.**
   - `fl oz` mide volumen.
   - `oz` mide masa.
5. **Cómo elegir la unidad correcta.**
   - Recomendar revisar etiqueta, ficha técnica, país y símbolo original.

Enlaces internos sugeridos:

- Conversor de litros a galones.
- Conversor de medidas culinarias.
- Calculadora de volumen de figuras o recipientes, cuando exista.
- Calculadora de consumo de gasolina.

---

## SEO

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Conversor de volumen y capacidad: ml, L, m³ y más` |
| Meta description | `Convierte volumen entre mililitros, litros, metros cúbicos, onzas líquidas, pintas, cuartos y galones US o imperiales.` |
| H1 | `Conversor de volumen y capacidad` |
| Keyword principal | `conversor de volumen` |
| Keywords secundarias | `ml a litros`, `metros cúbicos a litros`, `onzas líquidas a ml`, `pintas a litros`, `cuartos a litros` |
| Canonical | `/conversores/conversor-de-volumen` |

No utilizar `litros a galones` ni `galones a litros` como objetivos SEO
principales. Esas búsquedas pertenecen al conversor especializado.

El contenido estático debe incluir los factores métricos y una explicación de
los sistemas aunque JavaScript no se ejecute.

### Preguntas frecuentes sugeridas

- ¿Cuántos mililitros tiene un litro?
- ¿Cuántos litros tiene un metro cúbico?
- ¿Un mililitro es igual a un centímetro cúbico?
- ¿Qué diferencia hay entre una onza y una onza líquida?
- ¿Son iguales las pintas US y las pintas imperiales?
- ¿Son iguales los cuartos US y los cuartos imperiales?
- ¿Cómo saber si una medida es US o imperial?

Las preguntas específicas sobre cuántos litros tiene cada galón deben
responderse principalmente en el conversor de litros a galones.

Si se genera `FAQPage` JSON-LD, sus respuestas deben coincidir con el contenido
visible.

---

## API sugerida para la lógica

```ts
type VolumeUnit =
  | "ml"
  | "l"
  | "cm3"
  | "m3"
  | "us_fl_oz"
  | "us_pt"
  | "us_qt"
  | "us_gal"
  | "imp_fl_oz"
  | "imp_pt"
  | "imp_qt"
  | "imp_gal";

type VolumeSystem = "metric" | "us" | "imperial";

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

Las constantes, aliases, conversión, parsing y formato deben vivir en módulos
de dominio comprobables sin DOM. Los helpers de formato localizado pueden
compartirse con otros conversores para mantener un comportamiento consistente.

---

## Pruebas unitarias

### Factores y conversión

- `1 L` produce `1000 ml`.
- `1 ml` produce `1 cm³`.
- `1 m³` produce `1000 L` y `1,000,000 ml`.
- `1 gal US` produce `128 fl oz US`, `8 pt US` y `4 qt US`.
- `1 gal imperial` produce `160 fl oz imperial`, `8 pt imperial` y
  `4 qt imperial`.
- Los factores de galón coinciden con los del conversor especializado.
- Las conversiones entre sistemas producen resultados correctos.
- La ida y vuelta conserva la equivalencia dentro de una tolerancia definida.
- Origen y destino iguales devuelven el valor original.
- Cero produce cero en todas las unidades.

### Parsing y validación

- Acepta punto y coma decimal.
- Acepta `1,000.5`, `1.000,5` y agrupación con espacios.
- Acepta `cm3`, `cm³`, `cc`, `m3` y `m³`.
- Detecta aliases regionales inequívocos.
- Detecta `fl oz`, `pt`, `qt` y `gal` sin sistema como ambiguos.
- Rechaza `oz` de masa con un error específico.
- Rechaza negativos, agrupaciones incorrectas, texto, `NaN` e infinito.
- Rechaza valores superiores a `1e15`.

### Presentación y estado

- La precisión automática elimina ceros finales.
- Un valor no nulo pequeño no se presenta como cero.
- La precisión manual de 0 a 8 se respeta.
- Los números grandes usan un formato legible.
- Intercambiar unidades preserva el volumen y actualiza el valor de entrada.
- Copiar y compartir incluye el sistema regional.
- Las equivalencias se agrupan en métrico, US e imperial.
- La explicación utiliza la fórmula correspondiente.

---

## Criterios de aceptación

- El estado inicial permite convertir litros a mililitros sin configurar el
  sistema.
- Todas las unidades regionales indican `US` o `imperial`.
- Intercambiar conserva la cantidad física representada.
- Las equivalencias secundarias no desplazan ni ocultan el resultado principal.
- No existe scroll horizontal a `320 px`.
- La interfaz funciona con teclado, lector de pantalla y controles táctiles.
- Una entrada inválida permanece visible y recibe un mensaje accionable.
- El contenido no incluye tazas, cucharas ni presets de recetas.
- La página enlaza a la #81 para comparación de galones y al conversor
  culinario para medidas de recetas.
- La estrategia SEO no compite por `litros a galones`.
