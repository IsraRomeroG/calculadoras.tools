# Spec: resolver calculadora faltante de costo por kilometro

## Contexto

La calculadora de consumo de gasolina enlaza a una calculadora de costo por
kilometro:

```text
/vehiculos/calculadora-de-costo-por-kilometro
```

La ruta aparece en:

- `src/pages/vehiculos/calculadora-de-consumo-de-gasolina.astro`
- `specs/calculadoras/29_Calculadora_de_Costo_por_Kilometro`

La spec de producto espera estos archivos:

```text
src/pages/vehiculos/calculadora-de-costo-por-kilometro.astro
src/lib/calculators/vehiculos/calculadora-de-costo-por-kilometro/costPerKilometer.ts
src/lib/calculators/vehiculos/calculadora-de-costo-por-kilometro/costPerKilometer.test.ts
```

Durante la auditoria no se encontraron esos archivos en `src`.

## Problema

Hay enlaces internos hacia una ruta no implementada.

Casos observados:

- CTA visible en `calculadora-de-consumo-de-gasolina.astro`.
- URL generada para pasar parametros hacia la calculadora faltante.
- Link de compartir/costo generado desde resultados de consumo.

Impacto:

- El usuario llega a 404 desde una calculadora publicada.
- La funcionalidad cruzada entre calculadoras queda rota.
- El roadmap/specs dicen que la calculadora existe o debe existir, pero el
  codigo no la implementa.

## Objetivo

Resolver la ruta faltante de una de estas dos formas:

1. Implementar la calculadora de costo por kilometro.
2. Retirar temporalmente los enlaces hacia ella hasta que se implemente.

La opcion recomendada es implementarla, porque aparece como item 29 del roadmap
de fase 1.

## Alcance recomendado

- Crear la logica pura de calculo.
- Crear pruebas unitarias.
- Crear pagina Astro publica.
- Registrar la calculadora en `src/lib/constants/calculators.ts`.
- Confirmar que el enlace desde consumo de gasolina pasa parametros utiles.
- Agregar FAQ y JSON-LD si sigue el patron de otras calculadoras.

## Fuera de alcance

- Cambiar la ruta publica de consumo de gasolina.
- Cambiar formulas de la calculadora de consumo de gasolina salvo que sea
  necesario para interoperar con costo por kilometro.
- Implementar calculadoras futuras no relacionadas.

## Cambios tecnicos esperados

1. Usar la spec existente:

   ```text
   specs/calculadoras/29_Calculadora_de_Costo_por_Kilometro
   ```

2. Crear modulo puro:

   ```text
   src/lib/calculators/vehiculos/calculadora-de-costo-por-kilometro/costPerKilometer.ts
   ```

3. Cubrir al menos estos casos:

   - Costo total de combustible.
   - Costo por kilometro.
   - Costo por persona si aplica.
   - Trayecto de ida o ida y vuelta.
   - Margen de seguridad si aplica.
   - Moneda y precio por litro/galon.
   - Parametros de URL compartidos desde consumo de gasolina.

4. Crear test:

   ```text
   src/lib/calculators/vehiculos/calculadora-de-costo-por-kilometro/costPerKilometer.test.ts
   ```

5. Crear pagina:

   ```text
   src/pages/vehiculos/calculadora-de-costo-por-kilometro.astro
   ```

6. Agregar entrada en `CALCULATORS`.

7. Confirmar que el CTA de consumo de gasolina apunta a una pagina existente.

## Criterios de aceptacion

- `/vehiculos/calculadora-de-costo-por-kilometro` se genera como pagina
  publica.
- El enlace desde `/vehiculos/calculadora-de-consumo-de-gasolina` ya no apunta
  a 404.
- Los parametros generados desde consumo de gasolina se leen correctamente en la
  nueva calculadora.
- La calculadora aparece en el directorio de la categoria `vehiculos`.
- La pagina de categoria `/vehiculos` incluye la nueva calculadora.
- `npm.cmd run test:unit:run` pasa sin errores.
- `npm.cmd run build` pasa sin errores.

## Alternativa temporal

Si la calculadora no se implementa en este ciclo, retirar o deshabilitar:

- El CTA visible hacia costo por kilometro.
- La generacion de URL hacia
  `/vehiculos/calculadora-de-costo-por-kilometro`.

Esta alternativa debe considerarse temporal y dejar una nota explicita en el
plan.

