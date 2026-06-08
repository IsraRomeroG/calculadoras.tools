# Especificación v1 - Calculadora de retorno de inversión solar

## Descripción general

Herramienta para estimar el periodo de recuperación, retorno acumulado y valor
presente de una inversión en paneles solares usando costos y ahorros manuales.

**Arquitectura:** todo el cálculo ocurre en el cliente. No requiere backend ni
datos financieros externos.

---

## Objetivo de producto

- Estimar el tiempo necesario para recuperar la inversión.
- Proyectar ahorros, costos y flujo neto anual.
- Incluir degradación, mantenimiento y crecimiento tarifario.
- Mostrar ROI simple y métricas descontadas por separado.
- Evitar prometer rendimientos garantizados.

---

## Alcance recomendado

### MVP

- Inversión inicial, incentivos y financiamiento opcional.
- Ahorro anual inicial.
- Mantenimiento anual, degradación y aumento tarifario.
- Horizonte de análisis y tasa de descuento.
- Payback simple, ROI acumulado y tabla anual.

### Fase 2

- Flujo mensual.
- Comparador de escenarios.
- Reemplazo de inversor o batería.
- Integración con ahorro solar.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL pública recomendada | `/energia/calculadora-roi-solar` |
| Archivo Astro recomendado | `src/pages/energia/calculadora-roi-solar.astro` |
| Lógica de cálculo | `src/lib/calculators/energia/calculadora-roi-solar/solarRoi.ts` |
| Pruebas unitarias | `src/lib/calculators/energia/calculadora-roi-solar/solarRoi.test.ts` |
| Categoría | `energia` |
| Locale base | `es-MX` |
| Moneda base | `MXN`, símbolo `$` |

---

## Comportamiento mobile-first

- Mostrar periodo de recuperación y ROI acumulado arriba.
- Tabla anual como contenido secundario.
- Diferenciar métricas simples de métricas descontadas.
- Mostrar todos los supuestos junto a la proyección.
- Advertir cuando la inversión no se recupera dentro del horizonte.

---

## Flujo principal MVP

### Inputs del MVP

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Inversión inicial | Texto numérico | `> 0` | vacío |
| Incentivos / descuentos | Texto numérico | `>= 0` | `0` |
| Ahorro anual inicial | Texto numérico | `>= 0` | vacío |
| Mantenimiento anual | Texto numérico | `>= 0` | `0` |
| Degradación anual | Texto numérico | `0%-100%` | `0.5%` |
| Aumento anual de tarifa | Texto numérico | `>-100%` | `0%` |
| Tasa de descuento | Texto numérico | `>-100%` | `0%` |
| Horizonte | Texto numérico entero | `1-50 años` | `25` |

### Outputs principales

- Inversión neta inicial.
- Periodo de recuperación simple.
- ROI acumulado.
- Ahorro neto total.
- Valor presente neto.
- Tabla de flujo anual acumulado.

---

## Fórmulas

```text
inversion_neta = inversion_inicial - incentivos
ahorro_año_n =
  ahorro_inicial * (1 - degradacion)^(n - 1) * (1 + aumento_tarifa)^(n - 1)
flujo_neto_año_n = ahorro_año_n - mantenimiento_año_n
flujo_acumulado_n = -inversion_neta + suma(flujos_netos_1..n)
ROI = (suma_flujos_netos - inversion_neta) / inversion_neta * 100
VPN = -inversion_neta + suma(flujo_neto_n / (1 + tasa_descuento)^n)
```

El payback ocurre cuando el flujo acumulado pasa de negativo a cero o positivo;
puede interpolarse dentro del año para una estimación más precisa.

---

## Validaciones y estados

- Inversión inicial debe ser mayor que cero.
- Incentivos no deben superar inversión sin advertencia.
- Tasas no pueden ser menores o iguales a `-100%`.
- Horizonte debe ser entero positivo.
- Mostrar `No se recupera en el horizonte` cuando corresponda.
- Aclarar que ahorro, vida útil, costos e incentivos reales pueden variar.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de retorno de inversión solar` |
| Meta description | `Estima payback, ROI y valor presente de paneles solares con inversión, ahorro, degradación y mantenimiento editables.` |
| H1 | `Calculadora de ROI solar` |
| Keyword principal | `retorno inversión paneles solares` |
| Keywords secundarias | `ROI solar`, `payback paneles solares`, `rentabilidad energía solar` |

---

## Pruebas sugeridas

- Inversión `10000` y flujo anual `2000` recuperan en `5 años`.
- Degradación reduce ahorros futuros.
- Aumento tarifario incrementa ahorros futuros.
- Flujo insuficiente muestra que no se recupera.
- Tasa de descuento cero hace VPN igual al flujo acumulado final.
