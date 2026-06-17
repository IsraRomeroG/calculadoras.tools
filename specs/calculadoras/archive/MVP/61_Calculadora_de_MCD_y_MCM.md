# Especificación v2 - Calculadora de MCD y MCM

## Descripción general

Herramienta para calcular el máximo común divisor (MCD) y mínimo común múltiplo
(MCM) de dos o más números enteros. Debe servir para tareas escolares, fracciones,
proporciones, simplificación y ejercicios básicos de aritmética.

La experiencia debe ayudar a entender el resultado, no solo mostrarlo. Por eso
el MVP debe incluir explicación paso a paso, comprobación del resultado y una
descomposición simple en factores primos cuando el tamaño de los números lo
permita.

**Arquitectura:** todo el cálculo ocurre en el cliente. No requiere backend,
base de datos ni llamadas a APIs externas.

---

## Objetivo de producto

- Calcular MCD y MCM de una lista de enteros.
- Mostrar procedimiento paso a paso con algoritmo de Euclides.
- Mostrar una comprobación breve del resultado.
- Mostrar factorización prima simple para reforzar el aprendizaje.
- Permitir separar números por coma, espacio o salto de línea.
- Manejar ceros, negativos y duplicados con reglas claras.
- Usar una experiencia mobile first, rápida de tocar y fácil de escanear.
- Generar una página estática optimizada para SEO en Astro.

---

## Alcance recomendado

### MVP

- Entrada de lista de números.
- Control segmentado: `MCD`, `MCM` o `Ambos`.
- Resultado principal.
- Procedimiento básico con algoritmo de Euclides.
- Comprobación del resultado.
- Descomposición en factores primos para entradas razonables.
- Copiar resultado.
- Copiar explicación.
- Limpiar formulario.
- Ejemplos rápidos como chips.

### Fase 2

- Tabla comparativa de factores primos.
- Simplificar fracción usando MCD.
- Historial en `sessionStorage`.
- Exportar procedimiento en texto con formato para tarea.
- Modo de práctica con ejercicios generados.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL pública recomendada | `/matematicas/calculadora-mcd-mcm` |
| Archivo Astro recomendado | `src/pages/matematicas/calculadora-mcd-mcm.astro` |
| Lógica de cálculo | `src/lib/calculators/matematicas/calculadora-mcd-mcm/gcdLcm.ts` |
| Pruebas unitarias | `src/lib/calculators/matematicas/calculadora-mcd-mcm/gcdLcm.test.ts` |
| Categoría | `matematicas` |
| Locale base | `es-MX` |

---

## Comportamiento mobile-first

La primera vista en móvil debe priorizar entrada, acción y resultado. El usuario
debe poder pegar números, cambiar el tipo de cálculo y ver la respuesta sin
desplazarse demasiado.

- Textarea compacto para la lista de números, con altura inicial de 3 a 4 líneas.
- Control segmentado táctil para `MCD`, `MCM` y `Ambos`.
- Cálculo automático con debounce corto o botón principal claramente visible.
- Resultado principal inmediatamente debajo del campo.
- Comprobación breve debajo del resultado.
- Procedimiento paso a paso en sección colapsable.
- Factorización prima en sección colapsable o bloque compacto.
- Ejemplos como chips en scroll horizontal.
- Botones táctiles de al menos `44px` de alto.
- No usar tablas grandes en el primer viewport.
- Evitar tarjetas anidadas; usar bloques claros y escaneables.

### Orden recomendado en móvil

1. H1 y descripción breve.
2. Textarea de números.
3. Control segmentado de cálculo.
4. Chips de ejemplos.
5. Resultado principal.
6. Comprobación.
7. Acciones: copiar resultado, copiar explicación, limpiar.
8. Procedimiento colapsable.
9. Factorización colapsable.
10. Contenido educativo y FAQs.

---

## Flujo principal MVP

**Ejemplo:** Ingreso `12, 18, 30`. ¿Cuál es el MCD y MCM?

### Inputs del MVP

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Números | Textarea | 2-50 enteros | vacío |
| Cálculo | Control segmentado | `MCD`, `MCM`, `Ambos` | `Ambos` |

### Outputs principales

- MCD.
- MCM.
- Lista normalizada de números.
- Procedimiento con pares procesados.
- Comprobación del resultado.
- Factorización prima simple.
- Advertencias por ceros, signos, duplicados o resultados grandes.

### Ejemplos rápidos sugeridos

| Chip | Intención |
|------|-----------|
| `12, 18, 30` | Caso común con MCD y MCM claros |
| `8, 12, 15` | Denominadores de fracciones |
| `42, 56` | Dos números con divisor común |
| `7, 13` | Números primos relativos |
| `0, 12` | Regla con cero |
| `-24, 36` | Números negativos |

---

## Parseo y normalización

La entrada acepta enteros separados por coma, espacio, tabulador o salto de
línea.

```text
tokens = entrada separada por /[\s,]+/
numeros = tokens parseados como enteros
valores = numeros.map(abs)
```

Reglas:

- Aceptar signos `+` y `-`, por ejemplo `+12` y `-18`.
- Ignorar espacios alrededor de los números.
- Rechazar decimales con punto, por ejemplo `1.5`.
- Interpretar `1,5` como dos enteros (`1` y `5`) porque la coma es separador; no se admite coma decimal.
- Rechazar texto mezclado como `12 a 18`.
- Rechazar separadores vacíos ambiguos como `12,,18` con mensaje claro antes de compactar separadores.
- Mantener duplicados en la lista normalizada, pero advertir que no cambian el MCD ni el MCM.
- Calcular con valor absoluto y mostrar nota cuando haya negativos.

Mensajes recomendados:

- `Escribe al menos 2 números enteros.`
- `No se aceptan decimales. Usa solo enteros.`
- `Revisa este valor: "{token}". Solo se permiten enteros.`
- `Hay separadores sin número entre ellos. Revisa la lista.`

---

## Fórmulas y algoritmo

Usar `BigInt` para el cálculo interno de MCD y MCM. Esto evita resultados
imprecisos cuando el MCM supera el rango seguro de `Number`.

MCD de dos números por Euclides:

```text
gcd(a, b):
  a = abs(a)
  b = abs(b)
  while b != 0:
    temp = b
    b = a % b
    a = temp
  return a
```

MCD de lista:

```text
mcd_lista = valores.reduce(gcd)
```

MCM de dos números:

```text
lcm(a, b):
  if a == 0 or b == 0:
    return 0
  return abs((a / gcd(a, b)) * b)
```

MCM de lista:

```text
mcm_lista = valores.reduce(lcm)
```

Reglas con cero:

```text
gcd(a, 0) = abs(a)
lcm(a, 0) = 0
```

Caso especial:

- Si todos los valores son `0`, mostrar nota: `El MCD de una lista formada solo por ceros no está definido de forma universal. Por convención, esta calculadora muestra 0.`

---

## Procedimiento y explicación

### Procedimiento con Euclides

Para listas de más de dos números, mostrar los pares procesados:

```text
MCD(12, 18) = 6
MCD(6, 30) = 6
Resultado: MCD = 6
```

Para MCM, mostrar que se reutiliza el MCD:

```text
MCM(12, 18) = |12 × 18| / MCD(12, 18) = 216 / 6 = 36
MCM(36, 30) = |36 × 30| / MCD(36, 30) = 1080 / 6 = 180
Resultado: MCM = 180
```

### Comprobación del resultado

Mostrar una comprobación corta y fácil de entender:

- MCD: `6 divide exactamente a 12, 18 y 30.`
- MCM: `180 es divisible entre 12, 18 y 30.`
- Cuando el MCD sea `1`: `Estos números son primos relativos entre sí.`
- Cuando el MCM sea `0`: `El MCM es 0 porque la lista contiene al menos un 0.`

### Factorización prima simple

Incluir en el MVP si los valores absolutos son razonables para factorizar en el
cliente. Si algún número excede el límite elegido, ocultar esta sección y mostrar
una nota no bloqueante.

Límite recomendado inicial: factorizar valores `<= 1,000,000`.

Ejemplo:

```text
12 = 2² × 3
18 = 2 × 3²
30 = 2 × 3 × 5
MCD: factores comunes con menor exponente = 2 × 3 = 6
MCM: factores presentes con mayor exponente = 2² × 3² × 5 = 180
```

---

## Validaciones y estados

- Requerir al menos 2 números.
- Aceptar negativos, pero calcular con valor absoluto.
- Aceptar ceros con reglas explícitas.
- No aceptar decimales.
- No aceptar valores vacíos entre separadores.
- Limitar a 50 números para evitar resultados enormes.
- Mostrar advertencia si el MCM supera `Number.MAX_SAFE_INTEGER`, aunque el cálculo interno use `BigInt`.
- Mostrar advertencia si el resultado tiene demasiados dígitos para una lectura cómoda.
- Mostrar estado vacío con ejemplos rápidos.
- Mostrar estado de error cerca del textarea y conservar la entrada del usuario.
- Deshabilitar copiar si no hay resultado válido.

---

## Copiado

### Copiar resultado

Formato recomendado:

```text
Números: 12, 18, 30
MCD: 6
MCM: 180
```

### Copiar explicación

Formato recomendado:

```text
Números: 12, 18, 30
MCD: 6
MCM: 180

Procedimiento:
MCD(12, 18) = 6
MCD(6, 30) = 6
MCM(12, 18) = 36
MCM(36, 30) = 180

Comprobación:
6 divide exactamente a 12, 18 y 30.
180 es divisible entre 12, 18 y 30.
```

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de MCD y MCM` |
| Meta description | `Calcula el máximo común divisor y mínimo común múltiplo de dos o más números con procedimiento paso a paso, comprobación y factores primos.` |
| H1 | `Calculadora de MCD y MCM` |
| Keyword principal | `calculadora mcd mcm` |
| Keywords secundarias | `maximo comun divisor`, `minimo comun multiplo`, `algoritmo de euclides`, `factores primos` |

### FAQs sugeridas

- ¿Qué es el MCD?
- ¿Qué es el MCM?
- ¿Cómo funciona el algoritmo de Euclides?
- ¿Cómo se calcula el MCD con factores primos?
- ¿Cómo se calcula el MCM con factores primos?
- ¿Se pueden usar números negativos?
- ¿Qué pasa si uno de los números es cero?
- ¿Qué significa que dos números sean primos relativos?

---

## Pruebas sugeridas

- `12, 18, 30` produce MCD `6` y MCM `180`.
- `7, 13` produce MCD `1` y MCM `91`.
- `0, 12` produce MCD `12` y MCM `0`.
- `0, 0` muestra MCD `0` con nota de convención y MCM `0`.
- `-24, 36` produce MCD `12` y MCM `72`.
- `12, 12, 18` conserva duplicados y produce MCD `6` y MCM `36`.
- `1.5, 3` muestra error por decimal.
- `1,5` se interpreta como dos enteros si el separador es coma; si se desea decimal, mostrar ayuda para aclarar que solo se aceptan enteros.
- `12,,18` muestra error por separador vacío.
- `12 a 18` muestra error por token inválido.
- Una lista de 51 números muestra error por límite máximo.
- Un MCM mayor que `Number.MAX_SAFE_INTEGER` se calcula con `BigInt` y muestra advertencia.
- Copiar resultado produce el formato esperado.
- Copiar explicación incluye procedimiento y comprobación.

