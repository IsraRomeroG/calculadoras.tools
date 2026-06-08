# Especificación v1 - Calculadora de huella de carbono personal

## Descripción general

Herramienta para estimar una huella de carbono personal anual a partir de
electricidad, transporte, vuelos, combustibles y otros hábitos, usando factores
de emisión capturados o seleccionados localmente.

**Arquitectura:** todo el cálculo ocurre en el cliente. No requiere backend ni
APIs externas. Los factores son editables y deben mostrarse como supuestos, no
como valores universales.

---

## Objetivo de producto

- Estimar emisiones anuales en kg y toneladas de CO2e.
- Desglosar emisiones por categoría y actividad.
- Hacer visible el factor de emisión de cada cálculo.
- Comparar un escenario actual contra uno alternativo.
- Evitar presentar el resultado como inventario certificado.

---

## Alcance recomendado

### MVP

- Lista editable de actividades.
- Categorías: hogar, transporte terrestre, vuelos, combustibles y otros.
- Cantidad, unidad, frecuencia y factor de emisión.
- Conversión a equivalente anual.
- Total en kg y toneladas de CO2e con desglose.
- Factores manuales y presets explicativos editables.

### Fase 2

- Comparador antes/después.
- Objetivo anual de reducción.
- Factores versionados por país y fuente.
- Exportación de inventario personal.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL pública recomendada | `/medio-ambiente/calculadora-huella-carbono-personal` |
| Archivo Astro recomendado | `src/pages/medio-ambiente/calculadora-huella-carbono-personal.astro` |
| Lógica de cálculo | `src/lib/calculators/medio-ambiente/calculadora-huella-carbono-personal/carbonFootprint.ts` |
| Factores opcionales | `src/lib/calculators/medio-ambiente/calculadora-huella-carbono-personal/factors.ts` |
| Pruebas unitarias | `src/lib/calculators/medio-ambiente/calculadora-huella-carbono-personal/carbonFootprint.test.ts` |
| Categoría | `medio-ambiente` |
| Locale base | `es-MX` |

---

## Factores y supuestos

Cada factor opcional debe incluir unidad, fuente, ámbito, periodo de referencia
y fecha de revisión.

```ts
interface EmissionFactor {
  id: string;
  label: string;
  category: string;
  unit: string;
  kgCo2ePerUnit: number;
  region?: string;
  referencePeriod?: string;
  sourceUrl?: string;
  reviewedAt?: string;
}
```

- Mostrar el factor aplicado junto a cada actividad.
- Permitir editarlo y marcar el resultado como manual.
- No mezclar factores con unidades incompatibles.
- No seleccionar automáticamente un factor regional sin confirmación.

---

## Comportamiento mobile-first

- Mostrar toneladas de CO2e anuales como resultado principal.
- Desglose por categoría ordenado de mayor a menor.
- Cada actividad como bloque editable con factor visible.
- Mostrar siempre la etiqueta `Estimación`.
- Incluir acceso a los supuestos sin ocultarlos en contenido secundario.

---

## Flujo principal MVP

### Inputs del MVP

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Nombre de actividad | Texto | 1-80 caracteres | `Actividad 1` |
| Categoría | Selector | hogar, transporte, vuelos, combustibles, otro | hogar |
| Cantidad | Texto numérico | `>= 0` | vacío |
| Unidad | Selector/texto | compatible con factor | vacío |
| Frecuencia | Selector | diaria, semanal, mensual, anual | mensual |
| Factor de emisión | Texto numérico | `>= 0 kg CO2e/unidad` | vacío o preset |
| Fuente / nota | Texto opcional | 0-200 caracteres | vacío |

### Outputs principales

- Huella total anual en kg CO2e.
- Huella total anual en toneladas CO2e.
- Emisiones por categoría.
- Emisiones por actividad.
- Porcentaje del total por categoría.
- Lista de factores y supuestos utilizados.

---

## Fórmulas

```text
cantidad_anual = normalizar_a_anual(cantidad, frecuencia)
emisiones_actividad_kg = cantidad_anual * factor_kg_CO2e_por_unidad
emisiones_totales_kg = suma(emisiones_actividad_kg)
emisiones_totales_t = emisiones_totales_kg / 1000
porcentaje_categoria = emisiones_categoria / emisiones_totales_kg * 100
```

CO2e agrupa distintos gases mediante sus factores equivalentes; la calculadora
no debe intentar derivarlos sin un factor proporcionado.

---

## Validaciones y estados

- Cantidad y factor no pueden ser negativos.
- La unidad de actividad debe coincidir con la unidad del factor.
- Actividades sin factor quedan fuera del total y muestran advertencia.
- Total cero no debe producir porcentajes inválidos.
- Distinguir factores con fuente de factores manuales.
- Aclarar que límites del inventario y metodología cambian el resultado.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de huella de carbono personal` |
| Meta description | `Estima tu huella de carbono anual por hogar, transporte y otras actividades usando factores de emisión editables.` |
| H1 | `Calculadora de huella de carbono personal` |
| Keyword principal | `huella de carbono personal` |
| Keywords secundarias | `calculadora CO2`, `emisiones personales`, `toneladas CO2e` |

Incluir un aviso visible de que el resultado es orientativo y no constituye un
inventario de emisiones certificado.

---

## Pruebas sugeridas

- `100 unidades` por factor `0.5` producen `50 kg CO2e`.
- Conversión de kg a toneladas divide entre `1000`.
- Frecuencia mensual multiplica por `12`.
- Unidad incompatible muestra error.
- Los porcentajes por categoría suman aproximadamente `100%`.

