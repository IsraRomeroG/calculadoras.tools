# Roadmap de clusters de contenido

## Objetivo

Desarrollar una arquitectura editorial alrededor de las calculadoras publicadas
que responda a intenciones de búsqueda reales, ayude al usuario a completar una
tarea y refuerce la autoridad temática del sitio.

El objetivo no es publicar el mayor número posible de artículos. Cada pieza
debe resolver una necesidad distinta y conducir de forma natural hacia una
calculadora, otra explicación útil o el siguiente paso de la decisión.

## Alcance analizado

Fuente de verdad del inventario:
`src/lib/constants/calculators.ts`.

Estado observado al preparar este roadmap:

- 65 calculadoras publicadas en 14 categorías.
- 117 artículos publicados en solo 5 categorías.
- 54 calculadoras no reciben enlaces desde ningún artículo publicado.
- Los artículos actuales se concentran en IMC, hipoteca, préstamo, porcentajes,
  interés compuesto e IVA.
- El cluster TDEE ya tiene 10 specs en `specs/content/tdee`, pero todavía debe
  ejecutarse.

La oportunidad principal no es abrir más categorías. Es llevar cobertura
editorial útil a calculadoras que ya existen, empezando por grupos que comparten
una misma necesidad del usuario.

## Decisiones de arquitectura

### URL editorial correcta

La ruta pública actual del blog es:

```txt
/blog/{categorySlug}/{slug}
```

Por ejemplo:

```txt
/blog/salud/que-es-tdee-calorias-diarias
```

Las specs de TDEE todavía muestran URLs del tipo `/blog/{slug}`. Las nuevas
specs deben usar la ruta real con categoría y, antes de ejecutar TDEE, conviene
corregir esa discrepancia en sus documentos.

### Qué se considera un cluster

Un cluster debe contener:

1. Una o varias calculadoras que resuelven la tarea.
2. Un artículo base que define el tema.
3. Artículos prácticos que explican cómo usar el resultado.
4. Artículos de comparación o errores comunes.
5. Enlaces internos que permitan avanzar sin volver a buscar en Google.

No todas las calculadoras necesitan un cluster independiente. Las herramientas
con intención estrecha deben formar un microcluster o integrarse en un cluster
existente.

### Principios editoriales

- Responder la pregunta principal en el primer bloque del artículo.
- Incluir fórmulas, ejemplos y supuestos visibles cuando exista un cálculo.
- Explicar qué significa el resultado y qué no permite concluir.
- Usar la calculadora como parte de la respuesta, no como un CTA decorativo.
- No crear artículos que solo cambien una cifra, unidad o palabra clave.
- No separar sin necesidad sinónimos como `ritmo` y `pace`, `nota` y
  `calificación`, o `gasolina` y `combustible`.
- Crear contenido por país solo cuando cambien reglas, impuestos, escalas o
  fuentes oficiales.
- Mantener español claro para audiencia internacional, con `es-MX` como
  referencia de formato y localización actual del proyecto.
- Evitar páginas programáticas de equivalencias si no aportan contexto,
  fórmula, tabla útil y ejemplos propios.
- En salud y finanzas, aumentar el nivel de fuentes, revisión y advertencias.

Google recomienda contenido pensado primero para personas, con valor original,
completo, fiable y capaz de dejar al lector con una respuesta satisfactoria.
También concede más importancia a la confianza en temas de salud y estabilidad
financiera:

- `https://developers.google.com/search/docs/fundamentals/creating-helpful-content`
- `https://developers.google.com/search/docs/fundamentals/seo-starter-guide`

## Priorización

La prioridad es una hipótesis basada en:

- Cercanía entre la consulta y el uso de una calculadora.
- Número de calculadoras que el cluster puede reforzar.
- Capacidad de resolver una tarea completa.
- Cobertura editorial actual.
- Potencial de enlaces internos con clusters ya publicados.
- Riesgo de canibalización.
- Esfuerzo de revisión YMYL en salud y finanzas.

No se usan estimaciones ficticias de volumen. Antes de ampliar un cluster más
allá de su núcleo se deben revisar Search Console, tendencias de consultas y
rendimiento de la calculadora.

| Nivel | Uso |
| --- | --- |
| P0 | Construir primero; intención clara y conexión fuerte con herramientas |
| P1 | Construir después del primer lote o en paralelo si hay capacidad |
| P2 | Microclusters y long-tail; expandir según datos reales |
| Mantener | Cluster ya publicado; mejorar enlaces, frescura y cobertura |

## Resumen ejecutivo

| Prioridad | Cluster | Calculadoras principales | Tipo |
| --- | --- | --- | --- |
| P0 | Déficit calórico y cambio de peso | Déficit, TDEE | Nuevo con puentes |
| P0 | Macros y proteína diaria | Macros, proteína | Nuevo |
| P0 | Rendimiento de carrera | Pace, predicción, VO2 máx | Nuevo |
| P0 | Frecuencia cardíaca de entrenamiento | FCM, zonas | Nuevo |
| P0 | Calificaciones y planificación académica | Promedio, nota mínima, ponderada, asistencia, estudio | Nuevo |
| P0 | Rentabilidad, margen y punto de equilibrio | ROI, margen/markup, punto de equilibrio | Nuevo |
| P0 | Fechas, edad y plazos | Edad, diferencia de fechas, fecha límite | Nuevo |
| P0 | Consumo de combustible y costo de viaje | Consumo, costo por km | Nuevo |
| P0 | Fecha probable de parto y edad gestacional | FPP | Nuevo YMYL |
| P0 | Ovulación, ciclo y ventana fértil | Ovulación | Nuevo YMYL |
| P1 | Composición corporal | Grasa corporal, IMC | Expansión de IMC |
| P1 | Calorías quemadas por ejercicio | Calorías por ejercicio, TDEE | Nuevo con puentes |
| P1 | Hidratación diaria | Agua diaria | Nuevo YMYL |
| P1 | Fuerza y repetición máxima | 1RM | Nuevo |
| P1 | Pago de deudas | Plan de deudas, préstamo | Expansión de préstamo |
| P1 | Tarifas y proyectos freelance | Tarifa por hora, precio de proyecto | Nuevo |
| P1 | Ahorro, interés e inflación | Ahorro, interés simple, inflación, interés compuesto | Expansión |
| P1 | Precio promedio de inversión | DCA, ROI | Nuevo |
| P1 | Trabajo y productividad | Horas trabajadas, costo de reunión, Pomodoro, lectura | Nuevo |
| P1 | Álgebra y aritmética paso a paso | Regla de tres, MCD/MCM, cuadráticas, sistemas | Nuevo |
| P1 | Probabilidad y estadística | Estadística, probabilidad, combinatoria, normal | Nuevo |
| P2 | Geometría, superficies y pintura | Área, Pitágoras, pintura | Microcluster |
| P2 | Conversión de unidades | Temperatura, peso, km/millas | Microcluster |
| P2 | Medidas y escalado de recetas | Medidas culinarias, porciones | Microcluster |
| P2 | Edad y alimentación de mascotas | Edad, calorías de mascotas | Dos subclusters |
| P2 | Propina y división de cuentas | Propina, dividir cuenta | Microcluster |

## Clusters existentes que no se deben duplicar

### IMC

Estado: publicado, 34 artículos.

Calculadora pilar:
`/salud/calculadora-de-imc`.

Acciones:

- Mantenerlo como autoridad principal para interpretación de IMC.
- No crear otra guía general de peso saludable dentro de TDEE, grasa corporal o
  déficit.
- Añadir puentes hacia TDEE, déficit, proteína y grasa corporal cuando sean
  relevantes.
- Revisar páginas por estatura con Search Console antes de crear más variantes.

### Hipoteca

Estado: publicado, 25 artículos.

Calculadora pilar:
`/inmuebles/calculadora-de-hipoteca`.

Acciones:

- Mantener y actualizar piezas sensibles a reglas o productos financieros.
- No crear artículos equivalentes desde préstamo.
- Usar enlaces de comparación solo cuando la intención sea realmente
  hipotecaria.

### Préstamos

Estado: publicado, 20 artículos.

Calculadora pilar:
`/finanzas/calculadora-de-prestamo`.

Acciones:

- Convertirlo en entrada al nuevo subcluster de pago de deudas.
- Evitar repetir artículos de mensualidad, intereses y amortización.
- Enlazar hacia el plan de pago cuando el usuario ya tiene varias deudas.

### Porcentajes

Estado: publicado, 13 artículos.

Calculadora pilar:
`/matematicas/calculadora-de-porcentajes`.

Acciones:

- Usarlo como soporte matemático para margen, markup, calificaciones, IVA y
  variación.
- No crear nuevas guías genéricas de porcentaje dentro de cada cluster.

### Interés compuesto

Estado: publicado, 12 artículos.

Calculadora pilar:
`/finanzas/calculadora-de-interes-compuesto`.

Acciones:

- Ampliar sus enlaces hacia ahorro, inflación, interés simple y DCA.
- No repetir regla del 72, tasa nominal/efectiva, aportaciones o valor real.

### IVA

Estado: publicado, 10 artículos.

Calculadora pilar:
`/legal-impuestos/calculadora-de-iva`.

Acciones:

- Mantener las tasas por país con fecha de revisión y fuente oficial.
- No mezclar el cluster con ISR, salario neto o impuestos todavía no
  implementados.

### TDEE

Estado: 10 specs preparadas, todavía no publicadas.

Acciones:

- Ejecutar antes o junto con déficit y macros.
- Corregir las URLs de specs al formato `/blog/salud/{slug}`.
- Tratar TDEE como estimación y no como prescripción.

# Detalle de clusters nuevos y expansiones

## 1. Déficit calórico y cambio de peso

**Prioridad:** P0  
**Tipo:** nuevo con puentes hacia TDEE e IMC  
**Calculadoras:**

- `/salud/calculadora-deficit-calorico`
- `/salud/calculadora-de-calorias-diarias-tdee`

### Intención y valor

El usuario quiere saber cuántas calorías consumir, qué déficit aplicar, cuánto
tiempo podría tardar y por qué el resultado real no coincide siempre con la
estimación. El contenido debe dar un método prudente, no una promesa.

### Núcleo recomendado

| Artículo | Intención principal |
| --- | --- |
| `que-es-deficit-calorico-como-calcularlo` | Entender el concepto y la fórmula |
| `como-calcular-deficit-calorico` | Obtener un resultado paso a paso |
| `deficit-de-300-o-500-calorias` | Comparar tamaños de déficit |
| `cuanto-peso-se-puede-bajar-con-deficit-calorico` | Entender ritmo y variabilidad |
| `por-que-no-bajo-de-peso-en-deficit-calorico` | Resolver estancamientos sin conclusiones médicas |
| `tdee-vs-deficit-calorico` | Diferenciar mantenimiento y objetivo |
| `como-ajustar-calorias-despues-de-varias-semanas` | Usar datos reales para ajustar |

### Enlaces internos

- TDEE debe ser el punto de partida.
- IMC puede aportar contexto, pero no debe definir por sí solo el objetivo.
- Macros y proteína deben aparecer como pasos posteriores, no como requisito
  para entender el déficit.

### Reglas

- Advertir sobre menores de edad, embarazo, lactancia, enfermedad, medicación o
  antecedentes de trastornos alimentarios.
- No prometer kilos exactos por semana.
- No presentar déficits agresivos como opción normal.

## 2. Macros y proteína diaria

**Prioridad:** P0  
**Calculadoras:**

- `/salud/calculadora-de-macros`
- `/salud/calculadora-de-proteina-diaria`

### Intención y valor

El usuario quiere convertir calorías en gramos de proteína, grasa y
carbohidratos, o saber cuánta proteína necesita según peso y actividad. El
cluster debe explicar el proceso, los rangos y la diferencia entre una
estimación general y una indicación clínica.

### Núcleo recomendado

| Artículo | Intención principal |
| --- | --- |
| `que-son-los-macros-y-como-se-calculan` | Introducción completa |
| `como-calcular-macros-en-gramos` | Fórmula y ejemplo |
| `cuanta-proteina-necesito-al-dia` | Resolver la pregunta principal |
| `proteina-por-kilo-de-peso` | Interpretar rangos por kg |
| `calorias-por-gramo-proteina-carbohidratos-grasa` | Conversión energética |
| `macros-para-mantenimiento-deficit-o-superavit` | Adaptar al objetivo |
| `como-repartir-macros-sin-usar-porcentajes-fijos` | Evitar reglas rígidas |
| `errores-al-calcular-macros` | Duplicar actividad, redondeos y objetivos incompatibles |

### Enlaces internos

- TDEE aporta calorías de referencia.
- Déficit aporta el objetivo calórico cuando se busca perder peso.
- El artículo de proteína debe priorizar la calculadora de proteína; el de
  reparto completo debe priorizar macros.

### Fuentes base

- National Academies.
- USDA FoodData Central.
- Revisiones científicas de proteína y ejercicio.
- Guías clínicas específicas cuando se mencionen enfermedad renal u otras
  condiciones.

## 3. Rendimiento de carrera

**Prioridad:** P0  
**Calculadoras:**

- `/salud/calculadora-de-pace-ritmo-de-carrera`
- `/salud/calculadora-prediccion-tiempo-carrera`
- `/salud/calculadora-vo2-max`

### Intención y valor

El usuario quiere convertir tiempo, distancia y ritmo; estimar una marca en
otra distancia; o entender una prueba de VO2 máx. La experiencia debe resolver
la tarea para 5K, 10K, medio maratón y maratón sin prometer rendimiento.

### Núcleo recomendado

| Artículo | Intención principal |
| --- | --- |
| `como-calcular-ritmo-de-carrera` | Fórmula de pace, tiempo y distancia |
| `tabla-de-ritmos-por-kilometro-5k-10k-media-maraton-maraton` | Consulta práctica |
| `ritmo-por-kilometro-vs-ritmo-por-milla` | Conversión y uso internacional |
| `como-calcular-splits-de-carrera` | Planear parciales |
| `como-predecir-tiempo-5k-10k-media-maraton-maraton` | Usar una marca reciente |
| `por-que-la-prediccion-de-carrera-puede-fallar` | Explicar límites del modelo |
| `que-es-vo2-max-y-como-se-estima` | Interpretar el indicador |
| `test-de-cooper-vs-rockport` | Elegir método sin mezclarlos |
| `ritmo-objetivo-vs-ritmo-realista` | Convertir objetivo en plan de paso |

### Enlaces internos

- Pace debe enlazar a predicción cuando el usuario ya tiene una marca.
- Predicción debe enlazar a pace para generar parciales.
- VO2 máx debe enlazar a frecuencia cardíaca, pero no tratar ambas métricas
  como equivalentes.

### Reglas

- Diferenciar estimación de prueba de laboratorio.
- No publicar tablas de “nivel” sin fuente y contexto por método.
- Incluir ejemplos métricos e imperiales dentro de la misma pieza cuando la
  intención sea idéntica.

## 4. Frecuencia cardíaca de entrenamiento

**Prioridad:** P0  
**Calculadoras:**

- `/salud/calculadora-de-frecuencia-cardiaca-maxima`
- `/salud/calculadora-de-zonas-de-frecuencia-cardiaca`

### Intención y valor

El usuario quiere estimar su frecuencia máxima, calcular zonas y entender si
debe usar porcentaje de FCM o reserva cardíaca. El contenido debe ayudar a
interpretar, no diagnosticar.

### Núcleo recomendado

| Artículo | Intención principal |
| --- | --- |
| `frecuencia-cardiaca-maxima-que-es-como-calcularla` | Definición y fórmulas |
| `formula-220-menos-edad-vs-tanaka` | Comparar estimaciones |
| `como-calcular-zonas-de-frecuencia-cardiaca` | Obtener las zonas |
| `metodo-karvonen-frecuencia-cardiaca-de-reserva` | Explicar el método |
| `zonas-1-2-3-4-5-que-significan` | Interpretar el resultado |
| `frecuencia-cardiaca-en-reposo-como-medirla` | Mejorar la entrada del cálculo |
| `por-que-mi-pulsometro-y-la-calculadora-no-coinciden` | Resolver discrepancias |

### Fuentes base

- American Heart Association.
- CDC Physical Activity.
- Estudios originales o revisiones de fórmulas de FCM.

### Reglas

- Incluir aviso para síntomas, enfermedad cardiovascular y medicación que
  altere la frecuencia cardíaca.
- No usar zonas genéricas como prescripción individual.

## 5. Calificaciones y planificación académica

**Prioridad:** P0  
**Calculadoras:**

- `/matematicas/calculadora-promedio-escolar-gpa`
- `/matematicas/calculadora-nota-minima-para-aprobar`
- `/matematicas/calculadora-calificacion-ponderada`
- `/matematicas/calculadora-porcentaje-asistencia-escolar`
- `/matematicas/calculadora-horas-de-estudio`

### Intención y valor

El usuario quiere conocer su promedio, la nota necesaria, cuánto pesa una
evaluación, cuántas faltas puede tener o cómo repartir el tiempo de estudio. Es
un recorrido completo de planificación, no cinco temas aislados.

### Núcleo recomendado

| Artículo | Intención principal |
| --- | --- |
| `como-calcular-promedio-de-calificaciones` | Promedio simple |
| `como-calcular-promedio-ponderado` | Pesos distintos |
| `que-nota-necesito-para-aprobar` | Resolver una evaluación pendiente |
| `como-calcular-nota-final-con-porcentajes` | Integrar tareas y exámenes |
| `diferencia-entre-promedio-simple-y-ponderado` | Elegir método |
| `como-convertir-promedio-a-gpa` | Entender una conversión aproximada |
| `como-calcular-porcentaje-de-asistencia` | Obtener porcentaje |
| `cuantas-faltas-puedo-tener` | Planear contra un mínimo |
| `como-calcular-horas-de-estudio-por-dia` | Repartir una meta |
| `errores-al-calcular-la-nota-final` | Pesos incompletos, escalas y redondeos |

### Enlaces internos

- Enlazar al cluster de porcentajes para la explicación matemática general.
- Cada artículo debe declarar la escala usada; no asumir que aprobar siempre
  significa 6, 60 % o 4.0.
- Las páginas por país o escala solo deben crearse si existe demanda y una
  diferencia real que justificar.

## 6. Rentabilidad, margen y punto de equilibrio

**Prioridad:** P0  
**Calculadoras:**

- `/finanzas/calculadora-de-roi`
- `/finanzas/calculadora-de-margen-y-markup`
- `/finanzas/calculadora-de-punto-de-equilibrio`

### Intención y valor

El usuario quiere decidir precios, entender ganancia y saber cuánto necesita
vender. El cluster debe unir los tres cálculos en un recorrido de negocio:
costo, precio, margen, volumen y retorno.

### Núcleo recomendado

| Artículo | Intención principal |
| --- | --- |
| `como-calcular-margen-de-ganancia` | Fórmula y ejemplo |
| `margen-vs-markup-diferencias` | Evitar la confusión principal |
| `como-calcular-precio-de-venta-con-margen-deseado` | Fijar precio |
| `que-es-punto-de-equilibrio` | Entender unidades e ingresos mínimos |
| `como-calcular-punto-de-equilibrio-en-unidades-y-dinero` | Resolver el cálculo |
| `costos-fijos-vs-costos-variables` | Preparar entradas correctas |
| `que-es-roi-y-como-se-calcula` | Medir retorno |
| `roi-vs-margen-vs-rentabilidad` | Elegir la métrica correcta |
| `errores-al-calcular-rentabilidad-de-un-negocio` | Costos omitidos y periodos incompatibles |

### Enlaces internos

- Usar porcentajes como soporte, sin repetir su guía general.
- Enlazar a freelance cuando el caso sea venta de servicios.
- Enlazar a interés compuesto solo cuando el retorno se mida a lo largo del
  tiempo; no confundir ROI simple con rendimiento anualizado.

## 7. Fechas, edad y plazos

**Prioridad:** P0  
**Calculadoras:**

- `/fecha-tiempo/calculadora-de-edad`
- `/fecha-tiempo/diferencia-entre-fechas`
- `/fecha-tiempo/calculadora-fecha-limite-countdown`

### Intención y valor

El usuario quiere una respuesta exacta y rápida, pero también necesita entender
si se cuentan ambos extremos, años calendario, meses incompletos o días
hábiles.

### Núcleo recomendado

| Artículo | Intención principal |
| --- | --- |
| `como-calcular-edad-exacta` | Años, meses y días |
| `como-calcular-diferencia-entre-dos-fechas` | Intervalo calendario |
| `cuantos-dias-hay-entre-dos-fechas` | Consulta directa |
| `dias-naturales-vs-dias-habiles` | Elegir forma de conteo |
| `como-sumar-o-restar-dias-a-una-fecha` | Calcular una fecha futura o pasada |
| `como-calcular-cuanto-falta-para-una-fecha` | Cuenta regresiva |
| `se-incluye-el-dia-inicial-al-contar-fechas` | Resolver ambigüedad frecuente |
| `anos-bisiestos-y-calculo-de-fechas` | Explicar casos límite |

### Reglas

- Los días hábiles sin feriados deben describirse como lunes a viernes.
- No afirmar que el cálculo sirve para plazos legales si no incorpora la
  normativa y calendario aplicables.

## 8. Consumo de combustible y costo de viaje

**Prioridad:** P0  
**Calculadoras:**

- `/vehiculos/calculadora-de-consumo-de-gasolina`
- `/vehiculos/calculadora-de-costo-por-kilometro`

### Intención y valor

El usuario quiere medir rendimiento, estimar litros y calcular el costo de un
trayecto. Debe poder trabajar con km/L, L/100 km y mpg sin buscar conversiones
en otra web.

### Núcleo recomendado

| Artículo | Intención principal |
| --- | --- |
| `como-calcular-consumo-de-gasolina` | Fórmula desde tanque y distancia |
| `como-calcular-kilometros-por-litro` | Obtener rendimiento |
| `km-por-litro-vs-litros-cada-100-km` | Entender formatos inversos |
| `como-calcular-gasolina-para-un-viaje` | Estimar litros y costo |
| `como-calcular-costo-por-kilometro` | Incluir combustible y extras |
| `como-dividir-gasolina-entre-pasajeros` | Repartir un viaje |
| `por-que-cambia-el-consumo-de-combustible` | Tráfico, carga, velocidad y medición |

### Enlaces internos

- Enlazar km/millas para viajes internacionales.
- No publicar precios de gasolina “actuales” sin fuente, ubicación y política
  de actualización.

## 9. Fecha probable de parto y edad gestacional

**Prioridad:** P0  
**Tipo:** salud YMYL  
**Calculadora:**

- `/salud/fecha-probable-de-parto`

### Intención y valor

El usuario quiere conocer una fecha estimada, sus semanas de embarazo o cómo
cambia el cálculo según FUM, ecografía, FIV o una FPP indicada por su equipo
médico.

### Núcleo recomendado

| Artículo | Intención principal |
| --- | --- |
| `como-calcular-fecha-probable-de-parto` | Método general |
| `regla-de-naegele-formula-y-ejemplo` | Entender el cálculo por FUM |
| `como-calcular-semanas-de-embarazo` | Edad gestacional |
| `fecha-de-parto-por-fum-vs-ecografia` | Comparar referencias |
| `fecha-probable-de-parto-en-fiv` | Explicar datos específicos |
| `por-que-puede-cambiar-la-fecha-probable-de-parto` | Resolver discrepancias |
| `que-significa-estar-de-37-40-o-41-semanas` | Interpretar rangos sin aconsejar tratamiento |

### Reglas

- Presentar siempre una fecha estimada, no garantizada.
- No indicar cambios de fecha clínica ni decisiones obstétricas.
- Revisión editorial con fuentes obstétricas oficiales antes de publicar.

## 10. Ovulación, ciclo y ventana fértil

**Prioridad:** P0  
**Tipo:** salud YMYL  
**Calculadora:**

- `/salud/calculadora-de-ovulacion`

### Intención y valor

El usuario quiere estimar ovulación, ventana fértil y próxima menstruación.
Debe quedar claro que un calendario no confirma la ovulación ni funciona como
método anticonceptivo fiable.

### Núcleo recomendado

| Artículo | Intención principal |
| --- | --- |
| `como-calcular-ovulacion` | Método orientativo |
| `que-es-la-ventana-fertil` | Entender el periodo fértil |
| `cuantos-dias-dura-la-ventana-fertil` | Resolver duración |
| `ovulacion-en-ciclos-irregulares` | Explicar menor fiabilidad |
| `ovulacion-y-proxima-menstruacion` | Relacionar fechas |
| `calendario-vs-test-de-ovulacion-vs-temperatura-basal` | Comparar métodos |
| `por-que-la-calculadora-de-ovulacion-puede-fallar` | Límites y variabilidad |

### Fuentes base

- Office on Women's Health:
  `https://womenshealth.gov/menstrual-cycle/your-menstrual-cycle`
- Organizaciones obstétricas y ginecológicas oficiales.

### Reglas

- No presentar días “seguros”.
- Incluir orientación para consultar cuando existan ciclos muy irregulares,
  ausencia de menstruación, dolor o sangrado preocupante.

## 11. Composición corporal

**Prioridad:** P1  
**Tipo:** expansión del cluster IMC  
**Calculadoras:**

- `/salud/calculadora-de-porcentaje-de-grasa-corporal`
- `/salud/calculadora-de-imc`

### Intención y valor

El usuario quiere estimar grasa corporal, entender las medidas necesarias y
comparar el resultado con IMC. No conviene crear otra guía general de IMC.

### Núcleo recomendado

| Artículo | Intención principal |
| --- | --- |
| `como-calcular-porcentaje-de-grasa-corporal` | Método y ejemplo |
| `metodo-circunferencias-grasa-corporal` | Tomar medidas correctamente |
| `imc-vs-porcentaje-de-grasa-corporal` | Ya existe; actualizar y reforzar |
| `por-que-cambia-mi-porcentaje-de-grasa-corporal` | Sensibilidad de medición |
| `como-medir-cintura-cuello-y-cadera` | Reducir error de entrada |
| `grasa-corporal-estimada-vs-medicion-clinica` | Explicar límites |

### Reglas

- Evitar tablas estéticas o lenguaje estigmatizante.
- No presentar la estimación como diagnóstico.

## 12. Calorías quemadas por ejercicio

**Prioridad:** P1  
**Calculadoras:**

- `/salud/calculadora-de-calorias-quemadas-por-ejercicio`
- puente: `/salud/calculadora-de-calorias-diarias-tdee`

### Núcleo recomendado

| Artículo | Intención principal |
| --- | --- |
| `como-calcular-calorias-quemadas-en-ejercicio` | Método MET |
| `que-es-un-met-en-ejercicio` | Entender la fórmula |
| `calorias-activas-vs-calorias-totales` | Evitar doble conteo |
| `calorias-quemadas-caminando-corriendo-bicicleta` | Comparar actividades con supuestos |
| `por-que-reloj-y-calculadora-dan-calorias-distintas` | Resolver discrepancias |
| `como-usar-calorias-de-ejercicio-con-tdee` | Evitar sumar ejercicio dos veces |

### Reglas

- Fuente base: Compendium of Physical Activities.
- No afirmar que una sesión compensa una cantidad exacta de comida.

## 13. Hidratación diaria

**Prioridad:** P1  
**Tipo:** salud YMYL  
**Calculadora:**

- `/salud/calculadora-de-agua-diaria`

### Núcleo recomendado

| Artículo | Intención principal |
| --- | --- |
| `cuanta-agua-debo-tomar-al-dia` | Respuesta principal |
| `agua-diaria-segun-peso` | Explicar el método y sus límites |
| `agua-para-ejercicio-y-clima-caluroso` | Ajustar por contexto |
| `liquidos-totales-vs-agua-para-beber` | Diferenciar referencias |
| `senales-generales-de-deshidratacion` | Educación prudente |
| `demasiada-agua-riesgos-y-limites` | Evitar recomendaciones excesivas |

### Fuentes base

- National Academies:
  `https://www.nationalacademies.org/read/10925/chapter/6`
- CDC sobre agua y bebidas saludables.
- NIOSH para trabajo y calor.

## 14. Fuerza y repetición máxima

**Prioridad:** P1  
**Calculadora:**

- `/salud/calculadora-1rm-repeticion-maxima`

### Núcleo recomendado

| Artículo | Intención principal |
| --- | --- |
| `que-es-1rm-y-para-que-sirve` | Concepto |
| `como-calcular-1rm-sin-probar-el-maximo` | Estimación segura |
| `formula-epley-vs-brzycki` | Comparar métodos |
| `tabla-porcentajes-1rm` | Convertir máximo en cargas |
| `como-calcular-peso-para-5-8-10-repeticiones` | Uso práctico |
| `por-que-cambia-mi-1rm-estimado` | Técnica, fatiga y ejercicio |
| `errores-al-usar-una-calculadora-1rm` | Entradas y expectativas |

### Reglas

- No recomendar intentos máximos a personas sin experiencia o supervisión.
- Diferenciar estimación por ejercicio; un resultado en sentadilla no se
  transfiere a press de banca.

## 15. Pago de deudas

**Prioridad:** P1  
**Tipo:** expansión del cluster préstamo  
**Calculadoras:**

- `/finanzas/plan-de-pago-de-deudas`
- `/finanzas/calculadora-de-prestamo`

### Núcleo recomendado

| Artículo | Intención principal |
| --- | --- |
| `como-hacer-un-plan-para-pagar-deudas` | Recorrido completo |
| `bola-de-nieve-vs-avalancha` | Comparar métodos |
| `que-deuda-pagar-primero` | Decisión práctica |
| `como-repartir-un-pago-extra-entre-deudas` | Aplicar presupuesto adicional |
| `como-calcular-cuanto-tardare-en-pagar-mis-deudas` | Plazo e intereses |
| `pago-minimo-vs-pago-fijo` | Entender consecuencias |
| `errores-al-hacer-un-plan-de-pago-de-deudas` | Tasas, mínimos y nuevos cargos |

### Reglas

- No recomendar productos financieros concretos sin análisis y actualización.
- Mantener lenguaje útil y no culpabilizante.

## 16. Tarifas y proyectos freelance

**Prioridad:** P1  
**Calculadoras:**

- `/finanzas/calculadora-de-tarifa-por-hora-freelance`
- `/finanzas/calculadora-de-precio-de-proyecto-freelance`

### Núcleo recomendado

| Artículo | Intención principal |
| --- | --- |
| `como-calcular-tarifa-por-hora-freelance` | Obtener tarifa sostenible |
| `cuantas-horas-facturables-tiene-un-freelance` | Estimar capacidad real |
| `como-incluir-gastos-impuestos-y-vacaciones-en-tu-tarifa` | No subcotizar |
| `como-cobrar-un-proyecto-freelance` | Precio fijo |
| `tarifa-por-hora-vs-precio-por-proyecto` | Elegir modelo |
| `como-anadir-margen-de-riesgo-a-un-proyecto` | Cubrir incertidumbre |
| `como-calcular-cambios-y-revisiones-en-un-presupuesto` | Controlar alcance |
| `errores-al-cotizar-un-proyecto` | Horas olvidadas y comisiones |

### Enlaces internos

- Margen y punto de equilibrio para rentabilidad.
- Horas trabajadas para registrar tiempo.
- Costo de reunión para trabajo no facturable.

## 17. Ahorro, interés e inflación

**Prioridad:** P1  
**Tipo:** expansión del cluster interés compuesto  
**Calculadoras:**

- `/finanzas/calculadora-de-ahorro-para-un-objetivo`
- `/finanzas/calculadora-de-interes-simple`
- `/finanzas/calculadora-de-inflacion-poder-adquisitivo`
- `/finanzas/calculadora-de-interes-compuesto`

### Acciones recomendadas

No crear otro artículo general de interés compuesto. Completar las intenciones
que todavía no tienen una pieza claramente asociada a cada calculadora.

| Artículo | Intención principal |
| --- | --- |
| `como-calcular-interes-simple` | Fórmula y ejemplo |
| `cuando-se-usa-interes-simple` | Casos prácticos |
| `como-calcular-inflacion-entre-dos-periodos` | Cambio de precios |
| `que-es-poder-adquisitivo` | Interpretar pérdida real |
| `cuanto-ahorrar-al-mes-para-una-meta` | Ya existe; reforzar calculadora correcta |
| `ahorro-sin-rendimiento-vs-con-rendimiento` | Comparar escenarios |
| `meta-de-ahorro-nominal-vs-meta-ajustada-por-inflacion` | Incorporar valor real |

## 18. Precio promedio de inversión

**Prioridad:** P1  
**Calculadora:**

- `/finanzas/calculadora-dca-costo-promedio`

### Núcleo recomendado

| Artículo | Intención principal |
| --- | --- |
| `que-es-dca-y-como-funciona` | Concepto |
| `como-calcular-precio-promedio-de-compra` | Fórmula ponderada |
| `precio-promedio-con-comisiones` | Costo efectivo |
| `como-cambia-mi-promedio-con-otra-compra` | Simular siguiente operación |
| `dca-vs-invertir-todo-de-golpe` | Comparar estrategias sin recomendar una |
| `errores-al-calcular-precio-promedio` | Promedio simple, unidades y comisiones |

### Reglas

- No presentar DCA como garantía de ganancia o reducción de riesgo total.
- Separar cálculo educativo de asesoría de inversión.

## 19. Trabajo y productividad

**Prioridad:** P1  
**Calculadoras:**

- `/fecha-tiempo/calculadora-de-horas-trabajadas`
- `/fecha-tiempo/calculadora-costo-reunion`
- `/fecha-tiempo/calculadora-pomodoro`
- `/fecha-tiempo/calculadora-tiempo-de-lectura`

### Núcleo recomendado

| Artículo | Intención principal |
| --- | --- |
| `como-calcular-horas-trabajadas` | Sumar turnos y descansos |
| `como-convertir-horas-y-minutos-a-horas-decimales` | Preparar nómina o factura |
| `como-calcular-horas-extra` | Método genérico, sin afirmar reglas legales |
| `como-calcular-el-costo-de-una-reunion` | Horas-persona y costo |
| `como-reducir-el-costo-de-reuniones-recurrentes` | Comparar escenarios |
| `metodo-pomodoro-como-planificar-sesiones` | Uso práctico |
| `cuantos-pomodoros-caben-en-mi-tiempo` | Planificar un bloque |
| `como-calcular-tiempo-de-lectura` | Palabras por minuto |
| `velocidad-de-lectura-y-tiempo-estimado` | Interpretar un rango |

### Reglas

- Las horas extra dependen del país y contrato; el contenido general debe
  decirlo expresamente.
- No mezclar productividad personal con consejo médico sobre fatiga.

## 20. Álgebra y aritmética paso a paso

**Prioridad:** P1  
**Calculadoras:**

- `/matematicas/calculadora-de-regla-de-tres`
- `/matematicas/calculadora-mcd-mcm`
- `/matematicas/calculadora-ecuaciones-cuadraticas`
- `/matematicas/calculadora-sistema-ecuaciones-2x2`

### Arquitectura

Este cluster debe priorizar explicación paso a paso y elección del método. No
conviene unir todas las materias en un único artículo pilar superficial.

| Artículo | Intención principal |
| --- | --- |
| `regla-de-tres-directa-e-inversa` | Elegir tipo de proporción |
| `regla-de-tres-ejemplos-resueltos` | Practicar |
| `como-calcular-mcd-y-mcm` | Procedimiento |
| `mcd-vs-mcm-cuando-usar-cada-uno` | Elegir operación |
| `formula-general-ecuaciones-cuadraticas` | Resolver ax²+bx+c |
| `discriminante-raices-reales-y-complejas` | Interpretar soluciones |
| `como-resolver-sistema-de-ecuaciones-2x2` | Procedimiento general |
| `sustitucion-vs-eliminacion-vs-cramer` | Comparar métodos |
| `como-comprobar-la-solucion-de-una-ecuacion` | Verificar el resultado |

### Reglas

- Incluir problemas resueltos originales.
- No crear decenas de páginas por coeficientes concretos.
- Evaluar marcado `MathSolver` solo si la implementación cumple las directrices
  de Google y muestra pasos accesibles.

## 21. Probabilidad y estadística

**Prioridad:** P1  
**Calculadoras:**

- `/matematicas/calculadora-de-estadistica-basica`
- `/probabilidad-estadistica/calculadora-probabilidad-basica`
- `/probabilidad-estadistica/calculadora-combinaciones-permutaciones`
- `/probabilidad-estadistica/calculadora-distribucion-normal-z-score`

### Núcleo recomendado

| Artículo | Intención principal |
| --- | --- |
| `media-mediana-y-moda-diferencias` | Elegir medida central |
| `como-calcular-media-mediana-y-moda` | Procedimiento |
| `como-calcular-probabilidad` | Fórmula básica |
| `probabilidad-de-union-interseccion-y-complemento` | Resolver eventos |
| `probabilidad-condicional-explicada` | Entender dependencia |
| `combinaciones-vs-permutaciones` | Elegir fórmula |
| `combinaciones-y-permutaciones-con-repeticion` | Resolver variantes |
| `que-es-z-score-como-se-calcula` | Estandarizar un valor |
| `como-usar-la-tabla-de-distribucion-normal` | Obtener áreas y percentiles |
| `percentil-vs-z-score` | Interpretar resultados |

### Reglas

- Cada fórmula debe incluir definición de variables y ejemplo.
- Separar probabilidad educativa de recomendaciones sobre apuestas.

## 22. Geometría, superficies y pintura

**Prioridad:** P2  
**Tipo:** microcluster práctico  
**Calculadoras:**

- `/geometria/calculadora-de-area-y-perimetro`
- `/geometria/calculadora-del-teorema-de-pitagoras`
- `/construccion/metros-cuadrados-de-pintura`

### Núcleo recomendado

- `como-calcular-area-y-perimetro`
- `formulas-de-area-y-perimetro-por-figura`
- `como-calcular-hipotenusa-y-catetos`
- `teorema-de-pitagoras-ejemplos`
- `como-calcular-metros-cuadrados-de-una-pared`
- `como-calcular-litros-de-pintura`
- `como-descontar-puertas-y-ventanas`
- `cuantas-manos-de-pintura-necesito`

El puente debe ir de geometría a la tarea de pintura, no al revés en todas las
piezas.

## 23. Conversión de unidades

**Prioridad:** P2  
**Tipo:** microcluster con riesgo de contenido delgado  
**Calculadoras:**

- `/conversores/conversor-de-temperatura`
- `/conversores/conversor-de-peso`
- `/conversores/kilometros-a-millas`

### Núcleo recomendado

- `celsius-fahrenheit-kelvin-formulas`
- `tabla-celsius-a-fahrenheit-temperaturas-comunes`
- `como-convertir-kilos-a-libras`
- `tabla-kilos-a-libras-valores-comunes`
- `como-convertir-kilometros-a-millas`
- `kilometros-vs-millas-diferencias`
- `errores-comunes-al-convertir-unidades`

### Regla de expansión

No crear una URL por cada valor (`70 kg a libras`, `100 km a millas`) hasta que
Search Console demuestre demanda suficiente y se pueda aportar algo más que una
operación automática. Priorizar tablas útiles y calculadoras indexables.

## 24. Medidas y escalado de recetas

**Prioridad:** P2  
**Calculadoras:**

- `/cocina/conversor-de-medidas-culinarias`
- `/cocina/escalar-receta-por-porciones`

### Núcleo recomendado

- `como-convertir-medidas-de-cocina`
- `tazas-cucharadas-y-mililitros-tabla`
- `gramos-vs-mililitros-por-que-no-son-equivalentes`
- `como-convertir-tazas-a-gramos-segun-ingrediente`
- `como-escalar-una-receta`
- `como-reducir-una-receta-a-la-mitad`
- `como-duplicar-o-triplicar-ingredientes`
- `que-ingredientes-no-escalan-de-forma-lineal`

### Reglas

- Aclarar cuándo una conversión depende de densidad.
- No afirmar equivalencias universales de tazas a gramos.
- Incluir ejemplos de ingredientes y declarar la fuente de densidades.

## 25. Edad y alimentación de mascotas

**Prioridad:** P2  
**Tipo:** dos subclusters bajo la categoría Mascotas  
**Calculadoras:**

- `/mascotas/edad-de-mascota-en-anos-humanos`
- `/mascotas/calorias-diarias-para-perro-o-gato`

### Subcluster edad

- `como-calcular-edad-de-un-perro-en-anos-humanos`
- `edad-de-perro-segun-tamano`
- `como-calcular-edad-de-un-gato-en-anos-humanos`
- `por-que-un-ano-de-mascota-no-equivale-a-siete-anos`

### Subcluster alimentación

- `cuantas-calorias-necesita-un-perro`
- `cuantas-calorias-necesita-un-gato`
- `que-son-rer-y-mer-en-mascotas`
- `como-usar-condicion-corporal-al-estimar-alimento`
- `por-que-la-racion-del-envase-y-la-calculadora-no-coinciden`

### Reglas

- No recomendar pérdida de peso ni raciones terapéuticas sin veterinario.
- Separar perros y gatos cuando cambie la fórmula, el ejemplo o la intención.
- Usar fuentes veterinarias como AAHA y WSAVA.

## 26. Propina y división de cuentas

**Prioridad:** P2  
**Tipo:** microcluster transaccional  
**Calculadoras:**

- `/restaurantes/calculadora-de-propina`
- `/restaurantes/dividir-cuenta-en-restaurante`

### Núcleo recomendado

- `como-calcular-propina`
- `como-dividir-una-cuenta-entre-varias-personas`
- `como-dividir-cuenta-con-propina`
- `como-repartir-una-cuenta-si-cada-persona-consumio-distinto`
- `propina-antes-o-despues-de-impuestos`
- `como-redondear-una-cuenta-sin-perder-centavos`

No crear guías de porcentajes de propina por país sin fuentes, contexto cultural
y mantenimiento editorial.

# Plan de ejecución

## Fase 0: preparar la base

1. Corregir en TDEE las URLs de blog para incluir `categorySlug`.
2. Ejecutar los artículos P0 de TDEE.
3. Crear una plantilla común de spec basada en `specs/content/tdee`.
4. Añadir un campo interno de estado por pieza: `planned`, `specified`,
   `draft`, `published`, `refresh`.
5. Registrar para cada artículo su calculadora primaria y enlaces secundarios.

## Fase 1: clusters de mayor retorno editorial

Publicar primero el núcleo de:

1. Déficit calórico.
2. Macros y proteína.
3. Calificaciones.
4. Rentabilidad y precios de negocio.
5. Fechas y plazos.
6. Consumo de combustible.

Cada cluster debe empezar con 4 o 5 artículos, no con toda la expansión.

## Fase 2: fitness y salud con revisión reforzada

1. Rendimiento de carrera.
2. Frecuencia cardíaca.
3. Composición corporal.
4. Calorías por ejercicio.
5. Hidratación.
6. 1RM.

## Fase 3: salud reproductiva

1. Fecha probable de parto.
2. Ovulación y ventana fértil.

Esta fase puede adelantarse por demanda, pero no debe publicarse sin revisión
de fuentes, límites y avisos.

## Fase 4: finanzas y trabajo

1. Pago de deudas.
2. Freelance.
3. Ahorro, interés e inflación.
4. DCA.
5. Trabajo y productividad.

## Fase 5: educación, utilidades y microclusters

1. Álgebra.
2. Probabilidad y estadística.
3. Geometría y pintura.
4. Conversiones.
5. Cocina.
6. Mascotas.
7. Propina y cuentas.

# Plantilla mínima para cada spec de cluster

Cada directorio nuevo debe incluir un archivo `00_cluster-{slug}.md` con:

1. Objetivo del cluster.
2. Calculadora o calculadoras pilar.
3. Audiencia y problema que intenta resolver.
4. Mapa de intenciones.
5. Tabla de artículos con URL, prioridad y rol.
6. Riesgos de canibalización.
7. Reglas editoriales.
8. Fuentes base.
9. Arquitectura de enlaces internos.
10. Orden de publicación.
11. Criterios de aceptación.

Cada spec de artículo debe incluir:

1. Ruta futura dentro de `src/content/blog/{categorySlug}`.
2. URL pública con categoría.
3. Metadata sugerida compatible con `src/content.config.ts`.
4. Keyword o problema principal.
5. Intención de búsqueda descrita como tarea humana.
6. Promesa concreta del artículo.
7. Respuesta corta que debe aparecer al inicio.
8. Fórmula, tabla o ejemplo obligatorio.
9. Estructura de encabezados.
10. Enlaces internos.
11. Fuentes.
12. Advertencias cuando corresponda.
13. Criterios de aceptación verificables.

# Modelo de enlazado interno

```txt
Artículo base
├── Artículo de cálculo paso a paso
├── Artículo de interpretación
├── Artículo de comparación
├── Artículo de errores o troubleshooting
└── Calculadora pilar
    ├── Resultado
    ├── Explicación breve
    └── Siguiente herramienta relacionada
```

Reglas:

- Cada artículo debe enlazar a una calculadora primaria.
- Cada calculadora debe enlazar a entre 3 y 6 artículos realmente relacionados.
- Cada artículo debe incluir al menos 2 enlaces contextuales cuando existan.
- No usar el mismo anchor exacto en todos los enlaces.
- No enlazar rutas futuras desde contenido publicado.
- Una pieza puente debe tener una intención propia; no debe existir solo para
  pasar autoridad entre dos páginas.

# Criterios para evitar canibalización

Antes de aprobar una spec, responder:

1. ¿La consulta espera calcular, aprender, comparar o interpretar?
2. ¿Ya existe una página que satisface esa misma tarea?
3. ¿La nueva pieza tiene un ejemplo, fórmula o decisión diferente?
4. ¿Podría resolverse como sección de un artículo existente?
5. ¿Cuál es la calculadora primaria?
6. ¿Qué página debe posicionar para la consulta principal?

Si dos propuestas tienen la misma respuesta, CTA y estructura, deben
fusionarse.

# Medición y expansión

## Métricas por cluster

- Impresiones y clics no-branded.
- Consultas nuevas relacionadas con la calculadora.
- Posición de la calculadora y de la pieza pilar.
- CTR por intención.
- Clics desde artículo hacia calculadora.
- Uso de la calculadora después de leer.
- Navegación hacia una segunda pieza del cluster.
- Páginas sin impresiones, sin enlaces o con intención solapada.

## Revisión

- Medir una línea base antes de publicar.
- Revisar indexación y enlaces al publicar.
- Hacer primera evaluación a las 8-12 semanas, sin esperar conclusiones
  definitivas si el sitio todavía tiene poca autoridad.
- Expandir solo las ramas que reciban consultas relevantes o completen una
  necesidad clara detectada en usuarios.
- Actualizar salud, finanzas, impuestos y datos por país con una cadencia
  definida y `updatedDate` cuando exista un cambio real.

# Criterios globales de aceptación

- Las 65 calculadoras quedan asignadas a un cluster existente, nuevo o
  microcluster.
- Ningún cluster nuevo duplica las intenciones centrales de los clusters
  publicados.
- Las specs usan URLs compatibles con la arquitectura real del blog.
- Cada pieza resuelve una tarea específica y muestra la respuesta antes de
  desarrollar contexto.
- Los ejemplos se pueden comprobar con la calculadora relacionada.
- Salud y finanzas incluyen fuentes primarias u oficiales y límites claros.
- No se crean variantes masivas por cifra, unidad, estatura, distancia o país
  sin evidencia de demanda y valor adicional.
- El roadmap se reordena con datos de Search Console, no con volumen supuesto.
