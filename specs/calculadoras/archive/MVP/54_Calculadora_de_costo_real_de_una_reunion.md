# Especificación v2 - Calculadora de costo real de una reunión

## Descripción general

Herramienta para estimar el costo monetario y el tiempo-persona invertido en una
reunión según duración, participantes, tarifa por hora y recurrencia. Además de
mostrar el costo, debe ayudar al usuario a entender el impacto de la reunión y a
identificar oportunidades simples de ahorro, como reducir duración, asistentes o
frecuencia.

**Arquitectura:** todo el cálculo ocurre en el cliente. No requiere backend,
base de datos ni llamadas a APIs externas.

---

## Objetivo de producto

- Calcular costo total de una reunión.
- Permitir participantes o roles con costo por hora distinto.
- Mostrar costo por minuto, horas-persona y desglose por rol.
- Estimar costo recurrente semanal, mensual y anual.
- Mostrar ahorro potencial por reducir duración, asistentes o recurrencia.
- Permitir una captura rápida mobile first con presets y controles compactos.
- Generar una página estática optimizada para SEO en Astro.

---

## Principio de valor

La calculadora no debe limitarse a responder "cuánto cuesta esta reunión". Debe
ayudar al usuario a responder:

- ¿Cuál es el costo real de esta reunión?
- ¿Cuánto cuesta mantenerla como hábito recurrente?
- ¿Qué cambio sencillo reduce más costo: menos minutos, menos asistentes o menos
  frecuencia?
- ¿Cuánto tiempo-persona se invierte aunque el costo monetario sea `0`?

El tono debe ser neutral y útil. Evitar mensajes que culpen al usuario por tener
reuniones costosas.

---

## Alcance recomendado

### MVP recomendado

- Duración de la reunión con presets rápidos: `15`, `30`, `45`, `60 min`.
- Duración personalizada entre `1` y `480` minutos.
- Tiempo opcional de preparación y seguimiento.
- Lista de participantes o roles.
- Costo por hora por participante/rol.
- Cantidad de personas por rol con controles `-` y `+`.
- Frecuencia opcional: `Una vez`, `Semanal`, `Quincenal`, `Mensual`.
- Repeticiones por periodo con etiqueta contextual.
- Resultado inmediato: costo por reunión, horas-persona y costo por minuto.
- Impacto recurrente: costo semanal, mensual y anual estimado cuando aplique.
- Insights accionables:
  - ahorro por reducir `15 min`;
  - ahorro por quitar una persona del rol más costoso;
  - costo anual si la reunión se repite.
- Desglose por rol.
- Copiar resumen.
- Limpiar formulario.
- Exportar CSV como acción secundaria.

### MVP ampliado opcional

- Modo alterno de costo por rol:
  - tarifa por hora;
  - salario mensual + horas laborales al mes.
- Comparación simple contra una alternativa asíncrona:
  - minutos async por persona;
  - costo async estimado;
  - diferencia contra reunión.

### Fase 2

- Plantillas de equipo.
- Historial en `sessionStorage`.
- Comparador avanzado reunión vs async.
- Guardar escenarios para comparar varias versiones.
- Soporte para moneda configurable.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL inmediata recomendada | `/fecha-tiempo/calculadora-costo-reunion` |
| URL futura si existe Productividad | `/productividad/calculadora-costo-reunion` |
| Archivo Astro recomendado | `src/pages/fecha-tiempo/calculadora-costo-reunion.astro` |
| Lógica de cálculo | `src/lib/calculators/fecha-tiempo/calculadora-costo-reunion/meetingCost.ts` |
| Pruebas unitarias | `src/lib/calculators/fecha-tiempo/calculadora-costo-reunion/meetingCost.test.ts` |
| Categoría inmediata | `fecha-tiempo` |
| Categoría futura opcional | `productividad` |
| Locale base | `es-MX` |
| Moneda base | `MXN`, símbolo `$` |

---

## Comportamiento mobile first

- La experiencia base debe funcionar en una sola columna.
- El resultado principal debe aparecer inmediatamente después de duración,
  participantes y costo, sin obligar a llegar al final de la página.
- El resumen principal en móvil debe ser compacto:
  - costo por reunión;
  - horas-persona;
  - costo por minuto.
- Cada rol/participante debe editarse como bloque compacto con:
  - nombre;
  - cantidad;
  - costo;
  - botón para eliminar;
  - desglose del costo del rol.
- Usar botones de toque cómodo para agregar, eliminar y ajustar cantidad.
- Usar controles segmentados para duración y frecuencia.
- Usar `inputmode="decimal"` o `inputmode="numeric"` en campos numéricos.
- La frecuencia recurrente y los campos avanzados deben ser opcionales y
  colapsables para no cargar el flujo principal.
- El CTA principal debe ser `Copiar resumen`; `Exportar CSV` debe ser secundario.
- Evitar copy acusatorio. Preferir textos como "Ahorro potencial" o "Impacto
  estimado".

---

## Flujo principal MVP

**Ejemplo:** Una reunión de `60` minutos con `5` personas que cuestan `$500` por
hora cada una. ¿Cuánto cuesta por reunión y cuánto representa si se repite cada
semana?

1. El usuario elige duración con presets o escribe un valor personalizado.
2. Agrega uno o más roles con cantidad de personas y costo por hora.
3. Ve inmediatamente el costo por reunión, costo por minuto y horas-persona.
4. Si elige una frecuencia recurrente, ve el costo por periodo y costo anual.
5. Revisa insights de ahorro potencial.
6. Copia el resumen o exporta CSV.

---

## Inputs del MVP

| Campo | Tipo | Rango válido | Valor por defecto | Notas UX |
|-------|------|--------------|-------------------|----------|
| Duración | Preset + texto numérico | `1-480` minutos | `60` | Presets `15`, `30`, `45`, `60` |
| Preparación previa | Texto numérico opcional | `0-480` minutos | `0` | Campo avanzado |
| Seguimiento posterior | Texto numérico opcional | `0-480` minutos | `0` | Campo avanzado |
| Nombre de rol | Texto | 1-50 caracteres | `Participante` | Puede repetirse si el usuario lo desea |
| Cantidad de personas | Stepper + texto numérico | `1-100` | `1` | Botones `-` y `+` |
| Modo de costo | Selector | `Tarifa por hora`, `Salario mensual` | `Tarifa por hora` | Salario mensual puede estar en MVP ampliado |
| Costo por hora | Texto numérico | `>= 0` | vacío | Visible cuando el modo es tarifa por hora |
| Salario mensual | Texto numérico | `>= 0` | vacío | Visible cuando el modo es salario mensual |
| Horas laborales al mes | Texto numérico | `1-744` | `160` | Para convertir salario mensual a costo por hora |
| Frecuencia | Selector opcional | `Una vez`, `Semanal`, `Quincenal`, `Mensual` | `Una vez` | Debe poder omitirse |
| Veces por semana | Texto numérico | `1-7` | `1` | Visible si frecuencia es semanal |
| Veces por mes | Texto numérico | `1-31` | `1` | Visible si frecuencia es mensual |
| Minutos async por persona | Texto numérico opcional | `0-480` | `15` | Solo para comparador opcional |

---

## Outputs principales

- Costo total por reunión.
- Costo por minuto.
- Horas-persona.
- Duración total usada para el cálculo, incluyendo preparación y seguimiento.
- Costo semanal, mensual y anual si aplica.
- Desglose por rol:
  - personas;
  - costo por hora usado;
  - horas-persona;
  - costo del rol.
- Ahorro potencial:
  - ahorrar `15 min`;
  - quitar una persona del rol con mayor costo total;
  - reducir una repetición por periodo si aplica.
- Comparación async si el usuario la activa.

Si todos los costos son `0`, el resultado principal debe priorizar horas-persona
y duración total en lugar de moneda.

---

## Fórmulas

Duración:

```text
duracion_total_minutos = duracion_reunion_minutos + preparacion_minutos + seguimiento_minutos
duracion_total_horas = duracion_total_minutos / 60
```

Costo por hora:

```text
costo_hora = tarifa_hora
costo_hora_desde_salario = salario_mensual / horas_laborales_mes
```

Costo por rol:

```text
costo_rol = cantidad_personas * costo_hora * duracion_total_horas
horas_persona_rol = cantidad_personas * duracion_total_horas
```

Totales:

```text
costo_total = suma(costo_rol)
horas_persona = suma(horas_persona_rol)
costo_por_minuto = costo_total / duracion_total_minutos
```

Recurrencia:

```text
costo_semanal = costo_total * veces_por_semana
costo_mensual_desde_semanal = costo_semanal * 52 / 12
costo_mensual = costo_total * veces_por_mes
costo_anual_desde_semanal = costo_semanal * 52
costo_mensual_desde_quincenal = costo_total * 26 / 12
costo_anual_desde_quincenal = costo_total * 26
costo_anual_desde_mensual = costo_mensual * 12
```

Ahorro potencial:

```text
minutos_ahorro = min(15, duracion_total_minutos)
ahorro_15_min = suma(cantidad_personas * costo_hora * (minutos_ahorro / 60))
ahorro_quitar_persona_rol = costo_hora_rol * duracion_total_horas
ahorro_reducir_una_repeticion = costo_total
```

Comparador async opcional:

```text
async_horas = minutos_async_por_persona / 60
costo_async_rol = cantidad_personas * costo_hora * async_horas
costo_async_total = suma(costo_async_rol)
diferencia_async = costo_total - costo_async_total
```

---

## Validaciones y estados

- Duración de reunión debe estar entre `1` y `480` minutos.
- Preparación y seguimiento pueden ser `0`, pero no negativos.
- Debe existir al menos un rol válido.
- Nombre de rol debe tener entre `1` y `50` caracteres.
- Cantidad de personas debe ser entera.
- Costo por hora puede ser `0` para participantes sin costo monetario directo.
- Salario mensual puede ser `0`, pero horas laborales al mes debe ser mayor a
  `0`.
- Si frecuencia es semanal, repeticiones debe estar entre `1` y `7`.
- Si frecuencia es mensual, repeticiones debe estar entre `1` y `31`.
- Si frecuencia es quincenal, no pedir repeticiones por periodo en MVP.
- Si todos los costos son `0`, mostrar horas-persona como resultado principal.
- Redondear moneda a 2 decimales.
- No mostrar ahorro negativo. Si un cálculo no aplica o el resultado es `0`,
  ocultar ese insight.
- No bloquear la experiencia por campos opcionales incompletos; ignorarlos hasta
  que sean válidos.

---

## Copy sugerido

### Resultados

- `Costo estimado por reunión`
- `Horas-persona invertidas`
- `Costo por minuto`
- `Impacto estimado si se repite`
- `Ahorro potencial`
- `Desglose por rol`

### Insights

- `Reducir 15 min ahorraría {monto} por reunión.`
- `Quitar una persona de {rol} ahorraría {monto} por reunión.`
- `Con esta frecuencia, el costo anual estimado es {monto}.`
- `Aunque el costo monetario sea 0, esta reunión invierte {horas} horas-persona.`

### Resumen copiable

```text
Reunión de {duracion_total_minutos} min con {personas_totales} personas:
- Costo estimado: {costo_total}
- Horas-persona: {horas_persona}
- Costo por minuto: {costo_por_minuto}
- Frecuencia: {frecuencia}
- Impacto anual estimado: {costo_anual}
```

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de costo real de una reunión` |
| Meta description | `Calcula cuánto cuesta una reunión según duración, participantes, tarifa por hora y frecuencia. Estima horas-persona, costo recurrente y ahorro potencial.` |
| H1 | `Calculadora de costo de reunión` |
| Keyword principal | `calculadora costo reunion` |
| Keywords secundarias | `costo real de una reunion`, `horas persona reunion`, `costo reuniones empresa`, `costo por minuto reunion` |

### FAQs sugeridas

- ¿Cómo calculo el costo de una reunión?
- ¿Qué son horas-persona?
- ¿Cómo se calcula el costo por minuto de una reunión?
- ¿Puedo usar salarios mensuales?
- ¿La calculadora incluye preparación y seguimiento?
- ¿La calculadora incluye costos indirectos?
- ¿Cómo puedo reducir el costo de una reunión recurrente?

---

## Pruebas sugeridas

- `5` personas, `$500/h`, `60 min` produce `$2,500`.
- `30 min` produce la mitad del costo de `60 min` con los mismos roles.
- Varias filas se suman correctamente.
- Costos `0` no rompen el cálculo y priorizan horas-persona.
- Frecuencia semanal con `1` repetición produce costo anual `costo_total * 52`.
- Frecuencia mensual con `2` repeticiones produce costo mensual `costo_total * 2`.
- Frecuencia quincenal produce costo anual `costo_total * 26`.
- Preparación de `15 min` y seguimiento de `15 min` en una reunión de `30 min`
  calculan sobre `60 min` totales.
- Salario mensual de `$32,000` con `160` horas laborales produce `$200/h`.
- Ahorro por reducir `15 min` se calcula con todos los roles.
- Ahorro por quitar una persona usa el rol con mayor costo por persona.
- Comparador async de `15 min/persona` contra una reunión de `60 min` reduce el
  costo al 25% si los participantes son los mismos.
