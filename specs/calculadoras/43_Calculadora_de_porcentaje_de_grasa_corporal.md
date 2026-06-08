# Especificación v1 - Calculadora de porcentaje de grasa corporal

## Descripción general

Herramienta para estimar porcentaje de grasa corporal mediante medidas
corporales ingresadas por el usuario. Debe presentar el resultado como una
estimación aproximada con margen de error, no como diagnóstico ni sustituto de
mediciones clínicas.

**Arquitectura:** todo el cálculo ocurre en el cliente. No requiere backend,
base de datos ni llamadas a APIs externas.

---

## Objetivo de producto

- Estimar porcentaje de grasa corporal con método de medidas.
- Mostrar masa grasa y masa libre de grasa estimadas.
- Explicar limitaciones del método y sensibilidad a errores de medición.
- Mantener lenguaje neutral y cuidadoso.
- Generar una página estática optimizada para SEO en Astro.

---

## Alcance recomendado

### MVP

- Método principal: fórmula de la Marina de EE. UU. con cuello, cintura, altura y cadera cuando aplica.
- Sexo usado por la fórmula: masculino/femenino.
- Unidad métrica e imperial.
- Resultado: porcentaje estimado, masa grasa y masa magra.
- Copiar resultado y limpiar formulario.
- Aviso de salud y limitaciones visible.

### Fase 2

- Método YMCA.
- Comparación con IMC y relación cintura-altura.
- Historial en `sessionStorage`.
- Guía visual de cómo medir cada perímetro.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL pública recomendada | `/salud/calculadora-de-porcentaje-de-grasa-corporal` |
| Archivo Astro recomendado | `src/pages/salud/calculadora-de-porcentaje-de-grasa-corporal.astro` |
| Lógica de cálculo | `src/lib/calculators/salud/calculadora-de-porcentaje-de-grasa-corporal/bodyFat.ts` |
| Pruebas unitarias | `src/lib/calculators/salud/calculadora-de-porcentaje-de-grasa-corporal/bodyFat.test.ts` |
| Categoría | `salud` |
| Locale base | `es-MX` |

---

## Comportamiento mobile-first

- Inputs con unidades claras y ejemplos de medición.
- Mostrar campos condicionales según sexo seleccionado por la fórmula.
- Resultado principal en porcentaje, con masa grasa/magra debajo.
- No mostrar etiquetas valorativas agresivas.
- No depender de imágenes para explicar la medición en el MVP.

---

## Flujo principal MVP

**Ejemplo:** Persona masculina, `80 kg`, `180 cm`, cintura `90 cm`, cuello
`40 cm`. ¿Cuál es su porcentaje de grasa estimado?

### Inputs del MVP

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Sistema de unidades | Selector | `Métrico`, `Imperial` | `Métrico` |
| Sexo para fórmula | Selector | `Masculino`, `Femenino` | vacío |
| Peso | Texto numérico | `> 0` | vacío |
| Altura | Texto numérico | `> 0` | vacío |
| Cuello | Texto numérico | `> 0` | vacío |
| Cintura | Texto numérico | `> 0` | vacío |
| Cadera | Texto numérico | `> 0`, requerido en femenino | vacío |

### Outputs principales

- Porcentaje de grasa corporal estimado.
- Masa grasa estimada.
- Masa libre de grasa estimada.
- Nota sobre margen de error.
- Fórmula usada.

---

## Fórmulas

Convertir siempre a pulgadas para la fórmula Navy.

Masculino:

```text
body_fat = 86.010 * log10(cintura - cuello)
           - 70.041 * log10(altura)
           + 36.76
```

Femenino:

```text
body_fat = 163.205 * log10(cintura + cadera - cuello)
           - 97.684 * log10(altura)
           - 78.387
```

Composición estimada:

```text
masa_grasa = peso * (body_fat / 100)
masa_libre_grasa = peso - masa_grasa
```

---

## Validaciones y estados

- `cintura - cuello` debe ser mayor que cero en masculino.
- `cintura + cadera - cuello` debe ser mayor que cero en femenino.
- Todas las medidas deben ser positivas.
- Mostrar advertencia si el resultado es menor a `2%` o mayor a `70%`.
- No clasificar como saludable/no saludable en el MVP.
- No usar para menores de edad, embarazo o atletas de alto rendimiento sin advertencia.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de porcentaje de grasa corporal` |
| Meta description | `Estima tu porcentaje de grasa corporal con medidas de cintura, cuello, altura y cadera. Resultado orientativo con masa grasa y magra.` |
| H1 | `Calculadora de grasa corporal` |
| Keyword principal | `calculadora grasa corporal` |
| Keywords secundarias | `porcentaje de grasa corporal`, `formula navy grasa corporal`, `masa grasa estimada` |

### FAQs sugeridas

- ¿Qué tan exacta es esta calculadora?
- ¿Cómo debo medir cintura y cuello?
- ¿Sirve para atletas?
- ¿Es lo mismo que IMC?

---

## Pruebas sugeridas

- Medidas masculinas válidas producen porcentaje positivo.
- Medidas femeninas sin cadera muestran error.
- Cintura menor o igual que cuello muestra error en masculino.
- Cambio entre unidades conserva equivalencia.
- Masa grasa y masa magra suman el peso.

