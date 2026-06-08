# Especificación v1 - Calculadora de repetición máxima / 1RM

## Descripción general

Herramienta para estimar la repetición máxima (1RM) a partir de un peso levantado
y el número de repeticiones realizadas. Debe ayudar a planificar cargas de
entrenamiento sin reemplazar supervisión técnica ni pruebas seguras.

**Arquitectura:** todo el cálculo ocurre en el cliente. No requiere backend,
base de datos ni llamadas a APIs externas.

---

## Objetivo de producto

- Estimar 1RM con fórmulas comunes.
- Mostrar porcentajes de entrenamiento derivados del 1RM.
- Permitir unidades kg y lb.
- Advertir que las estimaciones pierden precisión con muchas repeticiones.
- Generar una página estática optimizada para SEO en Astro.

---

## Alcance recomendado

### MVP

- Peso levantado.
- Repeticiones realizadas.
- Fórmula: Epley por defecto, Brzycki como alternativa.
- Resultado principal: 1RM estimado.
- Tabla de porcentajes: 50%, 60%, 70%, 75%, 80%, 85%, 90%, 95%.
- Copiar resultado y limpiar formulario.
- Aviso de seguridad visible.

### Fase 2

- Comparador de varias fórmulas.
- Cálculo de carga objetivo por repeticiones.
- Guardar últimos resultados en `sessionStorage`.
- Plantillas por ejercicio.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL inmediata recomendada | `/salud/calculadora-1rm-repeticion-maxima` |
| URL futura si existe Fitness | `/fitness/calculadora-1rm-repeticion-maxima` |
| Archivo Astro recomendado | `src/pages/salud/calculadora-1rm-repeticion-maxima.astro` |
| Lógica de cálculo | `src/lib/calculators/salud/calculadora-1rm-repeticion-maxima/oneRepMax.ts` |
| Pruebas unitarias | `src/lib/calculators/salud/calculadora-1rm-repeticion-maxima/oneRepMax.test.ts` |
| Categoría inmediata | `salud` |
| Categoría futura opcional | `fitness` |
| Locale base | `es-MX` |

---

## Comportamiento mobile-first

- Resultado principal en grande con unidad.
- Fórmula como selector compacto.
- Tabla de porcentajes en tarjetas o tabla con `overflow-x-auto`.
- Botón claro para alternar kg/lb.
- No incentivar intentos máximos sin calentamiento o supervisión.

---

## Flujo principal MVP

**Ejemplo:** Levanto `80 kg` por `5` repeticiones. ¿Cuál es mi 1RM estimado?

### Inputs del MVP

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Peso levantado | Texto numérico | `> 0` | vacío |
| Unidad | Selector | `kg`, `lb` | `kg` |
| Repeticiones | Texto numérico | `1-15` | `5` |
| Fórmula | Selector | `Epley`, `Brzycki` | `Epley` |

### Outputs principales

- 1RM estimado.
- Tabla de cargas por porcentaje.
- Nota de precisión según repeticiones.
- Fórmula utilizada.

---

## Fórmulas

Epley:

```text
one_rm = peso * (1 + repeticiones / 30)
```

Brzycki:

```text
one_rm = peso * (36 / (37 - repeticiones))
```

Porcentajes:

```text
carga_porcentaje = one_rm * (porcentaje / 100)
```

Si `repeticiones = 1`, el 1RM estimado debe ser igual al peso levantado.

---

## Validaciones y estados

- Peso debe ser mayor que cero.
- Repeticiones deben estar entre `1` y `15`.
- Si repeticiones son mayores a `10`, mostrar advertencia de menor precisión.
- Brzycki no debe permitir repeticiones `>= 37`; el rango del MVP evita ese caso.
- Redondear cargas a `0.5 kg` o `1 lb` según unidad.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora 1RM - Repetición máxima` |
| Meta description | `Estima tu repetición máxima con peso y repeticiones. Incluye porcentajes de entrenamiento y fórmulas Epley y Brzycki.` |
| H1 | `Calculadora de 1RM` |
| Keyword principal | `calculadora 1rm` |
| Keywords secundarias | `repeticion maxima`, `one rep max`, `calcular rm gimnasio` |

### FAQs sugeridas

- ¿Qué es 1RM?
- ¿Qué fórmula es mejor?
- ¿Por qué cambia el resultado con muchas repeticiones?
- ¿Es seguro probar mi 1RM real?

---

## Pruebas sugeridas

- `80 kg`, `5 reps`, Epley produce `93.33 kg`.
- `80 kg`, `1 rep` produce `80 kg`.
- Brzycki con `80 kg`, `5 reps` produce aproximadamente `90 kg`.
- Repeticiones `16` muestran error.
- Conversión kg/lb mantiene equivalencia interna.

