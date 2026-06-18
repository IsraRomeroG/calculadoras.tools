# Especificacion v2 - Calculadora de sistema de ecuaciones 2x2

## Descripcion general

Herramienta mobile-first para resolver sistemas lineales de dos ecuaciones con
dos incognitas:
`a1x + b1y = c1` y `a2x + b2y = c2`.

La calculadora debe mostrar si el sistema tiene solucion unica, no tiene
solucion o tiene infinitas soluciones. Ademas de entregar los valores de `x` e
`y`, debe explicar que significa el resultado, mostrar determinantes,
procedimiento y comprobacion sustituyendo la solucion en ambas ecuaciones.

**Arquitectura:** todo el calculo ocurre en el cliente. No requiere backend,
base de datos ni llamadas a APIs externas.

---

## Objetivo de producto

- Resolver sistemas 2x2 por determinantes usando la regla de Cramer.
- Mostrar resultado numerico y, cuando sea posible, resultado exacto en fraccion.
- Explicar el estado del sistema con una interpretacion geometrica simple.
- Mostrar comprobacion automatica sustituyendo `x` e `y` en las dos ecuaciones.
- Guiar al usuario con ejemplos rapidos y procedimiento paso a paso.
- Permitir coeficientes negativos, decimales con punto o coma decimal.
- Generar una pagina estatica optimizada para SEO en Astro.

---

## Valor para el usuario

La calculadora debe funcionar como apoyo educativo, no solo como extractor de
respuestas. Priorizar:

- Claridad inmediata: resultado principal visible antes del procedimiento.
- Confianza: comprobacion automatica de la solucion.
- Aprendizaje: interpretacion del tipo de sistema y pasos legibles.
- Practicidad: copiar resultado completo y cargar ejemplos de casos comunes.
- Usabilidad en movil: inputs comodos, sin tablas anchas ni elementos que
  obliguen a hacer zoom.

---

## Alcance recomendado

### MVP

- Inputs para 6 coeficientes en formato visual de ecuaciones.
- Selector de decimales `0-8`, con valor por defecto `4`.
- Resultado principal:
  - estado del sistema;
  - valores de `x` e `y` cuando existan;
  - fraccion exacta cuando el resultado sea racional y razonablemente corto;
  - interpretacion del resultado.
- Determinantes `D`, `Dx`, `Dy`.
- Procedimiento con regla de Cramer en acordeon.
- Comprobacion automatica sustituyendo la solucion en ambas ecuaciones.
- Copiar resultado completo.
- Limpiar formulario.
- Ejemplos rapidos: solucion unica, rectas paralelas, misma recta y decimales.
- Validacion de casos degenerados con coeficientes cero.

### Fase 1.5

- Campo opcional "Pegar sistema" que intente convertir texto como:

```text
2x + 3y = 13
x - y = 1
```

  en los seis coeficientes. Si el parser no reconoce el formato, debe mostrar
  un error claro sin bloquear el uso manual.

### Fase 2

- Metodo de eliminacion paso a paso.
- Grafica simple de rectas en SVG.
- Historial en `sessionStorage`.
- Exportar o compartir procedimiento en texto.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL publica recomendada | `/matematicas/calculadora-sistema-ecuaciones-2x2` |
| Archivo Astro recomendado | `src/pages/matematicas/calculadora-sistema-ecuaciones-2x2.astro` |
| Logica de calculo | `src/lib/calculators/matematicas/calculadora-sistema-ecuaciones-2x2/linearSystem2x2.ts` |
| Pruebas unitarias | `src/lib/calculators/matematicas/calculadora-sistema-ecuaciones-2x2/linearSystem2x2.test.ts` |
| Categoria | `matematicas` |
| Locale base | `es-MX` |

---

## Comportamiento mobile-first

- La primera pantalla debe mostrar el titulo, una descripcion breve y el bloque
  de calculo sin requerir scroll excesivo.
- En movil, mostrar cada ecuacion como una linea editable con inputs grandes:

```text
[a1]x + [b1]y = [c1]
[a2]x + [b2]y = [c2]
```

- Cada input debe tener label accesible aunque el layout visual sea compacto:
  `Coeficiente de x en la primera ecuacion`, etc.
- Usar `inputmode="decimal"`, `autocomplete="off"` y ayudas breves.
- El resultado principal debe aparecer antes del procedimiento.
- El procedimiento, determinantes y comprobacion deben ir en acordeones o
  secciones plegables en movil.
- Los ejemplos rapidos deben funcionar como chips horizontales con scroll.
- No usar grafica en el MVP.
- En desktop se puede usar layout de dos columnas: formulario a la izquierda y
  resultado a la derecha.
- Evitar tablas anchas, textos en botones que se corten y controles menores a
  44 px de alto.

---

## Flujo principal MVP

**Ejemplo:** Resolver:

```text
2x + 3y = 13
x - y = 1
```

### Inputs del MVP

| Campo | Tipo | Rango valido | Valor por defecto |
|-------|------|--------------|-------------------|
| a1 | Texto numerico | cualquier numero real finito | vacio |
| b1 | Texto numerico | cualquier numero real finito | vacio |
| c1 | Texto numerico | cualquier numero real finito | vacio |
| a2 | Texto numerico | cualquier numero real finito | vacio |
| b2 | Texto numerico | cualquier numero real finito | vacio |
| c2 | Texto numerico | cualquier numero real finito | vacio |
| Decimales | Selector | `0-8` | `4` |

### Outputs principales

- Sistema normalizado, por ejemplo: `2x + 3y = 13` y `x - y = 1`.
- Estado:
  - `solucion_unica`;
  - `sin_solucion`;
  - `infinitas_soluciones`;
  - `ecuacion_degenerada` cuando aplique como detalle interno o mensaje especial.
- Valor de `x` e `y` si hay solucion unica.
- Fraccion exacta si es posible, por ejemplo `x = 16/5 = 3.2`.
- Determinantes `D`, `Dx`, `Dy`.
- Interpretacion:
  - solucion unica: las rectas se cruzan en un punto;
  - sin solucion: las rectas son paralelas y distintas;
  - infinitas soluciones: ambas ecuaciones representan la misma recta.
- Procedimiento por regla de Cramer.
- Comprobacion sustituyendo la solucion en ambas ecuaciones.

---

## Formulas

Determinante principal:

```text
D = a1*b2 - a2*b1
```

Determinantes de Cramer:

```text
Dx = c1*b2 - c2*b1
Dy = a1*c2 - a2*c1
```

Si `D != 0`:

```text
x = Dx / D
y = Dy / D
```

Si `D = 0`:

```text
Dx = 0 y Dy = 0 => infinitas soluciones
Dx != 0 o Dy != 0 => sin solucion
```

Usar tolerancia para comparaciones con cero cuando haya decimales:

```text
EPSILON = 1e-10
```

---

## Reglas de interpretacion y casos especiales

### Sistema con solucion unica

Condicion:

```text
D != 0
```

Mostrar:

- `x = Dx / D`
- `y = Dy / D`
- Interpretacion: las dos rectas se cruzan en un unico punto.
- Comprobacion en ambas ecuaciones.

### Sistema sin solucion

Condicion general:

```text
D = 0 y (Dx != 0 o Dy != 0)
```

Mostrar:

- No existen valores de `x` e `y` que cumplan ambas ecuaciones.
- Interpretacion: las rectas son paralelas y distintas.

### Sistema con infinitas soluciones

Condicion general:

```text
D = 0, Dx = 0 y Dy = 0
```

Mostrar:

- El sistema no determina un unico punto.
- Interpretacion: ambas ecuaciones representan la misma recta.
- No mostrar valores unicos de `x` e `y`.

### Ecuaciones degeneradas

Evaluar explicitamente estos casos:

- `0x + 0y = 0`: ecuacion siempre verdadera.
- `0x + 0y = c` con `c != 0`: ecuacion imposible.
- Una ecuacion valida mas `0 = 0`: infinitas soluciones sobre la recta valida.
- Una ecuacion valida mas `0 = c`: sin solucion.
- Ambas ecuaciones `0 = 0`: infinitas soluciones en todo el plano.
- Ambas ecuaciones imposibles: sin solucion.

---

## Validaciones y estados

- Requerir todos los coeficientes para el modo manual.
- Aceptar negativos, decimales con punto y decimales con coma.
- Rechazar valores no finitos, letras sueltas y entradas incompletas como `-`,
  `+`, `.` o `,`.
- Normalizar separadores de miles cuando sea razonable.
- Usar tolerancia `1e-10` para comparar con cero.
- Evitar mostrar `-0`.
- Si el resultado redondeado cambia por los decimales elegidos, mantener los
  calculos internos con precision completa.
- Mostrar errores cerca del campo correspondiente y un resumen accesible si hay
  varios errores.

---

## Formato de numeros y fracciones

- Formatear numeros con locale `es-MX`.
- Respetar el selector de decimales para resultados visibles.
- Mostrar formato flexible en pasos intermedios para evitar ruido, por ejemplo
  `13` en vez de `13.0000`.
- Cuando `D`, `Dx` y `Dy` sean enteros seguros, simplificar `Dx/D` y `Dy/D`.
- Para decimales finitos, intentar convertir a fraccion con denominador razonable
  si no produce una fraccion demasiado larga.
- No mostrar fraccion exacta si puede confundir mas que ayudar.

---

## Copiar resultado

El texto copiado debe incluir:

```text
Calculadora de sistema de ecuaciones 2x2 - calculadoras.tools
Sistema:
2x + 3y = 13
x - y = 1

Estado: solucion unica
x = 16/5 = 3.2
y = 11/5 = 2.2

Determinantes:
D = -5
Dx = -16
Dy = -11

Comprobacion:
2(3.2) + 3(2.2) = 13
3.2 - 2.2 = 1

Procedimiento:
...
```

---

## Ejemplos rapidos

| Label | Sistema | Resultado esperado |
|-------|---------|--------------------|
| Solucion unica | `2x + 3y = 13`, `x - y = 1` | `x = 3.2`, `y = 2.2` |
| Paralelas | `x + y = 2`, `2x + 2y = 5` | sin solucion |
| Misma recta | `x + y = 2`, `2x + 2y = 4` | infinitas soluciones |
| Con decimales | `0.5x + y = 4`, `x - 0.25y = 1` | solucion unica |
| Ecuacion verdadera | `x + y = 2`, `0x + 0y = 0` | infinitas soluciones sobre una recta |

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de sistema de ecuaciones 2x2` |
| Meta description | `Resuelve sistemas de dos ecuaciones con dos incognitas usando determinantes, regla de Cramer, procedimiento y comprobacion paso a paso.` |
| H1 | `Calculadora de sistema 2x2` |
| Keyword principal | `calculadora sistema ecuaciones 2x2` |
| Keywords secundarias | `regla de cramer`, `resolver sistema lineal`, `dos ecuaciones dos incognitas`, `sistema 2x2 paso a paso` |

### FAQs sugeridas

- Que es un sistema 2x2?
- Que significa que el determinante sea cero?
- Que es la regla de Cramer?
- Puede haber infinitas soluciones?
- Como se comprueba la solucion de un sistema de ecuaciones?
- Que significa que dos rectas sean paralelas?

---

## Pruebas sugeridas

- `2x + 3y = 13`, `x - y = 1` produce `x=3.2`, `y=2.2`.
- El resultado anterior tambien muestra fracciones `x=16/5`, `y=11/5`.
- Sistema `x + y = 2`, `2x + 2y = 4` produce infinitas soluciones.
- Sistema `x + y = 2`, `2x + 2y = 5` produce sin solucion.
- `x + y = 2`, `0x + 0y = 0` produce infinitas soluciones sobre una recta.
- `x + y = 2`, `0x + 0y = 5` produce sin solucion.
- `0x + 0y = 0`, `0x + 0y = 0` produce infinitas soluciones en todo el plano.
- `0x + 0y = 1`, `0x + 0y = 2` produce sin solucion.
- Decimales se calculan con tolerancia.
- Inputs con coma decimal se aceptan.
- Coeficientes vacios muestran error.
- Entradas incompletas como `-` o `,` muestran error.
- No se muestra `-0`.
- El texto copiado contiene sistema, estado, determinantes, comprobacion y
  procedimiento.
