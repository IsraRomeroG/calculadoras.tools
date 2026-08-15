# Especificación v2 - Calculadora de aguinaldo proporcional en México

## Descripción general

Herramienta para estimar el aguinaldo bruto generado durante un año por una
persona trabajadora en México, a partir de su fecha de ingreso, fecha de cálculo
o salida, salario y días anuales de aguinaldo.

El MVP aplica exclusivamente a una relación laboral privada general regida por
la Ley Federal del Trabajo (LFT), trabajo continuo y salario fijo. La herramienta
no determina derechos controvertidos, no calcula impuestos y no sustituye la
revisión del contrato, recibos de nómina ni la orientación de una autoridad o
profesional.

**Arquitectura:** cálculo íntegramente en cliente mediante reglas mexicanas
versionadas. Las fechas, salarios y cantidades capturadas permanecen en el
dispositivo y no se envían a analítica. Las reglas y fuentes oficiales requieren
revisión periódica.

---

## Decisiones de producto

- El MVP soporta únicamente México, moneda MXN y locale `es-MX`.
- No se muestra selector de país mientras sólo exista un preset compatible.
- El resultado principal siempre es el `Aguinaldo bruto generado` hasta la fecha
  de cálculo o el último día de la relación laboral.
- El mínimo legal del preset es visible y no puede reducirse dentro del modo
  legal. Una prestación contractual sólo puede ser igual o superior al mínimo.
- El último día capturado es inclusivo.
- El cálculo se limita a un solo año de aguinaldo y nunca genera una proporción
  superior al 100 % del periodo.
- El salario diario se puede capturar directamente o normalizar desde una
  cantidad semanal, quincenal o mensual.
- El MVP automático admite salario fijo. Los salarios variables, mixtos, por
  comisión o por unidad de obra quedan fuera del cálculo automático.
- Los días que no computan se capturan únicamente como ajuste avanzado y deben
  quedar visibles en el desglose de supuestos.
- Todos los resultados monetarios son brutos, antes de ISR, retenciones,
  descuentos o compensaciones.
- Un importe recibido puede compararse con la estimación, pero la diferencia no
  se presenta como deuda determinada.
- La interfaz muestra la regla, fórmula, fuente, vigencia y fecha de revisión
  utilizadas.

---

## Objetivo de producto

- Estimar el aguinaldo proporcional generado con una fórmula reproducible.
- Ayudar al usuario a convertir su salario habitual a una cuota diaria.
- Explicar el periodo computado, los días elegibles y la proporción generada.
- Permitir prestaciones contractuales superiores al mínimo legal.
- Diferenciar el importe generado hasta hoy de una proyección opcional al cierre
  del año.
- Comparar opcionalmente la estimación con un importe bruto recibido.
- Mostrar fuentes oficiales y hacer visibles todos los supuestos técnicos.
- Identificar casos que requieren un cálculo especializado u orientación.

---

## Alcance

### MVP

- México, MXN y `es-MX`.
- Relación laboral privada general comprendida por la LFT.
- Trabajo continuo y salario fijo.
- Relación laboral vigente o terminada.
- Fecha de ingreso y fecha de cálculo o último día de la relación.
- Un solo año de aguinaldo por cálculo, inferido desde la fecha final.
- Salario fijo con frecuencia diaria, semanal, quincenal o mensual.
- Mínimo legal versionado y días contractuales superiores configurables.
- Días no elegibles informados por el usuario.
- Resultado bruto generado, proyección opcional y comparación con pago recibido.
- Fórmula con valores sustituidos, fuentes y registro visible de supuestos.

### Fuera del cálculo automático del MVP

- Servidores públicos o relaciones regidas por el apartado B del artículo 123.
- Personas trabajadoras de plataformas digitales y regímenes laborales
  especiales que requieran reglas propias.
- Trabajo discontinuo, de temporada o con varios periodos de alta y baja dentro
  del mismo año.
- Salario variable, mixto, por comisión, propinas o unidad de obra.
- Prestación de servicios independientes sin relación laboral subordinada.
- Determinar automáticamente qué ausencias deben o no computar.
- ISR, exenciones, retenciones, descuentos o importe neto.
- Determinar si un importe es exigible o si existe incumplimiento del empleador.

Cuando el usuario indique un caso fuera de alcance, no se aplicará
silenciosamente la regla general. Se mostrará el motivo y un enlace de
orientación oficial.

### Fase 2

- Salarios variables por unidad de obra, con promedio de los últimos 30 días
  efectivamente trabajados.
- Vendedores, agentes, comisionistas y casos con promedio anual o del tiempo
  trabajado.
- Salarios mixtos, separando componente fijo y variable.
- Regímenes laborales adicionales y reglas por contrato colectivo.
- Estimación fiscal del pago.
- Historial local de varios años o empleos.
- Integración con la calculadora de finiquito.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL pública | `/legal-impuestos/calculadora-aguinaldo-proporcional` |
| Página Astro | `src/pages/legal-impuestos/calculadora-aguinaldo-proporcional.astro` |
| Componente de página | `src/components/calculators/AnnualBonusCalculatorPage.astro` |
| Lógica de cálculo | `src/lib/calculators/legal-impuestos/calculadora-aguinaldo-proporcional/proportionalBonus.ts` |
| Reglas locales | `src/lib/calculators/legal-impuestos/calculadora-aguinaldo-proporcional/rules/mx/{version}.ts` |
| Utilidades de fechas | Reutilizar o extraer las convenciones de fechas civiles de la calculadora de vacaciones |
| Pruebas unitarias | `src/lib/calculators/legal-impuestos/calculadora-aguinaldo-proporcional/proportionalBonus.test.ts` |
| Categoría | `legal-impuestos` |
| Locale | `es-MX` |
| Moneda | `MXN` |

La página Astro debe ser un contenedor del componente. La calculadora debe
registrarse en el directorio y metadatos del proyecto. No se publicará una
variante en otro idioma o país sin una revisión editorial y legal propia.

---

## Alcance legal visible

Antes de solicitar importes debe mostrarse:

> Esta estimación usa las reglas generales de la Ley Federal del Trabajo de
> México para una relación laboral privada, trabajo continuo y salario fijo. El
> resultado es bruto y no incluye impuestos.

Junto al aviso se ofrece `Mi caso es diferente`, que despliega los casos fuera
de alcance. Si el usuario declara salario variable o un régimen no soportado, se
bloquea el cálculo automático y se proporciona orientación, sin aplicar un
promedio genérico.

---

## Fuentes y reglas versionadas

El dataset debe poder justificar por separado el mínimo anual, periodo de
devengo, base salarial, conteo de fechas, tratamiento de ausencias, redondeo y
fecha límite de pago.

```ts
interface LegalSource {
  title: string;
  url: string;
  articles?: string[];
  publishedAt?: string;
  accessedAt: string;
}

interface AnnualBonusRuleSet {
  id: string;
  country: "MX";
  currency: "MXN";
  locale: "es-MX";
  employmentRegime: "lft-private-sector-general";
  ruleVersion: string;
  effectiveFrom: string;
  effectiveTo?: string;
  reviewedAt: string;
  status: "current" | "expired" | "draft";
  minimumDays: number;
  accrualPeriod: {
    startMonth: 1;
    startDay: 1;
    endMonth: 12;
    endDay: 31;
  };
  dateCountingPolicy: "inclusive-civil-days";
  accrualBasisPolicy: "calendar-days-in-period";
  supportedSalaryTypes: ["fixed"];
  salaryNormalization: {
    dailyDivisor: 1;
    weeklyDivisor: 7;
    biweeklyDivisor: 15;
    monthlyDivisor: 30;
  };
  absenceGuidance: {
    includedExamples: string[];
    userConfirmationRequired: true;
  };
  paymentDeadline: {
    mustBePaidBefore: {
      month: 12;
      day: 20;
    };
  };
  rounding: {
    intermediate: "none";
    displayCurrencyDecimals: 2;
  };
  sources: LegalSource[];
}
```

### Selección y vigencia

- La fecha final determina el año del aguinaldo y la versión compatible de las
  reglas.
- Si la fecha de ingreso es anterior al año seleccionado, el cálculo comienza
  el 1 de enero de ese año.
- Si no existe una regla vigente compatible, se bloquea el cálculo automático;
  no se sustituye por un modo manual presentado como resultado legal.
- La interfaz muestra `México · LFT · artículo 87`, versión y fecha de revisión.
- La última reforma de la LFT y la fecha de revisión se obtienen del dataset, no
  se escriben manualmente en el contenido editorial.
- La convención de usar los días naturales reales del año, 365 o 366, debe
  mostrarse como criterio técnico de proporcionalidad; no como texto literal de
  la ley.

### Fuentes iniciales de México

- [Cámara de Diputados - Ley Federal del Trabajo](https://www.diputados.gob.mx/LeyesBiblio/pdf/LFT.pdf), artículos 87 y, para criterios de normalización salarial, 89.
- [PROFEDET - Preguntas frecuentes sobre aguinaldo 2025](https://www.gob.mx/profedet/documentos/preguntas-frecuentes-aguinaldo-2025).
- [PROFEDET - Orientación sobre salario fijo y variable](https://www.gob.mx/profedet/prensa/la-profedet-y-la-stps-invitan-a-las-empresas-a-cumplir-con-el-pago-del-aguinaldo).
- [PROFEDET - Periodos considerados para el aguinaldo](https://www.gob.mx/profedet/es/articulos/trabajador-como-fruto-de-tu-esfuerzo-mereces-el-pago-del-aguinaldo?idiom=es).

`sourceUrl` único no es suficiente. Cada fuente debe incluir título, artículos
aplicables y fecha de consulta.

---

## Flujo principal

### 1. Confirmación de alcance

Mostrar el alcance mexicano antes del formulario y una acción secundaria `Mi
caso es diferente`. No utilizar un selector de país o periodo para un único
preset.

### 2. Situación laboral

Usar dos tarjetas o botones segmentados, no un desplegable:

- `Sigo trabajando`: solicita una fecha de cálculo, con hoy como valor inicial.
- `Terminó mi relación laboral`: solicita el último día de la relación.

La etiqueta de la fecha final cambia según la opción elegida. En ambos casos la
fecha es inclusiva.

### 3. Datos principales

| Campo | Tipo | Validación | Valor inicial |
|-------|------|------------|---------------|
| Fecha de ingreso | `date` | Fecha civil válida y `<= fecha final` | Vacío |
| Fecha de cálculo o último día | `date` | Fecha civil válida, `<= hoy` y `>= fecha de ingreso` | Hoy |
| Tipo de salario | Estado visible | Sólo salario fijo en el MVP | Fijo |
| Salario bruto | Texto numérico decimal | `> 0` | Vacío |
| Frecuencia del salario | Selector | diario, semanal, quincenal, mensual | mensual |

La moneda `MXN` debe permanecer visible junto al salario. Los campos numéricos
usan `inputmode="decimal"`, aceptan punto o coma decimal y no dependen de
`type="number"` para interpretar el locale.

### 4. Ajustes avanzados

Agrupar dentro de `Ajustar prestación y ausencias`, cerrado inicialmente:

| Campo | Tipo | Validación | Valor inicial |
|-------|------|------------|---------------|
| Días anuales según contrato | Texto numérico | `>= mínimo del preset` | 15 |
| Días confirmados que no computan | Texto numérico entero | `>= 0` y `<= días inclusivos del periodo` | 0 |
| Proyectar al cierre del año | Checkbox | Sólo relación vigente y año actual | Desactivado |
| Aguinaldo bruto recibido por ese año | Texto monetario opcional | `>= 0` | Vacío |

El mínimo legal se conserva visible aunque el usuario capture una prestación
superior. No se permite guardar un valor inferior dentro del cálculo legal.

Antes de descontar ausencias debe mostrarse:

> Descuenta únicamente días que tengas confirmados como no computables. No
> restes automáticamente vacaciones, descansos semanales, licencias de
> maternidad o paternidad ni incapacidades por riesgo de trabajo. La herramienta
> no puede determinar por sí sola el tratamiento de cada ausencia.

Si `Días confirmados que no computan` es mayor que cero, el usuario debe
confirmar que revisó la ayuda. El ajuste se identifica de forma destacada en el
resultado.

### 5. Cálculo y estado obsoleto

- El botón principal es `Calcular aguinaldo`.
- Después de un cálculo válido, cualquier cambio marca el resultado como
  `Datos modificados · vuelve a calcular` hasta una nueva confirmación.
- No actualizar automáticamente una cifra legal mientras el usuario escribe.
- `Limpiar` restaura el formulario y elimina el resultado sin recargar la página.

---

## Convenciones de cálculo

### Fechas civiles

- Trabajar únicamente con fechas civiles `YYYY-MM-DD`, sin horas ni conversión
  de zona horaria.
- Crear fechas UTC para calcular diferencias y evitar cambios por horario de
  verano.
- La fecha de ingreso y la fecha final son inclusivas.
- El año del aguinaldo se obtiene de la fecha final.
- El cálculo se acota al 1 de enero y 31 de diciembre de ese año.
- Una relación iniciada antes del año comienza a generar en el cálculo desde el
  1 de enero.
- Una fecha de ingreso posterior a la fecha final es inválida.
- El mismo día de ingreso y salida cuenta como un día inclusivo.
- No redondear valores intermedios.

```text
inicio_periodo = primer_dia_del_año(fecha_final)
fin_periodo = ultimo_dia_del_año(fecha_final)

inicio_efectivo = max(fecha_ingreso, inicio_periodo)
fin_efectivo = min(fecha_final, fin_periodo)

dias_inclusivos = diferencia_dias_utc(inicio_efectivo, fin_efectivo) + 1
dias_base_periodo = diferencia_dias_utc(inicio_periodo, fin_periodo) + 1
```

`dias_base_periodo` será 365 o 366 según el año. Esta convención asegura que un
periodo anual completo produzca exactamente la prestación anual.

### Normalización salarial

```text
si frecuencia = diario:
  salario_diario = salario_bruto

si frecuencia = semanal:
  salario_diario = salario_bruto / 7

si frecuencia = quincenal:
  salario_diario = salario_bruto / 15

si frecuencia = mensual:
  salario_diario = salario_bruto / 30
```

La conversión debe mostrarse en `Cómo se calculó`. La división quincenal entre
15 se identifica como convención de producto. No se usa salario diario integrado
del IMSS ni se incorporan prestaciones al salario capturado.

### Aguinaldo generado

```text
dias_elegibles = max(0, dias_inclusivos - dias_no_elegibles_confirmados)

proporcion_generada = min(1, dias_elegibles / dias_base_periodo)

aguinaldo_anual_equivalente =
  salario_diario * dias_anuales_aguinaldo

aguinaldo_bruto_generado =
  aguinaldo_anual_equivalente * proporcion_generada
```

No redondear salario diario, proporción ni importes intermedios. Redondear sólo
la presentación monetaria a dos decimales. La lógica conserva la precisión
completa para comparaciones.

### Proyección opcional

La proyección sólo está disponible si la relación continúa, la fecha de cálculo
pertenece al año actual y no es el 31 de diciembre.

```text
dias_restantes = diferencia_dias_utc(fecha_calculo + 1 dia, fin_periodo) + 1

dias_elegibles_proyectados = min(
  dias_base_periodo,
  dias_elegibles + dias_restantes
)

aguinaldo_proyectado =
  aguinaldo_anual_equivalente
  * dias_elegibles_proyectados
  / dias_base_periodo
```

Debe etiquetarse:

> Proyección si continúas trabajando hasta el 31 de diciembre y no agregas más
> días no elegibles.

La proyección nunca reemplaza el resultado principal generado hasta la fecha.

### Comparación con un pago recibido

```text
diferencia_frente_estimacion =
  aguinaldo_bruto_recibido - aguinaldo_bruto_generado
```

- Si es negativa: `Recibiste X menos que esta estimación`.
- Si es positiva: `Recibiste X más que esta estimación`.
- Si es cero: `Coincide con la estimación`.

No utilizar `deuda`, `faltante obligatorio`, `incumplimiento` ni expresiones que
conviertan la comparación en una conclusión legal. Si el usuario sólo conoce el
importe neto, debe omitir este campo.

---

## Resultados

### Resultado principal

- `Aguinaldo bruto generado` en MXN.
- Contexto: `México · año {periodo} · {días anuales} días de aguinaldo`.
- Aviso: `Antes de ISR y otros ajustes de nómina`.

### Métricas secundarias

- Días elegibles.
- Días naturales del periodo: 365 o 366.
- Proporción generada en porcentaje.
- Salario diario utilizado.
- Aguinaldo equivalente por un año completo.
- Proyección al cierre del año, sólo si fue solicitada.
- Diferencia frente al pago recibido, sólo si fue capturado.

### Cómo se calculó

Mostrar un desglose reproducible y copiable:

1. Conversión del salario a cuota diaria.
2. Periodo efectivo inclusivo.
3. Días inclusivos menos días no elegibles confirmados.
4. Días de aguinaldo legales o contractuales utilizados.
5. Fórmula con valores sustituidos y resultado sin redondeos intermedios.
6. Regla, fuente, versión y fecha de revisión.

Ejemplo visual del desglose:

```text
Salario diario: $18,000 / 30 = $600
Periodo: 1 de marzo a 30 de junio = 122 días inclusivos
Ausencias descontadas: 2 días
Días elegibles: 122 - 2 = 120
Aguinaldo anual equivalente: $600 × 15 = $9,000
Aguinaldo generado: $9,000 × 120 / 365 = $2,958.90
```

---

## Validaciones y estados

- Ambas fechas son obligatorias y deben ser fechas civiles válidas.
- La fecha final no puede preceder a la fecha de ingreso.
- La fecha final no puede ser futura; la proyección se ofrece por separado.
- Salario bruto debe ser finito y mayor que cero.
- Días contractuales no pueden ser inferiores al mínimo del preset.
- Días no elegibles deben ser enteros y no pueden superar los días inclusivos.
- Los importes no pueden ser negativos.
- Limitar importes y días a máximos técnicos razonables y documentados para
  evitar entradas accidentales o desbordamientos.
- Si la regla está vencida, en borrador o no cubre la fecha final, bloquear el
  cálculo y mostrar `No contamos con una regla revisada para esta fecha`.
- Si se usan días contractuales superiores, mostrar `Prestación contractual
  informada por ti`.
- Si se descuentan ausencias, mostrar una advertencia junto al resultado.
- Si el caso declarado está fuera de alcance, no calcular con la regla fija.
- Un resultado anterior nunca permanece aparentemente vigente después de
  modificar una entrada.

---

## Diseño mobile first

### Orden del contenido en móvil

1. Título y descripción breve.
2. Aviso de alcance mexicano.
3. Tarjetas `Sigo trabajando` y `Terminó mi relación laboral`.
4. Fechas.
5. Salario y frecuencia.
6. `Ajustar prestación y ausencias`, cerrado inicialmente.
7. Botón principal de ancho completo.
8. Resultado principal inmediatamente después del formulario.
9. Métricas en tarjetas compactas de dos columnas cuando el ancho lo permita.
10. `Cómo se calculó`, fuentes y avisos en acordeones.
11. Contenido educativo y preguntas frecuentes.

### Reglas de interacción y presentación

- Una sola columna por defecto; la composición formulario/resultado sólo puede
  pasar a dos columnas desde `lg`.
- El resultado se muestra debajo del formulario en móvil, no como panel lateral
  sticky.
- Después de calcular puede aparecer un resumen fijo inferior con resultado y
  enlace `Ver desglose`; debe respetar `env(safe-area-inset-bottom)` y poder
  ocultarse al entrar el resultado principal en pantalla.
- Controles táctiles de al menos 44 px, preferentemente 48 px.
- Botón principal de ancho completo en móvil.
- Evitar tablas horizontales dentro de la herramienta; usar tarjetas o listas.
- Las cifras largas deben usar `break-words` y nunca provocar desplazamiento
  horizontal.
- Mantener visible `MXN`, frecuencia salarial y estado fijo del salario.
- Los errores aparecen junto al campo correspondiente con `aria-invalid` y
  `aria-describedby`.
- El resultado usa `aria-live="polite"`; no anunciar cada pulsación mientras el
  usuario escribe.
- El foco se mueve al resumen de errores tras un envío inválido y al encabezado
  del resultado tras un cálculo solicitado, sin provocar saltos durante la
  captura.
- La fuente, fecha de revisión y aviso de estimación permanecen junto al
  resultado, no sólo en el pie editorial.

El patrón de la calculadora de vacaciones proporcionales debe tomarse como
referencia para estructura, fechas civiles, estado de resultado obsoleto,
desglose copiable y resumen móvil.

---

## Privacidad y analítica

- Salarios, fechas, ausencias e importes recibidos se procesan sólo en cliente.
- No incluir valores capturados en URLs, eventos de analítica, logs ni mensajes
  de error remotos.
- La analítica puede registrar únicamente eventos agregados como `calculation_completed`
  o `out_of_scope_selected`, sin propiedades económicas ni fechas laborales.
- Copiar el resultado requiere una acción explícita del usuario.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de aguinaldo proporcional en México` |
| Meta description | `Calcula tu aguinaldo proporcional en México según tu salario, fecha de ingreso y días trabajados. Consulta el desglose y la regla utilizada.` |
| H1 | `Calculadora de aguinaldo proporcional` |
| Keyword principal | `aguinaldo proporcional` |
| Keywords secundarias | `calculadora de aguinaldo`, `aguinaldo por días trabajados`, `cuánto me toca de aguinaldo`, `aguinaldo México` |
| Canonical | `/legal-impuestos/calculadora-aguinaldo-proporcional` |

### Contenido editorial mínimo

- Qué es el aguinaldo proporcional.
- Quién puede usar esta calculadora y quién necesita orientación especializada.
- Cómo convertir salario mensual, semanal o quincenal a salario diario.
- Qué significa que las fechas sean inclusivas.
- Qué ausencias no deben descontarse automáticamente.
- Diferencia entre importe bruto y neto.
- Cómo reclamar orientación gratuita ante PROFEDET, sin afirmar que la
  estimación determina una deuda.

### Preguntas frecuentes sugeridas

- ¿Cuántos días de aguinaldo corresponden como mínimo en México?
- ¿Tengo derecho si trabajé menos de un año?
- ¿Se cuenta mi último día de trabajo?
- ¿Cómo calculo mi salario diario si me pagan al mes?
- ¿Qué hago si mi salario es variable o por comisiones?
- ¿Las vacaciones o licencias se descuentan?
- ¿El resultado ya incluye ISR?
- ¿La estimación es oficial?

---

## Pruebas unitarias y de interfaz

### Fechas y periodos

- El mismo día de ingreso y salida produce un día inclusivo.
- Del 1 de enero al 31 de diciembre de un año común produce 365 días y 100 %.
- Del 1 de enero al 31 de diciembre de un año bisiesto produce 366 días y 100 %.
- Una fecha de ingreso anterior al año se acota al 1 de enero.
- Un rango laboral que comenzó en otro año no acumula más de un periodo.
- Fecha final anterior a ingreso produce error.
- Fecha final futura produce error y no se usa como proyección implícita.
- Fechas inválidas como 29 de febrero de un año no bisiesto se rechazan.
- El cálculo no cambia por la zona horaria ni por horario de verano.

### Salario y prestación

- Salario diario se conserva sin conversión.
- Salario semanal se divide entre 7.
- Salario quincenal se divide entre 15.
- Salario mensual se divide entre 30.
- Salario cero, negativo, infinito o inválido se rechaza.
- Quince días contractuales producen el mínimo del preset.
- Una prestación contractual de 30 días duplica el equivalente anual.
- Una prestación inferior al mínimo se rechaza.
- No se redondea el salario diario ni el cálculo intermedio.

### Días elegibles

- Cero días no elegibles conserva todos los días inclusivos.
- Los días no elegibles reducen correctamente el resultado.
- Días no elegibles iguales a los inclusivos producen cero.
- Días no elegibles superiores al periodo se rechazan.
- Valores fraccionarios se rechazan en el MVP.
- La proporción nunca es negativa ni superior a uno.

### Resultados adicionales

- La proyección sólo aparece en una relación vigente del año actual.
- La proyección al 31 de diciembre nunca sustituye el resultado generado.
- El resultado anual completo coincide con salario diario por días anuales.
- El importe recibido mayor, menor o igual genera la etiqueta neutral correcta.
- La comparación nunca muestra términos como `deuda` o `incumplimiento`.
- Modificar cualquier entrada invalida visualmente el resultado anterior.
- Preset vencido, en borrador o ausente bloquea el cálculo.
- El desglose copiado incluye periodo, salario diario, días, fórmula, fuente y
  aviso de estimación bruta.

### Entrada localizada y accesibilidad

- Se aceptan punto y coma como separador decimal en importes.
- Se rechazan separadores ambiguos o múltiples.
- Todos los errores se asocian al campo mediante atributos ARIA.
- El resultado se anuncia una sola vez después de calcular.
- El resumen fijo móvil no tapa controles ni contenido con el área segura.
- La herramienta funciona sin desplazamiento horizontal a 320 px de ancho.

---

## Criterios de aceptación del MVP

- Un usuario con salario fijo mensual obtiene un resultado válido sin tener que
  calcular manualmente su cuota diaria.
- Un periodo completo siempre produce exactamente el equivalente anual.
- No es posible calcular más del 100 % de un año en una sola operación.
- El mínimo legal no puede disminuirse accidentalmente.
- Un caso de salario variable no recibe silenciosamente la fórmula de salario
  fijo.
- El usuario puede reconstruir el resultado desde el desglose mostrado.
- Fuente oficial, versión, revisión, importe bruto y supuestos permanecen junto
  al resultado.
- En móvil, el flujo principal se completa en una sola columna y el resultado
  aparece inmediatamente después del formulario.
- No se transmiten datos económicos o laborales fuera del dispositivo.
