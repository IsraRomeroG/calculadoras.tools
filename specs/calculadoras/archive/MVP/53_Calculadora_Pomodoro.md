# Especificación v2 - Calculadora Pomodoro

## Descripción general

Herramienta mobile-first para planear sesiones Pomodoro y convertir una
intención de trabajo en un plan accionable: duración total, hora estimada de
finalización, cantidad de ciclos posibles dentro de un bloque disponible y una
agenda clara con bloques de foco y descanso.

El MVP debe priorizar el cálculo, la planificación y la salida útil para copiar
o seguir durante el día. Puede incorporar un temporizador simple en una fase
posterior, pero no debe depender de backend, base de datos ni llamadas a APIs
externas.

**Arquitectura:** todo el cálculo ocurre en el cliente.

---

## Objetivo de producto

- Calcular la duración total de una sesión Pomodoro a partir de un número de
  pomodoros.
- Estimar cuántos pomodoros caben en un bloque de tiempo disponible.
- Mostrar hora estimada de finalización o validar si el plan termina antes de
  una hora límite.
- Generar una agenda de bloques con foco, descansos cortos y descansos largos.
- Ofrecer presets rápidos para reducir fricción en móvil.
- Copiar un resumen útil del plan.
- Generar una página estática optimizada para SEO en Astro.

---

## Alcance recomendado

### MVP

- Dos modos de cálculo:
  - `Quiero hacer N pomodoros`.
  - `Tengo X tiempo disponible`.
- Presets rápidos:
  - Clásico: `25 / 5 / 20`.
  - Largo: `50 / 10 / 30`.
  - Profundo: `90 / 15 / 30`.
  - Personalizado.
- Duración de foco.
- Descanso corto.
- Descanso largo.
- Número de pomodoros, cuando aplique.
- Tiempo disponible, cuando aplique.
- Frecuencia de descanso largo.
- Hora de inicio opcional.
- Hora límite opcional.
- Resultado principal:
  - Tiempo total.
  - Hora estimada de finalización.
  - Pomodoros completos posibles, en modo de tiempo disponible.
  - Estado frente a la hora límite: dentro del tiempo, excedido o sin límite.
- Desglose:
  - Tiempo de foco total.
  - Tiempo de descanso total.
  - Cantidad de descansos cortos y largos.
  - Minutos sobrantes, en modo de tiempo disponible.
  - Agenda de bloques con hora de inicio y fin.
- Recomendaciones automáticas:
  - Advertir si el plan supera `4 horas`.
  - Advertir con mayor énfasis si supera `8 horas`.
  - Sugerir dividir en bloques cuando el total sea largo.
- Copiar resumen y limpiar formulario.

### Fase 2

- Temporizador con iniciar, pausar, reanudar y reiniciar.
- Sonido opcional local.
- Guardar presets personalizados en `localStorage`.
- Estadísticas locales simples.
- Exportar agenda a texto con formato extendido.
- Compartir plan mediante Web Share API cuando esté disponible.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL inmediata recomendada | `/fecha-tiempo/calculadora-pomodoro` |
| URL futura si existe Productividad | `/productividad/calculadora-pomodoro` |
| Archivo Astro recomendado | `src/pages/fecha-tiempo/calculadora-pomodoro.astro` |
| Lógica de cálculo | `src/lib/calculators/fecha-tiempo/calculadora-pomodoro/pomodoro.ts` |
| Pruebas unitarias | `src/lib/calculators/fecha-tiempo/calculadora-pomodoro/pomodoro.test.ts` |
| Categoría inmediata | `fecha-tiempo` |
| Categoría futura opcional | `productividad` |
| Locale base | `es-MX` |

---

## Comportamiento mobile-first

- La primera pantalla debe permitir calcular sin leer instrucciones largas.
- Mostrar primero el resumen: total, hora de fin y pomodoros posibles.
- Usar pestañas o control segmentado para elegir el modo de cálculo.
- Ubicar presets rápidos cerca de los inputs de duración.
- Mantener inputs numéricos compactos, con valores por defecto.
- Usar controles táctiles grandes para acciones primarias: calcular, copiar,
  limpiar y temporizador si se implementa.
- Mostrar la agenda debajo del resultado principal, preferentemente colapsable
  cuando tenga muchos bloques.
- Evitar animaciones que distraigan del flujo.
- Evitar texto instructivo largo dentro de la herramienta.
- El resultado debe ser legible en una sola columna en pantallas pequeñas.

---

## Flujo principal MVP

### Modo 1: quiero hacer N pomodoros

**Ejemplo:** quiero hacer `6` pomodoros de `25` minutos, descansos cortos de
`5` minutos y descanso largo de `20` minutos cada `4` pomodoros. ¿Cuánto tarda
y a qué hora termino?

### Modo 2: tengo X tiempo disponible

**Ejemplo:** tengo `2 horas` desde las `09:00`. ¿Cuántos pomodoros completos de
`25` minutos caben, incluyendo descansos, y cuánto tiempo queda libre?

### Modo 3 opcional: quiero terminar antes de una hora

**Ejemplo:** empiezo a las `09:00` y quiero terminar antes de las `12:00`.
¿Cuántos pomodoros completos caben y cuál es el último bloque viable?

Este modo puede implementarse como una variante del modo de tiempo disponible:

```text
tiempo_disponible = hora_limite - hora_inicio
```

---

## Inputs del MVP

| Campo | Tipo | Rango válido | Valor por defecto | Aplica a |
|-------|------|--------------|-------------------|----------|
| Modo de cálculo | Segmentado | `pomodoros`, `tiempo` | `pomodoros` | Todos |
| Preset | Botones compactos | clásico, largo, profundo, personalizado | clásico | Todos |
| Pomodoros | Texto numérico | `1-50` | `4` | Modo pomodoros |
| Tiempo disponible | Horas/minutos o minutos | `1-720` min | `120` min | Modo tiempo |
| Minutos de foco | Texto numérico | `1-120` | `25` | Todos |
| Descanso corto | Texto numérico | `0-60` | `5` | Todos |
| Descanso largo | Texto numérico | `0-120` | `20` | Todos |
| Descanso largo cada | Texto numérico | `1-20` pomodoros | `4` | Todos |
| Hora de inicio | Hora opcional | hora válida | ahora | Todos |
| Hora límite | Hora opcional | hora válida posterior a inicio | vacío | Todos |

---

## Outputs principales

- Tiempo total.
- Hora estimada de finalización.
- Pomodoros completos incluidos en el plan.
- Tiempo de foco total.
- Tiempo de descanso total.
- Cantidad de descansos cortos.
- Cantidad de descansos largos.
- Minutos sobrantes, si el cálculo parte de tiempo disponible.
- Estado frente a la hora límite:
  - `Termina a tiempo`.
  - `Se pasa por X min`.
  - `Sin hora límite`.
- Agenda de bloques con:
  - Tipo: foco, descanso corto o descanso largo.
  - Número de pomodoro relacionado.
  - Duración.
  - Hora de inicio.
  - Hora de fin.
- Resumen copiable.

---

## Fórmulas y algoritmo

### Modo pomodoros

```text
foco_total = pomodoros * minutos_foco
descansos_largos = floor((pomodoros - 1) / frecuencia_descanso_largo)
descansos_cortos = max(0, pomodoros - 1 - descansos_largos)
descanso_total = descansos_cortos * descanso_corto + descansos_largos * descanso_largo
total_minutos = foco_total + descanso_total
fin = inicio + total_minutos
```

La secuencia nunca debe agregar descanso después del último pomodoro.

### Modo tiempo disponible

Calcular cuántos pomodoros completos caben dentro del tiempo disponible,
incluyendo los descansos que ocurren entre pomodoros.

Algoritmo recomendado:

```text
minutos_usados = 0
pomodoros = 0
bloques = []

mientras minutos_usados + minutos_foco <= tiempo_disponible:
  agregar bloque de foco
  minutos_usados += minutos_foco
  pomodoros += 1

  siguiente_descanso = descanso_largo si pomodoros % frecuencia_descanso_largo == 0
                      si no descanso_corto

  si minutos_usados + siguiente_descanso + minutos_foco <= tiempo_disponible:
    agregar bloque de descanso
    minutos_usados += siguiente_descanso
  si no:
    terminar

minutos_sobrantes = tiempo_disponible - minutos_usados
```

El algoritmo evita agregar un descanso si después de ese descanso ya no cabe
otro bloque de foco.

### Hora límite

Si el usuario proporciona hora de inicio y hora límite:

```text
tiempo_disponible = diferencia_en_minutos(hora_inicio, hora_limite)
```

Si la hora límite es menor o igual que la hora de inicio, interpretar que la
hora límite corresponde al día siguiente.

---

## Validaciones y estados

- Pomodoros debe ser al menos `1`.
- Tiempo disponible debe ser al menos `1` minuto.
- Minutos de foco debe ser al menos `1`.
- Descansos pueden ser `0`.
- Frecuencia de descanso largo debe ser al menos `1`.
- Si la frecuencia de descanso largo es mayor que el número de pomodoros, no se
  considera error; simplemente habrá cero descansos largos.
- Si el total supera `4 horas`, mostrar advertencia suave de sesión larga.
- Si el total supera `8 horas`, mostrar advertencia fuerte y sugerir dividir la
  planificación.
- Si el total supera `12 horas`, mostrar advertencia de jornada poco realista.
- Si no cabe ningún pomodoro completo en el tiempo disponible, mostrar un estado
  claro: `No cabe un bloque completo de foco con esta configuración`.
- Temporizador, si se implementa, debe usar `Date.now()` para evitar deriva
  excesiva.

---

## Resumen copiable

El texto copiado debe ser útil fuera de la calculadora.

Ejemplo:

```text
Plan Pomodoro: 4 pomodoros de 25 min, descansos cortos de 5 min y descanso largo de 20 min cada 4 pomodoros. Duración total: 1 h 55 min. Inicio: 09:00. Fin estimado: 10:55.
```

Si el cálculo usa tiempo disponible:

```text
Plan Pomodoro: en 2 h caben 4 pomodoros completos de 25 min con descansos de 5 min. Tiempo usado: 1 h 55 min. Tiempo libre: 5 min. Fin estimado: 10:55.
```

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora Pomodoro` |
| Meta description | `Planifica sesiones Pomodoro con foco, descansos cortos, descansos largos, duración total, hora de finalización y pomodoros posibles en tu tiempo disponible.` |
| H1 | `Calculadora Pomodoro` |
| Keyword principal | `calculadora pomodoro` |
| Keywords secundarias | `temporizador pomodoro`, `técnica pomodoro`, `cuántos pomodoros caben`, `planificador pomodoro` |

### FAQs sugeridas

- ¿Cuánto dura un Pomodoro?
- ¿La calculadora incluye descansos largos?
- ¿Puedo cambiar la duración de foco?
- ¿Cuántos pomodoros caben en 2 horas?
- ¿Qué pasa si quiero terminar antes de una hora específica?
- ¿Es mejor hacer pomodoros de 25, 50 o 90 minutos?

---

## Pruebas sugeridas

- `4` pomodoros de `25`, descanso corto `5`, largo `20` cada `4` produce
  `115 min`.
- No se agrega descanso después del último pomodoro.
- `1` pomodoro produce solo tiempo de foco.
- Descanso largo cada `2` calcula descansos largos correctamente.
- Hora de fin suma minutos cruzando medianoche.
- En modo tiempo disponible, `120 min` con `25 / 5 / 20` cada `4` produce
  `4` pomodoros, `115 min` usados y `5 min` sobrantes.
- En modo tiempo disponible, no se agrega un descanso si después no cabe otro
  bloque de foco.
- Una frecuencia de descanso largo mayor que el número de pomodoros no produce
  error.
- Hora límite menor que hora de inicio se interpreta como día siguiente.
- Si no cabe un pomodoro completo, se muestra estado vacío claro.

