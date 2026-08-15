---
title: "How to extract VAT from a tax-inclusive price"
seoTitle: "How to remove VAT from a tax-inclusive total"
description: "Find the net price and VAT component inside a gross total without incorrectly subtracting the headline rate."
pubDate: 2026-03-18
locale: "en"
categoryId: "legal-impuestos"
slug: "extract-vat-from-inclusive-price"
translationKey: "extract-vat-from-inclusive-price"
tags: [VAT included, reverse VAT, net price]
readTime: "4 min read"
relatedCalculator:
  label: "VAT calculator"
  href: "/en/legal-tax/indirect-tax-calculator"
---

To extract VAT, treat the displayed total as 100% plus the tax rate:

```txt
net price = gross price / (1 + VAT rate)
VAT amount = gross price - net price
```

For a total of 1,160 at 16%:

```txt
net = 1160 / 1.16 = 1000
VAT = 1160 - 1000 = 160
```

Subtracting 16% of 1,160 would give 974.40, which is wrong because 16% was originally applied to 1,000, not to the tax-inclusive total.

| Rate | Divide gross price by |
| ---: | ---: |
| 5% | 1.05 |
| 10% | 1.10 |
| 16% | 1.16 |
| 19% | 1.19 |
| 21% | 1.21 |

Confirm that the price truly includes VAT and that the rate applies to that item. Use the [VAT calculator](/en/legal-tax/indirect-tax-calculator) for precision and consult a tax professional for filing or classification questions.
