# Roadmap editorial: kilómetros a millas

## Objetivo

Construir un microcluster de contenido que aumente la visibilidad de
`/conversores/kilometros-a-millas` para consultas de conversión, tablas de
referencia, carrera, viajes y unidades náuticas. El contenido debe llevar a una
acción útil —usar la calculadora o elegir otra herramienta— y no convertirse en
una colección de páginas programáticas por cifra.

**Fecha del análisis:** 2026-07-27
**Calculadora pilar:** `/conversores/kilometros-a-millas`
**Categoría editorial propuesta:** `conversores`
**Ruta de los artículos:** `/blog/conversores/{slug}`

## Diagnóstico de la página actual

La página objetivo ya cubre buena parte de la intención informativa y
transaccional:

- Conversión en ambas direcciones: km → mi y mi → km.
- Fórmulas con el factor internacional `1 mi = 1.609344 km`.
- Tabla breve y accesos para 1, 5, 10, 50 y 100 unidades.
- Distancias de carrera: 5K, 10K, medio maratón y maratón.
- Distinción entre milla terrestre y milla náutica.
- FAQ con preguntas de alta intención.
- Parámetros compartibles para una conversión concreta.

El hueco principal no es otra explicación de la misma fórmula. Es crear
entradas editoriales que respondan a tareas relacionadas y que devuelvan al
usuario a la calculadora. Actualmente la página tampoco enlaza a artículos del
blog, así que el primer beneficio del cluster será bidireccional: artículos →
calculadora y calculadora → artículos.

## Señales de intención observadas

La revisión de resultados actuales muestra cuatro patrones:

1. Las consultas directas (`kilómetros a millas`, `cómo convertir km a millas`)
   están dominadas por conversores y tablas; el artículo debe diferenciarse con
   una respuesta corta, ejemplos verificables y una herramienta integrada.
2. Las tablas de carretera son una necesidad práctica independiente de la
   fórmula, especialmente para 1, 5, 10, 20, 50 y 100 millas o kilómetros.
3. En carrera, el usuario no solo convierte distancia: necesita traducir
   ritmos por kilómetro a ritmos por milla y entender 5K, 10K, media maratón y
   maratón.
4. “Milla” puede significar milla terrestre o náutica. Esa diferencia merece
   una pieza propia porque cambia el factor y el contexto de uso.

No se asignan volúmenes de búsqueda inventados. El orden debe validarse con
Search Console, tendencias y clics hacia la calculadora después del primer
lote.

## Roadmap priorizado

| Prioridad | Artículo / slug propuesto | Intención principal | Rol | Calculadora primaria |
| --- | --- | --- | --- | --- |
| P0 | `como-convertir-kilometros-a-millas` | Aprender la fórmula y resolver una conversión | Pilar editorial | `/conversores/kilometros-a-millas` |
| P0 | `tabla-kilometros-a-millas-distancias-comunes` | Consultar equivalencias sin hacer cuentas | Referencia práctica | `/conversores/kilometros-a-millas` |
| P1 | `kilometros-vs-millas-diferencias` | Entender qué unidad usar según país y contexto | Comparación | `/conversores/kilometros-a-millas` |
| P1 | `ritmo-por-kilometro-vs-ritmo-por-milla` | Traducir el ritmo de carrera entre sistemas | Caso de uso | `/salud/calculadora-de-pace-ritmo-de-carrera` |
| P1 | `milla-terrestre-vs-milla-nautica` | Distinguir millas terrestres, náuticas y sus factores | Desambiguación | `/conversores/kilometros-a-millas` |
| P2 | `como-convertir-kilometros-a-millas-en-excel` | Automatizar conversiones en una hoja de cálculo | Long-tail práctico | `/conversores/kilometros-a-millas` |

## Specs específicas

- [01 — Cómo convertir kilómetros a millas](./kilometros-a-millas/01_como-convertir-kilometros-a-millas.md)
- [02 — Tabla de kilómetros a millas](./kilometros-a-millas/02_tabla-kilometros-a-millas-distancias-comunes.md)
- [03 — Kilómetros vs. millas](./kilometros-a-millas/03_kilometros-vs-millas-diferencias.md)
- [04 — Ritmo por kilómetro vs. ritmo por milla](./kilometros-a-millas/04_ritmo-por-kilometro-vs-ritmo-por-milla.md)
- [05 — Milla terrestre vs. milla náutica](./kilometros-a-millas/05_milla-terrestre-vs-milla-nautica.md)
- [06 — Kilómetros a millas en Excel](./kilometros-a-millas/06_como-convertir-kilometros-a-millas-en-excel.md)

### P0 — artículos que deben publicarse primero

#### 1. Cómo convertir kilómetros a millas

- **Título sugerido:** Cómo convertir kilómetros a millas: fórmula, ejemplos y
  calculadora.
- **Keyword/problema:** `cómo convertir kilómetros a millas`, `km a millas`,
  `fórmula de kilómetros a millas`.
- **Promesa:** resolver km → mi y mi → km en menos de un minuto, explicando qué
  precisión conviene mostrar.
- **Respuesta inicial obligatoria:** `millas = kilómetros ÷ 1.609344` y
  `kilómetros = millas × 1.609344`, con un ejemplo de 10 km y otro de 10 mi.
- **Estructura mínima:**
  1. Respuesta rápida.
  2. Fórmula km → mi.
  3. Fórmula mi → km.
  4. Ejemplos paso a paso.
  5. Cuándo redondear a 2 decimales y cuándo conservar más precisión.
  6. Diferencia entre distancia y velocidad (`km/h` frente a `mph`).
  7. Uso de la calculadora y FAQ breve.
- **Enlaces:** calculadora pilar; tabla de equivalencias; diferencia entre
  kilómetros y millas; pieza de ritmo para lectores que están corriendo.
- **Criterio de no canibalización:** debe ser la URL que posicione para la
  explicación general. No crear otra pieza separada solo para “millas a
  kilómetros”; ambas direcciones viven aquí y en la calculadora.

#### 2. Tabla de kilómetros a millas para distancias comunes

- **Título sugerido:** Tabla de kilómetros a millas: equivalencias de 1 a 100
  km.
- **Keyword/problema:** `tabla km a millas`, `1 km a millas`, `10 km a millas`,
  `100 km a millas`.
- **Promesa:** consultar una tabla útil y comprobar cualquier valor con la
  calculadora, sin crear una URL distinta por cada número.
- **Contenido obligatorio:** tabla en ambas direcciones para 1, 2, 5, 10, 15,
  20, 30, 42.195, 50 y 100; bloque separado para 5K, 10K, medio maratón y
  maratón; nota visible sobre redondeo.
- **Estructura mínima:** respuesta destacada, tabla principal, distancias de
  carrera, distancias de carretera, cómo leer la tabla y calculadora.
- **Enlaces:** calculadora pilar y artículo de fórmula. Enlazar al artículo de
  ritmo solo desde el bloque de carreras.
- **Criterio de no canibalización:** la tabla debe ser escaneable y más útil que
  la tabla ya incluida en la calculadora; debe aportar cobertura, agrupación por
  uso y explicación del redondeo. Si no se puede mejorar la tabla actual, no se
  publica como URL independiente.

### P1 — contexto y diferenciación

#### 3. Kilómetros vs. millas: diferencias, usos y conversiones

- **Título sugerido:** Kilómetros vs. millas: diferencias, países y cuándo usar
  cada unidad.
- **Keyword/problema:** `diferencia entre kilómetros y millas`, `qué es una
  milla`, `sistema métrico y millas`.
- **Promesa:** entender por qué aparecen ambas unidades en mapas, señales,
  automóviles, deporte y compras internacionales.
- **Contenido obligatorio:** definición de ambas unidades; países y contextos de
  uso sin generalizaciones excesivas; símbolos `km` y `mi`; diferencia entre
  distancia y velocidad; ejemplos de 1, 5 y 100 unidades.
- **Estructura mínima:** resumen comparativo, tabla de factores, situaciones
  cotidianas, errores de interpretación y calculadora.
- **Criterio editorial:** no convertirlo en una historia extensa de las unidades
  ni repetir toda la fórmula del artículo pilar. Su función es responder “qué
  significa y cuál necesito”.

#### 4. Ritmo por kilómetro vs. ritmo por milla

- **Título sugerido:** Ritmo por kilómetro y ritmo por milla: cómo convertirlos
  para correr.
- **Keyword/problema:** `ritmo por km a ritmo por milla`, `pace por milla`,
  `tabla de ritmo km milla`.
- **Promesa:** comparar el mismo esfuerzo y la misma carrera en min/km y min/mi
  sin confundir distancia con velocidad.
- **Contenido obligatorio:** fórmula para distancia, no para velocidad; ejemplos
  con ritmos comunes; tabla corta de 4:00 a 8:00 min/km; equivalencias para 5K,
  10K, medio maratón y maratón; advertencia de que el ritmo real depende del
  recorrido y no solo de la conversión.
- **Enlaces:** `/salud/calculadora-de-pace-ritmo-de-carrera` como CTA principal;
  calculadora de kilómetros a millas para la distancia; tabla general como
  referencia secundaria.
- **Criterio de no canibalización:** debe posicionar para ritmo/pace. No debe
  intentar posicionar para la conversión genérica de km a mi.

#### 5. Milla terrestre vs. milla náutica

- **Título sugerido:** Milla terrestre vs. milla náutica: diferencias y
  equivalencias.
- **Keyword/problema:** `milla terrestre vs milla náutica`, `cuánto mide una
  milla náutica`, `1 milla náutica a km`.
- **Promesa:** elegir el factor correcto según se hable de carretera, aviación o
  navegación.
- **Contenido obligatorio:** `1 mi terrestre = 1.609344 km`, `1 nmi = 1.852 km`,
  símbolos recomendados, usos de cada unidad, relación entre milla náutica y
  nudo, y una tabla de conversiones de ambas unidades a kilómetros.
- **Enlaces:** calculadora pilar para millas terrestres; no enlazar la calculadora
  como si aceptara `nmi`: debe quedar explícito que la herramienta trabaja con
  `mi` terrestres.
- **Fuentes:** NIST para la milla internacional y una fuente hidrográfica o
  aeronáutica oficial para la milla náutica.
- **Criterio de no canibalización:** explicar la ambigüedad y sus consecuencias;
  no repetir el FAQ de la calculadora como artículo de 300 palabras.

### P2 — expansión condicionada por datos

#### 6. Cómo convertir kilómetros a millas en Excel y Google Sheets

- **Título sugerido:** Cómo convertir kilómetros a millas en Excel y Google
  Sheets.
- **Keyword/problema:** `convertir km a millas en Excel`, `fórmula km a millas
  Excel`, `km a millas Google Sheets`.
- **Promesa:** automatizar una columna de conversiones con fórmula directa,
  redondeo opcional y conversión inversa.
- **Contenido obligatorio:** fórmulas con referencias de celda; `REDONDEAR` /
  `ROUND` según la localización de la hoja; ejemplo de tabla; advertencia sobre
  separadores regionales; fórmula para millas a kilómetros.
- **Publicación:** solo después de comprobar impresiones o consultas de hojas de
  cálculo en Search Console, o si el sitio decide ampliar expresamente el
  cluster de matemáticas aplicadas. Si no hay señal, integrar esta sección en
  el artículo pilar y no abrir una URL.

## Arquitectura de enlaces

```text
/conversores/kilometros-a-millas
├── /blog/conversores/como-convertir-kilometros-a-millas
├── /blog/conversores/tabla-kilometros-a-millas-distancias-comunes
├── /blog/conversores/kilometros-vs-millas-diferencias
├── /blog/conversores/ritmo-por-kilometro-vs-ritmo-por-milla
├── /blog/conversores/milla-terrestre-vs-milla-nautica
└── /blog/conversores/como-convertir-kilometros-a-millas-en-excel
```

Implementación recomendada:

- Añadir en la calculadora un bloque “Guías relacionadas” después de la tabla
  de equivalencias o antes de las calculadoras relacionadas.
- Enlazar desde el artículo pilar a todos los artículos publicados del cluster.
- Enlazar desde la tabla al pilar y, solo en la sección deportiva, al artículo
  de ritmo.
- Enlazar desde la pieza de milla náutica a la calculadora únicamente con el
  texto “convertir millas terrestres a kilómetros”.
- Mantener anchors descriptivos y variados; no repetir “haz clic aquí”.
- No enlazar a `/blog/conversores/como-convertir-kilometros-a-millas-en-excel`
  hasta que esa pieza exista y pase revisión.

## Metadatos sugeridos

Usar el esquema actual de `src/lib/blog-schema.ts`:

```yaml
categorySlug: "conversores"
tags:
  - kilómetros a millas
  - conversión de unidades
  - distancias
relatedCalculator:
  label: "Convertir kilómetros a millas"
  href: "/conversores/kilometros-a-millas"
```

Cada artículo debe tener un `title`, una `description`, `pubDate`, `readTime` y
una descripción SEO específica. No marcar como `featured` todas las piezas del
cluster. `updatedDate` solo debe cambiar cuando se revise una tabla, fórmula,
fuente o ejemplo.

## Fuentes base y reglas de exactitud

- [NIST, factores de conversión de unidades](https://pml.nist.gov/cuu/pdf/sp811.pdf):
  usar como referencia para `1 mi = 1.609344 km`.
- [GOV.UK, tabla de conversiones del Highway Code](https://www.gov.uk/guidance/the-highway-code/other-information):
  usar como contraste para tablas de carretera redondeadas.
- [International Hydrographic Organization, milla náutica](https://docs.iho.int/iho_pubs/CB/C_51_SPA.pdf):
  usar para `1 nmi = 1.852 km` y el contexto náutico.
- [World Athletics, distancia del maratón](https://worldathletics.org/disciplines/road-running-event/marathon):
  usar para validar la referencia de 42.195 km / 26 millas y 385 yardas.

Las tablas deben declarar si muestran valores exactos o aproximados. La
calculadora puede conservar precisión interna y mostrar dos decimales por
defecto; el artículo debe mantener ese mismo criterio para no producir
discrepancias visibles.

## Orden de ejecución

### Fase 0 — medición y preparación

1. Registrar durante 4 semanas impresiones, clics, CTR, posición y consultas de
   `/conversores/kilometros-a-millas` en Search Console.
2. Revisar si existen consultas de ritmo, milla náutica, Excel o tablas.
3. Añadir el bloque de enlaces editoriales en la calculadora cuando se publique
   el primer artículo.

### Fase 1 — núcleo transaccional

1. Publicar `como-convertir-kilometros-a-millas`.
2. Publicar `tabla-kilometros-a-millas-distancias-comunes` si la tabla aporta
   más cobertura que la actual.
3. Enlazar ambas piezas entre sí y desde la calculadora.

### Fase 2 — usos y desambiguación

1. Publicar `kilometros-vs-millas-diferencias`.
2. Publicar `ritmo-por-kilometro-vs-ritmo-por-milla`.
3. Publicar `milla-terrestre-vs-milla-nautica` con revisión de fuentes.

### Fase 3 — expansión

Publicar la pieza de Excel solo si Search Console o la analítica del sitio
confirman esa intención. Si no, añadir un bloque de Excel al artículo pilar y
usar la capacidad editorial en otro conversor con demanda demostrada.

## Riesgos de canibalización

- **Pilar vs. tabla:** el pilar explica el método; la tabla resuelve una consulta
  de referencia. Si la tabla no aporta agrupación o valores nuevos, fusionar.
- **Pilar vs. diferencias:** el pilar calcula; diferencias explica unidades y
  contextos de uso.
- **Pilar vs. ritmo:** el pilar convierte distancia; ritmo convierte el tiempo
  por unidad y debe apuntar a la calculadora de pace.
- **Pilar vs. milla náutica:** la calculadora solo usa millas terrestres. El
  artículo náutico debe desambiguar, no generar una falsa expectativa de que la
  herramienta acepta nmi.
- **Variantes por número:** no crear páginas como `10-km-a-millas`,
  `50-km-a-millas` o `maraton-en-millas` mientras no exista evidencia de demanda y valor
  editorial único. Integrarlas en la tabla o en el artículo de carrera.

## Métricas y criterios de aceptación

Medir por artículo y por calculadora:

- impresiones y clics no marcados;
- consultas nuevas por intención;
- CTR y posición;
- clics del artículo a la calculadora;
- conversiones iniciadas desde enlaces internos;
- navegación entre dos piezas del cluster;
- consultas que revelen una intención no cubierta.

El cluster se considera listo cuando:

- existen al menos el pilar y la tabla o una justificación documentada para no
  publicar la tabla;
- cada artículo enlaza a una calculadora relevante y recibe al menos un enlace
  contextual del cluster;
- la calculadora enlaza a entre 3 y 5 piezas realmente relacionadas;
- todas las conversiones de ejemplo coinciden con la lógica de la calculadora;
- la milla terrestre y la náutica están diferenciadas en título, cuerpo y CTA;
- no existen URLs programáticas por cifra;
- se hace una primera revisión a las 8–12 semanas y se ajusta el orden con
  datos, no con volumen supuesto.
