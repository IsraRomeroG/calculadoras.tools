---
title: "Compound interest formula, step by step"
seoTitle: "Compound interest formula: calculations and examples"
description: "Understand every variable in the compound interest formula and apply it to annual, monthly and recurring-contribution examples."
pubDate: 2026-03-23
locale: "en"
categoryId: "finanzas"
slug: "compound-interest-formula"
translationKey: "compound-interest-formula"
tags:
  - compound interest formula
  - future value
  - investing
readTime: "6 min read"
relatedCalculator:
  label: "Compound interest calculator"
  href: "/en/finance/compound-interest-calculator"
---

## The compound interest formula

The standard formula for the future value of an initial principal is:

```txt
FV = P x (1 + r / n) ^ (n x t)
```

| Variable | Meaning |
| --- | --- |
| `FV` | future value |
| `P` | initial principal |
| `r` | annual rate as a decimal |
| `n` | compounding periods per year |
| `t` | time in years |

For annual compounding, `n = 1`; quarterly compounding uses `n = 4`; monthly uses `n = 12`.

## Convert the rate to a decimal

Divide a percentage by 100 before placing it in the formula:

```txt
8% / 100 = 0.08
```

Using `8` instead of `0.08` is one of the most consequential mistakes in this calculation. Keep the units consistent as well: do not combine a monthly rate with a term expressed in years unless the formula converts one of them.

## Annual-compounding example

Suppose you invest `$10,000` at `8%` for five years, compounded annually:

```txt
P = 10000
r = 0.08
n = 1
t = 5

FV = 10000 x (1 + 0.08 / 1) ^ (1 x 5)
FV = 14693.28
```

The estimated ending balance is `$14,693.28`: `$10,000` of principal and `$4,693.28` of interest.

## Monthly-compounding example

With the same principal, rate and term but monthly compounding, `n = 12`:

```txt
FV = 10000 x (1 + 0.08 / 12) ^ (12 x 5)
FV = 14898.46
```

| Compounding | Ending balance |
| --- | ---: |
| Annual | $14,693.28 |
| Monthly | $14,898.46 |

Monthly compounding produces `$205.18` more because interest is added to the balance more frequently. This is a model with a constant rate, not a guaranteed investment outcome.

## Formula with recurring contributions

If a contribution is made at the end of every compounding period, a reference formula is:

```txt
FV = P x (1 + i) ^ m + C x (((1 + i) ^ m - 1) / i)
```

Here, `i = r / n`, `m = n x t`, and `C` is the contribution per period. For contributions at the beginning of each period, multiply the contribution portion by `(1 + i)`.

At a 0% rate, avoid dividing by `i`; future value is simply the initial principal plus total contributions. For irregular deposits or mismatched contribution and compounding schedules, calculate period by period or use a tool designed for those inputs.

See [compound interest with monthly contributions](/en/blog/finance/compound-interest-with-monthly-contributions) for a worked savings example.

## Common mistakes

- Entering a percentage instead of its decimal form.
- Mixing months and years in the same equation.
- Using the wrong compounding frequency.
- Treating a nominal rate as an effective rate.
- Rounding intermediate values too early.

If two products compound at different frequencies, first review [nominal vs. effective interest rates](/en/blog/finance/nominal-vs-effective-interest-rate).

## Calculate a complete scenario

The [compound interest calculator](/en/finance/compound-interest-calculator) handles the initial balance, periodic contributions, term and compounding frequency together. It also separates total contributions from the earnings produced.

## Frequently asked questions

### What does `n` mean?

It is the number of times interest is compounded each year: `1` annually, `4` quarterly or `12` monthly.

### What happens if the rate is 0%?

The original balance earns no interest. With contributions, the ending balance equals the initial principal plus all deposits.

### Does the basic formula include monthly contributions?

No. Use the annuity component shown above or calculate each contribution separately.

### Should I use an annual or monthly rate?

Use a rate that matches the periods in the equation. The standard formula starts with an annual rate and divides it by the number of compounding periods per year.
