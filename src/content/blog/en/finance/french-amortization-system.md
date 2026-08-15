---
title: "The French amortization system, explained"
seoTitle: "French amortization: fixed payments, interest and principal"
description: "Understand why the French amortization method keeps payments level while the mix of interest and principal changes."
pubDate: 2026-05-09
locale: "en"
categoryId: "finanzas"
slug: "french-amortization-system"
translationKey: "french-amortization-system"
tags:
  - French amortization
  - fixed-payment loan
  - amortization
readTime: "6 min read"
relatedCalculator:
  label: "Loan calculator"
  href: "/en/finance/loan-calculator"
---

Under the French amortization system, the scheduled payment remains level while the rate and other terms remain unchanged. Every payment contains interest and principal, but their proportions shift over time.

## How the fixed payment works

```txt
payment = P x [r(1 + r)^n] / [(1 + r)^n - 1]
```

`P` is principal, `r` is the periodic rate and `n` is the number of payments. The formula sets a payment intended to reduce the balance to zero after the final period.

Interest each month is calculated from the outstanding balance:

```txt
interest = outstanding balance x monthly rate
```

The balance is highest at the beginning, so early payments contain more interest. As principal falls, interest falls and a larger share of the same payment reduces principal.

## Three-month example

For `$50,000` at 24% over 24 months, the estimated payment is `$2,643.55`:

| Month | Payment | Principal | Interest | Remaining balance |
| ---: | ---: | ---: | ---: | ---: |
| 1 | $2,643.55 | $1,643.55 | $1,000.00 | $48,356.45 |
| 2 | $2,643.55 | $1,676.43 | $967.13 | $46,680.02 |
| 3 | $2,643.55 | $1,709.95 | $933.60 | $44,970.06 |

The lender is not collecting all interest upfront; the interest portion is larger initially because the outstanding balance is larger.

## Comparison with other systems

A constant-principal method produces declining payments: principal remains level while interest falls. The French system prioritizes a predictable payment, although the balance may appear to decline slowly at first.

Not every loan follows this method exactly. Rates, payment intervals and contractual rules vary, so compare the model with the lender’s formal schedule.

The [loan calculator](/en/finance/loan-calculator) uses the fixed-payment method as its main assumption and shows how extra principal changes the term. See [how to calculate a monthly payment](/en/blog/finance/calculate-monthly-loan-payment) and [how loan interest works](/en/blog/finance/calculate-loan-interest) for the component formulas.

## Frequently asked questions

### What does “French amortization” mean?

It is a level-payment method in which the interest share falls and the principal share rises over time.

### Is it based on the outstanding balance?

Yes, in the standard form described here, periodic interest is calculated from the remaining balance.

### Do all loans use it?

No. Always review the contract and official amortization schedule.
