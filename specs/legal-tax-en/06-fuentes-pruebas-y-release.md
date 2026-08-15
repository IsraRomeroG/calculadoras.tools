# 06 - Fuentes, pruebas, QA y release de reglas YMYL

## Objetivo

Impedir que una calculadora legal/fiscal se publique solo porque compila o está
traducida. Cada variante necesita evidencia normativa, fixtures, vigencia,
revisión humana y controles de rutas.

## Política de fuentes

### Jerarquía

1. Texto legal o publicación oficial de la autoridad competente.
2. Guía o calculadora oficial de la misma autoridad.
3. Ejemplos oficiales para fixtures.
4. Fuente secundaria solo para orientación editorial, nunca para fijar una tasa
   o derecho cuando exista fuente primaria.

No usar snippets de buscador, blogs, firmas, agregadores ni otras calculadoras
como fuente del runtime.

### Registro obligatorio

Cada cifra/regla guarda:

```ts
interface SourceAuditRecord {
  sourceId: string;
  authority: string;
  title: string;
  canonicalUrl: string;
  jurisdictionCode: string;
  appliesToRuleIds: string[];
  sourceVersion?: string;
  publishedAt?: string;
  effectiveFrom?: string;
  effectiveTo?: string;
  accessedAt: string;
  reviewedBy: string;
  reviewNotes: string;
}
```

Una URL general de autoridad no basta si la cifra proviene de una tabla o PDF
específico.

## Inventario inicial de autoridades

| Mercado | Fiscal | Laboral |
| --- | --- | --- |
| US | IRS; autoridades estatales/locales; USAGov como directorio | US Department of Labor; autoridades estatales |
| GB | HMRC/GOV.UK | GOV.UK, ACAS cuando corresponda; autoridad NI separada |
| CA | CRA y autoridades provinciales | Labour Program federal y ministries provinciales/territoriales |
| AU | ATO | Fair Work Ombudsman/Commission y autoridades estatales |
| NZ | Inland Revenue | Employment New Zealand/MBIE |
| IE | Revenue; Department of Social Protection | Workplace Relations Commission; gov.ie |
| MX-EN | SAT/CONASAMI | Cámara de Diputados, PROFEDET |

## Ciclo de vida de datasets

```txt
draft -> independently-reviewed -> current -> historical
                         |             |
                         v             v
                     suspended      expired
```

- `draft`: no calcula en producción.
- `independently-reviewed`: reglas y fuentes revisadas por una segunda persona.
- `current`: puede respaldar una variante publicada.
- `historical`: seleccionable conscientemente para periodos pasados.
- `expired`: no se usa para fechas fuera de cobertura.
- `suspended`: se retira por duda material; la variante muestra estado bloqueado.

`reviewDueAt` es obligatorio, pero llegar a la fecha no inventa una nueva tasa.
La variante pasa a `blocked` o conserva solo periodos históricos hasta revisión.

## Checklist de incorporación de un rule set

```txt
[ ] País, jurisdicción, régimen y periodo exactos
[ ] Moneda y unidades
[ ] Fuente primaria por regla material
[ ] Fecha efectiva y, si existe, fecha final
[ ] Política de redondeo
[ ] Inputs obligatorios y casos fuera de alcance
[ ] Componentes incluidos y excluidos
[ ] Al menos un fixture oficial o una derivación documentada independiente
[ ] Límites de cada tramo y condición probados
[ ] Segunda revisión registrada
[ ] Copy de cobertura y disclaimer revisados
[ ] reviewDueAt y owner
```

## Estrategia de pruebas

### 1. Primitivas compartidas

- Tramos marginales sin huecos ni superposición.
- Cuota fija/excedente cuando aplique.
- Add/extract de impuesto indirecto.
- Caps, floors, phase-outs y credits.
- Fechas civiles, aniversarios y periodos fiscales no calendario.
- Redondeo por componente y resultado.

### 2. Contract tests de rule sets

Todos los datasets ejecutan una suite común:

- envelope completo;
- fuentes HTTPS oficiales;
- fechas ISO y coherentes;
- status compatible con el reloj inyectado;
- cada `sourceRef` existe;
- fixtures apuntan al mismo periodo;
- no importan mercados distintos;
- moneda/jurisdicción compatibles;
- no hay periodos solapados.

### 3. Fixtures oficiales

Cada fixture registra inputs, expected outputs, tolerancia, URL, sección/página y
fecha de acceso. Si una autoridad ofrece calculadora oficial sin caso textual,
guardar la metodología de captura y revisar términos antes de automatizarla.

No hacer tests contra servicios externos en runtime/CI. Las reglas son locales y
deterministas.

### 4. Boundary tests

Por tramo, cap, antigüedad y fecha efectiva:

```txt
just below
exactly at boundary
just above
first effective day
last effective day
first unsupported day
```

### 5. Cross-market isolation

- Builds/import graphs sin referencias `mx` desde US/GB/CA/AU/NZ/IE.
- Mismos inputs con mercados distintos producen `ruleSetId` distinto.
- Cambiar locale dentro de un mercado conserva números.
- Cambiar mercado invalida números, copy, fuente, moneda e historial.
- Ningún error cae a `MEXICO_*`.

### 6. UI, accesibilidad y privacidad

- Navegación completa con teclado y lector de pantalla.
- `aria-live` anuncia un resultado, no cada pulsación.
- Errores de jurisdicción se asocian al selector.
- 320, 360, 390, 768, 1024 y 1440 px.
- Zoom 200% e importes largos.
- No enviar ingresos, fechas laborales, filing status, tax code, provincia,
  salario u oferta en analítica.
- Copy/share/export incluye mercado y rule-set version, pero no persiste datos
  sin acción explícita.

## Tests de rutas y SEO

- Manifest contiene solo variantes publicadas.
- Draft/review/suspended no responde 200 ni aparece en sitemap.
- Canonical coincide con mercado y producto.
- Alternates regionales solo entre variantes publicadas comparables.
- `x-default` apunta al hub de selección cuando exista.
- Los cinco redirects de la spec 02 son 301 directos y sin cadena.
- Sources antiguas no tienen archivo Astro.
- Links internos apuntan al target final.
- Title/H1 nombran país y, cuando sea necesario, alcance `federal`, `GB`,
  provincia o estado.
- JSON-LD no declara una cobertura más amplia que el dataset.

## Copy review YMYL

Bloquear publicación si aparece lenguaje como:

- `you are legally owed` sin que el motor pueda determinar elegibilidad;
- `official result`;
- `all taxes included` cuando la cobertura es parcial;
- `US VAT`;
- `UK` para una regla laboral solo GB;
- `Canada` para una regla federal aplicada a empleo provincial;
- `refund` basado solo en una diferencia de withholding;
- `severance` automático por seleccionar dismissal.

Preferir:

- `estimate`;
- `based on the selected jurisdiction and rule period`;
- `not included`;
- `eligibility not determined`;
- `check the official authority or a qualified professional`.

## Gate de publicación por variante

```txt
[ ] Rule set current e independently reviewed
[ ] Fixtures y boundary tests verdes
[ ] Cobertura visible en hero, formulario y resultado
[ ] Casos unsupported bloqueados
[ ] Fuentes y fecha visibles
[ ] Metadata, canonical y alternates correctos
[ ] Directorio y related links solo a rutas publicadas
[ ] Redirects verificados si hubo move
[ ] QA funcional y accesible
[ ] Revisión editorial/legal de lenguaje
[ ] Owner y fecha de próxima revisión
```

El flip `published: true` es el último cambio de una release atómica.

## Comandos de validación

Validación local permitida:

```powershell
npm.cmd run test:unit:run
```

No ejecutar localmente durante esta implementación salvo solicitud explícita:

```powershell
npm run dev
npm run build
```

CI/deploy sí debe compilar el sitio, enumerar el artefacto y comparar rutas,
canonicals, redirects, alternates, links y sitemap contra el manifest.

## Monitoreo

Por release registrar durante una ventana definida:

- 404 y hits a redirects legacy;
- canonicals inesperados;
- errores de cálculo/validación por `reasonCode`, sin inputs sensibles;
- selección de casos unsupported por mercado;
- indexación y rich results;
- fecha de revisión próxima de cada dataset.

No usar métricas de conversión para mantener publicada una regla vencida.

## Rollback

1. Suspender únicamente la variante/regla afectada.
2. Retirar links, alternates y sitemap en la misma release.
3. Mantener rutas históricas correctas cuando sea seguro.
4. Si la página debe desaparecer, decidir 301 solo hacia un equivalente real;
   de lo contrario 404/410.
5. Nunca restaurar el fallback mexicano como rollback de otro mercado.
6. Conservar redirects de URLs ya movidas para evitar cadenas y regresiones.

## Criterios de aceptación

- Ningún preset se publica solo por tener traducción completa.
- Todas las cifras materiales tienen trazabilidad primaria.
- Tests cubren ejemplos oficiales y límites.
- La release controla rutas además de TypeScript.
- Un dataset dudoso puede suspenderse sin afectar otros países.
- El proceso de rollback no mezcla jurisdicciones.
