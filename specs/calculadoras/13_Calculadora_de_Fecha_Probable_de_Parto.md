# Especificación — Calculadora de Fecha Probable de Parto

## Descripción general
Herramienta para calcular la fecha estimada de parto (FPP) a partir
de distintos datos del embarazo: última menstruación, fecha de
concepción o resultado de ecografía. Es una de las calculadoras
con mayor carga emocional del sitio — la usa una persona en uno
de los momentos más importantes de su vida — por lo que el tono,
el diseño y el tratamiento de la información deben ser cálidos,
empáticos y clínicamente responsables.

Alto volumen de búsqueda sostenido durante todo el año.
El perfil de usuario es casi exclusivamente mujeres embarazadas
o en proceso de búsqueda de embarazo, frecuentemente acompañadas
por su pareja. La experiencia debe sentirse como una herramienta
de apoyo, no como una calculadora fría.

---

## Conceptos base

### Duración del embarazo
- Embarazo a término: **40 semanas** (280 días) desde la
  fecha de la última menstruación (FUM).
- Equivale a **10 meses lunares** o aproximadamente **9 meses calendario**.
- El parto a término ocurre entre las semanas **37 y 42**.
- Solo el ~5% de los bebés nacen exactamente en la FPP.

### Regla de Naegele (método estándar)
El método más usado clínicamente para calcular la FPP
a partir de la fecha de la última menstruación:

FPP = FUM + 280 días
    = FUM + 9 meses + 7 días
    = FUM − 3 meses + 7 días + 1 año (si aplica)

**Ejemplo:**
FUM: 15 de julio de 2025
FPP: 22 de abril de 2026

### Ajuste por ciclo irregular
La Regla de Naegele asume un ciclo de 28 días.
Si el ciclo es diferente, se ajusta la FPP:

Ajuste = duración_ciclo − 28 días
FPP_ajustada = FPP_naegele + ajuste

**Ejemplo:** ciclo de 32 días → FPP + 4 días

### Trimestres del embarazo

| Trimestre | Semanas | Período |
|-----------|---------|---------|
| Primer trimestre | Semanas 1–12 | Formación de órganos |
| Segundo trimestre | Semanas 13–27 | Crecimiento rápido |
| Tercer trimestre | Semanas 28–40 | Maduración y preparación |

---

## Casos de uso (modos de cálculo)

### Modo 1 — Por fecha de última menstruación (FUM)
> El método más común. La mujer sabe cuándo
> fue su última menstruación.

**Inputs:**
- Fecha de última menstruación (FUM) → ej. 15/07/2025
- Duración del ciclo menstrual → ej. 28 días (rango: 20–45)
- Duración de la fase lútea → ej. 14 días (avanzado, opcional)

**Cálculo:**
FPP base (Naegele) = 15/07/2025 + 280 días = 21/04/2026
Ajuste por ciclo (28 días, sin ajuste) = 0 días
FPP final = **21 de abril de 2026**

Semanas actuales de gestación:
Hoy (25/04/2026) − FUM (15/07/2025) = 285 días = **40 semanas y 5 días**

**Output principal:**
- Fecha probable de parto: **21 de abril de 2026** 🍼
- Semanas de gestación hoy: **40 semanas y 5 días**
- Trimestre actual: **Tercer trimestre**
- Estado: ⚠️ "Tu fecha probable de parto ya pasó hace 4 días.
  Consulta con tu médico si aún no has dado a luz."

**Output secundario — ventana de parto:**
- Parto prematuro tardío (desde): **semana 34 — 3 de marzo de 2026**
- Parto a término temprano: **semana 37 — 24 de marzo de 2026**
- Parto a término completo: **semanas 39–40 — 7 al 21 abril 2026**
- Parto a término tardío: **semana 41 — 28 de abril de 2026**
- Parto postérmino (a partir de): **semana 42 — 5 de mayo de 2026**

---

### Modo 2 — Por fecha de concepción
> La mujer conoce la fecha aproximada de concepción
> (relación sexual o inseminación).

**Inputs:**
- Fecha de concepción → ej. 28/07/2025

**Cálculo:**
FPP = fecha_concepción + 266 días (38 semanas desde concepción)

**Output:**
- Fecha probable de parto: **20 de abril de 2026**
- Semanas de gestación (desde concepción): **38 semanas**
- Semanas de gestación (desde FUM estimada): **40 semanas**
  (la FUM estimada sería ~14 julio 2025)
- Nota: "La fecha de concepción exacta es difícil de determinar.
  Esta fecha es una estimación."

---

### Modo 3 — Por resultado de ecografía
> El médico ha dado una edad gestacional en la ecografía.
> La mujer quiere calcular su FPP desde ese dato.

**Inputs:**
- Fecha de la ecografía → ej. 10/10/2025
- Semanas de gestación en la ecografía → ej. 12
- Días adicionales (opcional) → ej. 3 días

**Cálculo:**
Semanas restantes hasta la semana 40 = 40 − 12 = 28 semanas
FPP = 10/10/2025 + (28 × 7) + (7 − 3 días del ajuste)
FPP = **30 de abril de 2026**

FUM estimada = fecha_eco − (semanas_eco × 7) − días
             = 10/10/2025 − 87 días = **15 de julio de 2025**

**Output:**
- Fecha probable de parto: **30 de abril de 2026**
- FUM estimada: **15 de julio de 2025**
- Semanas de gestación hoy: **40 semanas y 1 día**
- Nota: "La fecha por ecografía es más precisa que por FUM,
  especialmente si se realizó antes de la semana 14."

---

### Modo 4 — Calculadora inversa
> La mujer quiere saber en qué fecha debió ser
> su última menstruación para que el parto sea
> en una fecha determinada.

**Inputs:**
- Fecha deseada de parto → ej. 25 de diciembre de 2026
- Duración del ciclo → ej. 28 días

**Cálculo:**
FUM = FPP_deseada − 280 días = **19 de marzo de 2026**
Fecha probable de concepción = FUM + 14 días = **2 de abril de 2026**

**Output:**
- Para un parto el 25 de diciembre de 2026:
- La FUM debería ser alrededor del: **19 de marzo de 2026**
- La concepción debería ocurrir alrededor del: **2 de abril de 2026**
- Nota importante: "El momento del parto no es controlable
  con precisión. Este cálculo es solo orientativo."

---

## Timeline del embarazo semana a semana

### Hitos principales por semana

| Semana | Hito del bebé | Hito de la madre |
|--------|--------------|-----------------|
| 4 | Implantación completa | Test de embarazo positivo posible |
| 6 | Latido cardíaco detectable | Náuseas matutinas comunes |
| 8 | Tamaño: 1.6 cm (frambuesa) | Primeras citas prenatales |
| 10 | Todos los órganos formados | Fin del período embrionario |
| 12 | Tamaño: 5.4 cm (lima) | Fin del primer trimestre |
| 16 | Movimientos perceptibles | Posible conocer el sexo |
| 20 | Ecografía morfológica | Mitad del embarazo 🎉 |
| 24 | Viabilidad fetal | Inicio del tercer trimestre cerca |
| 28 | Ojos pueden abrirse | Inicio tercer trimestre |
| 32 | Tamaño: 42 cm | Preparativos para el nacimiento |
| 36 | Pulmones casi maduros | Posición cefálica idealmente |
| 37 | A término temprano | Maleta lista para el hospital |
| 40 | Fecha probable de parto | Contracciones regulares posibles |

---

## Feature — Semana a semana personalizada
Mostrar la semana de gestación actual y los próximos
3–4 hitos más cercanos en el tiempo.

**Display para una madre en semana 20:**

📍 Estás en la semana 20 — ¡Mitad del embarazo! 🎉
Próximos hitos:
Semana 24 → Viabilidad fetal (en 4 semanas)
Semana 28 → Inicio del tercer trimestre (en 8 semanas)
Semana 32 → Preparativos finales (en 12 semanas)
Semana 37 → A término temprano (en 17 semanas)
Semana 40 → Fecha probable de parto (en 20 semanas)

---

## Feature — Contador de semanas en tiempo real
Display prominente con las semanas y días actuales:

🤰 Llevas exactamente:
20 semanas y 3 días
████████████░░░░░░░░  51% del embarazo completado
Faltan 138 días para tu fecha probable de parto
(19 semanas y 5 días)

Barra de progreso del 0% al 100% (semana 40).
Actualización diaria (no por segundos — evitar ansiedad).

---

## Feature — Fechas importantes calculadas automáticamente

A partir de la FPP, calcular y mostrar fechas relevantes:

| Evento | Semana | Fecha estimada |
|--------|--------|----------------|
| Fin del primer trimestre | Semana 13 | [fecha] |
| Ecografía morfológica (20 sem) | Semana 20 | [fecha] |
| Inicio tercer trimestre | Semana 28 | [fecha] |
| Parto prematuro tardío (posible) | Semana 34 | [fecha] |
| Parto a término (inicio) | Semana 37 | [fecha] |
| Fecha probable de parto | Semana 40 | [fecha] 🍼 |
| Semana límite postérmino | Semana 42 | [fecha] |

---

## Feature — Comparativa de tamaño del bebé
En cada semana, comparar el tamaño aproximado del bebé
con una fruta o verdura familiar:

| Semana | Tamaño | Peso | Comparación |
|--------|--------|------|------------|
| 6 | 0.6 cm | < 1 g | 🫐 Arándano |
| 8 | 1.6 cm | 1 g | 🍓 Frambuesa |
| 10 | 3.1 cm | 4 g | 🍒 Cereza |
| 12 | 5.4 cm | 14 g | 🍋 Lima |
| 16 | 11.6 cm | 100 g | 🥑 Aguacate |
| 20 | 25.6 cm | 300 g | 🍌 Plátano |
| 24 | 30 cm | 600 g | 🌽 Elote |
| 28 | 37.6 cm | 1 kg | 🥬 Col |
| 32 | 42.4 cm | 1.7 kg | 🥥 Coco |
| 36 | 47.4 cm | 2.6 kg | 🍉 Sandía pequeña |
| 40 | 51.2 cm | 3.4 kg | 🎃 Calabaza |

---

## Feature — Cálculo del signo zodiacal del bebé
Basado en la FPP, mostrar el signo zodiacal probable del bebé.
Con nota de que puede nacer antes o después.

**Output:**
- Si nace en la FPP: ♉ **Tauro** (20 abr – 20 may)
- Si nace 2 semanas antes: ♈ **Aries**
- Si nace 2 semanas después: ♉ **Tauro**

---

## Feature — Compartir la noticia
Tarjeta visual para compartir por WhatsApp o redes:

🍼 ¡Estamos esperando un bebé!
📅 Fecha probable de parto: 21 de abril de 2026
🤰 Semanas de gestación: 20 semanas
⭐ Signo del bebé: ♉ Tauro
Calculado en calculadoras.tools

Botón "Generar tarjeta" y "Compartir en WhatsApp".

---

## Inputs detallados

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|-------------|-------------------|
| Fecha FUM | Date picker | Hasta 10 meses atrás | — |
| Duración del ciclo | Numérico / Slider | 20 – 45 días | 28 días |
| Fecha de concepción | Date picker | Hasta 9 meses atrás | — |
| Fecha de ecografía | Date picker | Hasta hoy | — |
| Semanas en ecografía | Numérico | 4 – 39 semanas | — |
| Días en ecografía | Numérico | 0 – 6 días | 0 |
| Fecha deseada de parto | Date picker | Futuro | — |
| Formato de fecha | Selector | DD/MM/AAAA / MM/DD/AAAA | Según locale |

---

## Tono y tratamiento responsable del tema

Esta calculadora acompaña uno de los momentos más
significativos en la vida de una persona. Aplicar siempre:

✅ **Usar:**
- Lenguaje cálido y esperanzador: "tu bebé", "tu embarazo"
- Énfasis constante en que la FPP es una estimación
- Recordatorios de consultar con el médico / ginecólogo
- Celebrar los hitos: "¡Mitad del embarazo! 🎉"
- Información clínicamente correcta y actualizada

❌ **Evitar:**
- Lenguaje clínico frío o impersonal
- Afirmar que el parto ocurrirá exactamente en la FPP
- Generar ansiedad si la fecha ya pasó
- Dar consejos médicos específicos
- Minimizar la importancia de la atención prenatal profesional

**Mensajes especiales por situación:**
- FPP en el futuro próximo (< 2 semanas): "¡Ya casi! 🎉
  Tu bebé podría llegar en cualquier momento."
- FPP = hoy: "¡Hoy es tu fecha probable de parto! 🍼
  Mantén calma y contacta a tu equipo médico si
  tienes contracciones regulares."
- FPP ya pasó (< 1 semana): "Tu fecha probable de parto
  fue hace X días. Es completamente normal que el bebé
  aún no haya llegado. Mantén contacto con tu médico."
- FPP ya pasó (> 1 semana): "Han pasado X días desde tu
  fecha probable de parto. Consulta con tu médico si
  aún no has dado a luz — esto requiere seguimiento médico."

---

## Validaciones de inputs

| Regla | Detalle |
|-------|---------|
| FUM no futura | Error: "La fecha de última menstruación no puede ser futura" |
| FUM hace más de 10 meses | Advertencia: "Esta fecha sugiere más de 42 semanas de embarazo. ¿Es correcta?" |
| Ciclo entre 20 y 45 días | Fuera de rango: advertencia con sugerencia de consultar médico |
| Semanas eco entre 4 y 39 | Fuera de rango: error claro |
| Fecha eco futura | Error: "La fecha de la ecografía no puede ser futura" |
| Campos vacíos | Bloquear cálculo y resaltar campo faltante |
| Ciclo muy irregular (< 21 o > 35 días) | Nota: "Con ciclos muy irregulares la FPP puede ser menos precisa. La ecografía es más confiable." |

---

## Formato de outputs

| Tipo de resultado | Formato |
|-------------------|---------|
| Fecha probable de parto | Formato largo → "martes, 21 de abril de 2026" |
| Semanas de gestación | "X semanas y Y días" |
| Días restantes | Número entero → "138 días" |
| Progreso | Porcentaje entero → "51% completado" |
| Fechas de hitos | Formato largo con semana → "Semana 20 · 10 enero 2026" |
| Tamaño del bebé | cm y gramos → "25.6 cm · 300 g" |

---

## Features adicionales

### Cálculo instantáneo
- El resultado aparece automáticamente al completar
  la fecha principal, sin botón de calcular.

### Toggle entre métodos
- Selector visible para cambiar entre FUM / Concepción / Ecografía
  sin perder los datos ya ingresados.

### Botón de copiar resultado
- Copia: "FPP: 21 de abril de 2026 · Semana 20 de gestación"

### Guardar mi embarazo
- Guardar la FPP en localStorage para que al volver
  al sitio la calculadora recuerde los datos.
- Sin cuenta, sin backend, solo localStorage.
- Botón: "Recordar mi embarazo en este dispositivo"

### Aviso médico
- Siempre visible:
  "La fecha probable de parto es una estimación.
  Solo entre el 3% y el 5% de los bebés nacen
  exactamente en esa fecha. Tu médico o matrona
  es la mejor fuente de información sobre tu embarazo."

---

## Calculadoras relacionadas (enlaces contextuales)

| Situación | Enlace sugerido |
|-----------|----------------|
| Siempre | → Calculadora de semanas de gestación |
| Siempre | → Calculadora de ovulación |
| Quiere calcular su IMC | → Calculadora de IMC |
| Quiere calcular calorías en embarazo | → Calculadora de TDEE |
| Quiere saber la edad del bebé futuro | → Calculadora de edad |

---

## SEO y contenido de la página

### Meta información
- Title: "Calculadora de Fecha Probable de Parto — ¿Cuándo Nacerá mi Bebé?"
- Description: "Calcula tu fecha probable de parto por FUM, fecha de
  concepción o ecografía. Semanas de gestación, hitos del embarazo
  y tamaño del bebé semana a semana. Gratis."

### URLs sugeridas
- /fecha-probable-de-parto (principal)
- /calculadora-embarazo
- /calculadora-semanas-gestacion
- /cuando-nace-mi-bebe
- /calculadora-fpp

### Preguntas frecuentes (FAQ — para rich snippets)
- ¿Cómo se calcula la fecha probable de parto?
- ¿Cuántas semanas dura un embarazo?
- ¿Qué es la Regla de Naegele?
- ¿Es exacta la fecha probable de parto?
- ¿Cómo afecta la duración del ciclo a la fecha de parto?
- ¿Cuándo se considera que un bebé es prematuro?
- ¿Cuál es la diferencia entre semanas de embarazo y meses?
- ¿Qué pasa si el bebé no nace en la fecha probable?

### Contenido de apoyo
- Explicación de los tres trimestres con hitos clave.
- Tabla completa de tamaño del bebé semana a semana.
- Artículo: "¿Por qué solo el 5% de los bebés nacen
  en su fecha probable de parto?"
- Guía: "¿Cómo contar las semanas de embarazo?"
- Diferencia entre semanas de gestación y semanas
  desde la concepción.

---

## Especificaciones técnicas

| Parámetro | Detalle |
|-----------|---------|
| Plataforma | Web responsive (mobile-first) |
| Sin backend | Todo el cálculo ocurre en el cliente (JS) |
| Manejo de fechas | date-fns o Temporal API |
| Datos semana a semana | JSON embebido (40 registros) |
| Guardar embarazo | localStorage del navegador |
| Barra de progreso | CSS nativo con animación suave |
| Compartir WhatsApp | API WhatsApp Web |
| Generar tarjeta | html2canvas o equivalente ligero |
| Accesibilidad | Labels en todos los inputs, soporte teclado |
| URL principal | /fecha-probable-de-parto |
| Idioma | Español; fechas en formato largo localizado |
| Locale | es-MX base con nombres de meses en español |

---

## Diferencias clave vs Calculadora de Ovulación

| Aspecto | Fecha probable de parto | Calculadora de ovulación |
|---------|------------------------|-------------------------|
| Momento de uso | Después de confirmar embarazo | Antes / durante búsqueda de embarazo |
| Objetivo | Saber cuándo nace el bebé | Saber cuándo es el día fértil |
| Input principal | FUM + embarazo confirmado | FUM + duración del ciclo |
| Output principal | FPP + semanas de gestación | Días fértiles + día de ovulación |
| Hitos del bebé | ✅ Sí, semana a semana | ❌ No aplica |
| Timeline | 40 semanas hacia el futuro | Próximos 30 días del ciclo |
| Tono | Celebratorio / informativo | Esperanzador / práctico |
| Vinculación natural | ← Ovulación (antes) → Semanas gestación | → FPP (después) |

---

## Casos extremos a contemplar

- FUM hace exactamente 40 semanas → FPP = hoy;
  mostrar mensaje especial cálido
- FUM hace más de 42 semanas → advertencia prominente
  de consultar al médico inmediatamente
- Ciclo de 20 días → FPP adelantada 8 días vs Naegele
- Ciclo de 45 días → FPP retrasada 17 días vs Naegele
- Ecografía en semana 4 → resultado válido pero con
  nota de baja precisión en ecografías muy tempranas
- Ecografía en semana 36 → resultado con nota de que
  en tercer trimestre la ecografía es menos precisa para FPP
- Modo inverso con fecha de parto en el pasado →
  error: "La fecha deseada de parto debe ser futura"
- Usuario accede desde un país con formato MM/DD/AAAA →
  detectar locale y adaptar el date picker automáticamente
- FPP calculada cae el 29 de febrero en año no bisiesto →
  ajustar automáticamente al 1 de marzo con nota explicativa
- Guardar en localStorage y volver al sitio semanas después →
  recalcular automáticamente semanas actuales con los
  datos guardados y mostrar el progreso actualizado