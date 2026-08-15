---
title: "How to calculate a monthly loan payment"
seoTitle: "How to calculate a monthly loan payment: formula and example"
description: "Calculate a fixed monthly loan payment from principal, annual interest rate and term, with a step-by-step example."
pubDate: 2026-04-22
locale: "en"
categoryId: "finanzas"
slug: "calculate-monthly-loan-payment"
translationKey: "calculate-monthly-loan-payment"
tags:
  - loan payment
  - amortization
  - loan formula
readTime: "6 min read"
relatedCalculator:
  label: "Loan calculator"
  href: "/en/finance/loan-calculator"
---

A monthly payment tells you what is due each period, but not necessarily what the loan costs. Interest, fees and insurance all belong in a complete comparison.

## Inputs you need

For the base payment, collect the principal, annual interest rate and number of monthly payments. Add any origination fee, monthly insurance or other charge separately unless it is financed in the balance.

## Fixed-payment formula

```txt
payment = P x [r(1 + r)^n] / [(1 + r)^n - 1]
```

| Variable | Meaning |
| --- | --- |
| `P` | loan principal |
| `r` | monthly rate as a decimal |
| `n` | number of monthly payments |

For a simple conversion from a 24% nominal annual rate:

```txt
monthly rate = 24% / 12 = 2% = 0.02
```

Use `0.02`, not `2`, in the equation.

## Example: $50,000 for 24 months

Assume a `$50,000` loan, a 24% annual rate and 24 payments. The estimated base payment is `$2,643.55`.

The 24 payments total approximately `$63,445.32`, of which `$13,445.32` is interest. This excludes fees and insurance. A 2% origination fee would add `$1,000`; monthly insurance of `$200` would raise the cash payment to `$2,843.55`.

## Payment vs. total cost

Two loans can have similar payments but very different total costs because of their terms and charges. Compare:

- Base and all-in monthly payment.
- Total interest and total repayment.
- Origination and administration fees.
- Mandatory insurance.
- Mexico’s official CAT disclosure, where applicable.
- Prepayment conditions.

The [loan calculator](/en/finance/loan-calculator) generates the payment and full amortization schedule. It also accepts a fee, monthly insurance and additional principal payments.

For more context, see [how loan interest is calculated](/en/blog/finance/calculate-loan-interest) and [CAT vs. interest rate](/en/blog/finance/cat-vs-interest-rate).

## Frequently asked questions

### Do I simply divide the annual rate by 12?

That is the standard conversion for a nominal annual rate used in this monthly model. A lender’s effective rate or contractual method may require a different conversion.

### Does the base payment include insurance and fees?

No. The formula covers principal and interest. Other charges must be added or incorporated according to the contract.

### Why does my lender show a different payment?

Possible reasons include insurance, taxes, financed fees, payment dates, rounding or a different rate convention. Compare the model with the formal disclosure.

## Sources

- [Banco de México CAT calculator](https://www.banxico.org.mx/CAT/Calculo_CAT.jsp)
- [CONDUSEF Personal and Payroll Loan Simulator](https://phpapps.condusef.gob.mx/condusef_personalnomina/)
