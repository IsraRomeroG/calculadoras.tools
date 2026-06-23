# Spec 05 - Estándar de calculadoras y artículos YMYL

## Objetivo

Elevar la utilidad real de calculadoras y artículos, especialmente en salud,
finanzas, inmuebles, impuestos y cualquier tema que pueda afectar decisiones
económicas, médicas, fiscales o legales.

## Alcance

Calculadoras:

- `src/pages/salud/**`
- `src/pages/finanzas/**`
- `src/pages/inmuebles/**`
- `src/pages/legal-impuestos/**`
- Calculadoras de otras categorías con impacto práctico sensible.

Artículos:

- `src/content/blog/salud/**`
- `src/content/blog/finanzas/**`
- `src/content/blog/inmuebles/**`
- `src/content/blog/legal-impuestos/**`

Plantillas y componentes:

- `src/pages/blog/[category]/[slug].astro`
- Componentes compartidos de calculadoras, si se crean para fuentes, avisos o
  metodología.

## Estándar para calculadoras

Cada calculadora indexable debe incluir, cuando aplique:

- Qué calcula.
- Qué datos de entrada necesita.
- Fórmula o método.
- Ejemplo desarrollado.
- Interpretación del resultado.
- Supuestos.
- Limitaciones.
- Fuentes.
- Fecha de revisión.
- Herramientas y guías relacionadas.

## Checklist por calculadora

Para cada calculadora revisada, documentar:

| Campo | Requisito |
| --- | --- |
| Valor principal | La herramienta resuelve una tarea sin depender de otra página |
| Fórmula | Variables definidas y ejemplo numérico |
| Entradas | Unidades, rangos válidos y errores comunes |
| Resultado | Explicación de qué significa y qué no significa |
| Límites | Casos donde no aplica o requiere profesional |
| Fuentes | Primarias cuando hay salud, impuestos, finanzas o normativas |
| Fecha | Fecha de revisión real visible o documentada |
| Enlaces | Siguientes pasos útiles, no solo CTA genérico |
| Ads | Máximo un anuncio hasta completar revisión |

## Calculadoras sensibles prioritarias

### Salud

Priorizar:

- `/salud/calculadora-de-imc`
- `/salud/calculadora-de-calorias-diarias-tdee`
- `/salud/calculadora-deficit-calorico`
- `/salud/calculadora-de-macros`
- `/salud/calculadora-de-proteina-diaria`
- `/salud/calculadora-de-agua-diaria`
- `/salud/calculadora-de-ovulacion`
- `/salud/fecha-probable-de-parto`
- `/salud/calculadora-de-porcentaje-de-grasa-corporal`
- `/salud/calculadora-de-frecuencia-cardiaca-maxima`
- `/salud/calculadora-de-zonas-de-frecuencia-cardiaca`

Avisos mínimos:

- No sustituye criterio médico.
- No usar como diagnóstico.
- Consultar profesional ante síntomas, embarazo, enfermedad, medicación,
  menores o antecedentes relevantes.

### Finanzas e inmuebles

Priorizar:

- `/finanzas/calculadora-de-prestamo`
- `/finanzas/plan-de-pago-de-deudas`
- `/finanzas/calculadora-de-interes-compuesto`
- `/finanzas/calculadora-dca-costo-promedio`
- `/finanzas/calculadora-de-roi`
- `/inmuebles/calculadora-de-hipoteca`

Avisos mínimos:

- Resultados estimativos.
- Tasas, comisiones, seguros, impuestos y condiciones cambian.
- No es asesoría financiera.
- Confirmar con institución o fuente oficial.

### Legal e impuestos

Priorizar:

- `/legal-impuestos/calculadora-de-iva`

Avisos mínimos:

- Tasas dependen de país, producto, fecha y régimen.
- Confirmar con autoridad fiscal.
- No es asesoría fiscal o legal.

## Estándar para artículos

Cada artículo debe:

- Responder la pregunta principal en el primer bloque.
- Aportar algo distinto a la calculadora.
- Incluir ejemplos propios y verificables.
- Explicar límites y errores de interpretación.
- Enlazar fuentes primarias cuando el tema lo requiera.
- Tener enlaces internos útiles.
- Evitar FAQ creada solo para aumentar longitud.

## Revisión de artículos cortos

El plan base detectó piezas de aproximadamente 180 a 326 palabras. No se debe
usar una cantidad de palabras como métrica única, pero todo artículo con bajo
contenido original debe clasificarse:

| Decisión | Cuándo aplica |
| --- | --- |
| Ampliar | La intención es válida pero faltan ejemplos, fuentes o límites |
| Fusionar | Repite una respuesta que otra URL puede cubrir mejor |
| Retirar | No aporta intención propia ni se justifica conservarla |
| Mantener | Resuelve bien la tarea aunque sea breve |

Buscar candidatos por conteo aproximado y revisión manual, no por automatismo.

## Política de fuentes

Priorizar:

1. Organismos públicos y reguladores.
2. Documentación técnica original.
3. Instituciones académicas o profesionales reconocidas.
4. Publicaciones de referencia con autores y metodología.

Evitar como respaldo principal:

- Otros sitios de calculadoras.
- Blogs anónimos.
- Fragmentos de resultados de búsqueda.
- Contenido generado sin fuentes.

## Fuentes base sugeridas por tema

### Salud

- OMS o autoridades sanitarias nacionales.
- CDC, NIH, NIDDK, ACOG u organismos equivalentes según tema.
- Artículos o revisiones científicas para fórmulas específicas.
- Guías clínicas solo cuando se expliquen con prudencia y sin prescribir.

### Finanzas e inmuebles

- Bancos centrales, reguladores financieros y organismos públicos.
- Instituciones que publican definiciones oficiales de CAT, tasas, inflación o
  crédito.
- Documentación de fórmulas financieras cuando el tema es matemático.

### Impuestos

- Autoridades fiscales oficiales por país.
- Páginas de tasas y normativa actualizadas.
- Fecha de revisión obligatoria si se menciona tasa vigente.

## Ads durante la revisión

Hasta que una calculadora o artículo cumpla esta spec:

- Artículos: máximo un anuncio.
- Calculadoras: máximo un anuncio.
- Sin anuncios adicionales antes de fuentes, límites o explicación principal.

Una página sensible no debe usar densidad publicitaria alta solo porque recibe
tráfico.

## Criterios de aceptación

- No quedan artículos YMYL sin fuentes externas fiables.
- Cada calculadora sensible declara límites explícitos.
- Cada calculadora sensible explica método o fórmula.
- Los resultados se pueden entender sin depender de otra página.
- Los artículos responden la pregunta principal al inicio.
- Las fuentes respaldan las afirmaciones concretas de la pieza.
- No hay FAQs infladas ni secciones redundantes usadas como relleno.
- La publicidad queda limitada hasta completar revisión.

## Pruebas y validación

- Revisión manual de una muestra inicial de 20 URLs sensibles.
- Búsqueda de artículos YMYL sin `sources` cuando la spec 04 esté implementada.
- Revisión de enlaces externos rotos.
- Prueba de componentes si se crea un bloque reutilizable de fuentes o avisos.
- Comparación de resultados de calculadoras con ejemplos escritos.

## Riesgos y mitigaciones

Riesgo: convertir cada página en texto largo pero poco útil.

Mitigación: exigir fórmula, ejemplo, límites y fuentes, no extensión mínima.

Riesgo: fuentes no respaldan la afirmación específica.

Mitigación: revisar fuente por afirmación sensible.

Riesgo: mezclar educación con consejo profesional.

Mitigación: usar lenguaje de estimación, supuestos y consulta profesional.
