# Especificación v1 - Calculadora de entropía de contraseña

## Descripción general

Herramienta para estimar la entropía de una contraseña y el tamaño aproximado de
su espacio de búsqueda. Debe procesar todo localmente y evitar enviar, guardar o
registrar contraseñas.

**Arquitectura:** todo el cálculo ocurre en el cliente. No requiere backend,
base de datos ni llamadas a APIs externas. La contraseña nunca debe guardarse ni
salir del navegador.

---

## Objetivo de producto

- Estimar bits de entropía por longitud y conjunto de caracteres.
- Mostrar una interpretación orientativa de fortaleza.
- Detectar patrones simples como repetición, secuencias y contraseñas comunes locales.
- Explicar limitaciones del cálculo.
- Generar una página estática optimizada para SEO en Astro.

---

## Alcance recomendado

### MVP

- Campo de contraseña con opción mostrar/ocultar.
- Detección de conjuntos: minúsculas, mayúsculas, dígitos, símbolos.
- Entropía en bits.
- Espacio de búsqueda estimado.
- Tiempo estimado de búsqueda con velocidades manuales/predefinidas.
- Aviso fuerte de privacidad local.
- Limpiar formulario.

### Fase 2

- Lista local pequeña de contraseñas comunes.
- Estimación tipo zxcvbn si se decide agregar librería.
- Generador de contraseña local.
- Recomendaciones accionables sin mostrar la contraseña.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL inmediata recomendada | `/matematicas/calculadora-entropia-contrasena` |
| URL futura si existe Programación | `/programacion/calculadora-entropia-contrasena` |
| Archivo Astro recomendado | `src/pages/matematicas/calculadora-entropia-contrasena.astro` |
| Lógica de cálculo | `src/lib/calculators/matematicas/calculadora-entropia-contrasena/passwordEntropy.ts` |
| Pruebas unitarias | `src/lib/calculators/matematicas/calculadora-entropia-contrasena/passwordEntropy.test.ts` |
| Categoría inmediata | `matematicas` |
| Categoría futura opcional | `programacion` |
| Locale base | `es-MX` |

---

## Comportamiento mobile-first

- Aviso de privacidad visible cerca del input.
- Campo de contraseña con botón de mostrar/ocultar.
- Resultado principal en bits.
- No copiar ni persistir contraseña.
- No usar `localStorage`, `sessionStorage` ni parámetros de URL para el valor de contraseña.

---

## Flujo principal MVP

**Ejemplo:** Ingreso una contraseña de 12 caracteres con mayúsculas, minúsculas,
números y símbolos. ¿Cuánta entropía estimada tiene?

### Inputs del MVP

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Contraseña | Password/text | 0-256 caracteres | vacío |
| Velocidad de ataque | Selector | presets | `1e9 intentos/s` |
| Velocidad personalizada | Texto numérico opcional | `> 0` intentos/s | vacío |

### Presets de velocidad

| Preset | Intentos por segundo |
|--------|----------------------|
| Lento | `1e6` |
| Medio | `1e9` |
| Rápido | `1e12` |

### Outputs principales

- Bits de entropía estimados.
- Tamaño del conjunto de caracteres.
- Espacio de búsqueda.
- Tiempo estimado de búsqueda exhaustiva.
- Señales detectadas: longitud, variedad, repetición, secuencia.

---

## Fórmulas y algoritmo

Tamaño del conjunto:

```text
charset = 0
si contiene minúsculas: charset += 26
si contiene mayúsculas: charset += 26
si contiene dígitos: charset += 10
si contiene símbolos ASCII comunes: charset += cantidad_simbolos
si contiene otros Unicode: charset += estimación conservadora
```

Entropía:

```text
entropia_bits = longitud * log2(charset)
```

Tiempo estimado:

```text
combinaciones = 2 ^ entropia_bits
segundos_peor_caso = combinaciones / intentos_por_segundo
segundos_promedio = segundos_peor_caso / 2
```

Penalizaciones orientativas:

```text
si hay repetición fuerte, secuencia o contraseña común:
  mostrar advertencia, no necesariamente modificar entropía en MVP
```

---

## Validaciones y estados

- Contraseña vacía muestra estado vacío.
- No guardar ni enviar contraseña.
- Limitar longitud a 256 caracteres para UI.
- Si entropía es muy alta, formatear espacio de búsqueda en notación científica.
- No prometer seguridad real; explicar que filtraciones y patrones cambian el riesgo.
- Evitar mostrar la contraseña en resumen copiable.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de entropía de contraseña` |
| Meta description | `Estima bits de entropía, espacio de búsqueda y tiempo aproximado de ataque de una contraseña procesada localmente.` |
| H1 | `Calculadora de entropía de contraseña` |
| Keyword principal | `calculadora entropia contraseña` |
| Keywords secundarias | `password entropy`, `fortaleza contraseña`, `bits de entropia` |

### FAQs sugeridas

- ¿La contraseña se envía a algún servidor?
- ¿Qué son bits de entropía?
- ¿Por qué una contraseña larga puede ser débil?
- ¿La entropía garantiza seguridad?

---

## Pruebas sugeridas

- `aaaaaaaa` detecta minúsculas y repetición.
- `Abc123!@#` detecta cuatro conjuntos.
- Contraseña vacía muestra estado vacío.
- No se generan parámetros de URL con contraseña.
- Entropía usa `longitud * log2(charset)`.

