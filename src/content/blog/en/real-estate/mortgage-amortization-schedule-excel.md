---
title: "How to build a mortgage amortization schedule in Excel"
seoTitle: "Mortgage amortization schedule in Excel, step by step"
description: "Create monthly payment, interest, principal and balance formulas in Excel or Google Sheets."
pubDate: 2026-05-25
locale: "en"
categoryId: "inmuebles"
slug: "mortgage-amortization-schedule-excel"
translationKey: "mortgage-amortization-schedule-excel"
tags: [mortgage spreadsheet, amortization schedule, Excel]
readTime: "6 min read"
relatedCalculator:
  label: "Mortgage calculator"
  href: "/en/real-estate/mortgage-calculator"
---

Store principal, annual rate and years in separate cells. Calculate the payment with `PMT(annual_rate/12, years*12, -principal)`.

For every schedule row:

```txt
interest = previous balance x annual rate / 12
principal paid = payment - interest
ending balance = previous balance - principal paid
```

For `$2,000,000` at 9% over 20 years:

| Month | Payment | Principal | Interest | Balance |
| ---: | ---: | ---: | ---: | ---: |
| 1 | $17,994.52 | $2,994.52 | $15,000.00 | $1,997,005.48 |
| 2 | $17,994.52 | $3,016.98 | $14,977.54 | $1,993,988.50 |
| 3 | $17,994.52 | $3,039.61 | $14,954.91 | $1,990,948.90 |

Keep full precision in the formulas and format cells for display rather than rounding every row. Adjust the last payment if a small residual remains. Keep insurance and fees in separate columns.

The [mortgage calculator](/en/real-estate/mortgage-calculator) can export CSV for comparison.
