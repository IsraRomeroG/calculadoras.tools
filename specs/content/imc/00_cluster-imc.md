# Cluster de contenido - IMC

## Objetivo del cluster

Construir autoridad alrededor de la calculadora de IMC y capturar busquedas
informacionales, comparativas y long-tail relacionadas con peso, altura,
rangos adultos, limitaciones y casos especiales.

## Pagina pilar

- Calculadora: `/salud/calculadora-de-imc`
- Categoria editorial: `Salud`
- Tipo de contenido: salud educativa, no diagnostico medico
- Tono: claro, responsable, neutral y no prescriptivo

## Arquitectura recomendada

1. Articulos base: definicion, formula, tabla, interpretacion y rango normal.
2. Articulos por categoria: sobrepeso, obesidad, bajo peso y casos extremos.
3. Articulos por poblacion: ninos/adolescentes, embarazo, adultos mayores,
   hombres/mujeres y personas con masa muscular alta.
4. Comparativas: IMC vs grasa corporal, IMC vs indice cintura-altura, peso
   ideal vs peso saludable.
5. Long-tail: peso saludable por estatura y significado de valores concretos.

## Reglas editoriales globales

- No presentar el IMC como diagnostico.
- Evitar frases como "debes bajar de peso" o "debes pesar".
- Usar "rango saludable de referencia" y "orientativo".
- En menores de 20 anos, explicar que se usan percentiles por edad y sexo.
- En embarazo, indicar que el IMC actual no se interpreta igual.
- Enlazar siempre a la calculadora de IMC con anchor contextual.
- Incluir aviso medico breve cuando el articulo trate bajo peso severo,
  obesidad, embarazo, ninos o adultos mayores.

## Fuentes base

- CDC Adult BMI Categories:
  `https://www.cdc.gov/bmi/adult-calculator/bmi-categories.html`
- CDC BMI-for-Age Growth Charts:
  `https://www.cdc.gov/growth-chart-training/hcp/using-bmi/summary.html`
- WHO Obesity:
  `https://www.who.int/health-topics/obesity/`

## Enlaces internos centrales

- `/salud/calculadora-de-imc`
- `/blog/que-es-el-imc-y-como-se-calcula`
- `/blog/tabla-imc-adultos-rangos-categorias`
- `/blog/peso-saludable-segun-estatura`
- `/blog/limitaciones-del-imc`
- `/blog/imc-ninos-adolescentes-percentiles`
- `/blog/imc-embarazo`

## Criterios de aceptacion del cluster

- Cada articulo debe tener un CTA hacia la calculadora.
- Cada articulo debe tener al menos 2 enlaces internos del cluster cuando ya
  existan.
- Cada articulo debe incluir frontmatter compatible con `src/content.config.ts`.
- Los articulos YMYL deben citar fuentes oficiales o indicar que se verificaron
  antes de publicar.
