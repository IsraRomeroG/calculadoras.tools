# Especificación v1 - Calculadora de inflación y poder adquisitivo

## Descripción general

Herramienta para estimar cómo cambia el poder adquisitivo de una cantidad de
dinero cuando el usuario ingresa una tasa de inflación manual. Debe responder
preguntas como "¿cuánto necesitaré en el futuro para comprar lo mismo?" y
"¿cuánto vale hoy una cantidad futura?".

**Arquitectura:** todo el cálculo ocurre en el cliente. No requiere backend,
base de datos ni llamadas a APIs externas. La inflación se captura manualmente.

---

## Objetivo de producto

- Calcular equivalencia futura de una cantidad actual.
- Calcular poder adquisitivo actual de una cantidad futura.
- Mostrar pérdida de poder adquisitivo con tasa y plazo manuales.
- Evitar depender de datos oficiales o tasas en vivo.
- Generar una página estática optimizada para SEO en Astro.

---

## Alcance recomendado

### MVP

- Modo `Valor futuro`: cuánto costará algo en el futuro.
- Modo `Valor presente`: cuánto vale hoy una cantidad futura.
- Cantidad base, inflación anual y plazo.
- Resultado principal, pérdida acumulada y tabla anual.
- Copiar resultado, limpiar formulario y exportar CSV.
- Aviso: la tasa es ingresada por el usuario y puede no reflejar inflación real.

### Fase 2

- Comparar dos tasas de inflación.
- Agregar crecimiento de salario o rendimiento.
- Simular inflación mensual.
- Historial en `sessionStorage`.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL pública recomendada | `/finanzas/calculadora-de-inflacion-poder-adquisitivo` |
| Archivo Astro recomendado | `src/pages/finanzas/calculadora-de-inflacion-poder-adquisitivo.astro` |
| Lógica de cálculo | `src/lib/calculators/finanzas/calculadora-de-inflacion-poder-adquisitivo/inflation.ts` |
| Pruebas unitarias | `src/lib/calculators/finanzas/calculadora-de-inflacion-poder-adquisitivo/inflation.test.ts` |
| Categoría | `finanzas` |
| Locale base | `es-MX` |
| Moneda base | `MXN`, símbolo `$` |

---

## Comportamiento mobile-first

- Usar control segmentado para `Valor futuro` y `Valor presente`.
- Resultado principal visible antes de la tabla anual.
- Incluir una explicación corta de la tasa manual cerca del input.
- La tabla anual debe ser secundaria y colapsable si el plazo es largo.
- No usar gráficas pesadas en el MVP.

---

## Flujo principal MVP

**Ejemplo:** Si algo cuesta `$10,000` hoy y la inflación promedio es `5%` anual,
¿cuánto costará en `10 años`?

### Inputs del MVP

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Modo | Selector | `Valor futuro`, `Valor presente` | `Valor futuro` |
| Cantidad | Texto numérico | `> 0` | vacío |
| Inflación anual (%) | Texto numérico | `0%-100%` | vacío |
| Plazo | Texto numérico | `> 0` | vacío |
| Unidad de plazo | Selector | `Meses`, `Años` | `Años` |

### Outputs principales

- Valor futuro o valor presente.
- Inflación acumulada.
- Pérdida de poder adquisitivo.
- Equivalencia anual en tabla.
- Fórmula utilizada.

---

## Fórmulas

```text
monto = cantidad
i = inflacion_anual / 100
t = plazo_en_años
```

Valor futuro:

```text
valor_futuro = monto * (1 + i)^t
inflacion_acumulada = ((1 + i)^t - 1) * 100
```

Valor presente:

```text
valor_presente = monto / (1 + i)^t
perdida_poder_adquisitivo = monto - valor_presente
```

Para plazo en meses:

```text
t = meses / 12
```

---

## Validaciones y estados

- Cantidad debe ser mayor que cero.
- Inflación puede ser `0%`; en ese caso valor futuro y presente no cambian.
- No aceptar inflación negativa en MVP.
- Si la inflación supera `30%`, mostrar advertencia de tasa alta.
- Redondear moneda a 2 decimales y porcentajes a 2 decimales.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de inflación y poder adquisitivo` |
| Meta description | `Calcula cuánto necesitarás en el futuro o cuánto vale hoy una cantidad usando una tasa de inflación manual.` |
| H1 | `Calculadora de inflación` |
| Keyword principal | `calculadora inflacion` |
| Keywords secundarias | `poder adquisitivo`, `valor futuro con inflacion`, `valor presente inflacion` |

### FAQs sugeridas

- ¿La calculadora usa inflación oficial?
- ¿Cómo se calcula el valor futuro con inflación?
- ¿Qué es poder adquisitivo?
- ¿Por qué la tasa se ingresa manualmente?

---

## Pruebas sugeridas

- `1000`, `10%`, `1 año` produce valor futuro `1100`.
- `1100`, `10%`, `1 año` produce valor presente `1000`.
- Inflación `0%` conserva el monto.
- Plazo en meses se convierte correctamente a años.
- Tasa alta muestra advertencia sin bloquear el cálculo.

