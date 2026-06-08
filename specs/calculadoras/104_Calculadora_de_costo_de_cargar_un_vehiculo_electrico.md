# Especificación v1 - Calculadora de costo de cargar un vehículo eléctrico

## Descripción general

Herramienta para estimar energía consumida, costo por carga y costo por distancia
de un vehículo eléctrico usando batería, eficiencia de carga y tarifa manual.

**Arquitectura:** todo el cálculo ocurre en el cliente. No requiere backend,
datos del vehículo ni tarifas externas.

---

## Objetivo de producto

- Estimar costo de una carga parcial o completa.
- Considerar pérdidas durante la carga.
- Calcular costo por kilómetro o por 100 km.
- Comparar carga doméstica y otra tarifa manual.
- Mostrar claramente capacidad, porcentaje y tarifa usados.

---

## Alcance recomendado

### MVP

- Capacidad útil de batería.
- Porcentaje inicial y final.
- Eficiencia de carga.
- Tarifa manual por kWh.
- Autonomía o consumo del vehículo.
- Energía de red, costo y costo por distancia.

### Fase 2

- Comparador de tarifas y horarios.
- Costo mensual según recorridos.
- Comparación manual contra combustible.
- Escenarios con varios cargadores.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL pública recomendada | `/energia/calculadora-costo-carga-vehiculo-electrico` |
| Archivo Astro recomendado | `src/pages/energia/calculadora-costo-carga-vehiculo-electrico.astro` |
| Lógica de cálculo | `src/lib/calculators/energia/calculadora-costo-carga-vehiculo-electrico/evChargingCost.ts` |
| Pruebas unitarias | `src/lib/calculators/energia/calculadora-costo-carga-vehiculo-electrico/evChargingCost.test.ts` |
| Categoría | `energia` |
| Locale base | `es-MX` |
| Moneda base | `MXN`, símbolo `$` |

---

## Comportamiento mobile-first

- Mostrar costo y energía tomada de la red arriba.
- Visualizar el cambio de porcentaje de batería.
- Presentar pérdidas de carga por separado.
- Alternar cálculo de distancia por autonomía o consumo.
- Mantener visible la tarifa manual.

---

## Flujo principal MVP

### Inputs del MVP

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Capacidad útil de batería | Texto numérico | `> 0 kWh` | vacío |
| Batería inicial | Texto numérico | `0%-100%` | `20%` |
| Batería final | Texto numérico | `0%-100%` | `80%` |
| Eficiencia de carga | Texto numérico | `> 0%-100%` | `90%` |
| Tarifa eléctrica | Texto numérico | `>= 0 por kWh` | vacío |
| Método de distancia | Selector | autonomía, consumo | consumo |
| Consumo del vehículo | Texto numérico | `> 0 kWh/100 km` | vacío |
| Autonomía completa | Texto numérico | `> 0 km` | vacío |

### Outputs principales

- Energía añadida a la batería.
- Energía tomada de la red.
- Pérdidas estimadas.
- Costo de la carga.
- Distancia añadida estimada.
- Costo por `100 km`.

---

## Fórmulas

```text
fraccion_cargada = (porcentaje_final - porcentaje_inicial) / 100
energia_bateria = capacidad_util_kWh * fraccion_cargada
energia_red = energia_bateria / eficiencia_carga
perdidas = energia_red - energia_bateria
costo_carga = energia_red * tarifa_kWh
```

Distancia:

```text
por_consumo: distancia = energia_bateria / consumo_kWh_100km * 100
por_autonomia: distancia = autonomia_completa * fraccion_cargada
costo_100km = distancia > 0 ? costo_carga / distancia * 100 : null
```

---

## Validaciones y estados

- Porcentaje final debe ser mayor que el inicial.
- Capacidad y eficiencia deben ser mayores que cero.
- Eficiencia no puede superar `100%`.
- Tarifa vacía permite calcular energía sin costo.
- Mostrar autonomía como estimación dependiente de conducción y condiciones.
- No confundir capacidad nominal con capacidad útil.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de costo de cargar un vehículo eléctrico` |
| Meta description | `Estima energía, pérdidas, costo por carga y costo por 100 km de un vehículo eléctrico con tarifa manual.` |
| H1 | `Calculadora de carga de vehículo eléctrico` |
| Keyword principal | `costo cargar vehículo eléctrico` |
| Keywords secundarias | `costo carga coche eléctrico`, `kWh carga auto eléctrico`, `costo por 100 km eléctrico` |

---

## Pruebas sugeridas

- Batería `60 kWh` del `20%` al `80%` añade `36 kWh`.
- Eficiencia menor a `100%` aumenta energía de red.
- Tarifa cero produce costo cero.
- Porcentaje final menor al inicial muestra error.
- Ambos métodos de distancia producen resultados coherentes.

