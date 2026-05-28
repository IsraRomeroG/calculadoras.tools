# Cluster de contenido - TDEE y calorias diarias

## Objetivo del cluster

Construir autoridad alrededor de la calculadora de calorias diarias (TDEE) y
capturar busquedas informacionales, practicas y long-tail relacionadas con gasto
energetico diario, calorias de mantenimiento, deficit, superavit, TMB, actividad
fisica y macros.

El cluster debe convertir la calculadora TDEE en la pagina pilar del ecosistema
energetico del sitio, conectando de forma natural con IMC, macros y deficit
calorico sin prometer resultados exactos ni planes nutricionales medicos.

## Pagina pilar

- Calculadora: `/salud/calculadora-de-calorias-diarias-tdee`
- Categoria editorial: `Salud`
- Tipo de contenido: salud educativa, estimaciones energeticas, no plan medico
- Tono: claro, responsable, practico, neutral y no moralizante

## Arquitectura recomendada

1. Articulos base: que es TDEE, cuantas calorias necesito, TMB vs TDEE y formula
   Mifflin-St Jeor.
2. Articulos de uso practico: calorias de mantenimiento, elegir nivel de
   actividad, que hacer si el peso no cambia.
3. Articulos por objetivo: calorias para bajar de peso y calorias para subir de
   peso, siempre con cautela editorial.
4. Articulos puente: TDEE e IMC, TDEE y macros, deficit calorico y calculadoras
   futuras.
5. Refuerzos en el cluster IMC: enlaces contextuales desde articulos de
   sobrepeso, bajo peso, limitaciones del IMC, masa muscular y peso saludable.

## Mapa de articulos

| Archivo spec | URL futura | Prioridad | Rol |
|--------------|------------|-----------|-----|
| `01_que-es-tdee-calorias-diarias.md` | `/blog/que-es-tdee-calorias-diarias` | P0 | Pilar informacional |
| `02_cuantas-calorias-necesito-al-dia.md` | `/blog/cuantas-calorias-necesito-al-dia` | P0 | Intencion principal de busqueda |
| `03_calorias-de-mantenimiento.md` | `/blog/calorias-de-mantenimiento` | P1 | Uso de TDEE para mantener peso |
| `04_como-elegir-nivel-de-actividad-tdee.md` | `/blog/como-elegir-nivel-de-actividad-tdee` | P1 | Reducir error comun del calculo |
| `05_tmb-vs-tdee-diferencias.md` | `/blog/tmb-vs-tdee-diferencias` | P1 | Diferenciacion conceptual |
| `06_formula-mifflin-st-jeor.md` | `/blog/formula-mifflin-st-jeor` | P2 | Soporte tecnico y confianza |
| `07_cuantas-calorias-para-bajar-de-peso.md` | `/blog/cuantas-calorias-para-bajar-de-peso` | P1 | Objetivo de deficit, sensible |
| `08_cuantas-calorias-para-subir-de-peso.md` | `/blog/cuantas-calorias-para-subir-de-peso` | P2 | Objetivo de superavit |
| `09_por-que-mi-peso-no-cambia-si-como-mi-tdee.md` | `/blog/por-que-mi-peso-no-cambia-si-como-mi-tdee` | P2 | Troubleshooting y retencion |
| `10_tdee-y-macros-como-se-relacionan.md` | `/blog/tdee-y-macros-como-se-relacionan` | P2 | Puente hacia macros |

## Reglas editoriales globales

- Presentar TDEE como estimacion inicial, no como medicion exacta.
- Evitar frases como "calorias exactas", "plan perfecto" o "debes comer".
- Usar "punto de partida", "rango orientativo", "ajustar despues de 2 a 3
  semanas" y "segun evolucion real".
- No recomendar dietas muy bajas en calorias ni deficits agresivos sin
  supervision profesional.
- Incluir aviso medico breve cuando el articulo trate perdida de peso, bajo
  peso, embarazo, lactancia, menores de 18 anos, enfermedades o antecedentes de
  trastornos de la conducta alimentaria.
- Explicar que el factor de actividad suele ser la mayor fuente de error.
- Aclarar que ejercicio y actividad diaria no deben duplicarse al estimar el
  gasto energetico.
- Enlazar siempre a la calculadora TDEE con anchor contextual.
- Mantener el lenguaje sin culpa, sin estigma corporal y sin promesas esteticas.

## Fuentes base

- Mifflin MD, St Jeor ST, et al.:
  `https://pubmed.ncbi.nlm.nih.gov/2305711/`
- National Academies - Dietary Reference Intakes for Energy:
  `https://nap.nationalacademies.org/read/26818/chapter/2`
- NIDDK Body Weight Planner:
  `https://www.niddk.nih.gov/bwp`
- CDC - Losing Weight:
  `https://www.cdc.gov/healthy-weight-growth/losing-weight/index.html`
- MedlinePlus - Weight Control:
  `https://medlineplus.gov/weightcontrol.html`

## Enlaces internos centrales

- `/salud/calculadora-de-calorias-diarias-tdee`
- `/blog/que-es-tdee-calorias-diarias`
- `/blog/cuantas-calorias-necesito-al-dia`
- `/blog/calorias-de-mantenimiento`
- `/blog/como-elegir-nivel-de-actividad-tdee`
- `/blog/tmb-vs-tdee-diferencias`
- `/blog/calorias-diarias-e-imc`
- Futuro: `/salud/calculadora-de-macros`
- Futuro: `/salud/calculadora-de-deficit-calorico`

## Enlaces desde el cluster IMC

Reforzar articulos ya existentes con enlaces contextuales hacia TDEE:

- `/blog/calorias-diarias-e-imc`
- `/blog/bajar-subir-peso-segun-imc`
- `/blog/sobrepeso-segun-imc-25-29-9`
- `/blog/bajo-peso-segun-imc-menor-18-5`
- `/blog/imc-menor-a-16-que-significa`
- `/blog/limitaciones-del-imc`
- `/blog/imc-masa-muscular-ejercicio`
- `/blog/peso-saludable-segun-estatura`

## Orden de publicacion recomendado

1. `01_que-es-tdee-calorias-diarias.md`
2. `02_cuantas-calorias-necesito-al-dia.md`
3. `04_como-elegir-nivel-de-actividad-tdee.md`
4. `03_calorias-de-mantenimiento.md`
5. `05_tmb-vs-tdee-diferencias.md`
6. `07_cuantas-calorias-para-bajar-de-peso.md`
7. `08_cuantas-calorias-para-subir-de-peso.md`
8. `09_por-que-mi-peso-no-cambia-si-como-mi-tdee.md`
9. `06_formula-mifflin-st-jeor.md`
10. `10_tdee-y-macros-como-se-relacionan.md`

## Criterios de aceptacion del cluster

- Cada articulo debe tener un CTA hacia la calculadora TDEE.
- Cada articulo debe tener al menos 2 enlaces internos relevantes cuando ya
  existan.
- Cada articulo debe incluir frontmatter compatible con `src/content.config.ts`.
- Cada articulo debe incluir fuentes oficiales o indicar que se verificaron
  antes de publicar.
- Los articulos de deficit, superavit o peso deben incluir aviso de salud.
- No debe haber articulos duplicados que respondan la misma intencion con
  variantes minimas de keyword.
