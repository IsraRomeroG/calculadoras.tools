# Spec de articulo: Sistema frances de amortizacion

## Archivo objetivo

- Ruta futura: `src/content/blog/finanzas/sistema-frances-amortizacion.md`
- URL publica: `/blog/sistema-frances-amortizacion`
- Categoria: `Finanzas`
- Prioridad: P2
- Rol en el cluster: soporte tecnico de la formula de la calculadora

## Metadata sugerida

```yaml
title: "Sistema frances de amortizacion: explicacion facil"
seoTitle: "Sistema frances de amortizacion: cuota fija, intereses y capital"
description: "Entiende como funciona el sistema frances de amortizacion, por que la cuota es fija y como cambia la mezcla de capital e intereses."
pubDate: 2026-XX-XX
category: "Finanzas"
tags:
  - sistema frances
  - amortizacion
  - prestamo
readTime: "6 min"
relatedCalculator:
  label: "Calculadora de prestamo"
  href: "/finanzas/calculadora-de-prestamo"
```

## Intencion SEO

- Keyword principal: `sistema frances de amortizacion`
- Secundarias: `amortizacion francesa`, `cuota fija prestamo`, `capital e intereses`
- Intencion: comprender el metodo de cuota fija.

## Promesa del articulo

Explicar el sistema frances sin algebra innecesaria: cuota fija, intereses sobre
saldo pendiente y mayor amortizacion de capital conforme avanza el plazo.

## Estructura recomendada

1. `## Que es el sistema frances`
2. `## Por que la cuota se mantiene fija`
3. `## Por que al inicio pagas mas intereses`
4. `## Ejemplo con tabla de 3 meses`
5. `## Diferencia frente a otros sistemas`
6. `## Como lo usa la calculadora`
7. `## Preguntas frecuentes`

## Formula sugerida

Reutilizar formula de cuota mensual:

```txt
cuota = P x [r(1 + r)^n] / [(1 + r)^n - 1]
```

## Enlaces internos

- `/finanzas/calculadora-de-prestamo`
- `/blog/como-calcular-cuota-mensual-prestamo`
- `/blog/tabla-amortizacion-prestamo`
- `/blog/como-calcular-intereses-prestamo`

## FAQ sugeridas

- Que significa sistema frances?
- El sistema frances cobra intereses al inicio?
- Es lo mismo que saldos insolutos?
- Todos los prestamos usan sistema frances?

## Fuentes y notas

- Aclarar que la calculadora usa cuota fija como supuesto.
- No afirmar que todos los creditos mexicanos lo usan.

## Criterios de aceptacion

- Explica el metodo sin sobrecargar con matematicas.
- Incluye mini tabla o ejemplo.
- Enlaza a formula y tabla de amortizacion.
