# Especificación v1 - Calculadora de proteína diaria recomendada

## Descripción general

Herramienta para estimar gramos diarios de proteína según peso, objetivo y nivel
de actividad. Debe presentar rangos orientativos y evitar prometer resultados
musculares o de salud.

**Arquitectura:** todo el cálculo ocurre en el cliente. No requiere backend,
base de datos ni llamadas a APIs externas.

---

## Objetivo de producto

- Calcular proteína diaria en gramos.
- Mostrar rangos por objetivo: mantenimiento, pérdida de peso, ganancia muscular.
- Convertir gramos a porciones orientativas.
- Incluir advertencias para enfermedad renal, embarazo/lactancia o dietas médicas.
- Generar una página estática optimizada para SEO en Astro.

---

## Alcance recomendado

### MVP

- Peso.
- Objetivo.
- Nivel de actividad.
- Resultado en gramos por día y gramos por comida.
- Rango bajo/alto por kg de peso.
- Copiar resultado y limpiar formulario.
- Aviso de salud visible.

### Fase 2

- Distribución por comidas editable.
- Cálculo por peso objetivo.
- Fuentes de proteína por dieta.
- Historial en `sessionStorage`.
- Integración con calculadora de macros.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL pública recomendada | `/salud/calculadora-de-proteina-diaria` |
| Archivo Astro recomendado | `src/pages/salud/calculadora-de-proteina-diaria.astro` |
| Lógica de cálculo | `src/lib/calculators/salud/calculadora-de-proteina-diaria/dailyProtein.ts` |
| Pruebas unitarias | `src/lib/calculators/salud/calculadora-de-proteina-diaria/dailyProtein.test.ts` |
| Categoría | `salud` |
| Locale base | `es-MX` |

---

## Comportamiento mobile-first

- Resultado principal en gramos por día.
- Mostrar rango y distribución por comidas como detalle.
- Usar selectores para objetivo y actividad.
- Mantener disclaimers visibles, sin bloquear el uso.
- Enlazar a macros como calculadora relacionada cuando exista.

---

## Flujo principal MVP

**Ejemplo:** Peso `75 kg`, entreno fuerza y busco ganar músculo. ¿Cuánta
proteína diaria puedo usar como referencia?

### Inputs del MVP

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Peso | Texto numérico | `20-250 kg` | vacío |
| Sistema de unidades | Selector | `kg`, `lb` | `kg` |
| Objetivo | Selector | `Mantenimiento`, `Pérdida de peso`, `Ganancia muscular` | `Mantenimiento` |
| Actividad | Selector | `Sedentaria`, `Activa`, `Entrenamiento de fuerza` | `Activa` |
| Comidas al día | Texto numérico | `1-8` | `3` |

### Outputs principales

- Rango de proteína diaria.
- Valor recomendado intermedio.
- Gramos por comida.
- Multiplicador usado en g/kg.
- Aviso de seguridad.

---

## Fórmulas

Usar rangos orientativos por objetivo:

| Objetivo | Rango base |
|----------|------------|
| Mantenimiento | `0.8-1.2 g/kg` |
| Pérdida de peso | `1.2-1.8 g/kg` |
| Ganancia muscular | `1.6-2.2 g/kg` |

Ajuste por actividad:

```text
sedentaria = no aumentar el rango
activa = usar rango base
fuerza = elevar al rango superior si objetivo es ganancia muscular
```

Cálculo:

```text
proteina_min = peso_kg * rango_min
proteina_max = peso_kg * rango_max
proteina_media = (proteina_min + proteina_max) / 2
proteina_por_comida = proteina_media / comidas
```

---

## Validaciones y estados

- Peso debe estar entre `20` y `250 kg`.
- Comidas debe estar entre `1` y `8`.
- Mostrar aviso si el usuario marca enfermedad renal o dieta médica.
- No calcular para menores de edad en el MVP.
- Redondear gramos al entero más cercano.
- No presentar el rango alto como obligación.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de proteína diaria` |
| Meta description | `Calcula un rango orientativo de proteína diaria según peso, actividad y objetivo. Incluye gramos por día y por comida.` |
| H1 | `Calculadora de proteína diaria` |
| Keyword principal | `calculadora proteina diaria` |
| Keywords secundarias | `proteina por kg`, `cuanta proteina necesito`, `gramos de proteina al dia` |

### FAQs sugeridas

- ¿Cuánta proteína necesito por kg de peso?
- ¿Debo usar el rango bajo o alto?
- ¿La proteína diaria cambia si entreno fuerza?
- ¿Qué pasa si tengo enfermedad renal?

---

## Referencias sugeridas

- Dietary Reference Intakes para proteína.
- NCBI Bookshelf: tablas de ingesta recomendada.

---

## Pruebas sugeridas

- `70 kg`, mantenimiento produce rango `56-84 g`.
- `75 kg`, ganancia muscular produce rango `120-165 g`.
- `150 lb` se convierte a `68.04 kg`.
- Comidas `3` divide correctamente el valor medio.
- Peso fuera de rango muestra error.

