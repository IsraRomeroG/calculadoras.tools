---
title: "Annual, monthly and daily loan rates: how to convert them"
seoTitle: "Annual to monthly loan rate: formulas and common errors"
description: "Convert nominal annual loan rates into simple monthly or daily rates and avoid mixing incompatible periods."
pubDate: 2026-05-14
locale: "en"
categoryId: "finanzas"
slug: "annual-monthly-daily-loan-rates"
translationKey: "annual-monthly-daily-loan-rates"
tags:
  - annual interest rate
  - monthly interest rate
  - daily interest rate
readTime: "5 min read"
relatedCalculator:
  label: "Loan calculator"
  href: "/en/finance/loan-calculator"
---

The rate period must match the calculation period. Using an annual rate as though it applied each month produces a radically incorrect payment.

The conversions below are simple nominal estimates. A contract may use a different day-count convention, an effective rate or product-specific methodology.

## Annual to monthly

```txt
simple monthly rate = nominal annual rate / 12
```

For 24% annually:

```txt
24% / 12 = 2% = 0.02 per month
```

This monthly rate can be multiplied by the outstanding balance to estimate one month’s interest.

## Annual to daily

Simple day-count conventions commonly divide by either 360 or 365:

```txt
24% / 360 = approximately 0.0667% per day
24% / 365 = approximately 0.0658% per day
```

Neither basis is universal. Use the convention specified in the contract and applicable market.

## Example on a $50,000 balance

Monthly estimate:

```txt
50000 x 0.02 = 1000
```

Daily estimate on a 360-day basis:

```txt
24% / 360 = 0.0667%
50000 x 0.000667 = approximately 33.33
```

Taxes, fees, dates and rounding may change a formal calculation.

## Common period errors

Entering a 2% monthly rate into a field that expects an annual rate understates the cost; applying 24% every month overstates it dramatically. Before calculating, confirm:

- Is the rate annual, monthly, biweekly or daily?
- Is it nominal or effective?
- Does it represent interest alone or a broader cost metric?
- Which rate period does the calculator require?

The [loan calculator](/en/finance/loan-calculator) expects an annual rate and converts it internally for monthly amortization. If you have an effective rate, review [nominal vs. effective interest rates](/en/blog/finance/nominal-vs-effective-interest-rate) before converting it.

## Frequently asked questions

### Can I divide an annual rate by 12?

Yes for a simple nominal monthly estimate. Follow the contract’s methodology for a formal calculation.

### Does a daily rate use 360 or 365 days?

It depends on the contract, product and jurisdiction. Never assume one convention applies universally.
