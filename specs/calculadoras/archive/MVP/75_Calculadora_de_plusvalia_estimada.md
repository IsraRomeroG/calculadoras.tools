# Especificación v2 - Calculadora de plusvalía estimada

## Descripción general

Herramienta para proyectar el valor futuro de una propiedad usando una tasa
anual de plusvalía ingresada por el usuario. Debe ayudar a responder cuánto
podría valer el inmueble, cuánto aumentaría o disminuiría su valor y qué tan
sensible es la proyección ante distintos escenarios.

La calculadora debe mostrar escenarios conservador, base y optimista desde el
MVP, además de una lectura breve en lenguaje natural. Debe aclarar que la
plusvalía no está garantizada y que el valor real depende del mercado, zona,
estado del inmueble, liquidez, mejoras, inflación y otros factores.

**Arquitectura:** todo el cálculo ocurre en el cliente. No requiere backend,
base de datos ni llamadas a APIs externas.

---

## Objetivo de producto

- Estimar valor futuro con plusvalía compuesta.
- Calcular ganancia nominal y porcentaje acumulado.
- Permitir plusvalía positiva, cero o negativa.
- Comparar escenarios conservador, base y optimista.
- Explicar el resultado principal con una frase clara y accionable.
- Mantener una experiencia mobile-first con resultados visibles, tablas
  secundarias y controles fáciles de usar en pantalla chica.
- Generar una página estática optimizada para SEO en Astro.

---

## Alcance recomendado

### MVP

- Valor actual.
- Tasa anual manual como escenario base.
- Plazo en años.
- Gastos de mejora opcionales.
- Tres escenarios simultáneos:
  - Conservador: tasa base menos `2` puntos porcentuales.
  - Base: tasa ingresada por el usuario.
  - Optimista: tasa base más `2` puntos porcentuales.
- Resultado principal para el escenario base: valor futuro, ganancia o pérdida
  nominal y plusvalía acumulada.
- Lectura interpretativa del resultado base.
- Tabla anual del escenario base.
- Copiar resultado, limpiar formulario y exportar CSV.

### Modo avanzado recomendado

- Inflación anual opcional para estimar valor real.
- Comisión de venta, gastos de escrituración u otros costos manuales para
  estimar un valor neto de venta.

Estos campos deben estar colapsados o visualmente separados para no saturar el
flujo principal en móvil.

### Fase 2

- Mejoras futuras planeadas por año.
- Historial en `sessionStorage`.
- Comparación entre propiedades o ubicaciones capturadas manualmente.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL pública recomendada | `/inmuebles/calculadora-plusvalia-estimada` |
| Archivo Astro recomendado | `src/pages/inmuebles/calculadora-plusvalia-estimada.astro` |
| Lógica de cálculo | `src/lib/calculators/inmuebles/calculadora-plusvalia-estimada/appreciation.ts` |
| Pruebas unitarias | `src/lib/calculators/inmuebles/calculadora-plusvalia-estimada/appreciation.test.ts` |
| Categoría | `inmuebles` |
| Locale base | `es-MX` |
| Moneda base | `MXN`, símbolo `$` |

---

## Comportamiento mobile-first

- Layout de una sola columna en móvil.
- Inputs con `inputmode="decimal"` o `inputmode="numeric"` según aplique.
- Resultado principal inmediatamente después del formulario, con el valor futuro
  estimado del escenario base como dato dominante.
- Escenarios en tarjetas compactas o en un control segmentado; nunca deben
  presentarse como garantías.
- Mostrar la tasa manual claramente en el resumen.
- Incluir una frase interpretativa corta, por ejemplo:
  `Con una plusvalía anual de 4%, tu propiedad podría aumentar aproximadamente $960,489 en 10 años.`
- Tabla anual como sección secundaria, desplazable horizontalmente y colapsada
  por defecto en pantallas pequeñas.
- Acciones principales visibles: copiar resultado, limpiar formulario y exportar
  CSV.
- No etiquetar escenarios como garantía.
- Permitir tasa negativa sin mensajes alarmistas.
- Evitar que el modo avanzado empuje el resultado principal por debajo del
  primer viewport móvil.

---

## Flujo principal MVP

**Ejemplo:** Propiedad de `$2,000,000` con plusvalía estimada de `4%` anual
durante `10 años`.

### Inputs del MVP

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Valor actual | Texto numérico con formato de moneda | `> 0` | vacío |
| Plusvalía anual base (%) | Texto numérico decimal | `>-100%` y `<=100%` | `4` |
| Plazo | Texto numérico, stepper o slider | `1-100 años` | `10` |
| Mejoras añadidas al valor | Texto numérico opcional con formato de moneda | `>= 0` | `0` |

### Outputs principales

- Valor futuro estimado del escenario base.
- Ganancia o pérdida nominal del escenario base.
- Plusvalía acumulada del escenario base.
- Resumen de escenarios conservador, base y optimista.
- Valor aportado por mejoras.
- Frase interpretativa del resultado.
- Tabla anual del escenario base.

### Inputs avanzados opcionales

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Inflación anual estimada (%) | Texto numérico decimal | `>= 0` y `<=100%` | vacío |
| Comisión/costos de venta (%) | Texto numérico decimal | `>= 0` y `<=100%` | vacío |
| Otros costos de venta | Texto numérico opcional con formato de moneda | `>= 0` | `0` |

### Outputs avanzados opcionales

- Valor futuro en términos reales, si el usuario captura inflación.
- Ganancia real estimada.
- Valor neto estimado de venta, si el usuario captura costos.
- Diferencia entre valor futuro nominal y valor neto estimado.

---

## Fórmulas

```text
base = valor_actual + mejoras
tasa = plusvalia_anual / 100
valor_futuro = base * (1 + tasa)^años
ganancia_nominal = valor_futuro - base
plusvalia_acumulada = ((valor_futuro / base) - 1) * 100
```

Escenarios:

```text
delta_escenario = 2 / 100
tasa_conservadora = max(tasa - delta_escenario, -0.99)
tasa_base = tasa
tasa_optimista = tasa + delta_escenario

valor_futuro_escenario = base * (1 + tasa_escenario)^años
ganancia_escenario = valor_futuro_escenario - base
plusvalia_acumulada_escenario = ((valor_futuro_escenario / base) - 1) * 100
```

Tabla anual:

```text
valor_año_n = base * (1 + tasa)^n
```

Modo avanzado:

```text
inflacion = inflacion_anual / 100
valor_real = valor_futuro / (1 + inflacion)^años
ganancia_real = valor_real - base

costos_porcentuales = valor_futuro * (costos_venta_porcentaje / 100)
valor_neto_venta = valor_futuro - costos_porcentuales - otros_costos_venta
diferencia_neta = valor_neto_venta - base
```

Notas:

- Las mejoras se suman a la base y se asume que ya están incorporadas al valor
  de la propiedad desde hoy.
- La tabla anual del MVP usa el escenario base. Exportar CSV puede incluir
  columnas de los tres escenarios si la implementación lo permite.

---

## Validaciones y estados

- Valor actual debe ser mayor que cero.
- Tasa debe ser mayor que `-100%`.
- Plazo entre 1 y 100 años.
- Permitir resultado menor al valor actual.
- Mostrar advertencia si tasa supera `20%`.
- Mostrar aviso de mayor incertidumbre si el plazo supera `30` años.
- Si la tasa es negativa, mostrar el resultado de forma neutra, sin lenguaje
  alarmista.
- Si las mejoras superan `50%` del valor actual, aclarar que no toda mejora se
  refleja necesariamente 1:1 en el precio de mercado.
- Si el modo avanzado no está activo, no mostrar inflación, impuestos ni costos
  de venta en el resultado principal.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de plusvalía estimada` |
| Meta description | `Proyecta el valor futuro de una propiedad con una tasa anual de plusvalía manual y consulta la ganancia acumulada.` |
| H1 | `Calculadora de plusvalía` |
| Keyword principal | `calculadora de plusvalía` |
| Keywords secundarias | `calculadora plusvalia`, `plusvalía inmueble`, `plusvalia inmueble`, `valor futuro propiedad`, `apreciación vivienda`, `apreciacion vivienda`, `plusvalía de una casa` |

### FAQs sugeridas

- ¿Cómo se calcula la plusvalía?
- ¿La plusvalía está garantizada?
- ¿Puedo usar una tasa negativa?
- ¿Las mejoras aumentan el valor?
- ¿Qué diferencia hay entre valor nominal y valor real?
- ¿El valor futuro es lo mismo que el dinero que recibiría al vender?

---

## Pruebas sugeridas

- `$2,000,000`, `4%`, `10 años` produce aproximadamente `$2,960,488.57`.
- Tasa `0%` conserva el valor.
- Tasa negativa reduce valor.
- Mejoras se suman a la base.
- Tasa `-100%` muestra error.
- Escenario conservador usa la tasa base menos `2` puntos porcentuales.
- Escenario optimista usa la tasa base más `2` puntos porcentuales.
- Una tasa base de `-99%` no permite que el escenario conservador baje de
  `-99%`.
- Inflación opcional reduce el valor real frente al valor nominal.
- Costos de venta opcionales reducen el valor neto estimado.

