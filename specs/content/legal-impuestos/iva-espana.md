# Spec de artículo: Calcular IVA España — Guía completa 2026

## Decisión editorial

Esta pieza debe **actualizar y ampliar** el artículo existente, no crear una URL
nueva.

- Archivo objetivo: `src/content/blog/legal-impuestos/iva-espana.md`
- URL canónica: `/blog/legal-impuestos/iva-espana`
- Categoría: `legal-impuestos`
- Estado: `refresh`
- Prioridad: P0
- Rol en el clúster: guía pilar específica de España
- Calculadora primaria: `/legal-impuestos/calculadora-de-iva`
- Título solicitado: `Calcular IVA España: Guía completa 2026`

No cambiar el slug ni publicar una variante como
`/blog/legal-impuestos/calcular-iva-espana`. La URL actual ya concentra la
intención española y recibe enlaces desde otras piezas del clúster.

## Objetivo

Resolver, en una sola página y sin obligar al lector a conocer terminología
fiscal, estas tareas:

1. Calcular cuánto IVA se añade a una base imponible.
2. Obtener la base y la cuota cuando el precio ya incluye IVA.
3. Elegir entre los tipos del 21%, 10% y 4% sin presentar listas simplistas como
   asesoramiento fiscal.
4. Comprobar el cálculo de una factura con uno o varios tipos.
5. Entender qué cambia cuando una factura profesional también lleva retención de
   IRPF.
6. Verificar el resultado con la calculadora del sitio.

El objetivo SEO es competir por la primera posición para la intención
`calcular IVA España`. No se debe prometer una posición concreta: la spec busca
maximizar relevancia, utilidad, precisión y confianza; el resultado dependerá
también de autoridad, indexación, enlaces y comportamiento de la SERP.

## Audiencia y necesidad

### Audiencia principal

- Autónomos que preparan o revisan una factura.
- Pequeñas empresas que comprueban presupuestos, gastos y facturas recibidas.
- Consumidores que quieren saber cuánto IVA contiene un precio final.
- Personal administrativo que necesita verificar una operación puntual.

### Trabajo que el usuario quiere completar

El lector no busca una historia extensa del impuesto. Quiere introducir o
comprobar una cifra y responder rápidamente una de estas preguntas:

- “¿Cuánto es 1.000 € más IVA?”
- “¿Cómo quito el 21% de un precio con IVA incluido?”
- “¿Este producto lleva 21%, 10% o 4%?”
- “¿Cómo muestro base, IVA y total en una factura?”
- “¿Por qué no se resta 21% directamente al total?”

## Intención SEO

- Keyword principal: `calcular IVA España`.
- Secundarias prioritarias:
  - `cómo calcular el IVA en España`
  - `calcular IVA 21`
  - `calcular IVA incluido`
  - `quitar IVA 21`
  - `calcular IVA de una factura`
  - `tipos de IVA en España 2026`
  - `IVA 21 10 4`
  - `calcular base imponible`
- Intención: mixta, transaccional e informativa. El usuario quiere un resultado
  inmediato y, después, entender o verificar el procedimiento.
- Entidades y conceptos que deben aparecer de forma natural: Agencia Tributaria,
  base imponible, tipo impositivo, cuota de IVA, precio sin IVA, precio con IVA,
  IVA incluido, factura, IVA repercutido e IVA soportado.
- Fragmento objetivo: fórmula para añadir y para extraer IVA, acompañada del
  ejemplo `100,00 € sin IVA → 121,00 € con IVA al 21%`.

## Lectura de la SERP y oportunidad de diferenciación

Los resultados actuales suelen ofrecer una calculadora, una explicación breve
de los tres tipos o una guía amplia para autónomos. Para superar esa cobertura,
esta página debe reunir sin relleno:

- Respuesta doble en la primera pantalla: añadir y extraer IVA.
- Ejemplo de `100 €` que diferencie claramente “sin IVA” de “IVA incluido”.
- Ejemplos de facturas representativas al 21%, 10% y 4%.
- Ejemplo de factura con dos tipos y totales separados por tipo.
- Nota breve sobre IVA e IRPF sin convertir el artículo en una guía de IRPF.
- Fuentes oficiales de 2026, fecha de revisión y límites territoriales.
- CTA temprano a la calculadora, útil para comprobar la aritmética y no para
  decidir qué tratamiento fiscal corresponde.

La ventaja no debe basarse en repetir la keyword ni en alargar el texto. Debe
basarse en completar la tarea mejor y con cifras auditables.

## Metadata sugerida

Conservar la fecha original de publicación y añadir la fecha real de la
actualización al ejecutar esta spec.

```yaml
title: "Calcular IVA España: Guía completa 2026"
seoTitle: "Calcular IVA España: guía completa 2026"
description: "Calcula el IVA en España al 21%, 10% o 4%. Aprende a añadirlo o quitarlo de una factura con fórmulas, ejemplos y calculadora."
pubDate: 2026-03-13
updatedDate: 2026-XX-XX
categorySlug: "legal-impuestos"
tags:
  - calcular IVA España
  - IVA 21 10 4
  - factura
  - autónomos
readTime: "9 min"
relatedCalculator:
  label: "Calcular o desglosar IVA"
  href: "/legal-impuestos/calculadora-de-iva"
sources:
  - label: "Tipos impositivos de IVA"
    url: "https://sede.agenciatributaria.gob.es/Sede/iva/calculo-iva-repercutido-clientes/tipos-impositivos-iva.html"
    publisher: "Agencia Estatal de Administración Tributaria"
    accessedDate: 2026-08-05
  - label: "Tipos impositivos en el IVA 2026"
    url: "https://sede.agenciatributaria.gob.es/static_files/Sede/Tema/IVA/IVA_reperc/Tipos_IVA_2026.pdf"
    publisher: "Agencia Estatal de Administración Tributaria"
    accessedDate: 2026-08-05
  - label: "Cálculo de la base imponible"
    url: "https://sede.agenciatributaria.gob.es/Sede/iva/calculo-iva-repercutido-clientes/calculo-base-imponible.html"
    publisher: "Agencia Estatal de Administración Tributaria"
    accessedDate: 2026-08-05
  - label: "Contenido de las facturas"
    url: "https://sede.agenciatributaria.gob.es/Sede/iva/facturacion-registro/facturacion-iva/contenido-facturas.html"
    publisher: "Agencia Estatal de Administración Tributaria"
    accessedDate: 2026-08-05
  - label: "Ley 37/1992 del Impuesto sobre el Valor Añadido"
    url: "https://www.boe.es/buscar/act.php?id=BOE-A-1992-28740"
    publisher: "Boletín Oficial del Estado"
    accessedDate: 2026-08-05
methodologyNote: "Los ejemplos son casos representativos calculados sobre la base imponible. Se conserva la precisión durante la operación y se muestran importes en euros con dos decimales. La clasificación del bien o servicio debe verificarse en la Agencia Tributaria."
```

No añadir `author`, `reviewer` o `reviewedDate` con identidades ficticias. Si un
profesional fiscal revisa la pieza, documentar su nombre, función y fecha reales.

## Promesa del artículo

La primera pantalla debe permitir que el usuario calcule el IVA sin leer el
resto del artículo. Las secciones posteriores deben ayudarle a elegir el tipo,
comprobar una factura y reconocer cuándo la fórmula simple no basta.

## Respuesta corta obligatoria

Este contenido, o una redacción equivalente, debe aparecer antes de cualquier
introducción histórica:

> Para calcular el IVA en España desde un precio sin impuesto, multiplica la
> base imponible por el tipo: 0,21, 0,10 o 0,04. Suma la cuota a la base para
> obtener el total. Si el precio ya incluye IVA, divide el total entre 1,21,
> 1,10 o 1,04 y resta la base obtenida al total. Por ejemplo, 100,00 € sin IVA
> son 121,00 € al 21%; si 121,00 € ya incluyen el 21%, la base es 100,00 € y el
> IVA es 21,00 €.

Inmediatamente después debe aparecer un enlace visible a la calculadora:

> ¿Quieres comprobar otra cantidad? Usa la [calculadora de IVA](/legal-impuestos/calculadora-de-iva),
> selecciona España y elige 21%, 10% o 4%.

## Fórmulas obligatorias

### Añadir IVA a una base imponible

```txt
cuota de IVA = base imponible × tipo / 100
total con IVA = base imponible + cuota de IVA
```

Atajos:

```txt
21%: total = base × 1,21
10%: total = base × 1,10
 4%: total = base × 1,04
```

### Extraer el IVA incluido

```txt
base imponible = total con IVA / (1 + tipo / 100)
cuota de IVA = total con IVA - base imponible
```

Atajos:

```txt
21%: base = total / 1,21
10%: base = total / 1,10
 4%: base = total / 1,04
```

También puede mostrarse la fórmula directa para obtener solo la cuota incluida:

```txt
IVA incluido = total × tipo / (100 + tipo)
```

Debe explicarse que “quitar el 21%” no significa restar `21%` al precio final,
porque el impuesto se calculó sobre una base menor que ese total.

## Tabla de respuesta inmediata

La tabla debe aparecer en el primer tercio del artículo:

| Tipo | Si la base es 100,00 € | IVA | Total | Divisor para extraerlo |
| ---: | ---: | ---: | ---: | ---: |
| 21% | 100,00 € | 21,00 € | 121,00 € | 1,21 |
| 10% | 100,00 € | 10,00 € | 110,00 € | 1,10 |
| 4% | 100,00 € | 4,00 € | 104,00 € | 1,04 |

Añadir una segunda tabla que responda la ambigüedad de la consulta “100 € con
IVA”:

| Total con IVA | Tipo | Base aproximada | IVA incluido |
| ---: | ---: | ---: | ---: |
| 100,00 € | 21% | 82,64 € | 17,36 € |
| 100,00 € | 10% | 90,91 € | 9,09 € |
| 100,00 € | 4% | 96,15 € | 3,85 € |

## Tipos de IVA en España en 2026

La tabla de tipos debe ser breve, útil y respaldada por la tabla oficial de la
Agencia Tributaria. No debe sugerir que basta con una categoría genérica para
clasificar cualquier operación.

| Tipo | Uso orientativo que sí puede citarse | Ejemplo para el artículo |
| --- | --- | --- |
| 21% general | Bienes y servicios sin un tipo reducido específico | Servicio de diseño web |
| 10% reducido | Entre otros, restauración, transporte de viajeros y determinados alimentos | Servicio de restaurante |
| 4% superreducido | Entre otros, libros que cumplen los requisitos, medicamentos de uso humano y determinados alimentos básicos | Libros |
| 0% | Solo determinadas operaciones previstas por la norma | Mención breve, sin ejemplo central |

Requisitos editoriales:

- Decir que los tipos vigentes generales son 21%, 10% y 4%, y que existe 0% en
  operaciones determinadas.
- No presentar tasa 0%, operación exenta y operación no sujeta como sinónimos.
- No usar “todos los alimentos”, “toda la cultura”, “toda la vivienda” u otras
  generalizaciones que la tabla oficial no respalda.
- Añadir una nota de actualización 2026: la tabla oficial recoge tipos
  temporales para determinados suministros energéticos y carburantes durante
  periodos concretos de 2026. Como esos periodos terminaron antes de la fecha de
  esta revisión, no deben mezclarse con los ejemplos principales; si se
  mencionan, indicar fechas exactas y enlazar el PDF oficial.
- Recordar que el tipo aplicable depende de la operación, fecha, territorio y
  circunstancias. La calculadora ejecuta la fórmula, pero no clasifica
  fiscalmente el producto o servicio.

## Ejemplos obligatorios de facturas

Llamarlos **ejemplos representativos** o **facturas de ejemplo**. No llamarlos
“facturas reales” si no proceden de documentos auténticos, anonimizados y con
permiso de uso.

Usar formato español: coma decimal, punto de miles y símbolo después de la cifra.

### Ejemplo 1: servicio profesional al 21%

Caso: un profesional factura un servicio de diseño web con una base de
`1.250,00 €`.

```txt
Base imponible: 1.250,00 €
IVA (21%):      1.250,00 × 0,21 = 262,50 €
Total factura:  1.250,00 + 262,50 = 1.512,50 €
```

### Ejemplo 2: servicio de restaurante al 10%

```txt
Base imponible: 86,40 €
IVA (10%):      86,40 × 0,10 = 8,64 €
Total factura:  86,40 + 8,64 = 95,04 €
```

### Ejemplo 3: libros al 4%

El texto debe aclarar que el ejemplo presupone libros incluidos en la categoría
que la Agencia Tributaria grava al 4%.

```txt
Base imponible: 42,50 €
IVA (4%):       42,50 × 0,04 = 1,70 €
Total factura:  42,50 + 1,70 = 44,20 €
```

### Ejemplo 4: precio con IVA del 21% ya incluido

```txt
Total con IVA: 1.512,50 €
Base imponible: 1.512,50 / 1,21 = 1.250,00 €
IVA incluido: 1.512,50 - 1.250,00 = 262,50 €
```

### Ejemplo 5: factura con más de un tipo

Caso representativo de una librería/papelería. Separar bases y cuotas por tipo:

| Concepto | Base | Tipo | Cuota IVA | Total |
| --- | ---: | ---: | ---: | ---: |
| Material de oficina | 80,00 € | 21% | 16,80 € | 96,80 € |
| Libros incluidos en el tipo superreducido | 50,00 € | 4% | 2,00 € | 52,00 € |
| **Total** | **130,00 €** | — | **18,80 €** | **148,80 €** |

Explicar que no se aplica un porcentaje medio al total. Se agrupan las bases,
se calcula cada cuota con su tipo y después se suman las cuotas y los totales.

## IVA e IRPF en una factura de autónomo

Incluir una caja breve después de los ejemplos, no antes. Debe explicar:

- El IVA se suma a la base.
- Una retención de IRPF, cuando corresponda, se resta del importe que paga el
  cliente.
- Ambos se calculan sobre la base imponible, pero no todas las facturas llevan
  retención ni debe asumirse una tasa sin revisar el caso.

Fórmula orientativa:

```txt
total a cobrar = base imponible + IVA - retención de IRPF aplicable
```

Puede usarse este ejemplo, etiquetado expresamente como ilustrativo:

```txt
Base:                 1.000,00 €
IVA 21%:                210,00 €
Retención IRPF 15%:    -150,00 €
Total a cobrar:        1.060,00 €
```

Añadir: “El 15% solo ilustra la operación. Confirma si tu actividad, cliente y
situación requieren retención y qué porcentaje corresponde”. No convertir esta
sección en una guía de retenciones ni atacar keywords de IRPF.

## Qué debe mostrar la factura

Explicar, apoyándose en la página oficial de contenido de facturas, que una
factura completa incluye, entre otros datos, la descripción de la operación, la
base imponible, el tipo o tipos aplicados y la cuota repercutida por separado.

Esta sección debe centrarse en cómo se presenta el cálculo:

```txt
Base imponible
× tipo de IVA
= cuota de IVA
Base + cuota
= total
```

No duplicar una guía completa sobre numeración, NIF, domicilio, factura
simplificada, factura rectificativa o software de facturación. Enlazar la fuente
oficial para esos requisitos.

## Base imponible y conceptos que pueden cambiarla

Añadir una explicación corta basada en la Agencia Tributaria:

- La base es, con carácter general, el importe total de la contraprestación.
- Comisiones, transporte, envases, seguros y otros gastos repercutidos pueden
  formar parte de ella.
- Determinados descuentos previos o simultáneos no forman parte de la base.
- Los suplidos que cumplen los requisitos reciben un tratamiento distinto.

No desarrollar casos complejos. El objetivo es advertir que “precio del
producto” y “base imponible final de la factura” no siempre son idénticos.

## Calcular una factura no es liquidar el trimestre

Incluir solo una distinción breve para autónomos y empresas:

```txt
resultado periódico simplificado = IVA repercutido - IVA soportado deducible
```

- IVA repercutido: el que se cobra en facturas emitidas.
- IVA soportado deducible: el de compras o gastos que cumple los requisitos para
  deducirse.

Aclarar que una sola factura no determina el resultado de la autoliquidación y
que pueden existir ajustes, regímenes y reglas adicionales. No afirmar que todo
IVA soportado es deducible ni que todos los contribuyentes presentan con la
misma periodicidad.

## Límites y casos que requieren verificación

Crear una sección corta titulada de forma práctica, por ejemplo
`## Cuándo no basta con multiplicar por 21%, 10% o 4%`.

Debe mencionar:

- Operaciones exentas, no sujetas o al 0%.
- Facturas con varios tipos.
- Operaciones intracomunitarias, exportaciones o inversión del sujeto pasivo.
- Recargo de equivalencia y otros regímenes especiales.
- Cambios temporales de tipo.
- Canarias, Ceuta y Melilla.

Precisar que el IVA español descrito se aplica en Península e Islas Baleares.
Canarias queda fuera de este ámbito y utiliza IGIC; en Ceuta y Melilla no se
aplica IVA y existe IPSI. La mención debe ser un límite, no una guía de esos
impuestos.

## Estructura recomendada

1. Respuesta corta y CTA a la calculadora, sin H2 previo.
2. `## Cómo calcular el IVA en España: fórmula rápida`
3. `## Tipos de IVA en España en 2026: 21%, 10% y 4%`
4. `## Cómo añadir IVA a un precio sin impuesto`
5. `## Cómo quitar el IVA de un precio que ya lo incluye`
6. `## Ejemplos de facturas con IVA al 21%, 10% y 4%`
7. `### Factura con dos tipos de IVA`
8. `## IVA e IRPF en una factura de autónomo`
9. `## Qué base, tipo y cuota debe mostrar una factura`
10. `## Calcular una factura no es liquidar el IVA trimestral`
11. `## Cuándo no basta con multiplicar por 21%, 10% o 4%`
12. `## Comprueba el resultado con la calculadora de IVA`
13. `## Preguntas frecuentes`
14. `## Fuentes oficiales y fecha de revisión`, si el componente de fuentes no
    cubre ya esta necesidad de forma visible.

La extensión esperada es aproximadamente de 1.600 a 2.200 palabras, solo si
cada sección aporta una respuesta útil. No rellenar hasta alcanzar una cifra.

## Enlaces internos

### Enlaces desde el artículo

- `/legal-impuestos/calculadora-de-iva`
  - Primer tercio: anchor “calculadora de IVA”.
  - Después de los ejemplos: anchor “comprobar base, IVA y total”.
- `/blog/legal-impuestos/como-desglosar-iva`
  - Desde la explicación del precio incluido: anchor “desglosar el IVA de un
    precio total”.
- `/blog/legal-impuestos/como-sumar-iva-a-un-precio`
  - Desde la fórmula directa: anchor “sumar IVA a un precio sin impuesto”.
- `/blog/legal-impuestos/iva-incluido-vs-sin-iva`
  - Desde la ambigüedad de `100 €`: anchor “diferencia entre IVA incluido y sin
    IVA”.
- `/blog/legal-impuestos/errores-comunes-al-calcular-iva`
  - Desde el error de restar 21%: anchor “errores al calcular IVA”.
- `/blog/legal-impuestos/tasas-de-iva-por-pais`
  - Solo en una nota de contexto internacional, no en la respuesta principal.

El artículo genérico `/blog/legal-impuestos/como-calcular-iva` puede enlazarse
una vez si ayuda al lector, pero no debe competir por la misma formulación. La
página española debe poseer las consultas con “España”, “21%, 10%, 4%” y
“2026”.

### Enlaces entrantes que conviene reforzar al publicar

Revisar que estas piezas enlacen contextualmente a la URL canónica con anchors
variados:

- `como-calcular-iva.md` → “tipos y ejemplos de IVA en España”.
- `tasas-de-iva-por-pais.md` → ya enlaza desde la fila de España; conservar.
- `errores-comunes-al-calcular-iva.md` → ya enlaza como “IVA en España”;
  conservar.
- La calculadora de IVA → incluir la guía española entre los recursos
  relacionados si la arquitectura admite artículos por país.

## CTA de la calculadora

La calculadora debe presentarse como verificador matemático:

> Introduce la base o el total, selecciona España y el tipo 21%, 10% o 4%. La
> calculadora muestra base imponible, cuota de IVA y precio final al instante.

No decir que la herramienta “garantiza una factura correcta”, “elige el tipo
correcto” o “sustituye a una gestoría”.

## FAQ sugeridas

Las respuestas deben ser directas, de 40 a 80 palabras cuando sea suficiente.
No crear preguntas solo para repetir el cuerpo.

1. `¿Cuánto es 100 € más el 21% de IVA?`
   - Si 100 € es la base: IVA 21 € y total 121 €.
2. `¿Cuánto IVA hay dentro de 100 € al 21%?`
   - Base 82,64 € e IVA 17,36 €, con redondeo a céntimos.
3. `¿Cómo quitar el 21% de IVA a un precio?`
   - Dividir entre 1,21, no restar 21% al total.
4. `¿Cuándo se aplica el IVA del 10% en España?`
   - Respuesta con ejemplos verificados y advertencia de clasificación.
5. `¿Cuándo se aplica el IVA del 4% en España?`
   - Respuesta con libros, medicamentos de uso humano y alimentos incluidos en
     la relación oficial, sin generalizar.
6. `¿Puede una factura tener varios tipos de IVA?`
   - Sí; separar bases y cuotas por tipo.
7. `¿El IVA se calcula antes o después del IRPF?`
   - Ambos parten de la base cuando la retención aplica; IVA suma e IRPF resta.
8. `¿Se aplica el mismo IVA en Canarias?`
   - No; el IVA de esta guía se refiere a Península y Baleares. Canarias utiliza
     IGIC.

No añadir marcado `FAQPage` únicamente para buscar un rich result. La prioridad
es que las preguntas visibles ayuden al lector.

## Reglas de redacción y precisión

- Español de España para moneda y ejemplos: `1.250,00 €`, `21%`, `IVA`.
- Usar frases cortas y lenguaje comprensible, definiendo cada término la primera
  vez.
- Mostrar primero el resultado y después el desarrollo.
- Mantener más precisión durante el cálculo y redondear la presentación a dos
  decimales; comprobar que `base + cuota = total` en cada tabla.
- Evitar el símbolo `$`, tasas de otros países y ejemplos con 16% o 19%.
- No copiar tablas completas de la Agencia Tributaria. Resumir y enlazar la
  fuente oficial.
- No usar ejemplos médicos, inmobiliarios o energéticos cuya clasificación
  dependa de requisitos complejos como ejemplo principal.
- No afirmar que el IVA cobrado es ingreso del autónomo.
- No afirmar que aplicar la fórmula vuelve fiscalmente válida una factura.
- No presentar la calculadora como asesoramiento fiscal o legal.
- Incluir una nota final: información educativa, normativa sujeta a cambios y
  recomendación de confirmar casos dudosos con la Agencia Tributaria o un
  profesional fiscal.

## Fuentes y correspondencia de afirmaciones

| Afirmación | Fuente primaria |
| --- | --- |
| Tipos 21%, 10%, 4% y existencia de 0% | Agencia Tributaria, “Tipos impositivos de IVA” |
| Productos y servicios de ejemplo en 2026 | PDF oficial “Tipos impositivos en el IVA 2026” |
| Tipo general y tipos reducidos en la ley | Ley 37/1992, artículos 90 y 91 |
| Conceptos que integran o no la base | Agencia Tributaria, “Cálculo de la base imponible” |
| Tipo y cuota separados en factura completa | Agencia Tributaria, “Contenido de las facturas” |
| Ámbito Península y Baleares; exclusión de Canarias, Ceuta y Melilla | Ley 37/1992, artículo 3, y manual de IVA de la Agencia Tributaria |

Antes de publicar, volver a abrir la página y el PDF de tipos 2026. Si la Agencia
Tributaria ha publicado una revisión posterior, actualizar ejemplos, nota de
vigencia, `updatedDate`, `accessedDate` y el texto visible.

## Riesgo de canibalización

| URL | Intención que debe poseer |
| --- | --- |
| `/blog/legal-impuestos/iva-espana` | España, tipos 21/10/4, ejemplos de factura, actualización 2026 |
| `/blog/legal-impuestos/como-calcular-iva` | Fórmula general independiente del país |
| `/blog/legal-impuestos/como-sumar-iva-a-un-precio` | Solo añadir IVA desde una base |
| `/blog/legal-impuestos/como-desglosar-iva` | Solo extraer IVA desde un total |
| `/blog/legal-impuestos/iva-incluido-vs-sin-iva` | Comparar conceptos y cotizaciones |
| `/legal-impuestos/calculadora-de-iva` | Obtener el resultado interactivo |

No crear otra pieza para `calcular IVA 21 España`. Esa intención se resuelve
dentro de esta guía y de la calculadora.

## Criterios de aceptación

### Respuesta e intención

- El primer bloque explica cómo añadir y cómo extraer IVA.
- El ejemplo de 100 € aparece antes del primer desarrollo largo.
- La página permite resolver una cifra sin leer contexto fiscal completo.
- El título visible coincide con `Calcular IVA España: Guía completa 2026`.

### Exactitud

- Los tipos y ejemplos de clasificación coinciden con la fuente oficial de 2026.
- Todas las operaciones numéricas se verifican con la lógica de la calculadora.
- Ninguna tabla confunde base, cuota y total.
- Se explica por qué no se resta 21% directamente de un total con IVA.
- Tasa 0%, exento y no sujeto no se usan como equivalentes.
- Se delimita Península y Baleares frente a Canarias, Ceuta y Melilla.

### Utilidad

- Hay ejemplos representativos al 21%, 10% y 4%.
- Hay un ejemplo con IVA incluido y otro con varios tipos.
- Se distingue IVA de IRPF y cálculo de factura de liquidación periódica.
- La CTA a la calculadora aparece al inicio y después de los ejemplos.
- La calculadora se describe como verificador aritmético, no como clasificador
  fiscal.

### SEO y confianza

- Se conserva la URL canónica existente.
- `seoTitle` y descripción responden la consulta sin keyword stuffing.
- Hay enlaces a fuentes oficiales visibles y metadatos `sources` completos.
- Se usa `updatedDate` con la fecha real de la actualización.
- No se inventan autor, revisor, facturas ni volumen de búsqueda.
- Los artículos vecinos mantienen una intención diferenciada y enlazan a esta
  guía cuando el contexto es España.

### Calidad técnica y editorial

- El frontmatter valida contra `src/lib/blog-schema.ts`.
- Todos los enlaces internos y externos resuelven correctamente.
- Las tablas se entienden en móvil y tienen encabezados descriptivos.
- No quedan cifras con formato monetario latinoamericano ni ejemplos de otros
  países.
- No se publica hasta revisar de nuevo la fuente oficial de tipos 2026.

## Medición posterior

Registrar una línea base en Search Console antes de la actualización y revisar a
las 8-12 semanas:

- Impresiones, clics, CTR y posición de la URL para consultas con “IVA España”,
  “IVA 21”, “IVA incluido”, “quitar IVA” y “factura”.
- Consultas nuevas que revelen dudas no resueltas.
- Clics desde el artículo hacia la calculadora.
- Uso de la calculadora después del clic.
- Canibalización entre la guía española, la guía genérica y la calculadora.

Si la calculadora aparece para la consulta transaccional y el artículo para la
consulta explicativa, tratarlo como una distribución válida siempre que ambas
URLs se enlacen y no intercambien posiciones de forma inestable.
