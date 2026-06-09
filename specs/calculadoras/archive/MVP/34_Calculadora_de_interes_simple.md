# Especificación v2 - Calculadora de interés simple

## Descripción general

Herramienta para calcular interés simple con capital, tasa y tiempo. Debe servir
para préstamos informales, ejercicios escolares, pagarés, inversiones sencillas
o cualquier caso donde los intereses no se capitalizan. La calculadora debe
aceptar tasas diarias, mensuales o anuales y explicar claramente los supuestos
utilizados.

**Arquitectura:** todo el cálculo ocurre en el cliente. No requiere backend,
base de datos ni llamadas a APIs externas.

---

## Objetivo de producto

- Calcular interés simple y monto final rápidamente.
- Permitir tasas y plazos expresados en días, meses o años.
- Convertir automáticamente la tasa y el plazo a una base temporal común.
- Mostrar resultados que ayuden a entender el costo o rendimiento real.
- Explicar la diferencia contra interés compuesto sin mezclar cálculos.
- Mostrar fórmula, sustitución de valores y supuestos utilizados.
- Generar una página estática optimizada para SEO en Astro.

---

## Alcance recomendado

### MVP

- Capital inicial.
- Tasa de interés diaria, mensual o anual.
- Plazo en días, meses o años.
- Convención de año civil de `365 días` o comercial de `360 días`.
- Resultado: interés generado, monto final e interés porcentual del plazo.
- Interés generado por unidad del plazo.
- Resumen textual del cálculo.
- Desglose de fórmula y supuestos.
- Modo inverso para calcular capital, tasa o tiempo puede quedar para fase 2.
- Usar ejemplo, copiar resultado y limpiar formulario.

### Fase 2

- Modos inversos: encontrar capital, tasa o tiempo.
- Comparación visual con interés compuesto.
- Cálculo mediante fechas exactas.
- Tabla de acumulación por periodo.
- Historial en `sessionStorage`.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL pública recomendada | `/finanzas/calculadora-de-interes-simple` |
| Archivo Astro recomendado | `src/pages/finanzas/calculadora-de-interes-simple.astro` |
| Lógica de cálculo | `src/lib/calculators/finanzas/calculadora-de-interes-simple/simpleInterest.ts` |
| Pruebas unitarias | `src/lib/calculators/finanzas/calculadora-de-interes-simple/simpleInterest.test.ts` |
| Categoría | `finanzas` |
| Locale base | `es-MX` |
| Moneda base | `MXN`, símbolo `$` |

---

## Comportamiento mobile-first

- Mantener un único modo visible en el MVP.
- Mostrar inicialmente solo capital, tasa, periodo de tasa, plazo y unidad.
- Inputs en una columna y resultado principal inmediatamente debajo.
- Agrupar visualmente `tasa + periodo` y `plazo + unidad`, sin reducir el área
  táctil de los controles.
- Usar controles con una altura mínima de `48px`.
- Calcular automáticamente cuando todos los valores sean válidos.
- Mostrar errores debajo del campo correspondiente, sin alertas modales.
- Anunciar cambios del resultado mediante `aria-live="polite"`.
- Mostrar fórmula, convención de días y supuestos en bloques colapsables o
  secciones secundarias.
- Mostrar los botones de copiar y limpiar a ancho completo en móvil.
- Evitar tablas extensas en la primera versión.
- Usar campos de texto con `inputmode="decimal"` para aceptar valores pegados.

### Orden recomendado en móvil

1. Capital inicial.
2. Tasa de interés y periodo de la tasa.
3. Plazo y unidad del plazo.
4. Opciones avanzadas.
5. Resultado principal y resumen.
6. Advertencias y supuestos.
7. Acciones de copiar y limpiar.
8. Fórmula y contenido educativo.

---

## Flujo principal MVP

**Ejemplo:** Presto `$10,000` al `12%` anual durante `18 meses`. ¿Cuánto interés
simple se genera y cuál será el total a pagar?

### Inputs del MVP

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Capital inicial | Texto numérico | `> 0` | vacío |
| Tasa de interés (%) | Texto numérico | `0%-200%` | vacío |
| Periodo de la tasa | Selector | `Diaria`, `Mensual`, `Anual` | `Anual` |
| Plazo | Texto numérico | `> 0` | vacío |
| Unidad de plazo | Selector | `Días`, `Meses`, `Años` | `Meses` |
| Convención de días | Selector avanzado | `365 días`, `360 días` | `365 días` |

### Outputs principales

- Interés generado.
- Total a pagar o recibir.
- Interés total porcentual durante el plazo.
- Interés generado por unidad del plazo seleccionada.
- Resumen textual con capital, tasa, plazo y convención utilizada.

### Outputs secundarios

- Tasa anual simple equivalente.
- Tiempo convertido a la unidad usada en el cálculo.
- Fórmula con valores sustituidos.
- Supuestos y limitaciones.

### Ejemplo de resultado

```text
Interés generado: $1,800.00
Total a pagar o recibir: $11,800.00
Interés total del plazo: 18%
Interés generado por mes: $100.00
```

Resumen:

```text
Cálculo con $10,000, tasa simple anual de 12% y plazo de 18 meses.
El capital permanece constante y los intereses no se capitalizan.
```

---

## Fórmulas

```text
P = capital
r = tasa_por_periodo / 100
n = cantidad_de_periodos_equivalentes
interes = P * r * n
monto_final = P + interes
interes_porcentual_plazo = r * n * 100
interes_por_unidad_del_plazo = interes / plazo
```

Conversión de plazo a periodos equivalentes:

```text
días_por_año = convención seleccionada: 365 o 360

plazo_en_días:
  días = plazo
  meses = plazo * días_por_año / 12
  años = plazo * días_por_año

cantidad_de_periodos_equivalentes:
  si periodo_tasa = diaria: plazo_en_días
  si periodo_tasa = mensual: plazo_en_días / (días_por_año / 12)
  si periodo_tasa = anual: plazo_en_días / días_por_año

tasa_anual_simple_equivalente:
  si periodo_tasa = diaria: tasa * días_por_año
  si periodo_tasa = mensual: tasa * 12
  si periodo_tasa = anual: tasa
```

No redondear valores intermedios. Redondear únicamente los valores mostrados.

---

## Validaciones y estados

- Capital debe ser mayor que cero.
- Tasa puede ser `0%`; en ese caso el interés es cero.
- Plazo debe ser mayor que cero.
- No aceptar tasas negativas.
- La tasa no puede superar `200%` por periodo.
- Mostrar una advertencia de revisión cuando la tasa anual simple equivalente
  supere `100%`.
- Si la tasa total del plazo supera `100%`, explicar que los intereses son
  mayores que el capital inicial.
- Aceptar valores pegados con símbolos monetarios, porcentaje y separadores
  comunes, por ejemplo `$10,000.50` y `10.000,50`.
- Distinguir entre campos vacíos, formatos inválidos, valores negativos y
  valores fuera de rango.
- Redondear moneda a 2 decimales.
- Mantener valores internos sin redondear durante todo el cálculo.

### Estados de resultado

- **Vacío:** invitar a completar los campos o usar el ejemplo.
- **Válido:** mostrar resultado, resumen, fórmula y acciones.
- **Con advertencias:** mostrar resultado junto con la advertencia contextual.
- **Inválido:** mantener visibles los campos y señalar errores específicos.

---

## Supuestos y límites de uso

La calculadora debe explicar que:

- El interés se calcula siempre sobre el capital inicial.
- Los intereses no generan nuevos intereses.
- La tasa permanece constante durante todo el plazo.
- No se consideran pagos parciales ni reducción de saldo.
- No se incluyen comisiones, impuestos, seguros ni intereses moratorios.
- La convención de `360` o `365` días puede cambiar el resultado.
- Los resultados son estimaciones educativas y no constituyen asesoría
  financiera ni una oferta de crédito.

Cuando el usuario necesite modelar pagos periódicos o reducción de saldo, enlazar
a la calculadora de préstamo. Cuando necesite capitalización, enlazar a la
calculadora de interés compuesto.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de interés simple` |
| Meta description | `Calcula interés simple con tasas diarias, mensuales o anuales. Obtén intereses, total a pagar y fórmula paso a paso.` |
| H1 | `Calculadora de interés simple` |
| Keyword principal | `calculadora interes simple` |
| Keywords secundarias | `formula interes simple`, `calcular interes simple`, `interes mensual`, `interes simple ejemplos` |

### FAQs sugeridas

- ¿Cuál es la fórmula del interés simple?
- ¿Cómo convierto una tasa mensual a anual?
- ¿Qué diferencia hay entre interés simple y compuesto?
- ¿Qué diferencia hay entre usar 360 y 365 días?
- ¿La calculadora sirve para préstamos?
- ¿El interés simple considera pagos parciales?

---

## Pruebas sugeridas

- `1000`, `10%`, `1 año` produce interés `100`.
- `1000`, `12%`, `6 meses` produce interés `60`.
- `10000`, `12% anual`, `18 meses` produce interés `1800`, monto final `11800`
  e interés total del plazo `18%`.
- `1000`, `2% mensual`, `6 meses` produce interés `120`.
- `1000`, `0.1% diario`, `30 días` produce interés `30`.
- Tasa `0%` produce monto final igual al capital.
- Un plazo en días produce resultados distintos usando convenciones de `360` y
  `365` cuando la tasa se expresa en meses o años.
- Inputs con símbolos monetarios y porcentajes se parsean correctamente.
- `$10,000.50` y `10.000,50` se interpretan correctamente.
- Valores intermedios no se redondean antes de calcular el resultado.
- Tasa anual simple equivalente superior a `100%` muestra advertencia.
- Errores se anuncian y vinculan con el campo correspondiente.
