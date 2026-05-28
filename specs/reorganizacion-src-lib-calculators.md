# Procedimiento para reorganizar `src/lib/calculators`

## Objetivo

Reorganizar la logica pura de calculadoras por categoria y slug de calculadora,
manteniendo las mismas rutas publicas, los mismos exports y el mismo
comportamiento en paginas Astro y pruebas unitarias.

Ejemplos de destino:

```text
src/lib/calculators/finanzas/calculadora-de-interes-compuesto/compoundInterest.ts
src/lib/calculators/finanzas/calculadora-de-interes-compuesto/compoundInterest.test.ts

src/lib/calculators/salud/calculadora-de-calorias-diarias-tdee/tdee.ts
src/lib/calculators/salud/calculadora-de-calorias-diarias-tdee/tdee.test.ts
```

## Hallazgos del repo

- `tsconfig.json` ya define `@lib/*`, por lo que no hace falta cambiar aliases
  para importar modulos mas profundos.
- `vitest.config.ts` usa `include: ["src/**/*.test.ts"]`, asi que las pruebas
  seguiran corriendo despues de moverlas a subcarpetas.
- Las paginas Astro importan calculadoras con `@lib/calculators/<modulo>`.
  Algunas paginas tienen el import duplicado: uno en frontmatter y otro dentro
  de `<script>`.
- La unica dependencia interna detectada entre calculadoras es
  `src/lib/calculators/deficit.ts`, que importa desde `./tdee`.
- No se deben mover las paginas publicas en este cambio. Las URL existentes
  deben permanecer iguales.

## Convenciones propuestas

- Directorio base: `src/lib/calculators/<categoria>/<slug-calculadora>/`.
- La categoria debe salir de la categoria publica o de
  `src/lib/constants/calculators.ts`, normalizada como slug.
- El slug de calculadora debe coincidir con el `id` o el slug de la URL
  canonica.
- Mantener los nombres actuales de archivos (`tdee.ts`, `compoundInterest.ts`,
  etc.) para reducir el cambio y preservar claridad en diffs.
- Mantener cada `*.test.ts` junto al archivo que prueba.
- Usar imports por alias en codigo de produccion:
  `@lib/calculators/<categoria>/<slug>/<modulo>`.
- Mantener imports relativos dentro de tests colocados:
  `from "./<modulo>"`.
- Para dependencias entre calculadoras, preferir alias en lugar de rutas
  relativas largas.

## Mapa de migracion inicial

| Modulo actual | Destino propuesto |
| --- | --- |
| `age.ts` / `age.test.ts` | `src/lib/calculators/fecha-y-tiempo/calculadora-de-edad/` |
| `bmi.ts` / `bmi.test.ts` | `src/lib/calculators/salud/calculadora-de-imc/` |
| `compoundInterest.ts` / `compoundInterest.test.ts` | `src/lib/calculators/finanzas/calculadora-de-interes-compuesto/` |
| `deficit.ts` / `deficit.test.ts` | `src/lib/calculators/salud/calculadora-deficit-calorico/` |
| `loan.ts` / `loan.test.ts` | `src/lib/calculators/finanzas/calculadora-de-prestamo/` |
| `macros.ts` / `macros.test.ts` | `src/lib/calculators/salud/calculadora-de-macros/` |
| `mortgage.ts` / `mortgage.test.ts` | `src/lib/calculators/inmuebles/calculadora-de-hipoteca/` |
| `percentage.ts` / `percentage.test.ts` | `src/lib/calculators/matematicas/calculadora-de-porcentajes/` |
| `ruleOfThree.ts` / `ruleOfThree.test.ts` | `src/lib/calculators/matematicas/calculadora-de-regla-de-tres/` |
| `tdee.ts` / `tdee.test.ts` | `src/lib/calculators/salud/calculadora-de-calorias-diarias-tdee/` |
| `vat.ts` / `vat.test.ts` | `src/lib/calculators/legal-impuestos/calculadora-de-iva/` |

## Procedimiento recomendado

1. Crear una rama de trabajo dedicada.

   ```powershell
   git switch -c chore/reorganizar-calculators
   ```

2. Ejecutar una verificacion base antes de mover archivos.

   ```powershell
   npm run test:unit:run
   npm run build
   ```

3. Guardar el inventario real de imports antes del cambio.

   ```powershell
   rg -n "@lib/calculators/" src
   rg -n "from " src/lib/calculators
   rg -n "src/lib/calculators|@lib/calculators" README.md specs
   ```

4. Crear las carpetas destino por categoria y calculadora.

   ```powershell
   New-Item -ItemType Directory -Force -Path src/lib/calculators/finanzas/calculadora-de-interes-compuesto
   New-Item -ItemType Directory -Force -Path src/lib/calculators/salud/calculadora-de-calorias-diarias-tdee
   ```

   Repetir para el resto del mapa de migracion.

5. Mover archivos con `git mv`, no con copiar/pegar, para preservar historial.

   ```powershell
   git mv src/lib/calculators/compoundInterest.ts src/lib/calculators/finanzas/calculadora-de-interes-compuesto/compoundInterest.ts
   git mv src/lib/calculators/compoundInterest.test.ts src/lib/calculators/finanzas/calculadora-de-interes-compuesto/compoundInterest.test.ts

   git mv src/lib/calculators/tdee.ts src/lib/calculators/salud/calculadora-de-calorias-diarias-tdee/tdee.ts
   git mv src/lib/calculators/tdee.test.ts src/lib/calculators/salud/calculadora-de-calorias-diarias-tdee/tdee.test.ts
   ```

6. Actualizar imports de paginas Astro. Ejemplos:

   ```ts
   // Antes
   import { COMPOUNDING_FREQUENCIES } from "@lib/calculators/compoundInterest";

   // Despues
   import { COMPOUNDING_FREQUENCIES } from "@lib/calculators/finanzas/calculadora-de-interes-compuesto/compoundInterest";
   ```

   Revisar tanto frontmatter como scripts del lado cliente en cada `.astro`.

7. Actualizar dependencias internas entre calculadoras.

   Para `deficit.ts`, cambiar el import de TDEE despues de mover ambos modulos:

   ```ts
   // Antes
   } from "./tdee";

   // Despues
   } from "@lib/calculators/salud/calculadora-de-calorias-diarias-tdee/tdee";
   ```

8. Mantener imports de tests como relativos al archivo probado.

   ```ts
   } from "./tdee";
   ```

   Como el test queda en la misma carpeta que `tdee.ts`, no requiere cambios.

9. Actualizar documentacion que apunte a rutas antiguas activas:

   - `README.md`, seccion de calculadoras.
   - Specs activas en `specs/calculadoras/`.
   - Specs de contenido que mencionen rutas de implementacion.

   Las specs archivadas pueden dejarse como historicas, salvo que se quiera
   evitar cualquier referencia antigua en busquedas globales.

10. Ejecutar busquedas de control.

   ```powershell
   rg -n "@lib/calculators/(age|bmi|compoundInterest|deficit|loan|macros|mortgage|percentage|ruleOfThree|tdee|vat)" src
   rg -n "src/lib/calculators/(age|bmi|compoundInterest|deficit|loan|macros|mortgage|percentage|ruleOfThree|tdee|vat)" README.md specs/calculadoras specs/content
   ```

   El primer comando no deberia devolver imports antiguos en `src`.
   El segundo puede devolver referencias archivadas si se decide conservarlas.

11. Ejecutar validacion completa.

   ```powershell
   npm run test:unit:run
   npm run build
   ```

12. Hacer smoke test local de las paginas afectadas.

   ```powershell
   npm run dev
   ```

   Revisar al menos:

   - `/matematicas/calculadora-de-porcentajes`
   - `/matematicas/calculadora-de-regla-de-tres`
   - `/legal-impuestos/calculadora-de-iva`
   - `/finanzas/calculadora-de-interes-compuesto`
   - `/finanzas/calculadora-de-prestamo`
   - `/inmuebles/calculadora-de-hipoteca`
   - `/salud/calculadora-de-imc`
   - `/salud/calculadora-de-calorias-diarias-tdee`
   - `/salud/calculadora-de-macros`
   - `/calculadora-deficit-calorico`
   - `/calculadora-de-edad`

13. Revisar el diff final para confirmar que el cambio es solo de rutas e
    imports, sin modificaciones de formula o comportamiento.

## Estrategia alternativa para reducir riesgo

Si el cambio se hace en varias PRs, se pueden crear temporalmente archivos
compatibles en las rutas antiguas que reexporten desde la ruta nueva:

```ts
export * from "@lib/calculators/finanzas/calculadora-de-interes-compuesto/compoundInterest";
```

Esta estrategia permite migrar consumidores por partes, pero mantiene archivos
en la raiz de `src/lib/calculators`. Por eso conviene usarla solo si se necesita
partir el trabajo; la ultima PR debe eliminar esos shims.

## Criterios de aceptacion

- No queda logica de calculadora ni tests en la raiz de `src/lib/calculators`.
- Cada calculadora tiene su carpeta por categoria y slug.
- `npm run test:unit:run` pasa.
- `npm run build` pasa.
- Las URL publicas no cambian.
- Los imports antiguos `@lib/calculators/<modulo>` ya no aparecen en `src`.
- La documentacion activa describe la nueva estructura.
