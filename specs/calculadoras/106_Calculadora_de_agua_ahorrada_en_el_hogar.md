# Especificación v1 - Calculadora de agua ahorrada en el hogar

## Descripción general

Herramienta para estimar cuánta agua y dinero puede ahorrar un hogar al comparar
un escenario base con uno eficiente para duchas, grifos, sanitarios, lavado y
otras actividades.

**Arquitectura:** todo el cálculo ocurre en el cliente. No requiere backend ni
datos externos; caudales, volúmenes, frecuencia y tarifa son manuales.

---

## Objetivo de producto

- Comparar consumo de agua antes y después de una medida.
- Estimar ahorro diario, mensual y anual.
- Separar actividades por caudal y por volumen por evento.
- Calcular ahorro económico opcional con tarifa manual.
- Mostrar todos los supuestos utilizados.

---

## Alcance recomendado

### MVP

- Lista editable de actividades.
- Modos `Caudal por minuto` y `Volumen por evento`.
- Valores base y eficiente.
- Personas, frecuencia y días de uso.
- Ahorro de agua y costo evitado con tarifa manual.

### Fase 2

- Comparador de medidas.
- Objetivo de ahorro.
- Captura de agua reutilizada.
- Guardado en `localStorage`.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL pública recomendada | `/medio-ambiente/calculadora-agua-ahorrada-hogar` |
| Archivo Astro recomendado | `src/pages/medio-ambiente/calculadora-agua-ahorrada-hogar.astro` |
| Lógica de cálculo | `src/lib/calculators/medio-ambiente/calculadora-agua-ahorrada-hogar/waterSavings.ts` |
| Pruebas unitarias | `src/lib/calculators/medio-ambiente/calculadora-agua-ahorrada-hogar/waterSavings.test.ts` |
| Categoría | `medio-ambiente` |
| Locale base | `es-MX` |
| Moneda base | `MXN`, símbolo `$` |

---

## Comportamiento mobile-first

- Mostrar litros ahorrados al mes como resultado principal.
- Presentar escenario base y eficiente lado a lado sin ocultar unidades.
- Cada actividad como bloque editable.
- Mostrar ahorro porcentual y económico como resultados secundarios.
- Evitar sugerir caudales predeterminados como mediciones reales.

---

## Flujo principal MVP

**Ejemplo:** Reducir una ducha de `10 L/min` a `7 L/min`, durante `8 minutos`,
una vez al día.

### Inputs del MVP

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Nombre de actividad | Texto | 1-80 caracteres | `Actividad 1` |
| Modo | Selector | caudal, volumen por evento | caudal |
| Caudal base | Texto numérico | `>= 0 L/min` | vacío |
| Caudal eficiente | Texto numérico | `>= 0 L/min` | vacío |
| Duración por evento | Texto numérico | `>= 0 min` | vacío |
| Volumen base por evento | Texto numérico | `>= 0 L` | vacío |
| Volumen eficiente por evento | Texto numérico | `>= 0 L` | vacío |
| Eventos por persona al día | Texto numérico | `>= 0` | `1` |
| Personas | Texto numérico entero | `>= 1` | `1` |
| Días al mes | Texto numérico entero | `0-31` | `30` |
| Tarifa de agua | Texto numérico opcional | `>= 0 por m³` | vacío |

### Outputs principales

- Consumo base mensual.
- Consumo eficiente mensual.
- Agua ahorrada diaria, mensual y anual.
- Ahorro porcentual.
- Metros cúbicos ahorrados.
- Ahorro económico opcional.

---

## Fórmulas

Modo por caudal:

```text
litros_evento_base = caudal_base_L_min * duracion_min
litros_evento_eficiente = caudal_eficiente_L_min * duracion_min
```

Resumen:

```text
eventos_mes = eventos_dia * personas * dias_mes
consumo_base_mes = litros_evento_base * eventos_mes
consumo_eficiente_mes = litros_evento_eficiente * eventos_mes
ahorro_litros_mes = consumo_base_mes - consumo_eficiente_mes
ahorro_porcentual =
  consumo_base_mes > 0 ? ahorro_litros_mes / consumo_base_mes * 100 : null
ahorro_m3_mes = ahorro_litros_mes / 1000
ahorro_economico = ahorro_m3_mes * tarifa_por_m3
```

---

## Validaciones y estados

- Caudales, volúmenes, duración y frecuencia no pueden ser negativos.
- Días al mes no pueden superar `31`.
- El escenario eficiente mayor al base muestra consumo adicional, no ahorro.
- Tarifa vacía permite calcular agua sin costo.
- Consumo base cero oculta ahorro porcentual.
- Aclarar que cobro por bloques y cargos fijos no están incluidos.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de agua ahorrada en el hogar` |
| Meta description | `Estima litros, metros cúbicos y costo de agua ahorrados al comparar hábitos y dispositivos del hogar.` |
| H1 | `Calculadora de ahorro de agua en el hogar` |
| Keyword principal | `agua ahorrada hogar` |
| Keywords secundarias | `calculadora ahorro agua`, `litros ahorrados`, `consumo agua ducha` |

---

## Pruebas sugeridas

- Reducir de `10` a `7 L/min` durante `10 min` ahorra `30 L` por evento.
- `1000 L` equivalen a `1 m³`.
- Escenario eficiente igual al base produce ahorro cero.
- Escenario eficiente mayor al base muestra ahorro negativo.
- Tarifa vacía oculta costo sin impedir cálculo de agua.

