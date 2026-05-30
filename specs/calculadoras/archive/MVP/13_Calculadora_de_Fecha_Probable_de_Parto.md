# Especificación — Calculadora de Fecha Probable de Parto

## Descripción general
Herramienta para calcular la fecha estimada de parto (FPP) a partir
de distintos datos del embarazo: última menstruación, ovulación o
concepción estimada, ecografía, reproducción asistida o FPP oficial.
Es una de las calculadoras
con mayor carga emocional del sitio — la usa una persona en uno
de los momentos más importantes de su vida — por lo que el tono,
el diseño y el tratamiento de la información deben ser cálidos,
empáticos y clínicamente responsables.

Alto volumen de búsqueda sostenido durante todo el año.
El perfil de usuario es principalmente mujeres embarazadas o personas
gestantes, también personas en búsqueda de embarazo y parejas que
acompañan el proceso. La experiencia debe sentirse como una herramienta
de apoyo, no como una calculadora fría.

---

## Alcance de implementación

Esta especificación describe el producto completo. Para construir con
calidad y lanzar rápido, dividir el desarrollo en un **MVP fuerte** y
fases posteriores. El MVP debe resolver muy bien la pregunta principal:
"¿cuál es mi fecha probable de parto y en qué semana estoy?", sin
incluir todavía todas las funciones de retención, contenido y compartir.

### MVP — Lanzamiento inicial

**Objetivo:** entregar una calculadora confiable, cálida y clínicamente
responsable para calcular FPP, edad gestacional e hitos esenciales.

**Incluye:**
- Modo FUM con ciclo regular y ajuste por duración del ciclo.
- Fase lútea avanzada, opcional, si ya encaja naturalmente en la UI.
- Modo ovulación / concepción estimada.
- Modo ecografía.
- Modo FIV / reproducción asistida.
- Modo FPP oficial indicada por profesional.
- Resultado principal: FPP, semanas y días de gestación, días restantes
  o días desde FPP, trimestre actual y estado contextual.
- Ventana de parto: prematuro tardío, término temprano, término completo,
  término tardío y postérmino.
- Nivel de confianza del cálculo: alta, media o baja.
- Comparación básica si se ingresan varios métodos: mostrar diferencias
  en días y recomendar confirmar la FPP oficial si difieren demasiado.
- Fechas importantes esenciales: fin de primer trimestre, ecografía
  anatómica, inicio de tercer trimestre, semana 37, FPP y semana 42.
- Validaciones principales de inputs y mensajes responsables.
- Aviso médico siempre visible.
- Diseño mobile-first validado en 320px, 360px, 390px y 430px.
- Tablas y comparativas del MVP con versión móvil apilada.
- Accesibilidad básica: labels, teclado, estados de error claros.
- SEO básico: title, description, H1, contenido explicativo corto y FAQ
  principales.
- Pruebas unitarias de cálculo para FUM, ciclo irregular, ecografía,
  ovulación/concepción, FIV, FPP oficial y años bisiestos.

**No incluye en MVP:**
- Calculadora inversa.
- Guardar embarazo en localStorage.
- Tarjeta visual para compartir.
- Signo zodiacal.
- Tabla completa semana a semana con tamaño del bebé.
- Contenido largo tipo guía/artículos.
- Comparativa avanzada entre métodos con visualizaciones complejas.

### Fase 2 — Valor emocional y retención

**Objetivo:** hacer que la herramienta sea más útil para volver durante
el embarazo y más rica después del cálculo inicial.

**Incluye:**
- Semana a semana personalizada con próximos hitos.
- Tabla de tamaño aproximado del bebé por semana.
- Contador/progreso más visual, con actualización diaria.
- Guardar embarazo en localStorage con botón para borrar datos.
- Fechas importantes ampliadas, incluyendo rangos orientativos.
- Comparativa de métodos más completa y visual.
- FAQ ampliadas y contenido de apoyo.

### Fase 3 — Compartir, descubrimiento y features opcionales

**Objetivo:** añadir funciones de crecimiento, contenido secundario y
casos de uso menos frecuentes sin distraer del resultado clínico.

**Incluye:**
- Calculadora inversa.
- Tarjeta visual para compartir por WhatsApp/redes.
- Web Share API.
- Signo zodiacal probable como detalle opcional y secundario.
- Artículos SEO largos relacionados.
- Enlaces contextuales más inteligentes a calculadoras relacionadas.

### Criterio de "listo para lanzar" del MVP

- Todos los modos MVP calculan fechas correctas con fechas locales, sin
  desfases por zona horaria.
- Los ejemplos de la spec coinciden con los tests.
- La FPP nunca se comunica como fecha exacta garantizada.
- Los mensajes de FPP vencida evitan generar alarma innecesaria y
  recomiendan seguimiento profesional.
- La UI funciona bien en mobile, con inputs claros y resultado visible
  sin fricción.

---

## Diseño mobile-first y responsive [MVP]

La calculadora debe diseñarse primero para móvil. La versión desktop
puede ampliar el layout, pero no debe ser la experiencia base. En móvil,
la persona debe poder ingresar datos, leer la FPP y entender la semana
actual sin hacer zoom, sin scroll horizontal y sin que el resultado quede
enterrado debajo de contenido secundario.

### Anchos objetivo

Validar visualmente y funcionalmente estos tamaños mínimos:

| Viewport | Uso |
|----------|-----|
| 320px | Soporte mínimo; ningún texto debe salirse del contenedor |
| 360px | Android pequeño |
| 390px | iPhone moderno común |
| 430px | Mobile grande |
| 768px | Tablet / breakpoint intermedio |
| 1024px+ | Desktop |

### Layout móvil

Orden recomendado en mobile:
1. Título claro y breve.
2. Selector de método.
3. Inputs del método elegido.
4. Resultado principal.
5. Confianza del cálculo y aviso médico corto.
6. Detalles desplegables: ventana de parto, fechas importantes,
   comparativa de métodos y explicación.

Requisitos:
- Una sola columna hasta tablet.
- Resultado principal inmediatamente debajo de los inputs.
- El contenido educativo y SEO va después del resultado, no antes.
- No usar tablas anchas en mobile; convertirlas a listas apiladas o cards
  compactas.
- No debe existir scroll horizontal en `body`, secciones, tablas ni cards.
- Evitar cards dentro de cards; cada bloque debe tener jerarquía clara.
- Mantener un ancho máximo legible en desktop, pero usar todo el ancho
  disponible en mobile con márgenes laterales cómodos.

### Selector de método

El selector debe ser usable con muchos métodos sin cortar texto:
- En mobile, usar un `select`, tabs en dos filas o segmented control con
  scroll interno accesible.
- Cada opción debe tener label corto: FUM, Ecografía, FIV, FPP oficial,
  Ovulación.
- El estado activo debe ser evidente.
- Cambiar de método no debe borrar datos ya escritos.
- En 320px ningún label debe quedar truncado de forma ambigua.

### Inputs y controles táctiles

- Campos, selects y botones con alto mínimo de 44px.
- Separación vertical suficiente entre controles para evitar toques
  accidentales.
- Usar `inputmode="numeric"` para días, semanas, ciclo y fase lútea.
- Usar date picker nativo o un selector accesible que no se rompa en
  mobile.
- Labels siempre visibles; no depender solo de placeholders.
- Mensajes de error debajo del campo correspondiente, sin desplazar el
  resultado de forma brusca.
- Los botones principales deben ocupar el ancho disponible en mobile.

### Resultado principal móvil

El resultado debe ser escaneable de inmediato:
- La FPP debe ser el elemento visual más importante.
- Mostrar debajo: semana gestacional, días restantes o transcurridos,
  trimestre y estado.
- Mantener el aviso médico visible, pero resumido; la explicación larga
  puede ir desplegable.
- Si la FPP ya pasó, el mensaje debe ser claro y calmado, sin ocupar toda
  la pantalla.
- En mobile, evitar mostrar demasiados bloques abiertos a la vez.

### Tablas, comparativas y fechas importantes

En mobile:
- La ventana de parto debe mostrarse como lista de rangos, no tabla
  horizontal.
- La comparativa de métodos debe mostrarse como bloques por método:
  método, fecha, diferencia y confianza.
- Las fechas importantes deben agruparse en acordeón o lista compacta.
- La tabla de tamaño del bebé queda para Fase 2 y debe poder renderizarse
  como lista semanal, no como tabla ancha.

En tablet/desktop:
- Se pueden usar tablas si caben sin scroll horizontal y mantienen buena
  legibilidad.

### Tipografía y ajuste visual

- No usar tamaños de fuente basados en `vw`.
- El texto debe envolver correctamente; no cortar palabras importantes.
- Fechas largas como "martes, 21 de abril de 2026" deben caber en 320px.
- Evitar encabezados enormes dentro de paneles compactos.
- Los números principales pueden ser grandes, pero deben mantener altura
  estable para que el layout no salte.

### Criterios de QA móvil

Antes de lanzar el MVP:
- Verificar manualmente 320px, 360px, 390px y 430px.
- Confirmar que no hay scroll horizontal.
- Confirmar que los inputs son tocables y visibles al abrir el teclado.
- Confirmar que errores largos no rompen el layout.
- Confirmar que todas las tablas del MVP tienen versión móvil apilada.
- Confirmar que el resultado aparece sin tener que recorrer contenido
  educativo.
- Confirmar que el layout no se rompe con fechas largas, método FIV y
  comparativas de dos o más métodos.

---

## Conceptos base

### Duración del embarazo
- La edad gestacional se cuenta desde el **primer día** de la
  última menstruación (FUM), no desde el último día de sangrado.
- La fecha probable de parto (FPP) estándar equivale a **40 semanas**
  (280 días) desde el primer día de la FUM.
- Equivale a **10 meses lunares** o aproximadamente **9 meses calendario**.
- Clasificación por edad gestacional:
  - Prematuro: antes de **37+0** semanas.
  - Prematuro tardío: **34+0 a 36+6** semanas.
  - A término temprano: **37+0 a 38+6** semanas.
  - A término completo: **39+0 a 40+6** semanas.
  - A término tardío: **41+0 a 41+6** semanas.
  - Postérmino: desde **42+0** semanas.
- Solo el ~5% de los bebés nacen exactamente en la FPP.

### Regla de Naegele (método estándar)
El método más usado clínicamente para calcular la FPP
a partir de la fecha de la última menstruación:

FPP = FUM + 280 días
    = FUM + 9 meses + 7 días
    = FUM − 3 meses + 7 días + 1 año (si aplica)

**Ejemplo:**
FUM: 15 de julio de 2025
FPP: 21 de abril de 2026

**Nota técnica:** para evitar desfases por meses de distinta duración,
el cálculo en código debe usar suma exacta de días (`addDays(FUM, 280)`)
o `Temporal.PlainDate`, no aritmética manual de meses.

### Ajuste por ciclo irregular
La Regla de Naegele asume un ciclo de 28 días.
Si el ciclo es regular pero diferente de 28 días, se ajusta la FPP:

Ajuste = duración_ciclo − 28 días
FPP_ajustada = FPP_naegele + ajuste

**Ejemplo:** ciclo de 32 días → FPP + 4 días

Si la usuaria conoce su fase lútea, usar el cálculo avanzado:

Ovulación estimada = FUM + duración_ciclo − fase_lútea
FPP = ovulación_estimada + 266 días

Si no se informa fase lútea, asumir 14 días. En ciclos muy irregulares
este ajuste pierde precisión; sugerir usar una ecografía temprana o la
fecha indicada por su profesional de salud.

### Trimestres del embarazo

| Trimestre | Semanas | Período |
|-----------|---------|---------|
| Primer trimestre | Semanas 1–13+6 | Formación de órganos |
| Segundo trimestre | Semanas 14+0–27+6 | Crecimiento rápido |
| Tercer trimestre | Desde semana 28+0 | Maduración y preparación |

---

## Casos de uso (modos de cálculo)

### Modo 1 — Por fecha de última menstruación (FUM) [MVP]
> El método más común. La persona sabe cuándo
> fue su última menstruación.

**Inputs:**
- Primer día de la última menstruación (FUM) → ej. 15/07/2025
- Duración del ciclo menstrual → ej. 28 días (rango: 20–45)
- Duración de la fase lútea → ej. 14 días (avanzado, opcional)

**Cálculo:**
FPP base (Naegele) = 15/07/2025 + 280 días = 21/04/2026
Ajuste por ciclo (28 días, sin ajuste) = 0 días
FPP final = **21 de abril de 2026**

Semanas actuales de gestación:
Hoy (25/04/2026) − FUM (15/07/2025) = 284 días = **40 semanas y 4 días**

**Output principal:**
- Fecha probable de parto: **21 de abril de 2026** 🍼
- Semanas de gestación hoy: **40 semanas y 4 días**
- Trimestre actual: **Tercer trimestre**
- Estado: ⚠️ "Tu fecha probable de parto ya pasó hace 4 días.
  Consulta con tu médico si aún no has dado a luz."

**Output secundario — ventana de parto:**
- Parto prematuro tardío (desde 34+0): **10 de marzo de 2026**
- Parto a término temprano (37+0 a 38+6): **31 de marzo al 13 de abril de 2026**
- Parto a término completo (39+0 a 40+6): **14 al 27 de abril de 2026**
- Parto a término tardío (41+0 a 41+6): **28 de abril al 4 de mayo de 2026**
- Parto postérmino (desde 42+0): **5 de mayo de 2026**

---

### Modo 2 — Por fecha de ovulación / concepción estimada [MVP]
> La persona conoce la fecha aproximada de ovulación, fecundación
> o inseminación. Si solo conoce una fecha de relación sexual, tratarla
> como una aproximación de menor precisión.

**Inputs:**
- Fecha de ovulación / fecundación estimada → ej. 28/07/2025
- Tipo de dato (opcional) → ovulación, fecundación, relación sexual,
  inseminación

**Cálculo:**
FPP = fecha_concepción + 266 días (38 semanas desde fecundación)
FUM estimada = fecha_concepción − 14 días

**Output:**
- Fecha probable de parto: **20 de abril de 2026**
- Edad desde fecundación: **38 semanas**
- Edad gestacional clínica (desde FUM estimada): **40 semanas**
  (la FUM estimada sería ~14 julio 2025)
- Nota: "La fecha de concepción exacta es difícil de determinar.
  Esta fecha es una estimación. Los espermatozoides pueden vivir varios
  días, por lo que una fecha de relación sexual no siempre coincide con
  la fecha real de fecundación."

---

### Modo 3 — Por resultado de ecografía [MVP]
> El médico ha dado una edad gestacional en la ecografía.
> La persona quiere calcular su FPP desde ese dato.

**Inputs:**
- Fecha de la ecografía → ej. 10/10/2025
- Semanas de gestación en la ecografía → ej. 12
- Días adicionales (opcional) → ej. 3 días

**Cálculo:**
Edad gestacional en eco = (12 × 7) + 3 = 87 días
Días restantes hasta 40 semanas = 280 − 87 = 193 días
FPP = 10/10/2025 + 193 días
FPP = **21 de abril de 2026**

FUM estimada = fecha_eco − (semanas_eco × 7) − días
             = 10/10/2025 − 87 días = **15 de julio de 2025**

**Output:**
- Fecha probable de parto: **21 de abril de 2026**
- FUM estimada: **15 de julio de 2025**
- Semanas de gestación hoy (si hoy fuese 25/04/2026):
  **40 semanas y 4 días**
- Nota: "La fecha por ecografía es más precisa que por FUM,
  especialmente si se realizó antes de la semana 14."

---

### Modo 4 — Calculadora inversa [Fase 3]
> La persona quiere saber en qué fecha debió ser
> su última menstruación para que el parto sea
> en una fecha determinada.

**Inputs:**
- Fecha deseada de parto → ej. 25 de diciembre de 2026
- Duración del ciclo → ej. 28 días

**Cálculo:**
FUM = FPP_deseada − 280 días = **20 de marzo de 2026**
Fecha probable de concepción = FPP_deseada − 266 días = **3 de abril de 2026**

Si se informa una duración de ciclo distinta de 28 días:
FUM_ajustada = FPP_deseada − 280 días − (duración_ciclo − 28)
Ovulación / concepción estimada = FPP_deseada − 266 días

**Output:**
- Para un parto el 25 de diciembre de 2026:
- La FUM debería ser alrededor del: **20 de marzo de 2026**
- La concepción debería ocurrir alrededor del: **3 de abril de 2026**
- Nota importante: "El momento del parto no es controlable
  con precisión. Este cálculo es solo orientativo."

---

### Modo 5 — FIV / reproducción asistida [MVP]
> La persona conoce la fecha de fecundación, extracción ovocitaria,
> inseminación o transferencia embrionaria. En FIV/ICSI suele ser uno de
> los métodos más precisos porque la fecha de fecundación está mejor
> definida. En IUI, tratar la fecha como aproximación cercana a ovulación.

**Inputs:**
- Tipo de tratamiento → FIV/ICSI, transferencia embrionaria, IUI
- Fecha de fecundación / extracción ovocitaria → opcional
- Fecha de transferencia embrionaria → opcional
- Fecha de inseminación intrauterina (IUI) → opcional
- Edad del embrión al transferir → día 3, día 5 o día 6

**Cálculo:**
- Si se conoce fecha de fecundación / extracción ovocitaria:
  FPP = fecha_fecundación + 266 días
- Si se conoce fecha de transferencia:
  FPP = fecha_transferencia + (266 − edad_embrión_en_días)
- Si se conoce fecha de IUI:
  FPP = fecha_IUI + 266 días, con confianza media salvo indicación
  clínica más precisa
- FUM estimada = FPP − 280 días
- Edad gestacional en fecha de transferencia =
  14 días + edad_embrión_en_días

**Ejemplo:**
Transferencia de embrión día 5 el 10/01/2026:
FPP = 10/01/2026 + 261 días = **28 de septiembre de 2026**
FUM estimada = **22 de diciembre de 2025**

**Output:**
- Fecha probable de parto: **28 de septiembre de 2026**
- Edad gestacional el día de la transferencia: **2 semanas y 5 días**
- Método usado: **transferencia embrionaria día 5**
- Confianza del cálculo: **Alta**
- Nota: "En reproducción asistida, la clínica puede darte una FPP
  oficial. Usa esa fecha como referencia principal si difiere de este
  cálculo."

---

### Modo 6 — Por FPP oficial [MVP]
> La persona ya recibió una fecha probable de parto de su médico,
> matrona o clínica y quiere ver semanas actuales, hitos y progreso.

**Inputs:**
- FPP oficial indicada por profesional → ej. 21/04/2026

**Cálculo:**
FUM estimada = FPP_oficial − 280 días
Semanas actuales = hoy − FUM_estimada

**Output:**
- Fecha probable de parto: **21 de abril de 2026**
- Método usado: **FPP oficial indicada por profesional**
- Semanas de gestación hoy: **[X semanas y Y días]**
- Confianza del cálculo: **Según indicación profesional**
- Nota: "Usaremos esta fecha como referencia principal para hitos y
  progreso, porque fue indicada por tu equipo de salud."

---

## Precisión, confianza y comparación de métodos [MVP base / Fase 2 avanzada]

La calculadora debe evitar presentar todas las fechas como igual de
precisas. Mostrar siempre el método usado y un nivel de confianza.

### Prioridad sugerida de métodos
1. FPP oficial indicada por médico, matrona o clínica de fertilidad.
2. Reproducción asistida con fecha de fecundación o transferencia.
3. Ecografía temprana de datación, especialmente antes de 14 semanas.
4. FUM confiable con ciclos regulares.
5. Fecha de ovulación estimada.
6. Fecha de relación sexual aproximada.
7. Ecografía tardía usada solo para estimar cuando no hay otra fecha.

### Niveles de confianza

| Nivel | Cuándo mostrarlo | Mensaje corto |
|-------|------------------|---------------|
| Alta | FIV/ICSI con fecha de fecundación o transferencia clara, ecografía de primer trimestre o FUM confirmada por ecografía temprana | "Estimación de alta confianza, aun así la fecha exacta de parto puede variar." |
| Media | FUM confiable con ciclo regular, fecha de ovulación bien identificada o IUI con fecha clara | "Buena estimación si tus ciclos son regulares." |
| Baja | Ciclos muy irregulares, solo fecha de relación sexual, FUM incierta o ecografía de tercer trimestre | "Estimación orientativa; confirma tu FPP con tu profesional de salud." |

### Comparar métodos cuando haya varios datos
Si la usuaria introduce más de un método, mostrar una tabla comparativa:

| Método | FPP calculada | Diferencia vs FPP principal | Confianza |
|--------|---------------|-----------------------------|-----------|
| FUM | [fecha] | referencia | Media |
| Ecografía | [fecha] | +4 días | Alta |
| Ovulación/concepción | [fecha] | −1 día | Media |

Reglas de visualización:
- Si la diferencia es menor o igual a 5–7 días, mostrar:
  "Las fechas son muy cercanas; es normal que haya pequeñas diferencias."
- Si la diferencia es mayor, mostrar:
  "Tus datos dan fechas distintas. Tu equipo médico puede indicar cuál
  usar como FPP oficial."
- No cambiar automáticamente la FPP por una ecografía tardía si ya existe
  una FPP oficial; solo explicar la diferencia.

### Umbrales orientativos para discrepancias FUM vs ecografía
Usar estos umbrales solo para explicar la diferencia, no para dar una
decisión médica:

| Edad gestacional en la ecografía | Diferencia que amerita consultar |
|----------------------------------|----------------------------------|
| Hasta 8+6 semanas | Más de 5 días |
| 9+0 a 15+6 semanas | Más de 7 días |
| 16+0 a 21+6 semanas | Más de 10 días |
| 22+0 a 27+6 semanas | Más de 14 días |
| Desde 28+0 semanas | Más de 21 días |

---

## Timeline del embarazo semana a semana [Fase 2]

### Hitos principales por semana

| Semana | Hito del bebé | Hito de la persona gestante |
|--------|--------------|-----------------|
| 4 | Implantación completa | Test de embarazo positivo posible |
| 6 | Latido cardíaco detectable | Náuseas matutinas comunes |
| 8 | Tamaño: 1.6 cm (frambuesa) | Primeras citas prenatales |
| 10 | Todos los órganos formados | Fin del período embrionario |
| 12 | Tamaño: 5.4 cm (lima) | Se acerca el fin del primer trimestre |
| 13 | Crecimiento rápido | Fin del primer trimestre cerca de 13+6 |
| 16 | Movimientos perceptibles en algunas personas | A veces es posible conocer el sexo |
| 20 | Ecografía morfológica | Mitad del embarazo 🎉 |
| 24 | Umbral de viabilidad con atención especializada | Inicio del tercer trimestre cerca |
| 28 | Ojos pueden abrirse | Inicio tercer trimestre |
| 32 | Tamaño: 42 cm | Preparativos para el nacimiento |
| 36 | Maduración pulmonar avanzada | Posición cefálica idealmente |
| 37 | A término temprano | Maleta lista para el hospital |
| 40 | Fecha probable de parto | Contracciones regulares posibles |

---

## Feature — Semana a semana personalizada [Fase 2]
Mostrar la semana de gestación actual y los próximos
3–4 hitos más cercanos en el tiempo.

**Display para una persona en semana 20:**

📍 Estás en la semana 20 — ¡Mitad del embarazo! 🎉
Próximos hitos:
Semana 24 → Viabilidad fetal (en 4 semanas)
Semana 28 → Inicio del tercer trimestre (en 8 semanas)
Semana 32 → Preparativos finales (en 12 semanas)
Semana 37 → A término temprano (en 17 semanas)
Semana 40 → Fecha probable de parto (en 20 semanas)

---

## Feature — Contador de semanas en tiempo real [Fase 2]
Display prominente con las semanas y días actuales:

🤰 Llevas exactamente:
20 semanas y 3 días
████████████░░░░░░░░  51% del embarazo completado
Faltan 137 días para tu fecha probable de parto
(19 semanas y 4 días)

Barra de progreso del 0% al 100% (semana 40).
Actualización diaria (no por segundos — evitar ansiedad).

---

## Feature — Fechas importantes calculadas automáticamente [MVP parcial / Fase 2 ampliada]

A partir de la mejor FPP disponible, calcular una FUM estimada
(`FPP − 280 días`) y mostrar fechas relevantes. Estas fechas son
orientativas y no sustituyen el calendario prenatal indicado por el
equipo médico.

| Evento | Semana | Fecha estimada |
|--------|--------|----------------|
| Fin del primer trimestre | 13+6 | [fecha] |
| Ecografía morfológica / anatómica | 18+0 a 22+0 | [rango] |
| Tamiz de diabetes gestacional habitual | 24+0 a 28+0 | [rango] |
| Inicio tercer trimestre | 28+0 | [fecha] |
| Parto prematuro tardío | 34+0 a 36+6 | [rango] |
| A término temprano | 37+0 a 38+6 | [rango] |
| A término completo | 39+0 a 40+6 | [rango] |
| Fecha probable de parto | 40+0 | [fecha] 🍼 |
| A término tardío | 41+0 a 41+6 | [rango] |
| Postérmino | Desde 42+0 | [fecha] |

---

## Feature — Comparativa de tamaño del bebé [Fase 2]
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

## Feature — Cálculo del signo zodiacal del bebé [Fase 3]
Basado en la FPP, mostrar el signo zodiacal probable del bebé.
Con nota de que puede nacer antes o después.
Debe ser un detalle secundario y opcional, nunca parte del resultado
clínico principal.

**Output:**
- Si nace en la FPP: ♉ **Tauro** (20 abr – 20 may)
- Si nace 2 semanas antes: ♈ **Aries**
- Si nace 2 semanas después: ♉ **Tauro**

---

## Feature — Compartir la noticia [Fase 3]
Tarjeta visual para compartir por WhatsApp o redes:

🍼 ¡Estamos esperando un bebé!
📅 Fecha probable de parto: 21 de abril de 2026
🤰 Semanas de gestación: 20 semanas
⭐ Signo del bebé: ♉ Tauro
Calculado en calculadoras.tools

Botón "Generar tarjeta" y "Compartir en WhatsApp".
La tarjeta debe generarse solo por acción explícita del usuario.
No incluir nombres, datos médicos ni método de cálculo salvo que la
persona los escriba voluntariamente.

---

## Inputs detallados [Todas las fases]

La tabla lista todos los campos posibles del producto completo. Para el
MVP, implementar solo los campos necesarios para los modos marcados
como `[MVP]`; los campos exclusivos de calculadora inversa, compartir o
retención se implementan en fases posteriores.

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|-------------|-------------------|
| Primer día de FUM | Date picker | Hasta 42 semanas atrás; advertir si supera 42+0 | — |
| Duración del ciclo | Numérico / Slider | 20 – 45 días | 28 días |
| Duración de fase lútea | Numérico avanzado | 10 – 17 días | 14 días |
| Fecha de ovulación / concepción estimada | Date picker | Hasta 38 semanas atrás | — |
| Tipo de dato de concepción | Selector | Ovulación / fecundación / relación sexual / inseminación | Ovulación |
| Fecha de ecografía | Date picker | Hasta hoy | — |
| Semanas en ecografía | Numérico | 4 – 42 semanas | — |
| Días en ecografía | Numérico | 0 – 6 días | 0 |
| Tipo de reproducción asistida | Selector | FIV/ICSI / transferencia / IUI | — |
| Fecha de fecundación o extracción | Date picker | Hasta 38 semanas atrás | — |
| Fecha de transferencia embrionaria | Date picker | Hasta hoy | — |
| Fecha de IUI | Date picker | Hasta 38 semanas atrás | — |
| Edad del embrión | Selector | Día 3 / día 5 / día 6 | Día 5 |
| FPP oficial indicada por profesional | Date picker | Pasado o futuro razonable | — |
| Fecha deseada de parto | Date picker | Futuro | — |
| Formato de fecha | Selector | DD/MM/AAAA / MM/DD/AAAA | Según locale |

---

## Tono y tratamiento responsable del tema

Esta calculadora acompaña uno de los momentos más
significativos en la vida de una persona. Aplicar siempre:

✅ **Usar:**
- Lenguaje cálido y esperanzador: "tu bebé", "tu embarazo"
- Énfasis constante en que la FPP es una estimación
- Recordatorios de consultar con el médico, ginecólogo o matrona
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
  Sigue las indicaciones de tu equipo médico y contacta si tienes dudas,
  síntomas o contracciones regulares."
- FPP ya pasó (< 1 semana): "Tu fecha probable de parto
  fue hace X días. Es frecuente que el bebé no llegue exactamente
  en esa fecha. Mantén contacto con tu médico o matrona."
- FPP ya pasó (> 1 semana): "Han pasado X días desde tu
  fecha probable de parto. Consulta con tu médico si
  aún no has dado a luz — esto requiere seguimiento médico."
- La calculadora no evalúa síntomas, riesgos ni señales de alarma.
  Ante cualquier preocupación, priorizar contacto con el equipo médico.

---

## Validaciones de inputs

| Regla | Detalle |
|-------|---------|
| FUM no futura | Error: "La fecha de última menstruación no puede ser futura" |
| FUM como primer día | Microcopy junto al campo: "Elige el primer día de sangrado de tu última menstruación" |
| FUM hace más de 42 semanas | Advertencia prominente: "Esta fecha sugiere más de 42 semanas de embarazo. Confirma el dato y consulta con tu médico si aún no has dado a luz." |
| Ciclo entre 20 y 45 días | Fuera de rango: advertencia con sugerencia de consultar médico |
| Fase lútea entre 10 y 17 días | Fuera de rango: volver a 14 por defecto o pedir revisión del dato |
| Semanas eco entre 4 y 42 | Fuera de rango: error claro |
| Fecha eco futura | Error: "La fecha de la ecografía no puede ser futura" |
| Ecografía tardía | Si edad eco ≥ 28+0, mostrar nota de menor precisión para datar FPP |
| Transferencia FIV | Requiere fecha de transferencia y edad del embrión |
| Fecha de transferencia futura | Error: "La fecha de transferencia no puede ser futura" |
| Fecha de IUI futura | Error: "La fecha de inseminación no puede ser futura" |
| FPP oficial muy lejana | Si implica embarazo < 0 o > 42+0, pedir confirmar dato |
| Métodos discrepantes | Si dos métodos difieren más que los umbrales definidos, mostrar comparativa y recomendar confirmar la FPP oficial |
| Fecha inválida manual | Bloquear fechas inexistentes como 29/02 en años no bisiestos |
| Campos vacíos | Bloquear cálculo y resaltar campo faltante |
| Ciclo muy irregular (< 21 o > 35 días) | Nota: "Con ciclos muy irregulares la FPP puede ser menos precisa. La ecografía es más confiable." |

---

## Formato de outputs

| Tipo de resultado | Formato |
|-------------------|---------|
| Fecha probable de parto | Formato largo → "martes, 21 de abril de 2026" |
| Semanas de gestación | "X semanas y Y días" |
| Días restantes | Número entero → "137 días" |
| Progreso | Porcentaje entero → "51% completado" |
| Fechas de hitos | Formato largo con semana → "Semana 20 · 10 enero 2026" |
| Tamaño del bebé | cm y gramos → "25.6 cm · 300 g" |
| Método usado | "Calculado por FUM", "Calculado por ecografía", etc. |
| Confianza del cálculo | Alta / Media / Baja con explicación breve |
| Comparativa de métodos | Tabla compacta con diferencia en días |

---

## Features adicionales

### Cálculo instantáneo [MVP]
- El resultado aparece automáticamente al completar
  la fecha principal, sin botón de calcular.

### Toggle entre métodos [MVP]
- Selector visible para cambiar entre FUM / Ovulación-concepción /
  Ecografía / FIV / FPP oficial / Inversa sin perder los datos ya
  ingresados.

### Botón de copiar resultado [Fase 2]
- Copia: "FPP: 21 de abril de 2026 · Semana 20 de gestación ·
  Método: FUM · Confianza: media"

### Guardar mi embarazo [Fase 2]
- Guardar FPP, método, inputs mínimos y fecha de cálculo en localStorage
  para que al volver al sitio la calculadora recuerde los datos y
  recalcule la semana actual.
- Sin cuenta, sin backend, solo localStorage.
- Botón: "Recordar mi embarazo en este dispositivo"
- Botón secundario: "Borrar datos guardados"
- Microcopy: "Solo se guarda en este navegador. No se envía a ningún
  servidor."

### Aviso médico [MVP]
- Siempre visible:
  "La fecha probable de parto es una estimación.
  Solo entre el 3% y el 5% de los bebés nacen
  exactamente en esa fecha. Tu médico o matrona
  es la mejor fuente de información sobre tu embarazo."

---

## Calculadoras relacionadas (enlaces contextuales) [Fase 3]

| Situación | Enlace sugerido |
|-----------|----------------|
| Siempre | → Calculadora de semanas de gestación |
| Siempre | → Calculadora de ovulación |
| Quiere calcular su IMC | → Calculadora de IMC |
| Quiere calcular calorías en embarazo | → Calculadora de TDEE |
| Quiere saber la edad del bebé futuro | → Calculadora de edad |

---

## SEO y contenido de la página [MVP básico / Fases 2–3 ampliado]

### Meta información
- Title: "Calculadora de Fecha Probable de Parto — ¿Cuándo Nacerá mi Bebé?"
- Description: "Calcula tu fecha probable de parto por FUM, fecha de
  ovulación/concepción, ecografía o FIV. Semanas de gestación, hitos
  del embarazo y tamaño del bebé semana a semana. Gratis."

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
- ¿La FUM es el primer o el último día de la menstruación?
- ¿Cómo se calcula la FPP en FIV o transferencia embrionaria?
- ¿Qué pasa si la FUM y la ecografía dan fechas distintas?
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
- Guía: "Cómo interpretar una diferencia entre FUM y ecografía".

---

## Especificaciones técnicas

| Parámetro | Detalle |
|-----------|---------|
| Plataforma | Web responsive (mobile-first) |
| Breakpoints QA | 320px, 360px, 390px, 430px, 768px, 1024px+ |
| Layout mobile | Una columna, sin scroll horizontal, resultado inmediatamente después de inputs |
| Tablas en mobile | Convertir a listas/cards apiladas; no depender de tablas horizontales |
| Controles táctiles | Altura mínima 44px, labels visibles y estados de error bajo cada campo |
| Sin backend | Todo el cálculo ocurre en el cliente (JS) |
| Manejo de fechas | Preferir `Temporal.PlainDate`; alternativa `date-fns` con fechas locales normalizadas |
| Evitar timezone bugs | No calcular con timestamps UTC ni `Date` serializado sin control de zona horaria |
| Datos semana a semana | JSON embebido con semanas 4–42 y rangos de hitos |
| Guardar embarazo | localStorage del navegador, con botón de borrado |
| Barra de progreso | CSS nativo con animación suave |
| Compartir WhatsApp | API WhatsApp Web con texto codificado; usar Web Share API si está disponible |
| Generar tarjeta | html2canvas o equivalente ligero, solo bajo acción explícita |
| Accesibilidad | Labels en todos los inputs, soporte teclado |
| URL principal | /fecha-probable-de-parto |
| Idioma | Español; fechas en formato largo localizado |
| Locale | es-MX base con nombres de meses en español |
| Pruebas mínimas | Casos de FUM, ciclo irregular, fase lútea, ecografía, FIV, año bisiesto y discrepancias |

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

## Casos extremos a contemplar [MVP + fases posteriores]

- FUM hace exactamente 40 semanas → FPP = hoy;
  mostrar mensaje especial cálido
- FUM hace más de 42 semanas → advertencia prominente
  de consultar al médico inmediatamente
- Ciclo de 20 días → FPP adelantada 8 días vs Naegele
- Ciclo de 45 días → FPP retrasada 17 días vs Naegele
- Fase lútea de 12 días con ciclo de 32 → ovulación estimada en día 20
  del ciclo y FPP ajustada según esa ovulación
- Ecografía en semana 4 → resultado válido pero con
  nota de baja precisión en ecografías muy tempranas
- Ecografía en semana 36 → resultado con nota de que
  en tercer trimestre la ecografía es menos precisa para FPP
- FUM y ecografía difieren más de 10 días → mostrar comparativa,
  no decidir automáticamente
- Transferencia embrionaria día 3 / día 5 / día 6 → aplicar fórmula
  específica de FIV
- FPP oficial ingresada por la usuaria → usar como referencia principal
  para semanas actuales e hitos
- Modo inverso con fecha de parto en el pasado →
  error: "La fecha deseada de parto debe ser futura"
- Usuario accede desde un país con formato MM/DD/AAAA →
  detectar locale y adaptar el date picker automáticamente
- Usuario escribe manualmente 29/02 en año no bisiesto →
  bloquear como fecha inválida
- FPP calculada cae el 29 de febrero en año bisiesto →
  mostrar 29 de febrero sin ajustes artificiales
- Guardar en localStorage y volver al sitio semanas después →
  recalcular automáticamente semanas actuales con los
  datos guardados y mostrar el progreso actualizado
- Usuario pulsa "Borrar datos guardados" → limpiar localStorage y volver
  al estado inicial

---

## Referencias clínicas para mantener la spec

- ACOG — Methods for Estimating the Due Date:
  https://www.acog.org/clinical/clinical-guidance/committee-opinion/articles/2017/05/methods-for-estimating-the-due-date
- ACOG — Definition of Term Pregnancy:
  https://www.acog.org/clinical/clinical-guidance/committee-opinion/articles/2013/11/definition-of-term-pregnancy
- Merck Manual — Pregnancy Test and Due Date:
  https://www.merckmanuals.com/home/women-s-health-issues/normal-pregnancy/pregnancy-test-and-due-date
