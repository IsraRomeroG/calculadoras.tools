# Especificación v1 - Conversor de tallas de ropa

## Descripción general

Herramienta orientativa para convertir tallas de ropa entre regiones y mostrar
rangos corporales aproximados. Las tallas varían por marca, prenda, corte y país,
por lo que nunca deben presentarse como equivalencias exactas.

**Arquitectura:** todo el cálculo ocurre en el cliente con tablas locales. No
requiere backend ni llamadas a APIs externas.

---

## Objetivo de producto

- Convertir tallas aproximadas entre regiones.
- Separar tablas por tipo de prenda y sistema.
- Mostrar medidas corporales orientativas.
- Reforzar que debe consultarse la tabla de cada marca.
- Generar una página estática optimizada para SEO en Astro.

---

## Alcance recomendado

### MVP

- Prenda: camiseta/top, pantalón y vestido.
- Perfil de tabla: mujer/hombre, entendido como sistema comercial de tallaje.
- Región origen y destino.
- Talla origen.
- Resultado aproximado y rango de medidas.
- Copiar resultado y limpiar formulario.
- Aviso visible sobre variación por marca.

### Fase 2

- Tallas infantiles.
- Calzado como calculadora independiente.
- Ajuste por medidas corporales.
- Tablas regionales ampliadas con revisión editorial.

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

- Selectores progresivos: prenda, tabla, región y talla.
- Resultado principal con rango, no una única equivalencia rígida.
- Tabla comparativa secundaria con desplazamiento horizontal.
- No ocultar el aviso sobre variación entre marcas.
- Usar lenguaje neutral para perfiles y medidas.

---

## Flujo principal MVP

**Ejemplo:** Convertir una talla `M` de camiseta de sistema internacional a una
talla aproximada de Estados Unidos y Europa.

### Inputs del MVP

| Campo | Tipo | Valores |
|-------|------|---------|
| Tipo de prenda | Selector | top/camiseta, pantalón, vestido |
| Tabla comercial | Selector | mujer, hombre |
| Región origen | Selector | Internacional, US, EU, UK, MX |
| Talla origen | Selector | valores disponibles por tabla |
| Unidad de medidas | Selector | cm, in |

### Outputs principales

- Talla equivalente aproximada.
- Tallas vecinas posibles.
- Rango orientativo de pecho/cintura/cadera según prenda.
- Aviso para consultar marca.

---

## Datos y algoritmo

Definir una tabla local versionada:

```text
sizeRecord = {
  profile,
  garment,
  international,
  us,
  eu,
  uk,
  mx,
  chestRangeCm,
  waistRangeCm,
  hipRangeCm
}
```

Conversión:

```text
buscar registro que coincida con perfil, prenda, región y talla origen
mostrar valor destino y rangos del mismo registro
```

No inferir equivalencias fuera de la tabla.

---

## Validaciones y estados

- Mostrar solo tallas disponibles para la combinación elegida.
- Si no existe equivalencia, informar que no hay tabla disponible.
- Las tablas deben incluir fecha de revisión editorial.
- No presentar las medidas como recomendación corporal.
- Aclarar que cortes oversized, slim y tall alteran el ajuste.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Conversor de tallas de ropa` |
| Meta description | `Convierte tallas de ropa entre sistemas internacionales, US, EU, UK y MX con equivalencias orientativas.` |
| H1 | `Conversor de tallas de ropa` |
| Keyword principal | `conversor tallas ropa` |
| Keywords secundarias | `talla europea a mexicana`, `talla US a EU`, `tabla de tallas` |

---

## Pruebas sugeridas

- La búsqueda devuelve el registro correcto por prenda y perfil.
- Cambiar región actualiza tallas disponibles.
- Combinación inexistente muestra estado vacío.
- Conversión cm/in conserva rangos.
- Cada registro tiene identificador y fecha editorial.

