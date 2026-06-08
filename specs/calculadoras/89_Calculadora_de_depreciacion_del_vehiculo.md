# Especificación v1 - Calculadora de depreciación del vehículo

## Descripción general

Herramienta para estimar cómo disminuye el valor de un vehículo usando tasa
anual, depreciación lineal o valores inicial/final ingresados manualmente. El
resultado es orientativo y no sustituye un avalúo.

**Arquitectura:** todo el cálculo ocurre en el cliente. No requiere backend,
base de datos ni llamadas a APIs externas.

---

## Objetivo de producto

- Estimar valor futuro de un vehículo.
- Comparar depreciación porcentual y lineal.
- Mostrar pérdida acumulada y valor por año.
- Permitir tasa manual sin datos de mercado.
- Generar una página estática optimizada para SEO en Astro.

---

## Alcance recomendado

### MVP

- Modos `Porcentaje anual` y `Lineal`.
- Precio inicial.
- Tasa anual o valor residual.
- Plazo.
- Resultado: valor estimado, pérdida y tabla anual.
- Copiar resultado, limpiar formulario y exportar CSV.

### Fase 2

- Tasa distinta para primer año.
- Kilometraje como ajuste manual.
- Comparador de escenarios.
- Historial en `sessionStorage`.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL pública recomendada | `/vehiculos/calculadora-depreciacion-vehiculo` |
| Archivo Astro recomendado | `src/pages/vehiculos/calculadora-depreciacion-vehiculo.astro` |
| Lógica de cálculo | `src/lib/calculators/vehiculos/calculadora-depreciacion-vehiculo/depreciation.ts` |
| Pruebas unitarias | `src/lib/calculators/vehiculos/calculadora-depreciacion-vehiculo/depreciation.test.ts` |
| Categoría | `vehiculos` |
| Locale base | `es-MX` |
| Moneda base | `MXN`, símbolo `$` |

---

## Comportamiento mobile-first

- Resultado principal como valor estimado.
- Mostrar pérdida acumulada debajo.
- Tabla anual secundaria.
- Tasa manual visible en resumen.
- No presentar el valor como precio de mercado.

---

## Flujo principal MVP

**Ejemplo:** Vehículo de `$500,000`, depreciación de `15%` anual durante `5 años`.

### Inputs del MVP

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Modo | Selector | porcentaje anual, lineal | porcentaje anual |
| Valor inicial | Texto numérico | `> 0` | vacío |
| Depreciación anual (%) | Texto numérico | `0%-100%` | `15` |
| Valor residual | Texto numérico | `>= 0` | vacío |
| Plazo | Texto numérico entero | `1-50 años` | `5` |

### Outputs principales

- Valor estimado final.
- Pérdida acumulada.
- Porcentaje depreciado.
- Depreciación promedio anual.
- Tabla anual.

---

## Fórmulas

Porcentaje anual:

```text
valor_año_n = valor_inicial * (1 - tasa)^n
```

Lineal:

```text
depreciacion_anual = (valor_inicial - valor_residual) / años
valor_año_n = max(valor_residual, valor_inicial - depreciacion_anual * n)
```

Resumen:

```text
perdida = valor_inicial - valor_final
porcentaje_depreciado = (perdida / valor_inicial) * 100
```

---

## Validaciones y estados

- Valor inicial debe ser mayor que cero.
- Tasa entre 0% y 100%.
- Valor residual no puede superar valor inicial sin advertencia.
- Plazo debe ser entero positivo.
- Permitir tasa cero.
- Mostrar aviso de que mercado y condición real pueden diferir.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de depreciación del vehículo` |
| Meta description | `Estima la depreciación y valor futuro de un vehículo con tasa anual o método lineal y consulta una tabla por año.` |
| H1 | `Calculadora de depreciación de vehículo` |
| Keyword principal | `calculadora depreciacion vehiculo` |
| Keywords secundarias | `valor futuro auto`, `depreciacion coche`, `cuanto pierde valor un carro` |

---

## Pruebas sugeridas

- `$500000`, `15%`, `1 año` produce `$425000`.
- Tasa cero conserva valor.
- Método lineal alcanza valor residual.
- Residual mayor al inicial muestra advertencia.
- Tabla anual termina en el plazo indicado.

