# Especificación v1 - Calculadora de consumo eléctrico del hogar en kWh

## Descripción general

Herramienta para estimar el consumo eléctrico total de un hogar a partir de una
lista de aparatos, su potencia, cantidad y tiempo de uso.

**Arquitectura:** todo el cálculo ocurre en el cliente. No requiere backend,
base de datos ni llamadas a APIs externas.

---

## Objetivo de producto

- Estimar consumo diario, mensual y anual en kWh.
- Identificar los aparatos con mayor consumo.
- Diferenciar claramente potencia en W de energía en kWh.
- Permitir capturar consumos medidos directamente.
- Generar una página estática optimizada para SEO en Astro.

---

## Alcance recomendado

### MVP

- Lista editable de aparatos.
- Potencia, cantidad, horas de uso y días activos.
- Modos `Por potencia` y `Consumo medido`.
- Consumo total y desglose por aparato.
- Copiar resumen, limpiar formulario y exportar CSV.

### Fase 2

- Agrupación por habitación.
- Comparador entre dos escenarios.
- Perfil de consumo por horario.
- Guardado en `localStorage`.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL pública recomendada | `/energia/calculadora-consumo-electrico-hogar` |
| Archivo Astro recomendado | `src/pages/energia/calculadora-consumo-electrico-hogar.astro` |
| Lógica de cálculo | `src/lib/calculators/energia/calculadora-consumo-electrico-hogar/homeConsumption.ts` |
| Pruebas unitarias | `src/lib/calculators/energia/calculadora-consumo-electrico-hogar/homeConsumption.test.ts` |
| Categoría | `energia` |
| Locale base | `es-MX` |

---

## Comportamiento mobile-first

- Consumo mensual visible como resultado principal.
- Cada aparato se muestra como bloque editable.
- Ordenar el desglose de mayor a menor consumo.
- Mostrar unidades junto a todos los campos y resultados.
- Etiquetar el resultado como estimación cuando no provenga de una medición.

---

## Flujo principal MVP

**Ejemplo:** Refrigerador de `150 W`, activo `8 horas equivalentes al día`
durante `30 días`.

### Inputs del MVP

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Modo | Selector | potencia, consumo medido | potencia |
| Nombre del aparato | Texto | 1-80 caracteres | `Aparato 1` |
| Potencia | Texto numérico | `> 0 W` | vacío |
| Cantidad | Texto numérico entero | `1-1000` | `1` |
| Horas de uso al día | Texto numérico | `0-24` | vacío |
| Días de uso al mes | Texto numérico entero | `0-31` | `30` |
| Consumo medido mensual | Texto numérico | `>= 0 kWh` | vacío |

### Outputs principales

- Consumo diario, mensual y anual.
- Consumo por aparato.
- Porcentaje del total por aparato.
- Aparato de mayor consumo.

---

## Fórmulas

Modo por potencia:

```text
consumo_mensual_kWh =
  (potencia_W / 1000) * cantidad * horas_dia * dias_mes
```

Resumen:

```text
total_mensual = suma(consumo_mensual_aparatos)
total_diario_promedio = total_mensual / dias_mes_referencia
total_anual = total_mensual * 12
porcentaje_aparato = consumo_aparato / total_mensual * 100
```

En modo medido, usar directamente el consumo capturado sin recalcularlo desde
potencia.

---

## Validaciones y estados

- Potencia debe ser mayor que cero en modo por potencia.
- Horas de uso no pueden superar `24` al día.
- Días de uso no pueden superar `31` al mes.
- No mezclar potencia nominal con consumo medido.
- Permitir aparatos con consumo cero.
- Aclarar que ciclos, modo de espera y eficiencia real pueden variar.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de consumo eléctrico del hogar en kWh` |
| Meta description | `Estima el consumo eléctrico diario, mensual y anual de tu hogar a partir de la potencia y uso de tus aparatos.` |
| H1 | `Calculadora de consumo eléctrico del hogar` |
| Keyword principal | `consumo eléctrico hogar kWh` |
| Keywords secundarias | `calcular kWh`, `consumo de luz`, `consumo eléctrico mensual` |

---

## Pruebas sugeridas

- `1000 W`, `1 hora` y `30 días` producen `30 kWh`.
- Dos aparatos iguales duplican el consumo.
- Modo medido conserva el valor capturado.
- Horas mayores a `24` muestran error.
- Los porcentajes del desglose suman aproximadamente `100%`.

