# Especificación v1 - Calculadora de costo real de una reunión

## Descripción general

Herramienta para estimar el costo monetario de una reunión según duración,
participantes y costo por hora. Debe ayudar a equipos, freelancers y empresas a
dimensionar el tiempo invertido sin requerir datos externos.

**Arquitectura:** todo el cálculo ocurre en el cliente. No requiere backend,
base de datos ni llamadas a APIs externas.

---

## Objetivo de producto

- Calcular costo total de una reunión.
- Permitir participantes con costo por hora distinto.
- Mostrar costo por minuto y horas-persona.
- Estimar costo recurrente semanal o mensual.
- Generar una página estática optimizada para SEO en Astro.

---

## Alcance recomendado

### MVP

- Duración de reunión.
- Lista de participantes o roles.
- Costo por hora por participante/rol.
- Cantidad de personas por rol.
- Frecuencia opcional.
- Resultado: costo por reunión, horas-persona y costo recurrente.
- Copiar resumen, limpiar formulario y exportar CSV.

### Fase 2

- Plantillas de equipo.
- Comparador reunión vs async.
- Historial en `sessionStorage`.
- Cálculo con salario mensual y horas laborales.

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

## Comportamiento mobile-first

- Cada rol/participante debe editarse como bloque compacto.
- Mostrar costo total inmediatamente después de duración y participantes.
- Usar botones claros para agregar o eliminar rol.
- La frecuencia recurrente debe ser opcional para no cargar el MVP.
- No culpar al usuario por reuniones caras; mantener tono neutral.

---

## Flujo principal MVP

**Ejemplo:** Una reunión de `60` minutos con `5` personas que cuestan `$500` por
hora cada una. ¿Cuánto cuesta?

### Inputs del MVP

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Duración | Texto numérico | `1-480` minutos | `60` |
| Nombre de rol | Texto | 1-50 caracteres | `Participante` |
| Cantidad de personas | Texto numérico | `1-100` | `1` |
| Costo por hora | Texto numérico | `>= 0` | vacío |
| Frecuencia | Selector opcional | `Una vez`, `Semanal`, `Mensual` | `Una vez` |
| Repeticiones por periodo | Texto numérico | `1-31` | `1` |

### Outputs principales

- Costo total por reunión.
- Costo por minuto.
- Horas-persona.
- Costo semanal o mensual si aplica.
- Desglose por rol.

---

## Fórmulas

```text
duracion_horas = duracion_minutos / 60
costo_rol = cantidad_personas * costo_hora * duracion_horas
costo_total = suma(costo_rol)
horas_persona = suma(cantidad_personas * duracion_horas)
costo_por_minuto = costo_total / duracion_minutos
```

Costo recurrente:

```text
costo_periodo = costo_total * repeticiones_por_periodo
```

---

## Validaciones y estados

- Duración debe estar entre `1` y `480 minutos`.
- Debe existir al menos un rol válido.
- Cantidad de personas debe ser entera.
- Costo por hora puede ser `0` para participantes sin costo monetario directo.
- Si todos los costos son `0`, mostrar horas-persona como resultado principal.
- Redondear moneda a 2 decimales.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de costo real de una reunión` |
| Meta description | `Calcula cuánto cuesta una reunión según duración, participantes, tarifa por hora y frecuencia recurrente.` |
| H1 | `Calculadora de costo de reunión` |
| Keyword principal | `calculadora costo reunion` |
| Keywords secundarias | `costo real de una reunion`, `horas persona reunion`, `costo reuniones empresa` |

### FAQs sugeridas

- ¿Cómo calculo el costo de una reunión?
- ¿Qué son horas-persona?
- ¿Puedo usar salarios mensuales?
- ¿La calculadora incluye costos indirectos?

---

## Pruebas sugeridas

- `5` personas, `$500/h`, `60 min` produce `$2,500`.
- `30 min` produce la mitad del costo por hora.
- Varias filas se suman correctamente.
- Costos `0` no rompen el cálculo.
- Frecuencia semanal multiplica por repeticiones.

