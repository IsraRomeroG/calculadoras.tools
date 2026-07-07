# Especificacion v2 - Calculadora de cap rate / rentabilidad de alquiler

## Descripcion general

Herramienta para estimar la rentabilidad operativa y el flujo de caja de una
propiedad en alquiler. La calculadora debe ayudar al usuario a entender no solo
el cap rate, sino tambien el rendimiento bruto, el ingreso operativo neto, el
cash-on-cash return y algunos puntos de equilibrio utiles para tomar decisiones.

Los datos se ingresan manualmente y el resultado no sustituye un analisis
inmobiliario, fiscal, legal o financiero profesional.

**Arquitectura:** todo el calculo ocurre en el cliente. No requiere backend,
base de datos ni llamadas a APIs externas.

---

## Objetivo de producto

- Calcular cap rate con ingreso operativo neto (NOI).
- Calcular rendimiento bruto del alquiler.
- Estimar flujo de caja mensual y anual antes y despues de deuda.
- Calcular cash-on-cash return cuando exista inversion inicial o financiamiento.
- Permitir gastos operativos editables y desglosados.
- Incluir vacancia, mantenimiento, administracion y reservas/CapEx.
- Mostrar puntos de decision accionables:
  - renta mensual necesaria para flujo de caja cero;
  - precio maximo para un cap rate objetivo;
  - vacancia maxima antes de que el NOI sea cero.
- Generar una pagina estatica optimizada para SEO en Astro.

---

## Alcance recomendado

### MVP

- Precio de compra o valor actual.
- Costos iniciales adicionales: cierre/adquisicion, remodelacion/equipamiento.
- Renta mensual bruta.
- Otros ingresos mensuales.
- Vacancia estimada.
- Gastos operativos desglosados y editables:
  - predial anual;
  - seguro anual;
  - cuota de mantenimiento/condominio mensual;
  - administracion mensual o porcentaje de renta;
  - mantenimiento/reserva mensual o porcentaje de renta;
  - otros gastos operativos anuales.
- Financiamiento opcional para flujo de caja:
  - enganche;
  - pago mensual o anual de deuda.
- Cap rate objetivo opcional.
- Resultados:
  - ingreso bruto anual;
  - ingreso efectivo tras vacancia;
  - NOI;
  - cap rate;
  - rendimiento bruto;
  - flujo de caja mensual y anual despues de deuda;
  - cash-on-cash return;
  - renta mensual de equilibrio;
  - precio maximo para cap rate objetivo;
  - vacancia maxima antes de NOI cero.
- Acciones: copiar resumen, limpiar formulario y exportar CSV.

### Fase 2

- Comparador de 2 a 4 propiedades.
- Plusvalia esperada y retorno total estimado.
- Escenarios de sensibilidad por renta, vacancia y gastos.
- Historial en `sessionStorage`.
- Grafica simple de composicion de ingresos/gastos.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL publica recomendada | `/inmuebles/calculadora-cap-rate-rentabilidad` |
| Archivo Astro recomendado | `src/pages/inmuebles/calculadora-cap-rate-rentabilidad.astro` |
| Logica de calculo | `src/lib/calculators/inmuebles/calculadora-cap-rate-rentabilidad/capRate.ts` |
| Pruebas unitarias | `src/lib/calculators/inmuebles/calculadora-cap-rate-rentabilidad/capRate.test.ts` |
| Categoria | `inmuebles` |
| Locale base | `es-MX` |
| Moneda base | `MXN`, simbolo `$` |

---

## Comportamiento mobile-first

- El primer resultado visible debe ser el cap rate.
- En el primer bloque de resultados mostrar tambien:
  - flujo mensual despues de deuda;
  - NOI anual;
  - cash-on-cash return cuando aplique.
- Usar una composicion vertical con secciones plegables o claramente separadas:
  - Propiedad;
  - Ingresos;
  - Gastos;
  - Financiamiento;
  - Resultados.
- Mantener los inputs principales en una sola columna en movil.
- Usar `inputmode="decimal"` en campos numericos.
- Permitir capturar gastos mensuales o anuales cuando sea natural para el usuario.
- Agrupar gastos en un bloque editable, con subtotales visibles.
- Mostrar el desglose anual como lista compacta o tabla de dos columnas en una
  seccion secundaria.
- Colocar acciones cerca de los resultados: copiar resumen, exportar CSV y limpiar.
- No etiquetar automaticamente un cap rate como bueno o malo.
- Mostrar interpretaciones neutrales y educativas, por ejemplo:
  - el cap rate no incluye deuda;
  - el flujo de caja si descuenta deuda;
  - el cash-on-cash depende del capital inicial invertido.
- Evitar tablas anchas en el primer viewport movil.

---

## Flujo principal MVP

**Ejemplo:** Propiedad de `$2,500,000`, renta mensual de `$18,000`, vacancia de
`5%`, gastos operativos anuales equivalentes a `$35,000`, remodelacion inicial
de `$120,000` y pago anual de deuda de `$120,000`. Cual es su cap rate, flujo
mensual y cash-on-cash return?

### Inputs del MVP

| Campo | Tipo | Rango valido | Valor por defecto |
|-------|------|--------------|-------------------|
| Precio de compra / valor actual | Texto numerico | `> 0` | vacio |
| Costos de cierre/adquisicion | Texto numerico | `>= 0` | `0` |
| Remodelacion/equipamiento inicial | Texto numerico | `>= 0` | `0` |
| Renta mensual bruta | Texto numerico | `>= 0` | vacio |
| Otros ingresos mensuales | Texto numerico | `>= 0` | `0` |
| Vacancia (%) | Texto numerico | `0%-100%` | `5` |
| Predial anual | Texto numerico | `>= 0` | `0` |
| Seguro anual | Texto numerico | `>= 0` | `0` |
| Cuota mantenimiento/condominio mensual | Texto numerico | `>= 0` | `0` |
| Administracion | Texto numerico | `>= 0` | `0` |
| Administracion como | Selector | `mensual` o `% renta` | `% renta` |
| Mantenimiento/reserva | Texto numerico | `>= 0` | `0` |
| Mantenimiento/reserva como | Selector | `mensual` o `% renta` | `% renta` |
| Otros gastos operativos anuales | Texto numerico | `>= 0` | `0` |
| Enganche / capital inicial | Texto numerico opcional | `>= 0` | `0` |
| Pago de deuda | Texto numerico opcional | `>= 0` | `0` |
| Pago de deuda como | Selector | `mensual` o `anual` | `mensual` |
| Cap rate objetivo (%) | Texto numerico opcional | `> 0` | vacio |

### Outputs principales

- Ingreso bruto anual.
- Perdida por vacancia.
- Ingreso efectivo tras vacancia.
- Gastos operativos anuales.
- NOI / ingreso operativo neto.
- Cap rate.
- Rendimiento bruto.
- Pago anual de deuda.
- Flujo de caja anual despues de deuda.
- Flujo de caja mensual despues de deuda.
- Capital inicial estimado.
- Cash-on-cash return.

### Outputs accionables

- Renta mensual necesaria para flujo de caja cero.
- Precio maximo para alcanzar el cap rate objetivo.
- Vacancia maxima antes de que el NOI llegue a cero.
- Diferencia entre cap rate y rendimiento bruto.

---

## Formulas

```text
ingreso_bruto_anual = (renta_mensual + otros_ingresos_mensuales) * 12
perdida_vacancia = ingreso_bruto_anual * (vacancia / 100)
ingreso_efectivo = ingreso_bruto_anual - perdida_vacancia

porcentaje_gasto_variable =
  (administracion / 100 si administracion_como = "% renta", si no 0)
  + (mantenimiento_reserva / 100 si mantenimiento_reserva_como = "% renta", si no 0)

gastos_variables_anuales = ingreso_bruto_anual * porcentaje_gasto_variable

gastos_fijos_operativos_anuales =
  predial_anual
  + seguro_anual
  + (cuota_mantenimiento_condominio_mensual * 12)
  + (administracion * 12 si administracion_como = "mensual", si no 0)
  + (mantenimiento_reserva * 12 si mantenimiento_reserva_como = "mensual", si no 0)
  + otros_gastos_operativos_anuales

gastos_operativos_anuales =
  gastos_fijos_operativos_anuales + gastos_variables_anuales

noi = ingreso_efectivo - gastos_operativos_anuales
cap_rate = (noi / valor_propiedad) * 100
rendimiento_bruto = (ingreso_bruto_anual / valor_propiedad) * 100

pago_anual_deuda =
  si pago_deuda_como = "mensual":
    pago_deuda * 12
  si pago_deuda_como = "anual":
    pago_deuda

flujo_caja_anual = noi - pago_anual_deuda
flujo_caja_mensual = flujo_caja_anual / 12

capital_inicial =
  si enganche > 0:
    enganche + costos_cierre + remodelacion_equipamiento
  si enganche = 0:
    valor_propiedad + costos_cierre + remodelacion_equipamiento

cash_on_cash_return = (flujo_caja_anual / capital_inicial) * 100
```

La deuda no se resta al calcular cap rate.

### Formulas de decision

```text
factor_ingreso_neto =
  (1 - vacancia / 100) - porcentaje_gasto_variable

ingreso_bruto_mensual_equilibrio =
  (gastos_fijos_operativos_anuales + pago_anual_deuda)
  / (12 * factor_ingreso_neto)

renta_mensual_equilibrio =
  ingreso_bruto_mensual_equilibrio - otros_ingresos_mensuales

precio_maximo_cap_rate_objetivo =
  noi / (cap_rate_objetivo / 100)

vacancia_maxima_noi_cero =
  100 * (1 - porcentaje_gasto_variable - (gastos_fijos_operativos_anuales / ingreso_bruto_anual))
```

Si algun denominador es cero o el resultado no es interpretable, mostrar un
estado vacio o mensaje neutral en lugar de `Infinity`, `NaN` o valores confusos.

---

## Validaciones y estados

- Valor de propiedad debe ser mayor que cero.
- Renta mensual bruta debe ser mayor o igual que cero.
- Vacancia debe estar entre 0% y 100%.
- Porcentajes de administracion, mantenimiento y cap rate objetivo no pueden ser negativos.
- Permitir NOI, flujo y cash-on-cash negativos.
- Gastos no pueden ser negativos.
- Pago de deuda no puede ser negativo.
- Capital inicial debe ser mayor que cero para calcular cash-on-cash.
- Si hay pago de deuda y enganche/capital inicial esta en cero, mostrar ayuda para capturarlo.
- Mostrar advertencia si todos los gastos operativos estan en cero.
- Mostrar advertencia si vacancia es cero, sin bloquear el calculo.
- Redondear porcentajes a 2 decimales.
- Redondear moneda a 0 o 2 decimales segun el patron existente del sitio.
- Evitar mostrar `NaN`, `Infinity` o `-Infinity`.

---

## Mensajes y ayudas contextuales

- Cap rate: "Mide el NOI anual dividido entre el valor de la propiedad. No incluye deuda."
- Rendimiento bruto: "Compara ingresos brutos contra valor de la propiedad, antes de vacancia y gastos."
- NOI: "Ingreso efectivo menos gastos operativos. No descuenta hipoteca ni impuestos personales."
- Flujo de caja: "NOI menos deuda. Puede ser negativo."
- Cash-on-cash: "Flujo anual dividido entre capital inicial invertido."
- Gastos en cero: "Una propiedad suele tener gastos operativos. Agrega una estimacion para un resultado mas realista."

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de cap rate y rentabilidad de alquiler` |
| Meta description | `Calcula cap rate, rendimiento bruto, NOI, flujo de caja y cash-on-cash return de una propiedad en alquiler con gastos y vacancia editables.` |
| H1 | `Calculadora de cap rate` |
| Keyword principal | `calculadora cap rate` |
| Keywords secundarias | `rentabilidad alquiler`, `ingreso operativo neto`, `rendimiento inmueble`, `cash on cash inmobiliario` |

### FAQs sugeridas

- Que es el cap rate?
- El cap rate incluye hipoteca?
- Que gastos se incluyen en NOI?
- Que diferencia hay entre cap rate y rendimiento bruto?
- Que es cash-on-cash return?
- Como calcular la renta minima para no perder dinero?
- Por que la vacancia cambia la rentabilidad?

---

## Pruebas sugeridas

- Calculo tipico produce ingreso bruto, vacancia, gastos, NOI y cap rate correctos.
- Vacancia 100% elimina ingreso efectivo.
- Pago de deuda afecta flujo, no cap rate.
- NOI negativo se muestra correctamente.
- Flujo negativo produce cash-on-cash negativo cuando hay capital inicial valido.
- Valor cero muestra error.
- Gastos operativos en cero muestran advertencia.
- Administracion como porcentaje se convierte correctamente a gasto anual.
- Administracion mensual se convierte correctamente a gasto anual.
- Pago de deuda mensual se anualiza correctamente.
- Cap rate objetivo calcula precio maximo correctamente.
- Renta de equilibrio considera vacancia, gastos, deuda y otros ingresos.
- Denominadores cero no muestran `NaN` ni `Infinity`.
