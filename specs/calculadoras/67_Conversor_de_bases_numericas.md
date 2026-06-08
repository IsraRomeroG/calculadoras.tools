# Especificación v1 - Conversor de bases numéricas

## Descripción general

Herramienta para convertir números entre bases comunes: binario, octal, decimal
y hexadecimal. Debe servir para estudiantes, programación, electrónica básica y
trabajo con representaciones numéricas.

**Arquitectura:** todo el cálculo ocurre en el cliente. No requiere backend,
base de datos ni llamadas a APIs externas.

---

## Objetivo de producto

- Convertir un número desde una base origen a varias bases destino.
- Soportar bases de 2 a 36.
- Mostrar validación de caracteres según base.
- Explicar el valor posicional de forma opcional.
- Generar una página estática optimizada para SEO en Astro.

---

## Alcance recomendado

### MVP

- Número de entrada.
- Base origen.
- Resultados en binario, octal, decimal y hexadecimal.
- Base personalizada de 2 a 36.
- Copiar cada resultado.
- Limpiar formulario.

### Fase 2

- Paso a paso de conversión.
- Soporte BigInt para números muy grandes.
- Conversión de fracciones.
- Agrupación visual de bits.
- Historial en `sessionStorage`.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL inmediata recomendada | `/conversores/conversor-de-bases-numericas` |
| URL futura si existe Programación | `/programacion/conversor-de-bases-numericas` |
| Archivo Astro recomendado | `src/pages/conversores/conversor-de-bases-numericas.astro` |
| Lógica de cálculo | `src/lib/calculators/conversores/conversor-de-bases-numericas/numberBase.ts` |
| Pruebas unitarias | `src/lib/calculators/conversores/conversor-de-bases-numericas/numberBase.test.ts` |
| Categoría inmediata | `conversores` |
| Categoría futura opcional | `programacion` |
| Locale base | `es-MX` |

---

## Comportamiento mobile-first

- Input principal arriba con selector de base origen.
- Resultados como tarjetas compactas con botón copiar.
- Evitar tablas grandes.
- Mostrar caracteres válidos para la base seleccionada.
- No usar librerías pesadas en el MVP.

---

## Flujo principal MVP

**Ejemplo:** Convertir hexadecimal `FF` a decimal, binario y octal.

### Inputs del MVP

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Número | Texto | caracteres válidos según base | vacío |
| Base origen | Selector/número | `2-36` | `10` |
| Mostrar base personalizada | Toggle | sí/no | no |
| Base destino personalizada | Texto numérico | `2-36` | `2` |

### Outputs principales

- Decimal.
- Binario.
- Octal.
- Hexadecimal.
- Base personalizada si aplica.
- Estado de validación.

---

## Fórmulas y algoritmo

Validar dígitos:

```text
digitos_validos = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ".slice(0, base)
```

Convertir entrada a decimal:

```text
valor_decimal = parseInt(numero_normalizado, base_origen)
```

Convertir decimal a base destino:

```text
resultado = valor_decimal.toString(base_destino).toUpperCase()
```

Para MVP usar `Number` y advertir cuando el valor supere `Number.MAX_SAFE_INTEGER`.
BigInt queda para fase 2.

---

## Validaciones y estados

- Base debe estar entre `2` y `36`.
- Número vacío no calcula.
- Caracteres inválidos muestran error específico.
- Permitir signo negativo en MVP.
- No soportar decimales/fracciones en MVP.
- Si el resultado no es seguro por tamaño, mostrar advertencia.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Conversor de bases numéricas` |
| Meta description | `Convierte números entre binario, decimal, octal, hexadecimal y bases de 2 a 36 con validación de caracteres.` |
| H1 | `Conversor de bases numéricas` |
| Keyword principal | `conversor bases numericas` |
| Keywords secundarias | `binario a decimal`, `hexadecimal a decimal`, `decimal a binario` |

### FAQs sugeridas

- ¿Qué es una base numérica?
- ¿Cómo convierto hexadecimal a decimal?
- ¿Qué bases soporta la calculadora?
- ¿Por qué algunos números grandes muestran advertencia?

---

## Pruebas sugeridas

- `FF` base 16 produce decimal `255`.
- `255` base 10 produce binario `11111111`.
- `1010` base 2 produce decimal `10`.
- Caracter `2` en base 2 muestra error.
- Número negativo conserva signo.

