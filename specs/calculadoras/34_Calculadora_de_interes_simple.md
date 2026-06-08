# Especificación v1 - Calculadora de interés simple

## Descripción general

Herramienta para calcular interés simple con capital, tasa y tiempo. Debe servir
para préstamos informales, ejercicios escolares, pagarés, inversiones sencillas
o cualquier caso donde los intereses no se capitalizan.

**Arquitectura:** todo el cálculo ocurre en el cliente. No requiere backend,
base de datos ni llamadas a APIs externas.

---

## Objetivo de producto

- Calcular interés simple y monto final rápidamente.
- Permitir tiempo en días, meses o años.
- Explicar la diferencia contra interés compuesto sin mezclar cálculos.
- Mostrar fórmula y sustitución de valores.
- Generar una página estática optimizada para SEO en Astro.

---

## Alcance recomendado

### MVP

- Capital inicial.
- Tasa anual.
- Plazo en días, meses o años.
- Resultado: interés generado y monto final.
- Desglose de fórmula.
- Modo inverso para calcular capital, tasa o tiempo puede quedar para fase 2.
- Copiar resultado y limpiar formulario.

### Fase 2

- Modos inversos: encontrar capital, tasa o tiempo.
- Comparación visual con interés compuesto.
- Tabla por periodo.
- Historial en `sessionStorage`.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL pública recomendada | `/finanzas/calculadora-de-interes-simple` |
| Archivo Astro recomendado | `src/pages/finanzas/calculadora-de-interes-simple.astro` |
| Lógica de cálculo | `src/lib/calculators/finanzas/calculadora-de-interes-simple/simpleInterest.ts` |
| Pruebas unitarias | `src/lib/calculators/finanzas/calculadora-de-interes-simple/simpleInterest.test.ts` |
| Categoría | `finanzas` |
| Locale base | `es-MX` |
| Moneda base | `MXN`, símbolo `$` |

---

## Comportamiento mobile-first

- Mantener un único modo visible en el MVP.
- Inputs en una columna y resultado inmediatamente debajo.
- Mostrar fórmula en bloque colapsable o sección secundaria.
- Evitar tablas extensas en la primera versión.
- Usar campos de texto con `inputmode="decimal"` para aceptar valores pegados.

---

## Flujo principal MVP

**Ejemplo:** Presto `$10,000` al `12%` anual durante `18 meses`. ¿Cuánto interés
simple se genera?

### Inputs del MVP

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Capital inicial | Texto numérico | `> 0` | vacío |
| Tasa anual (%) | Texto numérico | `0%-200%` | vacío |
| Plazo | Texto numérico | `> 0` | vacío |
| Unidad de plazo | Selector | `Días`, `Meses`, `Años` | `Meses` |

### Outputs principales

- Interés generado.
- Monto final.
- Tiempo convertido a años.
- Interés mensual aproximado.
- Fórmula con valores sustituidos.

---

## Fórmulas

```text
P = capital
r = tasa_anual / 100
t = tiempo_en_años
interes = P * r * t
monto_final = P + interes
```

Conversión de plazo:

```text
días_a_años = días / 365
meses_a_años = meses / 12
años_a_años = años
```

---

## Validaciones y estados

- Capital debe ser mayor que cero.
- Tasa puede ser `0%`; en ese caso el interés es cero.
- Plazo debe ser mayor que cero.
- No aceptar tasas negativas.
- Si la tasa es muy alta, mostrar advertencia de revisión.
- Redondear moneda a 2 decimales.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de interés simple` |
| Meta description | `Calcula interés simple con capital, tasa anual y plazo en días, meses o años. Incluye fórmula y monto final.` |
| H1 | `Calculadora de interés simple` |
| Keyword principal | `calculadora interes simple` |
| Keywords secundarias | `formula interes simple`, `calcular interes simple`, `interes simple ejemplos` |

### FAQs sugeridas

- ¿Cuál es la fórmula del interés simple?
- ¿Qué diferencia hay entre interés simple y compuesto?
- ¿Puedo usar días en lugar de años?
- ¿La calculadora sirve para préstamos?

---

## Pruebas sugeridas

- `1000`, `10%`, `1 año` produce interés `100`.
- `1000`, `12%`, `6 meses` produce interés `60`.
- Tasa `0%` produce monto final igual al capital.
- Días se convierten usando 365.
- Inputs con símbolos monetarios se parsean correctamente.

