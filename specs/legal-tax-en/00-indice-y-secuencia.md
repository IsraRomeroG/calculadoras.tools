# 00 - Índice y secuencia: adaptación legal y fiscal EN por mercado

## Objetivo

Sustituir las traducciones de reglas mexicanas publicadas bajo `/en/legal-tax`
por variantes de producto cuya jurisdicción, periodo, moneda, fuentes y alcance
sean explícitos. El idioma inglés no selecciona una ley ni una tabla fiscal.

El resultado debe servir a personas sujetas a las reglas de Estados Unidos,
Reino Unido, Canadá, Australia, Nueva Zelanda o Irlanda, sin perder las
calculadoras de México en inglés para quien sí está sujeto a legislación
mexicana.

## Diagnóstico que corrige este paquete

| Ruta EN actual | Cálculo real | Problema |
| --- | --- | --- |
| `/en/legal-tax/vat-calculator` | Presets de México, España y Latinoamérica; EE. UU. manual | La promesa es global y el default es México. |
| `/en/legal-tax/income-tax-calculator` | ISR México 2026 | El copy cambia, la tabla no. |
| `/en/legal-tax/net-salary-calculator` | ISR y subsidio de México | No es salario neto para un mercado anglófono y es parcial incluso para México. |
| `/en/legal-tax/proportional-vacation-calculator` | LFT México | No representa vacaciones/holiday entitlement de otro país. |
| `/en/legal-tax/termination-pay-calculator` | LFT México | Aguinaldo, prima vacacional e indemnizaciones mexicanas no son portables. |

La suite actual de localización confirma expresamente que el cálculo EN no
cambia. Este paquete reemplaza esa premisa para calculadoras YMYL: se comparte
infraestructura, no reglas jurídicas entre mercados.

## Principios no negociables

1. `locale` controla idioma y formato; `market` y `jurisdiction` seleccionan
   reglas.
2. Ninguna calculadora calcula hasta resolver país, subdivisión exigida,
   régimen y periodo.
3. No existe un preset fiscal o laboral llamado `english`, `en` o `en-US`.
4. Una variante parcial debe decir qué falta junto al resultado principal.
5. Un caso no soportado se bloquea; no cae silenciosamente a México, a una tasa
   manual ni a un promedio nacional.
6. Toda cifra normativa tiene fuente oficial, vigencia y fixture verificable.
7. México en inglés permanece disponible, pero con `Mexico` en H1, title,
   tarjeta, canonical y ruta.
8. VAT, GST/HST y sales tax son familias relacionadas, no sinónimos.
9. Los cambios de URL publicados se resuelven con 301 en `public/.htaccess`;
   no se conservan wrappers Astro legacy.

## Mercados objetivo

| `marketId` | País | Locale de formato | Moneda | Periodo principal | Prioridad |
| --- | --- | --- | --- | --- | --- |
| `us` | Estados Unidos | `en-US` | USD | año calendario | P1 fiscal; laboral por estado después |
| `gb` | Reino Unido | `en-GB` | GBP | 6 abril a 5 abril | P1 |
| `ca` | Canadá | `en-CA` | CAD | año calendario | P1 fiscal; laboral por jurisdicción |
| `au` | Australia | `en-AU` | AUD | 1 julio a 30 junio | P1 |
| `nz` | Nueva Zelanda | `en-NZ` | NZD | 1 abril a 31 marzo | P2 |
| `ie` | Irlanda | `en-IE` | EUR | año calendario | P2 |
| `mx-en` | México en inglés | `en-MX` | MXN | según regla mexicana | Preservación |

`gb` es el código técnico ISO; el copy visible usa `United Kingdom` o la
jurisdicción concreta. Las reglas laborales que no cubran Northern Ireland no
pueden rotularse como UK-wide.

## Matriz de productos objetivo

| Mercado | Impuesto indirecto | Income tax | Take-home pay | Vacaciones | Terminación |
| --- | --- | --- | --- | --- | --- |
| US | Sales tax estatal/local | Federal; estatal solo con dataset | Federal paycheck; estatal explícito | PTO contractual; reglas estatales por fases | Final pay por estado; no severance federal genérica |
| GB | UK VAT | PAYE, región fiscal | PAYE + NIC | Holiday entitlement GB | Statutory redundancy GB |
| CA | GST/HST + impuesto provincial separado | Federal + provincia/territorio | Tax + CPP/QPP + EI/QPIP | Federal o provincia/territorio | Federal o provincia/territorio |
| AU | GST | Income tax | PAYG + Medicare; extras opcionales | NES/award | NES/award, con exclusiones |
| NZ | GST | Income tax | PAYE + ACC; KiwiSaver/student loan opcionales | Holidays Act | Final pay; redundancy contractual |
| IE | VAT | Income Tax | PAYE + USC + PRSI | Annual leave | Statutory redundancy + notice |
| MX-EN | IVA | ISR México | ISR México; cobertura parcial visible | LFT México | LFT México |

## Secuencia de specs

1. [01-arquitectura-de-mercados-y-reglas.md](./01-arquitectura-de-mercados-y-reglas.md)
   separa idioma, mercado, jurisdicción y versión normativa.
2. [02-rutas-seo-y-migracion-de-mexico-en.md](./02-rutas-seo-y-migracion-de-mexico-en.md)
   preserva la semántica de URLs ya publicadas y define redirects.
3. [03-impuestos-indirectos-vat-gst-sales-tax.md](./03-impuestos-indirectos-vat-gst-sales-tax.md)
   define VAT, GST/HST y sales tax por mercado.
4. [04-income-tax-y-take-home-pay.md](./04-income-tax-y-take-home-pay.md)
   define impuesto sobre ingresos y nómina neta como productos distintos.
5. [05-vacaciones-final-pay-y-redundancy.md](./05-vacaciones-final-pay-y-redundancy.md)
   sustituye la LFT mexicana por reglas laborales compatibles con cada mercado.
6. [06-fuentes-pruebas-y-release.md](./06-fuentes-pruebas-y-release.md)
   establece gobierno de datos YMYL, fixtures, QA y publicación.

## Fases de entrega

### Fase 0 - Seguridad semántica

- Renombrar y mover las cuatro páginas mexicanas EN a rutas con `mexico`.
- Migrar la página VAT genérica a `indirect-tax-calculator`.
- Agregar los cinco redirects 301 antes de retirar los archivos legacy.
- Quitar México como default implícito; exigir selección de mercado.
- Eliminar cualquier fallback `en -> MX` del runtime.
- Mantener las nuevas variantes en `draft`.

### Fase 1 - Mercados con datasets P1

- Publicar por capacidad, no por traducción masiva.
- UK: VAT, income tax, take-home pay, holiday y redundancy con alcance visible.
- Australia: GST, income tax, take-home pay, annual leave y NES redundancy.
- Canadá: GST/HST y fiscalidad/nómina; empleo solo cuando la jurisdicción esté
  implementada.
- EE. UU.: federal income tax/paycheck y sales tax solo para estados/localidades
  con dataset oficial. No publicar una calculadora laboral federal ficticia.

### Fase 2 - NZ e Irlanda

- Nueva Zelanda: GST, income tax, PAYE, holiday pay y final pay.
- Irlanda: VAT, PAYE/USC/PRSI, annual leave y statutory redundancy.

### Fase 3 - Cobertura subnacional

- Estados de EE. UU.
- Provincias y territorios de Canadá.
- Awards australianos e instrumentos especiales.
- Northern Ireland laboral cuando tenga dataset propio verificado.
- Casos avanzados, históricos e inversos.

## Dependencias con specs existentes

Este paquete amplía, no reemplaza:

- `specs/i18n/09-calculator-migration-standard.md`;
- `specs/i18n/10-category-url-localization.md`;
- `specs/i18n/13-seo-qa-release.md`;
- `specs/adsense-plan/05-estandar-calculadoras-articulos-ymyl.md`.

Donde la spec 09 exige que EN conserve el mismo resultado que ES, este paquete
introduce una excepción explícita: eso solo aplica a una traducción del mismo
mercado, por ejemplo `es-MX` frente a `en-MX`. Una variante `en-GB` o `en-US`
usa otro rule set y debe producir resultados distintos.

## Definition of Done global

- No se seleccionan reglas desde `locale`.
- Ninguna ruta anglófona importa directamente `rules/mx`.
- Cada página muestra país, jurisdicción, periodo, moneda, cobertura y fuentes.
- Todos los presets publicados tienen fixtures y vigencia verificadas.
- Los casos no soportados quedan bloqueados con orientación oficial.
- No hay URLs legacy que respondan 200.
- Redirects, canonicals, alternates, sitemap y links son coherentes.
- El directorio no usa títulos genéricos para calculadoras de México.
- La release puede revertirse sin restaurar una fórmula de otra jurisdicción.

