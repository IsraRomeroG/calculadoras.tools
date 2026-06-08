# Especificación v1 - Calculadora de VO2 máx estimado

## Descripción general

Herramienta para estimar VO2 máx con pruebas de campo como Cooper de 12 minutos
y Rockport de caminata. Debe aclarar que VO2 máx real se mide con pruebas de
laboratorio y que esta calculadora solo ofrece una aproximación.

**Arquitectura:** todo el cálculo ocurre en el cliente. No requiere backend,
base de datos ni llamadas a APIs externas.

---

## Objetivo de producto

- Estimar VO2 máx con métodos de campo.
- Permitir elegir Cooper o Rockport.
- Mostrar resultado en ml/kg/min.
- Incluir interpretación general sin diagnóstico.
- Generar una página estática optimizada para SEO en Astro.

---

## Alcance recomendado

### MVP

- Método Cooper: distancia en 12 minutos.
- Método Rockport: edad, sexo de fórmula, peso, tiempo de caminata de 1 milla y pulso final.
- Resultado principal en ml/kg/min.
- Copiar resultado y limpiar formulario.
- Aviso de seguridad cardiovascular visible.

### Fase 2

- Método de carrera de 1.5 millas.
- Tabla de referencia por edad y sexo con revisión editorial.
- Historial en `sessionStorage`.
- Enlace a pace para calcular tiempos.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL inmediata recomendada | `/salud/calculadora-vo2-max` |
| URL futura si existe Fitness | `/fitness/calculadora-vo2-max` |
| Archivo Astro recomendado | `src/pages/salud/calculadora-vo2-max.astro` |
| Lógica de cálculo | `src/lib/calculators/salud/calculadora-vo2-max/vo2Max.ts` |
| Pruebas unitarias | `src/lib/calculators/salud/calculadora-vo2-max/vo2Max.test.ts` |
| Categoría inmediata | `salud` |
| Categoría futura opcional | `fitness` |
| Locale base | `es-MX` |

---

## Comportamiento mobile-first

- Método como control segmentado.
- Mostrar solo inputs relevantes por método.
- Resultado principal con unidad `ml/kg/min`.
- Aviso visible antes de sugerir pruebas intensas.
- Evitar tablas normativas en el primer viewport.

---

## Flujo principal MVP

**Ejemplo Cooper:** Corrí `2400 m` en 12 minutos. ¿Cuál es mi VO2 máx estimado?

### Inputs Cooper

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Distancia recorrida | Texto numérico | `400-5000 m` | vacío |
| Unidad | Selector | `m`, `km`, `mi` | `m` |

### Inputs Rockport

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Edad | Texto numérico | `15-100` | vacío |
| Sexo de fórmula | Selector | `Masculino`, `Femenino` | vacío |
| Peso | Texto numérico | `20-250 kg` | vacío |
| Tiempo de 1 milla | Tiempo | `5-30 min` | vacío |
| Pulso al final | Texto numérico | `60-220 bpm` | vacío |

---

## Fórmulas

Cooper:

```text
vo2max = (distancia_metros - 504.9) / 44.73
```

Rockport:

```text
sexo = masculino ? 1 : 0
peso_lb = peso_kg * 2.2046226218
vo2max = 132.853
         - (0.0769 * peso_lb)
         - (0.3877 * edad)
         + (6.315 * sexo)
         - (3.2649 * tiempo_minutos)
         - (0.1565 * pulso_final)
```

---

## Validaciones y estados

- No sugerir la prueba Cooper a personas con síntomas o restricciones médicas.
- Distancia Cooper debe estar en rango.
- Rockport requiere todos sus campos.
- Pulso final debe estar entre `60` y `220 bpm`.
- Resultado menor a `10` o mayor a `90` debe mostrar advertencia de revisión.
- No clasificar con etiquetas clínicas en MVP.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de VO2 máx estimado` |
| Meta description | `Estima tu VO2 máx con prueba Cooper o Rockport. Resultado orientativo en ml/kg/min con fórmulas de campo.` |
| H1 | `Calculadora de VO2 máx` |
| Keyword principal | `calculadora vo2 max` |
| Keywords secundarias | `vo2 max cooper`, `test rockport vo2`, `capacidad aerobica calculadora` |

### FAQs sugeridas

- ¿Qué es VO2 máx?
- ¿Qué tan precisa es una prueba de campo?
- ¿Cuál es la diferencia entre Cooper y Rockport?
- ¿Necesito pulsómetro?

---

## Pruebas sugeridas

- Cooper con `2400 m` produce aproximadamente `46.81`.
- Conversión de `2.4 km` produce el mismo resultado.
- Rockport calcula usando peso en lb internamente.
- Pulso fuera de rango muestra error.
- Resultado extremo muestra advertencia.

