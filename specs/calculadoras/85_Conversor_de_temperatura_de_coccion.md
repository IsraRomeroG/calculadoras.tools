# Especificación v1 - Conversor de temperatura de cocción

## Descripción general

Herramienta para convertir temperaturas de horno entre Celsius, Fahrenheit,
Kelvin y marcas de gas, además de consultar temperaturas internas mínimas seguras
en una tabla editorial separada. La temperatura del horno y la temperatura
interna del alimento nunca deben confundirse.

**Arquitectura:** la conversión ocurre en el cliente. La tabla de seguridad se
mantiene como datos locales con fuente y fecha de revisión.

---

## Objetivo de producto

- Convertir temperaturas de horno.
- Mostrar equivalencias aproximadas de marca de gas.
- Consultar temperaturas internas mínimas seguras por alimento.
- Reforzar el uso de termómetro de alimentos.
- Generar una página estática optimizada para SEO en Astro.

---

## Alcance recomendado

### MVP

- Conversión °C, °F y K.
- Tabla local de marcas de gas aproximadas.
- Tabla separada de temperaturas internas seguras con fuente oficial.
- Resultado principal y equivalencias frecuentes.
- Copiar resultado y limpiar formulario.

### Fase 2

- Ajustes orientativos para horno con ventilador.
- Presets de horneado comunes.
- Historial en `sessionStorage`.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL pública recomendada | `/cocina/conversor-temperatura-coccion` |
| Archivo Astro recomendado | `src/pages/cocina/conversor-temperatura-coccion.astro` |
| Lógica de cálculo | `src/lib/calculators/cocina/conversor-temperatura-coccion/cookingTemperature.ts` |
| Datos editoriales | `src/lib/calculators/cocina/conversor-temperatura-coccion/safeTemperatures.ts` |
| Pruebas unitarias | `src/lib/calculators/cocina/conversor-temperatura-coccion/cookingTemperature.test.ts` |
| Categoría | `cocina` |
| Locale base | `es-MX` |

---

## Comportamiento mobile-first

- Conversor de horno como experiencia principal.
- Tabla de seguridad claramente separada y etiquetada.
- Mostrar fuente y fecha de revisión junto a temperaturas internas.
- No depender solo del color para avisos de seguridad.
- Evitar presentar tiempos de cocción como garantía de seguridad.

---

## Flujo principal MVP

**Ejemplo:** Convertir `180 °C` a Fahrenheit y marca de gas aproximada.

### Inputs del MVP

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Temperatura | Texto numérico | válida según escala | vacío |
| Unidad origen | Selector | `°C`, `°F`, `K` | `°C` |
| Unidad destino | Selector | `°C`, `°F`, `K` | `°F` |
| Mostrar marca de gas | Toggle | sí/no | sí |

### Outputs principales

- Temperatura convertida.
- Equivalencias en las tres escalas.
- Marca de gas aproximada.
- Tabla separada de seguridad alimentaria.

---

## Fórmulas

```text
F = C * 9/5 + 32
C = (F - 32) * 5/9
K = C + 273.15
C = K - 273.15
```

Marca de gas:

```text
buscar el rango de temperatura más cercano en tabla local aproximada
```

La tabla de temperaturas internas seguras debe incluir categorías como aves,
carnes molidas, cortes enteros, pescados y sobras, con tiempo de reposo cuando
corresponda.

---

## Validaciones y estados

- Kelvin no puede ser menor que cero absoluto.
- Mostrar que marcas de gas son aproximadas y varían por horno.
- No inferir seguridad alimentaria desde temperatura del horno.
- Tabla editorial debe tener fuente y fecha de revisión.
- Recomendar verificar temperatura interna con termómetro.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Conversor de temperatura de cocción` |
| Meta description | `Convierte temperaturas de horno entre °C, °F, Kelvin y marca de gas, y consulta temperaturas internas seguras.` |
| H1 | `Conversor de temperatura de cocción` |
| Keyword principal | `temperatura coccion celsius fahrenheit` |
| Keywords secundarias | `temperatura horno`, `marca de gas horno`, `temperatura interna segura` |

---

## Referencias sugeridas

- USDA FSIS: tabla de temperatura interna mínima segura.
- FoodSafety.gov: temperaturas internas seguras de cocción.

---

## Pruebas sugeridas

- `180 °C` produce `356 °F`.
- `32 °F` produce `0 °C`.
- `0 K` produce `-273.15 °C`.
- Kelvin negativo muestra error.
- La tabla editorial incluye fuente y fecha.

