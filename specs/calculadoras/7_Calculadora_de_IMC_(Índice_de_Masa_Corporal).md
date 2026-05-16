# Especificación — Calculadora de IMC (Índice de Masa Corporal)

## Descripción general
Herramienta para calcular el Índice de Masa Corporal a partir del
peso y la altura de una persona. Es una de las calculadoras de salud
con mayor volumen de búsqueda del sitio y tiene un perfil de usuario
muy amplio: personas que quieren conocer su estado de peso, pacientes
en seguimiento médico, deportistas, y profesionales de la salud.

La calculadora va más allá del número: contextualiza el resultado
con la categoría de la OMS, explica sus limitaciones, y conecta
de forma natural con otras calculadoras de salud del sitio
(TDEE, macros, déficit calórico).

---

## Conceptos base

### Fórmula del IMC
IMC = peso (kg) / altura (m)²

### Clasificación de la OMS

| IMC | Categoría | Indicador visual |
|-----|-----------|-----------------|
| < 16.0 | Delgadez severa | 🔴 Rojo intenso |
| 16.0 – 16.9 | Delgadez moderada | 🔴 Rojo |
| 17.0 – 18.4 | Delgadez leve | 🟠 Naranja |
| 18.5 – 24.9 | Peso normal | 🟢 Verde |
| 25.0 – 29.9 | Sobrepeso | 🟡 Amarillo |
| 30.0 – 34.9 | Obesidad grado I | 🟠 Naranja |
| 35.0 – 39.9 | Obesidad grado II | 🔴 Rojo |
| ≥ 40.0 | Obesidad grado III (mórbida) | 🔴 Rojo intenso |

---

## Casos de uso (modos de cálculo)

### Modo 1 — Cálculo estándar de IMC
> Ejemplo: Peso 75 kg y mido 1.72 m. ¿Cuál es mi IMC?

**Inputs:**
- Peso → ej. 75 kg
- Altura → ej. 1.72 m
- Sistema de unidades → Métrico (kg/cm) / Imperial (lb/ft-in)
- Sexo → Hombre / Mujer / Prefiero no decir
- Edad → ej. 32 años

**Fórmula (sistema métrico):**
IMC = 75 / (1.72)² = 75 / 2.9584 = **25.35**

**Fórmula (sistema imperial):**
IMC = (peso_lb × 703) / altura_in²

**Output principal:**
- IMC: **25.35**
- Categoría: **Sobrepeso** 🟡
- Indicador visual: barra o gauge con aguja que señala
  la categoría del usuario dentro del espectro completo

**Output secundario:**
- Rango de peso saludable para tu altura:
  "Para 1.72 m, el peso saludable está entre **54.7 kg y 73.7 kg**"
- Peso a perder / ganar para entrar en rango normal:
  "Te encuentras **1.35 kg** por encima del límite superior saludable"

---

### Modo 2 — IMC por edad (ajuste pediátrico)
> El IMC estándar no aplica a menores de 18 años.
> Para niños y adolescentes se usa el percentil de IMC.

**Inputs:**
- Peso → ej. 35 kg
- Altura → ej. 1.40 m
- Edad → ej. 11 años
- Sexo → Niño / Niña

**Cálculo:**
IMC bruto = peso / altura²
Luego se compara contra tablas de percentiles de la OMS / CDC
según edad y sexo.

**Output:**
- IMC bruto: **17.86**
- Percentil: **72**
- Categoría pediátrica:

| Percentil | Categoría pediátrica |
|-----------|---------------------|
| < 5 | Bajo peso |
| 5 – 84 | Peso saludable |
| 85 – 94 | Sobrepeso |
| ≥ 95 | Obesidad |

- Nota prominente: "Para una evaluación precisa del crecimiento
  de tu hijo consulta con su pediatra."

---

### Modo 3 — IMC objetivo
> Ejemplo: Quiero tener un IMC de 22. ¿Cuánto debo pesar?

**Inputs:**
- Altura → ej. 1.72 m
- IMC objetivo → ej. 22 (o selector de categoría)

**Fórmula:**
peso_objetivo = IMC_objetivo × altura²

**Output:**
- Peso para IMC 22: **65.0 kg**
- Tu peso actual (si fue ingresado): 75 kg
- Diferencia: **−10 kg**
- Enlace sugerido: "Calcula cuánto tiempo tardarías →
  Calculadora de déficit calórico"

---

### Modo 4 — Seguimiento histórico
> El usuario registra su IMC a lo largo del tiempo
> y ve su progreso en una gráfica.

**Inputs:**
- Fecha + peso (el usuario agrega entradas manualmente)
- Altura fija (se mantiene del primer registro)

**Output:**
- Gráfica de línea: IMC a lo largo del tiempo
- Tabla de registros con fecha, peso, IMC y categoría
- Cambio desde el primer registro:
  "Has bajado **2.3 puntos de IMC** en 3 meses 🎉"
- Opción de exportar historial como CSV

> Los datos se guardan en localStorage del navegador.
> No requiere cuenta ni backend.

---

## Inputs detallados

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|-------------|-------------------|
| Peso (kg) | Numérico | 10 – 500 kg | — |
| Peso (lb) | Numérico | 22 – 1,100 lb | — |
| Altura (cm) | Numérico | 50 – 250 cm | — |
| Altura (ft + in) | Numérico doble | 1'8" – 8'2" | — |
| Edad | Numérico | 2 – 120 años | — |
| Sexo | Selector | Hombre / Mujer / No indicar | No indicar |
| Sistema de unidades | Toggle | Métrico / Imperial | Métrico |

---

## Limitaciones del IMC (mostrar siempre)
El IMC es una herramienta de cribado, no un diagnóstico.
Mostrar siempre un bloque informativo con sus limitaciones:

- **No distingue masa muscular de grasa:** un atleta musculoso
  puede tener IMC de "sobrepeso" sin exceso de grasa.
- **No considera distribución de la grasa:** la grasa abdominal
  es más riesgosa que la periférica y el IMC no la mide.
- **Varía por etnia:** los puntos de corte óptimos pueden diferir
  entre poblaciones asiáticas, africanas y europeas.
- **No aplica a embarazadas, niños ni ancianos** sin ajustes.
- **No reemplaza la evaluación médica** profesional.

---

## Métricas complementarias (mostrar como referencia)

### Índice Cintura-Altura (ICA)
Indicador adicional de riesgo cardiovascular.

Fórmula: ICA = cintura (cm) / altura (cm)

| ICA | Riesgo |
|-----|--------|
| < 0.40 | Bajo peso |
| 0.40 – 0.49 | Saludable |
| 0.50 – 0.59 | Sobrepeso |
| ≥ 0.60 | Obesidad |

Input adicional opcional: medida de cintura (cm o in)

### Peso ideal según distintas fórmulas
Mostrar como referencia comparativa, no como verdad absoluta:

| Fórmula | Peso ideal (hombre, 1.72 m) | Peso ideal (mujer, 1.72 m) |
|---------|----------------------------|---------------------------|
| Devine | 72.7 kg | 65.2 kg |
| Robinson | 70.4 kg | 64.4 kg |
| Miller | 70.1 kg | 65.5 kg |
| Hamwi | 74.4 kg | 65.8 kg |
| Promedio | **71.9 kg** | **65.2 kg** |

Nota: "Estas fórmulas son orientativas y tienen limitaciones similares al IMC."

---

## Validaciones de inputs

| Regla | Detalle |
|-------|---------|
| Peso entre 10 y 500 kg | Fuera de rango mostrar error claro |
| Altura entre 50 y 250 cm | Fuera de rango mostrar error claro |
| Edad entre 2 y 120 años | Menores de 2: redirigir a pediatra |
| Campos vacíos | Bloquear cálculo y resaltar campo faltante |
| IMC < 10 o > 80 | Mostrar advertencia de valores inusuales |

---

## Formato de outputs

| Tipo de resultado | Formato |
|-------------------|---------|
| IMC | 2 decimales → 25.35 |
| Peso saludable | Rango en kg o lb según sistema → 54.7 – 73.7 kg |
| Diferencia de peso | Con signo y unidad → −10.3 kg / +5.2 lb |
| Percentil pediátrico | Número entero → percentil 72 |
| Categoría | Texto + color + emoji de semáforo |

---

## Features adicionales

### Gauge / velocímetro visual
- Indicador semicircular tipo velocímetro con zonas de color.
- Aguja que apunta al IMC calculado.
- Más impactante visualmente que una simple barra.
- Se anima suavemente al mostrar el resultado.

### Toggle métrico / imperial
- Cambio instantáneo entre kg/cm y lb/ft-in.
- Convierte los valores ya ingresados automáticamente.
- Sin necesidad de volver a escribir.

### Cálculo en tiempo real
- El resultado se actualiza automáticamente con cada tecla.

### Botón de copiar resultado
- Copia: "IMC: 25.35 — Sobrepeso (OMS)"

### Botón de limpiar / reset
- Limpia todos los campos con un clic.

### Calculadoras relacionadas (enlaces contextuales)
Mostrar al pie del resultado, según la categoría obtenida:

- Si IMC < 18.5 → "Calcula tus calorías para ganar peso → TDEE"
- Si IMC 18.5–24.9 → "Mantén tu peso con tu plan de macros → Macros"
- Si IMC > 24.9 → "Calcula tu déficit calórico para perder peso"
- Siempre → "Calcula tus calorías diarias → TDEE"

### Aviso de salud
- Texto visible para IMC fuera del rango normal:
  "Este resultado es solo orientativo. Consulta con un
  profesional de la salud para una evaluación completa."
- Para IMC < 16 o > 40: aviso más prominente con énfasis
  en buscar atención médica.

---

## SEO y contenido de la página

### Meta información
- Title: "Calculadora de IMC Online — Índice de Masa Corporal"
- Description: "Calcula tu IMC al instante con la fórmula de la OMS.
  Conoce tu categoría de peso, tu rango saludable y qué significa
  tu resultado. Gratis y sin registro."

### URLs sugeridas
- /calculadora-imc (principal)
- /calculadora-indice-masa-corporal
- /imc-normal-por-edad
- /peso-ideal-calculadora

### Preguntas frecuentes (FAQ — para rich snippets)
- ¿Cómo se calcula el IMC?
- ¿Cuál es el IMC normal para un adulto?
- ¿Qué IMC es considerado sobrepeso?
- ¿El IMC es diferente para hombres y mujeres?
- ¿Cuál es el IMC normal para niños?
- ¿Qué limitaciones tiene el IMC como medida de salud?
- ¿Cuánto debo pesar según mi estatura?

### Contenido de apoyo
- Tabla de IMC normal por edad y sexo.
- Explicación de por qué el IMC no lo dice todo
  (ejemplo del atleta musculoso).
- Tabla de peso saludable por estatura (precomputada
  de 1.50 m a 1.95 m en pasos de 5 cm).

---

## Especificaciones técnicas

| Parámetro | Detalle |
|-----------|---------|
| Plataforma | Web responsive (mobile-first) |
| Sin backend | Todo el cálculo ocurre en el cliente (JS) |
| Gauge visual | SVG animado o Canvas (sin librería externa) |
| Percentiles pediátricos | Tablas OMS/CDC embebidas en JSON en cliente |
| Historial | localStorage del navegador (sin cuenta) |
| Gráfica de seguimiento | Chart.js (línea simple) |
| Exportar CSV | Blob API en cliente |
| Accesibilidad | Labels en todos los inputs, soporte teclado |
| URL principal | /calculadora-imc |
| Idioma | Español (locale configurable) |
| Precisión numérica | 2 decimales en IMC; 1 decimal en pesos |

---

## Diferencias clave vs otras calculadoras de salud del sitio

| Aspecto | IMC | TDEE | Macros | Déficit calórico |
|---------|-----|------|--------|-----------------|
| Input principal | Peso + altura | Peso + altura + actividad | Objetivo + calorías | IMC / peso actual |
| Output principal | Índice numérico | Calorías diarias | Gramos por macronutriente | Calorías a reducir |
| Objetivo del usuario | Saber su estado | Mantener peso | Planificar dieta | Perder peso |
| Vinculación natural | → TDEE, déficit | → Macros, déficit | → Déficit | → Macros |

---

## Casos extremos a contemplar

- Altura = 0 → error claro antes del cálculo
- Peso muy bajo (ej. 15 kg adulto) → calcular y mostrar
  advertencia de salud prominente
- IMC > 60 → calcular con normalidad, sin bloquear,
  pero con aviso de consultar médico
- Edad = 2 años → redirigir a modo pediátrico automáticamente
- Edad > 65 → nota: "En adultos mayores el IMC puede
  subestimar el riesgo; consulta con tu médico"
- Sistema imperial: pies + pulgadas → manejar el input
  como dos campos separados (ft e in), no uno solo
- Cambio de sistema métrico a imperial con datos ya ingresados →
  convertir automáticamente sin perder los valores
- Embarazo → nota visible: "El IMC no es un indicador
  adecuado durante el embarazo"