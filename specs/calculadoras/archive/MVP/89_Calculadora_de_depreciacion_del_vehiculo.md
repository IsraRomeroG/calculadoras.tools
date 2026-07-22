# Especificación v1.1 - Calculadora de depreciación del vehículo

## Descripción general

Herramienta para estimar cómo disminuye el valor de un vehículo usando tasa
anual, depreciación lineal, tasa distinta para el primer año o valores
inicial/actual ingresados manualmente. El resultado es orientativo, se basa en
supuestos editables y no sustituye un avalúo ni una oferta real de mercado.

**Arquitectura:** todo el cálculo ocurre en el cliente. No requiere backend,
base de datos ni llamadas a APIs externas.

---

## Objetivo de producto

- Estimar valor futuro o depreciación ya observada de un vehículo.
- Comparar depreciación porcentual, lineal y escenarios de sensibilidad.
- Mostrar pérdida acumulada y valor por año.
- Permitir tasa manual sin datos de mercado y derivar una tasa anual equivalente
  cuando el usuario ingresa valor inicial y valor actual.
- Generar una página estática optimizada para SEO en Astro.

---

## Alcance recomendado

### MVP

- Modos `Porcentaje anual`, `Lineal` y `Valor observado`.
- Precio inicial.
- Tasa anual, valor residual o valor actual según el modo.
- Tasa distinta para primer año como opción avanzada.
- Plazo.
- Resultado: valor estimado, pérdida, porcentaje depreciado, depreciación
  promedio anual y tabla o detalle anual.
- Escenarios de sensibilidad editables o derivados de la tasa capturada.
- Copiar resultado, limpiar formulario y exportar CSV.

### Fase 2

- Kilometraje como ajuste manual.
- Comparador de escenarios.
- Historial en `sessionStorage`.
- Comparador de vehículos.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL pública recomendada | `/vehiculos/calculadora-de-depreciacion-del-vehiculo` |
| Archivo Astro recomendado | `src/pages/vehiculos/calculadora-de-depreciacion-del-vehiculo.astro` |
| Lógica de cálculo | `src/lib/calculators/vehiculos/calculadora-de-depreciacion-del-vehiculo/depreciation.ts` |
| Pruebas unitarias | `src/lib/calculators/vehiculos/calculadora-de-depreciacion-del-vehiculo/depreciation.test.ts` |
| Categoría | `vehiculos` |
| Locale base | `es-MX` |
| Moneda base | `MXN`, símbolo `$` |

Si la ruta anterior de la spec llegara a publicarse antes de esta corrección,
agregar redirección 301:

```apache
RewriteRule ^vehiculos/calculadora-depreciacion-vehiculo/?$ /vehiculos/calculadora-de-depreciacion-del-vehiculo [R=301,L]
```

---

## Comportamiento mobile-first

- Resultado principal como valor estimado.
- Mostrar pérdida acumulada debajo.
- Mostrar porcentaje depreciado y depreciación promedio anual como métricas
  compactas debajo del resultado.
- Tasa manual, tasa del primer año y modo visibles como chips de resumen.
- Inputs condicionales: ocultar campos que no aplican al modo seleccionado.
- En móvil, el detalle anual debe mostrarse como tarjetas compactas por año; en
  desktop puede presentarse como tabla. Si se usa tabla, envolverla en
  `overflow-x-auto`.
- Escenarios de sensibilidad como fila de tarjetas pequeñas o control
  horizontal, sin bloquear el resultado principal.
- No presentar el valor como precio de mercado.

---

## Flujo principal MVP

**Ejemplo:** Vehículo de `$500,000`, depreciación de `15%` anual durante `5 años`.

### Inputs del MVP

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Modo | Selector | porcentaje anual, lineal, valor observado | porcentaje anual |
| Valor inicial | Texto numérico | `> 0` | vacío |
| Depreciación anual (%) | Texto numérico | `0%-100%` | `15` |
| Tasa del primer año (%) | Texto numérico opcional | `0%-100%` | vacío |
| Valor residual | Texto numérico | `>= 0` y `<= valor inicial` | vacío |
| Valor actual/final | Texto numérico | `>= 0` y `<= valor inicial` | vacío |
| Plazo o años transcurridos | Texto numérico entero | `1-50 años` | `5` |
| Sensibilidad | Selector o controles compactos | conservador, base, agresivo | derivado de la tasa ingresada |

### Outputs principales

- Valor estimado final.
- Pérdida acumulada.
- Porcentaje depreciado.
- Depreciación promedio anual en dinero.
- Tasa anual equivalente.
- Detalle anual.
- Comparación de sensibilidad.

---

## Fórmulas

Porcentaje anual:

```text
sin_tasa_primer_año:
valor_año_n = valor_inicial * (1 - tasa)^n

con_tasa_primer_año:
valor_año_0 = valor_inicial
valor_año_n = valor_inicial * (1 - tasa_primer_año) * (1 - tasa)^(n - 1), para n >= 1
```

Lineal:

```text
depreciacion_anual = (valor_inicial - valor_residual) / años
valor_año_n = max(valor_residual, valor_inicial - depreciacion_anual * n)
```

Valor observado:

```text
perdida_observada = valor_inicial - valor_actual
porcentaje_depreciado = (perdida_observada / valor_inicial) * 100
tasa_anual_equivalente = 1 - (valor_actual / valor_inicial)^(1 / años_transcurridos)

valor_año_n = valor_inicial * (1 - tasa_anual_equivalente)^n
```

Sensibilidad:

```text
tasa_conservadora = max(0, tasa - 0.05)
tasa_base = tasa
tasa_agresiva = min(1, tasa + 0.05)
```

Resumen:

```text
perdida = valor_inicial - valor_final
porcentaje_depreciado = (perdida / valor_inicial) * 100
depreciacion_promedio_anual = perdida / años
tasa_anual_equivalente = 1 - (valor_final / valor_inicial)^(1 / años)
```

---

## Validaciones y estados

- Valor inicial debe ser mayor que cero.
- Tasa entre 0% y 100%.
- Tasa del primer año es opcional; si está vacía, usar la tasa anual general.
- Valor residual no puede superar valor inicial.
- Valor actual/final no puede superar valor inicial en modo depreciación.
- Plazo debe ser entero positivo.
- Permitir tasa cero.
- Si valor final es cero, la tasa anual equivalente puede mostrarse como `100%`
  cuando el plazo es válido.
- No convertir una apreciación en depreciación; si el valor ingresado supera el
  inicial, mostrar error y sugerir revisar datos.
- Mostrar aviso de que mercado y condición real pueden diferir.
- Los escenarios de sensibilidad no deben presentarse como datos de mercado.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de depreciación del vehículo` |
| Meta description | `Estima la depreciación y valor futuro de un vehículo con tasa anual, primer año distinto, método lineal o valor actual ingresado.` |
| H1 | `Calculadora de depreciación de vehículo` |
| Keyword principal | `calculadora depreciacion vehiculo` |
| Keywords secundarias | `valor futuro auto`, `depreciacion coche`, `cuanto pierde valor un carro` |

---

## Pruebas sugeridas

- `$500000`, `15%`, `1 año` produce `$425000`.
- `$500000`, `20%` primer año, `10%` anual y `2 años` produce `$360000`.
- Tasa cero conserva valor.
- Método lineal alcanza valor residual.
- Residual mayor al inicial muestra error y bloquea el cálculo.
- Valor observado de `$500000` a `$300000` en `5 años` produce pérdida de
  `$200000`, `40%` depreciado y tasa anual equivalente aproximada de `9.71%`.
- Detalle anual termina en el plazo indicado.
- En móvil, el detalle anual no depende de una tabla ancha como vista principal.

