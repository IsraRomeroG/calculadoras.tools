# 05 - Medición, QA y release

## Baseline antes del cambio

Antes de publicar, guardar una exportación de Search Console con:

- rango de fechas explícito;
- página exacta como filtro;
- tipo de búsqueda, manteniendo el mismo en las comparaciones;
- consultas, clics, impresiones, CTR y posición;
- dispositivo y país separados;
- apariencia en Search, si está disponible.

Conservar también el CSV original como baseline histórico. No comparar un
periodo posterior con el CSV sin conocer sus fechas.

Guardar el total de la página por separado del total de consultas exportadas.
Aplicar las reglas reproducibles de la spec 01 y congelar la lista de consultas
del baseline. Registrar los valores anteriores de title/description y los
segmentos prioritarios según las impresiones observadas.

## QA de contenido y SEO

```text
[ ] La URL canónica no cambió.
[ ] El title contiene la promesa real de la página.
[ ] La description menciona días, semanas, meses y hábiles de lunes a viernes; indica que no descuenta festivos.
[ ] Existe una introducción visible antes de la herramienta.
[ ] H1 único y descriptivo.
[ ] Hay secciones estáticas sobre días, semanas, meses, años y años bisiestos.
[ ] La cobertura visible corresponde a la matriz de intenciones prioritarias de la spec 01.
[ ] La fórmula y los ejemplos fueron comprobados con la lógica real.
[ ] El texto distingue total estándar/inclusivo, semanas y desglose de calendario.
[ ] La FAQ nueva sobre fines de semana es visible.
[ ] Si se conserva FAQ JSON-LD, coincide con la FAQ visible y su estructura es válida.
[ ] Los enlaces relacionados resuelven a rutas 200 publicadas.
[ ] No hay keywords repetidas de forma artificial.
```

## QA funcional

```text
[ ] Dos fechas iguales producen cero en conteo estándar.
[ ] El conteo inclusivo aplica la regla documentada.
[ ] 1 enero → 2 enero produce 1 estándar y 2 inclusivo.
[ ] 28 febrero 2024 → 1 marzo 2024 produce 2 estándar y 3 inclusivo.
[ ] 15 enero 2026 → 30 septiembre 2026 produce 258 estándar y 259 inclusivo.
[ ] Las semanas se derivan del total seleccionado: 36+6 estándar y 37+0 inclusivo.
[ ] El desglose de calendario se etiqueta como “conteo estándar” si no cambia con inclusión.
[ ] Las fechas invertidas muestran dirección y resultado coherentes.
[ ] 11–14 septiembre 2026, en ambos órdenes: 3 naturales/1 hábil/2 de fin de semana estándar; 4/2/2 inclusivo.
[ ] Fechas iguales inclusivas: 1 natural; 1 hábil si es lunes a viernes, o 1 de fin de semana si es sábado/domingo.
[ ] Hábiles más fines de semana coincide con el total natural en ambos conteos.
[ ] Seleccionar hábiles cambia el resultado principal, pero las semanas siguen siendo naturales y están etiquetadas.
[ ] Sumar/restar días conserva el resultado existente.
[ ] Sumar/restar días hábiles excluye sábado y domingo.
[ ] La interfaz deja claro que no descuenta festivos.
[ ] Sumar un mes desde 31 enero ajusta al último día válido del mes destino.
[ ] El modo Hasta evento conserva etiqueta y conteo.
[ ] Errores de fecha imposible y año fuera de rango siguen funcionando.
[ ] Copiar resultado conserva etiquetas de conteo, desglose estándar y limitaciones, también en Hasta evento.
[ ] Los errores tienen `id`, `aria-describedby` y foco predecible.
[ ] La live region anuncia solo un resultado válido estable, no cada pulsación.
[ ] No se envían fechas al servidor ni a la analítica.
```

## QA de medición

Aplicar cuando el mecanismo existente permita instrumentar estas métricas;
en caso contrario, documentar la limitación según la spec 03.

Estado de implementación: la página emite únicamente metadatos aprobados
mediante el `dataLayer` opcional y el evento interno
`calculadoras:calculator-metric`. El hook no envía fechas, resultados,
cantidades, etiquetas del usuario ni hashes. Si no existe un receptor de
analítica en el despliegue, las métricas de sesiones convertidas, abandono y
atribución no pueden calcularse hasta conectar un mecanismo aprobado; no se
introduce un proveedor nuevo para esta página.

```text
[ ] Inicializar, actualizar Hoy automáticamente o usar el ejemplo no registra conversión.
[ ] Un resultado válido estable durante 1 segundo tras editar registra un solo evento.
[ ] Input/change del mismo estado no duplica el evento; una nueva edición cancela el temporizador anterior.
[ ] Varios cálculos en una sesión cuentan como una sola sesión convertida.
[ ] Los errores se deduplican por episodio y código; no se cuenta el formulario vacío inicial.
[ ] El modo add no envía valores de controles ocultos de otros modos.
[ ] No se transmiten fechas, resultados, cantidades, etiquetas introducidas por el usuario ni hashes de esos valores.
[ ] La tasa usa sesiones medidas de esta página como denominador y conserva el mismo filtro de tráfico.
```

## QA responsive y accesibilidad

```text
[ ] La herramienta es usable con una mano en móvil.
[ ] Los controles de fecha no provocan scroll horizontal.
[ ] Labels, foco, errores y live region se comportan con teclado.
[ ] Los tres modos funcionan en móvil y escritorio.
[ ] El resultado no causa salto de layout.
[ ] El contenido editorial no queda oculto detrás de JavaScript.
[ ] El anuncio no bloquea ni desplaza de forma inesperada la calculadora.
```

## Validaciones técnicas

Ejecutar las pruebas unitarias existentes o ampliadas según las reglas del
repositorio, preferentemente con `npm.cmd run test:unit:run`. No ejecutar
`npm run dev` ni `npm run build` durante el trabajo local salvo petición
explícita; el pipeline de CI/deploy debe encargarse de la compilación.

Validar manualmente el HTML desplegado con:

- URL Inspection de Search Console;
- Rich Results Test para BreadcrumbList, si se incorpora; no exigir FAQ;
- comprobación del sitemap;
- comprobación de canonical y alternates;
- prueba móvil y Core Web Vitals.

## Release

1. Publicar el conjunto P0 coherente: metadata, contenido, etiquetas de
   resultados y enlaces. El control de fecha P1 y el schema opcional no
   bloquean este release; si se publican después, registrar cada cambio.
2. Confirmar que la URL canónica responde 200.
3. Confirmar que la página EN no perdió reciprocidad.
4. Solicitar recrawl de la URL en Search Console.
5. Anotar fecha, commit y cambios de title/description.
6. No volver a cambiar metadata durante los primeros días salvo error claro.

Los 28–42 días son puntos de revisión, no un plazo automático de rollback ni
una garantía de efecto SEO. Corregir de inmediato errores verificables de
indexación, canonical, contenido o funcionamiento. Una caída de clics o
posición exige diagnóstico antes de revertir metadata.

Al publicar varios cambios juntos, evaluar el efecto del conjunto; no atribuir
la variación al título por sí solo. Si se quiere evaluar una variante de
metadata posteriormente, registrar la hipótesis, modificar solo esa variante
y mantener estables los demás elementos durante la observación. Incluso así,
la comparación temporal es orientativa, no una prueba causal controlada.

## Seguimiento

Revisar a los 14, 28 y 42 días después del recrawl:

- clics e impresiones totales;
- CTR de “diferencia entre fechas” y “diferencia de fechas”;
- posiciones de clusters de días, meses y semanas;
- consultas nuevas;
- tasa de sesiones con cálculo válido y modos utilizados, según la spec 03;
- errores de rastreo, schema o canonical.

### Comparación y decisiones

- Comparar ventanas de igual duración y distribución de días de la semana:
  inicialmente 28 días completos anteriores al release frente a 28 días
  completos posteriores al recrawl confirmado. Excluir días de datos parciales
  y dejar registrado el intervalo de transición entre publicación y rastreo.
- Comparar la lista fija de consultas del baseline con iguales filtros de
  página, tipo de búsqueda, país y dispositivo. Informar consultas nuevas
  aparte, sin mezclarlas con la evolución del conjunto inicial.
- Registrar cambios de demanda, estacionalidad, actualizaciones de Google,
  cambios visibles en la SERP y otros releases del sitio. Cuando existan,
  usar páginas comparables sin cambios como referencia contextual.
- Informar clics e impresiones junto a CTR y posición: con 56 clics históricos
  y periodo desconocido no hay base para un umbral fiable de éxito. Si los
  segmentos tienen poco volumen, ampliar la observación y marcar el resultado
  como inconcluso; no forzar una decisión a los 42 días.
- Considerar una reversión de metadata solo tras documentar una caída
  sostenida en ventanas comparables, revisar factores externos y confirmar
  que la variante anterior sigue describiendo fielmente la herramienta.
  Registrar la hipótesis y medir después; no presentarla como causa probada.

Interpretación orientativa, sujeta a las comparaciones anteriores:

- Impresiones y posiciones comparables + CTR mayor: compatible con una
  mejora de snippet/promesa; verificar el título realmente mostrado.
- Impresiones mayores + posiciones mejores en consultas fijas: compatible
  con mejora de visibilidad; revisar también cambios de demanda y SERP.
- Posición estable + CTR bajo: revisar title, description y propuesta visible.
- Clics mayores + menor tasa de sesiones con cálculo válido: revisar primero
  instrumentación y composición del tráfico, después UX, velocidad y claridad.

El criterio de progreso es mejorar clics y posiciones de las consultas
prioritarias en segmentos comparables, sin deterioro sostenido del núcleo
“diferencia de fechas”/“diferencia entre fechas”. Reportar CTR y conversión
como métricas separadas: su mejora no demuestra por sí sola una mejora de
ranking. Registrar cada revisión como favorable, desfavorable o inconclusa,
con datos, limitaciones y siguiente acción.

No iniciar una expansión a nuevas URLs hasta tener esta lectura posterior y
comprobar que la página pilar no puede cubrir de forma útil la consulta.
