# Especificación — Calculadora de porcentajes

## Descripción general
Herramienta multipropósito para resolver los 5 casos de uso más frecuentes
relacionados con porcentajes. El usuario elige el tipo de cálculo que necesita
y la interfaz muestra solo los campos relevantes.

**Arquitectura:** Todo el cálculo ocurre en el cliente (JavaScript). Esta calculadora no requiere backend ni llamadas a ninguna API. Todos los modos corren íntegramente en el navegador.

---

## Casos de uso (modos de cálculo)

### Modo 1 — ¿Cuánto es X% de un número? *(modo por defecto al cargar la página)*
> Ejemplo: ¿Cuánto es el 20% de 350?

**Inputs:**
- Porcentaje (%) → ej. 20
- Número base → ej. 350

**Fórmula:**
resultado = (porcentaje / 100) × número

**Output:**
- El X% de 350 es **70**

---

### Modo 2 — ¿Qué porcentaje es X de Y?
> Ejemplo: ¿Qué porcentaje es 45 de 200?

**Inputs:**
- Valor parcial → ej. 45
- Valor total → ej. 200

**Fórmula:**
resultado = (valor_parcial / valor_total) × 100

**Output:**
- 45 es el **22.5%** de 200

---

### Modo 3 — Aumento porcentual entre dos valores
> Ejemplo: Un producto pasó de $80 a $100. ¿Cuánto aumentó?

**Inputs:**
- Valor original → ej. 80
- Valor nuevo → ej. 100

**Fórmula:**
resultado = ((valor_nuevo - valor_original) / valor_original) × 100

**Output:**
- El valor **aumentó un 25%**
- (si el resultado es negativo, mostrar "disminuyó un X%")

---

### Modo 4 — Sumar un porcentaje a un número
> Ejemplo: $500 + 16% de IVA

**Inputs:**
- Número base → ej. 500
- Porcentaje a sumar (%) → ej. 16

**Fórmula:**
incremento = (porcentaje / 100) × número
resultado = número + incremento

**Output:**
- Incremento: **$80**
- Total con porcentaje: **$580**

---

### Modo 5 — Restar un porcentaje a un número
> Ejemplo: $1,200 con 30% de descuento

**Inputs:**
- Número base → ej. 1200
- Porcentaje a restar (%) → ej. 30

**Fórmula:**
descuento = (porcentaje / 100) × número
resultado = número - descuento

**Output:**
- Descuento: **$360**
- Precio final: **$840**

---

## Selector de modos

- Los 5 modos se presentan como **tabs horizontales** en la parte superior de la calculadora.
- Al hacer clic en un tab, la interfaz reemplaza los campos del modo anterior con los del modo seleccionado.
- El tab activo se resalta visualmente (fondo sólido, texto en contraste).
- En mobile, los tabs se muestran en scroll horizontal si no caben en una línea.
- **Modo por defecto al cargar la página:** Modo 1 — ¿Cuánto es X% de un número?

---

## Validaciones de inputs

| Regla | Detalle |
|-------|---------|
| Solo números | No aceptar letras ni caracteres especiales |
| No negativos | Mostrar error si el usuario ingresa un número negativo |
| No cero en denominador | En Modo 2, el valor total no puede ser 0. En Modo 3, el valor original no puede ser 0. Mostrar mensaje de error claro en ambos casos. |
| Porcentaje > 100 | Permitirlo (ej. 150%) pero sin restricción |
| Decimales | Aceptar hasta 2 decimales en inputs |
| Campo vacío | Bloquear el cálculo y resaltar el campo faltante |

---

## Formato de outputs

| Tipo de resultado | Formato |
|-------------------|---------|
| Separador de miles | Coma → 1,000,000 |
| Separador decimal | Punto → 1,234.56 |
| Porcentajes | Máximo 2 decimales → 22.50% |
| Moneda | Prefijo fijo $ sin configuración en esta versión |
| Resultados negativos | Mostrar en rojo con signo negativo explícito |
| Resultados positivos | Mostrar en verde cuando aplique (aumento/disminución) |

---

## Features adicionales

### Cálculo en tiempo real
- El resultado se actualiza automáticamente con cada tecla,
  sin necesidad de presionar un botón de calcular.

### Botón de copiar resultado
- Ícono de clipboard junto a cada output.
- Al hacer clic copia el valor al portapapeles.
- Confirmación visual: el ícono cambia a ✓ por 2 segundos.

### Botón de limpiar / reset
- Limpia todos los campos del modo activo con un clic.

### Historial de cálculos
- Guarda los últimos 10 cálculos realizados en la sesión.
- Muestra: modo usado, inputs y resultado.
- Botón para limpiar el historial.
- Al hacer clic en un resultado del historial, restaura esos valores.
- **Persistencia:** el historial se almacena en `sessionStorage`; se borra al cerrar o recargar la pestaña. No se usa `localStorage` para no persistir datos entre sesiones.

### Explicación del cálculo (paso a paso)
- Debajo del resultado, mostrar cómo se llegó a él.
- Ejemplo: "500 × 0.16 = 80 → 500 + 80 = 580"
- Ayuda a estudiantes y a generar confianza en el resultado.

### Intercambio de inputs (swap)
- En Modo 3, botón para intercambiar valor original y valor nuevo
  con un solo clic.

---

## SEO y contenido de la página

### Meta información
- Title: "Calculadora de Porcentajes Online — Rápida y Gratis"
- Description: "Calcula porcentajes al instante: descuentos, aumentos,
  IVA y más. Sin registro. Resultado en tiempo real."

### Preguntas frecuentes (FAQ — para rich snippets)
- ¿Cómo se calcula el porcentaje de un número?
- ¿Cómo calcular el porcentaje de aumento entre dos valores?
- ¿Cómo calcular el descuento de un precio?
- ¿Qué fórmula se usa para sacar el porcentaje?

### Contenido de apoyo
- Bloque con ejemplos cotidianos: propinas, descuentos, calificaciones.
- Tabla con porcentajes comunes precomputados (10%, 15%, 20%, 25%).

---

## Especificaciones técnicas

| Parámetro | Detalle |
|-----------|---------|
| Plataforma | Web responsive (mobile-first) |
| Arquitectura | Sin backend — todo el cálculo ocurre en el cliente (JS) |
| Accesibilidad | Labels en todos los inputs, soporte teclado, roles ARIA en tabs |
| URL sugerida | /calculadora-de-porcentajes |
| Idioma | Español (es-MX como locale base) |
| Precisión numérica | Redondeo a 2 decimales en outputs |
| Persistencia | sessionStorage para historial — sin localStorage |

---

## Casos extremos a contemplar

| Caso | Comportamiento esperado |
|------|------------------------|
| Porcentaje = 0 | Resultado es 0, no mostrar error |
| Base = 0 con porcentaje | Resultado es 0, no mostrar error |
| Modo 2: valor total = 0 | Mostrar error: "El valor total no puede ser cero" |
| Modo 3: valor original = 0 | Mostrar error: "El valor original no puede ser cero" (evita división por cero) |
| Valores muy grandes (ej. 999,999,999) | Calcular correctamente sin romper el layout |
| Decimales con punto europeo (1,000.50) | Normalizar automáticamente antes de calcular |
| Pegar texto con símbolo $ o % | Limpiar y extraer solo el número |
