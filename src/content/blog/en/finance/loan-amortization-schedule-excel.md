---
title: "How to build a loan amortization schedule in Excel"
seoTitle: "Loan amortization schedule in Excel: payment and interest formulas"
description: "Create an amortization schedule in Excel or Google Sheets with formulas for payment, interest, principal and balance."
pubDate: 2026-05-13
locale: "en"
categoryId: "finanzas"
slug: "loan-amortization-schedule-excel"
translationKey: "loan-amortization-schedule-excel"
tags:
  - amortization schedule
  - Excel
  - loan spreadsheet
readTime: "7 min read"
relatedCalculator:
  label: "Loan calculator"
  href: "/en/finance/loan-calculator"
---

An amortization spreadsheet shows how every payment is split between interest and principal and how the outstanding balance changes month by month.

## Set up the inputs

| Input | Example |
| --- | ---: |
| Loan principal | $50,000 |
| Annual rate | 24% |
| Term | 24 months |
| Monthly rate | 2% |

For a nominal annual rate:

```txt
monthly rate = annual rate / 12
24% / 12 = 2%
```

## Calculate the monthly payment

In English-language Excel and Google Sheets, use `PMT`:

```txt
=PMT(monthly_rate, number_of_payments, -principal)
```

The negative principal makes the returned payment positive because spreadsheets represent incoming and outgoing cash flows with opposite signs. Microsoft documents the full syntax as `PMT(rate, nper, pv, [fv], [type])`.

## Create the schedule columns

Use columns for payment number, payment, interest, principal and ending balance. The first row begins with the original loan amount; each later row begins with the previous ending balance.

```txt
interest = previous balance x monthly rate
principal = payment - interest
ending balance = previous balance - principal
```

For the first month:

```txt
interest = 50000 x 0.02 = 1000
principal = 2643.55 - 1000 = 1643.55
ending balance = 50000 - 1643.55 = 48356.45
```

| Month | Payment | Interest | Principal | Ending balance |
| ---: | ---: | ---: | ---: | ---: |
| 1 | $2,643.55 | $1,000.00 | $1,643.55 | $48,356.45 |
| 2 | $2,643.55 | $967.13 | $1,676.43 | $46,680.02 |
| 3 | $2,643.55 | $933.60 | $1,709.95 | $44,970.06 |

## Common spreadsheet errors

- Using the annual rate where a monthly rate is required.
- Entering `24` instead of `24%` or `0.24`.
- Mixing monthly payments with a rate for another period.
- Rounding stored values in every row rather than formatting the display.
- Failing to adjust the last payment for a small residual balance.
- Including insurance in the interest column.

Keep recurring insurance in its own column. If the final balance is a few cents from zero, retain more internal precision and set the last payment to the exact remaining amount plus interest.

The [loan calculator](/en/finance/loan-calculator) can validate the result and export its schedule as CSV. See [how to read an amortization schedule](/en/blog/finance/loan-amortization-schedule) and the [French amortization system](/en/blog/finance/french-amortization-system) for the underlying logic.

## Frequently asked questions

### Which Excel function calculates the payment?

Use `PMT` in an English-language installation. Function names can be localized in other language settings.

### Why does my schedule not reach exactly zero?

Usually because displayed amounts were rounded. Keep full precision in formulas and adjust the final payment.

## Sources

- [Microsoft Support: PMT function](https://support.microsoft.com/en-us/office/pmt-function-0214da64-9a63-4996-bc20-214433fa6441)
- [Google Docs Editors Help: PMT](https://support.google.com/docs/answer/3093185?hl=en)
