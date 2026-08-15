---
title: "Mortgage payment formula in Excel and Google Sheets"
seoTitle: "Calculate a mortgage in Excel or Google Sheets"
description: "Use the PMT function with a monthly rate and total payment count, then validate the result."
pubDate: 2026-07-07
locale: "en"
categoryId: "inmuebles"
slug: "mortgage-payment-excel-google-sheets"
translationKey: "mortgage-payment-excel-google-sheets"
tags: [mortgage Excel, PMT function, Google Sheets]
readTime: "5 min read"
relatedCalculator:
  label: "Mortgage calculator"
  href: "/en/real-estate/mortgage-calculator"
---

In English-language Excel and Google Sheets, calculate a level mortgage payment with:

```txt
=PMT(annual_rate/12, years*12, -loan_amount)
```

For `$2,000,000` at 9% over 20 years:

```txt
=PMT(9%/12, 20*12, -2000000)
```

The result is approximately `$17,994.52`. The negative principal represents cash received and makes the payment return as a positive outflow. Without the minus sign, the spreadsheet normally displays a negative payment.

Do not use the annual rate directly with monthly periods or enter the property price when a down payment reduces the financed amount. Small differences can result from precision, payment timing or lender-specific conventions.

Validate the result with the [mortgage calculator](/en/real-estate/mortgage-calculator).
