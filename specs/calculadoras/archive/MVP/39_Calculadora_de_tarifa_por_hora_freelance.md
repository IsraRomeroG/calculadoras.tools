# Especificación v2 - Calculadora de tarifa por hora freelance

## Descripción general

Herramienta para estimar una tarifa por hora freelance sostenible a partir del
ingreso personal deseado, gastos del negocio, ahorro, reserva fiscal, comisiones
de cobro, tiempo disponible y capacidad realmente facturable.

La calculadora debe ayudar al usuario a responder tres preguntas:

1. ¿Cuál es la tarifa mínima que necesito para alcanzar mi objetivo?
2. ¿Qué tarifa práctica debería usar al cotizar?
3. ¿Cómo cambia mi tarifa si facturo más o menos horas?

**Arquitectura:** todo el cálculo ocurre en el cliente. No requiere backend,
base de datos ni llamadas a APIs externas. Los impuestos y comisiones se
capturan manualmente.

**Aviso de alcance:** la reserva para impuestos es una estimación de planeación,
no un cálculo fiscal. La base gravable, deducciones, tasas y obligaciones reales
dependen de la situación del usuario.

---

## Objetivo de producto

- Convertir una meta de ingreso personal en una tarifa por hora sostenible.
- Separar claramente ingreso personal, gastos, ahorro, impuestos y comisiones.
- Considerar horas no facturables y semanas no trabajadas.
- Mostrar una tarifa exacta y una tarifa práctica redondeada para cotizar.
- Comparar opcionalmente la tarifa actual del usuario contra la necesaria.
- Mostrar escenarios de capacidad facturable para hacer visible el riesgo de los
  supuestos.
- Explicar que facturación, utilidad e ingreso personal no son equivalentes.
- Generar una página estática optimizada para SEO en Astro.

---

## Alcance recomendado

### MVP

- Ingreso personal neto mensual deseado.
- Horas de trabajo por semana.
- Porcentaje de horas facturables.
- Gastos mensuales del negocio.
- Ahorro o reserva mensual deseada.
- Reserva estimada para impuestos sobre utilidad.
- Comisión porcentual sobre cobros.
- Semanas no trabajadas al año.
- Duración de una jornada facturable.
- Tarifa actual opcional para comparación.
- Incremento de redondeo para obtener una tarifa práctica.
- Resultado principal: tarifa práctica sugerida por hora.
- Resultados secundarios: tarifa mínima exacta, tarifa por jornada, facturación
  mensual necesaria y horas facturables mensuales.
- Desglose del destino de la facturación.
- Escenarios de capacidad facturable.
- Copiar resumen, usar ejemplo y limpiar formulario.
- Enlace contextual a la calculadora de precio de proyecto freelance.

### Fuera del MVP

- Precio por proyecto. Requiere horas, fases, contingencia y otros datos que
  corresponden a la calculadora de precio de proyecto freelance.
- Cálculo automático de impuestos por país o régimen.
- Recomendaciones de tarifa basadas en profesión, experiencia o mercado.
- Conversión automática de moneda o tipos de cambio.

### Fase 2

- Comparar hasta tres escenarios guardados.
- Análisis inverso desde una tarifa actual: ingreso personal mensual estimado.
- Gastos desglosados por concepto.
- Historial en `sessionStorage`.
- Compartir escenario mediante parámetros de URL.
- Exportar escenario a CSV.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL pública recomendada | `/finanzas/calculadora-de-tarifa-por-hora-freelance` |
| Archivo Astro recomendado | `src/pages/finanzas/calculadora-de-tarifa-por-hora-freelance.astro` |
| Lógica de cálculo | `src/lib/calculators/finanzas/calculadora-de-tarifa-por-hora-freelance/freelanceRate.ts` |
| Pruebas unitarias | `src/lib/calculators/finanzas/calculadora-de-tarifa-por-hora-freelance/freelanceRate.test.ts` |
| Categoría | `finanzas` |
| Locale base | `es-MX` |
| Moneda base | `MXN`, símbolo `$` |

---

## Definiciones del modelo

### Ingreso personal neto deseado

Importe que el usuario quiere conservar cada mes para uso personal después de
gastos del negocio y de separar la reserva estimada para impuestos.

### Gastos mensuales del negocio

Costos necesarios para operar, como software, internet, equipo, asesoría,
marketing o coworking. Se suman a la facturación necesaria antes de calcular la
tarifa.

### Ahorro o reserva mensual

Importe adicional que el usuario desea conservar después de impuestos para
crear un fondo de emergencia, renovar equipo o financiar objetivos futuros.

### Reserva estimada para impuestos

Porcentaje manual aplicado sobre la utilidad del negocio después de gastos y
comisiones. No representa IVA trasladado, retenciones ni un cálculo fiscal
oficial.

### Comisión sobre cobros

Porcentaje de la facturación consumido por marketplaces, plataformas o
pasarelas de pago. Reduce la facturación disponible antes de cubrir gastos y
utilidad.

### Porcentaje facturable

Proporción de las horas trabajadas que pueden cobrarse a clientes. El tiempo
restante puede incluir ventas, administración, propuestas, capacitación,
seguimiento y contabilidad.

---

## Experiencia mobile-first

### Principios

- Diseñar primero para anchos de `320px`, `360px`, `390px` y `430px`.
- Usar una sola columna en móvil.
- Mantener el formulario inicial corto y colocar el resultado inmediatamente
  después de la acción principal.
- No depender de tablas horizontales para presentar resultados esenciales.
- Mantener objetivos táctiles de al menos `44px`.
- Usar inputs numéricos con `inputmode="decimal"`; no usar sliders como único
  mecanismo de captura porque dificultan introducir valores precisos.
- Acompañar porcentajes frecuentes con chips táctiles, por ejemplo `50%`,
  `60%` y `70%`.
- Evitar resultados que cambien de altura bruscamente durante la captura.

### Orden de la interfaz en móvil

1. Hero breve.
2. Formulario de cálculo rápido.
3. Acción principal.
4. Resultado principal y comparación con tarifa actual, cuando exista.
5. Desglose y escenarios.
6. Explicación educativa, metodología y FAQs.

En escritorio, formulario y resultado pueden mostrarse en dos columnas. El orden
del DOM debe conservar el flujo lógico de móvil.

### Formulario de cálculo rápido

Mostrar inicialmente:

- Ingreso personal neto mensual deseado.
- Horas de trabajo por semana.
- Porcentaje facturable.
- Botón `Calcular mi tarifa`.

Mostrar el resto dentro de un bloque expandible:

`Gastos, impuestos y tiempo libre`

Cuando el bloque esté cerrado, mostrar un resumen de sus valores:

> Ajustes: $8,000 de gastos, 25% para impuestos y 4 semanas libres.

### Comportamiento del resultado

- Mostrar una frase completa como resultado principal:

  > Para recibir $40,000 al mes, deberías cotizar al menos $750 por hora.

- Mostrar la tarifa práctica con mayor jerarquía que la tarifa exacta.
- Tras enviar un formulario válido, desplazar suavemente la vista al resultado
  en móvil y mover el foco a su encabezado.
- Anunciar el resultado principal mediante `aria-live="polite"`.
- Mantener visibles los supuestos principales cerca del resultado.

---

## Flujo principal MVP

**Ejemplo:** quiero conservar `$40,000` al mes, tengo `$8,000` de gastos,
quiero ahorrar `$3,000`, separo `25%` de utilidad para impuestos, pago `3%` de
comisión, trabajo `40` horas semanales, facturo `60%` de mi tiempo y descanso
`4` semanas al año. ¿Cuánto debo cobrar?

### Inputs del MVP

| Campo | Tipo | Rango válido | Valor por defecto | Ubicación |
|-------|------|--------------|-------------------|-----------|
| Ingreso personal neto mensual deseado | Texto numérico | `> 0` | vacío | Principal |
| Horas de trabajo por semana | Texto numérico | `1-80` | `40` | Principal |
| Porcentaje facturable | Texto numérico + chips | `1%-100%` | `60` | Principal |
| Gastos mensuales del negocio | Texto numérico | `>= 0` | `0` | Ajustes |
| Ahorro o reserva mensual | Texto numérico | `>= 0` | `0` | Ajustes |
| Reserva estimada para impuestos | Texto numérico | `0%-80%` | `0` | Ajustes |
| Comisión sobre cobros | Texto numérico | `0%-50%` | `0` | Ajustes |
| Semanas no trabajadas al año | Texto numérico | `0-20` | `4` | Ajustes |
| Horas por jornada facturable | Texto numérico | `1-12` | `8` | Ajustes |
| Tarifa actual | Texto numérico opcional | `> 0` | vacío | Ajustes |
| Redondear tarifa práctica a | Selector | `$1`, `$10`, `$50`, `$100` | `$50` | Ajustes |

Todos los importes deben aceptar formatos habituales de `es-MX`, incluyendo
separadores de miles, decimales y símbolo de moneda.

### Acciones

- `Calcular mi tarifa`: acción primaria.
- `Usar ejemplo`: completa un escenario válido y calcula.
- `Copiar resumen`: aparece después de un cálculo válido.
- `Limpiar`: restaura valores iniciales sin recargar la página.
- `Calcular precio de proyecto`: enlace secundario hacia la calculadora
  correspondiente, no resultado de este MVP.

---

## Outputs del MVP

### Resultado principal

- Tarifa práctica sugerida por hora, redondeada hacia arriba al incremento
  seleccionado.

### Resultados secundarios

- Tarifa mínima sostenible exacta por hora.
- Equivalente por jornada facturable.
- Facturación mensual necesaria.
- Horas facturables mensuales.
- Horas facturables anuales.
- Semanas trabajadas al año.
- Tarifa mínima sin ahorro, definida explícitamente como el mismo cálculo con
  ahorro mensual igual a cero.

### Comparación con tarifa actual

Si el usuario captura una tarifa actual, mostrar:

- Diferencia monetaria por hora.
- Diferencia porcentual respecto a la tarifa mínima sostenible.
- Estado:
  - `Por debajo de tu objetivo` si la tarifa actual es menor que la mínima.
  - `Alcanza tu objetivo` si es igual o superior a la mínima.

No afirmar que una tarifa es competitiva, premium o adecuada para el mercado.

### Desglose de facturación mensual

Mostrar el flujo estimado:

1. Facturación mensual necesaria.
2. Comisión estimada sobre cobros.
3. Gastos mensuales del negocio.
4. Utilidad antes de impuestos.
5. Reserva estimada para impuestos.
6. Ingreso personal neto deseado.
7. Ahorro o reserva mensual.

El desglose debe ayudar a explicar por qué la facturación necesaria es mayor que
el ingreso personal deseado.

### Escenarios de capacidad facturable

Mostrar tres escenarios calculados con los mismos supuestos económicos:

- Capacidad baja: `porcentaje_facturable - 10` puntos porcentuales.
- Capacidad actual: porcentaje facturable capturado.
- Capacidad alta: `porcentaje_facturable + 10` puntos porcentuales.

Limitar los escenarios al rango `1%-100%` y eliminar duplicados. Cada escenario
debe mostrar porcentaje facturable, horas facturables mensuales y tarifa mínima
por hora.

En móvil, mostrar los escenarios como tarjetas apiladas. En escritorio pueden
mostrarse como tarjetas en fila.

---

## Fórmulas y algoritmo

Mantener precisión completa durante el cálculo y redondear únicamente para
presentación.

### Capacidad facturable

```text
semanas_trabajadas_anuales = 52 - semanas_no_trabajadas

horas_facturables_anuales =
  horas_trabajo_semana
  * semanas_trabajadas_anuales
  * (porcentaje_facturable / 100)

horas_facturables_mensuales = horas_facturables_anuales / 12
```

### Facturación necesaria

La reserva fiscal se aplica sobre la utilidad después de comisiones y gastos,
no directamente sobre los gastos del negocio.

```text
objetivo_neto_despues_impuestos =
  ingreso_personal_neto_deseado + ahorro_mensual

tasa_impuestos = reserva_impuestos / 100
tasa_comision = comision_cobros / 100

utilidad_antes_impuestos =
  objetivo_neto_despues_impuestos / (1 - tasa_impuestos)

facturacion_mensual_necesaria =
  (gastos_mensuales + utilidad_antes_impuestos) / (1 - tasa_comision)

comision_mensual =
  facturacion_mensual_necesaria * tasa_comision

reserva_impuestos_mensual =
  utilidad_antes_impuestos * tasa_impuestos
```

### Tarifas

```text
tarifa_minima_hora =
  facturacion_mensual_necesaria / horas_facturables_mensuales

tarifa_practica_hora =
  redondear_hacia_arriba(tarifa_minima_hora, incremento_redondeo)

tarifa_jornada =
  tarifa_practica_hora * horas_por_jornada
```

La tarifa por jornada usa la tarifa práctica para producir una cifra útil al
cotizar. La interfaz debe etiquetarla como equivalente, no como ingreso neto.

### Tarifa mínima sin ahorro

```text
utilidad_sin_ahorro_antes_impuestos =
  ingreso_personal_neto_deseado / (1 - tasa_impuestos)

facturacion_sin_ahorro =
  (gastos_mensuales + utilidad_sin_ahorro_antes_impuestos)
  / (1 - tasa_comision)

tarifa_minima_sin_ahorro =
  facturacion_sin_ahorro / horas_facturables_mensuales
```

### Comparación con tarifa actual

```text
diferencia_tarifa = tarifa_actual - tarifa_minima_hora

diferencia_porcentual =
  (diferencia_tarifa / tarifa_minima_hora) * 100
```

### Redondeo hacia arriba

```text
redondear_hacia_arriba(valor, incremento) =
  ceil(valor / incremento) * incremento
```

Aplicar tolerancia de punto flotante para no elevar valores que ya coinciden con
el incremento.

---

## Validaciones, advertencias y estados

### Errores bloqueantes

- Ingreso personal deseado vacío, inválido o menor o igual a cero.
- Horas de trabajo por semana fuera de `1-80`.
- Porcentaje facturable fuera de `1%-100%`.
- Reserva para impuestos fuera de `0%-80%`.
- Comisión sobre cobros fuera de `0%-50%`.
- Semanas no trabajadas fuera de `0-20`.
- Horas por jornada fuera de `1-12`.
- Gastos, ahorro o tarifa actual negativos.
- Valores no finitos o formatos que no puedan interpretarse con seguridad.

### Advertencias no bloqueantes

- Reserva para impuestos igual a `0%`:

  > No estás reservando dinero para impuestos. Confirma que este supuesto aplica
  > a tu situación.

- Porcentaje facturable mayor que `80%`:

  > Facturar más del 80% de tu tiempo de forma sostenida puede dejar poco margen
  > para ventas, administración y descansos.

- Horas facturables mensuales menores que `20`:

  > Tu capacidad facturable es muy baja; pequeños cambios en tus horas pueden
  > modificar mucho la tarifa.

- Horas de trabajo por semana mayores que `60`:

  > Este escenario supone una carga semanal alta. Revisa si puede mantenerse.

- Tarifa actual menor que la tarifa mínima:

  > Tu tarifa actual está por debajo de la necesaria para alcanzar este objetivo
  > con los supuestos capturados.

### Estado inicial

- No mostrar cifras calculadas como si fueran resultados.
- Mostrar una explicación breve del resultado que aparecerá.
- Mantener reservado el espacio esencial para evitar saltos de layout.

### Estado inválido después de un resultado válido

- Conservar el último resultado válido mientras el usuario corrige el campo.
- Marcar claramente que el resultado corresponde a valores anteriores.
- No copiar ni anunciar como nuevo un resultado desactualizado.

---

## Contenido del resumen copiable

El resumen debe incluir:

```text
Tarifa freelance estimada
Tarifa práctica sugerida: $750 por hora
Tarifa mínima sostenible: $701.60 por hora
Equivalente por jornada de 8 horas: $6,000
Facturación mensual necesaria: $67,353.95
Capacidad estimada: 96 horas facturables al mes
Supuestos: 40 horas por semana, 60% facturable, 4 semanas libres,
$8,000 de gastos, 25% para impuestos y 3% de comisión.
```

Incluir únicamente los conceptos opcionales capturados. Aclarar que se trata de
una estimación de planeación.

---

## Contenido educativo y confianza

Incluir cerca de la calculadora:

- Diferencia entre facturación, utilidad e ingreso personal.
- Ejemplos de horas no facturables.
- Por qué una tarifa sostenible suele ser mayor que un salario convertido a
  horas.
- Cómo estimar el porcentaje facturable usando datos de semanas anteriores.
- Por qué la reserva fiscal no sustituye una estimación profesional.
- Cuándo conviene cotizar por hora y cuándo usar precio fijo por proyecto.

No presentar referencias de mercado sin una fuente verificable y vigente.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de tarifa por hora freelance` |
| Meta description | `Calcula cuánto cobrar por hora como freelance considerando ingreso deseado, gastos, impuestos, comisiones y horas facturables.` |
| H1 | `Calculadora de tarifa por hora freelance` |
| Keyword principal | `calculadora tarifa freelance` |
| Keywords secundarias | `cuánto cobrar por hora freelance`, `tarifa por hora independiente`, `precio por hora freelance` |

### FAQs sugeridas

- ¿Cómo calculo cuánto cobrar por hora como freelance?
- ¿Qué porcentaje de mis horas debería considerar facturable?
- ¿Por qué debo incluir gastos e impuestos en mi tarifa?
- ¿Cuál es la diferencia entre tarifa mínima y tarifa práctica?
- ¿Por qué mi tarifa por hora no equivale a mi salario?
- ¿Cómo convierto mi tarifa por hora en precio por proyecto?

Incluir `FAQPage` JSON-LD únicamente cuando las preguntas y respuestas estén
visibles en la página.

---

## Accesibilidad

- Asociar cada input con `label`, ayuda y mensaje de error mediante
  `aria-describedby`.
- Mostrar errores junto al campo y un resumen de errores al enviar.
- Llevar el foco al primer campo inválido.
- Usar `aria-live="polite"` para anunciar el resultado y el estado de copiado.
- No comunicar estados únicamente mediante color.
- Los chips de porcentaje deben reflejar su estado seleccionado.
- El bloque expandible debe funcionar con teclado y anunciar su estado.
- Formatear visualmente importes sin alterar inesperadamente el valor mientras el
  usuario escribe.

---

## Pruebas sugeridas

### Cálculo

- Impuestos `0%` dejan utilidad antes de impuestos igual al objetivo neto.
- Impuestos `25%` dividen el objetivo neto entre `0.75`.
- Los impuestos se aplican sobre utilidad y no sobre gastos.
- Comisión `3%` divide gastos más utilidad entre `0.97`.
- Gastos, ahorro, impuestos y comisión aumentan la tarifa.
- Semanas no trabajadas reducen horas facturables y aumentan la tarifa.
- Un porcentaje facturable menor aumenta la tarifa.
- Tarifa práctica se redondea hacia arriba al incremento seleccionado.
- Un valor que ya coincide con el incremento no se redondea al siguiente.
- Tarifa mínima sin ahorro usa ahorro igual a cero.
- Escenarios respetan `1%-100%` y eliminan duplicados.
- Comparación con tarifa actual calcula importe, porcentaje y estado.

### Validación

- Porcentaje facturable `0%` muestra error.
- Impuestos mayores que `80%` muestran error.
- Comisión mayor que `50%` muestra error según el rango definido.
- Valores negativos muestran error.
- Formatos monetarios habituales de `es-MX` se interpretan correctamente.
- Una entrada inválida conserva y marca el último resultado válido.

### Interfaz y accesibilidad

- En `320px` no existe desbordamiento horizontal.
- En móvil, el resultado aparece inmediatamente después del formulario.
- El bloque de ajustes cerrado muestra un resumen de supuestos.
- Los escenarios se muestran como tarjetas apiladas en móvil.
- El foco llega al resultado después de un cálculo válido.
- El resultado principal se anuncia con `aria-live="polite"`.
- Copiar resumen incluye la tarifa, capacidad y supuestos relevantes.

---

## Criterios de aceptación del MVP

1. Un usuario puede obtener una tarifa útil capturando solo ingreso, horas
   semanales y porcentaje facturable.
2. La fórmula separa gastos, utilidad, reserva fiscal y comisiones.
3. La tarifa práctica sugerida se muestra como resultado principal.
4. El resultado explica cuánta facturación y capacidad facturable requiere.
5. Los escenarios muestran cómo cambia la tarifa al cambiar la capacidad.
6. La tarifa actual opcional se compara sin hacer afirmaciones sobre el mercado.
7. No se muestra un precio por proyecto sin solicitar datos de proyecto.
8. La experiencia funciona sin desbordamiento horizontal desde `320px`.
9. Los errores y resultados son accesibles mediante teclado y tecnologías de
   asistencia.
10. La página aclara que la reserva fiscal es una estimación manual.
