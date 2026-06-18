# Especificación v2 - Calculadora de combinaciones y permutaciones

## Descripción general

Herramienta educativa para calcular formas de elegir u ordenar elementos con o
sin repetición. Debe ayudar a resolver ejercicios de conteo, probabilidad,
sorteos, contraseñas, podios y selección de grupos sin exigir que el usuario
conozca previamente el nombre de cada fórmula.

La interfaz guiará la elección del cálculo mediante dos preguntas:

1. ¿Importa el orden?
2. ¿Se pueden repetir elementos?

**Arquitectura:** todo el cálculo ocurre en el cliente. No requiere backend,
base de datos ni llamadas a APIs externas.

---

## Objetivo de producto

- Ayudar al usuario a elegir la fórmula correcta según su problema.
- Calcular combinaciones, arreglos o permutaciones parciales con y sin
  repetición.
- Entregar resultados enteros exactos con `BigInt`.
- Explicar qué significa el resultado en lenguaje natural.
- Mostrar fórmula general, sustitución de valores y procedimiento resumido.
- Generar una página estática optimizada para SEO en Astro.

---

## Alcance recomendado

### MVP

- Selector guiado por las preguntas `¿Importa el orden?` y
  `¿Se pueden repetir?`.
- Inputs enteros `n` y `k` con etiquetas explicativas.
- Cuatro casos de cálculo.
- Resultado exacto con `BigInt`.
- Vista resumida para resultados largos, cantidad de dígitos y resultado exacto
  desplegable.
- Interpretación del resultado en lenguaje natural.
- Fórmula general, sustitución y procedimiento resumido.
- Ejemplos rápidos de comité, podio, contraseña y sabores.
- Copiar resultado exacto y limpiar formulario.
- Diseño mobile-first y accesible por teclado.

### Fase 2

- Modo para permutaciones de un multiconjunto, por ejemplo las letras repetidas
  de `MAMA`: `4! / (2! × 2!)`.
- Desarrollo factorial detallado cuando el tamaño permita una explicación
  legible.
- Historial en `sessionStorage`.
- Compartir el cálculo mediante parámetros de URL.
- Más ejemplos resueltos de lotería, cartas y probabilidad.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL de categoría | `/probabilidad-estadistica` |
| URL canónica | `/probabilidad-estadistica/calculadora-combinaciones-permutaciones` |
| Archivo Astro | `src/pages/probabilidad-estadistica/calculadora-combinaciones-permutaciones.astro` |
| Lógica de cálculo | `src/lib/calculators/probabilidad-estadistica/calculadora-combinaciones-permutaciones/combinatorics.ts` |
| Pruebas unitarias | `src/lib/calculators/probabilidad-estadistica/calculadora-combinaciones-permutaciones/combinatorics.test.ts` |
| Categoría canónica | `probabilidad-estadistica` |
| Etiqueta de categoría | `Probabilidad y estadística` |
| Locale base | `es-MX` |

La ruta debe permanecer estable y no debe existir una copia de la calculadora
bajo `/matematicas`. Cualquier cambio posterior de una URL que ya haya sido
publicada deberá incluir una redirección permanente `301`.

La ruta
`/probabilidad-estadistica/calculadora-probabilidad-basica` corresponde a la
calculadora de probabilidad básica. Para esta calculadora se conserva el slug
específico `calculadora-combinaciones-permutaciones`.

---

## Creación de la categoría Probabilidad y estadística

La categoría `probabilidad-estadistica` no existe actualmente en el proyecto y
debe crearse como parte de la implementación de esta calculadora.

### Registro de categoría

Actualizar `src/lib/constants/categories.ts`:

- Agregar `probabilidad-estadistica` a `CATEGORY_SLUGS`.
- Agregar sus metadatos a `CATEGORIES`.
- Usar la etiqueta visible `Probabilidad y estadística`.
- Incluir una descripción orientada a probabilidad, conteo, distribuciones y
  análisis estadístico.

Descripción sugerida:

```text
Calculadoras para resolver problemas de probabilidad, conteo y estadística con fórmulas claras, resultados exactos y explicaciones paso a paso.
```

El slug se comparte con el esquema de contenido del blog. Por tanto, al
registrarlo en `CATEGORY_SLUGS`, también quedará disponible como categoría
válida para futuros artículos en `src/content/blog`.

### Generación de la página de categoría

No se debe crear manualmente un archivo
`src/pages/probabilidad-estadistica/index.astro`.

El proyecto genera las páginas de categorías mediante
`src/pages/[category].astro`, utilizando las calculadoras publicadas del
directorio. La ruta `/probabilidad-estadistica` se generará cuando exista al
menos una entrada publicada con ese `categorySlug`.

### Registro de la calculadora

Agregar una entrada en `src/lib/constants/calculators.ts` con:

```text
id: calculadora-combinaciones-permutaciones
href: /probabilidad-estadistica/calculadora-combinaciones-permutaciones
categorySlug: probabilidad-estadistica
```

La entrada debe incluir título, descripción breve y un orden coherente con el
catálogo. El `href` debe comenzar con el mismo slug declarado en
`categorySlug`.

Al publicarse esa entrada, el sistema debe:

- Mostrar la nueva categoría en la portada.
- Generar `/probabilidad-estadistica`.
- Listar esta calculadora dentro de la categoría.
- Incluir ambas rutas estáticas en el sitemap.

### Página de la calculadora

La página debe usar:

- `canonical="/probabilidad-estadistica/calculadora-combinaciones-permutaciones"`.
- Kicker `Probabilidad y estadística`.
- Breadcrumb de categoría con etiqueta `Probabilidad y estadística` y enlace
  `/probabilidad-estadistica`.
- Imports de lógica desde
  `@lib/calculators/probabilidad-estadistica/calculadora-combinaciones-permutaciones/combinatorics`.

No deben quedar referencias internas a `/matematicas` para esta calculadora.

### Pruebas de integración del directorio

Actualizar `src/lib/calculator-directory.test.ts` para comprobar:

- `getCalculatorCategoryUrl("probabilidad-estadistica")` devuelve
  `/probabilidad-estadistica`.
- La etiqueta visible es `Probabilidad y estadística`.
- El slug no colisiona con rutas reservadas ni con slugs heredados.
- La calculadora tiene metadatos de categoría válidos.
- Su `href` comienza con `/probabilidad-estadistica/`.
- La categoría aparece en el directorio cuando la calculadora está publicada.

### Redirecciones

No se requiere una redirección desde
`/matematicas/calculadora-combinaciones-permutaciones` si esa ruta nunca se
publicó y solo existía como propuesta en esta especificación.

Si al implementar se descubre que la URL anterior ya fue desplegada o indexada,
se debe mover la página, eliminar la fuente antigua y agregar en
`public/.htaccess`:

```apache
RewriteRule ^matematicas/calculadora-combinaciones-permutaciones/?$ /probabilidad-estadistica/calculadora-combinaciones-permutaciones [R=301,L]
```

No se debe conservar una página Astro duplicada como redirección.

### Archivos que no requieren una implementación específica

- `src/pages/[category].astro`: ya genera la portada de cada categoría
  publicada.
- `src/pages/index.astro`: ya obtiene y muestra las categorías desde el
  directorio.
- `src/lib/constants/calculator-categories.ts`: ya reexporta los metadatos
  compartidos.
- `src/content.config.ts`: ya consume `CATEGORY_SLUGS`; no necesita declarar el
  nuevo slug por separado.
- `astro.config.mjs`: el sitemap incluye las rutas estáticas generadas, por lo
  que no requiere una regla especial para esta categoría.

---

## Modelo conceptual y terminología

La decisión se obtiene con dos variables booleanas:

| ¿Importa el orden? | ¿Se permite repetir? | Nombre mostrado | Notación |
|--------------------|----------------------|-----------------|----------|
| No | No | Combinación sin repetición | `C(n, k)` |
| Sí | No | Arreglo sin repetición | `P(n, k)` |
| No | Sí | Combinación con repetición | `CR(n, k)` |
| Sí | Sí | Arreglo con repetición | `n^k` |

En contenido educativo se puede aclarar que:

- `P(n, k)` también se conoce como permutación parcial, variación o arreglo.
- `n^k` también se conoce como variación o arreglo con repetición.
- La expresión “permutación con repetición” puede referirse también a ordenar un
  multiconjunto. Ese caso no forma parte del MVP para evitar ambigüedad.

---

## Flujo principal del MVP

**Ejemplo:** ¿Cuántas formas hay de elegir `3` personas de un grupo de `10`?

1. El usuario indica que el orden no importa.
2. Indica que no se pueden repetir personas.
3. Captura `n = 10` y `k = 3`.
4. La calculadora identifica el caso como combinación sin repetición.
5. Muestra `120` como resultado.
6. Explica: “Hay 120 formas de elegir 3 elementos entre 10 cuando el orden no
   importa y no se permiten repeticiones”.
7. Muestra `C(10, 3) = 10! / (3! × 7!) = 120`.

### Inputs del MVP

| Campo | Etiqueta visible | Tipo | Rango válido | Valor inicial |
|-------|------------------|------|---------------|---------------|
| Orden | ¿Importa el orden? | Control segmentado Sí/No | obligatorio | No |
| Repetición | ¿Se pueden repetir elementos? | Control segmentado Sí/No | obligatorio | No |
| `n` | Elementos disponibles (n) | Texto numérico entero | `0-10000` | vacío |
| `k` | Elementos que eliges o posiciones (k) | Texto numérico entero | `0-10000` | vacío |

Debajo de cada input se mostrará ayuda contextual:

- `n`: “El total de opciones o elementos disponibles”.
- `k`: “Cuántos elementos eliges o cuántas posiciones quieres llenar”.

El texto de ayuda puede adaptarse al caso seleccionado. Por ejemplo, en un
arreglo con repetición, `n` representa las opciones disponibles para cada una de
las `k` posiciones.

### Ejemplos rápidos

| Ejemplo | Orden | Repetición | Valores |
|---------|-------|------------|---------|
| Elegir un comité | No | No | `n = 10`, `k = 3` |
| Asignar oro, plata y bronce | Sí | No | `n = 10`, `k = 3` |
| Elegir 3 bolas de helado entre 5 sabores | No | Sí | `n = 5`, `k = 3` |
| Crear un PIN de 4 dígitos | Sí | Sí | `n = 10`, `k = 4` |

Al tocar un ejemplo se deben cargar la selección y los valores, pero el usuario
conserva el control para modificarlos.

---

## Outputs

### Resultado principal

- Nombre del cálculo identificado.
- Resultado exacto cuando tenga una longitud legible.
- Interpretación en lenguaje natural.
- Cantidad de dígitos cuando el resultado sea largo.

### Resultados largos

Si el resultado supera `24` dígitos:

- Mostrar una vista compacta en notación científica, sin presentarla como valor
  exacto.
- Mostrar el número total de dígitos.
- Incluir `Ver resultado exacto` en un bloque desplegable.
- Permitir copiar el entero exacto sin separadores de miles.
- Aplicar ajuste de línea y evitar desplazamiento horizontal de toda la página.

Ejemplo:

```text
Vista resumida: 1.0089 × 10^29
Longitud: 30 dígitos
Resultado exacto: 100891344545564193334812497256
```

La vista científica debe construirse desde la cadena exacta; no debe convertir
el resultado a `Number`.

### Explicación

Mostrar en este orden:

1. Qué caso se eligió y por qué.
2. Fórmula general.
3. Sustitución de `n` y `k`.
4. Simplificación multiplicativa breve.
5. Resultado e interpretación.

El desarrollo completo debe limitarse para no crear bloques inmanejables. Si
`k` es grande, se muestra una explicación resumida en lugar de enumerar miles de
factores.

---

## Fórmulas

Factorial, usado para la explicación matemática:

```text
0! = 1
n! = n × (n - 1) × ... × 2 × 1
```

Combinación sin repetición:

```text
C(n, k) = n! / (k! × (n-k)!)
```

Arreglo sin repetición:

```text
P(n, k) = n! / (n-k)!
```

Combinación con repetición:

```text
CR(n, k) = C(n + k - 1, k)
```

Arreglo con repetición:

```text
AR(n, k) = n^k
```

---

## Algoritmos de cálculo

Todos los cálculos enteros se realizan con `BigInt`. No se debe implementar el
cálculo principal mediante factoriales recursivos.

### Combinación sin repetición

Usar la simetría `C(n, k) = C(n, n-k)` y un producto multiplicativo:

```text
r = min(k, n-k)
resultado = 1

para i desde 1 hasta r:
  resultado = resultado × (n-r+i) / i
```

Cada división es exacta en la secuencia.

### Arreglo sin repetición

```text
resultado = 1

para i desde 0 hasta k-1:
  resultado = resultado × (n-i)
```

### Combinación con repetición

Reutilizar el algoritmo de combinación:

```text
CR(n, k) = C(n+k-1, k)
```

### Arreglo con repetición

```text
resultado = BigInt(n) ** BigInt(k)
```

No convertir el resultado final a `Number` para formatearlo o copiarlo.

---

## Validaciones y convenciones

- `n` y `k` deben ser enteros no negativos escritos en base decimal.
- No aceptar signos negativos, decimales, exponenciales ni caracteres
  diferentes de dígitos.
- El límite inicial es `10000` para cada entrada, con un mensaje específico si
  se excede.
- En cálculos sin repetición debe cumplirse `k <= n`.
- En combinación con repetición debe cumplirse `n > 0`, excepto cuando `k = 0`.
- Para cualquier caso válido con `k = 0`, el resultado es `1`.
- `C(0, 0) = 1` y `P(0, 0) = 1`.
- Para el arreglo con repetición se adopta la convención combinatoria `0^0 = 1`
  cuando `k = 0`.
- Si `n = 0` y `k > 0` en un arreglo con repetición, el resultado es `0`.
- El formulario vacío no debe mostrar un error antes de que el usuario intente
  calcular.
- Los errores deben aparecer junto al campo correspondiente y conservar los
  valores capturados.
- Cambiar orden o repetición debe actualizar el nombre del caso y las ayudas,
  pero no borrar `n` ni `k`.

---

## Comportamiento mobile-first

### Jerarquía

En pantallas pequeñas, el orden será:

1. Preguntas de orden y repetición.
2. Inputs `n` y `k`.
3. Ejemplos rápidos en desplazamiento horizontal contenido.
4. Botón `Calcular` de ancho completo.
5. Resultado principal.
6. Interpretación.
7. Fórmula y procedimiento desplegables.
8. Acciones `Copiar resultado` y `Limpiar`.

En desktop, formulario y resultado pueden mostrarse en dos columnas. Los inputs
pueden alinearse en una fila únicamente cuando exista espacio suficiente.

### Requisitos de interacción

- Controles táctiles con altura mínima de `44px`.
- Inputs con tamaño de fuente mínimo de `16px` para evitar zoom automático.
- Usar `inputmode="numeric"` y `autocomplete="off"`.
- No depender de hover para explicar una opción.
- El resultado largo debe usar ajuste de línea dentro de su contenedor.
- Ningún bloque debe provocar scroll horizontal global.
- El botón principal debe permanecer visible sin exigir desplazamiento lateral.
- No usar una tabla como componente principal de interacción.

### Accesibilidad

- Los controles segmentados deben comunicar su estado con `aria-pressed` o
  radios nativos correctamente etiquetados.
- Asociar cada error mediante `aria-describedby`.
- Marcar inputs inválidos con `aria-invalid="true"`.
- Anunciar el resultado y los errores con una región `aria-live="polite"`.
- Mantener foco visible y navegación completa por teclado.
- No mover el foco automáticamente salvo al enviar un formulario con errores;
  en ese caso, llevarlo al primer campo inválido.
- El texto visible debe explicar el significado de `n` y `k`; no depender solo
  de símbolos matemáticos.

---

## Estados de interfaz

### Inicial

- Mostrar las preguntas, inputs vacíos y ejemplos.
- El panel de resultado invita a completar los datos.
- Las acciones de copia permanecen deshabilitadas u ocultas.

### Válido

- Mostrar resultado, interpretación y fórmula.
- Habilitar copia del resultado exacto.
- Mantener visibles los datos introducidos.

### Error

- Mostrar un mensaje accionable y específico.
- No reemplazar todo el panel con un error genérico.
- Ejemplo: “Para elegir sin repetición, k no puede ser mayor que n”.

### Calculando

Con los límites definidos el cálculo debería ser inmediato. Si una operación
supera perceptiblemente un fotograma, mostrar estado `Calculando…` y evitar
envíos duplicados hasta completar.

---

## Contenido educativo y SEO

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de combinaciones y permutaciones` |
| Meta description | `Calcula combinaciones, arreglos y permutaciones con o sin repetición. Elige si importa el orden y obtén fórmula, explicación y resultado exacto.` |
| H1 | `Calculadora de combinaciones y permutaciones` |
| Keyword principal | `calculadora combinaciones permutaciones` |
| Keywords secundarias | `nck calculadora`, `permutaciones fórmula`, `combinaciones con repetición`, `variaciones con repetición` |

### Secciones de contenido sugeridas

- Cómo saber si importa el orden.
- Cómo saber si se permite repetir.
- Diferencia entre combinación, arreglo y permutación.
- Ejemplos resueltos.
- Qué significa `n` y `k`.
- Por qué algunos resultados tienen tantos dígitos.

### FAQs sugeridas

- ¿Cuál es la diferencia entre combinación y permutación?
- ¿Cómo sé si el orden importa?
- ¿Qué significa que se puedan repetir elementos?
- ¿Qué pasa si `k` es mayor que `n`?
- ¿Por qué la calculadora usa números tan grandes?
- ¿Qué diferencia hay entre `n^k` y una permutación de elementos repetidos?

---

## Copia del resultado

El texto copiado debe incluir:

```text
Combinación sin repetición
n = 10, k = 3
C(10, 3) = 120
Hay 120 formas de elegir 3 elementos entre 10 cuando el orden no importa y no se permiten repeticiones.
```

Si el resultado es largo, se copia siempre el entero exacto, no la vista
científica.

---

## Pruebas unitarias sugeridas

### Casos principales

- `C(10, 3)` produce `120`.
- `P(10, 3)` produce `720`.
- `CR(5, 3)` produce `35`.
- `AR(5, 3)` produce `125`.
- `C(100, 50)` produce exactamente
  `100891344545564193334812497256`.
- Un resultado superior a `Number.MAX_SAFE_INTEGER` conserva precisión exacta.

### Identidades y límites

- `C(0, 0) = 1`.
- `C(n, 0) = 1`.
- `C(n, n) = 1`.
- `P(0, 0) = 1`.
- `P(n, 0) = 1`.
- `CR(1, k) = 1`.
- `AR(n, 0) = 1`.
- `AR(0, 0) = 1` por la convención definida.
- `AR(0, k) = 0` para `k > 0`.

### Validación

- `k > n` sin repetición muestra un error específico.
- `n = 0`, `k > 0` en combinación con repetición muestra error.
- Entradas vacías no calculan.
- Números negativos muestran error.
- Decimales muestran error.
- Notación exponencial como `1e3` muestra error.
- Valores mayores que `10000` muestran el mensaje de límite.

### Presentación

- Resultados de hasta `24` dígitos se muestran completos como resultado
  principal.
- Resultados de más de `24` dígitos muestran vista compacta, cantidad de
  dígitos y resultado exacto desplegable.
- La vista compacta se deriva de la cadena exacta sin convertirla a `Number`.
- Copiar devuelve el entero exacto sin separadores.

---

## Criterios de aceptación

- El usuario puede elegir el cálculo sin conocer la terminología matemática.
- Las cuatro combinaciones de orden y repetición producen el modo correcto.
- Todos los resultados válidos dentro de los límites son enteros exactos.
- La explicación indica por qué se utilizó esa fórmula.
- La interfaz es utilizable a `320px` de ancho sin scroll horizontal global.
- Todos los controles interactivos son accesibles con teclado y tienen foco
  visible.
- Los errores son específicos, están asociados al campo y no borran datos.
- Los resultados largos pueden consultarse y copiarse completos.
- Existe la categoría canónica `/probabilidad-estadistica` con la etiqueta
  `Probabilidad y estadística`.
- La calculadora aparece en esa categoría y en el directorio general.
- Canonical, breadcrumb, registro del directorio y ubicación física usan
  `probabilidad-estadistica`.
- No existe una página duplicada bajo `/matematicas`.
- La página usa una única URL canónica y no crea rutas duplicadas por categoría.
