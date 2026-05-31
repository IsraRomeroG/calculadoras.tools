# Especificación — Calculadora de Ovulación

## Objetivo
Herramienta para estimar la ventana fértil, la fecha probable de ovulación
y el momento recomendado para hacer un test de embarazo, con un enfoque
útil, empático y clínicamente prudente.

La calculadora debe ayudar a personas que:

- Buscan concebir y quieren identificar sus días con mayor probabilidad.
- Quieren conocer mejor su ciclo menstrual.
- Tienen ciclos variables y necesitan una estimación por rangos.

La calculadora **no debe presentarse como método anticonceptivo**, no
garantiza embarazo y no diagnostica problemas de fertilidad.

---

## Ruta e integración en el sitio

La calculadora debe vivir en la categoría Salud.

| Elemento | Valor |
|----------|-------|
| Archivo Astro | `src/pages/salud/calculadora-de-ovulacion.astro` |
| URL canónica | `/salud/calculadora-de-ovulacion` |
| Categoría | `salud` |
| Registro | `src/lib/constants/calculators.ts` |
| ID sugerido | `calculadora-de-ovulacion` |
| Orden sugerido | `58`, después de fecha probable de parto o inmediatamente antes si se quiere ordenar por recorrido de usuaria |

La spec anterior sugería `/calculadora-ovulacion` como URL principal. Esa
ruta puede usarse en el futuro como redirección SEO, pero la canónica del
producto debe seguir el patrón actual del repo: `/salud/...`.

---

## Alcance por fases

### MVP recomendado

1. Cálculo estándar por FUM y duración del ciclo.
2. Modo de ciclo irregular por historial de inicios de menstruación o por
   rango corto/largo.
3. Resultado con nivel de confianza: alto, medio o bajo.
4. Calendario visual del ciclo con leyenda accesible.
5. Indicador de "dónde estás hoy" dentro del ciclo.
6. Orientación sobre cuándo hacer test de embarazo.
7. Guardado local opcional con botón explícito y opción de borrar datos.
8. Copiar resumen del resultado.
9. Avisos médicos y de uso responsable siempre visibles.

### Fase 2

1. Proyección de 3 a 6 ciclos.
2. Registro avanzado de hasta 12 ciclos.
3. Tendencia de ciclos que se alargan o acortan.
4. Exportar a calendario.
5. Compartir por WhatsApp, con texto neutral y privacidad clara.
6. Guías extendidas sobre test LH, temperatura basal y moco cervical.

---

## Principios de producto

### Qué debe aportar valor

La calculadora no debe limitarse a decir "ovulas tal día". Debe responder:

- Cuál es mi ventana fértil estimada.
- Qué días tienen mayor probabilidad relativa.
- Qué tan confiable es esta estimación.
- Qué significa si mi ciclo es irregular.
- Qué puedo observar para confirmar mejor la ovulación.
- Cuándo tiene más sentido hacer un test de embarazo.
- Cuándo conviene consultar con un profesional.

### Tono

Usar un tono claro, cálido y cuidadoso. Fertilidad puede ser un tema
emocionalmente cargado para muchas personas.

Usar:

- "ventana fértil estimada"
- "días con mayor probabilidad"
- "puede ayudarte a orientar"
- "si estás intentando concebir"
- "consulta con tu ginecólogo, matrona o especialista si tienes dudas"

Evitar:

- Prometer embarazo.
- Decir "día exacto" sin matices.
- Culpar a la usuaria si no consigue embarazo.
- Presentar porcentajes como predicciones personales.
- Dar indicaciones médicas individualizadas.
- Sugerir que sirve para evitar embarazo sin otro método.

---

## Avisos responsables obligatorios

### Aviso principal

> Esta calculadora ofrece una estimación basada en promedios del ciclo
> menstrual. La ovulación puede variar de un ciclo a otro, incluso en ciclos
> regulares. No reemplaza una valoración médica y no debe usarse como método
> anticonceptivo.

### Si la persona selecciona "evitar embarazo"

Si se incluye un campo de intención y la persona elige "evitar embarazo",
mostrar un aviso prominente:

> Esta herramienta no es un método anticonceptivo. Si quieres evitar un
> embarazo, usa un método anticonceptivo confiable y consulta con un
> profesional de salud para elegir el más adecuado para ti.

No bloquear el cálculo, pero sí evitar cualquier texto que pueda sonar a
garantía de seguridad anticonceptiva.

### Cuándo consultar

Mostrar una nota contextual, especialmente en ciclos irregulares:

> Si llevas 12 meses intentando concebir sin embarazo, o 6 meses si tienes
> 35 años o más, considera consultar con un especialista en fertilidad. Si
> tienes más de 40 años, ciclos muy irregulares, ausencia de menstruación,
> sangrados inusuales, dolor pélvico importante, endometriosis conocida o
> pérdidas gestacionales repetidas, conviene consultar antes.

---

## Conceptos base

### Ciclo menstrual

El ciclo menstrual se mide desde el primer día de sangrado menstrual hasta
el día anterior al inicio de la siguiente menstruación.

En adultos, los ciclos de 21 a 35 días suelen considerarse dentro de un
rango habitual. La herramienta puede permitir ciclos de 21 a 45 días para
estimar casos más largos, pero debe mostrar advertencias cuando el ciclo
esté fuera del rango 21 a 35.

### Ovulación

- La ovulación ocurre aproximadamente 12 a 14 días antes del inicio de la
  siguiente menstruación.
- La fase lútea suele ser más estable que la fase folicular.
- El valor por defecto de fase lútea será 14 días.
- El rango avanzado permitido para fase lútea será 12 a 16 días.
- Si se permite 10 a 16 días, 10 u 11 deben generar advertencia discreta.

### Ventana fértil

La ventana fértil principal debe mostrarse como:

- Los 5 días antes de la ovulación estimada.
- El día de la ovulación estimada.

El día posterior a la ovulación puede mostrarse como **margen de observación
por incertidumbre del cálculo**, no como pico fértil principal. Esto evita
convertir un margen útil en una promesa clínica.

### Viabilidad

- Los espermatozoides pueden sobrevivir hasta 5 días en condiciones fértiles.
- El óvulo suele ser viable unas 12 a 24 horas tras la ovulación.
- La ovulación real puede moverse por estrés, enfermedad, sueño, cambios de
  peso, lactancia, medicamentos, anticonceptivos hormonales recientes,
  síndrome de ovario poliquístico, perimenopausia u otros factores.

---

## Modelo de cálculo

### Fechas civiles

Usar fechas civiles, no instantes UTC. Para evitar errores por zona horaria:

- Preferir `Temporal.PlainDate` si el proyecto lo soporta.
- Si se usa `Date`, construir fechas al mediodía local o usar helpers
  consistentes tipo `date-fns`.
- No calcular con strings ambiguos `MM/DD/YYYY`.
- Mostrar fechas en español, base `es-MX`.

### Cálculo estándar

Inputs:

- Fecha de inicio de la última menstruación (FUM).
- Duración habitual del ciclo.
- Duración de la menstruación.
- Fase lútea opcional avanzada, por defecto 14 días.

Fórmulas:

```text
proxima_menstruacion = FUM + duracion_ciclo
ovulacion_estimada = proxima_menstruacion - fase_lutea
ventana_fertil_inicio = ovulacion_estimada - 5 dias
ventana_fertil_fin = ovulacion_estimada
margen_observacion_fin = ovulacion_estimada + 1 dia
```

Importante para implementación:

Si FUM es el día 1 del ciclo, la etiqueta "día del ciclo" se calcula como:

```text
dia_del_ciclo = diferencia_en_dias(fecha, FUM) + 1
```

Ejemplo: FUM 1 de abril, ciclo de 28 días, fase lútea de 14 días:

- Próxima menstruación estimada: 29 de abril.
- Ovulación estimada: 15 de abril.
- Esa fecha cae en el día 15 del ciclo si se cuenta FUM como día 1.

No mezclar "FUM + 14 días" con la etiqueta "día 14" sin revisar este
desfase. En contenido educativo puede decirse "alrededor de la mitad del
ciclo", pero el calendario debe ser consistente.

---

## Modos de cálculo

### Modo 1 — Cálculo estándar

Caso:

> La persona conoce el primer día de su última menstruación y su ciclo suele
> tener una duración parecida.

Inputs:

| Campo | Tipo | Rango | Defecto |
|-------|------|-------|---------|
| FUM | Date picker | No futura; idealmente última menstruación real | Sin defecto |
| Duración del ciclo | Slider + número | 21 a 45 días | 28 |
| Duración menstruación | Número | 2 a 10 días | 5 |
| Fase lútea avanzada | Número | 12 a 16 días | 14 |
| Intención | Selector opcional | Concebir / conocer ciclo / evitar embarazo | Concebir |

Output principal:

- Ventana fértil estimada: 10 al 15 de abril de 2026.
- Ovulación estimada: miércoles, 15 de abril de 2026.
- Días de mayor probabilidad relativa: 13 al 15 de abril de 2026.
- Margen de observación: 16 de abril de 2026.
- Próxima menstruación estimada: miércoles, 29 de abril de 2026.
- Confianza del cálculo: media.

Mensaje:

> Esta estimación asume una fase lútea de 14 días y un ciclo de 28 días.
> La ovulación real puede variar algunos días.

Desglose sugerido:

| Relación con ovulación | Fecha | Nivel | Mensaje |
|------------------------|-------|-------|---------|
| O - 5 | 10 abr | Baja-media | Inicio de ventana fértil estimada |
| O - 4 | 11 abr | Media | Fertilidad creciente |
| O - 3 | 12 abr | Media-alta | Buen momento para intentar concebir |
| O - 2 | 13 abr | Alta | Uno de los días con mayor probabilidad |
| O - 1 | 14 abr | Muy alta | Pico previo probable |
| O | 15 abr | Muy alta | Ovulación estimada |
| O + 1 | 16 abr | Margen bajo | Margen por incertidumbre, no pico principal |

### Modo 2 — Ciclo irregular por historial

Caso:

> La persona tiene ciclos variables y puede ingresar fechas de inicio de
> menstruación anteriores.

Inputs MVP:

- FUM actual.
- Fechas de inicio de 3 a 6 menstruaciones anteriores.
- Duración de menstruación opcional.

Procesamiento:

- Ordenar fechas de inicio.
- Calcular duración de cada ciclo como diferencia entre inicios consecutivos.
- Calcular mínimo, máximo, promedio y variabilidad.
- Si hay menos de 3 ciclos, mostrar confianza baja o pedir más datos.

Fórmulas:

```text
ciclo_corto = minimo(ciclos_registrados)
ciclo_largo = maximo(ciclos_registrados)
ovulacion_temprana = FUM + ciclo_corto - fase_lutea
ovulacion_tardia = FUM + ciclo_largo - fase_lutea
ventana_fertil_inicio = ovulacion_temprana - 5 dias
ventana_fertil_fin = ovulacion_tardia
margen_observacion_fin = ovulacion_tardia + 1 dia
```

Output:

- Ventana fértil estimada: 7 al 19 de abril de 2026.
- Margen de observación: hasta el 20 de abril de 2026.
- Ovulación estimada entre: 12 y 19 de abril de 2026.
- Ciclo promedio: 29.3 días.
- Variabilidad: ±2 días.
- Confianza del cálculo: baja/media/alta según datos.

Mensaje:

> Con ciclos variables, la ventana fértil se amplía porque la ovulación es
> menos predecible. Los test de ovulación (LH), el moco cervical y la
> temperatura basal pueden ayudarte a confirmar mejor el momento.

### Modo 3 — Ciclo irregular por rango corto/largo

Caso:

> La persona no quiere ingresar fechas, pero conoce el ciclo más corto y el
> más largo de los últimos meses.

Inputs:

| Campo | Tipo | Rango |
|-------|------|-------|
| FUM | Date picker | No futura |
| Ciclo más corto | Número | 21 a 44 |
| Ciclo más largo | Número | 22 a 45 |

Reglas:

- Si ciclo corto y ciclo largo son iguales, tratar como ciclo regular.
- Si ciclo corto > ciclo largo, mostrar error.
- Si la diferencia entre corto y largo es mayor a 7 días, confianza baja.

### Modo 4 — Por ovulación detectada

Caso:

> La persona ya detectó ovulación con test LH, temperatura basal, moco
> cervical o seguimiento clínico.

Inputs:

- Fecha de ovulación detectada.
- Fuente: test LH, temperatura basal, moco cervical, ecografía, otra.
- Duración de fase lútea habitual, por defecto 14 días.

Output:

- Próxima menstruación estimada.
- Cuándo hacer test de embarazo.
- Cuántos días post ovulación han pasado hoy.
- Nivel de confianza según fuente:
  - Ecografía o seguimiento clínico: alta.
  - Temperatura basal confirmada: media-alta.
  - Test LH: media, porque anticipa ovulación pero no la confirma por sí solo.
  - Moco cervical: media/baja según regularidad.

---

## Nivel de confianza

Mostrar siempre una etiqueta de confianza junto al resultado.

### Alta

Condiciones sugeridas:

- Hay al menos 3 ciclos registrados.
- Variabilidad de ciclos menor o igual a 3 días.
- Ciclos dentro de 21 a 35 días.
- FUM reciente y coherente con el ciclo declarado.

Mensaje:

> Buena estimación si tus ciclos recientes siguen este patrón. Aun así, la
> ovulación puede moverse algunos días.

### Media

Condiciones sugeridas:

- La persona solo declaró una duración habitual.
- No hay historial suficiente.
- Variabilidad de 4 a 7 días.
- Ciclo entre 21 y 35 días, pero sin confirmación.

Mensaje:

> Estimación orientativa. Puedes mejorar la precisión registrando varios
> ciclos o usando test LH y señales físicas.

### Baja

Condiciones sugeridas:

- Ciclo menor a 21 o mayor a 35 días.
- Diferencia entre ciclo corto y largo mayor a 7 días.
- FUM muy antigua o incoherente.
- Menstruaciones ausentes o muy espaciadas.
- Datos incompletos o contradictorios.

Mensaje:

> Con estos datos la ovulación es menos predecible. Usa este resultado como
> rango amplio y considera consultar si tus ciclos son muy irregulares o si
> estás intentando concebir desde hace varios meses.

---

## Indicador de dónde estás hoy

Si la fecha actual cae dentro del ciclo estimado, mostrar:

```text
Hoy estás en el día 25 de tu ciclo estimado.
Fase probable: fase lútea.
Fertilidad estimada: baja.
Próxima menstruación estimada: en 3 días.
```

Si hoy ya pasó la próxima menstruación estimada:

```text
Tu menstruación estimada era el 29 de abril.
Si tu ciclo suele ser regular y aún no ha llegado, puede ser buen momento
para hacer un test de embarazo. Si el test es negativo y la menstruación no
llega, repite en unos días o consulta con un profesional.
```

Si la FUM guardada es antigua:

```text
Los datos guardados parecen pertenecer a un ciclo anterior. Actualiza la
fecha de tu última menstruación para recalcular.
```

---

## Calendario visual

Debe representar el ciclo menstrual completo y, si hay modo irregular, el
rango de fechas estimado.

### Leyenda

No depender solo de color. Cada tipo de día debe tener color, texto y
atributo accesible.

| Tipo | Visual | Etiqueta accesible |
|------|--------|--------------------|
| Menstruación | Rojo suave | Día de menstruación estimada |
| Ventana fértil principal | Verde | Ventana fértil estimada |
| Ovulación estimada | Marca destacada | Ovulación estimada |
| Margen de observación | Verde tenue o punteado | Margen por incertidumbre |
| Baja fertilidad estimada | Gris | Fertilidad estimada baja |
| Hoy | Borde o anillo | Hoy |

### Interacción

- Tooltip o panel al seleccionar un día.
- Soporte teclado para moverse entre días.
- `aria-label` con fecha, fase y nivel.
- No usar solo emojis como información.
- Mantener dimensiones estables para evitar saltos de layout.

---

## Probabilidad de concepción por día

Esta sección puede ser diferencial, pero debe presentarse con mucho cuidado.

Recomendación de UI:

- Usar "probabilidad relativa estimada" o "referencia poblacional".
- Mostrar barras o niveles, no solo porcentajes exactos.
- Aclarar que no predice la probabilidad individual de una persona o pareja.

Tabla orientativa basada en Wilcox et al.:

| Relación con ovulación | Referencia aproximada | Nivel UI |
|------------------------|-----------------------|----------|
| 5 días antes | ~10% | Baja-media |
| 4 días antes | ~14% | Media |
| 3 días antes | ~16% | Media |
| 2 días antes | ~27% | Alta |
| 1 día antes | ~31% | Muy alta |
| Día de ovulación | ~33% | Muy alta |
| 1 día después | Muy baja / margen | No pico principal |
| 2+ días después | Cercana a cero | Baja |

Nota obligatoria:

> Estos porcentajes son referencias de estudios poblacionales y no una
> predicción personal. La probabilidad real depende de edad, salud, semen,
> frecuencia de relaciones, momento real de ovulación y otros factores.

No sumar los porcentajes. No presentarlos como "probabilidad del ciclo" para
la usuaria.

---

## Cuándo hacer test de embarazo

Basar la orientación en la ovulación estimada y en la próxima menstruación
estimada.

Output recomendado:

- Primer día de retraso estimado: 29 de abril de 2026.
- Momento más fiable para test casero: desde el primer día de retraso.
- Test sensible: puede detectar antes, alrededor de 10 a 12 días post
  ovulación, pero un negativo temprano no descarta embarazo.
- Si no sabes cuándo debía llegar tu menstruación: hacer test al menos 21
  días después de la relación sexual sin protección.

Mensaje:

> Si haces el test antes del retraso y sale negativo, puede ser demasiado
> pronto. Repite en unos días si la menstruación no llega.

Sobre primera orina:

> La primera orina de la mañana puede ayudar en pruebas tempranas porque
> suele estar más concentrada. Después del primer día de retraso, muchos tests
> pueden usarse a cualquier hora si sigues las instrucciones del fabricante.

---

## Guardado local y privacidad

El guardado debe ser explícito, no automático.

### Datos guardables

- FUM.
- Duración habitual del ciclo.
- Duración de menstruación.
- Fechas históricas de inicio de menstruación si la persona las agrega.
- Preferencia de modo.

### UI requerida

- Botón: "Guardar en este dispositivo".
- Botón: "Borrar datos guardados".
- Texto visible:

> Tus datos se guardan solo en este navegador mediante almacenamiento local.
> No se crea cuenta y no se envían a un servidor.

### Reglas

- No guardar datos hasta que la usuaria lo pida.
- Al cargar datos antiguos, detectar si la FUM parece pertenecer a un ciclo
  pasado y pedir actualización.
- No incluir datos sensibles en URLs compartidas.

---

## Compartir y copiar

### MVP

Botón "Copiar resumen" con texto plano:

```text
Mi ventana fértil estimada: 10 al 15 de abril de 2026
Ovulación estimada: 15 de abril de 2026
Próxima menstruación estimada: 29 de abril de 2026
Calculado en calculadoras.tools
```

### Fase 2

WhatsApp puede agregarse después, pero el texto debe ser neutral y evitar
datos excesivos. No compartir historial de ciclos.

---

## Validaciones

| Regla | Tipo | Mensaje |
|-------|------|---------|
| FUM futura | Error | La fecha de inicio no puede ser futura. |
| FUM muy antigua | Advertencia | Esta fecha parece pertenecer a un ciclo anterior. Actualiza tu FUM si ya tuviste otra menstruación. |
| Ciclo menor a 21 | Error o advertencia fuerte | Los ciclos menores a 21 días pueden requerir orientación médica. |
| Ciclo 21 a 35 | Válido | Sin advertencia. |
| Ciclo 36 a 45 | Advertencia | Los ciclos largos pueden hacer menos precisa la predicción. |
| Ciclo mayor a 45 | Error | Ingresa un ciclo entre 21 y 45 días o consulta con un profesional si tus ciclos son más largos. |
| Menstruación menor a 2 o mayor a 10 | Error | Revisa la duración de la menstruación. |
| Menstruación mayor a 7 | Advertencia | Sangrados de más de 7 días pueden ameritar consulta si son habituales. |
| Menstruación mayor que ciclo | Error | La menstruación no puede durar más que el ciclo completo. |
| Ciclo corto mayor que largo | Error | El ciclo más corto no puede ser mayor que el ciclo más largo. |
| Variación mayor a 7 días | Advertencia | Con ciclos variables, la ventana fértil es más amplia y menos predecible. |
| Campos requeridos vacíos | Error | Completa los campos necesarios para calcular. |
| Intención evitar embarazo | Advertencia fuerte | Esta calculadora no es un método anticonceptivo. |

---

## Casos extremos

### Ciclo de 21 días

- Próxima menstruación: FUM + 21 días.
- Ovulación estimada: FUM + 7 días.
- La ventana fértil puede iniciar muy cerca de la menstruación.
- Mostrar nota de ciclo corto y baja/mediana confianza si no hay historial.

### Ciclo de 45 días

- Próxima menstruación: FUM + 45 días.
- Ovulación estimada: FUM + 31 días.
- Mostrar nota de ciclo largo y menor precisión.

### FUM hace más tiempo que el ciclo declarado

Si `hoy > proxima_menstruacion_estimada`:

- Indicar que la menstruación estimada ya debió llegar.
- Sugerir actualizar FUM si ya hubo sangrado.
- Si no llegó y el ciclo suele ser regular, orientar sobre test de embarazo.

### Ciclo corto = ciclo largo

Tratar como ciclo regular con ese valor exacto.

### Fase lútea corta

Si fase lútea es 10 u 11 días:

- Calcular correctamente.
- Mostrar nota:

> Si tu fase lútea suele ser menor de 12 días, coméntalo con tu profesional
> de salud, especialmente si estás intentando concebir.

### Factores que reducen precisión

Mostrar nota si aplica o incluir en contenido educativo:

- Postparto o lactancia.
- Uso reciente o actual de anticonceptivos hormonales.
- Síndrome de ovario poliquístico.
- Perimenopausia.
- Estrés intenso, cambios de peso o ejercicio extremo.
- Enfermedad reciente.
- Ciclos ausentes o muy irregulares.

---

## SEO

### Meta

Title:

> Calculadora de ovulación - días fértiles y ciclo menstrual

Description:

> Calcula tu ventana fértil estimada, día probable de ovulación y próxima
> menstruación. Incluye calendario del ciclo, modo irregular y guía para test
> de embarazo.

Canonical:

> `/salud/calculadora-de-ovulacion`

### Keywords principales

- calculadora de ovulación
- días fértiles
- ventana fértil
- calendario menstrual
- cuándo ovulo
- calculadora días fértiles

### FAQs

- ¿Cómo sé cuándo voy a ovular?
- ¿Cuántos días dura la ventana fértil?
- ¿Puedo quedar embarazada fuera de la ventana fértil?
- ¿Por qué mi ovulación cambia de fecha?
- ¿La calculadora sirve si tengo ciclos irregulares?
- ¿Sirve como método anticonceptivo?
- ¿Cuándo es mejor hacer un test de embarazo?
- ¿Qué tan confiables son los test de ovulación LH?
- ¿Cuándo debería consultar si estoy intentando concebir?

Agregar FAQ JSON-LD como en las otras páginas del sitio.

---

## Calculadoras relacionadas

| Situación | Enlace |
|-----------|--------|
| Embarazo confirmado | `/salud/fecha-probable-de-parto` |
| Quiere revisar IMC | `/salud/calculadora-de-imc` |
| Quiere calcular calorías diarias | `/salud/calculadora-de-calorias-diarias-tdee` |
| Quiere calcular macros | `/salud/calculadora-de-macros` |

El enlace a fecha probable de parto debe aparecer después del bloque de test
de embarazo y en calculadoras relacionadas.

---

## Especificaciones técnicas

| Parámetro | Detalle |
|-----------|---------|
| Plataforma | Astro + JS cliente |
| Backend | No |
| Persistencia | `localStorage`, solo con consentimiento explícito |
| Fechas | `Temporal.PlainDate`, `date-fns` o helpers propios de fecha civil |
| Locale | `es-MX` por defecto |
| Calendario | CSS Grid nativo |
| Accesibilidad | Labels, `aria-label`, soporte teclado, leyenda textual |
| Resultado | Actualización instantánea al completar campos válidos |
| Copiar | Clipboard API con fallback |
| Compartir WhatsApp | Fase 2 |

---

## Pruebas recomendadas

### Unitarias

- Ciclo 28, FUM 2026-04-01, fase lútea 14:
  - próxima menstruación 2026-04-29
  - ovulación 2026-04-15
  - ventana fértil 2026-04-10 a 2026-04-15
- Ciclo 21.
- Ciclo 45.
- Año bisiesto.
- Cambio de mes y cambio de año.
- Ciclo irregular con historial de 3 a 6 fechas.
- Ciclo corto igual a ciclo largo.
- FUM futura.
- FUM antigua.
- Cálculo del día del ciclo con conteo inclusivo.
- Test de embarazo antes, en y después del primer día de retraso.
- Guardar, cargar y borrar `localStorage`.

### UI

- Mobile y desktop.
- Calendario sin solapamientos.
- Textos largos dentro de botones y tarjetas.
- Navegación por teclado.
- Contraste suficiente.
- Resultados no dependen solo de color.

---

## Fuentes base para contenido médico

Usar estas fuentes como base editorial y para validar mensajes:

- Office on Women's Health: ovulation calculator y límites de estimación.
- ASRM: optimización de fertilidad natural y frecuencia durante ventana fértil.
- CDC: infertilidad, edad y cuándo consultar.
- NHS: cuándo hacer test de embarazo.
- FDA: precisión de test de embarazo y primera orina.
- ACOG: ciclos menstruales, fertilidad y evaluación de infertilidad.
- Wilcox et al., New England Journal of Medicine, 1995: probabilidades
  poblacionales según relación con ovulación.

---

## Diferencia clave frente a fecha probable de parto

| Aspecto | Ovulación | Fecha probable de parto |
|---------|-----------|-------------------------|
| Momento | Antes o durante búsqueda de embarazo | Después de embarazo confirmado |
| Objetivo | Estimar ventana fértil | Estimar FPP y semanas de gestación |
| Resultado central | Ventana fértil + confianza | FPP + progreso del embarazo |
| Precisión | Variable, depende del ciclo | Mejor si hay ecografía/FPP oficial |
| Riesgo de uso indebido | Anticoncepción o promesas de concepción | Ansiedad por fecha exacta de parto |
| Tono | Esperanzador, neutral, práctico | Cálido, informativo, cuidadoso |

