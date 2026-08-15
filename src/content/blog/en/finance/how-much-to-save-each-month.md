---
title: "How much should you save each month to reach a goal?"
seoTitle: "How much to save each month: formula and examples"
description: "Calculate the monthly contribution needed for a savings goal using your target, time horizon and assumed return."
pubDate: 2026-04-08
locale: "en"
categoryId: "finanzas"
slug: "how-much-to-save-each-month"
translationKey: "how-much-to-save-each-month"
tags:
  - savings goals
  - monthly saving
  - compound interest
readTime: "6 min read"
relatedCalculator:
  label: "Savings goal calculator"
  href: "/en/finance/savings-goal-calculator"
---

## Start with three inputs

Define the target amount, the number of months available and a prudent expected annual return. A compound-growth projection does not guarantee that return; it only shows the contribution required if the assumptions hold.

## Monthly savings formula

With no starting balance and contributions at the end of each month:

```txt
monthly contribution = target x i / ((1 + i)^m - 1)
```

`i` is the monthly rate as a decimal and `m` is the number of months. A simple monthly conversion of a 6% nominal annual rate is `0.06 / 12 = 0.005`.

If you already have savings:

```txt
monthly contribution =
(target - initial balance x (1 + i)^m) x i / ((1 + i)^m - 1)
```

## Example with no starting balance

To reach `$100,000` in five years at a hypothetical 6% annual rate:

```txt
target = 100000
i = 0.06 / 12 = 0.005
m = 5 x 12 = 60

monthly contribution = 1433.28
```

You would need to contribute about `$1,433.28` a month. A lower actual return would require a higher contribution or a longer term.

## Example with an initial balance

If you already have `$20,000` under the same assumptions:

```txt
monthly contribution =
(100000 - 20000 x (1 + 0.005)^60) x 0.005 / ((1 + 0.005)^60 - 1)

monthly contribution = 1046.62
```

The estimated monthly requirement falls to `$1,046.62` because the existing balance both reduces the gap and has time to grow.

## A no-return plan

For a conservative plan that assumes no return:

```txt
monthly contribution = target / months
100000 / 60 = 1666.67
```

With `$20,000` already saved:

```txt
(100000 - 20000) / 60 = 1333.33
```

This version does not rely on investment performance to reach the target.

## Adjust a future goal for inflation

If the item you plan to buy may become more expensive, first estimate its future cost:

```txt
future target = current cost x (1 + inflation rate)^years
```

Then use that future target in the contribution formula. Read [inflation and compound interest](/en/blog/finance/inflation-and-compound-interest) to distinguish nominal amounts from purchasing power.

The [savings goal calculator](/en/finance/savings-goal-calculator) can solve for either the monthly contribution or the time needed. It also provides a no-return comparison and adjusts the final payment to avoid unnecessary overfunding.

## Frequently asked questions

### How do I calculate monthly savings without an assumed return?

Subtract any existing balance from the goal, then divide the remainder by the number of months.

### Should I include inflation?

Yes, when the goal is tied to a good or service whose price may rise before you buy it.

### What if I contribute at the beginning of each month?

Each deposit has one extra month to grow, so the required contribution may be slightly lower than the end-of-month formula suggests.
