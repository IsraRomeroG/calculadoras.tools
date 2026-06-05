# Calculator Logic Category Structure

## Goal

Move calculator logic from a flat directory:

```text
src/lib/calculators/<module>.ts
src/lib/calculators/<module>.test.ts
```

to a category and calculator folder structure:

```text
src/lib/calculators/<category>/<calculator-name>/<module>.ts
src/lib/calculators/<category>/<calculator-name>/<module>.test.ts
```

The migration must preserve existing public URLs, calculator behavior, unit tests,
Astro page behavior, and build output.

## Current Findings

- `src/lib/calculators` currently contains flat `*.ts` calculator modules and
  colocated `*.test.ts` files.
- `tsconfig.json` already maps `@lib/*` to `src/lib/*`; no alias change is
  required for deeper imports.
- `vitest.config.ts` includes `src/**/*.test.ts`; nested calculator tests will
  still be discovered after the move.
- Vitest coverage includes `src/lib/**/*.ts`; nested calculator modules will
  still be included.
- Astro pages import calculator modules with `@lib/calculators/<module>`.
  Several pages import the same module once in frontmatter and once inside the
  browser script, so both places must be updated.
- The calculator directory metadata lives in
  `src/lib/constants/calculators.ts`. Use `categorySlug` and `id` from that file
  as the source of truth for destination paths.
- Public route pages under `src/pages/<category>/<calculator>.astro` do not need
  to move. This change is only for pure calculator logic.
- Use canonical category slugs, not legacy slugs. In particular, use
  `fecha-tiempo`, not `fecha-y-tiempo`.

## Recommended Convention

- Directory format: `src/lib/calculators/<categorySlug>/<calculatorId>/`.
- Keep the current module filenames in the first migration, for example
  `compoundInterest.ts`, `date-difference.ts`, and `ruleOfThree.ts`.
- Keep each test next to the module it covers.
- Keep test imports relative, for example `from "./loan"`.
- Use absolute `@lib` imports for cross-calculator dependencies to avoid long
  relative paths between categories.
- Do not change exported function, type, or constant names during this
  migration.

## Migration Map

| Current files                                     | Destination folder                                                |
| ------------------------------------------------- | ----------------------------------------------------------------- |
| `age.ts`, `age.test.ts`                           | `src/lib/calculators/fecha-tiempo/calculadora-de-edad/`           |
| `bmi.ts`, `bmi.test.ts`                           | `src/lib/calculators/salud/calculadora-de-imc/`                   |
| `compoundInterest.ts`, `compoundInterest.test.ts` | `src/lib/calculators/finanzas/calculadora-de-interes-compuesto/`  |
| `date-difference.ts`, `date-difference.test.ts`   | `src/lib/calculators/fecha-tiempo/diferencia-entre-fechas/`       |
| `deficit.ts`, `deficit.test.ts`                   | `src/lib/calculators/salud/calculadora-deficit-calorico/`         |
| `loan.ts`, `loan.test.ts`                         | `src/lib/calculators/finanzas/calculadora-de-prestamo/`           |
| `macros.ts`, `macros.test.ts`                     | `src/lib/calculators/salud/calculadora-de-macros/`                |
| `mortgage.ts`, `mortgage.test.ts`                 | `src/lib/calculators/inmuebles/calculadora-de-hipoteca/`          |
| `ovulation.ts`, `ovulation.test.ts`               | `src/lib/calculators/salud/calculadora-de-ovulacion/`             |
| `percentage.ts`, `percentage.test.ts`             | `src/lib/calculators/matematicas/calculadora-de-porcentajes/`     |
| `pregnancyDueDate.ts`, `pregnancyDueDate.test.ts` | `src/lib/calculators/salud/fecha-probable-de-parto/`              |
| `ruleOfThree.ts`, `ruleOfThree.test.ts`           | `src/lib/calculators/matematicas/calculadora-de-regla-de-tres/`   |
| `tdee.ts`, `tdee.test.ts`                         | `src/lib/calculators/salud/calculadora-de-calorias-diarias-tdee/` |
| `temperature.ts`, `temperature.test.ts`           | `src/lib/calculators/conversores/conversor-de-temperatura/`       |
| `vat.ts`, `vat.test.ts`                           | `src/lib/calculators/legal-impuestos/calculadora-de-iva/`         |
| `weight.ts`, `weight.test.ts`                     | `src/lib/calculators/conversores/conversor-de-peso/`              |

## Import Updates Required

Update every `@lib/calculators/<module>` import in `src/pages`.

| Page                                                         | Old import                          | New import                                                                    |
| ------------------------------------------------------------ | ----------------------------------- | ----------------------------------------------------------------------------- |
| `src/pages/fecha-tiempo/calculadora-de-edad.astro`           | `@lib/calculators/age`              | `@lib/calculators/fecha-tiempo/calculadora-de-edad/age`                       |
| `src/pages/fecha-tiempo/diferencia-entre-fechas.astro`       | `@lib/calculators/date-difference`  | `@lib/calculators/fecha-tiempo/diferencia-entre-fechas/date-difference`       |
| `src/pages/conversores/conversor-de-temperatura.astro`       | `@lib/calculators/temperature`      | `@lib/calculators/conversores/conversor-de-temperatura/temperature`           |
| `src/pages/conversores/conversor-de-peso.astro`              | `@lib/calculators/weight`           | `@lib/calculators/conversores/conversor-de-peso/weight`                       |
| `src/pages/finanzas/calculadora-de-interes-compuesto.astro`  | `@lib/calculators/compoundInterest` | `@lib/calculators/finanzas/calculadora-de-interes-compuesto/compoundInterest` |
| `src/pages/finanzas/calculadora-de-prestamo.astro`           | `@lib/calculators/loan`             | `@lib/calculators/finanzas/calculadora-de-prestamo/loan`                      |
| `src/pages/inmuebles/calculadora-de-hipoteca.astro`          | `@lib/calculators/mortgage`         | `@lib/calculators/inmuebles/calculadora-de-hipoteca/mortgage`                 |
| `src/pages/legal-impuestos/calculadora-de-iva.astro`         | `@lib/calculators/vat`              | `@lib/calculators/legal-impuestos/calculadora-de-iva/vat`                     |
| `src/pages/matematicas/calculadora-de-porcentajes.astro`     | `@lib/calculators/percentage`       | `@lib/calculators/matematicas/calculadora-de-porcentajes/percentage`          |
| `src/pages/matematicas/calculadora-de-regla-de-tres.astro`   | `@lib/calculators/ruleOfThree`      | `@lib/calculators/matematicas/calculadora-de-regla-de-tres/ruleOfThree`       |
| `src/pages/salud/calculadora-de-calorias-diarias-tdee.astro` | `@lib/calculators/tdee`             | `@lib/calculators/salud/calculadora-de-calorias-diarias-tdee/tdee`            |
| `src/pages/salud/calculadora-de-imc.astro`                   | `@lib/calculators/bmi`              | `@lib/calculators/salud/calculadora-de-imc/bmi`                               |
| `src/pages/salud/calculadora-de-macros.astro`                | `@lib/calculators/macros`           | `@lib/calculators/salud/calculadora-de-macros/macros`                         |
| `src/pages/salud/calculadora-deficit-calorico.astro`         | `@lib/calculators/deficit`          | `@lib/calculators/salud/calculadora-deficit-calorico/deficit`                 |
| `src/pages/salud/calculadora-de-ovulacion.astro`             | `@lib/calculators/ovulation`        | `@lib/calculators/salud/calculadora-de-ovulacion/ovulation`                   |
| `src/pages/salud/fecha-probable-de-parto.astro`              | `@lib/calculators/pregnancyDueDate` | `@lib/calculators/salud/fecha-probable-de-parto/pregnancyDueDate`             |

## Cross-Calculator Imports Required

After files are moved, update these internal imports:

```ts
// src/lib/calculators/salud/calculadora-deficit-calorico/deficit.ts
} from "@lib/calculators/salud/calculadora-de-calorias-diarias-tdee/tdee";
```

```ts
// src/lib/calculators/salud/calculadora-de-ovulacion/ovulation.ts
} from "@lib/calculators/fecha-tiempo/diferencia-entre-fechas/date-difference";
export type { PlainDateParts } from "@lib/calculators/fecha-tiempo/diferencia-entre-fechas/date-difference";
```

```ts
// src/lib/calculators/salud/fecha-probable-de-parto/pregnancyDueDate.ts
} from "@lib/calculators/fecha-tiempo/diferencia-entre-fechas/date-difference";
export { todayInLocalTimeZone } from "@lib/calculators/fecha-tiempo/diferencia-entre-fechas/date-difference";
```

The colocated test imports such as `from "./deficit"` and `from "./tdee"`
should remain unchanged if the test files move with their modules.

## Step-by-Step Plan

1. Capture the current references.

   ```powershell
   rg -n "@lib/calculators" src
   rg -n "from \"\\./|from './|export .* from \"\\./|export .* from '\\./" src/lib/calculators
   rg -n "src/lib/calculators|@lib/calculators" specs README.md
   ```

2. Create the destination folders from the migration map.

3. Move each module and test pair with `git mv`.

   ```powershell
   git mv src/lib/calculators/loan.ts src/lib/calculators/finanzas/calculadora-de-prestamo/loan.ts
   git mv src/lib/calculators/loan.test.ts src/lib/calculators/finanzas/calculadora-de-prestamo/loan.test.ts
   ```

4. Update all Astro imports listed in the import update table. Check both
   frontmatter imports and imports inside `<script>` blocks.

5. Update the three cross-calculator dependencies listed above.

6. Leave `tsconfig.json`, `vitest.config.ts`, `astro.config.mjs`, and
   `src/lib/constants/calculators.ts` unchanged unless a validation command
   proves otherwise.

7. Update active documentation/spec references that describe implementation
   paths. Archived calculator specs can remain historical unless the team wants
   global searches to stop showing old paths.

8. Search for stale source imports.

    ```powershell
    rg -n "@lib/calculators/(age|bmi|compoundInterest|date-difference|deficit|loan|macros|mortgage|ovulation|percentage|pregnancyDueDate|ruleOfThree|tdee|temperature|vat|weight)" src
    ```

    This command should return no `src` imports after the migration.

9. Confirm no calculator logic remains in the root of `src/lib/calculators`.

    ```powershell
    rg --files src/lib/calculators
    ```

    Expected result: only nested files under category and calculator folders.

10. Run full validation manually after the migration.

11. Start the dev server and smoke test affected pages.

    Visit each existing public calculator route. The route URLs should be
    unchanged.

12. Review the final diff. It should be limited to file moves, import path
    changes, and documentation/spec updates. Formula logic should not change.

## Optional Compatibility Strategy

If the migration must be split across several PRs, add temporary shim files at
the old root paths:

```ts
export * from "@lib/calculators/finanzas/calculadora-de-prestamo/loan";
```

This allows old imports to keep working while consumers are migrated
incrementally. Remove all shims before considering the restructuring complete,
because keeping them would leave active calculator files in the root folder.

## Acceptance Criteria

- Every current calculator module and test pair is under
  `src/lib/calculators/<category>/<calculator-name>/`.
- No calculator module or calculator test remains directly under
  `src/lib/calculators`.
- Public calculator routes remain unchanged.
- All imports in `src` point to the new nested calculator paths.
- Internal dependencies between calculators use the new paths.
- Unit tests pass.
- Active docs/specs no longer describe the old flat structure as the target
  implementation.
