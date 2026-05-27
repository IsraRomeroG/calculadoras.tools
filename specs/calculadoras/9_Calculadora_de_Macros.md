# Especificación v2 — Calculadora de Macros

## Descripción general

Herramienta para estimar una distribución diaria orientativa de macronutrientes
(proteína, carbohidratos y grasas) a partir de las calorías objetivo, el peso
corporal, el objetivo del usuario y, opcionalmente, un enfoque dietético.

La calculadora debe funcionar como el paso natural después de la calculadora de
calorías diarias (TDEE): si el usuario ya conoce sus calorías objetivo, puede
convertirlas en gramos diarios de macros; si todavía no las conoce, debe recibir
una ruta clara hacia la calculadora de TDEE.

La experiencia no debe presentar los resultados como un plan nutricional
personalizado, exacto ni médico. Debe comunicar que los macros son un punto de
partida educativo que conviene ajustar con la evolución real, preferencias,
energía, saciedad, entrenamiento y ayuda profesional cuando aplique.

La calculadora debe estar optimizada para uso móvil desde el primer viewport y
construirse con Astro + Tailwind CSS, sin backend ni llamadas de red.

---

## Objetivo de producto

- Convertir calorías objetivo en gramos diarios de proteína, carbohidratos y
  grasas.
- Priorizar un método útil para personas reales: fijar proteína por kg de peso,
  fijar grasas y calcular carbohidratos como resto.
- Mantener un modo alternativo por porcentajes para usuarios que ya trabajan con
  ratios de macros.
- Permitir presets por objetivo y por enfoque dietético, pero dejarlos como
  valores editables y orientativos.
- Evitar recomendaciones excesivamente rígidas, moralizantes o con apariencia
  de prescripción médica.
- Mostrar advertencias cuando el resultado sea difícil de sostener, poco
  realista o potencialmente riesgoso.
- Explicar de forma breve qué significa cada macro y cómo usar el resultado.
- Conectar de forma contextual con TDEE, déficit calórico, IMC y grasa corporal.
- Generar una página estática optimizada para SEO en Astro.

---

## Alcance recomendado

### MVP

La primera versión debe enfocarse en el flujo principal y útil:

- Input manual de calorías objetivo.
- Input de peso corporal.
- Toggle de unidades: métrico (`kg`) e imperial (`lb`).
- Selector de objetivo.
- Método principal: proteína primero (`g/kg`), grasas por porcentaje y
  carbohidratos como resto.
- Método alternativo: distribución manual por porcentajes que suman `100%`.
- Presets simples por objetivo para proteína y grasa.
- Presets dietéticos básicos, solo como punto de partida.
- Resultado diario: gramos, kcal y porcentaje real de cada macro.
- Distribución igualitaria por número de comidas (`1 - 7`).
- Advertencias de salud, precisión y consistencia matemática.
- Botón de copiar resultado en texto plano.
- Botón de limpiar.
- Opción de usar ejemplo.
- Contenido SEO, FAQ visible y JSON-LD de `FAQPage`.
- Fuentes visibles al final de la página.
- Pruebas unitarias para la lógica pura.

### Fase 2

- Importar calorías objetivo y peso desde la calculadora de TDEE usando query
  params o estado explícito del usuario.
- Calculadora completa opcional: TDEE + macros en un flujo expandible.
- Distribución personalizada por comidas con porcentajes por comida.
- Comparador de dietas para las mismas calorías.
- Historial de últimos cálculos válidos en `sessionStorage`, solo si el usuario
  lo activa explícitamente.
- Notas dietéticas más detalladas por enfoque: vegana, vegetariana, keto,
  mediterránea, low carb.
- Vista de impresión.

### Fase 3

- Exportar resultado como imagen o CSV.
- Gráfica interactiva avanzada si aporta valor real.
- Modo avanzado para atletas de resistencia con carbohidratos por kg de peso.
- Objetivos por día de entrenamiento y día de descanso.
- Presets de timing de proteína por comida.
- Integración editorial con artículos del cluster de salud.

> No implementar Chart.js, html2canvas, historial, comparador de dietas,
> calculadora completa ni exportación de imagen en el MVP. Son funciones útiles,
> pero aumentan el peso, la complejidad y el riesgo de comunicar una precisión
> que la estimación no tiene.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL pública recomendada | `/salud/calculadora-de-macros` |
| Alias opcional | `/calculadora-de-macros` |
| Alias opcional | `/calculadora-macronutrientes` |
| Alias opcional | `/calculadora-keto-macros` |
| Archivo Astro recomendado | `src/pages/salud/calculadora-de-macros.astro` |
| Lógica de cálculo | `src/lib/calculators/macros.ts` |
| Pruebas unitarias | `src/lib/calculators/macros.test.ts` |
| Locale base | `es-MX` |
| Layout | `BaseLayout.astro` |
| Contenedores UI | `PageHero`, `Container`, `FaqSection` |
| Estilos | Tailwind CSS |

> Si se usan alias cortos, definir si serán redirecciones o rutas canónicas. La
> página debe exponer un único `canonical`.

---

## Comportamiento mobile-first

- La calculadora interactiva debe aparecer como experiencia principal en el
  primer viewport. No crear una landing page antes de la herramienta.
- En móvil, usar una sola columna: calorías, peso, objetivo, método, ajustes,
  resultado, comidas, acciones y contenido contextual.
- En pantallas medianas o grandes, usar dos columnas: formulario a la izquierda
  y resultado a la derecha.
- Los controles táctiles deben tener altura mínima aproximada de `44px`.
- El selector de unidades debe ser un control segmentado.
- El selector de método debe usar tabs o radio cards:
  - `Proteína primero`
  - `Por porcentajes`
- El resultado principal debe tener dimensiones estables para evitar saltos de
  layout al recalcular.
- No depender únicamente del color para comunicar advertencias o errores.
- Evitar tarjetas dentro de tarjetas. Usar cards solo para resultados concretos
  o bloques repetidos.
- Los textos largos deben permitir salto de línea sin romper el layout.
- En móvil, las acciones deben ser botones de ancho completo o wrap natural.
- La tabla de distribución por comidas debe convertirse en lista compacta o
  permitir scroll horizontal con encabezados legibles.
- El contenido educativo, FAQ, fuentes y calculadoras relacionadas deben quedar
  debajo de la calculadora.

---

## Conceptos base

### Macronutrientes

| Macronutriente | Calorías por gramo | Función principal |
|----------------|-------------------|-------------------|
| Proteína | `4 kcal/g` | Construcción y reparación de tejidos, masa muscular |
| Carbohidratos | `4 kcal/g` | Energía disponible, rendimiento y glucógeno |
| Grasas | `9 kcal/g` | Ácidos grasos esenciales, hormonas y vitaminas liposolubles |

### Fórmula energética

```text
kcal_proteína = gramos_proteína * 4
kcal_carbohidratos = gramos_carbohidratos * 4
kcal_grasas = gramos_grasas * 9
kcal_totales = kcal_proteína + kcal_carbohidratos + kcal_grasas
```

### Rangos generales de referencia

La calculadora puede mostrar estos rangos como contexto educativo, no como
reglas rígidas:

| Referencia | Rango |
|------------|-------|
| Carbohidratos AMDR adultos | `45 - 65%` de energía |
| Grasas AMDR adultos | `20 - 35%` de energía |
| Proteína AMDR adultos | `10 - 35%` de energía |
| Proteína RDA adultos | aprox. `0.8 g/kg/día` |
| Proteína en personas activas | aprox. `1.4 - 2.0 g/kg/día` como rango común |

Los presets deportivos pueden salir de los AMDR en contextos específicos, pero
la UI debe marcarlo como una decisión de objetivo y no como una necesidad para
todas las personas.

### Limitación principal

Una distribución de macros puede ser matemáticamente correcta y aun así no ser
la mejor para una persona concreta. La adherencia, digestión, entrenamiento,
preferencias, presupuesto, condiciones médicas y cultura alimentaria importan.

Texto sugerido:

```text
Usa estos macros como punto de partida. Si tu energía, rendimiento, hambre o progreso no van bien después de 2 a 3 semanas, ajusta las calorías o la distribución.
```

---

## Método principal MVP — Proteína primero

Este debe ser el método por defecto porque evita el principal problema de las
distribuciones puramente porcentuales: con pocas calorías pueden dejar proteína
insuficiente y con muchas calorías pueden generar proteína innecesariamente alta.

### Inputs

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Sistema de unidades | Control segmentado | Métrico / Imperial | Métrico |
| Calorías objetivo | Texto numérico | `800 - 6,000 kcal` | Vacío |
| Peso kg | Texto numérico | `30 - 300 kg` | Vacío |
| Peso lb | Texto numérico | `66 - 660 lb` | Vacío |
| Objetivo | Selector | 5 opciones | Mantener peso |
| Enfoque dietético | Selector opcional | Presets definidos | Estándar |
| Proteína | Selector/input | `0.6 - 3.5 g/kg` | Según objetivo |
| Grasas | Selector/input | `10% - 75%` | Según objetivo/dieta |
| Número de comidas | Selector | `1 - 7` | `3` |

### Cálculo

```text
proteína_g = peso_kg * proteína_g_por_kg
proteína_kcal = proteína_g * 4

grasas_kcal = calorías_objetivo * porcentaje_grasas
grasas_g = grasas_kcal / 9

carbohidratos_kcal = calorías_objetivo - proteína_kcal - grasas_kcal
carbohidratos_g = carbohidratos_kcal / 4

porcentaje_real_macro = kcal_macro / calorías_objetivo
```

Si `carbohidratos_kcal < 0`, bloquear el resultado de macros y mostrar una
explicación clara: la combinación de calorías, proteína y grasas no cabe dentro
del objetivo calórico.

### Presets por objetivo

Los presets ajustan valores iniciales; el usuario puede editarlos.

| Objetivo | Proteína sugerida | Grasas sugeridas | Carbohidratos |
|----------|-------------------|------------------|---------------|
| Perder grasa | `1.6 - 2.2 g/kg` | `25 - 35%` | Resto |
| Mantener peso | `1.4 - 1.8 g/kg` | `25 - 35%` | Resto |
| Ganar músculo | `1.6 - 2.2 g/kg` | `20 - 30%` | Resto |
| Rendimiento deportivo | `1.4 - 2.0 g/kg` | `20 - 30%` | Resto |
| Recomposición corporal | `1.8 - 2.4 g/kg` | `25 - 35%` | Resto |

Valores iniciales recomendados:

| Objetivo | Proteína default | Grasas default |
|----------|------------------|----------------|
| Perder grasa | `1.8 g/kg` | `30%` |
| Mantener peso | `1.6 g/kg` | `30%` |
| Ganar músculo | `1.8 g/kg` | `25%` |
| Rendimiento deportivo | `1.6 g/kg` | `25%` |
| Recomposición corporal | `2.0 g/kg` | `30%` |

### Ejemplo MVP

**Inputs:** `1,818 kcal`, `65 kg`, objetivo `Perder grasa`, proteína
`1.8 g/kg`, grasas `30%`.

```text
Proteína: 65 * 1.8 = 117 g -> 468 kcal
Grasas: 30% de 1,818 = 545 kcal -> 61 g
Carbohidratos: 1,818 - 468 - 545 = 805 kcal -> 201 g
```

**Output esperado:**

| Macronutriente | Gramos/día | kcal | % real |
|----------------|------------|------|--------|
| Proteína | `117 g` | `468 kcal` | `25.7%` |
| Carbohidratos | `201 g` | `805 kcal` | `44.3%` |
| Grasas | `61 g` | `545 kcal` | `30.0%` |
| **Total** | — | `1,818 kcal` | `100%` |

---

## Método alternativo MVP — Por porcentajes

Este modo existe para usuarios que ya conocen una distribución de macros por
porcentaje. No debe ser el método por defecto.

### Inputs

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Calorías objetivo | Texto numérico | `800 - 6,000 kcal` | Vacío |
| % proteína | Texto numérico | `10% - 60%` | Según preset |
| % carbohidratos | Texto numérico | `0% - 70%` | Según preset |
| % grasas | Texto numérico | `10% - 75%` | Según preset |

### Reglas

- Los tres porcentajes deben sumar `100%`.
- Mostrar indicador visible: `Total: 100%` o `Total: 103%`.
- Si la suma se aleja de `100%` fuera de una tolerancia pequeña por decimales,
  no calcular resultado final.
- Si el usuario edita dos macros, permitir calcular el tercero.
- Evitar sliders que muevan valores inesperadamente. Preferir inputs numéricos
  con botón o control para bloquear un macro y recalcular el resto.
- Mostrar advertencias si la distribución queda fuera de rangos generales
  orientativos, sin bloquear cuando sea una decisión explícita del usuario.

### Presets porcentuales por objetivo

Los siguientes presets son puntos de partida para el modo porcentual, no la
recomendación principal.

| Objetivo | Proteína | Carbohidratos | Grasas |
|----------|----------|---------------|--------|
| Perder grasa | `30%` | `40%` | `30%` |
| Mantener peso | `25%` | `45%` | `30%` |
| Ganar músculo | `25%` | `50%` | `25%` |
| Rendimiento deportivo | `20%` | `55%` | `25%` |
| Recomposición corporal | `30%` | `40%` | `30%` |

### Ejemplo porcentual

**Inputs:** `1,818 kcal`, proteína `35%`, carbohidratos `35%`, grasas `30%`.

| Macronutriente | % | kcal | Gramos/día |
|----------------|---|------|------------|
| Proteína | `35%` | `636 kcal` | `159 g` |
| Carbohidratos | `35%` | `636 kcal` | `159 g` |
| Grasas | `30%` | `545 kcal` | `61 g` |
| **Total** | `100%` | `1,818 kcal` | — |

Advertencia contextual para `65 kg`:

```text
Esta distribución equivale a 2.4 g/kg de proteína. Puede ser alta para algunas personas; ajusta si no lo necesitas o consulta con un profesional.
```

---

## Presets por enfoque dietético

Los enfoques dietéticos deben autocompletar valores, no imponerse como reglas.
La UI debe explicar que una dieta puede ser compatible o no con ciertas
condiciones médicas, preferencias y necesidades.

### Presets recomendados

| Dieta | Proteína | Carbohidratos | Grasas | Regla especial | Nota |
|-------|----------|---------------|--------|----------------|------|
| Estándar / balanceada | `1.4 - 1.8 g/kg` | Resto | `25 - 35%` | Ninguna | Punto de partida general |
| Alta en proteína | `1.8 - 2.4 g/kg` | Resto | `20 - 30%` | Advertir si `> 3.0 g/kg` | Útil si hay entrenamiento y objetivo corporal |
| Keto / cetogénica | `1.4 - 2.0 g/kg` | `20 - 50 g/día` | Resto | Priorizar límite en gramos, no porcentaje | Enfoque restrictivo |
| Low carb | `1.4 - 2.0 g/kg` | `20 - 30%` | Resto | Advertir si carbos muy bajos | No necesariamente cetosis |
| Vegetariana | `1.4 - 2.0 g/kg` | Resto | `25 - 35%` | Nota sobre fuentes de proteína | Puede requerir planificación |
| Vegana | `1.6 - 2.2 g/kg` | Resto | `25 - 35%` | Nota sobre variedad y proteínas vegetales | Puede requerir planificación |
| Mediterránea | `1.2 - 1.8 g/kg` | Resto | `30 - 40%` | Énfasis en grasas insaturadas | Patrón alimentario flexible |
| Paleo | `1.6 - 2.2 g/kg` | Resto | `30 - 40%` | Advertir que restringe grupos de alimentos | Enfoque restrictivo |
| Ayuno intermitente | Igual a dieta base | Igual a dieta base | Igual a dieta base | Cambia horarios, no macros | No es una distribución de macros |

No incluir `carnívora` en el MVP. Si se agrega en fase futura, tratarla como
enfoque altamente restrictivo con advertencia visible y no como preset
recomendado por defecto.

### Keto

En keto, el límite debe expresarse en gramos porque el porcentaje cambia mucho
según las calorías totales.

Flujo recomendado:

```text
proteína_g = peso_kg * proteína_g_por_kg
carbohidratos_g = límite_manual_o_default_30g
grasas_kcal = calorías_objetivo - proteína_kcal - carbohidratos_kcal
grasas_g = grasas_kcal / 9
```

Validar:

- Si `carbohidratos_g > 50`, mostrar advertencia de keto.
- Si `grasas_kcal < 0`, bloquear resultado.
- Si el usuario elige keto, mostrar que la herramienta no confirma cetosis ni
  sustituye asesoría nutricional.

---

## Distribución por comidas

### MVP — Distribución igualitaria

El usuario puede elegir `1 - 7` comidas. La calculadora divide macros y calorías
entre comidas de forma igualitaria.

**Ejemplo:** macros diarios `117 g` proteína, `201 g` carbohidratos, `61 g`
grasas, `1,818 kcal`, `3` comidas.

| Comida | Calorías | Proteína | Carbohidratos | Grasas |
|--------|----------|----------|----------------|--------|
| Comida 1 | `606 kcal` | `39.0 g` | `67.0 g` | `20.3 g` |
| Comida 2 | `606 kcal` | `39.0 g` | `67.0 g` | `20.3 g` |
| Comida 3 | `606 kcal` | `39.0 g` | `67.0 g` | `20.3 g` |

Si `número de comidas = 1`, permitirlo y mostrar nota breve:

```text
Una sola comida puede ser difícil de sostener para algunas personas. Asegúrate de cubrir energía, proteína y micronutrientes.
```

### Fase 2 — Distribución personalizada

Permitir porcentajes por comida que sumen `100%`.

Reglas:

- Usar inputs numéricos o sliders con total visible.
- No recalcular porcentajes de forma sorpresiva.
- Si la suma no es `100%`, no mostrar distribución final por comida.
- Incluir presets:
  - Igualitaria.
  - Comida principal grande.
  - Ventana de ayuno `2` comidas.
  - Pre/post entrenamiento.

---

## Ejemplos de alimentos por macro

Mostrar ejemplos como apoyo educativo, no como plan de comidas. Deben indicar
porción, estado del alimento cuando aplique (`cocido`, `crudo`, `enlatado`) y
valores aproximados.

### MVP

Usar una lista estática y auditada, con fuente editorial al final de la página.
No llamar APIs externas en el cliente.

**Proteína:**

- `1 huevo grande`: aprox. `6 g` proteína.
- `100 g pechuga de pollo cocida`: aprox. `31 g` proteína.
- `100 g atún enlatado drenado`: aprox. `25 g` proteína.
- `100 g queso cottage`: aprox. `11 g` proteína.
- `100 g lentejas cocidas`: aprox. `9 g` proteína.

**Carbohidratos:**

- `100 g arroz blanco cocido`: aprox. `28 g` carbohidratos.
- `1 plátano mediano`: aprox. `27 g` carbohidratos.
- `1 rebanada de pan integral`: aprox. `12 g` carbohidratos.
- `1 papa mediana cocida`: aprox. `37 g` carbohidratos.

**Grasas:**

- `1/2 aguacate mediano`: aprox. `15 g` grasa.
- `1 cucharada de aceite de oliva`: aprox. `14 g` grasa.
- `30 g almendras`: aprox. `14 g` grasa.
- `100 g salmón cocido`: aprox. `13 g` grasa.

Texto sugerido:

```text
Estos ejemplos son aproximados y pueden variar por marca, preparación y tamaño de porción.
```

### Fase 2

- Mostrar ejemplos adaptados al enfoque dietético elegido.
- Para dieta vegana o vegetariana, mostrar fuentes vegetales de proteína y nota
  sobre combinar variedad de legumbres, cereales, soja, semillas y frutos secos.
- Para keto, priorizar ejemplos bajos en carbohidratos y advertir que los
  carbohidratos netos pueden variar según la fuente.

---

## Visualización de distribución

### MVP

Usar una visualización ligera con CSS `conic-gradient` o SVG simple.

Requisitos:

- Tres segmentos: proteína, carbohidratos y grasas.
- Leyenda textual con gramos y kcal.
- No depender solo del color.
- Funcionar sin librerías externas.
- Respetar `prefers-reduced-motion`.

### Fase 3

Si se usa una librería de gráficas, cargarla solo cuando la sección sea visible.
Chart.js no debe formar parte del bundle inicial del MVP.

---

## Comparador de dietas

Fase 2. Tabla que muestra cómo cambian los macros con diferentes presets para
las mismas calorías y peso.

Reglas:

- Mostrarlo debajo del resultado principal, no como foco del primer viewport.
- No presentar una dieta como superior para todas las personas.
- Incluir advertencias en enfoques restrictivos.
- Mantener los mismos inputs base: calorías objetivo, peso y objetivo.

**Ejemplo:** `1,818 kcal`, `65 kg`.

| Dieta | Proteína | Carbohidratos | Grasas | Nota |
|-------|----------|----------------|--------|------|
| Estándar | `104 g` | `220 g` | `61 g` | Punto de partida |
| Alta proteína | `130 g` | `207 g` | `50 g` | Más proteína |
| Keto | `117 g` | `30 g` | `137 g` | Restrictiva |
| Mediterránea | `91 g` | `214 g` | `71 g` | Más grasa saludable |
| Vegana | `117 g` | `209 g` | `56 g` | Requiere variedad de fuentes |

---

## Acciones

### Copiar resultado

Debe copiar texto plano.

Ejemplo:

```text
Calculadora de Macros - calculadoras.tools
Calorías objetivo: 1,818 kcal/día
Peso: 65 kg
Objetivo: Perder grasa
Método: Proteína primero
Proteína: 117 g/día (468 kcal, 25.7%)
Carbohidratos: 201 g/día (805 kcal, 44.3%)
Grasas: 61 g/día (545 kcal, 30.0%)
Distribución: 3 comidas de aprox. 606 kcal
```

Si `navigator.clipboard` no está disponible, usar fallback con `textarea` o
mostrar mensaje accesible de error.

### Limpiar

- Restablece valores por defecto.
- Limpia errores, advertencias y resultado.
- No recarga la página.
- Mantiene sistema métrico como default.

### Usar ejemplo

Opcional. Rellena:

```text
calorías_objetivo = 1,818
peso = 65 kg
objetivo = Perder grasa
enfoque = Estándar
proteína = 1.8 g/kg
grasas = 30%
comidas = 3
```

### Exportar imagen

Fase 3. No incluir en MVP.

Si se implementa:

- El usuario debe activar la acción explícitamente.
- No enviar datos a servicios externos.
- Permitir descargar imagen localmente.
- Ofrecer alternativa textual accesible.

---

## Parsing y validación de inputs

### Tipo de input

Usar `input type="text"` con:

```html
inputmode="decimal"
autocomplete="off"
```

Esto permite aceptar valores pegados con símbolos o formatos regionales.

### Normalización de valores

Aceptar y normalizar:

| Entrada | Valor interno |
|---------|---------------|
| `1818` | `1818` |
| `1,818` | `1818` si se detecta separador de miles |
| `1818 kcal` | `1818` |
| `65` | `65` |
| `65.5` | `65.5` |
| `65,5` | `65.5` |
| `65 kg` | `65` |
| `143 lb` | `143` |
| `30%` | `30` |
| `1.8 g/kg` | `1.8` |

### Validaciones generales

| Regla | Comportamiento esperado |
|-------|-------------------------|
| Calorías vacías | No calcular; pedir calorías si el campo fue tocado. |
| Calorías `< 800` | Bloquear resultado y mostrar advertencia de salud. |
| Calorías `> 6,000` | Bloquear resultado y pedir revisar datos. |
| Peso vacío | No calcular; pedir peso si el campo fue tocado. |
| Peso `< 30 kg` o `> 300 kg` | Bloquear cálculo y mostrar error claro. |
| Peso `< 66 lb` o `> 660 lb` | Bloquear cálculo y mostrar error claro. |
| Caracteres ambiguos | Error: `Ingresa un número válido.` |
| Valores negativos | Error específico; no calcular. |
| Campos vacíos | Estado incompleto sin errores agresivos hasta interacción. |

### Validaciones del método proteína primero

| Regla | Comportamiento esperado |
|-------|-------------------------|
| Proteína `< 0.6 g/kg` | Bloquear cálculo y pedir revisar el valor. |
| Proteína `< 0.8 g/kg` | Permitir con advertencia educativa. |
| Proteína `> 3.0 g/kg` | Permitir con advertencia visible. |
| Proteína `> 3.5 g/kg` | Bloquear o exigir ajuste manual explícito. |
| Grasas `< 15%` | Advertir sobre dificultad para cubrir grasas esenciales y vitaminas liposolubles. |
| Grasas `> 75%` | Bloquear salvo keto si está modelado como resto. |
| Proteína + grasas exceden calorías | Bloquear macros; explicar que carbohidratos quedarían negativos. |
| Carbohidratos `< 50 g` fuera de keto | Permitir con advertencia de baja disponibilidad de carbohidratos. |
| Keto con carbohidratos `> 50 g` | Advertir que podría no encajar con un enfoque cetogénico clásico. |

### Validaciones del método por porcentajes

| Regla | Comportamiento esperado |
|-------|-------------------------|
| Suma de macros fuera de tolerancia de `100%` | Bloquear resultado final. |
| Proteína `< 10%` | Advertencia. |
| Proteína `> 60%` | Bloquear o pedir ajuste. |
| Carbohidratos `< 0%` o `> 70%` | Bloquear. |
| Grasas `< 10%` o `> 75%` | Bloquear. |
| Proteína resultante `> 3.0 g/kg` | Advertencia visible si hay peso. |

### Calorías muy bajas

Si la calculadora recibe sexo usado por fórmula desde TDEE o si se implementa
el flujo completo:

- Calorías objetivo `< 1,200` en mujeres: advertencia prominente.
- Calorías objetivo `< 1,500` en hombres: advertencia prominente.
- Calorías objetivo `< 800`: bloquear.

Texto sugerido:

```text
El objetivo calórico queda en un rango muy bajo. Evita dietas muy bajas en calorías sin supervisión profesional.
```

---

## Estados de la calculadora

| Estado | Comportamiento |
|--------|----------------|
| Inicial | Campos vacíos, resultado neutral y sin errores. |
| Incompleto | No mostrar resultado final; indicar qué falta si el usuario ya interactuó. |
| Válido | Mostrar macros diarios, porcentajes, comidas, advertencias y acciones. |
| Inválido | Mostrar errores por campo y ocultar acciones de resultado. |
| Valor inusual | Mostrar resultado solo si los inputs son válidos y añadir advertencia. |
| Distribución imposible | Bloquear resultado de macros y explicar el conflicto. |
| Copiado | Confirmación visual durante 2 segundos y anuncio accesible. |
| Limpio | Restaurar estado inicial sin recargar la página. |

---

## Formato de outputs

Usar `Intl.NumberFormat` con locale `es-MX`.

| Tipo de resultado | Formato |
|-------------------|---------|
| Gramos por macro | Entero: `117 g` |
| Calorías por macro | Entero: `468 kcal` |
| Porcentaje | 1 decimal: `25.7%` |
| Por comida | 1 decimal en gramos: `39.0 g` |
| Total calorías | Entero: `1,818 kcal` |
| Peso métrico | 1 decimal si aplica: `65 kg`, `65.5 kg` |
| Peso imperial | 1 decimal: `143.3 lb` |

### Redondeo

- Usar precisión completa para cálculos internos.
- Redondear solo al mostrar.
- Si los gramos redondeados no reconstruyen exactamente las calorías, mantener
  el total de calorías objetivo como referencia principal.
- En pruebas, comparar con tolerancia para conversiones y porcentajes.
- En distribución por comidas, permitir decimales para evitar pérdida acumulada.

---

## Avisos de salud y tono

La calculadora debe evitar lenguaje prescriptivo como "debes comer", "macros
perfectos", "distribución óptima" o "plan exacto". Usar "estimado",
"orientativo" y "punto de partida".

### Aviso general visible

```text
Estos resultados son estimaciones educativas y no reemplazan una evaluación médica o nutricional. Consulta con un profesional de la salud si tienes embarazo, lactancia, enfermedad renal, diabetes, una condición médica, historial de trastornos de la conducta alimentaria, cambios recientes de peso o síntomas.
```

### Proteína alta

```text
La proteína calculada es alta para tu peso. Puede ser adecuada en algunos contextos deportivos, pero no siempre aporta más beneficio.
```

### Grasas muy bajas

```text
Una ingesta muy baja de grasas puede dificultar cubrir ácidos grasos esenciales y vitaminas liposolubles.
```

### Carbohidratos muy bajos

```text
Con carbohidratos muy bajos, algunas personas notan menor rendimiento o energía. Ajusta según tu contexto y tolerancia.
```

### Dietas restrictivas

```text
Este enfoque restringe grupos de alimentos. Asegúrate de cubrir fibra, micronutrientes y necesidades individuales.
```

---

## Calculadoras relacionadas

Mostrar enlaces contextuales debajo del resultado y/o al final de la página.
No presentarlos como tratamiento médico.

| Condición | Enlace sugerido |
|-----------|-----------------|
| No conoce sus calorías objetivo | Calculadora de calorías diarias (TDEE) |
| Objetivo: perder grasa | Calculadora de déficit calórico |
| Quiere estimar rango de peso | Calculadora de IMC |
| Quiere estimar composición corporal | Calculadora de grasa corporal |
| Entrena fuerza | Calculadora de 1RM |
| Siempre | Calculadora de calorías diarias |

Texto de seguridad:

```text
Estas herramientas son educativas y no reemplazan una evaluación profesional.
```

---

## SEO y contenido de la página

### Meta información

| Campo | Valor |
|-------|-------|
| Title | `Calculadora de Macros — Proteínas, Carbohidratos y Grasas` |
| Description | `Calcula tus macros diarios estimados según tus calorías, peso y objetivo. Obtén gramos de proteína, carbohidratos y grasas como punto de partida.` |
| Canonical | `/salud/calculadora-de-macros` |

Evitar claims como "macros exactos", "plan perfecto" o "dieta ideal".

### Estructura sugerida

- `h1`: Calculadora de macros
- Intro breve orientada a uso.
- Calculadora interactiva.
- Qué son proteína, carbohidratos y grasas.
- Cómo elegir proteína por kg.
- Cómo ajustar grasas y carbohidratos.
- Ejemplo de cálculo.
- Limitaciones y aviso de salud.
- FAQ.
- Fuentes.

### FAQ sugeridas

- ¿Qué son los macronutrientes?
- ¿Cómo se calculan los macros diarios?
- ¿Cuánta proteína debo comer al día?
- ¿Qué distribución de macros sirve para perder grasa?
- ¿Qué macros se usan para ganar músculo?
- ¿Cuántos carbohidratos necesito al día?
- ¿Cuánta grasa debo comer al día?
- ¿Qué macros tiene una dieta keto?
- ¿Cómo calcular macros en una dieta vegana?
- ¿Tengo que comer exactamente estos gramos todos los días?

### Schema.org

Agregar JSON-LD para `FAQPage` si las preguntas y respuestas están visibles en
la página.

---

## Implementación en Astro + Tailwind

### Estructura recomendada

```text
src/pages/salud/calculadora-de-macros.astro
src/lib/calculators/macros.ts
src/lib/calculators/macros.test.ts
```

### Criterios técnicos

- La página debe ser estática y compatible con Astro SSG.
- La UI se construye con Astro + Tailwind.
- La lógica interactiva puede vivir en un `<script>` de la página o importarse
  desde un módulo cliente.
- La lógica matemática debe separarse en funciones puras.
- No introducir React, Vue, Svelte ni librerías adicionales para esta
  calculadora.
- No usar backend.
- No hacer llamadas de red.
- No añadir Chart.js en el MVP.
- No añadir html2canvas en el MVP.
- Mantener consistencia visual con las páginas existentes (`BaseLayout`,
  `PageHero`, `Container`, fondo oscuro y acentos sobrios).

### Tipos sugeridos

```ts
type UnitSystem = "metric" | "imperial";
type Macro = "protein" | "carbs" | "fat";
type MacroMethod = "protein-first" | "percentages";
type MacroGoal =
  | "lose-fat"
  | "maintain"
  | "gain-muscle"
  | "performance"
  | "recomposition";
type DietPreset =
  | "balanced"
  | "high-protein"
  | "keto"
  | "low-carb"
  | "vegetarian"
  | "vegan"
  | "mediterranean"
  | "paleo"
  | "intermittent-fasting";

interface ProteinFirstInput {
  calories: number;
  weightKg: number;
  goal: MacroGoal;
  dietPreset: DietPreset;
  proteinGramsPerKg: number;
  fatPercent: number;
}

interface PercentageInput {
  calories: number;
  weightKg?: number;
  proteinPercent: number;
  carbsPercent: number;
  fatPercent: number;
}

interface MacroBreakdown {
  grams: number;
  calories: number;
  percent: number;
}

interface MacroResult {
  protein: MacroBreakdown;
  carbs: MacroBreakdown;
  fat: MacroBreakdown;
  totalCalories: number;
  warnings: string[];
}
```

### Funciones puras sugeridas

```ts
calculateProteinFirstMacros(input)
calculatePercentageMacros(input)
calculateKetoMacros(input)
calculateMealDistribution(result, meals)
getGoalDefaults(goal)
getDietPresetDefaults(dietPreset, goal)
validateProteinFirstInput(input)
validatePercentageInput(input)
validateMacroResult(input, result)
parseHealthInput(value)
convertKgToLb(kg)
convertLbToKg(lb)
formatCalories(value)
formatGrams(value)
formatPercent(value)
formatWeight(value, unit)
buildMacroCopyText(input, result)
```

### Constantes sugeridas

```ts
const KCAL_PER_GRAM = {
  protein: 4,
  carbs: 4,
  fat: 9,
} as const;

const CALORIE_RANGE = {
  min: 800,
  max: 6000,
} as const;

const WEIGHT_KG_RANGE = {
  min: 30,
  max: 300,
} as const;

const PROTEIN_G_PER_KG_RANGE = {
  min: 0.6,
  warnLow: 0.8,
  warnHigh: 3.0,
  max: 3.5,
} as const;

const FAT_PERCENT_RANGE = {
  warnLow: 15,
  min: 10,
  max: 75,
} as const;
```

---

## Accesibilidad

- Todos los inputs deben tener `label` visible.
- Los errores deben asociarse con `aria-describedby`.
- El resultado principal debe estar en una región con `aria-live="polite"`.
- Los controles segmentados deben comunicar estado activo con texto, color y
  atributos ARIA.
- Los botones de icono deben incluir `aria-label`.
- El foco visible debe ser claro con Tailwind.
- No depender únicamente del color para comunicar macro, advertencia o error.
- Las tablas/listas de resultados deben tener encabezados o etiquetas
  accesibles.
- La navegación debe funcionar con teclado.
- Las acciones de copiar y limpiar deben informar éxito o error sin depender de
  `alert()`.
- Respetar `prefers-reduced-motion` para transiciones y visualizaciones.

---

## Privacidad

- El MVP no debe guardar datos de salud en `localStorage`.
- No enviar peso, calorías, objetivo, dieta ni resultados a APIs externas.
- No registrar valores personales en analytics.
- Si se implementa historial en fase futura, preferir `sessionStorage` y hacerlo
  opt-in.
- Si se usa `localStorage` en una fase futura, debe ser opt-in y mostrar texto
  claro: los datos se guardan solo en el navegador del usuario.
- La acción de copiar debe requerir interacción explícita del usuario.

---

## Casos extremos

| Caso | Comportamiento esperado |
|------|-------------------------|
| Calorías `0` | Error claro antes del cálculo. |
| Calorías `< 800` | Bloquear resultado y mostrar advertencia. |
| Peso negativo | Error claro antes del cálculo. |
| Peso fuera de rango | Bloquear cálculo. |
| Proteína demasiado alta | Advertir o bloquear según umbral. |
| Grasas demasiado bajas | Advertir. |
| Carbohidratos negativos | Bloquear resultado y explicar conflicto. |
| Porcentajes suman `99.9%` por decimales | Permitir tolerancia pequeña o normalizar visualmente. |
| Porcentajes suman `103%` | Bloquear resultado. |
| Keto con `> 50 g` carbohidratos | Advertir. |
| Dieta vegana + proteína alta | Nota sobre variedad de fuentes vegetales. |
| Una comida diaria | Permitir con nota. |
| `7` comidas | Permitir; tabla debe mantenerse legible. |
| Cambio de unidades | Convertir sin perder valor equivalente. |
| Resultado largo | Debe hacer wrap sin romper layout. |
| Usuario cambia objetivo después de editar manualmente | Preguntar si desea aplicar preset o conservar ajustes. |

---

## Criterios de aceptación

| Caso | Inputs | Resultado esperado |
|------|--------|--------------------|
| Método principal ejemplo | `1,818 kcal`, `65 kg`, `1.8 g/kg`, `30%` grasas | Proteína `117 g`, carbos `201 g`, grasas `61 g`. |
| Método principal 80 kg | `2,400 kcal`, `80 kg`, `2.0 g/kg`, `30%` grasas | Proteína `160 g`, carbos `260 g`, grasas `80 g`. |
| Método porcentual ejemplo | `1,818 kcal`, `35/35/30` | Proteína `159 g`, carbos `159 g`, grasas `61 g`. |
| Porcentajes inválidos | `40/40/30` | No calcular; mostrar total `110%`. |
| Carbohidratos negativos | `1,000 kcal`, `60 kg`, `3.5 g/kg`, `30%` grasas | Bloquear; explicar que proteína + grasas exceden calorías. |
| Keto ejemplo | `1,818 kcal`, `65 kg`, `1.8 g/kg`, `30 g` carbos | Proteína `117 g`, carbos `30 g`, grasas aprox. `137 g`. |
| Keto con carbos altos | Keto y `80 g` carbos | Mostrar advertencia de keto. |
| Comidas | Resultado válido y `3` comidas | Mostrar macros por comida con `1` decimal. |
| Peso imperial | `143.3 lb` | Convertir internamente a aprox. `65 kg`. |
| Calorías bajas | `700 kcal` | Bloquear resultado. |
| Copiar resultado | Resultado válido | Copia texto plano con macros y calorías. |
| Limpiar | Después de calcular | Campos y resultado vuelven a estado inicial. |
| Mobile | viewport `390px` | Formulario, resultado y tablas no se superponen ni desbordan. |
| Teclado | Navegación por Tab | Todos los controles son alcanzables y operables. |

---

## Pruebas recomendadas

### Unitarias

Si se añade Vitest:

- Cálculo por método proteína primero.
- Cálculo por método porcentual.
- Cálculo keto con carbohidratos por gramos.
- Distribución por comidas.
- Validación de calorías mínimas y máximas.
- Validación de peso métrico e imperial.
- Conversión kg/lb.
- Parsing de coma decimal, separador de miles, unidades pegadas y porcentajes.
- Validación de suma de porcentajes.
- Validación de carbohidratos negativos.
- Advertencia de proteína alta por kg.
- Advertencia de grasas bajas.
- Formato de calorías, gramos, porcentajes y peso.
- Texto de copia.

### E2E con Playwright

- Escribir valores y ver resultado en tiempo real.
- Cambiar unidades y verificar conversión.
- Cambiar objetivo y verificar presets.
- Cambiar método y verificar que no se pierdan inputs esenciales.
- Ingresar porcentajes inválidos y verificar bloqueo.
- Forzar carbohidratos negativos y verificar mensaje.
- Ver advertencia por keto con carbos altos.
- Cambiar número de comidas.
- Copiar resultado.
- Limpiar formulario.
- Validar navegación con teclado.
- Revisar layout en móvil y desktop.

---

## Fuentes de referencia

- National Academies — Dietary Reference Intakes for macronutrients:
  https://www.nationalacademies.org/cdn/materials/9fb9fae1-63a0-4048-88ad-3f972639149a
- National Academies Press — Dietary Reference Intakes: The Essential Guide to
  Nutrient Requirements:
  https://www.nationalacademies.org/read/11537/chapter/7
- International Society of Sports Nutrition — Protein and exercise position
  stand:
  https://link.springer.com/article/10.1186/s12970-017-0177-8
- USDA FoodData Central — food composition data:
  https://fdc.nal.usda.gov/

---

## Aviso de salud sugerido

Texto visible cerca de los resultados:

```text
Los resultados son estimaciones educativas basadas en reglas generales de energía y macronutrientes. Tus necesidades reales pueden variar por entrenamiento, composición corporal, sueño, estrés, medicamentos, condiciones médicas, digestión, preferencias y adherencia. Consulta con un profesional de la salud si tienes dudas, síntomas, embarazo, lactancia, antecedentes de trastornos de la conducta alimentaria, enfermedad renal, diabetes u otra condición médica.
```
