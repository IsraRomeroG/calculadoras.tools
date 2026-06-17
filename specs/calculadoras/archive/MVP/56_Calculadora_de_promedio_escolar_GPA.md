# Especificacion v2 - Calculadora de promedio escolar / GPA

## Descripcion general

Herramienta para calcular promedio escolar simple, promedio ponderado y GPA
aproximado a partir de materias, calificaciones y creditos. Debe ser flexible
para escalas comunes como 0-10, 0-100 y 0-4, y transparente sobre los limites de
la conversion a GPA.

La calculadora debe aportar valor accionable: no solo mostrar el promedio final,
sino explicar que materias influyen mas, si el usuario esta por encima o por
debajo de una nota minima, y que calificacion necesita para llegar a un promedio
meta.

**Arquitectura:** todo el calculo ocurre en el cliente. No requiere backend,
base de datos ni llamadas a APIs externas.

---

## Objetivo de producto

- Calcular promedio simple y ponderado.
- Calcular GPA aproximado en escala 4.0 con conversion lineal configurable.
- Explicar que el GPA es aproximado y puede variar segun la institucion.
- Permitir materias con creditos o pesos.
- Mostrar estado de aprobacion si hay nota minima.
- Calcular brecha contra un promedio meta opcional.
- Mostrar insights utiles: mejor materia, peor materia y materias con mayor
  impacto por creditos.
- Generar una pagina estatica optimizada para SEO en Astro.

---

## Alcance recomendado

### MVP

- Lista editable de materias.
- Calificacion por materia.
- Creditos/peso opcional.
- Escala de entrada: 0-10, 0-100, 0-4 o personalizada.
- Nota minima aprobatoria opcional.
- Promedio meta opcional.
- Resultado: promedio simple, promedio ponderado, GPA aproximado, materias
  aprobadas/reprobadas e insights principales.
- Calculo de calificacion necesaria para alcanzar el promedio meta cuando el
  usuario capture creditos o materias restantes.
- Copiar resumen, limpiar formulario y exportar CSV.

### Fase 2

- Conversor avanzado entre escalas.
- Tabla configurable de equivalencias a GPA por rangos.
- Presets de conversion por pais o sistema educativo si se validan fuentes
  confiables.
- Semestres guardados en `localStorage`.
- Comparador de escenarios.
- Importar CSV pegado desde hoja de calculo.
- Guardar plantillas de materias frecuentes.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL inmediata recomendada | `/matematicas/calculadora-promedio-escolar-gpa` |
| URL futura si existe Educacion | `/educacion/calculadora-promedio-escolar-gpa` |
| Archivo Astro recomendado | `src/pages/matematicas/calculadora-promedio-escolar-gpa.astro` |
| Logica de calculo | `src/lib/calculators/matematicas/calculadora-promedio-escolar-gpa/gpa.ts` |
| Pruebas unitarias | `src/lib/calculators/matematicas/calculadora-promedio-escolar-gpa/gpa.test.ts` |
| Categoria inmediata | `matematicas` |
| Categoria futura opcional | `educacion` |
| Locale base | `es-MX` |

---

## Comportamiento mobile-first

- La primera pantalla en movil debe mostrar configuracion esencial, materias y
  resultado principal sin depender de una tabla horizontal.
- Cada materia debe editarse como bloque compacto con nombre, calificacion,
  creditos y acciones por icono.
- Evitar tablas en movil; usar tabla solo como mejora progresiva en escritorio.
- Resultado general visible antes de la lista completa de materias y repetido o
  resumido al final del formulario.
- El resultado principal debe priorizar promedio ponderado, GPA aproximado y
  brecha contra el promedio meta si existe.
- Configuracion avanzada colapsada: escala personalizada, nota minima, metodo de
  GPA y promedio meta.
- Botones claros para agregar, duplicar y eliminar materia.
- Usar campos numericos con teclado decimal en movil.
- Mantener controles tactiles comodos, con altura minima aproximada de 44 px.
- No exigir creditos; el usuario debe poder calcular promedio simple en pocos
  segundos.
- Mostrar la conversion GPA como aproximada cerca del resultado, no solo en FAQ.
- Evitar cambios de layout cuando se agregan errores, ayudas o materias.

---

## Flujo principal MVP

**Ejemplo principal:** Tengo 5 materias con calificaciones y creditos distintos.
Quiero saber mi promedio ponderado, mi GPA aproximado y cuales materias pesan mas
en el resultado.

**Ejemplo de objetivo:** Tengo un promedio actual y aun me faltan materias. Quiero
saber que promedio necesito en lo restante para terminar con 9.0.

### Inputs del MVP

| Campo | Tipo | Rango valido | Valor por defecto |
|-------|------|--------------|-------------------|
| Escala | Selector | `0-10`, `0-100`, `0-4`, `Personalizada` | `0-10` |
| Maximo personalizado | Texto numerico | `> 0` | vacio |
| Nota minima aprobatoria | Texto numerico opcional | dentro de escala | vacio |
| Promedio meta | Texto numerico opcional | dentro de escala | vacio |
| Creditos restantes para meta | Texto numerico opcional | `> 0` | vacio |
| Metodo GPA | Selector | `Lineal aproximado`, `Sin GPA` | `Lineal aproximado` |
| Nombre de materia | Texto | 1-60 caracteres | `Materia 1` |
| Calificacion | Texto numerico | dentro de escala | vacio |
| Creditos / peso | Texto numerico opcional | `> 0` | vacio |

### Outputs principales

- Promedio simple.
- Promedio ponderado.
- GPA aproximado 4.0.
- Creditos totales usados.
- Materias aprobadas/reprobadas si hay nota minima.
- Mejor y peor materia.
- Materias con mayor impacto en el promedio ponderado.
- Diferencia contra nota minima, si aplica.
- Diferencia contra promedio meta, si aplica.
- Calificacion promedio necesaria en creditos restantes para alcanzar la meta,
  si el usuario captura los datos necesarios.

---

## Reglas de creditos y pesos

- Si ningun credito fue capturado, calcular promedio simple y tratar cada materia
  como peso `1` solo para calculos internos.
- Si al menos una materia tiene credito capturado, calcular promedio ponderado.
- En modo ponderado, materias sin credito capturado usan peso `1` y deben mostrar
  una ayuda breve para evitar confusion.
- Los creditos pueden representar creditos academicos, horas, porcentaje o peso
  relativo, siempre que todos usen la misma unidad.
- No mezclar porcentajes que suman 100 con creditos academicos en el mismo
  calculo sin advertencia contextual.

---

## Formulas

Promedio simple:

```text
promedio_simple = suma(calificaciones) / cantidad_materias_validas
```

Promedio ponderado:

```text
promedio_ponderado = suma(calificacion * creditos) / suma(creditos)
```

Conversion lineal aproximada a GPA:

```text
calificacion_normalizada = promedio_ponderado / escala_maxima
gpa = calificacion_normalizada * 4
```

Limitar GPA entre `0` y `4`.

Brecha contra promedio meta:

```text
brecha_meta = promedio_meta - promedio_ponderado
```

Calificacion necesaria en creditos restantes:

```text
calificacion_necesaria =
  ((promedio_meta * (creditos_actuales + creditos_restantes)) -
   (promedio_ponderado * creditos_actuales)) /
  creditos_restantes
```

Si `calificacion_necesaria` es mayor que la escala maxima, mostrar que la meta no
es alcanzable con los creditos restantes capturados.

---

## Validaciones y estados

- Debe existir al menos una materia valida.
- Calificacion debe estar dentro de la escala.
- Creditos deben ser mayores que cero si se capturan.
- Nota minima debe estar dentro de la escala.
- Promedio meta debe estar dentro de la escala.
- Creditos restantes para meta deben ser mayores que cero si se capturan.
- Si se captura promedio meta sin creditos restantes, mostrar brecha actual pero
  no calcular calificacion necesaria.
- Redondear promedios a 2 decimales.
- Redondear GPA a 2 decimales.
- Mantener los valores originales para calculo interno y redondear solo al
  presentar resultados.
- Mostrar errores junto al campo afectado y un resumen corto cerca del resultado
  si el calculo no puede completarse.

---

## Mensajes y ayudas

- `GPA aproximado`: "La equivalencia a GPA puede variar por escuela. Este valor
  usa una conversion lineal a escala 4.0."
- `Creditos vacios en modo ponderado`: "Las materias sin creditos se toman con
  peso 1."
- `Meta no alcanzable`: "Con los creditos restantes capturados, la calificacion
  necesaria supera la escala maxima."
- `Sin creditos`: "Como no capturaste creditos, el promedio ponderado coincide
  con el promedio simple."

---

## Copiar resumen y exportar CSV

### Copiar resumen

Debe generar un texto legible con:

- Promedio simple.
- Promedio ponderado.
- GPA aproximado.
- Creditos totales.
- Estado contra nota minima, si aplica.
- Brecha contra promedio meta, si aplica.
- Calificacion necesaria para la meta, si aplica.
- Lista breve de materias con calificacion y creditos.

### Exportar CSV

Columnas sugeridas:

```text
materia,calificacion,creditos,estado,impacto
```

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de promedio escolar y GPA` |
| Meta description | `Calcula promedio simple, promedio ponderado y GPA aproximado con materias, calificaciones y creditos.` |
| H1 | `Calculadora de promedio escolar` |
| Keyword principal | `calculadora promedio escolar` |
| Keywords secundarias | `calculadora gpa`, `promedio ponderado`, `calcular promedio materias`, `como calcular promedio escolar` |

### FAQs sugeridas

- Como se calcula el promedio ponderado?
- Que son creditos o pesos?
- La conversion a GPA es exacta?
- Puedo usar escala de 0 a 100?
- Que calificacion necesito para llegar a mi promedio meta?
- Por que mi promedio ponderado es diferente al promedio simple?

---

## Pruebas sugeridas

- Calificaciones `8, 9, 10` producen promedio simple `9`.
- Creditos ponderan correctamente el promedio.
- Escala 0-100 convierte GPA aproximado.
- Calificacion fuera de escala muestra error.
- Creditos vacios se tratan como `1` en modo ponderado.
- Si ningun credito fue capturado, promedio ponderado coincide con promedio
  simple.
- Promedio meta calcula brecha correctamente.
- Calificacion necesaria para meta se calcula con creditos restantes.
- Meta no alcanzable muestra estado cuando la calificacion necesaria supera la
  escala maxima.
- GPA se limita entre `0` y `4`.
