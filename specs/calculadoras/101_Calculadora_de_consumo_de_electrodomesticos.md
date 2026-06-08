# Especificación v1 - Calculadora de consumo de electrodomésticos

## Descripción general

Herramienta enfocada en estimar el consumo y costo de uno o varios
electrodomésticos según potencia, ciclos de uso, modo de espera y tarifa
eléctrica manual.

**Arquitectura:** todo el cálculo ocurre en el cliente. No requiere backend ni
catálogo externo de productos.

---

## Objetivo de producto

- Estimar consumo y costo por electrodoméstico.
- Admitir uso continuo, horas diarias o ciclos.
- Incluir consumo en espera opcional.
- Comparar aparatos o hábitos de uso.
- Mostrar todos los supuestos editables.

---

## Alcance recomendado

### MVP

- Lista editable de electrodomésticos.
- Modos de uso por horas o ciclos.
- Potencia activa y potencia en espera.
- Tarifa manual por kWh.
- Consumo y costo mensual/anual por aparato.

### Fase 2

- Comparador entre aparato actual y eficiente.
- Escenarios antes/después.
- Plantillas locales opcionales sin marcas.
- Guardado en `localStorage`.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL pública recomendada | `/energia/calculadora-consumo-electrodomesticos` |
| Archivo Astro recomendado | `src/pages/energia/calculadora-consumo-electrodomesticos.astro` |
| Lógica de cálculo | `src/lib/calculators/energia/calculadora-consumo-electrodomesticos/applianceConsumption.ts` |
| Pruebas unitarias | `src/lib/calculators/energia/calculadora-consumo-electrodomesticos/applianceConsumption.test.ts` |
| Categoría | `energia` |
| Locale base | `es-MX` |

---

## Comportamiento mobile-first

- Mostrar consumo y costo mensual arriba.
- Cada electrodoméstico como bloque editable.
- Alternar campos según modo por horas o ciclos.
- Mostrar consumo activo y en espera por separado.
- Evitar valores de potencia predeterminados presentados como universales.

---

## Flujo principal MVP

### Inputs del MVP

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Nombre | Texto | 1-80 caracteres | `Electrodoméstico 1` |
| Modo de uso | Selector | horas, ciclos | horas |
| Potencia activa | Texto numérico | `> 0 W` | vacío |
| Horas de uso al día | Texto numérico | `0-24` | vacío |
| Duración por ciclo | Texto numérico | `> 0 horas` | vacío |
| Ciclos por semana | Texto numérico | `>= 0` | vacío |
| Potencia en espera | Texto numérico | `>= 0 W` | `0` |
| Tarifa eléctrica | Texto numérico | `>= 0 por kWh` | vacío |

### Outputs principales

- Consumo activo mensual.
- Consumo en espera mensual.
- Consumo total mensual y anual.
- Costo mensual y anual.
- Comparación entre aparatos.

---

## Fórmulas

Uso por horas:

```text
kWh_activos_mes = potencia_activa_W / 1000 * horas_dia * dias_mes
```

Uso por ciclos:

```text
ciclos_mes = ciclos_semana * 52 / 12
kWh_activos_mes =
  potencia_activa_W / 1000 * duracion_ciclo_horas * ciclos_mes
```

Modo de espera y costo:

```text
horas_espera_mes = max(0, horas_totales_mes - horas_activas_mes)
kWh_espera_mes = potencia_espera_W / 1000 * horas_espera_mes
costo_mes = (kWh_activos_mes + kWh_espera_mes) * tarifa_kWh
```

---

## Validaciones y estados

- Potencia activa debe ser mayor que cero.
- Horas activas no pueden superar las horas del periodo.
- Duración por ciclo debe ser mayor que cero.
- Tarifa vacía permite calcular consumo sin costo.
- Potencia en espera puede ser cero.
- Aclarar que potencia nominal y ciclos reales pueden variar.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de consumo de electrodomésticos` |
| Meta description | `Estima cuántos kWh y cuánto dinero consume cada electrodoméstico según potencia, horas, ciclos y modo de espera.` |
| H1 | `Calculadora de consumo de electrodomésticos` |
| Keyword principal | `consumo electrodomésticos` |
| Keywords secundarias | `cuánto consume un electrodoméstico`, `consumo standby`, `costo aparato eléctrico` |

---

## Pruebas sugeridas

- `1000 W` durante `1 hora` produce `1 kWh`.
- El modo por ciclos convierte semanas a promedio mensual.
- Potencia en espera cero produce consumo en espera cero.
- Tarifa vacía oculta costos sin impedir consumo.
- Horas activas imposibles muestran error.

