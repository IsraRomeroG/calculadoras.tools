# Especificación v1 - Calculadora de ahorro con paneles solares

## Descripción general

Herramienta para estimar generación eléctrica solar y ahorro económico según
potencia instalada, horas solares pico, pérdidas, autoconsumo y tarifa manual.

**Arquitectura:** todo el cálculo ocurre en el cliente. No consulta irradiación,
clima ni tarifas externas; todos los supuestos son capturados manualmente.

---

## Objetivo de producto

- Estimar generación solar mensual y anual.
- Calcular ahorro por autoconsumo y excedentes.
- Mostrar cobertura del consumo eléctrico.
- Hacer visibles eficiencia, pérdidas y tarifas asumidas.
- Generar una página estática optimizada para SEO en Astro.

---

## Alcance recomendado

### MVP

- Consumo eléctrico mensual.
- Potencia total instalada o cantidad y potencia de paneles.
- Horas solares pico promedio.
- Factor de rendimiento o pérdidas.
- Porcentaje de autoconsumo y tarifa manual.
- Generación, ahorro y cobertura estimados.

### Fase 2

- Variación mensual.
- Comparador de tamaños de sistema.
- Escenario con batería.
- Integración con ROI solar.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL pública recomendada | `/energia/calculadora-ahorro-paneles-solares` |
| Archivo Astro recomendado | `src/pages/energia/calculadora-ahorro-paneles-solares.astro` |
| Lógica de cálculo | `src/lib/calculators/energia/calculadora-ahorro-paneles-solares/solarSavings.ts` |
| Pruebas unitarias | `src/lib/calculators/energia/calculadora-ahorro-paneles-solares/solarSavings.test.ts` |
| Categoría | `energia` |
| Locale base | `es-MX` |
| Moneda base | `MXN`, símbolo `$` |

---

## Comportamiento mobile-first

- Mostrar ahorro mensual y generación anual como resultados principales.
- Presentar cobertura del consumo con porcentaje y valores absolutos.
- Agrupar supuestos solares y económicos por separado.
- Mantener visibles horas solares, pérdidas y tarifas manuales.
- Etiquetar el resultado como estimación preliminar.

---

## Flujo principal MVP

### Inputs del MVP

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Consumo mensual | Texto numérico | `>= 0 kWh` | vacío |
| Potencia instalada | Texto numérico | `> 0 kWp` | vacío |
| Horas solares pico al día | Texto numérico | `0-24` | vacío |
| Factor de rendimiento | Texto numérico | `0%-100%` | `80%` |
| Autoconsumo | Texto numérico | `0%-100%` | `100%` |
| Tarifa de consumo evitado | Texto numérico | `>= 0 por kWh` | vacío |
| Tarifa de excedentes | Texto numérico | `>= 0 por kWh` | `0` |

### Outputs principales

- Generación mensual y anual.
- Energía autoconsumida y excedente.
- Cobertura del consumo.
- Ahorro mensual y anual.
- Consumo restante de la red.

---

## Fórmulas

```text
generacion_diaria_kWh =
  potencia_instalada_kWp * horas_solares_pico * factor_rendimiento
generacion_mensual = generacion_diaria_kWh * dias_mes
autoconsumida = min(consumo_mensual, generacion_mensual * porcentaje_autoconsumo)
excedente = max(0, generacion_mensual - autoconsumida)
ahorro = autoconsumida * tarifa_consumo_evitado
       + excedente * tarifa_excedentes
cobertura = consumo_mensual > 0 ? autoconsumida / consumo_mensual : null
```

---

## Validaciones y estados

- Potencia instalada debe ser mayor que cero.
- Horas solares pico deben estar entre `0` y `24`.
- Rendimiento y autoconsumo deben estar entre `0%` y `100%`.
- No valorar excedentes si la tarifa correspondiente está vacía.
- Consumo cero oculta cobertura y consumo restante.
- Aclarar que sombra, orientación, clima y regulación pueden cambiar resultados.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de ahorro con paneles solares` |
| Meta description | `Estima generación, cobertura y ahorro con paneles solares usando horas solares, pérdidas y tarifas manuales.` |
| H1 | `Calculadora de ahorro con paneles solares` |
| Keyword principal | `ahorro paneles solares` |
| Keywords secundarias | `generación solar estimada`, `cuánto ahorro con paneles`, `cobertura solar hogar` |

---

## Pruebas sugeridas

- `1 kWp`, `5` horas solares y `80%` producen `4 kWh/día`.
- Autoconsumo no supera consumo ni generación.
- Excedentes con tarifa cero no generan ahorro.
- Rendimiento mayor a `100%` muestra error.
- Consumo cero no produce división inválida.

