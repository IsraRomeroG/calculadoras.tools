# Especificación v2 - Conversor de tallas de ropa

## Descripción general

Herramienta orientativa para convertir tallas de ropa entre regiones y ayudar al
usuario a decidir qué talla revisar primero al comprar ropa. La calculadora debe
resolver dos necesidades:

1. Convertir una talla conocida entre sistemas comerciales.
2. Encontrar una talla aproximada a partir de medidas corporales opcionales.

Las tallas varían por marca, prenda, corte, país y temporada, por lo que nunca
deben presentarse como equivalencias exactas ni como recomendación corporal. El
resultado debe funcionar como una guía práctica para comparar contra la tabla de
la marca.

**Arquitectura:** todo el cálculo ocurre en el cliente con tablas locales. No
requiere backend ni llamadas a APIs externas.

---

## Objetivo de producto

- Convertir tallas aproximadas entre sistemas internacionales, US, EU, UK y MX.
- Separar tablas por tipo de prenda y sistema comercial.
- Ofrecer un modo opcional para estimar talla usando medidas corporales.
- Mostrar un resultado accionable: talla principal, tallas vecinas, rango de
  medidas, nivel de confianza y siguiente paso recomendado.
- Permitir comparar una talla contra todas las regiones disponibles.
- Reforzar que debe consultarse la tabla de cada marca antes de comprar.
- Generar una página estática optimizada para SEO en Astro.

---

## Principios de experiencia

- **Orientativo, no exacto:** usar lenguaje como "aproximado", "revisa también"
  y "puede variar".
- **Mobile-first:** el usuario debe poder llegar al resultado con pocos toques,
  sin depender de una tabla ancha como interfaz principal.
- **Accionable:** el resultado debe decir qué talla revisar primero y cuándo
  conviene mirar una talla vecina.
- **Determinístico:** no inferir tallas fuera de las tablas editoriales locales.
- **Neutral:** "mujer" y "hombre" se tratan como sistemas comerciales de tallaje,
  no como identidad de la persona.

---

## Alcance recomendado

### MVP

- Dos modos de uso:
  - `Convertir una talla que ya tengo`.
  - `Encontrar talla aproximada con mis medidas`.
- Prenda: camiseta/top, pantalón y vestido.
- Perfil de tabla: mujer/hombre, entendido como sistema comercial de tallaje.
- Región origen y región destino.
- Opción de destino `Ver todas las regiones`.
- Talla origen con valores disponibles según prenda, perfil y región.
- Unidad de medidas: cm/in.
- Medidas corporales opcionales según prenda:
  - Camiseta/top: pecho y cintura.
  - Pantalón: cintura, cadera y, si existe en la tabla, entrepierna.
  - Vestido: pecho, cintura y cadera.
- Preferencia de ajuste opcional: ajustado, regular u holgado.
- Resultado principal en tarjeta: talla aproximada, tallas vecinas, rangos de
  medidas, nivel de confianza y guía de compra.
- Copiar resultado y limpiar formulario.
- Aviso visible sobre variación por marca, corte y material.

### Fase 2

- Tallas infantiles.
- Calzado como calculadora independiente.
- Medidas de la prenda, no solo medidas corporales.
- Más regiones y sistemas comerciales con revisión editorial.
- Comparador manual para pegar o introducir la tabla de una marca.
- Filtros por corte: slim, regular, relaxed, oversized, petite y tall.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL pública recomendada | `/conversores/conversor-tallas-de-ropa` |
| Archivo Astro recomendado | `src/pages/conversores/conversor-tallas-de-ropa.astro` |
| Datos locales | `src/lib/calculators/conversores/conversor-tallas-de-ropa/sizeCharts.ts` |
| Pruebas unitarias | `src/lib/calculators/conversores/conversor-tallas-de-ropa/sizeCharts.test.ts` |
| Categoría | `conversores` |
| Locale base | `es-MX` |

---

## Comportamiento mobile-first

- Usar un flujo vertical de pasos cortos:
  1. Modo de cálculo.
  2. Tipo de prenda.
  3. Sistema comercial.
  4. Región y talla, o medidas corporales.
  5. Región destino.
- Priorizar controles grandes tipo selector/chip para valores frecuentes.
- Deshabilitar o esconder campos que aún no aplican para reducir fricción.
- Mostrar el resultado principal como una tarjeta encima de cualquier tabla.
- Incluir un acordeón "Refinar con mis medidas" cuando el usuario empieza desde
  una talla conocida.
- Incluir un acordeón "Ver tabla comparativa" con desplazamiento horizontal como
  contenido secundario.
- Mantener visible el aviso sobre variación entre marcas cerca del resultado,
  no solo al final de la página.
- Usar lenguaje neutral para perfiles, medidas y preferencias de ajuste.
- Asegurar etiquetas visibles, foco claro de teclado, targets táctiles cómodos y
  actualización del resultado anunciable con `aria-live`.

---

## Flujo principal MVP

### Modo A: convertir una talla conocida

**Ejemplo:** convertir una talla `M` de camiseta/top en sistema internacional a
una talla aproximada de Estados Unidos, Europa o todas las regiones.

1. El usuario elige prenda.
2. El usuario elige tabla comercial.
3. El usuario elige región origen.
4. El usuario elige talla origen entre valores disponibles.
5. El usuario elige región destino o `Ver todas`.
6. Opcionalmente añade medidas y preferencia de ajuste para refinar el mensaje.
7. La calculadora muestra la talla aproximada y tallas vecinas.

### Modo B: encontrar talla aproximada con medidas

**Ejemplo:** el usuario introduce cintura y cadera para pantalón y quiere saber
qué talla revisar en MX, US o EU.

1. El usuario elige prenda.
2. El usuario elige tabla comercial.
3. El usuario introduce una o más medidas relevantes.
4. El usuario elige región destino o `Ver todas`.
5. La calculadora busca registros cuyas medidas editoriales contengan las
   medidas introducidas.
6. Si hay más de una coincidencia, se prioriza la más cercana al centro del rango
   y se muestran tallas vecinas.

### Inputs del MVP

| Campo | Tipo | Valores |
|-------|------|---------|
| Modo de cálculo | Selector segmentado | convertir talla, estimar con medidas |
| Tipo de prenda | Selector | top/camiseta, pantalón, vestido |
| Tabla comercial | Selector | mujer, hombre |
| Región origen | Selector | Internacional, US, EU, UK, MX |
| Talla origen | Selector | valores disponibles por tabla |
| Región destino | Selector | Internacional, US, EU, UK, MX, Ver todas |
| Unidad de medidas | Selector | cm, in |
| Medidas corporales | Inputs numéricos | pecho, cintura, cadera, entrepierna según prenda |
| Preferencia de ajuste | Selector opcional | ajustado, regular, holgado |

### Outputs principales

- Talla equivalente aproximada o talla sugerida para revisar primero.
- Tallas vecinas posibles, por ejemplo "revisa también S o L".
- Tabla resumida de equivalencias si el destino es `Ver todas`.
- Rango orientativo de pecho/cintura/cadera/entrepierna según prenda.
- Nivel de confianza: alta, media o baja.
- Mensaje de guía de compra según preferencia de ajuste:
  - Ajustado: "compara especialmente la medida más cercana al límite superior".
  - Regular: "empieza por la talla principal y revisa la tabla de la marca".
  - Holgado: "revisa también la talla superior si prefieres más amplitud".
- Aviso para consultar la tabla de la marca.
- Fecha de revisión editorial de la tabla usada.

---

## Datos y algoritmo

Definir una tabla local versionada. Cada registro representa una fila editorial
de equivalencia, no una verdad universal.

```text
sizeRange = {
  minCm,
  maxCm
}

sizeRecord = {
  id,
  revisedAt,
  profile,
  garment,
  order,
  labels: {
    international,
    us,
    eu,
    uk,
    mx
  },
  measurementsCm: {
    chest,
    waist,
    hip,
    inseam
  },
  confidence,
  sourceNote,
  editorialNote,
  fitNotes
}
```

Campos esperados:

- `id`: identificador estable del registro.
- `revisedAt`: fecha de revisión editorial en formato `YYYY-MM-DD`.
- `profile`: `mujer` o `hombre`.
- `garment`: `top`, `pantalon` o `vestido`.
- `order`: posición relativa para calcular tallas vecinas.
- `labels`: equivalencias por región. Un valor puede estar vacío si la tabla no
  tiene equivalencia confiable.
- `measurementsCm`: rangos corporales orientativos disponibles para la prenda.
- `confidence`: `alta`, `media` o `baja` según calidad/completitud editorial.
- `sourceNote`: nota interna o pública sobre el origen editorial de la tabla.
- `editorialNote`: nota breve mostrable al usuario cuando aporte contexto.
- `fitNotes`: notas por corte si aplican, por ejemplo slim u oversized.

### Conversión por talla

```text
filtrar registros por profile y garment
buscar registro cuyo labels[regionOrigen] coincida con tallaOrigen
si destino es "Ver todas", mostrar labels completos del mismo registro
si destino es una región, mostrar labels[regionDestino]
calcular tallas vecinas con order - 1 y order + 1 cuando existan
mostrar rangos de measurementsCm del mismo registro
```

Si hay varias coincidencias editoriales para una misma talla origen, mostrar la
talla principal y agrupar alternativas como "posibles tallas vecinas". No
extrapolar equivalencias fuera de los registros disponibles.

### Estimación por medidas

```text
normalizar medidas a cm
filtrar registros por profile y garment
buscar registros donde cada medida introducida caiga dentro del rango disponible
ordenar coincidencias por cercanía al centro de los rangos
mostrar la mejor coincidencia y tallas vecinas
```

Si ninguna fila contiene las medidas introducidas, mostrar un estado vacío útil.
No extrapolar hacia tallas fuera de la tabla.

### Preferencia de ajuste

La preferencia de ajuste no cambia la equivalencia base. Solo modifica el texto
de orientación y qué talla vecina conviene revisar:

- `ajustado`: destacar la talla principal y advertir si una medida está cerca del
  límite superior del rango.
- `regular`: mostrar la talla principal como punto de partida.
- `holgado`: sugerir revisar también la talla superior cuando exista.

### Nivel de confianza

- `alta`: existe equivalencia directa en la región destino y rangos completos
  para la prenda.
- `media`: existe equivalencia directa, pero faltan algunas medidas o hay
  solapamiento relevante con tallas vecinas.
- `baja`: tabla incompleta, destino sin equivalencia directa o resultado basado
  en coincidencias parciales de medidas.

---

## Validaciones y estados

- Mostrar solo tallas disponibles para la combinación elegida.
- Deshabilitar región destino si no hay ninguna equivalencia para esa tabla.
- Permitir origen y destino iguales, pero mostrar un mensaje simple:
  "Ya estás viendo esta región; puedes elegir otra o ver todas".
- Validar medidas positivas y dentro de rangos corporales plausibles por campo.
- Permitir usar una sola medida, pero comunicar que la confianza puede bajar.
- Si no existe equivalencia, informar que no hay tabla confiable disponible y
  sugerir comparar con la tabla de la marca.
- Si las medidas no coinciden con ninguna fila, decirlo claramente y no inventar
  una talla fuera de la tabla.
- Las tablas deben incluir identificador y fecha de revisión editorial.
- No presentar las medidas como recomendación corporal o médica.
- Aclarar que cortes oversized, slim, petite, tall, relaxed, elasticidad y
  composición de tela alteran el ajuste.

### Estados vacíos sugeridos

- **Sin equivalencia:** "No tenemos una equivalencia confiable para esta
  combinación. Prueba con `Ver todas` o consulta la tabla de la marca."
- **Medidas fuera de tabla:** "Tus medidas no caen dentro de los rangos
  disponibles para esta tabla. No vamos a inventar una talla; compara con la
  guía de la marca."
- **Datos incompletos:** "Esta tabla tiene información parcial. Usa el resultado
  como punto de partida y confirma con la marca."

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Conversor de tallas de ropa` |
| Meta description | `Convierte tallas de ropa entre sistemas internacionales, US, EU, UK y MX con equivalencias orientativas y rangos de medidas.` |
| H1 | `Conversor de tallas de ropa` |
| Keyword principal | `conversor tallas ropa` |
| Keywords secundarias | `talla europea a mexicana`, `talla US a EU`, `tabla de tallas`, `convertir talla de ropa`, `qué talla soy` |

### Contenido recomendado

- Explicar que las equivalencias son aproximadas.
- Incluir una sección breve sobre cómo medirse:
  - Pecho: alrededor de la parte más amplia del torso.
  - Cintura: alrededor de la parte más estrecha o donde ajuste la prenda.
  - Cadera: alrededor de la parte más amplia de la cadera.
  - Entrepierna: desde la entrepierna hasta el largo deseado del pantalón.
- Incluir ejemplos de conversión frecuentes:
  - Talla US a EU.
  - Talla EU a MX.
  - Talla internacional S/M/L a talla numérica.
- Añadir FAQs:
  - ¿Qué talla es M en México?
  - ¿Cómo convertir talla US a EU?
  - ¿Por qué mi talla cambia según la marca?
  - ¿Qué diferencia hay entre tabla de mujer y de hombre?
  - ¿Qué hago si estoy entre dos tallas?
- Considerar marcado estructurado `FAQPage` para preguntas frecuentes.

---

## Pruebas sugeridas

- La búsqueda devuelve el registro correcto por prenda, perfil, región y talla.
- Cambiar región actualiza tallas disponibles.
- `Ver todas` devuelve las regiones disponibles del mismo registro.
- Combinación inexistente muestra estado vacío útil.
- Conversión cm/in conserva rangos y redondeos esperados.
- Cada registro tiene identificador y fecha editorial.
- Las tallas vecinas respetan el orden editorial.
- La preferencia de ajuste no cambia la equivalencia base.
- Medidas dentro de rango devuelven la talla esperada.
- Medidas que coinciden con varias tallas priorizan la más cercana al centro del
  rango.
- Medidas fuera de la tabla no generan tallas extrapoladas.
- Resultados con datos incompletos degradan el nivel de confianza.
- El aviso de variación por marca está presente junto al resultado.
- El resultado principal puede copiarse con talla, regiones, rangos, confianza y
  fecha de revisión.
