---
title: "Cómo convertir kilómetros a millas en Excel y Google Sheets"
seoTitle: "Convertir km a millas en Excel: fórmula y ejemplos"
description: "Aprende a convertir una columna de kilómetros a millas en Excel o Google Sheets con fórmulas, redondeo y conversión inversa."
pubDate: 2026-08-01
categorySlug: "conversores"
tags:
  - kilómetros a millas en Excel
  - Google Sheets
  - fórmulas de conversión
readTime: "5 min"
relatedCalculator:
  label: "Convertir kilómetros a millas"
  href: "/conversores/kilometros-a-millas"
sources:
  - label: "NIST Guide to the SI, Appendix B.9: Conversion Factors"
    url: "https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors/nist-guide-si-appendix-b9"
    publisher: "National Institute of Standards and Technology"
    accessedDate: 2026-07-28
  - label: "Función REDONDEAR"
    url: "https://support.microsoft.com/es-es/excel/functions/round-function"
    publisher: "Microsoft Support"
    accessedDate: 2026-07-28
  - label: "Google Sheets function list"
    url: "https://support.google.com/docs/table/25273"
    publisher: "Google Docs Editors Help"
    accessedDate: 2026-07-28
  - label: "Configurar la ubicación regional y los ajustes de cálculo"
    url: "https://support.google.com/docs/answer/58515?hl=es"
    publisher: "Google Docs Editors Help"
    accessedDate: 2026-07-28
methodologyNote: "Las fórmulas usan la equivalencia exacta 1 mi = 1.609344 km. Los ejemplos conservan el valor completo durante el cálculo y muestran dos decimales cuando se indica."
---

<!-- Revisión editorial: esta URL es una expansión P2 condicionada. Antes de desplegarla, confirmar en Search Console consultas sobre Excel, Google Sheets o fórmulas, salvo que se haya decidido expresamente ampliar el cluster de matemáticas aplicadas. -->

## Fórmula para convertir kilómetros a millas

Si la celda `A2` contiene una distancia en kilómetros, divídela entre `1.609344`:

```txt
=A2/1.609344
```

La fórmula funciona tanto en Excel como en Google Sheets cuando la hoja utiliza el punto como separador decimal. Por ejemplo, si `A2` contiene `10`, el resultado es:

```txt
6.213711922...
```

Es decir:

```txt
10 km ≈ 6.21 mi
```

El factor procede de la equivalencia exacta publicada por el [NIST](https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors/nist-guide-si-appendix-b9):

```txt
1 mi = 1.609344 km
```

En una configuración que use coma decimal, probablemente tendrás que escribir el factor como `1,609344`:

```txt
=A2/1,609344
```

La configuración regional de la hoja determina cuál de las dos variantes reconoce el programa.

## Cómo aplicarla a una columna

Organiza la hoja con los kilómetros en la columna `A` y las millas en la columna `B`:

```txt
A1: Kilómetros
B1: Millas
A2: 1
B2: =A2/1.609344
```

Después:

1. Selecciona la celda `B2`.
2. Sitúa el cursor sobre el controlador de relleno de la esquina inferior derecha.
3. Arrástralo hacia abajo hasta la última fila con una distancia.

La referencia cambiará de forma relativa: en `B3` será `=A3/1.609344`, en `B4` será `=A4/1.609344` y así sucesivamente.

Si prefieres mantener el factor visible y editable, escríbelo una sola vez, por ejemplo en `D1`:

```txt
D1: 1.609344
B2: =A2/$D$1
```

Los signos `$` convierten `D1` en una referencia absoluta. Al arrastrar la fórmula, `A2` cambia a `A3`, `A4` y las filas siguientes, pero `$D$1` permanece fijo.

Esta estructura también reduce problemas regionales: solo necesitas introducir correctamente el separador decimal en `D1`; la fórmula usa después una referencia de celda.

## Cómo redondear el resultado

Para devolver un valor redondeado a dos decimales, una instalación con funciones y separadores en inglés suele utilizar:

```txt
=ROUND(A2/1.609344,2)
```

En Excel con funciones localizadas al español, Microsoft documenta el nombre `REDONDEAR` y el punto y coma como separador de argumentos:

```txt
=REDONDEAR(A2/1,609344;2)
```

En Google Sheets puede aparecer una combinación distinta. Por ejemplo, si la hoja usa coma decimal pero conserva los nombres de funciones en inglés:

```txt
=ROUND(A2/1,609344;2)
```

No copies una variante sin revisar la configuración de tu archivo. La [documentación de Google Sheets](https://support.google.com/docs/answer/58515?hl=es) indica que la configuración regional afecta al formato numérico y que el idioma de las funciones puede ajustarse por separado.

También debes elegir entre **redondear el valor** o solo **limitar los decimales visibles**:

- `ROUND` o `REDONDEAR` devuelve un nuevo valor numérico ya redondeado.
- El formato de número con dos decimales cambia cómo se ve la celda, pero conserva la precisión del resultado para cálculos posteriores.
- Ninguna de las dos opciones modifica la distancia original guardada en `A2`.

Si vas a reutilizar las millas en otras operaciones, suele convenir mantener `=A2/1.609344` y aplicar formato de dos decimales. Usa `ROUND` o `REDONDEAR` cuando necesites que el resultado almacenado por la fórmula quede limitado a esa precisión.

## Fórmula inversa: millas a kilómetros

Si `A2` contiene millas terrestres y quieres obtener kilómetros, multiplica por `1.609344`:

```txt
=A2*1.609344
```

Con coma decimal:

```txt
=A2*1,609344
```

Por ejemplo, si `A2` contiene `10`:

```txt
10 × 1.609344 = 16.09344 km
```

Para devolver dos decimales, usa la variante compatible con tu configuración:

```txt
=ROUND(A2*1.609344,2)
=REDONDEAR(A2*1,609344;2)
```

Estas fórmulas convierten millas internacionales terrestres (`mi`), no millas náuticas.

## Ejemplo con una tabla de distancias

Esta tabla supone que los kilómetros están en la columna `A`, que la fórmula se escribe en la columna `B` y que el resultado mostrado se redondea a dos decimales:

| Kilómetros | Fórmula | Millas |
| ---: | --- | ---: |
| 1 | `=A2/1.609344` | 0.62 |
| 5 | `=A3/1.609344` | 3.11 |
| 10 | `=A4/1.609344` | 6.21 |
| 20 | `=A5/1.609344` | 12.43 |
| 42.195 | `=A6/1.609344` | 26.22 |
| 50 | `=A7/1.609344` | 31.07 |
| 100 | `=A8/1.609344` | 62.14 |

Los resultados completos tienen más cifras decimales. La columna “Millas” muestra dos para facilitar la lectura; no significa que el factor se haya reducido a `1.61`.

Puedes contrastar estas cifras con la [tabla de kilómetros a millas para distancias comunes](/blog/conversores/tabla-kilometros-a-millas-distancias-comunes).

## Errores comunes de configuración regional

Una fórmula correcta puede producir un error al pegarla en una hoja con otra configuración. Revisa estos tres elementos:

### Separador decimal

Según la región, un decimal puede escribirse con punto o con coma:

```txt
1.609344
1,609344
```

Si la hoja interpreta el factor como texto o divide la fórmula en partes incorrectas, prueba la convención utilizada por los demás números del archivo.

### Separador de argumentos

Las funciones con varios argumentos pueden usar coma o punto y coma:

```txt
=ROUND(A2/1.609344,2)
=REDONDEAR(A2/1,609344;2)
```

No confundas la coma decimal con el separador de argumentos. En configuraciones que usan coma para los decimales, el punto y coma suele separar los argumentos.

### Nombre de la función

Excel en inglés usa `ROUND`; Excel localizado al español muestra `REDONDEAR`. Google Sheets permite usar nombres de funciones en inglés o en otros idiomas compatibles, por lo que dos hojas con región española pueden no aceptar exactamente el mismo nombre.

Si aparece `#¿NOMBRE?`, `#NAME?` o un error de análisis, empieza escribiendo `=` y las primeras letras de la función. La lista de sugerencias de la propia hoja te mostrará el nombre disponible. También puedes evitar funciones para conservar el valor completo y utilizar solo:

```txt
=A2/1.609344
```

adaptando el separador decimal cuando corresponda.

## Comprueba una conversión individual

Una hoja de cálculo es útil para convertir decenas o cientos de filas. Para revisar una cifra antes de rellenar toda la columna, usa el [conversor de kilómetros a millas](/conversores/kilometros-a-millas).

Si el resultado no coincide:

1. Comprueba que estás dividiendo para pasar de kilómetros a millas.
2. Verifica que multiplicas para pasar de millas a kilómetros.
3. Revisa el separador decimal y el idioma de la función.
4. Compara el valor completo antes de aplicar redondeo.

La guía sobre [cómo convertir kilómetros a millas](/blog/conversores/como-convertir-kilometros-a-millas) explica por qué se utiliza el factor `1.609344`.

## Preguntas frecuentes

### ¿Cuál es la fórmula de km a millas en Excel?

Si `A2` contiene kilómetros, usa `=A2/1.609344`. En una configuración con coma decimal, la fórmula puede ser `=A2/1,609344`.

### ¿Cómo convierto toda una columna?

Escribe la fórmula en la primera fila de resultados y arrastra el controlador de relleno hacia abajo. Excel o Google Sheets cambiará `A2` por `A3`, `A4` y las referencias siguientes.

### ¿Cómo redondeo a dos decimales?

Usa `=ROUND(A2/1.609344,2)` en una configuración inglesa o `=REDONDEAR(A2/1,609344;2)` en una configuración española típica. Si necesitas conservar la precisión para otros cálculos, aplica formato de dos decimales en lugar de redondear la fórmula.

### ¿Por qué Excel muestra un error con la fórmula?

Las causas más habituales son un separador decimal incorrecto, usar coma en lugar de punto y coma entre argumentos, o escribir un nombre de función que no coincide con el idioma de Excel.

### ¿La fórmula funciona igual en Google Sheets?

La operación `=A2/1.609344` es la misma, pero puede ser necesario cambiar el punto por una coma. Para redondear, el nombre de la función y el separador de argumentos dependen de la configuración regional y del idioma de funciones elegido en Google Sheets.
