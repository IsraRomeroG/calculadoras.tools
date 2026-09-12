# 01 - Diagnóstico, intención y objetivos

## Página objetivo

- Ruta: `/fecha-tiempo/diferencia-entre-fechas`.
- Archivo: `src/pages/fecha-tiempo/diferencia-entre-fechas.astro`.
- Fuente de consultas: `docs/diferencia-entre-fechas/Consultas.csv`.
- Fecha del análisis local: 2026-09-11.

El CSV no incluye rango de fechas, país, dispositivo, tipo de búsqueda ni
segmentación por apariencia en Search. Antes de comparar resultados después
del despliegue debe registrarse ese contexto en Search Console.

## Baseline del CSV

Valores calculados sobre las consultas entregadas:

- 10.150 impresiones.
- 56 clics.
- CTR global aproximado: 0,55%.
- Posición media ponderada aproximada: 8,28.
- Aproximadamente 9.501 impresiones provienen de consultas con posición
  `>= 4` y `< 10` en el cálculo del baseline.

Clusters de intención. Los clusters se solapan y no deben sumarse:

| Cluster | Impresiones | Clics | CTR | Posición ponderada |
| --- | ---: | ---: | ---: | ---: |
| Diferencia | 3.260 | 44 | 1,35% | 6,55 |
| Días | 2.901 | 7 | 0,24% | 8,37 |
| Meses | 1.738 | 6 | 0,35% | 8,93 |
| Semanas | 1.193 | 1 | 0,08% | 8,77 |
| Familia calcul-/intención de cálculo | 3.328 | 13 | 0,39% | 8,60 |

La última fila agrupa consultas que contienen la familia `calcul` —por
ejemplo, “calcular”, “cálculo”, “calculador” y “calculadora”—. No debe
interpretarse como un cluster exclusivo de consultas que contienen
“calculadora”.

### Reglas reproducibles del baseline

- Leer las 594 filas del CSV, con coma como delimitador y punto decimal en
  `Posición`. No promediar los CTR de las filas.
- Normalizar cada consulta a minúsculas, aplicar Unicode NFD y eliminar las
  marcas diacríticas. Conservar la consulta original para los informes.
- Seleccionar por subcadena: `diferencia`, `dias`, `mes`, `semana` y `calcul`,
  respectivamente. Son agrupaciones léxicas orientativas, no una clasificación
  exhaustiva de intenciones. Una fila puede pertenecer a varias agrupaciones.
- Sumar clics e impresiones de las filas seleccionadas. Calcular
  `CTR = 100 × suma(clics) / suma(impresiones)` y
  `posición ponderada = suma(posición × impresiones) / suma(impresiones)`.
- Redondear solo el resultado final a dos decimales. La posición es una
  aproximación porque el CSV ya contiene posiciones redondeadas.
- Estos totales describen las consultas exportadas, no necesariamente el total
  de la página en Search Console. Guardar por separado ese total al exportar.
- Conservar estas reglas y la lista inicial de consultas para las comparaciones;
  informar las consultas nuevas por separado.

## Lectura del diagnóstico

1. La página ya tiene relevancia para el núcleo “diferencia entre fechas”. No
   tratar la indexación como el problema principal.
2. La oportunidad mayor está en consultas de días, meses y semanas que suelen
   aparecer en primera página, pero reciben pocos clics.
3. El título actual menciona días, semanas y meses, mientras que el contenido
   visible explica principalmente conteo estándar, inclusivo y hábiles.
4. La página no expone de forma estática una fórmula, un resultado de ejemplo
   ni una explicación suficiente del desglose en meses y semanas.
5. La página no tiene una sección contextual propia de calculadoras
   relacionadas, aunque un plan anterior la recomendaba.
6. El CSV no muestra un cluster significativo de consultas explícitas sobre
   “días hábiles” o festivos para esta página. No priorizar ahora un dataset de
   festivos por país basándose en este archivo; dejarlo como expansión
   posterior si una exportación segmentada demuestra demanda.

## Objetivos de negocio y SEO

### Hipótesis y medición prioritaria

La hipótesis principal es que una promesa más específica y contenido estático
que responda a cada variante visible mejorará la relevancia y el CTR de la
misma URL, sin dividir señales entre páginas duplicadas. La evaluación debe
mantener una lista fija de consultas y separar las consultas nuevas.

| Intención prioritaria | Cobertura visible esperada | Métrica principal |
| --- | --- | --- |
| diferencia entre fechas | H1, title, introducción y resultado principal | posición e impresiones |
| días entre fechas | explicación, fórmula y ejemplo | posición, impresiones y CTR |
| semanas entre fechas | desglose de semanas y días naturales | posición e impresiones |
| meses entre fechas / meses y días | desglose de calendario explicado | posición e impresiones |

La posición y las impresiones evalúan visibilidad; el CTR evalúa el snippet y
la promesa; la sesión con cálculo válido evalúa utilidad. No usar una de estas
métricas como sustituta de las otras. Debido al bajo volumen histórico, una
caída o mejora pequeña debe marcarse como inconclusa hasta contar con ventanas
comparables y suficiente volumen.

### Objetivos primarios

- Aumentar clics sin perder las posiciones actuales para “diferencia de
  fechas” y “diferencia entre fechas”.
- Mejorar la posición y las impresiones de la lista fija de consultas
  prioritarias, sin deterioro sostenido del núcleo principal.
- Mejorar la cobertura semántica de “días entre fechas”, “semanas entre
  fechas” y “meses entre fechas”.
- Aumentar el porcentaje de usuarios que completa al menos un cálculo.

### Objetivos de seguimiento

Después de que Google vuelva a rastrear la página, usar como señales:

- CTR por consulta, no solo CTR global.
- Posición por cada cluster.
- Clics e impresiones por dispositivo y país.
- Eventos de cálculo completado y modo utilizado.
- Errores de validación y abandono del formulario.

Un CTR global de 1% equivaldría aproximadamente a 102 clics con las mismas
10.150 impresiones. Es una referencia de oportunidad, no una garantía ni un
objetivo aislado de ranking.

## Criterio de no canibalización

La página principal debe consolidar las variantes de diferencia, días,
semanas, meses y años. No crear páginas separadas solo porque una consulta
omita o agregue “calculadora”, “contador”, “cálculo” o “entre dos fechas”.

Solo evaluar una URL independiente si existe una intención y producto
distintos, por ejemplo días hábiles con festivos oficiales por país o una
cuenta regresiva con hora exacta.
