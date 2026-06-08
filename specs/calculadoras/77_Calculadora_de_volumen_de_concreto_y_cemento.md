# Especificación v1 - Calculadora de volumen de concreto / cemento

## Descripción general

Herramienta para estimar el volumen de concreto necesario para losas, columnas,
zapatas, vigas y formas cilíndricas. Debe convertir el volumen a metros cúbicos
y estimar sacos o mezclas usando rendimientos editables.

**Arquitectura:** todo el cálculo ocurre en el cliente. No requiere backend,
base de datos ni llamadas a APIs externas.

---

## Objetivo de producto

- Calcular volumen de concreto para formas comunes.
- Sumar varias secciones de una obra.
- Añadir porcentaje de desperdicio.
- Estimar sacos usando rendimiento ingresado por el usuario.
- Generar una página estática optimizada para SEO en Astro.

---

## Alcance recomendado

### MVP

- Formas: prisma rectangular y cilindro.
- Lista editable de secciones.
- Dimensiones y cantidad.
- Desperdicio editable.
- Rendimiento por saco opcional.
- Resultado: volumen neto, volumen con desperdicio y sacos estimados.
- Copiar resumen, limpiar formulario y exportar CSV.

### Fase 2

- Zapata trapezoidal y escalones.
- Mezcla por proporciones.
- Estimación de cemento, arena y grava.
- Historial en `sessionStorage`.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL pública recomendada | `/construccion/calculadora-volumen-concreto-cemento` |
| Archivo Astro recomendado | `src/pages/construccion/calculadora-volumen-concreto-cemento.astro` |
| Lógica de cálculo | `src/lib/calculators/construccion/calculadora-volumen-concreto-cemento/concreteVolume.ts` |
| Pruebas unitarias | `src/lib/calculators/construccion/calculadora-volumen-concreto-cemento/concreteVolume.test.ts` |
| Categoría | `construccion` |
| Locale base | `es-MX` |

---

## Comportamiento mobile-first

- Cada sección debe editarse como bloque compacto.
- Mostrar volumen total antes del desglose.
- Unidades visibles en cada dimensión.
- Botones claros para agregar, duplicar y eliminar sección.
- Rendimiento por saco debe explicarse como dato del fabricante.

---

## Flujo principal MVP

**Ejemplo:** Losa de `5 m x 4 m x 0.10 m` con `10%` de desperdicio.

### Inputs del MVP

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Forma | Selector | `Prisma rectangular`, `Cilindro` | `Prisma rectangular` |
| Largo / altura | Texto numérico | `> 0` | vacío |
| Ancho / diámetro | Texto numérico | `> 0` | vacío |
| Espesor | Texto numérico | `> 0` | vacío |
| Unidad | Selector | `m`, `cm`, `ft`, `in` | `m` |
| Cantidad | Texto numérico entero | `1-10000` | `1` |
| Desperdicio (%) | Texto numérico | `0%-100%` | `10` |
| Rendimiento por saco (m³) | Texto numérico opcional | `> 0` | vacío |

### Outputs principales

- Volumen neto en m³.
- Volumen con desperdicio.
- Volumen en ft³ y yd³.
- Sacos estimados.
- Desglose por sección.

---

## Fórmulas

Prisma rectangular:

```text
volumen = largo_m * ancho_m * espesor_m * cantidad
```

Cilindro:

```text
radio = diametro_m / 2
volumen = PI * radio^2 * altura_m * cantidad
```

Total:

```text
volumen_neto = suma(volumen_secciones)
volumen_total = volumen_neto * (1 + desperdicio / 100)
sacos = ceil(volumen_total / rendimiento_por_saco)
```

Conversiones:

```text
ft3 = m3 * 35.3146667
yd3 = m3 * 1.30795062
```

---

## Validaciones y estados

- Todas las dimensiones deben ser mayores que cero.
- Cantidad debe ser entera positiva.
- Desperdicio puede ser cero.
- Rendimiento por saco es opcional; si falta, ocultar sacos.
- Mostrar advertencia para volúmenes muy grandes.
- Redondear sacos hacia arriba.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de volumen de concreto y cemento` |
| Meta description | `Calcula metros cúbicos de concreto para losas, columnas y otras secciones, con desperdicio y sacos estimados.` |
| H1 | `Calculadora de concreto` |
| Keyword principal | `calculadora concreto` |
| Keywords secundarias | `volumen concreto`, `metros cubicos cemento`, `sacos de concreto` |

### FAQs sugeridas

- ¿Cómo calculo metros cúbicos de concreto?
- ¿Cuánto desperdicio debo agregar?
- ¿Cómo sé el rendimiento por saco?
- ¿La calculadora estima arena y grava?

---

## Pruebas sugeridas

- `5 x 4 x 0.1 m` produce `2 m³`.
- `10%` de desperdicio sobre `2 m³` produce `2.2 m³`.
- Cilindro usa diámetro/2 como radio.
- Rendimiento por saco redondea hacia arriba.
- Conversión de cm a m conserva volumen.

