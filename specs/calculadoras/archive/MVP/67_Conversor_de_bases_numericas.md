# Especificación v2 - Conversor de bases numéricas

## Descripción general

Herramienta para convertir números enteros entre bases numéricas de 2 a 36.
Debe ser útil para estudiantes, programación, electrónica básica y trabajo con
representaciones numéricas, combinando una conversión precisa con ayudas
educativas opcionales.

**Arquitectura:** todo el cálculo ocurre en el cliente. No requiere backend,
base de datos ni llamadas a APIs externas.

---

## Objetivo de producto

- Convertir un número desde una base origen hacia una base destino principal.
- Mostrar equivalencias adicionales en binario, octal, decimal y hexadecimal.
- Soportar bases de 2 a 36 sin perder precisión en números enteros grandes.
- Validar los caracteres permitidos según la base seleccionada.
- Facilitar las conversiones comunes con accesos rápidos e intercambio de bases.
- Explicar opcionalmente el valor posicional para aportar valor educativo.
- Generar una página estática optimizada para SEO en Astro.

---

## Alcance recomendado

### MVP

- Número de entrada.
- Base origen y base destino.
- Accesos rápidos para bases 2, 8, 10 y 16.
- Base personalizada entre 2 y 36.
- Botón para intercambiar origen y destino.
- Resultado principal destacado.
- Equivalencias en binario, octal, decimal y hexadecimal.
- Conversión exacta de enteros mediante `BigInt`.
- Validación específica de caracteres y posiciones.
- Normalización de mayúsculas, espacios y separadores admitidos.
- Agrupación visual opcional de binario en bloques de cuatro bits.
- Explicación posicional plegable para entradas de longitud razonable.
- Copiar resultados.
- Ejemplos rápidos.
- Limpiar formulario.

### Fase 2

- Conversión de fracciones.
- Paso a paso para conversiones hacia una base distinta de decimal.
- Historial local de conversiones.
- Compartir una conversión mediante parámetros de URL.
- Representaciones técnicas opcionales: complemento a dos, bits con signo y
  tamaños de palabra de 8, 16, 32 o 64 bits.

---

## Ruta, categoría y archivos

| Elemento | Valor |
|----------|-------|
| URL pública canónica | `/programacion/conversor-de-bases-numericas` |
| Archivo Astro | `src/pages/programacion/conversor-de-bases-numericas.astro` |
| Lógica de cálculo | `src/lib/calculators/programacion/conversor-de-bases-numericas/numberBase.ts` |
| Pruebas unitarias | `src/lib/calculators/programacion/conversor-de-bases-numericas/numberBase.test.ts` |
| Categoría | `programacion` |
| Locale base | `es-MX` |

La URL anterior propuesta bajo `/conversores/` nunca debe publicarse ni
mantenerse como página duplicada. Esta especificación fija
`/programacion/conversor-de-bases-numericas` como la única ruta canónica desde
el lanzamiento.

### Categoría Programación

La categoría `programacion` debe existir desde el lanzamiento. Para publicar la
calculadora se debe:

1. Registrar `programacion` en `CATEGORY_SLUGS` y `CATEGORIES`, dentro de
   `src/lib/constants/categories.ts`.
2. Usar la etiqueta `Programación`.
3. Incluir una descripción orientada a calculadoras y herramientas para
   programación, sistemas numéricos, datos y desarrollo de software.
4. Registrar la calculadora con `categorySlug: "programacion"` y con su URL
   canónica.
5. Confirmar que la página dinámica de categoría se genera en `/programacion`
   y lista la calculadora.
6. Añadir la categoría a la navegación o directorio donde corresponda según el
   patrón vigente del proyecto.

No se requiere un redirect desde `/conversores/conversor-de-bases-numericas`
porque esa ruta no existe ni ha sido publicada. Si llegara a publicarse por
error antes del lanzamiento definitivo, se deberá eliminar la página duplicada
y añadir un redirect 301 en Apache hacia la URL canónica.

---

## Experiencia mobile first

### Orden de la interfaz

1. Número que se desea convertir.
2. Base origen.
3. Control para intercambiar las bases.
4. Base destino.
5. Resultado principal con acción de copiar.
6. Equivalencias adicionales.
7. Explicación posicional desplegable.
8. Ejemplos y contenido educativo.

### Reglas de diseño

- Usar una sola columna como composición base.
- Los selectores de base deben mostrar accesos rápidos para:
  `Binario (2)`, `Octal (8)`, `Decimal (10)`, `Hexadecimal (16)` y `Otra`.
- El intercambio de bases debe tener un botón táctil claro y conservar el valor
  de entrada cuando siga siendo válido; si no, debe mostrar la validación
  correspondiente.
- El resultado principal debe tener mayor jerarquía que las equivalencias.
- Las equivalencias se muestran como tarjetas compactas, no como una tabla.
- Los resultados largos deben usar tipografía monoespaciada, ajuste seguro o
  desplazamiento horizontal sin romper el layout.
- Los botones y controles táctiles deben tener al menos `44 × 44 px`.
- El botón de copiar debe mostrar feedback temporal, por ejemplo `Copiado`.
- Los errores se muestran debajo del campo relacionado y se anuncian mediante
  una región accesible.
- No depender exclusivamente del color para comunicar errores o selección.
- No usar librerías pesadas.
- A partir de `sm` o `md`, origen e intercambio y destino pueden alinearse en
  una fila, manteniendo el número y el resultado como elementos dominantes.

### Conversión y estados

- Convertir mientras el usuario escribe cuando la entrada sea válida.
- No mostrar un error agresivo durante el estado inicial vacío.
- Mantener visible el resultado anterior solo si está claramente marcado como
  desactualizado; preferentemente, limpiar resultados cuando la entrada deje de
  ser válida.
- En móvil, el campo debe seguir siendo de texto para permitir letras en bases
  mayores que 10. Se puede usar `inputmode="text"` y desactivar autocorrección,
  autocapitalización automática y corrector ortográfico.

---

## Flujo principal del MVP

**Ejemplo:** convertir hexadecimal `FF` a decimal.

1. El usuario introduce `FF`.
2. Selecciona `Hexadecimal (16)` como base origen.
3. Selecciona `Decimal (10)` como base destino.
4. La herramienta muestra `255` como resultado principal.
5. Debajo muestra las equivalencias:
   - Binario: `1111 1111` visualmente, `11111111` al copiar el valor puro.
   - Octal: `377`.
   - Decimal: `255`.
   - Hexadecimal: `FF`.
6. El usuario puede desplegar la explicación:
   `15 × 16¹ + 15 × 16⁰ = 255`.

---

## Entradas

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|---------------|-------------------|
| Número | Texto | entero válido según la base | vacío |
| Base origen | Selector con opción personalizada | `2-36` | `10` |
| Base destino | Selector con opción personalizada | `2-36` | `2` |

### Ejemplos rápidos

- `1010` de base 2 a base 10.
- `255` de base 10 a base 16.
- `FF` de base 16 a base 10.
- `Z` de base 36 a base 10.

Al elegir un ejemplo se deben completar el número, la base origen y la base
destino, y mostrar inmediatamente el resultado.

---

## Salidas

### Resultado principal

- Valor convertido a la base destino.
- Etiqueta con el nombre de la base y su número.
- Acción para copiar el valor normalizado sin espacios visuales.
- Acción secundaria opcional para copiar la equivalencia completa, por ejemplo:
  `FF₁₆ = 255₁₀`.

### Equivalencias adicionales

- Binario.
- Octal.
- Decimal.
- Hexadecimal.

Si alguna coincide con el resultado principal no debe duplicarse como una
tarjeta idéntica. Puede mantenerse dentro del bloque de equivalencias con menor
jerarquía o marcarse como `Resultado`.

### Explicación posicional

Para entradas cortas, mostrar opcionalmente:

```text
FF₁₆ = 15 × 16¹ + 15 × 16⁰ = 255₁₀
```

Para entradas largas, resumir o desactivar el desglose completo para evitar una
interfaz y un DOM excesivos. El valor exacto debe seguir calculándose.

---

## Normalización de la entrada

La herramienta debe:

- Aceptar letras en minúscula y normalizarlas a mayúscula.
- Eliminar espacios al inicio y al final.
- Permitir un signo `+` o `-` únicamente al inicio.
- Aceptar espacios internos y guiones bajos como separadores visuales, siempre
  que aparezcan entre dígitos.
- Eliminar los separadores antes de calcular.
- Aceptar opcionalmente los prefijos `0b`, `0o` y `0x` cuando coincidan con las
  bases 2, 8 y 16.
- Mostrar un error específico si el prefijo contradice la base origen.
- Normalizar `-0` y `+0` a `0`.
- No aceptar puntos decimales, comas decimales ni exponentes en el MVP.

Ejemplos válidos:

- `ff` en base 16.
- `0xFF` en base 16.
- `1010 1100` en base 2.
- `1010_1100` en base 2.
- `-Z` en base 36.

---

## Algoritmo y precisión

No usar `parseInt(numero, base)` como conversión principal, porque pasa por
`Number` y pierde precisión para enteros mayores que
`Number.MAX_SAFE_INTEGER`.

El MVP debe convertir la entrada normalizada a `BigInt` mediante acumulación
posicional:

```text
valor = 0n

para cada digito:
  valor_digito = indice del digito en "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  valor = valor * BigInt(base_origen) + BigInt(valor_digito)

aplicar signo al final
```

Para convertir a la base destino:

```text
resultado = valor.toString(base_destino).toUpperCase()
```

La explicación posicional puede derivarse de los mismos dígitos validados, sin
usar operaciones de punto flotante.

### Límite operativo

- Definir un límite inicial de `10 000` dígitos normalizados por entrada.
- Mostrar el contador o la restricción antes de alcanzar el límite.
- Rechazar entradas superiores con un mensaje claro, sin intentar calcularlas.
- El límite debe declararse como constante exportable y cubrirse con pruebas.

---

## Validaciones y mensajes

- La base origen y la base destino deben ser enteros entre `2` y `36`.
- Un número vacío no calcula y no muestra error al cargar la página.
- El signo sin dígitos no es válido.
- Los prefijos sin dígitos no son válidos.
- Cada carácter debe validarse contra la base origen.
- El error debe identificar el carácter inválido, su posición y la base:
  `El carácter "G" no es válido en base 16 (posición 3).`
- Los separadores no pueden aparecer repetidos, al inicio, al final ni junto al
  signo o al prefijo.
- Una base origen igual a la base destino es válida; el resultado debe ser la
  representación normalizada.
- No se admiten fracciones en el MVP.
- No se debe mostrar una advertencia de pérdida de precisión, porque el cálculo
  debe ser exacto con `BigInt`.

---

## Accesibilidad

- Asociar cada etiqueta con su control.
- El botón de intercambio debe tener un nombre accesible como
  `Intercambiar base origen y base destino`.
- Anunciar errores y cambios relevantes del resultado sin provocar lecturas
  repetitivas en cada pulsación.
- Permitir operar todos los controles con teclado.
- Mantener foco visible.
- Las tarjetas de resultados deben identificar claramente la base y el valor.
- Los subíndices usados en ejemplos son decorativos; la base también debe estar
  disponible como texto accesible.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Conversor de bases numéricas: binario, decimal y hexadecimal` |
| Meta description | `Convierte números exactos entre binario, octal, decimal, hexadecimal y bases de 2 a 36. Incluye validación y explicación paso a paso.` |
| H1 | `Conversor de bases numéricas` |
| Canonical | `/programacion/conversor-de-bases-numericas` |
| Keyword principal | `conversor de bases numéricas` |
| Keywords secundarias | `binario a decimal`, `hexadecimal a decimal`, `decimal a binario`, `conversor base 2 a base 10` |

### Contenido educativo sugerido

- Qué es una base numérica.
- Cómo leer los dígitos de bases mayores que 10.
- Cómo convertir una base a decimal mediante valor posicional.
- Diferencia entre representación numérica y valor.
- Usos del binario, octal y hexadecimal en programación.

### FAQs sugeridas

- ¿Qué es una base numérica?
- ¿Cómo convertir de binario a decimal?
- ¿Cómo convertir de hexadecimal a decimal?
- ¿Qué letras se usan en bases mayores que 10?
- ¿La calculadora admite números negativos?
- ¿Puedo convertir números enteros muy grandes?
- ¿Por qué no se admiten fracciones todavía?

---

## Pruebas unitarias mínimas

### Conversiones

- `FF` base 16 produce `255` en base 10.
- `255` base 10 produce `11111111` en base 2.
- `1010` base 2 produce `10` en base 10.
- `Z` base 36 produce `35` en base 10.
- `9007199254740993` base 10 conserva exactamente su valor.
- Un entero mayor que `Number.MAX_SAFE_INTEGER` se convierte correctamente a
  base 2 y base 16.
- Un número negativo conserva el signo en todas las bases.
- Base origen y destino iguales devuelven el valor normalizado.
- `-0` devuelve `0`.

### Normalización

- `ff` en base 16 se normaliza a `FF`.
- `0xFF` es válido en base 16.
- `0xFF` muestra incompatibilidad si la base origen es 10.
- `1010 1100` y `1010_1100` producen el mismo resultado que `10101100`.
- Espacios alrededor se ignoran.

### Errores

- El carácter `2` en base 2 muestra un error con su posición.
- El carácter `G` en base 16 muestra un error con su posición.
- Solo `-`, solo `+` y solo un prefijo son inválidos.
- Separadores al inicio, al final o repetidos son inválidos.
- Bases `1`, `37`, decimales o vacías son inválidas.
- Una entrada mayor que el límite operativo se rechaza.

### Interfaz

- Intercambiar bases actualiza origen, destino y resultado.
- Copiar usa el valor puro sin agrupación visual.
- La agrupación binaria no altera el valor copiado.
- Los ejemplos rápidos completan todos los campos esperados.
- Los resultados largos no desbordan el viewport móvil.

---

## Criterios de aceptación

1. La página existe únicamente en
   `/programacion/conversor-de-bases-numericas`.
2. La categoría `/programacion` existe y lista la calculadora.
3. La calculadora convierte enteros entre bases 2 y 36 sin pérdida de precisión.
4. El flujo principal funciona cómodamente en un viewport móvil de `320 px`.
5. El usuario puede elegir origen y destino, intercambiarlos y copiar el
   resultado.
6. Los errores identifican caracteres inválidos de forma específica.
7. Las equivalencias comunes y la explicación educativa no bloquean el flujo
   principal.
8. No existe una página duplicada bajo `/conversores/`.
