# Especificacion v2 - Calculadora de ROI: retorno de inversion

## Descripcion general

Herramienta para calcular y explicar el retorno de inversion de un proyecto,
compra, activo o negocio usando datos ingresados por el usuario. Ademas de
mostrar el ROI historico, debe ayudar a responder cuanto falta para recuperar
la inversion o alcanzar un ROI objetivo.

La calculadora debe distinguir claramente entre el valor total recuperado y la
ganancia neta para evitar uno de los errores mas comunes al calcular ROI.

**Arquitectura:** todo el calculo ocurre en el cliente. No requiere backend,
base de datos ni llamadas a APIs externas.

---

## Objetivo de producto

- Calcular ROI simple usando inversion inicial y valor total recuperado.
- Calcular ROI detallado usando ingresos y costos de un negocio o proyecto.
- Mostrar ganancia o perdida, ROI, margen sobre ingresos y multiplo.
- Mostrar cuanto falta o cuanto se supero el punto de equilibrio.
- Permitir definir un ROI objetivo y calcular el retorno adicional necesario.
- Explicar los resultados sin afirmar que un ROI positivo siempre es conveniente.
- Generar una pagina estatica optimizada para SEO en Astro.

---

## Principios de presentacion

- Usar lenguaje claro antes que terminologia financiera.
- Llamar `Valor total recuperado` al monto final que incluye la inversion
  recuperada y la ganancia o perdida.
- No usar `retorno final`, `ingresos` y `ganancia neta` como sinonimos.
- Mostrar resultados negativos sin ocultarlos ni tratarlos como errores.
- Diferenciar ROI, margen sobre ingresos y multiplo de inversion.
- Aclarar que el calculo no considera automaticamente inflacion, impuestos,
  riesgo, costo de oportunidad ni flujos intermedios.

---

## Alcance recomendado

### MVP

- Modo `Inversion simple`: inversion inicial y valor total recuperado.
- Modo `Negocio o proyecto`: ingresos y desglose de costos.
- Plazo opcional para calcular rendimiento anual compuesto equivalente,
  disponible solo en el modo simple.
- ROI objetivo opcional para calcular el valor objetivo y el monto faltante.
- Resultado principal con ROI porcentual e interpretacion.
- Ganancia o perdida, total invertido, multiplo y distancia al equilibrio.
- Copiar resumen y limpiar formulario.
- Bloque desplegable `Como se calculo`.

### Fase 2

- Comparador de hasta 3 inversiones.
- Sensibilidad por escenarios conservador, base y optimista.
- Historial de calculos en `sessionStorage`.
- Exportar escenarios o comparaciones a CSV.

No incluir una grafica de punto de equilibrio sin flujos por periodo. Para
calcular equilibrio por unidades, clientes o ventas, enlazar a la calculadora
especifica de punto de equilibrio.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL publica recomendada | `/finanzas/calculadora-de-roi` |
| Archivo Astro recomendado | `src/pages/finanzas/calculadora-de-roi.astro` |
| Logica de calculo | `src/lib/calculators/finanzas/calculadora-de-roi/roi.ts` |
| Pruebas unitarias | `src/lib/calculators/finanzas/calculadora-de-roi/roi.test.ts` |
| Categoria | `finanzas` |
| Locale base | `es-MX` |
| Moneda base | `MXN`, simbolo `$` |

---

## Comportamiento mobile-first

### Orden de contenido en movil

1. Control segmentado: `Inversion simple` y `Negocio o proyecto`.
2. Campos requeridos en una sola columna.
3. Opciones desplegables: plazo y ROI objetivo.
4. Boton principal de ancho completo: `Calcular ROI`.
5. Tarjeta principal con ROI y una frase interpretativa.
6. Cuadricula de dos columnas con ganancia, multiplo, total invertido y
   distancia al equilibrio.
7. Resultado del ROI objetivo, cuando se capture.
8. Acordeon `Como se calculo`.
9. Acciones secundarias: copiar resumen y limpiar.

### Reglas de interfaz

- Mantener solo los campos relevantes visibles para cada modo.
- Evitar tablas y desplazamiento horizontal en el MVP.
- Usar controles tactiles de al menos `44px` de alto.
- Mantener etiquetas visibles; no depender solo de placeholders.
- Usar `input type="text"` con `inputmode="decimal"` para campos monetarios,
  porcentajes y plazo.
- Mostrar prefijo de moneda y sufijo `%` sin incluirlos en el valor editable.
- Aceptar valores pegados con `$`, comas y espacios.
- No reformatear el numero mientras el usuario escribe; formatearlo al perder
  foco o al calcular.
- Mostrar errores debajo del campo correspondiente.
- Anunciar cambios del resultado con `aria-live="polite"`.
- No depender solo del color para comunicar ganancia, equilibrio o perdida.

En pantallas amplias se puede usar una distribucion de dos columnas con el
formulario a la izquierda y un resumen visible a la derecha.

---

## Flujo principal MVP

### Ejemplo del modo inversion simple

**Ejemplo:** Invierto `$25,000` en equipo y al final recupero `$38,000` en
total, incluyendo mi inversion. Mi ganancia es `$13,000` y mi ROI es `52%`.

Mostrar cerca del campo `Valor total recuperado` la ayuda:

> Incluye el dinero recuperado de la inversion y cualquier ganancia. No captures
> solamente la ganancia.

### Inputs del modo inversion simple

| Campo | Tipo | Rango valido | Valor por defecto |
|-------|------|--------------|-------------------|
| Inversion inicial | Texto numerico | `> 0` | vacio |
| Valor total recuperado | Texto numerico | `>= 0` | vacio |
| ROI objetivo | Texto numerico opcional | `> -100` | vacio |
| Plazo | Texto numerico opcional | `> 0` | vacio |
| Unidad de plazo | Selector | `Dias`, `Meses`, `Años` | `Meses` |

### Ejemplo del modo negocio o proyecto

**Ejemplo:** Un proyecto genera `$120,000` en ingresos. Tuvo `$20,000` de
costos iniciales, `$30,000` de costos fijos, `$25,000` de costos variables y
`$5,000` de otros costos. El costo total es `$80,000`, la utilidad es `$40,000`
y el ROI es `50%`.

### Inputs del modo negocio o proyecto

| Campo | Tipo | Rango valido | Valor por defecto |
|-------|------|--------------|-------------------|
| Ingresos totales | Texto numerico | `>= 0` | vacio |
| Costos iniciales | Texto numerico | `>= 0` | `0` |
| Costos fijos del periodo | Texto numerico | `>= 0` | `0` |
| Costos variables del periodo | Texto numerico | `>= 0` | `0` |
| Otros costos no incluidos | Texto numerico | `>= 0` | `0` |
| ROI objetivo | Texto numerico opcional | `> -100` | vacio |

Mostrar una ayuda breve para indicar que cada costo debe capturarse una sola
vez. En este modo, los costos iniciales pueden ser cero siempre que el costo
total sea mayor que cero.

### Outputs principales comunes

- ROI porcentual.
- Ganancia o perdida neta.
- Total invertido o costo total.
- Multiplo de inversion.
- Estado: perdida, equilibrio o ganancia.
- Distancia al equilibrio.
- Valor necesario para alcanzar el equilibrio.
- Valor objetivo y monto faltante o excedente, si hay ROI objetivo.

### Outputs adicionales por modo

| Modo | Outputs adicionales |
|------|----------------------|
| Inversion simple | Rendimiento anual compuesto equivalente, si hay plazo |
| Negocio o proyecto | Margen sobre ingresos |

---

## Formulas

### Modo inversion simple

```text
ganancia = valor_total_recuperado - inversion_inicial
roi = (ganancia / inversion_inicial) * 100
multiplo = valor_total_recuperado / inversion_inicial
valor_equilibrio = inversion_inicial
distancia_equilibrio = valor_total_recuperado - valor_equilibrio
```

### Modo negocio o proyecto

```text
total_costos =
  costos_iniciales +
  costos_fijos +
  costos_variables +
  otros_costos

ganancia = ingresos_totales - total_costos
roi = (ganancia / total_costos) * 100
multiplo = ingresos_totales / total_costos
margen_sobre_ingresos =
  ingresos_totales > 0 ? (ganancia / ingresos_totales) * 100 : null
valor_equilibrio = total_costos
distancia_equilibrio = ingresos_totales - valor_equilibrio
```

### ROI objetivo

Usar como `base_calculo` la inversion inicial en el modo simple y el total de
costos en el modo negocio o proyecto.

```text
valor_objetivo = base_calculo * (1 + roi_objetivo / 100)
monto_hacia_objetivo = valor_actual - valor_objetivo
```

- Si `monto_hacia_objetivo < 0`, mostrar cuanto falta.
- Si `monto_hacia_objetivo = 0`, mostrar que se alcanzo exactamente la meta.
- Si `monto_hacia_objetivo > 0`, mostrar cuanto se supero la meta.

### Rendimiento anual compuesto equivalente

Disponible solo en el modo inversion simple. Supone una inversion inicial y un
valor final sin aportaciones, retiros ni flujos intermedios.

```text
años = plazo_en_dias / 365
años = plazo_en_meses / 12
años = plazo_en_años

rendimiento_anual_equivalente =
  ((valor_total_recuperado / inversion_inicial) ^ (1 / años) - 1) * 100
```

No calcularlo si `valor_total_recuperado <= 0` o `años <= 0`. Un resultado
anual equivalente negativo es valido y debe mostrarse.

---

## Interpretacion del resultado

La frase principal debe ser factual y usar los valores capturados.

### Ganancia

> Recuperaste `$13,000` mas de lo invertido. Por cada `$1` invertido,
> recuperaste `$1.52` en total.

### Equilibrio

> Recuperaste exactamente lo invertido. No hubo ganancia ni perdida.

### Perdida

> Recuperaste `$7,000` menos de lo invertido. Por cada `$1` invertido,
> recuperaste `$0.72` en total.

### ROI objetivo

> Tu ROI actual es `18%`. Para alcanzar tu meta de `25%`, necesitas generar
> `$7,000` adicionales.

Agregar debajo de la interpretacion:

> Un ROI positivo no garantiza que la inversion haya sido conveniente. Compara
> el resultado con el plazo, riesgo, inflacion, impuestos y otras alternativas.

---

## Validaciones y estados

- La inversion inicial del modo simple debe ser mayor que cero.
- El costo total del modo negocio o proyecto debe ser mayor que cero.
- Los costos individuales del modo negocio o proyecto pueden ser cero.
- Aceptar valor total recuperado o ingresos iguales a cero para representar una
  perdida total.
- No aceptar valores monetarios negativos.
- ROI objetivo debe ser mayor que `-100%`.
- Plazo debe ser mayor que cero cuando se capture.
- Si el ROI matematico es exactamente `0`, mostrar `Punto de equilibrio`.
- Si el ROI redondeado se muestra como `0.00%`, no cambiar el estado calculado
  con la precision interna.
- Si los ingresos son cero, mostrar margen sobre ingresos como `No disponible`.
- Evitar divisiones entre cero, `NaN` e infinito en todos los outputs.
- Redondear porcentajes a 2 decimales y moneda a 2 decimales, pero conservar
  precision interna.
- Mostrar un estado inicial explicativo antes de que exista un calculo valido.
- Mantener el ultimo resultado valido si un campo opcional invalido no afecta
  el calculo principal, pero marcar claramente dicho campo.

---

## Bloque `Como se calculo`

Mostrar un desglose compacto y legible, adaptado al modo activo.

### Ejemplo simple

```text
Ganancia = $38,000 - $25,000 = $13,000
ROI = $13,000 / $25,000 x 100 = 52%
Multiplo = $38,000 / $25,000 = 1.52x
```

### Ejemplo negocio o proyecto

```text
Costo total = $20,000 + $30,000 + $25,000 + $5,000 = $80,000
Ganancia = $120,000 - $80,000 = $40,000
ROI = $40,000 / $80,000 x 100 = 50%
Margen = $40,000 / $120,000 x 100 = 33.33%
```

---

## Acciones

### Copiar resumen

Debe incluir:

- Modo utilizado.
- Valores de entrada relevantes.
- ROI, ganancia o perdida, costo total y multiplo.
- Distancia al equilibrio.
- Rendimiento anual equivalente, si aplica.
- ROI objetivo y monto faltante o excedente, si aplica.
- Nota breve sobre factores no considerados.

### Limpiar

- Restablecer todos los campos y el modo inicial.
- Volver al estado inicial sin resultado.
- No requerir confirmacion, ya que no hay persistencia en el MVP.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de ROI - Retorno de inversion` |
| Meta description | `Calcula el ROI, ganancia, punto de equilibrio y cuanto necesitas para alcanzar un retorno objetivo.` |
| H1 | `Calculadora de ROI` |
| Keyword principal | `calculadora ROI` |
| Keywords secundarias | `retorno de inversion`, `como calcular ROI`, `formula ROI`, `ROI objetivo` |

### Contenido educativo recomendado

- Formula del ROI con un ejemplo.
- Diferencia entre valor total recuperado y ganancia neta.
- Diferencia entre ROI, margen y multiplo.
- Limitaciones del ROI simple.
- Cuando usar rendimiento anual compuesto equivalente.
- Enlace a la calculadora de punto de equilibrio para negocios por unidades.
- Enlace a la calculadora de ROAS para campañas publicitarias.

### FAQs sugeridas

- ¿Cual es la formula del ROI?
- ¿Debo capturar ingresos totales o ganancia neta?
- ¿Que significa un ROI negativo?
- ¿ROI y margen de ganancia son lo mismo?
- ¿Un ROI positivo significa que la inversion fue buena?
- ¿Cuando conviene anualizar el ROI?
- ¿Que factores no considera esta calculadora?

---

## Pruebas sugeridas

### Calculos principales

- Inversion `1000` y valor total recuperado `1500` produce ganancia `500`, ROI
  `50%` y multiplo `1.5x`.
- Valor recuperado igual a inversion produce ROI `0%` y estado de equilibrio.
- Valor recuperado `0` produce ROI `-100%`, multiplo `0x` y perdida total.
- Modo negocio suma cada categoria de costo una sola vez antes de calcular ROI.
- Modo negocio permite costos iniciales `0` si otros costos hacen que el total
  sea mayor que cero.
- Modo negocio rechaza costo total `0`.
- Multiplo del modo negocio usa ingresos divididos entre costo total.
- Ingresos `0` no intentan calcular margen sobre ingresos.

### ROI objetivo y equilibrio

- ROI objetivo `25%` calcula correctamente el valor objetivo y monto faltante.
- Un valor actual superior al objetivo muestra excedente.
- ROI objetivo igual al ROI actual muestra meta alcanzada.
- Distancia al equilibrio es negativa, cero o positiva segun corresponda.

### Rendimiento anual equivalente

- ROI anual equivalente no se calcula con plazo vacio.
- Plazos en dias, meses y años se convierten correctamente.
- Un resultado anual equivalente negativo valido se muestra.
- Valor total recuperado `0` no produce `NaN` ni infinito.

### Entrada, precision y estados

- Inputs con `$`, comas y espacios se parsean correctamente.
- Valores negativos en campos monetarios muestran error.
- ROI objetivo de `-100%` o menor muestra error.
- Un ROI muy cercano a cero conserva el estado correcto aunque se muestre como
  `0.00%`.
- Ningun caso valido o invalido muestra `NaN` o infinito.
- Copiar resumen incluye solo los resultados aplicables al modo activo.
