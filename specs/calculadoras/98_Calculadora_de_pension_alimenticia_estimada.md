# Especificación v1 - Calculadora de pensión alimenticia estimada

## Descripción general

Herramienta para explorar escenarios de aportación alimentaria a partir de un
porcentaje o monto capturado manualmente, ingresos verificados y gastos
compartidos. No predice ni recomienda una pensión judicial.

**Arquitectura:** cálculo en cliente. Los presets locales contienen únicamente
información explicativa, fuentes y vigencia; no deben incluir porcentajes
recomendados como si fueran una regla universal.

---

## Objetivo de producto

- Ayudar a comparar escenarios de aportación.
- Mostrar impacto mensual y anual sobre el ingreso disponible.
- Organizar gastos ordinarios y extraordinarios.
- Explicar que capacidad económica, necesidades y resolución aplicable varían.
- Dirigir al usuario a fuentes y asesoría jurídica local.

---

## Alcance recomendado

### MVP

- País o jurisdicción para mostrar información y fuentes locales.
- Ingreso neto capturado por el usuario.
- Modo por porcentaje manual o monto fijo manual.
- Número de personas beneficiarias solo para desglose.
- Gastos compartidos y frecuencia de pago.
- Resultado claramente etiquetado como escenario.

### Fase 2

- Varios escenarios lado a lado.
- Calendario de pagos.
- Presupuesto detallado por categoría de necesidad.
- Directorio de recursos oficiales por jurisdicción.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL pública recomendada | `/legal-impuestos/calculadora-pension-alimenticia` |
| Archivo Astro recomendado | `src/pages/legal-impuestos/calculadora-pension-alimenticia.astro` |
| Lógica de cálculo | `src/lib/calculators/legal-impuestos/calculadora-pension-alimenticia/supportScenario.ts` |
| Información local | `src/lib/calculators/legal-impuestos/calculadora-pension-alimenticia/rules/{pais}/{jurisdiccion}.ts` |
| Pruebas unitarias | `src/lib/calculators/legal-impuestos/calculadora-pension-alimenticia/supportScenario.test.ts` |
| Categoría | `legal-impuestos` |
| Locale inicial | `es-MX` |

---

## Datos locales y vigencia

Los datos locales no deben contener una tasa predeterminada. Solo pueden incluir
criterios explicativos, autoridad competente, recursos de ayuda y metadatos.

```ts
interface ChildSupportInformationSet {
  country: string;
  jurisdiction?: string;
  effectiveFrom: string;
  effectiveTo?: string;
  sourceUrl: string;
  reviewedAt: string;
  status: "current" | "expired" | "draft";
  authorityName: string;
  legalHelpUrl?: string;
  explanatoryCriteria: string[];
}
```

- Mostrar fuente, jurisdicción y fecha de revisión.
- No seleccionar ni sugerir un porcentaje inicial.
- No inferir un monto por cantidad de personas beneficiarias.
- Un dataset vencido puede mostrar su fuente histórica, pero no como guía actual.

### Fuentes iniciales para México

- [Estado de México - Orientación sobre pensión alimenticia](https://caravanas.edomex.gob.mx/node/266)
- [Poder Judicial de Coahuila - Preguntas frecuentes](https://www.pjecz.gob.mx/conocenos/estructura/tribunal-superior-de-justicia/organos-no-jurisdiccionales/instituto-estatal-de-defensoria-publica/preguntas-frecuentes/)

La información debe seleccionarse por jurisdicción. Estas fuentes respaldan que
el monto depende del caso y no justifican un porcentaje predeterminado.

---

## Comportamiento mobile-first

- Nombrar el resultado `Monto del escenario`, nunca `Pensión correcta`.
- Mostrar ingreso restante y equivalente anual.
- Presentar gastos compartidos por separado.
- Mantener visible el aviso legal y acceso a recursos oficiales.

---

## Flujo principal MVP

### Inputs del MVP

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| País / jurisdicción | Selector | información local disponible | vacío |
| Ingreso neto por periodo | Texto numérico | `>= 0` | vacío |
| Frecuencia del ingreso | Selector | semanal, quincenal, mensual | mensual |
| Modo de escenario | Selector | porcentaje manual, monto fijo | sin seleccionar |
| Porcentaje manual | Texto numérico | `0%-100%` | vacío |
| Monto fijo | Texto numérico | `>= 0` | vacío |
| Personas beneficiarias | Texto numérico entero | `>= 1` | `1` |
| Gastos compartidos adicionales | Lista editable | importes `>= 0` | vacío |

### Outputs principales

- Monto del escenario por periodo.
- Gastos compartidos adicionales.
- Aportación total del escenario.
- Ingreso restante.
- Equivalente mensual y anual.
- Desglose matemático por persona, solo si el usuario lo solicita.

---

## Fórmulas y algoritmo

```text
monto_base = modo_porcentaje
  ? ingreso_neto * porcentaje_manual
  : monto_fijo_manual

gastos_compartidos = suma(gastos_adicionales)
aportacion_escenario = monto_base + gastos_compartidos
ingreso_restante = ingreso_neto - aportacion_escenario
equivalente_anual = normalizar_a_anual(aportacion_escenario, frecuencia)
```

El reparto por persona es una división matemática opcional, no una sugerencia
legal. Permitir ingreso restante negativo para visualizar un escenario
insostenible, acompañado de una advertencia.

---

## Validaciones y estados

- No calcular hasta que el usuario capture porcentaje o monto fijo.
- No ofrecer valores predeterminados para porcentaje o monto.
- Porcentaje debe estar entre `0%` y `100%`.
- Mostrar advertencia si la aportación supera el ingreso.
- No afirmar elegibilidad, obligación, suficiencia ni resultado judicial.
- Recomendar orientación jurídica local ante decisiones reales.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Estimador de escenarios de pensión alimenticia` |
| Meta description | `Compara escenarios manuales de aportación alimentaria y su impacto en el ingreso. No predice una resolución judicial.` |
| H1 | `Estimador de pensión alimenticia` |
| Keyword principal | `calculadora pensión alimenticia` |
| Keywords secundarias | `estimador pensión alimenticia`, `escenario aporte alimentario`, `gastos compartidos hijos` |

El contenido debe explicar que no existe un porcentaje universal y que una
autoridad competente evalúa los hechos y reglas de cada caso.

---

## Pruebas sugeridas

- La pantalla inicial no muestra porcentaje recomendado.
- El modo porcentaje y el modo monto fijo producen el escenario esperado.
- Variar personas beneficiarias no cambia automáticamente el monto total.
- Aportación mayor al ingreso muestra resultado negativo y advertencia.
- La interfaz usa siempre lenguaje de escenario y muestra recursos oficiales.
