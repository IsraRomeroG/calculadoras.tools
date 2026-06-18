# Especificación v2 - Calculadora de distribución normal y Z-score

## Descripción general

Herramienta para calcular Z-scores, probabilidades, percentiles y valores críticos
de una distribución normal. Debe servir para estadística básica, ejercicios,
control de calidad y comparación de observaciones con una media y desviación
estándar conocidas.

La experiencia debe organizarse según la pregunta que quiere responder el
usuario, no según la fórmula matemática utilizada.

**Arquitectura:** todo el cálculo ocurre en el cliente. No requiere backend,
base de datos ni llamadas a APIs externas.

---

## Objetivos de producto

- Ubicar un valor dentro de una distribución mediante su Z-score y percentil.
- Calcular probabilidades a la izquierda, derecha, entre dos valores o fuera de
  un intervalo.
- Encontrar el valor o Z-score correspondiente a un percentil.
- Explicar cada resultado con lenguaje natural, fórmula sustituida y una gráfica
  de la región calculada.
- Ofrecer resultados reproducibles, copiables y compartibles mediante URL.
- Generar una página estática optimizada para SEO en Astro.

---

## Alcance recomendado

### MVP

- Flujo `Ubicar un valor`.
- Flujo `Calcular probabilidad`.
- Flujo `Encontrar un valor`.
- Probabilidad menor que, mayor que, entre dos valores y fuera de un intervalo.
- Cálculo con valores originales `X` y con valores estandarizados `Z`.
- CDF normal estándar implementada localmente.
- Función inversa de la normal estándar por percentil.
- Gráfica SVG responsive de la campana normal con región sombreada.
- Resultado en decimal, porcentaje y lenguaje natural.
- Explicación del procedimiento y sustitución de valores.
- Selector de precisión visual entre 2 y 6 decimales.
- Ejemplos rápidos.
- Copiar resultado, copiar enlace y limpiar formulario.
- Estado compartible mediante parámetros de URL.

### Fase 2

- Tabla Z interactiva.
- Historial opcional en `sessionStorage`.
- Comparación de varios valores sobre la misma distribución.
- Exportación de resultados como imagen o CSV cuando aporte valor.

---

## Categoría, ruta y archivos

| Elemento | Valor |
|----------|-------|
| Categoría canónica | `Probabilidad y estadística` |
| Slug de categoría | `probabilidad-estadistica` |
| URL canónica | `/probabilidad-estadistica/calculadora-distribucion-normal-z-score` |
| Archivo Astro | `src/pages/probabilidad-estadistica/calculadora-distribucion-normal-z-score.astro` |
| Lógica de cálculo | `src/lib/calculators/probabilidad-estadistica/calculadora-distribucion-normal-z-score/normalDistribution.ts` |
| Pruebas unitarias | `src/lib/calculators/probabilidad-estadistica/calculadora-distribucion-normal-z-score/normalDistribution.test.ts` |
| Locale base | `es-MX` |

La categoría `probabilidad-estadistica` debe registrarse en el directorio y en
los metadatos de categorías del proyecto. Esta ruta es definitiva: no deben
crearse páginas duplicadas bajo `/matematicas` ni rutas alternativas con otra
URL canónica.

Si una versión anterior llegara a publicarse bajo otra ruta antes de implementar
esta especificación, deberá eliminarse la página fuente antigua y añadirse un
redirect 301 en `.htaccess` hacia la URL canónica.

---

## Arquitectura de la experiencia

### Nivel 1: pregunta principal

Usar un control segmentado con tres opciones:

1. `Ubicar un valor`
2. `Calcular probabilidad`
3. `Encontrar un valor`

Las etiquetas visibles pueden abreviarse en móvil como `Valor`, `Probabilidad`
y `Percentil`, manteniendo nombres accesibles completos.

### Nivel 2: tipo de entrada

En los flujos que lo necesiten, permitir elegir:

- `Valores X`: usa media y desviación estándar.
- `Valores Z`: usa directamente la distribución normal estándar, con media `0`
  y desviación estándar `1`.

No solicitar media y desviación estándar cuando el usuario trabaja directamente
con Z.

### Nivel 3: tipo de probabilidad

Dentro de `Calcular probabilidad`, permitir:

- `Menor que`: `P(X <= a)` o `P(Z <= z)`.
- `Mayor que`: `P(X >= a)` o `P(Z >= z)`.
- `Entre`: `P(a <= X <= b)`.
- `Fuera`: `P(X <= a o X >= b)`.

En móvil debe mostrarse como un `<select>` o una cuadrícula 2 × 2 de botones.
No añadir una segunda fila horizontal de pestañas pequeñas.

---

## Flujos e inputs

### 1. Ubicar un valor

Pregunta ejemplo:

> Un valor de 85 pertenece a una distribución con media 70 y desviación
> estándar 10. ¿Cuál es su Z-score y percentil?

#### Valores X

- Valor `x`.
- Media `mu`.
- Desviación estándar `sigma`.

#### Valor Z

- Z-score `z`.

#### Outputs

- Z-score.
- Percentil aproximado.
- Probabilidad acumulada izquierda.
- Probabilidad de cola derecha.
- Distancia respecto a la media expresada en desviaciones estándar.
- Interpretación en lenguaje natural.

### 2. Calcular probabilidad

#### Valores X

- Media `mu`.
- Desviación estándar `sigma`.
- Un límite para `Menor que` o `Mayor que`.
- Límite inferior y superior para `Entre` o `Fuera`.

#### Valores Z

- Un Z-score para `Menor que` o `Mayor que`.
- Z inferior y Z superior para `Entre` o `Fuera`.

#### Outputs

- Probabilidad principal en porcentaje.
- Probabilidad en decimal.
- Notación simbólica de la consulta.
- Z-score de cada límite cuando la entrada usa valores X.
- Percentil de cada límite.
- Complemento de la probabilidad cuando ayude a interpretar el resultado.
- Explicación en lenguaje natural.

Para intervalos no debe mostrarse un único percentil. Deben mostrarse los
percentiles de los límites inferior y superior.

### 3. Encontrar un valor

Pregunta ejemplo:

> ¿Qué puntuación corresponde al percentil 90 en una distribución con media 70
> y desviación estándar 10?

#### Valores X

- Percentil o probabilidad acumulada entre `0%` y `100%`, sin incluir extremos.
- Media `mu`.
- Desviación estándar `sigma`.

#### Valor Z

- Percentil o probabilidad acumulada entre `0%` y `100%`, sin incluir extremos.

#### Presets sugeridos

- 80%
- 90%
- 95%
- 97.5%
- 99%

#### Outputs

- Valor `x` correspondiente al percentil, cuando se usa una distribución X.
- Z-score crítico.
- Percentil confirmado.
- Probabilidad de cola derecha.
- Sustitución de la fórmula inversa.
- Interpretación en lenguaje natural.

---

## Diseño mobile-first

### Estructura

- Una sola columna desde 320 px hasta el breakpoint `lg`.
- En escritorio, formulario a la izquierda y resultado a la derecha.
- En móvil, el resultado debe aparecer inmediatamente después del formulario y
  antes del contenido educativo.
- Usar espaciado compacto de `p-4` en móvil y `p-6` desde `sm`.
- Evitar tablas y controles que provoquen desplazamiento horizontal.

### Controles

- Campos y botones con altura mínima de 44 px; preferentemente 48 px.
- Usar `type="text"` e `inputmode="decimal"` para aceptar números negativos,
  coma decimal y punto decimal.
- Botón principal `Calcular` a ancho completo en móvil.
- Acciones secundarias: `Usar ejemplo`, `Copiar resultado`, `Copiar enlace` y
  `Limpiar`.
- Los presets deben poder desplazarse horizontalmente solo si no caben, con
  botones completos y legibles.
- No depender únicamente del placeholder: todos los campos requieren `<label>`.

### Resultado

El resultado debe priorizar una respuesta comprensible:

> El 93.32% de los valores está por debajo de 85.

Debajo debe mostrarse:

- Valor principal grande.
- Notación de la probabilidad.
- Z-score y percentil.
- Interpretación breve.
- Gráfica de la región.
- Sección desplegable `Cómo se calculó`.

### Gráfica SVG

- Debe ser responsive y ocupar el ancho disponible sin scroll horizontal.
- Mostrar la curva normal, la media y los límites relevantes.
- Sombrear izquierda, derecha, centro o extremos según la consulta.
- No depender únicamente del color: usar líneas, etiquetas y descripción.
- Incluir texto accesible que describa la región y la probabilidad.
- Para entradas X, etiquetar el eje con valores X; para entradas Z, usar Z.
- Limitar el dominio visual normalmente a `-4 <= z <= 4`, ajustando etiquetas
  para valores extremos sin deformar la curva.

---

## Fórmulas y precisión numérica

### Estandarización

```text
z = (x - mu) / sigma
```

### Conversión de Z a X

```text
x = mu + z * sigma
```

### CDF normal estándar

```text
Phi(z) = 0.5 * (1 + erf(z / sqrt(2)))
```

No depender de `Math.erf`, ya que no está disponible de forma uniforme. La
lógica debe incluir una aproximación numérica local, determinista y probada.

### Probabilidades

```text
P(Z <= z) = Phi(z)
P(Z >= z) = 1 - Phi(z)
P(a <= Z <= b) = Phi(b) - Phi(a)
P(Z <= a o Z >= b) = Phi(a) + (1 - Phi(b))
```

Para colas extremas, evitar cuando sea posible calcular la cola derecha mediante
una resta ingenua `1 - Phi(z)`. Usar simetría o una función de supervivencia
equivalente para reducir pérdida de precisión:

```text
P(Z >= z) = Phi(-z)
```

### Normal inversa

Implementar una aproximación local de:

```text
z = Phi_inverse(p)
```

La función debe aceptar únicamente `0 < p < 1`. Después:

```text
x = mu + Phi_inverse(p) * sigma
```

### Tolerancias

- Error absoluto objetivo de la CDF: `<= 1e-7` en el rango `-8 <= z <= 8`.
- Error absoluto objetivo de la inversa: `<= 1e-6` para probabilidades entre
  `1e-10` y `1 - 1e-10`.
- Mantener precisión completa durante el cálculo.
- El selector de decimales solo afecta la presentación.
- Z-score predeterminado: 4 decimales.
- Probabilidades predeterminadas: 6 decimales en formato decimal y 2 decimales
  en porcentaje.

---

## Formato e interpretación

- Mostrar decimal y porcentaje sin obligar al usuario a convertirlos.
- No mostrar probabilidades extremas como exactamente `0` o `1` si el valor real
  no es exacto.
- Usar textos como `< 0.000001%` o `> 99.999999%` cuando el redondeo visual
  ocultaría una cola no nula.
- Aclarar que, para una distribución continua, `<` y `<=` tienen la misma
  probabilidad; lo mismo aplica a `>` y `>=`.
- Interpretar el signo de Z:
  - Z positivo: por encima de la media.
  - Z negativo: por debajo de la media.
  - Z cercano a cero: cerca de la media.
- Evitar calificar automáticamente un valor como “bueno”, “malo”, “normal” o
  “anormal”.
- No presentar los resultados como diagnóstico, prueba de normalidad ni análisis
  estadístico avanzado.

---

## Validaciones y estados

### Reglas

- Todos los valores deben ser números finitos.
- La desviación estándar debe ser mayor que cero.
- El límite inferior debe ser menor que el límite superior.
- El percentil debe cumplir `0 < p < 100`.
- Aceptar coma o punto decimal, pero rechazar separadores de miles ambiguos.
- Permitir valores, medias y Z-scores negativos.
- Establecer límites razonables de longitud y magnitud para evitar entradas que
  produzcan `Infinity` o bloqueen la interfaz.

### Mensajes sugeridos

- `Ingresa un número válido.`
- `La desviación estándar debe ser mayor que cero.`
- `El límite inferior debe ser menor que el límite superior.`
- `El percentil debe ser mayor que 0% y menor que 100%.`
- `El valor es demasiado grande para calcularlo con precisión.`

### Estados de interfaz

- Estado inicial con ejemplo breve y sin errores.
- Validación por campo después de interacción o al intentar calcular.
- Resultado anterior no debe permanecer visible como si fuera válido después de
  introducir un error.
- Usar `aria-live="polite"` para anunciar resultados y mensajes generales.
- Asociar errores con sus campos mediante `aria-describedby` y `aria-invalid`.
- Conservar el foco de teclado de forma predecible al cambiar de modo.

---

## Explicación del procedimiento

La sección `Cómo se calculó` debe adaptarse al flujo.

### Ejemplo para ubicar un valor

```text
z = (x - mu) / sigma
z = (85 - 70) / 10
z = 1.5
Phi(1.5) = 0.933193
```

Interpretación:

> El valor 85 está 1.5 desviaciones estándar por encima de la media y se
> encuentra aproximadamente en el percentil 93.32.

### Ejemplo para un intervalo

```text
z_a = (a - mu) / sigma
z_b = (b - mu) / sigma
P(a <= X <= b) = Phi(z_b) - Phi(z_a)
```

### Ejemplo inverso

```text
z = Phi_inverse(0.90)
x = mu + z * sigma
```

---

## Ejemplos rápidos

Incluir ejemplos que enseñen usos distintos:

1. `x=85`, `mu=70`, `sigma=10`: Z-score y percentil.
2. `z=1.96`: probabilidad acumulada y cola derecha.
3. `a=-1`, `b=1`: probabilidad central estándar.
4. `a=-1.96`, `b=1.96`: probabilidad fuera del intervalo.
5. Percentil `90`, `mu=70`, `sigma=10`: valor crítico.

Cada ejemplo debe poder cargar sus datos en la calculadora sin recargar la
página.

---

## URL compartible

El estado válido puede serializarse en parámetros legibles, por ejemplo:

```text
?modo=probabilidad&tipo=entre&entrada=x&media=70&desviacion=10&inferior=60&superior=80
```

Requisitos:

- Mantener siempre la URL canónica como ruta base.
- Restaurar modo, campos y resultado al abrir el enlace.
- No incluir datos incompletos o inválidos.
- Usar `history.replaceState` para evitar llenar el historial al escribir.
- El contenido principal y las etiquetas SEO no deben depender de los parámetros.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de distribución normal y Z-score` |
| Meta description | `Calcula Z-score, percentiles, probabilidades y valores críticos de una distribución normal con media y desviación estándar.` |
| H1 | `Calculadora de distribución normal y Z-score` |
| Keyword principal | `calculadora z score` |
| Keywords secundarias | `calculadora distribución normal`, `percentil z`, `probabilidad normal`, `tabla z`, `valor z`, `z score inverso` |
| Kicker y breadcrumb | `Probabilidad y estadística` |

### Contenido educativo recomendado

- Qué es una distribución normal.
- Qué significa un Z-score.
- Cómo interpretar un percentil.
- Diferencia entre cola izquierda, derecha y dos colas.
- Cuándo no conviene asumir una distribución normal.
- Relación entre Z-score, media y desviación estándar.

### FAQs sugeridas

- ¿Qué es un Z-score?
- ¿Cómo se interpreta un Z-score positivo o negativo?
- ¿Qué significa el percentil?
- ¿Cómo calculo una probabilidad menor o mayor que un valor?
- ¿Cómo calculo la probabilidad entre dos valores?
- ¿Cómo encuentro un valor a partir de un percentil?
- ¿Qué diferencia hay entre `<` y `<=` en una distribución continua?
- ¿La calculadora comprueba que mis datos siguen una distribución normal?
- ¿Qué es la desviación estándar?

Añadir JSON-LD de FAQ mediante los helpers SEO existentes del proyecto.

---

## Integración con el proyecto

- Registrar la categoría `probabilidad-estadistica` con etiqueta
  `Probabilidad y estadística` y una descripción propia.
- Añadir la calculadora al directorio global con su URL canónica.
- Usar `BaseLayout`, `PageShell`, `PageHero`, `Container`, `SectionIntro`,
  `FaqSection` y `AdSlot` según los patrones actuales.
- Añadir breadcrumbs:
  - Inicio
  - Probabilidad y estadística
  - Distribución normal y Z-score
- Mantener cálculo, parsing, formato e interpretación en el módulo TypeScript,
  dejando el script de la página principalmente para estado y renderizado.
- No crear una ruta duplicada en otra categoría.

---

## Pruebas unitarias mínimas

### Z-score y conversiones

- `x=85`, `mu=70`, `sigma=10` produce `z=1.5`.
- `x=70`, `mu=70`, `sigma=10` produce `z=0`.
- `z=1.5`, `mu=70`, `sigma=10` produce `x=85`.

### CDF y colas

- `Phi(0)` produce `0.5`.
- `Phi(1.96)` produce aproximadamente `0.9750021049`.
- `Phi(-1.96)` produce aproximadamente `0.0249978951`.
- La cola derecha de `1.96` produce aproximadamente `0.0249978951`.
- Probabilidad entre `-1` y `1` produce aproximadamente `0.6826894921`.
- Probabilidad fuera de `-1.96` y `1.96` produce aproximadamente `0.0499957903`.
- La simetría cumple aproximadamente `Phi(-z) = 1 - Phi(z)`.

### Normal inversa

- `Phi_inverse(0.5)` produce `0`.
- `Phi_inverse(0.975)` produce aproximadamente `1.959964`.
- `Phi(Phi_inverse(p))` recupera `p` dentro de la tolerancia definida.
- Percentil `90`, `mu=70`, `sigma=10` produce aproximadamente `x=82.815516`.

### Validación

- Desviación estándar `0` muestra error.
- Desviación estándar negativa muestra error.
- Límite inferior igual o mayor al superior muestra error.
- Percentiles `0`, `100`, negativos o mayores que `100` muestran error.
- Se aceptan números negativos y decimales con coma o punto.
- Se rechazan `NaN`, `Infinity` y entradas ambiguas.

### Formato y estados

- Las probabilidades extremas no se presentan falsamente como exactamente `0%`
  o `100%`.
- Cambiar decimales no modifica el valor interno.
- Los parámetros URL válidos restauran el cálculo.
- Los parámetros URL inválidos se ignoran de forma segura.

---

## Criterios de aceptación

- Los tres flujos funcionan completamente con teclado y en una pantalla de
  320 px sin scroll horizontal.
- La pregunta principal puede resolverse sin conocer la notación de la CDF.
- Cada resultado incluye valor principal, notación, interpretación y
  procedimiento.
- La gráfica representa correctamente las cuatro regiones de probabilidad.
- Los resultados cumplen las tolerancias numéricas especificadas.
- La ruta y canonical son
  `/probabilidad-estadistica/calculadora-distribucion-normal-z-score`.
- No existe una página duplicada bajo `/matematicas`.
- La página incluye metadatos SEO, breadcrumbs y FAQ JSON-LD.
