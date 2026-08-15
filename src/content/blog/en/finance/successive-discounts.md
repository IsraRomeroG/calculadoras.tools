---
title: "Successive discounts: why 20% + 10% is not 30%"
seoTitle: "Successive discounts: formula for stacked sale prices"
description: "Calculate stacked discounts in sequence and convert them into one equivalent effective discount."
pubDate: 2026-04-18
locale: "en"
categoryId: "finanzas"
slug: "successive-discounts"
translationKey: "successive-discounts"
tags:
  - stacked discounts
  - sale prices
  - percentages
readTime: "5 min read"
relatedCalculator:
  label: "Percentage calculator"
  href: "/en/math/percentage-calculator"
---

“20% off, plus an extra 10%” does not mean 30% off. Each discount applies to the price left by the previous one.

## Formula for stacked discounts

Convert each percentage into the fraction of the price that remains:

```txt
final price = original price x (1 - d1 / 100) x (1 - d2 / 100)
```

Add another multiplier for every additional discount.

For a `$1,000` item discounted first by 20% and then 10%:

```txt
1000 x 0.80 = 800
800 x 0.90 = 720
```

The final price is `$720`, so the saving is `$280`.

## Equivalent effective discount

```txt
effective discount = 1 - (final price / original price)
1 - (720 / 1000) = 0.28 = 28%
```

A single 28% discount produces the same result as successive discounts of 20% and 10%.

## Common combinations

| Original price | Successive discounts | Final price | Effective discount |
| ---: | ---: | ---: | ---: |
| $500 | 10% + 10% | $405 | 19% |
| $1,000 | 20% + 10% | $720 | 28% |
| $2,000 | 30% + 20% | $1,120 | 44% |
| $800 | 50% + 10% | $360 | 55% |

With positive discounts, the effective rate is lower than their simple sum. For example, 30% plus 20% leaves `0.70 x 0.80 = 0.56` of the original price, for an effective discount of 44%.

## Compare promotions carefully

Check whether a coupon applies before or after another markdown, whether it has a maximum value and whether taxes, shipping or financing are excluded. The amount finally payable is more informative than the promotional wording.

For one markdown, see [how to calculate a discount](/en/blog/finance/how-to-calculate-a-discount). In the [percentage calculator](/en/math/percentage-calculator), subtract each percentage in sequence using the previous result as the next base.

## Frequently asked questions

### Why are 20% and 10% not 30% together?

Because the second 10% is taken from 80% of the original price, not from the original price itself.

### Is one 30% discount better than 20% plus 10%?

Yes. On `$1,000`, 30% leaves `$700`; 20% followed by 10% leaves `$720`.
