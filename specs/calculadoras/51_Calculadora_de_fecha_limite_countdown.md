# Especificación v1 - Calculadora de fecha límite / countdown

## Descripción general

Herramienta para calcular cuánto tiempo falta para una fecha límite o evento, y
opcionalmente mostrar una cuenta regresiva en vivo dentro del navegador. Debe
servir para entregas, exámenes, vencimientos, viajes, eventos y metas personales.

**Arquitectura:** todo el cálculo ocurre en el cliente. No requiere backend,
base de datos ni llamadas a APIs externas.

---

## Objetivo de producto

- Calcular días, horas, minutos y segundos restantes hasta una fecha límite.
- Indicar si la fecha ya pasó y cuánto tiempo ha transcurrido.
- Permitir incluir hora exacta o calcular solo por fecha.
- Generar enlaces compartibles con parámetros en la URL.
- Generar una página estática optimizada para SEO en Astro.

---

## Alcance recomendado

### MVP

- Nombre del evento opcional.
- Fecha objetivo.
- Hora objetivo opcional.
- Zona horaria local del navegador, sin conversor externo.
- Resultado: días restantes, tiempo total restante y estado.
- Cuenta regresiva en vivo cuando hay hora.
- Copiar resultado, limpiar formulario y compartir URL.

### Fase 2

- Lista de próximos eventos guardada en `localStorage`.
- Modo "sumar plazo desde hoy": X días/semanas/meses.
- Exportar evento a calendario con archivo `.ics`.
- Estilos de countdown para insertar en otras páginas.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL pública recomendada | `/fecha-tiempo/calculadora-fecha-limite-countdown` |
| Archivo Astro recomendado | `src/pages/fecha-tiempo/calculadora-fecha-limite-countdown.astro` |
| Lógica de cálculo | `src/lib/calculators/fecha-tiempo/calculadora-fecha-limite-countdown/countdown.ts` |
| Pruebas unitarias | `src/lib/calculators/fecha-tiempo/calculadora-fecha-limite-countdown/countdown.test.ts` |
| Categoría | `fecha-tiempo` |
| Locale base | `es-MX` |

---

## Comportamiento mobile-first

- La calculadora debe aparecer en el primer viewport.
- Usar inputs nativos de fecha y hora cuando sea posible.
- Resultado principal en tarjetas compactas: días, horas, minutos, segundos.
- Si el evento ya pasó, cambiar texto de estado sin depender solo del color.
- No usar animaciones pesadas para la cuenta regresiva.

---

## Flujo principal MVP

**Ejemplo:** Tengo una entrega el `2026-09-30` a las `23:59`. ¿Cuánto falta?

### Inputs del MVP

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Nombre del evento | Texto opcional | 1-80 caracteres | vacío |
| Fecha límite | Fecha | fecha válida | vacío |
| Incluir hora | Toggle | sí/no | `sí` |
| Hora límite | Hora | hora válida | `23:59` |
| Fecha de referencia | Fecha/hora interna | fecha actual local | ahora |

### Outputs principales

- Estado: `faltan`, `vence hoy` o `ya pasó`.
- Días completos restantes.
- Horas/minutos/segundos restantes.
- Tiempo total en días decimales.
- Fecha límite formateada.
- Texto copiable.

---

## Fórmulas y algoritmo

Crear fechas locales sin parsear strings ambiguos:

```text
target = new Date(year, monthIndex, day, hour, minute, 0)
now = fecha_actual_local
diff_ms = target.getTime() - now.getTime()
```

Convertir diferencia absoluta:

```text
abs_ms = abs(diff_ms)
segundos_totales = floor(abs_ms / 1000)
dias = floor(segundos_totales / 86400)
horas = floor((segundos_totales % 86400) / 3600)
minutos = floor((segundos_totales % 3600) / 60)
segundos = segundos_totales % 60
```

Estado:

```text
diff_ms > 0 => faltan
diff_ms = 0 => vence ahora
diff_ms < 0 => ya pasó
```

---

## Validaciones y estados

- Fecha límite es obligatoria.
- Si no se incluye hora, usar inicio del día o final del día según selector; por defecto final del día.
- Evitar `Date.parse()` con formatos no ISO.
- Si faltan menos de 24 horas, destacar horas restantes.
- Si la fecha ya pasó, no ocultar el resultado.
- La cuenta regresiva debe detenerse al desmontar o limpiar formulario.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de fecha límite y countdown` |
| Meta description | `Calcula cuánto falta para una fecha límite o evento con días, horas, minutos y cuenta regresiva en vivo.` |
| H1 | `Calculadora de fecha límite` |
| Keyword principal | `calculadora countdown` |
| Keywords secundarias | `fecha limite calculadora`, `cuenta regresiva`, `cuanto falta para una fecha` |

### FAQs sugeridas

- ¿La cuenta regresiva usa mi zona horaria?
- ¿Puedo calcular una fecha sin hora exacta?
- ¿Qué pasa si la fecha ya pasó?
- ¿Puedo compartir el countdown?

---

## Pruebas sugeridas

- Fecha futura calcula diferencia positiva.
- Fecha pasada calcula tiempo transcurrido.
- Fecha sin hora usa final del día por defecto.
- Diferencia de 1 día, 2 horas y 3 minutos se descompone correctamente.
- Parámetros de URL reconstruyen el formulario.

